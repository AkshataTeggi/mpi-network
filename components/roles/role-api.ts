// import { API_BASE_URL } from "@/lib/constants";
// import {
//   CreateRoleDto,
//   Role,
//   UpdateRoleDto,
//   CreatePermissionDto,
//   Permission,
// } from "./types";

// /* ------------------------------------------------ */
// /* fetch wrapper                                    */
// /* ------------------------------------------------ */

// type ApiEnvelope<T> = { data: T; message?: string };

// async function request<T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("authtoken") : undefined;

//   const res = await fetch(`${API_BASE_URL}/authorization${endpoint}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...options.headers,
//     },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     const errJson = (await res.json().catch(() => ({}))) as {
//       message?: string;
//       error?: string;
//     };
//     throw new Error(errJson.error || errJson.message || res.statusText);
//   }

//   return res.json() as Promise<T>;
// }

// /* ------------------------------------------------ */
// /* Roles                                            */
// /* ------------------------------------------------ */

// export async function createRole(dto: CreateRoleDto): Promise<Role> {
//   // ⓐ  the controller returns the Role object itself
//   return request<Role>(`/roles`, {
//     method: 'POST',
//     body: JSON.stringify(dto),
//   });
// }

// export async function updateRole(
//   roleId: string,
//   dto: UpdateRoleDto,           // must include permissionIds if you change them
// ): Promise<Role> {
//   // same unwrap logic, but we no longer import/ export assignPermissionsToRole
//   const payload = await request<Role | { data: Role }>(`/roles/${roleId}`, {
//     method: 'PATCH',
//     body: JSON.stringify(dto),
//   });
//   return (payload as any).data ?? (payload as Role);
// }

// export async function fetchRoles(): Promise<Role[]> {
//   return request<Role[]>(`/roles`);
// }

// export async function getRoleById(roleId: string): Promise<Role> {
//   return request<Role>(`/roles/${roleId}`);
// }



// export async function deleteRole(
//   roleId: string
// ): Promise<{ message: string }> {
//   return request<{ message: string }>(`/roles/${roleId}`, { method: "DELETE" });
// }



// /* ------------------------------------------------ */
// /* Permissions                                      */
// /* ------------------------------------------------ */

// export async function createPermission(
//   dto: CreatePermissionDto
// ): Promise<Permission> {
//   return request<Permission>(`/permissions`, {
//     method: "POST",
//     body: JSON.stringify(dto),
//   });
// }

// export async function fetchPermissions(): Promise<Permission[]> {
//   return request<Permission[]>(`/permissions`);
// }

// export async function deletePermission(
//   permissionId: string
// ): Promise<{ message: string }> {
//   return request<{ message: string }>(`/permissions/${permissionId}`, {
//     method: "DELETE",
//   });
// }

// /* ------------------------------------------------ */
// /* Departments                                      */
// /* ------------------------------------------------ */

// export async function fetchDepartments(): Promise<{ id: string; name: string }[]> {
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("authtoken") : undefined;

//   const res = await fetch(`${API_BASE_URL}/departments`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     credentials: "include",
//   });

//   if (!res.ok) throw new Error("Failed to fetch departments");
//   return res.json();
// }














import { API_BASE_URL } from "@/lib/constants"
import type { CreateRoleDto, Role, UpdateRoleDto, CreatePermissionDto, Permission } from "./types"

/* ------------------------------------------------ */
/* fetch wrapper                                    */
/* ------------------------------------------------ */

type ApiEnvelope<T> = { data: T; message?: string }

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : undefined

  const res = await fetch(`${API_BASE_URL}/authorization${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: "include",
  })

  if (!res.ok) {
    const errJson = (await res.json().catch(() => ({}))) as {
      message?: string
      error?: string
    }
    throw new Error(errJson.error || errJson.message || res.statusText)
  }

  return res.json() as Promise<T>
}

/* ------------------------------------------------ */
/* Roles                                            */
/* ------------------------------------------------ */

export async function createRole(dto: CreateRoleDto): Promise<Role> {
  return request<Role>(`/roles`, {
    method: "POST",
    body: JSON.stringify(dto),
  })
}

export async function updateRole(roleId: string, dto: UpdateRoleDto): Promise<Role> {
  const payload = await request<Role | { data: Role }>(`/roles/${roleId}`, {
    method: "PATCH",
    body: JSON.stringify(dto),
  })
  return (payload as any).data ?? (payload as Role)
}

export async function fetchRoles(): Promise<Role[]> {
  return request<Role[]>(`/roles`)
}

export async function getRoleById(roleId: string): Promise<Role> {
  return request<Role>(`/roles/${roleId}`)
}

export async function deleteRole(roleId: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/roles/${roleId}`, { method: "DELETE" })
}

/* ------------------------------------------------ */
/* Permissions                                      */
/* ------------------------------------------------ */

export async function createPermission(dto: CreatePermissionDto): Promise<Permission> {
  return request<Permission>(`/permissions`, {
    method: "POST",
    body: JSON.stringify(dto),
  })
}

export async function fetchPermissions(): Promise<Permission[]> {
  return request<Permission[]>(`/permissions`)
}

export async function getPermissionById(permissionId: string): Promise<Permission> {
  return request<Permission>(`/permissions/${permissionId}`)
}

export async function updatePermission(
  permissionId: string,
  dto: CreatePermissionDto, // Using CreatePermissionDto as it has name and description
): Promise<Permission> {
  return request<Permission>(`/permissions/${permissionId}`, {
    method: "PATCH",
    body: JSON.stringify(dto),
  })
}

export async function deletePermission(permissionId: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/permissions/${permissionId}`, {
    method: "DELETE",
  })
}

/* ------------------------------------------------ */
/* Departments                                      */
/* ------------------------------------------------ */

export async function fetchDepartments(): Promise<{ id: string; name: string }[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : undefined

  const res = await fetch(`${API_BASE_URL}/departments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  })

  if (!res.ok) throw new Error("Failed to fetch departments")
  return res.json()
}
