import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { useFetch } from "../../hooks/useFetch";
import type { User } from "../../types/userTypes";
import { AuthContext } from "./AuthContext";

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { doFetch } = useFetch();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    // To-Do: user should be fetched from backend to ensure latest data
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await doFetch(`/user/login`, {
        method: "POST",
        body: { email, password },
      });

      const token = result.data.token;
      const user = result.data.user;

      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return {
        success: true,
        message: "Login successful",
        userRole: user.role,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
