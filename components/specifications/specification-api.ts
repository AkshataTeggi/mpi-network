


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
