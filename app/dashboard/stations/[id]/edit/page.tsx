"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Station } from "@/components/stations/types"
import { use } from "react"
import { StationAPI } from "@/components/stations/station-api"
import { StationEdit } from "@/components/stations/station-edit"

interface EditStationPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditStationPage({ params }: EditStationPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [station, setStation] = useState<Station | null>(null)
  const [existingStations, setExistingStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationData, allStations] = await Promise.all([
          StationAPI.getStationById(id),
          StationAPI.getAllStations(),
        ])

        setStation(stationData)
        setExistingStations(allStations)
      } catch (error: any) {
        console.error("Failed to fetch station data:", error)
        setError(error.message || "Failed to load station data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleCancel = () => {
    if (station) {
      router.push(`/dashboard/stations/${station.id}`)
    } else {
      router.push("/dashboard/stations")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading station data...</p>
        </div>
      </div>
    )
  }

  if (error || !station) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-2">Error</h1>
          <p className="text-muted-foreground mb-4">{error || "Station not found"}</p>
          <button
            onClick={() => router.push("/dashboard/stations")}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Back to Stations
          </button>
        </div>
      </div>
    )
  }

  return <StationEdit stationId={id} />
}
