// "use client"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { MapPin, Users, Edit, Trash2, Eye } from "lucide-react"
// import type { Station } from "./types"

// interface StationCardProps {
//   station: Station
//   onEdit: (station: Station) => void
//   onView: (station: Station) => void
//   onDelete: (id: string) => void
// }

// export function StationCard({ station, onEdit, onView, onDelete }: StationCardProps) {
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
//     <Card className="w-full hover:shadow-md transition-shadow">
//       <CardHeader className="pb-3">
//         <div className="flex items-start justify-between">
//           <div>
//             <CardTitle className="text-lg">{station.stationName}</CardTitle>
//             <CardDescription className="flex items-center gap-1 mt-1">
//               <MapPin className="w-4 h-4" />
//               {station.location}
//             </CardDescription>
//           </div>
//           <Badge className={getStatusColor(station.status)}>{station.status}</Badge>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-3">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <Users className="w-4 h-4" />
//             <span>Operator: {station.operator || "Not assigned"}</span>
//           </div>

//           {station.description && <p className="text-sm text-muted-foreground line-clamp-2">{station.description}</p>}

//           <div className="flex gap-2 pt-2">
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

















"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users } from "lucide-react"
import type { Station } from "./types"

interface StationCardProps {
  station: Station
}

export function StationCard({ station }: StationCardProps) {
  const router = useRouter()

  const getStatusColor = (status: Station["status"]) => {
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

  const handleClick = () => {
     router.push(`/dashboard/stations/${station.id}`)
  }

  return (
    <Card
      onClick={handleClick}
      className="w-full hover:shadow-md transition-shadow cursor-pointer"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{station.stationName}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {station.location}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(station.status)}>{station.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Operator: {station.operator || "Not assigned"}</span>
          </div>

          {station.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{station.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}



