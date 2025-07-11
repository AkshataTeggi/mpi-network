// app/api/service-api.ts

import { API_BASE_URL } from "@/lib/constants"
import { CreateServiceDto, Service, UpdateServiceDto } from "./types"

const SERVICE_ENDPOINT = `${API_BASE_URL}/services` // ✅ Append /services

export const ServiceAPI = {
  async create(data: CreateServiceDto): Promise<Service> {
    const res = await fetch(SERVICE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to create service")
    return res.json()
  },

  async getAll(): Promise<Service[]> {
    const res = await fetch(SERVICE_ENDPOINT)
    if (!res.ok) throw new Error("Failed to fetch services")
    return res.json()
  },

  async getById(id: string): Promise<Service> {
    const res = await fetch(`${SERVICE_ENDPOINT}/${id}`)
    if (!res.ok) throw new Error("Failed to fetch service")
    return res.json()
  },

  async update(id: string, data: UpdateServiceDto): Promise<Service> {
    const res = await fetch(`${SERVICE_ENDPOINT}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to update service")
    return res.json()
  },

  async remove(id: string): Promise<{ message: string }> {
    const res = await fetch(`${SERVICE_ENDPOINT}/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Failed to delete service")
    return res.json()
  },
}
