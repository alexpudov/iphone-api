import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/Auth_Context";

export function AuthRequire({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthChecked } = useAuth();

  if (!isAuthChecked) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
