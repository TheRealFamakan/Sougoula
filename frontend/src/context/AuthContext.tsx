import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthResponse, User } from "@/types";
import { AUTH_STORAGE_KEY } from "@/services/apiClient";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: AuthResponse) => void;
  logout: () => void;
  setUser: (user: User) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthResponse;
        setUserState(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const persist = (data: AuthResponse | null) => {
    if (!data) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  };

  const login = (payload: AuthResponse) => {
    setUserState(payload.user);
    setToken(payload.token);
    persist(payload);
  };

  const logout = () => {
    setUserState(null);
    setToken(null);
    persist(null);
  };

  const setUser = (updated: User) => {
    setUserState(updated);
    if (token) {
      persist({ token, user: updated });
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login,
      logout,
      setUser,
      isAdmin: user?.role === "ADMIN",
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

