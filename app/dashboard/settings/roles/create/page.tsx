// app/role/create/page.tsx
"use client";

import { RoleService } from "@/components/roles/role-service";
import React from "react";

export default function RoleCreatePage() {
  return <RoleService initialView="create" />;
}
