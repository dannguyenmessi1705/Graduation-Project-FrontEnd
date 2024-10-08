"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { initKeycloak, keycloak, logout } from "../config/keycloak";
import { type UserInfo } from "@/model/UserInfo";
import { type KeyCloakContextModel } from "@/model/KeyCloakContextModel";

const KeyCloakContext = createContext<KeyCloakContextModel>({
  initialized: false,
  authenticated: false,
  user: null,
  logout: () => {},
});

export const KeycloakProvider = ({ children }: { children: ReactNode }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      initKeycloak()
        .then((auth) => {
          setAuthenticated(auth);
          if (keycloak && auth) {
            setUser({
              userId: keycloak?.profile?.id ?? null,
              firstName: keycloak?.profile?.firstName ?? null,
              lastName: keycloak?.profile?.lastName ?? null,
              username: keycloak?.profile?.username ?? null,
              email: keycloak?.profile?.email ?? null,
            });
          }
          setInitialized(true);
        })
        .catch((err) => console.error("Failed to initialize Keycloak", err));
    }
  }, []);

  return (
    <KeyCloakContext.Provider
      value={{ initialized, authenticated, user, logout }}
    >
      {children}
    </KeyCloakContext.Provider>
  );
};

export const useKeycloak: () => KeyCloakContextModel = () => {
  const context: KeyCloakContextModel = useContext(KeyCloakContext);
  if (!context) {
    throw new Error("useKeycloak must be used within a KeyCloakProvider");
  }
  return context;
};
