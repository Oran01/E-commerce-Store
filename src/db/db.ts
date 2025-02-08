import { PrismaClient } from "@prisma/client";

/**
 * Initializes a new PrismaClient instance.
 * This function ensures a single instance of PrismaClient is used throughout the application.
 */
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  // eslint-disable-next-line no-var
  /**
   * Global variable declaration for Prisma client to maintain a single instance in development mode.
   */
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

/**
 * Database client instance.
 * Uses a global instance in development to avoid multiple connections,
 * and a new instance in production.
 */
const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

// Ensures a single instance of PrismaClient is used in development mode
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
