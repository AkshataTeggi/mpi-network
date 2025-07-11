
// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { LayoutGrid, List, Plus, Search } from "lucide-react"
// import type { Department } from "./types"

// interface DepartmentListProps {
//   departments: Department[]
//   onViewRoles: (departmentId: string) => void
//   onEdit: (departmentId: string) => void
//   onDelete: (department: Department) => void
// }

// export function DepartmentList({
//   departments,
//   onViewRoles,
//   onEdit,
//   onDelete,
// }: DepartmentListProps) {
//   const router = useRouter()

//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [viewMode, setViewMode] = useState<"list" | "grid">("list")
//   const [filteredDepartments, setFilteredDepartments] = useState<Department[]>(departments)

//   useEffect(() => {
//     let filtered = departments

//     if (searchTerm) {
//       filtered = filtered.filter((d) =>
//         d.name.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     }

//     if (statusFilter !== "all") {
//       filtered = filtered.filter((d) =>
//         statusFilter === "active" ? d.isActive : !d.isActive
//       )
//     }

//     setFilteredDepartments(filtered)
//   }, [departments, searchTerm, statusFilter])

//   const formatDate = (dateString: string) =>
//     new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })

//   const getStatusBadge = (isActive: boolean) => (
//     <Badge className={isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
//       {isActive ? "Active" : "Inactive"}
//     </Badge>
//   )

//   const handleCreate = () => {
//     router.push("/dashboard/settings/departments/create")
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h1 className="text-2xl font-bold text-red-600">Department Management</h1>
//         <Button onClick={handleCreate} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white">
//           <Plus className="w-4 h-4" />
//           Add Department
//         </Button>
//       </div>

//       {/* Search + Filter + View Mode */}
//       <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
//         <div className="flex flex-col sm:flex-row gap-4 flex-1">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//             <Input
//               placeholder="Search departments..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-full sm:w-48">
//               <SelectValue placeholder="Filter by status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Statuses</SelectItem>
//               <SelectItem value="active">Active</SelectItem>
//               <SelectItem value="inactive">Inactive</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
//           <Button
//             variant={viewMode === "grid" ? "default" : "ghost"}
//             size="sm"
//             onClick={() => setViewMode("grid")}
//             className={`h-8 w-8 p-0 ${viewMode === "grid" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
//           >
//             <LayoutGrid className="h-4 w-4" />
//           </Button>
//           <Button
//             variant={viewMode === "list" ? "default" : "ghost"}
//             size="sm"
//             onClick={() => setViewMode("list")}
//             className={`h-8 w-8 p-0 ${viewMode === "list" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
//           >
//             <List className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Department Cards */}
//       {filteredDepartments.length === 0 ? (
//         <div className="text-center p-8">
//           <p className="text-muted-foreground">
//             {departments.length === 0
//               ? "No departments found. Create your first department!"
//               : "No departments match your search criteria."}
//           </p>
//         </div>
//       ) : viewMode === "grid" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredDepartments.map((department) => (
//             <div key={department.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-2">
//                     <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
//                     {getStatusBadge(department.isActive)}
//                   </div>
//                   <div className="text-sm text-muted-foreground mb-3">
//                     <span>Created: {formatDate(department.createdAt)}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 mt-4">
//                 <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/settings/departments/${department.id}`)}>
//                   View
//                 </Button>
//                 <Button size="sm" variant="outline" onClick={() => onEdit(department.id)}>
//                   Edit
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                   onClick={() => onDelete(department)}
//                 >
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredDepartments.map((department) => (
//             <div
//               key={department.id}
//               className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-2">
//                     <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
//                     {getStatusBadge(department.isActive)}
//                   </div>
//                   <div className="text-sm text-muted-foreground mb-3">
//                     <span>Created: {formatDate(department.createdAt)}</span><br />
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2 ml-4">
//                   <Button size="sm" variant="outline" onClick={() => onViewRoles(department.id)}>View</Button>
//                   <Button size="sm" variant="outline" onClick={() => onEdit(department.id)}>Edit</Button>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                     onClick={() => onDelete(department)}
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
















// "use client"

// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import type { Department } from "./types"
// import { Plus } from "lucide-react"

// interface DepartmentListProps {
//   departments: Department[]
//   onViewRoles: (departmentId: string) => void
//   onEdit: (departmentId: string) => void
//   onDelete: (department: Department) => void
// }

// export function DepartmentList({
//   departments,
//   onViewRoles,
//   onEdit,
//   onDelete,
// }: DepartmentListProps) {
//   const router = useRouter()

//   if (departments.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
//         <p className="text-muted-foreground">No departments found</p>
//       </div>
//     )
//   }

//   const formatDate = (dateString: string) =>
//     new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })

//   function handleCreate(event: React.MouseEvent<HTMLButtonElement>): void {
//     // Implement navigation to create department page
//     router.push("/dashboard/settings/departments/create")
//   }

//   return (
//      <div className="space-y-6">
//        {/* Header */}
//        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//          <h1 className="text-2xl font-bold text-red-600">Department Management</h1>
//          <Button onClick={handleCreate} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white">
//            <Plus className="w-4 h-4" />
//            Add Department
//          </Button>
//        </div>
//     <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
//       <div className="relative w-full overflow-auto">
//         <table className="w-full caption-bottom text-sm">
//           <thead className="bg-slate-50 dark:bg-slate-800/50">
//             <tr className="border-b border-slate-200 dark:border-slate-700">
//               <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Name</th>
//               <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Description</th>
//               <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Roles</th>
//               <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Designations</th>
//               <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Created At</th>
//               <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Status</th>
//               <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="[&_tr:last-child]:border-0">
//             {departments.map((department) => (
//               <tr
//                 key={department.id}
//                 className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
//               >
//                 <td className="p-4 align-middle font-medium">{department.name}</td>
//                 <td className="p-4 align-middle">{department.description || "—"}</td>

//                 <td className="p-4 align-middle">
//                   {department.roles.length > 0
//                     ? department.roles
//                         .slice(0, 2)
//                         .map((role) => role.name)
//                         .join(", ") + (department.roles.length > 2 ? ", ..." : "")
//                     : "—"}
//                 </td>

//                 <td className="p-4 align-middle">
//                   {department.designations && department.designations.length > 0
//                     ? department.designations
//                         .slice(0, 2)
//                         .map((d) => d.title)
//                         .join(", ") + (department.designations.length > 2 ? ", ..." : "")
//                     : "—"}
//                 </td>

//                 <td className="p-4 align-middle">{formatDate(department.createdAt)}</td>

//                 <td className="p-4 align-middle">
//                   {department.isActive ? (
//                     <span className="text-green-600 dark:text-green-400">Active</span>
//                   ) : (
//                     <span className="text-gray-500 dark:text-gray-400">Inactive</span>
//                   )}
//                 </td>

//                 <td className="p-4 align-middle">
//                   <div className="flex space-x-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => onViewRoles(department.id)}
//                       className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
//                     >
//                       View
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => onEdit(department.id)}
//                       className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 bg-transparent"
//                       onClick={() => onDelete(department)}
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//     </div>
//   )
// }














"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { Department } from "./types"
import { ArrowLeft, Plus } from "lucide-react"

interface DepartmentListProps {
  departments: Department[]
  onViewRoles: (departmentId: string) => void
  onEdit: (departmentId: string) => void
  onDelete: (department: Department) => void
}

export function DepartmentList({
  departments,
  onViewRoles,
  onEdit,
  onDelete,
}: DepartmentListProps) {
  const router = useRouter()

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  const handleCreate = () => {
    router.push("/dashboard/settings/departments/create")
  }

  return (
    <div className="space-y-6">
      {/* ✅ Always visible header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
  <h1 className="text-2xl font-bold text-green-600">Department Management</h1>
  <div className="flex gap-2">
    <Button
    
      onClick={() => router.push("/dashboard/settings")}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
    >
       <ArrowLeft className="w-4 h-4 " />
      Back
    </Button>
    <Button
      onClick={handleCreate}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
    >
      <Plus className="w-4 h-4" />
      Create
    </Button>
  </div>
</div>


      {/* ✅ Conditional table or empty state */}
      {departments.length === 0 ? (
        <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <p className="text-muted-foreground">No departments found</p>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Name</th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Description</th>
                  {/* <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Roles</th> */}
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Designations</th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Created At</th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Status</th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {departments.map((department) => (
                  <tr
                    key={department.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4 align-middle font-medium">{department.name}</td>
                    <td className="p-4 align-middle">{department.description || "—"}</td>

                    {/* <td className="p-4 align-middle">
                      {department.roles.length > 0
                        ? department.roles
                            .slice(0, 2)
                            .map((role) => role.name)
                            .join(", ") + (department.roles.length > 2 ? ", ..." : "")
                        : "—"}
                    </td> */}

                    <td className="p-4 align-middle">
                      {department.designations && department.designations.length > 0
                        ? department.designations
                            .slice(0, 2)
                            .map((d) => d.title)
                            .join(", ") + (department.designations.length > 2 ? ", ..." : "")
                        : "—"}
                    </td>

                    <td className="p-4 align-middle">{formatDate(department.createdAt)}</td>

                    <td className="p-4 align-middle">
                      {department.isActive ? (
                        <span className="text-green-600 dark:text-green-400">Active</span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Inactive</span>
                      )}
                    </td>

                    <td className="p-4 align-middle">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewRoles(department.id)}
                          className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(department.id)}
                          className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300 bg-transparent"
                          onClick={() => onDelete(department)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
