




// Department Types
export interface Role {
  permissions: boolean
  departmentName: string
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

export interface Designation {
  permissions: any
  id: string
  title: string
  isActive: boolean
  departmentId: string
  roleId: string | null
  createdAt: string
}

export interface Department {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  roles: Role[]
  designations: Designation[]
}

export interface CreateDepartmentDto {
  name: string
  description: string
  isActive: boolean
}

export interface UpdateDepartmentDto {
  name?: string
  description?: string
  isActive?: boolean
}


