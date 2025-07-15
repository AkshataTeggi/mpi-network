// "use client"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Edit, Trash2, Eye } from "lucide-react"
// import type { Station } from "./types"

// interface StationListItemProps {
//   station: Station
//   onEdit: (station: Station) => void
//   onView: (station: Station) => void
//   onDelete: (id: string) => void
// }

// export function StationListItem({ station, onEdit, onView, onDelete }: StationListItemProps) {
//   const getStatusColor = (status: Station["status"]) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 text-green-800 border-green-200"
//       case "inactive":
//         return "bg-gray-100 text-gray-800 border-gray-200"
//       case "maintenance":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200"
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200"
//     }
//   }

//   return (
//      <Card
//       className="w-full hover:shadow-md transition-shadow "
//       onClick={() => onView(station)} // 👈 Make entire card clickable
//     >
//       <CardContent className="p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4 flex-1">
//             {/* Station Info */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-3 mb-1">
//                 <h3 className="text-lg font-semibold truncate">{station.stationName}</h3>
//                 <Badge className={getStatusColor(station.status)}>{station.status}</Badge>
//               </div>
//               <p className="text-sm text-muted-foreground">ID: {station.stationId}</p>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-2 ml-4">
//             <Button size="sm" variant="outline" onClick={() => onView(station)} className="flex items-center gap-1">
//               <Eye className="w-3 h-3" />
//               View
//             </Button>
//             <Button size="sm" variant="outline" onClick={() => onEdit(station)} className="flex items-center gap-1">
//               <Edit className="w-3 h-3" />
//               Edit
//             </Button>
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={() => onDelete(station.id)}
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












// "use client"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Edit, Trash2, Eye } from "lucide-react"
// import type { Station } from "./types"

// interface StationListItemProps {
//   station: Station
//   onEdit?: (station: Station) => void
//   onView?: (station: Station) => void
//   onDelete?: (id: string) => void
// }

// export function StationListItem({ station, onEdit, onView, onDelete }: StationListItemProps) {
//   const getStatusColor = (status: Station["status"]) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 text-green-800 border-green-200"
//       case "inactive":
//         return "bg-gray-100 text-gray-800 border-gray-200"
//       case "maintenance":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200"
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200"
//     }
//   }

//   return (
//     <Card
//       className="w-full hover:shadow-md transition-shadow"
//       onClick={() => onView?.(station)} // Safe optional chaining
//     >
//       <CardContent className="p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4 flex-1">
//             {/* Station Info */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-3 mb-1">
//                 <h3 className="text-lg font-semibold truncate">{station.stationName}</h3>
//                 <Badge className={getStatusColor(station.status)}>{station.status}</Badge>
//               </div>
//               <p className="text-sm text-muted-foreground">ID: {station.stationId}</p>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-2 ml-4">
//             {onView && (
//               <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onView(station); }} className="flex items-center gap-1">
//                 <Eye className="w-3 h-3" />
//                 View
//               </Button>
//             )}
//             {onEdit && (
//               <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onEdit(station); }} className="flex items-center gap-1">
//                 <Edit className="w-3 h-3" />
//                 Edit
//               </Button>
//             )}
//             {onDelete && (
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={(e) => { e.stopPropagation(); onDelete(station.id); }}
//                 className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
//               >
//                 <Trash2 className="w-3 h-3" />
//                 Delete
//               </Button>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }













"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2, Eye } from "lucide-react"
import type { Station } from "./types"

interface StationListItemProps {
  station: Station
  onEdit?: (station: Station) => void
  onView?: (station: Station) => void
  onDelete?: (id: string) => void
}

export function StationListItem({
  station,
  onEdit,
  onView,
  onDelete,
}: StationListItemProps) {
  const getStatusClass = (status: Station["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleActionClick =
    (callback?: () => void) => (e: React.MouseEvent) => {
      e.stopPropagation()
      callback?.()
    }

  return (
    <Card className="w-full hover:shadow-md transition-shadow" onClick={() => onView?.(station)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Station Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-semibold truncate">{station.stationName}</h3>
              <Badge className={`${getStatusClass(station.status)}`}>{station.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">ID: {station.stationId}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 ml-4 shrink-0">
            {onView && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleActionClick(() => onView(station))}
                className="flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                View
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleActionClick(() => onEdit(station))}
                className="flex items-center gap-1"
              >
                <Edit className="w-3 h-3" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleActionClick(() => onDelete(station.id))}
                className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
