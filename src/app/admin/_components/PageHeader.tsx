import { ReactNode } from "react";

/**
 * A reusable component for rendering a page header.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be displayed as the header.
 */
export function PageHeader({ children }: { children: ReactNode }) {
  return <h1 className="text-4xl mb-4 text-white">{children}</h1>;
}
