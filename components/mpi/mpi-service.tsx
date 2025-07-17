


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MPIList } from "./mpi-list"
import { MPIForm } from "./mpi-form"
import { MPIAPI } from "./mpi-api"
import type { MPI, CreateMPIDto, UpdateMPIDto } from "./types"
import { useToast } from "@/hooks/use-toast"
import { StationMpiDocAPI } from "./station-mpi-doc-api"
import { MPIEdit } from "./mpi-edit"
import { MPIDetails } from "./mpi-details"

interface MPIServiceProps {
  initialView?: "list" | "create" | "edit" | "details"
  mpiId?: string
}

export function MPIService({ initialView = "list", mpiId }: MPIServiceProps) {
  const [currentView, setCurrentView] = useState(initialView)
  const [mpis, setMpis] = useState<MPI[]>([])
  const [selectedMPI, setSelectedMPI] = useState<MPI | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [stationMpiDocuments, setStationMpiDocuments] = useState<any[]>([])

  useEffect(() => {
    loadMPIs()
  }, [])

  useEffect(() => {
    if (mpiId && (initialView === "edit" || initialView === "details")) {
      loadMPIById(mpiId)
    }
  }, [mpiId, initialView])

  const loadMPIs = async () => {
    try {
      setLoading(true)
      const data = await MPIAPI.getAllMPIs()
      setMpis(data)
      console.log("📋 Loaded MPIs:", data.length)
    } catch (error) {
      console.error("Failed to load MPIs:", error)
      toast({
        title: "Error",
        description: "Failed to load MPIs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadMPIById = async (id: string) => {
    try {
      setLoading(true)
      console.log("🔍 Loading MPI by ID:", id)

      const mpi = await MPIAPI.getMPIById(id)
      console.log("📄 MPI loaded successfully:", {
        id: mpi.id,
        jobId: mpi.jobId,
        assemblyId: mpi.assemblyId,
        stationsCount: mpi.stations?.length || 0,
        checklistsCount: mpi.checklists?.length || 0,
        mpiDocsCount: mpi.mpiDocs?.length || 0,
        stationMpiDocsCount: mpi.stationMpiDocuments?.length || 0,
      })

      setSelectedMPI(mpi)

      // Set station MPI documents from the response
      if (mpi.stationMpiDocuments) {
        setStationMpiDocuments(mpi.stationMpiDocuments)
        console.log("📎 Station MPI documents loaded:", mpi.stationMpiDocuments.length)
      }

      // Also extract station documents from individual stations
      const allStationDocs =
        mpi.stations?.flatMap(
          (station) =>
            station.documentations?.map((doc) => ({
              ...doc,
              stationName: station.stationName,
              stationId: station.id,
            })) || [],
        ) || []

      console.log("📁 Station documents from stations:", allStationDocs.length)
    } catch (error) {
      console.error("❌ Failed to load MPI:", error)
      toast({
        title: "Error",
        description: "Failed to load MPI details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStationDocumentUpload = async (stationId: string, file: File, description: string) => {
    try {
      console.log("📤 Uploading station document:", {
        stationId,
        fileName: file.name,
        description,
        mpiId: selectedMPI?.id,
      })

      // Use the StationMpiDocAPI for uploads
      const result = await StationMpiDocAPI.create(
        {
          stationId,
          description,
          mpiId: selectedMPI?.id,
        },
        file,
      )

      console.log("✅ Station document uploaded successfully:", result)

      // After successful upload, reload the MPI to get updated documents
      if (selectedMPI) {
        await loadMPIById(selectedMPI.id)
      }

      toast({
        title: "Success",
        description: "Station document uploaded successfully.",
      })

      return result
    } catch (error) {
      console.error("❌ Failed to upload station document:", error)
      toast({
        title: "Error",
        description: "Failed to upload station document. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleStationDocumentDelete = async (documentId: string) => {
    try {
      console.log("🗑️ Deleting station document:", documentId)

      await StationMpiDocAPI.delete(documentId)
      console.log("✅ Station document deleted successfully")

      // After successful deletion, reload the MPI to get updated documents
      if (selectedMPI) {
        await loadMPIById(selectedMPI.id)
      }

      toast({
        title: "Success",
        description: "Station document deleted successfully.",
      })
    } catch (error) {
      console.error("❌ Failed to delete station document:", error)
      toast({
        title: "Error",
        description: "Failed to delete station document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateMPI = async (data: CreateMPIDto) => {
    try {
      setSubmitting(true)
      console.log("🚀 Creating MPI with data:", {
        jobId: data.jobId,
        assemblyId: data.assemblyId,
        customer: data.customer,
        instructionsCount: data.Instruction?.length || 0,
        stationsCount: data.stations?.length || 0,
        checklistsCount: data.checklists?.length || 0,
        mpiDocsCount: data.mpiDocs?.length || 0,
      })

      const newMPI = await MPIAPI.createMPI(data)
      console.log("✅ MPI created successfully:", newMPI)

      // Enhanced MPI ID extraction with better error handling
      let mpiId = null
      if (newMPI) {
        mpiId = newMPI.id || newMPI.mpiId || newMPI.data?.id || newMPI.data?.mpiId

        console.log("🔍 MPI ID extraction:", {
          resultType: typeof newMPI,
          resultKeys: Object.keys(newMPI || {}),
          extractedId: mpiId,
        })

        if (!mpiId) {
          console.warn("⚠️ Could not extract MPI ID from response")
          console.warn("⚠️ Full response:", JSON.stringify(newMPI, null, 2))
          toast({
            title: "Warning",
            description: "MPI created but ID could not be extracted. Some features may not work properly.",
            variant: "destructive",
          })
        }
      } else {
        console.error("❌ MPI creation returned null/undefined result")
      }

      // After creating MPI, reload the list to get the updated data
      await loadMPIs()

      // If we have the new MPI ID, load it specifically to get complete data
      if (mpiId) {
        console.log("🔄 Loading newly created MPI to fetch complete data...")
        await loadMPIById(mpiId)
        console.log("✅ Newly created MPI data loaded successfully")
      }

      setCurrentView("list")
      toast({
        title: "Success",
        description: "MPI created successfully.",
      })
      return newMPI
    } catch (error: any) {
      console.error("❌ Failed to create MPI:", error)
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateMPI = async (data: UpdateMPIDto) => {
    if (!selectedMPI) {
      console.error("❌ No MPI selected for update")
      return
    }

    try {
      setSubmitting(true)
      console.log("🔄 Updating MPI:", {
        id: selectedMPI.id,
        jobId: data.jobId,
        assemblyId: data.assemblyId,
        customer: data.customer,
        instructionsCount: data.Instruction?.length || 0,
        stationsCount: data.stations?.length || 0,
        checklistsCount: data.checklists?.length || 0,
        mpiDocsCount: data.mpiDocs?.length || 0,
      })

      const updatedMPI = await MPIAPI.updateMPI(selectedMPI.id, data)
      console.log("✅ MPI updated successfully:", updatedMPI)

      // Reload the MPI list and the specific MPI to get complete updated data
      await loadMPIs()
      await loadMPIById(selectedMPI.id)

      setCurrentView("details")
      toast({
        title: "Success",
        description: "MPI updated successfully.",
      })
    } catch (error: any) {
      console.error("❌ Failed to update MPI:", error)
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteMPI = async (id: string) => {
    try {
      console.log("🗑️ Deleting MPI:", id)

      await MPIAPI.deleteMPI(id)
      console.log("✅ MPI deleted successfully")

      // Just reload the list, don't redirect
      await loadMPIs()
      
      toast({
        title: "Success",
        description: "MPI deleted successfully.",
      })
    } catch (error) {
      console.error("❌ Failed to delete MPI:", error)
      toast({
        title: "Error",
        description: "Failed to delete MPI. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleViewMPI = (mpi: MPI) => {
    console.log("👁️ Viewing MPI:", mpi.id)
    setSelectedMPI(mpi)
    setCurrentView("details")
    router.push(`/dashboard/mpi/${mpi.id}`)
  }

  const handleEditMPI = (mpi: MPI) => {
    console.log("✏️ Editing MPI:", mpi.id)
    setSelectedMPI(mpi)
    setCurrentView("edit")
    router.push(`/dashboard/mpi/${mpi.id}/edit`)
  }

  const handleBackToList = () => {
    console.log("⬅️ Navigating back to MPI list")
    setCurrentView("list")
    setSelectedMPI(null)
    router.push("/dashboard/mpi")
  }

  // Render based on current view
  if (currentView === "create") {
    return <MPIForm onSubmit={handleCreateMPI} onCancel={handleBackToList} isLoading={submitting} />
  }

  if (currentView === "edit" && selectedMPI) {
    return <MPIEdit mpi={selectedMPI} onSubmit={handleUpdateMPI} onCancel={handleBackToList} isLoading={submitting} />
  }

  if (currentView === "details" && selectedMPI) {
    return (
      <MPIDetails
        mpi={selectedMPI}
        onEdit={() => handleEditMPI(selectedMPI)}
        onBack={handleBackToList}
        onDelete={() => handleDeleteMPI(selectedMPI.id)}
        onStationDocumentUpload={handleStationDocumentUpload}
        onStationDocumentDelete={handleStationDocumentDelete}
      />
    )
  }

  return (
    <MPIList
      mpis={mpis}
      onView={handleViewMPI}
      onEdit={handleEditMPI}
      onDelete={handleDeleteMPI}
      onCreateNew={() => setCurrentView("create")}
      isLoading={loading}
    />
  )
}





