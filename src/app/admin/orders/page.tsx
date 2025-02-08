import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import { PageHeader } from "../_components/PageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Minus, MoreVertical } from "lucide-react";
import { DeleteDropDownItem } from "./_components/OrderActions";

/**
 * Fetches the order data from the database.
 *
 * Retrieves orders along with the product name, user email, price paid, and any associated discount codes.
 *
 */
function getOrders() {
  return db.order.findMany({
    select: {
      id: true,
      pricePaidInCents: true,
      product: { select: { name: true } },
      user: { select: { email: true } },
      discountCode: { select: { code: true } },
    },
    orderBy: { createAt: "desc" },
  });
}

/**
 * Page component for displaying all sales/orders.
 *
 * Includes a header and a table listing all sales transactions.
 *
 */
export default function OrderPage() {
  return (
    <div className="" style={{ marginLeft: "2rem" }}>
      <PageHeader>Sales</PageHeader>
      <OrderTable />
    </div>
  );
}

/**
 * Component to display the orders table.
 *
 * Fetches the orders and displays them in a table format, showing product, customer, price, coupon, and actions.
 *
 */
async function OrderTable() {
  const orders = await getOrders();

  if (orders.length === 0) return <p className="text-white">No sales found</p>;

  return (
    <div className="" style={{ marginLeft: "2rem" }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Product</TableHead>
            <TableHead className="text-white">Customer</TableHead>
            <TableHead className="text-white">Price Paid</TableHead>
            <TableHead className="text-white">Coupon</TableHead>
            <TableHead className="w-0">
              <span className="se-only text-white">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="text-white">{order.product.name}</TableCell>
              <TableCell className="text-white">{order.user.email}</TableCell>
              <TableCell className="text-white">
                {formatCurrency(order.pricePaidInCents / 100)}
              </TableCell>
              <TableCell className="text-white">
                {order.discountCode == null ? (
                  <Minus />
                ) : (
                  order.discountCode.code
                )}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-white">
                    <MoreVertical />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DeleteDropDownItem id={order.id} />
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
