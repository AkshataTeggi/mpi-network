




// import { API_BASE_URL } from "@/lib/constants"
// import type { CreateMPIDto, UpdateMPIDto, MPI } from "./types"

// class MPIAPI {
//   private static baseUrl = `${API_BASE_URL}/mpi`

//   static async createMPI(data: CreateMPIDto): Promise<MPI> {
//     try {
//       console.log("🚀 MPIAPI.createMPI called with data:", JSON.stringify(data, null, 2))

//       const response = await fetch(this.baseUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       })

//       console.log("📡 Response status:", response.status)
//       console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         console.error("❌ API Error Response:", errorData)
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//       }

//       const result = await response.json()
//       console.log("✅ API Success Response:", result)
//       return result
//     } catch (error) {
//       console.error("💥 MPIAPI.createMPI error:", error)
//       throw error
//     }
//   }

//   static async getAllMPIs(): Promise<MPI[]> {
//     try {
//       console.log("🔍 Fetching all MPIs...")
//       const response = await fetch(this.baseUrl)

//       console.log("📡 Response status:", response.status)
//       console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const result = await response.json()
//       console.log("✅ API Success Response:")
//       console.log("📊 Number of MPIs returned:", result?.length || 0)
//       console.log("📋 Full MPI data:", JSON.stringify(result, null, 2))

//       return result
//     } catch (error) {
//       console.error("❌ Failed to fetch MPIs:", error)
//       throw error
//     }
//   }

//   static async getMPIById(id: string): Promise<MPI> {
//     try {
//       const response = await fetch(`${this.baseUrl}/${id}`)
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }
//       return await response.json()
//     } catch (error) {
//       console.error("Failed to fetch MPI:", error)
//       throw error
//     }
//   }

//   static async updateMPI(id: string, data: UpdateMPIDto): Promise<MPI> {
//     try {
//       console.log("🔄 MPIAPI.updateMPI called with data:", JSON.stringify(data, null, 2))

//       const response = await fetch(`${this.baseUrl}/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         console.error("❌ Update API Error Response:", errorData)
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//       }

//       const result = await response.json()
//       console.log("✅ Update API Success Response:", result)
//       return result
//     } catch (error) {
//       console.error("💥 MPIAPI.updateMPI error:", error)
//       throw error
//     }
//   }

//   static async deleteMPI(id: string): Promise<void> {
//     try {
//       const response = await fetch(`${this.baseUrl}/${id}`, {
//         method: "DELETE",
//       })
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }
//     } catch (error) {
//       console.error("Failed to delete MPI:", error)
//       throw error
//     }
//   }

//   static async getEnums(): Promise<any> {
//     try {
//       const response = await fetch(`${this.baseUrl}/enums`)
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }
//       return await response.json()
//     } catch (error) {
//       console.error("Failed to fetch enums:", error)
//       throw error
//     }
//   }

//   static async getChecklistTemplate(): Promise<any> {
//     try {
//       const response = await fetch(`${this.baseUrl}/checklist-template`)
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }
//       return await response.json()
//     } catch (error) {
//       console.error("Failed to fetch checklist template:", error)
//       throw error
//     }
//   }
// }

// export { MPIAPI }












import { API_BASE_URL } from "@/lib/constants"
import { getAccessToken } from "@/lib/auth" // 🔑 JWT accessor
import type { CreateMPIDto, UpdateMPIDto, MPI } from "./types"

class MPIAPI {
  private static baseUrl = `${API_BASE_URL}/mpi`

  private static getAuthHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    }
  }

  static async createMPI(data: CreateMPIDto): Promise<MPI> {
    try {
      console.log("🚀 MPIAPI.createMPI called with data:", JSON.stringify(data, null, 2))

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: this.getAuthHeaders(),
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
      const response = await fetch(this.baseUrl, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })

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
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })
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
        headers: this.getAuthHeaders(),
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
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
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
      const response = await fetch(`${this.baseUrl}/enums`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })
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
      const response = await fetch(`${this.baseUrl}/checklist-template`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })
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
