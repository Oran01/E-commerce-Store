import { Loader2 } from "lucide-react";

/**
 * AdminLoading component displays a loading spinner while admin-related data is being loaded.
 *
 */
export default function AdminLoading() {
  return (
    <div className="flex justify-center">
      <Loader2 className="size-24 animate-spin" style={{ color: "#A3A3A3" }} />
    </div>
  );
}
