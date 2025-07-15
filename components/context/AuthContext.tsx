"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  setTokens,
  saveRoleInfo,
  clearTokens,
  loadRole,
  loadPerms,
} from "@/lib/auth";

type AuthCtx = {
  username: string;
  role: string;
  perms: string[];
  login: (email: string, pw: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [perms, setPerms] = useState<string[]>([]);

  useEffect(() => {
    setRole(loadRole());
    setPerms(loadPerms());
    setUsername(localStorage.getItem("username") || "");
  }, []);

  const login = async (email: string, pw: string) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: pw }),
    });

    const permNames: string[] = (data.rolePermissions ?? []).map(
      (p: any) => p.name
    );

    setTokens(data.accessToken, data.refreshToken);
    saveRoleInfo(data.role, permNames, data.username);

    setRole(data.role.toLowerCase());
    setPerms(permNames.map((p) => p.toLowerCase()));
    setUsername(data.username);

    router.push("/dashboard");
  };

  const logout = () => {
    clearTokens();
    setUsername("");
    setRole("");
    setPerms([]);
    router.push("/");
  };

  return (
    <Ctx.Provider value={{ username, role, perms, login, logout }}>
      {children}
    </Ctx.Provider>
  );
};
