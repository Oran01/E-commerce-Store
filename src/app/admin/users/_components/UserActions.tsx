"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { deleteUser } from "../../_actions/users";
import { useRouter } from "next/navigation";

/**
 * DeleteDropDownItem Component
 *
 * This component renders a dropdown menu item that allows an admin to delete a user.
 * When clicked, it initiates an asynchronous transition to delete the user from the database
 * and refresh the router to reflect the changes.
 *
 * @param {Object} props - Component props.
 * @param {string} props.id - The ID of the user to be deleted.
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
          await deleteUser(id);
          router.refresh();
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
}
