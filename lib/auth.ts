let jwtToken: string | null = null;

export function setJwtToken(token: string) {
  jwtToken = token;
  localStorage.setItem("jwtToken", token);
}

export function getJwtToken(): string | null {
  if (!jwtToken) {
    jwtToken = localStorage.getItem("jwtToken");
  }
  return jwtToken;
}

export function clearJwtToken() {
  jwtToken = null;
  localStorage.removeItem("jwtToken");
}

export function isLoggedIn(): boolean {
  return !!getJwtToken();
}
