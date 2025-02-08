import Nav, { NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic";

/**
 * AdminLayout component provides a layout for the admin panel,
 * including navigation links to different admin sections.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be displayed inside the layout.
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
        <NavLink href="/admin/discount-codes">Coupons</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}
