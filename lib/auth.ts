// export function getAccessToken() {
//   return localStorage.getItem("access_token") || "";
// }

// export function getRefreshToken() {
//   return localStorage.getItem("refresh_token") || "";
// }

// export function setTokens(access: string, refresh: string) {
//   localStorage.setItem("access_token", access);
//   localStorage.setItem("refresh_token", refresh);
// }

// export function clearTokens() {
//   localStorage.removeItem("access_token");
//   localStorage.removeItem("refresh_token");
//   localStorage.removeItem("username");
//   localStorage.removeItem("role");
//   localStorage.removeItem("permissions");
// }

// export function saveRoleInfo(role: string, permissions: string[], username: string) {
//   localStorage.setItem("role", role.toLowerCase());
//   localStorage.setItem("permissions", JSON.stringify(permissions.map(p => p.toLowerCase())));
//   localStorage.setItem("username", username);
// }

// export function loadRole(): string {
//   return (localStorage.getItem("role") || "").toLowerCase();
// }

// export function loadPerms(): string[] {
//   const json = localStorage.getItem("permissions");
//   try {
//     return json ? JSON.parse(json).map((p: string) => p.toLowerCase()) : [];
//   } catch {
//     return [];
//   }
// }









// auth.ts

export function getAccessToken(): string {
  return localStorage.getItem("access_token") || "";
}

export function getRefreshToken(): string {
  return localStorage.getItem("refresh_token") || "";
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

export function clearTokens(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("permissions");
}

export function saveRoleInfo(role: string, permissions: string[], username: string): void {
  localStorage.setItem("role", role.toLowerCase());
  localStorage.setItem("permissions", JSON.stringify(permissions.map((p) => p.toLowerCase())));
  localStorage.setItem("username", username);
}

export function loadRole(): string {
  return (localStorage.getItem("role") || "").toLowerCase();
}

export function loadPerms(): string[] {
  const json = localStorage.getItem("permissions");
  try {
    const parsed = JSON.parse(json || "[]");
    return Array.isArray(parsed)
      ? parsed.map((p: string) => p.toLowerCase())
      : [];
  } catch {
    return [];
  }
}
