import { NextRequest, NextResponse } from "next/server";
import { isValidPassword } from "./lib/isValidPassword";

/**
 * Middleware to authenticate requests to the `/admin` routes.
 * If authentication fails, it returns a `401 Unauthorized` response.
 *
 * @param {NextRequest} req - The incoming request object.
 */
export async function middleware(req: NextRequest) {
  if ((await isAuthenticated(req)) === false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }
}

/**
 * Checks if the request is authenticated using Basic Authentication.
 *
 * @param {NextRequest} req - The incoming request object.
 */
async function isAuthenticated(req: NextRequest) {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (authHeader == null) return false;

  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  return (
    username === process.env.ADMIN_USERNAME &&
    (await isValidPassword(
      password,
      process.env.HASHED_ADMIN_PASSWORD as string
    ))
  );
}

/**
 * Configuration object to apply the middleware only to `/admin` routes.
 */
export const config = {
  matcher: "/admin/:path*",
};
