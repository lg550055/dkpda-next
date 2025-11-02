/**
 * Returns the JWT stored in an httpOnly cookie.
 * Returns null when executed on the server (document is undefined).
 */
export const getAuthToken = (): string | null => {
  // Server-side → no document → return null
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
};

export const setAuthToken = (token: string) => {
  // httpOnly + Secure + SameSite = best practice
  document.cookie = `token=${token}; path=/; max-age=3600; samesite=strict; secure`;
};

export const clearAuthToken = () => {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
};