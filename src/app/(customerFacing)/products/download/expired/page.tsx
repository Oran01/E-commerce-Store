import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Displays a message indicating that the download link has expired.
 * Provides an option to retrieve a new link by navigating to the orders page.
 *
 * @returns {JSX.Element} The expired download page component.
 */
export default function Expired() {
  return (
    <>
      <h1 className="text-4xl mb-4">Download link expired</h1>
      <Button asChild size="lg">
        <Link href="/orders">Get New Link</Link>
      </Button>
    </>
  );
}
