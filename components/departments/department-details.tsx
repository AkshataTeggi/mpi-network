// "use client"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { ArrowLeft, Edit, Plus, Building, Users } from "lucide-react"
// import { useState } from "react"
// import type { Department } from "./types"
// import { RoleDialog } from "./role-dialog"

// interface DepartmentDetailProps {
//   department: Department
//   onBack: () => void
//   onEdit: () => void
// }

// export function DepartmentDetail({ department, onBack, onEdit }: DepartmentDetailProps) {
//   const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false)

//   const handleCreateRole = async (roleData: any) => {
//     console.log("Creating role:", roleData)
//     alert("Role creation would be implemented here")
//     setIsCreateRoleDialogOpen(false)
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

//   const getStatusColor = (isActive: boolean) => {
//     return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//   {/* Left side: Title only */}
//   <div>
//     <h1 className="text-2xl font-bold text-gray-900">Department Details</h1>
   
//   </div>

//   {/* Right side: Buttons */}
//   <div className="flex gap-2 self-end md:self-auto">
//     <Button  onClick={onBack} className="gap-2">
//       <ArrowLeft className="w-4 h-4" />
//       Back 
//     </Button>
//     <Button onClick={onEdit} className="gap-2">
//       <Edit className="w-4 h-4" />
//       Edit 
//     </Button>
//     <Button onClick={() => setIsCreateRoleDialogOpen(true)} className="gap-2">
//       <Plus className="w-4 h-4" />
//       Create Role
//     </Button>
//   </div>
// </div>


//       {/* Basic Information */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Building className="w-5 h-5" />
//             Department Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <div>
//             <label className="text-sm font-medium text-gray-500">Name</label>
//             <p className="text-lg font-semibold">{department.name}</p>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Description</label>
//             <p className="text-sm">{department.description}</p>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Status</label>
//             <Badge className={getStatusColor(department.isActive)}>{department.isActive ? "Active" : "Inactive"}</Badge>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Created</label>
//             <p className="text-sm">{formatDate(department.createdAt)}</p>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Last Updated</label>
//             <p className="text-sm">{formatDate(department.updatedAt)}</p>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Department ID</label>
//             <p className="text-xs text-gray-500 font-mono break-all">{department.id}</p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Roles Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Users className="w-5 h-5" />
//             Department Roles ({department.roles.length})
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {department.roles.length > 0 ? (
//             <div className="space-y-4">
//               {department.roles.map((role) => (
//                 <div key={role.id} className="p-4 bg-gray-50 rounded border">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2">
//                         <h4 className="font-medium text-gray-900">{role.name}</h4>
//                         <Badge className={getStatusColor(role.isActive)}>{role.isActive ? "Active" : "Inactive"}</Badge>
//                       </div>
//                       <p className="text-sm text-gray-600 mb-2">{role.description}</p>
//                       <div className="flex items-center gap-4 text-xs text-gray-500">
//                         <span>Created: {formatDate(role.createdAt)}</span>
//                         <span>Updated: {formatDate(role.updatedAt)}</span>
//                         {role.createdBy && <span>By: {role.createdBy}</span>}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500">No roles configured for this department.</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <RoleDialog
//         open={isCreateRoleDialogOpen}
//         onOpenChange={setIsCreateRoleDialogOpen}
//         onSubmit={handleCreateRole}
//         title="Create Role"
//         departmentId={department.id}
//       />
//     </div>
//   )
// }















// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { ArrowLeft, Edit, Plus } from "lucide-react"
// import type { Department } from "./types"
// import { RoleDialog } from "./role-dialog"

// interface DepartmentDetailProps {
//   department: Department
//   onBack: () => void
//   onEdit: () => void
// }

// export function DepartmentDetail({ department, onBack, onEdit }: DepartmentDetailProps) {
//   const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false)

//   const handleCreateRole = async (roleData: any) => {
//     console.log("Creating role:", roleData)
//     alert("Role creation would be implemented here")
//     setIsCreateRoleDialogOpen(false)
//   }

//   const formatDate = (dateString: string) =>
//     new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })

//   const getStatusText = (isActive: boolean) =>
//     isActive ? (
//       <span className="text-green-600 font-semibold">Active</span>
//     ) : (
//       <span className="text-gray-500 font-semibold">Inactive</span>
//     )

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <h1 className="text-2xl font-bold text-red-700">Department Details</h1>
//         <div className="flex gap-2 self-end md:self-auto">
//           <Button onClick={onBack} className="gap-2">
//             <ArrowLeft className="w-4 h-4" />
//             Back
//           </Button>
//           <Button onClick={onEdit} className="gap-2">
//             <Edit className="w-4 h-4" />
//             Edit
//           </Button>
//           <Button onClick={() => setIsCreateRoleDialogOpen(true)} className="gap-2">
//             <Plus className="w-4 h-4" />
//             Create Role
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg font-semibold">Department Info</CardTitle>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {[
//             { label: "Department ID", value: department.id },
//             { label: "Name", value: department.name },
//             { label: "Description", value: department.description || "—" },
//             { label: "Status", value: getStatusText(department.isActive) },
//             { label: "Created At", value: formatDate(department.createdAt) },
//             { label: "Updated At", value: formatDate(department.updatedAt) },
//           ].map((field, index) => (
//             <div key={index}>
//               <label className="block text-sm text-muted-foreground">{field.label}</label>
//               <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{field.value}</div>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       {/* Roles Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg font-semibold">Roles</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {department.roles.length > 0 ? (
//             <div className="space-y-6">
//               {department.roles.map((role, index) => (
//                 <div key={role.id}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {[
//                       { label: "Role ID", value: role.id },
//                       { label: "Name", value: role.name },
//                       { label: "Description", value: role.description || "—" },
//                       { label: "Status", value: getStatusText(role.isActive) },
//                       { label: "Created At", value: formatDate(role.createdAt) },
//                       { label: "Updated At", value: formatDate(role.updatedAt) },
//                       ...(role.createdBy ? [{ label: "Created By", value: role.createdBy }] : []),
//                     ].map((field, idx) => (
//                       <div key={idx}>
//                         <label className="block text-sm text-muted-foreground">{field.label}</label>
//                         <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{field.value}</div>
//                       </div>
//                     ))}
//                   </div>
//                   {index < department.roles.length - 1 && <Separator className="my-6" />}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-muted-foreground text-sm">No roles configured.</p>
//           )}
//         </CardContent>
//       </Card>

//       {/* Designations Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg font-semibold">Designations</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {department.designations?.length > 0 ? (
//             <div className="space-y-6">
//               {department.designations.map((designation, index) => (
//                 <div key={designation.id}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {[
//                       { label: "Designation ID", value: designation.id },
//                       { label: "Title", value: designation.title },
//                       { label: "Department ID", value: designation.departmentId },
//                       { label: "Role ID", value: designation.roleId || "—" },
//                       { label: "Status", value: getStatusText(designation.isActive) },
//                       { label: "Created At", value: formatDate(designation.createdAt) },
//                     ].map((field, idx) => (
//                       <div key={idx}>
//                         <label className="block text-sm text-muted-foreground">{field.label}</label>
//                         <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{field.value}</div>
//                       </div>
//                     ))}
//                   </div>
//                   {index < department.designations.length - 1 && <Separator className="my-6" />}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-muted-foreground text-sm">No designations configured.</p>
//           )}
//         </CardContent>
//       </Card>

//       <RoleDialog
//         open={isCreateRoleDialogOpen}
//         onOpenChange={setIsCreateRoleDialogOpen}
//         onSubmit={handleCreateRole}
//         title="Create Role"
//         departmentId={department.id}
//       />
//     </div>
//   )
// }














// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { ArrowLeft, Edit } from "lucide-react"
// import type { Department } from "./types"

// interface DepartmentDetailProps {
//   department: Department
//   onBack: () => void
//   onEdit: () => void
// }

// export function DepartmentDetail({ department, onBack, onEdit }: DepartmentDetailProps) {
//   const formatDate = (date: string) =>
//     new Date(date).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })

//   const getStatus = (status: boolean) => (status ? "Active" : "Inactive")

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <h1 className="text-2xl font-bold text-red-700">Department Details</h1>
//         <div className="flex gap-2 self-end md:self-auto">
//           <Button onClick={onBack} className="gap-2">
//             <ArrowLeft className="w-4 h-4" />
//             Back
//           </Button>
//           <Button onClick={onEdit} className="gap-2">
//             <Edit className="w-4 h-4" />
//             Edit
//           </Button>
//         </div>
//       </div>

//       {/* Department Info Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg font-semibold">Department Info</CardTitle>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm text-muted-foreground">Department ID</label>
//             <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{department.id}</div>
//           </div>
//           <div>
//             <label className="block text-sm text-muted-foreground">Name</label>
//             <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{department.name}</div>
//           </div>
//           <div>
//             <label className="block text-sm text-muted-foreground">Description</label>
//             <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{department.description || "—"}</div>
//           </div>
//           <div>
//             <label className="block text-sm text-muted-foreground">Status</label>
//             <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{getStatus(department.isActive)}</div>
//           </div>
//           <div>
//             <label className="block text-sm text-muted-foreground">Created At</label>
//             <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{formatDate(department.createdAt)}</div>
//           </div>
//           <div>
//             <label className="block text-sm text-muted-foreground">Updated At</label>
//             <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{formatDate(department.updatedAt)}</div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Designation Table Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg font-semibold">Designations</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {department.designations.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border border-gray-300 rounded">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="text-left p-2 border-b">Title</th>
//                     <th className="text-left p-2 border-b">Permissions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {department.designations.map((designation) => (
//                     <tr key={designation.id} className="border-b">
//                       <td className="p-2">{designation.title}</td>
//                       <td className="p-2">
//                         {designation.permissions.length > 0
//                           ? designation.permissions.map((perm) => perm.permissionId).join(", ")
//                           : "—"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-muted-foreground text-sm">No designations available.</p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }














// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { ArrowLeft, Edit } from "lucide-react"
// import type { Department } from "./types"

// interface DepartmentDetailProps {
//   department: Department
//   onBack: () => void
//   onEdit: () => void
// }

// export function DepartmentDetail({ department, onBack, onEdit }: DepartmentDetailProps) {
//   const formatDate = (date: string) =>
//     new Date(date).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })

//   const getStatus = (status: boolean) => (status ? "Active" : "Inactive")

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <h1 className="text-2xl font-bold text-red-700">Department Details</h1>
//         <div className="flex gap-2 self-end md:self-auto">
//           <Button onClick={onBack} className="gap-2">
//             <ArrowLeft className="w-4 h-4" />
//             Back
//           </Button>
//           <Button onClick={onEdit} className="gap-2">
//             <Edit className="w-4 h-4" />
//             Edit
//           </Button>
//         </div>
//       </div>

//       {/* Department Info Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg font-semibold">Department Info</CardTitle>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm text-muted-foreground">Department ID</label>
//             <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{department.id}</div>
//           </div>
//           <div>
//             <label className="block text-sm text-muted-foreground">Name</label>
//             <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{department.name}</div>
//           </div>
//           <div>
//             <label className="block text-sm text-muted-foreground">Description</label>
//             <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{department.description || "—"}</div>
//           </div>
//           <div>
//             <label className="block text-sm text-muted-foreground">Status</label>
//             <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{getStatus(department.isActive)}</div>
//           </div>
//           <div>
//             <label className="block text-sm text-muted-foreground">Created At</label>
//             <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{formatDate(department.createdAt)}</div>
//           </div>
//           <div>
//             <label className="block text-sm text-muted-foreground">Updated At</label>
//             <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{formatDate(department.updatedAt)}</div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Designation Table Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg font-semibold">Designations</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {department.designations.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border border-gray-300 rounded">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="text-left p-2 border-b">Name</th>
//                     <th className="text-left p-2 border-b">Permissions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {department.designations.map((designation) => (
//                     <tr key={designation.id} className="border-b">
//                       <td className="p-2">{designation.title}</td>
//                       <td className="p-2">
//                         {designation.permissions?.length > 0
//                           ? designation.permissions
//                               .map((perm) => perm.permission?.name || "—")
//                               .join(", ")
//                           : "—"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-muted-foreground text-sm">No designations available.</p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }




"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import type { Department } from "./types"

interface DepartmentDetailProps {
  department: Department
  onBack: () => void
  onEdit: () => void
  onDelete: () => void // ✅ Added delete handler prop
}

export function DepartmentDetail({ department, onBack, onEdit, onDelete }: DepartmentDetailProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getStatus = (status: boolean) => (status ? "Active" : "Inactive")

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-green-700">Department Details</h1>
        <div className="flex gap-2 self-end md:self-auto">
          <Button onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={onEdit} className="gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
           
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Department Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Department Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground">Department ID</label>
            <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{department.id}</div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Name</label>
            <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{department.name}</div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Description</label>
            <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{department.description || "—"}</div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Status</label>
            <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">{getStatus(department.isActive)}</div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Created At</label>
            <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">
              {formatDate(department.createdAt)}
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground">Updated At</label>
            <div className="mt-1 px-3 py-2 border rounded bg-gray-50 text-sm">
              {formatDate(department.updatedAt)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Designation Table Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Designations</CardTitle>
        </CardHeader>
        <CardContent>
          {department.designations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300 rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2 border-b">Name</th>
                    <th className="text-left p-2 border-b">Permissions</th>
                  </tr>
                </thead>
                <tbody>
                  {department.designations.map((designation) => (
                    <tr key={designation.id} className="border-b">
                      <td className="p-2">{designation.title}</td>
                      <td className="p-2">
                        {designation.permissions?.length > 0
                          ? designation.permissions
                              .map((perm: { permission: { name: any } }) => perm.permission?.name || "—")
                              .join(", ")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No designations available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
