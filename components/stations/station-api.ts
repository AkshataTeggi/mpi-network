// import { API_BASE_URL } from "@/lib/constants"

// export class StationAPI {
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

//   // Station CRUD operations
//   static async getAllStations(): Promise<Station[]> {
//     console.log("📡 API: Getting all stations")
//     const result = await this.request<Station[]>("/stations")
//     console.log("📦 API: All stations received, count:", result.length)
//     return result
//   }

//   static async getStationById(id: string): Promise<Station> {
//     console.log("📡 API: Getting station by ID:", id)
//     const result = await this.request<Station>(`/stations/${id}`)
//     console.log("📦 API: Station data received:", result)
//     return result
//   }

//   static async createStation(dto: CreateStationDto): Promise<Station> {
//     console.log("Creating station with DTO:", dto)
//     return this.request<Station>("/stations", {
//       method: "POST",
//       body: JSON.stringify(dto),
//     })
//   }

//   static async updateStation(id: string, dto: UpdateStationDto): Promise<Station> {
//     console.log("Updating station with DTO:", dto)
//     return this.request<Station>(`/stations/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(dto),
//     })
//   }

//   static async deleteStation(id: string): Promise<void> {
//     return this.request<void>(`/stations/${id}`, {
//       method: "DELETE",
//     })
//   }

//   // Station Specification operations
//   static async createStationSpecification(data: {
//     specificationId: string
//     stationId: string
//     value: string
//     unit?: string
//   }): Promise<any> {
//     return this.request<any>("/station-specifications", {
//       method: "POST",
//       body: JSON.stringify(data),
//     })
//   }

//   static async uploadStationSpecificationFile(
//     file: File,
//     specificationId: string,
//     stationId: string,
//     unit?: string,
//   ): Promise<any> {
//     const formData = new FormData()
//     formData.append("file", file)
//     formData.append("specificationId", specificationId)
//     formData.append("stationId", stationId)

//     if (unit) {
//       formData.append("unit", unit)
//     }

//     const url = `${API_BASE_URL}/station-specifications/upload`

//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         body: formData,
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
//       console.error(`API Request failed for /station-specifications/upload:`, error)
//       throw error
//     }
//   }

//   static async getAllStationSpecifications(): Promise<any[]> {
//     return this.request<any[]>("/station-specifications")
//   }

//   static async getStationSpecificationById(id: string): Promise<any> {
//     return this.request<any>(`/station-specifications/${id}`)
//   }

//   static async updateStationSpecification(
//     id: string,
//     data: {
//       value?: string
//       unit?: string
//     },
//   ): Promise<any> {
//     return this.request<any>(`/station-specifications/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(data),
//     })
//   }

//   static async deleteStationSpecification(id: string): Promise<void> {
//     return this.request<void>(`/station-specifications/${id}`, {
//       method: "DELETE",
//     })
//   }
// }

// // Import types
// import type { Station, CreateStationDto, UpdateStationDto } from "./types"
















// import { API_BASE_URL } from "@/lib/constants"

// export class StationAPI {
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

//   // Station CRUD operations
//   static async getAllStations(): Promise<Station[]> {
//     console.log("📡 API: Getting all stations")
//     const result = await this.request<Station[]>("/stations")
//     console.log("📦 API: All stations received, count:", result.length)
//     return result
//   }

//   static async getStationById(id: string): Promise<Station> {
//     console.log("📡 API: Getting station by ID:", id)
//     const result = await this.request<Station>(`/stations/${id}`)
//     console.log("📦 API: Station data received:", result)
//     return result
//   }

//   static async createStation(dto: CreateStationDto): Promise<Station> {
//     console.log("📡 API: Creating station with DTO:", dto)

//     // Clean the DTO to remove any undefined values
//     const cleanDto = {
//       stationId: dto.stationId,
//       stationName: dto.stationName,
//       location: dto.location,
//       status: dto.status,
//       description: dto.description || "",
//       operator: dto.operator || "",
//       // Only include if arrays exist and have items
//       ...(dto.specifications && dto.specifications.length > 0 && { specifications: dto.specifications }),
//       ...(dto.documentations && dto.documentations.length > 0 && { documentations: dto.documentations }),
//       ...(dto.flowcharts && dto.flowcharts.length > 0 && { flowcharts: dto.flowcharts }),
//     }

//     console.log("📤 API: Sending cleaned DTO:", cleanDto)

//     const result = await this.request<Station>("/stations", {
//       method: "POST",
//       body: JSON.stringify(cleanDto),
//     })

//     console.log("📦 API: Station created successfully:", result)
//     return result
//   }

//   static async updateStation(id: string, dto: UpdateStationDto): Promise<Station> {
//     console.log("Updating station with DTO:", dto)
//     return this.request<Station>(`/stations/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(dto),
//     })
//   }

//   static async deleteStation(id: string): Promise<void> {
//     return this.request<void>(`/stations/${id}`, {
//       method: "DELETE",
//     })
//   }

//   // Station Specification operations
//   static async createStationSpecification(data: {
//     specificationId: string
//     stationId: string
//     value: string
//     unit?: string
//   }): Promise<any> {
//     return this.request<any>("/station-specifications", {
//       method: "POST",
//       body: JSON.stringify(data),
//     })
//   }

//   static async uploadStationSpecificationFile(
//     file: File,
//     specificationId: string,
//     stationId: string,
//     unit?: string,
//   ): Promise<any> {
//     const formData = new FormData()
//     formData.append("file", file)
//     formData.append("specificationId", specificationId)
//     formData.append("stationId", stationId)

//     if (unit) {
//       formData.append("unit", unit)
//     }

//     const url = `${API_BASE_URL}/station-specifications/upload`

//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         body: formData,
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
//       console.error(`API Request failed for /station-specifications/upload:`, error)
//       throw error
//     }
//   }

//   static async getAllStationSpecifications(): Promise<any[]> {
//     return this.request<any[]>("/station-specifications")
//   }

//   static async getStationSpecificationById(id: string): Promise<any> {
//     return this.request<any>(`/station-specifications/${id}`)
//   }

//   static async updateStationSpecification(
//     id: string,
//     data: {
//       value?: string
//       unit?: string
//     },
//   ): Promise<any> {
//     return this.request<any>(`/station-specifications/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(data),
//     })
//   }

//   static async deleteStationSpecification(id: string): Promise<void> {
//     return this.request<void>(`/station-specifications/${id}`, {
//       method: "DELETE",
//     })
//   }
// }

// // Import types
// import type { Station, CreateStationDto, UpdateStationDto } from "./types"























// import { API_BASE_URL } from "@/lib/constants"

// export class StationAPI {
//   static uploadStationDocument: any
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

//   // Station CRUD operations
//   static async getAllStations(): Promise<Station[]> {
//     console.log("📡 API: Getting all stations")
//     const result = await this.request<Station[]>("/stations")
//     console.log("📦 API: All stations received, count:", result.length)
//     return result
//   }

//   static async getStationById(id: string): Promise<Station> {
//     console.log("📡 API: Getting station by ID:", id)
//     const result = await this.request<Station>(`/stations/${id}`)
//     console.log("📦 API: Station data received:", result)
//     return result
//   }

//   static async createStation(dto: CreateStationDto): Promise<Station> {
//     console.log("📡 API: Creating station with DTO:", dto)

//     // Clean the DTO to remove any undefined values
//     const cleanDto = {
//       stationId: dto.stationId,
//       stationName: dto.stationName,
//       location: dto.location,
//       status: dto.status,
//       description: dto.description || "",
//       operator: dto.operator || "",
//       priority: dto.priority, // Include priority
//       Note: dto.Note || "", // Include Note field
//       // Only include if arrays exist and have items
//       ...(dto.specifications && dto.specifications.length > 0 && { specifications: dto.specifications }),
//       ...(dto.documentations && dto.documentations.length > 0 && { documentations: dto.documentations }),
//       ...(dto.flowcharts && dto.flowcharts.length > 0 && { flowcharts: dto.flowcharts }),
//     }

//     console.log("📤 API: Sending cleaned DTO:", cleanDto)

//     const result = await this.request<Station>("/stations", {
//       method: "POST",
//       body: JSON.stringify(cleanDto),
//     })

//     console.log("📦 API: Station created successfully:", result)
//     return result
//   }

//   static async updateStation(id: string, dto: UpdateStationDto): Promise<Station> {
//     console.log("Updating station with DTO:", dto)
//     return this.request<Station>(`/stations/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(dto),
//     })
//   }

//   static async deleteStation(id: string): Promise<void> {
//     return this.request<void>(`/stations/${id}`, {
//       method: "DELETE",
//     })
//   }

//   // Station Specification operations
//   static async createStationSpecification(data: {
//     specificationId: string
//     stationId: string
//     value: string
//     unit?: string
//   }): Promise<any> {
//     return this.request<any>("/station-specifications", {
//       method: "POST",
//       body: JSON.stringify(data),
//     })
//   }

//   static async uploadStationSpecificationFile(
//     file: File,
//     specificationId: string,
//     stationId: string,
//     unit?: string,
//   ): Promise<any> {
//     const formData = new FormData()
//     formData.append("file", file)
//     formData.append("specificationId", specificationId)
//     formData.append("stationId", stationId)

//     if (unit) {
//       formData.append("unit", unit)
//     }

//     const url = `${API_BASE_URL}/station-specifications/upload`

//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         body: formData,
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
//       console.error(`API Request failed for /station-specifications/upload:`, error)
//       throw error
//     }
//   }

//   static async getAllStationSpecifications(): Promise<any[]> {
//     return this.request<any[]>("/station-specifications")
//   }

//   static async getStationSpecificationById(id: string): Promise<any> {
//     return this.request<any>(`/station-specifications/${id}`)
//   }

//   static async updateStationSpecification(
//     id: string,
//     data: {
//       value?: string
//       unit?: string
//     },
//   ): Promise<any> {
//     return this.request<any>(`/station-specifications/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(data),
//     })
//   }

//   static async deleteStationSpecification(id: string): Promise<void> {
//     return this.request<void>(`/station-specifications/${id}`, {
//       method: "DELETE",
//     })
//   }
// }

// // Import types
// import type { Station, CreateStationDto, UpdateStationDto } from "./types"











"use client";

import { API_BASE_URL } from "@/lib/constants";
import { getAccessToken } from "@/lib/auth";           // ① NEW

export class StationAPI {
  /*───────────────────────── core helper ─────────────────────────*/
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAccessToken();                    // ② fetch token

    /* base headers */
    const baseHeaders: HeadersInit = {
      ...(options.body instanceof FormData
        ? {}                             // let browser set multipart boundary
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // ③ token header
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers: baseHeaders });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error("API Error Details:", errorData);
        } catch (parseErr) {
          console.error("Could not parse error response:", parseErr);
        }
        throw new Error(errorMessage);
      }
      return response.json();
    } catch (err) {
      console.error(`API Request failed for ${endpoint}:`, err);
      throw err;
    }
  }

  /*───────────────────────── CRUD methods ───────────────────────*/
  static async getAllStations() {
    return this.request<Station[]>("/stations");
  }

  static async getStationById(id: string) {
    return this.request<Station>(`/stations/${id}`);
  }

  static async createStation(dto: CreateStationDto) {
    /* strip undefined fields for clean DTO (unchanged) */
    const cleanDto = {
      stationId: dto.stationId,
      stationName: dto.stationName,
      location: dto.location,
      status: dto.status,
      description: dto.description || "",
      operator: dto.operator || "",
      priority: dto.priority,
      Note: dto.Note || "",
      ...(dto.specifications?.length && { specifications: dto.specifications }),
      ...(dto.documentations?.length && { documentations: dto.documentations }),
      ...(dto.flowcharts?.length && { flowcharts: dto.flowcharts }),
    };

    return this.request<Station>("/stations", {
      method: "POST",
      body: JSON.stringify(cleanDto),
    });
  }

  static async updateStation(id: string, dto: UpdateStationDto) {
    return this.request<Station>(`/stations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dto),
    });
  }

  static async deleteStation(id: string) {
    return this.request<void>(`/stations/${id}`, { method: "DELETE" });
  }

  /*──────────── station‑specification & file upload helpers ─────*/
  static async uploadStationSpecificationFile(
    file: File,
    specificationId: string,
    stationId: string,
    unit?: string,
  ) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("specificationId", specificationId);
    formData.append("stationId", stationId);
    if (unit) formData.append("unit", unit);

    /* Note: request() adds the Authorization header automatically */
    return this.request<any>("/station-specifications/upload", {
      method: "POST",
      body: formData,
    });
  }

  /* remaining specification CRUD unchanged … */
}

/* types */
import type {
  Station,
  CreateStationDto,
  UpdateStationDto,
} from "./types";
