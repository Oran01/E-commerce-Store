import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  Globe,
  Infinity,
  Minus,
  MoreVertical,
  Plus,
  XCircle,
} from "lucide-react";
import {
  formatDateTime,
  formatDiscountCode,
  formatNumber,
} from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import db from "@/db/db";
import { Prisma } from "@prisma/client";
import {
  ActiveToggleDropdownItem,
  DeleteDropdownItem,
} from "@/app/admin/discount-codes/_components/DiscountCodeActions";

const WHERE_EXPIRED: Prisma.DiscountCodeWhereInput = {
  OR: [
    { limit: { not: null, lte: db.discountCode.fields.uses } },
    { expiresAt: { not: null, lte: new Date() } },
  ],
};

const SELECT_FIELDS: Prisma.DiscountCodeSelect = {
  id: true,
  allProducts: true,
  code: true,
  discountAmount: true,
  discountType: true,
  expiresAt: true,
  limit: true,
  uses: true,
  isActive: true,
  products: { select: { name: true } },
  _count: { select: { orders: true } },
};

/**
 * Fetches expired discount codes from the database.
 *
 */
function getExpiredDiscountCodes() {
  return db.discountCode.findMany({
    select: SELECT_FIELDS,
    where: WHERE_EXPIRED,
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Fetches unexpired discount codes from the database.
 *
 */
function getUnexpiredDiscountCodes() {
  return db.discountCode.findMany({
    select: SELECT_FIELDS,
    where: { NOT: WHERE_EXPIRED },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Renders the Discount Codes Admin Page.
 *
 * Fetches both expired and unexpired discount codes and displays them in a table.
 * Provides an option to add new discount codes.
 *
 */
export default async function DiscountCodesPage() {
  const [expiredDiscountCodes, unexpiredDiscountCodes] = await Promise.all([
    getExpiredDiscountCodes(),
    getUnexpiredDiscountCodes(),
  ]);
  return (
    <div className="" style={{ marginLeft: "2rem" }}>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Coupons</PageHeader>
        <Button
          asChild
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-lg font-semibold flex items-center gap-2 shadow-lg transition-all duration-200"
        >
          <Link href="/admin/discount-codes/new">
            <Plus className="w-5 h-5" />
            Add Coupon
          </Link>
        </Button>
      </div>
      <DiscountCodesTable
        discountCodes={unexpiredDiscountCodes}
        canDeactivate
      />

      <div className="mt-8">
        <h2 className="text-xl font-bold text-white">Expired Coupons</h2>
        <DiscountCodesTable discountCodes={expiredDiscountCodes} isInactive />
      </div>
    </div>
  );
}

/**
 * Props for the DiscountCodesTable component.
 *
 * @typedef {Object} DiscountCodesTableProps
 * @property {Array} discountCodes - List of discount codes to display.
 * @property {boolean} [isInactive] - Whether the table is displaying inactive (expired) discount codes.
 * @property {boolean} [canDeactivate] - Whether discount codes can be deactivated.
 */
type DiscountCodesTableProps = {
  discountCodes: Awaited<ReturnType<typeof getUnexpiredDiscountCodes>>;
  isInactive?: boolean;
  canDeactivate?: boolean;
};

/**
 * Renders a table of discount codes.
 *
 * @param {DiscountCodesTableProps} props - Component props.
 */
function DiscountCodesTable({
  discountCodes,
  isInactive = false,
  canDeactivate = false,
}: DiscountCodesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Is Active</span>
          </TableHead>
          <TableHead className="text-white">Code</TableHead>
          <TableHead className="text-white">Discount</TableHead>
          <TableHead className="text-white">Expires</TableHead>
          <TableHead className="text-white">Remaining Uses</TableHead>
          <TableHead className="text-white">Orders</TableHead>
          <TableHead className="text-white">Products</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {discountCodes.map((discountCode) => (
          <TableRow key={discountCode.id}>
            <TableCell>
              {discountCode.isActive && !isInactive ? (
                <>
                  <span className="sr-only">Active</span>
                  <CheckCircle2 className="text-green-500" />
                </>
              ) : (
                <>
                  <span className="sr-only">Inactive</span>
                  <XCircle className="stroke-destructive" />
                </>
              )}
            </TableCell>
            <TableCell className="text-white">{discountCode.code}</TableCell>
            <TableCell className="text-white">
              {formatDiscountCode(discountCode)}
            </TableCell>
            <TableCell className="text-white">
              {discountCode.expiresAt == null ? (
                <Minus />
              ) : (
                formatDateTime(discountCode.expiresAt)
              )}
            </TableCell>
            <TableCell className="text-white">
              {discountCode.limit == null ? (
                <Infinity />
              ) : (
                formatNumber(discountCode.limit - discountCode.uses)
              )}
            </TableCell>
            <TableCell className="text-white">
              {formatNumber(discountCode._count.orders)}
            </TableCell>
            <TableCell className="text-white">
              {discountCode.allProducts ? (
                <Globe />
              ) : (
                discountCode.products.map((p) => p.name).join(", ")
              )}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-white">
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {canDeactivate && (
                    <>
                      <ActiveToggleDropdownItem
                        id={discountCode.id}
                        isActive={discountCode.isActive}
                      />
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {
                    <DeleteDropdownItem
                      id={discountCode.id}
                      disabled={discountCode._count.orders > 0}
                    />
                  }
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
