"use server";

import db from "@/db/db";
import { notFound } from "next/navigation";

/**
 * Deletes an order from the database.
 *
 * @async
 * @function deleteOrder
 * @param {string} id - The order ID to be deleted.
 * @throws {Error} If the order does not exist.
 */
export async function deleteOrder(id: string) {
  const order = await db.order.delete({
    where: { id },
  });

  if (order == null) return notFound();

  return order;
}
