import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  role?: string;
  exp?: number;
  _id?: string;
}

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  token?: string;
  setToken?: (token: string | undefined) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  token: undefined,
  setToken: () => {},
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Always prefer _id, fallback to id
      return { ...parsed, _id: parsed._id || parsed.id };
    }
    return null;
  });
  const [token, setToken] = useState<string | undefined>(() => localStorage.getItem("token") || undefined);
  const navigate = useNavigate();

  const isAuthenticated = !!user && !!user._id;

  const logout = () => {
    setUser(null);
    setToken(undefined);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  // Save user/token to localStorage when changed
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, token, setToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
