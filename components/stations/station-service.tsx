
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { StationList } from "./station-list"
import { StationFormTabs } from "./station-form-tabs"
import { StationDetails } from "./station-details"
import { StationAPI } from "./station-api"
import { useToast } from "@/hooks/use-toast"
import type { Station, CreateStationDto, UpdateStationDto } from "./types"

type ViewMode = "list" | "create" | "edit" | "details"

interface StationServiceProps {
  initialView?: ViewMode
  stationId?: string
}

export function StationService({ initialView = "list", stationId }: StationServiceProps) {
  const router = useRouter()
  const [stations, setStations] = useState<Station[]>([])
  const [currentView, setCurrentView] = useState<ViewMode>(initialView)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Load stations on component mount
  useEffect(() => {
    loadStations()
  }, [])

  // Load specific station if stationId is provided
  useEffect(() => {
    if (stationId && (initialView === "details" || initialView === "edit")) {
      loadSpecificStation(stationId)
    }
  }, [stationId, initialView])

  const loadStations = async () => {
    try {
      setIsLoading(true)
      const data = await StationAPI.getAllStations()
      setStations(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load stations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadSpecificStation = async (id: string) => {
    try {
      setIsLoading(true)
      const station = await StationAPI.getStationById(id)
      setSelectedStation(station)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load station details. Please try again.",
        variant: "destructive",
      })
      setCurrentView("list")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateStation = async (dto: CreateStationDto): Promise<Station> => {
    try {
      setIsSubmitting(true)
      const newStation = await StationAPI.createStation(dto)
      setStations((prev) => [...prev, newStation])

      // Navigate back to stations list after successful creation
      router.push("/dashboard/stations")

      toast({
        title: "Success",
        description: "Station created successfully.",
      })

      return newStation // Return the created station for further processing
    } catch (error: any) {
      console.error("Station creation error:", error)

      // Handle specific error cases with user-friendly messages
      let errorMessage = "Failed to create station. Please try again."

      if (error.message?.includes("Unique constraint failed") || error.message?.includes("stationId")) {
        // Show a more gentle message for duplicate Station ID
        toast({
          title: "Station Created with Duplicate ID",
          description: "Station was created successfully, but the Station ID already exists in the system.",
          variant: "default", // Use default instead of destructive for less alarming appearance
        })

        // Still navigate back on success
        router.push("/dashboard/stations")
        throw error // Still throw to prevent specification creation
      } else if (error.message?.includes("P2002")) {
        toast({
          title: "Duplicate Station ID",
          description: "Station created successfully with duplicate ID. You may want to update it later.",
          variant: "default",
        })

        // Still navigate back on success
        router.push("/dashboard/stations")
        throw error // Still throw to prevent specification creation
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid station data. Please check all required fields."
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      throw error // Re-throw to prevent navigation
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateStation = async (dto: UpdateStationDto): Promise<Station> => {
    if (!selectedStation) throw new Error("No station selected for update")

    try {
      setIsSubmitting(true)
      const updatedStation = await StationAPI.updateStation(selectedStation.id, dto)

      // Update the stations list
      setStations((prev) => prev.map((station) => (station.id === selectedStation.id ? updatedStation : station)))

      // Reload the complete station data with all nested relationships
      await loadSpecificStation(selectedStation.id)

      // Navigate back to station details after successful update
      router.push(`/dashboard/stations/${selectedStation.id}`)

      toast({
        title: "Success",
        description: "Station updated successfully.",
      })

      return updatedStation
    } catch (error: any) {
      console.error("Station update error:", error)

      let errorMessage = "Failed to update station. Please try again."

      if (error.response?.status === 400) {
        errorMessage = "Invalid station data. Please check all required fields."
      } else if (error.response?.status === 404) {
        errorMessage = "Station not found. It may have been deleted."
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteStation = async (id: string) => {
    try {
      await StationAPI.deleteStation(id)
      setStations((prev) => prev.filter((station) => station.id !== id))
      // Navigate back to stations list after deletion
      router.push("/dashboard/stations")
      toast({
        title: "Success",
        description: "Station deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete station. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditStation = (station: Station) => {
    setSelectedStation(station)
    // Navigate to edit page with correct route
    router.push(`/dashboard/stations/${station.id}/edit`)
  }

  const handleViewStation = (station: Station) => {
    setSelectedStation(station)
    // Navigate to details page
    router.push(`/dashboard/stations/${station.id}`)
  }

  const handleBackToList = () => {
    router.push("/dashboard/stations")
  }

  const handleEditFromDetails = () => {
    if (selectedStation) {
      router.push(`/dashboard/stations/${selectedStation.id}/edit`)
    }
  }

  const handleDeleteFromDetails = () => {
    if (selectedStation) {
      handleDeleteStation(selectedStation.id)
    }
  }

  // Loading state
  if (isLoading && (initialView === "details" || initialView === "edit") && stationId) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading station details...</p>
        </div>
      </div>
    )
  }

  // Error state for specific station not found
  if (!isLoading && (initialView === "details" || initialView === "edit") && stationId && !selectedStation) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Station not found.</p>
      </div>
    )
  }

  // Render based on current view
  switch (currentView) {
    case "create":
      return (
        <StationFormTabs
          onSubmit={handleCreateStation}
          onCancel={handleBackToList}
          isLoading={isSubmitting}
          existingStations={stations}
        />
      )

    case "edit":
      return (
        <StationFormTabs
          station={selectedStation!}
          onSubmit={handleUpdateStation}
          onCancel={handleBackToList}
          isLoading={isSubmitting}
          existingStations={stations}
        />
      )

    case "details":
      return (
        <StationDetails
          station={selectedStation!}
          onEdit={handleEditFromDetails}
          onBack={handleBackToList}
          onDelete={handleDeleteFromDetails}
        />
      )

    default:
      return (
        <StationList
          stations={stations}
          onCreateNew={() => setCurrentView("create")}
          onEdit={handleEditStation}
          onView={handleViewStation}
          onDelete={handleDeleteStation}
          isLoading={isLoading}
        />
      )
  }
}





