import { useEffect, useState } from "react";

import { fetchMe, login } from "../api/api";
import type { User } from "../types/allTypes";
import { AuthContext } from "./Auth_Context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token"),
  );

  const [isAuthChecked, setIsAuthChecked] = useState(
    () => localStorage.getItem("access_token") === null,
  );

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!token) {
      return;
    }

    fetchMe(token)
      .then((currentUser) => {
        setUser(currentUser);
      })

      .catch(() => {
        localStorage.removeItem("access_token");
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsAuthChecked(true);
      });
  }, [token]);

  async function loginUser(email: string, password: string) {
    const tokenResponse = await login({
      email,
      password,
    });

    localStorage.setItem("access_token", tokenResponse.access_token);

    setToken(tokenResponse.access_token);

    const currentUser = await fetchMe(tokenResponse.access_token);

    setUser(currentUser);
  }

  function logout() {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    function handleUnauthorized() {
      logout();
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthChecked,
        isAuthenticated,
        isAdmin,
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
