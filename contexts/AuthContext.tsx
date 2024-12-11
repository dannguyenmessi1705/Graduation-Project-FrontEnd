"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getJwtToken, setJwtToken, clearJwtToken } from "@/lib/auth";
import { LoginModal } from "@/components/modal/LoginModal";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  handleExpiredToken: () => void;
  register: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const token = getJwtToken();
    setIsLoggedIn(!!token);
  }, []);

  const login = (token: string) => {
    setJwtToken(token);
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const register = (token: string) => {
    setJwtToken(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    clearJwtToken();
    setIsLoggedIn(false);
  };

  const handleExpiredToken = () => {
    logout();
    setShowLoginModal(true);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, handleExpiredToken, register }}
    >
      {children}
      {showLoginModal && (
        <LoginModal isOpen={true} onClose={() => setShowLoginModal(false)} />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
