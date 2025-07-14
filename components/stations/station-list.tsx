



"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StationCard } from "./station-card"
import { Plus, Search, LayoutGrid, List } from "lucide-react"
import type { Station } from "./types"
import { useRouter } from "next/navigation"
import { StationAPI } from "./station-api"
import { useToast } from "@/hooks/use-toast"
import { StationListItem } from "./station-list-item"

interface StationListProps {
  stations: Station[]
  onCreateNew: () => void
  onReorder?: (stations: Station[]) => void
  isLoading?: boolean
}

export function StationList({
  stations,
  onCreateNew,
  onReorder,
  isLoading,
}: StationListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [filteredStations, setFilteredStations] = useState<Station[]>(stations)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [draggedItem, setDraggedItem] = useState<Station | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isUpdatingPriorities, setIsUpdatingPriorities] = useState(false)

  useEffect(() => {
    let filtered = stations

    if (searchTerm) {
      filtered = filtered.filter(
        (station) =>
          station.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          station.stationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          station.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((station) => station.status === statusFilter)
    }

    setFilteredStations(filtered)
  }, [stations, searchTerm, statusFilter])

  const handleDragStart = (e: React.DragEvent, station: Station) => {
    setDraggedItem(station)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (!draggedItem) return

    const dragIndex = filteredStations.findIndex((s) => s.id === draggedItem.id)
    if (dragIndex === dropIndex) return

    const newStations = [...filteredStations]
    const [removed] = newStations.splice(dragIndex, 1)
    newStations.splice(dropIndex, 0, removed)

    setFilteredStations(newStations)
    setDraggedItem(null)
    setDragOverIndex(null)

    if (onReorder) onReorder(newStations)
    await updateStationPriorities(newStations)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const updateStationPriorities = async (reorderedStations: Station[]) => {
    try {
      setIsUpdatingPriorities(true)

      const stationsToUpdate: { id: string; priority: number }[] = []
      let priorityCounter = 1

      reorderedStations.forEach((station) => {
        if (station.priority === 0) return
        if (station.priority !== priorityCounter) {
          stationsToUpdate.push({ id: station.id, priority: priorityCounter })
        }
        priorityCounter++
      })

      if (stationsToUpdate.length > 0) {
        await Promise.all(
          stationsToUpdate.map(({ id, priority }) =>
            StationAPI.updateStation(id, { priority })
          )
        )

        toast({
          title: "Success",
          description: `Updated priorities for ${stationsToUpdate.length} stations.`,
        })
      }
    } catch (error) {
      console.error("Failed to update station priorities:", error)
      toast({
        title: "Error",
        description: "Failed to update station priorities. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingPriorities(false)
    }
  }

  const handleCreateNew = () => {
    router.push("/dashboard/stations/create")
  }

  const handleStationClick = (id: string) => {
    router.push(`/dashboard/stations/${id}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-600">Station Management</h1>
          {isUpdatingPriorities && (
            <p className="text-sm text-muted-foreground mt-1">
              Updating station priorities...
            </p>
          )}
        </div>
        <Button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Station
        </Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
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

      {/* Station Display */}
      {filteredStations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {stations.length === 0
              ? "No stations found. Create your first station!"
              : "No stations match your search criteria."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station, index) => (
            <div
              key={station.id}
              draggable={!isUpdatingPriorities}
              onClick={() => handleStationClick(station.id)}
              onDragStart={(e) => handleDragStart(e, station)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`transition-all duration-200 cursor-pointer ${
                isUpdatingPriorities ? "opacity-75 pointer-events-none" : ""
              } ${dragOverIndex === index ? "transform scale-105 shadow-lg" : ""}
                ${draggedItem?.id === station.id ? "opacity-50" : ""}`}
            >
              <StationCard station={station} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStations.map((station, index) => (
            <div
              key={station.id}
              draggable={!isUpdatingPriorities}
              onClick={() => handleStationClick(station.id)}
              onDragStart={(e) => handleDragStart(e, station)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`transition-all duration-200 cursor-pointer ${
                isUpdatingPriorities ? "opacity-75 pointer-events-none" : ""
              } ${dragOverIndex === index ? "transform translate-y-1 shadow-lg border-blue-300" : ""}
                ${draggedItem?.id === station.id ? "opacity-50" : ""}`}
            >
              <StationListItem station={station} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}




