import Keycloak from "keycloak-js";

const keycloakConfig: Keycloak.KeycloakConfig = {
  url: "http://localhost:7081",
  realm: "master",
  clientId: "dan",
};

let keycloak: Keycloak | null;

if (typeof window !== "undefined") {
  keycloak = new Keycloak(keycloakConfig);
}

let isInitialized: boolean = false; // Make sure keycloak is initialized only once

export const initKeycloak: () => Promise<boolean> = () => {
  if (!isInitialized && keycloak) {
    isInitialized = true;
    return keycloak
      .init({
        onLoad: "login-required",
        checkLoginIframe: false,
      })
      .then((authenticated) => authenticated)
      .catch((err) => {
        isInitialized = false;
        console.error("Failed to initialize Keycloak", err);
        throw err;
      });
  }
  return Promise.resolve(keycloak?.authenticated ?? false);
};

export const logout: () => void = () => {
  if (keycloak) {
    keycloak.logout();
  }
};

export const getToken: () => Promise<string | null> = async () => {
  if (keycloak) {
    if (keycloak.isTokenExpired()) {
      try {
        await keycloak.updateToken(30);
      } catch (err) {
        console.error("Failed to refresh token", err);
        keycloak.logout();
        return null;
      }
    }
    return keycloak.token ?? null;
  }
  return null;
};

export { keycloak };
