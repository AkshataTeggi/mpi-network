// import { API_BASE_URL } from "@/lib/constants"
// import { Specification, CreateSpecificationDto, UpdateSpecificationDto, StationInputType } from "./types"


// export class SpecificationAPI {
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
//   let errorMessage = `HTTP error! status: ${response.status}`
//   try {
//     const contentType = response.headers.get("content-type")
//     if (contentType?.includes("application/json")) {
//       const errorData = await response.json()
//       errorMessage = errorData.message || JSON.stringify(errorData) || errorMessage
//       console.error("API Error Details:", errorData)
//     } else {
//       const text = await response.text()
//       errorMessage = text || errorMessage
//       console.error("API Error Text Response:", text)
//     }
//   } catch (parseError) {
//     console.error("Could not parse error response:", parseError)
//   }
//   throw new Error(errorMessage)
// }


//       return response.json()
//     } catch (error) {
//       console.error(`API Request failed for ${endpoint}:`, error)
//       throw error
//     }
//   }

//   // Get all specifications
//   static async getAllSpecifications(): Promise<Specification[]> {
//     return this.request<Specification[]>("/specifications")
//   }

//   // Get specification by ID
//   static async getSpecificationById(id: string): Promise<Specification> {
//     return this.request<Specification>(`/specifications/${id}`)
//   }

//   // Create new specification
//   static async createSpecification(dto: CreateSpecificationDto): Promise<Specification> {
//     console.log("Creating specification with DTO:", dto)
//     return this.request<Specification>("/specifications", {
//       method: "POST",
//       body: JSON.stringify(dto),
//     })
//   }

//   // Update specification
//   static async updateSpecification(id: string, dto: UpdateSpecificationDto): Promise<Specification> {
//     console.log("Updating specification with DTO:", dto)
//     return this.request<Specification>(`/specifications/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(dto),
//     })
//   }

//   // Delete specification
//   static async deleteSpecification(id: string): Promise<void> {
//     return this.request<void>(`/specifications/${id}`, {
//       method: "DELETE",
//     })
//   }

//   // Get input types
//   static async getInputTypes(): Promise<StationInputType[]> {
//     return this.request<StationInputType[]>("/specifications/input-types")
//   }
// }












// import { API_BASE_URL } from "@/lib/constants"


// export class SpecificationAPI {
//   private static async request(endpoint: string, options: RequestInit = {}) {
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
//         let errorMessage = `HTTP ${response.status}: ${response.statusText}`

//         try {
//           const errorData = await response.json()
//           errorMessage = errorData.message || JSON.stringify(errorData) || errorMessage
//           console.error("Specification API Error Details:", errorData)
//         } catch (parseError) {
//           const text = await response.text()
//           errorMessage = text || errorMessage
//           console.error("Could not parse error response:", parseError)
//         }

//         throw new Error(errorMessage)
//       }

//       return await response.json()
//     } catch (error) {
//       console.error(`Specification API Request failed for ${endpoint}:`, error)
//       throw error
//     }
//   }

//   static async getInputTypes() {
//     try {
//       return await this.request("/specifications/input-types")
//     } catch (error) {
//       console.warn("Failed to fetch input types from API, using fallback:", error)
//       // Fallback input types if API is not available
//       return ["TEXT", "number", "CHECKBOX", "DROPDOWN", "FILE_UPLOAD"]
//     }
//   }

//   static async getAllSpecifications() {
//     return this.request("/specifications")
//   }

//   static async getSpecificationById(id: string) {
//     return this.request(`/specifications/${id}`)
//   }

//   static async createSpecification(data: any) {
//     // Generate unique slug for specification
//     const uniqueSlug = this.generateUniqueSlug(data.name)

//     const processedData = {
//       ...data,
//       slug: uniqueSlug,
//       // Ensure suggestions is an array for DROPDOWN types
//       suggestions: data.inputType === "DROPDOWN" ? data.suggestions || data.options || [] : [],
//       // Remove options field as backend expects suggestions
//       options: undefined,
//     }

//     console.log("Specification API - Creating specification with processed data:", processedData)

//     return this.request("/specifications", {
//       method: "POST",
//       body: JSON.stringify(processedData),
//     })
//   }

//   static async updateSpecification(id: string, data: any) {
//     // Generate unique slug if name changed
//     if (data.name) {
//       data.slug = this.generateUniqueSlug(data.name, id)
//     }

//     // Ensure suggestions is an array for DROPDOWN types
//     if (data.inputType === "DROPDOWN") {
//       data.suggestions = data.suggestions || data.options || []
//     }

//     // Remove options field as backend expects suggestions
//     delete data.options

//     console.log("Specification API - Updating specification with processed data:", data)

//     return this.request(`/specifications/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(data),
//     })
//   }

//   static async deleteSpecification(id: string) {
//     return this.request(`/specifications/${id}`, {
//       method: "DELETE",
//     })
//   }

 
// }







import { API_BASE_URL } from "@/lib/constants"

export class SpecificationAPI {
  private static async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`

        try {
          const errorData = await response.json()
          errorMessage = errorData.message || JSON.stringify(errorData) || errorMessage
          console.error("Specification API Error Details:", errorData)
        } catch (parseError) {
          const text = await response.text()
          errorMessage = text || errorMessage
          console.error("Could not parse error response:", parseError)
        }

        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error(`Specification API Request failed for ${endpoint}:`, error)
      throw error
    }
  }

  static async getInputTypes() {
    try {
      return await this.request("/specifications/input-types")
    } catch (error) {
      console.warn("Failed to fetch input types from API, using fallback:", error)
      return ["TEXT", "number", "CHECKBOX", "DROPDOWN", "FILE_UPLOAD"]
    }
  }

  static async getAllSpecifications() {
    return this.request("/specifications")
  }

  static async getSpecificationById(id: string) {
    return this.request(`/specifications/${id}`)
  }

  static async createSpecification(data: any) {
    const processedData = {
      ...data,
      suggestions: data.inputType === "DROPDOWN" ? data.suggestions || data.options || [] : [],
    }

    delete processedData.options

    console.log("Specification API - Creating specification with processed data:", processedData)

    return this.request("/specifications", {
      method: "POST",
      body: JSON.stringify(processedData),
    })
  }

  static async updateSpecification(id: string, data: any) {
    if (data.inputType === "DROPDOWN") {
      data.suggestions = data.suggestions || data.options || []
    }

    delete data.options

    console.log("Specification API - Updating specification with processed data:", data)

    return this.request(`/specifications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  static async deleteSpecification(id: string) {
    return this.request(`/specifications/${id}`, {
      method: "DELETE",
    })
  }
}
