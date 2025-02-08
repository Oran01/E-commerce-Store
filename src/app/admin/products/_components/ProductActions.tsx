"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import {
  deleteProduct,
  toggleProductAvailability,
} from "../../_actions/products";
import { useRouter } from "next/navigation";

/**
 * Dropdown menu item to toggle the availability of a product.
 *
 * Allows the user to activate or deactivate a product for purchase.
 *
 * @param {Object} props - The component props.
 * @param {string} props.id - The product ID.
 * @param {boolean} props.isAvailableForPurchase - Whether the product is currently available for purchase.
 */
export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase,
}: {
  id: string;
  isAvailableForPurchase: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleProductAvailability(id, !isAvailableForPurchase);
          router.refresh();
        });
      }}
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}

/**
 * Dropdown menu item to delete a product.
 *
 * Allows the user to delete a product from the database.
 *
 * @param {Object} props - The component props.
 * @param {string} props.id - The product ID.
 * @param {boolean} props.disabled - Whether the delete action is disabled.
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
          await deleteProduct(id);
          router.refresh();
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
