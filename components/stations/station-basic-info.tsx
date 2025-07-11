// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { AlertCircle, CheckCircle2 } from "lucide-react"
// import type { Station } from "./types"

// interface BasicInfoData {
//   stationId: string
//   stationName: string
//   location: string
//   status: "active" | "inactive" | "maintenance"
//   description: string
//   operator: string
// }

// interface StationBasicInfoProps {
//   data: BasicInfoData
//   onChange: (field: string, value: any) => void
//   onSubmit: () => void
//   onCancel: () => void
//   isLoading?: boolean
//   isEdit?: boolean
//   existingStations?: Station[]
// }

// export function StationBasicInfo({
//   data,
//   onChange,
//   onSubmit,
//   onCancel,
//   isLoading = false,
//   isEdit = false,
//   existingStations = [],
// }: StationBasicInfoProps) {
//   const [stationIdError, setStationIdError] = useState<string>("")
//   const [stationNameError, setStationNameError] = useState<string>("")

//   const handleStationIdChange = (value: string) => {
//     onChange("stationId", value)

//     // Clear error when user starts typing
//     if (stationIdError) {
//       setStationIdError("")
//     }
//   }

//   const handleStationIdBlur = () => {
//     if (!data.stationId.trim()) {
//       setStationIdError("Station ID is required")
//       return
//     }

//     // Only check for duplicates when creating new stations
//     if (!isEdit) {
//       const duplicate = existingStations.find(
//         (station) => station.stationId.toLowerCase() === data.stationId.toLowerCase() && !station.isDeleted,
//       )
//       if (duplicate) {
//         setStationIdError(`Station ID "${data.stationId}" already exists`)
//       }
//     }
//   }

//   const handleStationNameChange = (value: string) => {
//     onChange("stationName", value)

//     // Clear error when user starts typing
//     if (stationNameError) {
//       setStationNameError("")
//     }
//   }

//   const handleStationNameBlur = () => {
//     if (!data.stationName.trim()) {
//       setStationNameError("Station Name is required")
//       return
//     }

//     // Check for duplicates (for both create and edit, but exclude current station in edit mode)
//     const duplicate = existingStations.find(
//       (station) => station.stationName.toLowerCase() === data.stationName.toLowerCase() && !station.isDeleted,
//     )
//     if (duplicate) {
//       setStationNameError(`Station Name "${data.stationName}" already exists`)
//     }
//   }

//   const isFormValid = () => {
//     return (
//       data.stationId.trim() && data.stationName.trim() && data.location.trim() && !stationIdError && !stationNameError
//     )
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-lg font-semibold text-red-600">Basic Information</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Station ID */}
//           <div className="space-y-2">
//             <Label htmlFor="stationId" className="text-sm font-medium">
//               Station ID <span className="text-red-500">*</span>
//             </Label>
//             <div className="relative">
//               <Input
//                 id="stationId"
//                 value={data.stationId}
//                 onChange={(e) => handleStationIdChange(e.target.value)}
//                 onBlur={handleStationIdBlur}
//                 placeholder="Enter station ID (e.g., ST001)"
//                 className={`${stationIdError ? "border-red-500" : ""} ${
//                   data.stationId && !stationIdError ? "border-green-500" : ""
//                 }`}
//                 disabled={isLoading}
//               />
//               {stationIdError && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <AlertCircle className="h-4 w-4 text-red-500" />
//                 </div>
//               )}
//               {data.stationId && !stationIdError && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <CheckCircle2 className="h-4 w-4 text-green-500" />
//                 </div>
//               )}
//             </div>
//             {stationIdError && <p className="text-sm text-red-500">{stationIdError}</p>}
//           </div>

//           {/* Station Name */}
//           <div className="space-y-2">
//             <Label htmlFor="stationName" className="text-sm font-medium">
//               Station Name <span className="text-red-500">*</span>
//             </Label>
//             <div className="relative">
//               <Input
//                 id="stationName"
//                 value={data.stationName}
//                 onChange={(e) => handleStationNameChange(e.target.value)}
//                 onBlur={handleStationNameBlur}
//                 placeholder="Enter station name"
//                 className={`${stationNameError ? "border-red-500" : ""} ${
//                   data.stationName && !stationNameError ? "border-green-500" : ""
//                 }`}
//                 disabled={isLoading}
//               />
//               {stationNameError && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <AlertCircle className="h-4 w-4 text-red-500" />
//                 </div>
//               )}
//               {data.stationName && !stationNameError && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <CheckCircle2 className="h-4 w-4 text-green-500" />
//                 </div>
//               )}
//             </div>
//             {stationNameError && <p className="text-sm text-red-500">{stationNameError}</p>}
//           </div>

//           {/* Location */}
//           <div className="space-y-2">
//             <Label htmlFor="location" className="text-sm font-medium">
//               Location <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="location"
//               value={data.location}
//               onChange={(e) => onChange("location", e.target.value)}
//               placeholder="Enter location"
//               className={data.location ? "border-green-500" : ""}
//               disabled={isLoading}
//             />
//           </div>

//           {/* Status */}
//           <div className="space-y-2">
//             <Label htmlFor="status" className="text-sm font-medium">
//               Status
//             </Label>
//             <Select value={data.status} onValueChange={(value) => onChange("status", value)} disabled={isLoading}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="inactive">Inactive</SelectItem>
//                 <SelectItem value="maintenance">Maintenance</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Operator */}
//           <div className="space-y-2">
//             <Label htmlFor="operator" className="text-sm font-medium">
//               Operator
//             </Label>
//             <Input
//               id="operator"
//               value={data.operator}
//               onChange={(e) => onChange("operator", e.target.value)}
//               placeholder="Enter operator name"
//               disabled={isLoading}
//             />
//           </div>
//         </div>

//         {/* Description */}
//         <div className="space-y-2">
//           <Label htmlFor="description" className="text-sm font-medium">
//             Description
//           </Label>
//           <Textarea
//             id="description"
//             value={data.description}
//             onChange={(e) => onChange("description", e.target.value)}
//             placeholder="Enter station description"
//             rows={3}
//             disabled={isLoading}
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-4 pt-4">
//           <Button variant="outline" onClick={onCancel} disabled={isLoading}>
//             Cancel
//           </Button>
//           <Button onClick={onSubmit} disabled={!isFormValid() || isLoading} className="bg-red-600 hover:bg-red-700">
//             {isLoading ? "Creating..." : "Create Station"}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }





















// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { AlertCircle, CheckCircle2 } from "lucide-react"
// import type { Station } from "./types"

// interface BasicInfoData {
//   stationId: string
//   stationName: string
//   location: string
//   status: "active" | "inactive" | "maintenance"
//   description: string
//   operator: string
// }

// interface StationBasicInfoProps {
//   data: BasicInfoData
//   onChange: (field: string, value: any) => void
//   onSubmit: () => void
//   onCancel: () => void
//   isLoading?: boolean
//   isEdit?: boolean
//   existingStations?: Station[]
// }

// export function StationBasicInfo({
//   data,
//   onChange,
//   onSubmit,
//   onCancel,
//   isLoading = false,
//   isEdit = false,
//   existingStations = [],
// }: StationBasicInfoProps) {
//   const [stationIdError, setStationIdError] = useState<string>("")
//   const [stationNameError, setStationNameError] = useState<string>("")

//   const handleStationIdChange = (value: string) => {
//     onChange("stationId", value)

//     // Clear error when user starts typing
//     if (stationIdError) {
//       setStationIdError("")
//     }
//   }

//   const handleStationIdBlur = () => {
//     if (!data.stationId.trim()) {
//       setStationIdError("Station ID is required")
//       return
//     }

//     // Only check for duplicates when creating new stations
//     if (!isEdit) {
//       const duplicate = existingStations.find(
//         (station) => station.stationId.toLowerCase() === data.stationId.toLowerCase() && !station.isDeleted,
//       )
//       if (duplicate) {
//         setStationIdError(`Station ID "${data.stationId}" already exists`)
//       }
//     }
//   }

//   const handleStationNameChange = (value: string) => {
//     onChange("stationName", value)

//     // Clear error when user starts typing
//     if (stationNameError) {
//       setStationNameError("")
//     }
//   }

//   const handleStationNameBlur = () => {
//     if (!data.stationName.trim()) {
//       setStationNameError("Station Name is required")
//       return
//     }

//     // Check for duplicates (for both create and edit, but exclude current station in edit mode)
//     const duplicate = existingStations.find(
//       (station) => station.stationName.toLowerCase() === data.stationName.toLowerCase() && !station.isDeleted,
//     )
//     if (duplicate) {
//       setStationNameError(`Station Name "${data.stationName}" already exists`)
//     }
//   }

//   const isFormValid = () => {
//     return (
//       data.stationId.trim() && data.stationName.trim()  && !stationIdError && !stationNameError
//     )
//   }

//   return (
//     <Card>
//       <CardContent className="space-y-6 mt-5">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Station ID */}
//           <div className="space-y-2">
//             <Label htmlFor="stationId" className="text-sm font-medium">
//               Station ID <span className="text-red-500">*</span>
//             </Label>
//             <div className="relative">
//               <Input
//                 id="stationId"
//                 value={data.stationId}
//                 onChange={(e) => handleStationIdChange(e.target.value)}
//                 onBlur={handleStationIdBlur}
//                 placeholder="Enter station ID (e.g., ST001)"
//                 className={`${stationIdError ? "border-red-500" : ""} ${
//                   data.stationId && !stationIdError ? "border-green-500" : ""
//                 }`}
//                 disabled={isLoading}
//               />
//               {stationIdError && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <AlertCircle className="h-4 w-4 text-red-500" />
//                 </div>
//               )}
//               {data.stationId && !stationIdError && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <CheckCircle2 className="h-4 w-4 text-green-500" />
//                 </div>
//               )}
//             </div>
//             {stationIdError && <p className="text-sm text-red-500">{stationIdError}</p>}
//           </div>

//           {/* Station Name */}
//           <div className="space-y-2">
//             <Label htmlFor="stationName" className="text-sm font-medium">
//               Station Name <span className="text-red-500">*</span>
//             </Label>
//             <div className="relative">
//               <Input
//                 id="stationName"
//                 value={data.stationName}
//                 onChange={(e) => handleStationNameChange(e.target.value)}
//                 onBlur={handleStationNameBlur}
//                 placeholder="Enter station name"
//                 className={`${stationNameError ? "border-red-500" : ""} ${
//                   data.stationName && !stationNameError ? "border-green-500" : ""
//                 }`}
//                 disabled={isLoading}
//               />
//               {stationNameError && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <AlertCircle className="h-4 w-4 text-red-500" />
//                 </div>
//               )}
//               {data.stationName && !stationNameError && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <CheckCircle2 className="h-4 w-4 text-green-500" />
//                 </div>
//               )}
//             </div>
//             {stationNameError && <p className="text-sm text-red-500">{stationNameError}</p>}
//           </div>

//           {/* Location */}
//           <div className="space-y-2">
//             <Label htmlFor="location" className="text-sm font-medium">
//               Location 
//             </Label>
//             <Input
//               id="location"
//               value={data.location}
//               onChange={(e) => onChange("location", e.target.value)}
//               placeholder="Enter location"
//               className={data.location ? "border-green-500" : ""}
//               disabled={isLoading}
//             />
//           </div>

//           {/* Status */}
//           <div className="space-y-2">
//             <Label htmlFor="status" className="text-sm font-medium">
//               Status
//             </Label>
//             <Select value={data.status} onValueChange={(value) => onChange("status", value)} disabled={isLoading}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="inactive">Inactive</SelectItem>
//                 <SelectItem value="maintenance">Maintenance</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Operator */}
//           <div className="space-y-2">
//             <Label htmlFor="operator" className="text-sm font-medium">
//               Operator
//             </Label>
//             <Input
//               id="operator"
//               value={data.operator}
//               onChange={(e) => onChange("operator", e.target.value)}
//               placeholder="Enter operator name"
//               disabled={isLoading}
//             />
//           </div>
//         </div>

//         {/* Description */}
//         <div className="space-y-2">
//           <Label htmlFor="description" className="text-sm font-medium">
//             Description
//           </Label>
//           <Textarea
//             id="description"
//             value={data.description}
//             onChange={(e) => onChange("description", e.target.value)}
//             placeholder="Enter station description"
//             rows={3}
//             disabled={isLoading}
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-4 pt-4">
//           <Button variant="outline" onClick={onCancel} disabled={isLoading}>
//             Cancel
//           </Button>
//           <Button onClick={onSubmit} disabled={!isFormValid() || isLoading} className="bg-red-600 hover:bg-red-700">
//             {isLoading ? "Creating..." : "Create Station"}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }














// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent } from "@/components/ui/card"
// import { AlertCircle, CheckCircle2 } from "lucide-react"
// import type { Station } from "./types"

// interface BasicInfoData {
//   stationId: string
//   stationName: string
//   location: string
//   status: "active" | "inactive" | "maintenance"
//   description: string
//   operator: string
// }

// interface StationBasicInfoProps {
//   data: BasicInfoData
//   onChange: (field: string, value: any) => void
//   onSubmit: () => void
//   onCancel: () => void
//   isLoading?: boolean
//   isEdit?: boolean
//   existingStations?: Station[]
// }

// export function StationBasicInfo({
//   data,
//   onChange,
//   onSubmit,
//   onCancel,
//   isLoading = false,
//   isEdit = false,
//   existingStations = [],
// }: StationBasicInfoProps) {
//   const [stationIdError, setStationIdError] = useState<string>("")
//   const [stationNameError, setStationNameError] = useState<string>("")

//   const handleStationIdChange = (value: string) => {
//     onChange("stationId", value)

//     // Clear error when user starts typing
//     if (stationIdError) {
//       setStationIdError("")
//     }
//   }

//   const handleStationIdBlur = () => {
//     if (!data.stationId.trim()) {
//       setStationIdError("Station ID is required")
//       return
//     }

//     // Only check for duplicates when creating new stations
//     if (!isEdit) {
//       const duplicate = existingStations.find(
//         (station) => station.stationId.toLowerCase() === data.stationId.toLowerCase() && !station.isDeleted,
//       )
//       if (duplicate) {
//         setStationIdError(`Station ID "${data.stationId}" already exists`)
//       }
//     }
//   }

//   const handleStationNameChange = (value: string) => {
//     onChange("stationName", value)

//     // Clear error when user starts typing
//     if (stationNameError) {
//       setStationNameError("")
//     }
//   }

//   const handleStationNameBlur = () => {
//     if (!data.stationName.trim()) {
//       setStationNameError("Station Name is required")
//       return
//     }

//     // Check for duplicates (for both create and edit, but exclude current station in edit mode)
//     const duplicate = existingStations.find(
//       (station) => station.stationName.toLowerCase() === data.stationName.toLowerCase() && !station.isDeleted,
//     )
//     if (duplicate) {
//       setStationNameError(`Station Name "${data.stationName}" already exists`)
//     }
//   }

//   const isFormValid = () => {
//     return data.stationId.trim() && data.stationName.trim() && !stationIdError && !stationNameError
//   }

//   return (
//     <Card>
//       <CardContent className="space-y-6 mt-5">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Station ID */}
//           <div className="space-y-2">
//             <Label htmlFor="stationId" className="text-sm font-medium">
//               Station ID <span className="text-red-500">*</span>
//             </Label>
//             <div className="relative">
//               <Input
//                 id="stationId"
//                 value={data.stationId}
//                 onChange={(e) => handleStationIdChange(e.target.value)}
//                 onBlur={handleStationIdBlur}
//                 placeholder="Enter station ID (e.g., ST001)"
//                 className={`${stationIdError ? "border-red-500" : ""} ${
//                   data.stationId && !stationIdError ? "border-green-500" : ""
//                 }`}
//                 disabled={isLoading}
//               />
//               {stationIdError && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <AlertCircle className="h-4 w-4 text-red-500" />
//                 </div>
//               )}
//               {data.stationId && !stationIdError && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <CheckCircle2 className="h-4 w-4 text-green-500" />
//                 </div>
//               )}
//             </div>
//             {stationIdError && <p className="text-sm text-red-500">{stationIdError}</p>}
//           </div>

//           {/* Station Name */}
//           <div className="space-y-2">
//             <Label htmlFor="stationName" className="text-sm font-medium">
//               Station Name <span className="text-red-500">*</span>
//             </Label>
//             <div className="relative">
//               <Input
//                 id="stationName"
//                 value={data.stationName}
//                 onChange={(e) => handleStationNameChange(e.target.value)}
//                 onBlur={handleStationNameBlur}
//                 placeholder="Enter station name"
//                 className={`${stationNameError ? "border-red-500" : ""} ${
//                   data.stationName && !stationNameError ? "border-green-500" : ""
//                 }`}
//                 disabled={isLoading}
//               />
//               {stationNameError && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <AlertCircle className="h-4 w-4 text-red-500" />
//                 </div>
//               )}
//               {data.stationName && !stationNameError && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                   <CheckCircle2 className="h-4 w-4 text-green-500" />
//                 </div>
//               )}
//             </div>
//             {stationNameError && <p className="text-sm text-red-500">{stationNameError}</p>}
//           </div>

//           {/* Location */}
//           <div className="space-y-2">
//             <Label htmlFor="location" className="text-sm font-medium">
//               Location
//             </Label>
//             <Input
//               id="location"
//               value={data.location}
//               onChange={(e) => onChange("location", e.target.value)}
//               placeholder="Enter location"
//               className={data.location ? "border-green-500" : ""}
//               disabled={isLoading}
//             />
//           </div>

//           {/* Status */}
//           <div className="space-y-2">
//             <Label htmlFor="status" className="text-sm font-medium">
//               Status
//             </Label>
//             <Select value={data.status} onValueChange={(value) => onChange("status", value)} disabled={isLoading}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="inactive">Inactive</SelectItem>
//                 <SelectItem value="maintenance">Maintenance</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Operator */}
//           <div className="space-y-2">
//             <Label htmlFor="operator" className="text-sm font-medium">
//               Operator
//             </Label>
//             <Input
//               id="operator"
//               value={data.operator}
//               onChange={(e) => onChange("operator", e.target.value)}
//               placeholder="Enter operator name"
//               disabled={isLoading}
//             />
//           </div>
//         </div>

//         {/* Description */}
//         <div className="space-y-2">
//           <Label htmlFor="description" className="text-sm font-medium">
//             Description
//           </Label>
//           <Textarea
//             id="description"
//             value={data.description}
//             onChange={(e) => onChange("description", e.target.value)}
//             placeholder="Enter station description"
//             rows={3}
//             disabled={isLoading}
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-4 pt-4">
//           <Button variant="outline" onClick={onCancel} disabled={isLoading}>
//             Cancel
//           </Button>
//           <Button onClick={onSubmit} disabled={!isFormValid() || isLoading} className="bg-red-600 hover:bg-red-700">
//             {isLoading ? "Creating..." : "Create Station"}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }




















"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import type { Station } from "./types"

interface BasicInfoData {
  stationId: string
  stationName: string
  location: string
  status: "active" | "inactive" | "maintenance"
  description: string
  operator: string
  priority: number | null
  notes: string[]
}

interface StationBasicInfoProps {
  data: BasicInfoData
  onChange: (field: string, value: any) => void
  onSubmit: () => void
  onCancel: () => void
  isLoading?: boolean
  isEdit?: boolean
  existingStations?: Station[]
}

export function StationBasicInfo({
  data,
  onChange,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
  existingStations = [],
}: StationBasicInfoProps) {
  const [stationIdError, setStationIdError] = useState<string>("")
  const [stationNameError, setStationNameError] = useState<string>("")

  const handleStationIdChange = (value: string) => {
    onChange("stationId", value)

    // Clear error when user starts typing
    if (stationIdError) {
      setStationIdError("")
    }
  }

  const handleStationIdBlur = () => {
    if (!data.stationId.trim()) {
      setStationIdError("Station ID is required")
      return
    }

    // Only check for duplicates when creating new stations
    if (!isEdit) {
      const duplicate = existingStations.find(
        (station) => station.stationId.toLowerCase() === data.stationId.toLowerCase() && !station.isDeleted,
      )
      if (duplicate) {
        setStationIdError(`Station ID "${data.stationId}" already exists`)
      }
    }
  }

  const handleStationNameChange = (value: string) => {
    onChange("stationName", value)

    // Clear error when user starts typing
    if (stationNameError) {
      setStationNameError("")
    }
  }

  const handleStationNameBlur = () => {
    if (!data.stationName.trim()) {
      setStationNameError("Station Name is required")
      return
    }

    // Check for duplicates (for both create and edit, but exclude current station in edit mode)
    const duplicate = existingStations.find(
      (station) => station.stationName.toLowerCase() === data.stationName.toLowerCase() && !station.isDeleted,
    )
    if (duplicate) {
      setStationNameError(`Station Name "${data.stationName}" already exists`)
    }
  }

  const isFormValid = () => {
    return data.stationId.trim() && data.stationName.trim() && !stationIdError && !stationNameError
  }

  return (
    <Card>
      <CardContent className="space-y-6 mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Station ID */}
          <div className="space-y-2">
            <Label htmlFor="stationId" className="text-sm font-medium">
              Station ID <span className="text-green-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="stationId"
                value={data.stationId}
                onChange={(e) => handleStationIdChange(e.target.value)}
                onBlur={handleStationIdBlur}
                placeholder="Enter station ID (e.g., ST001)"
                className={`${stationIdError ? "border-green-500" : ""} ${
                  data.stationId && !stationIdError ? "border-green-500" : ""
                }`}
                disabled={isLoading}
              />
              {stationIdError && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="h-4 w-4 text-green-500" />
                </div>
              )}
              {data.stationId && !stationIdError && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {stationIdError && <p className="text-sm text-green-500">{stationIdError}</p>}
          </div>

          {/* Station Name */}
          <div className="space-y-2">
            <Label htmlFor="stationName" className="text-sm font-medium">
              Station Name <span className="text-green-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="stationName"
                value={data.stationName}
                onChange={(e) => handleStationNameChange(e.target.value)}
                onBlur={handleStationNameBlur}
                placeholder="Enter station name"
                className={`${stationNameError ? "border-green-500" : ""} ${
                  data.stationName && !stationNameError ? "border-green-500" : ""
                }`}
                disabled={isLoading}
              />
              {stationNameError && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="h-4 w-4 text-green-500" />
                </div>
              )}
              {data.stationName && !stationNameError && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {stationNameError && <p className="text-sm text-green-500">{stationNameError}</p>}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="Enter location"
              className={data.location ? "border-green-500" : ""}
              disabled={isLoading}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select value={data.status} onValueChange={(value) => onChange("status", value)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Operator */}
          <div className="space-y-2">
            <Label htmlFor="operator" className="text-sm font-medium">
              Operator
            </Label>
            <Input
              id="operator"
              value={data.operator}
              onChange={(e) => onChange("operator", e.target.value)}
              placeholder="Enter operator name"
              disabled={isLoading}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium">
              Priority
            </Label>
            <Input
              id="priority"
              type="number"
              value={data.priority || ""}
              onChange={(e) => onChange("priority", e.target.value ? Number.parseInt(e.target.value) : null)}
              placeholder="Enter priority"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Enter station description"
            rows={3}
            disabled={isLoading}
          />
        </div>

     
      </CardContent>
    </Card>
  )
}





