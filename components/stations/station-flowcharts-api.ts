import { API_BASE_URL } from "@/lib/constants"

// Types for the station flowcharts API
export interface StationFlowchart {
  id: string
  stationId: string
  description: string
  originalName: string
  fileUrl: string
  createdAt?: string
  updatedAt?: string
}

export interface UploadFlowchartRequest {
  stationId: string
  description?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

// Base API configuration
const ENDPOINTS = {
  UPLOAD: "/station-flowcharts/upload",
  GET_BY_ID: (id: string) => `/station-flowcharts/${id}`,
  GET_BY_STATION: (stationId: string) => `/station-flowcharts/by-station/${stationId}`,
  DOWNLOAD: (id: string) => `/station-flowcharts/${id}/download`,
  DELETE: (id: string) => `/station-flowcharts/${id}`,
} as const

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    if (!response.ok) {
      const errorText = await response.text()
      return {
        error: errorText || `HTTP error! status: ${response.status}`,
        status: response.status,
      }
    }

    const data = await response.json()
    return {
      data,
      status: response.status,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: response.status,
    }
  }
}

// API functions
export class StationFlowchartsApi {
  /**
   * Upload multiple flowchart files for a station
   */
  static async uploadFlowcharts(
    files: File[],
    request: UploadFlowchartRequest,
  ): Promise<ApiResponse<StationFlowchart[]>> {
    try {
      const formData = new FormData()

      // Add files to form data
      files.forEach((file) => {
        formData.append("files", file)
      })

      // Add other fields
      formData.append("stationId", request.stationId)
      if (request.description) {
        formData.append("description", request.description)
      }

      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPLOAD}`, {
        method: "POST",
        body: formData,
      })

      return handleApiResponse<StationFlowchart[]>(response)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Upload failed",
        status: 500,
      }
    }
  }

  /**
   * Get a single flowchart by ID
   */
  static async getFlowchartById(id: string): Promise<ApiResponse<StationFlowchart>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_BY_ID(id)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      return handleApiResponse<StationFlowchart>(response)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch flowchart",
        status: 500,
      }
    }
  }

  /**
   * Get all flowcharts for a specific station
   */
  static async getFlowchartsByStation(stationId: string): Promise<ApiResponse<StationFlowchart[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_BY_STATION(stationId)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      return handleApiResponse<StationFlowchart[]>(response)
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch station flowcharts",
        status: 500,
      }
    }
  }

  /**
   * Download a flowchart file
   */
  static async downloadFlowchart(id: string): Promise<ApiResponse<Blob>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DOWNLOAD(id)}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorText = await response.text()
        return {
          error: errorText || `HTTP error! status: ${response.status}`,
          status: response.status,
        }
      }

      const blob = await response.blob()
      return {
        data: blob,
        status: response.status,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Download failed",
        status: 500,
      }
    }
  }

  /**
   * Helper function to trigger file download in browser
   */
  static async downloadAndSaveFile(id: string, filename?: string): Promise<ApiResponse<void>> {
    const result = await this.downloadFlowchart(id)

    if (result.error || !result.data) {
      return {
        error: result.error || "Download failed",
        status: result.status,
      }
    }

    try {
      // Create download link
      const url = window.URL.createObjectURL(result.data)
      const link = document.createElement("a")
      link.href = url
      link.download = filename || `flowchart-${id}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return {
        status: 200,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to save file",
        status: 500,
      }
    }
  }

  /**
   * View file by opening in new tab using direct URL
   */
  static viewFile(fileUrl: string): void {
    if (fileUrl) {
      window.open(fileUrl, "_blank")
    }
  }

  /**
   * Delete a flowchart
   */
  static async deleteFlowchart(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DELETE(id)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        return {
          error: errorText || `HTTP error! status: ${response.status}`,
          status: response.status,
        }
      }

      return {
        status: response.status,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Delete failed",
        status: 500,
      }
    }
  }
}

// Export individual functions for convenience
export const {
  uploadFlowcharts,
  getFlowchartById,
  getFlowchartsByStation,
  downloadFlowchart,
  downloadAndSaveFile,
  deleteFlowchart,
} = StationFlowchartsApi

// Export default
export default StationFlowchartsApi
