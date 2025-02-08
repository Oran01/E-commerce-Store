import Nav, { NavLink } from "@/components/Nav";

/**
 * Enables dynamic rendering for this layout.
 * This ensures that the page is always server-rendered dynamically,
 * rather than using cached static generation.
 */
export const dynamic = "force-dynamic";

/**
 * The main layout component that wraps all pages.
 * It includes the navigation bar and a container for page content.
 *
 * @param {Object} props - The component properties.
 * @param {React.ReactNode} props.children - The page content to be displayed inside the layout.
 * @returns {JSX.Element} - The layout structure including navigation and content.
 */
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">My Orders</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}
