"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteDiscountCode,
  toggleDiscountCodeActive,
} from "@/app/admin/_actions/discountCodes";

/**
 * A dropdown menu item component to toggle the active status of a discount code.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique ID of the discount code.
 * @param {boolean} props.isActive - Whether the discount code is currently active.
 */
export function ActiveToggleDropdownItem({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleDiscountCodeActive(id, !isActive);
          router.refresh();
        });
      }}
    >
      {isActive ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}

/**
 * A dropdown menu item component to delete a discount code.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique ID of the discount code.
 * @param {boolean} props.disabled - Whether the delete action should be disabled.
 */
export function DeleteDropdownItem({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteDiscountCode(id);
          router.refresh();
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
