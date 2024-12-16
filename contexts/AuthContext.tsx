"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getJwtToken, setJwtToken, clearJwtToken } from "@/lib/auth";
import { LoginModal } from "@/components/modal/LoginModal";
import { getUserDetails } from "@/lib/api";
import { type UserDetails } from "@/model/UserData";
import { connectWebSocket, disconnectWebSocket } from "@/lib/websocket";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  handleExpiredToken: () => void;
  register: (token: string) => void;
  userDetails: UserDetails | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const fetchUserDetails = async (token: string) => {
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const userId = tokenPayload.sub || tokenPayload.userId;

      const res = await getUserDetails(userId);
      setUserDetails(res.data);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    const token = getJwtToken();
    if (token) {
      setIsLoggedIn(true);
      connectWebSocket();
      fetchUserDetails(token);
    }
  }, []);

  const login = (token: string) => {
    setJwtToken(token);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    fetchUserDetails(token);
  };

  const register = (token: string) => {
    setJwtToken(token);
    setIsLoggedIn(true);
    connectWebSocket();
    fetchUserDetails(token);
  };

  const logout = () => {
    clearJwtToken();
    setIsLoggedIn(false);
    setUserDetails(null);
    disconnectWebSocket();
  };

  const handleExpiredToken = () => {
    logout();
    setShowLoginModal(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        handleExpiredToken,
        register,
        userDetails,
      }}
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
