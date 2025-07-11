// "use client"

// import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation"
// import { Employee } from "./types"

// interface EmployeeListProps {
//   employees: Employee[]
//   onView: (employeeId: string) => void
//   onEdit: (employeeId: string) => void
//   onDelete: (employee: Employee) => void
// }

// export function EmployeeList({ employees, onView, onEdit, onDelete }: EmployeeListProps) {
//   const router = useRouter()

//   if (employees.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
//         <p className="text-muted-foreground">No employees found</p>
//       </div>
//     )
//   }

//   const handleViewClick = (employeeId: string) => {
//     router.push(`/dashboard/settings/employees/${employeeId}`)
//   }

//   const handleEditClick = (employeeId: string) => {
//     router.push(`/dashboard/settings/employees/${employeeId}/edit`)
//   }

//   return (
//     <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
//       <div className="relative w-full overflow-auto">
//         <table className="w-full caption-bottom text-sm">
//           <thead className="bg-slate-50 dark:bg-slate-800/50">

//             <tr className="border-b border-slate-200 dark:border-slate-700">
//               <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700 dark:text-slate-300">
//                 Name
//               </th>
//               <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700 dark:text-slate-300">
//                 Email
//               </th>
//               <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700 dark:text-slate-300">
//                 Role
//               </th>
//               <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700 dark:text-slate-300">
//                 Username
//               </th>
//               <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700 dark:text-slate-300">
//                 Phone
//               </th>
//               <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700 dark:text-slate-300">
//                 Created At
//               </th>
//               <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700 dark:text-slate-300">
//                 Status
//               </th>
//               <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700 dark:text-slate-300">
//                 Actions
//               </th>
//             </tr>

//           </thead>
//           <tbody className="[&_tr:last-child]:border-0">
//             {employees.map((employee) => (

//               <tr
//                 key={employee.id}
//                 className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
//               >
//                 <td className="p-4 align-middle font-medium">
//                   {employee.firstName} {employee.lastName}
//                 </td>
//                 <td className="p-4 align-middle">{employee.email}</td>
//                 <td className="p-4 align-middle">{employee.role?.name || "N/A"}</td>
//                 <td className="p-4 align-middle">{employee.user?.username || "N/A"}</td>
//                 <td className="p-4 align-middle">{employee.phone || "N/A"}</td>
//                 <td className="p-4 align-middle">
//                   {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : "—"}
//                 </td>
//                 <td className="p-4 align-middle">
//                   <span
//                     className={
//                       employee.isActive
//                         ? "text-green-600 dark:text-green-400"
//                         : "text-gray-500 dark:text-gray-400"
//                     }
//                   >
//                     {employee.isActive ? "Active" : "Inactive"}
//                   </span>
//                 </td>
//                 <td className="p-4 align-middle">
//                   <div className="flex space-x-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleViewClick(employee.id)}
//                       className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
//                     >
//                       View
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleEditClick(employee.id)}
//                       className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 bg-transparent"
//                       onClick={() => onDelete(employee)}
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
//   )
// }















// "use client"

// import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation"
// import { Employee } from "./types"
// import { ArrowLeft, Plus } from "lucide-react"

// interface EmployeeListProps {
//   employees: Employee[]
//   onView: (employeeId: string) => void
//   onEdit: (employeeId: string) => void
//   onDelete: (employee: Employee) => void
// }

// export function EmployeeList({ employees, onView, onEdit, onDelete }: EmployeeListProps) {
//   const router = useRouter()

//   const handleViewClick = (employeeId: string) => {
//     router.push(`/dashboard/settings/employees/${employeeId}`)
//   }

//   const handleEditClick = (employeeId: string) => {
//     router.push(`/dashboard/settings/employees/${employeeId}/edit`)
//   }

//   const handleCreate = () => {
//     router.push("/dashboard/settings/employees/create")
//   }

//   return (
//     <div className="space-y-6">
    

//       {/* Table or Empty State */}
//       {employees.length === 0 ? (
//         <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
//           <p className="text-muted-foreground">No employees found</p>
//         </div>
//       ) : (
//         <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
//           <div className="relative w-full overflow-auto">
//             <table className="w-full caption-bottom text-sm">
//               <thead className="bg-slate-50 dark:bg-slate-800/50">
//                 <tr className="border-b border-slate-200 dark:border-slate-700">
//                   <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Name</th>
//                   <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Email</th>
//                   <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Role</th>
//                   <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Designation</th>
//                   <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Username</th>
//                   <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Phone</th>
//                   <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Created At</th>
//                   <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Status</th>
//                   <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="[&_tr:last-child]:border-0">
//                 {employees.map((employee) => (
//                   <tr
//                     key={employee.id}
//                     className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
//                   >
//                     <td className="p-4 align-middle font-medium">
//                       {employee.firstName} {employee.lastName}
//                     </td>
//                     <td className="p-4 align-middle">{employee.email}</td>
//                     <td className="p-4 align-middle">{employee.role?.name || "N/A"}</td>
//                       <td className="p-4 align-middle">{employee.designation?.title || "N/A"}</td>
//                     <td className="p-4 align-middle">{employee.user?.username || "N/A"}</td>
//                     <td className="p-4 align-middle">{employee.phone || "N/A"}</td>
//                     <td className="p-4 align-middle">
//                       {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : "—"}
//                     </td>
//                     <td className="p-4 align-middle">
//                       <span
//                         className={
//                           employee.isActive
//                             ? "text-green-600 dark:text-green-400"
//                             : "text-gray-500 dark:text-gray-400"
//                         }
//                       >
//                         {employee.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="p-4 align-middle">
//                       <div className="flex space-x-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleViewClick(employee.id)}
//                           className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
//                         >
//                           View
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleEditClick(employee.id)}
//                           className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 bg-transparent"
//                           onClick={() => onDelete(employee)}
//                         >
//                           Delete
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



















"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Employee } from "./types";
import { ArrowLeft, Plus } from "lucide-react";

interface EmployeeListProps {
  employees: Employee[];
  onView: (employeeId: string) => void;
  onEdit: (employeeId: string) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeeList({
  employees,
  onView,
  onEdit,
  onDelete,
}: EmployeeListProps) {
  const router = useRouter();

  const handleViewClick = (employeeId: string) => {
    router.push(`/dashboard/settings/employees/${employeeId}`);
  };

  const handleEditClick = (employeeId: string) => {
    router.push(`/dashboard/settings/employees/${employeeId}/edit`);
  };

  const handleCreate = () => {
    router.push("/dashboard/settings/employees/create");
  };

  return (
    <div className="space-y-6">
    

      {/* Table or Empty State */}
      {employees.length === 0 ? (
        <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
          <p className="text-muted-foreground">No employees found</p>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1200px] w-full caption-bottom text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Name
                  </th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Email
                  </th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Role
                  </th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Designation
                  </th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Username
                  </th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Phone
                  </th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Created At
                  </th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4 align-middle font-medium">
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="p-4 align-middle">{employee.email}</td>
                    <td className="p-4 align-middle">
                      {employee.role?.name || "N/A"}
                    </td>
                    <td className="p-4 align-middle">
                      {employee.designation?.title || "N/A"}
                    </td>
                    <td className="p-4 align-middle">
                      {employee.user?.username || "N/A"}
                    </td>
                    <td className="p-4 align-middle">
                      {employee.phone || "N/A"}
                    </td>
                    <td className="p-4 align-middle">
                      {employee.createdAt
                        ? new Date(employee.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={
                          employee.isActive
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                        }
                      >
                        {employee.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewClick(employee.id)}
                          className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(employee.id)}
                          className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300 bg-transparent"
                          onClick={() => onDelete(employee)}
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
  );
}
