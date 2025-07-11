// Customer API functions based on backend service

export interface CreateCustomerDto {
  name: string
  email: string
  phone: string
  address: string
  city: string
  county?: string
  zipCode: string
  state: string
  country: string
  website?: string
  status: "active" | "inactive"
}

export interface UpdateCustomerDto {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  county?: string
  zipCode?: string
  state?: string
  country?: string
  website?: string
  status?: "active" | "inactive"
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  county: string
  zipCode: string
  state: string
  country: string
  website: string
  status: "active" | "inactive"
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}