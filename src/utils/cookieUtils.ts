/**
 * Helper function to get a cookie by name
 * @param name The name of the cookie to get
 * @returns The cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null; // Handle server-side rendering
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

/**
 * Sets a cookie with the given name, value and expiration days
 * @param name The name of the cookie
 * @param value The value of the cookie
 * @param days The number of days until the cookie expires
 */
export function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === 'undefined') return; // Handle server-side rendering
  
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

/**
 * Deletes a cookie by setting its expiration date in the past
 * @param name The name of the cookie to delete
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return; // Handle server-side rendering
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}
