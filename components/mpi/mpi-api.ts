// import { API_BASE_URL } from "@/lib/constants"


// export class MPIAPI {
//   private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
//     const url = `${API_BASE_URL}${endpoint}`

//     try {
//       const response = await fetch(url, {
//         headers: {
//           "Content-Type": "application/json",
//           ...options.headers,
//         },
//         ...options,
//       })

//       if (!response.ok) {
//         let errorMessage = `HTTP error! status: ${response.status}`

//         try {
//           const errorData = await response.json()
//           errorMessage = errorData.message || errorMessage
//           console.error("API Error Details:", errorData)
//         } catch (parseError) {
//           console.error("Could not parse error response:", parseError)
//         }

//         throw new Error(errorMessage)
//       }

//       return response.json()
//     } catch (error) {
//       console.error(`API Request failed for ${endpoint}:`, error)
//       throw error
//     }
//   }

//   // MPI CRUD operations
//   static async getAllMPIs(): Promise<MPI[]> {
//     return this.request<MPI[]>("/mpi")
//   }

//   static async getMPIById(id: string): Promise<MPI> {
//     return this.request<MPI>(`/mpi/${id}`)
//   }

//   static async createMPI(dto: CreateMPIDto): Promise<MPI> {
//     console.log("Creating MPI with DTO:", dto)
//     return this.request<MPI>("/mpi", {
//       method: "POST",
//       body: JSON.stringify(dto),
//     })
//   }

//   static async updateMPI(id: string, dto: UpdateMPIDto): Promise<MPI> {
//     console.log("Updating MPI with DTO:", dto)
//     return this.request<MPI>(`/mpi/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(dto),
//     })
//   }

//   static async deleteMPI(id: string): Promise<void> {
//     return this.request<void>(`/mpi/${id}`, {
//       method: "DELETE",
//     })
//   }

//   // Fixed enums endpoint - plural
//   static async getEnums(): Promise<any> {
//     console.log("📡 API: Getting enums")
//     const result = await this.request<any>("/mpi/enums")
//     console.log("📦 API: Enums received:", result)
//     return result
//   }

//   // Checklist template endpoint
//   static async getChecklistTemplate(): Promise<any> {
//     console.log("📡 API: Getting checklist template")
//     const result = await this.request<any>("/mpi/checklist-template")
//     console.log("📦 API: Checklist template received:", result)
//     return result
//   }
// }

// // Import types
// import type { MPI, CreateMPIDto, UpdateMPIDto } from "./types"















import { API_BASE_URL } from "@/lib/constants"
import type { CreateMPIDto, UpdateMPIDto, MPI } from "./types"

class MPIAPI {
  private static baseUrl = `${API_BASE_URL}/mpi`

  static async createMPI(data: CreateMPIDto): Promise<MPI> {
    try {
      console.log("🚀 MPIAPI.createMPI called with data:", JSON.stringify(data, null, 2))

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      console.log("📡 Response status:", response.status)
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("❌ API Error Response:", errorData)
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ API Success Response:", result)
      return result
    } catch (error) {
      console.error("💥 MPIAPI.createMPI error:", error)
      throw error
    }
  }

  static async getAllMPIs(): Promise<MPI[]> {
    try {
      console.log("🔍 Fetching all MPIs...")
      const response = await fetch(this.baseUrl)

      console.log("📡 Response status:", response.status)
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ API Success Response:")
      console.log("📊 Number of MPIs returned:", result?.length || 0)
      console.log("📋 Full MPI data:", JSON.stringify(result, null, 2))

      return result
    } catch (error) {
      console.error("❌ Failed to fetch MPIs:", error)
      throw error
    }
  }

  static async getMPIById(id: string): Promise<MPI> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch MPI:", error)
      throw error
    }
  }

  static async updateMPI(id: string, data: UpdateMPIDto): Promise<MPI> {
    try {
      console.log("🔄 MPIAPI.updateMPI called with data:", JSON.stringify(data, null, 2))

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("❌ Update API Error Response:", errorData)
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Update API Success Response:", result)
      return result
    } catch (error) {
      console.error("💥 MPIAPI.updateMPI error:", error)
      throw error
    }
  }

  static async deleteMPI(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Failed to delete MPI:", error)
      throw error
    }
  }

  static async getEnums(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/enums`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch enums:", error)
      throw error
    }
  }

  static async getChecklistTemplate(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/checklist-template`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch checklist template:", error)
      throw error
    }
  }
}

export { MPIAPI }


