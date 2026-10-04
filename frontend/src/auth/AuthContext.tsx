import { useEffect, useState } from "react";

import { fetchMe, login, logoutRequest } from "../api/authApi";
import type { User } from "../types/auth";
import { AuthContext } from "./Auth_Context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchMe()
      .then((currentUser) => {
        setUser(currentUser);
      })

      .catch((error) => {
        console.error("Failed to check authentication:", error);
        setUser(null);
      })
      .finally(() => {
        setIsAuthChecked(true);
      });
  }, []);

  async function loginUser(email: string, password: string) {
    await login({
      email,
      password,
    });

    const currentUser = await fetchMe();

    if (!currentUser) {
      throw new Error("Failed to authenticate user");
    }

    setUser(currentUser);
  }

  async function logout() {
    await logoutRequest();

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
