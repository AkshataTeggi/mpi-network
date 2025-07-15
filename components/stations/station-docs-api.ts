// import { API_BASE_URL } from "@/lib/constants"

// // Types for the station documentation API
// export interface StationDocumentation {
//   id: string
//   stationId: string
//   description: string
//   originalName: string
//   fileUrl: string
//   createdAt?: string
//   updatedAt?: string
// }

// export interface UploadDocumentationRequest {
//   stationId: string
//   description?: string
// }

// export interface ApiResponse<T> {
//   data?: T
//   error?: string
//   status: number
// }

// // Base API configuration
// const ENDPOINTS = {
//   UPLOAD: "/station-documentations/upload",
//   GET_BY_ID: (id: string) => `/station-documentations/${id}`,
//   GET_BY_STATION: (stationId: string) => `/station-documentations/by-station/${stationId}`,
//   DOWNLOAD: (id: string) => `/station-documentations/${id}/download`,
//   DELETE: (id: string) => `/station-documentations/${id}`,
// } as const

// // Helper function to handle API responses
// async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
//   try {
//     if (!response.ok) {
//       const errorText = await response.text()
//       return {
//         error: errorText || `HTTP error! status: ${response.status}`,
//         status: response.status,
//       }
//     }

//     const data = await response.json()
//     return {
//       data,
//       status: response.status,
//     }
//   } catch (error) {
//     return {
//       error: error instanceof Error ? error.message : "Unknown error occurred",
//       status: response.status,
//     }
//   }
// }

// // API functions
// export class StationDocumentationApi {
//   /**
//    * Upload multiple files for a station
//    */
//   static async uploadDocumentation(
//     files: File[],
//     request: UploadDocumentationRequest,
//   ): Promise<ApiResponse<StationDocumentation[]>> {
//     try {
//       const formData = new FormData()

//       // Add files to form data
//       files.forEach((file) => {
//         formData.append("files", file)
//       })

//       // Add other fields
//       formData.append("stationId", request.stationId)
//       if (request.description) {
//         formData.append("description", request.description)
//       }

//       const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPLOAD}`, {
//         method: "POST",
//         body: formData,
//       })

//       return handleApiResponse<StationDocumentation[]>(response)
//     } catch (error) {
//       return {
//         error: error instanceof Error ? error.message : "Upload failed",
//         status: 500,
//       }
//     }
//   }

//   /**
//    * Get a single documentation by ID
//    */
//   static async getDocumentationById(id: string): Promise<ApiResponse<StationDocumentation>> {
//     try {
//       const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_BY_ID(id)}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })

//       return handleApiResponse<StationDocumentation>(response)
//     } catch (error) {
//       return {
//         error: error instanceof Error ? error.message : "Failed to fetch documentation",
//         status: 500,
//       }
//     }
//   }

//   /**
//    * Get all documentations for a specific station
//    */
//   static async getDocumentationsByStation(stationId: string): Promise<ApiResponse<StationDocumentation[]>> {
//     try {
//       const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_BY_STATION(stationId)}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })

//       return handleApiResponse<StationDocumentation[]>(response)
//     } catch (error) {
//       return {
//         error: error instanceof Error ? error.message : "Failed to fetch station documentations",
//         status: 500,
//       }
//     }
//   }

//   /**
//    * Download a documentation file
//    */
//   static async downloadDocumentation(id: string): Promise<ApiResponse<Blob>> {
//     try {
//       const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DOWNLOAD(id)}`, {
//         method: "GET",
//       })

//       if (!response.ok) {
//         const errorText = await response.text()
//         return {
//           error: errorText || `HTTP error! status: ${response.status}`,
//           status: response.status,
//         }
//       }

//       const blob = await response.blob()
//       return {
//         data: blob,
//         status: response.status,
//       }
//     } catch (error) {
//       return {
//         error: error instanceof Error ? error.message : "Download failed",
//         status: 500,
//       }
//     }
//   }

//   /**
//    * Helper function to trigger file download in browser
//    */
//   static async downloadAndSaveFile(id: string, filename?: string): Promise<ApiResponse<void>> {
//     const result = await this.downloadDocumentation(id)

//     if (result.error || !result.data) {
//       return {
//         error: result.error || "Download failed",
//         status: result.status,
//       }
//     }

//     try {
//       // Create download link
//       const url = window.URL.createObjectURL(result.data)
//       const link = document.createElement("a")
//       link.href = url
//       link.download = filename || `documentation-${id}`
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       window.URL.revokeObjectURL(url)

//       return {
//         status: 200,
//       }
//     } catch (error) {
//       return {
//         error: error instanceof Error ? error.message : "Failed to save file",
//         status: 500,
//       }
//     }
//   }

//   /**
//    * Delete a documentation
//    */
//   static async deleteDocumentation(id: string): Promise<ApiResponse<void>> {
//     try {
//       const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DELETE(id)}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         const errorText = await response.text()
//         return {
//           error: errorText || `HTTP error! status: ${response.status}`,
//           status: response.status,
//         }
//       }

//       return {
//         status: response.status,
//       }
//     } catch (error) {
//       return {
//         error: error instanceof Error ? error.message : "Delete failed",
//         status: 500,
//       }
//     }
//   }

//   /**
//    * View file by opening in new tab using direct URL
//    */
//   static viewFile(fileUrl: string): void {
//     if (fileUrl) {
//       window.open(fileUrl, "_blank")
//     }
//   }
// }

// // Export individual functions for convenience
// export const {
//   uploadDocumentation,
//   getDocumentationById,
//   getDocumentationsByStation,
//   downloadDocumentation,
//   downloadAndSaveFile,
//   deleteDocumentation,
// } = StationDocumentationApi

// // Export default
// export default StationDocumentationApi
















// import { API_BASE_URL } from "@/lib/constants"

// // Types for the station documentation API
// export interface StationDocumentation {
//   id: string
//   stationId: string
//   description: string
//   originalName: string
//   fileUrl: string
//   createdAt?: string
//   updatedAt?: string
// }

// export interface UploadDocumentationRequest {
//   stationId: string
//   description?: string
// }

// export interface ApiResponse<T> {
//   data?: T
//   error?: string
//   status: number
// }

// // Base API configuration
// const ENDPOINTS = {
//   UPLOAD: "/station-documentations/upload",
//   GET_BY_ID: (id: string) => `/station-documentations/${id}`,
//   GET_BY_STATION: (stationId: string) => `/station-documentations/by-station/${stationId}`,
//   DOWNLOAD: (id: string) => `/station-documentations/${id}/download`,
//   DELETE: (id: string) => `/station-documentations/${id}`,
// } as const

// // Helper function to handle API responses
// async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
//   try {
//     if (!response.ok) {
//       const errorText = await response.text()
//       return {
//         error: errorText || `HTTP error! status: ${response.status}`,
//         status: response.status,
//       }
//     }

//     const data = await response.json()
//     return {
//       data,
//       status: response.status,
//     }
//   } catch (error) {
//     return {
//       error: error instanceof Error ? error.message : "Unknown error occurred",
//       status: response.status,
//     }
//   }
// }

// // API functions
// export class StationDocumentationApi {
//   /**
//    * Upload multiple documentation files for a station
//    */
//   static async uploadDocumentation(
//     files: File[],
//     request: UploadDocumentationRequest,
//   ): Promise<ApiResponse<StationDocumentation[]>> {
//     try {
//       const formData = new FormData()

//       // Add files to form data
//       files.forEach((file) => {
//         formData.append("files", file)
//       })

//       // Add other fields
//       formData.append("stationId", request.stationId)
//       if (request.description) {
//         formData.append("description", request.description)
//       }

//       const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPLOAD}`, {
//         method: "POST",
//         body: formData,
//       })

//       return handleApiResponse<StationDocumentation[]>(response)
//     } catch (error) {
//       return {
//         error: error instanceof Error ? error.message : "Upload failed",
//         status: 500,
//       }
//     }
//   }

//   /**
//    * Get a single documentation by ID
//    */
//   static async getDocumentationById(id: string): Promise<ApiResponse<StationDocumentation>> {
//     try {
//       const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_BY_ID(id)}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })

//       return handleApiResponse<StationDocumentation>(response)
//     } catch (error) {
//       return {
//         error: error instanceof Error ? error.message : "Failed to fetch documentation",
//         status: 500,
//       }
//     }
//   }

//   /**
//    * Get all documentations for a specific station
//    */
//   static async getDocumentationsByStation(stationId: string): Promise<ApiResponse<StationDocumentation[]>> {
//     try {
//       const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_BY_STATION(stationId)}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })

//       return handleApiResponse<StationDocumentation[]>(response)
//     } catch (error) {
//       return {
//         error: error instanceof Error ? error.message : "Failed to fetch station documentations",
//         status: 500,
//       }
//     }
//   }

//   /**
//    * Download a documentation file
//    */
//   static async downloadDocumentation(id: string): Promise<ApiResponse<Blob>> {
//     try {
//       const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DOWNLOAD(id)}`, {
//         method: "GET",
//       })

//       if (!response.ok) {
//         const errorText = await response.text()
//         return {
//           error: errorText || `HTTP error! status: ${response.status}`,
//           status: response.status,
//         }
//       }

//       const blob = await response.blob()
//       return {
//         data: blob,
//         status: response.status,
//       }
//     } catch (error) {
//       return {
//         error: error instanceof Error ? error.message : "Download failed",
//         status: 500,
//       }
//     }
//   }

//   /**
//    * Helper function to trigger file download in browser
//    */
//   static async downloadAndSaveFile(id: string, filename?: string): Promise<ApiResponse<void>> {
//     const result = await this.downloadDocumentation(id)

//     if (result.error || !result.data) {
//       return {
//         error: result.error || "Download failed",
//         status: result.status,
//       }
//     }

//     try {
//       // Create download link
//       const url = window.URL.createObjectURL(result.data)
//       const link = document.createElement("a")
//       link.href = url
//       link.download = filename || `documentation-${id}`
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       window.URL.revokeObjectURL(url)

//       return {
//         status: 200,
//       }
//     } catch (error) {
//       return {
//         error: error instanceof Error ? error.message : "Failed to save file",
//         status: 500,
//       }
//     }
//   }

//   /**
//    * View file by opening in new tab using direct URL
//    */
//   static viewFile(fileUrl: string): void {
//     if (fileUrl) {
//       window.open(fileUrl, "_blank")
//     }
//   }

//   /**
//    * Delete a documentation
//    */
//   static async deleteDocumentation(id: string): Promise<ApiResponse<void>> {
//     try {
//       const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DELETE(id)}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         const errorText = await response.text()
//         return {
//           error: errorText || `HTTP error! status: ${response.status}`,
//           status: response.status,
//         }
//       }

//       return {
//         status: response.status,
//       }
//     } catch (error) {
//       return {
//         error: error instanceof Error ? error.message : "Delete failed",
//         status: 500,
//       }
//     }
//   }
// }

// // Export individual functions for convenience
// export const {
//   uploadDocumentation,
//   getDocumentationById,
//   getDocumentationsByStation,
//   downloadDocumentation,
//   downloadAndSaveFile,
//   deleteDocumentation,
// } = StationDocumentationApi

// // Export default
// export default StationDocumentationApi















import { API_BASE_URL } from "@/lib/constants"
import { getAccessToken } from "@/lib/auth" // ✅ import access token utility

// Types for the station documentation API
export interface StationDocumentation {
  id: string
  stationId: string
  description: string
  originalName: string
  fileUrl: string
  createdAt?: string
  updatedAt?: string
}

export interface UploadDocumentationRequest {
  stationId: string
  description?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

const ENDPOINTS = {
  UPLOAD: "/station-documentations/upload",
  GET_BY_ID: (id: string) => `/station-documentations/${id}`,
  GET_BY_STATION: (stationId: string) => `/station-documentations/by-station/${stationId}`,
  DOWNLOAD: (id: string) => `/station-documentations/${id}/download`,
  DELETE: (id: string) => `/station-documentations/${id}`,
} as const

async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    if (!response.ok) {
      const errorText = await response.text()
      return { error: errorText || `HTTP error! status: ${response.status}`, status: response.status }
    }

    const data = await response.json()
    return { data, status: response.status }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: response.status,
    }
  }
}

export class StationDocumentationApi {
  static async uploadDocumentation(files: File[], request: UploadDocumentationRequest): Promise<ApiResponse<StationDocumentation[]>> {
    try {
      const formData = new FormData()
      files.forEach((file) => formData.append("files", file))
      formData.append("stationId", request.stationId)
      if (request.description) formData.append("description", request.description)

      const token = getAccessToken()

      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPLOAD}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ add token
        },
        body: formData,
      })

      return handleApiResponse<StationDocumentation[]>(response)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Upload failed",
        status: 500,
      }
    }
  }

  static async getDocumentationById(id: string): Promise<ApiResponse<StationDocumentation>> {
    const token = getAccessToken()
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_BY_ID(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅
      },
    })

    return handleApiResponse<StationDocumentation>(response)
  }

  static async getDocumentationsByStation(stationId: string): Promise<ApiResponse<StationDocumentation[]>> {
    const token = getAccessToken()
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_BY_STATION(stationId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅
      },
    })

    return handleApiResponse<StationDocumentation[]>(response)
  }

  static async downloadDocumentation(id: string): Promise<ApiResponse<Blob>> {
    const token = getAccessToken()
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DOWNLOAD(id)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // ✅
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { error: errorText || `HTTP error! status: ${response.status}`, status: response.status }
    }

    const blob = await response.blob()
    return { data: blob, status: response.status }
  }

  static async downloadAndSaveFile(id: string, filename?: string): Promise<ApiResponse<void>> {
    const result = await this.downloadDocumentation(id)

    if (result.error || !result.data) return { error: result.error || "Download failed", status: result.status }

    try {
      const url = window.URL.createObjectURL(result.data)
      const link = document.createElement("a")
      link.href = url
      link.download = filename || `documentation-${id}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return { status: 200 }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to save file", status: 500 }
    }
  }

  static viewFile(fileUrl: string): void {
    if (fileUrl) window.open(fileUrl, "_blank")
  }

  static async deleteDocumentation(id: string): Promise<ApiResponse<void>> {
    const token = getAccessToken()
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DELETE(id)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { error: errorText || `HTTP error! status: ${response.status}`, status: response.status }
    }

    return { status: response.status }
  }
}

// Export individual functions
export const {
  uploadDocumentation,
  getDocumentationById,
  getDocumentationsByStation,
  downloadDocumentation,
  downloadAndSaveFile,
  deleteDocumentation,
} = StationDocumentationApi

export default StationDocumentationApi
