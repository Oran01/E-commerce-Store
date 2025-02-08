/**
 * Checks if the provided password matches the stored hashed password.
 *
 * @param {string} password - The plaintext password to verify.
 * @param {string} hashedPassword - The stored hashed password to compare against.
 */
export async function isValidPassword(
  password: string,
  hashedPassword: string
) {
  return (await hashPassword(password)) === hashedPassword;
}

/**
 * Hashes a password using the SHA-512 algorithm.
 *
 * @param {string} password - The plaintext password to hash.
 */
async function hashPassword(password: string) {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );
  return Buffer.from(arrayBuffer).toString("base64");
}
