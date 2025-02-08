import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { PageHeader } from "../_components/PageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { DeleteDropDownItem } from "./_components/UserActions";

/**
 * Retrieves the list of users along with their orders from the database.
 *
 */
function getUsers() {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      orders: { select: { pricePaidInCents: true } },
    },
    orderBy: { createAt: "desc" },
  });
}

/**
 * UsersPage component - Displays a table of customers with their orders and total value spent.
 *
 */
export default function UsersPage() {
  return (
    <div className="" style={{ marginLeft: "2rem" }}>
      <PageHeader>Customers</PageHeader>
      <UsersTable />
    </div>
  );
}

/**
 * UsersTable component - Fetches and displays user data in a table format.
 * If no users are found, it displays a message.
 *
 */
async function UsersTable() {
  const users = await getUsers();

  if (users.length === 0)
    return <p className="text-white">No customers found</p>;

  return (
    <div className="" style={{ marginLeft: "2rem" }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Email</TableHead>
            <TableHead className="text-white">Orders</TableHead>
            <TableHead className="text-white">Value</TableHead>
            <TableHead className="w-0">
              <span className="se-only text-white">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="text-white">{user.email}</TableCell>
              <TableCell className="text-white">
                {formatNumber(user.orders.length)}
              </TableCell>
              <TableCell className="text-white">
                {formatCurrency(
                  user.orders.reduce((sum, o) => o.pricePaidInCents + sum, 0) /
                    100
                )}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-white">
                    <MoreVertical />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DeleteDropDownItem id={user.id} />
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
