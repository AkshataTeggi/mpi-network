

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
