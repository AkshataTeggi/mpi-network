// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Plus, ImageIcon, Trash2, Upload, FileText } from "lucide-react"
// import { Badge } from "@/components/ui/badge"

// interface StationFlowchartsProps {
//   flowcharts: any[]
//   onChange: (flowcharts: any[]) => void
//   stationId?: string
//   onSubmit: () => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
//   isEdit?: boolean
// }

// export function StationFlowcharts({
//   flowcharts,
//   onChange,
//   stationId,
//   onSubmit,
//   onCancel,
//   isLoading,
//   isEdit,
// }: StationFlowchartsProps) {
//   const [newFlowchart, setNewFlowchart] = useState({
//     file: null as File | null,
//     description: "",
//   })

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null
//     setNewFlowchart((prev) => ({ ...prev, file }))
//   }

//   const addFlowchart = () => {
//     if (newFlowchart.file) {
//       const newFlow = {
//         id: `temp-${Date.now()}`,
//         file: newFlowchart.file,
//         fileName: newFlowchart.file.name,
//         description: newFlowchart.description.trim() || newFlowchart.file.name, // Use filename if no description
//         stationId: stationId || "",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         isNew: true, // Flag to identify new uploads
//         previewUrl: URL.createObjectURL(newFlowchart.file), // For preview
//       }
//       onChange([...flowcharts, newFlow])
//       setNewFlowchart({ file: null, description: "" })
//       // Reset file input
//       const fileInput = document.getElementById("flowchartFile") as HTMLInputElement
//       if (fileInput) fileInput.value = ""
//     }
//   }

//   const removeFlowchart = (flowId: string) => {
//     // Clean up preview URL to prevent memory leaks
//     const flowchart = flowcharts.find((f) => f.id === flowId)
//     if (flowchart?.previewUrl) {
//       URL.revokeObjectURL(flowchart.previewUrl)
//     }
//     const newFlows = flowcharts.filter((flow) => flow.id !== flowId)
//     onChange(newFlows)
//   }

//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return "0 Bytes"
//     const k = 1024
//     const sizes = ["Bytes", "KB", "MB", "GB"]
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
       
//         <CardContent className="mt-5">
//           {/* Upload New Flowchart */}
//           <div className="space-y-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
//             <div className="text-center">
//               <Upload className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="text-lg font-semibold mt-2">Upload Flowchart</h3>
//               <p className="text-sm text-muted-foreground">Add flowchart files for this station</p>
//             </div>

//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="flowchartFile">Select File *</Label>
//                 <Input
//                   id="flowchartFile"
//                   type="file"
//                   onChange={handleFileChange}
//                   accept=".pdf,.doc,.docx,.txt,.md,.jpg,.png,.gif,.svg,.webp"
//                   className="cursor-pointer"
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   Supported formats: PDF, DOC, DOCX, TXT, MD, JPG, PNG, GIF, SVG, WebP (Max 10MB)
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="flowchartDescription">Description (Optional)</Label>
//                 <Input
//                   id="flowchartDescription"
//                   value={newFlowchart.description}
//                   onChange={(e) => setNewFlowchart((prev) => ({ ...prev, description: e.target.value }))}
//                   placeholder="Enter description for this flowchart (optional)"
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   If no description is provided, the filename will be used
//                 </p>
//               </div>

//               <Button
//                 onClick={addFlowchart}
//                 className="w-full bg-red-600 hover:bg-red-700 text-white"
//                 disabled={!newFlowchart.file}
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Flowchart
//               </Button>
//             </div>
//           </div>

//           {/* Uploaded Flowcharts List */}
//           <div className="space-y-4 mt-6 mb-5">
//             {flowcharts.length === 0 ? (
//               <p className="text-muted-foreground text-center py-4">No flowcharts uploaded yet.</p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {flowcharts.map((flowchart) => (
//                   <Card key={flowchart.id} className="p-4">
//                     <div className="space-y-3">
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-start gap-3 flex-1">
//                           <ImageIcon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
//                           <div className="flex-1 min-w-0">
//                             <h4 className="font-medium truncate">{flowchart.description}</h4>
//                             <p className="text-sm text-muted-foreground truncate">
//                               {flowchart.fileName || (flowchart.file ? flowchart.file.name : flowchart.fileUrl)}
//                             </p>
//                             {flowchart.file && (
//                               <p className="text-xs text-muted-foreground">
//                                 Size: {formatFileSize(flowchart.file.size)}
//                               </p>
//                             )}
//                             {flowchart.isNew && (
//                               <Badge variant="outline" className="text-xs mt-1">
//                                 Ready to upload
//                               </Badge>
//                             )}
//                           </div>
//                         </div>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => removeFlowchart(flowchart.id)}
//                           className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
//                         >
//                           <Trash2 className="w-3 h-3" />
//                         </Button>
//                       </div>

//                       {/* File Preview */}
//                       {(flowchart.previewUrl || flowchart.fileUrl) && (
//                         <div className="space-y-2">
//                           {(flowchart.file && flowchart.file.type.startsWith("image/")) ||
//                           (flowchart.fileName && flowchart.fileName.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) ? (
//                             <img
//                               src={flowchart.previewUrl || flowchart.fileUrl}
//                               alt={flowchart.description}
//                               className="w-full h-32 object-cover rounded border"
//                               onError={(e) => {
//                                 e.currentTarget.style.display = "none"
//                               }}
//                             />
//                           ) : (
//                             <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center">
//                               <div className="text-center">
//                                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <p className="text-sm text-gray-600">Document Preview</p>
//                                 <p className="text-xs text-gray-500">
//                                   {flowchart.fileName || (flowchart.file ? flowchart.file.name : "Unknown file")}
//                                 </p>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-2 pt-4 border-t">
//             <Button onClick={onSubmit} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
//               {isLoading ? "Saving..." : isEdit ? "Update Station" : "Create Station"}
//             </Button>
//             <Button variant="outline" onClick={onCancel}>
//               Cancel
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


























// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Plus, ImageIcon, Trash2, Upload, FileText } from 'lucide-react'
// import { Badge } from "@/components/ui/badge"

// interface StationFlowchartsProps {
//   flowcharts: any[]
//   onChange: (flowcharts: any[]) => void
//   stationId?: string
//   onSubmit: () => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
//   isEdit?: boolean
// }

// export function StationFlowcharts({
//   flowcharts,
//   onChange,
//   stationId,
//   onSubmit,
//   onCancel,
//   isLoading,
//   isEdit,
// }: StationFlowchartsProps) {
//   const [newFlowchart, setNewFlowchart] = useState({
//     file: null as File | null,
//     description: "",
//   })

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null
//     setNewFlowchart((prev) => ({ ...prev, file }))
//   }

//   const addFlowchart = () => {
//     if (newFlowchart.file) {
//       const newFlow = {
//         id: `temp-${Date.now()}`,
//         file: newFlowchart.file,
//         fileName: newFlowchart.file.name,
//         description: newFlowchart.description.trim() || newFlowchart.file.name, // Use filename if no description
//         stationId: stationId || "",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         isNew: true, // Flag to identify new uploads
//         previewUrl: URL.createObjectURL(newFlowchart.file), // For preview
//       }
//       onChange([...flowcharts, newFlow])
//       setNewFlowchart({ file: null, description: "" })
//       // Reset file input
//       const fileInput = document.getElementById("flowchartFile") as HTMLInputElement
//       if (fileInput) fileInput.value = ""
//     }
//   }

//   const removeFlowchart = (flowId: string) => {
//     // Clean up preview URL to prevent memory leaks
//     const flowchart = flowcharts.find((f) => f.id === flowId)
//     if (flowchart?.previewUrl) {
//       URL.revokeObjectURL(flowchart.previewUrl)
//     }
//     const newFlows = flowcharts.filter((flow) => flow.id !== flowId)
//     onChange(newFlows)
//   }

//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return "0 Bytes"
//     const k = 1024
//     const sizes = ["Bytes", "KB", "MB", "GB"]
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
       
//         <CardContent className="mt-5">
//           {/* Upload New Flowchart */}
//           <div className="space-y-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
//             <div className="text-center">
//               <Upload className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="text-lg font-semibold mt-2">Upload Flowchart</h3>
//               <p className="text-sm text-muted-foreground">Add flowchart files for this station</p>
//             </div>

//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="flowchartFile">Select File *</Label>
//                 <Input
//                   id="flowchartFile"
//                   type="file"
//                   onChange={handleFileChange}
//                   accept=".pdf,.doc,.docx,.txt,.md,.jpg,.png,.gif,.svg,.webp"
//                   className="cursor-pointer"
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   Supported formats: PDF, DOC, DOCX, TXT, MD, JPG, PNG, GIF, SVG, WebP (Max 10MB)
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="flowchartDescription">Description (Optional)</Label>
//                 <Input
//                   id="flowchartDescription"
//                   value={newFlowchart.description}
//                   onChange={(e) => setNewFlowchart((prev) => ({ ...prev, description: e.target.value }))}
//                   placeholder="Enter description for this flowchart (optional)"
//                 />
               
//               </div>

//               <Button
//                 onClick={addFlowchart}
//                 className="w-full bg-red-600 hover:bg-red-700 text-white"
//                 disabled={!newFlowchart.file}
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Flowchart
//               </Button>
//             </div>
//           </div>

//           {/* Uploaded Flowcharts List */}
//           <div className="space-y-4 mt-6 mb-5">
//             {flowcharts.length === 0 ? (
//               <p className="text-muted-foreground text-center py-4">No flowcharts uploaded yet.</p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {flowcharts.map((flowchart) => (
//                   <Card key={flowchart.id} className="p-4">
//                     <div className="space-y-3">
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-start gap-3 flex-1">
//                           <ImageIcon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
//                           <div className="flex-1 min-w-0">
//                             <h4 className="font-medium truncate">{flowchart.description}</h4>
//                             <p className="text-sm text-muted-foreground truncate">
//                               {flowchart.fileName || (flowchart.file ? flowchart.file.name : flowchart.fileUrl)}
//                             </p>
//                             {flowchart.file && (
//                               <p className="text-xs text-muted-foreground">
//                                 Size: {formatFileSize(flowchart.file.size)}
//                               </p>
//                             )}
//                             {flowchart.isNew && (
//                               <Badge variant="outline" className="text-xs mt-1">
//                                 Ready to upload
//                               </Badge>
//                             )}
//                           </div>
//                         </div>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => removeFlowchart(flowchart.id)}
//                           className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
//                         >
//                           <Trash2 className="w-3 h-3" />
//                         </Button>
//                       </div>

//                       {/* File Preview */}
//                       {(flowchart.previewUrl || flowchart.fileUrl) && (
//                         <div className="space-y-2">
//                           {(flowchart.file && flowchart.file.type.startsWith("image/")) ||
//                           (flowchart.fileName && flowchart.fileName.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) ? (
//                             <img
//                               src={flowchart.previewUrl || flowchart.fileUrl}
//                               alt={flowchart.description}
//                               className="w-full h-32 object-cover rounded border"
//                               onError={(e) => {
//                                 e.currentTarget.style.display = "none"
//                               }}
//                             />
//                           ) : (
//                             <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center">
//                               <div className="text-center">
//                                 <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                                 <p className="text-sm text-gray-600">Document Preview</p>
//                                 <p className="text-xs text-gray-500">
//                                   {flowchart.fileName || (flowchart.file ? flowchart.file.name : "Unknown file")}
//                                 </p>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-2 pt-4 border-t">
//             <Button onClick={onSubmit} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
//               {isLoading ? "Saving..." : isEdit ? "Update Station" : "Create Station"}
//             </Button>
//             <Button variant="outline" onClick={onCancel}>
//               Cancel
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }



// "use client"

// import { Badge } from "@/components/ui/badge"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Plus, Trash2, Upload, FileText, Edit, Save, X } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface Flowchart {
//   id?: string
//   description: string
//   fileUrl: string
//   fileName?: string
//   isNew?: boolean
//   isModified?: boolean
// }

// interface StationFlowchartsProps {
//   flowcharts: Flowchart[]
//   onChange: (flowcharts: Flowchart[]) => void
//   stationId?: string
//   onSubmit: () => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
//   isEdit?: boolean
// }

// export function StationFlowcharts({
//   flowcharts,
//   onChange,
//   stationId,
//   onSubmit,
//   onCancel,
//   isLoading,
//   isEdit,
// }: StationFlowchartsProps) {
//   const [newChart, setNewChart] = useState({ description: "", fileUrl: "" })
//   const [editingChart, setEditingChart] = useState<string | null>(null)
//   const [editingData, setEditingData] = useState<{ description: string; fileUrl: string }>({
//     description: "",
//     fileUrl: "",
//   })
//   const { toast } = useToast()

//   const addFlowchart = () => {
//     if (!newChart.fileUrl.trim() && !newChart.description.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Please provide either a file URL or description.",
//         variant: "destructive",
//       })
//       return
//     }

//     // Extract filename from URL if no description provided
//     const fileName = newChart.fileUrl ? newChart.fileUrl.split("/").pop() || "Unknown file" : "No file"
//     const description = newChart.description.trim() || fileName

//     const flowchart: Flowchart = {
//       id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       description: description,
//       fileUrl: newChart.fileUrl.trim() || "",
//       fileName: fileName,
//       isNew: true,
//     }

//     onChange([...flowcharts, flowchart])
//     setNewChart({ description: "", fileUrl: "" })

//     toast({
//       title: "Success",
//       description: "Flowchart added successfully.",
//     })
//   }

//   const removeFlowchart = (chartId: string) => {
//     const chart = flowcharts.find((c) => c.id === chartId)
//     if (!chart) return

//     const displayName = chart.description || chart.fileName || "this flowchart"
//     if (!confirm(`Are you sure you want to remove "${displayName}"?`)) {
//       return
//     }

//     onChange(flowcharts.filter((c) => c.id !== chartId))

//     toast({
//       title: "Success",
//       description: "Flowchart removed successfully.",
//     })
//   }

//   const startEditing = (chart: Flowchart) => {
//     if (!chart.id) return
//     setEditingChart(chart.id)
//     setEditingData({
//       description: chart.description,
//       fileUrl: chart.fileUrl,
//     })
//   }

//   const cancelEditing = () => {
//     setEditingChart(null)
//     setEditingData({ description: "", fileUrl: "" })
//   }

//   const saveEditing = () => {
//     if (!editingChart) return

//     if (!editingData.fileUrl.trim() && !editingData.description.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Please provide either a file URL or description.",
//         variant: "destructive",
//       })
//       return
//     }

//     // Extract filename from URL if no description provided
//     const fileName = editingData.fileUrl ? editingData.fileUrl.split("/").pop() || "Unknown file" : "No file"
//     const description = editingData.description.trim() || fileName

//     onChange(
//       flowcharts.map((chart) =>
//         chart.id === editingChart
//           ? {
//               ...chart,
//               description: description,
//               fileUrl: editingData.fileUrl.trim() || "",
//               fileName: fileName,
//               isModified: !chart.isNew, // Mark as modified if it's an existing chart
//             }
//           : chart,
//       ),
//     )

//     setEditingChart(null)
//     setEditingData({ description: "", fileUrl: "" })

//     toast({
//       title: "Success",
//       description: "Flowchart updated successfully.",
//     })
//   }

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     // Simulate file upload - in real app, upload to your file storage
//     const fileUrl = `uploads/${file.name}`

//     if (isEditing) {
//       setEditingData((prev) => ({
//         ...prev,
//         fileUrl,
//         description: prev.description || file.name, // Use filename as description if empty
//       }))
//     } else {
//       setNewChart((prev) => ({
//         ...prev,
//         fileUrl,
//         description: prev.description || file.name, // Use filename as description if empty
//       }))
//     }

//     toast({
//       title: "File Selected",
//       description: `File "${file.name}" selected. URL: ${fileUrl}`,
//     })
//   }

//   // Separate existing and new flowcharts
//   const existingCharts = flowcharts.filter((chart) => !chart.isNew)
//   const newCharts = flowcharts.filter((chart) => chart.isNew)

//   return (
//     <div className="space-y-6">
//       <Card>
       
//         <CardContent className="mt-5">
//           {/* Existing Flowcharts */}
//           {existingCharts.length > 0 && (
//             <div className="space-y-4 mb-6">
//               <h3 className="text-lg font-semibold">Existing Flowcharts</h3>
//               <div className="space-y-3">
//                 {existingCharts.map((chart) => (
//                   <div key={chart.id} className="p-4 border rounded-lg bg-blue-50">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3 flex-1">
//                         <FileText className="h-5 w-5 text-blue-600" />
//                         <div className="flex-1">
//                           {editingChart === chart.id ? (
//                             <div className="space-y-2">
//                               <Input
//                                 value={editingData.description}
//                                 onChange={(e) => setEditingData((prev) => ({ ...prev, description: e.target.value }))}
//                                 placeholder="Description (optional)"
//                                 className="h-8"
//                               />
//                               <div className="flex gap-2">
//                                 <Input
//                                   value={editingData.fileUrl}
//                                   onChange={(e) => setEditingData((prev) => ({ ...prev, fileUrl: e.target.value }))}
//                                   placeholder="File URL (optional)"
//                                   className="h-8 flex-1"
//                                 />
//                                 <div className="relative">
//                                   <Input
//                                     type="file"
//                                     onChange={(e) => handleFileUpload(e, true)}
//                                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                     accept=".pdf,.doc,.docx,.txt,.jpg,.png"
//                                   />
//                                   <Button type="button" variant="outline" className="h-8 pointer-events-none">
//                                     <Upload className="h-3 w-3" />
//                                   </Button>
//                                 </div>
//                               </div>
//                             </div>
//                           ) : (
//                             <div>
//                               <p className="font-medium">
//                                 {chart.description || chart.fileName || "Untitled Flowchart"}
//                               </p>
//                               {chart.fileUrl && <p className="text-sm text-muted-foreground">{chart.fileUrl}</p>}
//                               {chart.isModified && (
//                                 <Badge variant="outline" className="text-xs mt-1 bg-yellow-100 text-yellow-700">
//                                   Modified
//                                 </Badge>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                         <Badge variant="outline" className="bg-blue-100 text-blue-700">
//                           Existing
//                         </Badge>
//                       </div>
//                       <div className="flex items-center space-x-2 ml-4">
//                         {editingChart === chart.id ? (
//                           <>
//                             <Button
//                               size="sm"
//                               onClick={saveEditing}
//                               className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
//                             >
//                               <Save className="h-3 w-3" />
//                             </Button>
//                             <Button size="sm" variant="outline" onClick={cancelEditing} className="h-8 w-8 p-0">
//                               <X className="h-3 w-3" />
//                             </Button>
//                           </>
//                         ) : (
//                           <>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => startEditing(chart)}
//                               className="h-8 w-8 p-0"
//                             >
//                               <Edit className="h-3 w-3" />
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => removeFlowchart(chart.id!)}
//                               className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
//                             >
//                               <Trash2 className="h-3 w-3" />
//                             </Button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* New Flowcharts */}
//           {newCharts.length > 0 && (
//             <div className="space-y-4 mb-6">
//               <h3 className="text-lg font-semibold">New Flowcharts</h3>
//               <div className="space-y-3">
//                 {newCharts.map((chart) => (
//                   <div key={chart.id} className="p-4 border rounded-lg bg-green-50">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3 flex-1">
//                         <FileText className="h-5 w-5 text-green-600" />
//                         <div className="flex-1">
//                           <p className="font-medium">{chart.description || chart.fileName || "Untitled Flowchart"}</p>
//                           {chart.fileUrl && <p className="text-sm text-muted-foreground">{chart.fileUrl}</p>}
//                         </div>
//                         <Badge variant="outline" className="bg-green-100 text-green-700">
//                           New
//                         </Badge>
//                       </div>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => removeFlowchart(chart.id!)}
//                         className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
//                       >
//                         <Trash2 className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Add New Flowchart */}
//           <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
//             <h3 className="text-lg font-semibold">Add New Flowchart</h3>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="chartDescription">Description (Optional)</Label>
//                 <Input
//                   id="chartDescription"
//                   value={newChart.description}
//                   onChange={(e) => setNewChart((prev) => ({ ...prev, description: e.target.value }))}
//                   placeholder="Enter flowchart description (optional)"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="chartFileUrl">File URL (Optional)</Label>
//                 <div className="flex gap-2">
//                   <Input
//                     id="chartFileUrl"
//                     value={newChart.fileUrl}
//                     onChange={(e) => setNewChart((prev) => ({ ...prev, fileUrl: e.target.value }))}
//                     placeholder="Enter file URL or upload file (optional)"
//                     className="flex-1"
//                   />
//                   <div className="relative">
//                     <Input
//                       type="file"
//                       onChange={(e) => handleFileUpload(e)}
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                       accept=".pdf,.doc,.docx,.txt,.jpg,.png"
//                     />
//                     <Button type="button" variant="outline" className="pointer-events-none">
//                       <Upload className="h-4 w-4 mr-2" />
//                       Upload
//                     </Button>
//                   </div>
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
//                 </p>
//               </div>
//               <Button
//                 onClick={addFlowchart}
//                 className="bg-red-600 hover:bg-red-700 text-white"
//                 disabled={!newChart.fileUrl.trim() && !newChart.description.trim()}
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Flowchart
//               </Button>
//             </div>
//           </div>

//           {/* Summary */}
//           {flowcharts.length === 0 && (
//             <p className="text-muted-foreground text-center py-4">No flowcharts added to this station.</p>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-2 pt-4 border-t">
//             <Button onClick={onSubmit} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
//               {isLoading ? "Saving..." : isEdit ? "Update Station" : "Create Station"}
//             </Button>
//             <Button variant="outline" onClick={onCancel}>
//               Cancel
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }









// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Upload, Download, Eye, X, FileText, ImageIcon } from "lucide-react"

// interface FlowchartDocument {
//   id: string
//   filename: string
//   description?: string
//   fileUrl: string
//   fileType: string
//   uploadedAt: string
// }

// interface StationFlowchartsProps {
//   stationId: string
//   flowcharts: FlowchartDocument[]
//   onFlowchartsChange: (flowcharts: FlowchartDocument[]) => void
// }

// export default function StationFlowcharts({ stationId, flowcharts, onFlowchartsChange }: StationFlowchartsProps) {
//   const [uploadingFlowchart, setUploadingFlowchart] = useState(false)
//   const [newFlowchart, setNewFlowchart] = useState({
//     file: null as File | null,
//     description: "",
//   })

//   const handleFlowchartUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     setUploadingFlowchart(true)

//     try {
//       // Simulate file upload
//       const fileUrl = URL.createObjectURL(file)
//       const filename = file.name

//       const flowchartDoc: FlowchartDocument = {
//         id: Date.now().toString(),
//         filename,
//         description: newFlowchart.description || undefined,
//         fileUrl,
//         fileType: file.type,
//         uploadedAt: new Date().toISOString(),
//       }

//       onFlowchartsChange([...flowcharts, flowchartDoc])

//       // Reset form
//       setNewFlowchart({
//         file: null,
//         description: "",
//       })

//       // Reset file input
//       e.target.value = ""
//     } catch (error) {
//       console.error("Error uploading flowchart:", error)
//     } finally {
//       setUploadingFlowchart(false)
//     }
//   }

//   const handleRemoveFlowchart = (flowchartId: string) => {
//     onFlowchartsChange(flowcharts.filter((doc) => doc.id !== flowchartId))
//   }

//   const getFileIcon = (fileType: string) => {
//     if (fileType.startsWith("image/")) {
//       return <ImageIcon className="h-4 w-4" />
//     }
//     return <FileText className="h-4 w-4" />
//   }

//   const getDisplayName = (flowchart: FlowchartDocument) => {
//     if (!flowchart.description || flowchart.description === flowchart.filename) {
//       return flowchart.filename
//     }
//     return `${flowchart.filename} - ${flowchart.description}`
//   }

//   return (
//     <div className="space-y-6">
//       {/* Upload New Flowchart */}
//       <Card>
       
//         <CardContent className="space-y-4 mt-5">
//           <div className="grid gap-4">
//             <div>
//               <Label htmlFor="flowchart-file">Select File</Label>
//               <Input
//                 id="flowchart-file"
//                 type="file"
//                 accept="image/*,.pdf,.doc,.docx"
//                 onChange={handleFlowchartUpload}
//                 disabled={uploadingFlowchart}
//               />
//             </div>

//             <div>
//               <Label htmlFor="flowchart-description">Description (Optional)</Label>
//               <Textarea
//                 id="flowchart-description"
//                 placeholder="Enter description for the flowchart..."
//                 value={newFlowchart.description}
//                 onChange={(e) =>
//                   setNewFlowchart((prev) => ({
//                     ...prev,
//                     description: e.target.value,
//                   }))
//                 }
//                 disabled={uploadingFlowchart}
//               />
//             </div>
//           </div>

//           {uploadingFlowchart && <div className="text-sm text-muted-foreground">Uploading flowchart...</div>}
//         </CardContent>
//       </Card>

//       {/* Existing Flowcharts */}
//       {flowcharts.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Station Flowcharts ({flowcharts.length})</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {flowcharts.map((flowchart) => (
//                 <div
//                   key={flowchart.id}
//                   className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
//                 >
//                   <div className="flex items-center gap-3 flex-1 min-w-0">
//                     {getFileIcon(flowchart.fileType)}
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium truncate">{getDisplayName(flowchart)}</p>
//                       <p className="text-sm text-muted-foreground">
//                         Uploaded {new Date(flowchart.uploadedAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Button variant="outline" size="sm" onClick={() => window.open(flowchart.fileUrl, "_blank")}>
//                       <Eye className="h-4 w-4 mr-1" />
//                       View
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => {
//                         const link = document.createElement("a")
//                         link.href = flowchart.fileUrl
//                         link.download = flowchart.filename
//                         link.click()
//                       }}
//                     >
//                       <Download className="h-4 w-4 mr-1" />
//                       Download
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleRemoveFlowchart(flowchart.id)}
//                       className="text-destructive hover:text-destructive"
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {flowcharts.length === 0 && (
//         <Card>
//           <CardContent className="text-center py-8">
//             <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//             <p className="text-muted-foreground">No flowcharts uploaded yet</p>
//             <p className="text-sm text-muted-foreground mt-1">
//               Upload flowcharts to help visualize the station process
//             </p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }




















"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Download, Eye, X, FileText, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { StationFlowchartsApi } from "./station-flowcharts-api"

interface FlowchartDocument {
  id?: string
  filename?: string
  description?: string
  fileUrl?: string
  fileType?: string
  uploadedAt?: string
  file?: File
  isNew?: boolean
  originalName?: string
}

interface StationFlowchartsProps {
  flowcharts: any[]
  onChange: (flowcharts: any[]) => void
  stationId?: string
  onSubmit: () => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  isEdit?: boolean
}

export default function StationFlowcharts({
  flowcharts,
  onChange: onFlowchartsChange,
  stationId,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: StationFlowchartsProps) {
  const [uploadingFlowchart, setUploadingFlowchart] = useState(false)
  const [newFlowchart, setNewFlowchart] = useState({
    file: null as File | null,
    description: "",
  })
  const { toast } = useToast()

  const handleFlowchartUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFlowchart(true)

    try {
      // For edit mode with stationId, upload immediately
      if (isEdit && stationId) {
        const result = await StationFlowchartsApi.uploadFlowcharts([file], {
          stationId: stationId,
          description: newFlowchart.description || file.name,
        })

        if (result.error || !result.data) {
          throw new Error(result.error || "Upload failed")
        }

        const uploadedDoc = result.data[0]

        const flowchartDoc: FlowchartDocument = {
          id: uploadedDoc.id || Date.now().toString(),
          filename: uploadedDoc.originalName || file.name,
          description: uploadedDoc.description || newFlowchart.description || file.name,
          fileUrl: uploadedDoc.fileUrl,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
          originalName: uploadedDoc.originalName || file.name,
        }

        onFlowchartsChange([...flowcharts, flowchartDoc])
      } else {
        // For create mode, store the file temporarily with a blob URL
        const tempFlowchart: FlowchartDocument = {
          id: `temp-${Date.now()}`,
          filename: file.name,
          description: newFlowchart.description || file.name,
          fileUrl: URL.createObjectURL(file), // Create blob URL for preview
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
          file: file, // Store the actual file for later upload
          isNew: true,
          originalName: file.name,
        }

        onFlowchartsChange([...flowcharts, tempFlowchart])
      }

      // Reset form
      setNewFlowchart({
        file: null,
        description: "",
      })

      // Reset file input
      e.target.value = ""

      toast({
        title: "Success",
        description: `Flowchart "${file.name}" ${isEdit ? "uploaded" : "added"} successfully.`,
      })
    } catch (error: any) {
      console.error("Error uploading flowchart:", error)
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload flowchart.",
        variant: "destructive",
      })
    } finally {
      setUploadingFlowchart(false)
    }
  }

  const handleRemoveFlowchart = async (flowchartId: string) => {
    try {
      // If it's a real document (not temporary) and we're in edit mode, delete from server
      if (isEdit && !flowchartId.startsWith("temp-")) {
        const result = await StationFlowchartsApi.deleteFlowchart(flowchartId)
        if (result.error) {
          throw new Error(result.error)
        }
      }

      // Remove from local state
      onFlowchartsChange(flowcharts.filter((doc) => doc.id !== flowchartId))

      toast({
        title: "Success",
        description: "Flowchart removed successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete flowchart.",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType && fileType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <h4 className="text-xl font-semibold">Upload Flowcharts</h4>
      {/* Upload New Flowchart */}
      <Card>
        <CardContent className="space-y-4 mt-5">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="flowchart-file">Select File</Label>
              <Input
                id="flowchart-file"
                type="file"
                // accept="image/*,.pdf,.doc,.docx"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

                onChange={handleFlowchartUpload}
                disabled={uploadingFlowchart}
              />
            </div>

            <div>
              <Label htmlFor="flowchart-description">Description (Optional)</Label>
              <Textarea
                id="flowchart-description"
                placeholder="Enter description for the flowchart..."
                value={newFlowchart.description}
                onChange={(e) =>
                  setNewFlowchart((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                disabled={uploadingFlowchart}
              />
            </div>
          </div>

          {uploadingFlowchart && <div className="text-sm text-muted-foreground">Uploading flowchart...</div>}
        </CardContent>
      </Card>

      {/* Existing Flowcharts */}
      {flowcharts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Station Flowcharts ({flowcharts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {flowcharts.map((flowchart) => (
                <div
                  key={flowchart.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(flowchart.fileType || "")}
                    <div className="flex-1 min-w-0">
                      {/* Display filename and description separately */}
                      {(flowchart.filename || flowchart.originalName) && (
                        <p className="font-medium text-gray-900">
                          {/* <span className="text-sm text-gray-500">File: </span> */}
                          {flowchart.filename || flowchart.originalName}
                        </p>
                      )}
                      {flowchart.description && (
                        <p className="text-sm text-gray-700 mt-1">
                          {/* <span className="text-xs text-gray-500">Description: </span> */}
                          {flowchart.description}
                        </p>
                      )}
                    
                      {/* <p className="text-xs text-muted-foreground mt-1">
                        {flowchart.uploadedAt
                          ? `Uploaded ${new Date(flowchart.uploadedAt).toLocaleDateString()}`
                          : "Ready to upload"}
                      </p> */}
                     
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(flowchart.fileUrl, "_blank")}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          if (flowchart.id && !flowchart.id.startsWith("temp-") && isEdit) {
                            await StationFlowchartsApi.downloadAndSaveFile(flowchart.id, flowchart.filename)
                          } else {
                            const link = document.createElement("a")
                            link.href = flowchart.fileUrl || ""
                            link.download = flowchart.filename || "flowchart"
                            link.click()
                          }
                        } catch (error: any) {
                          toast({
                            title: "Download Failed",
                            description: error.message || "Failed to download file.",
                            variant: "destructive",
                          })
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFlowchart(flowchart.id || "")}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {flowcharts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No flowcharts uploaded yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload flowcharts to help visualize the station process
            </p>
          </CardContent>
        </Card>
      )}
   
    </div>
  )
}



