import { createContext, useContext, useEffect, useState } from "react";
import api from "./axios";

const AuthContext = createContext();

const parseJwtPayload = (token) => {
  try {
    const payloadPart = token?.split(".")?.[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore auth on page refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && !isTokenExpired(token)) {
      const payload = parseJwtPayload(token) || {};

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser({
            ...parsedUser,
            token,
            role: parsedUser.role || payload.role || null,
            id: parsedUser.id || payload.id || null,
          });
        } catch {
          setUser({
            token,
            role: payload.role || null,
            id: payload.id || null,
          });
        }
      } else {
        setUser({ token, role: payload.role || null, id: payload.id || null });
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    setLoading(false);
  }, []);

  const login = (data) => {
    const token = data?.token;
    if (!token) return;

    const payload = parseJwtPayload(token) || {};
    const normalizedUser = {
      ...data,
      token,
      role: data?.role || payload.role || null,
      id: data?.id || payload.id || null,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = async () => {
    try {
      // Record logout in attendance
      await api.post("/attendance/logout").catch(() => {
        // Silently fail if logout endpoint fails
      });
    } catch (error) {
      console.error("Failed to record logout:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = !!user?.token && !isTokenExpired(user.token);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
