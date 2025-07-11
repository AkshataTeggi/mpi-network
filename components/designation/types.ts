// app/dashboard/settings/designations/types.ts
export interface CreateDesignationDto {
  title: string
  departmentId: string
  isActive: boolean
  permissions: string[]
}

export interface UpdateDesignationDto {
  title?: string
  isActive?: boolean
  departmentId?: string
  permissions: string[]
}

export interface Designation {
  id: string
  title: string
  isActive: boolean
  departmentId: string
  department?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}
