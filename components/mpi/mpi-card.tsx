

"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Factory, Users } from "lucide-react"
import type { MPI } from "./types"

interface MPICardProps {
  mpi: MPI
}

export function MPICard({ mpi }: MPICardProps) {
  const getStationStatusCounts = () => {
    if (!mpi.stations || mpi.stations.length === 0) {
      return { active: 0, inactive: 0, maintenance: 0, total: 0 }
    }

    const counts = mpi.stations.reduce(
      (acc, station) => {
        if (station.status === "active") acc.active++
        else if (station.status === "inactive") acc.inactive++
        else if (station.status === "maintenance") acc.maintenance++
        return acc
      },
      { active: 0, inactive: 0, maintenance: 0 },
    )

    return { ...counts, total: mpi.stations.length }
  }

  const statusCounts = getStationStatusCounts()

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-green-600">{mpi.jobId}</CardTitle>
            <CardDescription className="text-lg font-medium text-gray-700 mt-1">{mpi.assemblyId}</CardDescription>
          </div>
          {statusCounts.total > 0 && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {statusCounts.total} Stations
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mpi.customer && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Customer: {mpi.customer}</span>
            </div>
          )}

          {statusCounts.total > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Factory className="w-4 h-4" />
              <span>Stations: {statusCounts.total}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
