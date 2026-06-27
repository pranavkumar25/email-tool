/**
 * Admin access is granted by a server-only allowlist (ADMIN_EMAILS), not a DB
 * role — sign-in stays Google OAuth, and admin status can never be set by a
 * client. An admin may "view as" another workspace; the target user id is held
 * in an httpOnly cookie that is only ever honored when the signed-in user is an
 * admin (see getAuthContext in auth-helpers).
 */

/** Comma-separated emails, e.g. ADMIN_EMAILS="pk@pranavkumar.co,other@x.com". */
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

/** httpOnly cookie holding the user id an admin is currently viewing as. */
export const IMPERSONATION_COOKIE = "ibr_view_as";
