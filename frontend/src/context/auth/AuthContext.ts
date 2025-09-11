import { createContext, useContext } from "react";
import type { User } from "../../types/userTypes";

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string; userRole?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => Promise.resolve({ success: false }),
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);
