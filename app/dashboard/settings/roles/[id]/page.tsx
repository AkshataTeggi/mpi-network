// app/dashboard/settings/roles/[id]/page.tsx
"use client";

import { RoleService } from "@/components/roles/role-service";
import React, { use } from "react";

/** the router now passes params as a Promise */
interface Props {
  params: Promise<{ id: string }>;
}

export default function RoleDetailPage({ params }: Props) {
  const { id } = use(params);          // ✅ unwrap the Promise
  return <RoleService initialView="details" roleId={id} />;
}
