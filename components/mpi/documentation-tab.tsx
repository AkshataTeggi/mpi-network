
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye } from "lucide-react"

interface MPIDocumentation {
  id?: string
  fileUrl?: string
  description: string
  fileName?: string
  originalFileName?: string
  isUploaded?: boolean
}

interface DocumentationTabProps {
  mpiDocumentation: MPIDocumentation[]
  uploadingMpiDoc: boolean
  onDocumentUpload: (file: File, description: string, fileName?: string) => Promise<void>
  onRemoveDocument: (index: number) => void
  toast: any
}

export function DocumentationTab({
  mpiDocumentation,
  uploadingMpiDoc,
  onDocumentUpload,
  onRemoveDocument,
  toast,
}: DocumentationTabProps) {
  const handleUploadClick = async () => {
    console.log("🔄 handleUploadClick called - QUEUE MODE (NO IMMEDIATE UPLOAD)")

    const fileInput = document.getElementById("mpi-doc-file") as HTMLInputElement
    const descInput = document.getElementById("mpi-doc-description") as HTMLInputElement
    const fileNameInput = document.getElementById("mpi-doc-filename") as HTMLInputElement

    const file = fileInput?.files?.[0]
    const description = descInput?.value?.trim() || ""
    const customFileName = fileNameInput?.value?.trim() || ""

    if (!file) {
      toast({
        title: "Missing File",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("💾 QUEUING document for upload after MPI creation...")
      console.log("📄 Document details:", {
        originalFileName: file.name,
        customFileName: customFileName || "Not provided",
        description: description || "Not provided",
        fileSize: file.size,
      })

      // Use custom filename if provided, otherwise use original filename
      const finalFileName = customFileName || file.name

      // Use description if provided, otherwise use filename as description
      const finalDescription = description || finalFileName

      console.log("📋 Final document metadata:", {
        description: finalDescription,
        fileName: finalFileName,
        originalFileName: file.name,
      })

      // QUEUE the file locally - DO NOT UPLOAD YET
      await onDocumentUpload(file, finalDescription, finalFileName)

      // Clear inputs after successful queuing
      fileInput.value = ""
      descInput.value = ""
      if (fileNameInput) {
        fileNameInput.value = ""
      }

      console.log("✅ Document queued successfully")

      toast({
        title: "Document Queued",
        description: `"${finalDescription}" has been queued for upload when the MPI is created.`,
      })
    } catch (error) {
      console.error("❌ Document queuing failed:", error)
      toast({
        title: "Queue Failed",
        description: error.message || "Failed to queue document. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardContent className="mt-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Upload Files</h3>
              </div>
            </div>

            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mpi-doc-file">Select Files *</Label>
                    <Input
                      id="mpi-doc-file"
                      type="file"
                      accept="*/*"
                      className="cursor-pointer"
                      disabled={uploadingMpiDoc}
                    />
                  </div>

                  <div className=" gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mpi-doc-description">Description</Label>
                      <Input
                        id="mpi-doc-description"
                        placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
                        disabled={uploadingMpiDoc}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingMpiDoc}
                  onClick={handleUploadClick}
                  className="w-full bg-transparent"
                >
                  {uploadingMpiDoc ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      {/* Queuing Document... */}
                    </div>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Queued Documents List */}
            {mpiDocumentation.length > 0 && (
              <div className="space-y-3">
                <div className="space-y-2">
                  {mpiDocumentation.map((doc, index) => (
                    <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded border">
                      <div className="flex items-start gap-3 flex-1">
                        <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{doc.description}</p>
                              <div className="mt-1 space-y-1">
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Filename:</span>{" "}
                                  {doc.fileName || doc.originalFileName || "Unknown"}
                                </p>
                                {doc.originalFileName && doc.fileName !== doc.originalFileName && (
                                  <p className="text-xs text-gray-500">
                                    <span className="font-medium">Original:</span> {doc.originalFileName}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-2">
                            {doc.isUploaded && doc.fileUrl ? (
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                  ✅ Uploaded Successfully
                                </Badge>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(doc.fileUrl, "_blank")}
                                  className="h-6 px-2 text-xs"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            console.log(`🗑️ Removing document at index ${index}`)
                            onRemoveDocument(index)
                            toast({
                              title: "Document Removed",
                              description: "Document has been removed from the queue.",
                            })
                          }}
                          className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




