/** Module-level token for API client (set by AuthContext). */

let token: string | null =
  typeof window !== "undefined" ? localStorage.getItem("synapse_token") : null;

export function getAuthToken(): string | null {
  return token;
}

export function setAuthToken(t: string | null): void {
  token = t;
  if (typeof window !== "undefined") {
    if (t) localStorage.setItem("synapse_token", t);
    else localStorage.removeItem("synapse_token");
  }
}
