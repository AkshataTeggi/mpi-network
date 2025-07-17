

"use client"

import { SelectItem } from "@/components/ui/select"
import { Select, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Download, Eye, X, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import type { CreateMPIDto } from "./types"
import { StationAPI } from "../stations/station-api"
import type { Station } from "../stations/types"
import { useToast } from "@/hooks/use-toast"
import { MPIAPI } from "./mpi-api"
import { MPIFormTabs } from "./mpi-form-tabs"
import { MPIDocumentationAPI } from "./mpi-document-api"
import { MPIFormActions } from "./mpi-form-actions"
import { MPIFormHeader } from "./mpi-form-header"
import { API_BASE_URL } from "@/lib/constants"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MPIFormProps {
  onSubmit: (data: CreateMPIDto) => Promise<any>
  onCancel: () => void
  isLoading?: boolean
}

interface SpecificationValue {
  specificationId: string
  value: string
  fileUrl?: string
  unit?: string
}

interface ChecklistSection {
  id: string
  name: string
  description: string
  items: ChecklistItem[]
}

interface ChecklistItem {
  id: string
  description: string
  required: boolean
  remarks: string
  category?: string
  isActive: boolean
  createdBy: string
  sectionId: string
}

interface MPIDocumentation {
  id?: string
  file?: File
  fileUrl?: string
  description: string
  fileName: string
  isUploaded?: boolean
}

interface StationDocument {
  id?: string
  file?: File
  fileUrl?: string
  description: string
  fileName: string
  stationId: string
  isUploaded?: boolean
  uploadError?: string
  uploadStatus?: "pending" | "uploading" | "success" | "error"
}

interface UploadedStationDocument {
  id: string
  fileUrl: string
  description: string
  stationId: string
  mpiId: string
  createdAt: string
  station?: {
    id: string
    name: string
  }
}

export function MPIForm({ onSubmit, onCancel, isLoading }: MPIFormProps) {
  const [activeTab, setActiveTab] = useState("basic-info")
  const [formData, setFormData] = useState({
    jobId: "",
    assemblyId: "",
    customer: "",
    selectedStationIds: [],
  })

  // Order Form State
  const [orderFormData, setOrderFormData] = useState({
    OrderType: [] as string[], // Changed from orderType to OrderType
    distributionDate: "",
    requiredBy: "",
    internalOrderNumber: "",
    revision: "",
    otherAttachments: "",
    fileAction: [] as string[],
    markComplete: false,
    documentControlId: "",
    selectedServiceId: "",
  })

  // MPI Documentation State
  const [mpiDocumentation, setMpiDocumentation] = useState<MPIDocumentation[]>([])
  const [uploadingMpiDoc, setUploadingMpiDoc] = useState(false)

  // Station Documents State
  const [stationDocuments, setStationDocuments] = useState<Record<string, StationDocument[]>>({})
  const [uploadedStationDocuments, setUploadedStationDocuments] = useState<Record<string, UploadedStationDocument[]>>(
    {},
  )
  const [loadingUploadedDocs, setLoadingUploadedDocs] = useState<Record<string, boolean>>({})
  const [availableStations, setAvailableStations] = useState<Station[]>([])
  const [loadingStations, setLoadingStations] = useState(false)
  const [selectedStations, setSelectedStations] = useState<Station[]>([])
  const { toast } = useToast()

  // Enums state
  const [enums, setEnums] = useState<any>({})
  const [loadingEnums, setLoadingEnums] = useState(false)

  // Specification values state
  const [specificationValues, setSpecificationValues] = useState<Record<string, SpecificationValue>>({})
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())
  const [existingJobIds, setExistingJobIds] = useState<string[]>([])
  const [existingAssemblyIds, setExistingAssemblyIds] = useState<string[]>([])
  const [checkingIds, setCheckingIds] = useState(false)
  const [existingDocumentControlIds, setExistingDocumentControlIds] = useState<string[]>([])

  // Checklist state
  const [checklistTemplate, setChecklistTemplate] = useState<ChecklistSection[]>([])
  const [loadingChecklist, setLoadingChecklist] = useState(false)
  const [checklistData, setChecklistData] = useState<Record<string, any>>({})
  const [checklistModifications, setChecklistModifications] = useState<
    Record<string, { required: boolean; remarks: string }>
  >({})

  // Instructions state
  const [instructions, setInstructions] = useState<string[]>([])
  const [activeStationId, setActiveStationId] = useState<string | null>(null)
  const [stationViewMode, setStationViewMode] = useState<"specifications" | "documents" | "notes">("specifications")

  // Post-upload state
  const [createdMpiId, setCreatedMpiId] = useState<string | null>(null)
  const [refreshingData, setRefreshingData] = useState(false)

  useEffect(() => {
    loadStations()
    loadEnums()
    loadExistingIds()
    loadChecklistTemplate()
  }, [])

  useEffect(() => {
    const selected = availableStations.filter((station) => formData.selectedStationIds.includes(station.id))
    setSelectedStations(selected)
  }, [formData.selectedStationIds, availableStations])

  // Load uploaded station documents when MPI is created
  useEffect(() => {
    if (createdMpiId && formData.selectedStationIds.length > 0) {
      loadUploadedStationDocuments(createdMpiId)
    }
  }, [createdMpiId, formData.selectedStationIds])

  const loadStations = async () => {
    try {
      setLoadingStations(true)
      const stations = await StationAPI.getAllStations()
      setAvailableStations(stations)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load stations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingStations(false)
    }
  }

  const loadEnums = async () => {
    try {
      setLoadingEnums(true)
      const enumsData = await MPIAPI.getEnums()
      setEnums(enumsData)
    } catch (error) {
      toast({
        title: "Warning",
        description: "Failed to load form options.",
        variant: "destructive",
      })
    } finally {
      setLoadingEnums(false)
    }
  }

  const loadExistingIds = async () => {
    try {
      setCheckingIds(true)
      const mpis = await MPIAPI.getAllMPIs()
      const jobIds = mpis.map((mpi) => mpi.jobId.toLowerCase())
      const assemblyIds = mpis.map((mpi) => mpi.assemblyId.toLowerCase())
      const documentControlIds = mpis
        .filter((mpi) => mpi.orderForms && mpi.orderForms.length > 0)
        .flatMap((mpi) => mpi.orderForms.map((form) => form.documentControlId))
        .filter(Boolean)
        .map((id) => id.toLowerCase())

      setExistingJobIds(jobIds)
      setExistingAssemblyIds(assemblyIds)
      setExistingDocumentControlIds(documentControlIds)
    } catch (error) {
      // Error handling without debug logging
    } finally {
      setCheckingIds(false)
    }
  }

  const loadChecklistTemplate = async () => {
    try {
      setLoadingChecklist(true)
      const template = await MPIAPI.getChecklistTemplate()
      if (template && Array.isArray(template)) {
        const validSections = template
          .filter(
            (section) =>
              section && typeof section === "object" && section.name && Array.isArray(section.checklistItems),
          )
          .map((section, sectionIndex) => ({
            id: `section-${sectionIndex}`,
            name: section.name,
            description: `${section.name} quality control items`,
            items: (section.checklistItems || []).map((item: any, itemIndex: number) => ({
              id: `${section.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
              description: item.description || "No description",
              required: true,
              remarks: "",
              category: item.category || section.name,
              isActive: item.isActive !== undefined ? item.isActive : true,
              createdBy: item.createdBy || "System",
              sectionId: `section-${sectionIndex}`,
            })),
          }))

        setChecklistTemplate(validSections)
      } else {
        setChecklistTemplate([])
      }
    } catch (error) {
      toast({
        title: "Warning",
        description: "Failed to load checklist template. Using default checklist.",
        variant: "destructive",
      })
    } finally {
      setLoadingChecklist(false)
    }
  }

  const loadUploadedStationDocuments = async (mpiId: string, specificStationId?: string) => {
    try {
      // If specific station ID is provided, only load for that station
      const stationsToLoad = specificStationId ? [specificStationId] : formData.selectedStationIds

      for (const stationId of stationsToLoad) {
        // Skip if already loading for this station
        if (loadingUploadedDocs[stationId]) {
          continue
        }

        setLoadingUploadedDocs((prev) => ({ ...prev, [stationId]: true }))

        // Load documents for this specific station
        const response = await fetch(`${API_BASE_URL}/station-mpi-documents/by-station/${stationId}?mpiId=${mpiId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            // No documents found for this station - that's okay
            setUploadedStationDocuments((prev) => ({ ...prev, [stationId]: [] }))
            continue
          }
          throw new Error(`Failed to fetch station documents: ${response.status}`)
        }

        const documents = await response.json()

        // Filter to only include documents for this MPI
        const filteredDocs = documents.filter((doc: any) => doc.mpiId === mpiId)

        setUploadedStationDocuments((prev) => ({
          ...prev,
          [stationId]: filteredDocs,
        }))
      }

      // Show success message with total document count
      const totalDocs = Object.values(uploadedStationDocuments).flat().length
      if (totalDocs > 0) {
        toast({
          title: "📁 Documents Loaded",
          description: `Found ${totalDocs} uploaded station document(s) for this MPI.`,
          variant: "default",
        })
      }
    } catch (error) {
      toast({
        title: "Warning",
        description: "Failed to load uploaded station documents.",
        variant: "destructive",
      })
    } finally {
      // Clear loading states
      setLoadingUploadedDocs((prev) => {
        const newState = { ...prev }
        const stationsToLoad = specificStationId ? [specificStationId] : formData.selectedStationIds
        stationsToLoad.forEach((stationId) => {
          newState[stationId] = false
        })
        return newState
      })
    }
  }

  const handleChecklistItemChange = (itemId: string, field: "required" | "remarks", value: boolean | string) => {
    setChecklistModifications((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }))
  }

  const getChecklistItemValue = (itemId: string, field: "required" | "remarks", defaultValue: boolean | string) => {
    return checklistModifications[itemId]?.[field] ?? defaultValue
  }

  // Instruction handlers
  const handleAddInstruction = () => {
    setInstructions((prev) => [...prev, ""])
  }

  const handleInstructionChange = (index: number, value: string) => {
    setInstructions((prev) => prev.map((instruction, i) => (i === index ? value : instruction)))
  }

  const handleRemoveInstruction = (index: number) => {
    setInstructions((prev) => prev.filter((_, i) => i !== index))
    toast({
      title: "Instruction Removed",
      description: "Instruction has been removed from the list.",
    })
  }

  // Station Document handlers
  const handleStationDocumentUpload = async (stationId: string, file: File, description: string) => {
    try {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 10MB limit`)
      }

      // During MPI creation, we queue the documents locally
      const newDoc: StationDocument = {
        file: file,
        description: description.trim() || file.name,
        fileName: file.name,
        stationId: stationId,
        isUploaded: false,
        uploadStatus: "pending",
      }

      setStationDocuments((prev) => ({
        ...prev,
        [stationId]: [...(prev[stationId] || []), newDoc],
      }))

      toast({
        title: "Document Queued",
        description: `"${newDoc.description}" will be uploaded after MPI creation.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to queue document.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleStationDocumentRemove = (stationId: string, documentIndex: number) => {
    setStationDocuments((prev) => ({
      ...prev,
      [stationId]: (prev[stationId] || []).filter((_, index) => index !== documentIndex),
    }))
    toast({
      title: "Document Removed",
      description: "Station document has been removed from the list.",
    })
  }

  // MPI Documentation handlers
  const handleMpiDocumentUpload = async (file: File, description: string) => {
    setUploadingMpiDoc(true)
    try {
      // Validate file
      if (!file) {
        throw new Error("No file selected")
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 10MB limit`)
      }

      const finalDescription = description.trim() || file.name

      // Store the file locally until MPI is created - DO NOT UPLOAD
      const newDoc: MPIDocumentation = {
        file: file, // Store the actual file object
        description: finalDescription,
        fileName: file.name,
        isUploaded: false, // Mark as not uploaded yet
      }

      setMpiDocumentation((prev) => {
        const updated = [...prev, newDoc]
        return updated
      })

      toast({
        title: "✅ Document Queued",
        description: `"${finalDescription}" has been queued and will be uploaded AFTER the MPI is created.`,
      })
    } catch (error) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to queue document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingMpiDoc(false)
    }
  }

  const removeMpiDocument = (index: number) => {
    setMpiDocumentation((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      return updated
    })
    toast({
      title: "Document Removed",
      description: "Document has been removed from the list.",
    })
  }

  const validateJobId = (jobId: string): string | null => {
    if (!jobId.trim()) return "Job ID is required"
    if (jobId.length < 2) return "Job ID must be at least 2 characters"
    if (existingJobIds.includes(jobId.toLowerCase())) {
      return `Job ID "${jobId}" already exists. Please use a different Job ID.`
    }
    return null
  }

  const validateAssemblyId = (assemblyId: string): string | null => {
    if (!assemblyId.trim()) return "Assembly ID is required"
    if (assemblyId.length < 2) return "Assembly ID must be at least 2 characters"
    if (existingAssemblyIds.includes(assemblyId.toLowerCase())) {
      return `Assembly ID "${assemblyId}" already exists. Please use a different Assembly ID.`
    }
    return null
  }

  const validateDocumentControlId = (documentControlId: string): string | null => {
    if (!documentControlId.trim()) return null
    if (documentControlId.length < 2) return "Document Control ID must be at least 2 characters"
    if (existingDocumentControlIds.includes(documentControlId.toLowerCase())) {
      return `Document Control ID "${documentControlId}" already exists. Please use a different ID.`
    }
    return null
  }

  const handleOrderFormChange = (field: string, value: string | boolean | string[]) => {
    setOrderFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Enhanced station document upload with detailed debugging
  const uploadStationDocumentWithDebug = async (
    mpiId: string,
    stationId: string,
    doc: StationDocument,
    docIndex: number,
  ) => {
    // Update status to uploading
    setStationDocuments((prev) => ({
      ...prev,
      [stationId]: prev[stationId].map((d, i) => (i === docIndex ? { ...d, uploadStatus: "uploading" } : d)),
    }))

    try {
      if (!doc.file) {
        throw new Error("No file object found")
      }

      // Create FormData
      const formData = new FormData()
      formData.append("files", doc.file)
      formData.append("stationId", stationId)
      formData.append("description", doc.description)
      formData.append("mpiId", mpiId)
      formData.append("originalName", doc.fileName)

      const uploadUrl = `${API_BASE_URL}/station-mpi-documents/upload`

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const uploadResult = await response.json()

      // Update status to success
      setStationDocuments((prev) => ({
        ...prev,
        [stationId]: prev[stationId].map((d, i) =>
          i === docIndex
            ? {
                ...d,
                uploadStatus: "success",
                isUploaded: true,
                id: uploadResult[0]?.id,
                fileUrl: uploadResult[0]?.fileUrl,
              }
            : d,
        ),
      }))

      return uploadResult
    } catch (error) {
      // Update status to error
      setStationDocuments((prev) => ({
        ...prev,
        [stationId]: prev[stationId].map((d, i) =>
          i === docIndex
            ? {
                ...d,
                uploadStatus: "error",
                uploadError: error.message,
              }
            : d,
        ),
      }))
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation - Reload existing IDs first
    await loadExistingIds()

    // Enhanced validation with better error messages
    const jobIdError = validateJobId(formData.jobId)
    const assemblyIdError = validateAssemblyId(formData.assemblyId)
    const documentControlIdError = orderFormData.documentControlId
      ? validateDocumentControlId(orderFormData.documentControlId)
      : null

    const validationErrors = []
    if (jobIdError) validationErrors.push(`Job ID: ${jobIdError}`)
    if (assemblyIdError) validationErrors.push(`Assembly ID: ${assemblyIdError}`)
    if (documentControlIdError) validationErrors.push(`Document Control ID: ${documentControlIdError}`)

    // Check for required fields
    if (!formData.jobId.trim()) validationErrors.push("Job ID is required")
    if (!formData.assemblyId.trim()) validationErrors.push("Assembly ID is required")

    if (validationErrors.length > 0) {
      toast({
        title: "❌ Validation Failed",
        description: (
          <div className="space-y-2">
            <p className="font-semibold">Please fix the following issues:</p>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        ),
        variant: "destructive",
        duration: 10000,
      })
      setActiveTab("basic-info")
      return
    }

    // Prepare submission data
    const checklistsData =
      checklistTemplate.length > 0
        ? checklistTemplate
            .map((section) => {
              const itemsToInclude = (section.items || [])
                .filter((item) => {
                  const modifications = checklistModifications[item.id]
                  const currentRequired = modifications?.required ?? item.required
                  return currentRequired
                })
                .map((item) => {
                  const modifications = checklistModifications[item.id]
                  return {
                    description: item.description,
                    required: modifications?.required ?? item.required,
                    remarks: modifications?.remarks ?? item.remarks,
                    createdBy: item.createdBy || "System",
                    isActive: item.isActive !== undefined ? item.isActive : true,
                    category: item.category || section.name,
                  }
                })

              return itemsToInclude.length > 0
                ? {
                    name: section.name,
                    checklistItems: itemsToInclude,
                  }
                : null
            })
            .filter(Boolean)
        : []

    const stationsData = formData.selectedStationIds
      .map((stationId) => {
        const station = selectedStations.find((s) => s.id === stationId)
        if (!station) return null

        const stationSpecValues =
          station.specifications
            ?.map((spec) => {
              const specValue = specificationValues[spec.id]
              if (specValue && specValue.value) {
                return {
                  specificationId: spec.id,
                  value: specValue.value,
                  ...(specValue.unit && { unit: specValue.unit }),
                }
              }
              return null
            })
            .filter(Boolean) || []

        return {
          id: station.id,
          ...(stationSpecValues.length > 0 && { specificationValues: stationSpecValues }),
        }
      })
      .filter(Boolean)

   const orderFormsData = [
  {
    // Make it an array with a single object
    OrderType: orderFormData.OrderType || [],
    ...(orderFormData.distributionDate && {
      distributionDate: new Date(orderFormData.distributionDate).toISOString(),
    }),
    ...(orderFormData.requiredBy && {
      requiredBy: new Date(orderFormData.requiredBy).toISOString(),
    }),
    ...(orderFormData.internalOrderNumber && { internalOrderNumber: orderFormData.internalOrderNumber }),
    ...(orderFormData.revision && { revision: orderFormData.revision }),
    ...(orderFormData.otherAttachments && { otherAttachments: orderFormData.otherAttachments }),
    ...(orderFormData.fileAction.length > 0 && {
      fileAction: orderFormData.fileAction,
    }),
    markComplete: orderFormData.markComplete,
    ...(orderFormData.documentControlId && { documentControlId: orderFormData.documentControlId }),
    // Add service ID mapping
    ...(orderFormData.selectedServiceId && {
      serviceIds: [orderFormData.selectedServiceId], // Convert single ID to array
    }),
  },
]

    const validInstructions = instructions.filter((instruction) => instruction.trim() !== "")

    const submitData: CreateMPIDto = {
      jobId: formData.jobId,
      assemblyId: formData.assemblyId,
    }

    if (formData.customer && formData.customer.trim()) {
      submitData.customer = formData.customer
    }

    if (validInstructions.length > 0) {
      submitData.Instruction = validInstructions
    }

   submitData.orderForms = orderFormsData

    if (stationsData.length > 0) {
      submitData.stations = stationsData
    }

    if (checklistsData.length > 0) {
      submitData.checklists = checklistsData
    }

    try {
      const result = await onSubmit(submitData)

      // Enhanced MPI ID extraction
      const mpiId = result?.id || result?.mpiId || result?.data?.id || result?.data?.mpiId

      if (!mpiId) {
        throw new Error("MPI ID could not be extracted from creation result")
      }

      // Store the created MPI ID for later use
      setCreatedMpiId(mpiId)

      // STEP 2: Upload MPI documents
      const mpiDocResults = { uploaded: 0, failed: 0, errors: [] }
      if (mpiDocumentation.length > 0) {
        for (const [index, doc] of mpiDocumentation.entries()) {
          if (doc.file && !doc.isUploaded) {
            try {
              await MPIDocumentationAPI.uploadDocument(mpiId, doc.file, doc.description)
              mpiDocResults.uploaded++
            } catch (uploadError) {
              mpiDocResults.failed++
              mpiDocResults.errors.push(`MPI Document "${doc.description}": ${uploadError.message}`)
            }
          }
        }
      }

      // STEP 3: Upload Station documents
      const stationDocResults = { uploaded: 0, failed: 0, errors: [] }
      const totalStationDocs = Object.keys(stationDocuments).reduce(
        (total, stationId) => total + stationDocuments[stationId].length,
        0,
      )

      if (totalStationDocs > 0) {
        for (const [stationId, docs] of Object.entries(stationDocuments)) {
          for (const [index, doc] of docs.entries()) {
            if (doc.file && !doc.isUploaded) {
              try {
                const uploadResult = await uploadStationDocumentWithDebug(mpiId, stationId, doc, index)
                stationDocResults.uploaded++
              } catch (uploadError) {
                stationDocResults.failed++
                const errorMsg = `Station document "${doc.description}": ${uploadError.message}`
                stationDocResults.errors.push(errorMsg)
              }
            }
          }
        }

        // STEP 4: Refresh the uploaded documents display
        if (stationDocResults.uploaded > 0) {
          await loadUploadedStationDocuments(mpiId)
        }
      }

      // Final summary
      const totalUploaded = mpiDocResults.uploaded + stationDocResults.uploaded
      const totalFailed = mpiDocResults.failed + stationDocResults.failed
      const allErrors = [...mpiDocResults.errors, ...stationDocResults.errors]

      if (totalFailed > 0) {
        toast({
          title: "⚠️ Partial Success",
          description: (
            <div className="space-y-2">
              <p>
                MPI created successfully. {totalUploaded} documents uploaded, {totalFailed} failed.
              </p>
              {allErrors.length > 0 && (
                <details className="text-xs">
                  <summary>View errors</summary>
                  <ul className="list-disc list-inside mt-1">
                    {allErrors.slice(0, 3).map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                    {allErrors.length > 3 && <li>...and {allErrors.length - 3} more</li>}
                  </ul>
                </details>
              )}
            </div>
          ),
          variant: "destructive",
          duration: 15000,
        })
      } else if (totalUploaded > 0) {
        toast({
          title: "✅ Complete Success",
          description: `MPI created successfully with ${totalUploaded} document(s) uploaded!`,
          variant: "default",
        })
      } else {
        toast({
          title: "✅ Success",
          description: "MPI created successfully!",
          variant: "default",
        })
      }
    } catch (error: any) {
      // Handle specific error types
      if (error.message?.includes("Unique constraint failed")) {
        if (error.message?.includes("documentControlId")) {
          toast({
            title: "🚫 Duplicate Document Control ID",
            description: `Document Control ID "${orderFormData.documentControlId}" already exists.`,
            variant: "destructive",
            duration: 10000,
          })
          setActiveTab("basic-info")
          await loadExistingIds()
          return
        } else if (error.message?.includes("jobId")) {
          toast({
            title: "🚫 Duplicate Job ID",
            description: `Job ID "${formData.jobId}" already exists.`,
            variant: "destructive",
            duration: 10000,
          })
          setActiveTab("basic-info")
          await loadExistingIds()
          return
        } else if (error.message?.includes("assemblyId")) {
          toast({
            title: "🚫 Duplicate Assembly ID",
            description: `Assembly ID "${formData.assemblyId}" already exists.`,
            variant: "destructive",
            duration: 10000,
          })
          setActiveTab("basic-info")
          await loadExistingIds()
          return
        }
      }

      toast({
        title: "❌ MPI Creation Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
        duration: 10000,
      })
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStationSelectionChange = (stationIds: string[]) => {
    setFormData((prev) => ({ ...prev, selectedStationIds: stationIds }))
  }

  const handleSpecificationValueChange = (specificationId: string, value: string, unit?: string) => {
    setSpecificationValues((prev) => ({
      ...prev,
      [specificationId]: {
        specificationId,
        value,
        ...(unit && { unit }),
      },
    }))
  }

  const handleFileUpload = async (specificationId: string, file: File, stationId: string, unit?: string) => {
    const uploadKey = `${specificationId}-${stationId}`
    setUploadingFiles((prev) => new Set(prev).add(uploadKey))

    try {
      const result = await StationAPI.uploadStationSpecificationFile(file, specificationId, stationId, unit)

      setSpecificationValues((prev) => ({
        ...prev,
        [specificationId]: {
          specificationId,
          value: result.value || result.fileUrl,
          fileUrl: result.fileUrl,
          ...(unit && { unit }),
        },
      }))

      toast({
        title: "Success",
        description: "File uploaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(uploadKey)
        return newSet
      })
    }
  }

  const renderSpecificationInput = (spec: any, stationId: string) => {
    const specValue = specificationValues[spec.id]
    const uploadKey = `${spec.id}-${stationId}`
    const isUploading = uploadingFiles.has(uploadKey)

    // Use the same logic as the edit form
    const inputType = spec.inputType || spec.type || "TEXT"

    console.log(`🔍 Rendering specification input:`, {
      specId: spec.id,
      specName: spec.name,
      inputType: inputType,
      originalSpec: spec,
    })

    switch (inputType) {
      case "TEXT":
        return (
          <div key={spec.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {spec.name}
                {spec.required && <span className="text-green-500 ml-1">*</span>}
              </Label>
            </div>
            {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
            <Input
              value={specValue?.value || ""}
              onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value)}
              placeholder={`Enter ${spec.name.toLowerCase()}`}
              className="h-10"
            />
          </div>
        )

      case "number":
        return (
          <div key={spec.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {spec.name}
                {spec.required && <span className="text-green-500 ml-1">*</span>}
              </Label>
            </div>
            {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
            <div className="flex gap-2">
              <Input
                type="number"
                value={specValue?.value || ""}
                onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value, specValue?.unit)}
                placeholder={`Enter ${spec.name.toLowerCase()}`}
                className="h-10 flex-1"
              />
              <Input
                placeholder="Unit"
                value={specValue?.unit || ""}
                onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
                className="h-10 w-20"
              />
            </div>
          </div>
        )

      case "CHECKBOX":
        return (
          <div key={spec.id} className="space-y-3">
            {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={specValue?.value === "true"}
                onCheckedChange={(checked) => handleSpecificationValueChange(spec.id, checked ? "true" : "false")}
              />
              <Label className="text-sm font-medium">
                {spec.name}
                {spec.required && <span className="text-green-500 ml-1">*</span>}
              </Label>
            </div>
          </div>
        )

      case "DROPDOWN":
        const suggestions = spec.suggestions || []
        return (
          <div key={spec.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {spec.name}
                {spec.required && <span className="text-green-500 ml-1">*</span>}
              </Label>
            </div>
            {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
            <Select
              value={specValue?.value || ""}
              onValueChange={(value) => handleSpecificationValueChange(spec.id, value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {suggestions.map((suggestion: string, index: number) => (
                  <SelectItem key={index} value={suggestion}>
                    {suggestion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "FILE_UPLOAD":
        return (
          <div key={spec.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {spec.name}
                {spec.required && <span className="text-green-500 ml-1">*</span>}
              </Label>
              {specValue?.fileUrl && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(specValue.fileUrl, "_blank")}
                    className="h-7 px-2 text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = specValue.fileUrl
                      link.download = `${spec.name}-${stationId}`
                      link.click()
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFileUpload(spec.id, file, stationId, specValue?.unit)
                    }
                  }}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
                  className="cursor-pointer flex-1"
                  disabled={isUploading}
                />
                {isUploading && (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    <span className="text-xs text-muted-foreground">Uploading...</span>
                  </div>
                )}
              </div>
              <Input
                placeholder="Unit (optional)"
                value={specValue?.unit || ""}
                onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
                className="h-10 w-32"
              />
              {specValue?.fileUrl && (
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">File uploaded successfully</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
              </p>
            </div>
          </div>
        )

      default:
        return (
          <div key={spec.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {spec.name}
                {spec.required && <span className="text-green-500 ml-1">*</span>}
              </Label>
            </div>
            {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
            <Input
              value={specValue?.value || ""}
              onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value)}
              placeholder={`Enter ${spec.name.toLowerCase()}`}
              className="h-10"
            />
          </div>
        )
    }
  }

  const renderStationDocuments = (station: Station) => {
    const queuedDocs = stationDocuments[station.id] || []
    // FIXED: Get uploaded docs only for this specific station
    const uploadedDocs = uploadedStationDocuments[station.id] || []
    const isLoadingDocs = loadingUploadedDocs[station.id] || false

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Station Documents - {station.stationName}</h4>
          <div className="flex items-center gap-2">
            {isLoadingDocs && <RefreshCw className="w-4 h-4 animate-spin" />}
            <span className="text-sm text-gray-500">
              {queuedDocs.length} queued • {uploadedDocs.length} uploaded
            </span>
          </div>
        </div>

        {/* Uploaded Documents - Station Specific */}
        {uploadedDocs.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-green-700">✅ Uploaded Documents for {station.stationName}</h5>
            {uploadedDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">{doc.description}</p>
                    <p className="text-xs text-gray-500">
                      Station: {station.stationName} • Uploaded: {new Date(doc.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">MPI: {doc.mpiId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(doc.fileUrl, "_blank")}
                    className="h-7 px-2 text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = doc.fileUrl
                      link.download = doc.description
                      link.click()
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Queued Documents */}
        {queuedDocs.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-blue-700">📋 Queued Documents for {station.stationName}</h5>
            {queuedDocs.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{doc.description}</p>
                    <p className="text-xs text-gray-500">{doc.fileName}</p>
                    <p className="text-xs text-gray-400">
                      Status: {doc.uploadStatus || "pending"}
                      {doc.file && ` • ${(doc.file.size / 1024).toFixed(1)} KB`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.uploadStatus === "uploading" && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                  {doc.uploadStatus === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {doc.uploadStatus === "error" && (
                    <AlertCircle className="w-4 h-4 text-green-500" title={doc.uploadError} />
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleStationDocumentRemove(station.id, index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Station-Specific Refresh Button */}
        {createdMpiId && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => loadUploadedStationDocuments(createdMpiId, station.id)}
            disabled={isLoadingDocs}
            className="w-full"
          >
            {isLoadingDocs ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Refreshing {station.stationName} Documents...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh {station.stationName} Documents
              </>
            )}
          </Button>
        )}
      </div>
    )
  }

  const isFormValid = () => {
    const jobIdError = validateJobId(formData.jobId)
    const assemblyIdError = validateAssemblyId(formData.assemblyId)
    const documentControlIdError = orderFormData.documentControlId
      ? validateDocumentControlId(orderFormData.documentControlId)
      : null

    return !jobIdError && !assemblyIdError && !documentControlIdError
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-6">
        <MPIFormHeader onCancel={onCancel} />

        {/* MPI ID Display */}
        {createdMpiId && (
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>MPI Created:</strong> {createdMpiId}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => loadUploadedStationDocuments(createdMpiId)}
                    disabled={refreshingData}
                    className="ml-2"
                  >
                    {refreshingData ? "Refreshing..." : "Refresh Documents"}
                  </Button>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <MPIFormTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              documentationCount={mpiDocumentation.length}
              checklistCount={checklistTemplate.reduce((total, section) => total + section.items.length, 0)}
              selectedStationsCount={formData.selectedStationIds.length}
              formData={formData}
              orderFormData={orderFormData}
              enums={enums}
              loadingEnums={loadingEnums}
              checkingIds={checkingIds}
              onFormDataChange={handleChange}
              onOrderFormChange={handleOrderFormChange}
              validateJobId={validateJobId}
              validateAssemblyId={validateAssemblyId}
              validateDocumentControlId={validateDocumentControlId}
              mpiDocumentation={mpiDocumentation}
              uploadingMpiDoc={uploadingMpiDoc}
              onDocumentUpload={handleMpiDocumentUpload}
              onRemoveDocument={removeMpiDocument}
              toast={toast}
              checklistTemplate={checklistTemplate}
              loadingChecklist={loadingChecklist}
              checklistModifications={checklistModifications}
              onChecklistItemChange={handleChecklistItemChange}
              getChecklistItemValue={getChecklistItemValue}
              availableStations={availableStations}
              selectedStationIds={formData.selectedStationIds}
              loadingStations={loadingStations}
              activeStationId={activeStationId}
              stationViewMode={stationViewMode}
              specificationValues={specificationValues}
              uploadingFiles={uploadingFiles}
              onStationSelectionChange={handleStationSelectionChange}
              onActiveStationChange={setActiveStationId}
              onStationViewModeChange={setStationViewMode}
              onSpecificationValueChange={handleSpecificationValueChange}
              onFileUpload={handleFileUpload}
              renderSpecificationInput={renderSpecificationInput}
              renderStationDocuments={renderStationDocuments}
              instructions={instructions}
              onAddInstruction={handleAddInstruction}
              onInstructionChange={handleInstructionChange}
              onRemoveInstruction={handleRemoveInstruction}
              stationDocuments={stationDocuments}
              onStationDocumentUpload={handleStationDocumentUpload}
              onStationDocumentRemove={handleStationDocumentRemove}
            />
          </CardContent>
        </Card>

        <MPIFormActions isLoading={isLoading} isFormValid={isFormValid()} onCancel={onCancel} />
      </form>
    </div>
  )
}




