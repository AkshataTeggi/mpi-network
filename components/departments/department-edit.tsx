// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { AlertCircle, ArrowLeft, Building } from "lucide-react"
// import { updateDepartment } from "./department-api"
// import type { Department, UpdateDepartmentDto } from "./types"

// interface DepartmentEditProps {
//   department: Department
//   onBack: () => void
//   onUpdate: () => void
// }

// export function DepartmentEdit({ department, onBack, onUpdate }: DepartmentEditProps) {
//   const [name, setName] = useState(department.name)
//   const [description, setDescription] = useState(department.description)
//   const [isActive, setIsActive] = useState(department.isActive)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)

//   useEffect(() => {
//     setName(department.name)
//     setDescription(department.description)
//     setIsActive(department.isActive)
//   }, [department])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setSuccess(false)
//     setIsSubmitting(true)

//     try {
//       const updateData: UpdateDepartmentDto = {
//         name,
//         description,
//         isActive,
//       }

//       await updateDepartment(department.id, updateData)
//       setSuccess(true)
//       onUpdate()

//       setTimeout(() => {
//         onBack()
//       }, 1500)
//     } catch (err) {
//       console.error("Error updating department:", err)
//       setError("Failed to update department. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
//             <ArrowLeft className="w-4 h-4" />
//             Back
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Edit Department</h1>
//             <p className="text-sm text-gray-600">
//               {department.name} • Created {formatDate(department.createdAt)}
//             </p>
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
//             Cancel
//           </Button>
//           <Button form="edit-form" type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "Saving..." : "Save Changes"}
//           </Button>
//         </div>
//       </div>

//       <Card className="border shadow-sm">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Building className="w-5 h-5" />
//             Department Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}
//           {success && (
//             <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
//               <AlertDescription>Department updated successfully!</AlertDescription>
//             </Alert>
//           )}

//           <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Department Name *</Label>
//                 <Input
//                   id="name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Enter department name"
//                   required
//                   disabled={isSubmitting}
//                 />
//               </div>
//               <div className="flex items-center space-x-2 pt-6">
//                 <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} disabled={isSubmitting} />
//                 <Label htmlFor="isActive">Active Department</Label>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Description *</Label>
//               <Textarea
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Enter department description"
//                 required
//                 disabled={isSubmitting}
//                 rows={3}
//               />
//             </div>

//             <div className="pt-4 border-t">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
//                 <div>
//                   <label className="font-medium">Department ID</label>
//                   <p className="font-mono text-xs break-all">{department.id}</p>
//                 </div>
//                 <div>
//                   <label className="font-medium">Created</label>
//                   <p>{formatDate(department.createdAt)}</p>
//                 </div>
//                 <div>
//                   <label className="font-medium">Last Updated</label>
//                   <p>{formatDate(department.updatedAt)}</p>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


















// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { AlertCircle, Loader2, Building, ArrowLeft } from "lucide-react"

// import { updateDepartment } from "./department-api"
// import { updateDesignation } from "../designation/designation-api"
// import { getAllPermissions } from "../permissions/permissions-api"

// import type { Department } from "./types"

// interface DepartmentEditFormProps {
//   department: Department
//   onSuccess?: () => void
//   onCancel?: () => void
// }

// export function DepartmentEdit({ department, onSuccess, onCancel }: DepartmentEditFormProps) {
//   const [name, setName] = useState(department.name)
//   const [description, setDescription] = useState(department.description || "")
//   const [isActive, setIsActive] = useState(department.isActive)
//   const [availablePermissions, setAvailablePermissions] = useState<{ id: string; name: string }[]>([])

//   const [designations, setDesignations] = useState(
//     department.designations?.map((d) => ({
//       id: d.id,
//       title: d.title,
//       permissions: d.permissions?.join(", ") || "",
//       isActive: d.isActive,
//     })) || []
//   )

//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)

//   useEffect(() => {
//     getAllPermissions()
//       .then(setAvailablePermissions)
//       .catch((err) => {
//         console.error("Failed to fetch permissions:", err)
//         setError("Could not load permissions.")
//       })
//   }, [])

//   const handleDesignationChange = (
//     index: number,
//     key: "title" | "permissions" | "isActive",
//     value: any
//   ) => {
//     const updated = [...designations]
//     updated[index][key] = value
//     setDesignations(updated)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setSuccess(false)
//     setIsSubmitting(true)

//     try {
//       await updateDepartment(department.id, {
//         name,
//         description,
//         isActive,
//       })

//       for (const des of designations) {
//         if (des.id && des.title.trim()) {
//           await updateDesignation(des.id, {
//             title: des.title,
//             permissions: des.permissions.split(",").map((p: string) => p.trim()),
//             isActive: des.isActive,
//           })
//         }
//       }

//       setSuccess(true)
//       if (onSuccess) {
//         setTimeout(() => onSuccess(), 1500)
//       }
//     } catch (err) {
//       console.error("Error updating:", err)
//       setError("Failed to update department or designations.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const formContent = (
//     <>
//       {error && (
//         <Alert variant="destructive" className="mb-4">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
//       {success && (
//         <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
//           <AlertDescription>Updated successfully!</AlertDescription>
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Department Fields */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="name">Department Name *</Label>
//             <Input
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               disabled={isSubmitting || success}
//             />
//           </div>
//           <div className="flex items-center space-x-2 pt-6">
//             <Switch
//               id="isActive"
//               checked={isActive}
//               onCheckedChange={setIsActive}
//               disabled={isSubmitting || success}
//             />
//             <Label htmlFor="isActive">Active Department</Label>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="description">Description</Label>
//           <Textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             rows={3}
//             disabled={isSubmitting || success}
//           />
//         </div>

//         {/* Designation Fields */}
//         {designations.map((designation, index) => (
//           <div key={designation.id} className="border border-slate-200 p-4 rounded-md space-y-3">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label>Designation Title</Label>
//                 <Input
//                   value={designation.title}
//                   onChange={(e) =>
//                     handleDesignationChange(index, "title", e.target.value)
//                   }
//                   disabled={isSubmitting || success}
//                 />
//               </div>
//               <div>
//                 <Label>Permissions</Label>
//                 <div className="max-h-40 overflow-auto  p-2">
//                   {availablePermissions.map((permission) => {
//                     const checked = designation.permissions
//                       .split(",")
//                       .map((p) => p.trim())
//                       .includes(permission.name)

//                     return (
//                       <label
//                         key={permission.id}
//                         className="flex items-center space-x-2 mb-1 cursor-pointer"
//                       >
//                         <input
//                           type="checkbox"
//                           value={permission.name}
//                           checked={checked}
//                           disabled={isSubmitting || success}
//                           onChange={(e) => {
//                             const currentPermissions = designation.permissions
//                               .split(",")
//                               .map((p) => p.trim())
//                               .filter((p) => p.length > 0)

//                             if (e.target.checked) {
//                               // Add permission
//                               const updated = [...currentPermissions, permission.name]
//                               handleDesignationChange(index, "permissions", updated.join(", "))
//                             } else {
//                               // Remove permission
//                               const updated = currentPermissions.filter(
//                                 (p) => p !== permission.name
//                               )
//                               handleDesignationChange(index, "permissions", updated.join(", "))
//                             }
//                           }}
//                         />
//                         <span>{permission.name}</span>
//                       </label>
//                     )
//                   })}
//                 </div>
//               </div>
//             </div>
//             {/* <div className="flex items-center gap-3 pt-2">
//               <Switch
//                 checked={designation.isActive}
//                 onCheckedChange={(val) =>
//                   handleDesignationChange(index, "isActive", val)
//                 }
//                 disabled={isSubmitting || success}
//               />
//               <Label>Active</Label>
//             </div> */}
//           </div>
//         ))}

//         {/* Submit/Cancel */}
//         <div className="flex justify-end space-x-2 pt-4">
//           {onCancel && (
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onCancel}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//           )}
//           <Button type="submit" disabled={isSubmitting || success}>
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Updating...
//               </>
//             ) : (
//               "Update"
//             )}
//           </Button>
//         </div>
//       </form>
//     </>
//   )

//   return (
//     <Card className="border shadow-sm">
     
//       <CardContent className="mt-5">{formContent}</CardContent>
//     </Card>
//   )
// }
















// "use client"

// import { useEffect, useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Loader2, AlertCircle } from "lucide-react"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { updateDepartment } from "./department-api"
// import { updateDesignation } from "../designation/designation-api"

// import type { Department } from "./types"
// import { getAllPermissions } from "../permissions/permissions-api"

// interface DepartmentEditFormProps {
//   department: Department
//   onSuccess?: () => void
//   onCancel?: () => void
// }

// export function DepartmentEditForm({ department, onSuccess, onCancel }: DepartmentEditFormProps) {
//   const [name, setName] = useState(department.name)
//   const [description, setDescription] = useState(department.description || "")
//   const [isActive, setIsActive] = useState(department.isActive)
//   const [designations, setDesignations] = useState(
//     department.designations.map((d) => ({
//       id: d.id,
//       title: d.title,
//       isActive: d.isActive,
//       permissionIds: d.permissions.map((p) => p.id),
//     }))
//   )

//   const [permissionsList, setPermissionsList] = useState<{ id: string; name: string }[]>([])
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)

//   useEffect(() => {
//     getAllPermissions()
//       .then(setPermissionsList)
//       .catch((err) => {
//         console.error("Error loading permissions:", err)
//         setError("Failed to load permissions.")
//       })
//   }, [])

//   const togglePermission = (designationIndex: number, permissionId: string) => {
//     const updated = [...designations]
//     const perms = updated[designationIndex].permissionIds
//     updated[designationIndex].permissionIds = perms.includes(permissionId)
//       ? perms.filter((id) => id !== permissionId)
//       : [...perms, permissionId]
//     setDesignations(updated)
//   }

//   const handleDesignationChange = (
//     index: number,
//     field: "title" | "isActive",
//     value: string | boolean
//   ) => {
//     const updated = [...designations]
//     updated[index][field] = value
//     setDesignations(updated)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setError(null)
//     setSuccess(false)

//     try {
//       await updateDepartment(department.id, { name, description, isActive })

//       for (const designation of designations) {
//         await updateDesignation(designation.id, {
//           title: designation.title,
//           isActive: designation.isActive,
//           permissionIds: designation.permissionIds,
//           departmentId: department.id,
//         })
//       }

//       setSuccess(true)
//       if (onSuccess) {
//         setTimeout(() => onSuccess(), 1000)
//       }
//     } catch (err) {
//       console.error("Update failed:", err)
//       setError("Failed to update department or designations.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Card className="border shadow-sm">
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle>Update Department</CardTitle>
//         {onCancel && (
//           <Button variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
//             Cancel
//           </Button>
//         )}
//       </CardHeader>

//       <CardContent>
//         {error && (
//           <Alert variant="destructive" className="mb-4">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {success && (
//           <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
//             <AlertDescription>Updated successfully!</AlertDescription>
//           </Alert>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Department Name</Label>
//               <Input
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 disabled={isSubmitting}
//               />
//             </div>
//             <div className="flex items-center space-x-2 pt-6">
//               <Switch
//                 id="isActive"
//                 checked={isActive}
//                 onCheckedChange={setIsActive}
//                 disabled={isSubmitting}
//               />
//               <Label htmlFor="isActive">Active</Label>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               rows={3}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               disabled={isSubmitting}
//             />
//           </div>

//           <div className="space-y-6">
//             {designations.map((des, index) => (
//               <div key={des.id} className="border p-4 rounded-md space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label>Designation Name</Label>
//                     <Input
//                       value={des.title}
//                       onChange={(e) =>
//                         handleDesignationChange(index, "title", e.target.value)
//                       }
//                       disabled={isSubmitting}
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <Label>Permissions</Label>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                       {permissionsList.map((perm) => (
//                         <label key={perm.id} className="flex items-center gap-2">
//                           <Checkbox
//                             checked={des.permissionIds.includes(perm.id)}
//                             onCheckedChange={() => togglePermission(index, perm.id)}
//                             disabled={isSubmitting}
//                           />
//                           {perm.name}
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2 pt-2">
//                   <Switch
//                     checked={des.isActive}
//                     onCheckedChange={(val) =>
//                       handleDesignationChange(index, "isActive", val)
//                     }
//                     disabled={isSubmitting}
//                   />
//                   <Label>Active</Label>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end pt-4">
//             <Button type="submit" disabled={isSubmitting || success}>
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 "Update"
//               )}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }










// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Loader2, AlertCircle } from "lucide-react"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { updateDepartment } from "./department-api"
// import { updateDesignation } from "../designation/designation-api"

// import type { Department } from "./types"
// import { getAllPermissions } from "../permissions/permissions-api"

// interface DepartmentEditFormProps {
//   department: Department
//   onSuccess?: () => void
//   onCancel?: () => void
// }

// export function DepartmentEditForm({ department, onSuccess, onCancel }: DepartmentEditFormProps) {
//   const [name, setName] = useState(department.name)
//   const [description, setDescription] = useState(department.description || "")
//   const [isActive, setIsActive] = useState(department.isActive)
//   const [designations, setDesignations] = useState(
//     department.designations.map((d) => ({
//       id: d.id,
//       title: d.title,
//       isActive: d.isActive ?? true,
//       // Handle both direct permissions array and nested permission structure
//       permissionIds: d.permissions?.map((p: { permission: { id: any }; id: any }) => (typeof p === "string" ? p : p.permission?.id || p.id)) || [],
//     })),
//   )

//   const [permissionsList, setPermissionsList] = useState<{ id: string; name: string }[]>([])
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)

//   useEffect(() => {
//     getAllPermissions()
//       .then(setPermissionsList)
//       .catch((err) => {
//         console.error("Error loading permissions:", err)
//         setError("Failed to load permissions.")
//       })
//   }, [])

//   // Add this useEffect after the existing one
//   useEffect(() => {
//     if (permissionsList.length > 0 && department.designations.length > 0) {
//       // Re-sync designations with proper permission mapping
//       const mappedDesignations = department.designations.map((d) => {
//         let permissionIds = []

//         if (d.permissions) {
//           // Handle different permission data structures
//           permissionIds = d.permissions
//             .map((p: { permission: { id: any }; permissionId: any; id: any }) => {
//               if (typeof p === "string") return p
//               if (p.permission?.id) return p.permission.id
//               if (p.permissionId) return p.permissionId
//               if (p.id) return p.id
//               return null
//             })
//             .filter(Boolean)
//         }

//         return {
//           id: d.id,
//           title: d.title,
//           isActive: d.isActive ?? true,
//           permissionIds,
//         }
//       })

//       setDesignations(mappedDesignations)
//     }
//   }, [permissionsList, department.designations])

//   const togglePermission = (designationIndex: number, permissionId: string) => {
//     const updated = [...designations]
//     const perms = updated[designationIndex].permissionIds
//     updated[designationIndex].permissionIds = perms.includes(permissionId)
//       ? perms.filter((id: string) => id !== permissionId)
//       : [...perms, permissionId]
//     setDesignations(updated)
//   }

//   const handleDesignationChange = (index: number, field: "title" | "isActive", value: string | boolean) => {
//     const updated = [...designations]
//     updated[index][field] = value
//     setDesignations(updated)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setError(null)
//     setSuccess(false)

//     try {
//       // Validate permission IDs before submitting
//       const validPermissionIds = permissionsList.map((p) => p.id)

//       // Update department basic info
//       await updateDepartment(department.id, {
//         name,
//         description,
//         isActive,
//       })

//       // Update each designation with validated permission IDs
//       for (const designation of designations) {
//         if (designation.id) {
//           // Filter out invalid permission IDs
//           const validatedPermissionIds = designation.permissionIds.filter((id: string) => validPermissionIds.includes(id))

//           await updateDesignation(designation.id, {
//             title: designation.title,
//             isActive: designation.isActive,
//             permissionIds: validatedPermissionIds,
//             departmentId: department.id,
//           })
//         }
//       }

//       setSuccess(true)
//       if (onSuccess) {
//         setTimeout(() => onSuccess(), 1500)
//       }
//     } catch (err) {
//       console.error("Update failed:", err)
//       setError("Failed to update department and designations. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Card className="border shadow-sm">
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle>Update Department</CardTitle>
//         {onCancel && (
//           <Button variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
//             Cancel
//           </Button>
//         )}
//       </CardHeader>

//       <CardContent>
//         {error && (
//           <Alert variant="destructive" className="mb-4">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {success && (
//           <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
//             <AlertDescription>Updated successfully!</AlertDescription>
//           </Alert>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Department Name</Label>
//               <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} />
//             </div>
//             <div className="flex items-center space-x-2 pt-6">
//               <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} disabled={isSubmitting} />
//               <Label htmlFor="isActive">Active</Label>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               rows={3}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               disabled={isSubmitting}
//             />
//           </div>

//           <div className="space-y-6">
//             {designations.map((des, index) => (
//               <div key={des.id} className="border p-4 rounded-md space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label>Designation Name</Label>
//                     <Input
//                       value={des.title}
//                       onChange={(e) => handleDesignationChange(index, "title", e.target.value)}
//                       disabled={isSubmitting}
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <Label>Permissions</Label>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                       {permissionsList.map((perm) => (
//                         <label key={perm.id} className="flex items-center gap-2">
//                           <Checkbox
//                             checked={des.permissionIds.includes(perm.id)}
//                             onCheckedChange={() => togglePermission(index, perm.id)}
//                             disabled={isSubmitting}
//                           />
//                           {perm.name}
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2 pt-2">
//                   <Switch
//                     checked={des.isActive}
//                     onCheckedChange={(val) => handleDesignationChange(index, "isActive", val)}
//                     disabled={isSubmitting}
//                   />
//                   <Label>Active</Label>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end pt-4">
//             <Button type="submit" disabled={isSubmitting || success}>
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 "Update"
//               )}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }

















// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Loader2, AlertCircle, Plus, Trash2 } from "lucide-react"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { updateDepartment } from "./department-api"
// import { updateDesignation, createDesignation, deleteDesignation } from "../designation/designation-api"
// import type { Department } from "./types"
// import { getAllPermissions } from "../permissions/permissions-api"

// interface DepartmentEditFormProps {
//   department: Department
//   onSuccess?: () => void
//   onCancel?: () => void
// }

// interface DesignationFormData {
//   id?: string
//   title: string
//   isActive: boolean
//   permissionIds: string[]
//   isNew?: boolean
//   toDelete?: boolean
// }

// export function DepartmentEditForm({ department, onSuccess, onCancel }: DepartmentEditFormProps) {
//   const [name, setName] = useState(department.name)
//   const [description, setDescription] = useState(department.description || "")
//   const [isActive, setIsActive] = useState(department.isActive)
//   const [designations, setDesignations] = useState<DesignationFormData[]>(
//     department.designations.map((d) => ({
//       id: d.id,
//       title: d.title,
//       isActive: d.isActive ?? true,
//       // Handle both direct permissions array and nested permission structure
//       permissionIds:
//         d.permissions?.map((p: { permission: { id: any }; id: any }) =>
//           typeof p === "string" ? p : p.permission?.id || p.id,
//         ) || [],
//       isNew: false,
//       toDelete: false,
//     })),
//   )
//   const [permissionsList, setPermissionsList] = useState<{ id: string; name: string }[]>([])
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)

//   useEffect(() => {
//     getAllPermissions()
//       .then(setPermissionsList)
//       .catch((err) => {
//         console.error("Error loading permissions:", err)
//         setError("Failed to load permissions.")
//       })
//   }, [])

//   // Add this useEffect after the existing one
//   useEffect(() => {
//     if (permissionsList.length > 0 && department.designations.length > 0) {
//       // Re-sync designations with proper permission mapping
//       const mappedDesignations = department.designations.map((d) => {
//         let permissionIds = []
//         if (d.permissions) {
//           // Handle different permission data structures
//           permissionIds = d.permissions
//             .map((p: { permission: { id: any }; permissionId: any; id: any }) => {
//               if (typeof p === "string") return p
//               if (p.permission?.id) return p.permission.id
//               if (p.permissionId) return p.permissionId
//               if (p.id) return p.id
//               return null
//             })
//             .filter(Boolean)
//         }
//         return {
//           id: d.id,
//           title: d.title,
//           isActive: d.isActive ?? true,
//           permissionIds,
//           isNew: false,
//           toDelete: false,
//         }
//       })
//       setDesignations(mappedDesignations)
//     }
//   }, [permissionsList, department.designations])

//   const addNewDesignation = () => {
//     const newDesignation: DesignationFormData = {
//       title: "",
//       isActive: true,
//       permissionIds: [],
//       isNew: true,
//       toDelete: false,
//     }
//     setDesignations([...designations, newDesignation])
//   }

//   const removeDesignation = (index: number) => {
//     const updated = [...designations]
//     const designation = updated[index]

//     if (designation.isNew) {
//       // If it's a new designation, just remove it from the array
//       updated.splice(index, 1)
//     } else {
//       // If it's an existing designation, mark it for deletion
//       updated[index].toDelete = true
//     }

//     setDesignations(updated)
//   }

//   const restoreDesignation = (index: number) => {
//     const updated = [...designations]
//     updated[index].toDelete = false
//     setDesignations(updated)
//   }

//   const togglePermission = (designationIndex: number, permissionId: string) => {
//     const updated = [...designations]
//     const perms = updated[designationIndex].permissionIds
//     updated[designationIndex].permissionIds = perms.includes(permissionId)
//       ? perms.filter((id: string) => id !== permissionId)
//       : [...perms, permissionId]
//     setDesignations(updated)
//   }

//   const handleDesignationChange = (index: number, field: "title" | "isActive", value: string | boolean) => {
//     const updated = [...designations]
//     updated[index][field] = value
//     setDesignations(updated)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setError(null)
//     setSuccess(false)

//     try {
//       // Validate that new designations have titles
//       const newDesignations = designations.filter((d) => d.isNew && !d.toDelete)
//       const hasEmptyTitles = newDesignations.some((d) => !d.title.trim())

//       if (hasEmptyTitles) {
//         setError("Please provide titles for all new designations.")
//         setIsSubmitting(false)
//         return
//       }

//       // Validate permission IDs before submitting
//       const validPermissionIds = permissionsList.map((p) => p.id)

//       // Update department basic info
//       await updateDepartment(department.id, {
//         name,
//         description,
//         isActive,
//       })

//       // Handle existing designations (update or delete)
//       for (const designation of designations.filter((d) => !d.isNew)) {
//         if (designation.toDelete && designation.id) {
//           // Delete designation
//           await deleteDesignation(designation.id)
//         } else if (designation.id) {
//           // Update existing designation
//           const validatedPermissionIds = designation.permissionIds.filter((id: string) =>
//             validPermissionIds.includes(id),
//           )
//           await updateDesignation(designation.id, {
//             title: designation.title,
//             isActive: designation.isActive,
//             permissionIds: validatedPermissionIds,
//             departmentId: department.id,
//           })
//         }
//       }

//       // Handle new designations (create)
//       for (const designation of designations.filter((d) => d.isNew && !d.toDelete)) {
//         const validatedPermissionIds = designation.permissionIds.filter((id: string) => validPermissionIds.includes(id))
//         await createDesignation({
//           title: designation.title,
//           isActive: designation.isActive,
//           permissionIds: validatedPermissionIds,
//           departmentId: department.id,
//         })
//       }

//       setSuccess(true)
//       if (onSuccess) {
//         setTimeout(() => onSuccess(), 1500)
//       }
//     } catch (err) {
//       console.error("Update failed:", err)
//       setError("Failed to update department and designations. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Filter out designations marked for deletion for display
//   const visibleDesignations = designations.filter((d) => !d.toDelete)
//   const deletedDesignations = designations.filter((d) => d.toDelete)

//   return (
//     <Card className="border shadow-sm">
     
//       <CardContent className="mt-5">
//         {error && (
//           <Alert variant="destructive" className="mb-4">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}
//         {success && (
//           <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
//             <AlertDescription>Updated successfully!</AlertDescription>
//           </Alert>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Department Name</Label>
//               <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} />
//             </div>
//             <div className="flex items-center space-x-2 pt-6">
//               <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} disabled={isSubmitting} />
//               <Label htmlFor="isActive">Active</Label>
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               rows={3}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               disabled={isSubmitting}
//             />
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <Label className="text-lg font-semibold">Designations</Label>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={addNewDesignation}
//                 disabled={isSubmitting}
//                 className="flex items-center gap-2 bg-transparent"
//               >
//                 <Plus className="h-4 w-4" />
//                 Add Designation
//               </Button>
//             </div>

//             <div className="space-y-6">
//               {visibleDesignations.map((des, index) => {
//                 const actualIndex = designations.findIndex((d) => d === des)
//                 return (
//                   <div key={des.id || `new-${index}`} className="border p-4 rounded-md space-y-4 relative">
//                     {des.isNew && (
//                       <div className="absolute top-2 right-2">
//                         <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">New</span>
//                       </div>
//                     )}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <Label>Designation Name</Label>
//                         <Input
//                           value={des.title}
//                           onChange={(e) => handleDesignationChange(actualIndex, "title", e.target.value)}
//                           disabled={isSubmitting}
//                           placeholder="Enter designation title"
//                         />
//                       </div>
//                       <div className="space-y-1">
//                         <Label>Permissions</Label>
//                         <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
//                           {permissionsList.map((perm) => (
//                             <label key={perm.id} className="flex items-center gap-2 text-sm">
//                               <Checkbox
//                                 checked={des.permissionIds.includes(perm.id)}
//                                 onCheckedChange={() => togglePermission(actualIndex, perm.id)}
//                                 disabled={isSubmitting}
//                               />
//                               {perm.name}
//                             </label>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between pt-2">
                   
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={() => removeDesignation(actualIndex)}
//                         disabled={isSubmitting}
//                         className="flex items-center gap-2 text-red-600 hover:text-red-700"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                         {des.isNew ? "Remove" : "Delete"}
//                       </Button>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>

//             {deletedDesignations.length > 0 && (
//               <div className="space-y-2">
//                 <Label className="text-sm font-medium text-red-600">Designations to be deleted:</Label>
//                 <div className="space-y-2">
//                   {deletedDesignations.map((des, index) => {
//                     const actualIndex = designations.findIndex((d) => d === des)
//                     return (
//                       <div
//                         key={des.id}
//                         className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md"
//                       >
//                         <span className="text-sm text-red-800 line-through">{des.title}</span>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={() => restoreDesignation(actualIndex)}
//                           disabled={isSubmitting}
//                           className="text-green-600 hover:text-green-700"
//                         >
//                           Restore
//                         </Button>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex justify-end pt-4">
//             <Button type="submit" disabled={isSubmitting || success}>
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 "Update"
//               )}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }




// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Loader2, AlertCircle, Plus, Trash2 } from "lucide-react"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { updateDepartment } from "./department-api"
// import { updateDesignation, createDesignation, deleteDesignation } from "../designation/designation-api"
// import type { Department } from "./types"
// import { getAllPermissions } from "../permissions/permissions-api"

// interface DepartmentEditFormProps {
//   department: Department
//   onSuccess?: () => void
//   onCancel?: () => void
// }

// interface DesignationFormData {
//   id?: string
//   title: string
//   isActive: boolean
//   permissionIds: string[]
//   isNew?: boolean
// }

// export function DepartmentEditForm({ department, onSuccess, onCancel }: DepartmentEditFormProps) {
//   const [name, setName] = useState(department.name)
//   const [description, setDescription] = useState(department.description || "")
//   const [isActive, setIsActive] = useState(department.isActive)
//   const [designations, setDesignations] = useState<DesignationFormData[]>([])
//   const [permissionsList, setPermissionsList] = useState<{ id: string; name: string }[]>([])
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)

//   useEffect(() => {
//     getAllPermissions()
//       .then(setPermissionsList)
//       .catch((err) => {
//         console.error("Error loading permissions:", err)
//         setError("Failed to load permissions.")
//       })
//   }, [])

//   useEffect(() => {
//     if (permissionsList.length > 0 && department.designations.length > 0) {
//       const mappedDesignations = department.designations.map((d) => {
//         let permissionIds = []
//         if (d.permissions) {
//           permissionIds = d.permissions
//             .map((p: { permission: { id: any }; permissionId: any; id: any }) => {
//               if (typeof p === "string") return p
//               if (p.permission?.id) return p.permission.id
//               if (p.permissionId) return p.permissionId
//               if (p.id) return p.id
//               return null
//             })
//             .filter(Boolean)
//         }
//         return {
//           id: d.id,
//           title: d.title,
//           isActive: d.isActive ?? true,
//           permissionIds,
//           isNew: false,
//         }
//       })
//       setDesignations(mappedDesignations)
//     }
//   }, [permissionsList, department.designations])

//   const addNewDesignation = () => {
//     const newDesignation: DesignationFormData = {
//       title: "",
//       isActive: true,
//       permissionIds: [],
//       isNew: true,
//     }
//     setDesignations([...designations, newDesignation])
//   }

//   const removeDesignation = (index: number) => {
//     const updated = [...designations]
//     updated.splice(index, 1)
//     setDesignations(updated)
//   }

//   const togglePermission = (designationIndex: number, permissionId: string) => {
//     const updated = [...designations]
//     const perms = updated[designationIndex].permissionIds
//     updated[designationIndex].permissionIds = perms.includes(permissionId)
//       ? perms.filter((id: string) => id !== permissionId)
//       : [...perms, permissionId]
//     setDesignations(updated)
//   }

//   const handleDesignationChange = (index: number, field: "title" | "isActive", value: string | boolean) => {
//     const updated = [...designations]
//     updated[index][field] = value
//     setDesignations(updated)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setError(null)
//     setSuccess(false)

//     try {
//       const newDesignations = designations.filter((d) => d.isNew)
//       const hasEmptyTitles = newDesignations.some((d) => !d.title.trim())

//       if (hasEmptyTitles) {
//         setError("Please provide titles for all new designations.")
//         setIsSubmitting(false)
//         return
//       }

//       const validPermissionIds = permissionsList.map((p) => p.id)

//       await updateDepartment(department.id, {
//         name,
//         description,
//         isActive,
//       })

//       // Handle existing designations
//       for (const designation of department.designations) {
//         const updated = designations.find((d) => d.id === designation.id)
//         if (!updated) {
//           // Deleted
//           await deleteDesignation(designation.id)
//         } else {
//           // Updated
//           const validatedPermissionIds = updated.permissionIds.filter((id: string) =>
//             validPermissionIds.includes(id),
//           )
//           await updateDesignation(updated.id!, {
//             title: updated.title,
//             isActive: updated.isActive,
//             permissionIds: validatedPermissionIds,
//             departmentId: department.id,
//           })
//         }
//       }

//       // Create new ones
//       for (const designation of newDesignations) {
//         const validatedPermissionIds = designation.permissionIds.filter((id: string) => validPermissionIds.includes(id))
//         await createDesignation({
//           title: designation.title,
//           isActive: designation.isActive,
//           permissionIds: validatedPermissionIds,
//           departmentId: department.id,
//         })
//       }

//       setSuccess(true)
//       if (onSuccess) {
//         setTimeout(() => onSuccess(), 1500)
//       }
//     } catch (err) {
//       console.error("Update failed:", err)
//       setError("Failed to update department and designations. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Card className="border shadow-sm">
//       <CardContent className="mt-5">
//         {error && (
//           <Alert variant="destructive" className="mb-4">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}
//         {success && (
//           <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
//             <AlertDescription>Updated successfully!</AlertDescription>
//           </Alert>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Department Name</Label>
//               <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} />
//             </div>
//             <div className="flex items-center space-x-2 pt-6">
//               <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} disabled={isSubmitting} />
//               <Label htmlFor="isActive">Active</Label>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               rows={3}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               disabled={isSubmitting}
//             />
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <Label className="text-lg font-semibold">Designations</Label>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={addNewDesignation}
//                 disabled={isSubmitting}
//                 className="flex items-center gap-2 bg-transparent"
//               >
//                 <Plus className="h-4 w-4" />
//                 Add Designation
//               </Button>
//             </div>

//             <div className="space-y-6">
//               {designations.map((des, index) => (
//                 <div key={des.id || `new-${index}`} className="border p-4 rounded-md space-y-4 relative">
//                   {des.isNew && (
//                     <div className="absolute top-2 right-2">
//                       <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">New</span>
//                     </div>
//                   )}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <Label>Designation Name</Label>
//                       <Input
//                         value={des.title}
//                         onChange={(e) => handleDesignationChange(index, "title", e.target.value)}
//                         disabled={isSubmitting}
//                         placeholder="Enter designation title"
//                       />
//                     </div>
//                     <div className="space-y-1">
//                       <Label>Permissions</Label>
//                       <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
//                         {permissionsList.map((perm) => (
//                           <label key={perm.id} className="flex items-center gap-2 text-sm">
//                             <Checkbox
//                               checked={des.permissionIds.includes(perm.id)}
//                               onCheckedChange={() => togglePermission(index, perm.id)}
//                               disabled={isSubmitting}
//                             />
//                             {perm.name}
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex justify-end pt-2">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => removeDesignation(index)}
//                       disabled={isSubmitting}
//                       className="flex items-center gap-2 text-red-600 hover:text-red-700"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                       Remove
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-end pt-4">
//             <Button type="submit" disabled={isSubmitting || success}>
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 "Update"
//               )}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }


















"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertCircle, Plus, Trash2, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateDepartment } from "./department-api"
import { updateDesignation, createDesignation, deleteDesignation } from "../designation/designation-api"
import type { Department } from "./types"
import { getAllPermissions } from "../permissions/permissions-api"

interface DepartmentEditFormProps {
  department: Department
  onSuccess?: () => void
  onCancel?: () => void
}

interface DesignationFormData {
  id?: string
  title: string
  isActive: boolean
  permissionIds: string[]
  isNew?: boolean
}

export function DepartmentEditForm({ department, onSuccess, onCancel }: DepartmentEditFormProps) {
  const [name, setName] = useState(department.name)
  const [description, setDescription] = useState(department.description || "")
  const [isActive, setIsActive] = useState(department.isActive)
  const [designations, setDesignations] = useState<DesignationFormData[]>([])
  const [permissionsList, setPermissionsList] = useState<{ id: string; name: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getAllPermissions()
      .then(setPermissionsList)
      .catch((err) => {
        console.error("Error loading permissions:", err)
        setError("Failed to load permissions.")
      })
  }, [])

  useEffect(() => {
    if (permissionsList.length > 0 && department.designations.length > 0) {
      const mappedDesignations = department.designations.map((d) => {
        let permissionIds = []
        if (d.permissions) {
          permissionIds = d.permissions
            .map((p: { permission: { id: any }; permissionId: any; id: any }) => {
              if (typeof p === "string") return p
              if (p.permission?.id) return p.permission.id
              if (p.permissionId) return p.permissionId
              if (p.id) return p.id
              return null
            })
            .filter(Boolean)
        }
        return {
          id: d.id,
          title: d.title,
          isActive: d.isActive ?? true,
          permissionIds,
          isNew: false,
        }
      })
      setDesignations(mappedDesignations)
    }
  }, [permissionsList, department.designations])

  const addNewDesignation = () => {
    const newDesignation: DesignationFormData = {
      title: "",
      isActive: true,
      permissionIds: [],
      isNew: true,
    }
    setDesignations([...designations, newDesignation])
  }

  const removeDesignation = (index: number) => {
    const updated = [...designations]
    updated.splice(index, 1)
    setDesignations(updated)
  }

  const togglePermission = (designationIndex: number, permissionId: string) => {
    const updated = [...designations]
    const perms = updated[designationIndex].permissionIds
    updated[designationIndex].permissionIds = perms.includes(permissionId)
      ? perms.filter((id: string) => id !== permissionId)
      : [...perms, permissionId]
    setDesignations(updated)
  }

  const handleDesignationChange = (index: number, field: "title" | "isActive", value: string | boolean) => {
    const updated = [...designations]
    updated[index][field] = value
    setDesignations(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const newDesignations = designations.filter((d) => d.isNew)
      const hasEmptyTitles = newDesignations.some((d) => !d.title.trim())

      if (hasEmptyTitles) {
        setError("Please provide titles for all new designations.")
        setIsSubmitting(false)
        return
      }

      const validPermissionIds = permissionsList.map((p) => p.id)

      await updateDepartment(department.id, {
        name,
        description,
        isActive,
      })

      for (const designation of department.designations) {
        const updated = designations.find((d) => d.id === designation.id)
        if (!updated) {
          await deleteDesignation(designation.id)
        } else {
          const validatedPermissionIds = updated.permissionIds.filter((id: string) =>
            validPermissionIds.includes(id),
          )
          await updateDesignation(updated.id!, {
            title: updated.title,
            isActive: updated.isActive,
            permissionIds: validatedPermissionIds,
            departmentId: department.id,
          })
        }
      }

      for (const designation of newDesignations) {
        const validatedPermissionIds = designation.permissionIds.filter((id: string) =>
          validPermissionIds.includes(id),
        )
        await createDesignation({
          title: designation.title,
          isActive: designation.isActive,
          permissionIds: validatedPermissionIds,
          departmentId: department.id,
        })
      }

      setSuccess(true)
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500)
      }
    } catch (err) {
      console.error("Update failed:", err)
      setError("Failed to update department and designations. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
  <h1 className="text-2xl font-bold text-green-700">Edit Department</h1>
  <div className="self-end md:self-auto">
    <Button  onClick={onCancel}>
      <ArrowLeft className="mr-2 h-4 w-4"/>
      Back
    </Button>
  </div>
</div>


      <Card className="border shadow-sm">
        <CardContent className="mt-5">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
              <AlertDescription>Updated successfully!</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} disabled={isSubmitting} />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Designations</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addNewDesignation}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                  Add Designation
                </Button>
              </div>

              <div className="space-y-6">
                {designations.map((des, index) => (
                  <div key={des.id || `new-${index}`} className="border p-4 rounded-md space-y-4 relative">
                    {des.isNew && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">New</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Designation Name</Label>
                        <Input
                          value={des.title}
                          onChange={(e) => handleDesignationChange(index, "title", e.target.value)}
                          disabled={isSubmitting}
                          placeholder="Enter designation title"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                          {permissionsList.map((perm) => (
                            <label key={perm.id} className="flex items-center gap-2 text-sm">
                              <Checkbox
                                checked={des.permissionIds.includes(perm.id)}
                                onCheckedChange={() => togglePermission(index, perm.id)}
                                disabled={isSubmitting}
                              />
                              {perm.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeDesignation(index)}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 text-green-600 hover:text-green-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting || success}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
