
// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   ArrowLeft,
//   Factory,
//   Info,
//   ClipboardList,
//   FileText,
//   Download,
//   Eye,
//   StickyNote,
//   Plus,
//   Trash2,
//   X,
//   Upload,
//   AlertCircle,
// } from "lucide-react"
// import type { MPI, UpdateMPIDto } from "./types"
// import { StationAPI } from "../stations/station-api"
// import type { Station } from "../stations/types"
// import { useToast } from "@/hooks/use-toast"
// import { MPIAPI } from "./mpi-api"
// import { MPIDocumentationAPI } from "./mpi-document-api"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"
// import { API_BASE_URL } from "@/lib/constants"

// interface MPIEditProps {
//   mpi: MPI
//   onSubmit: (data: UpdateMPIDto) => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
// }

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   fileUrl?: string
//   unit?: string
// }

// interface ChecklistSection {
//   id: string
//   name: string
//   description: string
//   items: ChecklistItem[]
// }

// interface ChecklistItem {
//   id: string
//   description: string
//   required: boolean
//   remarks: string
//   category?: string
//   isActive: boolean
//   createdBy: string
//   sectionId: string
// }

// interface MPIDocumentation {
//   id?: string
//   file?: File
//   fileUrl?: string
//   description: string
//   fileName: string
//   originalFileName?: string
//   isUploaded?: boolean
// }

// interface StationNote {
//   id?: string
//   content: string
//   createdAt?: string
//   updatedAt?: string
// }

// interface StationDocument {
//   id: string
//   fileUrl: string
//   description: string
//   stationId: string
//   mpiId?: string
//   createdAt: string
//   updatedAt: string
// }

// // Helper function to safely convert order type to array
// const normalizeOrderType = (orderType: any): string[] => {
//   if (!orderType) return []
//   if (Array.isArray(orderType)) return orderType.filter((type) => typeof type === "string")
//   if (typeof orderType === "string") return [orderType]
//   return []
// }

// // Helper function to safely convert file action to array
// const normalizeFileAction = (fileAction: any): string[] => {
//   if (!fileAction) return []
//   if (Array.isArray(fileAction)) return fileAction.filter((action) => typeof action === "string")
//   if (typeof fileAction === "string") return [fileAction]
//   return []
// }

// export function MPIEdit({ mpi, onSubmit, onCancel, isLoading }: MPIEditProps) {
//   const [activeTab, setActiveTab] = useState("basic-info")
//   const [formData, setFormData] = useState({
//     jobId: mpi.jobId || "",
//     assemblyId: mpi.assemblyId || "",
//     customer: mpi.customer || "",
//     selectedStationIds: mpi.stations?.map((s) => s.id) || [],
//   })

//   // Order Form State - Initialize with existing data
//    const [orderFormData, setOrderFormData] = useState({
//     id: mpi.orderForms?.[0]?.id || "",
//     orderType: normalizeOrderType(mpi.orderForms?.[0]?.orderType),
//     distributionDate: mpi.orderForms?.[0]?.distributionDate
//       ? new Date(mpi.orderForms[0].distributionDate).toISOString().split("T")[0]
//       : "",
//     requiredBy: mpi.orderForms?.[0]?.requiredBy
//       ? new Date(mpi.orderForms[0].requiredBy).toISOString().split("T")[0]
//       : "",
//     internalOrderNumber: mpi.orderForms?.[0]?.internalOrderNumber || "",
//     revision: mpi.orderForms?.[0]?.revision || "",
//     otherAttachments: mpi.orderForms?.[0]?.otherAttachments || "",
//     fileAction: normalizeFileAction(mpi.orderForms?.[0]?.fileAction),
//     markComplete: mpi.orderForms?.[0]?.markComplete || false,
//     documentControlId: mpi.orderForms?.[0]?.documentControlId || "",
//   })

//   // Instructions state - Initialize with existing data
//   const [instructions, setInstructions] = useState<string[]>(mpi.Instruction || [])

//   // Enums state
//   const [enums, setEnums] = useState<any>({})
//   const [loadingEnums, setLoadingEnums] = useState(false)

//   // Checklist template and existing checklist state
//   const [availableChecklistTemplate, setAvailableChecklistTemplate] = useState<ChecklistSection[]>([])
//   const [existingChecklists, setExistingChecklists] = useState<ChecklistSection[]>([])
//   const [loadingAvailableChecklist, setLoadingAvailableChecklist] = useState(false)

//   // Specification values state - Initialize with existing values
//   const [specificationValues, setSpecificationValues] = useState<Record<string, SpecificationValue>>(() => {
//     const initialValues: Record<string, SpecificationValue> = {}
//     console.log("🔍 Initializing specification values from MPI data:", mpi)

//     mpi.stations?.forEach((station) => {
//       console.log(`📍 Processing station: ${station.stationName} (${station.id})`)

//       station.specifications?.forEach((spec) => {
//         console.log(`🔧 Processing spec: ${spec.name} (${spec.id})`)

//         // Look for existing values in multiple places
//         let existingValue = null

//         // Method 1: Check stationSpecifications array
//         if (spec.stationSpecifications && spec.stationSpecifications.length > 0) {
//           existingValue = spec.stationSpecifications.find((ss) => ss.stationId === station.id)
//           console.log(`📋 Found in stationSpecifications:`, existingValue)
//         }

//         // Method 2: Check if there's a direct value on the spec
//         if (!existingValue && spec.value) {
//           existingValue = { value: spec.value, unit: spec.unit }
//           console.log(`📋 Found direct value on spec:`, existingValue)
//         }

//         // Method 3: Check station's specificationValues if it exists
//         if (!existingValue && station.specificationValues) {
//           const stationSpecValue = station.specificationValues.find((sv: any) => sv.specificationId === spec.id)
//           if (stationSpecValue) {
//             existingValue = { value: stationSpecValue.value, unit: stationSpecValue.unit }
//             console.log(`📋 Found in station specificationValues:`, existingValue)
//           }
//         }

//         if (existingValue && existingValue.value) {
//           initialValues[spec.id] = {
//             specificationId: spec.id,
//             value: existingValue.value,
//             unit: existingValue.unit || undefined,
//             fileUrl: existingValue.fileUrl || undefined,
//           }
//           console.log(`✅ Initialized spec ${spec.id} with value:`, initialValues[spec.id])
//         } else {
//           // Initialize with empty value for specs without existing data
//           initialValues[spec.id] = {
//             specificationId: spec.id,
//             value: "",
//             unit: undefined,
//             fileUrl: undefined,
//           }
//           console.log(`🆕 Initialized spec ${spec.id} with empty value`)
//         }
//       })
//     })

//     console.log("🎯 Final initial specification values:", initialValues)
//     return initialValues
//   })

//   const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())

//   // MPI Documentation State - Enhanced with proper filename handling
//   const [mpiDocumentation, setMpiDocumentation] = useState<MPIDocumentation[]>(() => {
//     // Initialize with existing MPI documents
//     return (
//       mpi.mpiDocs?.map((doc) => ({
//         id: doc.id,
//         fileUrl: doc.fileUrl,
//         description: doc.description,
//         fileName: doc.fileName || doc.description, // Use fileName if available, fallback to description
//         originalFileName: doc.originalFileName || doc.fileName || doc.description,
//         isUploaded: true,
//       })) || []
//     )
//   })

//   const [uploadingMpiDoc, setUploadingMpiDoc] = useState(false)

//   // Checklist modifications state - Initialize with existing checklist data
//   const [checklistModifications, setChecklistModifications] = useState<
//     Record<string, { required: boolean; remarks: string }>
//   >(() => {
//     const initialModifications: Record<string, { required: boolean; remarks: string }> = {}

//     // Initialize with existing checklist data
//     mpi.checklists?.forEach((checklist) => {
//       checklist.checklistItems?.forEach((item, itemIndex) => {
//         const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
//         initialModifications[itemId] = {
//           required: item.required,
//           remarks: item.remarks,
//         }
//       })
//     })

//     console.log("Initial checklist modifications:", initialModifications)
//     return initialModifications
//   })

//   const [availableStations, setAvailableStations] = useState<Station[]>([])
//   const [loadingStations, setLoadingStations] = useState(false)
//   const [selectedStations, setSelectedStations] = useState<Station[]>([])

//   // Station view state for instructions tab
//   const [activeStationId, setActiveStationId] = useState<string | null>(null)
//   const [stationViewMode, setStationViewMode] = useState<"specifications" | "documents" | "notes">("specifications")

//   // Station notes state
//   const [stationNotes, setStationNotes] = useState<Record<string, StationNote[]>>({})
//   const [loadingNotes, setLoadingNotes] = useState<Set<string>>(new Set())
//   const [newNoteContent, setNewNoteContent] = useState("")
//   const [addingNote, setAddingNote] = useState(false)

//   // Station documents state
//   const [stationDocuments, setStationDocuments] = useState<Record<string, StationDocument[]>>({})
//   const [loadingDocuments, setLoadingDocuments] = useState<Set<string>>(new Set())
//   const [uploadingStationDoc, setUploadingStationDoc] = useState(false)

//   // Validation state
//   const [existingJobIds, setExistingJobIds] = useState<string[]>([])
//   const [existingAssemblyIds, setExistingAssemblyIds] = useState<string[]>([])
//   const [existingDocumentControlIds, setExistingDocumentControlIds] = useState<string[]>([])
//   const [checkingIds, setCheckingIds] = useState(false)

//   const { toast } = useToast()

//   // Initialize station notes from MPI data
//   useEffect(() => {
//     const initialNotes: Record<string, StationNote[]> = {}
//     mpi.stations?.forEach((station) => {
//       if (station.Note && Array.isArray(station.Note)) {
//         initialNotes[station.id] = station.Note.map((note, index) => ({
//           id: `note-${station.id}-${index}`,
//           content: note,
//           createdAt: new Date().toISOString(),
//         }))
//       }
//     })
//     setStationNotes(initialNotes)
//   }, [mpi.stations])

//   // Initialize station documents from MPI data
//   useEffect(() => {
//     const initialDocs: Record<string, StationDocument[]> = {}
//     mpi.stations?.forEach((station) => {
//       if (station.documentations && Array.isArray(station.documentations)) {
//         initialDocs[station.id] = station.documentations
//       }
//     })
//     setStationDocuments(initialDocs)
//   }, [mpi.stations])

//   // Load existing IDs for validation (excluding current MPI)
//   const loadExistingIds = async () => {
//     try {
//       setCheckingIds(true)
//       const mpis = await MPIAPI.getAllMPIs()
//       // Filter out current MPI from validation
//       const otherMpis = mpis.filter((m) => m.id !== mpi.id)
//       const jobIds = otherMpis.map((m) => m.jobId.toLowerCase())
//       const assemblyIds = otherMpis.map((m) => m.assemblyId.toLowerCase())
//       const documentControlIds = otherMpis
//         .filter((m) => m.orderForms && m.orderForms.length > 0)
//         .flatMap((m) => m.orderForms.map((form) => form.documentControlId))
//         .filter(Boolean)
//         .map((id) => id.toLowerCase())

//       setExistingJobIds(jobIds)
//       setExistingAssemblyIds(assemblyIds)
//       setExistingDocumentControlIds(documentControlIds)
//     } catch (error) {
//       console.error("Failed to load existing IDs:", error)
//     } finally {
//       setCheckingIds(false)
//     }
//   }

//   // Validation functions
//   const validateJobId = (jobId: string): string | null => {
//     if (!jobId.trim()) return "Job ID is required"
//     if (jobId.length < 2) return "Job ID must be at least 2 characters"
//     if (existingJobIds.includes(jobId.toLowerCase())) {
//       return `Job ID "${jobId}" already exists. Please use a different Job ID.`
//     }
//     return null
//   }

//   const validateAssemblyId = (assemblyId: string): string | null => {
//     if (!assemblyId.trim()) return "Assembly ID is required"
//     if (assemblyId.length < 2) return "Assembly ID must be at least 2 characters"
//     if (existingAssemblyIds.includes(assemblyId.toLowerCase())) {
//       return `Assembly ID "${assemblyId}" already exists. Please use a different Assembly ID.`
//     }
//     return null
//   }

//   const validateDocumentControlId = (documentControlId: string): string | null => {
//     if (!documentControlId.trim()) return null
//     if (documentControlId.length < 2) return "Document Control ID must be at least 2 characters"
//     if (existingDocumentControlIds.includes(documentControlId.toLowerCase())) {
//       return `Document Control ID "${documentControlId}" already exists. Please use a different ID.`
//     }
//     return null
//   }

//   // Instruction handlers
//   const handleAddInstruction = () => {
//     setInstructions((prev) => [...prev, ""])
//   }

//   const handleInstructionChange = (index: number, value: string) => {
//     setInstructions((prev) => prev.map((instruction, i) => (i === index ? value : instruction)))
//   }

//   const handleRemoveInstruction = (index: number) => {
//     setInstructions((prev) => prev.filter((_, i) => i !== index))
//     toast({
//       title: "Instruction Removed",
//       description: "Instruction has been removed from the list.",
//     })
//   }

//   // Station notes handlers
//   const handleAddNote = async () => {
//     if (!activeStationId || !newNoteContent.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter note content.",
//         variant: "destructive",
//       })
//       return
//     }

//     setAddingNote(true)
//     try {
//       const newNote: StationNote = {
//         id: `note-${activeStationId}-${Date.now()}`,
//         content: newNoteContent.trim(),
//         createdAt: new Date().toISOString(),
//       }

//       setStationNotes((prev) => ({
//         ...prev,
//         [activeStationId]: [...(prev[activeStationId] || []), newNote],
//       }))

//       setNewNoteContent("")
//       toast({
//         title: "Success",
//         description: "Note added successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to add note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add note. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setAddingNote(false)
//     }
//   }

//   const handleDeleteNote = async (stationId: string, noteId: string) => {
//     try {
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: prev[stationId]?.filter((note) => note.id !== noteId) || [],
//       }))

//       toast({
//         title: "Success",
//         description: "Note deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete note. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Station document handlers
//   const handleStationDocumentUpload = async (file: File, description: string, fileName?: string) => {
//     if (!activeStationId) {
//       toast({
//         title: "Error",
//         description: "No station selected.",
//         variant: "destructive",
//       })
//       return
//     }

//     setUploadingStationDoc(true)
//     try {
//       const finalDescription = description.trim() || file.name
//       const finalFileName = fileName?.trim() || file.name

//       console.log("📤 Station document upload:", {
//         file: file.name,
//         description: finalDescription,
//         fileName: finalFileName,
//         stationId: activeStationId,
//         mpiId: mpi.id,
//       })

//       if (!mpi.id) {
//         // For new MPIs, queue the document locally
//         console.log("💾 QUEUING station document locally - MPI not created yet...")
//         if (file.size > 10 * 1024 * 1024) {
//           throw new Error("File size exceeds 10MB limit")
//         }

//         const newDoc = {
//           id: `temp-${Date.now()}`,
//           file: file,
//           description: finalDescription,
//           fileName: finalFileName,
//           stationId: activeStationId,
//           isUploaded: false,
//         }

//         setStationDocuments((prev) => ({
//           ...prev,
//           [activeStationId]: [...(prev[activeStationId] || []), newDoc],
//         }))

//         toast({
//           title: "✅ Document Queued Successfully",
//           description: `"${finalDescription}" will be uploaded when the MPI is saved.`,
//         })
//       } else {
//         // For existing MPIs, upload directly
//         console.log("📤 Uploading station document directly to existing MPI...")

//         const formData = new FormData()
//         formData.append("files", file)
//         formData.append("stationId", activeStationId)
//         formData.append("description", finalDescription)
//         formData.append("mpiId", mpi.id)
//         formData.append("originalName", file.name)

//         const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
//           method: "POST",
//           body: formData,
//         })

//         if (!response.ok) {
//           const errorText = await response.text()
//           console.error("❌ Direct upload failed:", errorText)
//           throw new Error(`Upload failed: ${response.status} - ${errorText}`)
//         }

//         const result = await response.json()
//         console.log("✅ Station document uploaded successfully:", result)

//         // Add to existing documents for the station
//         setStationDocuments((prev) => ({
//           ...prev,
//           [activeStationId]: [
//             ...(prev[activeStationId] || []),
//             {
//               id: result.id || `uploaded-${Date.now()}`,
//               fileUrl: result.fileUrl,
//               description: result.description || finalDescription,
//               fileName: result.fileName || finalFileName,
//               stationId: activeStationId,
//               isUploaded: true,
//             },
//           ],
//         }))

//         toast({
//           title: "Success",
//           description: "Station document uploaded successfully.",
//         })
//       }
//     } catch (error) {
//       console.error("Station document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingStationDoc(false)
//     }
//   }

//   const handleDeleteStationDocument = async (stationId: string, documentId: string) => {
//     try {
//       // Check if it's an uploaded document or queued document
//       const stationDocs = stationDocuments[stationId] || []
//       const doc = stationDocs.find((d) => d.id === documentId)

//       if (doc && doc.isUploaded && doc.id && !doc.id.startsWith("temp-")) {
//         // Delete uploaded document via API
//         await StationMpiDocAPI.delete(documentId)
//       }

//       // Remove from local state
//       setStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: prev[stationId]?.filter((doc) => doc.id !== documentId) || [],
//       }))

//       toast({
//         title: "Success",
//         description: "Document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete document. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Enhanced MPI Documentation handlers with proper filename support
//   const handleMpiDocumentUpload = async (file: File, description: string) => {
//     setUploadingMpiDoc(true)
//     try {
//       if (!file) {
//         throw new Error("No file selected")
//       }

//       const finalDescription = description.trim() || file.name

//       console.log("📤 MPI document upload:", {
//         originalFile: file.name,
//         description: finalDescription,
//         fileSize: file.size,
//       })

//       // For edit mode, upload immediately since MPI already exists
//       const result = await MPIDocumentationAPI.uploadDocument(mpi.id, file, finalDescription, file.name)

//       const newDoc: MPIDocumentation = {
//         id: result.id,
//         fileUrl: result.fileUrl,
//         description: result.description,
//         fileName: file.name,
//         originalFileName: file.name,
//         isUploaded: true,
//       }

//       setMpiDocumentation((prev) => [...prev, newDoc])

//       toast({
//         title: "Success",
//         description: "Document uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("Document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingMpiDoc(false)
//     }
//   }

//   const removeMpiDocument = async (index: number) => {
//     const doc = mpiDocumentation[index]

//     if (doc.id && doc.isUploaded) {
//       try {
//         await MPIDocumentationAPI.deleteDocument(doc.id)
//         toast({
//           title: "Success",
//           description: "Document deleted successfully.",
//         })
//       } catch (error) {
//         console.error("Failed to delete document:", error)
//         toast({
//           title: "Error",
//           description: "Failed to delete document.",
//           variant: "destructive",
//         })
//         return
//       }
//     }

//     setMpiDocumentation((prev) => prev.filter((_, i) => i !== index))
//   }

//   useEffect(() => {
//     loadStations()
//     loadEnums()
//     loadChecklistData()
//     loadExistingIds()
//   }, [])

//   useEffect(() => {
//     // Update selected stations when formData.selectedStationIds changes
//     const selected = availableStations.filter((station) => formData.selectedStationIds.includes(station.id))
//     setSelectedStations(selected)
//   }, [formData.selectedStationIds, availableStations])

//   const loadStations = async () => {
//     try {
//       setLoadingStations(true)
//       const stations = await StationAPI.getAllStations()
//       setAvailableStations(stations)
//     } catch (error) {
//       console.error("Failed to load stations:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load stations. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingStations(false)
//     }
//   }

//   const loadEnums = async () => {
//     try {
//       setLoadingEnums(true)
//       const enumsData = await MPIAPI.getEnums()
//       setEnums(enumsData)
//     } catch (error) {
//       console.error("Failed to load enums:", error)
//       toast({
//         title: "Warning",
//         description: "Failed to load form options.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingEnums(false)
//     }
//   }

//   const loadChecklistData = async () => {
//     try {
//       setLoadingAvailableChecklist(true)

//       // Load existing checklists from MPI - show ONLY REQUIRED items (like details page)
//       const existingChecklistSections: ChecklistSection[] = []
//       const existingItemDescriptions = new Set<string>()

//       if (mpi.checklists && mpi.checklists.length > 0) {
//         mpi.checklists.forEach((checklist, checklistIndex) => {
//           if (checklist.checklistItems && checklist.checklistItems.length > 0) {
//             // Filter to only show required items (exactly like details page)
//             const requiredItems = checklist.checklistItems.filter((item) => item.required === true)

//             if (requiredItems.length > 0) {
//               existingChecklistSections.push({
//                 id: `existing-section-${checklistIndex}`,
//                 name: checklist.name,
//                 description: `${checklist.name} - Existing required checklist items`,
//                 items: requiredItems.map((item, itemIndex) => {
//                   // Track this item as existing
//                   existingItemDescriptions.add(item.description.toLowerCase().trim())

//                   return {
//                     id: `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
//                     description: item.description,
//                     required: item.required,
//                     remarks: item.remarks,
//                     category: item.category || checklist.name,
//                     isActive: item.isActive,
//                     createdBy: item.createdBy,
//                     sectionId: `existing-section-${checklistIndex}`,
//                   }
//                 }),
//               })
//             }
//           }
//         })
//       }

//       setExistingChecklists(existingChecklistSections)

//       // Load available checklist template and filter out existing items
//       const template = await MPIAPI.getChecklistTemplate()
//       console.log("📦 Available checklist template loaded:", template)

//       if (template && Array.isArray(template)) {
//         const validSections = template
//           .filter(
//             (section) =>
//               section && typeof section === "object" && section.name && Array.isArray(section.checklistItems),
//           )
//           .map((section, sectionIndex) => {
//             // Filter out items that already exist in the MPI
//             const availableItems = (section.checklistItems || [])
//               .filter((item: any) => {
//                 const itemDescription = item.description?.toLowerCase().trim()
//                 return itemDescription && !existingItemDescriptions.has(itemDescription)
//               })
//               .map((item: any, itemIndex: number) => ({
//                 id: `available-${section.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
//                 description: item.description || "No description",
//                 required: false, // Default to No for available items
//                 remarks: "",
//                 category: item.category || section.name,
//                 isActive: item.isActive !== undefined ? item.isActive : true,
//                 createdBy: item.createdBy || "System",
//                 sectionId: `available-section-${sectionIndex}`,
//               }))

//             return availableItems.length > 0
//               ? {
//                   id: `available-section-${sectionIndex}`,
//                   name: section.name,
//                   description: `${section.name} quality control items`,
//                   items: availableItems,
//                 }
//               : null
//           })
//           .filter(Boolean)

//         setAvailableChecklistTemplate(validSections)
//       } else {
//         setAvailableChecklistTemplate([])
//       }
//     } catch (error) {
//       console.error("Failed to load checklist data:", error)
//       setAvailableChecklistTemplate([])
//       setExistingChecklists([])
//     } finally {
//       setLoadingAvailableChecklist(false)
//     }
//   }

//   const handleChecklistItemChange = (itemId: string, field: "required" | "remarks", value: boolean | string) => {
//     setChecklistModifications((prev) => ({
//       ...prev,
//       [itemId]: {
//         ...prev[itemId],
//         [field]: value,
//       },
//     }))
//   }

//   const getChecklistItemValue = (itemId: string, field: "required" | "remarks", defaultValue: boolean | string) => {
//     return checklistModifications[itemId]?.[field] ?? defaultValue
//   }

//   const handleOrderFormChange = (field: string, value: string | boolean | string[]) => {
//     setOrderFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log("🔄 Starting form submission...")

//     // Validation - Reload existing IDs first
//     await loadExistingIds()

//     // Enhanced validation with better error messages
//     const jobIdError = validateJobId(formData.jobId)
//     const assemblyIdError = validateAssemblyId(formData.assemblyId)
//     const documentControlIdError = orderFormData.documentControlId
//       ? validateDocumentControlId(orderFormData.documentControlId)
//       : null

//     const validationErrors = []
//     if (jobIdError) validationErrors.push(`Job ID: ${jobIdError}`)
//     if (assemblyIdError) validationErrors.push(`Assembly ID: ${assemblyIdError}`)
//     if (documentControlIdError) validationErrors.push(`Document Control ID: ${documentControlIdError}`)

//     // Check for required fields
//     if (!formData.jobId.trim()) validationErrors.push("Job ID is required")
//     if (!formData.assemblyId.trim()) validationErrors.push("Assembly ID is required")

//     if (validationErrors.length > 0) {
//       toast({
//         title: "❌ Validation Failed",
//         description: (
//           <div className="space-y-2">
//             <p className="font-semibold">Please fix the following issues:</p>
//             <ul className="list-disc list-inside space-y-1">
//               {validationErrors.map((error, index) => (
//                 <li key={index} className="text-sm">
//                   {error}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ),
//         variant: "destructive",
//         duration: 10000,
//       })
//       setActiveTab("basic-info")
//       return
//     }

//     console.log("Selected stations:", formData.selectedStationIds)
//     console.log("Current specification values:", specificationValues)
//     console.log("Current checklist modifications:", checklistModifications)

//     // Prepare stations data - Send ALL selected stations with their specification values in the correct format
//     const stationsData = formData.selectedStationIds
//       .map((stationId) => {
//         const station = selectedStations.find((s) => s.id === stationId)
//         if (!station) return null

//         // Get specification values for this station in the format the backend expects
//         const stationSpecificationValues =
//           station.specifications?.map((spec) => {
//             const specValue = specificationValues[spec.id]
//             return {
//               specificationId: spec.id,
//               value: specValue?.value || "", // Send current value or empty string
//               ...(specValue?.unit && { unit: specValue.unit }),
//               ...(specValue?.fileUrl && { fileUrl: specValue.fileUrl }),
//             }
//           }) || []

//         // Include station notes in the update
//         const stationNotesArray = stationNotes[stationId]?.map((note) => note.content) || []

//         return {
//           id: station.id,
//           stationId: station.stationId,
//           stationName: station.stationName,
//           status: station.status,
//           description: station.description || "",
//           location: station.location || "",
//           operator: station.operator || "",
//           priority: station.priority || 1,
//           Note: stationNotesArray,
//           // Send specification values in the format the backend expects
//           specificationValues: stationSpecificationValues,
//         }
//       })
//       .filter(Boolean)

//     console.log("📤 Stations data being sent:", JSON.stringify(stationsData, null, 2))
//     console.log("🔧 Current specification values:", specificationValues)

//     // Prepare existing checklist updates with ACTUAL database IDs
//     const existingChecklistUpdates: any[] = []

//     if (mpi.checklists && mpi.checklists.length > 0) {
//       mpi.checklists.forEach((checklist) => {
//         const updatedItems: any[] = []
//         let hasChanges = false

//         if (checklist.checklistItems && checklist.checklistItems.length > 0) {
//           checklist.checklistItems.forEach((item, itemIndex) => {
//             const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
//             const modifications = checklistModifications[itemId]

//             if (modifications) {
//               // Check if there are actual changes
//               if (modifications.required !== item.required || modifications.remarks !== item.remarks) {
//                 hasChanges = true
//               }

//               updatedItems.push({
//                 id: item.id, // Use the actual database ID from the MPI
//                 description: item.description,
//                 required: modifications.required,
//                 remarks: modifications.remarks,
//                 category: item.category,
//                 createdBy: item.createdBy,
//                 isActive: item.isActive,
//               })
//             }
//           })
//         }

//         // Only include checklist if there are actual changes
//         if (hasChanges && updatedItems.length > 0) {
//           existingChecklistUpdates.push({
//             id: checklist.id, // Use the actual checklist database ID
//             name: checklist.name,
//             checklistItems: updatedItems,
//           })
//         }
//       })
//     }

//     // Prepare new checklists from available template
//     const newChecklists: any[] = []
//     availableChecklistTemplate.forEach((section) => {
//       const newItems: any[] = []

//       section.items.forEach((item) => {
//         const modifications = checklistModifications[item.id]
//         if (modifications && modifications.required) {
//           newItems.push({
//             description: item.description,
//             required: modifications.required,
//             remarks: modifications.remarks || "",
//             createdBy: item.createdBy || "System",
//             isActive: item.isActive !== undefined ? item.isActive : true,
//             category: item.category || section.name,
//           })
//         }
//       })

//       if (newItems.length > 0) {
//         newChecklists.push({
//           name: section.name,
//           checklistItems: newItems,
//         })
//       }
//     })

//     // Prepare complete submission data matching backend expectations
//     const submitData: any = {
//       jobId: formData.jobId,
//       assemblyId: formData.assemblyId,
//       customer: formData.customer || null,
//     }

//     // FIXED: Always include order forms for updates with proper structure
//     const orderFormSubmissionData = {
//       id: orderFormData.id || undefined, // Include ID if exists for update
//       OrderType: orderFormData.orderType,
//       distributionDate: orderFormData.distributionDate ? new Date(orderFormData.distributionDate).toISOString() : null,
//       requiredBy: orderFormData.requiredBy ? new Date(orderFormData.requiredBy).toISOString() : null,
//       internalOrderNumber: orderFormData.internalOrderNumber || null,
//       revision: orderFormData.revision || null,
//       otherAttachments: orderFormData.otherAttachments || null,
//       fileAction: orderFormData.fileAction,
//       markComplete: orderFormData.markComplete,
//       documentControlId: orderFormData.documentControlId || null,
//     }

//     // Send as array to match backend expectation
//     submitData.orderForms = [orderFormSubmissionData]

//     console.log("📋 Order form data being sent:", JSON.stringify(submitData.orderForms, null, 2))

//     // Add stations with specifications if they exist
//     if (stationsData.length > 0) {
//       submitData.stations = stationsData
//     }

//     // Combine existing and new checklists for the backend
//     const allChecklists = [...existingChecklistUpdates, ...newChecklists]
//     if (allChecklists.length > 0) {
//       submitData.checklists = allChecklists
//     }

//     // Add instructions - always include for updates (use backend field name 'Instruction')
//     submitData.Instruction = instructions.filter((instruction) => instruction.trim() !== "")

//     // Add uploaded documents to submission data with both description and fileName
//     if (mpiDocumentation.length > 0) {
//       const uploadedDocs = mpiDocumentation
//         .filter((doc) => doc.isUploaded && doc.fileUrl)
//         .map((doc) => ({
//           id: doc.id,
//           fileUrl: doc.fileUrl,
//           description: doc.description,
//           fileName: doc.fileName, // Include fileName for backend
//           originalFileName: doc.originalFileName, // Include original filename
//         }))

//       if (uploadedDocs.length > 0) {
//         submitData.mpiDocs = uploadedDocs
//       }
//     }

//     console.log("📤 Submitting MPI update data:", JSON.stringify(submitData, null, 2))

//     try {
//       await onSubmit(submitData as UpdateMPIDto)
//       if (newChecklists.length > 0) {
//         toast({
//           title: "Success",
//           description: `MPI updated successfully with ${newChecklists.length} new checklist section(s) added.`,
//         })
//       } else {
//         toast({
//           title: "Success",
//           description: "MPI updated successfully.",
//         })
//       }
//     } catch (error: any) {
//       console.error("Form submission error:", error)

//       // Handle specific error types
//       if (error.message?.includes("Unique constraint failed")) {
//         if (error.message?.includes("documentControlId")) {
//           toast({
//             title: "🚫 Duplicate Document Control ID",
//             description: `Document Control ID "${orderFormData.documentControlId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         } else if (error.message?.includes("jobId")) {
//           toast({
//             title: "🚫 Duplicate Job ID",
//             description: `Job ID "${formData.jobId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         } else if (error.message?.includes("assemblyId")) {
//           toast({
//             title: "🚫 Duplicate Assembly ID",
//             description: `Assembly ID "${formData.assemblyId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         }
//       }

//       toast({
//         title: "Submission Error",
//         description: error.message || "Failed to update MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleStationSelectionChange = (stationIds: string[]) => {
//     setFormData((prev) => ({ ...prev, selectedStationIds: stationIds }))
//   }

//   const handleSpecificationValueChange = (specificationId: string, value: string, unit?: string) => {
//     console.log("🔧 Updating specification:", specificationId, "with value:", value, "unit:", unit)

//     setSpecificationValues((prev) => {
//       const updated = {
//         ...prev,
//         [specificationId]: {
//           specificationId,
//           value,
//           unit,
//           fileUrl: prev[specificationId]?.fileUrl,
//         },
//       }

//       console.log("🔧 Updated specification values:", updated)
//       return updated
//     })
//   }

//   const handleFileUpload = async (specificationId: string, file: File, stationId: string, unit?: string) => {
//     console.log("📁 Starting file upload for spec:", specificationId, "station:", stationId)

//     setUploadingFiles((prev) => new Set(prev).add(specificationId))

//     try {
//       const result = await StationAPI.uploadStationSpecificationFile(file, specificationId, stationId, unit)

//       console.log("📁 File upload result:", result)

//       setSpecificationValues((prev) => {
//         const updated = {
//           ...prev,
//           [specificationId]: {
//             specificationId,
//             value: result.value || file.name,
//             fileUrl: result.fileUrl,
//             unit: unit || prev[specificationId]?.unit,
//           },
//         }

//         console.log("📁 Updated specification values after upload:", updated)
//         return updated
//       })

//       toast({
//         title: "Success",
//         description: "File uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("File upload error:", error)
//       toast({
//         title: "Error",
//         description: "Failed to upload file. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingFiles((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(specificationId)
//         return newSet
//       })
//     }
//   }

//   const renderSpecificationInput = (spec: any, stationId: string) => {
//     const specValue = specificationValues[spec.id]
//     const isUploading = uploadingFiles.has(spec.id)

//     // Only log if there's an issue or for debugging specific specs
//     if (!specValue && spec.required) {
//       console.log(`⚠️ Required spec ${spec.name} (${spec.id}) has no value`)
//     }

//     switch (spec.inputType) {
//       case "TEXT":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Input
//               id={`spec-${spec.id}`}
//               value={specValue?.value || ""}
//               onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value)}
//               placeholder={`Enter ${spec.name.toLowerCase()}`}
//               className="h-10"
//             />
//           </div>
//         )

//       case "number":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <div className="flex gap-2">
//               <Input
//                 id={`spec-${spec.id}`}
//                 type="number"
//                 value={specValue?.value || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value, specValue?.unit)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10 flex-1"
//               />
//               <Input
//                 placeholder="Unit"
//                 value={specValue?.unit || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
//                 className="h-10 w-20"
//               />
//             </div>
//           </div>
//         )

//       case "CHECKBOX":
//         return (
//           <div className="space-y-2">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id={`spec-${spec.id}`}
//                 checked={specValue?.value === "true"}
//                 onCheckedChange={(checked) => handleSpecificationValueChange(spec.id, checked ? "true" : "false")}
//               />
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>
//             </div>
//           </div>
//         )

//       case "DROPDOWN":
//         const suggestions = spec.suggestions || []
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Select
//               value={specValue?.value || ""}
//               onValueChange={(value) => handleSpecificationValueChange(spec.id, value)}
//             >
//               <SelectTrigger className="h-10">
//                 <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
//               </SelectTrigger>
//               <SelectContent>
//                 {suggestions.map((suggestion: string, index: number) => (
//                   <SelectItem key={index} value={suggestion}>
//                     {suggestion}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )

//       case "FILE_UPLOAD":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <Input
//                   id={`spec-${spec.id}`}
//                   type="file"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0]
//                     if (file) {
//                       handleFileUpload(spec.id, file, stationId, specValue?.unit)
//                     }
//                   }}
//                   accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
//                   className="cursor-pointer flex-1"
//                   disabled={isUploading}
//                 />
//                 {isUploading && (
//                   <div className="flex items-center gap-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//                     <span className="text-xs text-muted-foreground">Uploading...</span>
//                   </div>
//                 )}
//               </div>
//               <Input
//                 placeholder="Unit (optional)"
//                 value={specValue?.unit || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
//                 className="h-10 w-32"
//               />
//               {specValue?.fileUrl && (
//                 <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
//                   <FileText className="w-4 h-4 text-green-600" />
//                   <span className="text-sm text-green-800">File uploaded successfully</span>
//                   <a
//                     href={specValue.fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-xs text-blue-600 hover:underline"
//                   >
//                     View
//                   </a>
//                 </div>
//               )}
//               <p className="text-xs text-muted-foreground">
//                 Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
//               </p>
//             </div>
//           </div>
//         )

//       default:
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Input
//               id={`spec-${spec.id}`}
//               value={specValue?.value || ""}
//               onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value)}
//               placeholder={`Enter ${spec.name.toLowerCase()}`}
//               className="h-10"
//             />
//           </div>
//         )
//     }
//   }

//   const renderStationDocuments = (stationId: string) => {
//     const documents = stationDocuments[stationId] || []

//     return (
//       <div className="space-y-4">
//         {/* Upload Section */}
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
//           <div className="space-y-4">
//             <h4 className="font-medium text-sm">Upload Station Document</h4>
//             <div className="grid grid-cols-1 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="station-doc-file">Select Files *</Label>
//                 <Input
//                   id="station-doc-file"
//                   type="file"
//                   accept="*/*"
//                   className="cursor-pointer"
//                   disabled={uploadingStationDoc}
//                 />
//                 {/* <p className="text-xs text-muted-foreground">Select any file type (PDF, Word, Excel, images, etc.)</p> */}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="station-doc-description">Description</Label>
//                 <Input
//                   id="station-doc-description"
//                   placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                   disabled={uploadingStationDoc}
//                 />
//                 {/* <p className="text-xs text-muted-foreground">
//                   What is this document about? (Optional - will use filename if empty)
//                 </p> */}
//               </div>
//             </div>
//             <Button
//               type="button"
//               variant="outline"
//               disabled={uploadingStationDoc}
//               onClick={async () => {
//                 const fileInput = document.getElementById("station-doc-file") as HTMLInputElement
//                 const descInput = document.getElementById("station-doc-description") as HTMLInputElement
//                 const file = fileInput?.files?.[0]
//                 const description = descInput?.value?.trim() || ""

//                 if (!file) {
//                   toast({
//                     title: "Missing File",
//                     description: "Please select a file to upload.",
//                     variant: "destructive",
//                   })
//                   return
//                 }

//                 await handleStationDocumentUpload(file, description, file.name)
//                 fileInput.value = ""
//                 descInput.value = ""
//               }}
//               className="w-full"
//             >
//               {uploadingStationDoc ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                   Uploading File...
//                 </div>
//               ) : (
//                 <>
//                   <Upload className="w-4 h-4 mr-2" />
//                   Upload File
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Documents List */}
//         {documents.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No files available for this station.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 gap-4">
//               {documents.map((doc) => (
//                 <div key={doc.id} className="p-4 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start gap-3 flex-1">
//                       <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-medium text-sm text-gray-900 truncate">
//                           {doc.description || "Untitled Document"}
//                         </h4>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Uploaded: {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "Unknown date"}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 ml-4">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => window.open(doc.fileUrl, "_blank")}
//                         className="h-8 px-3"
//                       >
//                         <Eye className="w-3 h-3 mr-1" />
//                         View
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           const link = document.createElement("a")
//                           link.href = doc.fileUrl
//                           link.download = doc.description || "document"
//                           link.click()
//                         }}
//                         className="h-8 px-3"
//                       >
//                         <Download className="w-3 h-3 mr-1" />
//                         Download
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleDeleteStationDocument(stationId, doc.id)}
//                         className="h-8 px-3 text-red-600 hover:text-red-700"
//                       >
//                         <Trash2 className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const renderStationNotes = (stationId: string) => {
//     const notes = stationNotes[stationId] || []

//     return (
//       <div className="space-y-4">
//         {/* Add Note Section */}
//         <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
//             <Plus className="w-4 h-4" />
//             Add Station Note
//           </h4>
//           <div className="space-y-3">
//             <Textarea
//               value={newNoteContent}
//               onChange={(e) => setNewNoteContent(e.target.value)}
//               placeholder="Enter operational notes, safety instructions, or maintenance reminders..."
//               rows={3}
//               className="resize-none"
//             />
//             <Button
//               onClick={handleAddNote}
//               disabled={addingNote || !newNoteContent.trim()}
//               size="sm"
//               className="w-full"
//             >
//               {addingNote ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                   Adding Note...
//                 </div>
//               ) : (
//                 <>
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Note
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Notes List */}
//         {notes.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No notes available for this station.</p>
//             <p className="text-sm text-muted-foreground mt-1">
//               Add operational notes, safety instructions, or reminders above.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             <h4 className="font-medium text-sm flex items-center gap-2">
//               <StickyNote className="w-4 h-4" />
//               Station Notes ({notes.length})
//             </h4>
//             <div className="space-y-2">
//               {notes.map((note) => (
//                 <div key={note.id} className="p-3 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.content}</p>
//                       <p className="text-xs text-gray-500 mt-2">
//                         {note.createdAt ? new Date(note.createdAt).toLocaleString() : "Unknown date"}
//                       </p>
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => handleDeleteNote(stationId, note.id!)}
//                       className="ml-3 h-8 px-2 text-red-600 hover:text-red-700"
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const isFormValid = () => {
//     const jobIdError = validateJobId(formData.jobId)
//     const assemblyIdError = validateAssemblyId(formData.assemblyId)
//     const documentControlIdError = orderFormData.documentControlId
//       ? validateDocumentControlId(orderFormData.documentControlId)
//       : null

//     return !jobIdError && !assemblyIdError && !documentControlIdError
//   }

//   const InstructionsTab = ({
//     instructions,
//     onAddInstruction,
//     onInstructionChange,
//     onRemoveInstruction,
//   }: {
//     instructions: string[]
//     onAddInstruction: () => void
//     onInstructionChange: (index: number, value: string) => void
//     onRemoveInstruction: (index: number) => void
//   }) => {
//     return (
//       <div className="space-y-6">
//         {/* Instructions Section */}
//         <Card>
//           <CardContent className="mt-5">
//             <div className="space-y-4">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h4 className="text-lg font-semibold text-red-800">General Instructions</h4>
//                   <p className="text-sm text-muted-foreground">
//                     Add general safety and operational instructions for this MPI
//                   </p>
//                 </div>
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="outline"
//                   onClick={onAddInstruction}
//                   className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Instruction
//                 </Button>
//               </div>

//               {instructions.length === 0 ? (
//                 <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                   <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm text-muted-foreground">No instructions added yet</p>
//                   <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {instructions.map((instruction, index) => (
//                     <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
//                       <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <Input
//                           value={instruction}
//                           onChange={(e) => onInstructionChange(index, e.target.value)}
//                           placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
//                           className="w-full"
//                         />
//                       </div>
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="ghost"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           onRemoveInstruction(index)
//                         }}
//                         className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
//                       >
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Stations Section */}
//         <Card>
//           <CardContent className="space-y-6 mt-5">
//             {loadingStations ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
//                   <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
//                 </div>
//               </div>
//             ) : availableStations.length === 0 ? (
//               <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
//               </div>
//             ) : (
//               <div className="flex gap-6 min-h-[600px]">
//                 {/* Left Sidebar - Station List */}
//                 <div className="w-1/4 border rounded-lg bg-gray-50">
//                   <div className="p-3 border-b bg-white rounded-t-lg">
//                     <h4 className="font-medium text-base">Stations</h4>
//                     <p className="text-xs text-muted-foreground">
//                       {formData.selectedStationIds.length > 0
//                         ? `${formData.selectedStationIds.length} selected`
//                         : "Click to select multiple"}
//                     </p>
//                   </div>
//                   <div className="p-2 overflow-y-auto h-[530px]">
//                     <div className="space-y-1">
//                       {availableStations.map((station) => {
//                         const noteCount = stationNotes[station.id]?.length || 0
//                         const docCount = stationDocuments[station.id]?.length || 0
//                         const isSelected = formData.selectedStationIds.includes(station.id)
//                         const isActive = activeStationId === station.id

//                         return (
//                           <div
//                             key={station.id}
//                             className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
//                               isSelected
//                                 ? "bg-blue-100 text-blue-900 border-blue-300"
//                                 : "bg-white hover:bg-gray-100 border-transparent"
//                             } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
//                             onClick={() => {
//                               setActiveStationId(station.id)
//                               if (isSelected) {
//                                 handleStationSelectionChange(
//                                   formData.selectedStationIds.filter((id) => id !== station.id),
//                                 )
//                               } else {
//                                 handleStationSelectionChange([...formData.selectedStationIds, station.id])
//                               }
//                             }}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="truncate">{station.stationName}</span>
//                               <div className="flex gap-1">
//                                 {noteCount > 0 && (
//                                   <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
//                                     {noteCount}N
//                                   </Badge>
//                                 )}
//                                 {docCount > 0 && (
//                                   <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
//                                     {docCount}D
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Panel - Station Details */}
//                 <div className="flex-1 border rounded-lg bg-gray-50">
//                   {!activeStationId ? (
//                     <div className="flex items-center justify-center h-full">
//                       <div className="text-center">
//                         <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <h4 className="font-medium text-gray-600 mb-2">No Station Selected</h4>
//                         <p className="text-sm text-muted-foreground">
//                           Select a station from the left sidebar to view its details
//                           {formData.selectedStationIds.length > 0 && (
//                             <span className="block mt-2 text-blue-600 font-medium">
//                               {formData.selectedStationIds.length} station
//                               {formData.selectedStationIds.length > 1 ? "s" : ""} selected for MPI
//                             </span>
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="h-full flex flex-col">
//                       <div className="p-4 border-b bg-white rounded-t-lg">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <Factory className="w-5 h-5 text-purple-600" />
//                             <div>
//                               <h4 className="font-medium text-lg">
//                                 {availableStations.find((s) => s.id === activeStationId)?.stationName}
//                               </h4>
//                               <p className="text-sm text-muted-foreground">Station Details</p>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "specifications" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("specifications")}
//                             >
//                               Specifications
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "documents" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("documents")}
//                             >
//                              Files
//                               {stationDocuments[activeStationId]?.length > 0 && (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {stationDocuments[activeStationId].length}
//                                 </Badge>
//                               )}
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "notes" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("notes")}
//                             >
//                               Notes
//                               {stationNotes[activeStationId]?.length > 0 && (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {stationNotes[activeStationId].length}
//                                 </Badge>
//                               )}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex-1 overflow-auto p-4">
//                         {stationViewMode === "specifications" && (
//                           <div>
//                             {(() => {
//                               const station = availableStations.find((s) => s.id === activeStationId)
//                               if (!station) return null

//                               if (!station.specifications || station.specifications.length === 0) {
//                                 return (
//                                   <div className="text-center py-6">
//                                     <p className="text-muted-foreground">
//                                       No specifications available for this station.
//                                     </p>
//                                   </div>
//                                 )
//                               }

//                               return (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   {station.specifications.map((spec) => (
//                                     <div key={spec.id} className="space-y-3 p-3 bg-white rounded border">
//                                       {renderSpecificationInput(spec, station.id)}
//                                     </div>
//                                   ))}
//                                 </div>
//                               )
//                             })()}
//                           </div>
//                         )}
//                         {stationViewMode === "documents" && renderStationDocuments(activeStationId)}
//                         {stationViewMode === "notes" && renderStationNotes(activeStationId)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Selected Station Summary */}
//             {formData.selectedStationIds.length > 0 && (
//               <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <h4 className="font-medium text-blue-800 mb-3">Selected Stations</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedStations.map((station) => (
//                     <Badge key={station.id} variant="outline" className="bg-white">
//                       {station.stationName}
//                       {station.specifications && station.specifications.length > 0 && (
//                         <span className="ml-1 text-xs">({station.specifications.length} specs)</span>
//                       )}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between w-full">
//           <div>
//             <h1 className="text-3xl font-bold text-red-600">Edit MPI</h1>
//             <p className="text-muted-foreground">
//               Job ID: {mpi.jobId} • Assembly ID: {mpi.assemblyId}
//             </p>
//           </div>
//           <Button variant="outline" size="sm" onClick={onCancel}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
//         </div>

//         <Card className="border shadow-sm">
//           <CardContent className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-4">
//                   <TabsTrigger value="basic-info" className="flex items-center gap-2">
//                     <Info className="w-4 h-4" />
//                     Order Details
//                   </TabsTrigger>
//                   <TabsTrigger value="documentation" className="flex items-center gap-2">
//                     <FileText className="w-4 h-4" />
//                    Files
//                     {mpiDocumentation.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {mpiDocumentation.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="checklist" className="flex items-center gap-2">
//                     <ClipboardList className="w-4 h-4" />
//                     Checklist
//                     {existingChecklists.length + availableChecklistTemplate.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {existingChecklists.length + availableChecklistTemplate.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="instructions" className="flex items-center gap-2">
//                     <Factory className="w-4 h-4" />
//                     Instructions
//                     {selectedStations.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {selectedStations.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                 </TabsList>

//                 {/* Basic Information & Order Form Tab */}
//                 <TabsContent value="basic-info" className="space-y-6 mt-6">
//                   {/* MPI Basic Information */}
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="jobId">
//                             MPI ID *{checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="jobId"
//                             value={formData.jobId}
//                             onChange={(e) => handleChange("jobId", e.target.value)}
//                             placeholder="Enter job ID"
//                             required
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = validateJobId(formData.jobId)
//                             return error ? (
//                               <p className="text-xs text-red-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="assemblyId">
//                             Assembly ID *
//                             {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="assemblyId"
//                             value={formData.assemblyId}
//                             onChange={(e) => handleChange("assemblyId", e.target.value)}
//                             placeholder="Enter assembly ID"
//                             required
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = validateAssemblyId(formData.assemblyId)
//                             return error ? (
//                               <p className="text-xs text-red-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="customer">Customer</Label>
//                           <Input
//                             id="customer"
//                             value={formData.customer}
//                             onChange={(e) => handleChange("customer", e.target.value)}
//                             placeholder="Enter customer name"
//                             className="h-11"
//                           />
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   {/* Order Forms Section */}
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="internalOrderNumber">Internal Order Number</Label>
//                           <Input
//                             id="internalOrderNumber"
//                             value={orderFormData.internalOrderNumber}
//                             onChange={(e) => handleOrderFormChange("internalOrderNumber", e.target.value)}
//                             placeholder="Enter internal order number"
//                             className="h-11"
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="revision">Revision</Label>
//                           <Input
//                             id="revision"
//                             value={orderFormData.revision}
//                             onChange={(e) => handleOrderFormChange("revision", e.target.value)}
//                             placeholder="Enter revision number"
//                             className="h-11"
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="documentControlId">
//                             Document Control ID
//                             {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="documentControlId"
//                             value={orderFormData.documentControlId}
//                             onChange={(e) => handleOrderFormChange("documentControlId", e.target.value)}
//                             placeholder="Enter document control ID"
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = orderFormData.documentControlId
//                               ? validateDocumentControlId(orderFormData.documentControlId)
//                               : null
//                             return error ? (
//                               <p className="text-xs text-red-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="distributionDate">Distribution Date</Label>
//                           <Input
//                             id="distributionDate"
//                             type="date"
//                             value={orderFormData.distributionDate}
//                             onChange={(e) => handleOrderFormChange("distributionDate", e.target.value)}
//                             className="h-11"
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="requiredBy">Required By</Label>
//                           <Input
//                             id="requiredBy"
//                             type="date"
//                             value={orderFormData.requiredBy}
//                             onChange={(e) => handleOrderFormChange("requiredBy", e.target.value)}
//                             className="h-11"
//                           />
//                         </div>
//                       </div>


//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Documentation Tab */}
//                 <TabsContent value="documentation" className="space-y-6 mt-6">
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="space-y-4">
//                         {/* Upload Section */}
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
//                           <div className="space-y-4">
//                             <div className="grid grid-cols-1 gap-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor="mpi-doc-file">Select Files *</Label>
//                                 <Input
//                                   id="mpi-doc-file"
//                                   type="file"
//                                   accept="*/*"
//                                   className="cursor-pointer"
//                                   disabled={uploadingMpiDoc}
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor="mpi-doc-description">Description (Optional)</Label>
//                                 <Input
//                                   id="mpi-doc-description"
//                                   placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                                   disabled={uploadingMpiDoc}
//                                 />
//                               </div>
//                             </div>

//                             <Button
//                               type="button"
//                               variant="outline"
//                               disabled={uploadingMpiDoc}
//                               onClick={async () => {
//                                 const fileInput = document.getElementById("mpi-doc-file") as HTMLInputElement
//                                 const descInput = document.getElementById("mpi-doc-description") as HTMLInputElement
//                                 const file = fileInput?.files?.[0]
//                                 const description = descInput?.value?.trim() || ""

//                                 if (!file) {
//                                   toast({
//                                     title: "Missing File",
//                                     description: "Please select a file to upload.",
//                                     variant: "destructive",
//                                   })
//                                   return
//                                 }

//                                 await handleMpiDocumentUpload(file, description)
//                                 fileInput.value = ""
//                                 descInput.value = ""
//                               }}
//                               className="w-full bg-transparent"
//                             >
//                               {uploadingMpiDoc ? (
//                                 <div className="flex items-center gap-2">
//                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                   Uploading File...
//                                 </div>
//                               ) : (
//                                 <>
//                                   <Upload className="w-4 h-4 mr-2" />
//                                   Upload File
//                                 </>
//                               )}
//                             </Button>
//                           </div>
//                         </div>

//                         {/* Uploaded Documents List */}
//                         {mpiDocumentation.length > 0 && (
//                           <div className="space-y-3">
//                             <h4 className="font-medium text-sm">Files</h4>
//                             <div className="space-y-2">
//                               {mpiDocumentation.map((doc, index) => (
//                                 <div
//                                   key={index}
//                                   className="flex items-start justify-between p-4 bg-gray-50 rounded border"
//                                 >
//                                   <div className="flex items-start gap-3 flex-1">
//                                     <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                                     <div className="flex-1 min-w-0">
//                                       <p className="text-sm font-medium text-gray-900 truncate">
//                                         {doc.description && doc.description !== doc.fileName
//                                           ? doc.description
//                                           : doc.fileName}
//                                       </p>
//                                       <div className="mt-1 space-y-1">
//                                         <p className="text-xs text-gray-600">
//                                           <span className="font-medium">Filename:</span> {doc.fileName}
//                                         </p>
//                                         {doc.description && doc.description !== doc.fileName && (
//                                           <p className="text-xs text-gray-500">
//                                             <span className="font-medium">Description:</span> {doc.description}
//                                           </p>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>

//                                   <div className="flex items-center gap-2 ml-4">
//                                     <Button
//                                       type="button"
//                                       size="sm"
//                                       variant="outline"
//                                       onClick={() => removeMpiDocument(index)}
//                                       className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
//                                     >
//                                       Remove
//                                     </Button>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Checklist Tab */}
//                 <TabsContent value="checklist" className="space-y-6 mt-6">
//                   <Card>
//                     <CardContent className="mt-5">
//                       {loadingAvailableChecklist ? (
//                         <div className="flex items-center justify-center py-8">
//                           <div className="text-center">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
//                             <p className="mt-2 text-sm text-muted-foreground">Loading checklist data...</p>
//                           </div>
//                         </div>
//                       ) : existingChecklists.length === 0 && availableChecklistTemplate.length === 0 ? (
//                         <p className="text-muted-foreground text-center py-4">No checklist data available.</p>
//                       ) : (
//                         <div className="space-y-6">
//                           {/* Existing Checklists */}
//                           {existingChecklists.length > 0 ? (
//                             <div>
//                               <h3 className="text-lg font-semibold mb-4 text-red-800">Existing Required Checklists</h3>
//                               <Accordion type="multiple" className="w-full">
//                                 {existingChecklists.map((section) => (
//                                   <AccordionItem key={section.id} value={section.id}>
//                                     <AccordionTrigger className="text-left">
//                                       <div className="flex items-center gap-3">
//                                         <h4 className="font-medium">{section.name}</h4>
//                                       </div>
//                                     </AccordionTrigger>
//                                     <AccordionContent>
//                                       <div className="space-y-4">
//                                         <Table>
//                                           <TableHeader>
//                                             <TableRow>
//                                               <TableHead>Description</TableHead>
//                                               <TableHead>Required</TableHead>
//                                               <TableHead>Remarks</TableHead>
//                                             </TableRow>
//                                           </TableHeader>
//                                           <TableBody>
//                                             {(section.items || []).map((item) => (
//                                               <TableRow key={item.id}>
//                                                 <TableCell className="font-medium">{item.description}</TableCell>
//                                                 <TableCell>
//                                                   <Select
//                                                     value={
//                                                       getChecklistItemValue(item.id, "required", item.required)
//                                                         ? "yes"
//                                                         : "no"
//                                                     }
//                                                     onValueChange={(value) =>
//                                                       handleChecklistItemChange(item.id, "required", value === "yes")
//                                                     }
//                                                   >
//                                                     <SelectTrigger className="w-20">
//                                                       <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                       <SelectItem value="yes">Yes</SelectItem>
//                                                       <SelectItem value="no">No</SelectItem>
//                                                     </SelectContent>
//                                                   </Select>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                   <Input
//                                                     value={
//                                                       getChecklistItemValue(item.id, "remarks", item.remarks) as string
//                                                     }
//                                                     onChange={(e) =>
//                                                       handleChecklistItemChange(item.id, "remarks", e.target.value)
//                                                     }
//                                                     placeholder="Enter remarks (optional)"
//                                                     className="min-w-[200px]"
//                                                   />
//                                                 </TableCell>
//                                               </TableRow>
//                                             ))}
//                                           </TableBody>
//                                         </Table>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           ) : (
//                             <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                               <h3 className="text-lg font-semibold mb-2 text-blue-800">Existing Checklists</h3>
//                               <p className="text-sm text-blue-700">
//                                 No checklist items have been created for this MPI yet.
//                               </p>
//                             </div>
//                           )}

//                           {/* Available Checklist Template */}
//                           {availableChecklistTemplate.length > 0 && (
//                             <div>
//                               <h3 className="text-lg font-semibold mb-4 text-red-800">Available Checklist Items</h3>
//                               <Accordion type="multiple" className="w-full">
//                                 {availableChecklistTemplate.map((section) => (
//                                   <AccordionItem key={section.id} value={section.id}>
//                                     <AccordionTrigger className="text-left">
//                                       <div className="flex items-center gap-3">
//                                         <h4 className="font-medium">{section.name}</h4>
//                                       </div>
//                                     </AccordionTrigger>
//                                     <AccordionContent>
//                                       <div className="space-y-4">
//                                         <Table>
//                                           <TableHeader>
//                                             <TableRow>
//                                               <TableHead>Description</TableHead>
//                                               <TableHead>Required</TableHead>
//                                               <TableHead>Remarks</TableHead>
//                                             </TableRow>
//                                           </TableHeader>
//                                           <TableBody>
//                                             {(section.items || []).map((item) => (
//                                               <TableRow key={item.id}>
//                                                 <TableCell className="font-medium">{item.description}</TableCell>
//                                                 <TableCell>
//                                                   <Select
//                                                     value={
//                                                       getChecklistItemValue(item.id, "required", item.required)
//                                                         ? "yes"
//                                                         : "no"
//                                                     }
//                                                     onValueChange={(value) =>
//                                                       handleChecklistItemChange(item.id, "required", value === "yes")
//                                                     }
//                                                   >
//                                                     <SelectTrigger className="w-20">
//                                                       <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                       <SelectItem value="yes">Yes</SelectItem>
//                                                       <SelectItem value="no">No</SelectItem>
//                                                     </SelectContent>
//                                                   </Select>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                   <Input
//                                                     value={
//                                                       getChecklistItemValue(item.id, "remarks", item.remarks) as string
//                                                     }
//                                                     onChange={(e) =>
//                                                       handleChecklistItemChange(item.id, "remarks", e.target.value)
//                                                     }
//                                                     placeholder="Enter remarks (optional)"
//                                                     className="min-w-[200px]"
//                                                   />
//                                                 </TableCell>
//                                               </TableRow>
//                                             ))}
//                                           </TableBody>
//                                         </Table>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Instructions Tab */}
//                 <TabsContent value="instructions" className="space-y-6 mt-6">
//                   <InstructionsTab
//                     instructions={instructions}
//                     onAddInstruction={handleAddInstruction}
//                     onInstructionChange={handleInstructionChange}
//                     onRemoveInstruction={handleRemoveInstruction}
//                   />
//                 </TabsContent>
//               </Tabs>

//               {/* Form Actions */}
//               <div className="flex justify-end gap-4">
//                 <Button variant="outline" onClick={onCancel}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isLoading || !isFormValid()}>
//                   {isLoading ? (
//                     <div className="flex items-center gap-2 animate-pulse">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                       <span>Updating...</span>
//                     </div>
//                   ) : (
//                     <>Update MPI</>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
















// "use client"

// import type React from "react"
// import { useState, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   ArrowLeft,
//   Factory,
//   Info,
//   ClipboardList,
//   FileText,
//   Download,
//   Eye,
//   StickyNote,
//   Plus,
//   Trash2,
//   X,
//   Upload,
//   AlertCircle,
// } from "lucide-react"
// import type { MPI, UpdateMPIDto } from "./types"
// import { StationAPI } from "../stations/station-api"
// import type { Station } from "../stations/types"
// import { useToast } from "@/hooks/use-toast"
// import { MPIAPI } from "./mpi-api"
// import { MPIDocumentationAPI } from "./mpi-document-api"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"
// import { API_BASE_URL } from "@/lib/constants"

// interface MPIEditProps {
//   mpi: MPI
//   onSubmit: (data: UpdateMPIDto) => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
// }

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   fileUrl?: string
//   unit?: string
// }

// interface ChecklistSection {
//   id: string
//   name: string
//   description: string
//   items: ChecklistItem[]
// }

// interface ChecklistItem {
//   id: string
//   description: string
//   required: boolean
//   remarks: string
//   category?: string
//   isActive: boolean
//   createdBy: string
//   sectionId: string
// }

// interface MPIDocumentation {
//   id?: string
//   file?: File
//   fileUrl?: string
//   description: string
//   fileName: string
//   originalFileName?: string
//   isUploaded?: boolean
// }

// interface StationNote {
//   id?: string
//   content: string
//   createdAt?: string
//   updatedAt?: string
// }

// interface StationDocument {
//   id: string
//   fileUrl: string
//   description: string
//   stationId: string
//   mpiId?: string
//   createdAt: string
//   updatedAt: string
// }

// // Helper function to safely convert order type to array
// const normalizeOrderType = (orderType: any): string[] => {
//   if (!orderType) return []
//   if (Array.isArray(orderType)) return orderType.filter((type) => typeof type === "string")
//   if (typeof orderType === "string") return [orderType]
//   return []
// }

// // Helper function to safely convert file action to array
// const normalizeFileAction = (fileAction: any): string[] => {
//   if (!fileAction) return []
//   if (Array.isArray(fileAction)) return fileAction.filter((action) => typeof action === "string")
//   if (typeof fileAction === "string") return [fileAction]
//   return []
// }

// export function MPIEdit({ mpi, onSubmit, onCancel, isLoading }: MPIEditProps) {
//   const [activeTab, setActiveTab] = useState("basic-info")
//   const [formData, setFormData] = useState({
//     jobId: mpi.jobId || "",
//     assemblyId: mpi.assemblyId || "",
//     customer: mpi.customer || "",
//     selectedStationIds: mpi.stations?.map((s) => s.id) || [],
//   })

//   // Order Form State - Initialize with existing data
//   const [orderFormData, setOrderFormData] = useState({
//     id: mpi.orderForms?.[0]?.id || "",
//     orderType: normalizeOrderType(mpi.orderForms?.[0]?.orderType),
//     distributionDate: mpi.orderForms?.[0]?.distributionDate
//       ? new Date(mpi.orderForms[0].distributionDate).toISOString().split("T")[0]
//       : "",
//     requiredBy: mpi.orderForms?.[0]?.requiredBy
//       ? new Date(mpi.orderForms[0].requiredBy).toISOString().split("T")[0]
//       : "",
//     internalOrderNumber: mpi.orderForms?.[0]?.internalOrderNumber || "",
//     revision: mpi.orderForms?.[0]?.revision || "",
//     otherAttachments: mpi.orderForms?.[0]?.otherAttachments || "",
//     fileAction: normalizeFileAction(mpi.orderForms?.[0]?.fileAction),
//     markComplete: mpi.orderForms?.[0]?.markComplete || false,
//     documentControlId: mpi.orderForms?.[0]?.documentControlId || "",
//   })

//   // Instructions state - Initialize with existing data
//   const [instructions, setInstructions] = useState<string[]>(mpi.Instruction || [])

//   // Add focus management for instruction inputs
//   const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
//   const instructionRefs = useRef<(HTMLInputElement | null)[]>([])

//   // Enums state
//   const [enums, setEnums] = useState<any>({})
//   const [loadingEnums, setLoadingEnums] = useState(false)

//   // Checklist template and existing checklist state
//   const [availableChecklistTemplate, setAvailableChecklistTemplate] = useState<ChecklistSection[]>([])
//   const [existingChecklists, setExistingChecklists] = useState<ChecklistSection[]>([])
//   const [loadingAvailableChecklist, setLoadingAvailableChecklist] = useState(false)

//   // Specification values state - Initialize with existing values
//   const [specificationValues, setSpecificationValues] = useState<Record<string, SpecificationValue>>(() => {
//     const initialValues: Record<string, SpecificationValue> = {}
//     console.log("🔍 Initializing specification values from MPI data:", mpi)

//     mpi.stations?.forEach((station) => {
//       console.log(`📍 Processing station: ${station.stationName} (${station.id})`)
//       station.specifications?.forEach((spec) => {
//         console.log(`🔧 Processing spec: ${spec.name} (${spec.id})`)
//         // Look for existing values in multiple places
//         let existingValue = null

//         // Method 1: Check stationSpecifications array
//         if (spec.stationSpecifications && spec.stationSpecifications.length > 0) {
//           existingValue = spec.stationSpecifications.find((ss) => ss.stationId === station.id)
//           console.log(`📋 Found in stationSpecifications:`, existingValue)
//         }

//         // Method 2: Check if there's a direct value on the spec
//         if (!existingValue && spec.value) {
//           existingValue = { value: spec.value, unit: spec.unit }
//           console.log(`📋 Found direct value on spec:`, existingValue)
//         }

//         // Method 3: Check station's specificationValues if it exists
//         if (!existingValue && station.specificationValues) {
//           const stationSpecValue = station.specificationValues.find((sv: any) => sv.specificationId === spec.id)
//           if (stationSpecValue) {
//             existingValue = { value: stationSpecValue.value, unit: stationSpecValue.unit }
//             console.log(`📋 Found in station specificationValues:`, existingValue)
//           }
//         }

//         if (existingValue && existingValue.value) {
//           initialValues[spec.id] = {
//             specificationId: spec.id,
//             value: existingValue.value,
//             unit: existingValue.unit || undefined,
//             fileUrl: existingValue.fileUrl || undefined,
//           }
//           console.log(`✅ Initialized spec ${spec.id} with value:`, initialValues[spec.id])
//         } else {
//           // Initialize with empty value for specs without existing data
//           initialValues[spec.id] = {
//             specificationId: spec.id,
//             value: "",
//             unit: undefined,
//             fileUrl: undefined,
//           }
//           console.log(`🆕 Initialized spec ${spec.id} with empty value`)
//         }
//       })
//     })

//     console.log("🎯 Final initial specification values:", initialValues)
//     return initialValues
//   })

//   const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())

//   // MPI Documentation State - Enhanced with proper filename handling
//   const [mpiDocumentation, setMpiDocumentation] = useState<MPIDocumentation[]>(() => {
//     // Initialize with existing MPI documents
//     return (
//       mpi.mpiDocs?.map((doc) => ({
//         id: doc.id,
//         fileUrl: doc.fileUrl,
//         description: doc.description,
//         fileName: doc.fileName || doc.description, // Use fileName if available, fallback to description
//         originalFileName: doc.originalFileName || doc.fileName || doc.description,
//         isUploaded: true,
//       })) || []
//     )
//   })

//   const [uploadingMpiDoc, setUploadingMpiDoc] = useState(false)

//   // Checklist modifications state - Initialize with existing checklist data
//   const [checklistModifications, setChecklistModifications] = useState<
//     Record<string, { required: boolean; remarks: string }>
//   >(() => {
//     const initialModifications: Record<string, { required: boolean; remarks: string }> = {}
//     // Initialize with existing checklist data
//     mpi.checklists?.forEach((checklist) => {
//       checklist.checklistItems?.forEach((item, itemIndex) => {
//         const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
//         initialModifications[itemId] = {
//           required: item.required,
//           remarks: item.remarks,
//         }
//       })
//     })
//     console.log("Initial checklist modifications:", initialModifications)
//     return initialModifications
//   })

//   const [availableStations, setAvailableStations] = useState<Station[]>([])
//   const [loadingStations, setLoadingStations] = useState(false)
//   const [selectedStations, setSelectedStations] = useState<Station[]>([])

//   // Station view state for instructions tab
//   const [activeStationId, setActiveStationId] = useState<string | null>(null)
//   const [stationViewMode, setStationViewMode] = useState<"specifications" | "documents" | "notes">("specifications")

//   // Station notes state
//   const [stationNotes, setStationNotes] = useState<Record<string, StationNote[]>>({})
//   const [loadingNotes, setLoadingNotes] = useState<Set<string>>(new Set())
//   const [newNoteContent, setNewNoteContent] = useState("")
//   const [addingNote, setAddingNote] = useState(false)

//   // Station documents state
//   const [stationDocuments, setStationDocuments] = useState<Record<string, StationDocument[]>>({})
//   const [loadingDocuments, setLoadingDocuments] = useState<Set<string>>(new Set())
//   const [uploadingStationDoc, setUploadingStationDoc] = useState(false)

//   // Validation state
//   const [existingJobIds, setExistingJobIds] = useState<string[]>([])
//   const [existingAssemblyIds, setExistingAssemblyIds] = useState<string[]>([])
//   const [existingDocumentControlIds, setExistingDocumentControlIds] = useState<string[]>([])
//   const [checkingIds, setCheckingIds] = useState(false)

//   const { toast } = useToast()

//   // Initialize station notes from MPI data
//   useEffect(() => {
//     const initialNotes: Record<string, StationNote[]> = {}
//     mpi.stations?.forEach((station) => {
//       if (station.Note && Array.isArray(station.Note)) {
//         initialNotes[station.id] = station.Note.map((note, index) => ({
//           id: `note-${station.id}-${index}`,
//           content: note,
//           createdAt: new Date().toISOString(),
//         }))
//       }
//     })
//     setStationNotes(initialNotes)
//   }, [mpi.stations])

//   // Initialize station documents from MPI data
//   useEffect(() => {
//     const initialDocs: Record<string, StationDocument[]> = {}
//     mpi.stations?.forEach((station) => {
//       if (station.documentations && Array.isArray(station.documentations)) {
//         initialDocs[station.id] = station.documentations
//       }
//     })
//     setStationDocuments(initialDocs)
//   }, [mpi.stations])

//   // Restore focus to instruction input after re-render
//   useEffect(() => {
//     if (focusedInstructionIndex !== null && instructionRefs.current[focusedInstructionIndex]) {
//       const input = instructionRefs.current[focusedInstructionIndex]
//       if (input) {
//         const cursorPosition = input.selectionStart || 0
//         // Use setTimeout to ensure the DOM has updated
//         setTimeout(() => {
//           input.focus()
//           input.setSelectionRange(cursorPosition, cursorPosition)
//         }, 0)
//       }
//     }
//   }, [instructions, focusedInstructionIndex])

//   // Load existing IDs for validation (excluding current MPI)
//   const loadExistingIds = async () => {
//     try {
//       setCheckingIds(true)
//       const mpis = await MPIAPI.getAllMPIs()
//       // Filter out current MPI from validation
//       const otherMpis = mpis.filter((m) => m.id !== mpi.id)
//       const jobIds = otherMpis.map((m) => m.jobId.toLowerCase())
//       const assemblyIds = otherMpis.map((m) => m.assemblyId.toLowerCase())
//       const documentControlIds = otherMpis
//         .filter((m) => m.orderForms && m.orderForms.length > 0)
//         .flatMap((m) => m.orderForms.map((form) => form.documentControlId))
//         .filter(Boolean)
//         .map((id) => id.toLowerCase())

//       setExistingJobIds(jobIds)
//       setExistingAssemblyIds(assemblyIds)
//       setExistingDocumentControlIds(documentControlIds)
//     } catch (error) {
//       console.error("Failed to load existing IDs:", error)
//     } finally {
//       setCheckingIds(false)
//     }
//   }

//   // Validation functions
//   const validateJobId = (jobId: string): string | null => {
//     if (!jobId.trim()) return "Job ID is required"
//     if (jobId.length < 2) return "Job ID must be at least 2 characters"
//     if (existingJobIds.includes(jobId.toLowerCase())) {
//       return `Job ID "${jobId}" already exists. Please use a different Job ID.`
//     }
//     return null
//   }

//   const validateAssemblyId = (assemblyId: string): string | null => {
//     if (!assemblyId.trim()) return "Assembly ID is required"
//     if (assemblyId.length < 2) return "Assembly ID must be at least 2 characters"
//     if (existingAssemblyIds.includes(assemblyId.toLowerCase())) {
//       return `Assembly ID "${assemblyId}" already exists. Please use a different Assembly ID.`
//     }
//     return null
//   }

//   const validateDocumentControlId = (documentControlId: string): string | null => {
//     if (!documentControlId.trim()) return null
//     if (documentControlId.length < 2) return "Document Control ID must be at least 2 characters"
//     if (existingDocumentControlIds.includes(documentControlId.toLowerCase())) {
//       return `Document Control ID "${documentControlId}" already exists. Please use a different ID.`
//     }
//     return null
//   }

//   // Instruction handlers
//   const handleAddInstruction = () => {
//     setInstructions((prev) => [...prev, ""])
//   }

//   const handleInstructionChange = (index: number, value: string) => {
//     setInstructions((prev) => prev.map((instruction, i) => (i === index ? value : instruction)))
//   }

//   const handleRemoveInstruction = (index: number) => {
//     setInstructions((prev) => prev.filter((_, i) => i !== index))
//     toast({
//       title: "Instruction Removed",
//       description: "Instruction has been removed from the list.",
//     })
//   }

//   // Station notes handlers
//   const handleAddNote = async () => {
//     if (!activeStationId || !newNoteContent.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter note content.",
//         variant: "destructive",
//       })
//       return
//     }

//     setAddingNote(true)
//     try {
//       const newNote: StationNote = {
//         id: `note-${activeStationId}-${Date.now()}`,
//         content: newNoteContent.trim(),
//         createdAt: new Date().toISOString(),
//       }

//       setStationNotes((prev) => ({
//         ...prev,
//         [activeStationId]: [...(prev[activeStationId] || []), newNote],
//       }))

//       setNewNoteContent("")
//       toast({
//         title: "Success",
//         description: "Note added successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to add note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add note. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setAddingNote(false)
//     }
//   }

//   const handleDeleteNote = async (stationId: string, noteId: string) => {
//     try {
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: prev[stationId]?.filter((note) => note.id !== noteId) || [],
//       }))

//       toast({
//         title: "Success",
//         description: "Note deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete note. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Station document handlers
//   const handleStationDocumentUpload = async (file: File, description: string, fileName?: string) => {
//     if (!activeStationId) {
//       toast({
//         title: "Error",
//         description: "No station selected.",
//         variant: "destructive",
//       })
//       return
//     }

//     setUploadingStationDoc(true)
//     try {
//       const finalDescription = description.trim() || file.name
//       const finalFileName = fileName?.trim() || file.name

//       console.log("📤 Station document upload:", {
//         file: file.name,
//         description: finalDescription,
//         fileName: finalFileName,
//         stationId: activeStationId,
//         mpiId: mpi.id,
//       })

//       if (!mpi.id) {
//         // For new MPIs, queue the document locally
//         console.log("💾 QUEUING station document locally - MPI not created yet...")
//         if (file.size > 10 * 1024 * 1024) {
//           throw new Error("File size exceeds 10MB limit")
//         }

//         const newDoc = {
//           id: `temp-${Date.now()}`,
//           file: file,
//           description: finalDescription,
//           fileName: finalFileName,
//           stationId: activeStationId,
//           isUploaded: false,
//         }

//         setStationDocuments((prev) => ({
//           ...prev,
//           [activeStationId]: [...(prev[activeStationId] || []), newDoc],
//         }))

//         toast({
//           title: "✅ Document Queued Successfully",
//           description: `"${finalDescription}" will be uploaded when the MPI is saved.`,
//         })
//       } else {
//         // For existing MPIs, upload directly
//         console.log("📤 Uploading station document directly to existing MPI...")
//         const formData = new FormData()
//         formData.append("files", file)
//         formData.append("stationId", activeStationId)
//         formData.append("description", finalDescription)
//         formData.append("mpiId", mpi.id)
//         formData.append("originalName", file.name)

//         const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
//           method: "POST",
//           body: formData,
//         })

//         if (!response.ok) {
//           const errorText = await response.text()
//           console.error("❌ Direct upload failed:", errorText)
//           throw new Error(`Upload failed: ${response.status} - ${errorText}`)
//         }

//         const result = await response.json()
//         console.log("✅ Station document uploaded successfully:", result)

//         // Add to existing documents for the station
//         setStationDocuments((prev) => ({
//           ...prev,
//           [activeStationId]: [
//             ...(prev[activeStationId] || []),
//             {
//               id: result.id || `uploaded-${Date.now()}`,
//               fileUrl: result.fileUrl,
//               description: result.description || finalDescription,
//               fileName: result.fileName || finalFileName,
//               stationId: activeStationId,
//               isUploaded: true,
//             },
//           ],
//         }))

//         toast({
//           title: "Success",
//           description: "Station document uploaded successfully.",
//         })
//       }
//     } catch (error) {
//       console.error("Station document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingStationDoc(false)
//     }
//   }

//   const handleDeleteStationDocument = async (stationId: string, documentId: string) => {
//     try {
//       // Check if it's an uploaded document or queued document
//       const stationDocs = stationDocuments[stationId] || []
//       const doc = stationDocs.find((d) => d.id === documentId)

//       if (doc && doc.isUploaded && doc.id && !doc.id.startsWith("temp-")) {
//         // Delete uploaded document via API
//         await StationMpiDocAPI.delete(documentId)
//       }

//       // Remove from local state
//       setStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: prev[stationId]?.filter((doc) => doc.id !== documentId) || [],
//       }))

//       toast({
//         title: "Success",
//         description: "Document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete document. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Enhanced MPI Documentation handlers with proper filename support
//   const handleMpiDocumentUpload = async (file: File, description: string) => {
//     setUploadingMpiDoc(true)
//     try {
//       if (!file) {
//         throw new Error("No file selected")
//       }

//       const finalDescription = description.trim() || file.name

//       console.log("📤 MPI document upload:", {
//         originalFile: file.name,
//         description: finalDescription,
//         fileSize: file.size,
//       })

//       // For edit mode, upload immediately since MPI already exists
//       const result = await MPIDocumentationAPI.uploadDocument(mpi.id, file, finalDescription, file.name)

//       const newDoc: MPIDocumentation = {
//         id: result.id,
//         fileUrl: result.fileUrl,
//         description: result.description,
//         fileName: file.name,
//         originalFileName: file.name,
//         isUploaded: true,
//       }

//       setMpiDocumentation((prev) => [...prev, newDoc])

//       toast({
//         title: "Success",
//         description: "Document uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("Document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingMpiDoc(false)
//     }
//   }

//   const removeMpiDocument = async (index: number) => {
//     const doc = mpiDocumentation[index]
//     if (doc.id && doc.isUploaded) {
//       try {
//         await MPIDocumentationAPI.deleteDocument(doc.id)
//         toast({
//           title: "Success",
//           description: "Document deleted successfully.",
//         })
//       } catch (error) {
//         console.error("Failed to delete document:", error)
//         toast({
//           title: "Error",
//           description: "Failed to delete document.",
//           variant: "destructive",
//         })
//         return
//       }
//     }
//     setMpiDocumentation((prev) => prev.filter((_, i) => i !== index))
//   }

//   useEffect(() => {
//     loadStations()
//     loadEnums()
//     loadChecklistData()
//     loadExistingIds()
//   }, [])

//   useEffect(() => {
//     // Update selected stations when formData.selectedStationIds changes
//     const selected = availableStations.filter((station) => formData.selectedStationIds.includes(station.id))
//     setSelectedStations(selected)
//   }, [formData.selectedStationIds, availableStations])

//   const loadStations = async () => {
//     try {
//       setLoadingStations(true)
//       const stations = await StationAPI.getAllStations()
//       setAvailableStations(stations)
//     } catch (error) {
//       console.error("Failed to load stations:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load stations. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingStations(false)
//     }
//   }

//   const loadEnums = async () => {
//     try {
//       setLoadingEnums(true)
//       const enumsData = await MPIAPI.getEnums()
//       setEnums(enumsData)
//     } catch (error) {
//       console.error("Failed to load enums:", error)
//       toast({
//         title: "Warning",
//         description: "Failed to load form options.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingEnums(false)
//     }
//   }

//   const loadChecklistData = async () => {
//     try {
//       setLoadingAvailableChecklist(true)
//       // Load existing checklists from MPI - show ONLY REQUIRED items (like details page)
//       const existingChecklistSections: ChecklistSection[] = []
//       const existingItemDescriptions = new Set<string>()

//       if (mpi.checklists && mpi.checklists.length > 0) {
//         mpi.checklists.forEach((checklist, checklistIndex) => {
//           if (checklist.checklistItems && checklist.checklistItems.length > 0) {
//             // Filter to only show required items (exactly like details page)
//             const requiredItems = checklist.checklistItems.filter((item) => item.required === true)

//             if (requiredItems.length > 0) {
//               existingChecklistSections.push({
//                 id: `existing-section-${checklistIndex}`,
//                 name: checklist.name,
//                 description: `${checklist.name} - Existing required checklist items`,
//                 items: requiredItems.map((item, itemIndex) => {
//                   // Track this item as existing
//                   existingItemDescriptions.add(item.description.toLowerCase().trim())
//                   return {
//                     id: `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
//                     description: item.description,
//                     required: item.required,
//                     remarks: item.remarks,
//                     category: item.category || checklist.name,
//                     isActive: item.isActive,
//                     createdBy: item.createdBy,
//                     sectionId: `existing-section-${checklistIndex}`,
//                   }
//                 }),
//               })
//             }
//           }
//         })
//       }

//       setExistingChecklists(existingChecklistSections)

//       // Load available checklist template and filter out existing items
//       const template = await MPIAPI.getChecklistTemplate()
//       console.log("📦 Available checklist template loaded:", template)

//       if (template && Array.isArray(template)) {
//         const validSections = template
//           .filter(
//             (section) =>
//               section && typeof section === "object" && section.name && Array.isArray(section.checklistItems),
//           )
//           .map((section, sectionIndex) => {
//             // Filter out items that already exist in the MPI
//             const availableItems = (section.checklistItems || [])
//               .filter((item: any) => {
//                 const itemDescription = item.description?.toLowerCase().trim()
//                 return itemDescription && !existingItemDescriptions.has(itemDescription)
//               })
//               .map((item: any, itemIndex: number) => ({
//                 id: `available-${section.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
//                 description: item.description || "No description",
//                 required: false, // Default to No for available items
//                 remarks: "",
//                 category: item.category || section.name,
//                 isActive: item.isActive !== undefined ? item.isActive : true,
//                 createdBy: item.createdBy || "System",
//                 sectionId: `available-section-${sectionIndex}`,
//               }))

//             return availableItems.length > 0
//               ? {
//                   id: `available-section-${sectionIndex}`,
//                   name: section.name,
//                   description: `${section.name} quality control items`,
//                   items: availableItems,
//                 }
//               : null
//           })
//           .filter(Boolean)

//         setAvailableChecklistTemplate(validSections)
//       } else {
//         setAvailableChecklistTemplate([])
//       }
//     } catch (error) {
//       console.error("Failed to load checklist data:", error)
//       setAvailableChecklistTemplate([])
//       setExistingChecklists([])
//     } finally {
//       setLoadingAvailableChecklist(false)
//     }
//   }

//   const handleChecklistItemChange = (itemId: string, field: "required" | "remarks", value: boolean | string) => {
//     setChecklistModifications((prev) => ({
//       ...prev,
//       [itemId]: {
//         ...prev[itemId],
//         [field]: value,
//       },
//     }))
//   }

//   const getChecklistItemValue = (itemId: string, field: "required" | "remarks", defaultValue: boolean | string) => {
//     return checklistModifications[itemId]?.[field] ?? defaultValue
//   }

//   const handleOrderFormChange = (field: string, value: string | boolean | string[]) => {
//     setOrderFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log("🔄 Starting form submission...")

//     // Validation - Reload existing IDs first
//     await loadExistingIds()

//     // Enhanced validation with better error messages
//     const jobIdError = validateJobId(formData.jobId)
//     const assemblyIdError = validateAssemblyId(formData.assemblyId)
//     const documentControlIdError = orderFormData.documentControlId
//       ? validateDocumentControlId(orderFormData.documentControlId)
//       : null

//     const validationErrors = []
//     if (jobIdError) validationErrors.push(`Job ID: ${jobIdError}`)
//     if (assemblyIdError) validationErrors.push(`Assembly ID: ${assemblyIdError}`)
//     if (documentControlIdError) validationErrors.push(`Document Control ID: ${documentControlIdError}`)

//     // Check for required fields
//     if (!formData.jobId.trim()) validationErrors.push("Job ID is required")
//     if (!formData.assemblyId.trim()) validationErrors.push("Assembly ID is required")

//     if (validationErrors.length > 0) {
//       toast({
//         title: "❌ Validation Failed",
//         description: (
//           <div className="space-y-2">
//             <p className="font-semibold">Please fix the following issues:</p>
//             <ul className="list-disc list-inside space-y-1">
//               {validationErrors.map((error, index) => (
//                 <li key={index} className="text-sm">
//                   {error}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ),
//         variant: "destructive",
//         duration: 10000,
//       })
//       setActiveTab("basic-info")
//       return
//     }

//     console.log("Selected stations:", formData.selectedStationIds)
//     console.log("Current specification values:", specificationValues)
//     console.log("Current checklist modifications:", checklistModifications)

//     // Prepare stations data - Send ALL selected stations with their specification values in the correct format
//     const stationsData = formData.selectedStationIds
//       .map((stationId) => {
//         const station = selectedStations.find((s) => s.id === stationId)
//         if (!station) return null

//         // Get specification values for this station in the format the backend expects
//         const stationSpecificationValues =
//           station.specifications?.map((spec) => {
//             const specValue = specificationValues[spec.id]
//             return {
//               specificationId: spec.id,
//               value: specValue?.value || "", // Send current value or empty string
//               ...(specValue?.unit && { unit: specValue.unit }),
//               ...(specValue?.fileUrl && { fileUrl: specValue.fileUrl }),
//             }
//           }) || []

//         // Include station notes in the update
//         const stationNotesArray = stationNotes[stationId]?.map((note) => note.content) || []

//         return {
//           id: station.id,
//           stationId: station.stationId,
//           stationName: station.stationName,
//           status: station.status,
//           description: station.description || "",
//           location: station.location || "",
//           operator: station.operator || "",
//           priority: station.priority || 1,
//           Note: stationNotesArray,
//           // Send specification values in the format the backend expects
//           specificationValues: stationSpecificationValues,
//         }
//       })
//       .filter(Boolean)

//     console.log("📤 Stations data being sent:", JSON.stringify(stationsData, null, 2))
//     console.log("🔧 Current specification values:", specificationValues)

//     // Prepare existing checklist updates with ACTUAL database IDs
//     const existingChecklistUpdates: any[] = []
//     if (mpi.checklists && mpi.checklists.length > 0) {
//       mpi.checklists.forEach((checklist) => {
//         const updatedItems: any[] = []
//         let hasChanges = false

//         if (checklist.checklistItems && checklist.checklistItems.length > 0) {
//           checklist.checklistItems.forEach((item, itemIndex) => {
//             const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
//             const modifications = checklistModifications[itemId]

//             if (modifications) {
//               // Check if there are actual changes
//               if (modifications.required !== item.required || modifications.remarks !== item.remarks) {
//                 hasChanges = true
//               }

//               updatedItems.push({
//                 id: item.id, // Use the actual database ID from the MPI
//                 description: item.description,
//                 required: modifications.required,
//                 remarks: modifications.remarks,
//                 category: item.category,
//                 createdBy: item.createdBy,
//                 isActive: item.isActive,
//               })
//             }
//           })
//         }

//         // Only include checklist if there are actual changes
//         if (hasChanges && updatedItems.length > 0) {
//           existingChecklistUpdates.push({
//             id: checklist.id, // Use the actual checklist database ID
//             name: checklist.name,
//             checklistItems: updatedItems,
//           })
//         }
//       })
//     }

//     // Prepare new checklists from available template
//     const newChecklists: any[] = []
//     availableChecklistTemplate.forEach((section) => {
//       const newItems: any[] = []

//       section.items.forEach((item) => {
//         const modifications = checklistModifications[item.id]
//         if (modifications && modifications.required) {
//           newItems.push({
//             description: item.description,
//             required: modifications.required,
//             remarks: modifications.remarks || "",
//             createdBy: item.createdBy || "System",
//             isActive: item.isActive !== undefined ? item.isActive : true,
//             category: item.category || section.name,
//           })
//         }
//       })

//       if (newItems.length > 0) {
//         newChecklists.push({
//           name: section.name,
//           checklistItems: newItems,
//         })
//       }
//     })

//     // Prepare complete submission data matching backend expectations
//     const submitData: any = {
//       jobId: formData.jobId,
//       assemblyId: formData.assemblyId,
//       customer: formData.customer || null,
//     }

//     // FIXED: Always include order forms for updates with proper structure
//     const orderFormSubmissionData = {
//       id: orderFormData.id || undefined, // Include ID if exists for update
//       OrderType: orderFormData.orderType,
//       distributionDate: orderFormData.distributionDate ? new Date(orderFormData.distributionDate).toISOString() : null,
//       requiredBy: orderFormData.requiredBy ? new Date(orderFormData.requiredBy).toISOString() : null,
//       internalOrderNumber: orderFormData.internalOrderNumber || null,
//       revision: orderFormData.revision || null,
//       otherAttachments: orderFormData.otherAttachments || null,
//       fileAction: orderFormData.fileAction,
//       markComplete: orderFormData.markComplete,
//       documentControlId: orderFormData.documentControlId || null,
//     }

//     // Send as array to match backend expectation
//     submitData.orderForms = [orderFormSubmissionData]

//     console.log("📋 Order form data being sent:", JSON.stringify(submitData.orderForms, null, 2))

//     // Add stations with specifications if they exist
//     if (stationsData.length > 0) {
//       submitData.stations = stationsData
//     }

//     // Combine existing and new checklists for the backend
//     const allChecklists = [...existingChecklistUpdates, ...newChecklists]
//     if (allChecklists.length > 0) {
//       submitData.checklists = allChecklists
//     }

//     // Add instructions - always include for updates (use backend field name 'Instruction')
//     submitData.Instruction = instructions.filter((instruction) => instruction.trim() !== "")

//     // Add uploaded documents to submission data with both description and fileName
//     if (mpiDocumentation.length > 0) {
//       const uploadedDocs = mpiDocumentation
//         .filter((doc) => doc.isUploaded && doc.fileUrl)
//         .map((doc) => ({
//           id: doc.id,
//           fileUrl: doc.fileUrl,
//           description: doc.description,
//           fileName: doc.fileName, // Include fileName for backend
//           originalFileName: doc.originalFileName, // Include original filename
//         }))

//       if (uploadedDocs.length > 0) {
//         submitData.mpiDocs = uploadedDocs
//       }
//     }

//     console.log("📤 Submitting MPI update data:", JSON.stringify(submitData, null, 2))

//     try {
//       await onSubmit(submitData as UpdateMPIDto)
//       if (newChecklists.length > 0) {
//         toast({
//           title: "Success",
//           description: `MPI updated successfully with ${newChecklists.length} new checklist section(s) added.`,
//         })
//       } else {
//         toast({
//           title: "Success",
//           description: "MPI updated successfully.",
//         })
//       }
//     } catch (error: any) {
//       console.error("Form submission error:", error)
//       // Handle specific error types
//       if (error.message?.includes("Unique constraint failed")) {
//         if (error.message?.includes("documentControlId")) {
//           toast({
//             title: "🚫 Duplicate Document Control ID",
//             description: `Document Control ID "${orderFormData.documentControlId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         } else if (error.message?.includes("jobId")) {
//           toast({
//             title: "🚫 Duplicate Job ID",
//             description: `Job ID "${formData.jobId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         } else if (error.message?.includes("assemblyId")) {
//           toast({
//             title: "🚫 Duplicate Assembly ID",
//             description: `Assembly ID "${formData.assemblyId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         }
//       }

//       toast({
//         title: "Submission Error",
//         description: error.message || "Failed to update MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleStationSelectionChange = (stationIds: string[]) => {
//     setFormData((prev) => ({ ...prev, selectedStationIds: stationIds }))
//   }

//   const handleSpecificationValueChange = (specificationId: string, value: string, unit?: string) => {
//     console.log("🔧 Updating specification:", specificationId, "with value:", value, "unit:", unit)
//     setSpecificationValues((prev) => {
//       const updated = {
//         ...prev,
//         [specificationId]: {
//           specificationId,
//           value,
//           unit,
//           fileUrl: prev[specificationId]?.fileUrl,
//         },
//       }
//       console.log("🔧 Updated specification values:", updated)
//       return updated
//     })
//   }

//   const handleFileUpload = async (specificationId: string, file: File, stationId: string, unit?: string) => {
//     console.log("📁 Starting file upload for spec:", specificationId, "station:", stationId)
//     setUploadingFiles((prev) => new Set(prev).add(specificationId))

//     try {
//       const result = await StationAPI.uploadStationSpecificationFile(file, specificationId, stationId, unit)
//       console.log("📁 File upload result:", result)

//       setSpecificationValues((prev) => {
//         const updated = {
//           ...prev,
//           [specificationId]: {
//             specificationId,
//             value: result.value || file.name,
//             fileUrl: result.fileUrl,
//             unit: unit || prev[specificationId]?.unit,
//           },
//         }
//         console.log("📁 Updated specification values after upload:", updated)
//         return updated
//       })

//       toast({
//         title: "Success",
//         description: "File uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("File upload error:", error)
//       toast({
//         title: "Error",
//         description: "Failed to upload file. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingFiles((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(specificationId)
//         return newSet
//       })
//     }
//   }

//   const renderSpecificationInput = (spec: any, stationId: string) => {
//     const specValue = specificationValues[spec.id]
//     const isUploading = uploadingFiles.has(spec.id)

//     // Only log if there's an issue or for debugging specific specs
//     if (!specValue && spec.required) {
//       console.log(`⚠️ Required spec ${spec.name} (${spec.id}) has no value`)
//     }

//     switch (spec.inputType) {
//       case "TEXT":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Input
//               id={`spec-${spec.id}`}
//               value={specValue?.value || ""}
//               onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value)}
//               placeholder={`Enter ${spec.name.toLowerCase()}`}
//               className="h-10"
//             />
//           </div>
//         )

//       case "number":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <div className="flex gap-2">
//               <Input
//                 id={`spec-${spec.id}`}
//                 type="number"
//                 value={specValue?.value || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value, specValue?.unit)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10 flex-1"
//               />
//               <Input
//                 placeholder="Unit"
//                 value={specValue?.unit || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
//                 className="h-10 w-20"
//               />
//             </div>
//           </div>
//         )

//       case "CHECKBOX":
//         return (
//           <div className="space-y-2">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id={`spec-${spec.id}`}
//                 checked={specValue?.value === "true"}
//                 onCheckedChange={(checked) => handleSpecificationValueChange(spec.id, checked ? "true" : "false")}
//               />
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>
//             </div>
//           </div>
//         )

//       case "DROPDOWN":
//         const suggestions = spec.suggestions || []
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Select
//               value={specValue?.value || ""}
//               onValueChange={(value) => handleSpecificationValueChange(spec.id, value)}
//             >
//               <SelectTrigger className="h-10">
//                 <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
//               </SelectTrigger>
//               <SelectContent>
//                 {suggestions.map((suggestion: string, index: number) => (
//                   <SelectItem key={index} value={suggestion}>
//                     {suggestion}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )

//       case "FILE_UPLOAD":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <Input
//                   id={`spec-${spec.id}`}
//                   type="file"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0]
//                     if (file) {
//                       handleFileUpload(spec.id, file, stationId, specValue?.unit)
//                     }
//                   }}
//                   accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
//                   className="cursor-pointer flex-1"
//                   disabled={isUploading}
//                 />
//                 {isUploading && (
//                   <div className="flex items-center gap-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//                     <span className="text-xs text-muted-foreground">Uploading...</span>
//                   </div>
//                 )}
//               </div>
//               <Input
//                 placeholder="Unit (optional)"
//                 value={specValue?.unit || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
//                 className="h-10 w-32"
//               />
//               {specValue?.fileUrl && (
//                 <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
//                   <FileText className="w-4 h-4 text-green-600" />
//                   <span className="text-sm text-green-800">File uploaded successfully</span>
//                   <a
//                     href={specValue.fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-xs text-blue-600 hover:underline"
//                   >
//                     View
//                   </a>
//                 </div>
//               )}
//               <p className="text-xs text-muted-foreground">
//                 Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
//               </p>
//             </div>
//           </div>
//         )

//       default:
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Input
//               id={`spec-${spec.id}`}
//               value={specValue?.value || ""}
//               onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value)}
//               placeholder={`Enter ${spec.name.toLowerCase()}`}
//               className="h-10"
//             />
//           </div>
//         )
//     }
//   }

//   const renderStationDocuments = (stationId: string) => {
//     const documents = stationDocuments[stationId] || []

//     return (
//       <div className="space-y-4">
//         {/* Upload Section */}
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
//           <div className="space-y-4">
//             <h4 className="font-medium text-sm">Upload Station Document</h4>
//             <div className="grid grid-cols-1 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="station-doc-file">Select Files *</Label>
//                 <Input
//                   id="station-doc-file"
//                   type="file"
//                   accept="*/*"
//                   className="cursor-pointer"
//                   disabled={uploadingStationDoc}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="station-doc-description">Description</Label>
//                 <Input
//                   id="station-doc-description"
//                   placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                   disabled={uploadingStationDoc}
//                 />
//               </div>
//             </div>
//             <Button
//               type="button"
//               variant="outline"
//               disabled={uploadingStationDoc}
//               onClick={async () => {
//                 const fileInput = document.getElementById("station-doc-file") as HTMLInputElement
//                 const descInput = document.getElementById("station-doc-description") as HTMLInputElement
//                 const file = fileInput?.files?.[0]
//                 const description = descInput?.value?.trim() || ""

//                 if (!file) {
//                   toast({
//                     title: "Missing File",
//                     description: "Please select a file to upload.",
//                     variant: "destructive",
//                   })
//                   return
//                 }

//                 await handleStationDocumentUpload(file, description, file.name)
//                 fileInput.value = ""
//                 descInput.value = ""
//               }}
//               className="w-full"
//             >
//               {uploadingStationDoc ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                   Uploading File...
//                 </div>
//               ) : (
//                 <>
//                   <Upload className="w-4 h-4 mr-2" />
//                   Upload File
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Documents List */}
//         {documents.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No files available for this station.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 gap-4">
//               {documents.map((doc) => (
//                 <div key={doc.id} className="p-4 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start gap-3 flex-1">
//                       <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-medium text-sm text-gray-900 truncate">
//                           {doc.description || "Untitled Document"}
//                         </h4>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Uploaded: {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "Unknown date"}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 ml-4">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => window.open(doc.fileUrl, "_blank")}
//                         className="h-8 px-3"
//                       >
//                         <Eye className="w-3 h-3 mr-1" />
//                         View
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           const link = document.createElement("a")
//                           link.href = doc.fileUrl
//                           link.download = doc.description || "document"
//                           link.click()
//                         }}
//                         className="h-8 px-3"
//                       >
//                         <Download className="w-3 h-3 mr-1" />
//                         Download
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleDeleteStationDocument(stationId, doc.id)}
//                         className="h-8 px-3 text-red-600 hover:text-red-700"
//                       >
//                         <Trash2 className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const renderStationNotes = (stationId: string) => {
//     const notes = stationNotes[stationId] || []

//     return (
//       <div className="space-y-4">
//         {/* Add Note Section */}
//         <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
//             <Plus className="w-4 h-4" />
//             Add Station Note
//           </h4>
//           <div className="space-y-3">
//             <Textarea
//               value={newNoteContent}
//               onChange={(e) => setNewNoteContent(e.target.value)}
//               placeholder="Enter operational notes, safety instructions, or maintenance reminders..."
//               rows={3}
//               className="resize-none"
//             />
//             <Button
//               onClick={handleAddNote}
//               disabled={addingNote || !newNoteContent.trim()}
//               size="sm"
//               className="w-full"
//             >
//               {addingNote ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                   Adding Note...
//                 </div>
//               ) : (
//                 <>
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Note
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Notes List */}
//         {notes.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No notes available for this station.</p>
//             <p className="text-sm text-muted-foreground mt-1">
//               Add operational notes, safety instructions, or reminders above.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             <h4 className="font-medium text-sm flex items-center gap-2">
//               <StickyNote className="w-4 h-4" />
//               Station Notes ({notes.length})
//             </h4>
//             <div className="space-y-2">
//               {notes.map((note) => (
//                 <div key={note.id} className="p-3 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.content}</p>
//                       <p className="text-xs text-gray-500 mt-2">
//                         {note.createdAt ? new Date(note.createdAt).toLocaleString() : "Unknown date"}
//                       </p>
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => handleDeleteNote(stationId, note.id!)}
//                       className="ml-3 h-8 px-2 text-red-600 hover:text-red-700"
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const isFormValid = () => {
//     const jobIdError = validateJobId(formData.jobId)
//     const assemblyIdError = validateAssemblyId(formData.assemblyId)
//     const documentControlIdError = orderFormData.documentControlId
//       ? validateDocumentControlId(orderFormData.documentControlId)
//       : null

//     return !jobIdError && !assemblyIdError && !documentControlIdError
//   }

//   // Enhanced InstructionsTab component with proper focus management
//   const InstructionsTab = ({
//     instructions,
//     onAddInstruction,
//     onInstructionChange,
//     onRemoveInstruction,
//   }: {
//     instructions: string[]
//     onAddInstruction: () => void
//     onInstructionChange: (index: number, value: string) => void
//     onRemoveInstruction: (index: number) => void
//   }) => {
//     return (
//       <div className="space-y-6">
//         {/* Instructions Section */}
//         <Card>
//           <CardContent className="mt-5">
//             <div className="space-y-4">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h4 className="text-lg font-semibold text-red-800">General Instructions</h4>
//                   <p className="text-sm text-muted-foreground">
//                     Add general safety and operational instructions for this MPI
//                   </p>
//                 </div>
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="outline"
//                   onClick={() => {
//                     onAddInstruction()
//                     // Focus the new instruction input after it's added
//                     setTimeout(() => {
//                       setFocusedInstructionIndex(instructions.length)
//                     }, 0)
//                   }}
//                   className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Instruction
//                 </Button>
//               </div>
//               {instructions.length === 0 ? (
//                 <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                   <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm text-muted-foreground">No instructions added yet</p>
//                   <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {instructions.map((instruction, index) => (
//                     <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
//                       <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <Input
//                           ref={(el) => {
//                             instructionRefs.current[index] = el
//                           }}
//                           value={instruction}
//                           onChange={(e) => {
//                             setFocusedInstructionIndex(index)
//                             onInstructionChange(index, e.target.value)
//                           }}
//                           onFocus={() => setFocusedInstructionIndex(index)}
//                           onBlur={() => setFocusedInstructionIndex(null)}
//                           placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
//                           className="w-full"
//                         />
//                       </div>
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="ghost"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           onRemoveInstruction(index)
//                           // Clear focus tracking when removing instruction
//                           setFocusedInstructionIndex(null)
//                         }}
//                         className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
//                       >
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Stations Section */}
//         <Card>
//           <CardContent className="space-y-6 mt-5">
//             {loadingStations ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
//                   <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
//                 </div>
//               </div>
//             ) : availableStations.length === 0 ? (
//               <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
//               </div>
//             ) : (
//               <div className="flex gap-6 min-h-[600px]">
//                 {/* Left Sidebar - Station List */}
//                 <div className="w-1/4 border rounded-lg bg-gray-50">
//                   <div className="p-3 border-b bg-white rounded-t-lg">
//                     <h4 className="font-medium text-base">Stations</h4>
//                     <p className="text-xs text-muted-foreground">
//                       {formData.selectedStationIds.length > 0
//                         ? `${formData.selectedStationIds.length} selected`
//                         : "Click to select multiple"}
//                     </p>
//                   </div>
//                   <div className="p-2 overflow-y-auto h-[530px]">
//                     <div className="space-y-1">
//                       {availableStations.map((station) => {
//                         const noteCount = stationNotes[station.id]?.length || 0
//                         const docCount = stationDocuments[station.id]?.length || 0
//                         const isSelected = formData.selectedStationIds.includes(station.id)
//                         const isActive = activeStationId === station.id

//                         return (
//                           <div
//                             key={station.id}
//                             className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
//                               isSelected
//                                 ? "bg-blue-100 text-blue-900 border-blue-300"
//                                 : "bg-white hover:bg-gray-100 border-transparent"
//                             } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
//                             onClick={() => {
//                               setActiveStationId(station.id)
//                               if (isSelected) {
//                                 handleStationSelectionChange(
//                                   formData.selectedStationIds.filter((id) => id !== station.id),
//                                 )
//                               } else {
//                                 handleStationSelectionChange([...formData.selectedStationIds, station.id])
//                               }
//                             }}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="truncate">{station.stationName}</span>
//                               <div className="flex gap-1">
//                                 {noteCount > 0 && (
//                                   <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
//                                     {noteCount}N
//                                   </Badge>
//                                 )}
//                                 {docCount > 0 && (
//                                   <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
//                                     {docCount}D
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Panel - Station Details */}
//                 <div className="flex-1 border rounded-lg bg-gray-50">
//                   {!activeStationId ? (
//                     <div className="flex items-center justify-center h-full">
//                       <div className="text-center">
//                         <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <h4 className="font-medium text-gray-600 mb-2">No Station Selected</h4>
//                         <p className="text-sm text-muted-foreground">
//                           Select a station from the left sidebar to view its details
//                           {formData.selectedStationIds.length > 0 && (
//                             <span className="block mt-2 text-blue-600 font-medium">
//                               {formData.selectedStationIds.length} station
//                               {formData.selectedStationIds.length > 1 ? "s" : ""} selected for MPI
//                             </span>
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="h-full flex flex-col">
//                       <div className="p-4 border-b bg-white rounded-t-lg">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <Factory className="w-5 h-5 text-purple-600" />
//                             <div>
//                               <h4 className="font-medium text-lg">
//                                 {availableStations.find((s) => s.id === activeStationId)?.stationName}
//                               </h4>
//                               <p className="text-sm text-muted-foreground">Station Details</p>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "specifications" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("specifications")}
//                             >
//                               Specifications
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "documents" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("documents")}
//                             >
//                               Files
//                               {stationDocuments[activeStationId]?.length > 0 && (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {stationDocuments[activeStationId].length}
//                                 </Badge>
//                               )}
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "notes" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("notes")}
//                             >
//                               Notes
//                               {stationNotes[activeStationId]?.length > 0 && (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {stationNotes[activeStationId].length}
//                                 </Badge>
//                               )}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex-1 overflow-auto p-4">
//                         {stationViewMode === "specifications" && (
//                           <div>
//                             {(() => {
//                               const station = availableStations.find((s) => s.id === activeStationId)
//                               if (!station) return null

//                               if (!station.specifications || station.specifications.length === 0) {
//                                 return (
//                                   <div className="text-center py-6">
//                                     <p className="text-muted-foreground">
//                                       No specifications available for this station.
//                                     </p>
//                                   </div>
//                                 )
//                               }

//                               return (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   {station.specifications.map((spec) => (
//                                     <div key={spec.id} className="space-y-3 p-3 bg-white rounded border">
//                                       {renderSpecificationInput(spec, station.id)}
//                                     </div>
//                                   ))}
//                                 </div>
//                               )
//                             })()}
//                           </div>
//                         )}
//                         {stationViewMode === "documents" && renderStationDocuments(activeStationId)}
//                         {stationViewMode === "notes" && renderStationNotes(activeStationId)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Selected Station Summary */}
//             {formData.selectedStationIds.length > 0 && (
//               <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <h4 className="font-medium text-blue-800 mb-3">Selected Stations</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedStations.map((station) => (
//                     <Badge key={station.id} variant="outline" className="bg-white">
//                       {station.stationName}
//                       {station.specifications && station.specifications.length > 0 && (
//                         <span className="ml-1 text-xs">({station.specifications.length} specs)</span>
//                       )}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between w-full">
//           <div>
//             <h1 className="text-3xl font-bold text-red-600">Edit MPI</h1>
//             <p className="text-muted-foreground">
//               Job ID: {mpi.jobId} • Assembly ID: {mpi.assemblyId}
//             </p>
//           </div>
//           <Button variant="outline" size="sm" onClick={onCancel}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
//         </div>

//         <Card className="border shadow-sm">
//           <CardContent className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-4">
//                   <TabsTrigger value="basic-info" className="flex items-center gap-2">
//                     <Info className="w-4 h-4" />
//                     Order Details
//                   </TabsTrigger>
//                   <TabsTrigger value="documentation" className="flex items-center gap-2">
//                     <FileText className="w-4 h-4" />
//                     Files
//                     {mpiDocumentation.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {mpiDocumentation.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="checklist" className="flex items-center gap-2">
//                     <ClipboardList className="w-4 h-4" />
//                     Checklist
//                     {existingChecklists.length + availableChecklistTemplate.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {existingChecklists.length + availableChecklistTemplate.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="instructions" className="flex items-center gap-2">
//                     <Factory className="w-4 h-4" />
//                     Instructions
//                     {selectedStations.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {selectedStations.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                 </TabsList>

//                 {/* Basic Information & Order Form Tab */}
//                 <TabsContent value="basic-info" className="space-y-6 mt-6">
//                   {/* MPI Basic Information */}
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="jobId">
//                             MPI ID *{checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="jobId"
//                             value={formData.jobId}
//                             onChange={(e) => handleChange("jobId", e.target.value)}
//                             placeholder="Enter job ID"
//                             required
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = validateJobId(formData.jobId)
//                             return error ? (
//                               <p className="text-xs text-red-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="assemblyId">
//                             Assembly ID *
//                             {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="assemblyId"
//                             value={formData.assemblyId}
//                             onChange={(e) => handleChange("assemblyId", e.target.value)}
//                             placeholder="Enter assembly ID"
//                             required
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = validateAssemblyId(formData.assemblyId)
//                             return error ? (
//                               <p className="text-xs text-red-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="customer">Customer</Label>
//                           <Input
//                             id="customer"
//                             value={formData.customer}
//                             onChange={(e) => handleChange("customer", e.target.value)}
//                             placeholder="Enter customer name"
//                             className="h-11"
//                           />
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   {/* Order Forms Section */}
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="internalOrderNumber">Internal Order Number</Label>
//                           <Input
//                             id="internalOrderNumber"
//                             value={orderFormData.internalOrderNumber}
//                             onChange={(e) => handleOrderFormChange("internalOrderNumber", e.target.value)}
//                             placeholder="Enter internal order number"
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="revision">Revision</Label>
//                           <Input
//                             id="revision"
//                             value={orderFormData.revision}
//                             onChange={(e) => handleOrderFormChange("revision", e.target.value)}
//                             placeholder="Enter revision number"
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="documentControlId">
//                             Document Control ID
//                             {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="documentControlId"
//                             value={orderFormData.documentControlId}
//                             onChange={(e) => handleOrderFormChange("documentControlId", e.target.value)}
//                             placeholder="Enter document control ID"
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = orderFormData.documentControlId
//                               ? validateDocumentControlId(orderFormData.documentControlId)
//                               : null
//                             return error ? (
//                               <p className="text-xs text-red-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="distributionDate">Distribution Date</Label>
//                           <Input
//                             id="distributionDate"
//                             type="date"
//                             value={orderFormData.distributionDate}
//                             onChange={(e) => handleOrderFormChange("distributionDate", e.target.value)}
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="requiredBy">Required By</Label>
//                           <Input
//                             id="requiredBy"
//                             type="date"
//                             value={orderFormData.requiredBy}
//                             onChange={(e) => handleOrderFormChange("requiredBy", e.target.value)}
//                             className="h-11"
//                           />
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Documentation Tab */}
//                 <TabsContent value="documentation" className="space-y-6 mt-6">
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="space-y-4">
//                         {/* Upload Section */}
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
//                           <div className="space-y-4">
//                             <div className="grid grid-cols-1 gap-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor="mpi-doc-file">Select Files *</Label>
//                                 <Input
//                                   id="mpi-doc-file"
//                                   type="file"
//                                   accept="*/*"
//                                   className="cursor-pointer"
//                                   disabled={uploadingMpiDoc}
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor="mpi-doc-description">Description (Optional)</Label>
//                                 <Input
//                                   id="mpi-doc-description"
//                                   placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                                   disabled={uploadingMpiDoc}
//                                 />
//                               </div>
//                             </div>
//                             <Button
//                               type="button"
//                               variant="outline"
//                               disabled={uploadingMpiDoc}
//                               onClick={async () => {
//                                 const fileInput = document.getElementById("mpi-doc-file") as HTMLInputElement
//                                 const descInput = document.getElementById("mpi-doc-description") as HTMLInputElement
//                                 const file = fileInput?.files?.[0]
//                                 const description = descInput?.value?.trim() || ""

//                                 if (!file) {
//                                   toast({
//                                     title: "Missing File",
//                                     description: "Please select a file to upload.",
//                                     variant: "destructive",
//                                   })
//                                   return
//                                 }

//                                 await handleMpiDocumentUpload(file, description)
//                                 fileInput.value = ""
//                                 descInput.value = ""
//                               }}
//                               className="w-full bg-transparent"
//                             >
//                               {uploadingMpiDoc ? (
//                                 <div className="flex items-center gap-2">
//                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                   Uploading File...
//                                 </div>
//                               ) : (
//                                 <>
//                                   <Upload className="w-4 h-4 mr-2" />
//                                   Upload File
//                                 </>
//                               )}
//                             </Button>
//                           </div>
//                         </div>

//                         {/* Uploaded Documents List */}
//                         {mpiDocumentation.length > 0 && (
//                           <div className="space-y-3">
//                             <h4 className="font-medium text-sm">Files</h4>
//                             <div className="space-y-2">
//                               {mpiDocumentation.map((doc, index) => (
//                                 <div
//                                   key={index}
//                                   className="flex items-start justify-between p-4 bg-gray-50 rounded border"
//                                 >
//                                   <div className="flex items-start gap-3 flex-1">
//                                     <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                                     <div className="flex-1 min-w-0">
//                                       <p className="text-sm font-medium text-gray-900 truncate">
//                                         {doc.description && doc.description !== doc.fileName
//                                           ? doc.description
//                                           : doc.fileName}
//                                       </p>
//                                       <div className="mt-1 space-y-1">
//                                         <p className="text-xs text-gray-600">
//                                           <span className="font-medium">Filename:</span> {doc.fileName}
//                                         </p>
//                                         {doc.description && doc.description !== doc.fileName && (
//                                           <p className="text-xs text-gray-500">
//                                             <span className="font-medium">Description:</span> {doc.description}
//                                           </p>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <div className="flex items-center gap-2 ml-4">
//                                     <Button
//                                       type="button"
//                                       size="sm"
//                                       variant="outline"
//                                       onClick={() => removeMpiDocument(index)}
//                                       className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
//                                     >
//                                       Remove
//                                     </Button>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Checklist Tab */}
//                 <TabsContent value="checklist" className="space-y-6 mt-6">
//                   <Card>
//                     <CardContent className="mt-5">
//                       {loadingAvailableChecklist ? (
//                         <div className="flex items-center justify-center py-8">
//                           <div className="text-center">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
//                             <p className="mt-2 text-sm text-muted-foreground">Loading checklist data...</p>
//                           </div>
//                         </div>
//                       ) : existingChecklists.length === 0 && availableChecklistTemplate.length === 0 ? (
//                         <p className="text-muted-foreground text-center py-4">No checklist data available.</p>
//                       ) : (
//                         <div className="space-y-6">
//                           {/* Existing Checklists */}
//                           {existingChecklists.length > 0 ? (
//                             <div>
//                               <h3 className="text-lg font-semibold mb-4 text-red-800">Existing Required Checklists</h3>
//                               <Accordion type="multiple" className="w-full">
//                                 {existingChecklists.map((section) => (
//                                   <AccordionItem key={section.id} value={section.id}>
//                                     <AccordionTrigger className="text-left">
//                                       <div className="flex items-center gap-3">
//                                         <h4 className="font-medium">{section.name}</h4>
//                                       </div>
//                                     </AccordionTrigger>
//                                     <AccordionContent>
//                                       <div className="space-y-4">
//                                         <Table>
//                                           <TableHeader>
//                                             <TableRow>
//                                               <TableHead>Description</TableHead>
//                                               <TableHead>Required</TableHead>
//                                               <TableHead>Remarks</TableHead>
//                                             </TableRow>
//                                           </TableHeader>
//                                           <TableBody>
//                                             {(section.items || []).map((item) => (
//                                               <TableRow key={item.id}>
//                                                 <TableCell className="font-medium">{item.description}</TableCell>
//                                                 <TableCell>
//                                                   <Select
//                                                     value={
//                                                       getChecklistItemValue(item.id, "required", item.required)
//                                                         ? "yes"
//                                                         : "no"
//                                                     }
//                                                     onValueChange={(value) =>
//                                                       handleChecklistItemChange(item.id, "required", value === "yes")
//                                                     }
//                                                   >
//                                                     <SelectTrigger className="w-20">
//                                                       <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                       <SelectItem value="yes">Yes</SelectItem>
//                                                       <SelectItem value="no">No</SelectItem>
//                                                     </SelectContent>
//                                                   </Select>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                   <Input
//                                                     value={
//                                                       getChecklistItemValue(item.id, "remarks", item.remarks) as string
//                                                     }
//                                                     onChange={(e) =>
//                                                       handleChecklistItemChange(item.id, "remarks", e.target.value)
//                                                     }
//                                                     placeholder="Enter remarks (optional)"
//                                                     className="min-w-[200px]"
//                                                   />
//                                                 </TableCell>
//                                               </TableRow>
//                                             ))}
//                                           </TableBody>
//                                         </Table>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           ) : (
//                             <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                               <h3 className="text-lg font-semibold mb-2 text-blue-800">Existing Checklists</h3>
//                               <p className="text-sm text-blue-700">
//                                 No checklist items have been created for this MPI yet.
//                               </p>
//                             </div>
//                           )}

//                           {/* Available Checklist Template */}
//                           {availableChecklistTemplate.length > 0 && (
//                             <div>
//                               <h3 className="text-lg font-semibold mb-4 text-red-800">Available Checklist Items</h3>
//                               <Accordion type="multiple" className="w-full">
//                                 {availableChecklistTemplate.map((section) => (
//                                   <AccordionItem key={section.id} value={section.id}>
//                                     <AccordionTrigger className="text-left">
//                                       <div className="flex items-center gap-3">
//                                         <h4 className="font-medium">{section.name}</h4>
//                                       </div>
//                                     </AccordionTrigger>
//                                     <AccordionContent>
//                                       <div className="space-y-4">
//                                         <Table>
//                                           <TableHeader>
//                                             <TableRow>
//                                               <TableHead>Description</TableHead>
//                                               <TableHead>Required</TableHead>
//                                               <TableHead>Remarks</TableHead>
//                                             </TableRow>
//                                           </TableHeader>
//                                           <TableBody>
//                                             {(section.items || []).map((item) => (
//                                               <TableRow key={item.id}>
//                                                 <TableCell className="font-medium">{item.description}</TableCell>
//                                                 <TableCell>
//                                                   <Select
//                                                     value={
//                                                       getChecklistItemValue(item.id, "required", item.required)
//                                                         ? "yes"
//                                                         : "no"
//                                                     }
//                                                     onValueChange={(value) =>
//                                                       handleChecklistItemChange(item.id, "required", value === "yes")
//                                                     }
//                                                   >
//                                                     <SelectTrigger className="w-20">
//                                                       <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                       <SelectItem value="yes">Yes</SelectItem>
//                                                       <SelectItem value="no">No</SelectItem>
//                                                     </SelectContent>
//                                                   </Select>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                   <Input
//                                                     value={
//                                                       getChecklistItemValue(item.id, "remarks", item.remarks) as string
//                                                     }
//                                                     onChange={(e) =>
//                                                       handleChecklistItemChange(item.id, "remarks", e.target.value)
//                                                     }
//                                                     placeholder="Enter remarks (optional)"
//                                                     className="min-w-[200px]"
//                                                   />
//                                                 </TableCell>
//                                               </TableRow>
//                                             ))}
//                                           </TableBody>
//                                         </Table>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Instructions Tab */}
//                 <TabsContent value="instructions" className="space-y-6 mt-6">
//                   <InstructionsTab
//                     instructions={instructions}
//                     onAddInstruction={handleAddInstruction}
//                     onInstructionChange={handleInstructionChange}
//                     onRemoveInstruction={handleRemoveInstruction}
//                   />
//                 </TabsContent>
//               </Tabs>

//               {/* Form Actions */}
//               <div className="flex justify-end gap-4">
//                 <Button variant="outline" onClick={onCancel}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isLoading || !isFormValid()}>
//                   {isLoading ? (
//                     <div className="flex items-center gap-2 animate-pulse">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                       <span>Updating...</span>
//                     </div>
//                   ) : (
//                     <>Update MPI</>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
















// "use client"

// import React from "react"

// import type { FunctionComponent } from "react"
// import { useState, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   ArrowLeft,
//   Factory,
//   Info,
//   ClipboardList,
//   FileText,
//   Download,
//   Eye,
//   StickyNote,
//   Plus,
//   Trash2,
//   X,
//   Upload,
//   AlertCircle,
// } from "lucide-react"
// import type { MPI, UpdateMPIDto } from "./types"
// import { StationAPI } from "../stations/station-api"
// import type { Station } from "../stations/types"
// import { useToast } from "@/hooks/use-toast"
// import { MPIAPI } from "./mpi-api"
// import { MPIDocumentationAPI } from "./mpi-document-api"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"
// import { API_BASE_URL } from "@/lib/constants"

// // Enhanced InstructionsTab component with proper focus management and layout matching create mode
// const InstructionsTab: FunctionComponent<{
//   instructions: string[]
//   onAddInstruction: () => void
//   onInstructionChange: (index: number, value: string) => void
//   onRemoveInstruction: (index: number) => void
//   availableStations: Station[]
//   formData: any
//   loadingStations: boolean
//   activeStationId: string | null
//   setActiveStationId: (id: string | null) => void
//   stationViewMode: "specifications" | "documents" | "notes"
//   setStationViewMode: (mode: "specifications" | "documents" | "notes") => void
//   handleStationSelectionChange: (stationIds: string[]) => void
//   selectedStations: Station[]
//   stationNotes: Record<string, StationNote[]>
//   stationDocuments: Record<string, StationDocument[]>
//   renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
//   renderStationDocuments: (stationId: string) => React.ReactNode
//   renderStationNotes: (stationId: string) => React.ReactNode
//   focusedInstructionIndex: number | null
//   setFocusedInstructionIndex: (index: number | null) => void
//   instructionRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
// }> = React.memo(
//   ({
//     instructions,
//     onAddInstruction,
//     onInstructionChange,
//     onRemoveInstruction,
//     availableStations,
//     formData,
//     loadingStations,
//     activeStationId,
//     setActiveStationId,
//     stationViewMode,
//     setStationViewMode,
//     handleStationSelectionChange,
//     selectedStations,
//     stationNotes,
//     stationDocuments,
//     renderSpecificationInput,
//     renderStationDocuments,
//     renderStationNotes,
//     focusedInstructionIndex,
//     setFocusedInstructionIndex,
//     instructionRefs,
//   }) => {
//     return (
//       <div className="space-y-6">
//         {/* Stations Section */}
//         <Card>
//           <CardContent className="space-y-6 mt-5">
//             {loadingStations ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
//                   <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
//                 </div>
//               </div>
//             ) : availableStations.length === 0 ? (
//               <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
//               </div>
//             ) : (
//               <div className="flex gap-6 min-h-[600px]">
//                 {/* Left Sidebar - Station List */}
//                 <div className="w-1/4 border rounded-lg bg-gray-50">
//                   <div className="p-3 border-b bg-white rounded-t-lg">
//                     <h4 className="font-medium text-base">Stations</h4>
//                     <p className="text-xs text-muted-foreground">
//                       {formData.selectedStationIds.length > 0
//                         ? `${formData.selectedStationIds.length} selected`
//                         : "Click to select multiple"}
//                     </p>
//                   </div>
//                   <div className="p-2 overflow-y-auto h-[530px]">
//                     <div className="space-y-1">
//                       {availableStations.map((station) => {
//                         const noteCount = stationNotes[station.id]?.length || 0
//                         const docCount = stationDocuments[station.id]?.length || 0
//                         const isSelected = formData.selectedStationIds.includes(station.id)

//                         return (
//                           <div
//                             key={station.id}
//                             className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
//                               isSelected
//                                 ? "bg-blue-100 text-blue-900 border-blue-300"
//                                 : "bg-white hover:bg-gray-100 border-transparent"
//                             } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
//                             onClick={() => {
//                               setActiveStationId(station.id)
//                               if (isSelected) {
//                                 handleStationSelectionChange(
//                                   formData.selectedStationIds.filter((id: string) => id !== station.id),
//                                 )
//                               } else {
//                                 handleStationSelectionChange([...formData.selectedStationIds, station.id])
//                               }
//                             }}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="truncate">{station.stationName}</span>
//                               <div className="flex gap-1">
//                                 {noteCount > 0 && (
//                                   <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
//                                     {noteCount}N
//                                   </Badge>
//                                 )}
//                                 {docCount > 0 && (
//                                   <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
//                                     {docCount}D
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Panel - Station Details */}
//                 <div className="flex-1 border rounded-lg bg-gray-50">
//                   {!activeStationId ? (
//                     <div className="flex items-center justify-center h-full">
//                       <div className="text-center">
//                         <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <h4 className="font-medium text-gray-600 mb-2">No Station Selected</h4>
//                         <p className="text-sm text-muted-foreground">
//                           Select a station from the left sidebar to view its details
//                           {formData.selectedStationIds.length > 0 && (
//                             <span className="block mt-2 text-blue-600 font-medium">
//                               {formData.selectedStationIds.length} station
//                               {formData.selectedStationIds.length > 1 ? "s" : ""} selected for MPI
//                             </span>
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="h-full flex flex-col">
//                       <div className="p-4 border-b bg-white rounded-t-lg">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <Factory className="w-5 h-5 text-purple-600" />
//                             <div>
//                               <h4 className="font-medium text-lg">
//                                 {availableStations.find((s) => s.id === activeStationId)?.stationName}
//                               </h4>
//                               <p className="text-sm text-muted-foreground">Station Details</p>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "specifications" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("specifications")}
//                             >
//                               Specifications
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "documents" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("documents")}
//                             >
//                               Files
//                               {stationDocuments[activeStationId]?.length > 0 && (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {stationDocuments[activeStationId].length}
//                                 </Badge>
//                               )}
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "notes" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("notes")}
//                             >
//                               Notes
//                               {stationNotes[activeStationId]?.length > 0 && (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {stationNotes[activeStationId].length}
//                                 </Badge>
//                               )}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex-1 overflow-auto p-4">
//                         {stationViewMode === "specifications" && (
//                           <div>
//                             {(() => {
//                               const station = availableStations.find((s) => s.id === activeStationId)
//                               if (!station) return null

//                               if (!station.specifications || station.specifications.length === 0) {
//                                 return (
//                                   <div className="text-center py-6">
//                                     <p className="text-muted-foreground">
//                                       No specifications available for this station.
//                                     </p>
//                                   </div>
//                                 )
//                               }

//                               return (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   {station.specifications.map((spec) => (
//                                     <div key={spec.id} className="space-y-3 p-3 bg-white rounded border">
//                                       {renderSpecificationInput(spec, station.id)}
//                                     </div>
//                                   ))}
//                                 </div>
//                               )
//                             })()}
//                           </div>
//                         )}
//                         {stationViewMode === "documents" && renderStationDocuments(activeStationId)}
//                         {stationViewMode === "notes" && renderStationNotes(activeStationId)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Selected Station Summary */}
//             {formData.selectedStationIds.length > 0 && (
//               <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <h4 className="font-medium text-blue-800 mb-3">Selected Stations</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedStations.map((station) => (
//                     <Badge key={station.id} variant="outline" className="bg-white">
//                       {station.stationName}
//                       {station.specifications && station.specifications.length > 0 && (
//                         <span className="ml-1 text-xs">({station.specifications.length} specs)</span>
//                       )}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Instructions Section - Now positioned below stations section like in create mode */}
//         <Card>
//           <CardContent className="mt-5">
//             <div className="space-y-4">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h4 className="text-lg font-semibold text-red-800">General Instructions</h4>
//                   <p className="text-sm text-muted-foreground">
//                     Add general safety and operational instructions for this MPI
//                   </p>
//                 </div>
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="outline"
//                   onClick={() => {
//                     onAddInstruction()
//                     // Focus the new instruction input after it's added
//                     setTimeout(() => {
//                       setFocusedInstructionIndex(instructions.length)
//                     }, 0)
//                   }}
//                   className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Instruction
//                 </Button>
//               </div>
//               {instructions.length === 0 ? (
//                 <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                   <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm text-muted-foreground">No instructions added yet</p>
//                   <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {instructions.map((instruction, index) => (
//                     <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
//                       <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <Input
//                           ref={(el) => {
//                             instructionRefs.current[index] = el
//                           }}
//                           value={instruction}
//                           onChange={(e) => {
//                             setFocusedInstructionIndex(index)
//                             onInstructionChange(index, e.target.value)
//                           }}
//                           onFocus={() => setFocusedInstructionIndex(index)}
//                           onBlur={() => setFocusedInstructionIndex(null)}
//                           placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
//                           className="w-full"
//                         />
//                       </div>
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="ghost"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           onRemoveInstruction(index)
//                           // Clear focus tracking when removing instruction
//                           setFocusedInstructionIndex(null)
//                         }}
//                         className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
//                       >
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   },
// )

// interface MPIEditProps {
//   mpi: MPI
//   onSubmit: (data: UpdateMPIDto) => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
// }

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   fileUrl?: string
//   unit?: string
// }

// interface ChecklistSection {
//   id: string
//   name: string
//   description: string
//   items: ChecklistItem[]
// }

// interface ChecklistItem {
//   id: string
//   description: string
//   required: boolean
//   remarks: string
//   category?: string
//   isActive: boolean
//   createdBy: string
//   sectionId: string
// }

// interface MPIDocumentation {
//   id?: string
//   file?: File
//   fileUrl?: string
//   description: string
//   fileName: string
//   originalFileName?: string
//   isUploaded?: boolean
// }

// interface StationNote {
//   id?: string
//   content: string
//   createdAt?: string
//   updatedAt?: string
// }

// interface StationDocument {
//   id: string
//   fileUrl: string
//   description: string
//   stationId: string
//   mpiId?: string
//   createdAt: string
//   updatedAt: string
// }

// // Helper function to safely convert order type to array
// const normalizeOrderType = (orderType: any): string[] => {
//   if (!orderType) return []
//   if (Array.isArray(orderType)) return orderType.filter((type) => typeof type === "string")
//   if (typeof orderType === "string") return [orderType]
//   return []
// }

// // Helper function to safely convert file action to array
// const normalizeFileAction = (fileAction: any): string[] => {
//   if (!fileAction) return []
//   if (Array.isArray(fileAction)) return fileAction.filter((action) => typeof action === "string")
//   if (typeof fileAction === "string") return [fileAction]
//   return []
// }

// export function MPIEdit({ mpi, onSubmit, onCancel, isLoading }: MPIEditProps) {
//   const [activeTab, setActiveTab] = useState("basic-info")
//   const [formData, setFormData] = useState({
//     jobId: mpi.jobId || "",
//     assemblyId: mpi.assemblyId || "",
//     customer: mpi.customer || "",
//     selectedStationIds: mpi.stations?.map((s) => s.id) || [],
//   })

//   // Order Form State - Initialize with existing data
//   const [orderFormData, setOrderFormData] = useState({
//     id: mpi.orderForms?.[0]?.id || "",
//     orderType: normalizeOrderType(mpi.orderForms?.[0]?.orderType),
//     distributionDate: mpi.orderForms?.[0]?.distributionDate
//       ? new Date(mpi.orderForms[0].distributionDate).toISOString().split("T")[0]
//       : "",
//     requiredBy: mpi.orderForms?.[0]?.requiredBy
//       ? new Date(mpi.orderForms[0].requiredBy).toISOString().split("T")[0]
//       : "",
//     internalOrderNumber: mpi.orderForms?.[0]?.internalOrderNumber || "",
//     revision: mpi.orderForms?.[0]?.revision || "",
//     otherAttachments: mpi.orderForms?.[0]?.otherAttachments || "",
//     fileAction: normalizeFileAction(mpi.orderForms?.[0]?.fileAction),
//     markComplete: mpi.orderForms?.[0]?.markComplete || false,
//     documentControlId: mpi.orderForms?.[0]?.documentControlId || "",
//   })

//   // Instructions state - Initialize with existing data
//   const [instructions, setInstructions] = useState<string[]>(mpi.Instruction || [])

//   // Add focus management for instruction inputs
//   const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
//   const instructionRefs = useRef<(HTMLInputElement | null)[]>([])

//   // Add these state variables after the instruction focus management states
//   const [focusedSpecificationId, setFocusedSpecificationId] = useState<string | null>(null)
//   const specificationRefs = useRef<Record<string, HTMLInputElement | null>>({})

//   // Enums state
//   const [enums, setEnums] = useState<any>({})
//   const [loadingEnums, setLoadingEnums] = useState(false)

//   // Checklist template and existing checklist state
//   const [availableChecklistTemplate, setAvailableChecklistTemplate] = useState<ChecklistSection[]>([])
//   const [existingChecklists, setExistingChecklists] = useState<ChecklistSection[]>([])
//   const [loadingAvailableChecklist, setLoadingAvailableChecklist] = useState(false)

//   // Specification values state - Initialize with existing values
//   const [specificationValues, setSpecificationValues] = useState<Record<string, SpecificationValue>>(() => {
//     const initialValues: Record<string, SpecificationValue> = {}
//     console.log("🔍 Initializing specification values from MPI data:", mpi)

//     mpi.stations?.forEach((station) => {
//       console.log(`📍 Processing station: ${station.stationName} (${station.id})`)
//       station.specifications?.forEach((spec) => {
//         console.log(`🔧 Processing spec: ${spec.name} (${spec.id})`)
//         // Look for existing values in multiple places
//         let existingValue = null

//         // Method 1: Check stationSpecifications array
//         if (spec.stationSpecifications && spec.stationSpecifications.length > 0) {
//           existingValue = spec.stationSpecifications.find((ss) => ss.stationId === station.id)
//           console.log(`📋 Found in stationSpecifications:`, existingValue)
//         }

//         // Method 2: Check if there's a direct value on the spec
//         if (!existingValue && spec.value) {
//           existingValue = { value: spec.value, unit: spec.unit }
//           console.log(`📋 Found direct value on spec:`, existingValue)
//         }

//         // Method 3: Check station's specificationValues if it exists
//         if (!existingValue && station.specificationValues) {
//           const stationSpecValue = station.specificationValues.find((sv: any) => sv.specificationId === spec.id)
//           if (stationSpecValue) {
//             existingValue = { value: stationSpecValue.value, unit: stationSpecValue.unit }
//             console.log(`📋 Found in station specificationValues:`, existingValue)
//           }
//         }

//         if (existingValue && existingValue.value) {
//           initialValues[spec.id] = {
//             specificationId: spec.id,
//             value: existingValue.value,
//             unit: existingValue.unit || undefined,
//             fileUrl: existingValue.fileUrl || undefined,
//           }
//           console.log(`✅ Initialized spec ${spec.id} with value:`, initialValues[spec.id])
//         } else {
//           // Initialize with empty value for specs without existing data
//           initialValues[spec.id] = {
//             specificationId: spec.id,
//             value: "",
//             unit: undefined,
//             fileUrl: undefined,
//           }
//           console.log(`🆕 Initialized spec ${spec.id} with empty value`)
//         }
//       })
//     })

//     console.log("🎯 Final initial specification values:", initialValues)
//     return initialValues
//   })

//   const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())

//   // MPI Documentation State - Enhanced with proper filename handling
//   const [mpiDocumentation, setMpiDocumentation] = useState<MPIDocumentation[]>(() => {
//     // Initialize with existing MPI documents
//     return (
//       mpi.mpiDocs?.map((doc) => ({
//         id: doc.id,
//         fileUrl: doc.fileUrl,
//         description: doc.description,
//         fileName: doc.fileName || doc.description, // Use fileName if available, fallback to description
//         originalFileName: doc.originalFileName || doc.fileName || doc.description,
//         isUploaded: true,
//       })) || []
//     )
//   })

//   const [uploadingMpiDoc, setUploadingMpiDoc] = useState(false)

//   // Checklist modifications state - Initialize with existing checklist data
//   const [checklistModifications, setChecklistModifications] = useState<
//     Record<string, { required: boolean; remarks: string }>
//   >(() => {
//     const initialModifications: Record<string, { required: boolean; remarks: string }> = {}
//     // Initialize with existing checklist data
//     mpi.checklists?.forEach((checklist) => {
//       checklist.checklistItems?.forEach((item, itemIndex) => {
//         const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
//         initialModifications[itemId] = {
//           required: item.required,
//           remarks: item.remarks,
//         }
//       })
//     })
//     console.log("Initial checklist modifications:", initialModifications)
//     return initialModifications
//   })

//   const [availableStations, setAvailableStations] = useState<Station[]>([])
//   const [loadingStations, setLoadingStations] = useState(false)
//   const [selectedStations, setSelectedStations] = useState<Station[]>([])

//   // Station view state for instructions tab
//   const [activeStationId, setActiveStationId] = useState<string | null>(null)
//   const [stationViewMode, setStationViewMode] = useState<"specifications" | "documents" | "notes">("specifications")

//   // Station notes state
//   const [stationNotes, setStationNotes] = useState<Record<string, StationNote[]>>({})
//   const [loadingNotes, setLoadingNotes] = useState<Set<string>>(new Set())
//   const [newNoteContent, setNewNoteContent] = useState("")
//   const [addingNote, setAddingNote] = useState(false)

//   // Station documents state
//   const [stationDocuments, setStationDocuments] = useState<Record<string, StationDocument[]>>({})
//   const [loadingDocuments, setLoadingDocuments] = useState<Set<string>>(new Set())
//   const [uploadingStationDoc, setUploadingStationDoc] = useState(false)

//   // Validation state
//   const [existingJobIds, setExistingJobIds] = useState<string[]>([])
//   const [existingAssemblyIds, setExistingAssemblyIds] = useState<string[]>([])
//   const [existingDocumentControlIds, setExistingDocumentControlIds] = useState<string[]>([])
//   const [checkingIds, setCheckingIds] = useState(false)

//   const { toast } = useToast()

//   // Initialize station notes from MPI data
//   useEffect(() => {
//     const initialNotes: Record<string, StationNote[]> = {}
//     mpi.stations?.forEach((station) => {
//       if (station.Note && Array.isArray(station.Note)) {
//         initialNotes[station.id] = station.Note.map((note, index) => ({
//           id: `note-${station.id}-${index}`,
//           content: note,
//           createdAt: new Date().toISOString(),
//         }))
//       }
//     })
//     setStationNotes(initialNotes)
//   }, [mpi.stations])

//   // Initialize station documents from MPI data
//   useEffect(() => {
//     const initialDocs: Record<string, StationDocument[]> = {}
//     mpi.stations?.forEach((station) => {
//       if (station.documentations && Array.isArray(station.documentations)) {
//         initialDocs[station.id] = station.documentations
//       }
//     })
//     setStationDocuments(initialDocs)
//   }, [mpi.stations])

//   // Restore focus to instruction input after re-render
//   useEffect(() => {
//     if (focusedInstructionIndex !== null && instructionRefs.current[focusedInstructionIndex]) {
//       const input = instructionRefs.current[focusedInstructionIndex]
//       if (input) {
//         const cursorPosition = input.selectionStart || 0
//         // Use setTimeout to ensure the DOM has updated
//         setTimeout(() => {
//           input.focus()
//           input.setSelectionRange(cursorPosition, cursorPosition)
//         }, 0)
//       }
//     }
//   }, [instructions, focusedInstructionIndex])

//   // Add this useEffect after the instruction focus useEffect
//   useEffect(() => {
//     if (focusedSpecificationId && specificationRefs.current[focusedSpecificationId]) {
//       const input = specificationRefs.current[focusedSpecificationId]
//       if (input) {
//         const cursorPosition = input.selectionStart || 0
//         setTimeout(() => {
//           input.focus()
//           input.setSelectionRange(cursorPosition, cursorPosition)
//         }, 0)
//       }
//     }
//   }, [specificationValues, focusedSpecificationId])

//   // Load existing IDs for validation (excluding current MPI)
//   const loadExistingIds = async () => {
//     try {
//       setCheckingIds(true)
//       const mpis = await MPIAPI.getAllMPIs()
//       // Filter out current MPI from validation
//       const otherMpis = mpis.filter((m) => m.id !== mpi.id)
//       const jobIds = otherMpis.map((m) => m.jobId.toLowerCase())
//       const assemblyIds = otherMpis.map((m) => m.assemblyId.toLowerCase())
//       const documentControlIds = otherMpis
//         .filter((m) => m.orderForms && m.orderForms.length > 0)
//         .flatMap((m) => m.orderForms.map((form) => form.documentControlId))
//         .filter(Boolean)
//         .map((id) => id.toLowerCase())

//       setExistingJobIds(jobIds)
//       setExistingAssemblyIds(assemblyIds)
//       setExistingDocumentControlIds(documentControlIds)
//     } catch (error) {
//       console.error("Failed to load existing IDs:", error)
//     } finally {
//       setCheckingIds(false)
//     }
//   }

//   // Validation functions
//   const validateJobId = (jobId: string): string | null => {
//     if (!jobId.trim()) return "Job ID is required"
//     if (jobId.length < 2) return "Job ID must be at least 2 characters"
//     if (existingJobIds.includes(jobId.toLowerCase())) {
//       return `Job ID "${jobId}" already exists. Please use a different Job ID.`
//     }
//     return null
//   }

//   const validateAssemblyId = (assemblyId: string): string | null => {
//     if (!assemblyId.trim()) return "Assembly ID is required"
//     if (assemblyId.length < 2) return "Assembly ID must be at least 2 characters"
//     if (existingAssemblyIds.includes(assemblyId.toLowerCase())) {
//       return `Assembly ID "${assemblyId}" already exists. Please use a different Assembly ID.`
//     }
//     return null
//   }

//   const validateDocumentControlId = (documentControlId: string): string | null => {
//     if (!documentControlId.trim()) return null
//     if (documentControlId.length < 2) return "Document Control ID must be at least 2 characters"
//     if (existingDocumentControlIds.includes(documentControlId.toLowerCase())) {
//       return `Document Control ID "${documentControlId}" already exists. Please use a different ID.`
//     }
//     return null
//   }

//   // Instruction handlers
//   const handleAddInstruction = () => {
//     setInstructions((prev) => [...prev, ""])
//   }

//   const handleInstructionChange = (index: number, value: string) => {
//     setInstructions((prev) => prev.map((instruction, i) => (i === index ? value : instruction)))
//   }

//   const handleRemoveInstruction = (index: number) => {
//     setInstructions((prev) => prev.filter((_, i) => i !== index))
//     toast({
//       title: "Instruction Removed",
//       description: "Instruction has been removed from the list.",
//     })
//   }

//   // Station notes handlers
//   const handleAddNote = async () => {
//     if (!activeStationId || !newNoteContent.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter note content.",
//         variant: "destructive",
//       })
//       return
//     }

//     setAddingNote(true)
//     try {
//       const newNote: StationNote = {
//         id: `note-${activeStationId}-${Date.now()}`,
//         content: newNoteContent.trim(),
//         createdAt: new Date().toISOString(),
//       }

//       setStationNotes((prev) => ({
//         ...prev,
//         [activeStationId]: [...(prev[activeStationId] || []), newNote],
//       }))

//       setNewNoteContent("")
//       toast({
//         title: "Success",
//         description: "Note added successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to add note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add note. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setAddingNote(false)
//     }
//   }

//   const handleDeleteNote = async (stationId: string, noteId: string) => {
//     try {
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: prev[stationId]?.filter((note) => note.id !== noteId) || [],
//       }))

//       toast({
//         title: "Success",
//         description: "Note deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete note. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Station document handlers
//   const handleStationDocumentUpload = async (file: File, description: string, fileName?: string) => {
//     if (!activeStationId) {
//       toast({
//         title: "Error",
//         description: "No station selected.",
//         variant: "destructive",
//       })
//       return
//     }

//     setUploadingStationDoc(true)
//     try {
//       const finalDescription = description.trim() || file.name
//       const finalFileName = fileName?.trim() || file.name

//       console.log("📤 Station document upload:", {
//         file: file.name,
//         description: finalDescription,
//         fileName: finalFileName,
//         stationId: activeStationId,
//         mpiId: mpi.id,
//       })

//       if (!mpi.id) {
//         // For new MPIs, queue the document locally
//         console.log("💾 QUEUING station document locally - MPI not created yet...")
//         if (file.size > 10 * 1024 * 1024) {
//           throw new Error("File size exceeds 10MB limit")
//         }

//         const newDoc = {
//           id: `temp-${Date.now()}`,
//           file: file,
//           description: finalDescription,
//           fileName: finalFileName,
//           stationId: activeStationId,
//           isUploaded: false,
//         }

//         setStationDocuments((prev) => ({
//           ...prev,
//           [activeStationId]: [...(prev[activeStationId] || []), newDoc],
//         }))

//         toast({
//           title: "✅ Document Queued Successfully",
//           description: `"${finalDescription}" will be uploaded when the MPI is saved.`,
//         })
//       } else {
//         // For existing MPIs, upload directly
//         console.log("📤 Uploading station document directly to existing MPI...")
//         const formData = new FormData()
//         formData.append("files", file)
//         formData.append("stationId", activeStationId)
//         formData.append("description", finalDescription)
//         formData.append("mpiId", mpi.id)
//         formData.append("originalName", file.name)

//         const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
//           method: "POST",
//           body: formData,
//         })

//         if (!response.ok) {
//           const errorText = await response.text()
//           console.error("❌ Direct upload failed:", errorText)
//           throw new Error(`Upload failed: ${response.status} - ${errorText}`)
//         }

//         const result = await response.json()
//         console.log("✅ Station document uploaded successfully:", result)

//         // Add to existing documents for the station
//         setStationDocuments((prev) => ({
//           ...prev,
//           [activeStationId]: [
//             ...(prev[activeStationId] || []),
//             {
//               id: result.id || `uploaded-${Date.now()}`,
//               fileUrl: result.fileUrl,
//               description: result.description || finalDescription,
//               fileName: result.fileName || finalFileName,
//               stationId: activeStationId,
//               isUploaded: true,
//             },
//           ],
//         }))

//         toast({
//           title: "Success",
//           description: "Station document uploaded successfully.",
//         })
//       }
//     } catch (error) {
//       console.error("Station document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingStationDoc(false)
//     }
//   }

//   const handleDeleteStationDocument = async (stationId: string, documentId: string) => {
//     try {
//       // Check if it's an uploaded document or queued document
//       const stationDocs = stationDocuments[stationId] || []
//       const doc = stationDocs.find((d) => d.id === documentId)

//       if (doc && doc.isUploaded && doc.id && !doc.id.startsWith("temp-")) {
//         // Delete uploaded document via API
//         await StationMpiDocAPI.delete(documentId)
//       }

//       // Remove from local state
//       setStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: prev[stationId]?.filter((doc) => doc.id !== documentId) || [],
//       }))

//       toast({
//         title: "Success",
//         description: "Document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete document. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Enhanced MPI Documentation handlers with proper filename support
//   const handleMpiDocumentUpload = async (file: File, description: string) => {
//     setUploadingMpiDoc(true)
//     try {
//       if (!file) {
//         throw new Error("No file selected")
//       }

//       const finalDescription = description.trim() || file.name

//       console.log("📤 MPI document upload:", {
//         originalFile: file.name,
//         description: finalDescription,
//         fileSize: file.size,
//       })

//       // For edit mode, upload immediately since MPI already exists
//       const result = await MPIDocumentationAPI.uploadDocument(mpi.id, file, finalDescription, file.name)

//       const newDoc: MPIDocumentation = {
//         id: result.id,
//         fileUrl: result.fileUrl,
//         description: result.description,
//         fileName: file.name,
//         originalFileName: file.name,
//         isUploaded: true,
//       }

//       setMpiDocumentation((prev) => [...prev, newDoc])

//       toast({
//         title: "Success",
//         description: "Document uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("Document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingMpiDoc(false)
//     }
//   }

//   const removeMpiDocument = async (index: number) => {
//     const doc = mpiDocumentation[index]
//     if (doc.id && doc.isUploaded) {
//       try {
//         await MPIDocumentationAPI.deleteDocument(doc.id)
//         toast({
//           title: "Success",
//           description: "Document deleted successfully.",
//         })
//       } catch (error) {
//         console.error("Failed to delete document:", error)
//         toast({
//           title: "Error",
//           description: "Failed to delete document.",
//           variant: "destructive",
//         })
//         return
//       }
//     }
//     setMpiDocumentation((prev) => prev.filter((_, i) => i !== index))
//   }

//   useEffect(() => {
//     loadStations()
//     loadEnums()
//     loadChecklistData()
//     loadExistingIds()
//   }, [])

//   useEffect(() => {
//     // Update selected stations when formData.selectedStationIds changes
//     const selected = availableStations.filter((station) => formData.selectedStationIds.includes(station.id))
//     setSelectedStations(selected)
//   }, [formData.selectedStationIds, availableStations])

//   const loadStations = async () => {
//     try {
//       setLoadingStations(true)
//       const stations = await StationAPI.getAllStations()
//       setAvailableStations(stations)
//     } catch (error) {
//       console.error("Failed to load stations:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load stations. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingStations(false)
//     }
//   }

//   const loadEnums = async () => {
//     try {
//       setLoadingEnums(true)
//       const enumsData = await MPIAPI.getEnums()
//       setEnums(enumsData)
//     } catch (error) {
//       console.error("Failed to load enums:", error)
//       toast({
//         title: "Warning",
//         description: "Failed to load form options.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingEnums(false)
//     }
//   }

//   const loadChecklistData = async () => {
//     try {
//       setLoadingAvailableChecklist(true)
//       // Load existing checklists from MPI - show ONLY REQUIRED items (like details page)
//       const existingChecklistSections: ChecklistSection[] = []
//       const existingItemDescriptions = new Set<string>()

//       if (mpi.checklists && mpi.checklists.length > 0) {
//         mpi.checklists.forEach((checklist, checklistIndex) => {
//           if (checklist.checklistItems && checklist.checklistItems.length > 0) {
//             // Filter to only show required items (exactly like details page)
//             const requiredItems = checklist.checklistItems.filter((item) => item.required === true)

//             if (requiredItems.length > 0) {
//               existingChecklistSections.push({
//                 id: `existing-section-${checklistIndex}`,
//                 name: checklist.name,
//                 description: `${checklist.name} - Existing required checklist items`,
//                 items: requiredItems.map((item, itemIndex) => {
//                   // Track this item as existing
//                   existingItemDescriptions.add(item.description.toLowerCase().trim())
//                   return {
//                     id: `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
//                     description: item.description,
//                     required: item.required,
//                     remarks: item.remarks,
//                     category: item.category || checklist.name,
//                     isActive: item.isActive,
//                     createdBy: item.createdBy,
//                     sectionId: `existing-section-${checklistIndex}`,
//                   }
//                 }),
//               })
//             }
//           }
//         })
//       }

//       setExistingChecklists(existingChecklistSections)

//       // Load available checklist template and filter out existing items
//       const template = await MPIAPI.getChecklistTemplate()
//       console.log("📦 Available checklist template loaded:", template)

//       if (template && Array.isArray(template)) {
//         const validSections = template
//           .filter(
//             (section) =>
//               section && typeof section === "object" && section.name && Array.isArray(section.checklistItems),
//           )
//           .map((section, sectionIndex) => {
//             // Filter out items that already exist in the MPI
//             const availableItems = (section.checklistItems || [])
//               .filter((item: any) => {
//                 const itemDescription = item.description?.toLowerCase().trim()
//                 return itemDescription && !existingItemDescriptions.has(itemDescription)
//               })
//               .map((item: any, itemIndex: number) => ({
//                 id: `available-${section.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
//                 description: item.description || "No description",
//                 required: false, // Default to No for available items
//                 remarks: "",
//                 category: item.category || section.name,
//                 isActive: item.isActive !== undefined ? item.isActive : true,
//                 createdBy: item.createdBy || "System",
//                 sectionId: `available-section-${sectionIndex}`,
//               }))

//             return availableItems.length > 0
//               ? {
//                   id: `available-section-${sectionIndex}`,
//                   name: section.name,
//                   description: `${section.name} quality control items`,
//                   items: availableItems,
//                 }
//               : null
//           })
//           .filter(Boolean)

//         setAvailableChecklistTemplate(validSections)
//       } else {
//         setAvailableChecklistTemplate([])
//       }
//     } catch (error) {
//       console.error("Failed to load checklist data:", error)
//       setAvailableChecklistTemplate([])
//       setExistingChecklists([])
//     } finally {
//       setLoadingAvailableChecklist(false)
//     }
//   }

//   const handleChecklistItemChange = (itemId: string, field: "required" | "remarks", value: boolean | string) => {
//     setChecklistModifications((prev) => ({
//       ...prev,
//       [itemId]: {
//         ...prev[itemId],
//         [field]: value,
//       },
//     }))
//   }

//   const getChecklistItemValue = (itemId: string, field: "required" | "remarks", defaultValue: boolean | string) => {
//     return checklistModifications[itemId]?.[field] ?? defaultValue
//   }

//   const handleOrderFormChange = (field: string, value: string | boolean | string[]) => {
//     setOrderFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log("🔄 Starting form submission...")

//     // Validation - Reload existing IDs first
//     await loadExistingIds()

//     // Enhanced validation with better error messages
//     const jobIdError = validateJobId(formData.jobId)
//     const assemblyIdError = validateAssemblyId(formData.assemblyId)
//     const documentControlIdError = orderFormData.documentControlId
//       ? validateDocumentControlId(orderFormData.documentControlId)
//       : null

//     const validationErrors = []
//     if (jobIdError) validationErrors.push(`Job ID: ${jobIdError}`)
//     if (assemblyIdError) validationErrors.push(`Assembly ID: ${assemblyIdError}`)
//     if (documentControlIdError) validationErrors.push(`Document Control ID: ${documentControlIdError}`)

//     // Check for required fields
//     if (!formData.jobId.trim()) validationErrors.push("Job ID is required")
//     if (!formData.assemblyId.trim()) validationErrors.push("Assembly ID is required")

//     if (validationErrors.length > 0) {
//       toast({
//         title: "❌ Validation Failed",
//         description: (
//           <div className="space-y-2">
//             <p className="font-semibold">Please fix the following issues:</p>
//             <ul className="list-disc list-inside space-y-1">
//               {validationErrors.map((error, index) => (
//                 <li key={index} className="text-sm">
//                   {error}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ),
//         variant: "destructive",
//         duration: 10000,
//       })
//       setActiveTab("basic-info")
//       return
//     }

//     console.log("Selected stations:", formData.selectedStationIds)
//     console.log("Current specification values:", specificationValues)
//     console.log("Current checklist modifications:", checklistModifications)

//     // Prepare stations data - Send ALL selected stations with their specification values in the correct format
//     const stationsData = formData.selectedStationIds
//       .map((stationId) => {
//         const station = selectedStations.find((s) => s.id === stationId)
//         if (!station) return null

//         // Get specification values for this station in the format the backend expects
//         const stationSpecificationValues =
//           station.specifications?.map((spec) => {
//             const specValue = specificationValues[spec.id]
//             return {
//               specificationId: spec.id,
//               value: specValue?.value || "", // Send current value or empty string
//               ...(specValue?.unit && { unit: specValue.unit }),
//               ...(specValue?.fileUrl && { fileUrl: specValue.fileUrl }),
//             }
//           }) || []

//         // Include station notes in the update
//         const stationNotesArray = stationNotes[stationId]?.map((note) => note.content) || []

//         return {
//           id: station.id,
//           stationId: station.stationId,
//           stationName: station.stationName,
//           status: station.status,
//           description: station.description || "",
//           location: station.location || "",
//           operator: station.operator || "",
//           priority: station.priority || 1,
//           Note: stationNotesArray,
//           // Send specification values in the format the backend expects
//           specificationValues: stationSpecificationValues,
//         }
//       })
//       .filter(Boolean)

//     console.log("📤 Stations data being sent:", JSON.stringify(stationsData, null, 2))
//     console.log("🔧 Current specification values:", specificationValues)

//     // Prepare existing checklist updates with ACTUAL database IDs
//     const existingChecklistUpdates: any[] = []
//     if (mpi.checklists && mpi.checklists.length > 0) {
//       mpi.checklists.forEach((checklist) => {
//         const updatedItems: any[] = []
//         let hasChanges = false

//         if (checklist.checklistItems && checklist.checklistItems.length > 0) {
//           checklist.checklistItems.forEach((item, itemIndex) => {
//             const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
//             const modifications = checklistModifications[itemId]

//             if (modifications) {
//               // Check if there are actual changes
//               if (modifications.required !== item.required || modifications.remarks !== item.remarks) {
//                 hasChanges = true
//               }

//               updatedItems.push({
//                 id: item.id, // Use the actual database ID from the MPI
//                 description: item.description,
//                 required: modifications.required,
//                 remarks: modifications.remarks,
//                 category: item.category,
//                 createdBy: item.createdBy,
//                 isActive: item.isActive,
//               })
//             }
//           })
//         }

//         // Only include checklist if there are actual changes
//         if (hasChanges && updatedItems.length > 0) {
//           existingChecklistUpdates.push({
//             id: checklist.id, // Use the actual checklist database ID
//             name: checklist.name,
//             checklistItems: updatedItems,
//           })
//         }
//       })
//     }

//     // Prepare new checklists from available template
//     const newChecklists: any[] = []
//     availableChecklistTemplate.forEach((section) => {
//       const newItems: any[] = []

//       section.items.forEach((item) => {
//         const modifications = checklistModifications[item.id]
//         if (modifications && modifications.required) {
//           newItems.push({
//             description: item.description,
//             required: modifications.required,
//             remarks: modifications.remarks || "",
//             createdBy: item.createdBy || "System",
//             isActive: item.isActive !== undefined ? item.isActive : true,
//             category: item.category || section.name,
//           })
//         }
//       })

//       if (newItems.length > 0) {
//         newChecklists.push({
//           name: section.name,
//           checklistItems: newItems,
//         })
//       }
//     })

//     // Prepare complete submission data matching backend expectations
//     const submitData: any = {
//       jobId: formData.jobId,
//       assemblyId: formData.assemblyId,
//       customer: formData.customer || null,
//     }

//     // FIXED: Always include order forms for updates with proper structure
//     const orderFormSubmissionData = {
//       id: orderFormData.id || undefined, // Include ID if exists for update
//       OrderType: orderFormData.orderType,
//       distributionDate: orderFormData.distributionDate ? new Date(orderFormData.distributionDate).toISOString() : null,
//       requiredBy: orderFormData.requiredBy ? new Date(orderFormData.requiredBy).toISOString() : null,
//       internalOrderNumber: orderFormData.internalOrderNumber || null,
//       revision: orderFormData.revision || null,
//       otherAttachments: orderFormData.otherAttachments || null,
//       fileAction: orderFormData.fileAction,
//       markComplete: orderFormData.markComplete,
//       documentControlId: orderFormData.documentControlId || null,
//     }

//     // Send as array to match backend expectation
//     submitData.orderForms = [orderFormSubmissionData]

//     console.log("📋 Order form data being sent:", JSON.stringify(submitData.orderForms, null, 2))

//     // Add stations with specifications if they exist
//     if (stationsData.length > 0) {
//       submitData.stations = stationsData
//     }

//     // Combine existing and new checklists for the backend
//     const allChecklists = [...existingChecklistUpdates, ...newChecklists]
//     if (allChecklists.length > 0) {
//       submitData.checklists = allChecklists
//     }

//     // Add instructions - always include for updates (use backend field name 'Instruction')
//     submitData.Instruction = instructions.filter((instruction) => instruction.trim() !== "")

//     // Add uploaded documents to submission data with both description and fileName
//     if (mpiDocumentation.length > 0) {
//       const uploadedDocs = mpiDocumentation
//         .filter((doc) => doc.isUploaded && doc.fileUrl)
//         .map((doc) => ({
//           id: doc.id,
//           fileUrl: doc.fileUrl,
//           description: doc.description,
//           fileName: doc.fileName, // Include fileName for backend
//           originalFileName: doc.originalFileName, // Include original filename
//         }))

//       if (uploadedDocs.length > 0) {
//         submitData.mpiDocs = uploadedDocs
//       }
//     }

//     console.log("📤 Submitting MPI update data:", JSON.stringify(submitData, null, 2))

//     try {
//       await onSubmit(submitData as UpdateMPIDto)
//       if (newChecklists.length > 0) {
//         toast({
//           title: "Success",
//           description: `MPI updated successfully with ${newChecklists.length} new checklist section(s) added.`,
//         })
//       } else {
//         toast({
//           title: "Success",
//           description: "MPI updated successfully.",
//         })
//       }
//     } catch (error: any) {
//       console.error("Form submission error:", error)
//       // Handle specific error types
//       if (error.message?.includes("Unique constraint failed")) {
//         if (error.message?.includes("documentControlId")) {
//           toast({
//             title: "🚫 Duplicate Document Control ID",
//             description: `Document Control ID "${orderFormData.documentControlId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         } else if (error.message?.includes("jobId")) {
//           toast({
//             title: "🚫 Duplicate Job ID",
//             description: `Job ID "${formData.jobId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         } else if (error.message?.includes("assemblyId")) {
//           toast({
//             title: "🚫 Duplicate Assembly ID",
//             description: `Assembly ID "${formData.assemblyId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         }
//       }

//       toast({
//         title: "Submission Error",
//         description: error.message || "Failed to update MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleStationSelectionChange = (stationIds: string[]) => {
//     setFormData((prev) => ({ ...prev, selectedStationIds: stationIds }))
//   }

//   const handleSpecificationValueChange = (specificationId: string, value: string, unit?: string) => {
//     console.log("🔧 Updating specification:", specificationId, "with value:", value, "unit:", unit)
//     setSpecificationValues((prev) => {
//       const currentSpec = prev[specificationId] || { specificationId, value: "", unit: undefined, fileUrl: undefined }
//       const updated = {
//         ...prev,
//         [specificationId]: {
//           ...currentSpec,
//           specificationId,
//           value,
//           unit: unit !== undefined ? unit : currentSpec.unit,
//         },
//       }
//       console.log("🔧 Updated specification values:", updated)
//       return updated
//     })
//   }

//   const handleFileUpload = async (specificationId: string, file: File, stationId: string, unit?: string) => {
//     console.log("📁 Starting file upload for spec:", specificationId, "station:", stationId)
//     setUploadingFiles((prev) => new Set(prev).add(specificationId))

//     try {
//       const result = await StationAPI.uploadStationSpecificationFile(file, specificationId, stationId, unit)
//       console.log("📁 File upload result:", result)

//       setSpecificationValues((prev) => {
//         const updated = {
//           ...prev,
//           [specificationId]: {
//             specificationId,
//             value: result.value || file.name,
//             fileUrl: result.fileUrl,
//             unit: unit || prev[specificationId]?.unit,
//           },
//         }
//         console.log("📁 Updated specification values after upload:", updated)
//         return updated
//       })

//       toast({
//         title: "Success",
//         description: "File uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("File upload error:", error)
//       toast({
//         title: "Error",
//         description: "Failed to upload file. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingFiles((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(specificationId)
//         return newSet
//       })
//     }
//   }

//   const renderSpecificationInput = (spec: any, stationId: string) => {
//     const specValue = specificationValues[spec.id]
//     const isUploading = uploadingFiles.has(spec.id)

//     // Only log if there's an issue or for debugging specific specs
//     if (!specValue && spec.required) {
//       console.log(`⚠️ Required spec ${spec.name} (${spec.id}) has no value`)
//     }

//     switch (spec.inputType) {
//       case "TEXT":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Input
//               ref={(el) => {
//                 specificationRefs.current[spec.id] = el
//               }}
//               id={`spec-${spec.id}`}
//               value={specValue?.value || ""}
//               onChange={(e) => {
//                 setFocusedSpecificationId(spec.id)
//                 handleSpecificationValueChange(spec.id, e.target.value)
//               }}
//               onFocus={() => setFocusedSpecificationId(spec.id)}
//               onBlur={() => setFocusedSpecificationId(null)}
//               placeholder={`Enter ${spec.name.toLowerCase()}`}
//               className="h-10"
//             />
//           </div>
//         )

//       case "number":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <div className="flex gap-2">
//               <Input
//                 ref={(el) => {
//                   specificationRefs.current[spec.id] = el
//                 }}
//                 id={`spec-${spec.id}`}
//                 type="number"
//                 value={specValue?.value || ""}
//                 onChange={(e) => {
//                   setFocusedSpecificationId(spec.id)
//                   handleSpecificationValueChange(spec.id, e.target.value, specValue?.unit)
//                 }}
//                 onFocus={() => setFocusedSpecificationId(spec.id)}
//                 onBlur={() => setFocusedSpecificationId(null)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10 flex-1"
//               />
//               <Input
//                 placeholder="Unit"
//                 value={specValue?.unit || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
//                 className="h-10 w-20"
//               />
//             </div>
//           </div>
//         )

//       case "CHECKBOX":
//         return (
//           <div className="space-y-2">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id={`spec-${spec.id}`}
//                 checked={specValue?.value === "true"}
//                 onCheckedChange={(checked) => handleSpecificationValueChange(spec.id, checked ? "true" : "false")}
//               />
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>
//             </div>
//           </div>
//         )

//       case "DROPDOWN":
//         const suggestions = spec.suggestions || []
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Select
//               value={specValue?.value || ""}
//               onValueChange={(value) => handleSpecificationValueChange(spec.id, value)}
//             >
//               <SelectTrigger className="h-10">
//                 <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
//               </SelectTrigger>
//               <SelectContent>
//                 {suggestions.map((suggestion: string, index: number) => (
//                   <SelectItem key={index} value={suggestion}>
//                     {suggestion}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )

//       case "FILE_UPLOAD":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <Input
//                   id={`spec-${spec.id}`}
//                   type="file"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0]
//                     if (file) {
//                       handleFileUpload(spec.id, file, stationId, specValue?.unit)
//                     }
//                   }}
//                   accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
//                   className="cursor-pointer flex-1"
//                   disabled={isUploading}
//                 />
//                 {isUploading && (
//                   <div className="flex items-center gap-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//                     <span className="text-xs text-muted-foreground">Uploading...</span>
//                   </div>
//                 )}
//               </div>
//               <Input
//                 placeholder="Unit (optional)"
//                 value={specValue?.unit || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
//                 className="h-10 w-32"
//               />
//               {specValue?.fileUrl && (
//                 <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
//                   <FileText className="w-4 h-4 text-green-600" />
//                   <span className="text-sm text-green-800">File uploaded successfully</span>
//                   <a
//                     href={specValue.fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-xs text-blue-600 hover:underline"
//                   >
//                     View
//                   </a>
//                 </div>
//               )}
//               <p className="text-xs text-muted-foreground">
//                 Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
//               </p>
//             </div>
//           </div>
//         )

//       default:
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Input
//               id={`spec-${spec.id}`}
//               value={specValue?.value || ""}
//               onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value)}
//               placeholder={`Enter ${spec.name.toLowerCase()}`}
//               className="h-10"
//             />
//           </div>
//         )
//     }
//   }

//   const renderStationDocuments = (stationId: string) => {
//     const documents = stationDocuments[stationId] || []

//     return (
//       <div className="space-y-4">
//         {/* Upload Section */}
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
//           <div className="space-y-4">
//             <h4 className="font-medium text-sm">Upload Station Document</h4>
//             <div className="grid grid-cols-1 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="station-doc-file">Select Files *</Label>
//                 <Input
//                   id="station-doc-file"
//                   type="file"
//                   accept="*/*"
//                   className="cursor-pointer"
//                   disabled={uploadingStationDoc}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="station-doc-description">Description</Label>
//                 <Input
//                   id="station-doc-description"
//                   placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                   disabled={uploadingStationDoc}
//                 />
//               </div>
//             </div>
//             <Button
//               type="button"
//               variant="outline"
//               disabled={uploadingStationDoc}
//               onClick={async () => {
//                 const fileInput = document.getElementById("station-doc-file") as HTMLInputElement
//                 const descInput = document.getElementById("station-doc-description") as HTMLInputElement
//                 const file = fileInput?.files?.[0]
//                 const description = descInput?.value?.trim() || ""

//                 if (!file) {
//                   toast({
//                     title: "Missing File",
//                     description: "Please select a file to upload.",
//                     variant: "destructive",
//                   })
//                   return
//                 }

//                 await handleStationDocumentUpload(file, description, file.name)
//                 fileInput.value = ""
//                 descInput.value = ""
//               }}
//               className="w-full"
//             >
//               {uploadingStationDoc ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                   Uploading File...
//                 </div>
//               ) : (
//                 <>
//                   <Upload className="w-4 h-4 mr-2" />
//                   Upload File
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Documents List */}
//         {documents.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No files available for this station.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 gap-4">
//               {documents.map((doc) => (
//                 <div key={doc.id} className="p-4 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start gap-3 flex-1">
//                       <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-medium text-sm text-gray-900 truncate">
//                           {doc.description || "Untitled Document"}
//                         </h4>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Uploaded: {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "Unknown date"}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 ml-4">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => window.open(doc.fileUrl, "_blank")}
//                         className="h-8 px-3"
//                       >
//                         <Eye className="w-3 h-3 mr-1" />
//                         View
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           const link = document.createElement("a")
//                           link.href = doc.fileUrl
//                           link.download = doc.description || "document"
//                           link.click()
//                         }}
//                         className="h-8 px-3"
//                       >
//                         <Download className="w-3 h-3 mr-1" />
//                         Download
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleDeleteStationDocument(stationId, doc.id)}
//                         className="h-8 px-3 text-red-600 hover:text-red-700"
//                       >
//                         <Trash2 className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const renderStationNotes = (stationId: string) => {
//     const notes = stationNotes[stationId] || []

//     return (
//       <div className="space-y-4">
//         {/* Add Note Section */}
//         <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
//             <Plus className="w-4 h-4" />
//             Add Station Note
//           </h4>
//           <div className="space-y-3">
//             <Textarea
//               value={newNoteContent}
//               onChange={(e) => setNewNoteContent(e.target.value)}
//               placeholder="Enter operational notes, safety instructions, or maintenance reminders..."
//               rows={3}
//               className="resize-none"
//             />
//             <Button
//               onClick={handleAddNote}
//               disabled={addingNote || !newNoteContent.trim()}
//               size="sm"
//               className="w-full"
//             >
//               {addingNote ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                   Adding Note...
//                 </div>
//               ) : (
//                 <>
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Note
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Notes List */}
//         {notes.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No notes available for this station.</p>
//             <p className="text-sm text-muted-foreground mt-1">
//               Add operational notes, safety instructions, or reminders above.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             <h4 className="font-medium text-sm flex items-center gap-2">
//               <StickyNote className="w-4 h-4" />
//               Station Notes ({notes.length})
//             </h4>
//             <div className="space-y-2">
//               {notes.map((note) => (
//                 <div key={note.id} className="p-3 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.content}</p>
//                       <p className="text-xs text-gray-500 mt-2">
//                         {note.createdAt ? new Date(note.createdAt).toLocaleString() : "Unknown date"}
//                       </p>
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => handleDeleteNote(stationId, note.id!)}
//                       className="ml-3 h-8 px-2 text-red-600 hover:text-red-700"
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const isFormValid = () => {
//     const jobIdError = validateJobId(formData.jobId)
//     const assemblyIdError = validateAssemblyId(formData.assemblyId)
//     const documentControlIdError = orderFormData.documentControlId
//       ? validateDocumentControlId(orderFormData.documentControlId)
//       : null

//     return !jobIdError && !assemblyIdError && !documentControlIdError
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between w-full">
//           <div>
//             <h1 className="text-3xl font-bold text-red-600">Edit MPI</h1>
//             <p className="text-muted-foreground">
//               Job ID: {mpi.jobId} • Assembly ID: {mpi.assemblyId}
//             </p>
//           </div>
//           <Button variant="outline" size="sm" onClick={onCancel}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
//         </div>

//         <Card className="border shadow-sm">
//           <CardContent className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-4">
//                   <TabsTrigger value="basic-info" className="flex items-center gap-2">
//                     <Info className="w-4 h-4" />
//                     Order Details
//                   </TabsTrigger>
//                   <TabsTrigger value="documentation" className="flex items-center gap-2">
//                     <FileText className="w-4 h-4" />
//                     Files
//                     {mpiDocumentation.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {mpiDocumentation.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="checklist" className="flex items-center gap-2">
//                     <ClipboardList className="w-4 h-4" />
//                     Checklist
//                     {existingChecklists.length + availableChecklistTemplate.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {existingChecklists.length + availableChecklistTemplate.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="instructions" className="flex items-center gap-2">
//                     <Factory className="w-4 h-4" />
//                     Instructions
//                     {selectedStations.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {selectedStations.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                 </TabsList>

//                 {/* Basic Information & Order Form Tab */}
//                 <TabsContent value="basic-info" className="space-y-6 mt-6">
//                   {/* MPI Basic Information */}
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="jobId">
//                             MPI ID *{checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="jobId"
//                             value={formData.jobId}
//                             onChange={(e) => handleChange("jobId", e.target.value)}
//                             placeholder="Enter job ID"
//                             required
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = validateJobId(formData.jobId)
//                             return error ? (
//                               <p className="text-xs text-red-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="assemblyId">
//                             Assembly ID *
//                             {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="assemblyId"
//                             value={formData.assemblyId}
//                             onChange={(e) => handleChange("assemblyId", e.target.value)}
//                             placeholder="Enter assembly ID"
//                             required
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = validateAssemblyId(formData.assemblyId)
//                             return error ? (
//                               <p className="text-xs text-red-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="customer">Customer</Label>
//                           <Input
//                             id="customer"
//                             value={formData.customer}
//                             onChange={(e) => handleChange("customer", e.target.value)}
//                             placeholder="Enter customer name"
//                             className="h-11"
//                           />
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   {/* Order Forms Section */}
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="internalOrderNumber">Internal Order Number</Label>
//                           <Input
//                             id="internalOrderNumber"
//                             value={orderFormData.internalOrderNumber}
//                             onChange={(e) => handleOrderFormChange("internalOrderNumber", e.target.value)}
//                             placeholder="Enter internal order number"
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="revision">Revision</Label>
//                           <Input
//                             id="revision"
//                             value={orderFormData.revision}
//                             onChange={(e) => handleOrderFormChange("revision", e.target.value)}
//                             placeholder="Enter revision number"
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="documentControlId">
//                             Document Control ID
//                             {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="documentControlId"
//                             value={orderFormData.documentControlId}
//                             onChange={(e) => handleOrderFormChange("documentControlId", e.target.value)}
//                             placeholder="Enter document control ID"
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = orderFormData.documentControlId
//                               ? validateDocumentControlId(orderFormData.documentControlId)
//                               : null
//                             return error ? (
//                               <p className="text-xs text-red-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="distributionDate">Distribution Date</Label>
//                           <Input
//                             id="distributionDate"
//                             type="date"
//                             value={orderFormData.distributionDate}
//                             onChange={(e) => handleOrderFormChange("distributionDate", e.target.value)}
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="requiredBy">Required By</Label>
//                           <Input
//                             id="requiredBy"
//                             type="date"
//                             value={orderFormData.requiredBy}
//                             onChange={(e) => handleOrderFormChange("requiredBy", e.target.value)}
//                             className="h-11"
//                           />
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Documentation Tab */}
//                 <TabsContent value="documentation" className="space-y-6 mt-6">
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="space-y-4">
//                         {/* Upload Section */}
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
//                           <div className="space-y-4">
//                             <div className="grid grid-cols-1 gap-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor="mpi-doc-file">Select Files *</Label>
//                                 <Input
//                                   id="mpi-doc-file"
//                                   type="file"
//                                   accept="*/*"
//                                   className="cursor-pointer"
//                                   disabled={uploadingMpiDoc}
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor="mpi-doc-description">Description (Optional)</Label>
//                                 <Input
//                                   id="mpi-doc-description"
//                                   placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                                   disabled={uploadingMpiDoc}
//                                 />
//                               </div>
//                             </div>
//                             <Button
//                               type="button"
//                               variant="outline"
//                               disabled={uploadingMpiDoc}
//                               onClick={async () => {
//                                 const fileInput = document.getElementById("mpi-doc-file") as HTMLInputElement
//                                 const descInput = document.getElementById("mpi-doc-description") as HTMLInputElement
//                                 const file = fileInput?.files?.[0]
//                                 const description = descInput?.value?.trim() || ""

//                                 if (!file) {
//                                   toast({
//                                     title: "Missing File",
//                                     description: "Please select a file to upload.",
//                                     variant: "destructive",
//                                   })
//                                   return
//                                 }

//                                 await handleMpiDocumentUpload(file, description)
//                                 fileInput.value = ""
//                                 descInput.value = ""
//                               }}
//                               className="w-full bg-transparent"
//                             >
//                               {uploadingMpiDoc ? (
//                                 <div className="flex items-center gap-2">
//                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                   Uploading File...
//                                 </div>
//                               ) : (
//                                 <>
//                                   <Upload className="w-4 h-4 mr-2" />
//                                   Upload File
//                                 </>
//                               )}
//                             </Button>
//                           </div>
//                         </div>

//                         {/* Uploaded Documents List */}
//                         {mpiDocumentation.length > 0 && (
//                           <div className="space-y-3">
//                             <h4 className="font-medium text-sm">Files</h4>
//                             <div className="space-y-2">
//                               {mpiDocumentation.map((doc, index) => (
//                                 <div
//                                   key={index}
//                                   className="flex items-start justify-between p-4 bg-gray-50 rounded border"
//                                 >
//                                   <div className="flex items-start gap-3 flex-1">
//                                     <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                                     <div className="flex-1 min-w-0">
//                                       <p className="text-sm font-medium text-gray-900 truncate">
//                                         {doc.description && doc.description !== doc.fileName
//                                           ? doc.description
//                                           : doc.fileName}
//                                       </p>
//                                       <div className="mt-1 space-y-1">
//                                         <p className="text-xs text-gray-600">
//                                           <span className="font-medium">Filename:</span> {doc.fileName}
//                                         </p>
//                                         {doc.description && doc.description !== doc.fileName && (
//                                           <p className="text-xs text-gray-500">
//                                             <span className="font-medium">Description:</span> {doc.description}
//                                           </p>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <div className="flex items-center gap-2 ml-4">
//                                     <Button
//                                       type="button"
//                                       size="sm"
//                                       variant="outline"
//                                       onClick={() => removeMpiDocument(index)}
//                                       className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
//                                     >
//                                       Remove
//                                     </Button>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Checklist Tab */}
//                 <TabsContent value="checklist" className="space-y-6 mt-6">
//                   <Card>
//                     <CardContent className="mt-5">
//                       {loadingAvailableChecklist ? (
//                         <div className="flex items-center justify-center py-8">
//                           <div className="text-center">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
//                             <p className="mt-2 text-sm text-muted-foreground">Loading checklist data...</p>
//                           </div>
//                         </div>
//                       ) : existingChecklists.length === 0 && availableChecklistTemplate.length === 0 ? (
//                         <p className="text-muted-foreground text-center py-4">No checklist data available.</p>
//                       ) : (
//                         <div className="space-y-6">
//                           {/* Existing Checklists */}
//                           {existingChecklists.length > 0 ? (
//                             <div>
//                               <h3 className="text-lg font-semibold mb-4 text-red-800">Existing Required Checklists</h3>
//                               <Accordion type="multiple" className="w-full">
//                                 {existingChecklists.map((section) => (
//                                   <AccordionItem key={section.id} value={section.id}>
//                                     <AccordionTrigger className="text-left">
//                                       <div className="flex items-center gap-3">
//                                         <h4 className="font-medium">{section.name}</h4>
//                                       </div>
//                                     </AccordionTrigger>
//                                     <AccordionContent>
//                                       <div className="space-y-4">
//                                         <Table>
//                                           <TableHeader>
//                                             <TableRow>
//                                               <TableHead>Description</TableHead>
//                                               <TableHead>Required</TableHead>
//                                               <TableHead>Remarks</TableHead>
//                                             </TableRow>
//                                           </TableHeader>
//                                           <TableBody>
//                                             {(section.items || []).map((item) => (
//                                               <TableRow key={item.id}>
//                                                 <TableCell className="font-medium">{item.description}</TableCell>
//                                                 <TableCell>
//                                                   <Select
//                                                     value={
//                                                       getChecklistItemValue(item.id, "required", item.required)
//                                                         ? "yes"
//                                                         : "no"
//                                                     }
//                                                     onValueChange={(value) =>
//                                                       handleChecklistItemChange(item.id, "required", value === "yes")
//                                                     }
//                                                   >
//                                                     <SelectTrigger className="w-20">
//                                                       <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                       <SelectItem value="yes">Yes</SelectItem>
//                                                       <SelectItem value="no">No</SelectItem>
//                                                     </SelectContent>
//                                                   </Select>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                   <Input
//                                                     value={
//                                                       getChecklistItemValue(item.id, "remarks", item.remarks) as string
//                                                     }
//                                                     onChange={(e) =>
//                                                       handleChecklistItemChange(item.id, "remarks", e.target.value)
//                                                     }
//                                                     placeholder="Enter remarks (optional)"
//                                                     className="min-w-[200px]"
//                                                   />
//                                                 </TableCell>
//                                               </TableRow>
//                                             ))}
//                                           </TableBody>
//                                         </Table>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           ) : (
//                             <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                               <h3 className="text-lg font-semibold mb-2 text-blue-800">Existing Checklists</h3>
//                               <p className="text-sm text-blue-700">
//                                 No checklist items have been created for this MPI yet.
//                               </p>
//                             </div>
//                           )}

//                           {/* Available Checklist Template */}
//                           {availableChecklistTemplate.length > 0 && (
//                             <div>
//                               <h3 className="text-lg font-semibold mb-4 text-red-800">Available Checklist Items</h3>
//                               <Accordion type="multiple" className="w-full">
//                                 {availableChecklistTemplate.map((section) => (
//                                   <AccordionItem key={section.id} value={section.id}>
//                                     <AccordionTrigger className="text-left">
//                                       <div className="flex items-center gap-3">
//                                         <h4 className="font-medium">{section.name}</h4>
//                                       </div>
//                                     </AccordionTrigger>
//                                     <AccordionContent>
//                                       <div className="space-y-4">
//                                         <Table>
//                                           <TableHeader>
//                                             <TableRow>
//                                               <TableHead>Description</TableHead>
//                                               <TableHead>Required</TableHead>
//                                               <TableHead>Remarks</TableHead>
//                                             </TableRow>
//                                           </TableHeader>
//                                           <TableBody>
//                                             {(section.items || []).map((item) => (
//                                               <TableRow key={item.id}>
//                                                 <TableCell className="font-medium">{item.description}</TableCell>
//                                                 <TableCell>
//                                                   <Select
//                                                     value={
//                                                       getChecklistItemValue(item.id, "required", item.required)
//                                                         ? "yes"
//                                                         : "no"
//                                                     }
//                                                     onValueChange={(value) =>
//                                                       handleChecklistItemChange(item.id, "required", value === "yes")
//                                                     }
//                                                   >
//                                                     <SelectTrigger className="w-20">
//                                                       <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                       <SelectItem value="yes">Yes</SelectItem>
//                                                       <SelectItem value="no">No</SelectItem>
//                                                     </SelectContent>
//                                                   </Select>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                   <Input
//                                                     value={
//                                                       getChecklistItemValue(item.id, "remarks", item.remarks) as string
//                                                     }
//                                                     onChange={(e) =>
//                                                       handleChecklistItemChange(item.id, "remarks", e.target.value)
//                                                     }
//                                                     placeholder="Enter remarks (optional)"
//                                                     className="min-w-[200px]"
//                                                   />
//                                                 </TableCell>
//                                               </TableRow>
//                                             ))}
//                                           </TableBody>
//                                         </Table>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Instructions Tab */}
//                 <TabsContent value="instructions" className="space-y-6 mt-6">
//                   <InstructionsTab
//                     instructions={instructions}
//                     onAddInstruction={handleAddInstruction}
//                     onInstructionChange={handleInstructionChange}
//                     onRemoveInstruction={handleRemoveInstruction}
//                     availableStations={availableStations}
//                     formData={formData}
//                     loadingStations={loadingStations}
//                     activeStationId={activeStationId}
//                     setActiveStationId={setActiveStationId}
//                     stationViewMode={stationViewMode}
//                     setStationViewMode={setStationViewMode}
//                     handleStationSelectionChange={handleStationSelectionChange}
//                     selectedStations={selectedStations}
//                     stationNotes={stationNotes}
//                     stationDocuments={stationDocuments}
//                     renderSpecificationInput={renderSpecificationInput}
//                     renderStationDocuments={renderStationDocuments}
//                     renderStationNotes={renderStationNotes}
//                     focusedInstructionIndex={focusedInstructionIndex}
//                     setFocusedInstructionIndex={setFocusedInstructionIndex}
//                     instructionRefs={instructionRefs}
//                   />
//                 </TabsContent>
//               </Tabs>

//               {/* Form Actions */}
//               <div className="flex justify-end gap-4">
//                 <Button variant="outline" onClick={onCancel}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isLoading || !isFormValid()}>
//                   {isLoading ? (
//                     <div className="flex items-center gap-2 animate-pulse">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                       <span>Updating...</span>
//                     </div>
//                   ) : (
//                     <>Update MPI</>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }



































// "use client"

// import React from "react"

// import type { FunctionComponent } from "react"
// import { useState, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   ArrowLeft,
//   Factory,
//   Info,
//   ClipboardList,
//   FileText,
//   Download,
//   Eye,
//   StickyNote,
//   Plus,
//   Trash2,
//   X,
//   Upload,
//   AlertCircle,
// } from "lucide-react"
// import type { MPI, UpdateMPIDto } from "./types"
// import { StationAPI } from "../stations/station-api"
// import type { Station } from "../stations/types"
// import { useToast } from "@/hooks/use-toast"
// import { MPIAPI } from "./mpi-api"
// import { MPIDocumentationAPI } from "./mpi-document-api"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"
// import { API_BASE_URL } from "@/lib/constants"
// import { ServiceAPI } from "../services/service-api"
// import type { Service } from "../services/types"

// // Enhanced InstructionsTab component with proper focus management and layout matching create mode
// const InstructionsTab: FunctionComponent<{
//   instructions: string[]
//   onAddInstruction: () => void
//   onInstructionChange: (index: number, value: string) => void
//   onRemoveInstruction: (index: number) => void
//   availableStations: Station[]
//   formData: any
//   loadingStations: boolean
//   activeStationId: string | null
//   setActiveStationId: (id: string | null) => void
//   stationViewMode: "specifications" | "documents" | "notes"
//   setStationViewMode: (mode: "specifications" | "documents" | "notes") => void
//   handleStationSelectionChange: (stationIds: string[]) => void
//   selectedStations: Station[]
//   stationNotes: Record<string, StationNote[]>
//   stationDocuments: Record<string, StationDocument[]>
//   renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
//   renderStationDocuments: (stationId: string) => React.ReactNode
//   renderStationNotes: (stationId: string) => React.ReactNode
//   focusedInstructionIndex: number | null
//   setFocusedInstructionIndex: (index: number | null) => void
//   instructionRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
// }> = React.memo(
//   ({
//     instructions,
//     onAddInstruction,
//     onInstructionChange,
//     onRemoveInstruction,
//     availableStations,
//     formData,
//     loadingStations,
//     activeStationId,
//     setActiveStationId,
//     stationViewMode,
//     setStationViewMode,
//     handleStationSelectionChange,
//     selectedStations,
//     stationNotes,
//     stationDocuments,
//     renderSpecificationInput,
//     renderStationDocuments,
//     renderStationNotes,
//     focusedInstructionIndex,
//     setFocusedInstructionIndex,
//     instructionRefs,
//   }) => {
//     return (
//       <div className="space-y-6">
//         {/* Stations Section */}
//         <Card>
//           <CardContent className="space-y-6 mt-5">
//             {loadingStations ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
//                   <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
//                 </div>
//               </div>
//             ) : availableStations.length === 0 ? (
//               <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
//               </div>
//             ) : (
//               <div className="flex gap-6 min-h-[600px]">
//                 {/* Left Sidebar - Station List */}
//                 <div className="w-1/4 border rounded-lg bg-gray-50">
//                   <div className="p-3 border-b bg-white rounded-t-lg">
//                     <h4 className="font-medium text-base">Stations</h4>
//                     <p className="text-xs text-muted-foreground">
//                       {formData.selectedStationIds.length > 0
//                         ? `${formData.selectedStationIds.length} selected`
//                         : "Click to select multiple"}
//                     </p>
//                   </div>
//                   <div className="p-2 overflow-y-auto h-[530px]">
//                     <div className="space-y-1">
//                       {availableStations.map((station) => {
//                         const noteCount = stationNotes[station.id]?.length || 0
//                         const docCount = stationDocuments[station.id]?.length || 0
//                         const isSelected = formData.selectedStationIds.includes(station.id)

//                         return (
//                           <div
//                             key={station.id}
//                             className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
//                               isSelected
//                                 ? "bg-blue-100 text-blue-900 border-blue-300"
//                                 : "bg-white hover:bg-gray-100 border-transparent"
//                             } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
//                             onClick={() => {
//                               setActiveStationId(station.id)
//                               if (isSelected) {
//                                 handleStationSelectionChange(
//                                   formData.selectedStationIds.filter((id: string) => id !== station.id),
//                                 )
//                               } else {
//                                 handleStationSelectionChange([...formData.selectedStationIds, station.id])
//                               }
//                             }}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="truncate">{station.stationName}</span>
//                               <div className="flex gap-1">
//                                 {noteCount > 0 && (
//                                   <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
//                                     {noteCount}N
//                                   </Badge>
//                                 )}
//                                 {docCount > 0 && (
//                                   <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
//                                     {docCount}D
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Panel - Station Details */}
//                 <div className="flex-1 border rounded-lg bg-gray-50">
//                   {!activeStationId ? (
//                     <div className="flex items-center justify-center h-full">
//                       <div className="text-center">
//                         <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <h4 className="font-medium text-gray-600 mb-2">No Station Selected</h4>
//                         <p className="text-sm text-muted-foreground">
//                           Select a station from the left sidebar to view its details
//                           {formData.selectedStationIds.length > 0 && (
//                             <span className="block mt-2 text-blue-600 font-medium">
//                               {formData.selectedStationIds.length} station
//                               {formData.selectedStationIds.length > 1 ? "s" : ""} selected for MPI
//                             </span>
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="h-full flex flex-col">
//                       <div className="p-4 border-b bg-white rounded-t-lg">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <Factory className="w-5 h-5 text-purple-600" />
//                             <div>
//                               <h4 className="font-medium text-lg">
//                                 {availableStations.find((s) => s.id === activeStationId)?.stationName}
//                               </h4>
//                               <p className="text-sm text-muted-foreground">Station Details</p>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "specifications" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("specifications")}
//                             >
//                               Specifications
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "documents" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("documents")}
//                             >
//                               Files
//                               {stationDocuments[activeStationId]?.length > 0 && (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {stationDocuments[activeStationId].length}
//                                 </Badge>
//                               )}
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "notes" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("notes")}
//                             >
//                               Notes
//                               {stationNotes[activeStationId]?.length > 0 && (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {stationNotes[activeStationId].length}
//                                 </Badge>
//                               )}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex-1 overflow-auto p-4">
//                         {stationViewMode === "specifications" && (
//                           <div>
//                             {(() => {
//                               const station = availableStations.find((s) => s.id === activeStationId)
//                               if (!station) return null

//                               if (!station.specifications || station.specifications.length === 0) {
//                                 return (
//                                   <div className="text-center py-6">
//                                     <p className="text-muted-foreground">
//                                       No specifications available for this station.
//                                     </p>
//                                   </div>
//                                 )
//                               }

//                               return (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   {station.specifications.map((spec) => (
//                                     <div key={spec.id} className="space-y-3 p-3 bg-white rounded border">
//                                       {renderSpecificationInput(spec, station.id)}
//                                     </div>
//                                   ))}
//                                 </div>
//                               )
//                             })()}
//                           </div>
//                         )}
//                         {stationViewMode === "documents" && renderStationDocuments(activeStationId)}
//                         {stationViewMode === "notes" && renderStationNotes(activeStationId)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Selected Station Summary */}
//             {formData.selectedStationIds.length > 0 && (
//               <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <h4 className="font-medium text-blue-800 mb-3">Selected Stations</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedStations.map((station) => (
//                     <Badge key={station.id} variant="outline" className="bg-white">
//                       {station.stationName}
//                       {station.specifications && station.specifications.length > 0 && (
//                         <span className="ml-1 text-xs">({station.specifications.length} specs)</span>
//                       )}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Instructions Section - Now positioned below stations section like in create mode */}
//         <Card>
//           <CardContent className="mt-5">
//             <div className="space-y-4">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h4 className="text-lg font-semibold text-green-800">General Instructions</h4>
//                   <p className="text-sm text-muted-foreground">
//                     Add general safety and operational instructions for this MPI
//                   </p>
//                 </div>
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="outline"
//                   onClick={() => {
//                     onAddInstruction()
//                     // Focus the new instruction input after it's added
//                     setTimeout(() => {
//                       setFocusedInstructionIndex(instructions.length)
//                     }, 0)
//                   }}
//                   className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Instruction
//                 </Button>
//               </div>
//               {instructions.length === 0 ? (
//                 <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                   <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm text-muted-foreground">No instructions added yet</p>
//                   <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {instructions.map((instruction, index) => (
//                     <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
//                       <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <Input
//                           ref={(el) => {
//                             instructionRefs.current[index] = el
//                           }}
//                           value={instruction}
//                           onChange={(e) => {
//                             setFocusedInstructionIndex(index)
//                             onInstructionChange(index, e.target.value)
//                           }}
//                           onFocus={() => setFocusedInstructionIndex(index)}
//                           onBlur={() => setFocusedInstructionIndex(null)}
//                           placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
//                           className="w-full"
//                         />
//                       </div>
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="ghost"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           onRemoveInstruction(index)
//                           // Clear focus tracking when removing instruction
//                           setFocusedInstructionIndex(null)
//                         }}
//                         className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-shrink-0"
//                       >
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   },
// )

// interface MPIEditProps {
//   mpi: MPI
//   onSubmit: (data: UpdateMPIDto) => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
// }

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   fileUrl?: string
//   unit?: string
// }

// interface ChecklistSection {
//   id: string
//   name: string
//   description: string
//   items: ChecklistItem[]
// }

// interface ChecklistItem {
//   id: string
//   description: string
//   required: boolean
//   remarks: string
//   category?: string
//   isActive: boolean
//   createdBy: string
//   sectionId: string
// }

// interface MPIDocumentation {
//   id?: string
//   file?: File
//   fileUrl?: string
//   description: string
//   fileName: string
//   originalFileName?: string
//   isUploaded?: boolean
// }

// interface StationNote {
//   id?: string
//   content: string
//   createdAt?: string
//   updatedAt?: string
// }

// interface StationDocument {
//   id: string
//   fileUrl: string
//   description: string
//   stationId: string
//   mpiId?: string
//   createdAt: string
//   updatedAt: string
// }

// // Helper function to safely convert order type to array
// const normalizeOrderType = (orderType: any): string[] => {
//   if (!orderType) return []
//   if (Array.isArray(orderType)) return orderType.filter((type) => typeof type === "string")
//   if (typeof orderType === "string") return [orderType]
//   return []
// }

// // Helper function to safely convert file action to array
// const normalizeFileAction = (fileAction: any): string[] => {
//   if (!fileAction) return []
//   if (Array.isArray(fileAction)) return fileAction.filter((action) => typeof action === "string")
//   if (typeof fileAction === "string") return [fileAction]
//   return []
// }

// export function MPIEdit({ mpi, onSubmit, onCancel, isLoading }: MPIEditProps) {
//   const [activeTab, setActiveTab] = useState("basic-info")
//   const [formData, setFormData] = useState({
//     jobId: mpi.jobId || "",
//     assemblyId: mpi.assemblyId || "",
//     customer: mpi.customer || "",
//     selectedStationIds: mpi.stations?.map((s) => s.id) || [],
//   })

//   // Order Form State - Initialize with existing data
//   const [orderFormData, setOrderFormData] = useState({
//     id: mpi.orderForms?.[0]?.id || "",
//     orderType: normalizeOrderType(mpi.orderForms?.[0]?.orderType),
//     distributionDate: mpi.orderForms?.[0]?.distributionDate
//       ? new Date(mpi.orderForms[0].distributionDate).toISOString().split("T")[0]
//       : "",
//     requiredBy: mpi.orderForms?.[0]?.requiredBy
//       ? new Date(mpi.orderForms[0].requiredBy).toISOString().split("T")[0]
//       : "",
//     internalOrderNumber: mpi.orderForms?.[0]?.internalOrderNumber || "",
//     revision: mpi.orderForms?.[0]?.revision || "",
//     otherAttachments: mpi.orderForms?.[0]?.otherAttachments || "",
//     fileAction: normalizeFileAction(mpi.orderForms?.[0]?.fileAction),
//     markComplete: mpi.orderForms?.[0]?.markComplete || false,
//     documentControlId: mpi.orderForms?.[0]?.documentControlId || "",
//     selectedServiceId: mpi.orderForms?.[0]?.services?.[0]?.id || "",
//   })

//   // Instructions state - Initialize with existing data
//   const [instructions, setInstructions] = useState<string[]>(mpi.Instruction || [])

//   // Add focus management for instruction inputs
//   const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
//   const instructionRefs = useRef<(HTMLInputElement | null)[]>([])

//   // Add these state variables after the instruction focus management states
//   const [focusedSpecificationId, setFocusedSpecificationId] = useState<string | null>(null)
//   const specificationRefs = useRef<Record<string, HTMLInputElement | null>>({})

//   // Service state
//   const [services, setServices] = useState<Service[]>([])
//   const [loadingServices, setLoadingServices] = useState(false)
//   const [selectedService, setSelectedService] = useState<Service | null>(null)

//   // Enums state
//   const [enums, setEnums] = useState<any>({})
//   const [loadingEnums, setLoadingEnums] = useState(false)

//   // Checklist template and existing checklist state
//   const [availableChecklistTemplate, setAvailableChecklistTemplate] = useState<ChecklistSection[]>([])
//   const [existingChecklists, setExistingChecklists] = useState<ChecklistSection[]>([])
//   const [loadingAvailableChecklist, setLoadingAvailableChecklist] = useState(false)

//   // Specification values state - Initialize with existing values
//   const [specificationValues, setSpecificationValues] = useState<Record<string, SpecificationValue>>(() => {
//     const initialValues: Record<string, SpecificationValue> = {}
//     console.log("🔍 Initializing specification values from MPI data:", mpi)

//     mpi.stations?.forEach((station) => {
//       console.log(`📍 Processing station: ${station.stationName} (${station.id})`)
//       station.specifications?.forEach((spec) => {
//         console.log(`🔧 Processing spec: ${spec.name} (${spec.id})`)
//         // Look for existing values in multiple places
//         let existingValue = null

//         // Method 1: Check stationSpecifications array
//         if (spec.stationSpecifications && spec.stationSpecifications.length > 0) {
//           existingValue = spec.stationSpecifications.find((ss) => ss.stationId === station.id)
//           console.log(`📋 Found in stationSpecifications:`, existingValue)
//         }

//         // Method 2: Check if there's a direct value on the spec
//         if (!existingValue && spec.value) {
//           existingValue = { value: spec.value, unit: spec.unit }
//           console.log(`📋 Found direct value on spec:`, existingValue)
//         }

//         // Method 3: Check station's specificationValues if it exists
//         if (!existingValue && station.specificationValues) {
//           const stationSpecValue = station.specificationValues.find((sv: any) => sv.specificationId === spec.id)
//           if (stationSpecValue) {
//             existingValue = { value: stationSpecValue.value, unit: stationSpecValue.unit }
//             console.log(`📋 Found in station specificationValues:`, existingValue)
//           }
//         }

//         if (existingValue && existingValue.value) {
//           initialValues[spec.id] = {
//             specificationId: spec.id,
//             value: existingValue.value,
//             unit: existingValue.unit || undefined,
//             fileUrl: existingValue.fileUrl || undefined,
//           }
//           console.log(`✅ Initialized spec ${spec.id} with value:`, initialValues[spec.id])
//         } else {
//           // Initialize with empty value for specs without existing data
//           initialValues[spec.id] = {
//             specificationId: spec.id,
//             value: "",
//             unit: undefined,
//             fileUrl: undefined,
//           }
//           console.log(`🆕 Initialized spec ${spec.id} with empty value`)
//         }
//       })
//     })

//     console.log("🎯 Final initial specification values:", initialValues)
//     return initialValues
//   })

//   const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())

//   // MPI Documentation State - Enhanced with proper filename handling
//   const [mpiDocumentation, setMpiDocumentation] = useState<MPIDocumentation[]>(() => {
//     // Initialize with existing MPI documents
//     return (
//       mpi.mpiDocs?.map((doc) => ({
//         id: doc.id,
//         fileUrl: doc.fileUrl,
//         description: doc.description,
//         fileName: doc.fileName || doc.description, // Use fileName if available, fallback to description
//         originalFileName: doc.originalFileName || doc.fileName || doc.description,
//         isUploaded: true,
//       })) || []
//     )
//   })

//   const [uploadingMpiDoc, setUploadingMpiDoc] = useState(false)

//   // Checklist modifications state - Initialize with existing checklist data
//   const [checklistModifications, setChecklistModifications] = useState<
//     Record<string, { required: boolean; remarks: string }>
//   >(() => {
//     const initialModifications: Record<string, { required: boolean; remarks: string }> = {}
//     // Initialize with existing checklist data
//     mpi.checklists?.forEach((checklist) => {
//       checklist.checklistItems?.forEach((item, itemIndex) => {
//         const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
//         initialModifications[itemId] = {
//           required: item.required,
//           remarks: item.remarks,
//         }
//       })
//     })
//     console.log("Initial checklist modifications:", initialModifications)
//     return initialModifications
//   })

//   const [availableStations, setAvailableStations] = useState<Station[]>([])
//   const [loadingStations, setLoadingStations] = useState(false)
//   const [selectedStations, setSelectedStations] = useState<Station[]>([])

//   // Station view state for instructions tab
//   const [activeStationId, setActiveStationId] = useState<string | null>(null)
//   const [stationViewMode, setStationViewMode] = useState<"specifications" | "documents" | "notes">("specifications")

//   // Station notes state
//   const [stationNotes, setStationNotes] = useState<Record<string, StationNote[]>>({})
//   const [loadingNotes, setLoadingNotes] = useState<Set<string>>(new Set())
//   const [newNoteContent, setNewNoteContent] = useState("")
//   const [addingNote, setAddingNote] = useState(false)

//   // Station documents state
//   const [stationDocuments, setStationDocuments] = useState<Record<string, StationDocument[]>>({})
//   const [loadingDocuments, setLoadingDocuments] = useState<Set<string>>(new Set())
//   const [uploadingStationDoc, setUploadingStationDoc] = useState(false)

//   // Validation state
//   const [existingJobIds, setExistingJobIds] = useState<string[]>([])
//   const [existingAssemblyIds, setExistingAssemblyIds] = useState<string[]>([])
//   const [existingDocumentControlIds, setExistingDocumentControlIds] = useState<string[]>([])
//   const [checkingIds, setCheckingIds] = useState(false)

//   const { toast } = useToast()

//   // Initialize station notes from MPI data
//   useEffect(() => {
//     const initialNotes: Record<string, StationNote[]> = {}
//     mpi.stations?.forEach((station) => {
//       if (station.Note && Array.isArray(station.Note)) {
//         initialNotes[station.id] = station.Note.map((note, index) => ({
//           id: `note-${station.id}-${index}`,
//           content: note,
//           createdAt: new Date().toISOString(),
//         }))
//       }
//     })
//     setStationNotes(initialNotes)
//   }, [mpi.stations])

//   // Initialize station documents from MPI data
//   useEffect(() => {
//     const initialDocs: Record<string, StationDocument[]> = {}
//     mpi.stations?.forEach((station) => {
//       if (station.documentations && Array.isArray(station.documentations)) {
//         initialDocs[station.id] = station.documentations
//       }
//     })
//     setStationDocuments(initialDocs)
//   }, [mpi.stations])

//   // Restore focus to instruction input after re-render
//   useEffect(() => {
//     if (focusedInstructionIndex !== null && instructionRefs.current[focusedInstructionIndex]) {
//       const input = instructionRefs.current[focusedInstructionIndex]
//       if (input) {
//         const cursorPosition = input.selectionStart || 0
//         // Use setTimeout to ensure the DOM has updated
//         setTimeout(() => {
//           input.focus()
//           input.setSelectionRange(cursorPosition, cursorPosition)
//         }, 0)
//       }
//     }
//   }, [instructions, focusedInstructionIndex])

//   // Add this useEffect after the instruction focus useEffect
//   useEffect(() => {
//     if (focusedSpecificationId && specificationRefs.current[focusedSpecificationId]) {
//       const input = specificationRefs.current[focusedSpecificationId]
//       if (input) {
//         const cursorPosition = input.selectionStart || 0
//         setTimeout(() => {
//           input.focus()
//           input.setSelectionRange(cursorPosition, cursorPosition)
//         }, 0)
//       }
//     }
//   }, [specificationValues, focusedSpecificationId])

//   // Load existing IDs for validation (excluding current MPI)
//   const loadExistingIds = async () => {
//     try {
//       setCheckingIds(true)
//       const mpis = await MPIAPI.getAllMPIs()
//       // Filter out current MPI from validation
//       const otherMpis = mpis.filter((m) => m.id !== mpi.id)
//       const jobIds = otherMpis.map((m) => m.jobId.toLowerCase())
//       const assemblyIds = otherMpis.map((m) => m.assemblyId.toLowerCase())
//       const documentControlIds = otherMpis
//         .filter((m) => m.orderForms && m.orderForms.length > 0)
//         .flatMap((m) => m.orderForms.map((form) => form.documentControlId))
//         .filter(Boolean)
//         .map((id) => id.toLowerCase())

//       setExistingJobIds(jobIds)
//       setExistingAssemblyIds(assemblyIds)
//       setExistingDocumentControlIds(documentControlIds)
//     } catch (error) {
//       console.error("Failed to load existing IDs:", error)
//     } finally {
//       setCheckingIds(false)
//     }
//   }

//   // Validation functions
//   const validateJobId = (jobId: string): string | null => {
//     if (!jobId.trim()) return "Job ID is required"
//     if (jobId.length < 2) return "Job ID must be at least 2 characters"
//     if (existingJobIds.includes(jobId.toLowerCase())) {
//       return `Job ID "${jobId}" already exists. Please use a different Job ID.`
//     }
//     return null
//   }

//   const validateAssemblyId = (assemblyId: string): string | null => {
//     if (!assemblyId.trim()) return "Assembly ID is required"
//     if (assemblyId.length < 2) return "Assembly ID must be at least 2 characters"
//     if (existingAssemblyIds.includes(assemblyId.toLowerCase())) {
//       return `Assembly ID "${assemblyId}" already exists. Please use a different Assembly ID.`
//     }
//     return null
//   }

//   const validateDocumentControlId = (documentControlId: string): string | null => {
//     if (!documentControlId.trim()) return null
//     if (documentControlId.length < 2) return "Document Control ID must be at least 2 characters"
//     if (existingDocumentControlIds.includes(documentControlId.toLowerCase())) {
//       return `Document Control ID "${documentControlId}" already exists. Please use a different ID.`
//     }
//     return null
//   }

//   // Instruction handlers
//   const handleAddInstruction = () => {
//     setInstructions((prev) => [...prev, ""])
//   }

//   const handleInstructionChange = (index: number, value: string) => {
//     setInstructions((prev) => prev.map((instruction, i) => (i === index ? value : instruction)))
//   }

//   const handleRemoveInstruction = (index: number) => {
//     setInstructions((prev) => prev.filter((_, i) => i !== index))
//     toast({
//       title: "Instruction Removed",
//       description: "Instruction has been removed from the list.",
//     })
//   }

//   // Station notes handlers
//   const handleAddNote = async () => {
//     if (!activeStationId || !newNoteContent.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter note content.",
//         variant: "destructive",
//       })
//       return
//     }

//     setAddingNote(true)
//     try {
//       const newNote: StationNote = {
//         id: `note-${activeStationId}-${Date.now()}`,
//         content: newNoteContent.trim(),
//         createdAt: new Date().toISOString(),
//       }

//       setStationNotes((prev) => ({
//         ...prev,
//         [activeStationId]: [...(prev[activeStationId] || []), newNote],
//       }))

//       setNewNoteContent("")
//       toast({
//         title: "Success",
//         description: "Note added successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to add note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add note. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setAddingNote(false)
//     }
//   }

//   const handleDeleteNote = async (stationId: string, noteId: string) => {
//     try {
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: prev[stationId]?.filter((note) => note.id !== noteId) || [],
//       }))

//       toast({
//         title: "Success",
//         description: "Note deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete note. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Station document handlers
//   const handleStationDocumentUpload = async (file: File, description: string, fileName?: string) => {
//     if (!activeStationId) {
//       toast({
//         title: "Error",
//         description: "No station selected.",
//         variant: "destructive",
//       })
//       return
//     }

//     setUploadingStationDoc(true)
//     try {
//       const finalDescription = description.trim() || file.name
//       const finalFileName = fileName?.trim() || file.name

//       console.log("📤 Station document upload:", {
//         file: file.name,
//         description: finalDescription,
//         fileName: finalFileName,
//         stationId: activeStationId,
//         mpiId: mpi.id,
//       })

//       if (!mpi.id) {
//         // For new MPIs, queue the document locally
//         console.log("💾 QUEUING station document locally - MPI not created yet...")
//         if (file.size > 10 * 1024 * 1024) {
//           throw new Error("File size exceeds 10MB limit")
//         }

//         const newDoc = {
//           id: `temp-${Date.now()}`,
//           file: file,
//           description: finalDescription,
//           fileName: finalFileName,
//           stationId: activeStationId,
//           isUploaded: false,
//         }

//         setStationDocuments((prev) => ({
//           ...prev,
//           [activeStationId]: [...(prev[activeStationId] || []), newDoc],
//         }))

//         toast({
//           title: "✅ Document Queued Successfully",
//           description: `"${finalDescription}" will be uploaded when the MPI is saved.`,
//         })
//       } else {
//         // For existing MPIs, upload directly
//         console.log("📤 Uploading station document directly to existing MPI...")
//         const formData = new FormData()
//         formData.append("files", file)
//         formData.append("stationId", activeStationId)
//         formData.append("description", finalDescription)
//         formData.append("mpiId", mpi.id)
//         formData.append("originalName", file.name)

//         const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
//           method: "POST",
//           body: formData,
//         })

//         if (!response.ok) {
//           const errorText = await response.text()
//           console.error("❌ Direct upload failed:", errorText)
//           throw new Error(`Upload failed: ${response.status} - ${errorText}`)
//         }

//         const result = await response.json()
//         console.log("✅ Station document uploaded successfully:", result)

//         // Add to existing documents for the station
//         setStationDocuments((prev) => ({
//           ...prev,
//           [activeStationId]: [
//             ...(prev[activeStationId] || []),
//             {
//               id: result.id || `uploaded-${Date.now()}`,
//               fileUrl: result.fileUrl,
//               description: result.description || finalDescription,
//               fileName: result.fileName || finalFileName,
//               stationId: activeStationId,
//               isUploaded: true,
//             },
//           ],
//         }))

//         toast({
//           title: "Success",
//           description: "Station document uploaded successfully.",
//         })
//       }
//     } catch (error) {
//       console.error("Station document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingStationDoc(false)
//     }
//   }

//   const handleDeleteStationDocument = async (stationId: string, documentId: string) => {
//     try {
//       // Check if it's an uploaded document or queued document
//       const stationDocs = stationDocuments[stationId] || []
//       const doc = stationDocs.find((d) => d.id === documentId)

//       if (doc && doc.isUploaded && doc.id && !doc.id.startsWith("temp-")) {
//         // Delete uploaded document via API
//         await StationMpiDocAPI.delete(documentId)
//       }

//       // Remove from local state
//       setStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: prev[stationId]?.filter((doc) => doc.id !== documentId) || [],
//       }))

//       toast({
//         title: "Success",
//         description: "Document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete document. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Enhanced MPI Documentation handlers with proper filename support
//   const handleMpiDocumentUpload = async (file: File, description: string) => {
//     setUploadingMpiDoc(true)
//     try {
//       if (!file) {
//         throw new Error("No file selected")
//       }

//       const finalDescription = description.trim() || file.name

//       console.log("📤 MPI document upload:", {
//         originalFile: file.name,
//         description: finalDescription,
//         fileSize: file.size,
//       })

//       // For edit mode, upload immediately since MPI already exists
//       const result = await MPIDocumentationAPI.uploadDocument(mpi.id, file, finalDescription, file.name)

//       const newDoc: MPIDocumentation = {
//         id: result.id,
//         fileUrl: result.fileUrl,
//         description: result.description,
//         fileName: file.name,
//         originalFileName: file.name,
//         isUploaded: true,
//       }

//       setMpiDocumentation((prev) => [...prev, newDoc])

//       toast({
//         title: "Success",
//         description: "Document uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("Document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingMpiDoc(false)
//     }
//   }

//   const removeMpiDocument = async (index: number) => {
//     const doc = mpiDocumentation[index]
//     if (doc.id && doc.isUploaded) {
//       try {
//         await MPIDocumentationAPI.deleteDocument(doc.id)
//         toast({
//           title: "Success",
//           description: "Document deleted successfully.",
//         })
//       } catch (error) {
//         console.error("Failed to delete document:", error)
//         toast({
//           title: "Error",
//           description: "Failed to delete document.",
//           variant: "destructive",
//         })
//         return
//       }
//     }
//     setMpiDocumentation((prev) => prev.filter((_, i) => i !== index))
//   }

//   useEffect(() => {
//     loadStations()
//     loadEnums()
//     loadChecklistData()
//     loadExistingIds()
//     loadServices() // Add this line
//   }, [])

//   useEffect(() => {
//     // Update selected stations when formData.selectedStationIds changes
//     const selected = availableStations.filter((station) => formData.selectedStationIds.includes(station.id))
//     setSelectedStations(selected)
//   }, [formData.selectedStationIds, availableStations])

//   const loadStations = async () => {
//     try {
//       setLoadingStations(true)
//       const stations = await StationAPI.getAllStations()
//       setAvailableStations(stations)
//     } catch (error) {
//       console.error("Failed to load stations:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load stations. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingStations(false)
//     }
//   }

//   const loadEnums = async () => {
//     try {
//       setLoadingEnums(true)
//       const enumsData = await MPIAPI.getEnums()
//       setEnums(enumsData)
//     } catch (error) {
//       console.error("Failed to load enums:", error)
//       toast({
//         title: "Warning",
//         description: "Failed to load form options.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingEnums(false)
//     }
//   }

//   const loadChecklistData = async () => {
//     try {
//       setLoadingAvailableChecklist(true)
//       // Load existing checklists from MPI - show ONLY REQUIRED items (like details page)
//       const existingChecklistSections: ChecklistSection[] = []
//       const existingItemDescriptions = new Set<string>()

//       if (mpi.checklists && mpi.checklists.length > 0) {
//         mpi.checklists.forEach((checklist, checklistIndex) => {
//           if (checklist.checklistItems && checklist.checklistItems.length > 0) {
//             // Filter to only show required items (exactly like details page)
//             const requiredItems = checklist.checklistItems.filter((item) => item.required === true)

//             if (requiredItems.length > 0) {
//               existingChecklistSections.push({
//                 id: `existing-section-${checklistIndex}`,
//                 name: checklist.name,
//                 description: `${checklist.name} - Existing required checklist items`,
//                 items: requiredItems.map((item, itemIndex) => {
//                   // Track this item as existing
//                   existingItemDescriptions.add(item.description.toLowerCase().trim())
//                   return {
//                     id: `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
//                     description: item.description,
//                     required: item.required,
//                     remarks: item.remarks,
//                     category: item.category || checklist.name,
//                     isActive: item.isActive,
//                     createdBy: item.createdBy,
//                     sectionId: `existing-section-${checklistIndex}`,
//                   }
//                 }),
//               })
//             }
//           }
//         })
//       }

//       setExistingChecklists(existingChecklistSections)

//       // Load available checklist template and filter out existing items
//       const template = await MPIAPI.getChecklistTemplate()
//       console.log("📦 Available checklist template loaded:", template)

//       if (template && Array.isArray(template)) {
//         const validSections = template
//           .filter(
//             (section) =>
//               section && typeof section === "object" && section.name && Array.isArray(section.checklistItems),
//           )
//           .map((section, sectionIndex) => {
//             // Filter out items that already exist in the MPI
//             const availableItems = (section.checklistItems || [])
//               .filter((item: any) => {
//                 const itemDescription = item.description?.toLowerCase().trim()
//                 return itemDescription && !existingItemDescriptions.has(itemDescription)
//               })
//               .map((item: any, itemIndex: number) => ({
//                 id: `available-${section.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
//                 description: item.description || "No description",
//                 required: false, // Default to No for available items
//                 remarks: "",
//                 category: item.category || section.name,
//                 isActive: item.isActive !== undefined ? item.isActive : true,
//                 createdBy: item.createdBy || "System",
//                 sectionId: `available-section-${sectionIndex}`,
//               }))

//             return availableItems.length > 0
//               ? {
//                   id: `available-section-${sectionIndex}`,
//                   name: section.name,
//                   description: `${section.name} quality control items`,
//                   items: availableItems,
//                 }
//               : null
//           })
//           .filter(Boolean)

//         setAvailableChecklistTemplate(validSections)
//       } else {
//         setAvailableChecklistTemplate([])
//       }
//     } catch (error) {
//       console.error("Failed to load checklist data:", error)
//       setAvailableChecklistTemplate([])
//       setExistingChecklists([])
//     } finally {
//       setLoadingAvailableChecklist(false)
//     }
//   }

//   const loadServices = async () => {
//     try {
//       setLoadingServices(true)
//       const fetchedServices = await ServiceAPI.getAll()
//       setServices(fetchedServices)

//       // Set selected service if one exists in the order form
//       if (orderFormData.selectedServiceId && fetchedServices.length > 0) {
//         const service = fetchedServices.find((s) => s.id === orderFormData.selectedServiceId)
//         setSelectedService(service || null)
//       }
//     } catch (error) {
//       console.error("Failed to fetch services:", error)
//       toast({
//         title: "Warning",
//         description: "Failed to load services. Please try again.",
//         variant: "destructive",
//       })
//       setServices([])
//     } finally {
//       setLoadingServices(false)
//     }
//   }

//   const handleChecklistItemChange = (itemId: string, field: "required" | "remarks", value: boolean | string) => {
//     setChecklistModifications((prev) => ({
//       ...prev,
//       [itemId]: {
//         ...prev[itemId],
//         [field]: value,
//       },
//     }))
//   }

//   const getChecklistItemValue = (itemId: string, field: "required" | "remarks", defaultValue: boolean | string) => {
//     return checklistModifications[itemId]?.[field] ?? defaultValue
//   }

//   const handleOrderFormChange = (field: string, value: string | boolean | string[]) => {
//     setOrderFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleServiceChange = (serviceId: string) => {
//     const service = services.find((s) => s.id === serviceId)
//     if (service) {
//       setSelectedService(service)
//       handleOrderFormChange("selectedServiceId", serviceId)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log("🔄 Starting form submission...")

//     // Validation - Reload existing IDs first
//     await loadExistingIds()

//     // Enhanced validation with better error messages
//     const jobIdError = validateJobId(formData.jobId)
//     const assemblyIdError = validateAssemblyId(formData.assemblyId)
//     const documentControlIdError = orderFormData.documentControlId
//       ? validateDocumentControlId(orderFormData.documentControlId)
//       : null

//     const validationErrors = []
//     if (jobIdError) validationErrors.push(`Job ID: ${jobIdError}`)
//     if (assemblyIdError) validationErrors.push(`Assembly ID: ${assemblyIdError}`)
//     if (documentControlIdError) validationErrors.push(`Document Control ID: ${documentControlIdError}`)

//     // Check for required fields
//     if (!formData.jobId.trim()) validationErrors.push("Job ID is required")
//     if (!formData.assemblyId.trim()) validationErrors.push("Assembly ID is required")

//     if (validationErrors.length > 0) {
//       toast({
//         title: "❌ Validation Failed",
//         description: (
//           <div className="space-y-2">
//             <p className="font-semibold">Please fix the following issues:</p>
//             <ul className="list-disc list-inside space-y-1">
//               {validationErrors.map((error, index) => (
//                 <li key={index} className="text-sm">
//                   {error}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ),
//         variant: "destructive",
//         duration: 10000,
//       })
//       setActiveTab("basic-info")
//       return
//     }

//     console.log("Selected stations:", formData.selectedStationIds)
//     console.log("Current specification values:", specificationValues)
//     console.log("Current checklist modifications:", checklistModifications)

//     // Prepare stations data - Send ALL selected stations with their specification values in the correct format
//     const stationsData = formData.selectedStationIds
//       .map((stationId) => {
//         const station = selectedStations.find((s) => s.id === stationId)
//         if (!station) return null

//         // Get specification values for this station in the format the backend expects
//         const stationSpecificationValues =
//           station.specifications?.map((spec) => {
//             const specValue = specificationValues[spec.id]
//             return {
//               specificationId: spec.id,
//               value: specValue?.value || "", // Send current value or empty string
//               ...(specValue?.unit && { unit: specValue.unit }),
//               ...(specValue?.fileUrl && { fileUrl: specValue.fileUrl }),
//             }
//           }) || []

//         // Include station notes in the update
//         const stationNotesArray = stationNotes[stationId]?.map((note) => note.content) || []

//         return {
//           id: station.id,
//           stationId: station.stationId,
//           stationName: station.stationName,
//           status: station.status,
//           description: station.description || "",
//           location: station.location || "",
//           operator: station.operator || "",
//           priority: station.priority || 1,
//           Note: stationNotesArray,
//           // Send specification values in the format the backend expects
//           specificationValues: stationSpecificationValues,
//         }
//       })
//       .filter(Boolean)

//     console.log("📤 Stations data being sent:", JSON.stringify(stationsData, null, 2))
//     console.log("🔧 Current specification values:", specificationValues)

//     // Prepare existing checklist updates with ACTUAL database IDs
//     const existingChecklistUpdates: any[] = []
//     if (mpi.checklists && mpi.checklists.length > 0) {
//       mpi.checklists.forEach((checklist) => {
//         const updatedItems: any[] = []
//         let hasChanges = false

//         if (checklist.checklistItems && checklist.checklistItems.length > 0) {
//           checklist.checklistItems.forEach((item, itemIndex) => {
//             const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
//             const modifications = checklistModifications[itemId]

//             if (modifications) {
//               // Check if there are actual changes
//               if (modifications.required !== item.required || modifications.remarks !== item.remarks) {
//                 hasChanges = true
//               }

//               updatedItems.push({
//                 id: item.id, // Use the actual database ID from the MPI
//                 description: item.description,
//                 required: modifications.required,
//                 remarks: modifications.remarks,
//                 category: item.category,
//                 createdBy: item.createdBy,
//                 isActive: item.isActive,
//               })
//             }
//           })
//         }

//         // Only include checklist if there are actual changes
//         if (hasChanges && updatedItems.length > 0) {
//           existingChecklistUpdates.push({
//             id: checklist.id, // Use the actual checklist database ID
//             name: checklist.name,
//             checklistItems: updatedItems,
//           })
//         }
//       })
//     }

//     // Prepare new checklists from available template
//     const newChecklists: any[] = []
//     availableChecklistTemplate.forEach((section) => {
//       const newItems: any[] = []

//       section.items.forEach((item) => {
//         const modifications = checklistModifications[item.id]
//         if (modifications && modifications.required) {
//           newItems.push({
//             description: item.description,
//             required: modifications.required,
//             remarks: modifications.remarks || "",
//             createdBy: item.createdBy || "System",
//             isActive: item.isActive !== undefined ? item.isActive : true,
//             category: item.category || section.name,
//           })
//         }
//       })

//       if (newItems.length > 0) {
//         newChecklists.push({
//           name: section.name,
//           checklistItems: newItems,
//         })
//       }
//     })

//     // Prepare complete submission data matching backend expectations
//     const submitData: any = {
//       jobId: formData.jobId,
//       assemblyId: formData.assemblyId,
//       customer: formData.customer || null,
//     }

//     // FIXED: Always include order forms for updates with proper structure
//     const orderFormSubmissionData = {
//       id: orderFormData.id || undefined, // Include ID if exists for update
//       OrderType: orderFormData.orderType,
//       distributionDate: orderFormData.distributionDate ? new Date(orderFormData.distributionDate).toISOString() : null,
//       requiredBy: orderFormData.requiredBy ? new Date(orderFormData.requiredBy).toISOString() : null,
//       internalOrderNumber: orderFormData.internalOrderNumber || null,
//       revision: orderFormData.revision || null,
//       otherAttachments: orderFormData.otherAttachments || null,
//       fileAction: orderFormData.fileAction,
//       markComplete: orderFormData.markComplete,
//       documentControlId: orderFormData.documentControlId || null,
//       // Add service ID mapping
//       ...(orderFormData.selectedServiceId && {
//         serviceIds: [orderFormData.selectedServiceId], // Convert single ID to array
//       }),
//     }

//     // Send as array to match backend expectation
//     submitData.orderForms = [orderFormSubmissionData]

//     console.log("📋 Order form data being sent:", JSON.stringify(submitData.orderForms, null, 2))

//     // Add stations with specifications if they exist
//     if (stationsData.length > 0) {
//       submitData.stations = stationsData
//     }

//     // Combine existing and new checklists for the backend
//     const allChecklists = [...existingChecklistUpdates, ...newChecklists]
//     if (allChecklists.length > 0) {
//       submitData.checklists = allChecklists
//     }

//     // Add instructions - always include for updates (use backend field name 'Instruction')
//     submitData.Instruction = instructions.filter((instruction) => instruction.trim() !== "")

//     // Add uploaded documents to submission data with both description and fileName
//     if (mpiDocumentation.length > 0) {
//       const uploadedDocs = mpiDocumentation
//         .filter((doc) => doc.isUploaded && doc.fileUrl)
//         .map((doc) => ({
//           id: doc.id,
//           fileUrl: doc.fileUrl,
//           description: doc.description,
//           fileName: doc.fileName, // Include fileName for backend
//           originalFileName: doc.originalFileName, // Include original filename
//         }))

//       if (uploadedDocs.length > 0) {
//         submitData.mpiDocs = uploadedDocs
//       }
//     }

//     console.log("📤 Submitting MPI update data:", JSON.stringify(submitData, null, 2))

//     try {
//       await onSubmit(submitData as UpdateMPIDto)
//       if (newChecklists.length > 0) {
//         toast({
//           title: "Success",
//           description: `MPI updated successfully with ${newChecklists.length} new checklist section(s) added.`,
//         })
//       } else {
//         toast({
//           title: "Success",
//           description: "MPI updated successfully.",
//         })
//       }
//     } catch (error: any) {
//       console.error("Form submission error:", error)
//       // Handle specific error types
//       if (error.message?.includes("Unique constraint failed")) {
//         if (error.message?.includes("documentControlId")) {
//           toast({
//             title: "🚫 Duplicate Document Control ID",
//             description: `Document Control ID "${orderFormData.documentControlId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         } else if (error.message?.includes("jobId")) {
//           toast({
//             title: "🚫 Duplicate Job ID",
//             description: `Job ID "${formData.jobId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         } else if (error.message?.includes("assemblyId")) {
//           toast({
//             title: "🚫 Duplicate Assembly ID",
//             description: `Assembly ID "${formData.assemblyId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         }
//       }

//       toast({
//         title: "Submission Error",
//         description: error.message || "Failed to update MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleStationSelectionChange = (stationIds: string[]) => {
//     setFormData((prev) => ({ ...prev, selectedStationIds: stationIds }))
//   }

//   const handleSpecificationValueChange = (specificationId: string, value: string, unit?: string) => {
//     console.log("🔧 Updating specification:", specificationId, "with value:", value, "unit:", unit)
//     setSpecificationValues((prev) => {
//       const currentSpec = prev[specificationId] || { specificationId, value: "", unit: undefined, fileUrl: undefined }
//       const updated = {
//         ...prev,
//         [specificationId]: {
//           ...currentSpec,
//           specificationId,
//           value,
//           unit: unit !== undefined ? unit : currentSpec.unit,
//         },
//       }
//       console.log("🔧 Updated specification values:", updated)
//       return updated
//     })
//   }

//   const handleFileUpload = async (specificationId: string, file: File, stationId: string, unit?: string) => {
//     console.log("📁 Starting file upload for spec:", specificationId, "station:", stationId)
//     setUploadingFiles((prev) => new Set(prev).add(specificationId))

//     try {
//       const result = await StationAPI.uploadStationSpecificationFile(file, specificationId, stationId, unit)
//       console.log("📁 File upload result:", result)

//       setSpecificationValues((prev) => {
//         const updated = {
//           ...prev,
//           [specificationId]: {
//             specificationId,
//             value: result.value || file.name,
//             fileUrl: result.fileUrl,
//             unit: unit || prev[specificationId]?.unit,
//           },
//         }
//         console.log("📁 Updated specification values after upload:", updated)
//         return updated
//       })

//       toast({
//         title: "Success",
//         description: "File uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("File upload error:", error)
//       toast({
//         title: "Error",
//         description: "Failed to upload file. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingFiles((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(specificationId)
//         return newSet
//       })
//     }
//   }

//   const renderSpecificationInput = (spec: any, stationId: string) => {
//     const specValue = specificationValues[spec.id]
//     const isUploading = uploadingFiles.has(spec.id)

//     // Only log if there's an issue or for debugging specific specs
//     if (!specValue && spec.required) {
//       console.log(`⚠️ Required spec ${spec.name} (${spec.id}) has no value`)
//     }

//     switch (spec.inputType) {
//       case "TEXT":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <Input
//               ref={(el) => {
//                 specificationRefs.current[spec.id] = el
//               }}
//               id={`spec-${spec.id}`}
//               value={specValue?.value || ""}
//               onChange={(e) => {
//                 setFocusedSpecificationId(spec.id)
//                 handleSpecificationValueChange(spec.id, e.target.value)
//               }}
//               onFocus={() => setFocusedSpecificationId(spec.id)}
//               onBlur={() => setFocusedSpecificationId(null)}
//               placeholder={`Enter ${spec.name.toLowerCase()}`}
//               className="h-10"
//             />
//           </div>
//         )

//       case "number":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <div className="flex gap-2">
//               <Input
//                 ref={(el) => {
//                   specificationRefs.current[spec.id] = el
//                 }}
//                 id={`spec-${spec.id}`}
//                 type="number"
//                 value={specValue?.value || ""}
//                 onChange={(e) => {
//                   setFocusedSpecificationId(spec.id)
//                   handleSpecificationValueChange(spec.id, e.target.value, specValue?.unit)
//                 }}
//                 onFocus={() => setFocusedSpecificationId(spec.id)}
//                 onBlur={() => setFocusedSpecificationId(null)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10 flex-1"
//               />
//               <Input
//                 placeholder="Unit"
//                 value={specValue?.unit || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
//                 className="h-10 w-20"
//               />
//             </div>
//           </div>
//         )

//       case "CHECKBOX":
//         return (
//           <div className="space-y-2">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id={`spec-${spec.id}`}
//                 checked={specValue?.value === "true"}
//                 onCheckedChange={(checked) => handleSpecificationValueChange(spec.id, checked ? "true" : "false")}
//               />
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//             </div>
//           </div>
//         )

//       case "DROPDOWN":
//         const suggestions = spec.suggestions || []
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <Select
//               value={specValue?.value || ""}
//               onValueChange={(value) => handleSpecificationValueChange(spec.id, value)}
//             >
//               <SelectTrigger className="h-10">
//                 <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
//               </SelectTrigger>
//               <SelectContent>
//                 {suggestions.map((suggestion: string, index: number) => (
//                   <SelectItem key={index} value={suggestion}>
//                     {suggestion}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )

//       case "FILE_UPLOAD":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <Input
//                   id={`spec-${spec.id}`}
//                   type="file"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0]
//                     if (file) {
//                       handleFileUpload(spec.id, file, stationId, specValue?.unit)
//                     }
//                   }}
//                   accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
//                   className="cursor-pointer flex-1"
//                   disabled={isUploading}
//                 />
//                 {isUploading && (
//                   <div className="flex items-center gap-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
//                     <span className="text-xs text-muted-foreground">Uploading...</span>
//                   </div>
//                 )}
//               </div>
//               <Input
//                 placeholder="Unit (optional)"
//                 value={specValue?.unit || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
//                 className="h-10 w-32"
//               />
//               {specValue?.fileUrl && (
//                 <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
//                   <FileText className="w-4 h-4 text-green-600" />
//                   <span className="text-sm text-green-800">File uploaded successfully</span>
//                   <a
//                     href={specValue.fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-xs text-blue-600 hover:underline"
//                   >
//                     View
//                   </a>
//                 </div>
//               )}
//               <p className="text-xs text-muted-foreground">
//                 Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
//               </p>
//             </div>
//           </div>
//         )

//       default:
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <Input
//               id={`spec-${spec.id}`}
//               value={specValue?.value || ""}
//               onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value)}
//               placeholder={`Enter ${spec.name.toLowerCase()}`}
//               className="h-10"
//             />
//           </div>
//         )
//     }
//   }

//   const renderStationDocuments = (stationId: string) => {
//     const documents = stationDocuments[stationId] || []

//     return (
//       <div className="space-y-4">
//         {/* Upload Section */}
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
//           <div className="space-y-4">
//             <h4 className="font-medium text-sm">Upload Station Document</h4>
//             <div className="grid grid-cols-1 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="station-doc-file">Select Files *</Label>
//                 <Input
//                   id="station-doc-file"
//                   type="file"
//                   accept="*/*"
//                   className="cursor-pointer"
//                   disabled={uploadingStationDoc}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="station-doc-description">Description</Label>
//                 <Input
//                   id="station-doc-description"
//                   placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                   disabled={uploadingStationDoc}
//                 />
//               </div>
//             </div>
//             <Button
//               type="button"
//               variant="outline"
//               disabled={uploadingStationDoc}
//               onClick={async () => {
//                 const fileInput = document.getElementById("station-doc-file") as HTMLInputElement
//                 const descInput = document.getElementById("station-doc-description") as HTMLInputElement
//                 const file = fileInput?.files?.[0]
//                 const description = descInput?.value?.trim() || ""

//                 if (!file) {
//                   toast({
//                     title: "Missing File",
//                     description: "Please select a file to upload.",
//                     variant: "destructive",
//                   })
//                   return
//                 }

//                 await handleStationDocumentUpload(file, description, file.name)
//                 fileInput.value = ""
//                 descInput.value = ""
//               }}
//               className="w-full"
//             >
//               {uploadingStationDoc ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                   Uploading File...
//                 </div>
//               ) : (
//                 <>
//                   <Upload className="w-4 h-4 mr-2" />
//                   Upload File
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Documents List */}
//         {documents.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No files available for this station.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 gap-4">
//               {documents.map((doc) => (
//                 <div key={doc.id} className="p-4 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start gap-3 flex-1">
//                       <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-medium text-sm text-gray-900 truncate">
//                           {doc.description || "Untitled Document"}
//                         </h4>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Uploaded: {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "Unknown date"}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 ml-4">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => window.open(doc.fileUrl, "_blank")}
//                         className="h-8 px-3"
//                       >
//                         <Eye className="w-3 h-3 mr-1" />
//                         View
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           const link = document.createElement("a")
//                           link.href = doc.fileUrl
//                           link.download = doc.description || "document"
//                           link.click()
//                         }}
//                         className="h-8 px-3"
//                       >
//                         <Download className="w-3 h-3 mr-1" />
//                         Download
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleDeleteStationDocument(stationId, doc.id)}
//                         className="h-8 px-3 text-green-600 hover:text-green-700"
//                       >
//                         <Trash2 className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const renderStationNotes = (stationId: string) => {
//     const notes = stationNotes[stationId] || []

//     return (
//       <div className="space-y-4">
//         {/* Add Note Section */}
//         <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
//             <Plus className="w-4 h-4" />
//             Add Station Note
//           </h4>
//           <div className="space-y-3">
//             <Textarea
//               value={newNoteContent}
//               onChange={(e) => setNewNoteContent(e.target.value)}
//               placeholder="Enter operational notes, safety instructions, or maintenance reminders..."
//               rows={3}
//               className="resize-none"
//             />
//             <Button
//               onClick={handleAddNote}
//               disabled={addingNote || !newNoteContent.trim()}
//               size="sm"
//               className="w-full"
//             >
//               {addingNote ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                   Adding Note...
//                 </div>
//               ) : (
//                 <>
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Note
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Notes List */}
//         {notes.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No notes available for this station.</p>
//             <p className="text-sm text-muted-foreground mt-1">
//               Add operational notes, safety instructions, or reminders above.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             <h4 className="font-medium text-sm flex items-center gap-2">
//               <StickyNote className="w-4 h-4" />
//               Station Notes ({notes.length})
//             </h4>
//             <div className="space-y-2">
//               {notes.map((note) => (
//                 <div key={note.id} className="p-3 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.content}</p>
//                       <p className="text-xs text-gray-500 mt-2">
//                         {note.createdAt ? new Date(note.createdAt).toLocaleString() : "Unknown date"}
//                       </p>
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => handleDeleteNote(stationId, note.id!)}
//                       className="ml-3 h-8 px-2 text-green-600 hover:text-green-700"
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const isFormValid = () => {
//     const jobIdError = validateJobId(formData.jobId)
//     const assemblyIdError = validateAssemblyId(formData.assemblyId)
//     const documentControlIdError = orderFormData.documentControlId
//       ? validateDocumentControlId(orderFormData.documentControlId)
//       : null

//     return !jobIdError && !assemblyIdError && !documentControlIdError
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between w-full">
//           <div>
//             <h1 className="text-3xl font-bold text-green-600">Edit MPI</h1>
//             <p className="text-muted-foreground">
//               Job ID: {mpi.jobId} • Assembly ID: {mpi.assemblyId}
//             </p>
//           </div>
//           <Button variant="outline" size="sm" onClick={onCancel}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
//         </div>

//         <Card className="border shadow-sm">
//           <CardContent className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-4">
//                   <TabsTrigger value="basic-info" className="flex items-center gap-2">
//                     <Info className="w-4 h-4" />
//                     Order Details
//                   </TabsTrigger>
//                   <TabsTrigger value="documentation" className="flex items-center gap-2">
//                     <FileText className="w-4 h-4" />
//                     Files
//                     {mpiDocumentation.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {mpiDocumentation.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="checklist" className="flex items-center gap-2">
//                     <ClipboardList className="w-4 h-4" />
//                     Checklist
//                     {existingChecklists.length + availableChecklistTemplate.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {existingChecklists.length + availableChecklistTemplate.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="instructions" className="flex items-center gap-2">
//                     <Factory className="w-4 h-4" />
//                     Instructions
//                     {selectedStations.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {selectedStations.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                 </TabsList>

//                 {/* Basic Information & Order Form Tab */}
//                 <TabsContent value="basic-info" className="space-y-6 mt-6">
//                   {/* MPI Basic Information */}
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="jobId">
//                             MPI ID *{checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="jobId"
//                             value={formData.jobId}
//                             onChange={(e) => handleChange("jobId", e.target.value)}
//                             placeholder="Enter job ID"
//                             required
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = validateJobId(formData.jobId)
//                             return error ? (
//                               <p className="text-xs text-green-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="assemblyId">
//                             Assembly ID *
//                             {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="assemblyId"
//                             value={formData.assemblyId}
//                             onChange={(e) => handleChange("assemblyId", e.target.value)}
//                             placeholder="Enter assembly ID"
//                             required
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = validateAssemblyId(formData.assemblyId)
//                             return error ? (
//                               <p className="text-xs text-green-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="customer">Customer</Label>
//                           <Input
//                             id="customer"
//                             value={formData.customer}
//                             onChange={(e) => handleChange("customer", e.target.value)}
//                             placeholder="Enter customer name"
//                             className="h-11"
//                           />
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   {/* Order Forms Section */}
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="internalOrderNumber">Internal Order Number</Label>
//                           <Input
//                             id="internalOrderNumber"
//                             value={orderFormData.internalOrderNumber}
//                             onChange={(e) => handleOrderFormChange("internalOrderNumber", e.target.value)}
//                             placeholder="Enter internal order number"
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="revision">Revision</Label>
//                           <Input
//                             id="revision"
//                             value={orderFormData.revision}
//                             onChange={(e) => handleOrderFormChange("revision", e.target.value)}
//                             placeholder="Enter revision number"
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="documentControlId">
//                             Document Control ID
//                             {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="documentControlId"
//                             value={orderFormData.documentControlId}
//                             onChange={(e) => handleOrderFormChange("documentControlId", e.target.value)}
//                             placeholder="Enter document control ID"
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = orderFormData.documentControlId
//                               ? validateDocumentControlId(orderFormData.documentControlId)
//                               : null
//                             return error ? (
//                               <p className="text-xs text-green-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="distributionDate">Distribution Date</Label>
//                           <Input
//                             id="distributionDate"
//                             type="date"
//                             value={orderFormData.distributionDate}
//                             onChange={(e) => handleOrderFormChange("distributionDate", e.target.value)}
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="requiredBy">Required By</Label>
//                           <Input
//                             id="requiredBy"
//                             type="date"
//                             value={orderFormData.requiredBy}
//                             onChange={(e) => handleOrderFormChange("requiredBy", e.target.value)}
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="serviceSelect">Select Service</Label>
//                           <div className="relative">
//                             <Select
//                               value={orderFormData.selectedServiceId || ""}
//                               onValueChange={handleServiceChange}
//                               disabled={loadingServices}
//                             >
//                               <SelectTrigger id="serviceSelect" className="h-11">
//                                 <SelectValue
//                                   placeholder={
//                                     loadingServices
//                                       ? "Loading services..."
//                                       : services.length === 0
//                                         ? "No services available"
//                                         : "Select a service"
//                                   }
//                                 />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {services.map((service) => (
//                                   <SelectItem key={service.id} value={service.id}>
//                                     <div className="flex flex-col">
//                                       <span className="font-medium">{service.name}</span>
//                                       {service.description && (
//                                         <span className="text-xs text-gray-500 truncate max-w-[200px]">
//                                           {service.description}
//                                         </span>
//                                       )}
//                                     </div>
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                             {loadingServices && (
//                               <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
//                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
//                               </div>
//                             )}
//                           </div>
//                           {services.length === 0 && !loadingServices && (
//                             <p className="text-sm text-gray-500">
//                               No services available. Please create services first.
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
            
//                 </TabsContent>

//                 {/* Documentation Tab */}
//                 <TabsContent value="documentation" className="space-y-6 mt-6">
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="space-y-4">
//                         {/* Upload Section */}
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
//                           <div className="space-y-4">
//                             <div className="grid grid-cols-1 gap-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor="mpi-doc-file">Select Files *</Label>
//                                 <Input
//                                   id="mpi-doc-file"
//                                   type="file"
//                                   accept="*/*"
//                                   className="cursor-pointer"
//                                   disabled={uploadingMpiDoc}
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor="mpi-doc-description">Description (Optional)</Label>
//                                 <Input
//                                   id="mpi-doc-description"
//                                   placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                                   disabled={uploadingMpiDoc}
//                                 />
//                               </div>
//                             </div>
//                             <Button
//                               type="button"
//                               variant="outline"
//                               disabled={uploadingMpiDoc}
//                               onClick={async () => {
//                                 const fileInput = document.getElementById("mpi-doc-file") as HTMLInputElement
//                                 const descInput = document.getElementById("mpi-doc-description") as HTMLInputElement
//                                 const file = fileInput?.files?.[0]
//                                 const description = descInput?.value?.trim() || ""

//                                 if (!file) {
//                                   toast({
//                                     title: "Missing File",
//                                     description: "Please select a file to upload.",
//                                     variant: "destructive",
//                                   })
//                                   return
//                                 }

//                                 await handleMpiDocumentUpload(file, description)
//                                 fileInput.value = ""
//                                 descInput.value = ""
//                               }}
//                               className="w-full bg-transparent"
//                             >
//                               {uploadingMpiDoc ? (
//                                 <div className="flex items-center gap-2">
//                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                   Uploading File...
//                                 </div>
//                               ) : (
//                                 <>
//                                   <Upload className="w-4 h-4 mr-2" />
//                                   Upload File
//                                 </>
//                               )}
//                             </Button>
//                           </div>
//                         </div>

//                         {/* Uploaded Documents List */}
//                         {mpiDocumentation.length > 0 && (
//                           <div className="space-y-3">
//                             <h4 className="font-medium text-sm">Files</h4>
//                             <div className="space-y-2">
//                               {mpiDocumentation.map((doc, index) => (
//                                 <div
//                                   key={index}
//                                   className="flex items-start justify-between p-4 bg-gray-50 rounded border"
//                                 >
//                                   <div className="flex items-start gap-3 flex-1">
//                                     <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                                     <div className="flex-1 min-w-0">
//                                       <p className="text-sm font-medium text-gray-900 truncate">
//                                         {doc.description && doc.description !== doc.fileName
//                                           ? doc.description
//                                           : doc.fileName}
//                                       </p>
//                                       <div className="mt-1 space-y-1">
//                                         <p className="text-xs text-gray-600">
//                                           <span className="font-medium">Filename:</span> {doc.fileName}
//                                         </p>
//                                         {doc.description && doc.description !== doc.fileName && (
//                                           <p className="text-xs text-gray-500">
//                                             <span className="font-medium">Description:</span> {doc.description}
//                                           </p>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <div className="flex items-center gap-2 ml-4">
//                                     <Button
//                                       type="button"
//                                       size="sm"
//                                       variant="outline"
//                                       onClick={() => removeMpiDocument(index)}
//                                       className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
//                                     >
//                                       Remove
//                                     </Button>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Checklist Tab */}
//                 <TabsContent value="checklist" className="space-y-6 mt-6">
//                   <Card>
//                     <CardContent className="mt-5">
//                       {loadingAvailableChecklist ? (
//                         <div className="flex items-center justify-center py-8">
//                           <div className="text-center">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
//                             <p className="mt-2 text-sm text-muted-foreground">Loading checklist data...</p>
//                           </div>
//                         </div>
//                       ) : existingChecklists.length === 0 && availableChecklistTemplate.length === 0 ? (
//                         <p className="text-muted-foreground text-center py-4">No checklist data available.</p>
//                       ) : (
//                         <div className="space-y-6">
//                           {/* Existing Checklists */}
//                           {existingChecklists.length > 0 ? (
//                             <div>
//                               <h3 className="text-lg font-semibold mb-4 text-green-800">Existing Required Checklists</h3>
//                               <Accordion type="multiple" className="w-full">
//                                 {existingChecklists.map((section) => (
//                                   <AccordionItem key={section.id} value={section.id}>
//                                     <AccordionTrigger className="text-left">
//                                       <div className="flex items-center gap-3">
//                                         <h4 className="font-medium">{section.name}</h4>
//                                       </div>
//                                     </AccordionTrigger>
//                                     <AccordionContent>
//                                       <div className="space-y-4">
//                                         <Table>
//                                           <TableHeader>
//                                             <TableRow>
//                                               <TableHead>Description</TableHead>
//                                               <TableHead>Required</TableHead>
//                                               <TableHead>Remarks</TableHead>
//                                             </TableRow>
//                                           </TableHeader>
//                                           <TableBody>
//                                             {(section.items || []).map((item) => (
//                                               <TableRow key={item.id}>
//                                                 <TableCell className="font-medium">{item.description}</TableCell>
//                                                 <TableCell>
//                                                   <Select
//                                                     value={
//                                                       getChecklistItemValue(item.id, "required", item.required)
//                                                         ? "yes"
//                                                         : "no"
//                                                     }
//                                                     onValueChange={(value) =>
//                                                       handleChecklistItemChange(item.id, "required", value === "yes")
//                                                     }
//                                                   >
//                                                     <SelectTrigger className="w-20">
//                                                       <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                       <SelectItem value="yes">Yes</SelectItem>
//                                                       <SelectItem value="no">No</SelectItem>
//                                                     </SelectContent>
//                                                   </Select>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                   <Input
//                                                     value={
//                                                       getChecklistItemValue(item.id, "remarks", item.remarks) as string
//                                                     }
//                                                     onChange={(e) =>
//                                                       handleChecklistItemChange(item.id, "remarks", e.target.value)
//                                                     }
//                                                     placeholder="Enter remarks (optional)"
//                                                     className="min-w-[200px]"
//                                                   />
//                                                 </TableCell>
//                                               </TableRow>
//                                             ))}
//                                           </TableBody>
//                                         </Table>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           ) : (
//                             <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                               <h3 className="text-lg font-semibold mb-2 text-blue-800">Existing Checklists</h3>
//                               <p className="text-sm text-blue-700">
//                                 No checklist items have been created for this MPI yet.
//                               </p>
//                             </div>
//                           )}

//                           {/* Available Checklist Template */}
//                           {availableChecklistTemplate.length > 0 && (
//                             <div>
//                               <h3 className="text-lg font-semibold mb-4 text-green-800">Available Checklist Items</h3>
//                               <Accordion type="multiple" className="w-full">
//                                 {availableChecklistTemplate.map((section) => (
//                                   <AccordionItem key={section.id} value={section.id}>
//                                     <AccordionTrigger className="text-left">
//                                       <div className="flex items-center gap-3">
//                                         <h4 className="font-medium">{section.name}</h4>
//                                       </div>
//                                     </AccordionTrigger>
//                                     <AccordionContent>
//                                       <div className="space-y-4">
//                                         <Table>
//                                           <TableHeader>
//                                             <TableRow>
//                                               <TableHead>Description</TableHead>
//                                               <TableHead>Required</TableHead>
//                                               <TableHead>Remarks</TableHead>
//                                             </TableRow>
//                                           </TableHeader>
//                                           <TableBody>
//                                             {(section.items || []).map((item) => (
//                                               <TableRow key={item.id}>
//                                                 <TableCell className="font-medium">{item.description}</TableCell>
//                                                 <TableCell>
//                                                   <Select
//                                                     value={
//                                                       getChecklistItemValue(item.id, "required", item.required)
//                                                         ? "yes"
//                                                         : "no"
//                                                     }
//                                                     onValueChange={(value) =>
//                                                       handleChecklistItemChange(item.id, "required", value === "yes")
//                                                     }
//                                                   >
//                                                     <SelectTrigger className="w-20">
//                                                       <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                       <SelectItem value="yes">Yes</SelectItem>
//                                                       <SelectItem value="no">No</SelectItem>
//                                                     </SelectContent>
//                                                   </Select>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                   <Input
//                                                     value={
//                                                       getChecklistItemValue(item.id, "remarks", item.remarks) as string
//                                                     }
//                                                     onChange={(e) =>
//                                                       handleChecklistItemChange(item.id, "remarks", e.target.value)
//                                                     }
//                                                     placeholder="Enter remarks (optional)"
//                                                     className="min-w-[200px]"
//                                                   />
//                                                 </TableCell>
//                                               </TableRow>
//                                             ))}
//                                           </TableBody>
//                                         </Table>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Instructions Tab */}
//                 <TabsContent value="instructions" className="space-y-6 mt-6">
//                   <InstructionsTab
//                     instructions={instructions}
//                     onAddInstruction={handleAddInstruction}
//                     onInstructionChange={handleInstructionChange}
//                     onRemoveInstruction={handleRemoveInstruction}
//                     availableStations={availableStations}
//                     formData={formData}
//                     loadingStations={loadingStations}
//                     activeStationId={activeStationId}
//                     setActiveStationId={setActiveStationId}
//                     stationViewMode={stationViewMode}
//                     setStationViewMode={setStationViewMode}
//                     handleStationSelectionChange={handleStationSelectionChange}
//                     selectedStations={selectedStations}
//                     stationNotes={stationNotes}
//                     stationDocuments={stationDocuments}
//                     renderSpecificationInput={renderSpecificationInput}
//                     renderStationDocuments={renderStationDocuments}
//                     renderStationNotes={renderStationNotes}
//                     focusedInstructionIndex={focusedInstructionIndex}
//                     setFocusedInstructionIndex={setFocusedInstructionIndex}
//                     instructionRefs={instructionRefs}
//                   />
//                 </TabsContent>
//               </Tabs>

//               {/* Form Actions */}
//               <div className="flex justify-end gap-4">
//                 <Button variant="outline" onClick={onCancel}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isLoading || !isFormValid()}>
//                   {isLoading ? (
//                     <div className="flex items-center gap-2 animate-pulse">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                       <span>Updating...</span>
//                     </div>
//                   ) : (
//                     <>Update MPI</>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }



// "use client"

// import React from "react"

// import type { FunctionComponent } from "react"
// import { useState, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   ArrowLeft,
//   Factory,
//   Info,
//   ClipboardList,
//   FileText,
//   Download,
//   Eye,
//   StickyNote,
//   Plus,
//   Trash2,
//   X,
//   Upload,
//   AlertCircle,
// } from "lucide-react"
// import type { MPI, UpdateMPIDto } from "./types"
// import { StationAPI } from "../stations/station-api"
// import type { Station } from "../stations/types"
// import { useToast } from "@/hooks/use-toast"
// import { MPIAPI } from "./mpi-api"
// import { MPIDocumentationAPI } from "./mpi-document-api"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"
// import { API_BASE_URL } from "@/lib/constants"
// import { ServiceAPI } from "../services/service-api"
// import type { Service } from "../services/types"

// // Enhanced InstructionsTab component with proper focus management and layout matching create mode
// const InstructionsTab: FunctionComponent<{
//   instructions: string[]
//   onAddInstruction: () => void
//   onInstructionChange: (index: number, value: string) => void
//   onRemoveInstruction: (index: number) => void
//   availableStations: Station[]
//   formData: any
//   loadingStations: boolean
//   activeStationId: string | null
//   setActiveStationId: (id: string | null) => void
//   stationViewMode: "specifications" | "documents" | "notes"
//   setStationViewMode: (mode: "specifications" | "documents" | "notes") => void
//   handleStationSelectionChange: (stationIds: string[]) => void
//   selectedStations: Station[]
//   stationNotes: Record<string, StationNote[]>
//   stationDocuments: Record<string, StationDocument[]>
//   renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
//   renderStationDocuments: (stationId: string) => React.ReactNode
//   renderStationNotes: (stationId: string) => React.ReactNode
//   focusedInstructionIndex: number | null
//   setFocusedInstructionIndex: (index: number | null) => void
//   instructionRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
// }> = React.memo(
//   ({
//     instructions,
//     onAddInstruction,
//     onInstructionChange,
//     onRemoveInstruction,
//     availableStations,
//     formData,
//     loadingStations,
//     activeStationId,
//     setActiveStationId,
//     stationViewMode,
//     setStationViewMode,
//     handleStationSelectionChange,
//     selectedStations,
//     stationNotes,
//     stationDocuments,
//     renderSpecificationInput,
//     renderStationDocuments,
//     renderStationNotes,
//     focusedInstructionIndex,
//     setFocusedInstructionIndex,
//     instructionRefs,
//   }) => {
//     return (
//       <div className="space-y-6">
//         {/* Stations Section */}
//         <Card>
//           <CardContent className="space-y-6 mt-5">
//             {loadingStations ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
//                   <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
//                 </div>
//               </div>
//             ) : availableStations.length === 0 ? (
//               <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
//               </div>
//             ) : (
//               <div className="flex gap-6 min-h-[600px]">
//                 {/* Left Sidebar - Station List */}
//                 <div className="w-1/4 border rounded-lg bg-gray-50">
//                   <div className="p-3 border-b bg-white rounded-t-lg">
//                     <h4 className="font-medium text-base">Stations</h4>
//                     <p className="text-xs text-muted-foreground">
//                       {formData.selectedStationIds.length > 0
//                         ? `${formData.selectedStationIds.length} selected`
//                         : "Click to select multiple"}
//                     </p>
//                   </div>
//                   <div className="p-2 overflow-y-auto h-[530px]">
//                     <div className="space-y-1">
//                       {availableStations.map((station) => {
//                         const noteCount = stationNotes[station.id]?.length || 0
//                         const docCount = stationDocuments[station.id]?.length || 0
//                         const isSelected = formData.selectedStationIds.includes(station.id)

//                         return (
//                           <div
//                             key={station.id}
//                             className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
//                               isSelected
//                                 ? "bg-blue-100 text-blue-900 border-blue-300"
//                                 : "bg-white hover:bg-gray-100 border-transparent"
//                             } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
//                             onClick={() => {
//                               setActiveStationId(station.id)
//                               if (isSelected) {
//                                 handleStationSelectionChange(
//                                   formData.selectedStationIds.filter((id: string) => id !== station.id),
//                                 )
//                               } else {
//                                 handleStationSelectionChange([...formData.selectedStationIds, station.id])
//                               }
//                             }}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="truncate">{station.stationName}</span>
//                               <div className="flex gap-1">
//                                 {noteCount > 0 && (
//                                   <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
//                                     {noteCount}N
//                                   </Badge>
//                                 )}
//                                 {docCount > 0 && (
//                                   <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
//                                     {docCount}D
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Panel - Station Details */}
//                 <div className="flex-1 border rounded-lg bg-gray-50">
//                   {!activeStationId ? (
//                     <div className="flex items-center justify-center h-full">
//                       <div className="text-center">
//                         <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <h4 className="font-medium text-gray-600 mb-2">No Station Selected</h4>
//                         <p className="text-sm text-muted-foreground">
//                           Select a station from the left sidebar to view its details
//                           {formData.selectedStationIds.length > 0 && (
//                             <span className="block mt-2 text-blue-600 font-medium">
//                               {formData.selectedStationIds.length} station
//                               {formData.selectedStationIds.length > 1 ? "s" : ""} selected for MPI
//                             </span>
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="h-full flex flex-col">
//                       <div className="p-4 border-b bg-white rounded-t-lg">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <Factory className="w-5 h-5 text-purple-600" />
//                             <div>
//                               <h4 className="font-medium text-lg">
//                                 {availableStations.find((s) => s.id === activeStationId)?.stationName}
//                               </h4>
//                               <p className="text-sm text-muted-foreground">Station Details</p>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "specifications" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("specifications")}
//                             >
//                               Specifications
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "documents" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("documents")}
//                             >
//                               Files
//                               {stationDocuments[activeStationId]?.length > 0 && (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {stationDocuments[activeStationId].length}
//                                 </Badge>
//                               )}
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant={stationViewMode === "notes" ? "default" : "outline"}
//                               onClick={() => setStationViewMode("notes")}
//                             >
//                               Notes
//                               {stationNotes[activeStationId]?.length > 0 && (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {stationNotes[activeStationId].length}
//                                 </Badge>
//                               )}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex-1 overflow-auto p-4">
//                         {stationViewMode === "specifications" && (
//                           <div>
//                             {(() => {
//                               const station = availableStations.find((s) => s.id === activeStationId)
//                               if (!station) return null

//                               if (!station.specifications || station.specifications.length === 0) {
//                                 return (
//                                   <div className="text-center py-6">
//                                     <p className="text-muted-foreground">
//                                       No specifications available for this station.
//                                     </p>
//                                   </div>
//                                 )
//                               }

//                               return (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   {station.specifications.map((spec) => (
//                                     <div key={spec.id} className="space-y-3 p-3 bg-white rounded border">
//                                       {renderSpecificationInput(spec, station.id)}
//                                     </div>
//                                   ))}
//                                 </div>
//                               )
//                             })()}
//                           </div>
//                         )}
//                         {stationViewMode === "documents" && renderStationDocuments(activeStationId)}
//                         {stationViewMode === "notes" && renderStationNotes(activeStationId)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Selected Station Summary */}
//             {formData.selectedStationIds.length > 0 && (
//               <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <h4 className="font-medium text-blue-800 mb-3">Selected Stations</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedStations.map((station) => (
//                     <Badge key={station.id} variant="outline" className="bg-white">
//                       {station.stationName}
//                       {station.specifications && station.specifications.length > 0 && (
//                         <span className="ml-1 text-xs">({station.specifications.length} specs)</span>
//                       )}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Instructions Section - Now positioned below stations section like in create mode */}
//         <Card>
//           <CardContent className="mt-5">
//             <div className="space-y-4">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h4 className="text-lg font-semibold text-green-800">General Instructions</h4>
//                   <p className="text-sm text-muted-foreground">
//                     Add general safety and operational instructions for this MPI
//                   </p>
//                 </div>
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="outline"
//                   onClick={() => {
//                     onAddInstruction()
//                     // Focus the new instruction input after it's added
//                     setTimeout(() => {
//                       setFocusedInstructionIndex(instructions.length)
//                     }, 0)
//                   }}
//                   className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Instruction
//                 </Button>
//               </div>
//               {instructions.length === 0 ? (
//                 <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                   <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm text-muted-foreground">No instructions added yet</p>
//                   <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {instructions.map((instruction, index) => (
//                     <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
//                       <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <Input
//                           ref={(el) => {
//                             instructionRefs.current[index] = el
//                           }}
//                           value={instruction}
//                           onChange={(e) => {
//                             setFocusedInstructionIndex(index)
//                             onInstructionChange(index, e.target.value)
//                           }}
//                           onFocus={() => setFocusedInstructionIndex(index)}
//                           onBlur={() => setFocusedInstructionIndex(null)}
//                           placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
//                           className="w-full"
//                         />
//                       </div>
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="ghost"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           onRemoveInstruction(index)
//                           // Clear focus tracking when removing instruction
//                           setFocusedInstructionIndex(null)
//                         }}
//                         className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-shrink-0"
//                       >
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   },
// )

// interface MPIEditProps {
//   mpi: MPI
//   onSubmit: (data: UpdateMPIDto) => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
// }

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   fileUrl?: string
//   unit?: string
// }

// interface ChecklistSection {
//   id: string
//   name: string
//   description: string
//   items: ChecklistItem[]
// }

// interface ChecklistItem {
//   id: string
//   description: string
//   required: boolean
//   remarks: string
//   category?: string
//   isActive: boolean
//   createdBy: string
//   sectionId: string
// }

// interface MPIDocumentation {
//   id?: string
//   file?: File
//   fileUrl?: string
//   description: string
//   fileName: string
//   originalFileName?: string
//   isUploaded?: boolean
// }

// interface StationNote {
//   id?: string
//   content: string
//   createdAt?: string
//   updatedAt?: string
// }

// interface StationDocument {
//   id: string
//   fileUrl: string
//   description: string
//   stationId: string
//   mpiId?: string
//   createdAt: string
//   updatedAt: string
// }

// // Helper function to safely convert order type to array
// const normalizeOrderType = (orderType: any): string[] => {
//   if (!orderType) return []
//   if (Array.isArray(orderType)) return orderType.filter((type) => typeof type === "string")
//   if (typeof orderType === "string") return [orderType]
//   return []
// }

// // Helper function to safely convert file action to array
// const normalizeFileAction = (fileAction: any): string[] => {
//   if (!fileAction) return []
//   if (Array.isArray(fileAction)) return fileAction.filter((action) => typeof action === "string")
//   if (typeof fileAction === "string") return [fileAction]
//   return []
// }

// export function MPIEdit({ mpi, onSubmit, onCancel, isLoading }: MPIEditProps) {
//   const [activeTab, setActiveTab] = useState("basic-info")
//   const [formData, setFormData] = useState({
//     jobId: mpi.jobId || "",
//     assemblyId: mpi.assemblyId || "",
//     customer: mpi.customer || "",
//     selectedStationIds: mpi.stations?.map((s) => s.id) || [],
//   })

//   // Order Form State - Initialize with existing data
//   const [orderFormData, setOrderFormData] = useState({
//     id: mpi.orderForms?.[0]?.id || "",
//     orderType: normalizeOrderType(mpi.orderForms?.[0]?.orderType),
//     distributionDate: mpi.orderForms?.[0]?.distributionDate
//       ? new Date(mpi.orderForms[0].distributionDate).toISOString().split("T")[0]
//       : "",
//     requiredBy: mpi.orderForms?.[0]?.requiredBy
//       ? new Date(mpi.orderForms[0].requiredBy).toISOString().split("T")[0]
//       : "",
//     internalOrderNumber: mpi.orderForms?.[0]?.internalOrderNumber || "",
//     revision: mpi.orderForms?.[0]?.revision || "",
//     otherAttachments: mpi.orderForms?.[0]?.otherAttachments || "",
//     fileAction: normalizeFileAction(mpi.orderForms?.[0]?.fileAction),
//     markComplete: mpi.orderForms?.[0]?.markComplete || false,
//     documentControlId: mpi.orderForms?.[0]?.documentControlId || "",
//     selectedServiceId: mpi.orderForms?.[0]?.services?.[0]?.id || "",
//   })

//   // Instructions state - Initialize with existing data
//   const [instructions, setInstructions] = useState<string[]>(mpi.Instruction || [])

//   // Add focus management for instruction inputs
//   const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
//   const instructionRefs = useRef<(HTMLInputElement | null)[]>([])

//   // Add these state variables after the instruction focus management states
//   const [focusedSpecificationId, setFocusedSpecificationId] = useState<string | null>(null)
//   const specificationRefs = useRef<Record<string, HTMLInputElement | null>>({})

//   // Service state
//   const [services, setServices] = useState<Service[]>([])
//   const [loadingServices, setLoadingServices] = useState(false)
//   const [selectedService, setSelectedService] = useState<Service | null>(null)

//   // Enums state
//   const [enums, setEnums] = useState<any>({})
//   const [loadingEnums, setLoadingEnums] = useState(false)

//   // Checklist template and existing checklist state
//   const [availableChecklistTemplate, setAvailableChecklistTemplate] = useState<ChecklistSection[]>([])
//   const [existingChecklists, setExistingChecklists] = useState<ChecklistSection[]>([])
//   const [loadingAvailableChecklist, setLoadingAvailableChecklist] = useState(false)

//   // Specification values state - Initialize with existing values
//   const [specificationValues, setSpecificationValues] = useState<Record<string, SpecificationValue>>(() => {
//     const initialValues: Record<string, SpecificationValue> = {}
//     console.log("🔍 Initializing specification values from MPI data:", mpi)

//     mpi.stations?.forEach((station) => {
//       console.log(`📍 Processing station: ${station.stationName} (${station.id})`)
//       station.specifications?.forEach((spec) => {
//         console.log(`🔧 Processing spec: ${spec.name} (${spec.id})`)
//         // Look for existing values in multiple places
//         let existingValue = null

//         // Method 1: Check stationSpecifications array
//         if (spec.stationSpecifications && spec.stationSpecifications.length > 0) {
//           existingValue = spec.stationSpecifications.find((ss) => ss.stationId === station.id)
//           console.log(`📋 Found in stationSpecifications:`, existingValue)
//         }

//         // Method 2: Check if there's a direct value on the spec
//         if (!existingValue && spec.value) {
//           existingValue = { value: spec.value, unit: spec.unit }
//           console.log(`📋 Found direct value on spec:`, existingValue)
//         }

//         // Method 3: Check station's specificationValues if it exists
//         if (!existingValue && station.specificationValues) {
//           const stationSpecValue = station.specificationValues.find((sv: any) => sv.specificationId === spec.id)
//           if (stationSpecValue) {
//             existingValue = { value: stationSpecValue.value, unit: stationSpecValue.unit }
//             console.log(`📋 Found in station specificationValues:`, existingValue)
//           }
//         }

//         if (existingValue && existingValue.value) {
//           initialValues[spec.id] = {
//             specificationId: spec.id,
//             value: existingValue.value,
//             unit: existingValue.unit || undefined,
//             fileUrl: existingValue.fileUrl || undefined,
//           }
//           console.log(`✅ Initialized spec ${spec.id} with value:`, initialValues[spec.id])
//         } else {
//           // Initialize with empty value for specs without existing data
//           initialValues[spec.id] = {
//             specificationId: spec.id,
//             value: "",
//             unit: undefined,
//             fileUrl: undefined,
//           }
//           console.log(`🆕 Initialized spec ${spec.id} with empty value`)
//         }
//       })
//     })

//     console.log("🎯 Final initial specification values:", initialValues)
//     return initialValues
//   })

//   const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())

//   // MPI Documentation State - Enhanced with proper filename handling
//   const [mpiDocumentation, setMpiDocumentation] = useState<MPIDocumentation[]>(() => {
//     // Initialize with existing MPI documents
//     return (
//       mpi.mpiDocs?.map((doc) => ({
//         id: doc.id,
//         fileUrl: doc.fileUrl,
//         description: doc.description,
//         fileName: doc.fileName || doc.description, // Use fileName if available, fallback to description
//         originalFileName: doc.originalFileName || doc.fileName || doc.description,
//         isUploaded: true,
//       })) || []
//     )
//   })

//   const [uploadingMpiDoc, setUploadingMpiDoc] = useState(false)

//   // Checklist modifications state - Initialize with existing checklist data
//   const [checklistModifications, setChecklistModifications] = useState<
//     Record<string, { required: boolean; remarks: string }>
//   >(() => {
//     const initialModifications: Record<string, { required: boolean; remarks: string }> = {}
//     // Initialize with existing checklist data
//     mpi.checklists?.forEach((checklist) => {
//       checklist.checklistItems?.forEach((item, itemIndex) => {
//         const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
//         initialModifications[itemId] = {
//           required: item.required,
//           remarks: item.remarks,
//         }
//       })
//     })
//     console.log("Initial checklist modifications:", initialModifications)
//     return initialModifications
//   })

//   const [availableStations, setAvailableStations] = useState<Station[]>([])
//   const [loadingStations, setLoadingStations] = useState(false)
//   const [selectedStations, setSelectedStations] = useState<Station[]>([])

//   // Station view state for instructions tab
//   const [activeStationId, setActiveStationId] = useState<string | null>(null)
//   const [stationViewMode, setStationViewMode] = useState<"specifications" | "documents" | "notes">("specifications")

//   // Station notes state
//   const [stationNotes, setStationNotes] = useState<Record<string, StationNote[]>>({})
//   const [loadingNotes, setLoadingNotes] = useState<Set<string>>(new Set())
//   const [newNoteContent, setNewNoteContent] = useState("")
//   const [addingNote, setAddingNote] = useState(false)

//   // Station documents state
//   const [stationDocuments, setStationDocuments] = useState<Record<string, StationDocument[]>>({})
//   const [loadingDocuments, setLoadingDocuments] = useState<Set<string>>(new Set())
//   const [uploadingStationDoc, setUploadingStationDoc] = useState(false)

//   // Validation state
//   const [existingJobIds, setExistingJobIds] = useState<string[]>([])
//   const [existingAssemblyIds, setExistingAssemblyIds] = useState<string[]>([])
//   const [existingDocumentControlIds, setExistingDocumentControlIds] = useState<string[]>([])
//   const [checkingIds, setCheckingIds] = useState(false)

//   const { toast } = useToast()

//   // Initialize station notes from MPI data
//   // Initialize station notes from MPI data
//   // Initialize station notes from MPI data - ENHANCED
//   useEffect(() => {
//     const initialNotes: Record<string, StationNote[]> = {}
//     console.log("🔍 Initializing station notes from MPI data:", mpi)

//     if (mpi.stations && Array.isArray(mpi.stations)) {
//       mpi.stations.forEach((station) => {
//         console.log(`📍 Processing station notes for: ${station.stationName} (${station.id})`)
//         let stationNotesArray: StationNote[] = []

//         // Check multiple possible locations for notes in the station data
//         if (station.Note) {
//           if (Array.isArray(station.Note)) {
//             // Handle array of notes
//             stationNotesArray = station.Note.filter(
//               (note) => note && typeof note === "string" && note.trim() !== "",
//             ).map((note, index) => ({
//               id: `note-${station.id}-${index}-${Date.now()}`,
//               content: note.trim(),
//               createdAt: new Date().toISOString(),
//             }))
//             console.log(`📝 Found Note array for station ${station.id}:`, stationNotesArray)
//           } else if (typeof station.Note === "string" && station.Note.trim() !== "") {
//             // Handle single note string
//             stationNotesArray = [
//               {
//                 id: `note-${station.id}-0-${Date.now()}`,
//                 content: station.Note.trim(),
//                 createdAt: new Date().toISOString(),
//               },
//             ]
//             console.log(`📝 Found single Note for station ${station.id}:`, stationNotesArray)
//           }
//         }

//         // Also check for 'notes' field (alternative naming)
//         if (stationNotesArray.length === 0 && station.notes && Array.isArray(station.notes)) {
//           stationNotesArray = station.notes
//             .filter((note) => note && (typeof note === "string" || (note.content && note.content.trim())))
//             .map((note, index) => ({
//               id: note.id || `note-${station.id}-${index}-${Date.now()}`,
//               content: typeof note === "string" ? note : note.content,
//               createdAt: note.createdAt || new Date().toISOString(),
//             }))
//           console.log(`📝 Found notes array for station ${station.id}:`, stationNotesArray)
//         }

//         initialNotes[station.id] = stationNotesArray
//         console.log(`✅ Initialized ${stationNotesArray.length} notes for station ${station.id}`)
//       })
//     }

//     console.log("🎯 Final initial station notes:", initialNotes)
//     setStationNotes(initialNotes)
//   }, [mpi.stations])

//   // Initialize station documents from MPI data
//   // Initialize station documents from MPI data - ENHANCED
//   useEffect(() => {
//     const initialDocs: Record<string, StationDocument[]> = {}
//     console.log("🔍 Initializing station documents from MPI data:", mpi)

//     if (mpi.stations && Array.isArray(mpi.stations)) {
//       mpi.stations.forEach((station) => {
//         console.log(`📍 Processing station documents for: ${station.stationName} (${station.id})`)
//         let stationDocsArray: StationDocument[] = []

//         // Check multiple possible locations for documents in the station data
//         const documentSources = [
//           station.documentations,
//           station.documents,
//           station.stationDocuments,
//           station.stationMpiDocs,
//         ]

//         for (const docSource of documentSources) {
//           if (docSource && Array.isArray(docSource) && docSource.length > 0) {
//             stationDocsArray = docSource
//               .filter((doc) => doc && (doc.fileUrl || doc.url))
//               .map((doc, index) => ({
//                 id: doc.id || `doc-${station.id}-${index}-${Date.now()}`,
//                 fileUrl: doc.fileUrl || doc.url,
//                 description: doc.description || doc.fileName || doc.originalName || "Untitled Document",
//                 stationId: station.id,
//                 mpiId: doc.mpiId || mpi.id,
//                 createdAt: doc.createdAt || new Date().toISOString(),
//                 updatedAt: doc.updatedAt || new Date().toISOString(),
//               }))

//             if (stationDocsArray.length > 0) {
//               console.log(`📄 Found documents for station ${station.id}:`, stationDocsArray)
//               break // Use the first source that has documents
//             }
//           }
//         }

//         initialDocs[station.id] = stationDocsArray
//         console.log(`✅ Initialized ${stationDocsArray.length} documents for station ${station.id}`)
//       })
//     }

//     console.log("🎯 Final initial station documents:", initialDocs)
//     setStationDocuments(initialDocs)
//   }, [mpi.stations])

//   // Restore focus to instruction input after re-render
//   useEffect(() => {
//     if (focusedInstructionIndex !== null && instructionRefs.current[focusedInstructionIndex]) {
//       const input = instructionRefs.current[focusedInstructionIndex]
//       if (input) {
//         const cursorPosition = input.selectionStart || 0
//         // Use setTimeout to ensure the DOM has updated
//         setTimeout(() => {
//           input.focus()
//           input.setSelectionRange(cursorPosition, cursorPosition)
//         }, 0)
//       }
//     }
//   }, [instructions, focusedInstructionIndex])

//   // Add this useEffect after the instruction focus useEffect
//   useEffect(() => {
//     if (focusedSpecificationId && specificationRefs.current[focusedSpecificationId]) {
//       const input = specificationRefs.current[focusedSpecificationId]
//       if (input) {
//         const cursorPosition = input.selectionStart || 0
//         setTimeout(() => {
//           input.focus()
//           input.setSelectionRange(cursorPosition, cursorPosition)
//         }, 0)
//       }
//     }
//   }, [specificationValues, focusedSpecificationId])

//   // Load existing IDs for validation (excluding current MPI)
//   const loadExistingIds = async () => {
//     try {
//       setCheckingIds(true)
//       const mpis = await MPIAPI.getAllMPIs()
//       // Filter out current MPI from validation
//       const otherMpis = mpis.filter((m) => m.id !== mpi.id)
//       const jobIds = otherMpis.map((m) => m.jobId.toLowerCase())
//       const assemblyIds = otherMpis.map((m) => m.assemblyId.toLowerCase())
//       const documentControlIds = otherMpis
//         .filter((m) => m.orderForms && m.orderForms.length > 0)
//         .flatMap((m) => m.orderForms.map((form) => form.documentControlId))
//         .filter(Boolean)
//         .map((id) => id.toLowerCase())

//       setExistingJobIds(jobIds)
//       setExistingAssemblyIds(assemblyIds)
//       setExistingDocumentControlIds(documentControlIds)
//     } catch (error) {
//       console.error("Failed to load existing IDs:", error)
//     } finally {
//       setCheckingIds(false)
//     }
//   }

//   // Validation functions
//   const validateJobId = (jobId: string): string | null => {
//     if (!jobId.trim()) return "Job ID is required"
//     if (jobId.length < 2) return "Job ID must be at least 2 characters"
//     if (existingJobIds.includes(jobId.toLowerCase())) {
//       return `Job ID "${jobId}" already exists. Please use a different Job ID.`
//     }
//     return null
//   }

//   const validateAssemblyId = (assemblyId: string): string | null => {
//     if (!assemblyId.trim()) return "Assembly ID is required"
//     if (assemblyId.length < 2) return "Assembly ID must be at least 2 characters"
//     if (existingAssemblyIds.includes(assemblyId.toLowerCase())) {
//       return `Assembly ID "${assemblyId}" already exists. Please use a different Assembly ID.`
//     }
//     return null
//   }

//   const validateDocumentControlId = (documentControlId: string): string | null => {
//     if (!documentControlId.trim()) return null
//     if (documentControlId.length < 2) return "Document Control ID must be at least 2 characters"
//     if (existingDocumentControlIds.includes(documentControlId.toLowerCase())) {
//       return `Document Control ID "${documentControlId}" already exists. Please use a different ID.`
//     }
//     return null
//   }

//   // Instruction handlers
//   const handleAddInstruction = () => {
//     setInstructions((prev) => [...prev, ""])
//   }

//   const handleInstructionChange = (index: number, value: string) => {
//     setInstructions((prev) => prev.map((instruction, i) => (i === index ? value : instruction)))
//   }

//   const handleRemoveInstruction = (index: number) => {
//     setInstructions((prev) => prev.filter((_, i) => i !== index))
//     toast({
//       title: "Instruction Removed",
//       description: "Instruction has been removed from the list.",
//     })
//   }

//   // Station notes handlers
//   const handleAddNote = async () => {
//     if (!activeStationId || !newNoteContent.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter note content.",
//         variant: "destructive",
//       })
//       return
//     }

//     setAddingNote(true)
//     try {
//       const newNote: StationNote = {
//         id: `note-${activeStationId}-${Date.now()}`,
//         content: newNoteContent.trim(),
//         createdAt: new Date().toISOString(),
//       }

//       setStationNotes((prev) => ({
//         ...prev,
//         [activeStationId]: [...(prev[activeStationId] || []), newNote],
//       }))

//       setNewNoteContent("")
//       toast({
//         title: "Success",
//         description: "Note added successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to add note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add note. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setAddingNote(false)
//     }
//   }

//   const handleDeleteNote = async (stationId: string, noteId: string) => {
//     try {
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: prev[stationId]?.filter((note) => note.id !== noteId) || [],
//       }))

//       toast({
//         title: "Success",
//         description: "Note deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete note. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Station document handlers
//   const handleStationDocumentUpload = async (file: File, description: string, fileName?: string) => {
//     if (!activeStationId) {
//       toast({
//         title: "Error",
//         description: "No station selected.",
//         variant: "destructive",
//       })
//       return
//     }

//     setUploadingStationDoc(true)
//     try {
//       const finalDescription = description.trim() || file.name
//       const finalFileName = fileName?.trim() || file.name

//       console.log("📤 Station document upload:", {
//         file: file.name,
//         description: finalDescription,
//         fileName: finalFileName,
//         stationId: activeStationId,
//         mpiId: mpi.id,
//       })

//       if (!mpi.id) {
//         // For new MPIs, queue the document locally
//         console.log("💾 QUEUING station document locally - MPI not created yet...")
//         if (file.size > 10 * 1024 * 1024) {
//           throw new Error("File size exceeds 10MB limit")
//         }

//         const newDoc = {
//           id: `temp-${Date.now()}`,
//           file: file,
//           description: finalDescription,
//           fileName: finalFileName,
//           stationId: activeStationId,
//           isUploaded: false,
//         }

//         setStationDocuments((prev) => ({
//           ...prev,
//           [activeStationId]: [...(prev[activeStationId] || []), newDoc],
//         }))

//         toast({
//           title: "✅ Document Queued Successfully",
//           description: `"${finalDescription}" will be uploaded when the MPI is saved.`,
//         })
//       } else {
//         // For existing MPIs, upload directly
//         console.log("📤 Uploading station document directly to existing MPI...")
//         const formData = new FormData()
//         formData.append("files", file)
//         formData.append("stationId", activeStationId)
//         formData.append("description", finalDescription)
//         formData.append("mpiId", mpi.id)
//         formData.append("originalName", file.name)

//         const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
//           method: "POST",
//           body: formData,
//         })

//         if (!response.ok) {
//           const errorText = await response.text()
//           console.error("❌ Direct upload failed:", errorText)
//           throw new Error(`Upload failed: ${response.status} - ${errorText}`)
//         }

//         const result = await response.json()
//         console.log("✅ Station document uploaded successfully:", result)

//         // Add to existing documents for the station
//         setStationDocuments((prev) => ({
//           ...prev,
//           [activeStationId]: [
//             ...(prev[activeStationId] || []),
//             {
//               id: result.id || `uploaded-${Date.now()}`,
//               fileUrl: result.fileUrl,
//               description: result.description || finalDescription,
//               fileName: result.fileName || finalFileName,
//               stationId: activeStationId,
//               isUploaded: true,
//             },
//           ],
//         }))

//         toast({
//           title: "Success",
//           description: "Station document uploaded successfully.",
//         })
//       }
//     } catch (error) {
//       console.error("Station document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingStationDoc(false)
//     }
//   }

//   const handleDeleteStationDocument = async (stationId: string, documentId: string) => {
//     try {
//       // Check if it's an uploaded document or queued document
//       const stationDocs = stationDocuments[stationId] || []
//       const doc = stationDocs.find((d) => d.id === documentId)

//       if (doc && doc.isUploaded && doc.id && !doc.id.startsWith("temp-")) {
//         // Delete uploaded document via API
//         await StationMpiDocAPI.delete(documentId)
//       }

//       // Remove from local state
//       setStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: prev[stationId]?.filter((doc) => doc.id !== documentId) || [],
//       }))

//       toast({
//         title: "Success",
//         description: "Document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete document. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Enhanced MPI Documentation handlers with proper filename support
//   const handleMpiDocumentUpload = async (file: File, description: string) => {
//     setUploadingMpiDoc(true)
//     try {
//       if (!file) {
//         throw new Error("No file selected")
//       }

//       const finalDescription = description.trim() || file.name

//       console.log("📤 MPI document upload:", {
//         originalFile: file.name,
//         description: finalDescription,
//         fileSize: file.size,
//       })

//       // For edit mode, upload immediately since MPI already exists
//       const result = await MPIDocumentationAPI.uploadDocument(mpi.id, file, finalDescription, file.name)

//       const newDoc: MPIDocumentation = {
//         id: result.id,
//         fileUrl: result.fileUrl,
//         description: result.description,
//         fileName: file.name,
//         originalFileName: file.name,
//         isUploaded: true,
//       }

//       setMpiDocumentation((prev) => [...prev, newDoc])

//       toast({
//         title: "Success",
//         description: "Document uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("Document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingMpiDoc(false)
//     }
//   }

//   const removeMpiDocument = async (index: number) => {
//     const doc = mpiDocumentation[index]
//     if (doc.id && doc.isUploaded) {
//       try {
//         await MPIDocumentationAPI.deleteDocument(doc.id)
//         toast({
//           title: "Success",
//           description: "Document deleted successfully.",
//         })
//       } catch (error) {
//         console.error("Failed to delete document:", error)
//         toast({
//           title: "Error",
//           description: "Failed to delete document.",
//           variant: "destructive",
//         })
//         return
//       }
//     }
//     setMpiDocumentation((prev) => prev.filter((_, i) => i !== index))
//   }

//   useEffect(() => {
//     loadStations()
//     loadEnums()
//     loadChecklistData()
//     loadExistingIds()
//     loadServices() // Add this line
//   }, [])

//   useEffect(() => {
//     // Update selected stations when formData.selectedStationIds changes
//     const selected = availableStations.filter((station) => formData.selectedStationIds.includes(station.id))
//     setSelectedStations(selected)
//   }, [formData.selectedStationIds, availableStations])

//   const loadStations = async () => {
//     try {
//       setLoadingStations(true)
//       const stations = await StationAPI.getAllStations()
//       setAvailableStations(stations)
//     } catch (error) {
//       console.error("Failed to load stations:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load stations. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingStations(false)
//     }
//   }

//   const loadEnums = async () => {
//     try {
//       setLoadingEnums(true)
//       const enumsData = await MPIAPI.getEnums()
//       setEnums(enumsData)
//     } catch (error) {
//       console.error("Failed to load enums:", error)
//       toast({
//         title: "Warning",
//         description: "Failed to load form options.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingEnums(false)
//     }
//   }

//   const loadChecklistData = async () => {
//     try {
//       setLoadingAvailableChecklist(true)
//       // Load existing checklists from MPI - show ONLY REQUIRED items (like details page)
//       const existingChecklistSections: ChecklistSection[] = []
//       const existingItemDescriptions = new Set<string>()

//       if (mpi.checklists && mpi.checklists.length > 0) {
//         mpi.checklists.forEach((checklist, checklistIndex) => {
//           if (checklist.checklistItems && checklist.checklistItems.length > 0) {
//             // Filter to only show required items (exactly like details page)
//             const requiredItems = checklist.checklistItems.filter((item) => item.required === true)

//             if (requiredItems.length > 0) {
//               existingChecklistSections.push({
//                 id: `existing-section-${checklistIndex}`,
//                 name: checklist.name,
//                 description: `${checklist.name} - Existing required checklist items`,
//                 items: requiredItems.map((item, itemIndex) => {
//                   // Track this item as existing
//                   existingItemDescriptions.add(item.description.toLowerCase().trim())
//                   return {
//                     id: `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
//                     description: item.description,
//                     required: item.required,
//                     remarks: item.remarks,
//                     category: item.category || checklist.name,
//                     isActive: item.isActive,
//                     createdBy: item.createdBy,
//                     sectionId: `existing-section-${checklistIndex}`,
//                   }
//                 }),
//               })
//             }
//           }
//         })
//       }

//       setExistingChecklists(existingChecklistSections)

//       // Load available checklist template and filter out existing items
//       const template = await MPIAPI.getChecklistTemplate()
//       console.log("📦 Available checklist template loaded:", template)

//       if (template && Array.isArray(template)) {
//         const validSections = template
//           .filter(
//             (section) =>
//               section && typeof section === "object" && section.name && Array.isArray(section.checklistItems),
//           )
//           .map((section, sectionIndex) => {
//             // Filter out items that already exist in the MPI
//             const availableItems = (section.checklistItems || [])
//               .filter((item: any) => {
//                 const itemDescription = item.description?.toLowerCase().trim()
//                 return itemDescription && !existingItemDescriptions.has(itemDescription)
//               })
//               .map((item: any, itemIndex: number) => ({
//                 id: `available-${section.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
//                 description: item.description || "No description",
//                 required: false, // Default to No for available items
//                 remarks: "",
//                 category: item.category || section.name,
//                 isActive: item.isActive !== undefined ? item.isActive : true,
//                 createdBy: item.createdBy || "System",
//                 sectionId: `available-section-${sectionIndex}`,
//               }))

//             return availableItems.length > 0
//               ? {
//                   id: `available-section-${sectionIndex}`,
//                   name: section.name,
//                   description: `${section.name} quality control items`,
//                   items: availableItems,
//                 }
//               : null
//           })
//           .filter(Boolean)

//         setAvailableChecklistTemplate(validSections)
//       } else {
//         setAvailableChecklistTemplate([])
//       }
//     } catch (error) {
//       console.error("Failed to load checklist data:", error)
//       setAvailableChecklistTemplate([])
//       setExistingChecklists([])
//     } finally {
//       setLoadingAvailableChecklist(false)
//     }
//   }

//   const loadServices = async () => {
//     try {
//       setLoadingServices(true)
//       const fetchedServices = await ServiceAPI.getAll()
//       setServices(fetchedServices)

//       // Set selected service if one exists in the order form
//       if (orderFormData.selectedServiceId && fetchedServices.length > 0) {
//         const service = fetchedServices.find((s) => s.id === orderFormData.selectedServiceId)
//         setSelectedService(service || null)
//       }
//     } catch (error) {
//       console.error("Failed to fetch services:", error)
//       toast({
//         title: "Warning",
//         description: "Failed to load services. Please try again.",
//         variant: "destructive",
//       })
//       setServices([])
//     } finally {
//       setLoadingServices(false)
//     }
//   }

//   const handleChecklistItemChange = (itemId: string, field: "required" | "remarks", value: boolean | string) => {
//     setChecklistModifications((prev) => ({
//       ...prev,
//       [itemId]: {
//         ...prev[itemId],
//         [field]: value,
//       },
//     }))
//   }

//   const getChecklistItemValue = (itemId: string, field: "required" | "remarks", defaultValue: boolean | string) => {
//     return checklistModifications[itemId]?.[field] ?? defaultValue
//   }

//   const handleOrderFormChange = (field: string, value: string | boolean | string[]) => {
//     setOrderFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleServiceChange = (serviceId: string) => {
//     const service = services.find((s) => s.id === serviceId)
//     if (service) {
//       setSelectedService(service)
//       handleOrderFormChange("selectedServiceId", serviceId)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log("🔄 Starting form submission...")

//     // Validation - Reload existing IDs first
//     await loadExistingIds()

//     // Enhanced validation with better error messages
//     const jobIdError = validateJobId(formData.jobId)
//     const assemblyIdError = validateAssemblyId(formData.assemblyId)
//     const documentControlIdError = orderFormData.documentControlId
//       ? validateDocumentControlId(orderFormData.documentControlId)
//       : null

//     const validationErrors = []
//     if (jobIdError) validationErrors.push(`Job ID: ${jobIdError}`)
//     if (assemblyIdError) validationErrors.push(`Assembly ID: ${assemblyIdError}`)
//     if (documentControlIdError) validationErrors.push(`Document Control ID: ${documentControlIdError}`)

//     // Check for required fields
//     if (!formData.jobId.trim()) validationErrors.push("Job ID is required")
//     if (!formData.assemblyId.trim()) validationErrors.push("Assembly ID is required")

//     if (validationErrors.length > 0) {
//       toast({
//         title: "❌ Validation Failed",
//         description: (
//           <div className="space-y-2">
//             <p className="font-semibold">Please fix the following issues:</p>
//             <ul className="list-disc list-inside space-y-1">
//               {validationErrors.map((error, index) => (
//                 <li key={index} className="text-sm">
//                   {error}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ),
//         variant: "destructive",
//         duration: 10000,
//       })
//       setActiveTab("basic-info")
//       return
//     }

//     console.log("Selected stations:", formData.selectedStationIds)
//     console.log("Current specification values:", specificationValues)
//     console.log("Current checklist modifications:", checklistModifications)

//     // Prepare stations data - Send ALL selected stations with their specification values in the correct format
//     const stationsData = formData.selectedStationIds
//       .map((stationId) => {
//         const station = selectedStations.find((s) => s.id === stationId)
//         if (!station) return null

//         // Get specification values for this station in the format the backend expects
//         const stationSpecificationValues =
//           station.specifications?.map((spec) => {
//             const specValue = specificationValues[spec.id]
//             return {
//               specificationId: spec.id,
//               value: specValue?.value || "", // Send current value or empty string
//               ...(specValue?.unit && { unit: specValue.unit }),
//               ...(specValue?.fileUrl && { fileUrl: specValue.fileUrl }),
//             }
//           }) || []

//         // Include station notes in the update
//         const stationNotesArray = stationNotes[stationId]?.map((note) => note.content) || []

//         return {
//           id: station.id,
//           stationId: station.stationId,
//           stationName: station.stationName,
//           status: station.status,
//           description: station.description || "",
//           location: station.location || "",
//           operator: station.operator || "",
//           priority: station.priority || 1,
//           Note: stationNotesArray,
//           // Send specification values in the format the backend expects
//           specificationValues: stationSpecificationValues,
//         }
//       })
//       .filter(Boolean)

//     console.log("📤 Stations data being sent:", JSON.stringify(stationsData, null, 2))
//     console.log("🔧 Current specification values:", specificationValues)

//     // Prepare existing checklist updates with ACTUAL database IDs
//     const existingChecklistUpdates: any[] = []
//     if (mpi.checklists && mpi.checklists.length > 0) {
//       mpi.checklists.forEach((checklist) => {
//         const updatedItems: any[] = []
//         let hasChanges = false

//         if (checklist.checklistItems && checklist.checklistItems.length > 0) {
//           checklist.checklistItems.forEach((item, itemIndex) => {
//             const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
//             const modifications = checklistModifications[itemId]

//             if (modifications) {
//               // Check if there are actual changes
//               if (modifications.required !== item.required || modifications.remarks !== item.remarks) {
//                 hasChanges = true
//               }

//               updatedItems.push({
//                 id: item.id, // Use the actual database ID from the MPI
//                 description: item.description,
//                 required: modifications.required,
//                 remarks: modifications.remarks,
//                 category: item.category,
//                 createdBy: item.createdBy,
//                 isActive: item.isActive,
//               })
//             }
//           })
//         }

//         // Only include checklist if there are actual changes
//         if (hasChanges && updatedItems.length > 0) {
//           existingChecklistUpdates.push({
//             id: checklist.id, // Use the actual checklist database ID
//             name: checklist.name,
//             checklistItems: updatedItems,
//           })
//         }
//       })
//     }

//     // Prepare new checklists from available template
//     const newChecklists: any[] = []
//     availableChecklistTemplate.forEach((section) => {
//       const newItems: any[] = []

//       section.items.forEach((item) => {
//         const modifications = checklistModifications[item.id]
//         if (modifications && modifications.required) {
//           newItems.push({
//             description: item.description,
//             required: modifications.required,
//             remarks: modifications.remarks || "",
//             createdBy: item.createdBy || "System",
//             isActive: item.isActive !== undefined ? item.isActive : true,
//             category: item.category || section.name,
//           })
//         }
//       })

//       if (newItems.length > 0) {
//         newChecklists.push({
//           name: section.name,
//           checklistItems: newItems,
//         })
//       }
//     })

//     // Prepare complete submission data matching backend expectations
//     const submitData: any = {
//       jobId: formData.jobId,
//       assemblyId: formData.assemblyId,
//       customer: formData.customer || null,
//     }

//     // FIXED: Always include order forms for updates with proper structure
//     const orderFormSubmissionData = {
//       id: orderFormData.id || undefined, // Include ID if exists for update
//       OrderType: orderFormData.orderType,
//       distributionDate: orderFormData.distributionDate ? new Date(orderFormData.distributionDate).toISOString() : null,
//       requiredBy: orderFormData.requiredBy ? new Date(orderFormData.requiredBy).toISOString() : null,
//       internalOrderNumber: orderFormData.internalOrderNumber || null,
//       revision: orderFormData.revision || null,
//       otherAttachments: orderFormData.otherAttachments || null,
//       fileAction: orderFormData.fileAction,
//       markComplete: orderFormData.markComplete,
//       documentControlId: orderFormData.documentControlId || null,
//       // Add service ID mapping
//       ...(orderFormData.selectedServiceId && {
//         serviceIds: [orderFormData.selectedServiceId], // Convert single ID to array
//       }),
//     }

//     // Send as array to match backend expectation
//     submitData.orderForms = [orderFormSubmissionData]

//     console.log("📋 Order form data being sent:", JSON.stringify(submitData.orderForms, null, 2))

//     // Add stations with specifications if they exist
//     if (stationsData.length > 0) {
//       submitData.stations = stationsData
//     }

//     // Combine existing and new checklists for the backend
//     const allChecklists = [...existingChecklistUpdates, ...newChecklists]
//     if (allChecklists.length > 0) {
//       submitData.checklists = allChecklists
//     }

//     // Add instructions - always include for updates (use backend field name 'Instruction')
//     submitData.Instruction = instructions.filter((instruction) => instruction.trim() !== "")

//     // Add uploaded documents to submission data with both description and fileName
//     if (mpiDocumentation.length > 0) {
//       const uploadedDocs = mpiDocumentation
//         .filter((doc) => doc.isUploaded && doc.fileUrl)
//         .map((doc) => ({
//           id: doc.id,
//           fileUrl: doc.fileUrl,
//           description: doc.description,
//           fileName: doc.fileName, // Include fileName for backend
//           originalFileName: doc.originalFileName, // Include original filename
//         }))

//       if (uploadedDocs.length > 0) {
//         submitData.mpiDocs = uploadedDocs
//       }
//     }

//     console.log("📤 Submitting MPI update data:", JSON.stringify(submitData, null, 2))

//     try {
//       await onSubmit(submitData as UpdateMPIDto)
//       if (newChecklists.length > 0) {
//         toast({
//           title: "Success",
//           description: `MPI updated successfully with ${newChecklists.length} new checklist section(s) added.`,
//         })
//       } else {
//         toast({
//           title: "Success",
//           description: "MPI updated successfully.",
//         })
//       }
//     } catch (error: any) {
//       console.error("Form submission error:", error)
//       // Handle specific error types
//       if (error.message?.includes("Unique constraint failed")) {
//         if (error.message?.includes("documentControlId")) {
//           toast({
//             title: "🚫 Duplicate Document Control ID",
//             description: `Document Control ID "${orderFormData.documentControlId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         } else if (error.message?.includes("jobId")) {
//           toast({
//             title: "🚫 Duplicate Job ID",
//             description: `Job ID "${formData.jobId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         } else if (error.message?.includes("assemblyId")) {
//           toast({
//             title: "🚫 Duplicate Assembly ID",
//             description: `Assembly ID "${formData.assemblyId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         }
//       }

//       toast({
//         title: "Submission Error",
//         description: error.message || "Failed to update MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleStationSelectionChange = (stationIds: string[]) => {
//     setFormData((prev) => ({ ...prev, selectedStationIds: stationIds }))
//   }

//   const handleSpecificationValueChange = (specificationId: string, value: string, unit?: string) => {
//     console.log("🔧 Updating specification:", specificationId, "with value:", value, "unit:", unit)
//     setSpecificationValues((prev) => {
//       const currentSpec = prev[specificationId] || { specificationId, value: "", unit: undefined, fileUrl: undefined }
//       const updated = {
//         ...prev,
//         [specificationId]: {
//           ...currentSpec,
//           specificationId,
//           value,
//           unit: unit !== undefined ? unit : currentSpec.unit,
//         },
//       }
//       console.log("🔧 Updated specification values:", updated)
//       return updated
//     })
//   }

//   const handleFileUpload = async (specificationId: string, file: File, stationId: string, unit?: string) => {
//     console.log("📁 Starting file upload for spec:", specificationId, "station:", stationId)
//     setUploadingFiles((prev) => new Set(prev).add(specificationId))

//     try {
//       const result = await StationAPI.uploadStationSpecificationFile(file, specificationId, stationId, unit)
//       console.log("📁 File upload result:", result)

//       setSpecificationValues((prev) => {
//         const updated = {
//           ...prev,
//           [specificationId]: {
//             specificationId,
//             value: result.value || file.name,
//             fileUrl: result.fileUrl,
//             unit: unit || prev[specificationId]?.unit,
//           },
//         }
//         console.log("📁 Updated specification values after upload:", updated)
//         return updated
//       })

//       toast({
//         title: "Success",
//         description: "File uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("File upload error:", error)
//       toast({
//         title: "Error",
//         description: "Failed to upload file. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingFiles((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(specificationId)
//         return newSet
//       })
//     }
//   }

//   const renderSpecificationInput = (spec: any, stationId: string) => {
//     const specValue = specificationValues[spec.id]
//     const isUploading = uploadingFiles.has(spec.id)

//     // Only log if there's an issue or for debugging specific specs
//     if (!specValue && spec.required) {
//       console.log(`⚠️ Required spec ${spec.name} (${spec.id}) has no value`)
//     }

//     switch (spec.inputType) {
//       case "TEXT":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <Input
//               ref={(el) => {
//                 specificationRefs.current[spec.id] = el
//               }}
//               id={`spec-${spec.id}`}
//               value={specValue?.value || ""}
//               onChange={(e) => {
//                 setFocusedSpecificationId(spec.id)
//                 handleSpecificationValueChange(spec.id, e.target.value)
//               }}
//               onFocus={() => setFocusedSpecificationId(spec.id)}
//               onBlur={() => setFocusedSpecificationId(null)}
//               placeholder={`Enter ${spec.name.toLowerCase()}`}
//               className="h-10"
//             />
//           </div>
//         )

//       case "number":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <div className="flex gap-2">
//               <Input
//                 ref={(el) => {
//                   specificationRefs.current[spec.id] = el
//                 }}
//                 id={`spec-${spec.id}`}
//                 type="number"
//                 value={specValue?.value || ""}
//                 onChange={(e) => {
//                   setFocusedSpecificationId(spec.id)
//                   handleSpecificationValueChange(spec.id, e.target.value, specValue?.unit)
//                 }}
//                 onFocus={() => setFocusedSpecificationId(spec.id)}
//                 onBlur={() => setFocusedSpecificationId(null)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10 flex-1"
//               />
//               <Input
//                 placeholder="Unit"
//                 value={specValue?.unit || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
//                 className="h-10 w-20"
//               />
//             </div>
//           </div>
//         )

//       case "CHECKBOX":
//         return (
//           <div className="space-y-2">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id={`spec-${spec.id}`}
//                 checked={specValue?.value === "true"}
//                 onCheckedChange={(checked) => handleSpecificationValueChange(spec.id, checked ? "true" : "false")}
//               />
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//             </div>
//           </div>
//         )

//       case "DROPDOWN":
//         const suggestions = spec.suggestions || []
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <Select
//               value={specValue?.value || ""}
//               onValueChange={(value) => handleSpecificationValueChange(spec.id, value)}
//             >
//               <SelectTrigger className="h-10">
//                 <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
//               </SelectTrigger>
//               <SelectContent>
//                 {suggestions.map((suggestion: string, index: number) => (
//                   <SelectItem key={index} value={suggestion}>
//                     {suggestion}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )

//       case "FILE_UPLOAD":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <Input
//                   id={`spec-${spec.id}`}
//                   type="file"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0]
//                     if (file) {
//                       handleFileUpload(spec.id, file, stationId, specValue?.unit)
//                     }
//                   }}
//                   accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
//                   className="cursor-pointer flex-1"
//                   disabled={isUploading}
//                 />
//                 {isUploading && (
//                   <div className="flex items-center gap-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
//                     <span className="text-xs text-muted-foreground">Uploading...</span>
//                   </div>
//                 )}
//               </div>
//               <Input
//                 placeholder="Unit (optional)"
//                 value={specValue?.unit || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
//                 className="h-10 w-32"
//               />
//               {specValue?.fileUrl && (
//                 <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
//                   <FileText className="w-4 h-4 text-green-600" />
//                   <span className="text-sm text-green-800">File uploaded successfully</span>
//                   <a
//                     href={specValue.fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-xs text-blue-600 hover:underline"
//                   >
//                     View
//                   </a>
//                 </div>
//               )}
//               <p className="text-xs text-muted-foreground">
//                 Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
//               </p>
//             </div>
//           </div>
//         )

//       default:
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <Input
//               id={`spec-${spec.id}`}
//               value={specValue?.value || ""}
//               onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value)}
//               placeholder={`Enter ${spec.name.toLowerCase()}`}
//               className="h-10"
//             />
//           </div>
//         )
//     }
//   }

//   const renderStationDocuments = (stationId: string) => {
//     const documents = stationDocuments[stationId] || []

//     return (
//       <div className="space-y-4">
//         {/* Upload Section */}
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
//           <div className="space-y-4">
//             <h4 className="font-medium text-sm">Upload Station Document</h4>
//             <div className="grid grid-cols-1 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="station-doc-file">Select Files *</Label>
//                 <Input
//                   id="station-doc-file"
//                   type="file"
//                   accept="*/*"
//                   className="cursor-pointer"
//                   disabled={uploadingStationDoc}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="station-doc-description">Description</Label>
//                 <Input
//                   id="station-doc-description"
//                   placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                   disabled={uploadingStationDoc}
//                 />
//               </div>
//             </div>
//             <Button
//               type="button"
//               variant="outline"
//               disabled={uploadingStationDoc}
//               onClick={async () => {
//                 const fileInput = document.getElementById("station-doc-file") as HTMLInputElement
//                 const descInput = document.getElementById("station-doc-description") as HTMLInputElement
//                 const file = fileInput?.files?.[0]
//                 const description = descInput?.value?.trim() || ""

//                 if (!file) {
//                   toast({
//                     title: "Missing File",
//                     description: "Please select a file to upload.",
//                     variant: "destructive",
//                   })
//                   return
//                 }

//                 await handleStationDocumentUpload(file, description, file.name)
//                 fileInput.value = ""
//                 descInput.value = ""
//               }}
//               className="w-full"
//             >
//               {uploadingStationDoc ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                   Uploading File...
//                 </div>
//               ) : (
//                 <>
//                   <Upload className="w-4 h-4 mr-2" />
//                   Upload File
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Documents List */}
//         {documents.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No files available for this station.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 gap-4">
//               {documents.map((doc) => (
//                 <div key={doc.id} className="p-4 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start gap-3 flex-1">
//                       <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-medium text-sm text-gray-900 truncate">
//                           {doc.description || "Untitled Document"}
//                         </h4>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Uploaded: {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "Unknown date"}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 ml-4">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => window.open(doc.fileUrl, "_blank")}
//                         className="h-8 px-3"
//                       >
//                         <Eye className="w-3 h-3 mr-1" />
//                         View
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           const link = document.createElement("a")
//                           link.href = doc.fileUrl
//                           link.download = doc.description || "document"
//                           link.click()
//                         }}
//                         className="h-8 px-3"
//                       >
//                         <Download className="w-3 h-3 mr-1" />
//                         Download
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleDeleteStationDocument(stationId, doc.id)}
//                         className="h-8 px-3 text-green-600 hover:text-green-700"
//                       >
//                         <Trash2 className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const renderStationNotes = (stationId: string) => {
//     const notes = stationNotes[stationId] || []

//     return (
//       <div className="space-y-4">
//         {/* Add Note Section */}
//         <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
//             <Plus className="w-4 h-4" />
//             Add Station Note
//           </h4>
//           <div className="space-y-3">
//             <Textarea
//               value={newNoteContent}
//               onChange={(e) => setNewNoteContent(e.target.value)}
//               placeholder="Enter operational notes, safety instructions, or maintenance reminders..."
//               rows={3}
//               className="resize-none"
//             />
//             <Button
//               onClick={handleAddNote}
//               disabled={addingNote || !newNoteContent.trim()}
//               size="sm"
//               className="w-full"
//             >
//               {addingNote ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                   Adding Note...
//                 </div>
//               ) : (
//                 <>
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Note
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Notes List */}
//         {notes.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No notes available for this station.</p>
//             <p className="text-sm text-muted-foreground mt-1">
//               Add operational notes, safety instructions, or reminders above.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             <h4 className="font-medium text-sm flex items-center gap-2">
//               <StickyNote className="w-4 h-4" />
//               Station Notes ({notes.length})
//             </h4>
//             <div className="space-y-2">
//               {notes.map((note) => (
//                 <div key={note.id} className="p-3 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.content}</p>
//                       <p className="text-xs text-gray-500 mt-2">
//                         {note.createdAt ? new Date(note.createdAt).toLocaleString() : "Unknown date"}
//                       </p>
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => handleDeleteNote(stationId, note.id!)}
//                       className="ml-3 h-8 px-2 text-green-600 hover:text-green-700"
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const isFormValid = () => {
//     const jobIdError = validateJobId(formData.jobId)
//     const assemblyIdError = validateAssemblyId(formData.assemblyId)
//     const documentControlIdError = orderFormData.documentControlId
//       ? validateDocumentControlId(orderFormData.documentControlId)
//       : null

//     return !jobIdError && !assemblyIdError && !documentControlIdError
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between w-full">
//           <div>
//             <h1 className="text-3xl font-bold text-green-600">Edit MPI</h1>
//             <p className="text-muted-foreground">
//               Job ID: {mpi.jobId} • Assembly ID: {mpi.assemblyId}
//             </p>
//           </div>
//           <Button variant="outline" size="sm" onClick={onCancel}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
//         </div>

//         <Card className="border shadow-sm">
//           <CardContent className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-4">
//                   <TabsTrigger value="basic-info" className="flex items-center gap-2">
//                     <Info className="w-4 h-4" />
//                     Order Details
//                   </TabsTrigger>
//                   <TabsTrigger value="documentation" className="flex items-center gap-2">
//                     <FileText className="w-4 h-4" />
//                     Files
//                     {mpiDocumentation.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {mpiDocumentation.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="checklist" className="flex items-center gap-2">
//                     <ClipboardList className="w-4 h-4" />
//                     Checklist
//                     {existingChecklists.length + availableChecklistTemplate.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {existingChecklists.length + availableChecklistTemplate.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="instructions" className="flex items-center gap-2">
//                     <Factory className="w-4 h-4" />
//                     Instructions
//                     {selectedStations.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {selectedStations.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                 </TabsList>

//                 {/* Basic Information & Order Form Tab */}
//                 <TabsContent value="basic-info" className="space-y-6 mt-6">
//                   {/* MPI Basic Information */}
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="jobId">
//                             MPI ID *{checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="jobId"
//                             value={formData.jobId}
//                             onChange={(e) => handleChange("jobId", e.target.value)}
//                             placeholder="Enter job ID"
//                             required
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = validateJobId(formData.jobId)
//                             return error ? (
//                               <p className="text-xs text-green-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="assemblyId">
//                             Assembly ID *
//                             {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="assemblyId"
//                             value={formData.assemblyId}
//                             onChange={(e) => handleChange("assemblyId", e.target.value)}
//                             placeholder="Enter assembly ID"
//                             required
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = validateAssemblyId(formData.assemblyId)
//                             return error ? (
//                               <p className="text-xs text-green-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="customer">Customer</Label>
//                           <Input
//                             id="customer"
//                             value={formData.customer}
//                             onChange={(e) => handleChange("customer", e.target.value)}
//                             placeholder="Enter customer name"
//                             className="h-11"
//                           />
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   {/* Order Forms Section */}
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="internalOrderNumber">Internal Order Number</Label>
//                           <Input
//                             id="internalOrderNumber"
//                             value={orderFormData.internalOrderNumber}
//                             onChange={(e) => handleOrderFormChange("internalOrderNumber", e.target.value)}
//                             placeholder="Enter internal order number"
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="revision">Revision</Label>
//                           <Input
//                             id="revision"
//                             value={orderFormData.revision}
//                             onChange={(e) => handleOrderFormChange("revision", e.target.value)}
//                             placeholder="Enter revision number"
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="documentControlId">
//                             Document Control ID
//                             {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="documentControlId"
//                             value={orderFormData.documentControlId}
//                             onChange={(e) => handleOrderFormChange("documentControlId", e.target.value)}
//                             placeholder="Enter document control ID"
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = orderFormData.documentControlId
//                               ? validateDocumentControlId(orderFormData.documentControlId)
//                               : null
//                             return error ? (
//                               <p className="text-xs text-green-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="distributionDate">Distribution Date</Label>
//                           <Input
//                             id="distributionDate"
//                             type="date"
//                             value={orderFormData.distributionDate}
//                             onChange={(e) => handleOrderFormChange("distributionDate", e.target.value)}
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="requiredBy">Required By</Label>
//                           <Input
//                             id="requiredBy"
//                             type="date"
//                             value={orderFormData.requiredBy}
//                             onChange={(e) => handleOrderFormChange("requiredBy", e.target.value)}
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="serviceSelect">Select Service</Label>
//                           <div className="relative">
//                             <Select
//                               value={orderFormData.selectedServiceId || ""}
//                               onChange={handleServiceChange}
//                               disabled={loadingServices}
//                             >
//                               <SelectTrigger id="serviceSelect" className="h-11">
//                                 <SelectValue
//                                   placeholder={
//                                     loadingServices
//                                       ? "Loading services..."
//                                       : services.length === 0
//                                         ? "No services available"
//                                         : "Select a service"
//                                   }
//                                 />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {services.map((service) => (
//                                   <SelectItem key={service.id} value={service.id}>
//                                     <div className="flex flex-col">
//                                       <span className="font-medium">{service.name}</span>
//                                       {service.description && (
//                                         <span className="text-xs text-gray-500 truncate max-w-[200px]">
//                                           {service.description}
//                                         </span>
//                                       )}
//                                     </div>
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                             {loadingServices && (
//                               <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
//                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
//                               </div>
//                             )}
//                           </div>
//                           {services.length === 0 && !loadingServices && (
//                             <p className="text-sm text-gray-500">
//                               No services available. Please create services first.
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Documentation Tab */}
//                 <TabsContent value="documentation" className="space-y-6 mt-6">
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="space-y-4">
//                         {/* Upload Section */}
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
//                           <div className="space-y-4">
//                             <div className="grid grid-cols-1 gap-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor="mpi-doc-file">Select Files *</Label>
//                                 <Input
//                                   id="mpi-doc-file"
//                                   type="file"
//                                   accept="*/*"
//                                   className="cursor-pointer"
//                                   disabled={uploadingMpiDoc}
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor="mpi-doc-description">Description (Optional)</Label>
//                                 <Input
//                                   id="mpi-doc-description"
//                                   placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                                   disabled={uploadingMpiDoc}
//                                 />
//                               </div>
//                             </div>
//                             <Button
//                               type="button"
//                               variant="outline"
//                               disabled={uploadingMpiDoc}
//                               onClick={async () => {
//                                 const fileInput = document.getElementById("mpi-doc-file") as HTMLInputElement
//                                 const descInput = document.getElementById("mpi-doc-description") as HTMLInputElement
//                                 const file = fileInput?.files?.[0]
//                                 const description = descInput?.value?.trim() || ""

//                                 if (!file) {
//                                   toast({
//                                     title: "Missing File",
//                                     description: "Please select a file to upload.",
//                                     variant: "destructive",
//                                   })
//                                   return
//                                 }

//                                 await handleMpiDocumentUpload(file, description)
//                                 fileInput.value = ""
//                                 descInput.value = ""
//                               }}
//                               className="w-full bg-transparent"
//                             >
//                               {uploadingMpiDoc ? (
//                                 <div className="flex items-center gap-2">
//                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                   Uploading File...
//                                 </div>
//                               ) : (
//                                 <>
//                                   <Upload className="w-4 h-4 mr-2" />
//                                   Upload File
//                                 </>
//                               )}
//                             </Button>
//                           </div>
//                         </div>

//                         {/* Uploaded Documents List */}
//                         {mpiDocumentation.length > 0 && (
//                           <div className="space-y-3">
//                             <h4 className="font-medium text-sm">Files</h4>
//                             <div className="space-y-2">
//                               {mpiDocumentation.map((doc, index) => (
//                                 <div
//                                   key={index}
//                                   className="flex items-start justify-between p-4 bg-gray-50 rounded border"
//                                 >
//                                   <div className="flex items-start gap-3 flex-1">
//                                     <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                                     <div className="flex-1 min-w-0">
//                                       <p className="text-sm font-medium text-gray-900 truncate">
//                                         {doc.description && doc.description !== doc.fileName
//                                           ? doc.description
//                                           : doc.fileName}
//                                       </p>
//                                       <div className="mt-1 space-y-1">
//                                         <p className="text-xs text-gray-600">
//                                           <span className="font-medium">Filename:</span> {doc.fileName}
//                                         </p>
//                                         {doc.description && doc.description !== doc.fileName && (
//                                           <p className="text-xs text-gray-500">
//                                             <span className="font-medium">Description:</span> {doc.description}
//                                           </p>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <div className="flex items-center gap-2 ml-4">
//                                     <Button
//                                       type="button"
//                                       size="sm"
//                                       variant="outline"
//                                       onClick={() => removeMpiDocument(index)}
//                                       className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
//                                     >
//                                       Remove
//                                     </Button>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Checklist Tab */}
//                 <TabsContent value="checklist" className="space-y-6 mt-6">
//                   <Card>
//                     <CardContent className="mt-5">
//                       {loadingAvailableChecklist ? (
//                         <div className="flex items-center justify-center py-8">
//                           <div className="text-center">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
//                             <p className="mt-2 text-sm text-muted-foreground">Loading checklist data...</p>
//                           </div>
//                         </div>
//                       ) : existingChecklists.length === 0 && availableChecklistTemplate.length === 0 ? (
//                         <p className="text-muted-foreground text-center py-4">No checklist data available.</p>
//                       ) : (
//                         <div className="space-y-6">
//                           {/* Existing Checklists */}
//                           {existingChecklists.length > 0 ? (
//                             <div>
//                               <h3 className="text-lg font-semibold mb-4 text-green-800">
//                                 Existing Required Checklists
//                               </h3>
//                               <Accordion type="multiple" className="w-full">
//                                 {existingChecklists.map((section) => (
//                                   <AccordionItem key={section.id} value={section.id}>
//                                     <AccordionTrigger className="text-left">
//                                       <div className="flex items-center gap-3">
//                                         <h4 className="font-medium">{section.name}</h4>
//                                       </div>
//                                     </AccordionTrigger>
//                                     <AccordionContent>
//                                       <div className="space-y-4">
//                                         <Table>
//                                           <TableHeader>
//                                             <TableRow>
//                                               <TableHead>Description</TableHead>
//                                               <TableHead>Required</TableHead>
//                                               <TableHead>Remarks</TableHead>
//                                             </TableRow>
//                                           </TableHeader>
//                                           <TableBody>
//                                             {(section.items || []).map((item) => (
//                                               <TableRow key={item.id}>
//                                                 <TableCell className="font-medium">{item.description}</TableCell>
//                                                 <TableCell>
//                                                   <Select
//                                                     value={
//                                                       getChecklistItemValue(item.id, "required", item.required)
//                                                         ? "yes"
//                                                         : "no"
//                                                     }
//                                                     onChange={(value) =>
//                                                       handleChecklistItemChange(item.id, "required", value === "yes")
//                                                     }
//                                                   >
//                                                     <SelectTrigger className="w-20">
//                                                       <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                       <SelectItem value="yes">Yes</SelectItem>
//                                                       <SelectItem value="no">No</SelectItem>
//                                                     </SelectContent>
//                                                   </Select>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                   <Input
//                                                     value={
//                                                       getChecklistItemValue(item.id, "remarks", item.remarks) as string
//                                                     }
//                                                     onChange={(e) =>
//                                                       handleChecklistItemChange(item.id, "remarks", e.target.value)
//                                                     }
//                                                     placeholder="Enter remarks (optional)"
//                                                     className="min-w-[200px]"
//                                                   />
//                                                 </TableCell>
//                                               </TableRow>
//                                             ))}
//                                           </TableBody>
//                                         </Table>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           ) : (
//                             <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                               <h3 className="text-lg font-semibold mb-2 text-blue-800">Existing Checklists</h3>
//                               <p className="text-sm text-blue-700">
//                                 No checklist items have been created for this MPI yet.
//                               </p>
//                             </div>
//                           )}

//                           {/* Available Checklist Template */}
//                           {availableChecklistTemplate.length > 0 && (
//                             <div>
//                               <h3 className="text-lg font-semibold mb-4 text-green-800">Available Checklist Items</h3>
//                               <Accordion type="multiple" className="w-full">
//                                 {availableChecklistTemplate.map((section) => (
//                                   <AccordionItem key={section.id} value={section.id}>
//                                     <AccordionTrigger className="text-left">
//                                       <div className="flex items-center gap-3">
//                                         <h4 className="font-medium">{section.name}</h4>
//                                       </div>
//                                     </AccordionTrigger>
//                                     <AccordionContent>
//                                       <div className="space-y-4">
//                                         <Table>
//                                           <TableHeader>
//                                             <TableRow>
//                                               <TableHead>Description</TableHead>
//                                               <TableHead>Required</TableHead>
//                                               <TableHead>Remarks</TableHead>
//                                             </TableRow>
//                                           </TableHeader>
//                                           <TableBody>
//                                             {(section.items || []).map((item) => (
//                                               <TableRow key={item.id}>
//                                                 <TableCell className="font-medium">{item.description}</TableCell>
//                                                 <TableCell>
//                                                   <Select
//                                                     value={
//                                                       getChecklistItemValue(item.id, "required", item.required)
//                                                         ? "yes"
//                                                         : "no"
//                                                     }
//                                                     onChange={(value) =>
//                                                       handleChecklistItemChange(item.id, "required", value === "yes")
//                                                     }
//                                                   >
//                                                     <SelectTrigger className="w-20">
//                                                       <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                       <SelectItem value="yes">Yes</SelectItem>
//                                                       <SelectItem value="no">No</SelectItem>
//                                                     </SelectContent>
//                                                   </Select>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                   <Input
//                                                     value={
//                                                       getChecklistItemValue(item.id, "remarks", item.remarks) as string
//                                                     }
//                                                     onChange={(e) =>
//                                                       handleChecklistItemChange(item.id, "remarks", e.target.value)
//                                                     }
//                                                     placeholder="Enter remarks (optional)"
//                                                     className="min-w-[200px]"
//                                                   />
//                                                 </TableCell>
//                                               </TableRow>
//                                             ))}
//                                           </TableBody>
//                                         </Table>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Instructions Tab */}
//                 <TabsContent value="instructions" className="space-y-6 mt-6">
//                   <InstructionsTab
//                     instructions={instructions}
//                     onAddInstruction={handleAddInstruction}
//                     onInstructionChange={handleInstructionChange}
//                     onRemoveInstruction={handleRemoveInstruction}
//                     availableStations={availableStations}
//                     formData={formData}
//                     loadingStations={loadingStations}
//                     activeStationId={activeStationId}
//                     setActiveStationId={setActiveStationId}
//                     stationViewMode={stationViewMode}
//                     setStationViewMode={setStationViewMode}
//                     handleStationSelectionChange={handleStationSelectionChange}
//                     selectedStations={selectedStations}
//                     stationNotes={stationNotes}
//                     stationDocuments={stationDocuments}
//                     renderSpecificationInput={renderSpecificationInput}
//                     renderStationDocuments={renderStationDocuments}
//                     renderStationNotes={renderStationNotes}
//                     focusedInstructionIndex={focusedInstructionIndex}
//                     setFocusedInstructionIndex={setFocusedInstructionIndex}
//                     instructionRefs={instructionRefs}
//                   />
//                 </TabsContent>
//               </Tabs>

//               {/* Form Actions */}
//               <div className="flex justify-end gap-4">
//                 <Button variant="outline" onClick={onCancel}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isLoading || !isFormValid()}>
//                   {isLoading ? (
//                     <div className="flex items-center gap-2 animate-pulse">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                       <span>Updating...</span>
//                     </div>
//                   ) : (
//                     <>Update MPI</>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }




















// "use client"
// import React from "react"
// import type { FunctionComponent } from "react"
// import { useState, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   ArrowLeft,
//   Factory,
//   Info,
//   ClipboardList,
//   FileText,
//   Download,
//   Eye,
//   StickyNote,
//   Plus,
//   Trash2,
//   X,
//   Upload,
//   AlertCircle,
// } from "lucide-react"
// import type { MPI, UpdateMPIDto } from "./types"
// import { StationAPI } from "../stations/station-api"
// import type { Station } from "../stations/types"
// import { useToast } from "@/hooks/use-toast"
// import { MPIAPI } from "./mpi-api"
// import { MPIDocumentationAPI } from "./mpi-document-api"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"
// import { API_BASE_URL } from "@/lib/constants"
// import { ServiceAPI } from "../services/service-api"
// import type { Service } from "../services/types"

// // Enhanced InstructionsTab component with proper focus management and layout matching create mode
// const InstructionsTab: FunctionComponent<{
//   instructions: string[]
//   onAddInstruction: () => void
//   onInstructionChange: (index: number, value: string) => void
//   onRemoveInstruction: (index: number) => void
//   availableStations: Station[]
//   formData: any
//   loadingStations: boolean
//   activeStationId: string | null
//   setActiveStationId: (id: string | null) => void
//   stationViewMode: "specifications" | "documents" | "notes"
//   setStationViewMode: (mode: "specifications" | "documents" | "notes") => void
//   handleStationSelectionChange: (stationIds: string[]) => void
//   selectedStations: Station[]
//   stationNotes: Record<string, StationNote[]>
//   stationDocuments: Record<string, StationDocument[]>
//   renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
//   renderStationDocuments: (stationId: string) => React.ReactNode
//   renderStationNotes: (stationId: string) => React.ReactNode
//   focusedInstructionIndex: number | null
//   setFocusedInstructionIndex: (index: number | null) => void
//   instructionRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
// }> = React.memo(
//   ({
//     instructions,
//     onAddInstruction,
//     onInstructionChange,
//     onRemoveInstruction,
//     availableStations,
//     formData,
//     loadingStations,
//     activeStationId,
//     setActiveStationId,
//     stationViewMode,
//     setStationViewMode,
//     handleStationSelectionChange,
//     selectedStations,
//     stationNotes,
//     stationDocuments,
//     renderSpecificationInput,
//     renderStationDocuments,
//     renderStationNotes,
//     focusedInstructionIndex,
//     setFocusedInstructionIndex,
//     instructionRefs,
//   }) => {
//     return (
//       <div className="space-y-6">
//         {/* Stations Section */}
//         <Card>
//           <CardContent className="space-y-6 mt-5">
//             {loadingStations ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
//                   <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
//                 </div>
//               </div>
//             ) : availableStations.length === 0 ? (
//               <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
//               </div>
//             ) : (
//               <div className="flex gap-6 min-h-[600px]">
//                 {/* Left Sidebar - Station List */}
//                 <div className="w-1/4 border rounded-lg bg-gray-50">
//                   <div className="p-3 border-b bg-white rounded-t-lg">
//                     <h4 className="font-medium text-base">Stations</h4>
//                     <p className="text-xs text-muted-foreground">
//                       {formData.selectedStationIds.length > 0
//                         ? `${formData.selectedStationIds.length} selected`
//                         : "Click to select multiple"}
//                     </p>
//                   </div>
//                   <div className="p-2 overflow-y-auto h-[530px]">
//                     <div className="space-y-1">
//                       {availableStations.map((station) => {
//                         const noteCount = stationNotes[station.id]?.length || 0
//                         const docCount = stationDocuments[station.id]?.length || 0
//                         const isSelected = formData.selectedStationIds.includes(station.id)
//                         return (
//                           <div
//                             key={station.id}
//                             className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
//                               isSelected
//                                 ? "bg-blue-100 text-blue-900 border-blue-300"
//                                 : "bg-white hover:bg-gray-100 border-transparent"
//                             } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
//                             onClick={(e) => {
//                               e.preventDefault()
//                               e.stopPropagation()
//                               setActiveStationId(station.id)
//                               if (isSelected) {
//                                 handleStationSelectionChange(
//                                   formData.selectedStationIds.filter((id: string) => id !== station.id),
//                                 )
//                               } else {
//                                 handleStationSelectionChange([...formData.selectedStationIds, station.id])
//                               }
//                             }}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="truncate">{station.stationName}</span>
//                               <div className="flex gap-1">
//                                 {noteCount > 0 && (
//                                   <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
//                                     {noteCount}N
//                                   </Badge>
//                                 )}
//                                 {docCount > 0 && (
//                                   <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
//                                     {docCount}D
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 </div>
//                 {/* Right Panel - Station Details */}
//                 <div className="flex-1 border rounded-lg bg-gray-50">
//                   {!activeStationId ? (
//                     <div className="flex items-center justify-center h-full">
//                       <div className="text-center">
//                         <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <h4 className="font-medium text-gray-600 mb-2">No Station Selected</h4>
//                         <p className="text-sm text-muted-foreground">
//                           Select a station from the left sidebar to view its details
//                           {formData.selectedStationIds.length > 0 && (
//                             <span className="block mt-2 text-blue-600 font-medium">
//                               {formData.selectedStationIds.length} station
//                               {formData.selectedStationIds.length > 1 ? "s" : ""} selected for MPI
//                             </span>
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="h-full flex flex-col">
//                       <div className="p-4 border-b bg-white rounded-t-lg">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <Factory className="w-5 h-5 text-purple-600" />
//                             <div>
//                               <h4 className="font-medium text-lg">
//                                 {availableStations.find((s) => s.id === activeStationId)?.stationName}
//                               </h4>
//                               <p className="text-sm text-muted-foreground">Station Details</p>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             <Button
//                               type="button"
//                               size="sm"
//                               variant={stationViewMode === "specifications" ? "default" : "outline"}
//                               onClick={(e) => {
//                                 e.preventDefault()
//                                 e.stopPropagation()
//                                 setStationViewMode("specifications")
//                               }}
//                             >
//                               Specifications
//                             </Button>
//                             <Button
//                               type="button"
//                               size="sm"
//                               variant={stationViewMode === "documents" ? "default" : "outline"}
//                               onClick={(e) => {
//                                 e.preventDefault()
//                                 e.stopPropagation()
//                                 setStationViewMode("documents")
//                               }}
//                             >
//                               Files
//                               {stationDocuments[activeStationId]?.length > 0 && (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {stationDocuments[activeStationId].length}
//                                 </Badge>
//                               )}
//                             </Button>
//                             <Button
//                               type="button"
//                               size="sm"
//                               variant={stationViewMode === "notes" ? "default" : "outline"}
//                               onClick={(e) => {
//                                 e.preventDefault()
//                                 e.stopPropagation()
//                                 setStationViewMode("notes")
//                               }}
//                             >
//                               Notes
//                               {stationNotes[activeStationId]?.length > 0 && (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {stationNotes[activeStationId].length}
//                                 </Badge>
//                               )}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex-1 overflow-auto p-4">
//                         {stationViewMode === "specifications" && (
//                           <div>
//                             {(() => {
//                               const station = availableStations.find((s) => s.id === activeStationId)
//                               if (!station) return null
//                               if (!station.specifications || station.specifications.length === 0) {
//                                 return (
//                                   <div className="text-center py-6">
//                                     <p className="text-muted-foreground">
//                                       No specifications available for this station.
//                                     </p>
//                                   </div>
//                                 )
//                               }
//                               return (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   {station.specifications.map((spec) => (
//                                     <div key={spec.id} className="space-y-3 p-3 bg-white rounded border">
//                                       {renderSpecificationInput(spec, station.id)}
//                                     </div>
//                                   ))}
//                                 </div>
//                               )
//                             })()}
//                           </div>
//                         )}
//                         {stationViewMode === "documents" && renderStationDocuments(activeStationId)}
//                         {stationViewMode === "notes" && renderStationNotes(activeStationId)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//             {/* Selected Station Summary */}
//             {formData.selectedStationIds.length > 0 && (
//               <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <h4 className="font-medium text-blue-800 mb-3">Selected Stations</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedStations.map((station) => (
//                     <Badge key={station.id} variant="outline" className="bg-white">
//                       {station.stationName}
//                       {station.specifications && station.specifications.length > 0 && (
//                         <span className="ml-1 text-xs">({station.specifications.length} specs)</span>
//                       )}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Instructions Section - Now positioned below stations section like in create mode */}
//         <Card>
//           <CardContent className="mt-5">
//             <div className="space-y-4">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h4 className="text-lg font-semibold text-green-800">General Instructions</h4>
//                   <p className="text-sm text-muted-foreground">
//                     Add general safety and operational instructions for this MPI
//                   </p>
//                 </div>
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="outline"
//                   onClick={(e) => {
//                     e.preventDefault()
//                     e.stopPropagation()
//                     onAddInstruction()
//                     // Focus the new instruction input after it's added
//                     setTimeout(() => {
//                       setFocusedInstructionIndex(instructions.length)
//                     }, 0)
//                   }}
//                   className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Instruction
//                 </Button>
//               </div>
//               {instructions.length === 0 ? (
//                 <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                   <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm text-muted-foreground">No instructions added yet</p>
//                   <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {instructions.map((instruction, index) => (
//                     <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
//                       <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <Input
//                           ref={(el) => {
//                             instructionRefs.current[index] = el
//                           }}
//                           value={instruction}
//                           onChange={(e) => {
//                             setFocusedInstructionIndex(index)
//                             onInstructionChange(index, e.target.value)
//                           }}
//                           onFocus={() => setFocusedInstructionIndex(index)}
//                           onBlur={() => setFocusedInstructionIndex(null)}
//                           placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
//                           className="w-full"
//                         />
//                       </div>
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="ghost"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           onRemoveInstruction(index)
//                           // Clear focus tracking when removing instruction
//                           setFocusedInstructionIndex(null)
//                         }}
//                         className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-shrink-0"
//                       >
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   },
// )

// interface MPIEditProps {
//   mpi: MPI
//   onSubmit: (data: UpdateMPIDto) => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
// }

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   fileUrl?: string
//   unit?: string
// }

// interface ChecklistSection {
//   id: string
//   name: string
//   description: string
//   items: ChecklistItem[]
// }

// interface ChecklistItem {
//   id: string
//   description: string
//   required: boolean
//   remarks: string
//   category?: string
//   isActive: boolean
//   createdBy: string
//   sectionId: string
// }

// interface MPIDocumentation {
//   id?: string
//   file?: File
//   fileUrl?: string
//   description: string
//   fileName: string
//   originalFileName?: string
//   isUploaded?: boolean
// }

// interface StationNote {
//   id?: string
//   content: string
//   createdAt?: string
//   updatedAt?: string
// }

// interface StationDocument {
//   id: string
//   fileUrl: string
//   description: string
//   stationId: string
//   mpiId?: string
//   createdAt: string
//   updatedAt: string
// }

// // Helper function to safely convert order type to array
// const normalizeOrderType = (orderType: any): string[] => {
//   if (!orderType) return []
//   if (Array.isArray(orderType)) return orderType.filter((type) => typeof type === "string")
//   if (typeof orderType === "string") return [orderType]
//   return []
// }

// // Helper function to safely convert file action to array
// const normalizeFileAction = (fileAction: any): string[] => {
//   if (!fileAction) return []
//   if (Array.isArray(fileAction)) return fileAction.filter((action) => typeof action === "string")
//   if (typeof fileAction === "string") return [fileAction]
//   return []
// }

// export function MPIEdit({ mpi, onSubmit, onCancel, isLoading }: MPIEditProps) {
//   const [activeTab, setActiveTab] = useState("basic-info")
//   const [formData, setFormData] = useState({
//     jobId: mpi.jobId || "",
//     assemblyId: mpi.assemblyId || "",
//     customer: mpi.customer || "",
//     selectedStationIds: mpi.stations?.map((s) => s.id) || [],
//   })

//   // Order Form State - Initialize with existing data
//   const [orderFormData, setOrderFormData] = useState({
//     id: mpi.orderForms?.[0]?.id || "",
//     orderType: normalizeOrderType(mpi.orderForms?.[0]?.orderType),
//     distributionDate: mpi.orderForms?.[0]?.distributionDate
//       ? new Date(mpi.orderForms[0].distributionDate).toISOString().split("T")[0]
//       : "",
//     requiredBy: mpi.orderForms?.[0]?.requiredBy
//       ? new Date(mpi.orderForms[0].requiredBy).toISOString().split("T")[0]
//       : "",
//     internalOrderNumber: mpi.orderForms?.[0]?.internalOrderNumber || "",
//     revision: mpi.orderForms?.[0]?.revision || "",
//     otherAttachments: mpi.orderForms?.[0]?.otherAttachments || "",
//     fileAction: normalizeFileAction(mpi.orderForms?.[0]?.fileAction),
//     markComplete: mpi.orderForms?.[0]?.markComplete || false,
//     documentControlId: mpi.orderForms?.[0]?.documentControlId || "",
//     selectedServiceId: mpi.orderForms?.[0]?.services?.[0]?.id || "",
//   })

//   // Instructions state - Initialize with existing data
//   const [instructions, setInstructions] = useState<string[]>(mpi.Instruction || [])

//   // Add focus management for instruction inputs
//   const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
//   const instructionRefs = useRef<(HTMLInputElement | null)[]>([])

//   // Add these state variables after the instruction focus management states
//   const [focusedSpecificationId, setFocusedSpecificationId] = useState<string | null>(null)
//   const specificationRefs = useRef<Record<string, HTMLInputElement | null>>({})

//   // Service state
//   const [services, setServices] = useState<Service[]>([])
//   const [loadingServices, setLoadingServices] = useState(false)
//   const [selectedService, setSelectedService] = useState<Service | null>(null)

//   // Enums state
//   const [enums, setEnums] = useState<any>({})
//   const [loadingEnums, setLoadingEnums] = useState(false)

//   // Checklist template and existing checklist state
//   const [availableChecklistTemplate, setAvailableChecklistTemplate] = useState<ChecklistSection[]>([])
//   const [existingChecklists, setExistingChecklists] = useState<ChecklistSection[]>([])
//   const [loadingAvailableChecklist, setLoadingAvailableChecklist] = useState(false)

//   // Specification values state - Initialize with existing values
//   const [specificationValues, setSpecificationValues] = useState<Record<string, SpecificationValue>>(() => {
//     const initialValues: Record<string, SpecificationValue> = {}
//     console.log("🔍 Initializing specification values from MPI data:", mpi)
//     mpi.stations?.forEach((station) => {
//       console.log(`📍 Processing station: ${station.stationName} (${station.id})`)
//       station.specifications?.forEach((spec) => {
//         console.log(`🔧 Processing spec: ${spec.name} (${spec.id})`)
//         // Look for existing values in multiple places
//         let existingValue = null
//         // Method 1: Check stationSpecifications array
//         if (spec.stationSpecifications && spec.stationSpecifications.length > 0) {
//           existingValue = spec.stationSpecifications.find((ss) => ss.stationId === station.id)
//           console.log(`📋 Found in stationSpecifications:`, existingValue)
//         }
//         // Method 2: Check if there's a direct value on the spec
//         if (!existingValue && spec.value) {
//           existingValue = { value: spec.value, unit: spec.unit }
//           console.log(`📋 Found direct value on spec:`, existingValue)
//         }
//         // Method 3: Check station's specificationValues if it exists
//         if (!existingValue && station.specificationValues) {
//           const stationSpecValue = station.specificationValues.find((sv: any) => sv.specificationId === spec.id)
//           if (stationSpecValue) {
//             existingValue = { value: stationSpecValue.value, unit: stationSpecValue.unit }
//             console.log(`📋 Found in station specificationValues:`, existingValue)
//           }
//         }
//         if (existingValue && existingValue.value) {
//           initialValues[spec.id] = {
//             specificationId: spec.id,
//             value: existingValue.value,
//             unit: existingValue.unit || undefined,
//             fileUrl: existingValue.fileUrl || undefined,
//           }
//           console.log(`✅ Initialized spec ${spec.id} with value:`, initialValues[spec.id])
//         } else {
//           // Initialize with empty value for specs without existing data
//           initialValues[spec.id] = {
//             specificationId: spec.id,
//             value: "",
//             unit: undefined,
//             fileUrl: undefined,
//           }
//           console.log(`🆕 Initialized spec ${spec.id} with empty value`)
//         }
//       })
//     })
//     console.log("🎯 Final initial specification values:", initialValues)
//     return initialValues
//   })

//   const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())

//   // MPI Documentation State - Enhanced with proper filename handling
//   const [mpiDocumentation, setMpiDocumentation] = useState<MPIDocumentation[]>(() => {
//     // Initialize with existing MPI documents
//     return (
//       mpi.mpiDocs?.map((doc) => ({
//         id: doc.id,
//         fileUrl: doc.fileUrl,
//         description: doc.description,
//         fileName: doc.fileName || doc.description, // Use fileName if available, fallback to description
//         originalFileName: doc.originalFileName || doc.fileName || doc.description,
//         isUploaded: true,
//       })) || []
//     )
//   })

//   const [uploadingMpiDoc, setUploadingMpiDoc] = useState(false)

//   // Checklist modifications state - Initialize with existing checklist data
//   const [checklistModifications, setChecklistModifications] = useState<
//     Record<string, { required: boolean; remarks: string }>
//   >(() => {
//     const initialModifications: Record<string, { required: boolean; remarks: string }> = {}
//     // Initialize with existing checklist data
//     mpi.checklists?.forEach((checklist) => {
//       checklist.checklistItems?.forEach((item, itemIndex) => {
//         const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
//         initialModifications[itemId] = {
//           required: item.required,
//           remarks: item.remarks,
//         }
//       })
//     })
//     console.log("Initial checklist modifications:", initialModifications)
//     return initialModifications
//   })

//   const [availableStations, setAvailableStations] = useState<Station[]>([])
//   const [loadingStations, setLoadingStations] = useState(false)
//   const [selectedStations, setSelectedStations] = useState<Station[]>([])

//   // Station view state for instructions tab
//   const [activeStationId, setActiveStationId] = useState<string | null>(null)
//   const [stationViewMode, setStationViewMode] = useState<"specifications" | "documents" | "notes">("specifications")

//   // Station notes state
//   const [stationNotes, setStationNotes] = useState<Record<string, StationNote[]>>({})
//   const [loadingNotes, setLoadingNotes] = useState<Set<string>>(new Set())
//   const [newNoteContent, setNewNoteContent] = useState("")
//   const [addingNote, setAddingNote] = useState(false)

//   // Station documents state
//   const [stationDocuments, setStationDocuments] = useState<Record<string, StationDocument[]>>({})
//   const [loadingDocuments, setLoadingDocuments] = useState<Set<string>>(new Set())
//   const [uploadingStationDoc, setUploadingStationDoc] = useState(false)

//   // Validation state
//   const [existingJobIds, setExistingJobIds] = useState<string[]>([])
//   const [existingAssemblyIds, setExistingAssemblyIds] = useState<string[]>([])
//   const [existingDocumentControlIds, setExistingDocumentControlIds] = useState<string[]>([])
//   const [checkingIds, setCheckingIds] = useState(false)

//   const { toast } = useToast()

//   // Initialize station notes from MPI data - ENHANCED
//   useEffect(() => {
//     const initialNotes: Record<string, StationNote[]> = {}
//     console.log("🔍 Initializing station notes from MPI data:", mpi)
//     if (mpi.stations && Array.isArray(mpi.stations)) {
//       mpi.stations.forEach((station) => {
//         console.log(`📍 Processing station notes for: ${station.stationName} (${station.id})`)
//         let stationNotesArray: StationNote[] = []
//         // Check multiple possible locations for notes in the station data
//         if (station.Note) {
//           if (Array.isArray(station.Note)) {
//             // Handle array of notes
//             stationNotesArray = station.Note.filter(
//               (note) => note && typeof note === "string" && note.trim() !== "",
//             ).map((note, index) => ({
//               id: `note-${station.id}-${index}-${Date.now()}`,
//               content: note.trim(),
//               createdAt: new Date().toISOString(),
//             }))
//             console.log(`📝 Found Note array for station ${station.id}:`, stationNotesArray)
//           } else if (typeof station.Note === "string" && station.Note.trim() !== "") {
//             // Handle single note string
//             stationNotesArray = [
//               {
//                 id: `note-${station.id}-0-${Date.now()}`,
//                 content: station.Note.trim(),
//                 createdAt: new Date().toISOString(),
//               },
//             ]
//             console.log(`📝 Found single Note for station ${station.id}:`, stationNotesArray)
//           }
//         }
//         // Also check for 'notes' field (alternative naming)
//         if (stationNotesArray.length === 0 && station.notes && Array.isArray(station.notes)) {
//           stationNotesArray = station.notes
//             .filter((note) => note && (typeof note === "string" || (note.content && note.content.trim())))
//             .map((note, index) => ({
//               id: note.id || `note-${station.id}-${index}-${Date.now()}`,
//               content: typeof note === "string" ? note : note.content,
//               createdAt: note.createdAt || new Date().toISOString(),
//             }))
//           console.log(`📝 Found notes array for station ${station.id}:`, stationNotesArray)
//         }
//         initialNotes[station.id] = stationNotesArray
//         console.log(`✅ Initialized ${stationNotesArray.length} notes for station ${station.id}`)
//       })
//     }
//     console.log("🎯 Final initial station notes:", initialNotes)
//     setStationNotes(initialNotes)
//   }, [mpi.stations])

//   // Initialize station documents from MPI data - ENHANCED
//   useEffect(() => {
//     const initialDocs: Record<string, StationDocument[]> = {}
//     console.log("🔍 Initializing station documents from MPI data:", mpi)
//     if (mpi.stations && Array.isArray(mpi.stations)) {
//       mpi.stations.forEach((station) => {
//         console.log(`📍 Processing station documents for: ${station.stationName} (${station.id})`)
//         let stationDocsArray: StationDocument[] = []
//         // Check multiple possible locations for documents in the station data
//         const documentSources = [
//           station.documentations,
//           station.documents,
//           station.stationDocuments,
//           station.stationMpiDocs,
//         ]
//         for (const docSource of documentSources) {
//           if (docSource && Array.isArray(docSource) && docSource.length > 0) {
//             stationDocsArray = docSource
//               .filter((doc) => doc && (doc.fileUrl || doc.url))
//               .map((doc, index) => ({
//                 id: doc.id || `doc-${station.id}-${index}-${Date.now()}`,
//                 fileUrl: doc.fileUrl || doc.url,
//                 description: doc.description || doc.fileName || doc.originalName || "Untitled Document",
//                 stationId: station.id,
//                 mpiId: doc.mpiId || mpi.id,
//                 createdAt: doc.createdAt || new Date().toISOString(),
//                 updatedAt: doc.updatedAt || new Date().toISOString(),
//               }))
//             if (stationDocsArray.length > 0) {
//               console.log(`📄 Found documents for station ${station.id}:`, stationDocsArray)
//               break // Use the first source that has documents
//             }
//           }
//         }
//         initialDocs[station.id] = stationDocsArray
//         console.log(`✅ Initialized ${stationDocsArray.length} documents for station ${station.id}`)
//       })
//     }
//     console.log("🎯 Final initial station documents:", initialDocs)
//     setStationDocuments(initialDocs)
//   }, [mpi.stations])

//   // Restore focus to instruction input after re-render
//   useEffect(() => {
//     if (focusedInstructionIndex !== null && instructionRefs.current[focusedInstructionIndex]) {
//       const input = instructionRefs.current[focusedInstructionIndex]
//       if (input) {
//         const cursorPosition = input.selectionStart || 0
//         // Use setTimeout to ensure the DOM has updated
//         setTimeout(() => {
//           input.focus()
//           input.setSelectionRange(cursorPosition, cursorPosition)
//         }, 0)
//       }
//     }
//   }, [instructions, focusedInstructionIndex])

//   // Add this useEffect after the instruction focus useEffect
//   useEffect(() => {
//     if (focusedSpecificationId && specificationRefs.current[focusedSpecificationId]) {
//       const input = specificationRefs.current[focusedSpecificationId]
//       if (input) {
//         const cursorPosition = input.selectionStart || 0
//         setTimeout(() => {
//           input.focus()
//           input.setSelectionRange(cursorPosition, cursorPosition)
//         }, 0)
//       }
//     }
//   }, [specificationValues, focusedSpecificationId])

//   // Load existing IDs for validation (excluding current MPI)
//   const loadExistingIds = async () => {
//     try {
//       setCheckingIds(true)
//       const mpis = await MPIAPI.getAllMPIs()
//       // Filter out current MPI from validation
//       const otherMpis = mpis.filter((m) => m.id !== mpi.id)
//       const jobIds = otherMpis.map((m) => m.jobId.toLowerCase())
//       const assemblyIds = otherMpis.map((m) => m.assemblyId.toLowerCase())
//       const documentControlIds = otherMpis
//         .filter((m) => m.orderForms && m.orderForms.length > 0)
//         .flatMap((m) => m.orderForms.map((form) => form.documentControlId))
//         .filter(Boolean)
//         .map((id) => id.toLowerCase())
//       setExistingJobIds(jobIds)
//       setExistingAssemblyIds(assemblyIds)
//       setExistingDocumentControlIds(documentControlIds)
//     } catch (error) {
//       console.error("Failed to load existing IDs:", error)
//     } finally {
//       setCheckingIds(false)
//     }
//   }

//   // Validation functions
//   const validateJobId = (jobId: string): string | null => {
//     if (!jobId.trim()) return "Job ID is required"
//     if (jobId.length < 2) return "Job ID must be at least 2 characters"
//     if (existingJobIds.includes(jobId.toLowerCase())) {
//       return `Job ID "${jobId}" already exists. Please use a different Job ID.`
//     }
//     return null
//   }

//   const validateAssemblyId = (assemblyId: string): string | null => {
//     if (!assemblyId.trim()) return "Assembly ID is required"
//     if (assemblyId.length < 2) return "Assembly ID must be at least 2 characters"
//     if (existingAssemblyIds.includes(assemblyId.toLowerCase())) {
//       return `Assembly ID "${assemblyId}" already exists. Please use a different Assembly ID.`
//     }
//     return null
//   }

//   const validateDocumentControlId = (documentControlId: string): string | null => {
//     if (!documentControlId.trim()) return null
//     if (documentControlId.length < 2) return "Document Control ID must be at least 2 characters"
//     if (existingDocumentControlIds.includes(documentControlId.toLowerCase())) {
//       return `Document Control ID "${documentControlId}" already exists. Please use a different ID.`
//     }
//     ;`Document Control ID "${documentControlId}" already exists. Please use a different ID.`
//   }

//   // Instruction handlers
//   const handleAddInstruction = () => {
//     setInstructions((prev) => [...prev, ""])
//   }

//   const handleInstructionChange = (index: number, value: string) => {
//     setInstructions((prev) => prev.map((instruction, i) => (i === index ? value : instruction)))
//   }

//   const handleRemoveInstruction = (index: number) => {
//     setInstructions((prev) => prev.filter((_, i) => i !== index))
//     toast({
//       title: "Instruction Removed",
//       description: "Instruction has been removed from the list.",
//     })
//   }

//   // Station notes handlers
//   const handleAddNote = async () => {
//     if (!activeStationId || !newNoteContent.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter note content.",
//         variant: "destructive",
//       })
//       return
//     }
//     setAddingNote(true)
//     try {
//       const newNote: StationNote = {
//         id: `note-${activeStationId}-${Date.now()}`,
//         content: newNoteContent.trim(),
//         createdAt: new Date().toISOString(),
//       }
//       setStationNotes((prev) => ({
//         ...prev,
//         [activeStationId]: [...(prev[activeStationId] || []), newNote],
//       }))
//       setNewNoteContent("")
//       toast({
//         title: "Success",
//         description: "Note added successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to add note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add note. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setAddingNote(false)
//     }
//   }

//   const handleDeleteNote = async (stationId: string, noteId: string) => {
//     try {
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: prev[stationId]?.filter((note) => note.id !== noteId) || [],
//       }))
//       toast({
//         title: "Success",
//         description: "Note deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete note. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Station document handlers
//   const handleStationDocumentUpload = async (file: File, description: string, fileName?: string) => {
//     if (!activeStationId) {
//       toast({
//         title: "Error",
//         description: "No station selected.",
//         variant: "destructive",
//       })
//       return
//     }
//     setUploadingStationDoc(true)
//     try {
//       const finalDescription = description.trim() || file.name
//       const finalFileName = fileName?.trim() || file.name
//       console.log("📤 Station document upload:", {
//         file: file.name,
//         description: finalDescription,
//         fileName: finalFileName,
//         stationId: activeStationId,
//         mpiId: mpi.id,
//       })
//       if (!mpi.id) {
//         // For new MPIs, queue the document locally
//         console.log("💾 QUEUING station document locally - MPI not created yet...")
//         if (file.size > 10 * 1024 * 1024) {
//           throw new Error("File size exceeds 10MB limit")
//         }
//         const newDoc = {
//           id: `temp-${Date.now()}`,
//           file: file,
//           description: finalDescription,
//           fileName: finalFileName,
//           stationId: activeStationId,
//           isUploaded: false,
//         }
//         setStationDocuments((prev) => ({
//           ...prev,
//           [activeStationId]: [...(prev[activeStationId] || []), newDoc],
//         }))
//         toast({
//           title: "✅ Document Queued Successfully",
//           description: `"${finalDescription}" will be uploaded when the MPI is saved.`,
//         })
//       } else {
//         // For existing MPIs, upload directly
//         console.log("📤 Uploading station document directly to existing MPI...")
//         const formData = new FormData()
//         formData.append("files", file)
//         formData.append("stationId", activeStationId)
//         formData.append("description", finalDescription)
//         formData.append("mpiId", mpi.id)
//         formData.append("originalName", file.name)
//         const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
//           method: "POST",
//           body: formData,
//         })
//         if (!response.ok) {
//           const errorText = await response.text()
//           console.error("❌ Direct upload failed:", errorText)
//           throw new Error(`Upload failed: ${response.status} - ${errorText}`)
//         }
//         const result = await response.json()
//         console.log("✅ Station document uploaded successfully:", result)
//         // Add to existing documents for the station
//         setStationDocuments((prev) => ({
//           ...prev,
//           [activeStationId]: [
//             ...(prev[activeStationId] || []),
//             {
//               id: result.id || `uploaded-${Date.now()}`,
//               fileUrl: result.fileUrl,
//               description: result.description || finalDescription,
//               fileName: result.fileName || finalFileName,
//               stationId: activeStationId,
//               isUploaded: true,
//             },
//           ],
//         }))
//         toast({
//           title: "Success",
//           description: "Station document uploaded successfully.",
//         })
//       }
//     } catch (error) {
//       console.error("Station document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingStationDoc(false)
//     }
//   }

//   const handleDeleteStationDocument = async (stationId: string, documentId: string) => {
//     try {
//       // Check if it's an uploaded document or queued document
//       const stationDocs = stationDocuments[stationId] || []
//       const doc = stationDocs.find((d) => d.id === documentId)
//       if (doc && doc.isUploaded && doc.id && !doc.id.startsWith("temp-")) {
//         // Delete uploaded document via API
//         await StationMpiDocAPI.delete(documentId)
//       }
//       // Remove from local state
//       setStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: prev[stationId]?.filter((doc) => doc.id !== documentId) || [],
//       }))
//       toast({
//         title: "Success",
//         description: "Document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete document. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Enhanced MPI Documentation handlers with proper filename support
//   const handleMpiDocumentUpload = async (file: File, description: string) => {
//     setUploadingMpiDoc(true)
//     try {
//       if (!file) {
//         throw new Error("No file selected")
//       }
//       const finalDescription = description.trim() || file.name
//       console.log("📤 MPI document upload:", {
//         originalFile: file.name,
//         description: finalDescription,
//         fileSize: file.size,
//       })
//       // For edit mode, upload immediately since MPI already exists
//       const result = await MPIDocumentationAPI.uploadDocument(mpi.id, file, finalDescription, file.name)
//       const newDoc: MPIDocumentation = {
//         id: result.id,
//         fileUrl: result.fileUrl,
//         description: result.description,
//         fileName: file.name,
//         originalFileName: file.name,
//         isUploaded: true,
//       }
//       setMpiDocumentation((prev) => [...prev, newDoc])
//       toast({
//         title: "Success",
//         description: "Document uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("Document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingMpiDoc(false)
//     }
//   }

//   const removeMpiDocument = async (index: number) => {
//     const doc = mpiDocumentation[index]
//     if (doc.id && doc.isUploaded) {
//       try {
//         await MPIDocumentationAPI.deleteDocument(doc.id)
//         toast({
//           title: "Success",
//           description: "Document deleted successfully.",
//         })
//       } catch (error) {
//         console.error("Failed to delete document:", error)
//         toast({
//           title: "Error",
//           description: "Failed to delete document.",
//           variant: "destructive",
//         })
//         return
//       }
//     }
//     setMpiDocumentation((prev) => prev.filter((_, i) => i !== index))
//   }

//   useEffect(() => {
//     loadStations()
//     loadEnums()
//     loadChecklistData()
//     loadExistingIds()
//     loadServices() // Add this line
//   }, [])

//   useEffect(() => {
//     // Update selected stations when formData.selectedStationIds changes
//     const selected = availableStations.filter((station) => formData.selectedStationIds.includes(station.id))
//     setSelectedStations(selected)
//   }, [formData.selectedStationIds, availableStations])

//   const loadStations = async () => {
//     try {
//       setLoadingStations(true)
//       const stations = await StationAPI.getAllStations()
//       setAvailableStations(stations)
//     } catch (error) {
//       console.error("Failed to load stations:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load stations. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingStations(false)
//     }
//   }

//   const loadEnums = async () => {
//     try {
//       setLoadingEnums(true)
//       const enumsData = await MPIAPI.getEnums()
//       setEnums(enumsData)
//     } catch (error) {
//       console.error("Failed to load enums:", error)
//       toast({
//         title: "Warning",
//         description: "Failed to load form options.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingEnums(false)
//     }
//   }

//   const loadChecklistData = async () => {
//     try {
//       setLoadingAvailableChecklist(true)
//       // Load existing checklists from MPI - show ONLY REQUIRED items (like details page)
//       const existingChecklistSections: ChecklistSection[] = []
//       const existingItemDescriptions = new Set<string>()
//       if (mpi.checklists && mpi.checklists.length > 0) {
//         mpi.checklists.forEach((checklist, checklistIndex) => {
//           if (checklist.checklistItems && checklist.checklistItems.length > 0) {
//             // Filter to only show required items (exactly like details page)
//             const requiredItems = checklist.checklistItems.filter((item) => item.required === true)
//             if (requiredItems.length > 0) {
//               existingChecklistSections.push({
//                 id: `existing-section-${checklistIndex}`,
//                 name: checklist.name,
//                 description: `${checklist.name} - Existing required checklist items`,
//                 items: requiredItems.map((item, itemIndex) => {
//                   // Track this item as existing
//                   existingItemDescriptions.add(item.description.toLowerCase().trim())
//                   return {
//                     id: `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
//                     description: item.description,
//                     required: item.required,
//                     remarks: item.remarks,
//                     category: item.category || checklist.name,
//                     isActive: item.isActive,
//                     createdBy: item.createdBy,
//                     sectionId: `existing-section-${checklistIndex}`,
//                   }
//                 }),
//               })
//             }
//           }
//         })
//       }
//       setExistingChecklists(existingChecklistSections)
//       // Load available checklist template and filter out existing items
//       const template = await MPIAPI.getChecklistTemplate()
//       console.log("📦 Available checklist template loaded:", template)
//       if (template && Array.isArray(template)) {
//         const validSections = template
//           .filter(
//             (section) =>
//               section && typeof section === "object" && section.name && Array.isArray(section.checklistItems),
//           )
//           .map((section, sectionIndex) => {
//             // Filter out items that already exist in the MPI
//             const availableItems = (section.checklistItems || [])
//               .filter((item: any) => {
//                 const itemDescription = item.description?.toLowerCase().trim()
//                 return itemDescription && !existingItemDescriptions.has(itemDescription)
//               })
//               .map((item: any, itemIndex: number) => ({
//                 id: `available-${section.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
//                 description: item.description || "No description",
//                 required: false, // Default to No for available items
//                 remarks: "",
//                 category: item.category || section.name,
//                 isActive: item.isActive !== undefined ? item.isActive : true,
//                 createdBy: item.createdBy || "System",
//                 sectionId: `available-section-${sectionIndex}`,
//               }))
//             return availableItems.length > 0
//               ? {
//                   id: `available-section-${sectionIndex}`,
//                   name: section.name,
//                   description: `${section.name} quality control items`,
//                   items: availableItems,
//                 }
//               : null
//           })
//           .filter(Boolean)
//         setAvailableChecklistTemplate(validSections)
//       } else {
//         setAvailableChecklistTemplate([])
//       }
//     } catch (error) {
//       console.error("Failed to load checklist data:", error)
//       setAvailableChecklistTemplate([])
//       setExistingChecklists([])
//     } finally {
//       setLoadingAvailableChecklist(false)
//     }
//   }

//   const loadServices = async () => {
//     try {
//       setLoadingServices(true)
//       const fetchedServices = await ServiceAPI.getAll()
//       setServices(fetchedServices)
//       // Set selected service if one exists in the order form
//       if (orderFormData.selectedServiceId && fetchedServices.length > 0) {
//         const service = fetchedServices.find((s) => s.id === orderFormData.selectedServiceId)
//         setSelectedService(service || null)
//       }
//     } catch (error) {
//       console.error("Failed to fetch services:", error)
//       toast({
//         title: "Warning",
//         description: "Failed to load services. Please try again.",
//         variant: "destructive",
//       })
//       setServices([])
//     } finally {
//       setLoadingServices(false)
//     }
//   }

//   const handleChecklistItemChange = (itemId: string, field: "required" | "remarks", value: boolean | string) => {
//     setChecklistModifications((prev) => ({
//       ...prev,
//       [itemId]: {
//         ...prev[itemId],
//         [field]: value,
//       },
//     }))
//   }

//   const getChecklistItemValue = (itemId: string, field: "required" | "remarks", defaultValue: boolean | string) => {
//     return checklistModifications[itemId]?.[field] ?? defaultValue
//   }

//   const handleOrderFormChange = (field: string, value: string | boolean | string[]) => {
//     setOrderFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleServiceChange = (serviceId: string) => {
//     const service = services.find((s) => s.id === serviceId)
//     if (service) {
//       setSelectedService(service)
//       handleOrderFormChange("selectedServiceId", serviceId)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log("🔄 Starting form submission...")
//     // Validation - Reload existing IDs first
//     await loadExistingIds()
//     // Enhanced validation with better error messages
//     const jobIdError = validateJobId(formData.jobId)
//     const assemblyIdError = validateAssemblyId(formData.assemblyId)
//     const documentControlIdError = orderFormData.documentControlId
//       ? validateDocumentControlId(orderFormData.documentControlId)
//       : null

//     const validationErrors = []
//     if (jobIdError) validationErrors.push(`Job ID: ${jobIdError}`)
//     if (assemblyIdError) validationErrors.push(`Assembly ID: ${assemblyIdError}`)
//     if (documentControlIdError) validationErrors.push(`Document Control ID: ${documentControlIdError}`)

//     // Check for required fields
//     if (!formData.jobId.trim()) validationErrors.push("Job ID is required")
//     if (!formData.assemblyId.trim()) validationErrors.push("Assembly ID is required")

//     if (validationErrors.length > 0) {
//       toast({
//         title: "❌ Validation Failed",
//         description: (
//           <div className="space-y-2">
//             <p className="font-semibold">Please fix the following issues:</p>
//             <ul className="list-disc list-inside space-y-1">
//               {validationErrors.map((error, index) => (
//                 <li key={index} className="text-sm">
//                   {error}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ),
//         variant: "destructive",
//         duration: 10000,
//       })
//       setActiveTab("basic-info")
//       return
//     }

//     console.log("Selected stations:", formData.selectedStationIds)
//     console.log("Current specification values:", specificationValues)
//     console.log("Current checklist modifications:", checklistModifications)

//     // Prepare stations data - Send ALL selected stations with their specification values in the correct format
//     const stationsData = formData.selectedStationIds
//       .map((stationId) => {
//         const station = selectedStations.find((s) => s.id === stationId)
//         if (!station) return null

//         // Get specification values for this station in the format the backend expects
//         const stationSpecificationValues =
//           station.specifications?.map((spec) => {
//             const specValue = specificationValues[spec.id]
//             return {
//               specificationId: spec.id,
//               value: specValue?.value || "", // Send current value or empty string
//               ...(specValue?.unit && { unit: specValue.unit }),
//               ...(specValue?.fileUrl && { fileUrl: specValue.fileUrl }),
//             }
//           }) || []

//         // Include station notes in the update
//         const stationNotesArray = stationNotes[stationId]?.map((note) => note.content) || []

//         return {
//           id: station.id,
//           stationId: station.stationId,
//           stationName: station.stationName,
//           status: station.status,
//           description: station.description || "",
//           location: station.location || "",
//           operator: station.operator || "",
//           priority: station.priority || 1,
//           Note: stationNotesArray,
//           // Send specification values in the format the backend expects
//           specificationValues: stationSpecificationValues,
//         }
//       })
//       .filter(Boolean)

//     console.log("📤 Stations data being sent:", JSON.stringify(stationsData, null, 2))
//     console.log("🔧 Current specification values:", specificationValues)

//     // Prepare existing checklist updates with ACTUAL database IDs
//     const existingChecklistUpdates: any[] = []
//     if (mpi.checklists && mpi.checklists.length > 0) {
//       mpi.checklists.forEach((checklist) => {
//         const updatedItems: any[] = []
//         let hasChanges = false
//         if (checklist.checklistItems && checklist.checklistItems.length > 0) {
//           checklist.checklistItems.forEach((item, itemIndex) => {
//             const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
//             const modifications = checklistModifications[itemId]
//             if (modifications) {
//               // Check if there are actual changes
//               if (modifications.required !== item.required || modifications.remarks !== item.remarks) {
//                 hasChanges = true
//               }
//               updatedItems.push({
//                 id: item.id, // Use the actual database ID from the MPI
//                 description: item.description,
//                 required: modifications.required,
//                 remarks: modifications.remarks,
//                 category: item.category,
//                 createdBy: item.createdBy,
//                 isActive: item.isActive,
//               })
//             }
//           })
//         }
//         // Only include checklist if there are actual changes
//         if (hasChanges && updatedItems.length > 0) {
//           existingChecklistUpdates.push({
//             id: checklist.id, // Use the actual checklist database ID
//             name: checklist.name,
//             checklistItems: updatedItems,
//           })
//         }
//       })
//     }

//     // Prepare new checklists from available template
//     const newChecklists: any[] = []
//     availableChecklistTemplate.forEach((section) => {
//       const newItems: any[] = []
//       section.items.forEach((item) => {
//         const modifications = checklistModifications[item.id]
//         if (modifications && modifications.required) {
//           newItems.push({
//             description: item.description,
//             required: modifications.required,
//             remarks: modifications.remarks || "",
//             createdBy: item.createdBy || "System",
//             isActive: item.isActive !== undefined ? item.isActive : true,
//             category: item.category || section.name,
//           })
//         }
//       })
//       if (newItems.length > 0) {
//         newChecklists.push({
//           name: section.name,
//           checklistItems: newItems,
//         })
//       }
//     })

//     // Prepare complete submission data matching backend expectations
//     const submitData: any = {
//       jobId: formData.jobId,
//       assemblyId: formData.assemblyId,
//       customer: formData.customer || null,
//     }

//     // FIXED: Always include order forms for updates with proper structure
//     const orderFormSubmissionData = {
//       id: orderFormData.id || undefined, // Include ID if exists for update
//       OrderType: orderFormData.orderType,
//       distributionDate: orderFormData.distributionDate ? new Date(orderFormData.distributionDate).toISOString() : null,
//       requiredBy: orderFormData.requiredBy ? new Date(orderFormData.requiredBy).toISOString() : null,
//       internalOrderNumber: orderFormData.internalOrderNumber || null,
//       revision: orderFormData.revision || null,
//       otherAttachments: orderFormData.otherAttachments || null,
//       fileAction: orderFormData.fileAction,
//       markComplete: orderFormData.markComplete,
//       documentControlId: orderFormData.documentControlId || null,
//       // Add service ID mapping
//       ...(orderFormData.selectedServiceId && {
//         serviceIds: [orderFormData.selectedServiceId], // Convert single ID to array
//       }),
//     }

//     // Send as array to match backend expectation
//     submitData.orderForms = [orderFormSubmissionData]

//     console.log("📋 Order form data being sent:", JSON.stringify(submitData.orderForms, null, 2))

//     // Add stations with specifications if they exist
//     if (stationsData.length > 0) {
//       submitData.stations = stationsData
//     }

//     // Combine existing and new checklists for the backend
//     const allChecklists = [...existingChecklistUpdates, ...newChecklists]
//     if (allChecklists.length > 0) {
//       submitData.checklists = allChecklists
//     }

//     // Add instructions - always include for updates (use backend field name 'Instruction')
//     submitData.Instruction = instructions.filter((instruction) => instruction.trim() !== "")

//     // Add uploaded documents to submission data with both description and fileName
//     if (mpiDocumentation.length > 0) {
//       const uploadedDocs = mpiDocumentation
//         .filter((doc) => doc.isUploaded && doc.fileUrl)
//         .map((doc) => ({
//           id: doc.id,
//           fileUrl: doc.fileUrl,
//           description: doc.description,
//           fileName: doc.fileName, // Include fileName for backend
//           originalFileName: doc.originalFileName, // Include original filename
//         }))
//       if (uploadedDocs.length > 0) {
//         submitData.mpiDocs = uploadedDocs
//       }
//     }

//     console.log("📤 Submitting MPI update data:", JSON.stringify(submitData, null, 2))

//     try {
//       await onSubmit(submitData as UpdateMPIDto)
//       if (newChecklists.length > 0) {
//         toast({
//           title: "Success",
//           description: `MPI updated successfully with ${newChecklists.length} new checklist section(s) added.`,
//         })
//       } else {
//         toast({
//           title: "Success",
//           description: "MPI updated successfully.",
//         })
//       }
//     } catch (error: any) {
//       console.error("Form submission error:", error)
//       // Handle specific error types
//       if (error.message?.includes("Unique constraint failed")) {
//         if (error.message?.includes("documentControlId")) {
//           toast({
//             title: "🚫 Duplicate Document Control ID",
//             description: `Document Control ID "${orderFormData.documentControlId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         } else if (error.message?.includes("jobId")) {
//           toast({
//             title: "🚫 Duplicate Job ID",
//             description: `Job ID "${formData.jobId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         } else if (error.message?.includes("assemblyId")) {
//           toast({
//             title: "🚫 Duplicate Assembly ID",
//             description: `Assembly ID "${formData.assemblyId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         }
//       }
//       toast({
//         title: "Submission Error",
//         description: error.message || "Failed to update MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleStationSelectionChange = (stationIds: string[]) => {
//     setFormData((prev) => ({ ...prev, selectedStationIds: stationIds }))
//   }

//   const handleSpecificationValueChange = (specificationId: string, value: string, unit?: string) => {
//     console.log("🔧 Updating specification:", specificationId, "with value:", value, "unit:", unit)
//     setSpecificationValues((prev) => {
//       const currentSpec = prev[specificationId] || { specificationId, value: "", unit: undefined, fileUrl: undefined }
//       const updated = {
//         ...prev,
//         [specificationId]: {
//           ...currentSpec,
//           specificationId,
//           value,
//           unit: unit !== undefined ? unit : currentSpec.unit,
//         },
//       }
//       console.log("🔧 Updated specification values:", updated)
//       return updated
//     })
//   }

//   const handleFileUpload = async (specificationId: string, file: File, stationId: string, unit?: string) => {
//     console.log("📁 Starting file upload for spec:", specificationId, "station:", stationId)
//     setUploadingFiles((prev) => new Set(prev).add(specificationId))
//     try {
//       const result = await StationAPI.uploadStationSpecificationFile(file, specificationId, stationId, unit)
//       console.log("📁 File upload result:", result)
//       setSpecificationValues((prev) => {
//         const updated = {
//           ...prev,
//           [specificationId]: {
//             specificationId,
//             value: result.value || file.name,
//             fileUrl: result.fileUrl,
//             unit: unit || prev[specificationId]?.unit,
//           },
//         }
//         console.log("📁 Updated specification values after upload:", updated)
//         return updated
//       })
//       toast({
//         title: "Success",
//         description: "File uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("File upload error:", error)
//       toast({
//         title: "Error",
//         description: "Failed to upload file. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingFiles((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(specificationId)
//         return newSet
//       })
//     }
//   }

//   const renderSpecificationInput = (spec: any, stationId: string) => {
//     const specValue = specificationValues[spec.id]
//     const isUploading = uploadingFiles.has(spec.id)
//     // Only log if there's an issue or for debugging specific specs
//     if (!specValue && spec.required) {
//       console.log(`⚠️ Required spec ${spec.name} (${spec.id}) has no value`)
//     }

//     switch (spec.inputType) {
//       case "TEXT":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <Input
//               ref={(el) => {
//                 specificationRefs.current[spec.id] = el
//               }}
//               id={`spec-${spec.id}`}
//               value={specValue?.value || ""}
//               onChange={(e) => {
//                 setFocusedSpecificationId(spec.id)
//                 handleSpecificationValueChange(spec.id, e.target.value)
//               }}
//               onFocus={() => setFocusedSpecificationId(spec.id)}
//               onBlur={() => setFocusedSpecificationId(null)}
//               placeholder={`Enter ${spec.name.toLowerCase()}`}
//               className="h-10"
//             />
//           </div>
//         )
//       case "number":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <div className="flex gap-2">
//               <Input
//                 ref={(el) => {
//                   specificationRefs.current[spec.id] = el
//                 }}
//                 id={`spec-${spec.id}`}
//                 type="number"
//                 value={specValue?.value || ""}
//                 onChange={(e) => {
//                   setFocusedSpecificationId(spec.id)
//                   handleSpecificationValueChange(spec.id, e.target.value, specValue?.unit)
//                 }}
//                 onFocus={() => setFocusedSpecificationId(spec.id)}
//                 onBlur={() => setFocusedSpecificationId(null)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10 flex-1"
//               />
//               <Input
//                 placeholder="Unit"
//                 value={specValue?.unit || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
//                 className="h-10 w-20"
//               />
//             </div>
//           </div>
//         )
//       case "CHECKBOX":
//         return (
//           <div className="space-y-2">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id={`spec-${spec.id}`}
//                 checked={specValue?.value === "true"}
//                 onCheckedChange={(checked) => handleSpecificationValueChange(spec.id, checked ? "true" : "false")}
//               />
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//             </div>
//           </div>
//         )
//       case "DROPDOWN":
//         const suggestions = spec.suggestions || []
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <Select
//               value={specValue?.value || ""}
//               onValueChange={(value) => handleSpecificationValueChange(spec.id, value)}
//             >
//               <SelectTrigger className="h-10">
//                 <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
//               </SelectTrigger>
//               <SelectContent>
//                 {suggestions.map((suggestion: string, index: number) => (
//                   <SelectItem key={index} value={suggestion}>
//                     {suggestion}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )
//       case "FILE_UPLOAD":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <Input
//                   id={`spec-${spec.id}`}
//                   type="file"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0]
//                     if (file) {
//                       handleFileUpload(spec.id, file, stationId, specValue?.unit)
//                     }
//                   }}
//                   accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
//                   className="cursor-pointer flex-1"
//                   disabled={isUploading}
//                 />
//                 {isUploading && (
//                   <div className="flex items-center gap-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
//                     <span className="text-xs text-muted-foreground">Uploading...</span>
//                   </div>
//                 )}
//               </div>
//               <Input
//                 placeholder="Unit (optional)"
//                 value={specValue?.unit || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
//                 className="h-10 w-32"
//               />
//               {specValue?.fileUrl && (
//                 <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
//                   <FileText className="w-4 h-4 text-green-600" />
//                   <span className="text-sm text-green-800">File uploaded successfully</span>
//                   <a
//                     href={specValue.fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-xs text-blue-600 hover:underline"
//                   >
//                     View
//                   </a>
//                 </div>
//               )}
//               <p className="text-xs text-muted-foreground">
//                 Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
//               </p>
//             </div>
//           </div>
//         )
//       default:
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <Input
//               id={`spec-${spec.id}`}
//               value={specValue?.value || ""}
//               onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value)}
//               placeholder={`Enter ${spec.name.toLowerCase()}`}
//               className="h-10"
//             />
//           </div>
//         )
//     }
//   }

//   const renderStationDocuments = (stationId: string) => {
//     const documents = stationDocuments[stationId] || []
//     return (
//       <div className="space-y-4">
//         {/* Upload Section */}
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
//           <div className="space-y-4">
//             <h4 className="font-medium text-sm">Upload Station Document</h4>
//             <div className="grid grid-cols-1 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="station-doc-file">Select Files *</Label>
//                 <Input
//                   id="station-doc-file"
//                   type="file"
//                   accept="*/*"
//                   className="cursor-pointer"
//                   disabled={uploadingStationDoc}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="station-doc-description">Description</Label>
//                 <Input
//                   id="station-doc-description"
//                   placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                   disabled={uploadingStationDoc}
//                 />
//               </div>
//             </div>
//             <Button
//               type="button"
//               variant="outline"
//               disabled={uploadingStationDoc}
//               onClick={async (e) => {
//                 e.preventDefault()
//                 e.stopPropagation()
//                 const fileInput = document.getElementById("station-doc-file") as HTMLInputElement
//                 const descInput = document.getElementById("station-doc-description") as HTMLInputElement
//                 const file = fileInput?.files?.[0]
//                 const description = descInput?.value?.trim() || ""
//                 if (!file) {
//                   toast({
//                     title: "Missing File",
//                     description: "Please select a file to upload.",
//                     variant: "destructive",
//                   })
//                   return
//                 }
//                 await handleStationDocumentUpload(file, description, file.name)
//                 fileInput.value = ""
//                 descInput.value = ""
//               }}
//               className="w-full"
//             >
//               {uploadingStationDoc ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                   Uploading File...
//                 </div>
//               ) : (
//                 <>
//                   <Upload className="w-4 h-4 mr-2" />
//                   Upload File
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//         {/* Documents List */}
//         {documents.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No files available for this station.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 gap-4">
//               {documents.map((doc) => (
//                 <div key={doc.id} className="p-4 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start gap-3 flex-1">
//                       <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-medium text-sm text-gray-900 truncate">
//                           {doc.description || "Untitled Document"}
//                         </h4>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Uploaded: {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "Unknown date"}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 ml-4">
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="outline"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           window.open(doc.fileUrl, "_blank")
//                         }}
//                         className="h-8 px-3"
//                       >
//                         <Eye className="w-3 h-3 mr-1" />
//                         View
//                       </Button>
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="outline"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           const link = document.createElement("a")
//                           link.href = doc.fileUrl
//                           link.download = doc.description || "document"
//                           link.click()
//                         }}
//                         className="h-8 px-3"
//                       >
//                         <Download className="w-3 h-3 mr-1" />
//                         Download
//                       </Button>
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="outline"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           handleDeleteStationDocument(stationId, doc.id)
//                         }}
//                         className="h-8 px-3 text-green-600 hover:text-green-700"
//                       >
//                         <Trash2 className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const renderStationNotes = (stationId: string) => {
//     const notes = stationNotes[stationId] || []
//     return (
//       <div className="space-y-4">
//         {/* Add Note Section */}
//         {/* <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
//             <Plus className="w-4 h-4" />
//             Add Station Note
//           </h4>
//           <div className="space-y-3">
//             <Textarea
//               value={newNoteContent}
//               onChange={(e) => setNewNoteContent(e.target.value)}
//               placeholder="Enter operational notes, safety instructions, or maintenance reminders..."
//               rows={3}
//               className="resize-none"
//             />
//             <Button
//               type="button"
//               onClick={(e) => {
//                 e.preventDefault()
//                 e.stopPropagation()
//                 handleAddNote()
//               }}
//               disabled={addingNote || !newNoteContent.trim()}
//               size="sm"
//               className="w-full"
//             >
//               {addingNote ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                   Adding Note...
//                 </div>
//               ) : (
//                 <>
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Note
//                 </>
//               )}
//             </Button>
//           </div>
//         </div> */}
//         {/* Notes List */}
//         {notes.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No notes available for this station.</p>
//             <p className="text-sm text-muted-foreground mt-1">
//               Add operational notes, safety instructions, or reminders above.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             <h4 className="font-medium text-sm flex items-center gap-2">
//               <StickyNote className="w-4 h-4" />
//               Station Notes ({notes.length})
//             </h4>
//             <div className="space-y-2">
//               {notes.map((note) => (
//                 <div key={note.id} className="p-3 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.content}</p>
//                       <p className="text-xs text-gray-500 mt-2">
//                         {note.createdAt ? new Date(note.createdAt).toLocaleString() : "Unknown date"}
//                       </p>
//                     </div>
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="outline"
//                       onClick={(e) => {
//                         e.preventDefault()
//                         e.stopPropagation()
//                         handleDeleteNote(stationId, note.id!)
//                       }}
//                       className="ml-3 h-8 px-2 text-green-600 hover:text-green-700"
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const isFormValid = () => {
//     const jobIdError = validateJobId(formData.jobId)
//     const assemblyIdError = validateAssemblyId(formData.assemblyId)
//     const documentControlIdError = orderFormData.documentControlId
//       ? validateDocumentControlId(orderFormData.documentControlId)
//       : null
//     return !jobIdError && !assemblyIdError && !documentControlIdError
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between w-full">
//           <div>
//             <h1 className="text-3xl font-bold text-green-600">Edit MPI</h1>
//             <p className="text-muted-foreground">
//               Job ID: {mpi.jobId} • Assembly ID: {mpi.assemblyId}
//             </p>
//           </div>
//           <Button variant="outline" size="sm" onClick={onCancel}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
//         </div>
//         <Card className="border shadow-sm">
//           <CardContent className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-4">
//                   <TabsTrigger value="basic-info" className="flex items-center gap-2">
//                     <Info className="w-4 h-4" />
//                     Order Details
//                   </TabsTrigger>
//                   <TabsTrigger value="documentation" className="flex items-center gap-2">
//                     <FileText className="w-4 h-4" />
//                     Files
//                     {mpiDocumentation.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {mpiDocumentation.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="checklist" className="flex items-center gap-2">
//                     <ClipboardList className="w-4 h-4" />
//                     Checklist
//                     {existingChecklists.length + availableChecklistTemplate.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {existingChecklists.length + availableChecklistTemplate.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="instructions" className="flex items-center gap-2">
//                     <Factory className="w-4 h-4" />
//                     Instructions
//                     {selectedStations.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {selectedStations.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                 </TabsList>
//                 {/* Basic Information & Order Form Tab */}
//                 <TabsContent value="basic-info" className="space-y-6 mt-6">
//                   {/* MPI Basic Information */}
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="jobId">
//                             MPI ID *{checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="jobId"
//                             value={formData.jobId}
//                             onChange={(e) => handleChange("jobId", e.target.value)}
//                             placeholder="Enter job ID"
//                             required
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = validateJobId(formData.jobId)
//                             return error ? (
//                               <p className="text-xs text-green-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="assemblyId">
//                             Assembly ID *
//                             {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="assemblyId"
//                             value={formData.assemblyId}
//                             onChange={(e) => handleChange("assemblyId", e.target.value)}
//                             placeholder="Enter assembly ID"
//                             required
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = validateAssemblyId(formData.assemblyId)
//                             return error ? (
//                               <p className="text-xs text-green-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="customer">Customer</Label>
//                           <Input
//                             id="customer"
//                             value={formData.customer}
//                             onChange={(e) => handleChange("customer", e.target.value)}
//                             placeholder="Enter customer name"
//                             className="h-11"
//                           />
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                   {/* Order Forms Section */}
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="internalOrderNumber">Internal Order Number</Label>
//                           <Input
//                             id="internalOrderNumber"
//                             value={orderFormData.internalOrderNumber}
//                             onChange={(e) => handleOrderFormChange("internalOrderNumber", e.target.value)}
//                             placeholder="Enter internal order number"
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="revision">Revision</Label>
//                           <Input
//                             id="revision"
//                             value={orderFormData.revision}
//                             onChange={(e) => handleOrderFormChange("revision", e.target.value)}
//                             placeholder="Enter revision number"
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="documentControlId">
//                             Document Control ID
//                             {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="documentControlId"
//                             value={orderFormData.documentControlId}
//                             onChange={(e) => handleOrderFormChange("documentControlId", e.target.value)}
//                             placeholder="Enter document control ID"
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = orderFormData.documentControlId
//                               ? validateDocumentControlId(orderFormData.documentControlId)
//                               : null
//                             return error ? (
//                               <p className="text-xs text-green-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="distributionDate">Distribution Date</Label>
//                           <Input
//                             id="distributionDate"
//                             type="date"
//                             value={orderFormData.distributionDate}
//                             onChange={(e) => handleOrderFormChange("distributionDate", e.target.value)}
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="requiredBy">Required By</Label>
//                           <Input
//                             id="requiredBy"
//                             type="date"
//                             value={orderFormData.requiredBy}
//                             onChange={(e) => handleOrderFormChange("requiredBy", e.target.value)}
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="serviceSelect">Select Service</Label>
//                           <div className="relative">
//                             <Select
//                               value={orderFormData.selectedServiceId || ""}
//                               onChange={handleServiceChange}
//                               disabled={loadingServices}
//                             >
//                               <SelectTrigger id="serviceSelect" className="h-11">
//                                 <SelectValue
//                                   placeholder={
//                                     loadingServices
//                                       ? "Loading services..."
//                                       : services.length === 0
//                                         ? "No services available"
//                                         : "Select a service"
//                                   }
//                                 />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {services.map((service) => (
//                                   <SelectItem key={service.id} value={service.id}>
//                                     <div className="flex flex-col">
//                                       <span className="font-medium">{service.name}</span>
//                                       {service.description && (
//                                         <span className="text-xs text-gray-500 truncate max-w-[200px]">
//                                           {service.description}
//                                         </span>
//                                       )}
//                                     </div>
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                             {loadingServices && (
//                               <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
//                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
//                               </div>
//                             )}
//                           </div>
//                           {services.length === 0 && !loadingServices && (
//                             <p className="text-sm text-gray-500">
//                               No services available. Please create services first.
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//                 {/* Documentation Tab */}
//                 <TabsContent value="documentation" className="space-y-6 mt-6">
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="space-y-4">
//                         {/* Upload Section */}
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
//                           <div className="space-y-4">
//                             <div className="grid grid-cols-1 gap-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor="mpi-doc-file">Select Files *</Label>
//                                 <Input
//                                   id="mpi-doc-file"
//                                   type="file"
//                                   accept="*/*"
//                                   className="cursor-pointer"
//                                   disabled={uploadingMpiDoc}
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor="mpi-doc-description">Description (Optional)</Label>
//                                 <Input
//                                   id="mpi-doc-description"
//                                   placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                                   disabled={uploadingMpiDoc}
//                                 />
//                               </div>
//                             </div>
//                             <Button
//                               type="button"
//                               variant="outline"
//                               disabled={uploadingMpiDoc}
//                               onClick={async (e) => {
//                                 e.preventDefault()
//                                 e.stopPropagation()
//                                 const fileInput = document.getElementById("mpi-doc-file") as HTMLInputElement
//                                 const descInput = document.getElementById("mpi-doc-description") as HTMLInputElement
//                                 const file = fileInput?.files?.[0]
//                                 const description = descInput?.value?.trim() || ""
//                                 if (!file) {
//                                   toast({
//                                     title: "Missing File",
//                                     description: "Please select a file to upload.",
//                                     variant: "destructive",
//                                   })
//                                   return
//                                 }
//                                 await handleMpiDocumentUpload(file, description)
//                                 fileInput.value = ""
//                                 descInput.value = ""
//                               }}
//                               className="w-full bg-transparent"
//                             >
//                               {uploadingMpiDoc ? (
//                                 <div className="flex items-center gap-2">
//                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                   Uploading File...
//                                 </div>
//                               ) : (
//                                 <>
//                                   <Upload className="w-4 h-4 mr-2" />
//                                   Upload File
//                                 </>
//                               )}
//                             </Button>
//                           </div>
//                         </div>
//                         {/* Uploaded Documents List */}
//                         {mpiDocumentation.length > 0 && (
//                           <div className="space-y-3">
//                             <h4 className="font-medium text-sm">Files</h4>
//                             <div className="space-y-2">
//                               {mpiDocumentation.map((doc, index) => (
//                                 <div
//                                   key={index}
//                                   className="flex items-start justify-between p-4 bg-gray-50 rounded border"
//                                 >
//                                   <div className="flex items-start gap-3 flex-1">
//                                     <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                                     <div className="flex-1 min-w-0">
//                                       <p className="text-sm font-medium text-gray-900 truncate">
//                                         {doc.description && doc.description !== doc.fileName
//                                           ? doc.description
//                                           : doc.fileName}
//                                       </p>
//                                       <div className="mt-1 space-y-1">
//                                         <p className="text-xs text-gray-600">
//                                           <span className="font-medium">Filename:</span> {doc.fileName}
//                                         </p>
//                                         {doc.description && doc.description !== doc.fileName && (
//                                           <p className="text-xs text-gray-500">
//                                             <span className="font-medium">Description:</span> {doc.description}
//                                           </p>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <div className="flex items-center gap-2 ml-4">
//                                     <Button
//                                       type="button"
//                                       size="sm"
//                                       variant="outline"
//                                       onClick={(e) => {
//                                         e.preventDefault()
//                                         e.stopPropagation()
//                                         removeMpiDocument(index)
//                                       }}
//                                       className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
//                                     >
//                                       Remove
//                                     </Button>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//                 {/* Checklist Tab */}
//                 <TabsContent value="checklist" className="space-y-6 mt-6">
//                   <Card>
//                     <CardContent className="mt-5">
//                       {loadingAvailableChecklist ? (
//                         <div className="flex items-center justify-center py-8">
//                           <div className="text-center">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
//                             <p className="mt-2 text-sm text-muted-foreground">Loading checklist data...</p>
//                           </div>
//                         </div>
//                       ) : existingChecklists.length === 0 && availableChecklistTemplate.length === 0 ? (
//                         <p className="text-muted-foreground text-center py-4">No checklist data available.</p>
//                       ) : (
//                         <div className="space-y-6">
//                           {/* Existing Checklists */}
//                           {existingChecklists.length > 0 ? (
//                             <div>
//                               <h3 className="text-lg font-semibold mb-4 text-green-800">
//                                 Existing Required Checklists
//                               </h3>
//                               <Accordion type="multiple" className="w-full">
//                                 {existingChecklists.map((section) => (
//                                   <AccordionItem key={section.id} value={section.id}>
//                                     <AccordionTrigger className="text-left">
//                                       <div className="flex items-center gap-3">
//                                         <h4 className="font-medium">{section.name}</h4>
//                                       </div>
//                                     </AccordionTrigger>
//                                     <AccordionContent>
//                                       <div className="space-y-4">
//                                         <Table>
//                                           <TableHeader>
//                                             <TableRow>
//                                               <TableHead>Description</TableHead>
//                                               <TableHead>Required</TableHead>
//                                               <TableHead>Remarks</TableHead>
//                                             </TableRow>
//                                           </TableHeader>
//                                           <TableBody>
//                                             {(section.items || []).map((item) => (
//                                               <TableRow key={item.id}>
//                                                 <TableCell className="font-medium">{item.description}</TableCell>
//                                                 <TableCell>
//                                                   <Select
//                                                     value={
//                                                       getChecklistItemValue(item.id, "required", item.required)
//                                                         ? "yes"
//                                                         : "no"
//                                                     }
//                                                     onChange={(itemId, field, value) =>
//                                                       handleChecklistItemChange(itemId, field, value === "yes")
//                                                     }
//                                                   >
//                                                     <SelectTrigger className="w-20">
//                                                       <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                       <SelectItem value="yes">Yes</SelectItem>
//                                                       <SelectItem value="no">No</SelectItem>
//                                                     </SelectContent>
//                                                   </Select>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                   <Input
//                                                     value={getChecklistItemValue(item.id, "remarks", item.remarks)}
//                                                     onChange={(itemId, field, value) =>
//                                                       handleChecklistItemChange(itemId, field, value)
//                                                     }
//                                                     placeholder="Enter remarks (optional)"
//                                                     className="min-w-[200px]"
//                                                   />
//                                                 </TableCell>
//                                               </TableRow>
//                                             ))}
//                                           </TableBody>
//                                         </Table>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           ) : (
//                             <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                               <h3 className="text-lg font-semibold mb-2 text-blue-800">Existing Checklists</h3>
//                               <p className="text-sm text-blue-700">
//                                 No checklist items have been created for this MPI yet.
//                               </p>
//                             </div>
//                           )}
//                           {/* Available Checklist Template */}
//                           {availableChecklistTemplate.length > 0 && (
//                             <div>
//                               <h3 className="text-lg font-semibold mb-4 text-green-800">Available Checklist Items</h3>
//                               <Accordion type="multiple" className="w-full">
//                                 {availableChecklistTemplate.map((section) => (
//                                   <AccordionItem key={section.id} value={section.id}>
//                                     <AccordionTrigger className="text-left">
//                                       <div className="flex items-center gap-3">
//                                         <h4 className="font-medium">{section.name}</h4>
//                                       </div>
//                                     </AccordionTrigger>
//                                     <AccordionContent>
//                                       <div className="space-y-4">
//                                         <Table>
//                                           <TableHeader>
//                                             <TableRow>
//                                               <TableHead>Description</TableHead>
//                                               <TableHead>Required</TableHead>
//                                               <TableHead>Remarks</TableHead>
//                                             </TableRow>
//                                           </TableHeader>
//                                           <TableBody>
//                                             {(section.items || []).map((item) => (
//                                               <TableRow key={item.id}>
//                                                 <TableCell className="font-medium">{item.description}</TableCell>
//                                                 <TableCell>
//                                                   <Select
//                                                     value={
//                                                       getChecklistItemValue(item.id, "required", item.required)
//                                                         ? "yes"
//                                                         : "no"
//                                                     }
//                                                     onChange={(itemId, field, value) =>
//                                                       handleChecklistItemChange(itemId, field, value === "yes")
//                                                     }
//                                                   >
//                                                     <SelectTrigger className="w-20">
//                                                       <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                       <SelectItem value="yes">Yes</SelectItem>
//                                                       <SelectItem value="no">No</SelectItem>
//                                                     </SelectContent>
//                                                   </Select>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                   <Input
//                                                     value={getChecklistItemValue(item.id, "remarks", item.remarks)}
//                                                     onChange={(itemId, field, value) =>
//                                                       handleChecklistItemChange(itemId, field, value)
//                                                     }
//                                                     placeholder="Enter remarks (optional)"
//                                                     className="min-w-[200px]"
//                                                   />
//                                                 </TableCell>
//                                               </TableRow>
//                                             ))}
//                                           </TableBody>
//                                         </Table>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//                 {/* Instructions Tab */}
//                 <TabsContent value="instructions" className="space-y-6 mt-6">
//                   <InstructionsTab
//                     instructions={instructions}
//                     onAddInstruction={handleAddInstruction}
//                     onInstructionChange={handleInstructionChange}
//                     onRemoveInstruction={handleRemoveInstruction}
//                     availableStations={availableStations}
//                     formData={formData}
//                     loadingStations={loadingStations}
//                     activeStationId={activeStationId}
//                     setActiveStationId={setActiveStationId}
//                     stationViewMode={stationViewMode}
//                     setStationViewMode={setStationViewMode}
//                     handleStationSelectionChange={handleStationSelectionChange}
//                     selectedStations={selectedStations}
//                     stationNotes={stationNotes}
//                     stationDocuments={stationDocuments}
//                     renderSpecificationInput={renderSpecificationInput}
//                     renderStationDocuments={renderStationDocuments}
//                     renderStationNotes={renderStationNotes}
//                     focusedInstructionIndex={focusedInstructionIndex}
//                     setFocusedInstructionIndex={setFocusedInstructionIndex}
//                     instructionRefs={instructionRefs}
//                   />
//                 </TabsContent>
//               </Tabs>
//               {/* Form Actions */}
//               <div className="flex justify-end gap-4">
//                 <Button variant="outline" onClick={onCancel}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isLoading || !isFormValid()}>
//                   {isLoading ? (
//                     <div className="flex items-center gap-2 animate-pulse">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                       <span>Updating...</span>
//                     </div>
//                   ) : (
//                     <>Update MPI</>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }















// "use client"
// import React from "react"
// import type { FunctionComponent } from "react"
// import { useState, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   ArrowLeft,
//   Factory,
//   Info,
//   ClipboardList,
//   FileText,
//   Download,
//   Eye,
//   StickyNote,
//   Plus,
//   Trash2,
//   X,
//   Upload,
//   AlertCircle,
// } from "lucide-react"
// import type { MPI, UpdateMPIDto } from "./types"
// import { StationAPI } from "../stations/station-api"
// import type { Station } from "../stations/types"
// import { useToast } from "@/hooks/use-toast"
// import { MPIAPI } from "./mpi-api"
// import { MPIDocumentationAPI } from "./mpi-document-api"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"
// import { API_BASE_URL } from "@/lib/constants"
// import { ServiceAPI } from "../services/service-api"
// import type { Service } from "../services/types"

// // Enhanced InstructionsTab component with proper focus management and layout matching create mode
// const InstructionsTab: FunctionComponent<{
//   instructions: string[]
//   onAddInstruction: () => void
//   onInstructionChange: (index: number, value: string) => void
//   onRemoveInstruction: (index: number) => void
//   availableStations: Station[]
//   formData: any
//   loadingStations: boolean
//   activeStationId: string | null
//   setActiveStationId: (id: string | null) => void
//   stationViewMode: "specifications" | "documents" | "notes"
//   setStationViewMode: (mode: "specifications" | "documents" | "notes") => void
//   handleStationSelectionChange: (stationIds: string[]) => void
//   selectedStations: Station[]
//   stationNotes: Record<string, StationNote[]>
//   stationDocuments: Record<string, StationDocument[]>
//   renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
//   renderStationDocuments: (stationId: string) => React.ReactNode
//   renderStationNotes: (stationId: string) => React.ReactNode
//   focusedInstructionIndex: number | null
//   setFocusedInstructionIndex: (index: number | null) => void
//   instructionRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
// }> = React.memo(
//   ({
//     instructions,
//     onAddInstruction,
//     onInstructionChange,
//     onRemoveInstruction,
//     availableStations,
//     formData,
//     loadingStations,
//     activeStationId,
//     setActiveStationId,
//     stationViewMode,
//     setStationViewMode,
//     handleStationSelectionChange,
//     selectedStations,
//     stationNotes,
//     stationDocuments,
//     renderSpecificationInput,
//     renderStationDocuments,
//     renderStationNotes,
//     focusedInstructionIndex,
//     setFocusedInstructionIndex,
//     instructionRefs,
//   }) => {
//     return (
//       <div className="space-y-6">
//         {/* Stations Section */}
//         <Card>
//           <CardContent className="space-y-6 mt-5">
//             {loadingStations ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
//                   <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
//                 </div>
//               </div>
//             ) : availableStations.length === 0 ? (
//               <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
//               </div>
//             ) : (
//               <div className="flex gap-6 min-h-[600px]">
//                 {/* Left Sidebar - Station List */}
//                 <div className="w-1/4 border rounded-lg bg-gray-50">
//                   <div className="p-3 border-b bg-white rounded-t-lg">
//                     <h4 className="font-medium text-base">Stations</h4>
//                     <p className="text-xs text-muted-foreground">
//                       {formData.selectedStationIds.length > 0
//                         ? `${formData.selectedStationIds.length} selected`
//                         : "Click to select multiple"}
//                     </p>
//                   </div>
//                   <div className="p-2 overflow-y-auto h-[530px]">
//                     <div className="space-y-1">
//                       {availableStations.map((station) => {
//                         const noteCount = stationNotes[station.id]?.length || 0
//                         const docCount = stationDocuments[station.id]?.length || 0
//                         const isSelected = formData.selectedStationIds.includes(station.id)
//                         return (
//                           <div
//                             key={station.id}
//                             className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
//                               isSelected
//                                 ? "bg-blue-100 text-blue-900 border-blue-300"
//                                 : "bg-white hover:bg-gray-100 border-transparent"
//                             } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
//                             onClick={(e) => {
//                               e.preventDefault()
//                               e.stopPropagation()
//                               setActiveStationId(station.id)
//                               if (isSelected) {
//                                 handleStationSelectionChange(
//                                   formData.selectedStationIds.filter((id: string) => id !== station.id),
//                                 )
//                               } else {
//                                 handleStationSelectionChange([...formData.selectedStationIds, station.id])
//                               }
//                             }}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="truncate">{station.stationName}</span>
//                               <div className="flex gap-1">
//                                 {noteCount > 0 && (
//                                   <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
//                                     {noteCount}N
//                                   </Badge>
//                                 )}
//                                 {docCount > 0 && (
//                                   <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
//                                     {docCount}D
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 </div>
//                 {/* Right Panel - Station Details */}
//                 <div className="flex-1 border rounded-lg bg-gray-50">
//                   {!activeStationId ? (
//                     <div className="flex items-center justify-center h-full">
//                       <div className="text-center">
//                         <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <h4 className="font-medium text-gray-600 mb-2">No Station Selected</h4>
//                         <p className="text-sm text-muted-foreground">
//                           Select a station from the left sidebar to view its details
//                           {formData.selectedStationIds.length > 0 && (
//                             <span className="block mt-2 text-blue-600 font-medium">
//                               {formData.selectedStationIds.length} station
//                               {formData.selectedStationIds.length > 1 ? "s" : ""} selected for MPI
//                             </span>
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="h-full flex flex-col">
//                       <div className="p-4 border-b bg-white rounded-t-lg">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <Factory className="w-5 h-5 text-purple-600" />
//                             <div>
//                               <h4 className="font-medium text-lg">
//                                 {availableStations.find((s) => s.id === activeStationId)?.stationName}
//                               </h4>
//                               <p className="text-sm text-muted-foreground">Station Details</p>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             <Button
//                               type="button"
//                               size="sm"
//                               variant={stationViewMode === "specifications" ? "default" : "outline"}
//                               onClick={(e) => {
//                                 e.preventDefault()
//                                 e.stopPropagation()
//                                 setStationViewMode("specifications")
//                               }}
//                             >
//                               Specifications
//                             </Button>
//                             <Button
//                               type="button"
//                               size="sm"
//                               variant={stationViewMode === "documents" ? "default" : "outline"}
//                               onClick={(e) => {
//                                 e.preventDefault()
//                                 e.stopPropagation()
//                                 setStationViewMode("documents")
//                               }}
//                             >
//                               Files
//                               {stationDocuments[activeStationId]?.length > 0 && (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {stationDocuments[activeStationId].length}
//                                 </Badge>
//                               )}
//                             </Button>
//                             <Button
//                               type="button"
//                               size="sm"
//                               variant={stationViewMode === "notes" ? "default" : "outline"}
//                               onClick={(e) => {
//                                 e.preventDefault()
//                                 e.stopPropagation()
//                                 setStationViewMode("notes")
//                               }}
//                             >
//                               Notes
//                               {stationNotes[activeStationId]?.length > 0 && (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {stationNotes[activeStationId].length}
//                                 </Badge>
//                               )}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex-1 overflow-auto p-4">
//                         {stationViewMode === "specifications" && (
//                           <div>
//                             {(() => {
//                               const station = availableStations.find((s) => s.id === activeStationId)
//                               if (!station) return null
//                               if (!station.specifications || station.specifications.length === 0) {
//                                 return (
//                                   <div className="text-center py-6">
//                                     <p className="text-muted-foreground">
//                                       No specifications available for this station.
//                                     </p>
//                                   </div>
//                                 )
//                               }
//                               return (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   {station.specifications.map((spec) => (
//                                     <div key={spec.id} className="space-y-3 p-3 bg-white rounded border">
//                                       {renderSpecificationInput(spec, station.id)}
//                                     </div>
//                                   ))}
//                                 </div>
//                               )
//                             })()}
//                           </div>
//                         )}
//                         {stationViewMode === "documents" && renderStationDocuments(activeStationId)}
//                         {stationViewMode === "notes" && renderStationNotes(activeStationId)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//             {/* Selected Station Summary */}
//             {formData.selectedStationIds.length > 0 && (
//               <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <h4 className="font-medium text-blue-800 mb-3">Selected Stations</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedStations.map((station) => (
//                     <Badge key={station.id} variant="outline" className="bg-white">
//                       {station.stationName}
//                       {station.specifications && station.specifications.length > 0 && (
//                         <span className="ml-1 text-xs">({station.specifications.length} specs)</span>
//                       )}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Instructions Section - Now positioned below stations section like in create mode */}
//         <Card>
//           <CardContent className="mt-5">
//             <div className="space-y-4">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h4 className="text-lg font-semibold text-green-800">General Instructions</h4>
//                   <p className="text-sm text-muted-foreground">
//                     Add general safety and operational instructions for this MPI
//                   </p>
//                 </div>
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="outline"
//                   onClick={(e) => {
//                     e.preventDefault()
//                     e.stopPropagation()
//                     onAddInstruction()
//                     // Focus the new instruction input after it's added
//                     setTimeout(() => {
//                       setFocusedInstructionIndex(instructions.length)
//                     }, 0)
//                   }}
//                   className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Instruction
//                 </Button>
//               </div>
//               {instructions.length === 0 ? (
//                 <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                   <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                   <p className="text-sm text-muted-foreground">No instructions added yet</p>
//                   <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {instructions.map((instruction, index) => (
//                     <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
//                       <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <Input
//                           ref={(el) => {
//                             instructionRefs.current[index] = el
//                           }}
//                           value={instruction}
//                           onChange={(e) => {
//                             setFocusedInstructionIndex(index)
//                             onInstructionChange(index, e.target.value)
//                           }}
//                           onFocus={() => setFocusedInstructionIndex(index)}
//                           onBlur={() => setFocusedInstructionIndex(null)}
//                           placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
//                           className="w-full"
//                         />
//                       </div>
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="ghost"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           onRemoveInstruction(index)
//                           // Clear focus tracking when removing instruction
//                           setFocusedInstructionIndex(null)
//                         }}
//                         className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-shrink-0"
//                       >
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   },
// )

// interface MPIEditProps {
//   mpi: MPI
//   onSubmit: (data: UpdateMPIDto) => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
// }

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   fileUrl?: string
//   unit?: string
// }

// interface ChecklistSection {
//   id: string
//   name: string
//   description: string
//   items: ChecklistItem[]
// }

// interface ChecklistItem {
//   id: string
//   description: string
//   required: boolean
//   remarks: string
//   category?: string
//   isActive: boolean
//   createdBy: string
//   sectionId: string
// }

// interface MPIDocumentation {
//   id?: string
//   file?: File
//   fileUrl?: string
//   description: string
//   fileName: string
//   originalFileName?: string
//   isUploaded?: boolean
// }

// interface StationNote {
//   id?: string
//   content: string
//   createdAt?: string
//   updatedAt?: string
// }

// interface StationDocument {
//   id: string
//   fileUrl: string
//   description: string
//   stationId: string
//   mpiId?: string
//   createdAt: string
//   updatedAt: string
// }

// // Helper function to safely convert order type to array
// const normalizeOrderType = (orderType: any): string[] => {
//   if (!orderType) return []
//   if (Array.isArray(orderType)) return orderType.filter((type) => typeof type === "string")
//   if (typeof orderType === "string") return [orderType]
//   return []
// }

// // Helper function to safely convert file action to array
// const normalizeFileAction = (fileAction: any): string[] => {
//   if (!fileAction) return []
//   if (Array.isArray(fileAction)) return fileAction.filter((action) => typeof action === "string")
//   if (typeof fileAction === "string") return [fileAction]
//   return []
// }

// export function MPIEdit({ mpi, onSubmit, onCancel, isLoading }: MPIEditProps) {
//   const [activeTab, setActiveTab] = useState("basic-info")
//   const [formData, setFormData] = useState({
//     jobId: mpi.jobId || "",
//     assemblyId: mpi.assemblyId || "",
//     customer: mpi.customer || "",
//     selectedStationIds: mpi.stations?.map((s) => s.id) || [],
//   })

//   // Order Form State - Initialize with existing data
//   const [orderFormData, setOrderFormData] = useState({
//     id: mpi.orderForms?.[0]?.id || "",
//     orderType: normalizeOrderType(mpi.orderForms?.[0]?.orderType),
//     distributionDate: mpi.orderForms?.[0]?.distributionDate
//       ? new Date(mpi.orderForms[0].distributionDate).toISOString().split("T")[0]
//       : "",
//     requiredBy: mpi.orderForms?.[0]?.requiredBy
//       ? new Date(mpi.orderForms[0].requiredBy).toISOString().split("T")[0]
//       : "",
//     internalOrderNumber: mpi.orderForms?.[0]?.internalOrderNumber || "",
//     revision: mpi.orderForms?.[0]?.revision || "",
//     otherAttachments: mpi.orderForms?.[0]?.otherAttachments || "",
//     fileAction: normalizeFileAction(mpi.orderForms?.[0]?.fileAction),
//     markComplete: mpi.orderForms?.[0]?.markComplete || false,
//     documentControlId: mpi.orderForms?.[0]?.documentControlId || "",
//     selectedServiceId: mpi.orderForms?.[0]?.services?.[0]?.id || "",
//   })

//   // Instructions state - Initialize with existing data
//   const [instructions, setInstructions] = useState<string[]>(mpi.Instruction || [])

//   // Add focus management for instruction inputs
//   const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
//   const instructionRefs = useRef<(HTMLInputElement | null)[]>([])

//   // Add these state variables after the instruction focus management states
//   const [focusedSpecificationId, setFocusedSpecificationId] = useState<string | null>(null)
//   const specificationRefs = useRef<Record<string, HTMLInputElement | null>>({})

//   // Service state
//   const [services, setServices] = useState<Service[]>([])
//   const [loadingServices, setLoadingServices] = useState(false)
//   const [selectedService, setSelectedService] = useState<Service | null>(null)

//   // Enums state
//   const [enums, setEnums] = useState<any>({})
//   const [loadingEnums, setLoadingEnums] = useState(false)

//   // Checklist template and existing checklist state
//   const [availableChecklistTemplate, setAvailableChecklistTemplate] = useState<ChecklistSection[]>([])
//   const [existingChecklists, setExistingChecklists] = useState<ChecklistSection[]>([])
//   const [loadingAvailableChecklist, setLoadingAvailableChecklist] = useState(false)

//   // Specification values state - Initialize with existing values
//   const [specificationValues, setSpecificationValues] = useState<Record<string, SpecificationValue>>(() => {
//     const initialValues: Record<string, SpecificationValue> = {}
//     console.log("🔍 Initializing specification values from MPI data:", mpi)
//     mpi.stations?.forEach((station) => {
//       console.log(`📍 Processing station: ${station.stationName} (${station.id})`)
//       station.specifications?.forEach((spec) => {
//         console.log(`🔧 Processing spec: ${spec.name} (${spec.id})`)
//         // Look for existing values in multiple places
//         let existingValue = null
//         // Method 1: Check stationSpecifications array
//         if (spec.stationSpecifications && spec.stationSpecifications.length > 0) {
//           existingValue = spec.stationSpecifications.find((ss) => ss.stationId === station.id)
//           console.log(`📋 Found in stationSpecifications:`, existingValue)
//         }
//         // Method 2: Check if there's a direct value on the spec
//         if (!existingValue && spec.value) {
//           existingValue = { value: spec.value, unit: spec.unit }
//           console.log(`📋 Found direct value on spec:`, existingValue)
//         }
//         // Method 3: Check station's specificationValues if it exists
//         if (!existingValue && station.specificationValues) {
//           const stationSpecValue = station.specificationValues.find((sv: any) => sv.specificationId === spec.id)
//           if (stationSpecValue) {
//             existingValue = { value: stationSpecValue.value, unit: stationSpecValue.unit }
//             console.log(`📋 Found in station specificationValues:`, existingValue)
//           }
//         }
//         if (existingValue && existingValue.value) {
//           initialValues[spec.id] = {
//             specificationId: spec.id,
//             value: existingValue.value,
//             unit: existingValue.unit || undefined,
//             fileUrl: existingValue.fileUrl || undefined,
//           }
//           console.log(`✅ Initialized spec ${spec.id} with value:`, initialValues[spec.id])
//         } else {
//           // Initialize with empty value for specs without existing data
//           initialValues[spec.id] = {
//             specificationId: spec.id,
//             value: "",
//             unit: undefined,
//             fileUrl: undefined,
//           }
//           console.log(`🆕 Initialized spec ${spec.id} with empty value`)
//         }
//       })
//     })
//     console.log("🎯 Final initial specification values:", initialValues)
//     return initialValues
//   })

//   const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())

//   // MPI Documentation State - Enhanced with proper filename handling
//   const [mpiDocumentation, setMpiDocumentation] = useState<MPIDocumentation[]>(() => {
//     // Initialize with existing MPI documents
//     return (
//       mpi.mpiDocs?.map((doc) => ({
//         id: doc.id,
//         fileUrl: doc.fileUrl,
//         description: doc.description,
//         fileName: doc.fileName || doc.description, // Use fileName if available, fallback to description
//         originalFileName: doc.originalFileName || doc.fileName || doc.description,
//         isUploaded: true,
//       })) || []
//     )
//   })

//   const [uploadingMpiDoc, setUploadingMpiDoc] = useState(false)

//   // Checklist modifications state - Initialize with existing checklist data
//   const [checklistModifications, setChecklistModifications] = useState<
//     Record<string, { required: boolean; remarks: string }>
//   >(() => {
//     const initialModifications: Record<string, { required: boolean; remarks: string }> = {}
//     // Initialize with existing checklist data
//     mpi.checklists?.forEach((checklist) => {
//       checklist.checklistItems?.forEach((item, itemIndex) => {
//         const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
//         initialModifications[itemId] = {
//           required: item.required,
//           remarks: item.remarks,
//         }
//       })
//     })
//     console.log("Initial checklist modifications:", initialModifications)
//     return initialModifications
//   })

//   const [availableStations, setAvailableStations] = useState<Station[]>([])
//   const [loadingStations, setLoadingStations] = useState(false)
//   const [selectedStations, setSelectedStations] = useState<Station[]>([])

//   // Station view state for instructions tab
//   const [activeStationId, setActiveStationId] = useState<string | null>(null)
//   const [stationViewMode, setStationViewMode] = useState<"specifications" | "documents" | "notes">("specifications")

//   // Station notes state
//   const [stationNotes, setStationNotes] = useState<Record<string, StationNote[]>>({})
//   const [loadingNotes, setLoadingNotes] = useState<Set<string>>(new Set())
//   const [newNoteContent, setNewNoteContent] = useState("")
//   const [addingNote, setAddingNote] = useState(false)

//   // Station documents state
//   const [stationDocuments, setStationDocuments] = useState<Record<string, StationDocument[]>>({})
//   const [loadingDocuments, setLoadingDocuments] = useState<Set<string>>(new Set())
//   const [uploadingStationDoc, setUploadingStationDoc] = useState(false)

//   // Validation state
//   const [existingJobIds, setExistingJobIds] = useState<string[]>([])
//   const [existingAssemblyIds, setExistingAssemblyIds] = useState<string[]>([])
//   const [existingDocumentControlIds, setExistingDocumentControlIds] = useState<string[]>([])
//   const [checkingIds, setCheckingIds] = useState(false)

//   const { toast } = useToast()

//   // Initialize station notes from MPI data - ENHANCED
//   useEffect(() => {
//     const initialNotes: Record<string, StationNote[]> = {}
//     console.log("🔍 Initializing station notes from MPI data:", mpi)
//     if (mpi.stations && Array.isArray(mpi.stations)) {
//       mpi.stations.forEach((station) => {
//         console.log(`📍 Processing station notes for: ${station.stationName} (${station.id})`)
//         let stationNotesArray: StationNote[] = []
//         // Check multiple possible locations for notes in the station data
//         if (station.Note) {
//           if (Array.isArray(station.Note)) {
//             // Handle array of notes
//             stationNotesArray = station.Note.filter(
//               (note) => note && typeof note === "string" && note.trim() !== "",
//             ).map((note, index) => ({
//               id: `note-${station.id}-${index}-${Date.now()}`,
//               content: note.trim(),
//               createdAt: new Date().toISOString(),
//             }))
//             console.log(`📝 Found Note array for station ${station.id}:`, stationNotesArray)
//           } else if (typeof station.Note === "string" && station.Note.trim() !== "") {
//             // Handle single note string
//             stationNotesArray = [
//               {
//                 id: `note-${station.id}-0-${Date.now()}`,
//                 content: station.Note.trim(),
//                 createdAt: new Date().toISOString(),
//               },
//             ]
//             console.log(`📝 Found single Note for station ${station.id}:`, stationNotesArray)
//           }
//         }
//         // Also check for 'notes' field (alternative naming)
//         if (stationNotesArray.length === 0 && station.notes && Array.isArray(station.notes)) {
//           stationNotesArray = station.notes
//             .filter((note) => note && (typeof note === "string" || (note.content && note.content.trim())))
//             .map((note, index) => ({
//               id: note.id || `note-${station.id}-${index}-${Date.now()}`,
//               content: typeof note === "string" ? note : note.content,
//               createdAt: note.createdAt || new Date().toISOString(),
//             }))
//           console.log(`📝 Found notes array for station ${station.id}:`, stationNotesArray)
//         }
//         initialNotes[station.id] = stationNotesArray
//         console.log(`✅ Initialized ${stationNotesArray.length} notes for station ${station.id}`)
//       })
//     }
//     console.log("🎯 Final initial station notes:", initialNotes)
//     setStationNotes(initialNotes)
//   }, [mpi.stations])

//   // Initialize station documents from MPI data - ENHANCED
//   useEffect(() => {
//     const initialDocs: Record<string, StationDocument[]> = {}
//     console.log("🔍 Initializing station documents from MPI data:", mpi)
//     if (mpi.stations && Array.isArray(mpi.stations)) {
//       mpi.stations.forEach((station) => {
//         console.log(`📍 Processing station documents for: ${station.stationName} (${station.id})`)
//         let stationDocsArray: StationDocument[] = []

//         // Check multiple possible locations for documents in the station data
//         const documentSources = [
//           station.documentations,
//           station.documents,
//           station.stationDocuments,
//           station.stationMpiDocs,
//         ]

//         for (const docSource of documentSources) {
//           if (docSource && Array.isArray(docSource) && docSource.length > 0) {
//             stationDocsArray = docSource
//               .filter((doc) => doc && (doc.fileUrl || doc.url))
//               .map((doc, index) => ({
//                 id: doc.id || `doc-${station.id}-${index}-${Date.now()}`,
//                 fileUrl: doc.fileUrl || doc.url,
//                 description: doc.description || doc.fileName || doc.originalName || "Untitled Document",
//                 stationId: station.id,
//                 mpiId: doc.mpiId || mpi.id,
//                 createdAt: doc.createdAt || new Date().toISOString(),
//                 updatedAt: doc.updatedAt || new Date().toISOString(),
//               }))
//             if (stationDocsArray.length > 0) {
//               console.log(`📄 Found documents for station ${station.id}:`, stationDocsArray)
//               break // Use the first source that has documents
//             }
//           }
//         }

//         // Also check if MPI has stationMpiDocuments for this station
//         if (mpi.stationMpiDocuments && Array.isArray(mpi.stationMpiDocuments)) {
//           const mpiStationDocs = mpi.stationMpiDocuments
//             .filter((doc) => doc.stationId === station.id)
//             .map((doc) => ({
//               id: doc.id,
//               fileUrl: doc.fileUrl,
//               description: doc.description || doc.originalName || "Untitled Document",
//               stationId: station.id,
//               mpiId: mpi.id,
//               createdAt: doc.createdAt || new Date().toISOString(),
//               updatedAt: doc.updatedAt || new Date().toISOString(),
//             }))

//           // Merge with existing documents, avoiding duplicates
//           mpiStationDocs.forEach((mpiDoc) => {
//             if (!stationDocsArray.find((doc) => doc.id === mpiDoc.id)) {
//               stationDocsArray.push(mpiDoc)
//             }
//           })
//         }

//         initialDocs[station.id] = stationDocsArray
//         console.log(`✅ Initialized ${stationDocsArray.length} documents for station ${station.id}`)
//       })
//     }
//     console.log("🎯 Final initial station documents:", initialDocs)
//     setStationDocuments(initialDocs)
//   }, [mpi.stations, mpi.stationMpiDocuments])

//   // Restore focus to instruction input after re-render
//   useEffect(() => {
//     if (focusedInstructionIndex !== null && instructionRefs.current[focusedInstructionIndex]) {
//       const input = instructionRefs.current[focusedInstructionIndex]
//       if (input) {
//         const cursorPosition = input.selectionStart || 0
//         // Use setTimeout to ensure the DOM has updated
//         setTimeout(() => {
//           input.focus()
//           input.setSelectionRange(cursorPosition, cursorPosition)
//         }, 0)
//       }
//     }
//   }, [instructions, focusedInstructionIndex])

//   // Add this useEffect after the instruction focus useEffect
//   useEffect(() => {
//     if (focusedSpecificationId && specificationRefs.current[focusedSpecificationId]) {
//       const input = specificationRefs.current[focusedSpecificationId]
//       if (input) {
//         const cursorPosition = input.selectionStart || 0
//         setTimeout(() => {
//           input.focus()
//           input.setSelectionRange(cursorPosition, cursorPosition)
//         }, 0)
//       }
//     }
//   }, [specificationValues, focusedSpecificationId])

//   // Load existing IDs for validation (excluding current MPI)
//   const loadExistingIds = async () => {
//     try {
//       setCheckingIds(true)
//       const mpis = await MPIAPI.getAllMPIs()
//       // Filter out current MPI from validation
//       const otherMpis = mpis.filter((m) => m.id !== mpi.id)
//       const jobIds = otherMpis.map((m) => m.jobId.toLowerCase())
//       const assemblyIds = otherMpis.map((m) => m.assemblyId.toLowerCase())
//       const documentControlIds = otherMpis
//         .filter((m) => m.orderForms && m.orderForms.length > 0)
//         .flatMap((m) => m.orderForms.map((form) => form.documentControlId))
//         .filter(Boolean)
//         .map((id) => id.toLowerCase())
//       setExistingJobIds(jobIds)
//       setExistingAssemblyIds(assemblyIds)
//       setExistingDocumentControlIds(documentControlIds)
//     } catch (error) {
//       console.error("Failed to load existing IDs:", error)
//     } finally {
//       setCheckingIds(false)
//     }
//   }

//   // Validation functions
//   const validateJobId = (jobId: string): string | null => {
//     if (!jobId.trim()) return "Job ID is required"
//     if (jobId.length < 2) return "Job ID must be at least 2 characters"
//     if (existingJobIds.includes(jobId.toLowerCase())) {
//       return `Job ID "${jobId}" already exists. Please use a different Job ID.`
//     }
//     return null
//   }

//   const validateAssemblyId = (assemblyId: string): string | null => {
//     if (!assemblyId.trim()) return "Assembly ID is required"
//     if (assemblyId.length < 2) return "Assembly ID must be at least 2 characters"
//     if (existingAssemblyIds.includes(assemblyId.toLowerCase())) {
//       return `Assembly ID "${assemblyId}" already exists. Please use a different Assembly ID.`
//     }
//     return null
//   }

//   const validateDocumentControlId = (documentControlId: string): string | null => {
//     if (!documentControlId.trim()) return null
//     if (documentControlId.length < 2) return "Document Control ID must be at least 2 characters"
//     if (existingDocumentControlIds.includes(documentControlId.toLowerCase())) {
//       return `Document Control ID "${documentControlId}" already exists. Please use a different ID.`
//     }
//     ;`Document Control ID "${documentControlId}" already exists. Please use a different ID.`
//   }

//   // Instruction handlers
//   const handleAddInstruction = () => {
//     setInstructions((prev) => [...prev, ""])
//   }

//   const handleInstructionChange = (index: number, value: string) => {
//     setInstructions((prev) => prev.map((instruction, i) => (i === index ? value : instruction)))
//   }

//   const handleRemoveInstruction = (index: number) => {
//     setInstructions((prev) => prev.filter((_, i) => i !== index))
//     toast({
//       title: "Instruction Removed",
//       description: "Instruction has been removed from the list.",
//     })
//   }

//   // Station notes handlers
//   const handleAddNote = async () => {
//     if (!activeStationId || !newNoteContent.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter note content.",
//         variant: "destructive",
//       })
//       return
//     }
//     setAddingNote(true)
//     try {
//       const newNote: StationNote = {
//         id: `note-${activeStationId}-${Date.now()}`,
//         content: newNoteContent.trim(),
//         createdAt: new Date().toISOString(),
//       }
//       setStationNotes((prev) => ({
//         ...prev,
//         [activeStationId]: [...(prev[activeStationId] || []), newNote],
//       }))
//       setNewNoteContent("")
//       toast({
//         title: "Success",
//         description: "Note added successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to add note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add note. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setAddingNote(false)
//     }
//   }

//   const handleDeleteNote = async (stationId: string, noteId: string) => {
//     try {
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: prev[stationId]?.filter((note) => note.id !== noteId) || [],
//       }))
//       toast({
//         title: "Success",
//         description: "Note deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete note. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Station document handlers
//   const handleStationDocumentUpload = async (file: File, description: string, fileName?: string) => {
//     if (!activeStationId) {
//       toast({
//         title: "Error",
//         description: "No station selected.",
//         variant: "destructive",
//       })
//       return
//     }
//     setUploadingStationDoc(true)
//     try {
//       const finalDescription = description.trim() || file.name
//       const finalFileName = fileName?.trim() || file.name
//       console.log("📤 Station document upload:", {
//         file: file.name,
//         description: finalDescription,
//         fileName: finalFileName,
//         stationId: activeStationId,
//         mpiId: mpi.id,
//       })
//       if (!mpi.id) {
//         // For new MPIs, queue the document locally
//         console.log("💾 QUEUING station document locally - MPI not created yet...")
//         if (file.size > 10 * 1024 * 1024) {
//           throw new Error("File size exceeds 10MB limit")
//         }
//         const newDoc = {
//           id: `temp-${Date.now()}`,
//           file: file,
//           description: finalDescription,
//           fileName: finalFileName,
//           stationId: activeStationId,
//           isUploaded: false,
//         }
//         setStationDocuments((prev) => ({
//           ...prev,
//           [activeStationId]: [...(prev[activeStationId] || []), newDoc],
//         }))
//         toast({
//           title: "✅ Document Queued Successfully",
//           description: `"${finalDescription}" will be uploaded when the MPI is saved.`,
//         })
//       } else {
//         // For existing MPIs, upload directly
//         console.log("📤 Uploading station document directly to existing MPI...")
//         const formData = new FormData()
//         formData.append("files", file)
//         formData.append("stationId", activeStationId)
//         formData.append("description", finalDescription)
//         formData.append("mpiId", mpi.id)
//         formData.append("originalName", file.name)
//         const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
//           method: "POST",
//           body: formData,
//         })
//         if (!response.ok) {
//           const errorText = await response.text()
//           console.error("❌ Direct upload failed:", errorText)
//           throw new Error(`Upload failed: ${response.status} - ${errorText}`)
//         }
//         const result = await response.json()
//         console.log("✅ Station document uploaded successfully:", result)
//         // Add to existing documents for the station
//         setStationDocuments((prev) => ({
//           ...prev,
//           [activeStationId]: [
//             ...(prev[activeStationId] || []),
//             {
//               id: result.id || `uploaded-${Date.now()}`,
//               fileUrl: result.fileUrl,
//               description: result.description || finalDescription,
//               fileName: result.fileName || finalFileName,
//               stationId: activeStationId,
//               isUploaded: true,
//             },
//           ],
//         }))
//         toast({
//           title: "Success",
//           description: "Station document uploaded successfully.",
//         })
//       }
//     } catch (error) {
//       console.error("Station document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingStationDoc(false)
//     }
//   }

//   const handleDeleteStationDocument = async (stationId: string, documentId: string) => {
//     try {
//       // Check if it's an uploaded document or queued document
//       const stationDocs = stationDocuments[stationId] || []
//       const doc = stationDocs.find((d) => d.id === documentId)
//       if (doc && doc.isUploaded && doc.id && !doc.id.startsWith("temp-")) {
//         // Delete uploaded document via API
//         await StationMpiDocAPI.delete(documentId)
//       }
//       // Remove from local state
//       setStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: prev[stationId]?.filter((doc) => doc.id !== documentId) || [],
//       }))
//       toast({
//         title: "Success",
//         description: "Document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete document. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Enhanced MPI Documentation handlers with proper filename support
//   const handleMpiDocumentUpload = async (file: File, description: string) => {
//     setUploadingMpiDoc(true)
//     try {
//       if (!file) {
//         throw new Error("No file selected")
//       }
//       const finalDescription = description.trim() || file.name
//       console.log("📤 MPI document upload:", {
//         originalFile: file.name,
//         description: finalDescription,
//         fileSize: file.size,
//       })
//       // For edit mode, upload immediately since MPI already exists
//       const result = await MPIDocumentationAPI.uploadDocument(mpi.id, file, finalDescription, file.name)
//       const newDoc: MPIDocumentation = {
//         id: result.id,
//         fileUrl: result.fileUrl,
//         description: result.description,
//         fileName: file.name,
//         originalFileName: file.name,
//         isUploaded: true,
//       }
//       setMpiDocumentation((prev) => [...prev, newDoc])
//       toast({
//         title: "Success",
//         description: "Document uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("Document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingMpiDoc(false)
//     }
//   }

//   const removeMpiDocument = async (index: number) => {
//     const doc = mpiDocumentation[index]
//     if (doc.id && doc.isUploaded) {
//       try {
//         await MPIDocumentationAPI.deleteDocument(doc.id)
//         toast({
//           title: "Success",
//           description: "Document deleted successfully.",
//         })
//       } catch (error) {
//         console.error("Failed to delete document:", error)
//         toast({
//           title: "Error",
//           description: "Failed to delete document.",
//           variant: "destructive",
//         })
//         return
//       }
//     }
//     setMpiDocumentation((prev) => prev.filter((_, i) => i !== index))
//   }

//   useEffect(() => {
//     loadStations()
//     loadEnums()
//     loadChecklistData()
//     loadExistingIds()
//     loadServices() // Add this line
//   }, [])

//   useEffect(() => {
//     // Update selected stations when formData.selectedStationIds changes
//     const selected = availableStations.filter((station) => formData.selectedStationIds.includes(station.id))
//     setSelectedStations(selected)
//   }, [formData.selectedStationIds, availableStations])

//   const loadStations = async () => {
//     try {
//       setLoadingStations(true)
//       const stations = await StationAPI.getAllStations()
//       setAvailableStations(stations)
//     } catch (error) {
//       console.error("Failed to load stations:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load stations. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingStations(false)
//     }
//   }

//   const loadEnums = async () => {
//     try {
//       setLoadingEnums(true)
//       const enumsData = await MPIAPI.getEnums()
//       setEnums(enumsData)
//     } catch (error) {
//       console.error("Failed to load enums:", error)
//       toast({
//         title: "Warning",
//         description: "Failed to load form options.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingEnums(false)
//     }
//   }

//   const loadChecklistData = async () => {
//     try {
//       setLoadingAvailableChecklist(true)
//       // Load existing checklists from MPI - show ONLY REQUIRED items (like details page)
//       const existingChecklistSections: ChecklistSection[] = []
//       const existingItemDescriptions = new Set<string>()
//       if (mpi.checklists && mpi.checklists.length > 0) {
//         mpi.checklists.forEach((checklist, checklistIndex) => {
//           if (checklist.checklistItems && checklist.checklistItems.length > 0) {
//             // Filter to only show required items (exactly like details page)
//             const requiredItems = checklist.checklistItems.filter((item) => item.required === true)
//             if (requiredItems.length > 0) {
//               existingChecklistSections.push({
//                 id: `existing-section-${checklistIndex}`,
//                 name: checklist.name,
//                 description: `${checklist.name} - Existing required checklist items`,
//                 items: requiredItems.map((item, itemIndex) => {
//                   // Track this item as existing
//                   existingItemDescriptions.add(item.description.toLowerCase().trim())
//                   return {
//                     id: `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
//                     description: item.description,
//                     required: item.required,
//                     remarks: item.remarks,
//                     category: item.category || checklist.name,
//                     isActive: item.isActive,
//                     createdBy: item.createdBy,
//                     sectionId: `existing-section-${checklistIndex}`,
//                   }
//                 }),
//               })
//             }
//           }
//         })
//       }
//       setExistingChecklists(existingChecklistSections)
//       // Load available checklist template and filter out existing items
//       const template = await MPIAPI.getChecklistTemplate()
//       console.log("📦 Available checklist template loaded:", template)
//       if (template && Array.isArray(template)) {
//         const validSections = template
//           .filter(
//             (section) =>
//               section && typeof section === "object" && section.name && Array.isArray(section.checklistItems),
//           )
//           .map((section, sectionIndex) => {
//             // Filter out items that already exist in the MPI
//             const availableItems = (section.checklistItems || [])
//               .filter((item: any) => {
//                 const itemDescription = item.description?.toLowerCase().trim()
//                 return itemDescription && !existingItemDescriptions.has(itemDescription)
//               })
//               .map((item: any, itemIndex: number) => ({
//                 id: `available-${section.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
//                 description: item.description || "No description",
//                 required: false, // Default to No for available items
//                 remarks: "",
//                 category: item.category || section.name,
//                 isActive: item.isActive !== undefined ? item.isActive : true,
//                 createdBy: item.createdBy || "System",
//                 sectionId: `available-section-${sectionIndex}`,
//               }))
//             return availableItems.length > 0
//               ? {
//                   id: `available-section-${sectionIndex}`,
//                   name: section.name,
//                   description: `${section.name} quality control items`,
//                   items: availableItems,
//                 }
//               : null
//           })
//           .filter(Boolean)
//         setAvailableChecklistTemplate(validSections)
//       } else {
//         setAvailableChecklistTemplate([])
//       }
//     } catch (error) {
//       console.error("Failed to load checklist data:", error)
//       setAvailableChecklistTemplate([])
//       setExistingChecklists([])
//     } finally {
//       setLoadingAvailableChecklist(false)
//     }
//   }

//   const loadServices = async () => {
//     try {
//       setLoadingServices(true)
//       const fetchedServices = await ServiceAPI.getAll()
//       setServices(fetchedServices)
//       // Set selected service if one exists in the order form
//       if (orderFormData.selectedServiceId && fetchedServices.length > 0) {
//         const service = fetchedServices.find((s) => s.id === orderFormData.selectedServiceId)
//         setSelectedService(service || null)
//       }
//     } catch (error) {
//       console.error("Failed to fetch services:", error)
//       toast({
//         title: "Warning",
//         description: "Failed to load services. Please try again.",
//         variant: "destructive",
//       })
//       setServices([])
//     } finally {
//       setLoadingServices(false)
//     }
//   }

//   const handleChecklistItemChange = (itemId: string, field: "required" | "remarks", value: boolean | string) => {
//     setChecklistModifications((prev) => ({
//       ...prev,
//       [itemId]: {
//         ...prev[itemId],
//         [field]: value,
//       },
//     }))
//   }

//   const getChecklistItemValue = (itemId: string, field: "required" | "remarks", defaultValue: boolean | string) => {
//     return checklistModifications[itemId]?.[field] ?? defaultValue
//   }

//   const handleOrderFormChange = (field: string, value: string | boolean | string[]) => {
//     setOrderFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleServiceChange = (serviceId: string) => {
//     const service = services.find((s) => s.id === serviceId)
//     if (service) {
//       setSelectedService(service)
//       handleOrderFormChange("selectedServiceId", serviceId)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log("🔄 Starting form submission...")
//     // Validation - Reload existing IDs first
//     await loadExistingIds()
//     // Enhanced validation with better error messages
//     const jobIdError = validateJobId(formData.jobId)
//     const assemblyIdError = validateAssemblyId(formData.assemblyId)
//     const documentControlIdError = orderFormData.documentControlId
//       ? validateDocumentControlId(orderFormData.documentControlId)
//       : null

//     const validationErrors = []
//     if (jobIdError) validationErrors.push(`Job ID: ${jobIdError}`)
//     if (assemblyIdError) validationErrors.push(`Assembly ID: ${assemblyIdError}`)
//     if (documentControlIdError) validationErrors.push(`Document Control ID: ${documentControlIdError}`)

//     // Check for required fields
//     if (!formData.jobId.trim()) validationErrors.push("Job ID is required")
//     if (!formData.assemblyId.trim()) validationErrors.push("Assembly ID is required")

//     if (validationErrors.length > 0) {
//       toast({
//         title: "❌ Validation Failed",
//         description: (
//           <div className="space-y-2">
//             <p className="font-semibold">Please fix the following issues:</p>
//             <ul className="list-disc list-inside space-y-1">
//               {validationErrors.map((error, index) => (
//                 <li key={index} className="text-sm">
//                   {error}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ),
//         variant: "destructive",
//         duration: 10000,
//       })
//       setActiveTab("basic-info")
//       return
//     }

//     console.log("Selected stations:", formData.selectedStationIds)
//     console.log("Current specification values:", specificationValues)
//     console.log("Current checklist modifications:", checklistModifications)

//     // Prepare stations data - Send ALL selected stations with their specification values in the correct format
//     const stationsData = formData.selectedStationIds
//       .map((stationId) => {
//         const station = selectedStations.find((s) => s.id === stationId)
//         if (!station) return null

//         // Get specification values for this station in the format the backend expects
//         const stationSpecificationValues =
//           station.specifications?.map((spec) => {
//             const specValue = specificationValues[spec.id]
//             return {
//               specificationId: spec.id,
//               value: specValue?.value || "", // Send current value or empty string
//               ...(specValue?.unit && { unit: specValue.unit }),
//               ...(specValue?.fileUrl && { fileUrl: specValue.fileUrl }),
//             }
//           }) || []

//         // Include station notes in the update
//         const stationNotesArray = stationNotes[stationId]?.map((note) => note.content) || []

//         return {
//           id: station.id,
//           stationId: station.stationId,
//           stationName: station.stationName,
//           status: station.status,
//           description: station.description || "",
//           location: station.location || "",
//           operator: station.operator || "",
//           priority: station.priority || 1,
//           Note: stationNotesArray,
//           // Send specification values in the format the backend expects
//           specificationValues: stationSpecificationValues,
//         }
//       })
//       .filter(Boolean)

//     console.log("📤 Stations data being sent:", JSON.stringify(stationsData, null, 2))
//     console.log("🔧 Current specification values:", specificationValues)

//     // Prepare existing checklist updates with ACTUAL database IDs
//     const existingChecklistUpdates: any[] = []
//     if (mpi.checklists && mpi.checklists.length > 0) {
//       mpi.checklists.forEach((checklist) => {
//         const updatedItems: any[] = []
//         let hasChanges = false
//         if (checklist.checklistItems && checklist.checklistItems.length > 0) {
//           checklist.checklistItems.forEach((item, itemIndex) => {
//             const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
//             const modifications = checklistModifications[itemId]
//             if (modifications) {
//               // Check if there are actual changes
//               if (modifications.required !== item.required || modifications.remarks !== item.remarks) {
//                 hasChanges = true
//               }
//               updatedItems.push({
//                 id: item.id, // Use the actual database ID from the MPI
//                 description: item.description,
//                 required: modifications.required,
//                 remarks: modifications.remarks,
//                 category: item.category,
//                 createdBy: item.createdBy,
//                 isActive: item.isActive,
//               })
//             }
//           })
//         }
//         // Only include checklist if there are actual changes
//         if (hasChanges && updatedItems.length > 0) {
//           existingChecklistUpdates.push({
//             id: checklist.id, // Use the actual checklist database ID
//             name: checklist.name,
//             checklistItems: updatedItems,
//           })
//         }
//       })
//     }

//     // Prepare new checklists from available template
//     const newChecklists: any[] = []
//     availableChecklistTemplate.forEach((section) => {
//       const newItems: any[] = []
//       section.items.forEach((item) => {
//         const modifications = checklistModifications[item.id]
//         if (modifications && modifications.required) {
//           newItems.push({
//             description: item.description,
//             required: modifications.required,
//             remarks: modifications.remarks || "",
//             createdBy: item.createdBy || "System",
//             isActive: item.isActive !== undefined ? item.isActive : true,
//             category: item.category || section.name,
//           })
//         }
//       })
//       if (newItems.length > 0) {
//         newChecklists.push({
//           name: section.name,
//           checklistItems: newItems,
//         })
//       }
//     })

//     // Prepare complete submission data matching backend expectations
//     const submitData: any = {
//       jobId: formData.jobId,
//       assemblyId: formData.assemblyId,
//       customer: formData.customer || null,
//     }

//     // FIXED: Always include order forms for updates with proper structure
//     const orderFormSubmissionData = {
//       id: orderFormData.id || undefined, // Include ID if exists for update
//       OrderType: orderFormData.orderType,
//       distributionDate: orderFormData.distributionDate ? new Date(orderFormData.distributionDate).toISOString() : null,
//       requiredBy: orderFormData.requiredBy ? new Date(orderFormData.requiredBy).toISOString() : null,
//       internalOrderNumber: orderFormData.internalOrderNumber || null,
//       revision: orderFormData.revision || null,
//       otherAttachments: orderFormData.otherAttachments || null,
//       fileAction: orderFormData.fileAction,
//       markComplete: orderFormData.markComplete,
//       documentControlId: orderFormData.documentControlId || null,
//       // Add service ID mapping
//       ...(orderFormData.selectedServiceId && {
//         serviceIds: [orderFormData.selectedServiceId], // Convert single ID to array
//       }),
//     }

//     // Send as array to match backend expectation
//     submitData.orderForms = [orderFormSubmissionData]

//     console.log("📋 Order form data being sent:", JSON.stringify(submitData.orderForms, null, 2))

//     // Add stations with specifications if they exist
//     if (stationsData.length > 0) {
//       submitData.stations = stationsData
//     }

//     // Combine existing and new checklists for the backend
//     const allChecklists = [...existingChecklistUpdates, ...newChecklists]
//     if (allChecklists.length > 0) {
//       submitData.checklists = allChecklists
//     }

//     // Add instructions - always include for updates (use backend field name 'Instruction')
//     submitData.Instruction = instructions.filter((instruction) => instruction.trim() !== "")

//     // Add uploaded documents to submission data with both description and fileName
//     if (mpiDocumentation.length > 0) {
//       const uploadedDocs = mpiDocumentation
//         .filter((doc) => doc.isUploaded && doc.fileUrl)
//         .map((doc) => ({
//           id: doc.id,
//           fileUrl: doc.fileUrl,
//           description: doc.description,
//           fileName: doc.fileName, // Include fileName for backend
//           originalFileName: doc.originalFileName, // Include original filename
//         }))
//       if (uploadedDocs.length > 0) {
//         submitData.mpiDocs = uploadedDocs
//       }
//     }

//     console.log("📤 Submitting MPI update data:", JSON.stringify(submitData, null, 2))

//     try {
//       await onSubmit(submitData as UpdateMPIDto)
//       if (newChecklists.length > 0) {
//         toast({
//           title: "Success",
//           description: `MPI updated successfully with ${newChecklists.length} new checklist section(s) added.`,
//         })
//       } else {
//         toast({
//           title: "Success",
//           description: "MPI updated successfully.",
//         })
//       }
//     } catch (error: any) {
//       console.error("Form submission error:", error)
//       // Handle specific error types
//       if (error.message?.includes("Unique constraint failed")) {
//         if (error.message?.includes("documentControlId")) {
//           toast({
//             title: "🚫 Duplicate Document Control ID",
//             description: `Document Control ID "${orderFormData.documentControlId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         } else if (error.message?.includes("jobId")) {
//           toast({
//             title: "🚫 Duplicate Job ID",
//             description: `Job ID "${formData.jobId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         } else if (error.message?.includes("assemblyId")) {
//           toast({
//             title: "🚫 Duplicate Assembly ID",
//             description: `Assembly ID "${formData.assemblyId}" already exists.`,
//             variant: "destructive",
//             duration: 10000,
//           })
//           setActiveTab("basic-info")
//           await loadExistingIds()
//           return
//         }
//       }
//       toast({
//         title: "Submission Error",
//         description: error.message || "Failed to update MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleStationSelectionChange = (stationIds: string[]) => {
//     setFormData((prev) => ({ ...prev, selectedStationIds: stationIds }))
//   }

//   const handleSpecificationValueChange = (specificationId: string, value: string, unit?: string) => {
//     console.log("🔧 Updating specification:", specificationId, "with value:", value, "unit:", unit)
//     setSpecificationValues((prev) => {
//       const currentSpec = prev[specificationId] || { specificationId, value: "", unit: undefined, fileUrl: undefined }
//       const updated = {
//         ...prev,
//         [specificationId]: {
//           ...currentSpec,
//           specificationId,
//           value,
//           unit: unit !== undefined ? unit : currentSpec.unit,
//         },
//       }
//       console.log("🔧 Updated specification values:", updated)
//       return updated
//     })
//   }

//   const handleFileUpload = async (specificationId: string, file: File, stationId: string, unit?: string) => {
//     console.log("📁 Starting file upload for spec:", specificationId, "station:", stationId)
//     setUploadingFiles((prev) => new Set(prev).add(specificationId))
//     try {
//       const result = await StationAPI.uploadStationSpecificationFile(file, specificationId, stationId, unit)
//       console.log("📁 File upload result:", result)
//       setSpecificationValues((prev) => {
//         const updated = {
//           ...prev,
//           [specificationId]: {
//             specificationId,
//             value: result.value || file.name,
//             fileUrl: result.fileUrl,
//             unit: unit || prev[specificationId]?.unit,
//           },
//         }
//         console.log("📁 Updated specification values after upload:", updated)
//         return updated
//       })
//       toast({
//         title: "Success",
//         description: "File uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("File upload error:", error)
//       toast({
//         title: "Error",
//         description: "Failed to upload file. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingFiles((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(specificationId)
//         return newSet
//       })
//     }
//   }

//   const renderSpecificationInput = (spec: any, stationId: string) => {
//     const specValue = specificationValues[spec.id]
//     const isUploading = uploadingFiles.has(spec.id)
//     // Only log if there's an issue or for debugging specific specs
//     if (!specValue && spec.required) {
//       console.log(`⚠️ Required spec ${spec.name} (${spec.id}) has no value`)
//     }

//     switch (spec.inputType) {
//       case "TEXT":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <Input
//               ref={(el) => {
//                 specificationRefs.current[spec.id] = el
//               }}
//               id={`spec-${spec.id}`}
//               value={specValue?.value || ""}
//               onChange={(e) => {
//                 setFocusedSpecificationId(spec.id)
//                 handleSpecificationValueChange(spec.id, e.target.value)
//               }}
//               onFocus={() => setFocusedSpecificationId(spec.id)}
//               onBlur={() => setFocusedSpecificationId(null)}
//               placeholder={`Enter ${spec.name.toLowerCase()}`}
//               className="h-10"
//             />
//           </div>
//         )
//       case "number":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <div className="flex gap-2">
//               <Input
//                 ref={(el) => {
//                   specificationRefs.current[spec.id] = el
//                 }}
//                 id={`spec-${spec.id}`}
//                 type="number"
//                 value={specValue?.value || ""}
//                 onChange={(e) => {
//                   setFocusedSpecificationId(spec.id)
//                   handleSpecificationValueChange(spec.id, e.target.value, specValue?.unit)
//                 }}
//                 onFocus={() => setFocusedSpecificationId(spec.id)}
//                 onBlur={() => setFocusedSpecificationId(null)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10 flex-1"
//               />
//               <Input
//                 placeholder="Unit"
//                 value={specValue?.unit || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
//                 className="h-10 w-20"
//               />
//             </div>
//           </div>
//         )
//       case "CHECKBOX":
//         return (
//           <div className="space-y-2">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id={`spec-${spec.id}`}
//                 checked={specValue?.value === "true"}
//                 onCheckedChange={(checked) => handleSpecificationValueChange(spec.id, checked ? "true" : "false")}
//               />
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//             </div>
//           </div>
//         )
//       case "DROPDOWN":
//         const suggestions = spec.suggestions || []
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <Select
//               value={specValue?.value || ""}
//               onValueChange={(value) => handleSpecificationValueChange(spec.id, value)}
//             >
//               <SelectTrigger className="h-10">
//                 <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
//               </SelectTrigger>
//               <SelectContent>
//                 {suggestions.map((suggestion: string, index: number) => (
//                   <SelectItem key={index} value={suggestion}>
//                     {suggestion}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )
//       case "FILE_UPLOAD":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <Input
//                   id={`spec-${spec.id}`}
//                   type="file"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0]
//                     if (file) {
//                       handleFileUpload(spec.id, file, stationId, specValue?.unit)
//                     }
//                   }}
//                   accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
//                   className="cursor-pointer flex-1"
//                   disabled={isUploading}
//                 />
//                 {isUploading && (
//                   <div className="flex items-center gap-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
//                     <span className="text-xs text-muted-foreground">Uploading...</span>
//                   </div>
//                 )}
//               </div>
//               <Input
//                 placeholder="Unit (optional)"
//                 value={specValue?.unit || ""}
//                 onChange={(e) => handleSpecificationValueChange(spec.id, specValue?.value || "", e.target.value)}
//                 className="h-10 w-32"
//               />
//               {specValue?.fileUrl && (
//                 <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
//                   <FileText className="w-4 h-4 text-green-600" />
//                   <span className="text-sm text-green-800">File uploaded successfully</span>
//                   <a
//                     href={specValue.fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-xs text-blue-600 hover:underline"
//                   >
//                     View
//                   </a>
//                 </div>
//               )}
//               <p className="text-xs text-muted-foreground">
//                 Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
//               </p>
//             </div>
//           </div>
//         )
//       default:
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={`spec-${spec.id}`}>
//               {spec.name}
//               {spec.required && <span className="text-green-500 ml-1">*</span>}
//             </Label>
//             <Input
//               id={`spec-${spec.id}`}
//               value={specValue?.value || ""}
//               onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value)}
//               placeholder={`Enter ${spec.name.toLowerCase()}`}
//               className="h-10"
//             />
//           </div>
//         )
//     }
//   }

//   const renderStationDocuments = (stationId: string) => {
//     const documents = stationDocuments[stationId] || []
//     return (
//       <div className="space-y-4">
//         {/* Upload Section */}
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
//           <div className="space-y-4">
//             <h4 className="font-medium text-sm">Upload Station Document</h4>
//             <div className="grid grid-cols-1 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="station-doc-file">Select Files *</Label>
//                 <Input
//                   id="station-doc-file"
//                   type="file"
//                   accept="*/*"
//                   className="cursor-pointer"
//                   disabled={uploadingStationDoc}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="station-doc-description">Description</Label>
//                 <Input
//                   id="station-doc-description"
//                   placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                   disabled={uploadingStationDoc}
//                 />
//               </div>
//             </div>
//             <Button
//               type="button"
//               variant="outline"
//               disabled={uploadingStationDoc}
//               onClick={async (e) => {
//                 e.preventDefault()
//                 e.stopPropagation()
//                 const fileInput = document.getElementById("station-doc-file") as HTMLInputElement
//                 const descInput = document.getElementById("station-doc-description") as HTMLInputElement
//                 const file = fileInput?.files?.[0]
//                 const description = descInput?.value?.trim() || ""
//                 if (!file) {
//                   toast({
//                     title: "Missing File",
//                     description: "Please select a file to upload.",
//                     variant: "destructive",
//                   })
//                   return
//                 }
//                 await handleStationDocumentUpload(file, description, file.name)
//                 fileInput.value = ""
//                 descInput.value = ""
//               }}
//               className="w-full"
//             >
//               {uploadingStationDoc ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                   Uploading File...
//                 </div>
//               ) : (
//                 <>
//                   <Upload className="w-4 h-4 mr-2" />
//                   Upload File
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//         {/* Documents List */}
//         {documents.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No files available for this station.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 gap-4">
//               {documents.map((doc) => (
//                 <div key={doc.id} className="p-4 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start gap-3 flex-1">
//                       <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-medium text-sm text-gray-900 truncate">
//                           {doc.description || "Untitled Document"}
//                         </h4>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Uploaded: {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "Unknown date"}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 ml-4">
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="outline"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           window.open(doc.fileUrl, "_blank")
//                         }}
//                         className="h-8 px-3"
//                       >
//                         <Eye className="w-3 h-3 mr-1" />
//                         View
//                       </Button>
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="outline"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           const link = document.createElement("a")
//                           link.href = doc.fileUrl
//                           link.download = doc.description || "document"
//                           link.click()
//                         }}
//                         className="h-8 px-3"
//                       >
//                         <Download className="w-3 h-3 mr-1" />
//                         Download
//                       </Button>
//                       <Button
//                         type="button"
//                         size="sm"
//                         variant="outline"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           e.stopPropagation()
//                           handleDeleteStationDocument(stationId, doc.id)
//                         }}
//                         className="h-8 px-3 text-green-600 hover:text-green-700"
//                       >
//                         <Trash2 className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const renderStationNotes = (stationId: string) => {
//     const notes = stationNotes[stationId] || []
//     return (
//       <div className="space-y-4">
//         {/* Add Note Section */}
//         {/* <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
//             <Plus className="w-4 h-4" />
//             Add Station Note
//           </h4>
//           <div className="space-y-3">
//             <Textarea
//               value={newNoteContent}
//               onChange={(e) => setNewNoteContent(e.target.value)}
//               placeholder="Enter operational notes, safety instructions, or maintenance reminders..."
//               rows={3}
//               className="resize-none"
//             />
//             <Button
//               type="button"
//               onClick={(e) => {
//                 e.preventDefault()
//                 e.stopPropagation()
//                 handleAddNote()
//               }}
//               disabled={addingNote || !newNoteContent.trim()}
//               size="sm"
//               className="w-full"
//             >
//               {addingNote ? (
//                 <div className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                   Adding Note...
//                 </div>
//               ) : (
//                 <>
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Note
//                 </>
//               )}
//             </Button>
//           </div>
//         </div> */}
//         {/* Notes List */}
//         {notes.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No notes available for this station.</p>
//             <p className="text-sm text-muted-foreground mt-1">
//               Add operational notes, safety instructions, or reminders above.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             <h4 className="font-medium text-sm flex items-center gap-2">
//               <StickyNote className="w-4 h-4" />
//               Station Notes ({notes.length})
//             </h4>
//             <div className="space-y-2">
//               {notes.map((note) => (
//                 <div key={note.id} className="p-3 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.content}</p>
//                       <p className="text-xs text-gray-500 mt-2">
//                         {note.createdAt ? new Date(note.createdAt).toLocaleString() : "Unknown date"}
//                       </p>
//                     </div>
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="outline"
//                       onClick={(e) => {
//                         e.preventDefault()
//                         e.stopPropagation()
//                         handleDeleteNote(stationId, note.id!)
//                       }}
//                       className="ml-3 h-8 px-2 text-green-600 hover:text-green-700"
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const isFormValid = () => {
//     const jobIdError = validateJobId(formData.jobId)
//     const assemblyIdError = validateAssemblyId(formData.assemblyId)
//     const documentControlIdError = orderFormData.documentControlId
//       ? validateDocumentControlId(orderFormData.documentControlId)
//       : null
//     return !jobIdError && !assemblyIdError && !documentControlIdError
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between w-full">
//           <div>
//             <h1 className="text-3xl font-bold text-green-600">Edit MPI</h1>
//             <p className="text-muted-foreground">
//               Job ID: {mpi.jobId} • Assembly ID: {mpi.assemblyId}
//             </p>
//           </div>
//           <Button variant="outline" size="sm" onClick={onCancel}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
//         </div>
//         <Card className="border shadow-sm">
//           <CardContent className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-4">
//                   <TabsTrigger value="basic-info" className="flex items-center gap-2">
//                     <Info className="w-4 h-4" />
//                     Order Details
//                   </TabsTrigger>
//                   <TabsTrigger value="documentation" className="flex items-center gap-2">
//                     <FileText className="w-4 h-4" />
//                     Files
//                     {mpiDocumentation.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {mpiDocumentation.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="checklist" className="flex items-center gap-2">
//                     <ClipboardList className="w-4 h-4" />
//                     Checklist
//                     {existingChecklists.length + availableChecklistTemplate.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {existingChecklists.length + availableChecklistTemplate.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="instructions" className="flex items-center gap-2">
//                     <Factory className="w-4 h-4" />
//                     Instructions
//                     {selectedStations.length > 0 && (
//                       <Badge variant="secondary" size="sm" className="ml-1">
//                         {selectedStations.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                 </TabsList>
//                 {/* Basic Information & Order Form Tab */}
//                 <TabsContent value="basic-info" className="space-y-6 mt-6">
//                   {/* MPI Basic Information */}
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="jobId">
//                             MPI ID *{checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="jobId"
//                             value={formData.jobId}
//                             onChange={(e) => handleChange("jobId", e.target.value)}
//                             placeholder="Enter job ID"
//                             required
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = validateJobId(formData.jobId)
//                             return error ? (
//                               <p className="text-xs text-green-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="assemblyId">
//                             Assembly ID *
//                             {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="assemblyId"
//                             value={formData.assemblyId}
//                             onChange={(e) => handleChange("assemblyId", e.target.value)}
//                             placeholder="Enter assembly ID"
//                             required
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = validateAssemblyId(formData.assemblyId)
//                             return error ? (
//                               <p className="text-xs text-green-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="customer">Customer</Label>
//                           <Input
//                             id="customer"
//                             value={formData.customer}
//                             onChange={(e) => handleChange("customer", e.target.value)}
//                             placeholder="Enter customer name"
//                             className="h-11"
//                           />
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                   {/* Order Forms Section */}
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="internalOrderNumber">Internal Order Number</Label>
//                           <Input
//                             id="internalOrderNumber"
//                             value={orderFormData.internalOrderNumber}
//                             onChange={(e) => handleOrderFormChange("internalOrderNumber", e.target.value)}
//                             placeholder="Enter internal order number"
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="revision">Revision</Label>
//                           <Input
//                             id="revision"
//                             value={orderFormData.revision}
//                             onChange={(e) => handleOrderFormChange("revision", e.target.value)}
//                             placeholder="Enter revision number"
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="documentControlId">
//                             Document Control ID
//                             {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
//                           </Label>
//                           <Input
//                             id="documentControlId"
//                             value={orderFormData.documentControlId}
//                             onChange={(e) => handleOrderFormChange("documentControlId", e.target.value)}
//                             placeholder="Enter document control ID"
//                             className="h-11"
//                           />
//                           {(() => {
//                             const error = orderFormData.documentControlId
//                               ? validateDocumentControlId(orderFormData.documentControlId)
//                               : null
//                             return error ? (
//                               <p className="text-xs text-green-600 flex items-center gap-1">
//                                 <AlertCircle className="w-3 h-3" />
//                                 {error}
//                               </p>
//                             ) : null
//                           })()}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="distributionDate">Distribution Date</Label>
//                           <Input
//                             id="distributionDate"
//                             type="date"
//                             value={orderFormData.distributionDate}
//                             onChange={(e) => handleOrderFormChange("distributionDate", e.target.value)}
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="requiredBy">Required By</Label>
//                           <Input
//                             id="requiredBy"
//                             type="date"
//                             value={orderFormData.requiredBy}
//                             onChange={(e) => handleOrderFormChange("requiredBy", e.target.value)}
//                             className="h-11"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="serviceSelect">Select Service</Label>
//                           <div className="relative">
//                             <Select
//                               value={orderFormData.selectedServiceId || ""}
//                               onChange={handleServiceChange}
//                               disabled={loadingServices}
//                             >
//                               <SelectTrigger id="serviceSelect" className="h-11">
//                                 <SelectValue
//                                   placeholder={
//                                     loadingServices
//                                       ? "Loading services..."
//                                       : services.length === 0
//                                         ? "No services available"
//                                         : "Select a service"
//                                   }
//                                 />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {services.map((service) => (
//                                   <SelectItem key={service.id} value={service.id}>
//                                     <div className="flex flex-col">
//                                       <span className="font-medium">{service.name}</span>
//                                       {service.description && (
//                                         <span className="text-xs text-gray-500 truncate max-w-[200px]">
//                                           {service.description}
//                                         </span>
//                                       )}
//                                     </div>
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                             {loadingServices && (
//                               <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
//                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
//                               </div>
//                             )}
//                           </div>
//                           {services.length === 0 && !loadingServices && (
//                             <p className="text-sm text-gray-500">
//                               No services available. Please create services first.
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//                 {/* Documentation Tab */}
//                 <TabsContent value="documentation" className="space-y-6 mt-6">
//                   <Card>
//                     <CardContent className="mt-5">
//                       <div className="space-y-4">
//                         {/* Upload Section */}
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
//                           <div className="space-y-4">
//                             <div className="grid grid-cols-1 gap-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor="mpi-doc-file">Select Files *</Label>
//                                 <Input
//                                   id="mpi-doc-file"
//                                   type="file"
//                                   accept="*/*"
//                                   className="cursor-pointer"
//                                   disabled={uploadingMpiDoc}
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor="mpi-doc-description">Description (Optional)</Label>
//                                 <Input
//                                   id="mpi-doc-description"
//                                   placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                                   disabled={uploadingMpiDoc}
//                                 />
//                               </div>
//                             </div>
//                             <Button
//                               type="button"
//                               variant="outline"
//                               disabled={uploadingMpiDoc}
//                               onClick={async (e) => {
//                                 e.preventDefault()
//                                 e.stopPropagation()
//                                 const fileInput = document.getElementById("mpi-doc-file") as HTMLInputElement
//                                 const descInput = document.getElementById("mpi-doc-description") as HTMLInputElement
//                                 const file = fileInput?.files?.[0]
//                                 const description = descInput?.value?.trim() || ""
//                                 if (!file) {
//                                   toast({
//                                     title: "Missing File",
//                                     description: "Please select a file to upload.",
//                                     variant: "destructive",
//                                   })
//                                   return
//                                 }
//                                 await handleMpiDocumentUpload(file, description)
//                                 fileInput.value = ""
//                                 descInput.value = ""
//                               }}
//                               className="w-full bg-transparent"
//                             >
//                               {uploadingMpiDoc ? (
//                                 <div className="flex items-center gap-2">
//                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                   Uploading File...
//                                 </div>
//                               ) : (
//                                 <>
//                                   <Upload className="w-4 h-4 mr-2" />
//                                   Upload File
//                                 </>
//                               )}
//                             </Button>
//                           </div>
//                         </div>
//                         {/* Uploaded Documents List */}
//                         {mpiDocumentation.length > 0 && (
//                           <div className="space-y-3">
//                             <h4 className="font-medium text-sm">Files</h4>
//                             <div className="space-y-2">
//                               {mpiDocumentation.map((doc, index) => (
//                                 <div
//                                   key={index}
//                                   className="flex items-start justify-between p-4 bg-gray-50 rounded border"
//                                 >
//                                   <div className="flex items-start gap-3 flex-1">
//                                     <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                                     <div className="flex-1 min-w-0">
//                                       <p className="text-sm font-medium text-gray-900 truncate">
//                                         {doc.description && doc.description !== doc.fileName
//                                           ? doc.description
//                                           : doc.fileName}
//                                       </p>
//                                       <div className="mt-1 space-y-1">
//                                         <p className="text-xs text-gray-600">
//                                           <span className="font-medium">Filename:</span> {doc.fileName}
//                                         </p>
//                                         {doc.description && doc.description !== doc.fileName && (
//                                           <p className="text-xs text-gray-500">
//                                             <span className="font-medium">Description:</span> {doc.description}
//                                           </p>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <div className="flex items-center gap-2 ml-4">
//                                     <Button
//                                       type="button"
//                                       size="sm"
//                                       variant="outline"
//                                       onClick={(e) => {
//                                         e.preventDefault()
//                                         e.stopPropagation()
//                                         removeMpiDocument(index)
//                                       }}
//                                       className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
//                                     >
//                                       Remove
//                                     </Button>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//                 {/* Checklist Tab */}
//                 <TabsContent value="checklist" className="space-y-6 mt-6">
//                   <Card>
//                     <CardContent className="mt-5">
//                       {loadingAvailableChecklist ? (
//                         <div className="flex items-center justify-center py-8">
//                           <div className="text-center">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
//                             <p className="mt-2 text-sm text-muted-foreground">Loading checklist data...</p>
//                           </div>
//                         </div>
//                       ) : existingChecklists.length === 0 && availableChecklistTemplate.length === 0 ? (
//                         <p className="text-muted-foreground text-center py-4">No checklist data available.</p>
//                       ) : (
//                         <div className="space-y-6">
//                           {/* Existing Checklists */}
//                           {existingChecklists.length > 0 ? (
//                             <div>
//                               <h3 className="text-lg font-semibold mb-4 text-green-800">
//                                 Existing Required Checklists
//                               </h3>
//                               <Accordion type="multiple" className="w-full">
//                                 {existingChecklists.map((section) => (
//                                   <AccordionItem key={section.id} value={section.id}>
//                                     <AccordionTrigger className="text-left">
//                                       <div className="flex items-center gap-3">
//                                         <h4 className="font-medium">{section.name}</h4>
//                                       </div>
//                                     </AccordionTrigger>
//                                     <AccordionContent>
//                                       <div className="space-y-4">
//                                         <Table>
//                                           <TableHeader>
//                                             <TableRow>
//                                               <TableHead>Description</TableHead>
//                                               <TableHead>Required</TableHead>
//                                               <TableHead>Remarks</TableHead>
//                                             </TableRow>
//                                           </TableHeader>
//                                           <TableBody>
//                                             {(section.items || []).map((item) => (
//                                               <TableRow key={item.id}>
//                                                 <TableCell className="font-medium">{item.description}</TableCell>
//                                                 <TableCell>
//                                                   <Select
//                                                     value={
//                                                       getChecklistItemValue(item.id, "required", item.required)
//                                                         ? "yes"
//                                                         : "no"
//                                                     }
//                                                     onChange={(itemId, field, value) =>
//                                                       handleChecklistItemChange(itemId, field, value === "yes")
//                                                     }
//                                                   >
//                                                     <SelectTrigger className="w-20">
//                                                       <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                       <SelectItem value="yes">Yes</SelectItem>
//                                                       <SelectItem value="no">No</SelectItem>
//                                                     </SelectContent>
//                                                   </Select>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                   <Input
//                                                     value={getChecklistItemValue(item.id, "remarks", item.remarks)}
//                                                     onChange={(itemId, field, value) =>
//                                                       handleChecklistItemChange(itemId, field, value)
//                                                     }
//                                                     placeholder="Enter remarks (optional)"
//                                                     className="min-w-[200px]"
//                                                   />
//                                                 </TableCell>
//                                               </TableRow>
//                                             ))}
//                                           </TableBody>
//                                         </Table>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           ) : (
//                             <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                               <h3 className="text-lg font-semibold mb-2 text-blue-800">Existing Checklists</h3>
//                               <p className="text-sm text-blue-700">
//                                 No checklist items have been created for this MPI yet.
//                               </p>
//                             </div>
//                           )}
//                           {/* Available Checklist Template */}
//                           {availableChecklistTemplate.length > 0 && (
//                             <div>
//                               <h3 className="text-lg font-semibold mb-4 text-green-800">Available Checklist Items</h3>
//                               <Accordion type="multiple" className="w-full">
//                                 {availableChecklistTemplate.map((section) => (
//                                   <AccordionItem key={section.id} value={section.id}>
//                                     <AccordionTrigger className="text-left">
//                                       <div className="flex items-center gap-3">
//                                         <h4 className="font-medium">{section.name}</h4>
//                                       </div>
//                                     </AccordionTrigger>
//                                     <AccordionContent>
//                                       <div className="space-y-4">
//                                         <Table>
//                                           <TableHeader>
//                                             <TableRow>
//                                               <TableHead>Description</TableHead>
//                                               <TableHead>Required</TableHead>
//                                               <TableHead>Remarks</TableHead>
//                                             </TableRow>
//                                           </TableHeader>
//                                           <TableBody>
//                                             {(section.items || []).map((item) => (
//                                               <TableRow key={item.id}>
//                                                 <TableCell className="font-medium">{item.description}</TableCell>
//                                                 <TableCell>
//                                                   <Select
//                                                     value={
//                                                       getChecklistItemValue(item.id, "required", item.required)
//                                                         ? "yes"
//                                                         : "no"
//                                                     }
//                                                     onChange={(itemId, field, value) =>
//                                                       handleChecklistItemChange(itemId, field, value === "yes")
//                                                     }
//                                                   >
//                                                     <SelectTrigger className="w-20">
//                                                       <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                       <SelectItem value="yes">Yes</SelectItem>
//                                                       <SelectItem value="no">No</SelectItem>
//                                                     </SelectContent>
//                                                   </Select>
//                                                 </TableCell>
//                                                 <TableCell>
//                                                   <Input
//                                                     value={getChecklistItemValue(item.id, "remarks", item.remarks)}
//                                                     onChange={(itemId, field, value) =>
//                                                       handleChecklistItemChange(itemId, field, value)
//                                                     }
//                                                     placeholder="Enter remarks (optional)"
//                                                     className="min-w-[200px]"
//                                                   />
//                                                 </TableCell>
//                                               </TableRow>
//                                             ))}
//                                           </TableBody>
//                                         </Table>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//                 {/* Instructions Tab */}
//                 <TabsContent value="instructions" className="space-y-6 mt-6">
//                   <InstructionsTab
//                     instructions={instructions}
//                     onAddInstruction={handleAddInstruction}
//                     onInstructionChange={handleInstructionChange}
//                     onRemoveInstruction={handleRemoveInstruction}
//                     availableStations={availableStations}
//                     formData={formData}
//                     loadingStations={loadingStations}
//                     activeStationId={activeStationId}
//                     setActiveStationId={setActiveStationId}
//                     stationViewMode={stationViewMode}
//                     setStationViewMode={setStationViewMode}
//                     handleStationSelectionChange={handleStationSelectionChange}
//                     selectedStations={selectedStations}
//                     stationNotes={stationNotes}
//                     stationDocuments={stationDocuments}
//                     renderSpecificationInput={renderSpecificationInput}
//                     renderStationDocuments={renderStationDocuments}
//                     renderStationNotes={renderStationNotes}
//                     focusedInstructionIndex={focusedInstructionIndex}
//                     setFocusedInstructionIndex={setFocusedInstructionIndex}
//                     instructionRefs={instructionRefs}
//                   />
//                 </TabsContent>
//               </Tabs>
//               {/* Form Actions */}
//               <div className="flex justify-end gap-4">
//                 <Button variant="outline" onClick={onCancel}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isLoading || !isFormValid()}>
//                   {isLoading ? (
//                     <div className="flex items-center gap-2 animate-pulse">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                       <span>Updating...</span>
//                     </div>
//                   ) : (
//                     <>Update MPI</>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }




















"use client"
import React from "react"
import type { FunctionComponent } from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Factory,
  Info,
  ClipboardList,
  FileText,
  Download,
  Eye,
  StickyNote,
  Plus,
  Trash2,
  X,
  Upload,
  AlertCircle,
} from "lucide-react"
import type { MPI, UpdateMPIDto } from "./types"
import { StationAPI } from "../stations/station-api"
import type { Station } from "../stations/types"
import { useToast } from "@/hooks/use-toast"
import { MPIAPI } from "./mpi-api"
import { MPIDocumentationAPI } from "./mpi-document-api"
import { StationMpiDocAPI } from "./station-mpi-doc-api"
import { API_BASE_URL } from "@/lib/constants"
import { ServiceAPI } from "../services/service-api"
import type { Service } from "../services/types"

// Enhanced InstructionsTab component with proper focus management and layout matching create mode
const InstructionsTab: FunctionComponent<{
  instructions: string[]
  onAddInstruction: () => void
  onInstructionChange: (index: number, value: string) => void
  onRemoveInstruction: (index: number) => void
  availableStations: Station[]
  formData: any
  loadingStations: boolean
  activeStationId: string | null
  setActiveStationId: (id: string | null) => void
  stationViewMode: "specifications" | "documents" | "notes"
  setStationViewMode: (mode: "specifications" | "documents" | "notes") => void
  handleStationSelectionChange: (stationIds: string[]) => void
  selectedStations: Station[]
  stationNotes: Record<string, StationNote[]>
  stationDocuments: Record<string, StationDocument[]>
  renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
  renderStationDocuments: (stationId: string) => React.ReactNode
  renderStationNotes: (stationId: string) => React.ReactNode
  focusedInstructionIndex: number | null
  setFocusedInstructionIndex: (index: number | null) => void
  instructionRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
}> = React.memo(
  ({
    instructions,
    onAddInstruction,
    onInstructionChange,
    onRemoveInstruction,
    availableStations,
    formData,
    loadingStations,
    activeStationId,
    setActiveStationId,
    stationViewMode,
    setStationViewMode,
    handleStationSelectionChange,
    selectedStations,
    stationNotes,
    stationDocuments,
    renderSpecificationInput,
    renderStationDocuments,
    renderStationNotes,
    focusedInstructionIndex,
    setFocusedInstructionIndex,
    instructionRefs,
  }) => {
    return (
      <div className="space-y-6">
        {/* Stations Section */}
        <Card>
          <CardContent className="space-y-6 mt-5">
            {loadingStations ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
                </div>
              </div>
            ) : availableStations.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
              </div>
            ) : (
              <div className="flex gap-6 min-h-[600px]">
                {/* Left Sidebar - Station List */}
                <div className="w-1/4 border rounded-lg bg-gray-50">
                  <div className="p-3 border-b bg-white rounded-t-lg">
                    <h4 className="font-medium text-base">Stations</h4>
                    <p className="text-xs text-muted-foreground">
                      {formData.selectedStationIds.length > 0
                        ? `${formData.selectedStationIds.length} selected`
                        : "Click to select multiple"}
                    </p>
                  </div>
                  <div className="p-2 overflow-y-auto h-[530px]">
                    <div className="space-y-1">
                      {availableStations.map((station) => {
                        const noteCount = stationNotes[station.id]?.length || 0
                        const docCount = stationDocuments[station.id]?.length || 0
                        const isSelected = formData.selectedStationIds.includes(station.id)
                        return (
                          <div
                            key={station.id}
                            className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
                              isSelected
                                ? "bg-blue-100 text-blue-900 border-blue-300"
                                : "bg-white hover:bg-gray-100 border-transparent"
                            } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setActiveStationId(station.id)
                              if (isSelected) {
                                handleStationSelectionChange(
                                  formData.selectedStationIds.filter((id: string) => id !== station.id),
                                )
                              } else {
                                handleStationSelectionChange([...formData.selectedStationIds, station.id])
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">{station.stationName}</span>
                              <div className="flex gap-1">
                                {noteCount > 0 && (
                                  <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
                                    {noteCount}N
                                  </Badge>
                                )}
                                {docCount > 0 && (
                                  <Badge variant="secondary" size="sm" className="h-4 px-1 text-xs">
                                    {docCount}D
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                {/* Right Panel - Station Details */}
                <div className="flex-1 border rounded-lg bg-gray-50">
                  {!activeStationId ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="font-medium text-gray-600 mb-2">No Station Selected</h4>
                        <p className="text-sm text-muted-foreground">
                          Select a station from the left sidebar to view its details
                          {formData.selectedStationIds.length > 0 && (
                            <span className="block mt-2 text-blue-600 font-medium">
                              {formData.selectedStationIds.length} station
                              {formData.selectedStationIds.length > 1 ? "s" : ""} selected for MPI
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="p-4 border-b bg-white rounded-t-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Factory className="w-5 h-5 text-purple-600" />
                            <div>
                              <h4 className="font-medium text-lg">
                                {availableStations.find((s) => s.id === activeStationId)?.stationName}
                              </h4>
                              <p className="text-sm text-muted-foreground">Station Details</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant={stationViewMode === "specifications" ? "default" : "outline"}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setStationViewMode("specifications")
                              }}
                            >
                              Specifications
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={stationViewMode === "documents" ? "default" : "outline"}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setStationViewMode("documents")
                              }}
                            >
                              Files
                              {stationDocuments[activeStationId]?.length > 0 && (
                                <Badge variant="secondary" size="sm" className="ml-1">
                                  {stationDocuments[activeStationId].length}
                                </Badge>
                              )}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={stationViewMode === "notes" ? "default" : "outline"}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setStationViewMode("notes")
                              }}
                            >
                              Notes
                              {stationNotes[activeStationId]?.length > 0 && (
                                <Badge variant="secondary" size="sm" className="ml-1">
                                  {stationNotes[activeStationId].length}
                                </Badge>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto p-4">
                        {stationViewMode === "specifications" && (
                          <div>
                            {(() => {
                              const station = availableStations.find((s) => s.id === activeStationId)
                              if (!station) return null
                              if (!station.specifications || station.specifications.length === 0) {
                                return (
                                  <div className="text-center py-6">
                                    <p className="text-muted-foreground">
                                      No specifications available for this station.
                                    </p>
                                  </div>
                                )
                              }
                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {station.specifications.map((spec) => (
                                    <div key={spec.id} className="space-y-3 p-3 bg-white rounded border">
                                      {renderSpecificationInput(spec, station.id)}
                                    </div>
                                  ))}
                                </div>
                              )
                            })()}
                          </div>
                        )}
                        {stationViewMode === "documents" && renderStationDocuments(activeStationId)}
                        {stationViewMode === "notes" && renderStationNotes(activeStationId)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Selected Station Summary */}
            {formData.selectedStationIds.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-3">Selected Stations</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStations.map((station) => (
                    <Badge key={station.id} variant="outline" className="bg-white">
                      {station.stationName}
                      {station.specifications && station.specifications.length > 0 && (
                        <span className="ml-1 text-xs">({station.specifications.length} specs)</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions Section - Now positioned below stations section like in create mode */}
        <Card>
          <CardContent className="mt-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-green-800">General Instructions</h4>
                  <p className="text-sm text-muted-foreground">
                    Add general safety and operational instructions for this MPI
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onAddInstruction()
                    // Focus the new instruction input after it's added
                    setTimeout(() => {
                      setFocusedInstructionIndex(instructions.length)
                    }, 0)
                  }}
                  className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Instruction
                </Button>
              </div>
              {instructions.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No instructions added yet</p>
                  <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Input
                          ref={(el) => {
                            instructionRefs.current[index] = el
                          }}
                          value={instruction}
                          onChange={(e) => {
                            setFocusedInstructionIndex(index)
                            onInstructionChange(index, e.target.value)
                          }}
                          onFocus={() => setFocusedInstructionIndex(index)}
                          onBlur={() => setFocusedInstructionIndex(null)}
                          placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
                          className="w-full"
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          onRemoveInstruction(index)
                          // Clear focus tracking when removing instruction
                          setFocusedInstructionIndex(null)
                        }}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
)

interface MPIEditProps {
  mpi: MPI
  onSubmit: (data: UpdateMPIDto) => Promise<void>
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
  originalFileName?: string
  isUploaded?: boolean
}

interface StationNote {
  id?: string
  content: string
  createdAt?: string
  updatedAt?: string
}

interface StationDocument {
  id: string
  fileUrl: string
  description: string
  stationId: string
  mpiId?: string
  createdAt: string
  updatedAt: string
}

// Helper function to safely convert order type to array
const normalizeOrderType = (orderType: any): string[] => {
  if (!orderType) return []
  if (Array.isArray(orderType)) return orderType.filter((type) => typeof type === "string")
  if (typeof orderType === "string") return [orderType]
  return []
}

// Helper function to safely convert file action to array
const normalizeFileAction = (fileAction: any): string[] => {
  if (!fileAction) return []
  if (Array.isArray(fileAction)) return fileAction.filter((action) => typeof action === "string")
  if (typeof fileAction === "string") return [fileAction]
  return []
}

export function MPIEdit({ mpi, onSubmit, onCancel, isLoading }: MPIEditProps) {
  const [activeTab, setActiveTab] = useState("basic-info")
  const [formData, setFormData] = useState({
    jobId: mpi.jobId || "",
    assemblyId: mpi.assemblyId || "",
    customer: mpi.customer || "",
    selectedStationIds: mpi.stations?.map((s) => s.id) || [],
  })

  // Order Form State - Initialize with existing data
  const [orderFormData, setOrderFormData] = useState({
    id: mpi.orderForms?.[0]?.id || "",
    orderType: normalizeOrderType(mpi.orderForms?.[0]?.orderType),
    distributionDate: mpi.orderForms?.[0]?.distributionDate
      ? new Date(mpi.orderForms[0].distributionDate).toISOString().split("T")[0]
      : "",
    requiredBy: mpi.orderForms?.[0]?.requiredBy
      ? new Date(mpi.orderForms[0].requiredBy).toISOString().split("T")[0]
      : "",
    internalOrderNumber: mpi.orderForms?.[0]?.internalOrderNumber || "",
    revision: mpi.orderForms?.[0]?.revision || "",
    otherAttachments: mpi.orderForms?.[0]?.otherAttachments || "",
    fileAction: normalizeFileAction(mpi.orderForms?.[0]?.fileAction),
    markComplete: mpi.orderForms?.[0]?.markComplete || false,
    documentControlId: mpi.orderForms?.[0]?.documentControlId || "",
    selectedServiceId: mpi.orderForms?.[0]?.services?.[0]?.id || "",
  })

  // Instructions state - Initialize with existing data
  const [instructions, setInstructions] = useState<string[]>(mpi.Instruction || [])

  // Add focus management for instruction inputs
  const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
  const instructionRefs = useRef<(HTMLInputElement | null)[]>([])

  // Add these state variables after the instruction focus management states
  const [focusedSpecificationId, setFocusedSpecificationId] = useState<string | null>(null)
  const specificationRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Service state
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  // Enums state
  const [enums, setEnums] = useState<any>({})
  const [loadingEnums, setLoadingEnums] = useState(false)

  // Checklist template and existing checklist state
  const [availableChecklistTemplate, setAvailableChecklistTemplate] = useState<ChecklistSection[]>([])
  const [existingChecklists, setExistingChecklists] = useState<ChecklistSection[]>([])
  const [loadingAvailableChecklist, setLoadingAvailableChecklist] = useState(false)

  // Specification values state - Initialize with existing values
  const [specificationValues, setSpecificationValues] = useState<Record<string, SpecificationValue>>(() => {
    const initialValues: Record<string, SpecificationValue> = {}
    console.log("🔍 Initializing specification values from MPI data:", mpi)
    mpi.stations?.forEach((station) => {
      console.log(`📍 Processing station: ${station.stationName} (${station.id})`)
      station.specifications?.forEach((spec) => {
        console.log(`🔧 Processing spec: ${spec.name} (${spec.id})`)
        // Look for existing values in multiple places
        let existingValue = null
        // Method 1: Check stationSpecifications array
        if (spec.stationSpecifications && spec.stationSpecifications.length > 0) {
          existingValue = spec.stationSpecifications.find((ss) => ss.stationId === station.id)
          console.log(`📋 Found in stationSpecifications:`, existingValue)
        }
        // Method 2: Check if there's a direct value on the spec
        if (!existingValue && spec.value) {
          existingValue = { value: spec.value, unit: spec.unit }
          console.log(`📋 Found direct value on spec:`, existingValue)
        }
        // Method 3: Check station's specificationValues if it exists
        if (!existingValue && station.specificationValues) {
          const stationSpecValue = station.specificationValues.find((sv: any) => sv.specificationId === spec.id)
          if (stationSpecValue) {
            existingValue = { value: stationSpecValue.value, unit: stationSpecValue.unit }
            console.log(`📋 Found in station specificationValues:`, existingValue)
          }
        }
        if (existingValue && existingValue.value) {
          initialValues[spec.id] = {
            specificationId: spec.id,
            value: existingValue.value,
            unit: existingValue.unit || undefined,
            fileUrl: existingValue.fileUrl || undefined,
          }
          console.log(`✅ Initialized spec ${spec.id} with value:`, initialValues[spec.id])
        } else {
          // Initialize with empty value for specs without existing data
          initialValues[spec.id] = {
            specificationId: spec.id,
            value: "",
            unit: undefined,
            fileUrl: undefined,
          }
          console.log(`🆕 Initialized spec ${spec.id} with empty value`)
        }
      })
    })
    console.log("🎯 Final initial specification values:", initialValues)
    return initialValues
  })

  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())

  // MPI Documentation State - Enhanced with proper filename handling
  const [mpiDocumentation, setMpiDocumentation] = useState<MPIDocumentation[]>(() => {
    // Initialize with existing MPI documents
    return (
      mpi.mpiDocs?.map((doc) => ({
        id: doc.id,
        fileUrl: doc.fileUrl,
        description: doc.description,
        fileName: doc.fileName || doc.description, // Use fileName if available, fallback to description
        originalFileName: doc.originalFileName || doc.fileName || doc.description,
        isUploaded: true,
      })) || []
    )
  })

  const [uploadingMpiDoc, setUploadingMpiDoc] = useState(false)

  // Checklist modifications state - Initialize with existing checklist data
  const [checklistModifications, setChecklistModifications] = useState<
    Record<string, { required: boolean; remarks: string }>
  >(() => {
    const initialModifications: Record<string, { required: boolean; remarks: string }> = {}
    // Initialize with existing checklist data
    mpi.checklists?.forEach((checklist) => {
      checklist.checklistItems?.forEach((item, itemIndex) => {
        const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
        initialModifications[itemId] = {
          required: item.required,
          remarks: item.remarks,
        }
      })
    })
    console.log("Initial checklist modifications:", initialModifications)
    return initialModifications
  })

  const [availableStations, setAvailableStations] = useState<Station[]>([])
  const [loadingStations, setLoadingStations] = useState(false)
  const [selectedStations, setSelectedStations] = useState<Station[]>([])

  // Station view state for instructions tab
  const [activeStationId, setActiveStationId] = useState<string | null>(null)
  const [stationViewMode, setStationViewMode] = useState<"specifications" | "documents" | "notes">("specifications")

  // Station notes state
  const [stationNotes, setStationNotes] = useState<Record<string, StationNote[]>>({})
  const [loadingNotes, setLoadingNotes] = useState<Set<string>>(new Set())
  const [newNoteContent, setNewNoteContent] = useState("")
  const [addingNote, setAddingNote] = useState(false)

  // Station documents state
  const [stationDocuments, setStationDocuments] = useState<Record<string, StationDocument[]>>({})
  const [loadingDocuments, setLoadingDocuments] = useState<Set<string>>(new Set())
  const [uploadingStationDoc, setUploadingStationDoc] = useState(false)

  // Validation state
  const [existingJobIds, setExistingJobIds] = useState<string[]>([])
  const [existingAssemblyIds, setExistingAssemblyIds] = useState<string[]>([])
  const [existingDocumentControlIds, setExistingDocumentControlIds] = useState<string[]>([])
  const [checkingIds, setCheckingIds] = useState(false)

  const { toast } = useToast()

  // Initialize station notes from MPI data - ENHANCED
  useEffect(() => {
    const initialNotes: Record<string, StationNote[]> = {}
    console.log("🔍 Initializing station notes from MPI data:", mpi)
    if (mpi.stations && Array.isArray(mpi.stations)) {
      mpi.stations.forEach((station) => {
        console.log(`📍 Processing station notes for: ${station.stationName} (${station.id})`)
        let stationNotesArray: StationNote[] = []
        // Check multiple possible locations for notes in the station data
        if (station.Note) {
          if (Array.isArray(station.Note)) {
            // Handle array of notes
            stationNotesArray = station.Note.filter(
              (note) => note && typeof note === "string" && note.trim() !== "",
            ).map((note, index) => ({
              id: `note-${station.id}-${index}-${Date.now()}`,
              content: note.trim(),
              createdAt: new Date().toISOString(),
            }))
            console.log(`📝 Found Note array for station ${station.id}:`, stationNotesArray)
          } else if (typeof station.Note === "string" && station.Note.trim() !== "") {
            // Handle single note string
            stationNotesArray = [
              {
                id: `note-${station.id}-0-${Date.now()}`,
                content: station.Note.trim(),
                createdAt: new Date().toISOString(),
              },
            ]
            console.log(`📝 Found single Note for station ${station.id}:`, stationNotesArray)
          }
        }
        // Also check for 'notes' field (alternative naming)
        if (stationNotesArray.length === 0 && station.notes && Array.isArray(station.notes)) {
          stationNotesArray = station.notes
            .filter((note) => note && (typeof note === "string" || (note.content && note.content.trim())))
            .map((note, index) => ({
              id: note.id || `note-${station.id}-${index}-${Date.now()}`,
              content: typeof note === "string" ? note : note.content,
              createdAt: note.createdAt || new Date().toISOString(),
            }))
          console.log(`📝 Found notes array for station ${station.id}:`, stationNotesArray)
        }
        initialNotes[station.id] = stationNotesArray
        console.log(`✅ Initialized ${stationNotesArray.length} notes for station ${station.id}`)
      })
    }
    console.log("🎯 Final initial station notes:", initialNotes)
    setStationNotes(initialNotes)
  }, [mpi.stations])

  // Initialize station documents from MPI data - ENHANCED
  useEffect(() => {
    const initialDocs: Record<string, StationDocument[]> = {}
    console.log("🔍 Initializing station documents from MPI data:", mpi)
    if (mpi.stations && Array.isArray(mpi.stations)) {
      mpi.stations.forEach((station) => {
        console.log(`📍 Processing station documents for: ${station.stationName} (${station.id})`)
        let stationDocsArray: StationDocument[] = []

        // Check multiple possible locations for documents in the station data
        const documentSources = [
          station.documentations,
          station.documents,
          station.stationDocuments,
          station.stationMpiDocs,
        ]

        for (const docSource of documentSources) {
          if (docSource && Array.isArray(docSource) && docSource.length > 0) {
            stationDocsArray = docSource
              .filter((doc) => doc && (doc.fileUrl || doc.url))
              .map((doc, index) => ({
                id: doc.id || `doc-${station.id}-${index}-${Date.now()}`,
                fileUrl: doc.fileUrl || doc.url,
                description: doc.description || doc.fileName || doc.originalName || "Untitled Document",
                stationId: station.id,
                mpiId: doc.mpiId || mpi.id,
                createdAt: doc.createdAt || new Date().toISOString(),
                updatedAt: doc.updatedAt || new Date().toISOString(),
              }))
            if (stationDocsArray.length > 0) {
              console.log(`📄 Found documents for station ${station.id}:`, stationDocsArray)
              break // Use the first source that has documents
            }
          }
        }

        // Also check if MPI has stationMpiDocuments for this station
        if (mpi.stationMpiDocuments && Array.isArray(mpi.stationMpiDocuments)) {
          const mpiStationDocs = mpi.stationMpiDocuments
            .filter((doc) => doc.stationId === station.id)
            .map((doc) => ({
              id: doc.id,
              fileUrl: doc.fileUrl,
              description: doc.description || doc.originalName || "Untitled Document",
              stationId: station.id,
              mpiId: mpi.id,
              createdAt: doc.createdAt || new Date().toISOString(),
              updatedAt: doc.updatedAt || new Date().toISOString(),
            }))

          // Merge with existing documents, avoiding duplicates
          mpiStationDocs.forEach((mpiDoc) => {
            if (!stationDocsArray.find((doc) => doc.id === mpiDoc.id)) {
              stationDocsArray.push(mpiDoc)
            }
          })
        }

        initialDocs[station.id] = stationDocsArray
        console.log(`✅ Initialized ${stationDocsArray.length} documents for station ${station.id}`)
      })
    }
    console.log("🎯 Final initial station documents:", initialDocs)
    setStationDocuments(initialDocs)
  }, [mpi.stations, mpi.stationMpiDocuments])

  // Restore focus to instruction input after re-render
  useEffect(() => {
    if (focusedInstructionIndex !== null && instructionRefs.current[focusedInstructionIndex]) {
      const input = instructionRefs.current[focusedInstructionIndex]
      if (input) {
        const cursorPosition = input.selectionStart || 0
        // Use setTimeout to ensure the DOM has updated
        setTimeout(() => {
          input.focus()
          input.setSelectionRange(cursorPosition, cursorPosition)
        }, 0)
      }
    }
  }, [instructions, focusedInstructionIndex])

  // Add this useEffect after the instruction focus useEffect
  useEffect(() => {
    if (focusedSpecificationId && specificationRefs.current[focusedSpecificationId]) {
      const input = specificationRefs.current[focusedSpecificationId]
      if (input) {
        const cursorPosition = input.selectionStart || 0
        setTimeout(() => {
          input.focus()
          input.setSelectionRange(cursorPosition, cursorPosition)
        }, 0)
      }
    }
  }, [specificationValues, focusedSpecificationId])

  // Load existing IDs for validation (excluding current MPI)
  const loadExistingIds = async () => {
    try {
      setCheckingIds(true)
      const mpis = await MPIAPI.getAllMPIs()
      // Filter out current MPI from validation
      const otherMpis = mpis.filter((m) => m.id !== mpi.id)
      const jobIds = otherMpis.map((m) => m.jobId.toLowerCase())
      const assemblyIds = otherMpis.map((m) => m.assemblyId.toLowerCase())
      const documentControlIds = otherMpis
        .filter((m) => m.orderForms && m.orderForms.length > 0)
        .flatMap((m) => m.orderForms.map((form) => form.documentControlId))
        .filter(Boolean)
        .map((id) => id.toLowerCase())
      setExistingJobIds(jobIds)
      setExistingAssemblyIds(assemblyIds)
      setExistingDocumentControlIds(documentControlIds)
    } catch (error) {
      console.error("Failed to load existing IDs:", error)
    } finally {
      setCheckingIds(false)
    }
  }

  // Validation functions
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
    ;`Document Control ID "${documentControlId}" already exists. Please use a different ID.`
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

  // Station notes handlers
  const handleAddNote = async () => {
    if (!activeStationId || !newNoteContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter note content.",
        variant: "destructive",
      })
      return
    }
    setAddingNote(true)
    try {
      const newNote: StationNote = {
        id: `note-${activeStationId}-${Date.now()}`,
        content: newNoteContent.trim(),
        createdAt: new Date().toISOString(),
      }
      setStationNotes((prev) => ({
        ...prev,
        [activeStationId]: [...(prev[activeStationId] || []), newNote],
      }))
      setNewNoteContent("")
      toast({
        title: "Success",
        description: "Note added successfully.",
      })
    } catch (error) {
      console.error("Failed to add note:", error)
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAddingNote(false)
    }
  }

  const handleDeleteNote = async (stationId: string, noteId: string) => {
    try {
      setStationNotes((prev) => ({
        ...prev,
        [stationId]: prev[stationId]?.filter((note) => note.id !== noteId) || [],
      }))
      toast({
        title: "Success",
        description: "Note deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete note:", error)
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Station document handlers
  const handleStationDocumentUpload = async (file: File, description: string, fileName?: string) => {
    if (!activeStationId) {
      toast({
        title: "Error",
        description: "No station selected.",
        variant: "destructive",
      })
      return
    }
    setUploadingStationDoc(true)
    try {
      const finalDescription = description.trim() || file.name
      const finalFileName = fileName?.trim() || file.name
      console.log("📤 Station document upload:", {
        file: file.name,
        description: finalDescription,
        fileName: finalFileName,
        stationId: activeStationId,
        mpiId: mpi.id,
      })
      if (!mpi.id) {
        // For new MPIs, queue the document locally
        console.log("💾 QUEUING station document locally - MPI not created yet...")
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("File size exceeds 10MB limit")
        }
        const newDoc = {
          id: `temp-${Date.now()}`,
          file: file,
          description: finalDescription,
          fileName: finalFileName,
          stationId: activeStationId,
          isUploaded: false,
        }
        setStationDocuments((prev) => ({
          ...prev,
          [activeStationId]: [...(prev[activeStationId] || []), newDoc],
        }))
        toast({
          title: "✅ Document Queued Successfully",
          description: `"${finalDescription}" will be uploaded when the MPI is saved.`,
        })
      } else {
        // For existing MPIs, upload directly
        console.log("📤 Uploading station document directly to existing MPI...")
        const formData = new FormData()
        formData.append("files", file)
        formData.append("stationId", activeStationId)
        formData.append("description", finalDescription)
        formData.append("mpiId", mpi.id)
        formData.append("originalName", file.name)
        const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
          method: "POST",
          body: formData,
        })
        if (!response.ok) {
          const errorText = await response.text()
          console.error("❌ Direct upload failed:", errorText)
          throw new Error(`Upload failed: ${response.status} - ${errorText}`)
        }
        const result = await response.json()
        console.log("✅ Station document uploaded successfully:", result)
        // Add to existing documents for the station
        setStationDocuments((prev) => ({
          ...prev,
          [activeStationId]: [
            ...(prev[activeStationId] || []),
            {
              id: result.id || `uploaded-${Date.now()}`,
              fileUrl: result.fileUrl,
              description: result.description || finalDescription,
              fileName: result.fileName || finalFileName,
              stationId: activeStationId,
              isUploaded: true,
            },
          ],
        }))
        toast({
          title: "Success",
          description: "Station document uploaded successfully.",
        })
      }
    } catch (error) {
      console.error("Station document upload error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to upload station document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingStationDoc(false)
    }
  }

  const handleDeleteStationDocument = async (stationId: string, documentId: string) => {
    try {
      // Check if it's an uploaded document or queued document
      const stationDocs = stationDocuments[stationId] || []
      const doc = stationDocs.find((d) => d.id === documentId)
      if (doc && doc.isUploaded && doc.id && !doc.id.startsWith("temp-")) {
        // Delete uploaded document via API
        await StationMpiDocAPI.delete(documentId)
      }
      // Remove from local state
      setStationDocuments((prev) => ({
        ...prev,
        [stationId]: prev[stationId]?.filter((doc) => doc.id !== documentId) || [],
      }))
      toast({
        title: "Success",
        description: "Document deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete document:", error)
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Enhanced MPI Documentation handlers with proper filename support
  const handleMpiDocumentUpload = async (file: File, description: string) => {
    setUploadingMpiDoc(true)
    try {
      if (!file) {
        throw new Error("No file selected")
      }
      const finalDescription = description.trim() || file.name
      console.log("📤 MPI document upload:", {
        originalFile: file.name,
        description: finalDescription,
        fileSize: file.size,
      })
      // For edit mode, upload immediately since MPI already exists
      const result = await MPIDocumentationAPI.uploadDocument(mpi.id, file, finalDescription, file.name)
      const newDoc: MPIDocumentation = {
        id: result.id,
        fileUrl: result.fileUrl,
        description: result.description,
        fileName: file.name,
        originalFileName: file.name,
        isUploaded: true,
      }
      setMpiDocumentation((prev) => [...prev, newDoc])
      toast({
        title: "Success",
        description: "Document uploaded successfully.",
      })
    } catch (error) {
      console.error("Document upload error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingMpiDoc(false)
    }
  }

  const removeMpiDocument = async (index: number) => {
    const doc = mpiDocumentation[index]
    if (doc.id && doc.isUploaded) {
      try {
        await MPIDocumentationAPI.deleteDocument(doc.id)
        toast({
          title: "Success",
          description: "Document deleted successfully.",
        })
      } catch (error) {
        console.error("Failed to delete document:", error)
        toast({
          title: "Error",
          description: "Failed to delete document.",
          variant: "destructive",
        })
        return
      }
    }
    setMpiDocumentation((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    loadStations()
    loadEnums()
    loadChecklistData()
    loadExistingIds()
    loadServices() // Add this line
  }, [])

  useEffect(() => {
    // Update selected stations when formData.selectedStationIds changes
    const selected = availableStations.filter((station) => formData.selectedStationIds.includes(station.id))
    setSelectedStations(selected)
  }, [formData.selectedStationIds, availableStations])

  const loadStations = async () => {
    try {
      setLoadingStations(true)
      const stations = await StationAPI.getAllStations()
      setAvailableStations(stations)
    } catch (error) {
      console.error("Failed to load stations:", error)
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
      console.error("Failed to load enums:", error)
      toast({
        title: "Warning",
        description: "Failed to load form options.",
        variant: "destructive",
      })
    } finally {
      setLoadingEnums(false)
    }
  }

  const loadChecklistData = async () => {
    try {
      setLoadingAvailableChecklist(true)
      // Load existing checklists from MPI - show ONLY REQUIRED items (like details page)
      const existingChecklistSections: ChecklistSection[] = []
      const existingItemDescriptions = new Set<string>()
      if (mpi.checklists && mpi.checklists.length > 0) {
        mpi.checklists.forEach((checklist, checklistIndex) => {
          if (checklist.checklistItems && checklist.checklistItems.length > 0) {
            // Filter to only show required items (exactly like details page)
            const requiredItems = checklist.checklistItems.filter((item) => item.required === true)
            if (requiredItems.length > 0) {
              existingChecklistSections.push({
                id: `existing-section-${checklistIndex}`,
                name: checklist.name,
                description: `${checklist.name} - Existing required checklist items`,
                items: requiredItems.map((item, itemIndex) => {
                  // Track this item as existing
                  existingItemDescriptions.add(item.description.toLowerCase().trim())
                  return {
                    id: `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
                    description: item.description,
                    required: item.required,
                    remarks: item.remarks,
                    category: item.category || checklist.name,
                    isActive: item.isActive,
                    createdBy: item.createdBy,
                    sectionId: `existing-section-${checklistIndex}`,
                  }
                }),
              })
            }
          }
        })
      }
      setExistingChecklists(existingChecklistSections)
      // Load available checklist template and filter out existing items
      const template = await MPIAPI.getChecklistTemplate()
      console.log("📦 Available checklist template loaded:", template)
      if (template && Array.isArray(template)) {
        const validSections = template
          .filter(
            (section) =>
              section && typeof section === "object" && section.name && Array.isArray(section.checklistItems),
          )
          .map((section, sectionIndex) => {
            // Filter out items that already exist in the MPI
            const availableItems = (section.checklistItems || [])
              .filter((item: any) => {
                const itemDescription = item.description?.toLowerCase().trim()
                return itemDescription && !existingItemDescriptions.has(itemDescription)
              })
              .map((item: any, itemIndex: number) => ({
                id: `available-${section.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`,
                description: item.description || "No description",
                required: false, // Default to No for available items
                remarks: "",
                category: item.category || section.name,
                isActive: item.isActive !== undefined ? item.isActive : true,
                createdBy: item.createdBy || "System",
                sectionId: `available-section-${sectionIndex}`,
              }))
            return availableItems.length > 0
              ? {
                  id: `available-section-${sectionIndex}`,
                  name: section.name,
                  description: `${section.name} quality control items`,
                  items: availableItems,
                }
              : null
          })
          .filter(Boolean)
        setAvailableChecklistTemplate(validSections)
      } else {
        setAvailableChecklistTemplate([])
      }
    } catch (error) {
      console.error("Failed to load checklist data:", error)
      setAvailableChecklistTemplate([])
      setExistingChecklists([])
    } finally {
      setLoadingAvailableChecklist(false)
    }
  }

  const loadServices = async () => {
    try {
      setLoadingServices(true)
      const fetchedServices = await ServiceAPI.getAll()
      setServices(fetchedServices)
      // Set selected service if one exists in the order form
      if (orderFormData.selectedServiceId && fetchedServices.length > 0) {
        const service = fetchedServices.find((s) => s.id === orderFormData.selectedServiceId)
        setSelectedService(service || null)
      }
    } catch (error) {
      console.error("Failed to fetch services:", error)
      toast({
        title: "Warning",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      })
      setServices([])
    } finally {
      setLoadingServices(false)
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

  const handleOrderFormChange = (field: string, value: string | boolean | string[]) => {
    setOrderFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleServiceChange = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId)
    if (service) {
      setSelectedService(service)
      handleOrderFormChange("selectedServiceId", serviceId)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🔄 Starting form submission...")
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

    console.log("Selected stations:", formData.selectedStationIds)
    console.log("Current specification values:", specificationValues)
    console.log("Current checklist modifications:", checklistModifications)

    // Prepare stations data - Send ALL selected stations with their specification values in the correct format
    const stationsData = formData.selectedStationIds
      .map((stationId) => {
        const station = selectedStations.find((s) => s.id === stationId)
        if (!station) return null

        // Get specification values for this station in the format the backend expects
        const stationSpecificationValues =
          station.specifications?.map((spec) => {
            const specValue = specificationValues[spec.id]
            return {
              specificationId: spec.id,
              value: specValue?.value || "", // Send current value or empty string
              ...(specValue?.unit && { unit: specValue.unit }),
              ...(specValue?.fileUrl && { fileUrl: specValue.fileUrl }),
            }
          }) || []

        // Include station notes in the update
        const stationNotesArray = stationNotes[stationId]?.map((note) => note.content) || []

        return {
          id: station.id,
          stationId: station.stationId,
          stationName: station.stationName,
          status: station.status,
          description: station.description || "",
          location: station.location || "",
          operator: station.operator || "",
          priority: station.priority || 1,
          Note: stationNotesArray,
          // Send specification values in the format the backend expects
          specificationValues: stationSpecificationValues,
        }
      })
      .filter(Boolean)

    console.log("📤 Stations data being sent:", JSON.stringify(stationsData, null, 2))
    console.log("🔧 Current specification values:", specificationValues)

    // Prepare existing checklist updates with ACTUAL database IDs
    const existingChecklistUpdates: any[] = []
    if (mpi.checklists && mpi.checklists.length > 0) {
      mpi.checklists.forEach((checklist) => {
        const updatedItems: any[] = []
        let hasChanges = false
        if (checklist.checklistItems && checklist.checklistItems.length > 0) {
          checklist.checklistItems.forEach((item, itemIndex) => {
            const itemId = `existing-${checklist.name.toLowerCase().replace(/\s+/g, "-")}-${itemIndex}`
            const modifications = checklistModifications[itemId]
            if (modifications) {
              // Check if there are actual changes
              if (modifications.required !== item.required || modifications.remarks !== item.remarks) {
                hasChanges = true
              }
              updatedItems.push({
                id: item.id, // Use the actual database ID from the MPI
                description: item.description,
                required: modifications.required,
                remarks: modifications.remarks,
                category: item.category,
                createdBy: item.createdBy,
                isActive: item.isActive,
              })
            }
          })
        }
        // Only include checklist if there are actual changes
        if (hasChanges && updatedItems.length > 0) {
          existingChecklistUpdates.push({
            id: checklist.id, // Use the actual checklist database ID
            name: checklist.name,
            checklistItems: updatedItems,
          })
        }
      })
    }

    // Prepare new checklists from available template
    const newChecklists: any[] = []
    availableChecklistTemplate.forEach((section) => {
      const newItems: any[] = []
      section.items.forEach((item) => {
        const modifications = checklistModifications[item.id]
        if (modifications && modifications.required) {
          newItems.push({
            description: item.description,
            required: modifications.required,
            remarks: modifications.remarks || "",
            createdBy: item.createdBy || "System",
            isActive: item.isActive !== undefined ? item.isActive : true,
            category: item.category || section.name,
          })
        }
      })
      if (newItems.length > 0) {
        newChecklists.push({
          name: section.name,
          checklistItems: newItems,
        })
      }
    })

    // Prepare complete submission data matching backend expectations
    const submitData: any = {
      jobId: formData.jobId,
      assemblyId: formData.assemblyId,
      customer: formData.customer || null,
    }

    // FIXED: Always include order forms for updates with proper structure
    const orderFormSubmissionData = {
      id: orderFormData.id || undefined, // Include ID if exists for update
      OrderType: orderFormData.orderType,
      distributionDate: orderFormData.distributionDate ? new Date(orderFormData.distributionDate).toISOString() : null,
      requiredBy: orderFormData.requiredBy ? new Date(orderFormData.requiredBy).toISOString() : null,
      internalOrderNumber: orderFormData.internalOrderNumber || null,
      revision: orderFormData.revision || null,
      otherAttachments: orderFormData.otherAttachments || null,
      fileAction: orderFormData.fileAction,
      markComplete: orderFormData.markComplete,
      documentControlId: orderFormData.documentControlId || null,
      // Add service ID mapping
      ...(orderFormData.selectedServiceId && {
        serviceIds: [orderFormData.selectedServiceId], // Convert single ID to array
      }),
    }

    // Send as array to match backend expectation
    submitData.orderForms = [orderFormSubmissionData]

    console.log("📋 Order form data being sent:", JSON.stringify(submitData.orderForms, null, 2))

    // Add stations with specifications if they exist
    if (stationsData.length > 0) {
      submitData.stations = stationsData
    }

    // Combine existing and new checklists for the backend
    const allChecklists = [...existingChecklistUpdates, ...newChecklists]
    if (allChecklists.length > 0) {
      submitData.checklists = allChecklists
    }

    // Add instructions - always include for updates (use backend field name 'Instruction')
    submitData.Instruction = instructions.filter((instruction) => instruction.trim() !== "")

    // Add uploaded documents to submission data with both description and fileName
    if (mpiDocumentation.length > 0) {
      const uploadedDocs = mpiDocumentation
        .filter((doc) => doc.isUploaded && doc.fileUrl)
        .map((doc) => ({
          id: doc.id,
          fileUrl: doc.fileUrl,
          description: doc.description,
          fileName: doc.fileName, // Include fileName for backend
          originalFileName: doc.originalFileName, // Include original filename
        }))
      if (uploadedDocs.length > 0) {
        submitData.mpiDocs = uploadedDocs
      }
    }

    console.log("📤 Submitting MPI update data:", JSON.stringify(submitData, null, 2))

    try {
      await onSubmit(submitData as UpdateMPIDto)
      if (newChecklists.length > 0) {
        toast({
          title: "Success",
          description: `MPI updated successfully with ${newChecklists.length} new checklist section(s) added.`,
        })
      } else {
        toast({
          title: "Success",
          description: "MPI updated successfully.",
        })
      }
    } catch (error: any) {
      console.error("Form submission error:", error)
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
        title: "Submission Error",
        description: error.message || "Failed to update MPI. Please try again.",
        variant: "destructive",
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
    console.log("🔧 Updating specification:", specificationId, "with value:", value, "unit:", unit)
    setSpecificationValues((prev) => {
      const currentSpec = prev[specificationId] || { specificationId, value: "", unit: undefined, fileUrl: undefined }
      const updated = {
        ...prev,
        [specificationId]: {
          ...currentSpec,
          specificationId,
          value,
          unit: unit !== undefined ? unit : currentSpec.unit,
        },
      }
      console.log("🔧 Updated specification values:", updated)
      return updated
    })
  }

  const handleFileUpload = async (specificationId: string, file: File, stationId: string, unit?: string) => {
    console.log("📁 Starting file upload for spec:", specificationId, "station:", stationId)
    setUploadingFiles((prev) => new Set(prev).add(specificationId))
    try {
      const result = await StationAPI.uploadStationSpecificationFile(file, specificationId, stationId, unit)
      console.log("📁 File upload result:", result)
      setSpecificationValues((prev) => {
        const updated = {
          ...prev,
          [specificationId]: {
            specificationId,
            value: result.value || file.name,
            fileUrl: result.fileUrl,
            unit: unit || prev[specificationId]?.unit,
          },
        }
        console.log("📁 Updated specification values after upload:", updated)
        return updated
      })
      toast({
        title: "Success",
        description: "File uploaded successfully.",
      })
    } catch (error) {
      console.error("File upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(specificationId)
        return newSet
      })
    }
  }

  const renderSpecificationInput = (spec: any, stationId: string) => {
    const specValue = specificationValues[spec.id]
    const isUploading = uploadingFiles.has(spec.id)
    // Only log if there's an issue or for debugging specific specs
    if (!specValue && spec.required) {
      console.log(`⚠️ Required spec ${spec.name} (${spec.id}) has no value`)
    }

    switch (spec.inputType) {
      case "TEXT":
        return (
          <div className="space-y-2">
            <Label htmlFor={`spec-${spec.id}`}>
              {spec.name}
              {spec.required && <span className="text-green-500 ml-1">*</span>}
            </Label>
            <Input
              ref={(el) => {
                specificationRefs.current[spec.id] = el
              }}
              id={`spec-${spec.id}`}
              value={specValue?.value || ""}
              onChange={(e) => {
                setFocusedSpecificationId(spec.id)
                handleSpecificationValueChange(spec.id, e.target.value)
              }}
              onFocus={() => setFocusedSpecificationId(spec.id)}
              onBlur={() => setFocusedSpecificationId(null)}
              placeholder={`Enter ${spec.name.toLowerCase()}`}
              className="h-10"
            />
          </div>
        )
      case "number":
        return (
          <div className="space-y-2">
            <Label htmlFor={`spec-${spec.id}`}>
              {spec.name}
              {spec.required && <span className="text-green-500 ml-1">*</span>}
            </Label>
            <div className="flex gap-2">
              <Input
                ref={(el) => {
                  specificationRefs.current[spec.id] = el
                }}
                id={`spec-${spec.id}`}
                type="number"
                value={specValue?.value || ""}
                onChange={(e) => {
                  setFocusedSpecificationId(spec.id)
                  handleSpecificationValueChange(spec.id, e.target.value, specValue?.unit)
                }}
                onFocus={() => setFocusedSpecificationId(spec.id)}
                onBlur={() => setFocusedSpecificationId(null)}
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
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`spec-${spec.id}`}
                checked={specValue?.value === "true"}
                onCheckedChange={(checked) => handleSpecificationValueChange(spec.id, checked ? "true" : "false")}
              />
              <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
                {spec.name}
                {spec.required && <span className="text-green-500 ml-1">*</span>}
              </Label>
            </div>
          </div>
        )
      case "DROPDOWN":
        const suggestions = spec.suggestions || []
        return (
          <div className="space-y-2">
            <Label htmlFor={`spec-${spec.id}`}>
              {spec.name}
              {spec.required && <span className="text-green-500 ml-1">*</span>}
            </Label>
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
          <div className="space-y-2">
            <Label htmlFor={`spec-${spec.id}`}>
              {spec.name}
              {spec.required && <span className="text-green-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  id={`spec-${spec.id}`}
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
                  <a
                    href={specValue.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View
                  </a>
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
          <div className="space-y-2">
            <Label htmlFor={`spec-${spec.id}`}>
              {spec.name}
              {spec.required && <span className="text-green-500 ml-1">*</span>}
            </Label>
            <Input
              id={`spec-${spec.id}`}
              value={specValue?.value || ""}
              onChange={(e) => handleSpecificationValueChange(spec.id, e.target.value)}
              placeholder={`Enter ${spec.name.toLowerCase()}`}
              className="h-10"
            />
          </div>
        )
    }
  }

  const renderStationDocuments = (stationId: string) => {
    const documents = stationDocuments[stationId] || []
    return (
      <div className="space-y-4">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Upload Station Document</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="station-doc-file">Select Files *</Label>
                <Input
                  id="station-doc-file"
                  type="file"
                  accept="*/*"
                  className="cursor-pointer"
                  disabled={uploadingStationDoc}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="station-doc-description">Description</Label>
                <Input
                  id="station-doc-description"
                  placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
                  disabled={uploadingStationDoc}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={uploadingStationDoc}
              onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                const fileInput = document.getElementById("station-doc-file") as HTMLInputElement
                const descInput = document.getElementById("station-doc-description") as HTMLInputElement
                const file = fileInput?.files?.[0]
                const description = descInput?.value?.trim() || ""
                if (!file) {
                  toast({
                    title: "Missing File",
                    description: "Please select a file to upload.",
                    variant: "destructive",
                  })
                  return
                }
                await handleStationDocumentUpload(file, description, file.name)
                fileInput.value = ""
                descInput.value = ""
              }}
              className="w-full"
            >
              {uploadingStationDoc ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Uploading File...
                </div>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </>
              )}
            </Button>
          </div>
        </div>
        {/* Documents List */}
        {documents.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">No files available for this station.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {doc.description || "Untitled Document"}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploaded: {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "Unknown date"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          window.open(doc.fileUrl, "_blank")
                        }}
                        className="h-8 px-3"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const link = document.createElement("a")
                          link.href = doc.fileUrl
                          link.download = doc.description || "document"
                          link.click()
                        }}
                        className="h-8 px-3"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDeleteStationDocument(stationId, doc.id)
                        }}
                        className="h-8 px-3 text-green-600 hover:text-green-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderStationNotes = (stationId: string) => {
    const notes = stationNotes[stationId] || []
    return (
      <div className="space-y-4">
        {/* Add Note Section */}
        {/* <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Station Note
          </h4>
          <div className="space-y-3">
            <Textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Enter operational notes, safety instructions, or maintenance reminders..."
              rows={3}
              className="resize-none"
            />
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleAddNote()
              }}
              disabled={addingNote || !newNoteContent.trim()}
              size="sm"
              className="w-full"
            >
              {addingNote ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Adding Note...
                </div>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </>
              )}
            </Button>
          </div>
        </div> */}
        {/* Notes List */}
        {notes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
            <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">No notes available for this station.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add operational notes, safety instructions, or reminders above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              Station Notes ({notes.length})
            </h4>
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="p-3 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {note.createdAt ? new Date(note.createdAt).toLocaleString() : "Unknown date"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDeleteNote(stationId, note.id!)
                      }}
                      className="ml-3 h-8 px-2 text-green-600 hover:text-green-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-3xl font-bold text-green-600">Edit MPI</h1>
            <p className="text-muted-foreground">
              Job ID: {mpi.jobId} • Assembly ID: {mpi.assemblyId}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic-info" className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Order Details
                  </TabsTrigger>
                  <TabsTrigger value="documentation" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Files
                    {mpiDocumentation.length > 0 && (
                      <Badge variant="secondary" size="sm" className="ml-1">
                        {mpiDocumentation.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="checklist" className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" />
                    Checklist
                    {existingChecklists.length + availableChecklistTemplate.length > 0 && (
                      <Badge variant="secondary" size="sm" className="ml-1">
                        {existingChecklists.length + availableChecklistTemplate.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="instructions" className="flex items-center gap-2">
                    <Factory className="w-4 h-4" />
                    Instructions
                    {selectedStations.length > 0 && (
                      <Badge variant="secondary" size="sm" className="ml-1">
                        {selectedStations.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
                {/* Basic Information & Order Form Tab */}
                <TabsContent value="basic-info" className="space-y-6 mt-6">
                  {/* MPI Basic Information */}
                  <Card>
                    <CardContent className="mt-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="jobId">
                            MPI ID *{checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
                          </Label>
                          <Input
                            id="jobId"
                            value={formData.jobId}
                            onChange={(e) => handleChange("jobId", e.target.value)}
                            placeholder="Enter job ID"
                            required
                            className="h-11"
                          />
                          {(() => {
                            const error = validateJobId(formData.jobId)
                            return error ? (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {error}
                              </p>
                            ) : null
                          })()}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assemblyId">
                            Assembly ID *
                            {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
                          </Label>
                          <Input
                            id="assemblyId"
                            value={formData.assemblyId}
                            onChange={(e) => handleChange("assemblyId", e.target.value)}
                            placeholder="Enter assembly ID"
                            required
                            className="h-11"
                          />
                          {(() => {
                            const error = validateAssemblyId(formData.assemblyId)
                            return error ? (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {error}
                              </p>
                            ) : null
                          })()}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customer">Customer</Label>
                          <Input
                            id="customer"
                            value={formData.customer}
                            onChange={(e) => handleChange("customer", e.target.value)}
                            placeholder="Enter customer name"
                            className="h-11"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Order Forms Section */}
                  <Card>
                    <CardContent className="mt-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="internalOrderNumber">Internal Order Number</Label>
                          <Input
                            id="internalOrderNumber"
                            value={orderFormData.internalOrderNumber}
                            onChange={(e) => handleOrderFormChange("internalOrderNumber", e.target.value)}
                            placeholder="Enter internal order number"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="revision">Revision</Label>
                          <Input
                            id="revision"
                            value={orderFormData.revision}
                            onChange={(e) => handleOrderFormChange("revision", e.target.value)}
                            placeholder="Enter revision number"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="documentControlId">
                            Document Control ID
                            {checkingIds && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
                          </Label>
                          <Input
                            id="documentControlId"
                            value={orderFormData.documentControlId}
                            onChange={(e) => handleOrderFormChange("documentControlId", e.target.value)}
                            placeholder="Enter document control ID"
                            className="h-11"
                          />
                          {(() => {
                            const error = orderFormData.documentControlId
                              ? validateDocumentControlId(orderFormData.documentControlId)
                              : null
                            return error ? (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {error}
                              </p>
                            ) : null
                          })()}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="distributionDate">Distribution Date</Label>
                          <Input
                            id="distributionDate"
                            type="date"
                            value={orderFormData.distributionDate}
                            onChange={(e) => handleOrderFormChange("distributionDate", e.target.value)}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="requiredBy">Required By</Label>
                          <Input
                            id="requiredBy"
                            type="date"
                            value={orderFormData.requiredBy}
                            onChange={(e) => handleOrderFormChange("requiredBy", e.target.value)}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="serviceSelect">Select Service</Label>
                          <div className="relative">
                            <Select
                              value={orderFormData.selectedServiceId || ""}
                              onChange={handleServiceChange}
                              disabled={loadingServices}
                            >
                              <SelectTrigger id="serviceSelect" className="h-11">
                                <SelectValue
                                  placeholder={
                                    loadingServices
                                      ? "Loading services..."
                                      : services.length === 0
                                        ? "No services available"
                                        : "Select a service"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem key={service.id} value={service.id}>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{service.name}</span>
                                      {service.description && (
                                        <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                          {service.description}
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {loadingServices && (
                              <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              </div>
                            )}
                          </div>
                          {services.length === 0 && !loadingServices && (
                            <p className="text-sm text-gray-500">
                              No services available. Please create services first.
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                {/* Documentation Tab */}
                <TabsContent value="documentation" className="space-y-6 mt-6">
                  <Card>
                    <CardContent className="mt-5">
                      <div className="space-y-4">
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
                              <div className="space-y-2">
                                <Label htmlFor="mpi-doc-description">Description (Optional)</Label>
                                <Input
                                  id="mpi-doc-description"
                                  placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
                                  disabled={uploadingMpiDoc}
                                />
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              disabled={uploadingMpiDoc}
                              onClick={async (e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                const fileInput = document.getElementById("mpi-doc-file") as HTMLInputElement
                                const descInput = document.getElementById("mpi-doc-description") as HTMLInputElement
                                const file = fileInput?.files?.[0]
                                const description = descInput?.value?.trim() || ""
                                if (!file) {
                                  toast({
                                    title: "Missing File",
                                    description: "Please select a file to upload.",
                                    variant: "destructive",
                                  })
                                  return
                                }
                                await handleMpiDocumentUpload(file, description)
                                fileInput.value = ""
                                descInput.value = ""
                              }}
                              className="w-full bg-transparent"
                            >
                              {uploadingMpiDoc ? (
                                <div className="flex items-center gap-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                  Uploading File...
                                </div>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload File
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        {/* Uploaded Documents List */}
                        {mpiDocumentation.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm">Files</h4>
                            <div className="space-y-2">
                              {mpiDocumentation.map((doc, index) => (
                                <div
                                  key={index}
                                  className="flex items-start justify-between p-4 bg-gray-50 rounded border"
                                >
                                  <div className="flex items-start gap-3 flex-1">
                                    <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {doc.description && doc.description !== doc.fileName
                                          ? doc.description
                                          : doc.fileName}
                                      </p>
                                      <div className="mt-1 space-y-1">
                                        <p className="text-xs text-gray-600">
                                          <span className="font-medium">Filename:</span> {doc.fileName}
                                        </p>
                                        {doc.description && doc.description !== doc.fileName && (
                                          <p className="text-xs text-gray-500">
                                            <span className="font-medium">Description:</span> {doc.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 ml-4">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        removeMpiDocument(index)
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
                </TabsContent>
                {/* Checklist Tab */}
                <TabsContent value="checklist" className="space-y-6 mt-6">
                  <Card>
                    <CardContent className="mt-5">
                      {loadingAvailableChecklist ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                            <p className="mt-2 text-sm text-muted-foreground">Loading checklist data...</p>
                          </div>
                        </div>
                      ) : existingChecklists.length === 0 && availableChecklistTemplate.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No checklist data available.</p>
                      ) : (
                        <div className="space-y-6">
                          {/* Existing Checklists */}
                          {existingChecklists.length > 0 ? (
                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-green-800">
                                Existing Required Checklists
                              </h3>
                              <Accordion type="multiple" className="w-full">
                                {existingChecklists.map((section) => (
                                  <AccordionItem key={section.id} value={section.id}>
                                    <AccordionTrigger className="text-left">
                                      <div className="flex items-center gap-3">
                                        <h4 className="font-medium">{section.name}</h4>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="space-y-4">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Description</TableHead>
                                              <TableHead>Required</TableHead>
                                              <TableHead>Remarks</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {(section.items || []).map((item) => (
                                              <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.description}</TableCell>
                                                <TableCell>
                                                  <Select
                                                    value={
                                                      getChecklistItemValue(item.id, "required", item.required)
                                                        ? "yes"
                                                        : "no"
                                                    }
                                                    onValueChange={(value) =>
                                                      handleChecklistItemChange(item.id, "required", value === "yes")
                                                    }
                                                  >
                                                    <SelectTrigger className="w-20">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="yes">Yes</SelectItem>
                                                      <SelectItem value="no">No</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </TableCell>
                                                <TableCell>
                                                  <Input
                                                    value={getChecklistItemValue(item.id, "remarks", item.remarks)}
                                                    onChange={(e) =>
                                                      handleChecklistItemChange(item.id, "remarks", e.target.value)
                                                    }
                                                    placeholder="Enter remarks (optional)"
                                                    className="min-w-[200px]"
                                                  />
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            </div>
                          ) : (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <h3 className="text-lg font-semibold mb-2 text-blue-800">Existing Checklists</h3>
                              <p className="text-sm text-blue-700">
                                No checklist items have been created for this MPI yet.
                              </p>
                            </div>
                          )}
                          {/* Available Checklist Template */}
                          {availableChecklistTemplate.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-green-800">Available Checklist Items</h3>
                              <Accordion type="multiple" className="w-full">
                                {availableChecklistTemplate.map((section) => (
                                  <AccordionItem key={section.id} value={section.id}>
                                    <AccordionTrigger className="text-left">
                                      <div className="flex items-center gap-3">
                                        <h4 className="font-medium">{section.name}</h4>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="space-y-4">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Description</TableHead>
                                              <TableHead>Required</TableHead>
                                              <TableHead>Remarks</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {(section.items || []).map((item) => (
                                              <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.description}</TableCell>
                                                <TableCell>
                                                  <Select
                                                    value={
                                                      getChecklistItemValue(item.id, "required", item.required)
                                                        ? "yes"
                                                        : "no"
                                                    }
                                                    onValueChange={(value) =>
                                                      handleChecklistItemChange(item.id, "required", value === "yes")
                                                    }
                                                  >
                                                    <SelectTrigger className="w-20">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="yes">Yes</SelectItem>
                                                      <SelectItem value="no">No</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </TableCell>
                                                <TableCell>
                                                  <Input
                                                    value={getChecklistItemValue(item.id, "remarks", item.remarks)}
                                                    onChange={(e) =>
                                                      handleChecklistItemChange(item.id, "remarks", e.target.value)
                                                    }
                                                    placeholder="Enter remarks (optional)"
                                                    className="min-w-[200px]"
                                                  />
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                {/* Instructions Tab */}
                <TabsContent value="instructions" className="space-y-6 mt-6">
                  <InstructionsTab
                    instructions={instructions}
                    onAddInstruction={handleAddInstruction}
                    onInstructionChange={handleInstructionChange}
                    onRemoveInstruction={handleRemoveInstruction}
                    availableStations={availableStations}
                    formData={formData}
                    loadingStations={loadingStations}
                    activeStationId={activeStationId}
                    setActiveStationId={setActiveStationId}
                    stationViewMode={stationViewMode}
                    setStationViewMode={setStationViewMode}
                    handleStationSelectionChange={handleStationSelectionChange}
                    selectedStations={selectedStations}
                    stationNotes={stationNotes}
                    stationDocuments={stationDocuments}
                    renderSpecificationInput={renderSpecificationInput}
                    renderStationDocuments={renderStationDocuments}
                    renderStationNotes={renderStationNotes}
                    focusedInstructionIndex={focusedInstructionIndex}
                    setFocusedInstructionIndex={setFocusedInstructionIndex}
                    instructionRefs={instructionRefs}
                  />
                </TabsContent>
              </Tabs>
              {/* Form Actions */}
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !isFormValid()}>
                  {isLoading ? (
                    <div className="flex items-center gap-2 animate-pulse">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <>Update MPI</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}









