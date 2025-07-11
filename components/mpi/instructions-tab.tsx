
// "use client"

// import { useState, useEffect, useCallback, useMemo, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { FileText, Plus, X, Upload, Factory, Eye } from "lucide-react"
// import type { Station } from "../stations/types"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"
// import { useToast } from "@/hooks/use-toast"
// import { Textarea } from "@/components/ui/textarea"
// import { API_BASE_URL } from "@/lib/constants"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   fileUrl?: string
//   unit?: string
// }

// interface StationDocument {
//   id?: string
//   file?: File
//   fileUrl?: string
//   description: string
//   fileName: string
//   stationId: string
//   isUploaded?: boolean
// }

// interface InstructionsTabProps {
//   availableStations: Station[]
//   selectedStationIds: string[]
//   loadingStations: boolean
//   activeStationId: string | null
//   stationViewMode: "specifications" | "documents" | "notes"
//   specificationValues: Record<string, SpecificationValue>
//   uploadingFiles: Set<string>
//   mpiId?: string
//   onStationSelectionChange: (stationIds: string[]) => void
//   onActiveStationChange: (stationId: string | null) => void
//   onStationViewModeChange: (mode: "specifications" | "documents" | "notes") => void
//   onSpecificationValueChange: (specificationId: string, value: string, unit?: string) => void
//   onFileUpload: (specificationId: string, file: File, stationId: string, unit?: string) => Promise<void>
//   renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
//   renderStationDocuments: (station: Station) => React.ReactNode
//   instructions: string[]
//   onAddInstruction: () => void
//   onInstructionChange: (index: number, value: string) => void
//   onRemoveInstruction: (index: number) => void
//   stationDocuments: Record<string, StationDocument[]>
//   onStationDocumentUpload: (stationId: string, file: File, description: string) => Promise<void>
//   onStationDocumentRemove: (stationId: string, documentIndex: number) => void
// }

// const InstructionsTab: React.FC<InstructionsTabProps> = ({
//   availableStations,
//   selectedStationIds,
//   loadingStations,
//   activeStationId,
//   stationViewMode,
//   specificationValues,
//   uploadingFiles,
//   mpiId,
//   onStationSelectionChange,
//   onActiveStationChange,
//   onStationViewModeChange,
//   onSpecificationValueChange,
//   onFileUpload,
//   renderSpecificationInput,
//   renderStationDocuments,
//   instructions,
//   onAddInstruction,
//   onInstructionChange,
//   onRemoveInstruction,
//   stationDocuments,
//   onStationDocumentUpload,
//   onStationDocumentRemove,
// }) => {
//   const { toast } = useToast()
//   const [uploadingStationDoc, setUploadingStationDoc] = useState(false)
//   const [stationNotes, setStationNotes] = useState<Record<string, any[]>>({})
//   const [loadingNotes, setLoadingNotes] = useState(false)
//   const [addingNote, setAddingNote] = useState(false)
//   const [loadingDocuments, setLoadingDocuments] = useState<Record<string, boolean>>({})
//   const [existingStationDocuments, setExistingStationDocuments] = useState<Record<string, any[]>>({})
//   const [deletingDocuments, setDeletingDocuments] = useState<Set<string>>(new Set())
//   const [stationDocumentFiles, setStationDocumentFiles] = useState<
//     Record<string, { file: File | null; description: string }>
//   >({})

//   // Add focus management for instruction inputs
//   const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
//   const instructionRefs = useRef<(HTMLInputElement | null)[]>([])

//   const safeStationDocuments = stationDocuments || {}

//   // Memoize the specification input renderer to prevent recreation on every render
//   const renderSpecificationInputField = useCallback(
//     (spec: any, stationId: string) => {
//       const specValue = specificationValues[spec.id] || { value: "", unit: spec.unit || "" }
//       const isUploading = uploadingFiles.has(spec.id)
//       const inputType = spec.inputType || spec.type || "TEXT"

//       console.log(`🔍 InstructionsTab - Rendering specification input:`, {
//         specId: spec.id,
//         specName: spec.name,
//         inputType: inputType,
//         originalSpec: spec,
//       })

//       const handleInputChange = (value: string) => {
//         onSpecificationValueChange(spec.id, value, specValue.unit)
//       }

//       const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0]
//         if (file) {
//           try {
//             await onFileUpload(spec.id, file, stationId, specValue.unit)
//           } catch (error) {
//             console.error("File upload failed:", error)
//           }
//         }
//       }

//       const handleUnitChange = (unitValue: string) => {
//         onSpecificationValueChange(spec.id, specValue.value || "", unitValue)
//       }

//       const handleCheckboxChange = (checked: boolean) => {
//         handleInputChange(checked ? "true" : "false")
//       }

//       switch (inputType) {
//         case "TEXT":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Input
//                 id={`spec-${spec.id}`}
//                 value={specValue.value}
//                 onChange={(e) => handleInputChange(e.target.value)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10"
//               />
//             </div>
//           )

//         case "number":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="flex gap-2">
//                 <Input
//                   id={`spec-${spec.id}`}
//                   type="number"
//                   value={specValue.value}
//                   onChange={(e) => handleInputChange(e.target.value)}
//                   placeholder={`Enter ${spec.name.toLowerCase()}`}
//                   className="h-10 flex-1"
//                 />
//                 <Input
//                   placeholder="Unit"
//                   value={specValue.unit || ""}
//                   onChange={(e) => handleUnitChange(e.target.value)}
//                   className="h-10 w-20"
//                 />
//               </div>
//             </div>
//           )

//         case "CHECKBOX":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`spec-${spec.id}`}
//                   checked={specValue.value === "true"}
//                   onCheckedChange={handleCheckboxChange}
//                 />
//                 <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                   {spec.name}
//                   {spec.required && <span className="text-red-500 ml-1">*</span>}
//                 </Label>
//               </div>
//             </div>
//           )

//         case "DROPDOWN":
//           const suggestions = spec.suggestions || []
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Select value={specValue.value} onValueChange={handleInputChange}>
//                 <SelectTrigger id={`spec-${spec.id}`} className="h-10">
//                   <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {suggestions.map((suggestion: string, index: number) => (
//                     <SelectItem key={index} value={suggestion}>
//                       {suggestion}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )

//         case "FILE_UPLOAD":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <Input
//                     id={`spec-${spec.id}`}
//                     type="file"
//                     onChange={handleFileChange}
//                     accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
//                     className="cursor-pointer flex-1"
//                     disabled={isUploading}
//                   />
//                   {isUploading && (
//                     <div className="flex items-center gap-2">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//                       <span className="text-xs text-muted-foreground">Uploading...</span>
//                     </div>
//                   )}
//                 </div>
//                 <Input
//                   placeholder="Unit (optional)"
//                   value={specValue.unit || ""}
//                   onChange={(e) => handleUnitChange(e.target.value)}
//                   className="h-10 w-32"
//                 />
//                 {specValue.fileUrl && (
//                   <div className="flex items-center gap-2">
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="outline"
//                       onClick={() => window.open(specValue.fileUrl, "_blank")}
//                     >
//                       <Eye className="w-3 h-3 mr-1" />
//                       View File
//                     </Button>
//                   </div>
//                 )}
//                 <p className="text-xs text-muted-foreground">
//                   Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
//                 </p>
//               </div>
//             </div>
//           )

//         default:
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Input
//                 id={`spec-${spec.id}`}
//                 value={specValue.value}
//                 onChange={(e) => handleInputChange(e.target.value)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10"
//               />
//             </div>
//           )
//       }
//     },
//     [specificationValues, uploadingFiles, onSpecificationValueChange, onFileUpload],
//   )

//   // Memoize event handlers to prevent unnecessary re-renders
//   const handleStationClick = useCallback(
//     (stationId: string) => {
//       onActiveStationChange(stationId)
//       if (selectedStationIds.includes(stationId)) {
//         onStationSelectionChange(selectedStationIds.filter((id) => id !== stationId))
//       } else {
//         onStationSelectionChange([...selectedStationIds, stationId])
//       }
//     },
//     [selectedStationIds, onActiveStationChange, onStationSelectionChange],
//   )

//   const handleStationDocumentFileChange = useCallback((stationId: string, file: File | null) => {
//     setStationDocumentFiles((prev) => ({
//       ...prev,
//       [stationId]: {
//         ...prev[stationId],
//         file: file,
//       },
//     }))
//   }, [])

//   const handleStationDocumentDescriptionChange = useCallback((stationId: string, description: string) => {
//     setStationDocumentFiles((prev) => ({
//       ...prev,
//       [stationId]: {
//         ...prev[stationId],
//         description: description,
//       },
//     }))
//   }, [])

//   // Auto-select first station when editing existing MPI
//   useEffect(() => {
//     if (selectedStationIds.length > 0 && !activeStationId) {
//       const firstStationId = selectedStationIds[0]
//       onActiveStationChange(firstStationId)
//       if (stationViewMode !== "specifications") {
//         onStationViewModeChange("specifications")
//       }
//     }
//   }, [selectedStationIds, activeStationId, onActiveStationChange, stationViewMode, onStationViewModeChange])

//   // Load station notes when active station changes
//   useEffect(() => {
//     if (activeStationId) {
//       loadStationNotes(activeStationId)
//     }
//   }, [activeStationId])

//   // Load existing station documents only for the active station and only when documents tab is active
//   useEffect(() => {
//     if (activeStationId && stationViewMode === "documents") {
//       if (!existingStationDocuments[activeStationId]) {
//         loadExistingStationDocuments(activeStationId)
//       }
//     }
//   }, [activeStationId, stationViewMode])

//   // Restore focus to instruction input after re-render
//   useEffect(() => {
//     if (focusedInstructionIndex !== null && instructionRefs.current[focusedInstructionIndex]) {
//       const input = instructionRefs.current[focusedInstructionIndex]
//       const cursorPosition = input.selectionStart || 0
//       input.focus()
//       input.setSelectionRange(cursorPosition, cursorPosition)
//     }
//   }, [instructions, focusedInstructionIndex])

//   useEffect(() => {
//     console.log("🔄 Initializing station notes and documents from available stations")
//     const initialNotes: Record<string, any[]> = {}
//     const initialDocs: Record<string, any[]> = {}

//     availableStations.forEach((station) => {
//       console.log(`📍 Processing station: ${station.stationName} (${station.id})`)

//       let stationNotesArray: any[] = []
//       if (station.Note && Array.isArray(station.Note)) {
//         stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
//           (note, index) => ({
//             id: `note-${station.id}-${index}-${Date.now()}`,
//             content: note,
//             createdAt: new Date().toISOString(),
//             stationId: station.id,
//           }),
//         )
//       } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
//         stationNotesArray = [
//           {
//             id: `note-${station.id}-0-${Date.now()}`,
//             content: station.Note.trim(),
//             createdAt: new Date().toISOString(),
//             stationId: station.id,
//           },
//         ]
//       }

//       initialNotes[station.id] = stationNotesArray

//       let stationDocsArray: any[] = []
//       if (station.documentations && Array.isArray(station.documentations)) {
//         stationDocsArray = station.documentations.filter((doc) => doc && doc.fileUrl)
//       } else if (station.documents && Array.isArray(station.documents)) {
//         stationDocsArray = station.documents.filter((doc) => doc && doc.fileUrl)
//       } else if (station.stationDocuments && Array.isArray(station.stationDocuments)) {
//         stationDocsArray = station.stationDocuments.filter((doc) => doc && doc.fileUrl)
//       }

//       initialDocs[station.id] = stationDocsArray

//       console.log(
//         `✅ Initialized station ${station.id}: ${stationNotesArray.length} notes, ${stationDocsArray.length} docs`,
//       )
//     })

//     setStationNotes(initialNotes)
//     setExistingStationDocuments(initialDocs)
//     console.log("🎯 Station initialization complete:", { initialNotes, initialDocs })
//   }, [availableStations])

//   const loadExistingStationDocuments = async (stationId: string) => {
//     if (loadingDocuments[stationId]) {
//       return
//     }

//     try {
//       setLoadingDocuments((prev) => ({ ...prev, [stationId]: true }))
//       console.log("🔍 Loading existing station documents for station:", stationId)

//       const documents = await StationMpiDocAPI.findAll({ stationId })
//       console.log("📄 Existing station documents loaded for station", stationId, ":", documents)

//       setExistingStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: documents || [],
//       }))
//     } catch (error) {
//       console.error("❌ Failed to load existing station documents for station", stationId, ":", error)
//       toast({
//         title: "Error",
//         description: `Failed to load existing station documents for ${availableStations.find((s) => s.id === stationId)?.stationName || "station"}.`,
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingDocuments((prev) => ({ ...prev, [stationId]: false }))
//     }
//   }

//   const loadStationNotes = async (stationId: string) => {
//     try {
//       setLoadingNotes(true)
//       const station = availableStations.find((s) => s.id === stationId)
//       console.log(`📝 Loading notes for station: ${station?.stationName} (${stationId})`)

//       if (station) {
//         let stationNotesArray: any[] = []

//         if (station.Note && Array.isArray(station.Note)) {
//           stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
//             (note, index) => ({
//               id: `note-${stationId}-${index}-${Date.now()}`,
//               content: note,
//               createdAt: new Date().toISOString(),
//               stationId: stationId,
//             }),
//           )
//           console.log(`📝 Found Note array for station ${stationId}:`, stationNotesArray)
//         } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
//           stationNotesArray = [
//             {
//               id: `note-${stationId}-0-${Date.now()}`,
//               content: station.Note.trim(),
//               createdAt: new Date().toISOString(),
//               stationId: stationId,
//             },
//           ]
//           console.log(`📝 Found single Note for station ${stationId}:`, stationNotesArray)
//         } else if (station.notes && Array.isArray(station.notes)) {
//           stationNotesArray = station.notes
//             .filter((note) => note && (typeof note === "string" || note.content))
//             .map((note, index) => ({
//               id: note.id || `note-${stationId}-${index}-${Date.now()}`,
//               content: typeof note === "string" ? note : note.content,
//               createdAt: note.createdAt || new Date().toISOString(),
//               stationId: stationId,
//             }))
//           console.log(`📝 Found notes array for station ${stationId}:`, stationNotesArray)
//         }

//         setStationNotes((prev) => ({
//           ...prev,
//           [stationId]: stationNotesArray,
//         }))

//         console.log(`✅ Loaded ${stationNotesArray.length} notes for station ${stationId}`)
//       } else {
//         console.log(`⚠️ Station not found: ${stationId}`)
//         setStationNotes((prev) => ({
//           ...prev,
//           [stationId]: [],
//         }))
//       }
//     } catch (error) {
//       console.error("Failed to load station notes:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load station notes.",
//         variant: "destructive",
//       })
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: [],
//       }))
//     } finally {
//       setLoadingNotes(false)
//     }
//   }

//   const handleAddStationNote = async (stationId: string, content: string) => {
//     if (!content.trim()) {
//       toast({
//         title: "Invalid Note",
//         description: "Note content cannot be empty.",
//         variant: "destructive",
//       })
//       return
//     }

//     setAddingNote(true)
//     try {
//       const newNote = {
//         id: `note-${Date.now()}`,
//         content: content.trim(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         stationId: stationId,
//       }

//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: [...(prev[stationId] || []), newNote],
//       }))

//       toast({
//         title: "Success",
//         description: "Station note added successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to add station note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add station note.",
//         variant: "destructive",
//       })
//     } finally {
//       setAddingNote(false)
//     }
//   }

//   const handleDeleteStationNote = async (stationId: string, noteId: string) => {
//     try {
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: (prev[stationId] || []).filter((note) => note.id !== noteId),
//       }))

//       toast({
//         title: "Success",
//         description: "Station note deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete station note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete station note.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDeleteExistingDocument = async (e: React.MouseEvent, documentId: string, stationId: string) => {
//     e.preventDefault()
//     e.stopPropagation()

//     if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
//       return
//     }

//     setDeletingDocuments((prev) => new Set(prev).add(documentId))

//     try {
//       console.log("🗑️ Deleting existing station document:", documentId)
//       await StationMpiDocAPI.delete(documentId)
//       console.log("✅ Document deleted successfully")

//       setExistingStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: (prev[stationId] || []).filter((doc) => doc.id !== documentId),
//       }))

//       toast({
//         title: "Success",
//         description: "Document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("❌ Failed to delete document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setDeletingDocuments((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(documentId)
//         return newSet
//       })
//     }
//   }

//   const handleRemoveQueuedDocument = (e: React.MouseEvent, stationId: string, documentIndex: number) => {
//     e.preventDefault()
//     e.stopPropagation()

//     if (!confirm("Are you sure you want to remove this queued document?")) {
//       return
//     }

//     try {
//       onStationDocumentRemove(stationId, documentIndex)
//       toast({
//         title: "Success",
//         description: "Document removed from queue.",
//       })
//     } catch (error) {
//       console.error("Failed to remove queued document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to remove document.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleStationDocumentUpload = async (stationId: string, file: File, description: string) => {
//     setUploadingStationDoc(true)
//     try {
//       if (!file) {
//         throw new Error("No file selected")
//       }

//       const finalDescription = description.trim() || file.name

//       console.log("📤 Station document upload request:", {
//         stationId,
//         fileName: file.name,
//         description: finalDescription,
//         mpiId: mpiId || "NOT_CREATED_YET",
//         fileSize: file.size,
//       })

//       if (!mpiId) {
//         console.log("💾 QUEUING station document locally - MPI not created yet...")
//         if (file.size > 10 * 1024 * 1024) {
//           throw new Error("File size exceeds 10MB limit")
//         }

//         await onStationDocumentUpload(stationId, file, finalDescription)
//         toast({
//           title: "✅ Document Queued Successfully",
//           description: `"${finalDescription}" will be uploaded and linked to the MPI when it's created.`,
//         })
//       } else {
//         console.log("📤 Uploading station document directly to existing MPI...")
//         const formData = new FormData()
//         formData.append("files", file)
//         formData.append("stationId", stationId)
//         formData.append("description", finalDescription)
//         formData.append("mpiId", mpiId)
//         formData.append("originalName", file.name)

//         console.log("📤 Sending direct upload request to:", `${API_BASE_URL}/station-mpi-documents/upload`)

//         const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
//           method: "POST",
//           body: formData,
//         })

//         console.log("📥 Direct upload response status:", response.status)

//         if (!response.ok) {
//           const errorText = await response.text()
//           console.error("❌ Direct upload failed:", errorText)
//           throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
//         }

//         const result = await response.json()
//         console.log("✅ Station document uploaded and linked successfully:", result)

//         const document = Array.isArray(result) ? result[0] : result

//         if (document.mpiId !== mpiId) {
//           console.warn("⚠️ Document MPI ID mismatch:", {
//             expected: mpiId,
//             actual: document.mpiId,
//           })
//         }

//         toast({
//           title: "Success",
//           description: "Station document uploaded and linked to MPI successfully.",
//         })

//         await loadExistingStationDocuments(stationId)
//       }

//       setStationDocumentFiles((prev) => ({
//         ...prev,
//         [stationId]: { file: null, description: "" },
//       }))
//     } catch (error) {
//       console.error("❌ Station document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingStationDoc(false)
//     }
//   }

//   // Memoize the documents getter to prevent unnecessary recalculations
//   const getStationDocuments = useCallback(
//     (stationId: string) => {
//       const queuedDocuments = safeStationDocuments?.[stationId] || []
//       const existingDocs = existingStationDocuments[stationId] || []

//       console.log(`📄 Getting documents for station ${stationId}:`, {
//         queued: queuedDocuments.length,
//         existing: existingDocs.length,
//         queuedDocs: queuedDocuments,
//         existingDocs: existingDocs,
//       })

//       return {
//         queued: queuedDocuments,
//         existing: existingDocs,
//         all: [
//           ...existingDocs.map((doc) => ({
//             ...doc,
//             isUploaded: true,
//             isExisting: true,
//           })),
//           ...queuedDocuments,
//         ],
//       }
//     },
//     [safeStationDocuments, existingStationDocuments],
//   )

//   // Memoize the active station to prevent unnecessary re-renders
//   const activeStation = useMemo(() => {
//     return availableStations.find((s) => s.id === activeStationId)
//   }, [availableStations, activeStationId])

//   return (
//     <div className="space-y-6 mt-6">
//       <Card>
//         <CardContent className="space-y-6 mt-5">
//           {loadingStations ? (
//             <div className="flex items-center justify-center py-8">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
//                 <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
//               </div>
//             </div>
//           ) : availableStations.length === 0 ? (
//             <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//               <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
//             </div>
//           ) : (
//             <div className="flex gap-6 min-h-[600px]">
//               {/* Left Sidebar - Station List */}
//               <div className="w-1/4 border rounded-lg bg-gray-50">
//                 <div className="p-3 border-b bg-white rounded-t-lg">
//                   <h4 className="font-medium text-base">Stations</h4>
//                   <p className="text-xs text-muted-foreground">
//                     {selectedStationIds.length > 0
//                       ? `${selectedStationIds.length} selected`
//                       : "Click to select multiple"}
//                   </p>
//                 </div>
//                 <div className="p-2 overflow-y-auto h-[530px]">
//                   <div className="space-y-1">
//                     {availableStations.map((station) => {
//                       const stationDocs = getStationDocuments(station.id)
//                       return (
//                         <div
//                           key={station.id}
//                           className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
//                             selectedStationIds.includes(station.id)
//                               ? "bg-blue-100 text-blue-900 border-blue-300"
//                               : "bg-white hover:bg-gray-100 border-transparent"
//                           } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
//                           onClick={() => handleStationClick(station.id)}
//                         >
//                           <div className="flex items-center justify-between">
//                             <span>{station.stationName}</span>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>
//               </div>

//               {/* Right Panel - Station Specifications and Documents */}
//               <div className="flex-1 border rounded-lg bg-white">
//                 {activeStationId && activeStation ? (
//                   <div className="h-full flex flex-col">
//                     <div className="p-4 border-b bg-white rounded-t-lg">
//                       <div className="flex items-center justify-between">
//                         <h4 className="font-medium text-lg">{activeStation.stationName} Station</h4>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "specifications" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("specifications")}
//                           >
//                             Specifications
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "documents" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("documents")}
//                           >
//                             <FileText className="w-4 h-4 mr-1" />
//                             Files
//                             {(() => {
//                               const activeStationDocs = getStationDocuments(activeStationId)
//                               const docCount = activeStationDocs.all.length
//                               return docCount > 0 ? (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {docCount}
//                                 </Badge>
//                               ) : null
//                             })()}
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "notes" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("notes")}
//                           >
//                             <FileText className="w-4 h-4 mr-1" />
//                             Notes
//                             {(() => {
//                               const noteCount = activeStation?.Note?.length || 0
//                               return noteCount > 0 ? (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {noteCount}
//                                 </Badge>
//                               ) : null
//                             })()}
//                           </Button>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex-1 overflow-y-auto p-4">
//                       {stationViewMode === "notes" && (
//                         <div className="space-y-6">
//                           {/* Add Note Section */}
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                             <div className="space-y-4">
//                               <div className="text-center">
//                                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <h4 className="font-medium text-gray-700">Add Station Note</h4>
//                               </div>
//                               <div className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor="station-note-content">Note Content </Label>
//                                   <Textarea
//                                     id="station-note-content"
//                                     placeholder="Enter note content (e.g., Safety procedures, operational instructions, maintenance notes)"
//                                     rows={4}
//                                     disabled={addingNote}
//                                   />
//                                 </div>
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   disabled={addingNote}
//                                   onClick={async () => {
//                                     const contentInput = document.getElementById(
//                                       "station-note-content",
//                                     ) as HTMLTextAreaElement
//                                     const content = contentInput?.value?.trim() || ""
//                                     if (!content) {
//                                       toast({
//                                         title: "Missing Content",
//                                         description: "Please enter note content.",
//                                         variant: "destructive",
//                                       })
//                                       return
//                                     }
//                                     await handleAddStationNote(activeStation.id, content)
//                                     contentInput.value = ""
//                                   }}
//                                   className="w-full bg-transparent"
//                                 >
//                                   {addingNote ? (
//                                     <div className="flex items-center gap-2">
//                                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                       Adding Note...
//                                     </div>
//                                   ) : (
//                                     <>
//                                       <Plus className="w-4 h-4 mr-2" />
//                                       Add Note
//                                     </>
//                                   )}
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Existing Notes */}
//                           <div>
//                             <h4 className="font-medium text-gray-700 mb-4">Station Notes</h4>
//                             {loadingNotes ? (
//                               <div className="flex items-center justify-center py-8">
//                                 <div className="text-center">
//                                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
//                                   <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
//                                 </div>
//                               </div>
//                             ) : (stationNotes[activeStationId] || []).length === 0 ? (
//                               <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                                 <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                 <p className="text-muted-foreground">No notes available for this station.</p>
//                                 <p className="text-sm text-gray-400 mt-1">
//                                   Add operational notes, safety instructions, or maintenance reminders above.
//                                 </p>
//                               </div>
//                             ) : (
//                               <div className="space-y-4">
//                                 {(stationNotes[activeStationId] || []).map((note, index) => (
//                                   <div key={note.id || index} className="p-4 bg-white border rounded-lg shadow-sm">
//                                     <div className="flex items-start justify-between">
//                                       <div className="flex-1 min-w-0">
//                                         <div className="prose prose-sm max-w-none">
//                                           <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
//                                         </div>
//                                         <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
//                                           <span>
//                                             Created:{" "}
//                                             {note.createdAt
//                                               ? new Date(note.createdAt).toLocaleDateString()
//                                               : "Unknown date"}
//                                           </span>
//                                           {note.updatedAt && note.updatedAt !== note.createdAt && (
//                                             <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
//                                           )}
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-2 ml-4">
//                                         <Button
//                                           size="sm"
//                                           variant="outline"
//                                           onClick={(e) => {
//                                             e.preventDefault()
//                                             e.stopPropagation()
//                                             handleDeleteStationNote(activeStation.id, note.id)
//                                           }}
//                                           className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
//                                         >
//                                           <X className="w-3 h-3 mr-1" />
//                                           Delete
//                                         </Button>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {stationViewMode === "documents" && (
//                         <div className="space-y-6">
//                           {/* Document Upload Section */}
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                             <div className="space-y-4">
//                               <div className="text-center">
//                                 <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <h4 className="font-medium text-gray-700">Upload Files</h4>
//                                 {/* <p className="text-sm text-gray-500">
//                                   Upload documents specific to {activeStation.stationName} station
//                                 </p> */}
//                               </div>
//                               <div className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor={`station-doc-file-${activeStationId}`}>Select Files *</Label>
//                                   <Input
//                                     id={`station-doc-file-${activeStationId}`}
//                                     type="file"
//                                     accept="*/*"
//                                     className="cursor-pointer"
//                                     disabled={uploadingStationDoc}
//                                     onChange={(e) => {
//                                       const file = e.target.files?.[0] || null
//                                       handleStationDocumentFileChange(activeStationId, file)
//                                     }}
//                                   />
//                                   <p className="text-xs text-muted-foreground">
//                                     {/* Select any file type (PDF, Word, Excel, images, etc.) */}
//                                   </p>
//                                   {stationDocumentFiles[activeStationId]?.file && (
//                                     <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
//                                       <FileText className="w-4 h-4 text-green-600" />
//                                       <span className="text-sm text-green-800">
//                                         Selected: {stationDocumentFiles[activeStationId].file.name} (
//                                         {(stationDocumentFiles[activeStationId].file.size / 1024 / 1024).toFixed(2)} MB)
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="space-y-2">
//                                   <Label htmlFor={`station-doc-description-${activeStationId}`}>
//                                     Description (Optional)
//                                   </Label>
//                                   <Input
//                                     id={`station-doc-description-${activeStationId}`}
//                                     placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                                     disabled={uploadingStationDoc}
//                                     value={stationDocumentFiles[activeStationId]?.description || ""}
//                                     onChange={(e) => {
//                                       handleStationDocumentDescriptionChange(activeStationId, e.target.value)
//                                     }}
//                                   />
//                                 </div>
//                               </div>
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 disabled={uploadingStationDoc || !stationDocumentFiles[activeStationId]?.file}
//                                 onClick={async (e) => {
//                                   e.preventDefault()
//                                   e.stopPropagation()
//                                   const file = stationDocumentFiles[activeStationId]?.file
//                                   const description = stationDocumentFiles[activeStationId]?.description || ""
//                                   if (!file) {
//                                     toast({
//                                       title: "Missing File",
//                                       description: "Please select a file to upload.",
//                                       variant: "destructive",
//                                     })
//                                     return
//                                   }
//                                   await handleStationDocumentUpload(activeStation.id, file, description)
//                                 }}
//                                 className="w-full bg-transparent"
//                               >
//                                 {uploadingStationDoc ? (
//                                   <div className="flex items-center gap-2">
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                     {mpiId ? "Uploading Document..." : "Queuing Document..."}
//                                   </div>
//                                 ) : (
//                                   <>
//                                     <Upload className="w-4 h-4 mr-2" />
//                                     {mpiId ? "Upload Document" : "Upload"}
//                                   </>
//                                 )}
//                               </Button>
//                             </div>
//                           </div>

//                           {/* Document Summary and List */}
//                           {(() => {
//                             const stationDocs = getStationDocuments(activeStationId)
//                             const { queued: queuedDocuments, existing: existingDocs, all: allDocuments } = stationDocs

//                             return (
//                               <>
//                                 {allDocuments.length > 0 && (
//                                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//                                     <div className="flex items-center gap-2 mb-2">
//                                       <FileText className="w-5 h-5 text-blue-600" />
//                                       <h5 className="font-medium text-blue-900">
//                                         Files Summary for {activeStation.stationName}
//                                       </h5>
//                                     </div>
//                                     <div className="grid grid-cols-3 gap-4 text-sm">
//                                       <div>
//                                         <span className="text-blue-700">Total Files:</span>
//                                         <span className="font-medium ml-2">{allDocuments.length}</span>
//                                       </div>
//                                       <div>
//                                         <span className="text-blue-700">Uploaded:</span>
//                                         <span className="font-medium ml-2">{existingDocs.length}</span>
//                                       </div>
//                                       <div>
//                                         <span className="text-blue-700">Queued:</span>
//                                         <span className="font-medium ml-2">{queuedDocuments.length}</span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}

//                                 <div>
//                                   <h4 className="font-medium text-gray-700 mb-4">
//                                     {activeStation.stationName} Station Files
//                                   </h4>
//                                   {loadingDocuments[activeStationId] ? (
//                                     <div className="flex items-center justify-center py-8">
//                                       <div className="text-center">
//                                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
//                                         <p className="mt-2 text-sm text-muted-foreground">Loading files...</p>
//                                       </div>
//                                     </div>
//                                   ) : allDocuments.length === 0 ? (
//                                     <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                                       <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                       <p className="text-muted-foreground">No files available.</p>
//                                       {/* <p className="text-sm text-gray-400 mt-1">
//                                         Upload documents specific to this station above.
//                                       </p> */}
//                                     </div>
//                                   ) : (
//                                     <div className="space-y-3">
//                                       {allDocuments.map((doc, index) => (
//                                         <div
//                                           key={doc.id || `queued-${index}`}
//                                           className="p-4 bg-white border rounded-lg shadow-sm"
//                                         >
//                                           <div className="flex items-start justify-between">
//                                             <div className="flex items-start gap-3 flex-1">
//                                               <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                                               <div className="flex-1 min-w-0">
//                                                 <h6 className="font-medium text-sm text-gray-900 truncate">
//                                                   {doc.description && doc.description !== doc.fileName
//                                                     ? doc.description
//                                                     : doc.fileName || doc.originalName || "Untitled Document"}
//                                                 </h6>
//                                                 <div className="mt-1 space-y-1">
//                                                   <p className="text-xs text-gray-600">
//                                                     <span className="font-medium">Filename:</span>{" "}
//                                                     {doc.fileName || doc.originalName || "Unknown"}
//                                                   </p>
//                                                   {doc.description && doc.description !== doc.fileName && (
//                                                     <p className="text-xs text-gray-500">
//                                                       <span className="font-medium">Description:</span>{" "}
//                                                       {doc.description}
//                                                     </p>
//                                                   )}
//                                                 </div>
//                                               </div>
//                                             </div>
//                                             <div className="flex items-center gap-2 ml-4">
//                                               {doc.fileUrl && (
//                                                 <Button
//                                                   size="sm"
//                                                   variant="outline"
//                                                   onClick={(e) => {
//                                                     e.preventDefault()
//                                                     e.stopPropagation()
//                                                     window.open(doc.fileUrl, "_blank")
//                                                   }}
//                                                   className="h-8 px-3"
//                                                 >
//                                                   <Eye className="w-3 h-3 mr-1" />
//                                                   View
//                                                 </Button>
//                                               )}
//                                               <Button
//                                                 size="sm"
//                                                 variant="outline"
//                                                 disabled={doc.isExisting && deletingDocuments.has(doc.id)}
//                                                 onClick={(e) => {
//                                                   if (doc.isExisting) {
//                                                     handleDeleteExistingDocument(e, doc.id, activeStation.id)
//                                                   } else {
//                                                     const queuedIndex = queuedDocuments.findIndex(
//                                                       (qDoc) => qDoc === doc,
//                                                     )
//                                                     if (queuedIndex !== -1) {
//                                                       handleRemoveQueuedDocument(e, activeStation.id, queuedIndex)
//                                                     }
//                                                   }
//                                                 }}
//                                                 className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
//                                               >
//                                                 {doc.isExisting && deletingDocuments.has(doc.id) ? (
//                                                   <div className="flex items-center gap-1">
//                                                     <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
//                                                     <span className="text-xs">Deleting...</span>
//                                                   </div>
//                                                 ) : (
//                                                   <>
//                                                     <X className="w-3 h-3 mr-1" />
//                                                     {doc.isExisting ? "Delete" : "Remove"}
//                                                   </>
//                                                 )}
//                                               </Button>
//                                             </div>
//                                           </div>
//                                         </div>
//                                       ))}
//                                     </div>
//                                   )}
//                                 </div>
//                               </>
//                             )
//                           })()}
//                         </div>
//                       )}

//                       {stationViewMode === "specifications" && (
//                         <div>
//                           {activeStation.specifications && activeStation.specifications.length > 0 ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               {activeStation.specifications.map((spec) => (
//                                 <div key={spec.id} className="space-y-3 p-3 bg-gray-50 rounded border">
//                                   {renderSpecificationInputField(spec, activeStation.id)}
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <div className="text-center py-6 bg-gray-50 rounded border-2 border-dashed">
//                               <p className="text-sm text-muted-foreground">
//                                 No specifications available for this station.
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <div className="text-center">
//                       <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                       <h4 className="font-medium text-gray-600 mb-2">No Station Active</h4>
//                       <p className="text-sm text-muted-foreground">
//                         Click on a station from the left sidebar to view its specifications and documents
//                         {selectedStationIds.length > 0 && (
//                           <span className="block mt-2 text-blue-600 font-medium">
//                             {selectedStationIds.length} station{selectedStationIds.length > 1 ? "s" : ""} selected for
//                             MPI
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Instructions Section */}
//           <div className="mt-8 border-t pt-6">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h4 className="text-lg font-semibold text-red-800">General Instructions</h4>
//                 <p className="text-sm text-muted-foreground">
//                   Add general safety and operational instructions for this MPI
//                 </p>
//               </div>
//               <Button
//                 type="button"
//                 size="sm"
//                 variant="outline"
//                 onClick={() => {
//                   onAddInstruction()
//                   // Focus the new instruction input after it's added
//                   setTimeout(() => {
//                     setFocusedInstructionIndex(instructions.length)
//                   }, 0)
//                 }}
//                 className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Instruction
//               </Button>
//             </div>
//             {instructions.length === 0 ? (
//               <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                 <p className="text-sm text-muted-foreground">No instructions added yet</p>
//                 <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {instructions.map((instruction, index) => (
//                   <div key={`instruction-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
//                     <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
//                       {index + 1}
//                     </div>
//                     <div className="flex-1">
//                       <Input
//                         ref={(el) => {
//                           instructionRefs.current[index] = el
//                         }}
//                         value={instruction}
//                         onChange={(e) => {
//                           setFocusedInstructionIndex(index)
//                           onInstructionChange(index, e.target.value)
//                         }}
//                         onFocus={() => setFocusedInstructionIndex(index)}
//                         onBlur={() => setFocusedInstructionIndex(null)}
//                         placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
//                         className="w-full"
//                       />
//                     </div>
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="ghost"
//                       onClick={(e) => {
//                         e.preventDefault()
//                         e.stopPropagation()
//                         onRemoveInstruction(index)
//                         // Clear focus tracking when removing instruction
//                         setFocusedInstructionIndex(null)
//                       }}
//                       className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
//                     >
//                       <X className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default InstructionsTab













// "use client"

// import type React from "react"

// import { useState, useEffect, useCallback, useMemo, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { FileText, Plus, X, Upload, Factory, Eye } from "lucide-react"
// import type { Station } from "../stations/types"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"
// import { useToast } from "@/hooks/use-toast"
// import { Textarea } from "@/components/ui/textarea"
// import { API_BASE_URL } from "@/lib/constants"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   fileUrl?: string
//   unit?: string
// }

// interface StationDocument {
//   id?: string
//   file?: File
//   fileUrl?: string
//   description: string
//   fileName: string
//   stationId: string
//   isUploaded?: boolean
// }

// interface InstructionsTabProps {
//   availableStations: Station[]
//   selectedStationIds: string[]
//   loadingStations: boolean
//   activeStationId: string | null
//   stationViewMode: "specifications" | "documents" | "notes"
//   specificationValues: Record<string, SpecificationValue>
//   uploadingFiles: Set<string>
//   mpiId?: string
//   onStationSelectionChange: (stationIds: string[]) => void
//   onActiveStationChange: (stationId: string | null) => void
//   onStationViewModeChange: (mode: "specifications" | "documents" | "notes") => void
//   onSpecificationValueChange: (specificationId: string, value: string, unit?: string) => void
//   onFileUpload: (specificationId: string, file: File, stationId: string, unit?: string) => Promise<void>
//   renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
//   renderStationDocuments: (station: Station) => React.ReactNode
//   instructions: string[]
//   onAddInstruction: () => void
//   onInstructionChange: (index: number, value: string) => void
//   onRemoveInstruction: (index: number) => void
//   stationDocuments: Record<string, StationDocument[]>
//   onStationDocumentUpload: (stationId: string, file: File, description: string) => Promise<void>
//   onStationDocumentRemove: (stationId: string, documentIndex: number) => void
// }

// const InstructionsTab: React.FC<InstructionsTabProps> = ({
//   availableStations,
//   selectedStationIds,
//   loadingStations,
//   activeStationId,
//   stationViewMode,
//   specificationValues,
//   uploadingFiles,
//   mpiId,
//   onStationSelectionChange,
//   onActiveStationChange,
//   onStationViewModeChange,
//   onSpecificationValueChange,
//   onFileUpload,
//   renderSpecificationInput,
//   renderStationDocuments,
//   instructions,
//   onAddInstruction,
//   onInstructionChange,
//   onRemoveInstruction,
//   stationDocuments,
//   onStationDocumentUpload,
//   onStationDocumentRemove,
// }) => {
//   const { toast } = useToast()
//   const [uploadingStationDoc, setUploadingStationDoc] = useState(false)
//   const [stationNotes, setStationNotes] = useState<Record<string, any[]>>({})
//   const [loadingNotes, setLoadingNotes] = useState(false)
//   const [addingNote, setAddingNote] = useState(false)
//   const [loadingDocuments, setLoadingDocuments] = useState<Record<string, boolean>>({})
//   const [existingStationDocuments, setExistingStationDocuments] = useState<Record<string, any[]>>({})
//   const [deletingDocuments, setDeletingDocuments] = useState<Set<string>>(new Set())
//   const [stationDocumentFiles, setStationDocumentFiles] = useState<
//     Record<string, { file: File | null; description: string }>
//   >({})

//   // Add focus management for instruction inputs
//   const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
//   const instructionRefs = useRef<(HTMLInputElement | null)[]>([])

//   const safeStationDocuments = stationDocuments || {}

//   // Memoize the specification input renderer to prevent recreation on every render
//   const renderSpecificationInputField = useCallback(
//     (spec: any, stationId: string) => {
//       const specValue = specificationValues[spec.id] || { value: "", unit: spec.unit || "" }
//       const isUploading = uploadingFiles.has(spec.id)
//       const inputType = spec.inputType || spec.type || "TEXT"

//       console.log(`🔍 InstructionsTab - Rendering specification input:`, {
//         specId: spec.id,
//         specName: spec.name,
//         inputType: inputType,
//         specValue: specValue,
//         originalSpec: spec,
//       })

//       const handleInputChange = (value: string) => {
//         console.log(`🔧 Specification ${spec.id} value changed to:`, value)
//         onSpecificationValueChange(spec.id, value, specValue.unit)
//       }

//       const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0]
//         if (file) {
//           try {
//             console.log(`📁 File selected for spec ${spec.id}:`, file.name)
//             await onFileUpload(spec.id, file, stationId, specValue.unit)
//           } catch (error) {
//             console.error("File upload failed:", error)
//           }
//         }
//       }

//       const handleUnitChange = (unitValue: string) => {
//         console.log(`🔧 Specification ${spec.id} unit changed to:`, unitValue)
//         onSpecificationValueChange(spec.id, specValue.value || "", unitValue)
//       }

//       const handleCheckboxChange = (checked: boolean) => {
//         const value = checked ? "true" : "false"
//         console.log(`☑️ Specification ${spec.id} checkbox changed to:`, value)
//         handleInputChange(value)
//       }

//       switch (inputType) {
//         case "TEXT":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Input
//                 id={`spec-${spec.id}`}
//                 value={specValue.value}
//                 onChange={(e) => handleInputChange(e.target.value)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10"
//               />
//             </div>
//           )

//         case "number":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="flex gap-2">
//                 <Input
//                   id={`spec-${spec.id}`}
//                   type="number"
//                   value={specValue.value}
//                   onChange={(e) => handleInputChange(e.target.value)}
//                   placeholder={`Enter ${spec.name.toLowerCase()}`}
//                   className="h-10 flex-1"
//                 />
//                 <Input
//                   placeholder="Unit"
//                   value={specValue.unit || ""}
//                   onChange={(e) => handleUnitChange(e.target.value)}
//                   className="h-10 w-20"
//                 />
//               </div>
//             </div>
//           )

//         case "CHECKBOX":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`spec-${spec.id}`}
//                   checked={specValue.value === "true"}
//                   onCheckedChange={handleCheckboxChange}
//                 />
//                 <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                   {spec.name}
//                   {spec.required && <span className="text-red-500 ml-1">*</span>}
//                 </Label>
//               </div>
//             </div>
//           )

//         case "DROPDOWN":
//           const suggestions = spec.suggestions || []
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Select value={specValue.value} onValueChange={handleInputChange}>
//                 <SelectTrigger id={`spec-${spec.id}`} className="h-10">
//                   <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {suggestions.map((suggestion: string, index: number) => (
//                     <SelectItem key={index} value={suggestion}>
//                       {suggestion}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )

//         case "FILE_UPLOAD":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <Input
//                     id={`spec-${spec.id}`}
//                     type="file"
//                     onChange={handleFileChange}
//                     accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
//                     className="cursor-pointer flex-1"
//                     disabled={isUploading}
//                   />
//                   {isUploading && (
//                     <div className="flex items-center gap-2">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//                       <span className="text-xs text-muted-foreground">Uploading...</span>
//                     </div>
//                   )}
//                 </div>
//                 <Input
//                   placeholder="Unit (optional)"
//                   value={specValue.unit || ""}
//                   onChange={(e) => handleUnitChange(e.target.value)}
//                   className="h-10 w-32"
//                 />
//                 {specValue.fileUrl && (
//                   <div className="flex items-center gap-2">
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="outline"
//                       onClick={() => window.open(specValue.fileUrl, "_blank")}
//                     >
//                       <Eye className="w-3 h-3 mr-1" />
//                       View File
//                     </Button>
//                   </div>
//                 )}
//                 <p className="text-xs text-muted-foreground">
//                   Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
//                 </p>
//               </div>
//             </div>
//           )

//         default:
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Input
//                 id={`spec-${spec.id}`}
//                 value={specValue.value}
//                 onChange={(e) => handleInputChange(e.target.value)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10"
//               />
//             </div>
//           )
//       }
//     },
//     [specificationValues, uploadingFiles, onSpecificationValueChange, onFileUpload],
//   )

//   // Memoize event handlers to prevent unnecessary re-renders
//   const handleStationClick = useCallback(
//     (stationId: string) => {
//       onActiveStationChange(stationId)
//       if (selectedStationIds.includes(stationId)) {
//         onStationSelectionChange(selectedStationIds.filter((id) => id !== stationId))
//       } else {
//         onStationSelectionChange([...selectedStationIds, stationId])
//       }
//     },
//     [selectedStationIds, onActiveStationChange, onStationSelectionChange],
//   )

//   const handleStationDocumentFileChange = useCallback((stationId: string, file: File | null) => {
//     setStationDocumentFiles((prev) => ({
//       ...prev,
//       [stationId]: {
//         ...prev[stationId],
//         file: file,
//       },
//     }))
//   }, [])

//   const handleStationDocumentDescriptionChange = useCallback((stationId: string, description: string) => {
//     setStationDocumentFiles((prev) => ({
//       ...prev,
//       [stationId]: {
//         ...prev[stationId],
//         description: description,
//       },
//     }))
//   }, [])

//   // Auto-select first station when editing existing MPI
//   useEffect(() => {
//     if (selectedStationIds.length > 0 && !activeStationId) {
//       const firstStationId = selectedStationIds[0]
//       onActiveStationChange(firstStationId)
//       if (stationViewMode !== "specifications") {
//         onStationViewModeChange("specifications")
//       }
//     }
//   }, [selectedStationIds, activeStationId, onActiveStationChange, stationViewMode, onStationViewModeChange])

//   // Load station notes when active station changes
//   useEffect(() => {
//     if (activeStationId) {
//       loadStationNotes(activeStationId)
//     }
//   }, [activeStationId])

//   // Load existing station documents only for the active station and only when documents tab is active
//   useEffect(() => {
//     if (activeStationId && stationViewMode === "documents") {
//       if (!existingStationDocuments[activeStationId]) {
//         loadExistingStationDocuments(activeStationId)
//       }
//     }
//   }, [activeStationId, stationViewMode])

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

//   // Initialize station notes and documents from available stations
//   useEffect(() => {
//     console.log("🔄 Initializing station notes and documents from available stations")
//     const initialNotes: Record<string, any[]> = {}
//     const initialDocs: Record<string, any[]> = {}

//     availableStations.forEach((station) => {
//       console.log(`📍 Processing station: ${station.stationName} (${station.id})`)
//       let stationNotesArray: any[] = []

//       if (station.Note && Array.isArray(station.Note)) {
//         stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
//           (note, index) => ({
//             id: `note-${station.id}-${index}-${Date.now()}`,
//             content: note,
//             createdAt: new Date().toISOString(),
//             stationId: station.id,
//           }),
//         )
//       } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
//         stationNotesArray = [
//           {
//             id: `note-${station.id}-0-${Date.now()}`,
//             content: station.Note.trim(),
//             createdAt: new Date().toISOString(),
//             stationId: station.id,
//           },
//         ]
//       }

//       initialNotes[station.id] = stationNotesArray

//       let stationDocsArray: any[] = []
//       if (station.documentations && Array.isArray(station.documentations)) {
//         stationDocsArray = station.documentations.filter((doc) => doc && doc.fileUrl)
//       } else if (station.documents && Array.isArray(station.documents)) {
//         stationDocsArray = station.documents.filter((doc) => doc && doc.fileUrl)
//       } else if (station.stationDocuments && Array.isArray(station.stationDocuments)) {
//         stationDocsArray = station.stationDocuments.filter((doc) => doc && doc.fileUrl)
//       }

//       initialDocs[station.id] = stationDocsArray

//       console.log(
//         `✅ Initialized station ${station.id}: ${stationNotesArray.length} notes, ${stationDocsArray.length} docs`,
//       )
//     })

//     setStationNotes(initialNotes)
//     setExistingStationDocuments(initialDocs)
//     console.log("🎯 Station initialization complete:", { initialNotes, initialDocs })
//   }, [availableStations])

//   const loadExistingStationDocuments = async (stationId: string) => {
//     if (loadingDocuments[stationId]) {
//       return
//     }

//     try {
//       setLoadingDocuments((prev) => ({ ...prev, [stationId]: true }))
//       console.log("🔍 Loading existing station documents for station:", stationId)
//       const documents = await StationMpiDocAPI.findAll({ stationId })
//       console.log("📄 Existing station documents loaded for station", stationId, ":", documents)
//       setExistingStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: documents || [],
//       }))
//     } catch (error) {
//       console.error("❌ Failed to load existing station documents for station", stationId, ":", error)
//       toast({
//         title: "Error",
//         description: `Failed to load existing station documents for ${availableStations.find((s) => s.id === stationId)?.stationName || "station"}.`,
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingDocuments((prev) => ({ ...prev, [stationId]: false }))
//     }
//   }

//   const loadStationNotes = async (stationId: string) => {
//     try {
//       setLoadingNotes(true)
//       const station = availableStations.find((s) => s.id === stationId)
//       console.log(`📝 Loading notes for station: ${station?.stationName} (${stationId})`)

//       if (station) {
//         let stationNotesArray: any[] = []

//         if (station.Note && Array.isArray(station.Note)) {
//           stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
//             (note, index) => ({
//               id: `note-${stationId}-${index}-${Date.now()}`,
//               content: note,
//               createdAt: new Date().toISOString(),
//               stationId: stationId,
//             }),
//           )
//           console.log(`📝 Found Note array for station ${stationId}:`, stationNotesArray)
//         } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
//           stationNotesArray = [
//             {
//               id: `note-${stationId}-0-${Date.now()}`,
//               content: station.Note.trim(),
//               createdAt: new Date().toISOString(),
//               stationId: stationId,
//             },
//           ]
//           console.log(`📝 Found single Note for station ${stationId}:`, stationNotesArray)
//         } else if (station.notes && Array.isArray(station.notes)) {
//           stationNotesArray = station.notes
//             .filter((note) => note && (typeof note === "string" || note.content))
//             .map((note, index) => ({
//               id: note.id || `note-${stationId}-${index}-${Date.now()}`,
//               content: typeof note === "string" ? note : note.content,
//               createdAt: note.createdAt || new Date().toISOString(),
//               stationId: stationId,
//             }))
//           console.log(`📝 Found notes array for station ${stationId}:`, stationNotesArray)
//         }

//         setStationNotes((prev) => ({
//           ...prev,
//           [stationId]: stationNotesArray,
//         }))

//         console.log(`✅ Loaded ${stationNotesArray.length} notes for station ${stationId}`)
//       } else {
//         console.log(`⚠️ Station not found: ${stationId}`)
//         setStationNotes((prev) => ({
//           ...prev,
//           [stationId]: [],
//         }))
//       }
//     } catch (error) {
//       console.error("Failed to load station notes:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load station notes.",
//         variant: "destructive",
//       })
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: [],
//       }))
//     } finally {
//       setLoadingNotes(false)
//     }
//   }

//   const handleAddStationNote = async (stationId: string, content: string) => {
//     if (!content.trim()) {
//       toast({
//         title: "Invalid Note",
//         description: "Note content cannot be empty.",
//         variant: "destructive",
//       })
//       return
//     }

//     setAddingNote(true)
//     try {
//       const newNote = {
//         id: `note-${Date.now()}`,
//         content: content.trim(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         stationId: stationId,
//       }

//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: [...(prev[stationId] || []), newNote],
//       }))

//       toast({
//         title: "Success",
//         description: "Station note added successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to add station note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add station note.",
//         variant: "destructive",
//       })
//     } finally {
//       setAddingNote(false)
//     }
//   }

//   const handleDeleteStationNote = async (stationId: string, noteId: string) => {
//     try {
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: (prev[stationId] || []).filter((note) => note.id !== noteId),
//       }))

//       toast({
//         title: "Success",
//         description: "Station note deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete station note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete station note.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDeleteExistingDocument = async (e: React.MouseEvent, documentId: string, stationId: string) => {
//     e.preventDefault()
//     e.stopPropagation()

//     if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
//       return
//     }

//     setDeletingDocuments((prev) => new Set(prev).add(documentId))

//     try {
//       console.log("🗑️ Deleting existing station document:", documentId)
//       await StationMpiDocAPI.delete(documentId)
//       console.log("✅ Document deleted successfully")

//       setExistingStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: (prev[stationId] || []).filter((doc) => doc.id !== documentId),
//       }))

//       toast({
//         title: "Success",
//         description: "Document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("❌ Failed to delete document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setDeletingDocuments((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(documentId)
//         return newSet
//       })
//     }
//   }

//   const handleRemoveQueuedDocument = (e: React.MouseEvent, stationId: string, documentIndex: number) => {
//     e.preventDefault()
//     e.stopPropagation()

//     if (!confirm("Are you sure you want to remove this queued document?")) {
//       return
//     }

//     try {
//       onStationDocumentRemove(stationId, documentIndex)
//       toast({
//         title: "Success",
//         description: "Document removed from queue.",
//       })
//     } catch (error) {
//       console.error("Failed to remove queued document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to remove document.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleStationDocumentUpload = async (stationId: string, file: File, description: string) => {
//     setUploadingStationDoc(true)
//     try {
//       if (!file) {
//         throw new Error("No file selected")
//       }

//       const finalDescription = description.trim() || file.name

//       console.log("📤 Station document upload request:", {
//         stationId,
//         fileName: file.name,
//         description: finalDescription,
//         mpiId: mpiId || "NOT_CREATED_YET",
//         fileSize: file.size,
//       })

//       if (!mpiId) {
//         console.log("💾 QUEUING station document locally - MPI not created yet...")
//         if (file.size > 10 * 1024 * 1024) {
//           throw new Error("File size exceeds 10MB limit")
//         }

//         await onStationDocumentUpload(stationId, file, finalDescription)
//         toast({
//           title: "✅ Document Queued Successfully",
//           description: `"${finalDescription}" will be uploaded and linked to the MPI when it's created.`,
//         })
//       } else {
//         console.log("📤 Uploading station document directly to existing MPI...")
//         const formData = new FormData()
//         formData.append("files", file)
//         formData.append("stationId", stationId)
//         formData.append("description", finalDescription)
//         formData.append("mpiId", mpiId)
//         formData.append("originalName", file.name)

//         console.log("📤 Sending direct upload request to:", `${API_BASE_URL}/station-mpi-documents/upload`)

//         const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
//           method: "POST",
//           body: formData,
//         })

//         console.log("📥 Direct upload response status:", response.status)

//         if (!response.ok) {
//           const errorText = await response.text()
//           console.error("❌ Direct upload failed:", errorText)
//           throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
//         }

//         const result = await response.json()
//         console.log("✅ Station document uploaded and linked successfully:", result)

//         const document = Array.isArray(result) ? result[0] : result

//         if (document.mpiId !== mpiId) {
//           console.warn("⚠️ Document MPI ID mismatch:", {
//             expected: mpiId,
//             actual: document.mpiId,
//           })
//         }

//         toast({
//           title: "Success",
//           description: "Station document uploaded and linked to MPI successfully.",
//         })

//         await loadExistingStationDocuments(stationId)
//       }

//       setStationDocumentFiles((prev) => ({
//         ...prev,
//         [stationId]: { file: null, description: "" },
//       }))
//     } catch (error) {
//       console.error("❌ Station document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingStationDoc(false)
//     }
//   }

//   // Memoize the documents getter to prevent unnecessary recalculations
//   const getStationDocuments = useCallback(
//     (stationId: string) => {
//       const queuedDocuments = safeStationDocuments?.[stationId] || []
//       const existingDocs = existingStationDocuments[stationId] || []

//       console.log(`📄 Getting documents for station ${stationId}:`, {
//         queued: queuedDocuments.length,
//         existing: existingDocs.length,
//         queuedDocs: queuedDocuments,
//         existingDocs: existingDocs,
//       })

//       return {
//         queued: queuedDocuments,
//         existing: existingDocs,
//         all: [
//           ...existingDocs.map((doc) => ({
//             ...doc,
//             isUploaded: true,
//             isExisting: true,
//           })),
//           ...queuedDocuments,
//         ],
//       }
//     },
//     [safeStationDocuments, existingStationDocuments],
//   )

//   // Memoize the active station to prevent unnecessary re-renders
//   const activeStation = useMemo(() => {
//     return availableStations.find((s) => s.id === activeStationId)
//   }, [availableStations, activeStationId])

//   return (
//     <div className="space-y-6 mt-6">
//       <Card>
//         <CardContent className="space-y-6 mt-5">
//           {loadingStations ? (
//             <div className="flex items-center justify-center py-8">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
//                 <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
//               </div>
//             </div>
//           ) : availableStations.length === 0 ? (
//             <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//               <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
//             </div>
//           ) : (
//             <div className="flex gap-6 min-h-[600px]">
//               {/* Left Sidebar - Station List */}
//               <div className="w-1/4 border rounded-lg bg-gray-50">
//                 <div className="p-3 border-b bg-white rounded-t-lg">
//                   <h4 className="font-medium text-base">Stations</h4>
//                   <p className="text-xs text-muted-foreground">
//                     {selectedStationIds.length > 0
//                       ? `${selectedStationIds.length} selected`
//                       : "Click to select multiple"}
//                   </p>
//                 </div>
//                 <div className="p-2 overflow-y-auto h-[530px]">
//                   <div className="space-y-1">
//                     {availableStations.map((station) => {
//                       const stationDocs = getStationDocuments(station.id)
//                       return (
//                         <div
//                           key={station.id}
//                           className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
//                             selectedStationIds.includes(station.id)
//                               ? "bg-blue-100 text-blue-900 border-blue-300"
//                               : "bg-white hover:bg-gray-100 border-transparent"
//                           } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
//                           onClick={() => handleStationClick(station.id)}
//                         >
//                           <div className="flex items-center justify-between">
//                             <span>{station.stationName}</span>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>
//               </div>

//               {/* Right Panel - Station Specifications and Documents */}
//               <div className="flex-1 border rounded-lg bg-white">
//                 {activeStationId && activeStation ? (
//                   <div className="h-full flex flex-col">
//                     <div className="p-4 border-b bg-white rounded-t-lg">
//                       <div className="flex items-center justify-between">
//                         <h4 className="font-medium text-lg">{activeStation.stationName} Station</h4>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "specifications" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("specifications")}
//                           >
//                             Specifications
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "documents" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("documents")}
//                           >
//                             <FileText className="w-4 h-4 mr-1" />
//                             Files
//                             {(() => {
//                               const activeStationDocs = getStationDocuments(activeStationId)
//                               const docCount = activeStationDocs.all.length
//                               return docCount > 0 ? (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {docCount}
//                                 </Badge>
//                               ) : null
//                             })()}
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "notes" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("notes")}
//                           >
//                             <FileText className="w-4 h-4 mr-1" />
//                             Notes
//                             {(() => {
//                               const noteCount = activeStation?.Note?.length || 0
//                               return noteCount > 0 ? (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {noteCount}
//                                 </Badge>
//                               ) : null
//                             })()}
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-4">
//                       {stationViewMode === "notes" && (
//                         <div className="space-y-6">
//                           {/* Add Note Section */}
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                             <div className="space-y-4">
//                               <div className="text-center">
//                                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <h4 className="font-medium text-gray-700">Add Station Note</h4>
//                               </div>
//                               <div className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor="station-note-content">Note Content </Label>
//                                   <Textarea
//                                     id="station-note-content"
//                                     placeholder="Enter note content (e.g., Safety procedures, operational instructions, maintenance notes)"
//                                     rows={4}
//                                     disabled={addingNote}
//                                   />
//                                 </div>
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   disabled={addingNote}
//                                   onClick={async () => {
//                                     const contentInput = document.getElementById(
//                                       "station-note-content",
//                                     ) as HTMLTextAreaElement
//                                     const content = contentInput?.value?.trim() || ""
//                                     if (!content) {
//                                       toast({
//                                         title: "Missing Content",
//                                         description: "Please enter note content.",
//                                         variant: "destructive",
//                                       })
//                                       return
//                                     }
//                                     await handleAddStationNote(activeStation.id, content)
//                                     contentInput.value = ""
//                                   }}
//                                   className="w-full bg-transparent"
//                                 >
//                                   {addingNote ? (
//                                     <div className="flex items-center gap-2">
//                                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                       Adding Note...
//                                     </div>
//                                   ) : (
//                                     <>
//                                       <Plus className="w-4 h-4 mr-2" />
//                                       Add Note
//                                     </>
//                                   )}
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Existing Notes */}
//                           <div>
//                             <h4 className="font-medium text-gray-700 mb-4">Station Notes</h4>
//                             {loadingNotes ? (
//                               <div className="flex items-center justify-center py-8">
//                                 <div className="text-center">
//                                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
//                                   <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
//                                 </div>
//                               </div>
//                             ) : (stationNotes[activeStationId] || []).length === 0 ? (
//                               <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                                 <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                 <p className="text-muted-foreground">No notes available for this station.</p>
//                                 <p className="text-sm text-gray-400 mt-1">
//                                   Add operational notes, safety instructions, or maintenance reminders above.
//                                 </p>
//                               </div>
//                             ) : (
//                               <div className="space-y-4">
//                                 {(stationNotes[activeStationId] || []).map((note, index) => (
//                                   <div key={note.id || index} className="p-4 bg-white border rounded-lg shadow-sm">
//                                     <div className="flex items-start justify-between">
//                                       <div className="flex-1 min-w-0">
//                                         <div className="prose prose-sm max-w-none">
//                                           <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
//                                         </div>
//                                         <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
//                                           <span>
//                                             Created:{" "}
//                                             {note.createdAt
//                                               ? new Date(note.createdAt).toLocaleDateString()
//                                               : "Unknown date"}
//                                           </span>
//                                           {note.updatedAt && note.updatedAt !== note.createdAt && (
//                                             <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
//                                           )}
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-2 ml-4">
//                                         <Button
//                                           size="sm"
//                                           variant="outline"
//                                           onClick={(e) => {
//                                             e.preventDefault()
//                                             e.stopPropagation()
//                                             handleDeleteStationNote(activeStation.id, note.id)
//                                           }}
//                                           className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
//                                         >
//                                           <X className="w-3 h-3 mr-1" />
//                                           Delete
//                                         </Button>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {stationViewMode === "documents" && (
//                         <div className="space-y-6">
//                           {/* Document Upload Section */}
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                             <div className="space-y-4">
//                               <div className="text-center">
//                                 <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <h4 className="font-medium text-gray-700">Upload Files</h4>
//                               </div>
//                               <div className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor={`station-doc-file-${activeStationId}`}>Select Files *</Label>
//                                   <Input
//                                     id={`station-doc-file-${activeStationId}`}
//                                     type="file"
//                                     accept="*/*"
//                                     className="cursor-pointer"
//                                     disabled={uploadingStationDoc}
//                                     onChange={(e) => {
//                                       const file = e.target.files?.[0] || null
//                                       handleStationDocumentFileChange(activeStationId, file)
//                                     }}
//                                   />
//                                   {stationDocumentFiles[activeStationId]?.file && (
//                                     <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
//                                       <FileText className="w-4 h-4 text-green-600" />
//                                       <span className="text-sm text-green-800">
//                                         Selected: {stationDocumentFiles[activeStationId].file.name} (
//                                         {(stationDocumentFiles[activeStationId].file.size / 1024 / 1024).toFixed(2)} MB)
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="space-y-2">
//                                   <Label htmlFor={`station-doc-description-${activeStationId}`}>
//                                     Description (Optional)
//                                   </Label>
//                                   <Input
//                                     id={`station-doc-description-${activeStationId}`}
//                                     placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                                     disabled={uploadingStationDoc}
//                                     value={stationDocumentFiles[activeStationId]?.description || ""}
//                                     onChange={(e) => {
//                                       handleStationDocumentDescriptionChange(activeStationId, e.target.value)
//                                     }}
//                                   />
//                                 </div>
//                               </div>
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 disabled={uploadingStationDoc || !stationDocumentFiles[activeStationId]?.file}
//                                 onClick={async (e) => {
//                                   e.preventDefault()
//                                   e.stopPropagation()
//                                   const file = stationDocumentFiles[activeStationId]?.file
//                                   const description = stationDocumentFiles[activeStationId]?.description || ""
//                                   if (!file) {
//                                     toast({
//                                       title: "Missing File",
//                                       description: "Please select a file to upload.",
//                                       variant: "destructive",
//                                     })
//                                     return
//                                   }
//                                   await handleStationDocumentUpload(activeStation.id, file, description)
//                                 }}
//                                 className="w-full bg-transparent"
//                               >
//                                 {uploadingStationDoc ? (
//                                   <div className="flex items-center gap-2">
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                     {mpiId ? "Uploading Document..." : "Queuing Document..."}
//                                   </div>
//                                 ) : (
//                                   <>
//                                     <Upload className="w-4 h-4 mr-2" />
//                                     {mpiId ? "Upload Document" : "Upload"}
//                                   </>
//                                 )}
//                               </Button>
//                             </div>
//                           </div>

//                           {/* Document Summary and List */}
//                           {(() => {
//                             const stationDocs = getStationDocuments(activeStationId)
//                             const { queued: queuedDocuments, existing: existingDocs, all: allDocuments } = stationDocs
//                             return (
//                               <>
//                                 {allDocuments.length > 0 && (
//                                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//                                     <div className="flex items-center gap-2 mb-2">
//                                       <FileText className="w-5 h-5 text-blue-600" />
//                                       <h5 className="font-medium text-blue-900">
//                                         Files Summary for {activeStation.stationName}
//                                       </h5>
//                                     </div>
//                                     <div className="grid grid-cols-3 gap-4 text-sm">
//                                       <div>
//                                         <span className="text-blue-700">Total Files:</span>
//                                         <span className="font-medium ml-2">{allDocuments.length}</span>
//                                       </div>
//                                       <div>
//                                         <span className="text-blue-700">Uploaded:</span>
//                                         <span className="font-medium ml-2">{existingDocs.length}</span>
//                                       </div>
//                                       <div>
//                                         <span className="text-blue-700">Queued:</span>
//                                         <span className="font-medium ml-2">{queuedDocuments.length}</span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}
//                                 <div>
//                                   <h4 className="font-medium text-gray-700 mb-4">
//                                     {activeStation.stationName} Station Files
//                                   </h4>
//                                   {loadingDocuments[activeStationId] ? (
//                                     <div className="flex items-center justify-center py-8">
//                                       <div className="text-center">
//                                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
//                                         <p className="mt-2 text-sm text-muted-foreground">Loading files...</p>
//                                       </div>
//                                     </div>
//                                   ) : allDocuments.length === 0 ? (
//                                     <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                                       <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                       <p className="text-muted-foreground">No files available.</p>
//                                     </div>
//                                   ) : (
//                                     <div className="space-y-3">
//                                       {allDocuments.map((doc, index) => (
//                                         <div
//                                           key={doc.id || `queued-${index}`}
//                                           className="p-4 bg-white border rounded-lg shadow-sm"
//                                         >
//                                           <div className="flex items-start justify-between">
//                                             <div className="flex items-start gap-3 flex-1">
//                                               <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                                               <div className="flex-1 min-w-0">
//                                                 <h6 className="font-medium text-sm text-gray-900 truncate">
//                                                   {doc.description && doc.description !== doc.fileName
//                                                     ? doc.description
//                                                     : doc.fileName || doc.originalName || "Untitled Document"}
//                                                 </h6>
//                                                 <div className="mt-1 space-y-1">
//                                                   <p className="text-xs text-gray-600">
//                                                     <span className="font-medium">Filename:</span>{" "}
//                                                     {doc.fileName || doc.originalName || "Unknown"}
//                                                   </p>
//                                                   {doc.description && doc.description !== doc.fileName && (
//                                                     <p className="text-xs text-gray-500">
//                                                       <span className="font-medium">Description:</span>{" "}
//                                                       {doc.description}
//                                                     </p>
//                                                   )}
//                                                 </div>
//                                               </div>
//                                             </div>
//                                             <div className="flex items-center gap-2 ml-4">
//                                               {doc.fileUrl && (
//                                                 <Button
//                                                   size="sm"
//                                                   variant="outline"
//                                                   onClick={(e) => {
//                                                     e.preventDefault()
//                                                     e.stopPropagation()
//                                                     window.open(doc.fileUrl, "_blank")
//                                                   }}
//                                                   className="h-8 px-3"
//                                                 >
//                                                   <Eye className="w-3 h-3 mr-1" />
//                                                   View
//                                                 </Button>
//                                               )}
//                                               <Button
//                                                 size="sm"
//                                                 variant="outline"
//                                                 disabled={doc.isExisting && deletingDocuments.has(doc.id)}
//                                                 onClick={(e) => {
//                                                   if (doc.isExisting) {
//                                                     handleDeleteExistingDocument(e, doc.id, activeStation.id)
//                                                   } else {
//                                                     const queuedIndex = queuedDocuments.findIndex(
//                                                       (qDoc) => qDoc === doc,
//                                                     )
//                                                     if (queuedIndex !== -1) {
//                                                       handleRemoveQueuedDocument(e, activeStation.id, queuedIndex)
//                                                     }
//                                                   }
//                                                 }}
//                                                 className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
//                                               >
//                                                 {doc.isExisting && deletingDocuments.has(doc.id) ? (
//                                                   <div className="flex items-center gap-1">
//                                                     <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
//                                                     <span className="text-xs">Deleting...</span>
//                                                   </div>
//                                                 ) : (
//                                                   <>
//                                                     <X className="w-3 h-3 mr-1" />
//                                                     {doc.isExisting ? "Delete" : "Remove"}
//                                                   </>
//                                                 )}
//                                               </Button>
//                                             </div>
//                                           </div>
//                                         </div>
//                                       ))}
//                                     </div>
//                                   )}
//                                 </div>
//                               </>
//                             )
//                           })()}
//                         </div>
//                       )}

//                       {stationViewMode === "specifications" && (
//                         <div>
//                           {activeStation.specifications && activeStation.specifications.length > 0 ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               {activeStation.specifications.map((spec) => (
//                                 <div key={spec.id} className="space-y-3 p-3 bg-gray-50 rounded border">
//                                   {renderSpecificationInputField(spec, activeStation.id)}
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <div className="text-center py-6 bg-gray-50 rounded border-2 border-dashed">
//                               <p className="text-sm text-muted-foreground">
//                                 No specifications available for this station.
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <div className="text-center">
//                       <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                       <h4 className="font-medium text-gray-600 mb-2">No Station Active</h4>
//                       <p className="text-sm text-muted-foreground">
//                         Click on a station from the left sidebar to view its specifications and documents
//                         {selectedStationIds.length > 0 && (
//                           <span className="block mt-2 text-blue-600 font-medium">
//                             {selectedStationIds.length} station{selectedStationIds.length > 1 ? "s" : ""} selected for
//                             MPI
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Instructions Section */}
//           <div className="mt-8 border-t pt-6">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h4 className="text-lg font-semibold text-red-800">General Instructions</h4>
//                 <p className="text-sm text-muted-foreground">
//                   Add general safety and operational instructions for this MPI
//                 </p>
//               </div>
//               <Button
//                 type="button"
//                 size="sm"
//                 variant="outline"
//                 onClick={() => {
//                   onAddInstruction()
//                   // Focus the new instruction input after it's added
//                   setTimeout(() => {
//                     setFocusedInstructionIndex(instructions.length)
//                   }, 0)
//                 }}
//                 className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Instruction
//               </Button>
//             </div>
//             {instructions.length === 0 ? (
//               <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                 <p className="text-sm text-muted-foreground">No instructions added yet</p>
//                 <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {instructions.map((instruction, index) => (
//                   <div key={`instruction-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
//                     <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
//                       {index + 1}
//                     </div>
//                     <div className="flex-1">
//                       <Input
//                         ref={(el) => {
//                           instructionRefs.current[index] = el
//                         }}
//                         value={instruction}
//                         onChange={(e) => {
//                           setFocusedInstructionIndex(index)
//                           onInstructionChange(index, e.target.value)
//                         }}
//                         onFocus={() => setFocusedInstructionIndex(index)}
//                         onBlur={() => setFocusedInstructionIndex(null)}
//                         placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
//                         className="w-full"
//                       />
//                     </div>
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="ghost"
//                       onClick={(e) => {
//                         e.preventDefault()
//                         e.stopPropagation()
//                         onRemoveInstruction(index)
//                         // Clear focus tracking when removing instruction
//                         setFocusedInstructionIndex(null)
//                       }}
//                       className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
//                     >
//                       <X className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default InstructionsTab

















// "use client"

// import type React from "react"

// import { useState, useEffect, useCallback, useMemo, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { FileText, Plus, X, Upload, Factory, Eye } from "lucide-react"
// import type { Station } from "../stations/types"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"
// import { useToast } from "@/hooks/use-toast"
// import { Textarea } from "@/components/ui/textarea"
// import { API_BASE_URL } from "@/lib/constants"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   fileUrl?: string
//   unit?: string
// }

// interface StationDocument {
//   id?: string
//   file?: File
//   fileUrl?: string
//   description: string
//   fileName: string
//   stationId: string
//   isUploaded?: boolean
// }

// interface InstructionsTabProps {
//   availableStations: Station[]
//   selectedStationIds: string[]
//   loadingStations: boolean
//   activeStationId: string | null
//   stationViewMode: "specifications" | "documents" | "notes"
//   specificationValues: Record<string, SpecificationValue>
//   uploadingFiles: Set<string>
//   mpiId?: string
//   onStationSelectionChange: (stationIds: string[]) => void
//   onActiveStationChange: (stationId: string | null) => void
//   onStationViewModeChange: (mode: "specifications" | "documents" | "notes") => void
//   onSpecificationValueChange: (specificationId: string, value: string, unit?: string) => void
//   onFileUpload: (specificationId: string, file: File, stationId: string, unit?: string) => Promise<void>
//   renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
//   renderStationDocuments: (station: Station) => React.ReactNode
//   instructions: string[]
//   onAddInstruction: () => void
//   onInstructionChange: (index: number, value: string) => void
//   onRemoveInstruction: (index: number) => void
//   stationDocuments: Record<string, StationDocument[]>
//   onStationDocumentUpload: (stationId: string, file: File, description: string) => Promise<void>
//   onStationDocumentRemove: (stationId: string, documentIndex: number) => void
// }

// const InstructionsTab: React.FC<InstructionsTabProps> = ({
//   availableStations,
//   selectedStationIds,
//   loadingStations,
//   activeStationId,
//   stationViewMode,
//   specificationValues,
//   uploadingFiles,
//   mpiId,
//   onStationSelectionChange,
//   onActiveStationChange,
//   onStationViewModeChange,
//   onSpecificationValueChange,
//   onFileUpload,
//   renderSpecificationInput,
//   renderStationDocuments,
//   instructions,
//   onAddInstruction,
//   onInstructionChange,
//   onRemoveInstruction,
//   stationDocuments,
//   onStationDocumentUpload,
//   onStationDocumentRemove,
// }) => {
//   const { toast } = useToast()
//   const [uploadingStationDoc, setUploadingStationDoc] = useState(false)
//   const [stationNotes, setStationNotes] = useState<Record<string, any[]>>({})
//   const [loadingNotes, setLoadingNotes] = useState(false)
//   const [addingNote, setAddingNote] = useState(false)
//   const [loadingDocuments, setLoadingDocuments] = useState<Record<string, boolean>>({})
//   const [existingStationDocuments, setExistingStationDocuments] = useState<Record<string, any[]>>({})
//   const [deletingDocuments, setDeletingDocuments] = useState<Set<string>>(new Set())
//   const [stationDocumentFiles, setStationDocumentFiles] = useState<
//     Record<string, { file: File | null; description: string }>
//   >({})

//   // Add focus management for instruction inputs
//   const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
//   const instructionRefs = useRef<(HTMLInputElement | null)[]>([])

//   const [focusedSpecificationId, setFocusedSpecificationId] = useState<string | null>(null)
//   const specificationRefs = useRef<Record<string, HTMLInputElement | null>>({})

//   const safeStationDocuments = stationDocuments || {}

//   // Memoize the specification input renderer to prevent recreation on every render
//   const renderSpecificationInputField = useCallback(
//     (spec: any, stationId: string) => {
//       const specValue = specificationValues[spec.id] || { value: "", unit: spec.unit || "" }
//       const isUploading = uploadingFiles.has(spec.id)
//       const inputType = spec.inputType || spec.type || "TEXT"

//       console.log(`🔍 InstructionsTab - Rendering specification input:`, {
//         specId: spec.id,
//         specName: spec.name,
//         inputType: inputType,
//         specValue: specValue,
//         originalSpec: spec,
//       })

//       const handleInputChange = (value: string) => {
//         console.log(`🔧 Specification ${spec.id} value changed to:`, value)
//         onSpecificationValueChange(spec.id, value, specValue.unit)
//       }

//       const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0]
//         if (file) {
//           try {
//             console.log(`📁 File selected for spec ${spec.id}:`, file.name)
//             await onFileUpload(spec.id, file, stationId, specValue.unit)
//           } catch (error) {
//             console.error("File upload failed:", error)
//           }
//         }
//       }

//       const handleUnitChange = (unitValue: string) => {
//         console.log(`🔧 Specification ${spec.id} unit changed to:`, unitValue)
//         onSpecificationValueChange(spec.id, specValue.value || "", unitValue)
//       }

//       const handleCheckboxChange = (checked: boolean) => {
//         const value = checked ? "true" : "false"
//         console.log(`☑️ Specification ${spec.id} checkbox changed to:`, value)
//         handleInputChange(value)
//       }

//       switch (inputType) {
//         case "TEXT":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Input
//                 ref={(el) => {
//                   specificationRefs.current[spec.id] = el
//                 }}
//                 id={`spec-${spec.id}`}
//                 value={specValue.value}
//                 onChange={(e) => {
//                   setFocusedSpecificationId(spec.id)
//                   handleInputChange(e.target.value)
//                 }}
//                 onFocus={() => setFocusedSpecificationId(spec.id)}
//                 onBlur={() => setFocusedSpecificationId(null)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10"
//               />
//             </div>
//           )

//         case "number":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="flex gap-2">
//                 <Input
//                   ref={(el) => {
//                     specificationRefs.current[spec.id] = el
//                   }}
//                   id={`spec-${spec.id}`}
//                   type="number"
//                   value={specValue.value}
//                   onChange={(e) => {
//                     setFocusedSpecificationId(spec.id)
//                     handleInputChange(e.target.value)
//                   }}
//                   onFocus={() => setFocusedSpecificationId(spec.id)}
//                   onBlur={() => setFocusedSpecificationId(null)}
//                   placeholder={`Enter ${spec.name.toLowerCase()}`}
//                   className="h-10 flex-1"
//                 />
//                 <Input
//                   placeholder="Unit"
//                   value={specValue.unit || ""}
//                   onChange={(e) => handleUnitChange(e.target.value)}
//                   className="h-10 w-20"
//                 />
//               </div>
//             </div>
//           )

//         case "CHECKBOX":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`spec-${spec.id}`}
//                   checked={specValue.value === "true"}
//                   onCheckedChange={handleCheckboxChange}
//                 />
//                 <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                   {spec.name}
//                   {spec.required && <span className="text-green-500 ml-1">*</span>}
//                 </Label>
//               </div>
//             </div>
//           )

//         case "DROPDOWN":
//           const suggestions = spec.suggestions || []
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Select value={specValue.value} onValueChange={handleInputChange}>
//                 <SelectTrigger id={`spec-${spec.id}`} className="h-10">
//                   <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {suggestions.map((suggestion: string, index: number) => (
//                     <SelectItem key={index} value={suggestion}>
//                       {suggestion}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )

//         case "FILE_UPLOAD":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <Input
//                     id={`spec-${spec.id}`}
//                     type="file"
//                     onChange={handleFileChange}
//                     accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
//                     className="cursor-pointer flex-1"
//                     disabled={isUploading}
//                   />
//                   {isUploading && (
//                     <div className="flex items-center gap-2">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
//                       <span className="text-xs text-muted-foreground">Uploading...</span>
//                     </div>
//                   )}
//                 </div>
//                 <Input
//                   placeholder="Unit (optional)"
//                   value={specValue.unit || ""}
//                   onChange={(e) => handleUnitChange(e.target.value)}
//                   className="h-10 w-32"
//                 />
//                 {specValue.fileUrl && (
//                   <div className="flex items-center gap-2">
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="outline"
//                       onClick={() => window.open(specValue.fileUrl, "_blank")}
//                     >
//                       <Eye className="w-3 h-3 mr-1" />
//                       View File
//                     </Button>
//                   </div>
//                 )}
//                 <p className="text-xs text-muted-foreground">
//                   Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
//                 </p>
//               </div>
//             </div>
//           )

//         default:
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Input
//                 id={`spec-${spec.id}`}
//                 value={specValue.value}
//                 onChange={(e) => handleInputChange(e.target.value)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10"
//               />
//             </div>
//           )
//       }
//     },
//     [specificationValues, uploadingFiles, onSpecificationValueChange, onFileUpload],
//   )

//   // Memoize event handlers to prevent unnecessary re-renders
//   const handleStationClick = useCallback(
//     (stationId: string) => {
//       onActiveStationChange(stationId)
//       if (selectedStationIds.includes(stationId)) {
//         onStationSelectionChange(selectedStationIds.filter((id) => id !== stationId))
//       } else {
//         onStationSelectionChange([...selectedStationIds, stationId])
//       }
//     },
//     [selectedStationIds, onActiveStationChange, onStationSelectionChange],
//   )

//   const handleStationDocumentFileChange = useCallback((stationId: string, file: File | null) => {
//     setStationDocumentFiles((prev) => ({
//       ...prev,
//       [stationId]: {
//         ...prev[stationId],
//         file: file,
//       },
//     }))
//   }, [])

//   const handleStationDocumentDescriptionChange = useCallback((stationId: string, description: string) => {
//     setStationDocumentFiles((prev) => ({
//       ...prev,
//       [stationId]: {
//         ...prev[stationId],
//         description: description,
//       },
//     }))
//   }, [])

//   // Auto-select first station when editing existing MPI
//   useEffect(() => {
//     if (selectedStationIds.length > 0 && !activeStationId) {
//       const firstStationId = selectedStationIds[0]
//       onActiveStationChange(firstStationId)
//       if (stationViewMode !== "specifications") {
//         onStationViewModeChange("specifications")
//       }
//     }
//   }, [selectedStationIds, activeStationId, onActiveStationChange, stationViewMode, onStationViewModeChange])

//   // Load station notes when active station changes
//   useEffect(() => {
//     if (activeStationId) {
//       loadStationNotes(activeStationId)
//     }
//   }, [activeStationId])

//   // Load existing station documents only for the active station and only when documents tab is active
//   useEffect(() => {
//     if (activeStationId && stationViewMode === "documents") {
//       if (!existingStationDocuments[activeStationId]) {
//         loadExistingStationDocuments(activeStationId)
//       }
//     }
//   }, [activeStationId, stationViewMode])

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

//   // Restore focus to specification input after re-render
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

//   // Initialize station notes and documents from available stations
//   useEffect(() => {
//     console.log("🔄 Initializing station notes and documents from available stations")
//     const initialNotes: Record<string, any[]> = {}
//     const initialDocs: Record<string, any[]> = {}

//     availableStations.forEach((station) => {
//       console.log(`📍 Processing station: ${station.stationName} (${station.id})`)
//       let stationNotesArray: any[] = []

//       if (station.Note && Array.isArray(station.Note)) {
//         stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
//           (note, index) => ({
//             id: `note-${station.id}-${index}-${Date.now()}`,
//             content: note,
//             createdAt: new Date().toISOString(),
//             stationId: station.id,
//           }),
//         )
//       } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
//         stationNotesArray = [
//           {
//             id: `note-${station.id}-0-${Date.now()}`,
//             content: station.Note.trim(),
//             createdAt: new Date().toISOString(),
//             stationId: station.id,
//           },
//         ]
//       }

//       initialNotes[station.id] = stationNotesArray

//       let stationDocsArray: any[] = []
//       if (station.documentations && Array.isArray(station.documentations)) {
//         stationDocsArray = station.documentations.filter((doc) => doc && doc.fileUrl)
//       } else if (station.documents && Array.isArray(station.documents)) {
//         stationDocsArray = station.documents.filter((doc) => doc && doc.fileUrl)
//       } else if (station.stationDocuments && Array.isArray(station.stationDocuments)) {
//         stationDocsArray = station.stationDocuments.filter((doc) => doc && doc.fileUrl)
//       }

//       initialDocs[station.id] = stationDocsArray

//       console.log(
//         `✅ Initialized station ${station.id}: ${stationNotesArray.length} notes, ${stationDocsArray.length} docs`,
//       )
//     })

//     setStationNotes(initialNotes)
//     setExistingStationDocuments(initialDocs)
//     console.log("🎯 Station initialization complete:", { initialNotes, initialDocs })
//   }, [availableStations])

//   const loadExistingStationDocuments = async (stationId: string) => {
//     if (loadingDocuments[stationId]) {
//       return
//     }

//     try {
//       setLoadingDocuments((prev) => ({ ...prev, [stationId]: true }))
//       console.log("🔍 Loading existing station documents for station:", stationId)
//       const documents = await StationMpiDocAPI.findAll({ stationId })
//       console.log("📄 Existing station documents loaded for station", stationId, ":", documents)
//       setExistingStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: documents || [],
//       }))
//     } catch (error) {
//       console.error("❌ Failed to load existing station documents for station", stationId, ":", error)
//       toast({
//         title: "Error",
//         description: `Failed to load existing station documents for ${availableStations.find((s) => s.id === stationId)?.stationName || "station"}.`,
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingDocuments((prev) => ({ ...prev, [stationId]: false }))
//     }
//   }

//   const loadStationNotes = async (stationId: string) => {
//     try {
//       setLoadingNotes(true)
//       const station = availableStations.find((s) => s.id === stationId)
//       console.log(`📝 Loading notes for station: ${station?.stationName} (${stationId})`)

//       if (station) {
//         let stationNotesArray: any[] = []

//         if (station.Note && Array.isArray(station.Note)) {
//           stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
//             (note, index) => ({
//               id: `note-${stationId}-${index}-${Date.now()}`,
//               content: note,
//               createdAt: new Date().toISOString(),
//               stationId: stationId,
//             }),
//           )
//           console.log(`📝 Found Note array for station ${stationId}:`, stationNotesArray)
//         } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
//           stationNotesArray = [
//             {
//               id: `note-${stationId}-0-${Date.now()}`,
//               content: station.Note.trim(),
//               createdAt: new Date().toISOString(),
//               stationId: stationId,
//             },
//           ]
//           console.log(`📝 Found single Note for station ${stationId}:`, stationNotesArray)
//         } else if (station.notes && Array.isArray(station.notes)) {
//           stationNotesArray = station.notes
//             .filter((note) => note && (typeof note === "string" || note.content))
//             .map((note, index) => ({
//               id: note.id || `note-${stationId}-${index}-${Date.now()}`,
//               content: typeof note === "string" ? note : note.content,
//               createdAt: note.createdAt || new Date().toISOString(),
//               stationId: stationId,
//             }))
//           console.log(`📝 Found notes array for station ${stationId}:`, stationNotesArray)
//         }

//         setStationNotes((prev) => ({
//           ...prev,
//           [stationId]: stationNotesArray,
//         }))

//         console.log(`✅ Loaded ${stationNotesArray.length} notes for station ${stationId}`)
//       } else {
//         console.log(`⚠️ Station not found: ${stationId}`)
//         setStationNotes((prev) => ({
//           ...prev,
//           [stationId]: [],
//         }))
//       }
//     } catch (error) {
//       console.error("Failed to load station notes:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load station notes.",
//         variant: "destructive",
//       })
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: [],
//       }))
//     } finally {
//       setLoadingNotes(false)
//     }
//   }

//   const handleAddStationNote = async (stationId: string, content: string) => {
//     if (!content.trim()) {
//       toast({
//         title: "Invalid Note",
//         description: "Note content cannot be empty.",
//         variant: "destructive",
//       })
//       return
//     }

//     setAddingNote(true)
//     try {
//       const newNote = {
//         id: `note-${Date.now()}`,
//         content: content.trim(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         stationId: stationId,
//       }

//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: [...(prev[stationId] || []), newNote],
//       }))

//       toast({
//         title: "Success",
//         description: "Station note added successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to add station note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add station note.",
//         variant: "destructive",
//       })
//     } finally {
//       setAddingNote(false)
//     }
//   }

//   const handleDeleteStationNote = async (stationId: string, noteId: string) => {
//     try {
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: (prev[stationId] || []).filter((note) => note.id !== noteId),
//       }))

//       toast({
//         title: "Success",
//         description: "Station note deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete station note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete station note.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDeleteExistingDocument = async (e: React.MouseEvent, documentId: string, stationId: string) => {
//     e.preventDefault()
//     e.stopPropagation()

//     if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
//       return
//     }

//     setDeletingDocuments((prev) => new Set(prev).add(documentId))

//     try {
//       console.log("🗑️ Deleting existing station document:", documentId)
//       await StationMpiDocAPI.delete(documentId)
//       console.log("✅ Document deleted successfully")

//       setExistingStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: (prev[stationId] || []).filter((doc) => doc.id !== documentId),
//       }))

//       toast({
//         title: "Success",
//         description: "Document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("❌ Failed to delete document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setDeletingDocuments((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(documentId)
//         return newSet
//       })
//     }
//   }

//   const handleRemoveQueuedDocument = (e: React.MouseEvent, stationId: string, documentIndex: number) => {
//     e.preventDefault()
//     e.stopPropagation()

//     if (!confirm("Are you sure you want to remove this queued document?")) {
//       return
//     }

//     try {
//       onStationDocumentRemove(stationId, documentIndex)
//       toast({
//         title: "Success",
//         description: "Document removed from queue.",
//       })
//     } catch (error) {
//       console.error("Failed to remove queued document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to remove document.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleStationDocumentUpload = async (stationId: string, file: File, description: string) => {
//     setUploadingStationDoc(true)
//     try {
//       if (!file) {
//         throw new Error("No file selected")
//       }

//       const finalDescription = description.trim() || file.name

//       console.log("📤 Station document upload request:", {
//         stationId,
//         fileName: file.name,
//         description: finalDescription,
//         mpiId: mpiId || "NOT_CREATED_YET",
//         fileSize: file.size,
//       })

//       if (!mpiId) {
//         console.log("💾 QUEUING station document locally - MPI not created yet...")
//         if (file.size > 10 * 1024 * 1024) {
//           throw new Error("File size exceeds 10MB limit")
//         }

//         await onStationDocumentUpload(stationId, file, finalDescription)
//         toast({
//           title: "✅ Document Queued Successfully",
//           description: `"${finalDescription}" will be uploaded and linked to the MPI when it's created.`,
//         })
//       } else {
//         console.log("📤 Uploading station document directly to existing MPI...")
//         const formData = new FormData()
//         formData.append("files", file)
//         formData.append("stationId", stationId)
//         formData.append("description", finalDescription)
//         formData.append("mpiId", mpiId)
//         formData.append("originalName", file.name)

//         console.log("📤 Sending direct upload request to:", `${API_BASE_URL}/station-mpi-documents/upload`)

//         const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
//           method: "POST",
//           body: formData,
//         })

//         console.log("📥 Direct upload response status:", response.status)

//         if (!response.ok) {
//           const errorText = await response.text()
//           console.error("❌ Direct upload failed:", errorText)
//           throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
//         }

//         const result = await response.json()
//         console.log("✅ Station document uploaded and linked successfully:", result)

//         const document = Array.isArray(result) ? result[0] : result

//         if (document.mpiId !== mpiId) {
//           console.warn("⚠️ Document MPI ID mismatch:", {
//             expected: mpiId,
//             actual: document.mpiId,
//           })
//         }

//         toast({
//           title: "Success",
//           description: "Station document uploaded and linked to MPI successfully.",
//         })

//         await loadExistingStationDocuments(stationId)
//       }

//       setStationDocumentFiles((prev) => ({
//         ...prev,
//         [stationId]: { file: null, description: "" },
//       }))
//     } catch (error) {
//       console.error("❌ Station document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingStationDoc(false)
//     }
//   }

//   // Memoize the documents getter to prevent unnecessary recalculations
//   const getStationDocuments = useCallback(
//     (stationId: string) => {
//       const queuedDocuments = safeStationDocuments?.[stationId] || []
//       const existingDocs = existingStationDocuments[stationId] || []

//       console.log(`📄 Getting documents for station ${stationId}:`, {
//         queued: queuedDocuments.length,
//         existing: existingDocs.length,
//         queuedDocs: queuedDocuments,
//         existingDocs: existingDocs,
//       })

//       return {
//         queued: queuedDocuments,
//         existing: existingDocs,
//         all: [
//           ...existingDocs.map((doc) => ({
//             ...doc,
//             isUploaded: true,
//             isExisting: true,
//           })),
//           ...queuedDocuments,
//         ],
//       }
//     },
//     [safeStationDocuments, existingStationDocuments],
//   )

//   // Memoize the active station to prevent unnecessary re-renders
//   const activeStation = useMemo(() => {
//     return availableStations.find((s) => s.id === activeStationId)
//   }, [availableStations, activeStationId])

//   return (
//     <div className="space-y-6 mt-6">
//       <Card>
//         <CardContent className="space-y-6 mt-5">
//           {loadingStations ? (
//             <div className="flex items-center justify-center py-8">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
//                 <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
//               </div>
//             </div>
//           ) : availableStations.length === 0 ? (
//             <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//               <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
//             </div>
//           ) : (
//             <div className="flex gap-6 min-h-[600px]">
//               {/* Left Sidebar - Station List */}
//               <div className="w-1/4 border rounded-lg bg-gray-50">
//                 <div className="p-3 border-b bg-white rounded-t-lg">
//                   <h4 className="font-medium text-base">Stations</h4>
//                   <p className="text-xs text-muted-foreground">
//                     {selectedStationIds.length > 0
//                       ? `${selectedStationIds.length} selected`
//                       : "Click to select multiple"}
//                   </p>
//                 </div>
//                 <div className="p-2 overflow-y-auto h-[530px]">
//                   <div className="space-y-1">
//                     {availableStations.map((station) => {
//                       const stationDocs = getStationDocuments(station.id)
//                       return (
//                         <div
//                           key={station.id}
//                           className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
//                             selectedStationIds.includes(station.id)
//                               ? "bg-blue-100 text-blue-900 border-blue-300"
//                               : "bg-white hover:bg-gray-100 border-transparent"
//                           } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
//                           onClick={() => handleStationClick(station.id)}
//                         >
//                           <div className="flex items-center justify-between">
//                             <span>{station.stationName}</span>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>
//               </div>

//               {/* Right Panel - Station Specifications and Documents */}
//               <div className="flex-1 border rounded-lg bg-white">
//                 {activeStationId && activeStation ? (
//                   <div className="h-full flex flex-col">
//                     <div className="p-4 border-b bg-white rounded-t-lg">
//                       <div className="flex items-center justify-between">
//                         <h4 className="font-medium text-lg">{activeStation.stationName} Station</h4>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "specifications" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("specifications")}
//                           >
//                             Specifications
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "documents" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("documents")}
//                           >
//                             <FileText className="w-4 h-4 mr-1" />
//                             Files
//                             {(() => {
//                               const activeStationDocs = getStationDocuments(activeStationId)
//                               const docCount = activeStationDocs.all.length
//                               return docCount > 0 ? (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {docCount}
//                                 </Badge>
//                               ) : null
//                             })()}
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "notes" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("notes")}
//                           >
//                             <FileText className="w-4 h-4 mr-1" />
//                             Notes
//                             {(() => {
//                               const noteCount = activeStation?.Note?.length || 0
//                               return noteCount > 0 ? (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {noteCount}
//                                 </Badge>
//                               ) : null
//                             })()}
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-4">
//                       {stationViewMode === "notes" && (
//                         <div className="space-y-6">
//                           {/* Add Note Section */}
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                             <div className="space-y-4">
//                               <div className="text-center">
//                                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <h4 className="font-medium text-gray-700">Add Station Note</h4>
//                               </div>
//                               <div className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor="station-note-content">Note Content </Label>
//                                   <Textarea
//                                     id="station-note-content"
//                                     placeholder="Enter note content (e.g., Safety procedures, operational instructions, maintenance notes)"
//                                     rows={4}
//                                     disabled={addingNote}
//                                   />
//                                 </div>
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   disabled={addingNote}
//                                   onClick={async () => {
//                                     const contentInput = document.getElementById(
//                                       "station-note-content",
//                                     ) as HTMLTextAreaElement
//                                     const content = contentInput?.value?.trim() || ""
//                                     if (!content) {
//                                       toast({
//                                         title: "Missing Content",
//                                         description: "Please enter note content.",
//                                         variant: "destructive",
//                                       })
//                                       return
//                                     }
//                                     await handleAddStationNote(activeStation.id, content)
//                                     contentInput.value = ""
//                                   }}
//                                   className="w-full bg-transparent"
//                                 >
//                                   {addingNote ? (
//                                     <div className="flex items-center gap-2">
//                                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                       Adding Note...
//                                     </div>
//                                   ) : (
//                                     <>
//                                       <Plus className="w-4 h-4 mr-2" />
//                                       Add Note
//                                     </>
//                                   )}
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Existing Notes */}
//                           <div>
//                             <h4 className="font-medium text-gray-700 mb-4">Station Notes</h4>
//                             {loadingNotes ? (
//                               <div className="flex items-center justify-center py-8">
//                                 <div className="text-center">
//                                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
//                                   <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
//                                 </div>
//                               </div>
//                             ) : (stationNotes[activeStationId] || []).length === 0 ? (
//                               <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                                 <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                 <p className="text-muted-foreground">No notes available for this station.</p>
//                                 <p className="text-sm text-gray-400 mt-1">
//                                   Add operational notes, safety instructions, or maintenance reminders above.
//                                 </p>
//                               </div>
//                             ) : (
//                               <div className="space-y-4">
//                                 {(stationNotes[activeStationId] || []).map((note, index) => (
//                                   <div key={note.id || index} className="p-4 bg-white border rounded-lg shadow-sm">
//                                     <div className="flex items-start justify-between">
//                                       <div className="flex-1 min-w-0">
//                                         <div className="prose prose-sm max-w-none">
//                                           <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
//                                         </div>
//                                         <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
//                                           <span>
//                                             Created:{" "}
//                                             {note.createdAt
//                                               ? new Date(note.createdAt).toLocaleDateString()
//                                               : "Unknown date"}
//                                           </span>
//                                           {note.updatedAt && note.updatedAt !== note.createdAt && (
//                                             <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
//                                           )}
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-2 ml-4">
//                                         <Button
//                                           size="sm"
//                                           variant="outline"
//                                           onClick={(e) => {
//                                             e.preventDefault()
//                                             e.stopPropagation()
//                                             handleDeleteStationNote(activeStation.id, note.id)
//                                           }}
//                                           className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
//                                         >
//                                           <X className="w-3 h-3 mr-1" />
//                                           Delete
//                                         </Button>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {stationViewMode === "documents" && (
//                         <div className="space-y-6">
//                           {/* Document Upload Section */}
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                             <div className="space-y-4">
//                               <div className="text-center">
//                                 <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <h4 className="font-medium text-gray-700">Upload Files</h4>
//                               </div>
//                               <div className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor={`station-doc-file-${activeStationId}`}>Select Files *</Label>
//                                   <Input
//                                     id={`station-doc-file-${activeStationId}`}
//                                     type="file"
//                                     accept="*/*"
//                                     className="cursor-pointer"
//                                     disabled={uploadingStationDoc}
//                                     onChange={(e) => {
//                                       const file = e.target.files?.[0] || null
//                                       handleStationDocumentFileChange(activeStationId, file)
//                                     }}
//                                   />
//                                   {stationDocumentFiles[activeStationId]?.file && (
//                                     <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
//                                       <FileText className="w-4 h-4 text-green-600" />
//                                       <span className="text-sm text-green-800">
//                                         Selected: {stationDocumentFiles[activeStationId].file.name} (
//                                         {(stationDocumentFiles[activeStationId].file.size / 1024 / 1024).toFixed(2)} MB)
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="space-y-2">
//                                   <Label htmlFor={`station-doc-description-${activeStationId}`}>
//                                     Description (Optional)
//                                   </Label>
//                                   <Input
//                                     id={`station-doc-description-${activeStationId}`}
//                                     placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                                     disabled={uploadingStationDoc}
//                                     value={stationDocumentFiles[activeStationId]?.description || ""}
//                                     onChange={(e) => {
//                                       handleStationDocumentDescriptionChange(activeStationId, e.target.value)
//                                     }}
//                                   />
//                                 </div>
//                               </div>
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 disabled={uploadingStationDoc || !stationDocumentFiles[activeStationId]?.file}
//                                 onClick={async (e) => {
//                                   e.preventDefault()
//                                   e.stopPropagation()
//                                   const file = stationDocumentFiles[activeStationId]?.file
//                                   const description = stationDocumentFiles[activeStationId]?.description || ""
//                                   if (!file) {
//                                     toast({
//                                       title: "Missing File",
//                                       description: "Please select a file to upload.",
//                                       variant: "destructive",
//                                     })
//                                     return
//                                   }
//                                   await handleStationDocumentUpload(activeStation.id, file, description)
//                                 }}
//                                 className="w-full bg-transparent"
//                               >
//                                 {uploadingStationDoc ? (
//                                   <div className="flex items-center gap-2">
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                     {mpiId ? "Uploading Document..." : "Queuing Document..."}
//                                   </div>
//                                 ) : (
//                                   <>
//                                     <Upload className="w-4 h-4 mr-2" />
//                                     {mpiId ? "Upload Document" : "Upload"}
//                                   </>
//                                 )}
//                               </Button>
//                             </div>
//                           </div>

//                           {/* Document Summary and List */}
//                           {(() => {
//                             const stationDocs = getStationDocuments(activeStationId)
//                             const { queued: queuedDocuments, existing: existingDocs, all: allDocuments } = stationDocs
//                             return (
//                               <>
//                                 {allDocuments.length > 0 && (
//                                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//                                     <div className="flex items-center gap-2 mb-2">
//                                       <FileText className="w-5 h-5 text-blue-600" />
//                                       <h5 className="font-medium text-blue-900">
//                                         Files Summary for {activeStation.stationName}
//                                       </h5>
//                                     </div>
//                                     <div className="grid grid-cols-3 gap-4 text-sm">
//                                       <div>
//                                         <span className="text-blue-700">Total Files:</span>
//                                         <span className="font-medium ml-2">{allDocuments.length}</span>
//                                       </div>
//                                       <div>
//                                         <span className="text-blue-700">Uploaded:</span>
//                                         <span className="font-medium ml-2">{existingDocs.length}</span>
//                                       </div>
//                                       <div>
//                                         <span className="text-blue-700">Queued:</span>
//                                         <span className="font-medium ml-2">{queuedDocuments.length}</span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}
//                                 <div>
//                                   <h4 className="font-medium text-gray-700 mb-4">
//                                     {activeStation.stationName} Station Files
//                                   </h4>
//                                   {loadingDocuments[activeStationId] ? (
//                                     <div className="flex items-center justify-center py-8">
//                                       <div className="text-center">
//                                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
//                                         <p className="mt-2 text-sm text-muted-foreground">Loading files...</p>
//                                       </div>
//                                     </div>
//                                   ) : allDocuments.length === 0 ? (
//                                     <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                                       <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                       <p className="text-muted-foreground">No files available.</p>
//                                     </div>
//                                   ) : (
//                                     <div className="space-y-3">
//                                       {allDocuments.map((doc, index) => (
//                                         <div
//                                           key={doc.id || `queued-${index}`}
//                                           className="p-4 bg-white border rounded-lg shadow-sm"
//                                         >
//                                           <div className="flex items-start justify-between">
//                                             <div className="flex items-start gap-3 flex-1">
//                                               <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                                               <div className="flex-1 min-w-0">
//                                                 <h6 className="font-medium text-sm text-gray-900 truncate">
//                                                   {doc.description && doc.description !== doc.fileName
//                                                     ? doc.description
//                                                     : doc.fileName || doc.originalName || "Untitled Document"}
//                                                 </h6>
//                                                 <div className="mt-1 space-y-1">
//                                                   <p className="text-xs text-gray-600">
//                                                     <span className="font-medium">Filename:</span>{" "}
//                                                     {doc.fileName || doc.originalName || "Unknown"}
//                                                   </p>
//                                                   {doc.description && doc.description !== doc.fileName && (
//                                                     <p className="text-xs text-gray-500">
//                                                       <span className="font-medium">Description:</span>{" "}
//                                                       {doc.description}
//                                                     </p>
//                                                   )}
//                                                 </div>
//                                               </div>
//                                             </div>
//                                             <div className="flex items-center gap-2 ml-4">
//                                               {doc.fileUrl && (
//                                                 <Button
//                                                   size="sm"
//                                                   variant="outline"
//                                                   onClick={(e) => {
//                                                     e.preventDefault()
//                                                     e.stopPropagation()
//                                                     window.open(doc.fileUrl, "_blank")
//                                                   }}
//                                                   className="h-8 px-3"
//                                                 >
//                                                   <Eye className="w-3 h-3 mr-1" />
//                                                   View
//                                                 </Button>
//                                               )}
//                                               <Button
//                                                 size="sm"
//                                                 variant="outline"
//                                                 disabled={doc.isExisting && deletingDocuments.has(doc.id)}
//                                                 onClick={(e) => {
//                                                   if (doc.isExisting) {
//                                                     handleDeleteExistingDocument(e, doc.id, activeStation.id)
//                                                   } else {
//                                                     const queuedIndex = queuedDocuments.findIndex(
//                                                       (qDoc) => qDoc === doc,
//                                                     )
//                                                     if (queuedIndex !== -1) {
//                                                       handleRemoveQueuedDocument(e, activeStation.id, queuedIndex)
//                                                     }
//                                                   }
//                                                 }}
//                                                 className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
//                                               >
//                                                 {doc.isExisting && deletingDocuments.has(doc.id) ? (
//                                                   <div className="flex items-center gap-1">
//                                                     <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
//                                                     <span className="text-xs">Deleting...</span>
//                                                   </div>
//                                                 ) : (
//                                                   <>
//                                                     <X className="w-3 h-3 mr-1" />
//                                                     {doc.isExisting ? "Delete" : "Remove"}
//                                                   </>
//                                                 )}
//                                               </Button>
//                                             </div>
//                                           </div>
//                                         </div>
//                                       ))}
//                                     </div>
//                                   )}
//                                 </div>
//                               </>
//                             )
//                           })()}
//                         </div>
//                       )}

//                       {stationViewMode === "specifications" && (
//                         <div>
//                           {activeStation.specifications && activeStation.specifications.length > 0 ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               {activeStation.specifications.map((spec) => (
//                                 <div key={spec.id} className="space-y-3 p-3 bg-gray-50 rounded border">
//                                   {renderSpecificationInputField(spec, activeStation.id)}
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <div className="text-center py-6 bg-gray-50 rounded border-2 border-dashed">
//                               <p className="text-sm text-muted-foreground">
//                                 No specifications available for this station.
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <div className="text-center">
//                       <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                       <h4 className="font-medium text-gray-600 mb-2">No Station Active</h4>
//                       <p className="text-sm text-muted-foreground">
//                         Click on a station from the left sidebar to view its specifications and documents
//                         {selectedStationIds.length > 0 && (
//                           <span className="block mt-2 text-blue-600 font-medium">
//                             {selectedStationIds.length} station{selectedStationIds.length > 1 ? "s" : ""} selected for
//                             MPI
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Instructions Section */}
//           <div className="mt-8 border-t pt-6">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h4 className="text-lg font-semibold text-green-800">General Instructions</h4>
//                 <p className="text-sm text-muted-foreground">
//                   Add general safety and operational instructions for this MPI
//                 </p>
//               </div>
//               <Button
//                 type="button"
//                 size="sm"
//                 variant="outline"
//                 onClick={() => {
//                   onAddInstruction()
//                   // Focus the new instruction input after it's added
//                   setTimeout(() => {
//                     setFocusedInstructionIndex(instructions.length)
//                   }, 0)
//                 }}
//                 className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Instruction
//               </Button>
//             </div>
//             {instructions.length === 0 ? (
//               <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                 <p className="text-sm text-muted-foreground">No instructions added yet</p>
//                 <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {instructions.map((instruction, index) => (
//                   <div key={`instruction-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
//                     <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
//                       {index + 1}
//                     </div>
//                     <div className="flex-1">
//                       <Input
//                         ref={(el) => {
//                           instructionRefs.current[index] = el
//                         }}
//                         value={instruction}
//                         onChange={(e) => {
//                           setFocusedInstructionIndex(index)
//                           onInstructionChange(index, e.target.value)
//                         }}
//                         onFocus={() => setFocusedInstructionIndex(index)}
//                         onBlur={() => setFocusedInstructionIndex(null)}
//                         placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
//                         className="w-full"
//                       />
//                     </div>
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="ghost"
//                       onClick={(e) => {
//                         e.preventDefault()
//                         e.stopPropagation()
//                         onRemoveInstruction(index)
//                         // Clear focus tracking when removing instruction
//                         setFocusedInstructionIndex(null)
//                       }}
//                       className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-shrink-0"
//                     >
//                       <X className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default InstructionsTab





// "use client"
// import type React from "react"
// import { useState, useEffect, useCallback, useMemo, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { FileText, Plus, X, Upload, Factory, Eye } from "lucide-react"
// import type { Station } from "../stations/types"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"
// import { useToast } from "@/hooks/use-toast"
// import { Textarea } from "@/components/ui/textarea"
// import { API_BASE_URL } from "@/lib/constants"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   fileUrl?: string
//   unit?: string
// }

// interface StationDocument {
//   id?: string
//   file?: File
//   fileUrl?: string
//   description: string
//   fileName: string
//   stationId: string
//   isUploaded?: boolean
// }

// interface InstructionsTabProps {
//   availableStations: Station[]
//   selectedStationIds: string[]
//   loadingStations: boolean
//   activeStationId: string | null
//   stationViewMode: "specifications" | "documents" | "notes"
//   specificationValues: Record<string, SpecificationValue>
//   uploadingFiles: Set<string>
//   mpiId?: string
//   onStationSelectionChange: (stationIds: string[]) => void
//   onActiveStationChange: (stationId: string | null) => void
//   onStationViewModeChange: (mode: "specifications" | "documents" | "notes") => void
//   onSpecificationValueChange: (specificationId: string, value: string, unit?: string) => void
//   onFileUpload: (specificationId: string, file: File, stationId: string, unit?: string) => Promise<void>
//   renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
//   renderStationDocuments: (station: Station) => React.ReactNode
//   instructions: string[]
//   onAddInstruction: () => void
//   onInstructionChange: (index: number, value: string) => void
//   onRemoveInstruction: (index: number) => void
//   stationDocuments: Record<string, StationDocument[]>
//   onStationDocumentUpload: (stationId: string, file: File, description: string) => Promise<void>
//   onStationDocumentRemove: (stationId: string, documentIndex: number) => void
// }

// const InstructionsTab: React.FC<InstructionsTabProps> = ({
//   availableStations,
//   selectedStationIds,
//   loadingStations,
//   activeStationId,
//   stationViewMode,
//   specificationValues,
//   uploadingFiles,
//   mpiId,
//   onStationSelectionChange,
//   onActiveStationChange,
//   onStationViewModeChange,
//   onSpecificationValueChange,
//   onFileUpload,
//   renderSpecificationInput,
//   renderStationDocuments,
//   instructions,
//   onAddInstruction,
//   onInstructionChange,
//   onRemoveInstruction,
//   stationDocuments,
//   onStationDocumentUpload,
//   onStationDocumentRemove,
// }) => {
//   const { toast } = useToast()
//   const [uploadingStationDoc, setUploadingStationDoc] = useState(false)
//   const [stationNotes, setStationNotes] = useState<Record<string, any[]>>({})
//   const [loadingNotes, setLoadingNotes] = useState(false)
//   const [addingNote, setAddingNote] = useState(false)
//   const [loadingDocuments, setLoadingDocuments] = useState<Record<string, boolean>>({})
//   const [existingStationDocuments, setExistingStationDocuments] = useState<Record<string, any[]>>({})
//   const [deletingDocuments, setDeletingDocuments] = useState<Set<string>>(new Set())
//   const [stationDocumentFiles, setStationDocumentFiles] = useState<
//     Record<string, { file: File | null; description: string }>
//   >({})

//   // Add focus management for instruction inputs
//   const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
//   const instructionRefs = useRef<(HTMLInputElement | null)[]>([])
//   const [focusedSpecificationId, setFocusedSpecificationId] = useState<string | null>(null)
//   const specificationRefs = useRef<Record<string, HTMLInputElement | null>>({})

//   const safeStationDocuments = stationDocuments || {}

//   // Memoize the specification input renderer to prevent recreation on every render
//   const renderSpecificationInputField = useCallback(
//     (spec: any, stationId: string) => {
//       const specValue = specificationValues[spec.id] || { value: "", unit: spec.unit || "" }
//       const isUploading = uploadingFiles.has(spec.id)
//       const inputType = spec.inputType || spec.type || "TEXT"

//       console.log(`🔍 InstructionsTab - Rendering specification input:`, {
//         specId: spec.id,
//         specName: spec.name,
//         inputType: inputType,
//         specValue: specValue,
//         originalSpec: spec,
//       })

//       const handleInputChange = (value: string) => {
//         console.log(`🔧 Specification ${spec.id} value changed to:`, value)
//         onSpecificationValueChange(spec.id, value, specValue.unit)
//       }

//       const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0]
//         if (file) {
//           try {
//             console.log(`📁 File selected for spec ${spec.id}:`, file.name)
//             await onFileUpload(spec.id, file, stationId, specValue.unit)
//           } catch (error) {
//             console.error("File upload failed:", error)
//           }
//         }
//       }

//       const handleUnitChange = (unitValue: string) => {
//         console.log(`🔧 Specification ${spec.id} unit changed to:`, unitValue)
//         onSpecificationValueChange(spec.id, specValue.value || "", unitValue)
//       }

//       const handleCheckboxChange = (checked: boolean) => {
//         const value = checked ? "true" : "false"
//         console.log(`☑️ Specification ${spec.id} checkbox changed to:`, value)
//         handleInputChange(value)
//       }

//       switch (inputType) {
//         case "TEXT":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Input
//                 ref={(el) => {
//                   specificationRefs.current[spec.id] = el
//                 }}
//                 id={`spec-${spec.id}`}
//                 value={specValue.value}
//                 onChange={(e) => {
//                   setFocusedSpecificationId(spec.id)
//                   handleInputChange(e.target.value)
//                 }}
//                 onFocus={() => setFocusedSpecificationId(spec.id)}
//                 onBlur={() => setFocusedSpecificationId(null)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10"
//               />
//             </div>
//           )
//         case "number":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="flex gap-2">
//                 <Input
//                   ref={(el) => {
//                     specificationRefs.current[spec.id] = el
//                   }}
//                   id={`spec-${spec.id}`}
//                   type="number"
//                   value={specValue.value}
//                   onChange={(e) => {
//                     setFocusedSpecificationId(spec.id)
//                     handleInputChange(e.target.value)
//                   }}
//                   onFocus={() => setFocusedSpecificationId(spec.id)}
//                   onBlur={() => setFocusedSpecificationId(null)}
//                   placeholder={`Enter ${spec.name.toLowerCase()}`}
//                   className="h-10 flex-1"
//                 />
//                 <Input
//                   placeholder="Unit"
//                   value={specValue.unit || ""}
//                   onChange={(e) => handleUnitChange(e.target.value)}
//                   className="h-10 w-20"
//                 />
//               </div>
//             </div>
//           )
//         case "CHECKBOX":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`spec-${spec.id}`}
//                   checked={specValue.value === "true"}
//                   onCheckedChange={handleCheckboxChange}
//                 />
//                 <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                   {spec.name}
//                   {spec.required && <span className="text-green-500 ml-1">*</span>}
//                 </Label>
//               </div>
//             </div>
//           )
//         case "DROPDOWN":
//           const suggestions = spec.suggestions || []
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Select value={specValue.value} onValueChange={handleInputChange}>
//                 <SelectTrigger id={`spec-${spec.id}`} className="h-10">
//                   <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {suggestions.map((suggestion: string, index: number) => (
//                     <SelectItem key={index} value={suggestion}>
//                       {suggestion}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )
//         case "FILE_UPLOAD":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <Input
//                     id={`spec-${spec.id}`}
//                     type="file"
//                     onChange={handleFileChange}
//                     accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
//                     className="cursor-pointer flex-1"
//                     disabled={isUploading}
//                   />
//                   {isUploading && (
//                     <div className="flex items-center gap-2">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
//                       <span className="text-xs text-muted-foreground">Uploading...</span>
//                     </div>
//                   )}
//                 </div>
//                 <Input
//                   placeholder="Unit (optional)"
//                   value={specValue.unit || ""}
//                   onChange={(e) => handleUnitChange(e.target.value)}
//                   className="h-10 w-32"
//                 />
//                 {specValue.fileUrl && (
//                   <div className="flex items-center gap-2">
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="outline"
//                       onClick={() => window.open(specValue.fileUrl, "_blank")}
//                     >
//                       <Eye className="w-3 h-3 mr-1" />
//                       View File
//                     </Button>
//                   </div>
//                 )}
//                 <p className="text-xs text-muted-foreground">
//                   Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
//                 </p>
//               </div>
//             </div>
//           )
//         default:
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Input
//                 id={`spec-${spec.id}`}
//                 value={specValue.value}
//                 onChange={(e) => handleInputChange(e.target.value)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10"
//               />
//             </div>
//           )
//       }
//     },
//     [specificationValues, uploadingFiles, onSpecificationValueChange, onFileUpload],
//   )

//   // Memoize event handlers to prevent unnecessary re-renders
//   const handleStationClick = useCallback(
//     (stationId: string) => {
//       onActiveStationChange(stationId)
//       if (selectedStationIds.includes(stationId)) {
//         onStationSelectionChange(selectedStationIds.filter((id) => id !== stationId))
//       } else {
//         onStationSelectionChange([...selectedStationIds, stationId])
//       }
//     },
//     [selectedStationIds, onActiveStationChange, onStationSelectionChange],
//   )

//   const handleStationDocumentFileChange = useCallback((stationId: string, file: File | null) => {
//     setStationDocumentFiles((prev) => ({
//       ...prev,
//       [stationId]: {
//         ...prev[stationId],
//         file: file,
//       },
//     }))
//   }, [])

//   const handleStationDocumentDescriptionChange = useCallback((stationId: string, description: string) => {
//     setStationDocumentFiles((prev) => ({
//       ...prev,
//       [stationId]: {
//         ...prev[stationId],
//         description: description,
//       },
//     }))
//   }, [])

//   // Auto-select first station when editing existing MPI
//   useEffect(() => {
//     if (selectedStationIds.length > 0 && !activeStationId) {
//       const firstStationId = selectedStationIds[0]
//       onActiveStationChange(firstStationId)
//       if (stationViewMode !== "specifications") {
//         onStationViewModeChange("specifications")
//       }
//     }
//   }, [selectedStationIds, activeStationId, onActiveStationChange, stationViewMode, onStationViewModeChange])

//   // Load station notes when active station changes
//   useEffect(() => {
//     if (activeStationId) {
//       loadStationNotes(activeStationId)
//     }
//   }, [activeStationId])

//   // Load existing station documents only for the active station and only when documents tab is active
//   useEffect(() => {
//     if (activeStationId && stationViewMode === "documents") {
//       if (!existingStationDocuments[activeStationId]) {
//         loadExistingStationDocuments(activeStationId)
//       }
//     }
//   }, [activeStationId, stationViewMode])

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

//   // Restore focus to specification input after re-render
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

//   // Initialize station notes and documents from available stations
//   useEffect(() => {
//     console.log("🔄 Initializing station notes and documents from available stations")
//     const initialNotes: Record<string, any[]> = {}
//     const initialDocs: Record<string, any[]> = {}
//     availableStations.forEach((station) => {
//       console.log(`📍 Processing station: ${station.stationName} (${station.id})`)
//       let stationNotesArray: any[] = []
//       if (station.Note && Array.isArray(station.Note)) {
//         stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
//           (note, index) => ({
//             id: `note-${station.id}-${index}-${Date.now()}`,
//             content: note,
//             createdAt: new Date().toISOString(),
//             stationId: station.id,
//           }),
//         )
//       } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
//         stationNotesArray = [
//           {
//             id: `note-${station.id}-0-${Date.now()}`,
//             content: station.Note.trim(),
//             createdAt: new Date().toISOString(),
//             stationId: station.id,
//           },
//         ]
//       }
//       initialNotes[station.id] = stationNotesArray

//       let stationDocsArray: any[] = []
//       if (station.documentations && Array.isArray(station.documentations)) {
//         stationDocsArray = station.documentations.filter((doc) => doc && doc.fileUrl)
//       } else if (station.documents && Array.isArray(station.documents)) {
//         stationDocsArray = station.documents.filter((doc) => doc && doc.fileUrl)
//       } else if (station.stationDocuments && Array.isArray(station.stationDocuments)) {
//         stationDocsArray = station.stationDocuments.filter((doc) => doc && doc.fileUrl)
//       }
//       initialDocs[station.id] = stationDocsArray

//       console.log(
//         `✅ Initialized station ${station.id}: ${stationNotesArray.length} notes, ${stationDocsArray.length} docs`,
//       )
//     })

//     setStationNotes(initialNotes)
//     setExistingStationDocuments(initialDocs)
//     console.log("🎯 Station initialization complete:", { initialNotes, initialDocs })
//   }, [availableStations])

//   const loadExistingStationDocuments = async (stationId: string) => {
//     if (loadingDocuments[stationId]) {
//       return
//     }
//     try {
//       setLoadingDocuments((prev) => ({ ...prev, [stationId]: true }))
//       console.log("🔍 Loading existing station documents for station:", stationId)
//       const documents = await StationMpiDocAPI.findAll({ stationId })
//       console.log("📄 Existing station documents loaded for station", stationId, ":", documents)
//       setExistingStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: documents || [],
//       }))
//     } catch (error) {
//       console.error("❌ Failed to load existing station documents for station", stationId, ":", error)
//       toast({
//         title: "Error",
//         description: `Failed to load existing station documents for ${availableStations.find((s) => s.id === stationId)?.stationName || "station"}.`,
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingDocuments((prev) => ({ ...prev, [stationId]: false }))
//     }
//   }

//   const loadStationNotes = async (stationId: string) => {
//     try {
//       setLoadingNotes(true)
//       const station = availableStations.find((s) => s.id === stationId)
//       console.log(`📝 Loading notes for station: ${station?.stationName} (${stationId})`)
//       if (station) {
//         let stationNotesArray: any[] = []
//         if (station.Note && Array.isArray(station.Note)) {
//           stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
//             (note, index) => ({
//               id: `note-${stationId}-${index}-${Date.now()}`,
//               content: note,
//               createdAt: new Date().toISOString(),
//               stationId: stationId,
//             }),
//           )
//           console.log(`📝 Found Note array for station ${stationId}:`, stationNotesArray)
//         } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
//           stationNotesArray = [
//             {
//               id: `note-${stationId}-0-${Date.now()}`,
//               content: station.Note.trim(),
//               createdAt: new Date().toISOString(),
//               stationId: stationId,
//             },
//           ]
//           console.log(`📝 Found single Note for station ${stationId}:`, stationNotesArray)
//         } else if (station.notes && Array.isArray(station.notes)) {
//           stationNotesArray = station.notes
//             .filter((note) => note && (typeof note === "string" || note.content))
//             .map((note, index) => ({
//               id: note.id || `note-${stationId}-${index}-${Date.now()}`,
//               content: typeof note === "string" ? note : note.content,
//               createdAt: note.createdAt || new Date().toISOString(),
//               stationId: stationId,
//             }))
//           console.log(`📝 Found notes array for station ${stationId}:`, stationNotesArray)
//         }

//         setStationNotes((prev) => ({
//           ...prev,
//           [stationId]: stationNotesArray,
//         }))
//         console.log(`✅ Loaded ${stationNotesArray.length} notes for station ${stationId}`)
//       } else {
//         console.log(`⚠️ Station not found: ${stationId}`)
//         setStationNotes((prev) => ({
//           ...prev,
//           [stationId]: [],
//         }))
//       }
//     } catch (error) {
//       console.error("Failed to load station notes:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load station notes.",
//         variant: "destructive",
//       })
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: [],
//       }))
//     } finally {
//       setLoadingNotes(false)
//     }
//   }

//   const handleAddStationNote = async (stationId: string, content: string) => {
//     if (!content.trim()) {
//       toast({
//         title: "Invalid Note",
//         description: "Note content cannot be empty.",
//         variant: "destructive",
//       })
//       return
//     }

//     setAddingNote(true)
//     try {
//       const newNote = {
//         id: `note-${Date.now()}`,
//         content: content.trim(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         stationId: stationId,
//       }

//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: [...(prev[stationId] || []), newNote],
//       }))

//       toast({
//         title: "Success",
//         description: "Station note added successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to add station note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add station note.",
//         variant: "destructive",
//       })
//     } finally {
//       setAddingNote(false)
//     }
//   }

//   const handleDeleteStationNote = async (stationId: string, noteId: string) => {
//     try {
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: (prev[stationId] || []).filter((note) => note.id !== noteId),
//       }))

//       toast({
//         title: "Success",
//         description: "Station note deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete station note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete station note.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDeleteExistingDocument = async (e: React.MouseEvent, documentId: string, stationId: string) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
//       return
//     }

//     setDeletingDocuments((prev) => new Set(prev).add(documentId))
//     try {
//       console.log("🗑️ Deleting existing station document:", documentId)
//       await StationMpiDocAPI.delete(documentId)
//       console.log("✅ Document deleted successfully")

//       setExistingStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: (prev[stationId] || []).filter((doc) => doc.id !== documentId),
//       }))

//       toast({
//         title: "Success",
//         description: "Document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("❌ Failed to delete document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setDeletingDocuments((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(documentId)
//         return newSet
//       })
//     }
//   }

//   const handleRemoveQueuedDocument = (e: React.MouseEvent, stationId: string, documentIndex: number) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (!confirm("Are you sure you want to remove this queued document?")) {
//       return
//     }

//     try {
//       onStationDocumentRemove(stationId, documentIndex)
//       toast({
//         title: "Success",
//         description: "Document removed from queue.",
//       })
//     } catch (error) {
//       console.error("Failed to remove queued document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to remove document.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleStationDocumentUpload = async (stationId: string, file: File, description: string) => {
//     setUploadingStationDoc(true)
//     try {
//       if (!file) {
//         throw new Error("No file selected")
//       }

//       const finalDescription = description.trim() || file.name

//       console.log("📤 Station document upload request:", {
//         stationId,
//         fileName: file.name,
//         description: finalDescription,
//         mpiId: mpiId || "NOT_CREATED_YET",
//         fileSize: file.size,
//       })

//       if (!mpiId) {
//         console.log("💾 QUEUING station document locally - MPI not created yet...")
//         if (file.size > 10 * 1024 * 1024) {
//           throw new Error("File size exceeds 10MB limit")
//         }

//         await onStationDocumentUpload(stationId, file, finalDescription)

//         toast({
//           title: "✅ Document Queued Successfully",
//           description: `"${finalDescription}" will be uploaded and linked to the MPI when it's created.`,
//         })
//       } else {
//         console.log("📤 Uploading station document directly to existing MPI...")
//         const formData = new FormData()
//         formData.append("files", file)
//         formData.append("stationId", stationId)
//         formData.append("description", finalDescription)
//         formData.append("mpiId", mpiId)
//         formData.append("originalName", file.name)

//         console.log("📤 Sending direct upload request to:", `${API_BASE_URL}/station-mpi-documents/upload`)

//         const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
//           method: "POST",
//           body: formData,
//         })

//         console.log("📥 Direct upload response status:", response.status)

//         if (!response.ok) {
//           const errorText = await response.text()
//           console.error("❌ Direct upload failed:", errorText)
//           throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
//         }

//         const result = await response.json()
//         console.log("✅ Station document uploaded and linked successfully:", result)

//         const document = Array.isArray(result) ? result[0] : result
//         if (document.mpiId !== mpiId) {
//           console.warn("⚠️ Document MPI ID mismatch:", {
//             expected: mpiId,
//             actual: document.mpiId,
//           })
//         }

//         toast({
//           title: "Success",
//           description: "Station document uploaded and linked to MPI successfully.",
//         })

//         await loadExistingStationDocuments(stationId)
//       }

//       setStationDocumentFiles((prev) => ({
//         ...prev,
//         [stationId]: { file: null, description: "" },
//       }))
//     } catch (error) {
//       console.error("❌ Station document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingStationDoc(false)
//     }
//   }

//   // Memoize the documents getter to prevent unnecessary recalculations
//   const getStationDocuments = useCallback(
//     (stationId: string) => {
//       const queuedDocuments = safeStationDocuments?.[stationId] || []
//       const existingDocs = existingStationDocuments[stationId] || []
//       console.log(`📄 Getting documents for station ${stationId}:`, {
//         queued: queuedDocuments.length,
//         existing: existingDocs.length,
//         queuedDocs: queuedDocuments,
//         existingDocs: existingDocs,
//       })
//       return {
//         queued: queuedDocuments,
//         existing: existingDocs,
//         all: [
//           ...existingDocs.map((doc) => ({
//             ...doc,
//             isUploaded: true,
//             isExisting: true,
//           })),
//           ...queuedDocuments,
//         ],
//       }
//     },
//     [safeStationDocuments, existingStationDocuments],
//   )

//   // Memoize the active station to prevent unnecessary re-renders
//   const activeStation = useMemo(() => {
//     return availableStations.find((s) => s.id === activeStationId)
//   }, [availableStations, activeStationId])

//   return (
//     <div className="space-y-6 mt-6">
//       <Card>
//         <CardContent className="space-y-6 mt-5">
//           {loadingStations ? (
//             <div className="flex items-center justify-center py-8">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
//                 <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
//               </div>
//             </div>
//           ) : availableStations.length === 0 ? (
//             <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//               <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
//             </div>
//           ) : (
//             <div className="flex gap-6 min-h-[600px]">
//               {/* Left Sidebar - Station List */}
//               <div className="w-1/4 border rounded-lg bg-gray-50">
//                 <div className="p-3 border-b bg-white rounded-t-lg">
//                   <h4 className="font-medium text-base">Stations</h4>
//                   <p className="text-xs text-muted-foreground">
//                     {selectedStationIds.length > 0
//                       ? `${selectedStationIds.length} selected`
//                       : "Click to select multiple"}
//                   </p>
//                 </div>
//                 <div className="p-2 overflow-y-auto h-[530px]">
//                   <div className="space-y-1">
//                     {availableStations.map((station) => {
//                       const stationDocs = getStationDocuments(station.id)
//                       return (
//                         <div
//                           key={station.id}
//                           className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
//                             selectedStationIds.includes(station.id)
//                               ? "bg-blue-100 text-blue-900 border-blue-300"
//                               : "bg-white hover:bg-gray-100 border-transparent"
//                           } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
//                           onClick={() => handleStationClick(station.id)}
//                         >
//                           <div className="flex items-center justify-between">
//                             <span>{station.stationName}</span>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>
//               </div>

//               {/* Right Panel - Station Specifications and Documents */}
//               <div className="flex-1 border rounded-lg bg-white">
//                 {activeStationId && activeStation ? (
//                   <div className="h-full flex flex-col">
//                     <div className="p-4 border-b bg-white rounded-t-lg">
//                       <div className="flex items-center justify-between">
//                         <h4 className="font-medium text-lg">{activeStation.stationName} Station</h4>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "specifications" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("specifications")}
//                           >
//                             Specifications
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "documents" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("documents")}
//                           >
//                             <FileText className="w-4 h-4 mr-1" />
//                             Files
//                             {(() => {
//                               const activeStationDocs = getStationDocuments(activeStationId)
//                               const docCount = activeStationDocs.all.length
//                               return docCount > 0 ? (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {docCount}
//                                 </Badge>
//                               ) : null
//                             })()}
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "notes" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("notes")}
//                           >
//                             <FileText className="w-4 h-4 mr-1" />
//                             Notes
//                             {(() => {
//                               const noteCount = activeStation?.Note?.length || 0
//                               return noteCount > 0 ? (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {noteCount}
//                                 </Badge>
//                               ) : null
//                             })()}
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-4">
//                       {stationViewMode === "notes" && (
//                         <div className="space-y-6">
//                           {/* Add Note Section */}
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                             <div className="space-y-4">
//                               <div className="text-center">
//                                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <h4 className="font-medium text-gray-700">Add Station Note</h4>
//                               </div>
//                               <div className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor="station-note-content">Note Content </Label>
//                                   <Textarea
//                                     id="station-note-content"
//                                     placeholder="Enter note content (e.g., Safety procedures, operational instructions, maintenance notes)"
//                                     rows={4}
//                                     disabled={addingNote}
//                                   />
//                                 </div>
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   disabled={addingNote}
//                                   onClick={async () => {
//                                     const contentInput = document.getElementById(
//                                       "station-note-content",
//                                     ) as HTMLTextAreaElement
//                                     const content = contentInput?.value?.trim() || ""
//                                     if (!content) {
//                                       toast({
//                                         title: "Missing Content",
//                                         description: "Please enter note content.",
//                                         variant: "destructive",
//                                       })
//                                       return
//                                     }
//                                     await handleAddStationNote(activeStation.id, content)
//                                     contentInput.value = ""
//                                   }}
//                                   className="w-full bg-transparent"
//                                 >
//                                   {addingNote ? (
//                                     <div className="flex items-center gap-2">
//                                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                       Adding Note...
//                                     </div>
//                                   ) : (
//                                     <>
//                                       <Plus className="w-4 h-4 mr-2" />
//                                       Add Note
//                                     </>
//                                   )}
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Existing Notes */}
//                           <div>
//                             <h4 className="font-medium text-gray-700 mb-4">Station Notes</h4>
//                             {loadingNotes ? (
//                               <div className="flex items-center justify-center py-8">
//                                 <div className="text-center">
//                                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
//                                   <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
//                                 </div>
//                               </div>
//                             ) : (stationNotes[activeStationId] || []).length === 0 ? (
//                               <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                                 <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                 <p className="text-muted-foreground">No notes available for this station.</p>
//                                 <p className="text-sm text-gray-400 mt-1">
//                                   Add operational notes, safety instructions, or maintenance reminders above.
//                                 </p>
//                               </div>
//                             ) : (
//                               <div className="space-y-4">
//                                 {(stationNotes[activeStationId] || []).map((note, index) => (
//                                   <div key={note.id || index} className="p-4 bg-white border rounded-lg shadow-sm">
//                                     <div className="flex items-start justify-between">
//                                       <div className="flex-1 min-w-0">
//                                         <div className="prose prose-sm max-w-none">
//                                           <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
//                                         </div>
//                                         <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
//                                           <span>
//                                             Created:{" "}
//                                             {note.createdAt
//                                               ? new Date(note.createdAt).toLocaleDateString()
//                                               : "Unknown date"}
//                                           </span>
//                                           {note.updatedAt && note.updatedAt !== note.createdAt && (
//                                             <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
//                                           )}
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-2 ml-4">
//                                         <Button
//                                           size="sm"
//                                           variant="outline"
//                                           onClick={(e) => {
//                                             e.preventDefault()
//                                             e.stopPropagation()
//                                             handleDeleteStationNote(activeStation.id, note.id)
//                                           }}
//                                           className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
//                                         >
//                                           <X className="w-3 h-3 mr-1" />
//                                           Delete
//                                         </Button>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {stationViewMode === "documents" && (
//                         <div className="space-y-6">
//                           {/* Document Upload Section */}
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                             <div className="space-y-4">
//                               <div className="text-center">
//                                 <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <h4 className="font-medium text-gray-700">Upload Files</h4>
//                               </div>
//                               <div className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor={`station-doc-file-${activeStationId}`}>Select Files *</Label>
//                                   <Input
//                                     id={`station-doc-file-${activeStationId}`}
//                                     type="file"
//                                     accept="*/*"
//                                     className="cursor-pointer"
//                                     disabled={uploadingStationDoc}
//                                     onChange={(e) => {
//                                       const file = e.target.files?.[0] || null
//                                       handleStationDocumentFileChange(activeStationId, file)
//                                     }}
//                                   />
//                                   {stationDocumentFiles[activeStationId]?.file && (
//                                     <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
//                                       <FileText className="w-4 h-4 text-green-600" />
//                                       <span className="text-sm text-green-800">
//                                         Selected: {stationDocumentFiles[activeStationId].file.name} (
//                                         {(stationDocumentFiles[activeStationId].file.size / 1024 / 1024).toFixed(2)} MB)
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="space-y-2">
//                                   <Label htmlFor={`station-doc-description-${activeStationId}`}>
//                                     Description (Optional)
//                                   </Label>
//                                   <Input
//                                     id={`station-doc-description-${activeStationId}`}
//                                     placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                                     disabled={uploadingStationDoc}
//                                     value={stationDocumentFiles[activeStationId]?.description || ""}
//                                     onChange={(e) => {
//                                       handleStationDocumentDescriptionChange(activeStationId, e.target.value)
//                                     }}
//                                   />
//                                 </div>
//                               </div>
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 disabled={uploadingStationDoc || !stationDocumentFiles[activeStationId]?.file}
//                                 onClick={async (e) => {
//                                   e.preventDefault()
//                                   e.stopPropagation()
//                                   const file = stationDocumentFiles[activeStationId]?.file
//                                   const description = stationDocumentFiles[activeStationId]?.description || ""
//                                   if (!file) {
//                                     toast({
//                                       title: "Missing File",
//                                       description: "Please select a file to upload.",
//                                       variant: "destructive",
//                                     })
//                                     return
//                                   }
//                                   await handleStationDocumentUpload(activeStation.id, file, description)
//                                 }}
//                                 className="w-full bg-transparent"
//                               >
//                                 {uploadingStationDoc ? (
//                                   <div className="flex items-center gap-2">
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                     {mpiId ? "Uploading Document..." : "Queuing Document..."}
//                                   </div>
//                                 ) : (
//                                   <>
//                                     <Upload className="w-4 h-4 mr-2" />
//                                     {mpiId ? "Upload Document" : "Upload"}
//                                   </>
//                                 )}
//                               </Button>
//                             </div>
//                           </div>

//                           {/* Document Summary and List */}
//                           {(() => {
//                             const stationDocs = getStationDocuments(activeStationId)
//                             const { queued: queuedDocuments, existing: existingDocs, all: allDocuments } = stationDocs
//                             return (
//                               <>
//                                 {allDocuments.length > 0 && (
//                                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//                                     <div className="flex items-center gap-2 mb-2">
//                                       <FileText className="w-5 h-5 text-blue-600" />
//                                       <h5 className="font-medium text-blue-900">
//                                         Files Summary for {activeStation.stationName}
//                                       </h5>
//                                     </div>
//                                     <div className="grid grid-cols-3 gap-4 text-sm">
//                                       <div>
//                                         <span className="text-blue-700">Total Files:</span>
//                                         <span className="font-medium ml-2">{allDocuments.length}</span>
//                                       </div>
//                                       <div>
//                                         <span className="text-blue-700">Uploaded:</span>
//                                         <span className="font-medium ml-2">{existingDocs.length}</span>
//                                       </div>
//                                       <div>
//                                         <span className="text-blue-700">Queued:</span>
//                                         <span className="font-medium ml-2">{queuedDocuments.length}</span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}
//                                 <div>
//                                   <h4 className="font-medium text-gray-700 mb-4">
//                                     {activeStation.stationName} Station Files
//                                   </h4>
//                                   {loadingDocuments[activeStationId] ? (
//                                     <div className="flex items-center justify-center py-8">
//                                       <div className="text-center">
//                                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
//                                         <p className="mt-2 text-sm text-muted-foreground">Loading files...</p>
//                                       </div>
//                                     </div>
//                                   ) : allDocuments.length === 0 ? (
//                                     <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                                       <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                       <p className="text-muted-foreground">No files available.</p>
//                                     </div>
//                                   ) : (
//                                     <div className="space-y-3">
//                                       {allDocuments.map((doc, index) => (
//                                         <div
//                                           key={doc.id || `queued-${index}`}
//                                           className="p-4 bg-white border rounded-lg shadow-sm"
//                                           onClick={(e) => {
//                                             // Prevent any parent click handlers from firing
//                                             e.preventDefault()
//                                             e.stopPropagation()
//                                           }}
//                                         >
//                                           <div className="flex items-start justify-between">
//                                             <div className="flex items-start gap-3 flex-1">
//                                               <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                                               <div className="flex-1 min-w-0">
//                                                 <h6 className="font-medium text-sm text-gray-900 truncate">
//                                                   {doc.description && doc.description !== doc.fileName
//                                                     ? doc.description
//                                                     : doc.fileName || doc.originalName || "Untitled Document"}
//                                                 </h6>
//                                                 <div className="mt-1 space-y-1">
//                                                   <p className="text-xs text-gray-600">
//                                                     <span className="font-medium">Filename:</span>{" "}
//                                                     {doc.fileName || doc.originalName || "Unknown"}
//                                                   </p>
//                                                   {doc.description && doc.description !== doc.fileName && (
//                                                     <p className="text-xs text-gray-500">
//                                                       <span className="font-medium">Description:</span>{" "}
//                                                       {doc.description}
//                                                     </p>
//                                                   )}
//                                                 </div>
//                                               </div>
//                                             </div>
//                                             <div className="flex items-center gap-2 ml-4">
//                                               {doc.fileUrl && (
//                                                 <Button
//                                                   size="sm"
//                                                   variant="outline"
//                                                   onClick={(e) => {
//                                                     e.preventDefault()
//                                                     e.stopPropagation()
//                                                     window.open(doc.fileUrl, "_blank")
//                                                   }}
//                                                   className="h-8 px-3"
//                                                 >
//                                                   <Eye className="w-3 h-3 mr-1" />
//                                                   View
//                                                 </Button>
//                                               )}
//                                               <Button
//                                                 size="sm"
//                                                 variant="outline"
//                                                 disabled={doc.isExisting && deletingDocuments.has(doc.id)}
//                                                 onClick={(e) => {
//                                                   e.preventDefault()
//                                                   e.stopPropagation()
//                                                   if (doc.isExisting) {
//                                                     handleDeleteExistingDocument(e, doc.id, activeStation.id)
//                                                   } else {
//                                                     const queuedIndex = queuedDocuments.findIndex(
//                                                       (qDoc) => qDoc === doc,
//                                                     )
//                                                     if (queuedIndex !== -1) {
//                                                       handleRemoveQueuedDocument(e, activeStation.id, queuedIndex)
//                                                     }
//                                                   }
//                                                 }}
//                                                 className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
//                                               >
//                                                 {doc.isExisting && deletingDocuments.has(doc.id) ? (
//                                                   <div className="flex items-center gap-1">
//                                                     <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
//                                                     <span className="text-xs">Deleting...</span>
//                                                   </div>
//                                                 ) : (
//                                                   <>
//                                                     <X className="w-3 h-3 mr-1" />
//                                                     {doc.isExisting ? "Delete" : "Remove"}
//                                                   </>
//                                                 )}
//                                               </Button>
//                                             </div>
//                                           </div>
//                                         </div>
//                                       ))}
//                                     </div>
//                                   )}
//                                 </div>
//                               </>
//                             )
//                           })()}
//                         </div>
//                       )}

//                       {stationViewMode === "specifications" && (
//                         <div>
//                           {activeStation.specifications && activeStation.specifications.length > 0 ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               {activeStation.specifications.map((spec) => (
//                                 <div key={spec.id} className="space-y-3 p-3 bg-gray-50 rounded border">
//                                   {renderSpecificationInputField(spec, activeStation.id)}
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <div className="text-center py-6 bg-gray-50 rounded border-2 border-dashed">
//                               <p className="text-sm text-muted-foreground">
//                                 No specifications available for this station.
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <div className="text-center">
//                       <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                       <h4 className="font-medium text-gray-600 mb-2">No Station Active</h4>
//                       <p className="text-sm text-muted-foreground">
//                         Click on a station from the left sidebar to view its specifications and documents
//                         {selectedStationIds.length > 0 && (
//                           <span className="block mt-2 text-blue-600 font-medium">
//                             {selectedStationIds.length} station{selectedStationIds.length > 1 ? "s" : ""} selected for
//                             MPI
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Instructions Section */}
//           <div className="mt-8 border-t pt-6">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h4 className="text-lg font-semibold text-green-800">General Instructions</h4>
//                 <p className="text-sm text-muted-foreground">
//                   Add general safety and operational instructions for this MPI
//                 </p>
//               </div>
//               <Button
//                 type="button"
//                 size="sm"
//                 variant="outline"
//                 onClick={() => {
//                   onAddInstruction()
//                   // Focus the new instruction input after it's added
//                   setTimeout(() => {
//                     setFocusedInstructionIndex(instructions.length)
//                   }, 0)
//                 }}
//                 className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Instruction
//               </Button>
//             </div>
//             {instructions.length === 0 ? (
//               <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                 <p className="text-sm text-muted-foreground">No instructions added yet</p>
//                 <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {instructions.map((instruction, index) => (
//                   <div key={`instruction-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
//                     <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
//                       {index + 1}
//                     </div>
//                     <div className="flex-1">
//                       <Input
//                         ref={(el) => {
//                           instructionRefs.current[index] = el
//                         }}
//                         value={instruction}
//                         onChange={(e) => {
//                           setFocusedInstructionIndex(index)
//                           onInstructionChange(index, e.target.value)
//                         }}
//                         onFocus={() => setFocusedInstructionIndex(index)}
//                         onBlur={() => setFocusedInstructionIndex(null)}
//                         placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
//                         className="w-full"
//                       />
//                     </div>
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="ghost"
//                       onClick={(e) => {
//                         e.preventDefault()
//                         e.stopPropagation()
//                         onRemoveInstruction(index)
//                         // Clear focus tracking when removing instruction
//                         setFocusedInstructionIndex(null)
//                       }}
//                       className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-shrink-0"
//                     >
//                       <X className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default InstructionsTab
















// "use client"
// import type React from "react"
// import { useState, useEffect, useCallback, useMemo, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { FileText, Plus, X, Upload, Factory, Eye } from "lucide-react"
// import type { Station } from "../stations/types"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"
// import { useToast } from "@/hooks/use-toast"
// import { Textarea } from "@/components/ui/textarea"
// import { API_BASE_URL } from "@/lib/constants"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   fileUrl?: string
//   unit?: string
// }

// interface StationDocument {
//   id?: string
//   file?: File
//   fileUrl?: string
//   description: string
//   fileName: string
//   stationId: string
//   isUploaded?: boolean
// }

// interface InstructionsTabProps {
//   availableStations: Station[]
//   selectedStationIds: string[]
//   loadingStations: boolean
//   activeStationId: string | null
//   stationViewMode: "specifications" | "documents" | "notes"
//   specificationValues: Record<string, SpecificationValue>
//   uploadingFiles: Set<string>
//   mpiId?: string
//   onStationSelectionChange: (stationIds: string[]) => void
//   onActiveStationChange: (stationId: string | null) => void
//   onStationViewModeChange: (mode: "specifications" | "documents" | "notes") => void
//   onSpecificationValueChange: (specificationId: string, value: string, unit?: string) => void
//   onFileUpload: (specificationId: string, file: File, stationId: string, unit?: string) => Promise<void>
//   renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
//   renderStationDocuments: (station: Station) => React.ReactNode
//   instructions: string[]
//   onAddInstruction: () => void
//   onInstructionChange: (index: number, value: string) => void
//   onRemoveInstruction: (index: number) => void
//   stationDocuments: Record<string, StationDocument[]>
//   onStationDocumentUpload: (stationId: string, file: File, description: string) => Promise<void>
//   onStationDocumentRemove: (stationId: string, documentIndex: number) => void
// }

// const InstructionsTab: React.FC<InstructionsTabProps> = ({
//   availableStations,
//   selectedStationIds,
//   loadingStations,
//   activeStationId,
//   stationViewMode,
//   specificationValues,
//   uploadingFiles,
//   mpiId,
//   onStationSelectionChange,
//   onActiveStationChange,
//   onStationViewModeChange,
//   onSpecificationValueChange,
//   onFileUpload,
//   renderSpecificationInput,
//   renderStationDocuments,
//   instructions,
//   onAddInstruction,
//   onInstructionChange,
//   onRemoveInstruction,
//   stationDocuments,
//   onStationDocumentUpload,
//   onStationDocumentRemove,
// }) => {
//   const { toast } = useToast()
//   const [uploadingStationDoc, setUploadingStationDoc] = useState(false)
//   const [stationNotes, setStationNotes] = useState<Record<string, any[]>>({})
//   const [loadingNotes, setLoadingNotes] = useState(false)
//   const [addingNote, setAddingNote] = useState(false)
//   const [loadingDocuments, setLoadingDocuments] = useState<Record<string, boolean>>({})
//   const [existingStationDocuments, setExistingStationDocuments] = useState<Record<string, any[]>>({})
//   const [deletingDocuments, setDeletingDocuments] = useState<Set<string>>(new Set())
//   const [stationDocumentFiles, setStationDocumentFiles] = useState<
//     Record<string, { file: File | null; description: string }>
//   >({})

//   // Add focus management for instruction inputs
//   const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
//   const instructionRefs = useRef<(HTMLInputElement | null)[]>([])
//   const [focusedSpecificationId, setFocusedSpecificationId] = useState<string | null>(null)
//   const specificationRefs = useRef<Record<string, HTMLInputElement | null>>({})

//   const safeStationDocuments = stationDocuments || {}

//   // Memoize the specification input renderer to prevent recreation on every render
//   const renderSpecificationInputField = useCallback(
//     (spec: any, stationId: string) => {
//       const specValue = specificationValues[spec.id] || { value: "", unit: spec.unit || "" }
//       const isUploading = uploadingFiles.has(spec.id)
//       const inputType = spec.inputType || spec.type || "TEXT"

//       console.log(`🔍 InstructionsTab - Rendering specification input:`, {
//         specId: spec.id,
//         specName: spec.name,
//         inputType: inputType,
//         specValue: specValue,
//         originalSpec: spec,
//       })

//       const handleInputChange = (value: string) => {
//         console.log(`🔧 Specification ${spec.id} value changed to:`, value)
//         onSpecificationValueChange(spec.id, value, specValue.unit)
//       }

//       const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0]
//         if (file) {
//           try {
//             console.log(`📁 File selected for spec ${spec.id}:`, file.name)
//             await onFileUpload(spec.id, file, stationId, specValue.unit)
//           } catch (error) {
//             console.error("File upload failed:", error)
//           }
//         }
//       }

//       const handleUnitChange = (unitValue: string) => {
//         console.log(`🔧 Specification ${spec.id} unit changed to:`, unitValue)
//         onSpecificationValueChange(spec.id, specValue.value || "", unitValue)
//       }

//       const handleCheckboxChange = (checked: boolean) => {
//         const value = checked ? "true" : "false"
//         console.log(`☑️ Specification ${spec.id} checkbox changed to:`, value)
//         handleInputChange(value)
//       }

//       switch (inputType) {
//         case "TEXT":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Input
//                 ref={(el) => {
//                   specificationRefs.current[spec.id] = el
//                 }}
//                 id={`spec-${spec.id}`}
//                 value={specValue.value}
//                 onChange={(e) => {
//                   setFocusedSpecificationId(spec.id)
//                   handleInputChange(e.target.value)
//                 }}
//                 onFocus={() => setFocusedSpecificationId(spec.id)}
//                 onBlur={() => setFocusedSpecificationId(null)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10"
//               />
//             </div>
//           )
//         case "number":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="flex gap-2">
//                 <Input
//                   ref={(el) => {
//                     specificationRefs.current[spec.id] = el
//                   }}
//                   id={`spec-${spec.id}`}
//                   type="number"
//                   value={specValue.value}
//                   onChange={(e) => {
//                     setFocusedSpecificationId(spec.id)
//                     handleInputChange(e.target.value)
//                   }}
//                   onFocus={() => setFocusedSpecificationId(spec.id)}
//                   onBlur={() => setFocusedSpecificationId(null)}
//                   placeholder={`Enter ${spec.name.toLowerCase()}`}
//                   className="h-10 flex-1"
//                 />
//                 <Input
//                   placeholder="Unit"
//                   value={specValue.unit || ""}
//                   onChange={(e) => handleUnitChange(e.target.value)}
//                   className="h-10 w-20"
//                 />
//               </div>
//             </div>
//           )
//         case "CHECKBOX":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`spec-${spec.id}`}
//                   checked={specValue.value === "true"}
//                   onCheckedChange={handleCheckboxChange}
//                 />
//                 <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                   {spec.name}
//                   {spec.required && <span className="text-green-500 ml-1">*</span>}
//                 </Label>
//               </div>
//             </div>
//           )
//         case "DROPDOWN":
//           const suggestions = spec.suggestions || []
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Select value={specValue.value} onValueChange={handleInputChange}>
//                 <SelectTrigger id={`spec-${spec.id}`} className="h-10">
//                   <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {suggestions.map((suggestion: string, index: number) => (
//                     <SelectItem key={index} value={suggestion}>
//                       {suggestion}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )
//         case "FILE_UPLOAD":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <Input
//                     id={`spec-${spec.id}`}
//                     type="file"
//                     onChange={handleFileChange}
//                     accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
//                     className="cursor-pointer flex-1"
//                     disabled={isUploading}
//                   />
//                   {isUploading && (
//                     <div className="flex items-center gap-2">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
//                       <span className="text-xs text-muted-foreground">Uploading...</span>
//                     </div>
//                   )}
//                 </div>
//                 <Input
//                   placeholder="Unit (optional)"
//                   value={specValue.unit || ""}
//                   onChange={(e) => handleUnitChange(e.target.value)}
//                   className="h-10 w-32"
//                 />
//                 {specValue.fileUrl && (
//                   <div className="flex items-center gap-2">
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="outline"
//                       onClick={() => window.open(specValue.fileUrl, "_blank")}
//                     >
//                       <Eye className="w-3 h-3 mr-1" />
//                       View File
//                     </Button>
//                   </div>
//                 )}
//                 <p className="text-xs text-muted-foreground">
//                   Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
//                 </p>
//               </div>
//             </div>
//           )
//         default:
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Input
//                 id={`spec-${spec.id}`}
//                 value={specValue.value}
//                 onChange={(e) => handleInputChange(e.target.value)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10"
//               />
//             </div>
//           )
//       }
//     },
//     [specificationValues, uploadingFiles, onSpecificationValueChange, onFileUpload],
//   )

//   // Memoize event handlers to prevent unnecessary re-renders
//   const handleStationClick = useCallback(
//     (stationId: string) => {
//       onActiveStationChange(stationId)
//       if (selectedStationIds.includes(stationId)) {
//         onStationSelectionChange(selectedStationIds.filter((id) => id !== stationId))
//       } else {
//         onStationSelectionChange([...selectedStationIds, stationId])
//       }
//     },
//     [selectedStationIds, onActiveStationChange, onStationSelectionChange],
//   )

//   const handleStationDocumentFileChange = useCallback((stationId: string, file: File | null) => {
//     setStationDocumentFiles((prev) => ({
//       ...prev,
//       [stationId]: {
//         ...prev[stationId],
//         file: file,
//       },
//     }))
//   }, [])

//   const handleStationDocumentDescriptionChange = useCallback((stationId: string, description: string) => {
//     setStationDocumentFiles((prev) => ({
//       ...prev,
//       [stationId]: {
//         ...prev[stationId],
//         description: description,
//       },
//     }))
//   }, [])

//   // Auto-select first station when editing existing MPI
//   useEffect(() => {
//     if (selectedStationIds.length > 0 && !activeStationId) {
//       const firstStationId = selectedStationIds[0]
//       onActiveStationChange(firstStationId)
//       if (stationViewMode !== "specifications") {
//         onStationViewModeChange("specifications")
//       }
//     }
//   }, [selectedStationIds, activeStationId, onActiveStationChange, stationViewMode, onStationViewModeChange])

//   // Load station notes when active station changes
//   useEffect(() => {
//     if (activeStationId) {
//       loadStationNotes(activeStationId)
//     }
//   }, [activeStationId])

//   // Load existing station documents only for the active station and only when documents tab is active
//   useEffect(() => {
//     if (activeStationId && stationViewMode === "documents") {
//       if (!existingStationDocuments[activeStationId]) {
//         loadExistingStationDocuments(activeStationId)
//       }
//     }
//   }, [activeStationId, stationViewMode])

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

//   // Restore focus to specification input after re-render
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

//   // Initialize station notes and documents from available stations
//   useEffect(() => {
//     console.log("🔄 Initializing station notes and documents from available stations")
//     const initialNotes: Record<string, any[]> = {}
//     const initialDocs: Record<string, any[]> = {}
//     availableStations.forEach((station) => {
//       console.log(`📍 Processing station: ${station.stationName} (${station.id})`)
//       let stationNotesArray: any[] = []
//       if (station.Note && Array.isArray(station.Note)) {
//         stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
//           (note, index) => ({
//             id: `note-${station.id}-${index}-${Date.now()}`,
//             content: note,
//             createdAt: new Date().toISOString(),
//             stationId: station.id,
//           }),
//         )
//       } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
//         stationNotesArray = [
//           {
//             id: `note-${station.id}-0-${Date.now()}`,
//             content: station.Note.trim(),
//             createdAt: new Date().toISOString(),
//             stationId: station.id,
//           },
//         ]
//       }
//       initialNotes[station.id] = stationNotesArray

//       let stationDocsArray: any[] = []
//       if (station.documentations && Array.isArray(station.documentations)) {
//         stationDocsArray = station.documentations.filter((doc) => doc && doc.fileUrl)
//       } else if (station.documents && Array.isArray(station.documents)) {
//         stationDocsArray = station.documents.filter((doc) => doc && doc.fileUrl)
//       } else if (station.stationDocuments && Array.isArray(station.stationDocuments)) {
//         stationDocsArray = station.stationDocuments.filter((doc) => doc && doc.fileUrl)
//       }
//       initialDocs[station.id] = stationDocsArray

//       console.log(
//         `✅ Initialized station ${station.id}: ${stationNotesArray.length} notes, ${stationDocsArray.length} docs`,
//       )
//     })

//     setStationNotes(initialNotes)
//     setExistingStationDocuments(initialDocs)
//     console.log("🎯 Station initialization complete:", { initialNotes, initialDocs })
//   }, [availableStations])

//   const loadExistingStationDocuments = async (stationId: string) => {
//     if (loadingDocuments[stationId]) {
//       return
//     }
//     try {
//       setLoadingDocuments((prev) => ({ ...prev, [stationId]: true }))
//       console.log("🔍 Loading existing station documents for station:", stationId)
//       const documents = await StationMpiDocAPI.findAll({ stationId })
//       console.log("📄 Existing station documents loaded for station", stationId, ":", documents)
//       setExistingStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: documents || [],
//       }))
//     } catch (error) {
//       console.error("❌ Failed to load existing station documents for station", stationId, ":", error)
//       toast({
//         title: "Error",
//         description: `Failed to load existing station documents for ${availableStations.find((s) => s.id === stationId)?.stationName || "station"}.`,
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingDocuments((prev) => ({ ...prev, [stationId]: false }))
//     }
//   }

//   const loadStationNotes = async (stationId: string) => {
//     try {
//       setLoadingNotes(true)
//       const station = availableStations.find((s) => s.id === stationId)
//       console.log(`📝 Loading notes for station: ${station?.stationName} (${stationId})`)
//       if (station) {
//         let stationNotesArray: any[] = []
//         if (station.Note && Array.isArray(station.Note)) {
//           stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
//             (note, index) => ({
//               id: `note-${stationId}-${index}-${Date.now()}`,
//               content: note,
//               createdAt: new Date().toISOString(),
//               stationId: stationId,
//             }),
//           )
//           console.log(`📝 Found Note array for station ${stationId}:`, stationNotesArray)
//         } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
//           stationNotesArray = [
//             {
//               id: `note-${stationId}-0-${Date.now()}`,
//               content: station.Note.trim(),
//               createdAt: new Date().toISOString(),
//               stationId: stationId,
//             },
//           ]
//           console.log(`📝 Found single Note for station ${stationId}:`, stationNotesArray)
//         } else if (station.notes && Array.isArray(station.notes)) {
//           stationNotesArray = station.notes
//             .filter((note) => note && (typeof note === "string" || note.content))
//             .map((note, index) => ({
//               id: note.id || `note-${stationId}-${index}-${Date.now()}`,
//               content: typeof note === "string" ? note : note.content,
//               createdAt: note.createdAt || new Date().toISOString(),
//               stationId: stationId,
//             }))
//           console.log(`📝 Found notes array for station ${stationId}:`, stationNotesArray)
//         }

//         setStationNotes((prev) => ({
//           ...prev,
//           [stationId]: stationNotesArray,
//         }))
//         console.log(`✅ Loaded ${stationNotesArray.length} notes for station ${stationId}`)
//       } else {
//         console.log(`⚠️ Station not found: ${stationId}`)
//         setStationNotes((prev) => ({
//           ...prev,
//           [stationId]: [],
//         }))
//       }
//     } catch (error) {
//       console.error("Failed to load station notes:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load station notes.",
//         variant: "destructive",
//       })
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: [],
//       }))
//     } finally {
//       setLoadingNotes(false)
//     }
//   }

//   const handleAddStationNote = async (stationId: string, content: string) => {
//     if (!content.trim()) {
//       toast({
//         title: "Invalid Note",
//         description: "Note content cannot be empty.",
//         variant: "destructive",
//       })
//       return
//     }

//     setAddingNote(true)
//     try {
//       const newNote = {
//         id: `note-${Date.now()}-${Math.random()}`,
//         content: content.trim(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         stationId: stationId,
//         isTemporary: !mpiId, // Mark as temporary if MPI not created yet
//       }

//       // Add to station notes state immediately for UI update
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: [...(prev[stationId] || []), newNote],
//       }))

//       console.log(`✅ Added note for station ${stationId}:`, newNote)

//       toast({
//         title: "Success",
//         description: "Station note added successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to add station note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add station note.",
//         variant: "destructive",
//       })
//     } finally {
//       setAddingNote(false)
//     }
//   }

//   const handleDeleteStationNote = async (stationId: string, noteId: string) => {
//     try {
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: (prev[stationId] || []).filter((note) => note.id !== noteId),
//       }))

//       toast({
//         title: "Success",
//         description: "Station note deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete station note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete station note.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDeleteExistingDocument = async (e: React.MouseEvent, documentId: string, stationId: string) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
//       return
//     }

//     setDeletingDocuments((prev) => new Set(prev).add(documentId))
//     try {
//       console.log("🗑️ Deleting existing station document:", documentId)
//       await StationMpiDocAPI.delete(documentId)
//       console.log("✅ Document deleted successfully")

//       setExistingStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: (prev[stationId] || []).filter((doc) => doc.id !== documentId),
//       }))

//       toast({
//         title: "Success",
//         description: "Document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("❌ Failed to delete document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setDeletingDocuments((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(documentId)
//         return newSet
//       })
//     }
//   }

//   const handleRemoveQueuedDocument = (e: React.MouseEvent, stationId: string, documentIndex: number) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (!confirm("Are you sure you want to remove this queued document?")) {
//       return
//     }

//     try {
//       onStationDocumentRemove(stationId, documentIndex)
//       toast({
//         title: "Success",
//         description: "Document removed from queue.",
//       })
//     } catch (error) {
//       console.error("Failed to remove queued document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to remove document.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleStationDocumentUpload = async (stationId: string, file: File, description: string) => {
//     setUploadingStationDoc(true)
//     try {
//       if (!file) {
//         throw new Error("No file selected")
//       }

//       const finalDescription = description.trim() || file.name

//       console.log("📤 Station document upload request:", {
//         stationId,
//         fileName: file.name,
//         description: finalDescription,
//         mpiId: mpiId || "NOT_CREATED_YET",
//         fileSize: file.size,
//       })

//       if (!mpiId) {
//         console.log("💾 QUEUING station document locally - MPI not created yet...")
//         if (file.size > 10 * 1024 * 1024) {
//           throw new Error("File size exceeds 10MB limit")
//         }

//         // Create new document object
//         const newDoc = {
//           id: `temp-${Date.now()}-${Math.random()}`,
//           file: file,
//           fileUrl: URL.createObjectURL(file), // Create temporary URL for preview
//           description: finalDescription,
//           fileName: file.name,
//           stationId: stationId,
//           isUploaded: false,
//           isTemporary: true,
//         }

//         // Add to existing station documents state
//         setExistingStationDocuments((prev) => ({
//           ...prev,
//           [stationId]: [...(prev[stationId] || []), newDoc],
//         }))

//         // Also call the parent handler
//         await onStationDocumentUpload(stationId, file, finalDescription)

//         toast({
//           title: "✅ Document Queued Successfully",
//           description: `"${finalDescription}" will be uploaded and linked to the MPI when it's created.`,
//         })
//       } else {
//         console.log("📤 Uploading station document directly to existing MPI...")
//         const formData = new FormData()
//         formData.append("files", file)
//         formData.append("stationId", stationId)
//         formData.append("description", finalDescription)
//         formData.append("mpiId", mpiId)
//         formData.append("originalName", file.name)

//         console.log("📤 Sending direct upload request to:", `${API_BASE_URL}/station-mpi-documents/upload`)

//         const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
//           method: "POST",
//           body: formData,
//         })

//         console.log("📥 Direct upload response status:", response.status)

//         if (!response.ok) {
//           const errorText = await response.text()
//           console.error("❌ Direct upload failed:", errorText)
//           throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
//         }

//         const result = await response.json()
//         console.log("✅ Station document uploaded and linked successfully:", result)

//         const document = Array.isArray(result) ? result[0] : result

//         // Add the uploaded document to existing documents state
//         setExistingStationDocuments((prev) => ({
//           ...prev,
//           [stationId]: [
//             ...(prev[stationId] || []),
//             {
//               ...document,
//               isUploaded: true,
//               isExisting: true,
//             },
//           ],
//         }))

//         toast({
//           title: "Success",
//           description: "Station document uploaded and linked to MPI successfully.",
//         })

//         await loadExistingStationDocuments(stationId)
//       }

//       // Clear the file input
//       setStationDocumentFiles((prev) => ({
//         ...prev,
//         [stationId]: { file: null, description: "" },
//       }))
//     } catch (error) {
//       console.error("❌ Station document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingStationDoc(false)
//     }
//   }

//   // Memoize the documents getter to prevent unnecessary recalculations
//   const getStationDocuments = useCallback(
//     (stationId: string) => {
//       const queuedDocuments = safeStationDocuments?.[stationId] || []
//       const existingDocs = existingStationDocuments[stationId] || []

//       console.log(`📄 Getting documents for station ${stationId}:`, {
//         queued: queuedDocuments.length,
//         existing: existingDocs.length,
//         queuedDocs: queuedDocuments,
//         existingDocs: existingDocs,
//       })

//       return {
//         queued: queuedDocuments,
//         existing: existingDocs,
//         all: [
//           ...existingDocs.map((doc) => ({
//             ...doc,
//             isUploaded: doc.isUploaded || !doc.isTemporary,
//             isExisting: !doc.isTemporary,
//           })),
//           ...queuedDocuments,
//         ],
//       }
//     },
//     [safeStationDocuments, existingStationDocuments],
//   )

//   // Memoize the active station to prevent unnecessary re-renders
//   const activeStation = useMemo(() => {
//     return availableStations.find((s) => s.id === activeStationId)
//   }, [availableStations, activeStationId])

//   return (
//     <div className="space-y-6 mt-6">
//       <Card>
//         <CardContent className="space-y-6 mt-5">
//           {loadingStations ? (
//             <div className="flex items-center justify-center py-8">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
//                 <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
//               </div>
//             </div>
//           ) : availableStations.length === 0 ? (
//             <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//               <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
//             </div>
//           ) : (
//             <div className="flex gap-6 min-h-[600px]">
//               {/* Left Sidebar - Station List */}
//               <div className="w-1/4 border rounded-lg bg-gray-50">
//                 <div className="p-3 border-b bg-white rounded-t-lg">
//                   <h4 className="font-medium text-base">Stations</h4>
//                   <p className="text-xs text-muted-foreground">
//                     {selectedStationIds.length > 0
//                       ? `${selectedStationIds.length} selected`
//                       : "Click to select multiple"}
//                   </p>
//                 </div>
//                 <div className="p-2 overflow-y-auto h-[530px]">
//                   <div className="space-y-1">
//                     {availableStations.map((station) => {
//                       const stationDocs = getStationDocuments(station.id)
//                       return (
//                         <div
//                           key={station.id}
//                           className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
//                             selectedStationIds.includes(station.id)
//                               ? "bg-blue-100 text-blue-900 border-blue-300"
//                               : "bg-white hover:bg-gray-100 border-transparent"
//                           } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
//                           onClick={() => handleStationClick(station.id)}
//                         >
//                           <div className="flex items-center justify-between">
//                             <span>{station.stationName}</span>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>
//               </div>

//               {/* Right Panel - Station Specifications and Documents */}
//               <div className="flex-1 border rounded-lg bg-white">
//                 {activeStationId && activeStation ? (
//                   <div className="h-full flex flex-col">
//                     <div className="p-4 border-b bg-white rounded-t-lg">
//                       <div className="flex items-center justify-between">
//                         <h4 className="font-medium text-lg">{activeStation.stationName} Station</h4>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "specifications" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("specifications")}
//                           >
//                             Specifications
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "documents" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("documents")}
//                           >
//                             <FileText className="w-4 h-4 mr-1" />
//                             Files
//                             {(() => {
//                               const activeStationDocs = getStationDocuments(activeStationId)
//                               const docCount = activeStationDocs.all.length
//                               return docCount > 0 ? (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {docCount}
//                                 </Badge>
//                               ) : null
//                             })()}
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "notes" ? "default" : "outline"}
//                             onClick={() => onStationViewModeChange("notes")}
//                           >
//                             <FileText className="w-4 h-4 mr-1" />
//                             Notes
//                             {(() => {
//                               const noteCount = activeStation?.Note?.length || 0
//                               return noteCount > 0 ? (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {noteCount}
//                                 </Badge>
//                               ) : null
//                             })()}
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-4">
//                       {stationViewMode === "notes" && (
//                         <div className="space-y-6">
//                           {/* Add Note Section */}
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                             <div className="space-y-4">
//                               <div className="text-center">
//                                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <h4 className="font-medium text-gray-700">Add Station Note</h4>
//                               </div>
//                               <div className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor="station-note-content">Note Content </Label>
//                                   <Textarea
//                                     id="station-note-content"
//                                     placeholder="Enter note content (e.g., Safety procedures, operational instructions, maintenance notes)"
//                                     rows={4}
//                                     disabled={addingNote}
//                                   />
//                                 </div>
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   disabled={addingNote}
//                                   onClick={async () => {
//                                     const contentInput = document.getElementById(
//                                       "station-note-content",
//                                     ) as HTMLTextAreaElement
//                                     const content = contentInput?.value?.trim() || ""
//                                     if (!content) {
//                                       toast({
//                                         title: "Missing Content",
//                                         description: "Please enter note content.",
//                                         variant: "destructive",
//                                       })
//                                       return
//                                     }
//                                     await handleAddStationNote(activeStation.id, content)
//                                     contentInput.value = ""
//                                   }}
//                                   className="w-full bg-transparent"
//                                 >
//                                   {addingNote ? (
//                                     <div className="flex items-center gap-2">
//                                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                       Adding Note...
//                                     </div>
//                                   ) : (
//                                     <>
//                                       <Plus className="w-4 h-4 mr-2" />
//                                       Add Note
//                                     </>
//                                   )}
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Existing Notes */}
//                           <div>
//                             <h4 className="font-medium text-gray-700 mb-4">Station Notes</h4>
//                             {loadingNotes ? (
//                               <div className="flex items-center justify-center py-8">
//                                 <div className="text-center">
//                                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
//                                   <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
//                                 </div>
//                               </div>
//                             ) : (stationNotes[activeStationId] || []).length === 0 ? (
//                               <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                                 <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                 <p className="text-muted-foreground">No notes available for this station.</p>
//                                 <p className="text-sm text-gray-400 mt-1">
//                                   Add operational notes, safety instructions, or maintenance reminders above.
//                                 </p>
//                               </div>
//                             ) : (
//                               <div className="space-y-4">
//                                 {(stationNotes[activeStationId] || []).map((note, index) => (
//                                   <div key={note.id || index} className="p-4 bg-white border rounded-lg shadow-sm">
//                                     <div className="flex items-start justify-between">
//                                       <div className="flex-1 min-w-0">
//                                         <div className="prose prose-sm max-w-none">
//                                           <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
//                                         </div>
//                                         <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
//                                           <span>
//                                             Created:{" "}
//                                             {note.createdAt
//                                               ? new Date(note.createdAt).toLocaleDateString()
//                                               : "Unknown date"}
//                                           </span>
//                                           {note.updatedAt && note.updatedAt !== note.createdAt && (
//                                             <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
//                                           )}
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-2 ml-4">
//                                         <Button
//                                           size="sm"
//                                           variant="outline"
//                                           onClick={(e) => {
//                                             e.preventDefault()
//                                             e.stopPropagation()
//                                             handleDeleteStationNote(activeStation.id, note.id)
//                                           }}
//                                           className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
//                                         >
//                                           <X className="w-3 h-3 mr-1" />
//                                           Delete
//                                         </Button>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {stationViewMode === "documents" && (
//                         <div className="space-y-6">
//                           {/* Document Upload Section */}
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                             <div className="space-y-4">
//                               <div className="text-center">
//                                 <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <h4 className="font-medium text-gray-700">Upload Files</h4>
//                               </div>
//                               <div className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor={`station-doc-file-${activeStationId}`}>Select Files *</Label>
//                                   <Input
//                                     id={`station-doc-file-${activeStationId}`}
//                                     type="file"
//                                     accept="*/*"
//                                     className="cursor-pointer"
//                                     disabled={uploadingStationDoc}
//                                     onChange={(e) => {
//                                       const file = e.target.files?.[0] || null
//                                       handleStationDocumentFileChange(activeStationId, file)
//                                     }}
//                                   />
//                                   {stationDocumentFiles[activeStationId]?.file && (
//                                     <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
//                                       <FileText className="w-4 h-4 text-green-600" />
//                                       <span className="text-sm text-green-800">
//                                         Selected: {stationDocumentFiles[activeStationId].file.name} (
//                                         {(stationDocumentFiles[activeStationId].file.size / 1024 / 1024).toFixed(2)} MB)
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="space-y-2">
//                                   <Label htmlFor={`station-doc-description-${activeStationId}`}>
//                                     Description (Optional)
//                                   </Label>
//                                   <Input
//                                     id={`station-doc-description-${activeStationId}`}
//                                     placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                                     disabled={uploadingStationDoc}
//                                     value={stationDocumentFiles[activeStationId]?.description || ""}
//                                     onChange={(e) => {
//                                       handleStationDocumentDescriptionChange(activeStationId, e.target.value)
//                                     }}
//                                   />
//                                 </div>
//                               </div>
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 disabled={uploadingStationDoc || !stationDocumentFiles[activeStationId]?.file}
//                                 onClick={async (e) => {
//                                   e.preventDefault()
//                                   e.stopPropagation()
//                                   const file = stationDocumentFiles[activeStationId]?.file
//                                   const description = stationDocumentFiles[activeStationId]?.description || ""
//                                   if (!file) {
//                                     toast({
//                                       title: "Missing File",
//                                       description: "Please select a file to upload.",
//                                       variant: "destructive",
//                                     })
//                                     return
//                                   }
//                                   await handleStationDocumentUpload(activeStation.id, file, description)
//                                 }}
//                                 className="w-full bg-transparent"
//                               >
//                                 {uploadingStationDoc ? (
//                                   <div className="flex items-center gap-2">
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                     {mpiId ? "Uploading Document..." : "Queuing Document..."}
//                                   </div>
//                                 ) : (
//                                   <>
//                                     <Upload className="w-4 h-4 mr-2" />
//                                     {mpiId ? "Upload Document" : "Upload"}
//                                   </>
//                                 )}
//                               </Button>
//                             </div>
//                           </div>

//                           {/* Document Summary and List */}
//                           {(() => {
//                             const stationDocs = getStationDocuments(activeStationId)
//                             const { queued: queuedDocuments, existing: existingDocs, all: allDocuments } = stationDocs
//                             return (
//                               <>
//                                 {allDocuments.length > 0 && (
//                                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//                                     <div className="flex items-center gap-2 mb-2">
//                                       <FileText className="w-5 h-5 text-blue-600" />
//                                       <h5 className="font-medium text-blue-900">
//                                         Files Summary for {activeStation.stationName}
//                                       </h5>
//                                     </div>
//                                     <div className="grid grid-cols-3 gap-4 text-sm">
//                                       <div>
//                                         <span className="text-blue-700">Total Files:</span>
//                                         <span className="font-medium ml-2">{allDocuments.length}</span>
//                                       </div>
//                                       <div>
//                                         <span className="text-blue-700">Uploaded:</span>
//                                         <span className="font-medium ml-2">{existingDocs.length}</span>
//                                       </div>
//                                       <div>
//                                         <span className="text-blue-700">Queued:</span>
//                                         <span className="font-medium ml-2">{queuedDocuments.length}</span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}
//                                 <div>
//                                   <h4 className="font-medium text-gray-700 mb-4">
//                                     {activeStation.stationName} Station Files
//                                   </h4>
//                                   {loadingDocuments[activeStationId] ? (
//                                     <div className="flex items-center justify-center py-8">
//                                       <div className="text-center">
//                                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
//                                         <p className="mt-2 text-sm text-muted-foreground">Loading files...</p>
//                                       </div>
//                                     </div>
//                                   ) : allDocuments.length === 0 ? (
//                                     <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                                       <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                       <p className="text-muted-foreground">No files available.</p>
//                                     </div>
//                                   ) : (
//                                     <div className="space-y-3">
//                                       {allDocuments.map((doc, index) => (
//                                         <div
//                                           key={doc.id || `queued-${index}`}
//                                           className="p-4 bg-white border rounded-lg shadow-sm"
//                                           onClick={(e) => {
//                                             // Prevent any parent click handlers from firing
//                                             e.preventDefault()
//                                             e.stopPropagation()
//                                           }}
//                                         >
//                                           <div className="flex items-start justify-between">
//                                             <div className="flex items-start gap-3 flex-1">
//                                               <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                                               <div className="flex-1 min-w-0">
//                                                 <h6 className="font-medium text-sm text-gray-900 truncate">
//                                                   {doc.description && doc.description !== doc.fileName
//                                                     ? doc.description
//                                                     : doc.fileName || doc.originalName || "Untitled Document"}
//                                                 </h6>
//                                                 <div className="mt-1 space-y-1">
//                                                   <p className="text-xs text-gray-600">
//                                                     <span className="font-medium">Filename:</span>{" "}
//                                                     {doc.fileName || doc.originalName || "Unknown"}
//                                                   </p>
//                                                   {doc.description && doc.description !== doc.fileName && (
//                                                     <p className="text-xs text-gray-500">
//                                                       <span className="font-medium">Description:</span>{" "}
//                                                       {doc.description}
//                                                     </p>
//                                                   )}
//                                                 </div>
//                                               </div>
//                                             </div>
//                                             <div className="flex items-center gap-2 ml-4">
//                                               {doc.fileUrl && (
//                                                 <Button
//                                                   size="sm"
//                                                   variant="outline"
//                                                   onClick={(e) => {
//                                                     e.preventDefault()
//                                                     e.stopPropagation()
//                                                     window.open(doc.fileUrl, "_blank")
//                                                   }}
//                                                   className="h-8 px-3"
//                                                 >
//                                                   <Eye className="w-3 h-3 mr-1" />
//                                                   View
//                                                 </Button>
//                                               )}
//                                               <Button
//                                                 size="sm"
//                                                 variant="outline"
//                                                 disabled={doc.isExisting && deletingDocuments.has(doc.id)}
//                                                 onClick={(e) => {
//                                                   e.preventDefault()
//                                                   e.stopPropagation()
//                                                   if (doc.isExisting) {
//                                                     handleDeleteExistingDocument(e, doc.id, activeStation.id)
//                                                   } else {
//                                                     const queuedIndex = queuedDocuments.findIndex(
//                                                       (qDoc) => qDoc === doc,
//                                                     )
//                                                     if (queuedIndex !== -1) {
//                                                       handleRemoveQueuedDocument(e, activeStation.id, queuedIndex)
//                                                     }
//                                                   }
//                                                 }}
//                                                 className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
//                                               >
//                                                 {doc.isExisting && deletingDocuments.has(doc.id) ? (
//                                                   <div className="flex items-center gap-1">
//                                                     <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
//                                                     <span className="text-xs">Deleting...</span>
//                                                   </div>
//                                                 ) : (
//                                                   <>
//                                                     <X className="w-3 h-3 mr-1" />
//                                                     {doc.isExisting ? "Delete" : "Remove"}
//                                                   </>
//                                                 )}
//                                               </Button>
//                                             </div>
//                                           </div>
//                                         </div>
//                                       ))}
//                                     </div>
//                                   )}
//                                 </div>
//                               </>
//                             )
//                           })()}
//                         </div>
//                       )}

//                       {stationViewMode === "specifications" && (
//                         <div>
//                           {activeStation.specifications && activeStation.specifications.length > 0 ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               {activeStation.specifications.map((spec) => (
//                                 <div key={spec.id} className="space-y-3 p-3 bg-gray-50 rounded border">
//                                   {renderSpecificationInputField(spec, activeStation.id)}
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <div className="text-center py-6 bg-gray-50 rounded border-2 border-dashed">
//                               <p className="text-sm text-muted-foreground">
//                                 No specifications available for this station.
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <div className="text-center">
//                       <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                       <h4 className="font-medium text-gray-600 mb-2">No Station Active</h4>
//                       <p className="text-sm text-muted-foreground">
//                         Click on a station from the left sidebar to view its specifications and documents
//                         {selectedStationIds.length > 0 && (
//                           <span className="block mt-2 text-blue-600 font-medium">
//                             {selectedStationIds.length} station{selectedStationIds.length > 1 ? "s" : ""} selected for
//                             MPI
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Instructions Section */}
//           <div className="mt-8 border-t pt-6">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h4 className="text-lg font-semibold text-green-800">General Instructions</h4>
//                 <p className="text-sm text-muted-foreground">
//                   Add general safety and operational instructions for this MPI
//                 </p>
//               </div>
//               <Button
//                 type="button"
//                 size="sm"
//                 variant="outline"
//                 onClick={() => {
//                   onAddInstruction()
//                   // Focus the new instruction input after it's added
//                   setTimeout(() => {
//                     setFocusedInstructionIndex(instructions.length)
//                   }, 0)
//                 }}
//                 className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Instruction
//               </Button>
//             </div>
//             {instructions.length === 0 ? (
//               <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                 <p className="text-sm text-muted-foreground">No instructions added yet</p>
//                 <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {instructions.map((instruction, index) => (
//                   <div key={`instruction-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
//                     <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
//                       {index + 1}
//                     </div>
//                     <div className="flex-1">
//                       <Input
//                         ref={(el) => {
//                           instructionRefs.current[index] = el
//                         }}
//                         value={instruction}
//                         onChange={(e) => {
//                           setFocusedInstructionIndex(index)
//                           onInstructionChange(index, e.target.value)
//                         }}
//                         onFocus={() => setFocusedInstructionIndex(index)}
//                         onBlur={() => setFocusedInstructionIndex(null)}
//                         placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
//                         className="w-full"
//                       />
//                     </div>
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="ghost"
//                       onClick={(e) => {
//                         e.preventDefault()
//                         e.stopPropagation()
//                         onRemoveInstruction(index)
//                         // Clear focus tracking when removing instruction
//                         setFocusedInstructionIndex(null)
//                       }}
//                       className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-shrink-0"
//                     >
//                       <X className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default InstructionsTab













// "use client"
// import type React from "react"
// import { useState, useEffect, useCallback, useMemo, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { FileText, Plus, X, Upload, Factory, Eye } from "lucide-react"
// import type { Station } from "../stations/types"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"
// import { useToast } from "@/hooks/use-toast"
// import { Textarea } from "@/components/ui/textarea"
// import { API_BASE_URL } from "@/lib/constants"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   fileUrl?: string
//   unit?: string
// }

// interface StationDocument {
//   id?: string
//   file?: File
//   fileUrl?: string
//   description: string
//   fileName: string
//   stationId: string
//   isUploaded?: boolean
// }

// interface InstructionsTabProps {
//   availableStations: Station[]
//   selectedStationIds: string[]
//   loadingStations: boolean
//   activeStationId: string | null
//   stationViewMode: "specifications" | "documents" | "notes"
//   specificationValues: Record<string, SpecificationValue>
//   uploadingFiles: Set<string>
//   mpiId?: string
//   onStationSelectionChange: (stationIds: string[]) => void
//   onActiveStationChange: (stationId: string | null) => void
//   onStationViewModeChange: (mode: "specifications" | "documents" | "notes") => void
//   onSpecificationValueChange: (specificationId: string, value: string, unit?: string) => void
//   onFileUpload: (specificationId: string, file: File, stationId: string, unit?: string) => Promise<void>
//   renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
//   renderStationDocuments: (station: Station) => React.ReactNode
//   instructions: string[]
//   onAddInstruction: () => void
//   onInstructionChange: (index: number, value: string) => void
//   onRemoveInstruction: (index: number) => void
//   stationDocuments: Record<string, StationDocument[]>
//   onStationDocumentUpload: (stationId: string, file: File, description: string) => Promise<void>
//   onStationDocumentRemove: (stationId: string, documentIndex: number) => void
// }

// const InstructionsTab: React.FC<InstructionsTabProps> = ({
//   availableStations,
//   selectedStationIds,
//   loadingStations,
//   activeStationId,
//   stationViewMode,
//   specificationValues,
//   uploadingFiles,
//   mpiId,
//   onStationSelectionChange,
//   onActiveStationChange,
//   onStationViewModeChange,
//   onSpecificationValueChange,
//   onFileUpload,
//   renderSpecificationInput,
//   renderStationDocuments,
//   instructions,
//   onAddInstruction,
//   onInstructionChange,
//   onRemoveInstruction,
//   stationDocuments,
//   onStationDocumentUpload,
//   onStationDocumentRemove,
// }) => {
//   const { toast } = useToast()
//   const [uploadingStationDoc, setUploadingStationDoc] = useState(false)
//   const [stationNotes, setStationNotes] = useState<Record<string, any[]>>({})
//   const [loadingNotes, setLoadingNotes] = useState(false)
//   const [addingNote, setAddingNote] = useState(false)
//   const [loadingDocuments, setLoadingDocuments] = useState<Record<string, boolean>>({})
//   const [existingStationDocuments, setExistingStationDocuments] = useState<Record<string, any[]>>({})
//   const [deletingDocuments, setDeletingDocuments] = useState<Set<string>>(new Set())
//   const [stationDocumentFiles, setStationDocumentFiles] = useState<
//     Record<string, { file: File | null; description: string }>
//   >({})

//   // Add focus management for instruction inputs
//   const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
//   const instructionRefs = useRef<(HTMLInputElement | null)[]>([])
//   const [focusedSpecificationId, setFocusedSpecificationId] = useState<string | null>(null)
//   const specificationRefs = useRef<Record<string, HTMLInputElement | null>>({})

//   const safeStationDocuments = stationDocuments || {}

//   // Memoize the specification input renderer to prevent recreation on every render
//   const renderSpecificationInputField = useCallback(
//     (spec: any, stationId: string) => {
//       const specValue = specificationValues[spec.id] || { value: "", unit: spec.unit || "" }
//       const isUploading = uploadingFiles.has(spec.id)
//       const inputType = spec.inputType || spec.type || "TEXT"

//       const handleInputChange = (value: string) => {
//         onSpecificationValueChange(spec.id, value, specValue.unit)
//       }

//       const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0]
//         if (file) {
//           try {
//             await onFileUpload(spec.id, file, stationId, specValue.unit)
//           } catch (error) {
//             console.error("File upload failed:", error)
//           }
//         }
//       }

//       const handleUnitChange = (unitValue: string) => {
//         onSpecificationValueChange(spec.id, specValue.value || "", unitValue)
//       }

//       const handleCheckboxChange = (checked: boolean) => {
//         const value = checked ? "true" : "false"
//         handleInputChange(value)
//       }

//       switch (inputType) {
//         case "TEXT":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Input
//                 ref={(el) => {
//                   specificationRefs.current[spec.id] = el
//                 }}
//                 id={`spec-${spec.id}`}
//                 value={specValue.value}
//                 onChange={(e) => {
//                   setFocusedSpecificationId(spec.id)
//                   handleInputChange(e.target.value)
//                 }}
//                 onFocus={() => setFocusedSpecificationId(spec.id)}
//                 onBlur={() => setFocusedSpecificationId(null)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10"
//               />
//             </div>
//           )
//         case "number":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="flex gap-2">
//                 <Input
//                   ref={(el) => {
//                     specificationRefs.current[spec.id] = el
//                   }}
//                   id={`spec-${spec.id}`}
//                   type="number"
//                   value={specValue.value}
//                   onChange={(e) => {
//                     setFocusedSpecificationId(spec.id)
//                     handleInputChange(e.target.value)
//                   }}
//                   onFocus={() => setFocusedSpecificationId(spec.id)}
//                   onBlur={() => setFocusedSpecificationId(null)}
//                   placeholder={`Enter ${spec.name.toLowerCase()}`}
//                   className="h-10 flex-1"
//                 />
//                 <Input
//                   placeholder="Unit"
//                   value={specValue.unit || ""}
//                   onChange={(e) => handleUnitChange(e.target.value)}
//                   className="h-10 w-20"
//                 />
//               </div>
//             </div>
//           )
//         case "CHECKBOX":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`spec-${spec.id}`}
//                   checked={specValue.value === "true"}
//                   onCheckedChange={handleCheckboxChange}
//                 />
//                 <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                   {spec.name}
//                   {spec.required && <span className="text-green-500 ml-1">*</span>}
//                 </Label>
//               </div>
//             </div>
//           )
//         case "DROPDOWN":
//           const suggestions = spec.suggestions || []
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Select value={specValue.value} onValueChange={handleInputChange}>
//                 <SelectTrigger id={`spec-${spec.id}`} className="h-10">
//                   <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {suggestions.map((suggestion: string, index: number) => (
//                     <SelectItem key={index} value={suggestion}>
//                       {suggestion}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )
//         case "FILE_UPLOAD":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <Input
//                     id={`spec-${spec.id}`}
//                     type="file"
//                     onChange={handleFileChange}
//                     accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
//                     className="cursor-pointer flex-1"
//                     disabled={isUploading}
//                   />
//                   {isUploading && (
//                     <div className="flex items-center gap-2">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
//                       <span className="text-xs text-muted-foreground">Uploading...</span>
//                     </div>
//                   )}
//                 </div>
//                 <Input
//                   placeholder="Unit (optional)"
//                   value={specValue.unit || ""}
//                   onChange={(e) => handleUnitChange(e.target.value)}
//                   className="h-10 w-32"
//                 />
//                 {specValue.fileUrl && (
//                   <div className="flex items-center gap-2">
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="outline"
//                       onClick={(e) => {
//                         e.preventDefault()
//                         e.stopPropagation()
//                         window.open(specValue.fileUrl, "_blank")
//                       }}
//                     >
//                       <Eye className="w-3 h-3 mr-1" />
//                       View File
//                     </Button>
//                   </div>
//                 )}
//                 <p className="text-xs text-muted-foreground">
//                   Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
//                 </p>
//               </div>
//             </div>
//           )
//         default:
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Input
//                 id={`spec-${spec.id}`}
//                 value={specValue.value}
//                 onChange={(e) => handleInputChange(e.target.value)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10"
//               />
//             </div>
//           )
//       }
//     },
//     [specificationValues, uploadingFiles, onSpecificationValueChange, onFileUpload],
//   )

//   // Memoize event handlers to prevent unnecessary re-renders
//   const handleStationClick = useCallback(
//     (stationId: string) => {
//       onActiveStationChange(stationId)
//       if (selectedStationIds.includes(stationId)) {
//         onStationSelectionChange(selectedStationIds.filter((id) => id !== stationId))
//       } else {
//         onStationSelectionChange([...selectedStationIds, stationId])
//       }
//     },
//     [selectedStationIds, onActiveStationChange, onStationSelectionChange],
//   )

//   const handleStationDocumentFileChange = useCallback((stationId: string, file: File | null) => {
//     setStationDocumentFiles((prev) => ({
//       ...prev,
//       [stationId]: {
//         ...prev[stationId],
//         file: file,
//       },
//     }))
//   }, [])

//   const handleStationDocumentDescriptionChange = useCallback((stationId: string, description: string) => {
//     setStationDocumentFiles((prev) => ({
//       ...prev,
//       [stationId]: {
//         ...prev[stationId],
//         description: description,
//       },
//     }))
//   }, [])

//   // Auto-select first station when editing existing MPI
//   useEffect(() => {
//     if (selectedStationIds.length > 0 && !activeStationId) {
//       const firstStationId = selectedStationIds[0]
//       onActiveStationChange(firstStationId)
//       if (stationViewMode !== "specifications") {
//         onStationViewModeChange("specifications")
//       }
//     }
//   }, [selectedStationIds, activeStationId, onActiveStationChange, stationViewMode, onStationViewModeChange])

//   // Load station notes when active station changes
//   useEffect(() => {
//     if (activeStationId) {
//       loadStationNotes(activeStationId)
//     }
//   }, [activeStationId])

//   // Load existing station documents only for the active station and only when documents tab is active
//   useEffect(() => {
//     if (activeStationId && stationViewMode === "documents") {
//       if (!existingStationDocuments[activeStationId]) {
//         loadExistingStationDocuments(activeStationId)
//       }
//     }
//   }, [activeStationId, stationViewMode])

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

//   // Restore focus to specification input after re-render
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

//   // Initialize station notes and documents from available stations
//   useEffect(() => {
//     console.log("🔄 Initializing station notes and documents from available stations")
//     const initialNotes: Record<string, any[]> = {}
//     const initialDocs: Record<string, any[]> = {}
//     availableStations.forEach((station) => {
//       console.log(`📍 Processing station: ${station.stationName} (${station.id})`)
//       let stationNotesArray: any[] = []
//       if (station.Note && Array.isArray(station.Note)) {
//         stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
//           (note, index) => ({
//             id: `note-${station.id}-${index}-${Date.now()}`,
//             content: note,
//             createdAt: new Date().toISOString(),
//             stationId: station.id,
//           }),
//         )
//       } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
//         stationNotesArray = [
//           {
//             id: `note-${station.id}-0-${Date.now()}`,
//             content: station.Note.trim(),
//             createdAt: new Date().toISOString(),
//             stationId: station.id,
//           },
//         ]
//       }

//       initialNotes[station.id] = stationNotesArray

//       let stationDocsArray: any[] = []
//       if (station.documentations && Array.isArray(station.documentations)) {
//         stationDocsArray = station.documentations.filter((doc) => doc && doc.fileUrl)
//       } else if (station.documents && Array.isArray(station.documents)) {
//         stationDocsArray = station.documents.filter((doc) => doc && doc.fileUrl)
//       } else if (station.stationDocuments && Array.isArray(station.stationDocuments)) {
//         stationDocsArray = station.stationDocuments.filter((doc) => doc && doc.fileUrl)
//       }

//       initialDocs[station.id] = stationDocsArray

//       console.log(
//         `✅ Initialized station ${station.id}: ${stationNotesArray.length} notes, ${stationDocsArray.length} docs`,
//       )
//     })

//     setStationNotes(initialNotes)
//     setExistingStationDocuments(initialDocs)
//     console.log("🎯 Station initialization complete:", { initialNotes, initialDocs })
//   }, [availableStations])

//   const loadExistingStationDocuments = async (stationId: string) => {
//     if (loadingDocuments[stationId]) {
//       return
//     }
//     try {
//       setLoadingDocuments((prev) => ({ ...prev, [stationId]: true }))
//       console.log("🔍 Loading existing station documents for station:", stationId)
//       const documents = await StationMpiDocAPI.findAll({ stationId })
//       console.log("📄 Existing station documents loaded for station", stationId, ":", documents)
//       setExistingStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: documents || [],
//       }))
//     } catch (error) {
//       console.error("❌ Failed to load existing station documents for station", stationId, ":", error)
//       toast({
//         title: "Error",
//         description: `Failed to load existing station documents for ${availableStations.find((s) => s.id === stationId)?.stationName || "station"}.`,
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingDocuments((prev) => ({ ...prev, [stationId]: false }))
//     }
//   }

//   const loadStationNotes = async (stationId: string) => {
//     try {
//       setLoadingNotes(true)
//       const station = availableStations.find((s) => s.id === stationId)
//       console.log(`📝 Loading notes for station: ${station?.stationName} (${stationId})`)
//       if (station) {
//         let stationNotesArray: any[] = []
//         if (station.Note && Array.isArray(station.Note)) {
//           stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
//             (note, index) => ({
//               id: `note-${stationId}-${index}-${Date.now()}`,
//               content: note,
//               createdAt: new Date().toISOString(),
//               stationId: stationId,
//             }),
//           )
//           console.log(`📝 Found Note array for station ${stationId}:`, stationNotesArray)
//         } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
//           stationNotesArray = [
//             {
//               id: `note-${stationId}-0-${Date.now()}`,
//               content: station.Note.trim(),
//               createdAt: new Date().toISOString(),
//               stationId: stationId,
//             },
//           ]
//           console.log(`📝 Found single Note for station ${stationId}:`, stationNotesArray)
//         } else if (station.notes && Array.isArray(station.notes)) {
//           stationNotesArray = station.notes
//             .filter((note) => note && (typeof note === "string" || note.content))
//             .map((note, index) => ({
//               id: note.id || `note-${stationId}-${index}-${Date.now()}`,
//               content: typeof note === "string" ? note : note.content,
//               createdAt: note.createdAt || new Date().toISOString(),
//               stationId: stationId,
//             }))
//           console.log(`📝 Found notes array for station ${stationId}:`, stationNotesArray)
//         }

//         setStationNotes((prev) => ({
//           ...prev,
//           [stationId]: stationNotesArray,
//         }))
//         console.log(`✅ Loaded ${stationNotesArray.length} notes for station ${stationId}`)
//       } else {
//         console.log(`⚠️ Station not found: ${stationId}`)
//         setStationNotes((prev) => ({
//           ...prev,
//           [stationId]: [],
//         }))
//       }
//     } catch (error) {
//       console.error("Failed to load station notes:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load station notes.",
//         variant: "destructive",
//       })
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: [],
//       }))
//     } finally {
//       setLoadingNotes(false)
//     }
//   }

//   const handleAddStationNote = async (stationId: string, content: string) => {
//     if (!content.trim()) {
//       toast({
//         title: "Invalid Note",
//         description: "Note content cannot be empty.",
//         variant: "destructive",
//       })
//       return
//     }

//     setAddingNote(true)
//     try {
//       const newNote = {
//         id: `note-${Date.now()}-${Math.random()}`,
//         content: content.trim(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         stationId: stationId,
//         isTemporary: !mpiId, // Mark as temporary if MPI not created yet
//       }

//       // Add to station notes state immediately for UI update
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: [...(prev[stationId] || []), newNote],
//       }))

//       console.log(`✅ Added note for station ${stationId}:`, newNote)
//       toast({
//         title: "Success",
//         description: "Station note added successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to add station note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add station note.",
//         variant: "destructive",
//       })
//     } finally {
//       setAddingNote(false)
//     }
//   }

//   const handleDeleteStationNote = async (stationId: string, noteId: string) => {
//     try {
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: (prev[stationId] || []).filter((note) => note.id !== noteId),
//       }))
//       toast({
//         title: "Success",
//         description: "Station note deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete station note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete station note.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDeleteExistingDocument = async (e: React.MouseEvent, documentId: string, stationId: string) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
//       return
//     }

//     setDeletingDocuments((prev) => new Set(prev).add(documentId))
//     try {
//       console.log("🗑️ Deleting existing station document:", documentId)
//       await StationMpiDocAPI.delete(documentId)
//       console.log("✅ Document deleted successfully")
//       setExistingStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: (prev[stationId] || []).filter((doc) => doc.id !== documentId),
//       }))
//       toast({
//         title: "Success",
//         description: "Document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("❌ Failed to delete document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setDeletingDocuments((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(documentId)
//         return newSet
//       })
//     }
//   }

//   const handleRemoveQueuedDocument = (e: React.MouseEvent, stationId: string, documentIndex: number) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (!confirm("Are you sure you want to remove this queued document?")) {
//       return
//     }
//     try {
//       onStationDocumentRemove(stationId, documentIndex)
//       toast({
//         title: "Success",
//         description: "Document removed from queue.",
//       })
//     } catch (error) {
//       console.error("Failed to remove queued document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to remove document.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleStationDocumentUpload = async (stationId: string, file: File, description: string) => {
//     setUploadingStationDoc(true)
//     try {
//       if (!file) {
//         throw new Error("No file selected")
//       }

//       const finalDescription = description.trim() || file.name
//       console.log("📤 Station document upload request:", {
//         stationId,
//         fileName: file.name,
//         description: finalDescription,
//         mpiId: mpiId || "NOT_CREATED_YET",
//         fileSize: file.size,
//       })

//       if (!mpiId) {
//         console.log("💾 QUEUING station document locally - MPI not created yet...")
//         if (file.size > 10 * 1024 * 1024) {
//           throw new Error("File size exceeds 10MB limit")
//         }

//         // Create new document object
//         const newDoc = {
//           id: `temp-${Date.now()}-${Math.random()}`,
//           file: file,
//           fileUrl: URL.createObjectURL(file), // Create temporary URL for preview
//           description: finalDescription,
//           fileName: file.name,
//           stationId: stationId,
//           isUploaded: false,
//           isTemporary: true,
//         }

//         // Add to existing station documents state
//         setExistingStationDocuments((prev) => ({
//           ...prev,
//           [stationId]: [...(prev[stationId] || []), newDoc],
//         }))

//         // Also call the parent handler
//         await onStationDocumentUpload(stationId, file, finalDescription)

//         toast({
//           title: "✅ Document Queued Successfully",
//           description: `"${finalDescription}" will be uploaded and linked to the MPI when it's created.`,
//         })
//       } else {
//         console.log("📤 Uploading station document directly to existing MPI...")
//         const formData = new FormData()
//         formData.append("files", file)
//         formData.append("stationId", stationId)
//         formData.append("description", finalDescription)
//         formData.append("mpiId", mpiId)
//         formData.append("originalName", file.name)

//         console.log("📤 Sending direct upload request to:", `${API_BASE_URL}/station-mpi-documents/upload`)
//         const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
//           method: "POST",
//           body: formData,
//         })

//         console.log("📥 Direct upload response status:", response.status)
//         if (!response.ok) {
//           const errorText = await response.text()
//           console.error("❌ Direct upload failed:", errorText)
//           throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
//         }

//         const result = await response.json()
//         console.log("✅ Station document uploaded and linked successfully:", result)

//         const document = Array.isArray(result) ? result[0] : result

//         // Add the uploaded document to existing documents state
//         setExistingStationDocuments((prev) => ({
//           ...prev,
//           [stationId]: [
//             ...(prev[stationId] || []),
//             {
//               ...document,
//               isUploaded: true,
//               isExisting: true,
//             },
//           ],
//         }))

//         toast({
//           title: "Success",
//           description: "Station document uploaded and linked to MPI successfully.",
//         })

//         await loadExistingStationDocuments(stationId)
//       }

//       // Clear the file input
//       setStationDocumentFiles((prev) => ({
//         ...prev,
//         [stationId]: { file: null, description: "" },
//       }))
//     } catch (error) {
//       console.error("❌ Station document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingStationDoc(false)
//     }
//   }

//   // Memoize the documents getter to prevent unnecessary recalculations
//   const getStationDocuments = useCallback(
//     (stationId: string) => {
//       const queuedDocuments = safeStationDocuments?.[stationId] || []
//       const existingDocs = existingStationDocuments[stationId] || []
//       console.log(`📄 Getting documents for station ${stationId}:`, {
//         queued: queuedDocuments.length,
//         existing: existingDocs.length,
//         queuedDocs: queuedDocuments,
//         existingDocs: existingDocs,
//       })
//       return {
//         queued: queuedDocuments,
//         existing: existingDocs,
//         all: [
//           ...existingDocs.map((doc) => ({
//             ...doc,
//             isUploaded: doc.isUploaded || !doc.isTemporary,
//             isExisting: !doc.isTemporary,
//           })),
//           ...queuedDocuments,
//         ],
//       }
//     },
//     [safeStationDocuments, existingStationDocuments],
//   )

//   // Memoize the active station to prevent unnecessary re-renders
//   const activeStation = useMemo(() => {
//     return availableStations.find((s) => s.id === activeStationId)
//   }, [availableStations, activeStationId])

//   return (
//     <div className="space-y-6 mt-6">
//       <Card>
//         <CardContent className="space-y-6 mt-5">
//           {loadingStations ? (
//             <div className="flex items-center justify-center py-8">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
//                 <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
//               </div>
//             </div>
//           ) : availableStations.length === 0 ? (
//             <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//               <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
//             </div>
//           ) : (
//             <div className="flex gap-6 min-h-[600px]">
//               {/* Left Sidebar - Station List */}
//               <div className="w-1/4 border rounded-lg bg-gray-50">
//                 <div className="p-3 border-b bg-white rounded-t-lg">
//                   <h4 className="font-medium text-base">Stations</h4>
//                   <p className="text-xs text-muted-foreground">
//                     {selectedStationIds.length > 0
//                       ? `${selectedStationIds.length} selected`
//                       : "Click to select multiple"}
//                   </p>
//                 </div>
//                 <div className="p-2 overflow-y-auto h-[530px]">
//                   <div className="space-y-1">
//                     {availableStations.map((station) => {
//                       const stationDocs = getStationDocuments(station.id)
//                       return (
//                         <div
//                           key={station.id}
//                           className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
//                             selectedStationIds.includes(station.id)
//                               ? "bg-blue-100 text-blue-900 border-blue-300"
//                               : "bg-white hover:bg-gray-100 border-transparent"
//                           } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
//                           onClick={() => handleStationClick(station.id)}
//                         >
//                           <div className="flex items-center justify-between">
//                             <span>{station.stationName}</span>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>
//               </div>

//               {/* Right Panel - Station Specifications and Documents */}
//               <div className="flex-1 border rounded-lg bg-white">
//                 {activeStationId && activeStation ? (
//                   <div className="h-full flex flex-col">
//                     <div className="p-4 border-b bg-white rounded-t-lg">
//                       <div className="flex items-center justify-between">
//                         <h4 className="font-medium text-lg">{activeStation.stationName} Station</h4>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "specifications" ? "default" : "outline"}
//                             onClick={(e) => {
//                               e.preventDefault()
//                               e.stopPropagation()
//                               onStationViewModeChange("specifications")
//                             }}
//                           >
//                             Specifications
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "documents" ? "default" : "outline"}
//                             onClick={(e) => {
//                               e.preventDefault()
//                               e.stopPropagation()
//                               onStationViewModeChange("documents")
//                             }}
//                           >
//                             <FileText className="w-4 h-4 mr-1" />
//                             Files
//                             {(() => {
//                               const activeStationDocs = getStationDocuments(activeStationId)
//                               const docCount = activeStationDocs.all.length
//                               return docCount > 0 ? (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {docCount}
//                                 </Badge>
//                               ) : null
//                             })()}
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "notes" ? "default" : "outline"}
//                             onClick={(e) => {
//                               e.preventDefault()
//                               e.stopPropagation()
//                               onStationViewModeChange("notes")
//                             }}
//                           >
//                             <FileText className="w-4 h-4 mr-1" />
//                             Notes
//                             {(() => {
//                               const noteCount = activeStation?.Note?.length || 0
//                               return noteCount > 0 ? (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {noteCount}
//                                 </Badge>
//                               ) : null
//                             })()}
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-4">
//                       {stationViewMode === "notes" && (
//                         <div className="space-y-6">
//                           {/* Add Note Section */}
//                           {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                             <div className="space-y-4">
//                               <div className="text-center">
//                                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <h4 className="font-medium text-gray-700">Add Station Note</h4>
//                               </div>
//                               <div className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor="station-note-content">Note Content </Label>
//                                   <Textarea
//                                     id="station-note-content"
//                                     placeholder="Enter note content (e.g., Safety procedures, operational instructions, maintenance notes)"
//                                     rows={4}
//                                     disabled={addingNote}
//                                   />
//                                 </div>
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   disabled={addingNote}
//                                   onClick={async (e) => {
//                                     e.preventDefault()
//                                     e.stopPropagation()
//                                     const contentInput = document.getElementById(
//                                       "station-note-content",
//                                     ) as HTMLTextAreaElement
//                                     const content = contentInput?.value?.trim() || ""
//                                     if (!content) {
//                                       toast({
//                                         title: "Missing Content",
//                                         description: "Please enter note content.",
//                                         variant: "destructive",
//                                       })
//                                       return
//                                     }
//                                     await handleAddStationNote(activeStation.id, content)
//                                     contentInput.value = ""
//                                   }}
//                                   className="w-full bg-transparent"
//                                 >
//                                   {addingNote ? (
//                                     <div className="flex items-center gap-2">
//                                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                       Adding Note...
//                                     </div>
//                                   ) : (
//                                     <>
//                                       <Plus className="w-4 h-4 mr-2" />
//                                       Add Note
//                                     </>
//                                   )}
//                                 </Button>
//                               </div>
//                             </div>
//                           </div> */}

//                           {/* Existing Notes */}
//                           <div>
//                             <h4 className="font-medium text-gray-700 mb-4">Station Notes</h4>
//                             {loadingNotes ? (
//                               <div className="flex items-center justify-center py-8">
//                                 <div className="text-center">
//                                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
//                                   <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
//                                 </div>
//                               </div>
//                             ) : (stationNotes[activeStationId] || []).length === 0 ? (
//                               <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                                 <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                 <p className="text-muted-foreground">No notes available for this station.</p>
//                                 <p className="text-sm text-gray-400 mt-1">
//                                   Add operational notes, safety instructions, or maintenance reminders above.
//                                 </p>
//                               </div>
//                             ) : (
//                               <div className="space-y-4">
//                                 {(stationNotes[activeStationId] || []).map((note, index) => (
//                                   <div key={note.id || index} className="p-4 bg-white border rounded-lg shadow-sm">
//                                     <div className="flex items-start justify-between">
//                                       <div className="flex-1 min-w-0">
//                                         <div className="prose prose-sm max-w-none">
//                                           <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
//                                         </div>
//                                         <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
//                                           <span>
//                                             Created:{" "}
//                                             {note.createdAt
//                                               ? new Date(note.createdAt).toLocaleDateString()
//                                               : "Unknown date"}
//                                           </span>
//                                           {note.updatedAt && note.updatedAt !== note.createdAt && (
//                                             <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
//                                           )}
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-2 ml-4">
//                                         <Button
//                                           type="button"
//                                           size="sm"
//                                           variant="outline"
//                                           onClick={(e) => {
//                                             e.preventDefault()
//                                             e.stopPropagation()
//                                             handleDeleteStationNote(activeStation.id, note.id)
//                                           }}
//                                           className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
//                                         >
//                                           <X className="w-3 h-3 mr-1" />
//                                           Delete
//                                         </Button>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {stationViewMode === "documents" && (
//                         <div className="space-y-6">
//                           {/* Document Upload Section */}
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                             <div className="space-y-4">
//                               <div className="text-center">
//                                 <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <h4 className="font-medium text-gray-700">Upload Files</h4>
//                               </div>
//                               <div className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor={`station-doc-file-${activeStationId}`}>Select Files *</Label>
//                                   <Input
//                                     id={`station-doc-file-${activeStationId}`}
//                                     type="file"
//                                     accept="*/*"
//                                     className="cursor-pointer"
//                                     disabled={uploadingStationDoc}
//                                     onChange={(e) => {
//                                       const file = e.target.files?.[0] || null
//                                       handleStationDocumentFileChange(activeStationId, file)
//                                     }}
//                                   />
//                                   {stationDocumentFiles[activeStationId]?.file && (
//                                     <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
//                                       <FileText className="w-4 h-4 text-green-600" />
//                                       <span className="text-sm text-green-800">
//                                         Selected: {stationDocumentFiles[activeStationId].file.name} (
//                                         {(stationDocumentFiles[activeStationId].file.size / 1024 / 1024).toFixed(2)} MB)
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="space-y-2">
//                                   <Label htmlFor={`station-doc-description-${activeStationId}`}>
//                                     Description (Optional)
//                                   </Label>
//                                   <Input
//                                     id={`station-doc-description-${activeStationId}`}
//                                     placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                                     disabled={uploadingStationDoc}
//                                     value={stationDocumentFiles[activeStationId]?.description || ""}
//                                     onChange={(e) => {
//                                       handleStationDocumentDescriptionChange(activeStationId, e.target.value)
//                                     }}
//                                   />
//                                 </div>
//                               </div>
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 disabled={uploadingStationDoc || !stationDocumentFiles[activeStationId]?.file}
//                                 onClick={async (e) => {
//                                   e.preventDefault()
//                                   e.stopPropagation()
//                                   const file = stationDocumentFiles[activeStationId]?.file
//                                   const description = stationDocumentFiles[activeStationId]?.description || ""
//                                   if (!file) {
//                                     toast({
//                                       title: "Missing File",
//                                       description: "Please select a file to upload.",
//                                       variant: "destructive",
//                                     })
//                                     return
//                                   }
//                                   await handleStationDocumentUpload(activeStation.id, file, description)
//                                 }}
//                                 className="w-full bg-transparent"
//                               >
//                                 {uploadingStationDoc ? (
//                                   <div className="flex items-center gap-2">
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                     {mpiId ? "Uploading Document..." : "Queuing Document..."}
//                                   </div>
//                                 ) : (
//                                   <>
//                                     <Upload className="w-4 h-4 mr-2" />
//                                     {mpiId ? "Upload Document" : "Upload"}
//                                   </>
//                                 )}
//                               </Button>
//                             </div>
//                           </div>

//                           {/* Document Summary and List */}
//                           {(() => {
//                             const stationDocs = getStationDocuments(activeStationId)
//                             const { queued: queuedDocuments, existing: existingDocs, all: allDocuments } = stationDocs
//                             return (
//                               <>
//                                 {allDocuments.length > 0 && (
//                                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//                                     <div className="flex items-center gap-2 mb-2">
//                                       <FileText className="w-5 h-5 text-blue-600" />
//                                       <h5 className="font-medium text-blue-900">
//                                         Files Summary for {activeStation.stationName}
//                                       </h5>
//                                     </div>
//                                     <div className="grid grid-cols-3 gap-4 text-sm">
//                                       <div>
//                                         <span className="text-blue-700">Total Files:</span>
//                                         <span className="font-medium ml-2">{allDocuments.length}</span>
//                                       </div>
//                                       <div>
//                                         <span className="text-blue-700">Uploaded:</span>
//                                         <span className="font-medium ml-2">{existingDocs.length}</span>
//                                       </div>
//                                       <div>
//                                         <span className="text-blue-700">Queued:</span>
//                                         <span className="font-medium ml-2">{queuedDocuments.length}</span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 )}
//                                 <div>
//                                   <h4 className="font-medium text-gray-700 mb-4">
//                                     {activeStation.stationName} Station Files
//                                   </h4>
//                                   {loadingDocuments[activeStationId] ? (
//                                     <div className="flex items-center justify-center py-8">
//                                       <div className="text-center">
//                                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
//                                         <p className="mt-2 text-sm text-muted-foreground">Loading files...</p>
//                                       </div>
//                                     </div>
//                                   ) : allDocuments.length === 0 ? (
//                                     <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                                       <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                       <p className="text-muted-foreground">No files available.</p>
//                                     </div>
//                                   ) : (
//                                     <div className="space-y-3">
//                                       {allDocuments.map((doc, index) => (
//                                         <div
//                                           key={doc.id || `queued-${index}`}
//                                           className="p-4 bg-white border rounded-lg shadow-sm"
//                                           onClick={(e) => {
//                                             // Prevent any parent click handlers from firing
//                                             e.preventDefault()
//                                             e.stopPropagation()
//                                           }}
//                                         >
//                                           <div className="flex items-start justify-between">
//                                             <div className="flex items-start gap-3 flex-1">
//                                               <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                                               <div className="flex-1 min-w-0">
//                                                 <h6 className="font-medium text-sm text-gray-900 truncate">
//                                                   {doc.description && doc.description !== doc.fileName
//                                                     ? doc.description
//                                                     : doc.fileName || doc.originalName || "Untitled Document"}
//                                                 </h6>
//                                                 <div className="mt-1 space-y-1">
//                                                   <p className="text-xs text-gray-600">
//                                                     <span className="font-medium">Filename:</span>{" "}
//                                                     {doc.fileName || doc.originalName || "Unknown"}
//                                                   </p>
//                                                   {doc.description && doc.description !== doc.fileName && (
//                                                     <p className="text-xs text-gray-500">
//                                                       <span className="font-medium">Description:</span>{" "}
//                                                       {doc.description}
//                                                     </p>
//                                                   )}
//                                                 </div>
//                                               </div>
//                                             </div>
//                                             <div className="flex items-center gap-2 ml-4">
//                                               {doc.fileUrl && (
//                                                 <Button
//                                                   type="button"
//                                                   size="sm"
//                                                   variant="outline"
//                                                   onClick={(e) => {
//                                                     e.preventDefault()
//                                                     e.stopPropagation()
//                                                     window.open(doc.fileUrl, "_blank")
//                                                   }}
//                                                   className="h-8 px-3"
//                                                 >
//                                                   <Eye className="w-3 h-3 mr-1" />
//                                                   View
//                                                 </Button>
//                                               )}
//                                               <Button
//                                                 type="button"
//                                                 size="sm"
//                                                 variant="outline"
//                                                 disabled={doc.isExisting && deletingDocuments.has(doc.id)}
//                                                 onClick={(e) => {
//                                                   e.preventDefault()
//                                                   e.stopPropagation()
//                                                   if (doc.isExisting) {
//                                                     handleDeleteExistingDocument(e, doc.id, activeStation.id)
//                                                   } else {
//                                                     const queuedIndex = queuedDocuments.findIndex(
//                                                       (qDoc) => qDoc === doc,
//                                                     )
//                                                     if (queuedIndex !== -1) {
//                                                       handleRemoveQueuedDocument(e, activeStation.id, queuedIndex)
//                                                     }
//                                                   }
//                                                 }}
//                                                 className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
//                                               >
//                                                 {doc.isExisting && deletingDocuments.has(doc.id) ? (
//                                                   <div className="flex items-center gap-1">
//                                                     <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
//                                                     <span className="text-xs">Deleting...</span>
//                                                   </div>
//                                                 ) : (
//                                                   <>
//                                                     <X className="w-3 h-3 mr-1" />
//                                                     {doc.isExisting ? "Delete" : "Remove"}
//                                                   </>
//                                                 )}
//                                               </Button>
//                                             </div>
//                                           </div>
//                                         </div>
//                                       ))}
//                                     </div>
//                                   )}
//                                 </div>
//                               </>
//                             )
//                           })()}
//                         </div>
//                       )}

//                       {stationViewMode === "specifications" && (
//                         <div>
//                           {activeStation.specifications && activeStation.specifications.length > 0 ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               {activeStation.specifications.map((spec) => (
//                                 <div key={spec.id} className="space-y-3 p-3 bg-gray-50 rounded border">
//                                   {renderSpecificationInputField(spec, activeStation.id)}
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <div className="text-center py-6 bg-gray-50 rounded border-2 border-dashed">
//                               <p className="text-sm text-muted-foreground">
//                                 No specifications available for this station.
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <div className="text-center">
//                       <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                       <h4 className="font-medium text-gray-600 mb-2">No Station Active</h4>
//                       <p className="text-sm text-muted-foreground">
//                         Click on a station from the left sidebar to view its specifications and documents
//                         {selectedStationIds.length > 0 && (
//                           <span className="block mt-2 text-blue-600 font-medium">
//                             {selectedStationIds.length} station{selectedStationIds.length > 1 ? "s" : ""} selected for
//                             MPI
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Instructions Section */}
//           <div className="mt-8 border-t pt-6">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h4 className="text-lg font-semibold text-green-800">General Instructions</h4>
//                 <p className="text-sm text-muted-foreground">
//                   Add general safety and operational instructions for this MPI
//                 </p>
//               </div>
//               <Button
//                 type="button"
//                 size="sm"
//                 variant="outline"
//                 onClick={(e) => {
//                   e.preventDefault()
//                   e.stopPropagation()
//                   onAddInstruction()
//                   // Focus the new instruction input after it's added
//                   setTimeout(() => {
//                     setFocusedInstructionIndex(instructions.length)
//                   }, 0)
//                 }}
//                 className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Instruction
//               </Button>
//             </div>
//             {instructions.length === 0 ? (
//               <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                 <p className="text-sm text-muted-foreground">No instructions added yet</p>
//                 <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {instructions.map((instruction, index) => (
//                   <div key={`instruction-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
//                     <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
//                       {index + 1}
//                     </div>
//                     <div className="flex-1">
//                       <Input
//                         ref={(el) => {
//                           instructionRefs.current[index] = el
//                         }}
//                         value={instruction}
//                         onChange={(e) => {
//                           setFocusedInstructionIndex(index)
//                           onInstructionChange(index, e.target.value)
//                         }}
//                         onFocus={() => setFocusedInstructionIndex(index)}
//                         onBlur={() => setFocusedInstructionIndex(null)}
//                         placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
//                         className="w-full"
//                       />
//                     </div>
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="ghost"
//                       onClick={(e) => {
//                         e.preventDefault()
//                         e.stopPropagation()
//                         onRemoveInstruction(index)
//                         // Clear focus tracking when removing instruction
//                         setFocusedInstructionIndex(null)
//                       }}
//                       className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-shrink-0"
//                     >
//                       <X className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default InstructionsTab



















// "use client"
// import type React from "react"
// import { useState, useEffect, useCallback, useMemo, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { FileText, Plus, X, Upload, Factory, Eye } from "lucide-react"
// import type { Station } from "../stations/types"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"
// import { useToast } from "@/hooks/use-toast"
// import { Textarea } from "@/components/ui/textarea"
// import { API_BASE_URL } from "@/lib/constants"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// interface SpecificationValue {
//   specificationId: string
//   value: string
//   fileUrl?: string
//   unit?: string
// }

// interface StationDocument {
//   id?: string
//   file?: File
//   fileUrl?: string
//   description: string
//   fileName: string
//   stationId: string
//   isUploaded?: boolean
// }

// interface InstructionsTabProps {
//   availableStations: Station[]
//   selectedStationIds: string[]
//   loadingStations: boolean
//   activeStationId: string | null
//   stationViewMode: "specifications" | "documents" | "notes"
//   specificationValues: Record<string, SpecificationValue>
//   uploadingFiles: Set<string>
//   mpiId?: string
//   onStationSelectionChange: (stationIds: string[]) => void
//   onActiveStationChange: (stationId: string | null) => void
//   onStationViewModeChange: (mode: "specifications" | "documents" | "notes") => void
//   onSpecificationValueChange: (specificationId: string, value: string, unit?: string) => void
//   onFileUpload: (specificationId: string, file: File, stationId: string, unit?: string) => Promise<void>
//   renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
//   renderStationDocuments: (station: Station) => React.ReactNode
//   instructions: string[]
//   onAddInstruction: () => void
//   onInstructionChange: (index: number, value: string) => void
//   onRemoveInstruction: (index: number) => void
//   stationDocuments: Record<string, StationDocument[]>
//   onStationDocumentUpload: (stationId: string, file: File, description: string) => Promise<void>
//   onStationDocumentRemove: (stationId: string, documentIndex: number) => void
// }

// const InstructionsTab: React.FC<InstructionsTabProps> = ({
//   availableStations,
//   selectedStationIds,
//   loadingStations,
//   activeStationId,
//   stationViewMode,
//   specificationValues,
//   uploadingFiles,
//   mpiId,
//   onStationSelectionChange,
//   onActiveStationChange,
//   onStationViewModeChange,
//   onSpecificationValueChange,
//   onFileUpload,
//   renderSpecificationInput,
//   renderStationDocuments,
//   instructions,
//   onAddInstruction,
//   onInstructionChange,
//   onRemoveInstruction,
//   stationDocuments,
//   onStationDocumentUpload,
//   onStationDocumentRemove,
// }) => {
//   const { toast } = useToast()
//   const [uploadingStationDoc, setUploadingStationDoc] = useState(false)
//   const [stationNotes, setStationNotes] = useState<Record<string, any[]>>({})
//   const [loadingNotes, setLoadingNotes] = useState(false)
//   const [addingNote, setAddingNote] = useState(false)
//   const [loadingDocuments, setLoadingDocuments] = useState<Record<string, boolean>>({})
//   const [existingStationDocuments, setExistingStationDocuments] = useState<Record<string, any[]>>({})
//   const [deletingDocuments, setDeletingDocuments] = useState<Set<string>>(new Set())
//   const [stationDocumentFiles, setStationDocumentFiles] = useState<
//     Record<string, { file: File | null; description: string }>
//   >({})

//   // Add focus management for instruction inputs
//   const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
//   const instructionRefs = useRef<(HTMLInputElement | null)[]>([])
//   const [focusedSpecificationId, setFocusedSpecificationId] = useState<string | null>(null)
//   const specificationRefs = useRef<Record<string, HTMLInputElement | null>>({})

//   const safeStationDocuments = stationDocuments || {}

//   // Memoize the specification input renderer to prevent recreation on every render
//   const renderSpecificationInputField = useCallback(
//     (spec: any, stationId: string) => {
//       const specValue = specificationValues[spec.id] || { value: "", unit: spec.unit || "" }
//       const isUploading = uploadingFiles.has(spec.id)
//       const inputType = spec.inputType || spec.type || "TEXT"

//       const handleInputChange = (value: string) => {
//         onSpecificationValueChange(spec.id, value, specValue.unit)
//       }

//       const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0]
//         if (file) {
//           try {
//             await onFileUpload(spec.id, file, stationId, specValue.unit)
//           } catch (error) {
//             console.error("File upload failed:", error)
//           }
//         }
//       }

//       const handleUnitChange = (unitValue: string) => {
//         onSpecificationValueChange(spec.id, specValue.value || "", unitValue)
//       }

//       const handleCheckboxChange = (checked: boolean) => {
//         const value = checked ? "true" : "false"
//         handleInputChange(value)
//       }

//       switch (inputType) {
//         case "TEXT":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Input
//                 ref={(el) => {
//                   specificationRefs.current[spec.id] = el
//                 }}
//                 id={`spec-${spec.id}`}
//                 value={specValue.value}
//                 onChange={(e) => {
//                   setFocusedSpecificationId(spec.id)
//                   handleInputChange(e.target.value)
//                 }}
//                 onFocus={() => setFocusedSpecificationId(spec.id)}
//                 onBlur={() => setFocusedSpecificationId(null)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10"
//               />
//             </div>
//           )
//         case "number":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="flex gap-2">
//                 <Input
//                   ref={(el) => {
//                     specificationRefs.current[spec.id] = el
//                   }}
//                   id={`spec-${spec.id}`}
//                   type="number"
//                   value={specValue.value}
//                   onChange={(e) => {
//                     setFocusedSpecificationId(spec.id)
//                     handleInputChange(e.target.value)
//                   }}
//                   onFocus={() => setFocusedSpecificationId(spec.id)}
//                   onBlur={() => setFocusedSpecificationId(null)}
//                   placeholder={`Enter ${spec.name.toLowerCase()}`}
//                   className="h-10 flex-1"
//                 />
//                 <Input
//                   placeholder="Unit"
//                   value={specValue.unit || ""}
//                   onChange={(e) => handleUnitChange(e.target.value)}
//                   className="h-10 w-20"
//                 />
//               </div>
//             </div>
//           )
//         case "CHECKBOX":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`spec-${spec.id}`}
//                   checked={specValue.value === "true"}
//                   onCheckedChange={handleCheckboxChange}
//                 />
//                 <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                   {spec.name}
//                   {spec.required && <span className="text-green-500 ml-1">*</span>}
//                 </Label>
//               </div>
//             </div>
//           )
//         case "DROPDOWN":
//           const suggestions = spec.suggestions || []
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Select value={specValue.value} onValueChange={handleInputChange}>
//                 <SelectTrigger id={`spec-${spec.id}`} className="h-10">
//                   <SelectValue placeholder={`Select ${spec.name.toLowerCase()}`} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {suggestions.map((suggestion: string, index: number) => (
//                     <SelectItem key={index} value={suggestion}>
//                       {suggestion}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )
//         case "FILE_UPLOAD":
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <Input
//                     id={`spec-${spec.id}`}
//                     type="file"
//                     onChange={handleFileChange}
//                     accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
//                     className="cursor-pointer flex-1"
//                     disabled={isUploading}
//                   />
//                   {isUploading && (
//                     <div className="flex items-center gap-2">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
//                       <span className="text-xs text-muted-foreground">Uploading...</span>
//                     </div>
//                   )}
//                 </div>
//                 <Input
//                   placeholder="Unit (optional)"
//                   value={specValue.unit || ""}
//                   onChange={(e) => handleUnitChange(e.target.value)}
//                   className="h-10 w-32"
//                 />
//                 {specValue.fileUrl && (
//                   <div className="flex items-center gap-2">
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="outline"
//                       onClick={(e) => {
//                         e.preventDefault()
//                         e.stopPropagation()
//                         window.open(specValue.fileUrl, "_blank")
//                       }}
//                     >
//                       <Eye className="w-3 h-3 mr-1" />
//                       View File
//                     </Button>
//                   </div>
//                 )}
//                 <p className="text-xs text-muted-foreground">
//                   Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
//                 </p>
//               </div>
//             </div>
//           )
//         default:
//           return (
//             <div className="space-y-2" key={spec.id}>
//               <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
//                 {spec.name}
//                 {spec.required && <span className="text-green-500 ml-1">*</span>}
//               </Label>
//               {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
//               <Input
//                 id={`spec-${spec.id}`}
//                 value={specValue.value}
//                 onChange={(e) => handleInputChange(e.target.value)}
//                 placeholder={`Enter ${spec.name.toLowerCase()}`}
//                 className="h-10"
//               />
//             </div>
//           )
//       }
//     },
//     [specificationValues, uploadingFiles, onSpecificationValueChange, onFileUpload],
//   )

//   // Memoize event handlers to prevent unnecessary re-renders
//   const handleStationClick = useCallback(
//     (stationId: string) => {
//       onActiveStationChange(stationId)
//       if (selectedStationIds.includes(stationId)) {
//         onStationSelectionChange(selectedStationIds.filter((id) => id !== stationId))
//       } else {
//         onStationSelectionChange([...selectedStationIds, stationId])
//       }
//     },
//     [selectedStationIds, onActiveStationChange, onStationSelectionChange],
//   )

//   const handleStationDocumentFileChange = useCallback((stationId: string, file: File | null) => {
//     setStationDocumentFiles((prev) => ({
//       ...prev,
//       [stationId]: {
//         ...prev[stationId],
//         file: file,
//       },
//     }))
//   }, [])

//   const handleStationDocumentDescriptionChange = useCallback((stationId: string, description: string) => {
//     setStationDocumentFiles((prev) => ({
//       ...prev,
//       [stationId]: {
//         ...prev[stationId],
//         description: description,
//       },
//     }))
//   }, [])

//   // Auto-select first station when editing existing MPI
//   useEffect(() => {
//     if (selectedStationIds.length > 0 && !activeStationId) {
//       const firstStationId = selectedStationIds[0]
//       onActiveStationChange(firstStationId)
//       if (stationViewMode !== "specifications") {
//         onStationViewModeChange("specifications")
//       }
//     }
//   }, [selectedStationIds, activeStationId, onActiveStationChange, stationViewMode, onStationViewModeChange])

//   // Load station notes when active station changes
//   useEffect(() => {
//     if (activeStationId) {
//       loadStationNotes(activeStationId)
//     }
//   }, [activeStationId])

//   // Load existing station documents only for the active station and only when documents tab is active
//   useEffect(() => {
//     if (activeStationId && stationViewMode === "documents") {
//       if (!existingStationDocuments[activeStationId]) {
//         loadExistingStationDocuments(activeStationId)
//       }
//     }
//   }, [activeStationId, stationViewMode])

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

//   // Restore focus to specification input after re-render
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

//   // Initialize station notes and documents from available stations
//   useEffect(() => {
//     console.log("🔄 Initializing station notes and documents from available stations")
//     const initialNotes: Record<string, any[]> = {}
//     const initialDocs: Record<string, any[]> = {}
//     availableStations.forEach((station) => {
//       console.log(`📍 Processing station: ${station.stationName} (${station.id})`)
//       let stationNotesArray: any[] = []
//       if (station.Note && Array.isArray(station.Note)) {
//         stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
//           (note, index) => ({
//             id: `note-${station.id}-${index}-${Date.now()}`,
//             content: note,
//             createdAt: new Date().toISOString(),
//             stationId: station.id,
//           }),
//         )
//       } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
//         stationNotesArray = [
//           {
//             id: `note-${station.id}-0-${Date.now()}`,
//             content: station.Note.trim(),
//             createdAt: new Date().toISOString(),
//             stationId: station.id,
//           },
//         ]
//       }

//       initialNotes[station.id] = stationNotesArray

//       let stationDocsArray: any[] = []
//       if (station.documentations && Array.isArray(station.documentations)) {
//         stationDocsArray = station.documentations.filter((doc) => doc && doc.fileUrl)
//       } else if (station.documents && Array.isArray(station.documents)) {
//         stationDocsArray = station.documents.filter((doc) => doc && doc.fileUrl)
//       } else if (station.stationDocuments && Array.isArray(station.stationDocuments)) {
//         stationDocsArray = station.stationDocuments.filter((doc) => doc && doc.fileUrl)
//       }

//       initialDocs[station.id] = stationDocsArray

//       console.log(
//         `✅ Initialized station ${station.id}: ${stationNotesArray.length} notes, ${stationDocsArray.length} docs`,
//       )
//     })

//     setStationNotes(initialNotes)
//     setExistingStationDocuments(initialDocs)
//     console.log("🎯 Station initialization complete:", { initialNotes, initialDocs })
//   }, [availableStations])

//   const loadExistingStationDocuments = async (stationId: string) => {
//     if (loadingDocuments[stationId]) {
//       return
//     }
//     try {
//       setLoadingDocuments((prev) => ({ ...prev, [stationId]: true }))
//       console.log("🔍 Loading existing station documents for station:", stationId)
//       const documents = await StationMpiDocAPI.findAll({ stationId })
//       console.log("📄 Existing station documents loaded for station", stationId, ":", documents)
//       setExistingStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: documents || [],
//       }))
//     } catch (error) {
//       console.error("❌ Failed to load existing station documents for station", stationId, ":", error)
//       toast({
//         title: "Error",
//         description: `Failed to load existing station documents for ${availableStations.find((s) => s.id === stationId)?.stationName || "station"}.`,
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingDocuments((prev) => ({ ...prev, [stationId]: false }))
//     }
//   }

//   const loadStationNotes = async (stationId: string) => {
//     try {
//       setLoadingNotes(true)
//       const station = availableStations.find((s) => s.id === stationId)
//       console.log(`📝 Loading notes for station: ${station?.stationName} (${stationId})`)
//       if (station) {
//         let stationNotesArray: any[] = []
//         if (station.Note && Array.isArray(station.Note)) {
//           stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
//             (note, index) => ({
//               id: `note-${stationId}-${index}-${Date.now()}`,
//               content: note,
//               createdAt: new Date().toISOString(),
//               stationId: stationId,
//             }),
//           )
//           console.log(`📝 Found Note array for station ${stationId}:`, stationNotesArray)
//         } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
//           stationNotesArray = [
//             {
//               id: `note-${stationId}-0-${Date.now()}`,
//               content: station.Note.trim(),
//               createdAt: new Date().toISOString(),
//               stationId: stationId,
//             },
//           ]
//           console.log(`📝 Found single Note for station ${stationId}:`, stationNotesArray)
//         } else if (station.notes && Array.isArray(station.notes)) {
//           stationNotesArray = station.notes
//             .filter((note) => note && (typeof note === "string" || note.content))
//             .map((note, index) => ({
//               id: note.id || `note-${stationId}-${index}-${Date.now()}`,
//               content: typeof note === "string" ? note : note.content,
//               createdAt: note.createdAt || new Date().toISOString(),
//               stationId: stationId,
//             }))
//           console.log(`📝 Found notes array for station ${stationId}:`, stationNotesArray)
//         }

//         setStationNotes((prev) => ({
//           ...prev,
//           [stationId]: stationNotesArray,
//         }))
//         console.log(`✅ Loaded ${stationNotesArray.length} notes for station ${stationId}`)
//       } else {
//         console.log(`⚠️ Station not found: ${stationId}`)
//         setStationNotes((prev) => ({
//           ...prev,
//           [stationId]: [],
//         }))
//       }
//     } catch (error) {
//       console.error("Failed to load station notes:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load station notes.",
//         variant: "destructive",
//       })
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: [],
//       }))
//     } finally {
//       setLoadingNotes(false)
//     }
//   }

//   const handleAddStationNote = async (stationId: string, content: string) => {
//     if (!content.trim()) {
//       toast({
//         title: "Invalid Note",
//         description: "Note content cannot be empty.",
//         variant: "destructive",
//       })
//       return
//     }

//     setAddingNote(true)
//     try {
//       const newNote = {
//         id: `note-${Date.now()}-${Math.random()}`,
//         content: content.trim(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         stationId: stationId,
//         isTemporary: !mpiId, // Mark as temporary if MPI not created yet
//       }

//       // Add to station notes state immediately for UI update
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: [...(prev[stationId] || []), newNote],
//       }))

//       console.log(`✅ Added note for station ${stationId}:`, newNote)
//       toast({
//         title: "Success",
//         description: "Station note added successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to add station note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add station note.",
//         variant: "destructive",
//       })
//     } finally {
//       setAddingNote(false)
//     }
//   }

//   const handleDeleteStationNote = async (stationId: string, noteId: string) => {
//     try {
//       setStationNotes((prev) => ({
//         ...prev,
//         [stationId]: (prev[stationId] || []).filter((note) => note.id !== noteId),
//       }))
//       toast({
//         title: "Success",
//         description: "Station note deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete station note:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete station note.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDeleteExistingDocument = async (e: React.MouseEvent, documentId: string, stationId: string) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
//       return
//     }

//     setDeletingDocuments((prev) => new Set(prev).add(documentId))
//     try {
//       console.log("🗑️ Deleting existing station document:", documentId)
//       await StationMpiDocAPI.delete(documentId)
//       console.log("✅ Document deleted successfully")
//       setExistingStationDocuments((prev) => ({
//         ...prev,
//         [stationId]: (prev[stationId] || []).filter((doc) => doc.id !== documentId),
//       }))
//       toast({
//         title: "Success",
//         description: "Document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("❌ Failed to delete document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setDeletingDocuments((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(documentId)
//         return newSet
//       })
//     }
//   }

//   const handleRemoveQueuedDocument = (e: React.MouseEvent, stationId: string, documentIndex: number) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (!confirm("Are you sure you want to remove this queued document?")) {
//       return
//     }
//     try {
//       onStationDocumentRemove(stationId, documentIndex)
//       toast({
//         title: "Success",
//         description: "Document removed from queue.",
//       })
//     } catch (error) {
//       console.error("Failed to remove queued document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to remove document.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleStationDocumentUpload = async (stationId: string, file: File, description: string) => {
//     setUploadingStationDoc(true)
//     try {
//       if (!file) {
//         throw new Error("No file selected")
//       }

//       const finalDescription = description.trim() || file.name
//       console.log("📤 Station document upload request:", {
//         stationId,
//         fileName: file.name,
//         description: finalDescription,
//         mpiId: mpiId || "NOT_CREATED_YET",
//         fileSize: file.size,
//       })

//       if (!mpiId) {
//         console.log("💾 QUEUING station document locally - MPI not created yet...")
//         if (file.size > 10 * 1024 * 1024) {
//           throw new Error("File size exceeds 10MB limit")
//         }

//         // Create new document object
//         const newDoc = {
//           id: `temp-${Date.now()}-${Math.random()}`,
//           file: file,
//           fileUrl: URL.createObjectURL(file), // Create temporary URL for preview
//           description: finalDescription,
//           fileName: file.name,
//           stationId: stationId,
//           isUploaded: false,
//           isTemporary: true,
//         }

//         // Add to existing station documents state
//         setExistingStationDocuments((prev) => ({
//           ...prev,
//           [stationId]: [...(prev[stationId] || []), newDoc],
//         }))

//         // Also call the parent handler
//         await onStationDocumentUpload(stationId, file, finalDescription)

//         toast({
//           title: "✅ Document Queued Successfully",
//           description: `"${finalDescription}" will be uploaded and linked to the MPI when it's created.`,
//         })
//       } else {
//         console.log("📤 Uploading station document directly to existing MPI...")
//         const formData = new FormData()
//         formData.append("files", file)
//         formData.append("stationId", stationId)
//         formData.append("description", finalDescription)
//         formData.append("mpiId", mpiId)
//         formData.append("originalName", file.name)

//         console.log("📤 Sending direct upload request to:", `${API_BASE_URL}/station-mpi-documents/upload`)
//         const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
//           method: "POST",
//           body: formData,
//         })

//         console.log("📥 Direct upload response status:", response.status)
//         if (!response.ok) {
//           const errorText = await response.text()
//           console.error("❌ Direct upload failed:", errorText)
//           throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
//         }

//         const result = await response.json()
//         console.log("✅ Station document uploaded and linked successfully:", result)

//         const document = Array.isArray(result) ? result[0] : result

//         // Add the uploaded document to existing documents state
//         setExistingStationDocuments((prev) => ({
//           ...prev,
//           [stationId]: [
//             ...(prev[stationId] || []),
//             {
//               ...document,
//               isUploaded: true,
//               isExisting: true,
//             },
//           ],
//         }))

//         toast({
//           title: "Success",
//           description: "Station document uploaded and linked to MPI successfully.",
//         })

//         // Reload existing documents to get the latest state
//         await loadExistingStationDocuments(stationId)
//       }

//       // Clear the file input
//       setStationDocumentFiles((prev) => ({
//         ...prev,
//         [stationId]: { file: null, description: "" },
//       }))
//     } catch (error) {
//       console.error("❌ Station document upload error:", error)
//       toast({
//         title: "Error",
//         description: error.message || "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setUploadingStationDoc(false)
//     }
//   }

//   // Memoize the documents getter to prevent unnecessary recalculations
//   const getStationDocuments = useCallback(
//     (stationId: string) => {
//       const queuedDocuments = safeStationDocuments?.[stationId] || []
//       const existingDocs = existingStationDocuments[stationId] || []

//       console.log(`📄 Getting documents for station ${stationId}:`, {
//         queued: queuedDocuments.length,
//         existing: existingDocs.length,
//         queuedDocs: queuedDocuments,
//         existingDocs: existingDocs,
//       })

//       // Merge documents, avoiding duplicates
//       const allDocuments = [
//         ...existingDocs.map((doc) => ({
//           ...doc,
//           isUploaded: true,
//           isExisting: true,
//         })),
//         ...queuedDocuments.filter(
//           (queuedDoc) =>
//             // Only include queued docs that aren't already in existing docs
//             !existingDocs.find((existingDoc) => existingDoc.id === queuedDoc.id),
//         ),
//       ]

//       return {
//         queued: queuedDocuments,
//         existing: existingDocs,
//         all: allDocuments,
//       }
//     },
//     [safeStationDocuments, existingStationDocuments],
//   )

//   // Memoize the active station to prevent unnecessary re-renders
//   const activeStation = useMemo(() => {
//     return availableStations.find((s) => s.id === activeStationId)
//   }, [availableStations, activeStationId])

//   return (
//     <div className="space-y-6 mt-6">
//       <Card>
//         <CardContent className="space-y-6 mt-5">
//           {loadingStations ? (
//             <div className="flex items-center justify-center py-8">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
//                 <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
//               </div>
//             </div>
//           ) : availableStations.length === 0 ? (
//             <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//               <p className="text-sm text-yellow-800">No stations available. Create stations first.</p>
//             </div>
//           ) : (
//             <div className="flex gap-6 min-h-[600px]">
//               {/* Left Sidebar - Station List */}
//               <div className="w-1/4 border rounded-lg bg-gray-50">
//                 <div className="p-3 border-b bg-white rounded-t-lg">
//                   <h4 className="font-medium text-base">Stations</h4>
//                   <p className="text-xs text-muted-foreground">
//                     {selectedStationIds.length > 0
//                       ? `${selectedStationIds.length} selected`
//                       : "Click to select multiple"}
//                   </p>
//                 </div>
//                 <div className="p-2 overflow-y-auto h-[530px]">
//                   <div className="space-y-1">
//                     {availableStations.map((station) => {
//                       const stationDocs = getStationDocuments(station.id)
//                       return (
//                         <div
//                           key={station.id}
//                           className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
//                             selectedStationIds.includes(station.id)
//                               ? "bg-blue-100 text-blue-900 border-blue-300"
//                               : "bg-white hover:bg-gray-100 border-transparent"
//                           } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
//                           onClick={() => handleStationClick(station.id)}
//                         >
//                           <div className="flex items-center justify-between">
//                             <span>{station.stationName}</span>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>
//               </div>

//               {/* Right Panel - Station Specifications and Documents */}
//               <div className="flex-1 border rounded-lg bg-white">
//                 {activeStationId && activeStation ? (
//                   <div className="h-full flex flex-col">
//                     <div className="p-4 border-b bg-white rounded-t-lg">
//                       <div className="flex items-center justify-between">
//                         <h4 className="font-medium text-lg">{activeStation.stationName} Station</h4>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "specifications" ? "default" : "outline"}
//                             onClick={(e) => {
//                               e.preventDefault()
//                               e.stopPropagation()
//                               onStationViewModeChange("specifications")
//                             }}
//                           >
//                             Specifications
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "documents" ? "default" : "outline"}
//                             onClick={(e) => {
//                               e.preventDefault()
//                               e.stopPropagation()
//                               onStationViewModeChange("documents")
//                             }}
//                           >
//                             <FileText className="w-4 h-4 mr-1" />
//                             Files
//                             {(() => {
//                               const activeStationDocs = getStationDocuments(activeStationId)
//                               const docCount = activeStationDocs.all.length
//                               return docCount > 0 ? (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {docCount}
//                                 </Badge>
//                               ) : null
//                             })()}
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant={stationViewMode === "notes" ? "default" : "outline"}
//                             onClick={(e) => {
//                               e.preventDefault()
//                               e.stopPropagation()
//                               onStationViewModeChange("notes")
//                             }}
//                           >
//                             <FileText className="w-4 h-4 mr-1" />
//                             Notes
//                             {(() => {
//                               const noteCount = activeStation?.Note?.length || 0
//                               return noteCount > 0 ? (
//                                 <Badge variant="secondary" size="sm" className="ml-1">
//                                   {noteCount}
//                                 </Badge>
//                               ) : null
//                             })()}
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-4">
//                       {stationViewMode === "notes" && (
//                         <div className="space-y-6">
//                           {/* Add Note Section */}
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                             <div className="space-y-4">
//                               <div className="text-center">
//                                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <h4 className="font-medium text-gray-700">Add Station Note</h4>
//                               </div>
//                               <div className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor="station-note-content">Note Content </Label>
//                                   <Textarea
//                                     id="station-note-content"
//                                     placeholder="Enter note content (e.g., Safety procedures, operational instructions, maintenance notes)"
//                                     rows={4}
//                                     disabled={addingNote}
//                                   />
//                                 </div>
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   disabled={addingNote}
//                                   onClick={async (e) => {
//                                     e.preventDefault()
//                                     e.stopPropagation()
//                                     const contentInput = document.getElementById(
//                                       "station-note-content",
//                                     ) as HTMLTextAreaElement
//                                     const content = contentInput?.value?.trim() || ""
//                                     if (!content) {
//                                       toast({
//                                         title: "Missing Content",
//                                         description: "Please enter note content.",
//                                         variant: "destructive",
//                                       })
//                                       return
//                                     }
//                                     await handleAddStationNote(activeStation.id, content)
//                                     contentInput.value = ""
//                                   }}
//                                   className="w-full bg-transparent"
//                                 >
//                                   {addingNote ? (
//                                     <div className="flex items-center gap-2">
//                                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                       Adding Note...
//                                     </div>
//                                   ) : (
//                                     <>
//                                       <Plus className="w-4 h-4 mr-2" />
//                                       Add Note
//                                     </>
//                                   )}
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Existing Notes */}
//                           <div>
//                             <h4 className="font-medium text-gray-700 mb-4">Station Notes</h4>
//                             {loadingNotes ? (
//                               <div className="flex items-center justify-center py-8">
//                                 <div className="text-center">
//                                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
//                                   <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
//                                 </div>
//                               </div>
//                             ) : (stationNotes[activeStationId] || []).length === 0 ? (
//                               <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                                 <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                                 <p className="text-muted-foreground">No notes available for this station.</p>
//                                 <p className="text-sm text-gray-400 mt-1">
//                                   Add operational notes, safety instructions, or maintenance reminders above.
//                                 </p>
//                               </div>
//                             ) : (
//                               <div className="space-y-4">
//                                 {(stationNotes[activeStationId] || []).map((note, index) => (
//                                   <div key={note.id || index} className="p-4 bg-white border rounded-lg shadow-sm">
//                                     <div className="flex items-start justify-between">
//                                       <div className="flex-1 min-w-0">
//                                         <div className="prose prose-sm max-w-none">
//                                           <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
//                                         </div>
//                                         <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
//                                           <span>
//                                             Created:{" "}
//                                             {note.createdAt
//                                               ? new Date(note.createdAt).toLocaleDateString()
//                                               : "Unknown date"}
//                                           </span>
//                                           {note.updatedAt && note.updatedAt !== note.createdAt && (
//                                             <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
//                                           )}
//                                         </div>
//                                       </div>
//                                       <div className="flex items-center gap-2 ml-4">
//                                         <Button
//                                           type="button"
//                                           size="sm"
//                                           variant="outline"
//                                           onClick={(e) => {
//                                             e.preventDefault()
//                                             e.stopPropagation()
//                                             handleDeleteStationNote(activeStation.id, note.id)
//                                           }}
//                                           className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
//                                         >
//                                           <X className="w-3 h-3 mr-1" />
//                                           Delete
//                                         </Button>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {stationViewMode === "documents" && (
//                         <div className="space-y-6">
//                           {/* Document Upload Section */}
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                             <div className="space-y-4">
//                               <div className="text-center">
//                                 <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <h4 className="font-medium text-gray-700">Upload Files</h4>
//                               </div>
//                               <div className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor={`station-doc-file-${activeStationId}`}>Select Files *</Label>
//                                   <Input
//                                     id={`station-doc-file-${activeStationId}`}
//                                     type="file"
//                                     accept="*/*"
//                                     className="cursor-pointer"
//                                     disabled={uploadingStationDoc}
//                                     onChange={(e) => {
//                                       const file = e.target.files?.[0] || null
//                                       handleStationDocumentFileChange(activeStationId, file)
//                                     }}
//                                   />
//                                   {stationDocumentFiles[activeStationId]?.file && (
//                                     <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
//                                       <FileText className="w-4 h-4 text-green-600" />
//                                       <span className="text-sm text-green-800">
//                                         Selected: {stationDocumentFiles[activeStationId].file.name} (
//                                         {(stationDocumentFiles[activeStationId].file.size / 1024 / 1024).toFixed(2)} MB)
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="space-y-2">
//                                   <Label htmlFor={`station-doc-description-${activeStationId}`}>
//                                     Description (Optional)
//                                   </Label>
//                                   <Input
//                                     id={`station-doc-description-${activeStationId}`}
//                                     placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
//                                     disabled={uploadingStationDoc}
//                                     value={stationDocumentFiles[activeStationId]?.description || ""}
//                                     onChange={(e) => {
//                                       handleStationDocumentDescriptionChange(activeStationId, e.target.value)
//                                     }}
//                                   />
//                                 </div>
//                               </div>
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 disabled={uploadingStationDoc || !stationDocumentFiles[activeStationId]?.file}
//                                 onClick={async (e) => {
//                                   e.preventDefault()
//                                   e.stopPropagation()
//                                   const file = stationDocumentFiles[activeStationId]?.file
//                                   const description = stationDocumentFiles[activeStationId]?.description || ""
//                                   if (!file) {
//                                     toast({
//                                       title: "Missing File",
//                                       description: "Please select a file to upload.",
//                                       variant: "destructive",
//                                     })
//                                     return
//                                   }
//                                   await handleStationDocumentUpload(activeStation.id, file, description)
//                                 }}
//                                 className="w-full bg-transparent"
//                               >
//                                 {uploadingStationDoc ? (
//                                   <div className="flex items-center gap-2">
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
//                                     {mpiId ? "Uploading Document..." : "Queuing Document..."}
//                                   </div>
//                                 ) : (
//                                   <>
//                                     <Upload className="w-4 h-4 mr-2" />
//                                     {mpiId ? "Upload Document" : "Upload"}
//                                   </>
//                                 )}
//                               </Button>
//                             </div>
//                           </div>

            

//    {/* Document Summary and List */}
// {(() => {
//   const stationDocs = getStationDocuments(activeStationId)
//   const { queued: queuedDocuments, existing: existingDocs, all: allDocuments } = stationDocs

//   return (
//     <>
//       {allDocuments.length > 0 && (
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//           <div className="flex items-center gap-2 mb-2">
//             <FileText className="w-5 h-5 text-blue-600" />
//             <h5 className="font-medium text-blue-900">
//               Files Summary for {activeStation.stationName}
//             </h5>
//           </div>
//           <div className="grid grid-cols-3 gap-4 text-sm">
//             <div>
//               <span className="text-blue-700">Total Files:</span>
//               <span className="font-medium ml-2">{allDocuments.length}</span>
//             </div>
//             <div>
//               <span className="text-blue-700">Uploaded:</span>
//               <span className="font-medium ml-2">{existingDocs.length}</span>
//             </div>
//             <div>
//               <span className="text-blue-700">Queued:</span>
//               <span className="font-medium ml-2">{queuedDocuments.length}</span>
//             </div>
//           </div>
//         </div>
//       )}

//       <div>
//         <h4 className="font-medium text-gray-700 mb-4">
//           {activeStation.stationName} Station Files
//         </h4>

//         {loadingDocuments[activeStationId] ? (
//           <div className="flex items-center justify-center py-8">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
//               <p className="mt-2 text-sm text-muted-foreground">Loading files...</p>
//             </div>
//           </div>
//         ) : allDocuments.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//             <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-muted-foreground">No files available.</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {allDocuments.map((doc, index) => (
//               <div
//                 key={doc.id || `queued-${index}`}
//                 className="p-4 bg-white border rounded-lg shadow-sm"
//                 onClick={(e) => {
//                   e.preventDefault()
//                   e.stopPropagation()
//                 }}
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-start gap-3 flex-1">
//                     <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                     <div className="flex-1 min-w-0">
//                       <h6 className="font-medium text-sm text-gray-900 truncate">
//                         {doc.fileName || doc.originalName}
//                       </h6>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2 ml-4">
//                     {doc.fileUrl && (
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
//                     )}
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="outline"
//                       disabled={doc.isExisting && deletingDocuments.has(doc.id)}
//                       onClick={(e) => {
//                         e.preventDefault()
//                         e.stopPropagation()
//                         if (doc.isExisting) {
//                           handleDeleteExistingDocument(e, doc.id, activeStation.id)
//                         } else {
//                           const queuedIndex = queuedDocuments.findIndex((qDoc) => qDoc === doc)
//                           if (queuedIndex !== -1) {
//                             handleRemoveQueuedDocument(e, activeStation.id, queuedIndex)
//                           }
//                         }
//                       }}
//                       className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
//                     >
//                       {doc.isExisting && deletingDocuments.has(doc.id) ? (
//                         <div className="flex items-center gap-1">
//                           <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
//                           <span className="text-xs">Deleting...</span>
//                         </div>
//                       ) : (
//                         <>
//                           <X className="w-3 h-3 mr-1" />
//                           {doc.isExisting ? "Delete" : "Remove"}
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   )
// })()}



//                         </div>
//                       )}

//                       {stationViewMode === "specifications" && (
//                         <div>
//                           {activeStation.specifications && activeStation.specifications.length > 0 ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               {activeStation.specifications.map((spec) => (
//                                 <div key={spec.id} className="space-y-3 p-3 bg-gray-50 rounded border">
//                                   {renderSpecificationInputField(spec, activeStation.id)}
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <div className="text-center py-6 bg-gray-50 rounded border-2 border-dashed">
//                               <p className="text-sm text-muted-foreground">
//                                 No specifications available for this station.
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <div className="text-center">
//                       <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                       <h4 className="font-medium text-gray-600 mb-2">No Station Active</h4>
//                       <p className="text-sm text-muted-foreground">
//                         Click on a station from the left sidebar to view its specifications and documents
//                         {selectedStationIds.length > 0 && (
//                           <span className="block mt-2 text-blue-600 font-medium">
//                             {selectedStationIds.length} station{selectedStationIds.length > 1 ? "s" : ""} selected for
//                             MPI
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Instructions Section */}
//           <div className="mt-8 border-t pt-6">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h4 className="text-lg font-semibold text-green-800">General Instructions</h4>
//                 <p className="text-sm text-muted-foreground">
//                   Add general safety and operational instructions for this MPI
//                 </p>
//               </div>
//               <Button
//                 type="button"
//                 size="sm"
//                 variant="outline"
//                 onClick={(e) => {
//                   e.preventDefault()
//                   e.stopPropagation()
//                   onAddInstruction()
//                   // Focus the new instruction input after it's added
//                   setTimeout(() => {
//                     setFocusedInstructionIndex(instructions.length)
//                   }, 0)
//                 }}
//                 className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Instruction
//               </Button>
//             </div>
//             {instructions.length === 0 ? (
//               <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
//                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                 <p className="text-sm text-muted-foreground">No instructions added yet</p>
//                 <p className="text-xs text-gray-400 mt-1">Click "Add Instruction" to get started</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {instructions.map((instruction, index) => (
//                   <div key={`instruction-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
//                     <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-1">
//                       {index + 1}
//                     </div>
//                     <div className="flex-1">
//                       <Input
//                         ref={(el) => {
//                           instructionRefs.current[index] = el
//                         }}
//                         value={instruction}
//                         onChange={(e) => {
//                           setFocusedInstructionIndex(index)
//                           onInstructionChange(index, e.target.value)
//                         }}
//                         onFocus={() => setFocusedInstructionIndex(index)}
//                         onBlur={() => setFocusedInstructionIndex(null)}
//                         placeholder="Enter instruction (e.g., Wear gloves, Do not touch live wires)"
//                         className="w-full"
//                       />
//                     </div>
//                     <Button
//                       type="button"
//                       size="sm"
//                       variant="ghost"
//                       onClick={(e) => {
//                         e.preventDefault()
//                         e.stopPropagation()
//                         onRemoveInstruction(index)
//                         // Clear focus tracking when removing instruction
//                         setFocusedInstructionIndex(null)
//                       }}
//                       className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-shrink-0"
//                     >
//                       <X className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default InstructionsTab












"use client"
import type React from "react"
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, X, Upload, Factory, Eye } from "lucide-react"
import type { Station } from "../stations/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StationMpiDocAPI } from "./station-mpi-doc-api"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { API_BASE_URL } from "@/lib/constants"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SpecificationValue {
  specificationId: string
  value: string
  fileUrl?: string
  unit?: string
}

interface StationDocument {
  id?: string
  file?: File
  fileUrl?: string
  description: string
  fileName: string
  stationId: string
  isUploaded?: boolean
}

interface InstructionsTabProps {
  availableStations: Station[]
  selectedStationIds: string[]
  loadingStations: boolean
  activeStationId: string | null
  stationViewMode: "specifications" | "documents" | "notes"
  specificationValues: Record<string, SpecificationValue>
  uploadingFiles: Set<string>
  mpiId?: string
  onStationSelectionChange: (stationIds: string[]) => void
  onActiveStationChange: (stationId: string | null) => void
  onStationViewModeChange: (mode: "specifications" | "documents" | "notes") => void
  onSpecificationValueChange: (specificationId: string, value: string, unit?: string) => void
  onFileUpload: (specificationId: string, file: File, stationId: string, unit?: string) => Promise<void>
  renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
  renderStationDocuments: (station: Station) => React.ReactNode
  instructions: string[]
  onAddInstruction: () => void
  onInstructionChange: (index: number, value: string) => void
  onRemoveInstruction: (index: number) => void
  stationDocuments: Record<string, StationDocument[]>
  onStationDocumentUpload: (stationId: string, file: File, description: string) => Promise<void>
  onStationDocumentRemove: (stationId: string, documentIndex: number) => void
}

const InstructionsTab: React.FC<InstructionsTabProps> = ({
  availableStations,
  selectedStationIds,
  loadingStations,
  activeStationId,
  stationViewMode,
  specificationValues,
  uploadingFiles,
  mpiId,
  onStationSelectionChange,
  onActiveStationChange,
  onStationViewModeChange,
  onSpecificationValueChange,
  onFileUpload,
  renderSpecificationInput,
  renderStationDocuments,
  instructions,
  onAddInstruction,
  onInstructionChange,
  onRemoveInstruction,
  stationDocuments,
  onStationDocumentUpload,
  onStationDocumentRemove,
}) => {
  const { toast } = useToast()
  const [uploadingStationDoc, setUploadingStationDoc] = useState(false)
  const [stationNotes, setStationNotes] = useState<Record<string, any[]>>({})
  const [loadingNotes, setLoadingNotes] = useState(false)
  const [addingNote, setAddingNote] = useState(false)
  const [loadingDocuments, setLoadingDocuments] = useState<Record<string, boolean>>({})
  const [existingStationDocuments, setExistingStationDocuments] = useState<Record<string, any[]>>({})
  const [deletingDocuments, setDeletingDocuments] = useState<Set<string>>(new Set())
  const [stationDocumentFiles, setStationDocumentFiles] = useState<
    Record<string, { file: File | null; description: string }>
  >({})

  // Add focus management for instruction inputs
  const [focusedInstructionIndex, setFocusedInstructionIndex] = useState<number | null>(null)
  const instructionRefs = useRef<(HTMLInputElement | null)[]>([])
  const [focusedSpecificationId, setFocusedSpecificationId] = useState<string | null>(null)
  const specificationRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const safeStationDocuments = stationDocuments || {}

  // Memoize the specification input renderer to prevent recreation on every render
  const renderSpecificationInputField = useCallback(
    (spec: any, stationId: string) => {
      const specValue = specificationValues[spec.id] || { value: "", unit: spec.unit || "" }
      const isUploading = uploadingFiles.has(spec.id)
      const inputType = spec.inputType || spec.type || "TEXT"

      const handleInputChange = (value: string) => {
        onSpecificationValueChange(spec.id, value, specValue.unit)
      }

      const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
          try {
            await onFileUpload(spec.id, file, stationId, specValue.unit)
          } catch (error) {
            console.error("File upload failed:", error)
          }
        }
      }

      const handleUnitChange = (unitValue: string) => {
        onSpecificationValueChange(spec.id, specValue.value || "", unitValue)
      }

      const handleCheckboxChange = (checked: boolean) => {
        const value = checked ? "true" : "false"
        handleInputChange(value)
      }

      switch (inputType) {
        case "TEXT":
          return (
            <div className="space-y-2" key={spec.id}>
              <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
                {spec.name}
                {spec.required && <span className="text-green-500 ml-1">*</span>}
              </Label>
              {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
              <Input
                ref={(el) => {
                  specificationRefs.current[spec.id] = el
                }}
                id={`spec-${spec.id}`}
                value={specValue.value}
                onChange={(e) => {
                  setFocusedSpecificationId(spec.id)
                  handleInputChange(e.target.value)
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
            <div className="space-y-2" key={spec.id}>
              <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
                {spec.name}
                {spec.required && <span className="text-green-500 ml-1">*</span>}
              </Label>
              {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
              <div className="flex gap-2">
                <Input
                  ref={(el) => {
                    specificationRefs.current[spec.id] = el
                  }}
                  id={`spec-${spec.id}`}
                  type="number"
                  value={specValue.value}
                  onChange={(e) => {
                    setFocusedSpecificationId(spec.id)
                    handleInputChange(e.target.value)
                  }}
                  onFocus={() => setFocusedSpecificationId(spec.id)}
                  onBlur={() => setFocusedSpecificationId(null)}
                  placeholder={`Enter ${spec.name.toLowerCase()}`}
                  className="h-10 flex-1"
                />
                <Input
                  placeholder="Unit"
                  value={specValue.unit || ""}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  className="h-10 w-20"
                />
              </div>
            </div>
          )
        case "CHECKBOX":
          return (
            <div className="space-y-2" key={spec.id}>
              {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`spec-${spec.id}`}
                  checked={specValue.value === "true"}
                  onCheckedChange={handleCheckboxChange}
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
            <div className="space-y-2" key={spec.id}>
              <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
                {spec.name}
                {spec.required && <span className="text-green-500 ml-1">*</span>}
              </Label>
              {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
              <Select value={specValue.value} onValueChange={handleInputChange}>
                <SelectTrigger id={`spec-${spec.id}`} className="h-10">
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
            <div className="space-y-2" key={spec.id}>
              <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
                {spec.name}
                {spec.required && <span className="text-green-500 ml-1">*</span>}
              </Label>
              {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id={`spec-${spec.id}`}
                    type="file"
                    onChange={handleFileChange}
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
                  value={specValue.unit || ""}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  className="h-10 w-32"
                />
                {specValue.fileUrl && (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        window.open(specValue.fileUrl, "_blank")
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View File
                    </Button>
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
            <div className="space-y-2" key={spec.id}>
              <Label htmlFor={`spec-${spec.id}`} className="text-sm font-medium">
                {spec.name}
                {spec.required && <span className="text-green-500 ml-1">*</span>}
              </Label>
              {spec.description && <p className="text-xs text-muted-foreground">{spec.description}</p>}
              <Input
                id={`spec-${spec.id}`}
                value={specValue.value}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={`Enter ${spec.name.toLowerCase()}`}
                className="h-10"
              />
            </div>
          )
      }
    },
    [specificationValues, uploadingFiles, onSpecificationValueChange, onFileUpload],
  )

  // Memoize event handlers to prevent unnecessary re-renders
  const handleStationClick = useCallback(
    (stationId: string) => {
      onActiveStationChange(stationId)
      if (selectedStationIds.includes(stationId)) {
        onStationSelectionChange(selectedStationIds.filter((id) => id !== stationId))
      } else {
        onStationSelectionChange([...selectedStationIds, stationId])
      }
    },
    [selectedStationIds, onActiveStationChange, onStationSelectionChange],
  )

  const handleStationDocumentFileChange = useCallback((stationId: string, file: File | null) => {
    setStationDocumentFiles((prev) => ({
      ...prev,
      [stationId]: {
        ...prev[stationId],
        file: file,
      },
    }))
  }, [])

  const handleStationDocumentDescriptionChange = useCallback((stationId: string, description: string) => {
    setStationDocumentFiles((prev) => ({
      ...prev,
      [stationId]: {
        ...prev[stationId],
        description: description,
      },
    }))
  }, [])

  // Auto-select first station when editing existing MPI
  useEffect(() => {
    if (selectedStationIds.length > 0 && !activeStationId) {
      const firstStationId = selectedStationIds[0]
      onActiveStationChange(firstStationId)
      if (stationViewMode !== "specifications") {
        onStationViewModeChange("specifications")
      }
    }
  }, [selectedStationIds, activeStationId, onActiveStationChange, stationViewMode, onStationViewModeChange])

  // Load station notes when active station changes
  useEffect(() => {
    if (activeStationId) {
      loadStationNotes(activeStationId)
    }
  }, [activeStationId])

  // Load existing station documents only for the active station and only when documents tab is active
  useEffect(() => {
    if (activeStationId && stationViewMode === "documents") {
      if (!existingStationDocuments[activeStationId]) {
        loadExistingStationDocuments(activeStationId)
      }
    }
  }, [activeStationId, stationViewMode])

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

  // Restore focus to specification input after re-render
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

  // Initialize station notes and documents from available stations
  useEffect(() => {
    console.log("🔄 Initializing station notes and documents from available stations")
    const initialNotes: Record<string, any[]> = {}
    const initialDocs: Record<string, any[]> = {}
    availableStations.forEach((station) => {
      console.log(`📍 Processing station: ${station.stationName} (${station.id})`)
      let stationNotesArray: any[] = []
      if (station.Note && Array.isArray(station.Note)) {
        stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
          (note, index) => ({
            id: `note-${station.id}-${index}-${Date.now()}`,
            content: note,
            createdAt: new Date().toISOString(),
            stationId: station.id,
          }),
        )
      } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
        stationNotesArray = [
          {
            id: `note-${station.id}-0-${Date.now()}`,
            content: station.Note.trim(),
            createdAt: new Date().toISOString(),
            stationId: station.id,
          },
        ]
      }
      initialNotes[station.id] = stationNotesArray

      let stationDocsArray: any[] = []
      if (station.documentations && Array.isArray(station.documentations)) {
        stationDocsArray = station.documentations.filter((doc) => doc && doc.fileUrl)
      } else if (station.documents && Array.isArray(station.documents)) {
        stationDocsArray = station.documents.filter((doc) => doc && doc.fileUrl)
      } else if (station.stationDocuments && Array.isArray(station.stationDocuments)) {
        stationDocsArray = station.stationDocuments.filter((doc) => doc && doc.fileUrl)
      }
      initialDocs[station.id] = stationDocsArray

      console.log(
        `✅ Initialized station ${station.id}: ${stationNotesArray.length} notes, ${stationDocsArray.length} docs`,
      )
    })

    setStationNotes(initialNotes)
    setExistingStationDocuments(initialDocs)
    console.log("🎯 Station initialization complete:", { initialNotes, initialDocs })
  }, [availableStations])

  const loadExistingStationDocuments = async (stationId: string) => {
    if (loadingDocuments[stationId]) {
      return
    }
    try {
      setLoadingDocuments((prev) => ({ ...prev, [stationId]: true }))
      console.log("🔍 Loading existing station documents for station:", stationId)
      const documents = await StationMpiDocAPI.findAll({ stationId })
      console.log("📄 Existing station documents loaded for station", stationId, ":", documents)
      setExistingStationDocuments((prev) => ({
        ...prev,
        [stationId]: documents || [],
      }))
    } catch (error) {
      console.error("❌ Failed to load existing station documents for station", stationId, ":", error)
      toast({
        title: "Error",
        description: `Failed to load existing station documents for ${availableStations.find((s) => s.id === stationId)?.stationName || "station"}.`,
        variant: "destructive",
      })
    } finally {
      setLoadingDocuments((prev) => ({ ...prev, [stationId]: false }))
    }
  }

  const loadStationNotes = async (stationId: string) => {
    try {
      setLoadingNotes(true)
      const station = availableStations.find((s) => s.id === stationId)
      console.log(`📝 Loading notes for station: ${station?.stationName} (${stationId})`)
      if (station) {
        let stationNotesArray: any[] = []
        if (station.Note && Array.isArray(station.Note)) {
          stationNotesArray = station.Note.filter((note) => typeof note === "string" && note.trim() !== "").map(
            (note, index) => ({
              id: `note-${stationId}-${index}-${Date.now()}`,
              content: note,
              createdAt: new Date().toISOString(),
              stationId: stationId,
            }),
          )
          console.log(`📝 Found Note array for station ${stationId}:`, stationNotesArray)
        } else if (station.Note && typeof station.Note === "string" && station.Note.trim() !== "") {
          stationNotesArray = [
            {
              id: `note-${stationId}-0-${Date.now()}`,
              content: station.Note.trim(),
              createdAt: new Date().toISOString(),
              stationId: stationId,
            },
          ]
          console.log(`📝 Found single Note for station ${stationId}:`, stationNotesArray)
        } else if (station.notes && Array.isArray(station.notes)) {
          stationNotesArray = station.notes
            .filter((note) => note && (typeof note === "string" || note.content))
            .map((note, index) => ({
              id: note.id || `note-${stationId}-${index}-${Date.now()}`,
              content: typeof note === "string" ? note : note.content,
              createdAt: note.createdAt || new Date().toISOString(),
              stationId: stationId,
            }))
          console.log(`📝 Found notes array for station ${stationId}:`, stationNotesArray)
        }

        setStationNotes((prev) => ({
          ...prev,
          [stationId]: stationNotesArray,
        }))
        console.log(`✅ Loaded ${stationNotesArray.length} notes for station ${stationId}`)
      } else {
        console.log(`⚠️ Station not found: ${stationId}`)
        setStationNotes((prev) => ({
          ...prev,
          [stationId]: [],
        }))
      }
    } catch (error) {
      console.error("Failed to load station notes:", error)
      toast({
        title: "Error",
        description: "Failed to load station notes.",
        variant: "destructive",
      })
      setStationNotes((prev) => ({
        ...prev,
        [stationId]: [],
      }))
    } finally {
      setLoadingNotes(false)
    }
  }

  const handleAddStationNote = async (stationId: string, content: string) => {
    if (!content.trim()) {
      toast({
        title: "Invalid Note",
        description: "Note content cannot be empty.",
        variant: "destructive",
      })
      return
    }

    setAddingNote(true)
    try {
      const newNote = {
        id: `note-${Date.now()}-${Math.random()}`,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stationId: stationId,
        isTemporary: !mpiId, // Mark as temporary if MPI not created yet
      }

      // Add to station notes state immediately for UI update
      setStationNotes((prev) => ({
        ...prev,
        [stationId]: [...(prev[stationId] || []), newNote],
      }))

      console.log(`✅ Added note for station ${stationId}:`, newNote)
      toast({
        title: "Success",
        description: "Station note added successfully.",
      })
    } catch (error) {
      console.error("Failed to add station note:", error)
      toast({
        title: "Error",
        description: "Failed to add station note.",
        variant: "destructive",
      })
    } finally {
      setAddingNote(false)
    }
  }

  const handleDeleteStationNote = async (stationId: string, noteId: string) => {
    try {
      setStationNotes((prev) => ({
        ...prev,
        [stationId]: (prev[stationId] || []).filter((note) => note.id !== noteId),
      }))
      toast({
        title: "Success",
        description: "Station note deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete station note:", error)
      toast({
        title: "Error",
        description: "Failed to delete station note.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteExistingDocument = async (e: React.MouseEvent, documentId: string, stationId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return
    }

    setDeletingDocuments((prev) => new Set(prev).add(documentId))
    try {
      console.log("🗑️ Deleting existing station document:", documentId)
      await StationMpiDocAPI.delete(documentId)
      console.log("✅ Document deleted successfully")
      setExistingStationDocuments((prev) => ({
        ...prev,
        [stationId]: (prev[stationId] || []).filter((doc) => doc.id !== documentId),
      }))
      toast({
        title: "Success",
        description: "Document deleted successfully.",
      })
    } catch (error) {
      console.error("❌ Failed to delete document:", error)
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingDocuments((prev) => {
        const newSet = new Set(prev)
        newSet.delete(documentId)
        return newSet
      })
    }
  }

  const handleRemoveQueuedDocument = (e: React.MouseEvent, stationId: string, documentIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm("Are you sure you want to remove this queued document?")) {
      return
    }
    try {
      onStationDocumentRemove(stationId, documentIndex)
      toast({
        title: "Success",
        description: "Document removed from queue.",
      })
    } catch (error) {
      console.error("Failed to remove queued document:", error)
      toast({
        title: "Error",
        description: "Failed to remove document.",
        variant: "destructive",
      })
    }
  }

  const handleStationDocumentUpload = async (stationId: string, file: File, description: string) => {
    setUploadingStationDoc(true)
    try {
      if (!file) {
        throw new Error("No file selected")
      }

      const finalDescription = description.trim() || file.name

      console.log("📤 Station document upload request:", {
        stationId,
        fileName: file.name,
        description: finalDescription,
        mpiId: mpiId || "NOT_CREATED_YET",
        fileSize: file.size,
      })

      if (!mpiId) {
        console.log("💾 QUEUING station document locally - MPI not created yet...")
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("File size exceeds 10MB limit")
        }

        // Only call the parent handler to add to queue - don't add to existingStationDocuments
        await onStationDocumentUpload(stationId, file, finalDescription)

        toast({
          title: "✅ Document Queued Successfully",
          description: `"${finalDescription}" will be uploaded and linked to the MPI when it's created.`,
        })
      } else {
        console.log("📤 Uploading station document directly to existing MPI...")
        const formData = new FormData()
        formData.append("files", file)
        formData.append("stationId", stationId)
        formData.append("description", finalDescription)
        formData.append("mpiId", mpiId)
        formData.append("originalName", file.name)

        console.log("📤 Sending direct upload request to:", `${API_BASE_URL}/station-mpi-documents/upload`)
        const response = await fetch(`${API_BASE_URL}/station-mpi-documents/upload`, {
          method: "POST",
          body: formData,
        })

        console.log("📥 Direct upload response status:", response.status)
        if (!response.ok) {
          const errorText = await response.text()
          console.error("❌ Direct upload failed:", errorText)
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
        }

        const result = await response.json()
        console.log("✅ Station document uploaded and linked successfully:", result)

        const document = Array.isArray(result) ? result[0] : result

        // Add the uploaded document to existing documents state
        setExistingStationDocuments((prev) => ({
          ...prev,
          [stationId]: [
            ...(prev[stationId] || []),
            {
              ...document,
              isUploaded: true,
              isExisting: true,
            },
          ],
        }))

        toast({
          title: "Success",
          description: "Station document uploaded and linked to MPI successfully.",
        })

        // Reload existing documents to get the latest state
        await loadExistingStationDocuments(stationId)
      }

      // Clear the file input
      setStationDocumentFiles((prev) => ({
        ...prev,
        [stationId]: { file: null, description: "" },
      }))
    } catch (error) {
      console.error("❌ Station document upload error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to upload station document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingStationDoc(false)
    }
  }

  // Memoize the documents getter to prevent unnecessary recalculations
  const getStationDocuments = useCallback(
    (stationId: string) => {
      const queuedDocuments = safeStationDocuments?.[stationId] || []
      const existingDocs = existingStationDocuments[stationId] || []

      console.log(`📄 Getting documents for station ${stationId}:`, {
        queued: queuedDocuments.length,
        existing: existingDocs.length,
        queuedDocs: queuedDocuments,
        existingDocs: existingDocs,
      })

      // Merge documents, avoiding duplicates
      const allDocuments = [
        ...existingDocs.map((doc) => ({
          ...doc,
          isUploaded: true,
          isExisting: true,
        })),
        ...queuedDocuments.filter(
          (queuedDoc) =>
            // Only include queued docs that aren't already in existing docs
            !existingDocs.find((existingDoc) => existingDoc.id === queuedDoc.id),
        ),
      ]

      return {
        queued: queuedDocuments,
        existing: existingDocs,
        all: allDocuments,
      }
    },
    [safeStationDocuments, existingStationDocuments],
  )

  // Memoize the active station to prevent unnecessary re-renders
  const activeStation = useMemo(() => {
    return availableStations.find((s) => s.id === activeStationId)
  }, [availableStations, activeStationId])

  return (
    <div className="space-y-6 mt-6">
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
                    {selectedStationIds.length > 0
                      ? `${selectedStationIds.length} selected`
                      : "Click to select multiple"}
                  </p>
                </div>
                <div className="p-2 overflow-y-auto h-[530px]">
                  <div className="space-y-1">
                    {availableStations.map((station) => {
                      const stationDocs = getStationDocuments(station.id)
                      return (
                        <div
                          key={station.id}
                          className={`p-2 rounded cursor-pointer transition-all text-sm border-2 ${
                            selectedStationIds.includes(station.id)
                              ? "bg-blue-100 text-blue-900 border-blue-300"
                              : "bg-white hover:bg-gray-100 border-transparent"
                          } ${activeStationId === station.id ? "ring-2 ring-purple-400 ring-offset-1" : ""}`}
                          onClick={() => handleStationClick(station.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{station.stationName}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Right Panel - Station Specifications and Documents */}
              <div className="flex-1 border rounded-lg bg-white">
                {activeStationId && activeStation ? (
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b bg-white rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-lg">{activeStation.stationName} Station</h4>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={stationViewMode === "specifications" ? "default" : "outline"}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              onStationViewModeChange("specifications")
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
                              onStationViewModeChange("documents")
                            }}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Files
                            {(() => {
                              const activeStationDocs = getStationDocuments(activeStationId)
                              const docCount = activeStationDocs.all.length
                              return docCount > 0 ? (
                                <Badge variant="secondary" size="sm" className="ml-1">
                                  {docCount}
                                </Badge>
                              ) : null
                            })()}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={stationViewMode === "notes" ? "default" : "outline"}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              onStationViewModeChange("notes")
                            }}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Notes
                            {(() => {
                              const noteCount = activeStation?.Note?.length || 0
                              return noteCount > 0 ? (
                                <Badge variant="secondary" size="sm" className="ml-1">
                                  {noteCount}
                                </Badge>
                              ) : null
                            })()}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      {stationViewMode === "notes" && (
                        <div className="space-y-6">
                          {/* Add Note Section */}
                          {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                            <div className="space-y-4">
                              <div className="text-center">
                                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <h4 className="font-medium text-gray-700">Add Station Note</h4>
                              </div>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="station-note-content">Note Content </Label>
                                  <Textarea
                                    id="station-note-content"
                                    placeholder="Enter note content (e.g., Safety procedures, operational instructions, maintenance notes)"
                                    rows={4}
                                    disabled={addingNote}
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={addingNote}
                                  onClick={async (e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    const contentInput = document.getElementById(
                                      "station-note-content",
                                    ) as HTMLTextAreaElement
                                    const content = contentInput?.value?.trim() || ""
                                    if (!content) {
                                      toast({
                                        title: "Missing Content",
                                        description: "Please enter note content.",
                                        variant: "destructive",
                                      })
                                      return
                                    }
                                    await handleAddStationNote(activeStation.id, content)
                                    contentInput.value = ""
                                  }}
                                  className="w-full bg-transparent"
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
                            </div>
                          </div> */}

                          {/* Existing Notes */}
                          <div>
                            <h4 className="font-medium text-gray-700 mb-4">Station Notes</h4>
                            {loadingNotes ? (
                              <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                                  <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
                                </div>
                              </div>
                            ) : (stationNotes[activeStationId] || []).length === 0 ? (
                              <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-muted-foreground">No notes available for this station.</p>
                                <p className="text-sm text-gray-400 mt-1">
                                  Add operational notes, safety instructions, or maintenance reminders above.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {(stationNotes[activeStationId] || []).map((note, index) => (
                                  <div key={note.id || index} className="p-4 bg-white border rounded-lg shadow-sm">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1 min-w-0">
                                        <div className="prose prose-sm max-w-none">
                                          <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
                                        </div>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                          <span>
                                            Created:{" "}
                                            {note.createdAt
                                              ? new Date(note.createdAt).toLocaleDateString()
                                              : "Unknown date"}
                                          </span>
                                          {note.updatedAt && note.updatedAt !== note.createdAt && (
                                            <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                                          )}
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
                                            handleDeleteStationNote(activeStation.id, note.id)
                                          }}
                                          className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
                                        >
                                          <X className="w-3 h-3 mr-1" />
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {stationViewMode === "documents" && (
                        <div className="space-y-6">
                          {/* Document Upload Section */}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                            <div className="space-y-4">
                              <div className="text-center">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <h4 className="font-medium text-gray-700">Upload Files</h4>
                              </div>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`station-doc-file-${activeStationId}`}>Select Files *</Label>
                                  <Input
                                    id={`station-doc-file-${activeStationId}`}
                                    type="file"
                                    accept="*/*"
                                    className="cursor-pointer"
                                    disabled={uploadingStationDoc}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] || null
                                      handleStationDocumentFileChange(activeStationId, file)
                                    }}
                                  />
                                  {stationDocumentFiles[activeStationId]?.file && (
                                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                                      <FileText className="w-4 h-4 text-green-600" />
                                      <span className="text-sm text-green-800">
                                        Selected: {stationDocumentFiles[activeStationId].file.name} (
                                        {(stationDocumentFiles[activeStationId].file.size / 1024 / 1024).toFixed(2)} MB)
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`station-doc-description-${activeStationId}`}>
                                    Description (Optional)
                                  </Label>
                                  <Input
                                    id={`station-doc-description-${activeStationId}`}
                                    placeholder="Enter document description (e.g., Safety Manual, Wiring Diagram)"
                                    disabled={uploadingStationDoc}
                                    value={stationDocumentFiles[activeStationId]?.description || ""}
                                    onChange={(e) => {
                                      handleStationDocumentDescriptionChange(activeStationId, e.target.value)
                                    }}
                                  />
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                disabled={uploadingStationDoc || !stationDocumentFiles[activeStationId]?.file}
                                onClick={async (e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  const file = stationDocumentFiles[activeStationId]?.file
                                  const description = stationDocumentFiles[activeStationId]?.description || ""
                                  if (!file) {
                                    toast({
                                      title: "Missing File",
                                      description: "Please select a file to upload.",
                                      variant: "destructive",
                                    })
                                    return
                                  }
                                  await handleStationDocumentUpload(activeStation.id, file, description)
                                }}
                                className="w-full bg-transparent"
                              >
                                {uploadingStationDoc ? (
                                  <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                    {mpiId ? "Uploading Document..." : "Queuing Document..."}
                                  </div>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    {mpiId ? "Upload Document" : "Upload"}
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Document Summary and List */}
                          {(() => {
                            const stationDocs = getStationDocuments(activeStationId)
                            const { queued: queuedDocuments, existing: existingDocs, all: allDocuments } = stationDocs
                            return (
                              <>
                                {allDocuments.length > 0 && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <FileText className="w-5 h-5 text-blue-600" />
                                      <h5 className="font-medium text-blue-900">
                                        Files Summary for {activeStation.stationName}
                                      </h5>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <span className="text-blue-700">Total Files:</span>
                                        <span className="font-medium ml-2">{allDocuments.length}</span>
                                      </div>
                                      <div>
                                        <span className="text-blue-700">Uploaded:</span>
                                        <span className="font-medium ml-2">{existingDocs.length}</span>
                                      </div>
                                      <div>
                                        <span className="text-blue-700">Queued:</span>
                                        <span className="font-medium ml-2">{queuedDocuments.length}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <h4 className="font-medium text-gray-700 mb-4">
                                    {activeStation.stationName} Station Files
                                  </h4>
                                  {loadingDocuments[activeStationId] ? (
                                    <div className="flex items-center justify-center py-8">
                                      <div className="text-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                                        <p className="mt-2 text-sm text-muted-foreground">Loading files...</p>
                                      </div>
                                    </div>
                                  ) : allDocuments.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
                                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                      <p className="text-muted-foreground">No files available.</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                      {allDocuments.map((doc, index) => (
                                        <div
                                          key={doc.id || `queued-${index}`}
                                          className="p-4 bg-white border rounded-lg shadow-sm"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                          }}
                                        >
                                          <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3 flex-1">
                                              <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                              <div className="flex-1 min-w-0">
                                                <h6 className="font-medium text-sm text-gray-900 truncate">
                                                  {doc.fileName || doc.originalName}
                                                </h6>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                              {doc.fileUrl && (
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
                                              )}
                                              <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={doc.isExisting && deletingDocuments.has(doc.id)}
                                                onClick={(e) => {
                                                  e.preventDefault()
                                                  e.stopPropagation()
                                                  if (doc.isExisting) {
                                                    handleDeleteExistingDocument(e, doc.id, activeStation.id)
                                                  } else {
                                                    const queuedIndex = queuedDocuments.findIndex(
                                                      (qDoc) => qDoc === doc,
                                                    )
                                                    if (queuedIndex !== -1) {
                                                      handleRemoveQueuedDocument(e, activeStation.id, queuedIndex)
                                                    }
                                                  }
                                                }}
                                                className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
                                              >
                                                {doc.isExisting && deletingDocuments.has(doc.id) ? (
                                                  <div className="flex items-center gap-1">
                                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                                                    <span className="text-xs">Deleting...</span>
                                                  </div>
                                                ) : (
                                                  <>
                                                    <X className="w-3 h-3 mr-1" />
                                                    {doc.isExisting ? "Delete" : "Remove"}
                                                  </>
                                                )}
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </>
                            )
                          })()}
                        </div>
                      )}

                      {stationViewMode === "specifications" && (
                        <div>
                          {activeStation.specifications && activeStation.specifications.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {activeStation.specifications.map((spec) => (
                                <div key={spec.id} className="space-y-3 p-3 bg-gray-50 rounded border">
                                  {renderSpecificationInputField(spec, activeStation.id)}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 bg-gray-50 rounded border-2 border-dashed">
                              <p className="text-sm text-muted-foreground">
                                No specifications available for this station.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="font-medium text-gray-600 mb-2">No Station Active</h4>
                      <p className="text-sm text-muted-foreground">
                        Click on a station from the left sidebar to view its specifications and documents
                        {selectedStationIds.length > 0 && (
                          <span className="block mt-2 text-blue-600 font-medium">
                            {selectedStationIds.length} station{selectedStationIds.length > 1 ? "s" : ""} selected for
                            MPI
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions Section */}
          <div className="mt-8 border-t pt-6">
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
                  <div key={`instruction-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
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
}

export default InstructionsTab








