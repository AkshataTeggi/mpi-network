// "use client";

// import type React from "react";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   Edit,
//   Calendar,
//   Building,
//   Hash,
//   Layers,
//   CheckCircle,
//   User2,
//   Trash2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Role } from "./types";

// interface RoleDetailProps {
//   role: Role;
//   onBack: () => void;
// }

// export const RoleDetail: React.FC<RoleDetailProps> = ({ role, onBack }) => {
//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-green-700">Role Details</h1>
//         <div className="flex gap-2">
//           <Button asChild>
//             <Link href={`/dashboard/settings/roles/${role.id}/edit`}>
//               <Edit className="mr-2 h-4 w-4" />
//               Edit 
//             </Link>
//           </Button>
//           <Button  onClick={onBack}>
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back 
//           </Button>
//         </div>
//       </div>

//       {/* Role Information */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Basic Information</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Role ID */}
//             <div>
//               <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
//                Role&nbsp;ID
//               </label>
//               <p className="font-mono break-all text-xs">{role.id}</p>
//             </div>

//             {/* Department Name & ID */}
//             <div>
//               <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
//   Department
//               </label>
//               <p>
//                 {role.departmentName || "None"}
//                 {role.departmentId && (
//                   <span className="text-xs text-muted-foreground ml-2">
//                     (ID: {role.departmentId})
//                   </span>
//                 )}
//               </p>
//             </div>

//             {/* Role Name */}
//             <div>
//               <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
//        Role&nbsp;Name
//               </label>
//               <p>{role.name}</p>
//             </div>

//             {/* Status */}
//             <div>
//               <label className="text-sm font-medium text-muted-foreground">Status</label>
//               <div className="mt-1">
//                 {role.isActive ? (
//                   <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
//                     <CheckCircle className="h-4 w-4" /> Active
//                   </span>
//                 ) : (
//                   <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
//                     <Trash2 className="h-4 w-4" /> Inactive
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* Permissions */}
//             <div className="md:col-span-2">
//               <label className="text-sm font-medium text-muted-foreground">Permissions</label>
//               <p>
//                 {role.permissions && role.permissions.length > 0
//                   ? role.permissions.map((perm) => perm.name).join(", ")
//                   : "—"}
//               </p>
//             </div>

//             {/* Description */}
//             <div className="md:col-span-2">
//               <label className="text-sm font-medium text-muted-foreground">
//                 Description
//               </label>
//               <p>{role.description || "No description provided"}</p>
//             </div>
//           </div>

//           <Separator />

//           {/* System Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
//             <div className="flex items-start gap-2">
//               <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
//               <div>
//                 <p className="font-medium">Created&nbsp;At</p>
//                 <p className="text-muted-foreground">
//                   {role.createdAt ? new Date(role.createdAt).toLocaleString() : "—"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-start gap-2">
//               <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
//               <div>
//                 <p className="font-medium">Last&nbsp;Updated</p>
//                 <p className="text-muted-foreground">
//                   {role.updatedAt ? new Date(role.updatedAt).toLocaleString() : "—"}
//                 </p>
//               </div>
//             </div>

            

//             {role.deletedAt && (
//               <div className="flex items-start gap-2">
//                 <Trash2 className="h-4 w-4 text-muted-foreground mt-0.5" />
//                 <div>
//                   <p className="font-medium">Deleted&nbsp;At</p>
//                   <p className="text-muted-foreground">
//                     {new Date(role.deletedAt).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };













"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Edit,
  Calendar,
  CheckCircle,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { Role } from "./types"

interface RoleDetailProps {
  role: Role
  onBack: () => void
  onDelete?: () => void
}

export const RoleDetail = ({ role, onBack, onDelete }: RoleDetailProps) => {
  const formatDate = (dt?: string | Date | null) =>
    dt ? new Date(dt).toLocaleString() : "—"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-green-600">Role Details</h1>
        <div className="flex space-x-2">
          <Button onClick={onBack}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button asChild>
            <Link href={`/dashboard/settings/roles/${role.id}/edit`}>
              <Edit className="mr-1 h-4 w-4" /> Edit
            </Link>
          </Button>
          {onDelete && (
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="mt-5 space-y-6">
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Role ID" value={role.id} mono />
            <Field label="Role Name" value={role.name} />
            <Field
              label="Department"
              value={role.departmentId ? role.departmentName || "N/A" : "N/A"}
            />
            <Field
              label="Status"
              value={
                role.isActive ? (
                  <span className="inline-flex items-center gap-1 text-green-700">
                    <CheckCircle className="h-4 w-4" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-rose-700">
                    <Trash2 className="h-4 w-4" /> Inactive
                  </span>
                )
              }
            />
            <div className="md:col-span-2">
              <Field
                label="Description"
                value={role.description || "No description provided."}
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Permissions</Label>
              {role.permissions && role.permissions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm) => (
                    <span
                      key={perm.id}
                      className="inline-flex items-center rounded bg-gray-100 dark:bg-slate-900 px-2 py-0.5 text-xs text-gray-800 dark:text-gray-300"
                    >
                      {perm.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">—</p>
              )}
            </div>
          </div>

          <Separator />

          {/* System info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <Field label="Created At" value={formatDate(role.createdAt)} />
            <Field label="Last Updated" value={formatDate(role.updatedAt)} />
            {role.deletedAt && (
              <Field label="Deleted At" value={formatDate(role.deletedAt)} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string
  value: React.ReactNode | string | number | null | undefined
  mono?: boolean
}) {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </Label>
      <div
        className={`text-sm break-words border rounded-md px-3 py-2 min-h-[40px] bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 ${
          mono ? "font-mono text-xs" : "font-normal"
        }`}
      >
        {value ?? "-"}
      </div>
    </div>
  )
}
