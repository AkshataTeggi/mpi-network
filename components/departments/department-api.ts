import { API_BASE_URL } from "@/lib/constants"
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from "./types"

/**
 * Fetches all departments from the API
 */
export async function fetchDepartments(): Promise<Department[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch departments: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching departments:", error)
    throw new Error("Failed to fetch departments")
  }
}

/**
 * Fetches a single department by ID
 */
export async function fetchDepartmentById(id: string): Promise<Department> {
  try {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch department: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching department ${id}:`, error)
    throw new Error("Failed to fetch department")
  }
}

/**
 * Creates a new department
 */
export async function createDepartment(department: CreateDepartmentDto): Promise<Department> {
  try {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(department),
    })

    if (!response.ok) {
      throw new Error(`Failed to create department: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating department:", error)
    throw new Error("Failed to create department")
  }
}

/**
 * Updates an existing department
 */
export async function updateDepartment(id: string, department: UpdateDepartmentDto): Promise<Department> {
  try {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(department),
    })

    if (!response.ok) {
      throw new Error(`Failed to update department: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating department ${id}:`, error)
    throw new Error("Failed to update department")
  }
}

/**
 * Deletes a department
 */
export async function deleteDepartment(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Failed to delete department: ${message}`)
  }
}


