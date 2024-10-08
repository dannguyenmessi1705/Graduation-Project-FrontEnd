import { type UserInfo } from "./UserInfo";

export type KeyCloakContextModel = {
  initialized: boolean;
  authenticated: boolean;
  user: UserInfo | null;
  logout: () => void;
};
