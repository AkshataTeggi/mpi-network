import { API_BASE_URL } from "@/lib/constants"

export interface StationMpiDocument {
  id: string
  fileUrl: string
  description?: string
  originalName?: string
  stationId: string
  mpiId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateStationMpiDocDto {
  description?: string
  stationId: string
  mpiId?: string
}

export interface UpdateStationMpiDocDto {
  description?: string
  stationId?: string
  mpiId?: string
}

export interface StationMpiDocFilter {
  stationId?: string
  mpiId?: string
}

export class StationMpiDocAPI {
  static async create(data: CreateStationMpiDocDto, file: File) {
    console.log("📤 StationMpiDocAPI.create called with:", {
      description: data.description,
      stationId: data.stationId,
      mpiId: data.mpiId,
      fileName: file.name,
      fileSize: file.size,
    })

    if (!data.stationId) {
      throw new Error("Station ID is required")
    }

    if (!data.mpiId) {
      throw new Error("MPI ID is required for linking station documents")
    }

    if (!file) {
      throw new Error("File is required")
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size exceeds 10MB limit")
    }

    const formData = new FormData()
    formData.append("files", file)
    formData.append("stationId", data.stationId)
    formData.append("description", data.description || file.name)
    formData.append("mpiId", data.mpiId)
    formData.append("originalName", file.name)

    const uploadUrl = `${API_BASE_URL}/station-mpi-documents/upload`
    console.log("📤 Sending request to:", uploadUrl)
    console.log("📋 FormData contents:", {
      stationId: data.stationId,
      mpiId: data.mpiId,
      description: data.description || file.name,
      originalName: file.name,
      fileSize: file.size,
    })

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      })

      console.log("📥 Response status:", response.status)
      console.log("📥 Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Upload failed with status:", response.status)
        console.error("❌ Error response:", errorText)
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log("✅ Upload successful, raw result:", result)

      // Validate the result
      if (!result) {
        throw new Error("Upload succeeded but no data returned")
      }

      // The backend returns an array, so we take the first item
      const document = Array.isArray(result) ? result[0] : result

      // Validate the document has required fields
      if (!document || !document.id) {
        console.error("❌ Invalid document structure:", document)
        throw new Error("Upload succeeded but returned invalid document data")
      }

      // Verify MPI linking
      if (document.mpiId !== data.mpiId) {
        console.warn("⚠️ Document MPI ID mismatch:", {
          expected: data.mpiId,
          actual: document.mpiId,
        })
      } else {
        console.log("✅ Document properly linked to MPI:", document.mpiId)
      }

      console.log("✅ Final document result:", {
        id: document.id,
        stationId: document.stationId,
        mpiId: document.mpiId,
        description: document.description,
        fileUrl: document.fileUrl,
      })

      return document
    } catch (error) {
      console.error("❌ StationMpiDocAPI.create error:", error)
      if (error.message?.includes("fetch")) {
        throw new Error("Network error: Unable to connect to server. Please check your connection.")
      }
      throw error
    }
  }

  static async findAll(filter?: StationMpiDocFilter) {
    let url = `${API_BASE_URL}/station-mpi-documents`

    if (filter) {
      const params = new URLSearchParams()
      if (filter.stationId) params.append("stationId", filter.stationId)
      if (filter.mpiId) params.append("mpiId", filter.mpiId)

      if (params.toString()) {
        url += `?${params.toString()}`
      }
    }

    console.log("🔍 Fetching station MPI documents from:", url)

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("📄 Fetched station MPI documents:", result)
      return result
    } catch (error) {
      console.error("❌ StationMpiDocAPI.findAll error:", error)
      throw error
    }
  }

  static async findOne(id: string) {
    const response = await fetch(`${API_BASE_URL}/station-mpi-documents/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  static async update(id: string, data: UpdateStationMpiDocDto) {
    const response = await fetch(`${API_BASE_URL}/station-mpi-documents/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  static async delete(id: string) {
    const response = await fetch(`${API_BASE_URL}/station-mpi-documents/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  static async download(id: string) {
    const response = await fetch(`${API_BASE_URL}/station-mpi-documents/${id}/download`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // This will trigger a download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `station-document-${id}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
}
