import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  authLoginFn,
  authLogoutFn,
  authMeFn,
  authRegisterFn,
  authUpdateProfileFn,
} from "@/server/auth/auth.server-fns";
import { AUTH_STORAGE_KEY } from "@/server/auth/constants";

export type AuthUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  token: string | null;
  setSession: (token: string, user: AuthUser) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  updateProfile: (
    firstName: string,
    lastName: string
  ) => Promise<
    { ok: true; user: AuthUser } | { ok: false; error: string }
  >;
};

const AuthContext = createContext<AuthState | null>(null);

function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(AUTH_STORAGE_KEY);
}

function writeStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.sessionStorage.setItem(AUTH_STORAGE_KEY, token);
  else window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const me = useServerFn(authMeFn);
  const logoutFn = useServerFn(authLogoutFn);

  const refresh = useCallback(async () => {
    const t = readStoredToken();
    setToken(t);
    if (!t) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await me({ headers: { Authorization: `Bearer ${t}` } });
      setUser(res.user);
      if (!res.user) {
        writeStoredToken(null);
        setToken(null);
      }
    } catch {
      setUser(null);
      writeStoredToken(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [me]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setSession = useCallback((newToken: string, u: AuthUser) => {
    writeStoredToken(newToken);
    setToken(newToken);
    setUser(u);
  }, []);

  const login = useServerFn(authLoginFn);
  const register = useServerFn(authRegisterFn);
  const updateProfileFn = useServerFn(authUpdateProfileFn);

  const loginWithCredentials = useCallback(
    async (email: string, password: string) => {
      const res = await login({ data: { email, password } });
      if (!res.ok) return res;
      setSession(res.token, res.user);
      return { ok: true as const };
    },
    [login, setSession]
  );

  const registerWithCredentials = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ) => {
      const res = await register({
        data: { email, password, firstName, lastName },
      });
      if (!res.ok) return res;
      setSession(res.token, res.user);
      return { ok: true as const };
    },
    [register, setSession]
  );

  const updateProfile = useCallback(
    async (firstName: string, lastName: string) => {
      const t = readStoredToken();
      if (!t) return { ok: false as const, error: "Non autenticato." };
      const res = await updateProfileFn({
        data: { firstName, lastName },
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) return res;
      setUser(res.user);
      return { ok: true as const, user: res.user };
    },
    [updateProfileFn]
  );

  const logout = useCallback(async () => {
    const t = readStoredToken();
    if (t) {
      try {
        await logoutFn({ headers: { Authorization: `Bearer ${t}` } });
      } catch {
        /* ignore */
      }
    }
    writeStoredToken(null);
    setToken(null);
    setUser(null);
  }, [logoutFn]);

  const value = useMemo(
    () => ({
      user,
      loading,
      token,
      setSession,
      refresh,
      logout,
      login: loginWithCredentials,
      register: registerWithCredentials,
      updateProfile,
    }),
    [
      user,
      loading,
      token,
      setSession,
      refresh,
      logout,
      loginWithCredentials,
      registerWithCredentials,
      updateProfile,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve essere usato dentro AuthProvider");
  return ctx;
}
