// "use client"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Edit, Trash2, Settings, CheckCircle, XCircle } from "lucide-react"
// import type { Specification } from "./types"

// interface SpecificationCardProps {
//   specification: Specification
//   onEdit: (specification: Specification) => void
//   onDelete: (id: string) => void
// }

// export function SpecificationCard({ specification, onEdit, onDelete }: SpecificationCardProps) {
//   const getInputTypeColor = (inputType: string) => {
//     const colors: Record<string, string> = {
//       TEXT: "bg-blue-100 text-blue-800 border-blue-200",
//       number: "bg-green-100 text-green-800 border-green-200",
//       CHECKBOX: "bg-pink-100 text-pink-800 border-pink-200",
//       DROPDOWN: "bg-orange-100 text-orange-800 border-orange-200",
//       FILE_UPLOAD: "bg-purple-100 text-purple-800 border-purple-200",
//     }
//     return colors[inputType] || "bg-gray-100 text-gray-800 border-gray-200"
//   }

//   const formatInputType = (inputType: string) => {
//     return inputType
//       .replace("_", " ")
//       .toLowerCase()
//       .replace(/\b\w/g, (l) => l.toUpperCase())
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//   }

//   return (
//     <Card className="w-full hover:shadow-md transition-shadow">
//       <CardHeader className="pb-3">
//         <div className="flex items-start justify-between">
//           <div>
//             <CardTitle className="text-lg">{specification.name}</CardTitle>
//             <CardDescription className="flex items-center gap-2 mt-1">
//               <Settings className="w-4 h-4" />
//               <span>Created: {formatDate(specification.createdAt)}</span>
//             </CardDescription>
//           </div>
//           <div className="flex items-center gap-2">
//             <Badge className={getInputTypeColor(specification.inputType)}>
//               {formatInputType(specification.inputType)}
//             </Badge>
//             {specification.isRequired ? (
//               <CheckCircle className="w-4 h-4 text-red-600">
//                 <title>Required</title>
//               <XCircle className="w-4 h-4 text-gray-400">
//                 <title>Optional</title>
//               </XCircle>
//             ) : (
//               <XCircle className="w-4 h-4 text-gray-400" title="Optional" />
//             )}
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-3">
//           {specification.description && (
//             <p className="text-sm text-muted-foreground line-clamp-2">{specification.description}</p>
//           )}

//           <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
//             {specification.placeholder && <Badge variant="outline">Placeholder: {specification.placeholder}</Badge>}
//             {specification.defaultValue && <Badge variant="outline">Default: {specification.defaultValue}</Badge>}
//             {specification.options && specification.options.length > 0 && (
//               <Badge variant="outline">{specification.options.length} options</Badge>
//             )}
//             {specification.minValue !== undefined && <Badge variant="outline">Min: {specification.minValue}</Badge>}
//             {specification.maxValue !== undefined && <Badge variant="outline">Max: {specification.maxValue}</Badge>}
//           </div>

//           <div className="flex gap-2 pt-2">
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={() => onEdit(specification)}
//               className="flex items-center gap-1"
//             >
//               <Edit className="w-3 h-3" />
//               Edit
//             </Button>
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={() => onDelete(specification.id)}
//               className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
//             >
//               <Trash2 className="w-3 h-3" />
//               Delete
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
