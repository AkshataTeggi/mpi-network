import { ReactNode } from "react";
import { useAuth } from "@/components/context/AuthContext";

export function HasPermission({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const { perms } = useAuth();
  return perms.includes(permission.toLowerCase()) ? <>{children}</> : null;
}







