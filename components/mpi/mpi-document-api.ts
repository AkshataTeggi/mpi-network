import { API_BASE_URL } from "@/lib/constants"

class MPIDocumentationAPI {
  private static baseUrl = `${API_BASE_URL}/mpi-document`

  static async uploadDocument(mpiId: string, file: File, description?: string) {
    try {
      console.log(`📤 MPIDocumentationAPI.uploadDocument called for MPI: ${mpiId}`)
      console.log(`📄 File: ${file.name} (${file.size} bytes)`)
      console.log(`📝 Description: ${description || "No description"}`)

      // Validate inputs
      if (!mpiId || mpiId.trim().length === 0) {
        throw new Error("MPI ID is required and cannot be empty")
      }

      if (!file) {
        throw new Error("File is required")
      }

      const formData = new FormData()
      formData.append("file", file)

      // Only append description if provided and not empty
      if (description && description.trim()) {
        formData.append("description", description.trim())
      }

      // Log FormData contents
      console.log("📋 FormData contents:")
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
        } else {
          console.log(`  ${key}: ${value}`)
        }
      }

      // Use the correct API endpoint that matches your backend: /:mpiId/upload
      const uploadUrl = `${this.baseUrl}/${mpiId}/upload`
      console.log(`🌐 Uploading to: ${uploadUrl}`)

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      })

      console.log(`📡 Upload response status: ${response.status}`)
      console.log(`📡 Upload response headers:`, Object.fromEntries(response.headers.entries()))

      // Get response text first to see what we're dealing with
      const responseText = await response.text()
      console.log(`📄 Raw response text:`, responseText)

      if (!response.ok) {
        console.error("❌ Upload failed with status:", response.status)
        console.error("❌ Response text:", responseText)

        // Try to parse as JSON for error details
        let errorData = {}
        try {
          errorData = JSON.parse(responseText)
        } catch (e) {
          console.warn("Could not parse error response as JSON")
        }

        throw new Error(errorData.message || `HTTP error! status: ${response.status} - ${responseText}`)
      }

      // Try to parse the successful response
      let result
      try {
        result = JSON.parse(responseText)
        console.log("✅ Upload API Success Response:", result)
      } catch (e) {
        console.error("❌ Could not parse success response as JSON:", responseText)
        throw new Error("Invalid JSON response from server")
      }

      return result
    } catch (error) {
      console.error("💥 MPI document upload error:", error)
      console.error("💥 Error stack:", error.stack)
      throw error
    }
  }

  static async getDocuments(mpiId: string) {
    try {
      console.log(`📥 Getting documents for MPI: ${mpiId}`)

      const response = await fetch(`${this.baseUrl}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Get documents success:", result)

      // Filter documents by MPI ID on the frontend since backend returns all
      const filteredDocs = result.filter((doc: any) => doc.mpiId === mpiId)
      return filteredDocs
    } catch (error) {
      console.error("❌ Failed to get MPI documents:", error)
      throw error
    }
  }

  static async deleteDocument(documentId: string) {
    try {
      console.log(`🗑️ Deleting document: ${documentId}`)

      const response = await fetch(`${this.baseUrl}/${documentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Delete document success:", result)
      return result
    } catch (error) {
      console.error("❌ Failed to delete MPI document:", error)
      throw error
    }
  }
}

export { MPIDocumentationAPI }












