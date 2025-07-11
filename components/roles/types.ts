export interface Permission {
  id: string
  name: string
  description?: string | null
}

export interface Role {
  departmentId: string | null // Changed to string | null for clarity
  deletedAt: string | null // Changed to string | null for clarity
  id: string
  name: string
  description?: string | null
  departmentName?: string | null // Flattened by backend for convenience
 permissions: {
  [x: string]: any;
  permission: Permission;
}[];

  isActive?: boolean
  createdAt?: string // ISO strings returned by Prisma
  updatedAt?: string
  createdBy?: string | null // Changed to string | null for clarity
}

export interface CreateRoleDto {
  name: string
  description?: string
  departmentId?: string | null
  permissionIds?: string[]
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {
  isActive?: boolean
}

export interface CreatePermissionDto {
  name: string
  description?: string
}
