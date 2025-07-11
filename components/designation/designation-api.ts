// app/dashboard/settings/designations/designation-api.ts
import { API_BASE_URL } from "@/lib/constants"
import type { CreateDesignationDto, UpdateDesignationDto, Designation } from "./types"

// Base URL

export async function fetchDesignations(): Promise<Designation[]> {
  const res = await fetch(`${API_BASE_URL}/designations`)
  if (!res.ok) throw new Error("Failed to fetch designations")
  return res.json()
}

export async function fetchDesignationById(id: string): Promise<Designation> {
  const res = await fetch(`${API_BASE_URL}/${id}`)
  if (!res.ok) throw new Error("Failed to fetch designation")
  return res.json()
}

export async function createDesignation(dto: CreateDesignationDto) {
  const res = await fetch(`${API_BASE_URL}/designations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })

  if (!res.ok) {
    const errorBody = await res.text()
    console.error("Designation creation failed:", errorBody) // Log full response
    throw new Error("Failed to create designation")
  }

  return res.json()
}

export async function updateDesignation(id: string, dto: UpdateDesignationDto): Promise<Designation> {
  const res = await fetch(`${API_BASE_URL}/designations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  if (!res.ok) {
    const errorBody = await res.text()
    console.error("Failed to update designation:", errorBody)
    throw new Error("Failed to update designation")
  }
  return res.json()
}


export async function deleteDesignation(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete designation")
}
