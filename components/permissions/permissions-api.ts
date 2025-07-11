// import { API_BASE_URL } from "@/lib/constants"
// import axios from "axios"


// export async function getAllPermissions() {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/authorization/permissions`)
//     return response.data
//   } catch (error) {
//     console.error("Error fetching permissions:", error)
//     throw new Error("Failed to fetch permissions")
//   }
// }










import { API_BASE_URL } from "@/lib/constants"
import axios from "axios"

// GET: Fetch all permissions
export async function getAllPermissions() {
  try {
    const response = await axios.get(`${API_BASE_URL}/authorization/permissions`)
    return response.data
  } catch (error: any) {
    console.error("Error fetching permissions:", error?.response?.data || error.message)
    throw new Error("Failed to fetch permissions")
  }
}

// POST: Create a new permission
export async function createPermission(data: { name: string; description?: string }) {
  try {
    const response = await axios.post(`${API_BASE_URL}/authorization/permissions`, data)
    return response.data
  } catch (error: any) {
    console.error("Error creating permission:", error?.response?.data || error.message)
    throw new Error("Failed to create permission")
  }
}
