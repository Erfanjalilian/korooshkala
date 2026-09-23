import { useEffect, useState } from "react";

export const AUTH_STORAGE_KEY = "jk_authenticated_user";
export const AUTH_STORAGE_EVENT = "jk-auth-changed";

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
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
}

export function clearStoredAuthUser() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
}

export function useStoredAuthUser() {
  const [user, setUser] = useState<StoredAuthUser | null>(null);

  useEffect(() => {
    const updateUser = () => setUser(getStoredAuthUser());
    updateUser();
    window.addEventListener(AUTH_STORAGE_EVENT, updateUser);
    window.addEventListener("storage", updateUser);
    return () => {
      window.removeEventListener(AUTH_STORAGE_EVENT, updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  return user;
}