



// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { MPICard } from "./mpi-card"
// import { Plus, Search, LayoutGrid, List } from "lucide-react"
// import type { MPI } from "./types"
// import { useRouter } from "next/navigation"
// import { MPIListItem } from "./mpi-list-item"

// interface MPIListProps {
//   mpis: MPI[]
//   onCreateNew: () => void
//   onEdit: (mpi: MPI) => void
//   onView: (mpi: MPI) => void
//   onDelete: (id: string) => void
//   isLoading?: boolean
// }

// export function MPIList({ mpis, onCreateNew, onEdit, onView, onDelete, isLoading }: MPIListProps) {
//   const router = useRouter()
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filteredMPIs, setFilteredMPIs] = useState<MPI[]>(mpis)
//   const [viewMode, setViewMode] = useState<"grid" | "list">("list")

//   const totalMPIs = mpis.length
//   const totalStations = mpis.reduce((sum, mpi) => sum + (mpi.stations?.length || 0), 0)
//   const activeStations = mpis.reduce(
//     (sum, mpi) => sum + (mpi.stations?.filter((station) => station.status === "active").length || 0),
//     0,
//   )
//   const maintenanceStations = mpis.reduce(
//     (sum, mpi) => sum + (mpi.stations?.filter((station) => station.status === "maintenance").length || 0),
//     0,
//   )

//   useEffect(() => {
//     let filtered = mpis
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (mpi) =>
//           mpi.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           mpi.assemblyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           mpi.id.toLowerCase().includes(searchTerm.toLowerCase()),
//       )
//     }
//     setFilteredMPIs(filtered)
//   }, [mpis, searchTerm])

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-8">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-2 text-sm text-muted-foreground">Loading MPIs...</p>
//         </div>
//       </div>
//     )
//   }

//   const handleCreateNew = () => {
//     router.push("/dashboard/mpi/create")
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-green-600">MPI Management</h1>
//         </div>
//         <Button onClick={handleCreateNew} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
//           <Plus className="w-4 h-4" />
//           Create MPI
//         </Button>
//       </div>

//       {/* Filters and View Toggle */}
//       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//         <div className="flex flex-col sm:flex-row gap-4 flex-1">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//             <Input
//               placeholder="Search MPIs by Job ID, Assembly ID..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </div>

//         {/* View Toggle */}
//         <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
//           <Button
//             variant={viewMode === "grid" ? "default" : "ghost"}
//             size="sm"
//             onClick={() => setViewMode("grid")}
//             className={`h-8 w-8 p-0 ${viewMode === "grid" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
//           >
//             <LayoutGrid className="h-4 w-4" />
//           </Button>
//           <Button
//             variant={viewMode === "list" ? "default" : "ghost"}
//             size="sm"
//             onClick={() => setViewMode("list")}
//             className={`h-8 w-8 p-0 ${viewMode === "list" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
//           >
//             <List className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* MPI Display */}
//       {filteredMPIs.length === 0 ? (
//         <div className="text-center py-8">
//           <p className="text-muted-foreground">
//             {mpis.length === 0 ? "No MPIs found. Create your first MPI!" : "No MPIs match your search criteria."}
//           </p>
//         </div>
//       ) : viewMode === "grid" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredMPIs.map((mpi) => (
//             <MPICard key={mpi.id} mpi={mpi} />
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredMPIs.map((mpi) => (
//             <MPIListItem key={mpi.id} mpi={mpi} onView={onView} />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }













"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MPICard } from "./mpi-card"
import { Plus, Search, LayoutGrid, List } from "lucide-react"
import type { MPI } from "./types"
import { useRouter } from "next/navigation"
import { MPIListItem } from "./mpi-list-item"
import { HasPermission } from "@/components/HasPermission" // ✅ Import permission guard

interface MPIListProps {
  mpis: MPI[]
  onCreateNew: () => void
  onEdit: (mpi: MPI) => void
  onView: (mpi: MPI) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

export function MPIList({ mpis, onCreateNew, onEdit, onView, onDelete, isLoading }: MPIListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMPIs, setFilteredMPIs] = useState<MPI[]>(mpis)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  useEffect(() => {
    let filtered = mpis
    if (searchTerm) {
      filtered = filtered.filter(
        (mpi) =>
          mpi.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mpi.assemblyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mpi.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    setFilteredMPIs(filtered)
  }, [mpis, searchTerm])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading MPIs...</p>
        </div>
      </div>
    )
  }

  const handleCreateNew = () => {
    router.push("/dashboard/mpi/create")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-600">MPI Management</h1>
        </div>

        <HasPermission permission="mpi:create">
          <Button onClick={handleCreateNew} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4" />
            Create MPI
          </Button>
        </HasPermission>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search MPIs by Job ID, Assembly ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* View Toggle - visible to all */}
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={`h-8 w-8 p-0 ${viewMode === "grid" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={`h-8 w-8 p-0 ${viewMode === "list" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* MPI Display */}
      {filteredMPIs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {mpis.length === 0 ? "No MPIs found. Create your first MPI!" : "No MPIs match your search criteria."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMPIs.map((mpi) => (
            <MPICard key={mpi.id} mpi={mpi} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMPIs.map((mpi) => (
            <MPIListItem key={mpi.id} mpi={mpi} onView={onView} />
          ))}
        </div>
      )}
    </div>
  )
}
