
// Employee Types
export interface User {
  role: any
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

export interface Employee {
  designationId: string
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdBy: string | null
  updatedBy: string | null
  roleId: string
  role?: Role
  user?: User | null
  designation?:{
    departmentId: string
    roleId: string
    id:string
    title:string
    descsription: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

export interface UserInput {
  username: string
  password: string
  roleId: string
   email: string
   phone: string
}

export interface CreateEmployeeDto {
  firstName: string
  lastName: string
  email: string
  phone: string
  isActive: boolean
  roleId: string
  user: UserInput
  createdBy?: string | null
}

export interface UpdateEmployeeDto {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  isActive?: boolean
  roleId?: string
  updatedBy?: string | null
}
