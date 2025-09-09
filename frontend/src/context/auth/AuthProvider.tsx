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
    // Check if there is saved auth data in localStorage
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

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
        body: {
          email,
          password,
        },
      });

      const token = result.data.token;
      const user = result.data.user;

      setToken(token);
      setUser(user);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.log("Login error:", error);
      throw error;
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, isLoading, login }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
