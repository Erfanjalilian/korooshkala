export const AUTH_STORAGE_KEY = "jk_authenticated_user";

export type StoredAuthUser = {
  id: string;
  phone: string;
  name: string;
};

export function getStoredAuthUser() {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value) as StoredAuthUser;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function storeAuthUser(user: StoredAuthUser) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredAuthUser() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}