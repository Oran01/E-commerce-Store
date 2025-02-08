"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { deleteOrder } from "../../_actions/order";
import { useRouter } from "next/navigation";

/**
 * Delete dropdown item component for removing an order.
 *
 * This component provides a dropdown menu item that allows the user to delete an order.
 * It uses a transition to handle the async delete operation and refreshes the page after deletion.
 *
 * @param {Object} props - The component props.
 * @param {string} props.id - The ID of the order to be deleted.
 */
export function DeleteDropDownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteOrder(id);
          router.refresh();
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
}
