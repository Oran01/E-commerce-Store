"use server";

import db from "@/db/db";
import { notFound } from "next/navigation";

/**
 * Deletes a user from the database by their ID.
 *
 * @async
 * @function deleteUser
 * @param {string} id - The unique identifier of the user to be deleted.
 * @throws {Error} If the user does not exist.
 */
export async function deleteUser(id: string) {
  const user = await db.user.delete({
    where: { id },
  });

  if (user == null) return notFound();

  return user;
}
