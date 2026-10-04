export type UserRole = "user" | "admin";

export type User = {
  id: number;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
};

export type RegisterData = {
  email: string;
  password: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
