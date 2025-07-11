// "use client"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Edit, Trash2, Eye, Factory, Calendar } from "lucide-react"
// import type { MPI } from "./types"

// interface MPIListItemProps {
//   mpi: MPI
//   onEdit: (mpi: MPI) => void
//   onView: (mpi: MPI) => void
//   onDelete: (id: string) => void
// }

// export function MPIListItem({ mpi, onEdit, onView, onDelete }: MPIListItemProps) {


//   return (
//      <Card
//       className="w-full hover:shadow-md transition-shadow "
//       onClick={() => onView(mpi)} // 👈 Make entire card clickable
//     >
//       <CardContent className="p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4 flex-1">
//             {/* MPI Info - Simplified */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-3 mb-1">
//                 <h3 className="text-lg font-semibold truncate">{mpi.jobId}</h3>

//               </div>
//               <p className="text-sm text-muted-foreground">{mpi.assemblyId}</p>
//             </div>
//           </div>



//           {/* Actions */}
//           <div className="flex gap-2 ml-4">
//             <Button size="sm" variant="outline" onClick={() => onView(mpi)} className="flex items-center gap-1">
//               <Eye className="w-3 h-3" />
//               View
//             </Button>
//             <Button size="sm" variant="outline" onClick={() => onEdit(mpi)} className="flex items-center gap-1">
//               <Edit className="w-3 h-3" />
//               Edit
//             </Button>
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={() => onDelete(mpi.id)}
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

import { Card, CardContent } from "@/components/ui/card"
import type { MPI } from "./types"

interface MPIListItemProps {
  mpi: MPI
  onView: (mpi: MPI) => void
}

export function MPIListItem({ mpi, onView }: MPIListItemProps) {
  return (
    <Card
      className="w-full hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onView(mpi)} // Entire card is clickable
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-semibold truncate">{mpi.jobId}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{mpi.assemblyId}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
