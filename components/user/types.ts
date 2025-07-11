// User Types
export interface User {
  id: string
  name: string
  username: string
  employeeId: string
  email: string
  password?: string
  phone: string
  status: string
  refreshToken?: string | null
  createdAt: string
  updatedAt: string
  roleId: string
  role?: Role
  department?: Department
}

export interface Role {
  id: string
  name: string
  description: string
  departmentId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdBy: string | null
}

export interface Department {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdBy: string | null
}

export interface CreateUserDto {
  name: string
  username: string
  employeeId: string
  email: string
  password: string
  phone: string
  status: string
  roleId: string
}

export interface UpdateUserDto {
  name?: string
  username?: string
  employeeId?: string
  email?: string
  password?: string
  phone?: string
  status?: string
  roleId?: string
}
