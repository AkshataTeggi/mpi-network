// app/role/page.tsx
"use client";

import { RoleService } from "@/components/roles/role-service";
import React from "react";

export default function RolePage() {
  return <RoleService initialView="list" />;
}
