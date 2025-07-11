


// "use client"

// import { useState } from "react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent } from "@/components/ui/card"
// import { StationBasicInfo } from "./station-basic-info"
// import { StationSpecifications } from "./station-specifications"
// import { StationDocumentation } from "./station-documentation"
// import { StationFlowcharts } from "./station-flowcharts"
// import type { Station, CreateStationDto } from "./types"
// import { ArrowLeft } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { StationAPI } from "./station-api"
// import { useToast } from "@/hooks/use-toast"

// interface StationFormTabsProps {
//   onCancel: () => void
//   isLoading?: boolean
//   existingStations?: Station[]
// }

// export function StationFormTabs({ onCancel, isLoading, existingStations = [] }: StationFormTabsProps) {
//   const router = useRouter()
//   const { toast } = useToast()
//   const [activeTab, setActiveTab] = useState("basic")
//   const [submitting, setSubmitting] = useState(false)
//   const [formData, setFormData] = useState<{
//     stationId: string
//     stationName: string
//     location: string
//     status: "active"
//     description: string
//     operator: string
//     priority: number | null
//     notes: string[]
//     specifications: any[]
//     documentations: any[]
//     flowcharts: any[]
//   }>({
//     // Basic Info - Empty for new station
//     stationId: "",
//     stationName: "",
//     location: "",
//     status: "active",
//     description: "",
//     operator: "",
//     priority: null,
//     notes: [],
//     // Specifications - Empty for new station
//     specifications: [],
//     // Documentation - Empty for new station
//     documentations: [],
//     // Flowcharts - Empty for new station
//     flowcharts: [],
//   })

//   const handleBasicInfoChange = (field: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleSpecificationsChange = (specifications: any[]) => {
//     setFormData((prev) => ({ ...prev, specifications }))
//   }

//   const handleDocumentationChange = (documentations: any[]) => {
//     setFormData((prev) => ({ ...prev, documentations }))
//   }

//   const handleFlowchartsChange = (flowcharts: any[]) => {
//     setFormData((prev) => ({ ...prev, flowcharts }))
//   }

//   const validateStationId = (stationId: string): boolean => {
//     if (!stationId.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Station ID is required.",
//         variant: "destructive",
//       })
//       return false
//     }

//     // Check if station ID already exists
//     const existingStation = existingStations.find(
//       (s) => s.stationId.toLowerCase() === stationId.toLowerCase() && !s.isDeleted,
//     )
//     if (existingStation) {
//       toast({
//         title: "Validation Error",
//         description: `Station ID "${stationId}" already exists. Please use a different Station ID.`,
//         variant: "destructive",
//       })
//       return false
//     }

//     return true
//   }

//   const validateStationName = (stationName: string): boolean => {
//     if (!stationName.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Station Name is required.",
//         variant: "destructive",
//       })
//       return false
//     }

//     // Check if station name already exists
//     const existingStation = existingStations.find(
//       (s) => s.stationName.toLowerCase() === stationName.toLowerCase() && !s.isDeleted,
//     )
//     if (existingStation) {
//       toast({
//         title: "Validation Error",
//         description: `Station Name "${stationName}" already exists. Please use a different Station Name.`,
//         variant: "destructive",
//       })
//       return false
//     }

//     return true
//   }

//   const handleSubmit = async () => {
//     if (submitting) return // Prevent double submission

//     setSubmitting(true)

//     try {
//       // Validate required fields
//       if (!validateStationId(formData.stationId)) {
//         setActiveTab("basic")
//         return
//       }

//       if (!validateStationName(formData.stationName)) {
//         setActiveTab("basic")
//         return
//       }

//       // Prepare specifications data for backend (backend handles slug generation)
//       const specificationsForBackend = formData.specifications
//         .filter((spec: any) => spec.isNew) // Only send new specifications
//         .map((spec: any) => ({
//           name: spec.originalName || spec.name?.replace(/_\d+_\d+_[a-z0-9]+$/, "") || spec.name?.trim() || "",
//           inputType: spec.inputType || "TEXT",
//           suggestions: spec.inputType === "DROPDOWN" ? spec.options || [] : [],
//           required: spec.inputType === "CHECKBOX" ? true : false,
//         }))

//       // Validate specifications
//       for (const spec of specificationsForBackend) {
//         if (!spec.name) {
//           toast({
//             title: "Validation Error",
//             description: "All specifications must have a name.",
//             variant: "destructive",
//           })
//           setActiveTab("specifications")
//           return
//         }

//         if (spec.inputType === "DROPDOWN" && spec.suggestions.length === 0) {
//           toast({
//             title: "Validation Error",
//             description: `Dropdown specification "${spec.name}" requires at least one option.`,
//             variant: "destructive",
//           })
//           setActiveTab("specifications")
//           return
//         }
//       }

//       // Prepare documentations for backend (without files, just metadata)
//       const documentationsForBackend = formData.documentations
//         .filter((doc: any) => doc.isNew)
//         .map((doc: any) => ({
//           description: doc.description || (doc.file ? doc.file.name : ""),
//           fileUrl: "", // Empty for now, files won't be uploaded
//         }))

//       // Prepare flowcharts for backend (without files, just metadata)
//       const flowchartsForBackend = formData.flowcharts
//         .filter((flow: any) => flow.isNew)
//         .map((flow: any) => ({
//           description: flow.description || (flow.file ? flow.file.name : ""),
//           fileUrl: "", // Empty for now, files won't be uploaded
//         }))

//       // CREATE new station - Use POST method
//       const createData: CreateStationDto = {
//         stationId: formData.stationId.trim(),
//         stationName: formData.stationName.trim(),
//         location: formData.location.trim() || "",
//         status: formData.status,
//         description: formData.description?.trim() || "",
//         operator: formData.operator?.trim() || "",
//         priority: formData.priority,
//         Note: formData.notes.length > 0 ? formData.notes : [],
//         specifications: specificationsForBackend,
//         documentations: documentationsForBackend,
//         flowcharts: flowchartsForBackend,
//       }

//       console.log("CREATING new station with data:", createData)
//       const savedStation = await StationAPI.createStation(createData)
//       console.log("Station created successfully:", savedStation)

//       // Handle file uploads for FILE_UPLOAD type specifications after station creation
//       await handleSpecificationFileUploads(savedStation.id)

//       // Show success message with note about files
//       const hasFiles =
//         formData.documentations.some((doc: any) => doc.isNew && doc.file) ||
//         formData.flowcharts.some((flow: any) => flow.isNew && flow.file)

//       if (hasFiles) {
//         toast({
//           title: "Station Created",
//           description:
//             "Station created successfully! Note: Documentation and flowchart files were not uploaded as file upload endpoints are not available.",
//         })
//       } else {
//         toast({
//           title: "Success",
//           description: "Station created successfully!",
//         })
//       }

//       // Navigate to station details page
//       router.push(`/dashboard/stations/${savedStation.id}`)
//     } catch (error: any) {
//       console.error("Error creating station:", error)

//       // Handle specific error types
//       if (error.message?.includes("Unique constraint failed") || error.message?.includes("stationId")) {
//         toast({
//           title: "Duplicate Station ID",
//           description: `Station ID "${formData.stationId}" already exists. Please use a different Station ID.`,
//           variant: "destructive",
//         })
//         setActiveTab("basic")
//       } else if (error.message?.includes("500") || error.message?.includes("Internal server error")) {
//         toast({
//           title: "Server Error",
//           description: "Internal server error occurred. Please check the server logs and try again.",
//           variant: "destructive",
//         })
//       } else if (error.message?.includes("Each specification must have a name")) {
//         toast({
//           title: "Validation Error",
//           description: "All specifications must have a name. Please check your specifications.",
//           variant: "destructive",
//         })
//         setActiveTab("specifications")
//       } else if (error.message?.includes("requires suggestions")) {
//         toast({
//           title: "Validation Error",
//           description: "Dropdown specifications require at least one suggestion/option.",
//           variant: "destructive",
//         })
//         setActiveTab("specifications")
//       } else {
//         toast({
//           title: "Error",
//           description: error.message || "Failed to create station. Please try again.",
//           variant: "destructive",
//         })
//       }
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleSpecificationFileUploads = async (stationId: string) => {
//     try {
//       const fileUploadSpecs = formData.specifications.filter(
//         (spec: any) => spec.inputType === "FILE_UPLOAD" && spec.fileValue && spec.isNew,
//       )

//       for (const spec of fileUploadSpecs) {
//         try {
//           // Find the created specification by name to get its ID
//           const stationData = await StationAPI.getStationById(stationId)
//           const createdSpec = stationData.specifications?.find((s: any) => s.name === spec.name)

//           if (createdSpec && spec.fileValue) {
//             const result = await StationAPI.uploadStationSpecificationFile(
//               spec.fileValue,
//               createdSpec.id,
//               stationId,
//               spec.unit,
//             )
//             console.log("Specification file uploaded:", result)
//           }
//         } catch (uploadError) {
//           console.error(`Failed to upload file for specification ${spec.name}:`, uploadError)
//           toast({
//             title: "Warning",
//             description: `Failed to upload file for specification "${spec.name}".`,
//             variant: "destructive",
//           })
//         }
//       }
//     } catch (error) {
//       console.error("Error handling specification file uploads:", error)
//     }
//   }

//   const handleBack = () => {
//     router.push("/dashboard/stations")
//   }

//   const currentIsLoading = isLoading || submitting

//   return (
//     <div className="space-y-6 w-full">
//       {/* Header */}
//       <div className="flex items-center justify-between w-full">
//         <div>
//           <h1 className="text-2xl font-bold text-red-600">Create Station</h1>
//         </div>
//         <Button variant="outline" size="sm" onClick={handleBack} disabled={currentIsLoading}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back
//         </Button>
//       </div>

//       <Card className="w-full">
//         <CardContent className="p-6">
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-4">
//               <TabsTrigger value="basic">Basic Info</TabsTrigger>
//               <TabsTrigger value="specifications">
//                 Specifications ({formData.specifications.length})
//                 {formData.specifications.length > 0 && <span className="ml-1 text-xs text-green-600">✓</span>}
//               </TabsTrigger>
//               <TabsTrigger value="documentation">
//                 Documentation ({formData.documentations.length})
//                 {formData.documentations.length > 0 && <span className="ml-1 text-xs text-orange-600">⚠</span>}
//               </TabsTrigger>
//               <TabsTrigger value="flowcharts">
//                 Flowcharts ({formData.flowcharts.length})
//                 {formData.flowcharts.length > 0 && <span className="ml-1 text-xs text-orange-600">⚠</span>}
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="basic" className="mt-6">
//               <StationBasicInfo
//                 data={{
//                   stationId: formData.stationId,
//                   stationName: formData.stationName,
//                   location: formData.location,
//                   status: formData.status,
//                   description: formData.description,
//                   operator: formData.operator,
//                   priority: formData.priority,
//                   notes: formData.notes,
//                 }}
//                 onChange={handleBasicInfoChange}
//                 onSubmit={handleSubmit}
//                 onCancel={handleBack}
//                 isLoading={currentIsLoading}
//                 isEdit={false}
//                 existingStations={existingStations}
//               />
//             </TabsContent>

//             <TabsContent value="specifications" className="mt-6">
//               <StationSpecifications
//                 specifications={formData.specifications}
//                 onChange={handleSpecificationsChange}
//                 stationId={undefined}
//                 onSubmit={handleSubmit}
//                 onCancel={handleBack}
//                 isLoading={currentIsLoading}
//                 isEdit={false}
//               />
//             </TabsContent>

//             <TabsContent value="documentation" className="mt-6">
//               <StationDocumentation
//                 documentations={formData.documentations}
//                 onChange={handleDocumentationChange}
//                 stationId={undefined}
//                 onSubmit={handleSubmit}
//                 onCancel={handleBack}
//                 isLoading={currentIsLoading}
//                 isEdit={false}
//               />
//             </TabsContent>

//             <TabsContent value="flowcharts" className="mt-6">
//               <StationFlowcharts
//                 flowcharts={formData.flowcharts}
//                 onChange={handleFlowchartsChange}
//                 stationId={undefined}
//                 onSubmit={handleSubmit}
//                 onCancel={handleBack}
//                 isLoading={currentIsLoading}
//                 isEdit={false}
//               />
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }















// "use client"

// import { useState } from "react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent } from "@/components/ui/card"
// import { StationBasicInfo } from "./station-basic-info"
// import { StationSpecifications } from "./station-specifications"
// import { StationDocumentation } from "./station-documentation"
// import { StationNotes } from "./station-notes"
// import type { Station, CreateStationDto } from "./types"
// import { ArrowLeft } from 'lucide-react'
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { StationAPI } from "./station-api"
// import { useToast } from "@/hooks/use-toast"
// import StationFlowcharts from "./station-flowcharts"

// interface StationFormTabsProps {
//   onCancel: () => void
//   isLoading?: boolean
//   existingStations?: Station[]
// }

// export function StationFormTabs({ onCancel, isLoading, existingStations = [] }: StationFormTabsProps) {
//   const router = useRouter()
//   const { toast } = useToast()
//   const [activeTab, setActiveTab] = useState("basic")
//   const [submitting, setSubmitting] = useState(false)
//   const [formData, setFormData] = useState<{
//     stationId: string
//     stationName: string
//     location: string
//     status: "active"
//     description: string
//     operator: string
//     priority: number | null
//     notes: string[]
//     specifications: any[]
//     documentations: any[]
//     flowcharts: any[]
//   }>({
//     // Basic Info - Empty for new station
//     stationId: "",
//     stationName: "",
//     location: "",
//     status: "active",
//     description: "",
//     operator: "",
//     priority: null,
//     notes: [],
//     // Specifications - Empty for new station
//     specifications: [],
//     // Documentation - Empty for new station
//     documentations: [],
//     // Flowcharts - Empty for new station
//     flowcharts: [],
//   })

//   const handleBasicInfoChange = (field: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleSpecificationsChange = (specifications: any[]) => {
//     setFormData((prev) => ({ ...prev, specifications }))
//   }

//   const handleDocumentationChange = (documentations: any[]) => {
//     setFormData((prev) => ({ ...prev, documentations }))
//   }

//   const handleFlowchartsChange = (flowcharts: any[]) => {
//     setFormData((prev) => ({ ...prev, flowcharts }))
//   }

//   const handleNotesChange = (notes: string[]) => {
//     setFormData((prev) => ({ ...prev, notes }))
//   }

//   const validateStationId = (stationId: string): boolean => {
//     if (!stationId.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Station ID is required.",
//         variant: "destructive",
//       })
//       return false
//     }

//     // Check if station ID already exists
//     const existingStation = existingStations.find(
//       (s) => s.stationId.toLowerCase() === stationId.toLowerCase() && !s.isDeleted,
//     )
//     if (existingStation) {
//       toast({
//         title: "Validation Error",
//         description: `Station ID "${stationId}" already exists. Please use a different Station ID.`,
//         variant: "destructive",
//       })
//       return false
//     }

//     return true
//   }

//   const validateStationName = (stationName: string): boolean => {
//     if (!stationName.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Station Name is required.",
//         variant: "destructive",
//       })
//       return false
//     }

//     // Check if station name already exists
//     const existingStation = existingStations.find(
//       (s) => s.stationName.toLowerCase() === stationName.toLowerCase() && !s.isDeleted,
//     )
//     if (existingStation) {
//       toast({
//         title: "Validation Error",
//         description: `Station Name "${stationName}" already exists. Please use a different Station Name.`,
//         variant: "destructive",
//       })
//       return false
//     }

//     return true
//   }

//   const handleSubmit = async () => {
//     if (submitting) return // Prevent double submission

//     setSubmitting(true)

//     try {
//       // Validate required fields
//       if (!validateStationId(formData.stationId)) {
//         setActiveTab("basic")
//         return
//       }

//       if (!validateStationName(formData.stationName)) {
//         setActiveTab("basic")
//         return
//       }

//       // Prepare specifications data for backend (backend handles slug generation)
//       const specificationsForBackend = formData.specifications
//         .filter((spec: any) => spec.isNew) // Only send new specifications
//         .map((spec: any) => ({
//           name: spec.originalName || spec.name?.replace(/_\d+_\d+_[a-z0-9]+$/, "") || spec.name?.trim() || "",
//           inputType: spec.inputType || "TEXT",
//           suggestions: spec.inputType === "DROPDOWN" ? spec.options || [] : [],
//           required: spec.inputType === "CHECKBOX" ? true : false,
//         }))

//       // Validate specifications
//       for (const spec of specificationsForBackend) {
//         if (!spec.name) {
//           toast({
//             title: "Validation Error",
//             description: "All specifications must have a name.",
//             variant: "destructive",
//           })
//           setActiveTab("specifications")
//           return
//         }

//         if (spec.inputType === "DROPDOWN" && spec.suggestions.length === 0) {
//           toast({
//             title: "Validation Error",
//             description: `Dropdown specification "${spec.name}" requires at least one option.`,
//             variant: "destructive",
//           })
//           setActiveTab("specifications")
//           return
//         }
//       }

//       // Prepare documentations for backend (without files, just metadata)
//       const documentationsForBackend = formData.documentations
//         .filter((doc: any) => doc.isNew)
//         .map((doc: any) => ({
//           description: doc.description || (doc.file ? doc.file.name : ""),
//           fileUrl: "", // Empty for now, files won't be uploaded
//         }))

//       // Prepare flowcharts for backend (without files, just metadata)
//       const flowchartsForBackend = formData.flowcharts
//         .filter((flow: any) => flow.isNew)
//         .map((flow: any) => ({
//           description: flow.description || (flow.file ? flow.file.name : ""),
//           fileUrl: "", // Empty for now, files won't be uploaded
//         }))

//       // CREATE new station - Use POST method
//       const createData: CreateStationDto = {
//         stationId: formData.stationId.trim(),
//         stationName: formData.stationName.trim(),
//         location: formData.location.trim() || "",
//         status: formData.status,
//         description: formData.description?.trim() || "",
//         operator: formData.operator?.trim() || "",
//         priority: formData.priority,
//         Note: formData.notes.length > 0 ? formData.notes : [],
//         specifications: specificationsForBackend,
//         documentations: documentationsForBackend,
//         flowcharts: flowchartsForBackend,
//       }

//       console.log("CREATING new station with data:", createData)
//       const savedStation = await StationAPI.createStation(createData)
//       console.log("Station created successfully:", savedStation)

//       // Handle file uploads for FILE_UPLOAD type specifications after station creation
//       await handleSpecificationFileUploads(savedStation.id)

//       // Show success message with note about files
//       const hasFiles =
//         formData.documentations.some((doc: any) => doc.isNew && doc.file) ||
//         formData.flowcharts.some((flow: any) => flow.isNew && flow.file)

//       if (hasFiles) {
//         toast({
//           title: "Station Created",
//           description:
//             "Station created successfully! Note: Documentation and flowchart files were not uploaded as file upload endpoints are not available.",
//         })
//       } else {
//         toast({
//           title: "Success",
//           description: "Station created successfully!",
//         })
//       }

//       // Navigate to station details page
//       router.push(`/dashboard/stations/${savedStation.id}`)
//     } catch (error: any) {
//       console.error("Error creating station:", error)

//       // Handle specific error types
//       if (error.message?.includes("Unique constraint failed") || error.message?.includes("stationId")) {
//         toast({
//           title: "Duplicate Station ID",
//           description: `Station ID "${formData.stationId}" already exists. Please use a different Station ID.`,
//           variant: "destructive",
//         })
//         setActiveTab("basic")
//       } else if (error.message?.includes("500") || error.message?.includes("Internal server error")) {
//         toast({
//           title: "Server Error",
//           description: "Internal server error occurred. Please check the server logs and try again.",
//           variant: "destructive",
//         })
//       } else if (error.message?.includes("Each specification must have a name")) {
//         toast({
//           title: "Validation Error",
//           description: "All specifications must have a name. Please check your specifications.",
//           variant: "destructive",
//         })
//         setActiveTab("specifications")
//       } else if (error.message?.includes("requires suggestions")) {
//         toast({
//           title: "Validation Error",
//           description: "Dropdown specifications require at least one suggestion/option.",
//           variant: "destructive",
//         })
//         setActiveTab("specifications")
//       } else {
//         toast({
//           title: "Error",
//           description: error.message || "Failed to create station. Please try again.",
//           variant: "destructive",
//         })
//       }
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleSpecificationFileUploads = async (stationId: string) => {
//     try {
//       const fileUploadSpecs = formData.specifications.filter(
//         (spec: any) => spec.inputType === "FILE_UPLOAD" && spec.fileValue && spec.isNew,
//       )

//       for (const spec of fileUploadSpecs) {
//         try {
//           // Find the created specification by name to get its ID
//           const stationData = await StationAPI.getStationById(stationId)
//           const createdSpec = stationData.specifications?.find((s: any) => s.name === spec.name)

//           if (createdSpec && spec.fileValue) {
//             const result = await StationAPI.uploadStationSpecificationFile(
//               spec.fileValue,
//               createdSpec.id,
//               stationId,
//               spec.unit,
//             )
//             console.log("Specification file uploaded:", result)
//           }
//         } catch (uploadError) {
//           console.error(`Failed to upload file for specification ${spec.name}:`, uploadError)
//           toast({
//             title: "Warning",
//             description: `Failed to upload file for specification "${spec.name}".`,
//             variant: "destructive",
//           })
//         }
//       }
//     } catch (error) {
//       console.error("Error handling specification file uploads:", error)
//     }
//   }

//   const handleBack = () => {
//     router.push("/dashboard/stations")
//   }

//   const currentIsLoading = isLoading || submitting

//   return (
//     <div className="space-y-6 w-full">
//       {/* Header */}
//       <div className="flex items-center justify-between w-full">
//         <div>
//           <h1 className="text-2xl font-bold text-red-600">Create Station</h1>
//         </div>
//         <Button variant="outline" size="sm" onClick={handleBack} disabled={currentIsLoading}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back
//         </Button>
//       </div>

//       <Card className="w-full">
//         <CardContent className="p-6">
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-5">
//               <TabsTrigger value="basic">Basic Info</TabsTrigger>
//               <TabsTrigger value="specifications">
//                 Specifications ({formData.specifications.length})
//                 {formData.specifications.length > 0 && <span className="ml-1 text-xs text-green-600">✓</span>}
//               </TabsTrigger>
//               <TabsTrigger value="notes">
//                 Notes ({formData.notes.length})
//                 {formData.notes.length > 0 && <span className="ml-1 text-xs text-green-600">✓</span>}
//               </TabsTrigger>
//               <TabsTrigger value="documentation">
//                 Documentation ({formData.documentations.length})
//                 {formData.documentations.length > 0 && <span className="ml-1 text-xs text-orange-600">⚠</span>}
//               </TabsTrigger>
//               <TabsTrigger value="flowcharts">
//                 Flowcharts ({formData.flowcharts.length})
//                 {formData.flowcharts.length > 0 && <span className="ml-1 text-xs text-orange-600">⚠</span>}
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="basic" className="mt-6">
//               <StationBasicInfo
//                 data={{
//                   stationId: formData.stationId,
//                   stationName: formData.stationName,
//                   location: formData.location,
//                   status: formData.status,
//                   description: formData.description,
//                   operator: formData.operator,
//                   priority: formData.priority,
//                   notes: [], // Remove notes from basic info
//                 }}
//                 onChange={handleBasicInfoChange}
//                 onSubmit={handleSubmit}
//                 onCancel={handleBack}
//                 isLoading={currentIsLoading}
//                 isEdit={false}
//                 existingStations={existingStations}
//               />
//             </TabsContent>

//             <TabsContent value="specifications" className="mt-6">
//               <StationSpecifications
//                 specifications={formData.specifications}
//                 onChange={handleSpecificationsChange}
//                 stationId={undefined}
//                 onSubmit={handleSubmit}
//                 onCancel={handleBack}
//                 isLoading={currentIsLoading}
//                 isEdit={false}
//               />
//             </TabsContent>

//             <TabsContent value="notes" className="mt-6">
//               <StationNotes
//                 notes={formData.notes}
//                 onChange={handleNotesChange}
//                 onSubmit={handleSubmit}
//                 onCancel={handleBack}
//                 isLoading={currentIsLoading}
//                 isEdit={false}
//               />
//             </TabsContent>

//             <TabsContent value="documentation" className="mt-6">
//               <StationDocumentation
//                 documentations={formData.documentations}
//                 onChange={handleDocumentationChange}
//                 stationId={undefined}
//                 onSubmit={handleSubmit}
//                 onCancel={handleBack}
//                 isLoading={currentIsLoading}
//                 isEdit={false}
//               />
//             </TabsContent>

//             <TabsContent value="flowcharts" className="mt-6">
//               <StationFlowcharts
//                 flowcharts={formData.flowcharts}
//                 onChange={handleFlowchartsChange}
//                 stationId={undefined}
//                 onSubmit={handleSubmit}
//                 onCancel={handleBack}
//                 isLoading={currentIsLoading}
//                 isEdit={false}
//               />
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }






// "use client"

// import { useState } from "react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent } from "@/components/ui/card"
// import { StationBasicInfo } from "./station-basic-info"
// import { StationSpecifications } from "./station-specifications"
// import { StationDocumentation } from "./station-documentation"
// import { StationNotes } from "./station-notes"
// import type { Station, CreateStationDto } from "./types"
// import { ArrowLeft } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { StationAPI } from "./station-api"
// import { useToast } from "@/hooks/use-toast"
// import StationFlowcharts from "./station-flowcharts"

// interface StationFormTabsProps {
//   onCancel: () => void
//   isLoading?: boolean
//   existingStations?: Station[]
// }

// export function StationFormTabs({ onCancel, isLoading, existingStations = [] }: StationFormTabsProps) {
//   const router = useRouter()
//   const { toast } = useToast()
//   const [activeTab, setActiveTab] = useState("basic")
//   const [submitting, setSubmitting] = useState(false)
//   const [formData, setFormData] = useState<{
//     stationId: string
//     stationName: string
//     location: string
//     status: "active"
//     description: string
//     operator: string
//     priority: number | null
//     notes: string[]
//     specifications: any[]
//     documentations: any[]
//     flowcharts: any[]
//   }>({
//     // Basic Info - Empty for new station
//     stationId: "",
//     stationName: "",
//     location: "",
//     status: "active",
//     description: "",
//     operator: "",
//     priority: null,
//     notes: [],
//     // Specifications - Empty for new station
//     specifications: [],
//     // Documentation - Empty for new station
//     documentations: [],
//     // Flowcharts - Empty for new station
//     flowcharts: [],
//   })

//   const handleBasicInfoChange = (field: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleSpecificationsChange = (specifications: any[]) => {
//     setFormData((prev) => ({ ...prev, specifications }))
//   }

//   const handleDocumentationChange = (documentations: any[]) => {
//     setFormData((prev) => ({ ...prev, documentations }))
//   }

//   const handleFlowchartsChange = (flowcharts: any[]) => {
//     setFormData((prev) => ({ ...prev, flowcharts }))
//   }

//   const handleNotesChange = (notes: string[]) => {
//     setFormData((prev) => ({ ...prev, notes }))
//   }

//   const validateStationId = (stationId: string): boolean => {
//     if (!stationId.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Station ID is required.",
//         variant: "destructive",
//       })
//       return false
//     }

//     // Check if station ID already exists
//     const existingStation = existingStations.find(
//       (s) => s.stationId.toLowerCase() === stationId.toLowerCase() && !s.isDeleted,
//     )
//     if (existingStation) {
//       toast({
//         title: "Validation Error",
//         description: `Station ID "${stationId}" already exists. Please use a different Station ID.`,
//         variant: "destructive",
//       })
//       return false
//     }

//     return true
//   }

//   const validateStationName = (stationName: string): boolean => {
//     if (!stationName.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Station Name is required.",
//         variant: "destructive",
//       })
//       return false
//     }

//     // Check if station name already exists
//     const existingStation = existingStations.find(
//       (s) => s.stationName.toLowerCase() === stationName.toLowerCase() && !s.isDeleted,
//     )
//     if (existingStation) {
//       toast({
//         title: "Validation Error",
//         description: `Station Name "${stationName}" already exists. Please use a different Station Name.`,
//         variant: "destructive",
//       })
//       return false
//     }

//     return true
//   }

//   const handleSubmit = async () => {
//     if (submitting) return // Prevent double submission

//     setSubmitting(true)

//     try {
//       // Validate required fields
//       if (!validateStationId(formData.stationId)) {
//         setActiveTab("basic")
//         return
//       }

//       if (!validateStationName(formData.stationName)) {
//         setActiveTab("basic")
//         return
//       }

//       // Prepare specifications data for backend (backend handles slug generation)
//       const specificationsForBackend = formData.specifications
//         .filter((spec: any) => spec.isNew) // Only send new specifications
//         .map((spec: any) => ({
//           name: spec.originalName || spec.name?.replace(/_\d+_\d+_[a-z0-9]+$/, "") || spec.name?.trim() || "",
//           inputType: spec.inputType || "TEXT",
//           suggestions: spec.inputType === "DROPDOWN" ? spec.options || [] : [],
//           required: spec.inputType === "CHECKBOX" ? true : false,
//         }))

//       // Validate specifications
//       for (const spec of specificationsForBackend) {
//         if (!spec.name) {
//           toast({
//             title: "Validation Error",
//             description: "All specifications must have a name.",
//             variant: "destructive",
//           })
//           setActiveTab("specifications")
//           return
//         }

//         if (spec.inputType === "DROPDOWN" && spec.suggestions.length === 0) {
//           toast({
//             title: "Validation Error",
//             description: `Dropdown specification "${spec.name}" requires at least one option.`,
//             variant: "destructive",
//           })
//           setActiveTab("specifications")
//           return
//         }
//       }

//       // Prepare documentations for backend (only those with actual files)
//       const documentationsForBackend = formData.documentations
//         .filter((doc: any) => doc.isNew && doc.fileUrl && doc.fileUrl.trim() !== "") // Only include docs with actual file URLs
//         .map((doc: any) => ({
//           description: doc.description || (doc.file ? doc.file.name : ""),
//           fileUrl: doc.fileUrl, // This will have the actual file URL
//         }))

//       // Prepare flowcharts for backend (only those with actual files)
//       const flowchartsForBackend = formData.flowcharts
//         .filter((flow: any) => flow.isNew && flow.fileUrl && flow.fileUrl.trim() !== "") // Only include flowcharts with actual file URLs
//         .map((flow: any) => ({
//           description: flow.description || flow.filename || (flow.file ? flow.file.name : ""),
//           fileUrl: flow.fileUrl, // This will have the actual file URL
//         }))

//       console.log("Documentations for backend:", documentationsForBackend)
//       console.log("Flowcharts for backend:", flowchartsForBackend)

//       // Prepare flowcharts for backend (without files, just metadata)
//       // const flowchartsForBackend = formData.flowcharts
//       //   .filter((flow: any) => flow.isNew)
//       //   .map((flow: any) => ({
//       //     description: flow.description || flow.filename || (flow.file ? flow.file.name : ""),
//       //     fileUrl: "", // Empty for now, files won't be uploaded during creation
//       //   }))

//       // CREATE new station - Use POST method
//       const createData: CreateStationDto = {
//         stationId: formData.stationId.trim(),
//         stationName: formData.stationName.trim(),
//         location: formData.location.trim() || "",
//         status: formData.status,
//         description: formData.description?.trim() || "",
//         operator: formData.operator?.trim() || "",
//         priority: formData.priority,
//         Note: formData.notes.length > 0 ? formData.notes : [],
//         specifications: specificationsForBackend,
//         documentations: documentationsForBackend,
//         flowcharts: flowchartsForBackend,
//       }

//       console.log("CREATING new station with data:", createData)
//       const savedStation = await StationAPI.createStation(createData)
//       console.log("Station created successfully:", savedStation)

//       // Handle file uploads for FILE_UPLOAD type specifications after station creation
//       await handleSpecificationFileUploads(savedStation.id)

//       // Show success message with note about files
//       const hasFiles =
//         formData.documentations.some((doc: any) => doc.isNew && doc.file) ||
//         formData.flowcharts.some((flow: any) => flow.isNew && flow.file)

//       if (hasFiles) {
//         toast({
//           title: "Station Created",
//           description:
//             "Station created successfully! Note: Documentation and flowchart files were not uploaded as they require the station to exist first. Please edit the station to upload files.",
//         })
//       } else {
//         toast({
//           title: "Success",
//           description: "Station created successfully!",
//         })
//       }

//       // Navigate to station details page
//       router.push(`/dashboard/stations/${savedStation.id}`)
//     } catch (error: any) {
//       console.error("Error creating station:", error)

//       // Handle specific error types
//       if (error.message?.includes("Unique constraint failed") || error.message?.includes("stationId")) {
//         toast({
//           title: "Duplicate Station ID",
//           description: `Station ID "${formData.stationId}" already exists. Please use a different Station ID.`,
//           variant: "destructive",
//         })
//         setActiveTab("basic")
//       } else if (error.message?.includes("500") || error.message?.includes("Internal server error")) {
//         toast({
//           title: "Server Error",
//           description: "Internal server error occurred. Please check the server logs and try again.",
//           variant: "destructive",
//         })
//       } else if (error.message?.includes("Each specification must have a name")) {
//         toast({
//           title: "Validation Error",
//           description: "All specifications must have a name. Please check your specifications.",
//           variant: "destructive",
//         })
//         setActiveTab("specifications")
//       } else if (error.message?.includes("requires suggestions")) {
//         toast({
//           title: "Validation Error",
//           description: "Dropdown specifications require at least one suggestion/option.",
//           variant: "destructive",
//         })
//         setActiveTab("specifications")
//       } else {
//         toast({
//           title: "Error",
//           description: error.message || "Failed to create station. Please try again.",
//           variant: "destructive",
//         })
//       }
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleSpecificationFileUploads = async (stationId: string) => {
//     try {
//       const fileUploadSpecs = formData.specifications.filter(
//         (spec: any) => spec.inputType === "FILE_UPLOAD" && spec.fileValue && spec.isNew,
//       )

//       for (const spec of fileUploadSpecs) {
//         try {
//           // Find the created specification by name to get its ID
//           const stationData = await StationAPI.getStationById(stationId)
//           const createdSpec = stationData.specifications?.find((s: any) => s.name === spec.name)

//           if (createdSpec && spec.fileValue) {
//             const result = await StationAPI.uploadStationSpecificationFile(
//               spec.fileValue,
//               createdSpec.id,
//               stationId,
//               spec.unit,
//             )
//             console.log("Specification file uploaded:", result)
//           }
//         } catch (uploadError) {
//           console.error(`Failed to upload file for specification ${spec.name}:`, uploadError)
//           toast({
//             title: "Warning",
//             description: `Failed to upload file for specification "${spec.name}".`,
//             variant: "destructive",
//           })
//         }
//       }
//     } catch (error) {
//       console.error("Error handling specification file uploads:", error)
//     }
//   }

//   const handleBack = () => {
//     router.push("/dashboard/stations")
//   }

//   const currentIsLoading = isLoading || submitting

//   return (
//     <div className="space-y-6 w-full">
//       {/* Header */}
//       <div className="flex items-center justify-between w-full">
//         <div>
//           <h1 className="text-2xl font-bold text-red-600">Create Station</h1>
//         </div>
//         <Button variant="outline" size="sm" onClick={handleBack} disabled={currentIsLoading}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back
//         </Button>
//       </div>

//       <Card className="w-full">
//         <CardContent className="p-6">
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-5">
//               <TabsTrigger value="basic">Basic Info</TabsTrigger>
//               <TabsTrigger value="specifications">
//                 Specifications ({formData.specifications.length})
//                 {formData.specifications.length > 0 && <span className="ml-1 text-xs text-green-600">✓</span>}
//               </TabsTrigger>
//               <TabsTrigger value="notes">
//                 Notes ({formData.notes.length})
//                 {formData.notes.length > 0 && <span className="ml-1 text-xs text-green-600">✓</span>}
//               </TabsTrigger>
//               <TabsTrigger value="documentation">
//                 Files ({formData.documentations.length})
//                 {formData.documentations.length > 0 && <span className="ml-1 text-xs text-orange-600">⚠</span>}
//               </TabsTrigger>
//               <TabsTrigger value="flowcharts">
//                 Flowcharts ({formData.flowcharts.length})
//                 {formData.flowcharts.length > 0 && <span className="ml-1 text-xs text-orange-600">⚠</span>}
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="basic" className="mt-6">
//               <StationBasicInfo
//                 data={{
//                   stationId: formData.stationId,
//                   stationName: formData.stationName,
//                   location: formData.location,
//                   status: formData.status,
//                   description: formData.description,
//                   operator: formData.operator,
//                   priority: formData.priority,
//                   notes: [], // Remove notes from basic info
//                 }}
//                 onChange={handleBasicInfoChange}
//                 onSubmit={handleSubmit}
//                 onCancel={handleBack}
//                 isLoading={currentIsLoading}
//                 isEdit={false}
//                 existingStations={existingStations}
//               />
//             </TabsContent>

//             <TabsContent value="specifications" className="mt-6">
//               <StationSpecifications
//                 specifications={formData.specifications}
//                 onChange={handleSpecificationsChange}
//                 stationId={undefined}
//                 onSubmit={handleSubmit}
//                 onCancel={handleBack}
//                 isLoading={currentIsLoading}
//                 isEdit={false}
//               />
//             </TabsContent>

//             <TabsContent value="notes" className="mt-6">
//               <StationNotes
//                 notes={formData.notes}
//                 onChange={handleNotesChange}
//                 onSubmit={handleSubmit}
//                 onCancel={handleBack}
//                 isLoading={currentIsLoading}
//                 isEdit={false}
//               />
//             </TabsContent>

//             <TabsContent value="documentation" className="mt-6">
//               <StationDocumentation
//                 documentations={formData.documentations}
//                 onChange={handleDocumentationChange}
//                 stationId={undefined}
//                 onSubmit={handleSubmit}
//                 onCancel={handleBack}
//                 isLoading={currentIsLoading}
//                 isEdit={false}
//               />
//             </TabsContent>

//             <TabsContent value="flowcharts" className="mt-6">
//               <StationFlowcharts
//                 flowcharts={formData.flowcharts}
//                 onChange={handleFlowchartsChange}
//                 stationId={undefined}
//                 onSubmit={handleSubmit}
//                 onCancel={handleBack}
//                 isLoading={currentIsLoading}
//                 isEdit={false}
//               />
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }














"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { StationBasicInfo } from "./station-basic-info"
import { StationSpecifications } from "./station-specifications"
import { StationDocumentation } from "./station-documentation"
import { StationNotes } from "./station-notes"
import type { Station, CreateStationDto } from "./types"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StationAPI } from "./station-api"
import { useToast } from "@/hooks/use-toast"
import StationFlowcharts from "./station-flowcharts"

interface StationFormTabsProps {
  onCancel: () => void
  isLoading?: boolean
  existingStations?: Station[]
}

export function StationFormTabs({ onCancel, isLoading, existingStations = [] }: StationFormTabsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("basic")
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<{
    stationId: string
    stationName: string
    location: string
    status: "active"
    description: string
    operator: string
    priority: number | null
    notes: string[]
    specifications: any[]
    documentations: any[]
    flowcharts: any[]
  }>({
    // Basic Info - Empty for new station
    stationId: "",
    stationName: "",
    location: "",
    status: "active",
    description: "",
    operator: "",
    priority: null,
    notes: [],
    // Specifications - Empty for new station
    specifications: [],
    // Documentation - Empty for new station
    documentations: [],
    // Flowcharts - Empty for new station
    flowcharts: [],
  })

  const handleBasicInfoChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSpecificationsChange = (specifications: any[]) => {
    setFormData((prev) => ({ ...prev, specifications }))
  }

  const handleDocumentationChange = (documentations: any[]) => {
    setFormData((prev) => ({ ...prev, documentations }))
  }

  const handleFlowchartsChange = (flowcharts: any[]) => {
    setFormData((prev) => ({ ...prev, flowcharts }))
  }

  const handleNotesChange = (notes: string[]) => {
    setFormData((prev) => ({ ...prev, notes }))
  }

  const validateStationId = (stationId: string): boolean => {
    if (!stationId.trim()) {
      toast({
        title: "Validation Error",
        description: "Station ID is required.",
        variant: "destructive",
      })
      return false
    }

    // Check if station ID already exists
    const existingStation = existingStations.find(
      (s) => s.stationId.toLowerCase() === stationId.toLowerCase() && !s.isDeleted,
    )
    if (existingStation) {
      toast({
        title: "Validation Error",
        description: `Station ID "${stationId}" already exists. Please use a different Station ID.`,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const validateStationName = (stationName: string): boolean => {
    if (!stationName.trim()) {
      toast({
        title: "Validation Error",
        description: "Station Name is required.",
        variant: "destructive",
      })
      return false
    }

    // Check if station name already exists
    const existingStation = existingStations.find(
      (s) => s.stationName.toLowerCase() === stationName.toLowerCase() && !s.isDeleted,
    )
    if (existingStation) {
      toast({
        title: "Validation Error",
        description: `Station Name "${stationName}" already exists. Please use a different Station Name.`,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (submitting) return // Prevent double submission

    setSubmitting(true)

    try {
      // Validate required fields
      if (!validateStationId(formData.stationId)) {
        setActiveTab("basic")
        return
      }

      if (!validateStationName(formData.stationName)) {
        setActiveTab("basic")
        return
      }

      // Prepare specifications data for backend (backend handles slug generation)
      const specificationsForBackend = formData.specifications
        .filter((spec: any) => spec.isNew) // Only send new specifications
        .map((spec: any) => ({
          name: spec.originalName || spec.name?.replace(/_\d+_\d+_[a-z0-9]+$/, "") || spec.name?.trim() || "",
          inputType: spec.inputType || "TEXT",
          suggestions: spec.inputType === "DROPDOWN" ? spec.options || [] : [],
          required: spec.inputType === "CHECKBOX" ? true : false,
        }))

      // Validate specifications
      for (const spec of specificationsForBackend) {
        if (!spec.name) {
          toast({
            title: "Validation Error",
            description: "All specifications must have a name.",
            variant: "destructive",
          })
          setActiveTab("specifications")
          return
        }

        if (spec.inputType === "DROPDOWN" && spec.suggestions.length === 0) {
          toast({
            title: "Validation Error",
            description: `Dropdown specification "${spec.name}" requires at least one option.`,
            variant: "destructive",
          })
          setActiveTab("specifications")
          return
        }
      }

      // Prepare documentations for backend (only those with actual files)
      const documentationsForBackend = formData.documentations
        .filter((doc: any) => doc.isNew && doc.fileUrl && doc.fileUrl.trim() !== "") // Only include docs with actual file URLs
        .map((doc: any) => ({
          description: doc.description || (doc.file ? doc.file.name : ""),
          fileUrl: doc.fileUrl, // This will have the actual file URL
        }))

      // Prepare flowcharts for backend (only those with actual files)
      const flowchartsForBackend = formData.flowcharts
        .filter((flow: any) => flow.isNew && flow.fileUrl && flow.fileUrl.trim() !== "") // Only include flowcharts with actual file URLs
        .map((flow: any) => ({
          description: flow.description || flow.filename || (flow.file ? flow.file.name : ""),
          fileUrl: flow.fileUrl, // This will have the actual file URL
        }))

      console.log("Documentations for backend:", documentationsForBackend)
      console.log("Flowcharts for backend:", flowchartsForBackend)

      // Prepare flowcharts for backend (without files, just metadata)
      // const flowchartsForBackend = formData.flowcharts
      //   .filter((flow: any) => flow.isNew)
      //   .map((flow: any) => ({
      //     description: flow.description || flow.filename || (flow.file ? flow.file.name : ""),
      //     fileUrl: "", // Empty for now, files won't be uploaded during creation
      //   }))

      // CREATE new station - Use POST method
      const createData: CreateStationDto = {
        stationId: formData.stationId.trim(),
        stationName: formData.stationName.trim(),
        location: formData.location.trim() || "",
        status: formData.status,
        description: formData.description?.trim() || "",
        operator: formData.operator?.trim() || "",
        priority: formData.priority,
        Note: formData.notes.length > 0 ? formData.notes : [],
        specifications: specificationsForBackend,
        documentations: documentationsForBackend,
        flowcharts: flowchartsForBackend,
      }

      console.log("CREATING new station with data:", createData)
      const savedStation = await StationAPI.createStation(createData)
      console.log("Station created successfully:", savedStation)

      // Handle file uploads for FILE_UPLOAD type specifications after station creation
      await handleSpecificationFileUploads(savedStation.id)

      // Show success message with note about files
      const hasFiles =
        formData.documentations.some((doc: any) => doc.isNew && doc.file) ||
        formData.flowcharts.some((flow: any) => flow.isNew && flow.file)

      if (hasFiles) {
        toast({
          title: "Station Created",
          description:
            "Station created successfully! Note: Documentation and flowchart files were not uploaded as they require the station to exist first. Please edit the station to upload files.",
        })
      } else {
        toast({
          title: "Success",
          description: "Station created successfully!",
        })
      }

      // Navigate to station details page
      router.push(`/dashboard/stations/${savedStation.id}`)
    } catch (error: any) {
      console.error("Error creating station:", error)

      // Handle specific error types
      if (error.message?.includes("Unique constraint failed") || error.message?.includes("stationId")) {
        toast({
          title: "Duplicate Station ID",
          description: `Station ID "${formData.stationId}" already exists. Please use a different Station ID.`,
          variant: "destructive",
        })
        setActiveTab("basic")
      } else if (error.message?.includes("500") || error.message?.includes("Internal server error")) {
        toast({
          title: "Server Error",
          description: "Internal server error occurred. Please check the server logs and try again.",
          variant: "destructive",
        })
      } else if (error.message?.includes("Each specification must have a name")) {
        toast({
          title: "Validation Error",
          description: "All specifications must have a name. Please check your specifications.",
          variant: "destructive",
        })
        setActiveTab("specifications")
      } else if (error.message?.includes("requires suggestions")) {
        toast({
          title: "Validation Error",
          description: "Dropdown specifications require at least one suggestion/option.",
          variant: "destructive",
        })
        setActiveTab("specifications")
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create station. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleSpecificationFileUploads = async (stationId: string) => {
    try {
      const fileUploadSpecs = formData.specifications.filter(
        (spec: any) => spec.inputType === "FILE_UPLOAD" && spec.fileValue && spec.isNew,
      )

      for (const spec of fileUploadSpecs) {
        try {
          // Find the created specification by name to get its ID
          const stationData = await StationAPI.getStationById(stationId)
          const createdSpec = stationData.specifications?.find((s: any) => s.name === spec.name)

          if (createdSpec && spec.fileValue) {
            const result = await StationAPI.uploadStationSpecificationFile(
              spec.fileValue,
              createdSpec.id,
              stationId,
              spec.unit,
            )
            console.log("Specification file uploaded:", result)
          }
        } catch (uploadError) {
          console.error(`Failed to upload file for specification ${spec.name}:`, uploadError)
          toast({
            title: "Warning",
            description: `Failed to upload file for specification "${spec.name}".`,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error handling specification file uploads:", error)
    }
  }

  const handleBack = () => {
    router.push("/dashboard/stations")
  }

  const currentIsLoading = isLoading || submitting

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold text-green-600">Create Station</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleBack} disabled={currentIsLoading}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="w-full">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="specifications">
                Specifications ({formData.specifications.length})
                {formData.specifications.length > 0 && <span className="ml-1 text-xs text-green-600">✓</span>}
              </TabsTrigger>
              <TabsTrigger value="notes">
                Notes ({formData.notes.length})
                {formData.notes.length > 0 && <span className="ml-1 text-xs text-green-600">✓</span>}
              </TabsTrigger>
              <TabsTrigger value="documentation">
                Files ({formData.documentations.length})
                {formData.documentations.length > 0 && <span className="ml-1 text-xs text-orange-600">⚠</span>}
              </TabsTrigger>
              <TabsTrigger value="flowcharts">
                Flowcharts ({formData.flowcharts.length})
                {formData.flowcharts.length > 0 && <span className="ml-1 text-xs text-orange-600">⚠</span>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-6">
              <StationBasicInfo
                data={{
                  stationId: formData.stationId,
                  stationName: formData.stationName,
                  location: formData.location,
                  status: formData.status,
                  description: formData.description,
                  operator: formData.operator,
                  priority: formData.priority,
                  notes: [], // Remove notes from basic info
                }}
                onChange={handleBasicInfoChange}
                onCancel={handleBack}
                isLoading={currentIsLoading}
                isEdit={false}
                existingStations={existingStations}
              />
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <StationSpecifications
                specifications={formData.specifications}
                onChange={handleSpecificationsChange}
                stationId={undefined}
                onCancel={handleBack}
                isLoading={currentIsLoading}
                isEdit={false}
              />
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <StationNotes
                notes={formData.notes}
                onChange={handleNotesChange}
                onCancel={handleBack}
                isLoading={currentIsLoading}
                isEdit={false}
              />
            </TabsContent>

            <TabsContent value="documentation" className="mt-6">
              <StationDocumentation
                documentations={formData.documentations}
                onChange={handleDocumentationChange}
                stationId={undefined}
                onCancel={handleBack}
                isLoading={currentIsLoading}
                isEdit={false}
              />
            </TabsContent>

            <TabsContent value="flowcharts" className="mt-6">
              <StationFlowcharts
                flowcharts={formData.flowcharts}
                onChange={handleFlowchartsChange}
                stationId={undefined}
                onCancel={handleBack}
                isLoading={currentIsLoading}
                isEdit={false}
              />
            </TabsContent>
          </Tabs>

          {/* Fixed Create Button */}
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={handleBack} disabled={currentIsLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={currentIsLoading} className="bg-green-600 hover:bg-green-700">
              {submitting ? "Creating..." : "Create Station"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



