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
import db from "@/db/db";
import { CheckCircle2, MoreVertical, Plus, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ActiveToggleDropdownItem,
  DeleteDropdownItem,
} from "./_components/ProductActions";

/**
 * AdminProductsPage Component
 *
 * This component renders the product management page in the admin dashboard.
 * It allows admins to view, add, edit, download, activate/deactivate, and delete products.
 *
 */
export default function AdminProductsPage() {
  return (
    <>
      <div
        className="flex justify-between items-center gap-4"
        style={{ marginLeft: "2rem" }}
      >
        <PageHeader>Products</PageHeader>
        <Button
          asChild
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-lg font-semibold flex items-center gap-2 shadow-lg transition-all duration-200"
        >
          <Link href="/admin/products/new">
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  );
}

/**
 * Fetches the list of products from the database.
 *
 */
async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  });

  if (products.length === 0) {
    return <p className="text-white">No products found</p>;
  }

  return (
    <div className="" style={{ marginLeft: "2rem" }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">
              <span className="sr-only">Available For Purchase</span>
            </TableHead>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Price</TableHead>
            <TableHead className="text-white">Orders</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.isAvailableForPurchase ? (
                  <>
                    <span className="sr-only">Available</span>
                    <CheckCircle2 className="text-green-500" />
                  </>
                ) : (
                  <>
                    <span className="sr-only">Unavailable</span>
                    <XCircle className="stroke-destructive" />
                  </>
                )}
              </TableCell>
              <TableCell className="text-white">{product.name}</TableCell>
              <TableCell className="text-white">
                {formatCurrency(product.priceInCents / 100)}
              </TableCell>
              <TableCell className="text-white">
                {formatNumber(product._count.orders)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-white">
                    <MoreVertical />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <a
                        download
                        href={`/admin/products/${product.id}/download`}
                      >
                        Download
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <ActiveToggleDropdownItem
                      id={product.id}
                      isAvailableForPurchase={product.isAvailableForPurchase}
                    />
                    <DropdownMenuSeparator />
                    <DeleteDropdownItem
                      id={product.id}
                      disabled={product._count.orders > 0}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
