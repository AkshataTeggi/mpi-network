// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Plus, FileText, Trash2, Upload } from "lucide-react"
// import { Badge } from "@/components/ui/badge"

// interface StationDocumentationProps {
//   documentations: any[]
//   onChange: (documentations: any[]) => void
//   stationId?: string
//   onSubmit: () => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
//   isEdit?: boolean
// }

// export function StationDocumentation({
//   documentations,
//   onChange,
//   stationId,
//   onSubmit,
//   onCancel,
//   isLoading,
//   isEdit,
// }: StationDocumentationProps) {
//   const [newDoc, setNewDoc] = useState({
//     file: null as File | null,
//     description: "",
//   })

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null
//     setNewDoc((prev) => ({ ...prev, file }))
//   }

//   const addDocumentation = () => {
//     if (newDoc.file) {
//       const newDocumentation = {
//         id: `temp-${Date.now()}`,
//         file: newDoc.file,
//         fileName: newDoc.file.name,
//         description: newDoc.description.trim() || newDoc.file.name, // Use filename if no description
//         stationId: stationId || "",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         isNew: true, // Flag to identify new uploads
//       }
//       onChange([...documentations, newDocumentation])
//       setNewDoc({ file: null, description: "" })
//       // Reset file input
//       const fileInput = document.getElementById("documentFile") as HTMLInputElement
//       if (fileInput) fileInput.value = ""
//     }
//   }

//   const removeDocumentation = (docId: string) => {
//     const newDocs = documentations.filter((doc) => doc.id !== docId)
//     onChange(newDocs)
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
//           {/* Upload New Documentation */}
//           <div className="space-y-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 ">
//             <div className="text-center">
//               <Upload className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="text-lg font-semibold mt-2">Upload Documentation</h3>
//               <p className="text-sm text-muted-foreground">Add documentation files for this station</p>
//             </div>

//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="documentFile">Select File *</Label>
//                 <Input
//                   id="documentFile"
//                   type="file"
//                   onChange={handleFileChange}
//                   accept=".pdf,.doc,.docx,.txt,.md"
//                   className="cursor-pointer"
//                 />
//                 <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX, TXT, MD (Max 10MB)</p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="docDescription">Description (Optional)</Label>
//                 <Input
//                   id="docDescription"
//                   value={newDoc.description}
//                   onChange={(e) => setNewDoc((prev) => ({ ...prev, description: e.target.value }))}
//                   placeholder="Enter description for this document (optional)"
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   If no description is provided, the filename will be used
//                 </p>
//               </div>

//               <Button
//                 onClick={addDocumentation}
//                 className="w-full bg-red-600 hover:bg-red-700 text-white"
//                 disabled={!newDoc.file}
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Documentation
//               </Button>
//             </div>
//           </div>

//           {/* Uploaded Documentation List */}
//           <div className="space-y-4 mt-6 mb-5">
//             {documentations.length === 0 ? (
//               <p className="text-muted-foreground text-center py-4">No documentation files uploaded yet.</p>
//             ) : (
//               <div className="space-y-3 ">
//                 {documentations.map((doc) => (
//                   <Card key={doc.id} className="p-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-start gap-3 flex-1">
//                         <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                         <div className="flex-1 min-w-0">
//                           <h4 className="font-medium truncate">{doc.description}</h4>
//                           <p className="text-sm text-muted-foreground truncate">
//                             {doc.fileName || (doc.file ? doc.file.name : doc.fileUrl)}
//                           </p>
//                           {doc.file && (
//                             <p className="text-xs text-muted-foreground">Size: {formatFileSize(doc.file.size)}</p>
//                           )}
//                           {doc.isNew && (
//                             <Badge variant="outline" className="text-xs mt-1">
//                               Ready to upload
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => removeDocumentation(doc.id)}
//                         className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
//                       >
//                         <Trash2 className="w-3 h-3" />
//                       </Button>
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
// import { Plus, FileText, Trash2, Upload } from 'lucide-react'
// import { Badge } from "@/components/ui/badge"

// interface StationDocumentationProps {
//   documentations: any[]
//   onChange: (documentations: any[]) => void
//   stationId?: string
//   onSubmit: () => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
//   isEdit?: boolean
// }

// export function StationDocumentation({
//   documentations,
//   onChange,
//   stationId,
//   onSubmit,
//   onCancel,
//   isLoading,
//   isEdit,
// }: StationDocumentationProps) {
//   const [newDoc, setNewDoc] = useState({
//     file: null as File | null,
//     description: "",
//   })

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null
//     setNewDoc((prev) => ({ ...prev, file }))
//   }

//   const addDocumentation = () => {
//     if (newDoc.file) {
//       const newDocumentation = {
//         id: `temp-${Date.now()}`,
//         file: newDoc.file,
//         fileName: newDoc.file.name,
//         description: newDoc.description.trim() || newDoc.file.name, // Use filename if no description
//         stationId: stationId || "",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         isNew: true, // Flag to identify new uploads
//       }
//       onChange([...documentations, newDocumentation])
//       setNewDoc({ file: null, description: "" })
//       // Reset file input
//       const fileInput = document.getElementById("documentFile") as HTMLInputElement
//       if (fileInput) fileInput.value = ""
//     }
//   }

//   const removeDocumentation = (docId: string) => {
//     const newDocs = documentations.filter((doc) => doc.id !== docId)
//     onChange(newDocs)
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
//           {/* Upload New Documentation */}
//           <div className="space-y-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 ">
//             <div className="text-center">
//               <Upload className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="text-lg font-semibold mt-2">Upload Documentation</h3>
//               <p className="text-sm text-muted-foreground">Add documentation files for this station</p>
//             </div>

//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="documentFile">Select File *</Label>
//                 <Input
//                   id="documentFile"
//                   type="file"
//                   onChange={handleFileChange}
//                   accept=".pdf,.doc,.docx,.txt,.md"
//                   className="cursor-pointer"
//                 />
//                 <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX, TXT, MD (Max 10MB)</p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="docDescription">Description (Optional)</Label>
//                 <Input
//                   id="docDescription"
//                   value={newDoc.description}
//                   onChange={(e) => setNewDoc((prev) => ({ ...prev, description: e.target.value }))}
//                   placeholder="Enter description for this document (optional)"
//                 />
                
//               </div>

//               <Button
//                 onClick={addDocumentation}
//                 className="w-full bg-red-600 hover:bg-red-700 text-white"
//                 disabled={!newDoc.file}
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Documentation
//               </Button>
//             </div>
//           </div>

//           {/* Uploaded Documentation List */}
//           <div className="space-y-4 mt-6 mb-5">
//             {documentations.length === 0 ? (
//               <p className="text-muted-foreground text-center py-4">No documentation files uploaded yet.</p>
//             ) : (
//               <div className="space-y-3 ">
//                 {documentations.map((doc) => (
//                   <Card key={doc.id} className="p-4">
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-start gap-3 flex-1">
//                         <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//                         <div className="flex-1 min-w-0">
//                           <h4 className="font-medium truncate">{doc.description}</h4>
//                           <p className="text-sm text-muted-foreground truncate">
//                             {doc.fileName || (doc.file ? doc.file.name : doc.fileUrl)}
//                           </p>
//                           {doc.file && (
//                             <p className="text-xs text-muted-foreground">Size: {formatFileSize(doc.file.size)}</p>
//                           )}
//                           {doc.isNew && (
//                             <Badge variant="outline" className="text-xs mt-1">
//                               Ready to upload
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => removeDocumentation(doc.id)}
//                         className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
//                       >
//                         <Trash2 className="w-3 h-3" />
//                       </Button>
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
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Trash2, Upload, FileText, Edit, Save, X } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface Documentation {
//   id?: string
//   description: string
//   fileUrl: string
//   fileName?: string
//   isNew?: boolean
//   isModified?: boolean
// }

// interface StationDocumentationProps {
//   documentations: Documentation[]
//   onChange: (documentations: Documentation[]) => void
//   stationId?: string
//   onSubmit: () => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
//   isEdit?: boolean
// }

// export function StationDocumentation({
//   documentations,
//   onChange,
//   stationId,
//   onSubmit,
//   onCancel,
//   isLoading,
//   isEdit,
// }: StationDocumentationProps) {
//   const [newDoc, setNewDoc] = useState({ description: "", fileUrl: "" })
//   const [editingDoc, setEditingDoc] = useState<string | null>(null)
//   const [editingData, setEditingData] = useState<{ description: string; fileUrl: string }>({
//     description: "",
//     fileUrl: "",
//   })
//   const { toast } = useToast()

//   const addDocumentation = () => {
//     if (!newDoc.fileUrl.trim() && !newDoc.description.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Please provide either a file URL or description.",
//         variant: "destructive",
//       })
//       return
//     }

//     // Extract filename from URL if no description provided
//     const fileName = newDoc.fileUrl ? newDoc.fileUrl.split("/").pop() || "Unknown file" : "No file"
//     const description = newDoc.description.trim() || fileName

//     const documentation: Documentation = {
//       id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       description: description,
//       fileUrl: newDoc.fileUrl.trim() || "",
//       fileName: fileName,
//       isNew: true,
//     }

//     onChange([...documentations, documentation])
//     setNewDoc({ description: "", fileUrl: "" })

//     toast({
//       title: "Success",
//       description: "Documentation added successfully.",
//     })
//   }

//   const removeDocumentation = (docId: string) => {
//     const doc = documentations.find((d) => d.id === docId)
//     if (!doc) return

//     const displayName = doc.description || doc.fileName || "this document"
//     if (!confirm(`Are you sure you want to remove "${displayName}"?`)) {
//       return
//     }

//     onChange(documentations.filter((d) => d.id !== docId))

//     toast({
//       title: "Success",
//       description: "Documentation removed successfully.",
//     })
//   }

//   const startEditing = (doc: Documentation) => {
//     if (!doc.id) return
//     setEditingDoc(doc.id)
//     setEditingData({
//       description: doc.description,
//       fileUrl: doc.fileUrl,
//     })
//   }

//   const cancelEditing = () => {
//     setEditingDoc(null)
//     setEditingData({ description: "", fileUrl: "" })
//   }

//   const saveEditing = () => {
//     if (!editingDoc) return

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
//       documentations.map((doc) =>
//         doc.id === editingDoc
//           ? {
//               ...doc,
//               description: description,
//               fileUrl: editingData.fileUrl.trim() || "",
//               fileName: fileName,
//               isModified: !doc.isNew, // Mark as modified if it's an existing doc
//             }
//           : doc,
//       ),
//     )

//     setEditingDoc(null)
//     setEditingData({ description: "", fileUrl: "" })

//     toast({
//       title: "Success",
//       description: "Documentation updated successfully.",
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
//       setNewDoc((prev) => ({
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

//   // Separate existing and new documentations
//   const existingDocs = documentations.filter((doc) => !doc.isNew)
//   const newDocs = documentations.filter((doc) => doc.isNew)

//   return (
//     <div className="space-y-6">
//       <Card>
       
//         <CardContent className="mt-5">
//           {/* Existing Documentations */}
//           {existingDocs.length > 0 && (
//             <div className="space-y-4 mb-6">
//               <h3 className="text-lg font-semibold">Existing Documentation</h3>
//               <div className="space-y-3">
//                 {existingDocs.map((doc) => (
//                   <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
//                     <div className="flex items-center space-x-3 flex-1">
//                       <FileText className="h-5 w-5 text-blue-600" />
//                       <div className="flex-1">
//                         {editingDoc === doc.id ? (
//                           <div className="space-y-2">
//                             <Input
//                               value={editingData.description}
//                               onChange={(e) => setEditingData((prev) => ({ ...prev, description: e.target.value }))}
//                               placeholder="Description (optional)"
//                               className="h-8"
//                             />
//                             <div className="flex gap-2">
//                               <Input
//                                 value={editingData.fileUrl}
//                                 onChange={(e) => setEditingData((prev) => ({ ...prev, fileUrl: e.target.value }))}
//                                 placeholder="File URL (optional)"
//                                 className="h-8 flex-1"
//                               />
//                               <div className="relative">
//                                 <Input
//                                   type="file"
//                                   onChange={(e) => handleFileUpload(e, true)}
//                                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                   accept=".pdf,.doc,.docx,.txt,.jpg,.png"
//                                 />
//                                 <Button type="button" variant="outline" className="h-8 pointer-events-none">
//                                   <Upload className="h-3 w-3" />
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>
//                         ) : (
//                           <div>
//                             <p className="font-medium">{doc.description || doc.fileName || "Untitled Document"}</p>
//                             {doc.fileUrl && <p className="text-sm text-muted-foreground">{doc.fileUrl}</p>}
//                             {doc.isModified && (
//                               <Badge variant="outline" className="text-xs mt-1 bg-yellow-100 text-yellow-700">
//                                 Modified
//                               </Badge>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                       <Badge variant="outline" className="bg-blue-100 text-blue-700">
//                         Existing
//                       </Badge>
//                     </div>
//                     <div className="flex items-center space-x-2 ml-4">
//                       {editingDoc === doc.id ? (
//                         <>
//                           <Button
//                             size="sm"
//                             onClick={saveEditing}
//                             className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
//                           >
//                             <Save className="h-3 w-3" />
//                           </Button>
//                           <Button size="sm" variant="outline" onClick={cancelEditing} className="h-8 w-8 p-0">
//                             <X className="h-3 w-3" />
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <Button size="sm" variant="outline" onClick={() => startEditing(doc)} className="h-8 w-8 p-0">
//                             <Edit className="h-3 w-3" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => removeDocumentation(doc.id!)}
//                             className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* New Documentations */}
//           {newDocs.length > 0 && (
//             <div className="space-y-4 mb-6">
//               <h3 className="text-lg font-semibold">New Documentation</h3>
//               <div className="space-y-3">
//                 {newDocs.map((doc) => (
//                   <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
//                     <div className="flex items-center space-x-3 flex-1">
//                       <FileText className="h-5 w-5 text-green-600" />
//                       <div className="flex-1">
//                         <p className="font-medium">{doc.description || doc.fileName || "Untitled Document"}</p>
//                         {doc.fileUrl && <p className="text-sm text-muted-foreground">{doc.fileUrl}</p>}
//                       </div>
//                       <Badge variant="outline" className="bg-green-100 text-green-700">
//                         New
//                       </Badge>
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => removeDocumentation(doc.id!)}
//                       className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
//                     >
//                       <Trash2 className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Add New Documentation */}
//           <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
//             <h3 className="text-lg font-semibold">Add New Documentation</h3>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="docDescription">Description (Optional)</Label>
//                 <Input
//                   id="docDescription"
//                   value={newDoc.description}
//                   onChange={(e) => setNewDoc((prev) => ({ ...prev, description: e.target.value }))}
//                   placeholder="Enter documentation description (optional)"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="docFileUrl">File URL (Optional)</Label>
//                 <div className="flex gap-2">
//                   <Input
//                     id="docFileUrl"
//                     value={newDoc.fileUrl}
//                     onChange={(e) => setNewDoc((prev) => ({ ...prev, fileUrl: e.target.value }))}
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
//                 onClick={addDocumentation}
//                 className="bg-red-600 hover:bg-red-700 text-white"
//                 disabled={!newDoc.fileUrl.trim() && !newDoc.description.trim()}
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Documentation
//               </Button>
//             </div>
//           </div>

//           {/* Summary */}
//           {documentations.length === 0 && (
//             <p className="text-muted-foreground text-center py-4">No documentation added to this station.</p>
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
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Trash2, Upload, FileText, Edit, Save, X } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface Documentation {
//   id?: string
//   description: string
//   fileUrl: string
//   fileName?: string
//   isNew?: boolean
//   isModified?: boolean
// }

// interface StationDocumentationProps {
//   documentations: Documentation[]
//   onChange: (documentations: Documentation[]) => void
//   stationId?: string
//   onSubmit: () => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
//   isEdit?: boolean
// }

// export function StationDocumentation({
//   documentations,
//   onChange,
//   stationId,
//   onSubmit,
//   onCancel,
//   isLoading,
//   isEdit,
// }: StationDocumentationProps) {
//   const [newDoc, setNewDoc] = useState({ description: "", fileUrl: "" })
//   const [editingDoc, setEditingDoc] = useState<string | null>(null)
//   const [editingData, setEditingData] = useState<{ description: string; fileUrl: string }>({
//     description: "",
//     fileUrl: "",
//   })
//   const { toast } = useToast()

//   const addDocumentation = () => {
//     if (!newDoc.fileUrl.trim() && !newDoc.description.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Please provide either a file URL or description.",
//         variant: "destructive",
//       })
//       return
//     }

//     const fileName = newDoc.fileUrl ? newDoc.fileUrl.split("/").pop() || "Unknown file" : "No file"

//     const documentation: Documentation = {
//       id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       description: newDoc.description.trim(),
//       fileUrl: newDoc.fileUrl.trim() || "",
//       fileName,
//       isNew: true,
//     }

//     onChange([...documentations, documentation])
//     setNewDoc({ description: "", fileUrl: "" })

//     toast({
//       title: "Success",
//       description: "Documentation added successfully.",
//     })
//   }

//   const removeDocumentation = (docId: string) => {
//     const doc = documentations.find((d) => d.id === docId)
//     if (!doc) return

//     const displayName = doc.description || doc.fileName || "this document"
//     if (!confirm(`Are you sure you want to remove "${displayName}"?`)) {
//       return
//     }

//     onChange(documentations.filter((d) => d.id !== docId))

//     toast({
//       title: "Success",
//       description: "Documentation removed successfully.",
//     })
//   }

//   const startEditing = (doc: Documentation) => {
//     if (!doc.id) return
//     setEditingDoc(doc.id)
//     setEditingData({
//       description: doc.description,
//       fileUrl: doc.fileUrl,
//     })
//   }

//   const cancelEditing = () => {
//     setEditingDoc(null)
//     setEditingData({ description: "", fileUrl: "" })
//   }

//   const saveEditing = () => {
//     if (!editingDoc) return

//     if (!editingData.fileUrl.trim() && !editingData.description.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Please provide either a file URL or description.",
//         variant: "destructive",
//       })
//       return
//     }

//     const fileName = editingData.fileUrl ? editingData.fileUrl.split("/").pop() || "Unknown file" : "No file"

//     onChange(
//       documentations.map((doc) =>
//         doc.id === editingDoc
//           ? {
//               ...doc,
//               description: editingData.description.trim(),
//               fileUrl: editingData.fileUrl.trim() || "",
//               fileName,
//               isModified: !doc.isNew,
//             }
//           : doc,
//       ),
//     )

//     setEditingDoc(null)
//     setEditingData({ description: "", fileUrl: "" })

//     toast({
//       title: "Success",
//       description: "Documentation updated successfully.",
//     })
//   }

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     const fileUrl = `uploads/${file.name}`

//     if (isEditing) {
//       setEditingData((prev) => ({
//         ...prev,
//         fileUrl,
//         description: prev.description || file.name,
//       }))
//     } else {
//       setNewDoc((prev) => ({
//         ...prev,
//         fileUrl,
//         description: prev.description || file.name,
//       }))
//     }

//     toast({
//       title: "File Selected",
//       description: `File "${file.name}" selected. URL: ${fileUrl}`,
//     })
//   }

//   const existingDocs = documentations.filter((doc) => !doc.isNew)
//   const newDocs = documentations.filter((doc) => doc.isNew)

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardContent className="mt-5">
//           {/* Existing Docs */}
//           {existingDocs.length > 0 && (
//             <div className="space-y-4 mb-6">
//               <h3 className="text-lg font-semibold">Existing Documentation</h3>
//               <div className="space-y-3">
//                 {existingDocs.map((doc) => (
//                   <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
//                     <div className="flex items-center space-x-3 flex-1">
//                       <FileText className="h-5 w-5 text-blue-600" />
//                       <div className="flex-1">
//                         {editingDoc === doc.id ? (
//                           <div className="space-y-2">
//                             <Input
//                               value={editingData.description}
//                               onChange={(e) => setEditingData((prev) => ({ ...prev, description: e.target.value }))}
//                               placeholder="Description (optional)"
//                               className="h-8"
//                             />
//                             <div className="flex gap-2">
//                               <Input
//                                 value={editingData.fileUrl}
//                                 onChange={(e) => setEditingData((prev) => ({ ...prev, fileUrl: e.target.value }))}
//                                 placeholder="File URL (optional)"
//                                 className="h-8 flex-1"
//                               />
//                               <div className="relative">
//                                 <Input
//                                   type="file"
//                                   onChange={(e) => handleFileUpload(e, true)}
//                                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                   accept=".pdf,.doc,.docx,.txt,.jpg,.png"
//                                 />
//                                 <Button type="button" variant="outline" className="h-8 pointer-events-none">
//                                   <Upload className="h-3 w-3" />
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>
//                         ) : (
//                           <div>
//                             <p className="font-medium">
//                               {doc.description}
//                               {doc.fileName && doc.description !== doc.fileName && (
//                                 <span className="text-sm text-muted-foreground ml-2">({doc.fileName})</span>
//                               )}
//                             </p>
//                             {doc.fileUrl && <p className="text-sm text-muted-foreground">{doc.fileUrl}</p>}
//                             {doc.isModified && (
//                               <Badge variant="outline" className="text-xs mt-1 bg-yellow-100 text-yellow-700">
//                                 Modified
//                               </Badge>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                       <Badge variant="outline" className="bg-blue-100 text-blue-700">
//                         Existing
//                       </Badge>
//                     </div>
//                     <div className="flex items-center space-x-2 ml-4">
//                       {editingDoc === doc.id ? (
//                         <>
//                           <Button size="sm" onClick={saveEditing} className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700">
//                             <Save className="h-3 w-3" />
//                           </Button>
//                           <Button size="sm" variant="outline" onClick={cancelEditing} className="h-8 w-8 p-0">
//                             <X className="h-3 w-3" />
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <Button size="sm" variant="outline" onClick={() => startEditing(doc)} className="h-8 w-8 p-0">
//                             <Edit className="h-3 w-3" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => removeDocumentation(doc.id!)}
//                             className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* New Docs */}
//           {newDocs.length > 0 && (
//             <div className="space-y-4 mb-6">
//               <h3 className="text-lg font-semibold">New Documentation</h3>
//               <div className="space-y-3">
//                 {newDocs.map((doc) => (
//                   <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
//                     <div className="flex items-center space-x-3 flex-1">
//                       <FileText className="h-5 w-5 text-green-600" />
//                       <div className="flex-1">
//                         <p className="font-medium">
//                           {doc.description}
//                           {doc.fileName && doc.description !== doc.fileName && (
//                             <span className="text-sm text-muted-foreground ml-2">({doc.fileName})</span>
//                           )}
//                         </p>
//                         {doc.fileUrl && <p className="text-sm text-muted-foreground">{doc.fileUrl}</p>}
//                       </div>
//                       <Badge variant="outline" className="bg-green-100 text-green-700">
//                         New
//                       </Badge>
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => removeDocumentation(doc.id!)}
//                       className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
//                     >
//                       <Trash2 className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Add New Doc */}
//           <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
//             <h3 className="text-lg font-semibold">Add New Documentation</h3>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="docDescription">Description (Optional)</Label>
//                 <Input
//                   id="docDescription"
//                   value={newDoc.description}
//                   onChange={(e) => setNewDoc((prev) => ({ ...prev, description: e.target.value }))}
//                   placeholder="Enter documentation description (optional)"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="docFileUrl">File URL (Optional)</Label>
//                 <div className="flex gap-2">
//                   <Input
//                     id="docFileUrl"
//                     value={newDoc.fileUrl}
//                     onChange={(e) => setNewDoc((prev) => ({ ...prev, fileUrl: e.target.value }))}
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
//                 onClick={addDocumentation}
//                 className="bg-red-600 hover:bg-red-700 text-white"
//                 disabled={!newDoc.fileUrl.trim() && !newDoc.description.trim()}
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Documentation
//               </Button>
//             </div>
//           </div>

//           {/* Summary */}
//           {documentations.length === 0 && (
//             <p className="text-muted-foreground text-center py-4">No documentation added to this station.</p>
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
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Trash2, Upload, FileText, Edit, Save, X } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface Documentation {
//   id?: string
//   description: string
//   fileUrl: string
//   fileName?: string
//   isNew?: boolean
//   isModified?: boolean
// }

// interface StationDocumentationProps {
//   documentations: Documentation[]
//   onChange: (documentations: Documentation[]) => void
//   stationId?: string
//   onSubmit: () => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
//   isEdit?: boolean
// }

// export function StationDocumentation({
//   documentations,
//   onChange,
//   stationId,
//   onSubmit,
//   onCancel,
//   isLoading,
//   isEdit,
// }: StationDocumentationProps) {
//   const [newDoc, setNewDoc] = useState({ description: "", fileUrl: "" })
//   const [editingDoc, setEditingDoc] = useState<string | null>(null)
//   const [editingData, setEditingData] = useState<{ description: string; fileUrl: string }>({
//     description: "",
//     fileUrl: "",
//   })
//   const { toast } = useToast()

//   const addDocumentation = () => {
//     if (!newDoc.fileUrl.trim() && !newDoc.description.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Please provide either a file URL or description.",
//         variant: "destructive",
//       })
//       return
//     }

//     const fileName = newDoc.fileUrl ? newDoc.fileUrl.split("/").pop() || "Unknown file" : "No file"

//     const documentation: Documentation = {
//       id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       description: newDoc.description.trim(),
//       fileUrl: newDoc.fileUrl.trim() || "",
//       fileName,
//       isNew: true,
//     }

//     onChange([...documentations, documentation])
//     setNewDoc({ description: "", fileUrl: "" })

//     toast({
//       title: "Success",
//       description: "Documentation added successfully.",
//     })
//   }

//   const removeDocumentation = (docId: string) => {
//     const doc = documentations.find((d) => d.id === docId)
//     if (!doc) return

//     const displayName = doc.description || doc.fileName || "this document"
//     if (!confirm(`Are you sure you want to remove "${displayName}"?`)) {
//       return
//     }

//     onChange(documentations.filter((d) => d.id !== docId))

//     toast({
//       title: "Success",
//       description: "Documentation removed successfully.",
//     })
//   }

//   const startEditing = (doc: Documentation) => {
//     if (!doc.id) return
//     setEditingDoc(doc.id)
//     setEditingData({
//       description: doc.description,
//       fileUrl: doc.fileUrl,
//     })
//   }

//   const cancelEditing = () => {
//     setEditingDoc(null)
//     setEditingData({ description: "", fileUrl: "" })
//   }

//   const saveEditing = () => {
//     if (!editingDoc) return

//     if (!editingData.fileUrl.trim() && !editingData.description.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Please provide either a file URL or description.",
//         variant: "destructive",
//       })
//       return
//     }

//     const fileName = editingData.fileUrl ? editingData.fileUrl.split("/").pop() || "Unknown file" : "No file"

//     onChange(
//       documentations.map((doc) =>
//         doc.id === editingDoc
//           ? {
//               ...doc,
//               description: editingData.description.trim(),
//               fileUrl: editingData.fileUrl.trim() || "",
//               fileName,
//               isModified: !doc.isNew,
//             }
//           : doc,
//       ),
//     )

//     setEditingDoc(null)
//     setEditingData({ description: "", fileUrl: "" })

//     toast({
//       title: "Success",
//       description: "Documentation updated successfully.",
//     })
//   }

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     const fileUrl = `uploads/${file.name}`

//     if (isEditing) {
//       setEditingData((prev) => ({
//         ...prev,
//         fileUrl,
//       }))
//     } else {
//       setNewDoc((prev) => ({
//         ...prev,
//         fileUrl,
//       }))
//     }

//     toast({
//       title: "File Selected",
//       description: `File "${file.name}" selected. URL: ${fileUrl}`,
//     })
//   }

//   const existingDocs = documentations.filter((doc) => !doc.isNew)
//   const newDocs = documentations.filter((doc) => doc.isNew)

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardContent className="mt-5">
//           {/* Existing Docs */}
//           {existingDocs.length > 0 && (
//             <div className="space-y-4 mb-6">
//               <h3 className="text-lg font-semibold">Existing Documentation</h3>
//               <div className="space-y-3">
//                 {existingDocs.map((doc) => (
//                   <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
//                     <div className="flex items-center space-x-3 flex-1">
//                       <FileText className="h-5 w-5 text-blue-600" />
//                       <div className="flex-1">
//                         {editingDoc === doc.id ? (
//                           <div className="space-y-2">
//                             <Input
//                               value={editingData.description}
//                               onChange={(e) => setEditingData((prev) => ({ ...prev, description: e.target.value }))}
//                               placeholder="Description (optional)"
//                               className="h-8"
//                             />
//                             <div className="flex gap-2">
//                               <Input
//                                 value={editingData.fileUrl}
//                                 onChange={(e) => setEditingData((prev) => ({ ...prev, fileUrl: e.target.value }))}
//                                 placeholder="File URL (optional)"
//                                 className="h-8 flex-1"
//                               />
//                               <div className="relative">
//                                 <Input
//                                   type="file"
//                                   onChange={(e) => handleFileUpload(e, true)}
//                                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                   accept=".pdf,.doc,.docx,.txt,.jpg,.png"
//                                 />
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   className="h-8 pointer-events-none bg-transparent"
//                                 >
//                                   <Upload className="h-3 w-3" />
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>
//                         ) : (
//                           <div>
//                             <p className="font-medium">
//                               {doc.fileName && doc.fileName !== "No file"
//                                 ? doc.fileName
//                                 : doc.description || "Untitled Document"}
//                               {doc.description && doc.description !== doc.fileName && doc.fileName !== "No file" && (
//                                 <span className="text-sm text-muted-foreground ml-2">- {doc.description}</span>
//                               )}
//                             </p>
//                             {doc.fileUrl && <p className="text-sm text-muted-foreground">{doc.fileUrl}</p>}
//                             {doc.isModified && (
//                               <Badge variant="outline" className="text-xs mt-1 bg-yellow-100 text-yellow-700">
//                                 Modified
//                               </Badge>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                       <Badge variant="outline" className="bg-blue-100 text-blue-700">
//                         Existing
//                       </Badge>
//                     </div>
//                     <div className="flex items-center space-x-2 ml-4">
//                       {editingDoc === doc.id ? (
//                         <>
//                           <Button
//                             size="sm"
//                             onClick={saveEditing}
//                             className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
//                           >
//                             <Save className="h-3 w-3" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={cancelEditing}
//                             className="h-8 w-8 p-0 bg-transparent"
//                           >
//                             <X className="h-3 w-3" />
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <Button size="sm" variant="outline" onClick={() => startEditing(doc)} className="h-8 w-8 p-0">
//                             <Edit className="h-3 w-3" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => removeDocumentation(doc.id!)}
//                             className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* New Docs */}
//           {newDocs.length > 0 && (
//             <div className="space-y-4 mb-6">
//               <h3 className="text-lg font-semibold">New Documentation</h3>
//               <div className="space-y-3">
//                 {newDocs.map((doc) => (
//                   <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
//                     <div className="flex items-center space-x-3 flex-1">
//                       <FileText className="h-5 w-5 text-green-600" />
//                       <div className="flex-1">
//                         <p className="font-medium">
//                           {doc.fileName && doc.fileName !== "No file"
//                             ? doc.fileName
//                             : doc.description || "Untitled Document"}
//                           {doc.description && doc.description !== doc.fileName && doc.fileName !== "No file" && (
//                             <span className="text-sm text-muted-foreground ml-2">- {doc.description}</span>
//                           )}
//                         </p>
//                         {doc.fileUrl && <p className="text-sm text-muted-foreground">{doc.fileUrl}</p>}
//                       </div>
//                       <Badge variant="outline" className="bg-green-100 text-green-700">
//                         New
//                       </Badge>
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => removeDocumentation(doc.id!)}
//                       className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
//                     >
//                       <Trash2 className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Add New Doc */}
//           <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
//             <h3 className="text-lg font-semibold">Add New Documentation</h3>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="docDescription">Description (Optional)</Label>
//                 <Input
//                   id="docDescription"
//                   value={newDoc.description}
//                   onChange={(e) => setNewDoc((prev) => ({ ...prev, description: e.target.value }))}
//                   placeholder="Enter documentation description (optional)"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="docFileUrl">File URL (Optional)</Label>
//                 <div className="flex gap-2">
//                   <Input
//                     id="docFileUrl"
//                     value={newDoc.fileUrl}
//                     onChange={(e) => setNewDoc((prev) => ({ ...prev, fileUrl: e.target.value }))}
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
//                     <Button type="button" variant="outline" className="pointer-events-none bg-transparent">
//                       <Upload className="h-4 w-4 mr-2" />
//                       Upload
//                     </Button>
//                   </div>
//                 </div>
             
//               </div>
//               <Button
//                 onClick={addDocumentation}
//                 className="bg-red-600 hover:bg-red-700 text-white"
//                 disabled={!newDoc.fileUrl.trim() && !newDoc.description.trim()}
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Documentation
//               </Button>
//             </div>
//           </div>

//           {/* Summary */}
//           {documentations.length === 0 && (
//             <p className="text-muted-foreground text-center py-4">No documentation added to this station.</p>
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
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Trash2, Upload, FileText, Edit, Save, X } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { StationDocumentationApi } from "./station-docs-api"

// interface Documentation {
//   id?: string
//   description: string
//   fileUrl: string
//   fileName?: string
//   originalName?: string
//   isNew?: boolean
//   isModified?: boolean
// }

// interface StationDocumentationProps {
//   documentations: Documentation[]
//   onChange: (documentations: Documentation[]) => void
//   stationId?: string
//   onSubmit: () => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
//   isEdit?: boolean
// }

// export function StationDocumentation({
//   documentations,
//   onChange,
//   stationId,
//   onSubmit,
//   onCancel,
//   isLoading,
//   isEdit,
// }: StationDocumentationProps) {
//   const [newDoc, setNewDoc] = useState({ description: "", fileUrl: "", fileName: "", originalName: "" })
//   const [editingDoc, setEditingDoc] = useState<string | null>(null)
//   const [editingData, setEditingData] = useState<{
//     description: string
//     fileUrl: string
//     fileName?: string
//     originalName?: string
//   }>({
//     description: "",
//     fileUrl: "",
//     fileName: "",
//     originalName: "",
//   })
//   const { toast } = useToast()

//   const addDocumentation = async () => {
//     if (!newDoc.fileUrl.trim() && !newDoc.description.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Please provide either a file URL or description.",
//         variant: "destructive",
//       })
//       return
//     }

//     // Don't add documentation without a file URL during creation mode
//     if (!isEdit && !newDoc.fileUrl.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Please upload a file or provide a file URL.",
//         variant: "destructive",
//       })
//       return
//     }

//     const fileName = newDoc.fileName || (newDoc.fileUrl ? newDoc.fileUrl.split("/").pop() || "Unknown file" : "")

//     const documentation: Documentation = {
//       id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       description: newDoc.description.trim(),
//       fileUrl: newDoc.fileUrl.trim() || "",
//       fileName,
//       originalName: fileName,
//       isNew: true,
//     }

//     onChange([...documentations, documentation])
//     setNewDoc({ description: "", fileUrl: "", fileName: "", originalName: "" })

//     toast({
//       title: "Success",
//       description: "Documentation added successfully.",
//     })
//   }

//   const removeDocumentation = (docId: string) => {
//     const doc = documentations.find((d) => d.id === docId)
//     if (!doc) return

//     const displayName = doc.description || doc.fileName || "this document"
//     if (!confirm(`Are you sure you want to remove "${displayName}"?`)) {
//       return
//     }

//     onChange(documentations.filter((d) => d.id !== docId))

//     toast({
//       title: "Success",
//       description: "Documentation removed successfully.",
//     })
//   }

//   const startEditing = (doc: Documentation) => {
//     if (!doc.id) return
//     setEditingDoc(doc.id)
//     setEditingData({
//       description: doc.description,
//       fileUrl: doc.fileUrl,
//       fileName: doc.fileName,
//       originalName: doc.originalName,
//     })
//   }

//   const cancelEditing = () => {
//     setEditingDoc(null)
//     setEditingData({ description: "", fileUrl: "", fileName: "", originalName: "" })
//   }

//   const saveEditing = () => {
//     if (!editingDoc) return

//     if (!editingData.fileUrl.trim() && !editingData.description.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Please provide either a file URL or description.",
//         variant: "destructive",
//       })
//       return
//     }

//     const fileName =
//       editingData.fileName || (editingData.fileUrl ? editingData.fileUrl.split("/").pop() || "Unknown file" : "")

//     onChange(
//       documentations.map((doc) =>
//         doc.id === editingDoc
//           ? {
//               ...doc,
//               description: editingData.description.trim(),
//               fileUrl: editingData.fileUrl.trim() || "",
//               fileName,
//               originalName: fileName,
//               isModified: !doc.isNew,
//             }
//           : doc,
//       ),
//     )

//     setEditingDoc(null)
//     setEditingData({ description: "", fileUrl: "", fileName: "", originalName: "" })

//     toast({
//       title: "Success",
//       description: "Documentation updated successfully.",
//     })
//   }

//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     try {
//       // For edit mode with stationId, upload immediately
//       if (isEdit && stationId) {
//         const result = await StationDocumentationApi.uploadDocumentation([file], {
//           stationId: stationId,
//           description: isEditing ? editingData.description : newDoc.description || file.name,
//         })

//         if (result.error || !result.data) {
//           throw new Error(result.error || "Upload failed")
//         }

//         // Get the uploaded file info
//         const uploadedDoc = result.data[0]
//         const fileUrl = uploadedDoc.fileUrl

//         // Store both originalName and description
//         const docUpdate = {
//           fileUrl,
//           fileName: uploadedDoc.originalName || file.name,
//           originalName: uploadedDoc.originalName || file.name,
//         }

//         if (isEditing) {
//           setEditingData((prev) => ({
//             ...prev,
//             ...docUpdate,
//           }))
//         } else {
//           setNewDoc((prev) => ({
//             ...prev,
//             ...docUpdate,
//           }))
//         }

//         toast({
//           title: "File Uploaded",
//           description: `File "${file.name}" uploaded successfully.`,
//         })
//       } else {
//         // For create mode, just store the file URL temporarily
//         const fileUrl = URL.createObjectURL(file)

//         if (isEditing) {
//           setEditingData((prev) => ({
//             ...prev,
//             fileUrl,
//           }))
//         } else {
//           setNewDoc((prev) => ({
//             ...prev,
//             fileUrl,
//           }))
//         }

//         toast({
//           title: "File Added",
//           description: `File "${file.name}" added successfully. It will be uploaded when the station is created.`,
//         })
//       }
//     } catch (error: any) {
//       toast({
//         title: "Upload Failed",
//         description: error.message || "Failed to upload file.",
//         variant: "destructive",
//       })
//     }
//   }

//   const existingDocs = documentations.filter((doc) => !doc.isNew)
//   const newDocs = documentations.filter((doc) => doc.isNew)

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardContent className="mt-5">
//           {/* Existing Docs */}
//           {existingDocs.length > 0 && (
//             <div className="space-y-4 mb-6">
//               <h3 className="text-lg font-semibold">Files</h3>
//               <div className="space-y-3">
//                 {existingDocs.map((doc) => (
//                   <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
//                     <div className="flex items-center space-x-3 flex-1">
//                       <FileText className="h-5 w-5 text-blue-600" />
//                       <div className="flex-1">
//                         {editingDoc === doc.id ? (
//                           <div className="space-y-2">
//                             <Input
//                               value={editingData.description}
//                               onChange={(e) => setEditingData((prev) => ({ ...prev, description: e.target.value }))}
//                               placeholder="Description (optional)"
//                               className="h-8"
//                             />
//                             <div className="flex gap-2">
//                               <Input
//                                 value={editingData.fileUrl}
//                                 onChange={(e) => setEditingData((prev) => ({ ...prev, fileUrl: e.target.value }))}
//                                 placeholder="File URL (optional)"
//                                 className="h-8 flex-1"
//                               />
//                               <div className="relative">
//                                 <Input
//                                   type="file"
//                                   onChange={(e) => handleFileUpload(e, true)}
//                                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                   accept=".pdf,.doc,.docx,.txt,.jpg,.png"
//                                 />
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   className="h-8 pointer-events-none bg-transparent"
//                                 >
//                                   <Upload className="h-3 w-3" />
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>
//                         ) : (
//                           <div>
//                             {/* Display filename and description separately */}
//                             {(doc.fileName || doc.originalName) && (
//                               <p className="font-medium text-gray-900">
//                                 {/* <span className="text-sm text-gray-500">File: </span> */}
//                                 {doc.fileName || doc.originalName}
//                               </p>
//                             )}
//                             {doc.description && (
//                               <p className="text-sm text-gray-700 mt-1">
//                                 {/* <span className="text-xs text-gray-500">Description: </span> */}
//                                 {doc.description}
//                               </p>
//                             )}
                          
//                             {/* {doc.fileUrl && <p className="text-xs text-muted-foreground mt-1">{doc.fileUrl}</p>} */}
                          
//                           </div>
//                         )}
//                       </div>
                    
//                     </div>
//                     <div className="flex items-center space-x-2 ml-4">
//                       {editingDoc === doc.id ? (
//                         <>
//                           <Button
//                             size="sm"
//                             onClick={saveEditing}
//                             className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
//                           >
//                             <Save className="h-3 w-3" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={cancelEditing}
//                             className="h-8 w-8 p-0 bg-transparent"
//                           >
//                             <X className="h-3 w-3" />
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <Button size="sm" variant="outline" onClick={() => startEditing(doc)} className="h-8 w-8 p-0">
//                             <Edit className="h-3 w-3" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => removeDocumentation(doc.id!)}
//                             className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* New Docs */}
//           {newDocs.length > 0 && (
//             <div className="space-y-4 mb-6">
//               <h3 className="text-lg font-semibold">New Files</h3>
//               <div className="space-y-3">
//                 {newDocs.map((doc) => (
//                   <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
//                     <div className="flex items-center space-x-3 flex-1">
//                       <FileText className="h-5 w-5 text-green-600" />
//                       <div className="flex-1">
//                         {/* Display filename and description separately */}
//                         {(doc.fileName || doc.originalName) && (
//                           <p className="font-medium text-gray-900">
//                             {/* <span className="text-sm text-gray-500">File: </span> */}
//                             {doc.fileName || doc.originalName}
//                           </p>
//                         )}
//                         {doc.description && (
//                           <p className="text-sm text-gray-700 mt-1">
//                             {/* <span className="text-xs text-gray-500">Description: </span> */}
//                             {doc.description}
//                           </p>
//                         )}
                     
//                         {/* {doc.fileUrl && <p className="text-xs text-muted-foreground mt-1">{doc.fileUrl}</p>} */}
//                       </div>
                 
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => removeDocumentation(doc.id!)}
//                       className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
//                     >
//                       <Trash2 className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Add New Doc */}
//           <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
//             <h3 className="text-lg font-semibold">Add New Files</h3>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="docDescription">Description (Optional)</Label>
//                 <Input
//                   id="docDescription"
//                   value={newDoc.description}
//                   onChange={(e) => setNewDoc((prev) => ({ ...prev, description: e.target.value }))}
//                   placeholder="Enter documentation description (optional)"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="docFileUrl">File URL (Optional)</Label>
//                 <div className="flex gap-2">
//                   <Input
//                     id="docFileUrl"
//                     value={newDoc.fileUrl}
//                     onChange={(e) => setNewDoc((prev) => ({ ...prev, fileUrl: e.target.value }))}
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
//                     <Button type="button" variant="outline" className="pointer-events-none bg-transparent">
//                       <Upload className="h-4 w-4 mr-2" />
//                       Upload
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//               <Button
//                 onClick={addDocumentation}
//                 className="bg-red-600 hover:bg-red-700 text-white"
//                 disabled={!newDoc.fileUrl.trim() && !newDoc.description.trim()}
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Files
//               </Button>
//             </div>
//           </div>

//           {/* Summary */}
//           {documentations.length === 0 && (
//             <p className="text-muted-foreground text-center py-4">No files added to this station.</p>
//           )}

        
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
















// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Plus, Trash2, Upload, FileText, Edit, Save, X } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { StationDocumentationApi } from "./station-docs-api"

// interface Documentation {
//   id?: string
//   description: string
//   fileUrl: string
//   fileName?: string
//   originalName?: string
//   isNew?: boolean
//   isModified?: boolean
// }

// interface StationDocumentationProps {
//   documentations: Documentation[]
//   onChange: (documentations: Documentation[]) => void
//   stationId?: string
//   onSubmit: () => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
//   isEdit?: boolean
// }

// export function StationDocumentation({
//   documentations,
//   onChange,
//   stationId,
//   onSubmit,
//   onCancel,
//   isLoading,
//   isEdit,
// }: StationDocumentationProps) {
//   const [newDoc, setNewDoc] = useState({ description: "", fileUrl: "", fileName: "", originalName: "" })
//   const [editingDoc, setEditingDoc] = useState<string | null>(null)
//   const [editingData, setEditingData] = useState<{
//     description: string
//     fileUrl: string
//     fileName?: string
//     originalName?: string
//   }>({
//     description: "",
//     fileUrl: "",
//     fileName: "",
//     originalName: "",
//   })
//   const { toast } = useToast()

//   // Cleanup blob URLs when component unmounts or documentations change
//   useEffect(() => {
//     return () => {
//       documentations.forEach((doc) => {
//         if (doc.fileUrl && doc.fileUrl.startsWith("blob:")) {
//           URL.revokeObjectURL(doc.fileUrl)
//         }
//       })
//     }
//   }, [documentations])

//   const getDisplayFileName = (doc: Documentation): string => {
//     return (
//       doc.fileName ||
//       doc.originalName ||
//       (doc.fileUrl ? doc.fileUrl.split("/").pop() || "Unknown file" : "Unknown file")
//     )
//   }

//   const addDocumentation = async () => {
//     if (!newDoc.fileUrl.trim() && !newDoc.description.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Please provide either a file URL or description.",
//         variant: "destructive",
//       })
//       return
//     }

//     // Don't add documentation without a file URL during creation mode
//     if (!isEdit && !newDoc.fileUrl.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Please upload a file or provide a file URL.",
//         variant: "destructive",
//       })
//       return
//     }

//     const fileName =
//       newDoc.fileName ||
//       newDoc.originalName ||
//       (newDoc.fileUrl ? newDoc.fileUrl.split("/").pop() || "Unknown file" : "")
//     const documentation: Documentation = {
//       id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       description: newDoc.description.trim(),
//       fileUrl: newDoc.fileUrl.trim() || "",
//       fileName: newDoc.fileName || fileName,
//       originalName: newDoc.originalName || fileName,
//       isNew: true,
//     }

//     onChange([...documentations, documentation])
//     setNewDoc({ description: "", fileUrl: "", fileName: "", originalName: "" })
//     toast({
//       title: "Success",
//       description: "Documentation added successfully.",
//     })
//   }

//   const removeDocumentation = (docId: string) => {
//     const doc = documentations.find((d) => d.id === docId)
//     if (!doc) return

//     const displayName = doc.description || getDisplayFileName(doc)
//     if (!confirm(`Are you sure you want to remove "${displayName}"?`)) {
//       return
//     }

//     // Cleanup blob URL if it exists
//     if (doc.fileUrl && doc.fileUrl.startsWith("blob:")) {
//       URL.revokeObjectURL(doc.fileUrl)
//     }

//     onChange(documentations.filter((d) => d.id !== docId))
//     toast({
//       title: "Success",
//       description: "Documentation removed successfully.",
//     })
//   }

//   const startEditing = (doc: Documentation) => {
//     if (!doc.id) return
//     setEditingDoc(doc.id)
//     setEditingData({
//       description: doc.description,
//       fileUrl: doc.fileUrl,
//       fileName: doc.fileName,
//       originalName: doc.originalName,
//     })
//   }

//   const cancelEditing = () => {
//     setEditingDoc(null)
//     setEditingData({ description: "", fileUrl: "", fileName: "", originalName: "" })
//   }

//   const saveEditing = () => {
//     if (!editingDoc) return

//     if (!editingData.fileUrl.trim() && !editingData.description.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Please provide either a file URL or description.",
//         variant: "destructive",
//       })
//       return
//     }

//     const fileName =
//       editingData.fileName ||
//       editingData.originalName ||
//       (editingData.fileUrl ? editingData.fileUrl.split("/").pop() || "Unknown file" : "")

//     onChange(
//       documentations.map((doc) =>
//         doc.id === editingDoc
//           ? {
//               ...doc,
//               description: editingData.description.trim(),
//               fileUrl: editingData.fileUrl.trim() || "",
//               fileName: editingData.fileName || fileName,
//               originalName: editingData.originalName || fileName,
//               isModified: !doc.isNew,
//             }
//           : doc,
//       ),
//     )

//     setEditingDoc(null)
//     setEditingData({ description: "", fileUrl: "", fileName: "", originalName: "" })
//     toast({
//       title: "Success",
//       description: "Documentation updated successfully.",
//     })
//   }

//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     try {
//       // For edit mode with stationId, upload immediately
//       if (isEdit && stationId) {
//         const result = await StationDocumentationApi.uploadDocumentation([file], {
//           stationId: stationId,
//           description: isEditing ? editingData.description : newDoc.description || file.name,
//         })

//         if (result.error || !result.data) {
//           throw new Error(result.error || "Upload failed")
//         }

//         // Get the uploaded file info
//         const uploadedDoc = result.data[0]
//         const fileUrl = uploadedDoc.fileUrl

//         // Store both originalName and description
//         const docUpdate = {
//           fileUrl,
//           fileName: uploadedDoc.originalName || file.name,
//           originalName: uploadedDoc.originalName || file.name,
//         }

//         if (isEditing) {
//           setEditingData((prev) => ({
//             ...prev,
//             ...docUpdate,
//           }))
//         } else {
//           setNewDoc((prev) => ({
//             ...prev,
//             ...docUpdate,
//           }))
//         }

//         toast({
//           title: "File Uploaded",
//           description: `File "${file.name}" uploaded successfully.`,
//         })
//       } else {
//         // For create mode, create blob URL and store file info
//         const blobUrl = URL.createObjectURL(file)
//         const docUpdate = {
//           fileUrl: blobUrl,
//           fileName: file.name,
//           originalName: file.name,
//         }

//         if (isEditing) {
//           // Cleanup previous blob URL if it exists
//           if (editingData.fileUrl && editingData.fileUrl.startsWith("blob:")) {
//             URL.revokeObjectURL(editingData.fileUrl)
//           }
//           setEditingData((prev) => ({
//             ...prev,
//             ...docUpdate,
//           }))
//         } else {
//           // Cleanup previous blob URL if it exists
//           if (newDoc.fileUrl && newDoc.fileUrl.startsWith("blob:")) {
//             URL.revokeObjectURL(newDoc.fileUrl)
//           }
//           setNewDoc((prev) => ({
//             ...prev,
//             ...docUpdate,
//           }))
//         }

//         toast({
//           title: "File Added",
//           description: `File "${file.name}" added successfully. It will be uploaded when the station is created.`,
//         })
//       }
//     } catch (error: any) {
//       toast({
//         title: "Upload Failed",
//         description: error.message || "Failed to upload file.",
//         variant: "destructive",
//       })
//     }
//   }

//   const existingDocs = documentations.filter((doc) => !doc.isNew)
//   const newDocs = documentations.filter((doc) => doc.isNew)

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardContent className="mt-5">
//           {/* Existing Docs */}
//           {existingDocs.length > 0 && (
//             <div className="space-y-4 mb-6">
//               <h3 className="text-lg font-semibold">Files</h3>
//               <div className="space-y-3">
//                 {existingDocs.map((doc) => (
//                   <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
//                     <div className="flex items-center space-x-3 flex-1">
//                       <FileText className="h-5 w-5 text-blue-600" />
//                       <div className="flex-1">
//                         {editingDoc === doc.id ? (
//                           <div className="space-y-2">
//                             <Input
//                               value={editingData.description}
//                               onChange={(e) => setEditingData((prev) => ({ ...prev, description: e.target.value }))}
//                               placeholder="Description (optional)"
//                               className="h-8"
//                             />
//                             <div className="flex gap-2">
//                               <Input
//                                 value={editingData.fileUrl}
//                                 onChange={(e) => setEditingData((prev) => ({ ...prev, fileUrl: e.target.value }))}
//                                 placeholder="File URL (optional)"
//                                 className="h-8 flex-1"
//                               />
//                               <div className="relative">
//                                 <Input
//                                   type="file"
//                                   onChange={(e) => handleFileUpload(e, true)}
//                                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                   accept=".pdf,.doc,.docx,.txt,.jpg,.png"
//                                 />
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   className="h-8 pointer-events-none bg-transparent"
//                                 >
//                                   <Upload className="h-3 w-3" />
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>
//                         ) : (
//                           <div>
//                             {/* Display filename */}
//                             <p className="font-medium text-gray-900">{getDisplayFileName(doc)}</p>
//                             {/* Display description if available */}
//                             {doc.description && <p className="text-sm text-gray-700 mt-1">{doc.description}</p>}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2 ml-4">
//                       {editingDoc === doc.id ? (
//                         <>
//                           <Button
//                             size="sm"
//                             onClick={saveEditing}
//                             className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
//                           >
//                             <Save className="h-3 w-3" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={cancelEditing}
//                             className="h-8 w-8 p-0 bg-transparent"
//                           >
//                             <X className="h-3 w-3" />
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <Button size="sm" variant="outline" onClick={() => startEditing(doc)} className="h-8 w-8 p-0">
//                             <Edit className="h-3 w-3" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => removeDocumentation(doc.id!)}
//                             className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* New Docs */}
//           {newDocs.length > 0 && (
//             <div className="space-y-4 mb-6">
//               <h3 className="text-lg font-semibold">New Files</h3>
//               <div className="space-y-3">
//                 {newDocs.map((doc) => (
//                   <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
//                     <div className="flex items-center space-x-3 flex-1">
//                       <FileText className="h-5 w-5 text-green-600" />
//                       <div className="flex-1">
//                         {/* Display filename */}
//                         <p className="font-medium text-gray-900">{getDisplayFileName(doc)}</p>
//                         {/* Display description if available */}
//                         {doc.description && <p className="text-sm text-gray-700 mt-1">{doc.description}</p>}
//                       </div>
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => removeDocumentation(doc.id!)}
//                       className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
//                     >
//                       <Trash2 className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Add New Doc */}
//           <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
//             <h3 className="text-lg font-semibold">Add New Files</h3>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="docDescription">Description (Optional)</Label>
//                 <Input
//                   id="docDescription"
//                   value={newDoc.description}
//                   onChange={(e) => setNewDoc((prev) => ({ ...prev, description: e.target.value }))}
//                   placeholder="Enter documentation description (optional)"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="docFileUrl">File URL (Optional)</Label>
//                 <div className="flex gap-2">
//                   <Input
//                     id="docFileUrl"
//                     value={newDoc.fileUrl}
//                     onChange={(e) => setNewDoc((prev) => ({ ...prev, fileUrl: e.target.value }))}
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
//                     <Button type="button" variant="outline" className="pointer-events-none bg-transparent">
//                       <Upload className="h-4 w-4 mr-2" />
//                       Upload
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//               <Button
//                 onClick={addDocumentation}
//                 className="bg-red-600 hover:bg-red-700 text-white"
//                 disabled={!newDoc.fileUrl.trim() && !newDoc.description.trim()}
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Files
//               </Button>
//             </div>
//           </div>

//           {/* Summary */}
//           {documentations.length === 0 && (
//             <p className="text-muted-foreground text-center py-4">No files added to this station.</p>
//           )}
//         </CardContent>
//       </Card>
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
import { Download, Eye, X, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { StationDocumentationApi } from "./station-docs-api"

interface DocumentationDocument {
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

interface StationDocumentationProps {
  documentations: any[]
  onChange: (documentations: any[]) => void
  stationId?: string
  onSubmit: () => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  isEdit?: boolean
}

export function StationDocumentation({
  documentations,
  onChange: onDocumentationsChange,
  stationId,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: StationDocumentationProps) {
  const [uploadingDocumentation, setUploadingDocumentation] = useState(false)
  const [newDocumentation, setNewDocumentation] = useState({
    file: null as File | null,
    description: "",
  })
  const { toast } = useToast()

  const handleDocumentationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingDocumentation(true)

    try {
      // For edit mode with stationId, upload immediately
      if (isEdit && stationId) {
        const result = await StationDocumentationApi.uploadDocumentation([file], {
          stationId: stationId,
          description: newDocumentation.description || file.name,
        })

        if (result.error || !result.data) {
          throw new Error(result.error || "Upload failed")
        }

        const uploadedDoc = result.data[0]

        const documentationDoc: DocumentationDocument = {
          id: uploadedDoc.id || Date.now().toString(),
          filename: uploadedDoc.originalName || file.name,
          description: uploadedDoc.description || newDocumentation.description || file.name,
          fileUrl: uploadedDoc.fileUrl,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
          originalName: uploadedDoc.originalName || file.name,
        }

        onDocumentationsChange([...documentations, documentationDoc])
      } else {
        // For create mode, store the file temporarily with a blob URL
        const tempDocumentation: DocumentationDocument = {
          id: `temp-${Date.now()}`,
          filename: file.name,
          description: newDocumentation.description || file.name,
          fileUrl: URL.createObjectURL(file), // Create blob URL for preview
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
          file: file, // Store the actual file for later upload
          isNew: true,
          originalName: file.name,
        }

        onDocumentationsChange([...documentations, tempDocumentation])
      }

      // Reset form
      setNewDocumentation({
        file: null,
        description: "",
      })

      // Reset file input
      e.target.value = ""

      toast({
        title: "Success",
        description: `Documentation "${file.name}" ${isEdit ? "uploaded" : "added"} successfully.`,
      })
    } catch (error: any) {
      console.error("Error uploading documentation:", error)
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload documentation.",
        variant: "destructive",
      })
    } finally {
      setUploadingDocumentation(false)
    }
  }

  const handleRemoveDocumentation = async (documentationId: string) => {
    try {
      // If it's a real document (not temporary) and we're in edit mode, delete from server
      if (isEdit && !documentationId.startsWith("temp-")) {
        const result = await StationDocumentationApi.deleteDocumentation(documentationId)
        if (result.error) {
          throw new Error(result.error)
        }
      }

      // Remove from local state
      onDocumentationsChange(documentations.filter((doc) => doc.id !== documentationId))

      toast({
        title: "Success",
        description: "Documentation removed successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete documentation.",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (fileType: string) => {
    return <FileText className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <h4 className="text-xl font-semibold">Upload Documentation</h4>

      {/* Upload New Documentation */}
      <Card>
        <CardContent className="space-y-4 mt-5">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="documentation-file">Select File</Label>
              <Input
                id="documentation-file"
                type="file"
                // accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

                onChange={handleDocumentationUpload}
                disabled={uploadingDocumentation}
              />
            </div>

            <div>
              <Label htmlFor="documentation-description">Description (Optional)</Label>
              <Textarea
                id="documentation-description"
                placeholder="Enter description for the documentation..."
                value={newDocumentation.description}
                onChange={(e) =>
                  setNewDocumentation((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                disabled={uploadingDocumentation}
              />
            </div>
          </div>

          {uploadingDocumentation && <div className="text-sm text-muted-foreground">Uploading documentation...</div>}
        </CardContent>
      </Card>

      {/* Existing Documentation */}
      {documentations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Station Documentation ({documentations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documentations.map((documentation) => (
                <div
                  key={documentation.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(documentation.fileType || "")}
                    <div className="flex-1 min-w-0">
                      {/* Display filename and description separately */}
                      {(documentation.filename || documentation.originalName) && (
                        <p className="font-medium text-gray-900">
                          {documentation.filename || documentation.originalName}
                        </p>
                      )}
                      {documentation.description && (
                        <p className="text-sm text-gray-700 mt-1">{documentation.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(documentation.fileUrl, "_blank")}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          if (documentation.id && !documentation.id.startsWith("temp-") && isEdit) {
                            await StationDocumentationApi.downloadAndSaveFile(documentation.id, documentation.filename)
                          } else {
                            const link = document.createElement("a")
                            link.href = documentation.fileUrl || ""
                            link.download = documentation.filename || "documentation"
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
                      onClick={() => handleRemoveDocumentation(documentation.id || "")}
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

      {documentations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No documentation uploaded yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload documentation files to help with station information
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}




