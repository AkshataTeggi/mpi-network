// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { MPIList } from "./mpi-list"
// import { MPIForm } from "./mpi-form"
// import { MPIDetails } from "./mpi-details"
// import { MPIAPI } from "./mpi-api"
// import { useToast } from "@/hooks/use-toast"
// import type { MPI, CreateMPIDto, UpdateMPIDto } from "./types"

// type ViewMode = "list" | "create" | "edit" | "details"

// interface MPIServiceProps {
//   initialView?: ViewMode
//   mpiId?: string
// }

// export function MPIService({ initialView = "list", mpiId }: MPIServiceProps) {
//   const router = useRouter()
//   const [mpis, setMPIs] = useState<MPI[]>([])
//   const [currentView, setCurrentView] = useState<ViewMode>(initialView)
//   const [selectedMPI, setSelectedMPI] = useState<MPI | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const { toast } = useToast()

//   // Load MPIs on component mount
//   useEffect(() => {
//     loadMPIs()
//   }, [])

//   // Load specific MPI if mpiId is provided
//   useEffect(() => {
//     if (mpiId && (initialView === "details" || initialView === "edit")) {
//       loadSpecificMPI(mpiId)
//     }
//   }, [mpiId, initialView])

//   const loadMPIs = async () => {
//     try {
//       setIsLoading(true)
//       const data = await MPIAPI.getAllMPIs()
//       setMPIs(data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load MPIs. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const loadSpecificMPI = async (id: string) => {
//     try {
//       setIsLoading(true)
//       const mpi = await MPIAPI.getMPIById(id)
//       setSelectedMPI(mpi)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load MPI details. Please try again.",
//         variant: "destructive",
//       })
//       setCurrentView("list")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleCreateMPI = async (dto: CreateMPIDto) => {
//     try {
//       setIsSubmitting(true)
//       const newMPI = await MPIAPI.createMPI(dto)
//       setMPIs((prev) => [...prev, newMPI])

//       // Navigate back to MPI list after successful creation
//       router.push("/dashboard/mpi")

//       toast({
//         title: "Success",
//         description: "MPI created successfully.",
//       })
//     } catch (error: any) {
//       console.error("MPI creation error:", error)

//       let errorMessage = "Failed to create MPI. Please try again."

//       if (error.response?.status === 400) {
//         errorMessage = "Invalid MPI data. Please check all required fields."
//       }

//       toast({
//         title: "Error",
//         description: errorMessage,
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleUpdateMPI = async (dto: UpdateMPIDto) => {
//     if (!selectedMPI) return

//     try {
//       setIsSubmitting(true)
//       const updatedMPI = await MPIAPI.updateMPI(selectedMPI.id, dto)
//       setMPIs((prev) => prev.map((mpi) => (mpi.id === selectedMPI.id ? updatedMPI : mpi)))
//       setSelectedMPI(updatedMPI)

//       // Navigate back to MPI details after successful update
//       router.push(`/dashboard/mpi/${selectedMPI.id}`)

//       toast({
//         title: "Success",
//         description: "MPI updated successfully.",
//       })
//     } catch (error: any) {
//       console.error("MPI update error:", error)

//       let errorMessage = "Failed to update MPI. Please try again."

//       if (error.response?.status === 400) {
//         errorMessage = "Invalid MPI data. Please check all required fields."
//       } else if (error.response?.status === 404) {
//         errorMessage = "MPI not found. It may have been deleted."
//       }

//       toast({
//         title: "Error",
//         description: errorMessage,
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleDeleteMPI = async (id: string) => {
//     try {
//       await MPIAPI.deleteMPI(id)
//       setMPIs((prev) => prev.filter((mpi) => mpi.id !== id))
//       // Navigate back to MPI list after deletion
//       router.push("/dashboard/mpi")
//       toast({
//         title: "Success",
//         description: "MPI deleted successfully.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleEditMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     // Navigate to edit page
//     router.push(`/dashboard/mpi/${mpi.id}/edit`)
//   }

//   const handleViewMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     // Navigate to details page
//     router.push(`/dashboard/mpi/${mpi.id}`)
//   }

//   const handleBackToList = () => {
//     router.push("/dashboard/mpi")
//   }

//   const handleEditFromDetails = () => {
//     if (selectedMPI) {
//       router.push(`/dashboard/mpi/${selectedMPI.id}/edit`)
//     }
//   }

//   const handleDeleteFromDetails = () => {
//     if (selectedMPI) {
//       handleDeleteMPI(selectedMPI.id)
//     }
//   }

//   // Loading state
//   if (isLoading && (initialView === "details" || initialView === "edit") && mpiId) {
//     return (
//       <div className="flex items-center justify-center py-8">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-2 text-sm text-muted-foreground">Loading MPI details...</p>
//         </div>
//       </div>
//     )
//   }

//   // Error state for specific MPI not found
//   if (!isLoading && (initialView === "details" || initialView === "edit") && mpiId && !selectedMPI) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-muted-foreground">MPI not found.</p>
//       </div>
//     )
//   }

//   // Render based on current view
//   switch (currentView) {
//     case "create":
//       return <MPIForm onSubmit={handleCreateMPI} onCancel={handleBackToList} isLoading={isSubmitting} />

//     case "edit":
//       return (
//         <MPIForm mpi={selectedMPI!} onSubmit={handleUpdateMPI} onCancel={handleBackToList} isLoading={isSubmitting} />
//       )

//     case "details":
//       return (
//         <MPIDetails
//           mpi={selectedMPI!}
//           onEdit={handleEditFromDetails}
//           onBack={handleBackToList}
//           onDelete={handleDeleteFromDetails}
//         />
//       )

//     default:
//       return (
//         <MPIList
//           mpis={mpis}
//           onCreateNew={() => setCurrentView("create")}
//           onEdit={handleEditMPI}
//           onView={handleViewMPI}
//           onDelete={handleDeleteMPI}
//           isLoading={isLoading}
//         />
//       )
//   }
// }













// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { MPIList } from "./mpi-list"
// import { MPIForm } from "./mpi-form"
// import { MPIEdit } from "./mpi-edit"
// import { MPIDetails } from "./mpi-details"
// import { MPIAPI } from "./mpi-api"
// import type { MPI, CreateMPIDto, UpdateMPIDto } from "./types"
// import { useToast } from "@/hooks/use-toast"

// interface MPIServiceProps {
//   initialView?: "list" | "create" | "edit" | "details"
//   mpiId?: string
// }

// export function MPIService({ initialView = "list", mpiId }: MPIServiceProps) {
//   const [currentView, setCurrentView] = useState(initialView)
//   const [mpis, setMpis] = useState<MPI[]>([])
//   const [selectedMPI, setSelectedMPI] = useState<MPI | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()

//   useEffect(() => {
//     loadMPIs()
//   }, [])

//   useEffect(() => {
//     if (mpiId && (initialView === "edit" || initialView === "details")) {
//       loadMPIById(mpiId)
//     }
//   }, [mpiId, initialView])

//   const loadMPIs = async () => {
//     try {
//       setLoading(true)
//       const data = await MPIAPI.getAllMPIs()
//       setMpis(data)
//     } catch (error) {
//       console.error("Failed to load MPIs:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPIs. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadMPIById = async (id: string) => {
//     try {
//       setLoading(true)
//       const mpi = await MPIAPI.getMPIById(id)
//       setSelectedMPI(mpi)
//     } catch (error) {
//       console.error("Failed to load MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPI details. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreateMPI = async (data: CreateMPIDto) => {
//     try {
//       setSubmitting(true)
//       const newMPI = await MPIAPI.createMPI(data)
//       await loadMPIs()
//       setCurrentView("list")
//       toast({
//         title: "Success",
//         description: "MPI created successfully.",
//       })
//     } catch (error: any) {
//       console.error("Failed to create MPI:", error)
//       throw error // Re-throw to let the form handle it
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleUpdateMPI = async (data: UpdateMPIDto) => {
//     if (!selectedMPI) return

//     try {
//       setSubmitting(true)
//       const updatedMPI = await MPIAPI.updateMPI(selectedMPI.id, data)
//       await loadMPIs()
//       setSelectedMPI(updatedMPI)
//       setCurrentView("details")
//       toast({
//         title: "Success",
//         description: "MPI updated successfully.",
//       })
//     } catch (error: any) {
//       console.error("Failed to update MPI:", error)
//       throw error // Re-throw to let the form handle it
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDeleteMPI = async (id: string) => {
//     try {
//       await MPIAPI.deleteMPI(id)
//       await loadMPIs()
//       toast({
//         title: "Success",
//         description: "MPI deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleViewMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     setCurrentView("details")
//   }

//   const handleEditMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     setCurrentView("edit")
//   }

//   const handleBackToList = () => {
//     setCurrentView("list")
//     setSelectedMPI(null)
//     router.push("/dashboard/mpi")
//   }

//   if (currentView === "create") {
//     return <MPIForm onSubmit={handleCreateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "edit" && selectedMPI) {
//     return <MPIEdit mpi={selectedMPI} onSubmit={handleUpdateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "details" && selectedMPI) {
//     return (
//       <MPIDetails
//         mpi={selectedMPI}
//         onEdit={() => handleEditMPI(selectedMPI)}
//         onBack={handleBackToList}
//         onDelete={() => handleDeleteMPI(selectedMPI.id)}
//       />
//     )
//   }

//   return (
//     <MPIList
//       mpis={mpis}
//       onView={handleViewMPI}
//       onEdit={handleEditMPI}
//       onDelete={handleDeleteMPI}
//       onCreate={() => setCurrentView("create")}
//       isLoading={loading}
//     />
//   )
// }














// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { MPIList } from "./mpi-list"
// import { MPIForm } from "./mpi-form"
// import { MPIEdit } from "./mpi-edit"
// import { MPIDetails } from "./mpi-details"
// import { MPIAPI } from "./mpi-api"
// import type { MPI, CreateMPIDto, UpdateMPIDto } from "./types"
// import { useToast } from "@/hooks/use-toast"

// interface MPIServiceProps {
//   initialView?: "list" | "create" | "edit" | "details"
//   mpiId?: string
// }

// export function MPIService({ initialView = "list", mpiId }: MPIServiceProps) {
//   const [currentView, setCurrentView] = useState(initialView)
//   const [mpis, setMpis] = useState<MPI[]>([])
//   const [selectedMPI, setSelectedMPI] = useState<MPI | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()

//   useEffect(() => {
//     loadMPIs()
//   }, [])

//   useEffect(() => {
//     if (mpiId && (initialView === "edit" || initialView === "details")) {
//       loadMPIById(mpiId)
//     }
//   }, [mpiId, initialView])

//   const loadMPIs = async () => {
//     try {
//       setLoading(true)
//       const data = await MPIAPI.getAllMPIs()
//       setMpis(data)
//     } catch (error) {
//       console.error("Failed to load MPIs:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPIs. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadMPIById = async (id: string) => {
//     try {
//       setLoading(true)
//       const mpi = await MPIAPI.getMPIById(id)
//       setSelectedMPI(mpi)
//     } catch (error) {
//       console.error("Failed to load MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPI details. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreateMPI = async (data: CreateMPIDto) => {
//     try {
//       setSubmitting(true)
//       const newMPI = await MPIAPI.createMPI(data)
//       await loadMPIs()
//       setCurrentView("list")
//       toast({
//         title: "Success",
//         description: "MPI created successfully.",
//       })
//     } catch (error: any) {
//       console.error("Failed to create MPI:", error)
//       throw error // Re-throw to let the form handle it
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleUpdateMPI = async (data: UpdateMPIDto) => {
//     if (!selectedMPI) return

//     try {
//       setSubmitting(true)
//       const updatedMPI = await MPIAPI.updateMPI(selectedMPI.id, data)
//       await loadMPIs()
//       setSelectedMPI(updatedMPI)
//       setCurrentView("details")
//       toast({
//         title: "Success",
//         description: "MPI updated successfully.",
//       })
//     } catch (error: any) {
//       console.error("Failed to update MPI:", error)
//       throw error // Re-throw to let the form handle it
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDeleteMPI = async (id: string) => {
//     try {
//       await MPIAPI.deleteMPI(id)
//       await loadMPIs()
//       toast({
//         title: "Success",
//         description: "MPI deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleViewMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     setCurrentView("details")
//     router.push(`/dashboard/mpi/${mpi.id}`)
//   }

//   const handleEditMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     setCurrentView("edit")
//     router.push(`/dashboard/mpi/${mpi.id}/edit`)
//   }

//   const handleBackToList = () => {
//     setCurrentView("list")
//     setSelectedMPI(null)
//     router.push("/dashboard/mpi")
//   }

//   if (currentView === "create") {
//     return <MPIForm onSubmit={handleCreateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "edit" && selectedMPI) {
//     return <MPIEdit mpi={selectedMPI} onSubmit={handleUpdateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "details" && selectedMPI) {
//     return (
//       <MPIDetails
//         mpi={selectedMPI}
//         onEdit={() => handleEditMPI(selectedMPI)}
//         onBack={handleBackToList}
//         onDelete={() => handleDeleteMPI(selectedMPI.id)}
//       />
//     )
//   }

//   return (
//     <MPIList
//       mpis={mpis}
//       onView={handleViewMPI}
//       onEdit={handleEditMPI}
//       onDelete={handleDeleteMPI}
//       onCreate={() => setCurrentView("create")}
//       isLoading={loading}
//     />
//   )
// }




// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { MPIList } from "./mpi-list"
// import { MPIForm } from "./mpi-form"
// import { MPIEdit } from "./mpi-edit"
// import { MPIDetails } from "./mpi-details"
// import { MPIAPI } from "./mpi-api"
// import type { MPI, CreateMPIDto, UpdateMPIDto } from "./types"
// import { useToast } from "@/hooks/use-toast"

// interface MPIServiceProps {
//   initialView?: "list" | "create" | "edit" | "details"
//   mpiId?: string
// }

// export function MPIService({ initialView = "list", mpiId }: MPIServiceProps) {
//   const [currentView, setCurrentView] = useState(initialView)
//   const [mpis, setMpis] = useState<MPI[]>([])
//   const [selectedMPI, setSelectedMPI] = useState<MPI | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()

//   useEffect(() => {
//     loadMPIs()
//   }, [])

//   useEffect(() => {
//     if (mpiId && (initialView === "edit" || initialView === "details")) {
//       loadMPIById(mpiId)
//     }
//   }, [mpiId, initialView])

//   const loadMPIs = async () => {
//     try {
//       setLoading(true)
//       const data = await MPIAPI.getAllMPIs()
//       setMpis(data)
//     } catch (error) {
//       console.error("Failed to load MPIs:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPIs. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadMPIById = async (id: string) => {
//     try {
//       setLoading(true)
//       const mpi = await MPIAPI.getMPIById(id)
//       setSelectedMPI(mpi)
//     } catch (error) {
//       console.error("Failed to load MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPI details. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreateMPI = async (data: CreateMPIDto) => {
//     try {
//       setSubmitting(true)
//       const newMPI = await MPIAPI.createMPI(data)
//       await loadMPIs()
//       setCurrentView("list")
//       toast({
//         title: "Success",
//         description: "MPI created successfully.",
//       })
//     } catch (error: any) {
//       console.error("Failed to create MPI:", error)
//       throw error // Re-throw to let the form handle it
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleUpdateMPI = async (data: UpdateMPIDto) => {
//     if (!selectedMPI) return

//     try {
//       setSubmitting(true)
//       const updatedMPI = await MPIAPI.updateMPI(selectedMPI.id, data)
//       await loadMPIs()
//       // Reload the MPI to get the complete updated data including specifications
//       await loadMPIById(selectedMPI.id)
//       setCurrentView("details")
//       toast({
//         title: "Success",
//         description: "MPI updated successfully.",
//       })
//     } catch (error: any) {
//       console.error("Failed to update MPI:", error)
//       throw error // Re-throw to let the form handle it
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDeleteMPI = async (id: string) => {
//     try {
//       await MPIAPI.deleteMPI(id)
//       await loadMPIs()
//       toast({
//         title: "Success",
//         description: "MPI deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleViewMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     setCurrentView("details")
//     router.push(`/dashboard/mpi/${mpi.id}`)
//   }

//   const handleEditMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     setCurrentView("edit")
//     router.push(`/dashboard/mpi/${mpi.id}/edit`)
//   }

//   const handleBackToList = () => {
//     setCurrentView("list")
//     setSelectedMPI(null)
//     router.push("/dashboard/mpi")
//   }

//   if (currentView === "create") {
//     return <MPIForm onSubmit={handleCreateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "edit" && selectedMPI) {
//     return <MPIEdit mpi={selectedMPI} onSubmit={handleUpdateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "details" && selectedMPI) {
//     return (
//       <MPIDetails
//         mpi={selectedMPI}
//         onEdit={() => handleEditMPI(selectedMPI)}
//         onBack={handleBackToList}
//         onDelete={() => handleDeleteMPI(selectedMPI.id)}
//       />
//     )
//   }

//   return (
//     <MPIList
//       mpis={mpis}
//       onView={handleViewMPI}
//       onEdit={handleEditMPI}
//       onDelete={handleDeleteMPI}
//       onCreate={() => setCurrentView("create")}
//       isLoading={loading}
//     />
//   )
// }
















// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { MPIList } from "./mpi-list"
// import { MPIForm } from "./mpi-form"
// import { MPIEdit } from "./mpi-edit"
// import { MPIDetails } from "./mpi-details"
// import { MPIAPI } from "./mpi-api"
// import type { MPI, CreateMPIDto, UpdateMPIDto } from "./types"
// import { useToast } from "@/hooks/use-toast"

// interface MPIServiceProps {
//   initialView?: "list" | "create" | "edit" | "details"
//   mpiId?: string
// }

// export function MPIService({ initialView = "list", mpiId }: MPIServiceProps) {
//   const [currentView, setCurrentView] = useState(initialView)
//   const [mpis, setMpis] = useState<MPI[]>([])
//   const [selectedMPI, setSelectedMPI] = useState<MPI | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()

//   useEffect(() => {
//     loadMPIs()
//   }, [])

//   useEffect(() => {
//     if (mpiId && (initialView === "edit" || initialView === "details")) {
//       loadMPIById(mpiId)
//     }
//   }, [mpiId, initialView])

//   const loadMPIs = async () => {
//     try {
//       setLoading(true)
//       const data = await MPIAPI.getAllMPIs()
//       setMpis(data)
//     } catch (error) {
//       console.error("Failed to load MPIs:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPIs. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadMPIById = async (id: string) => {
//     try {
//       setLoading(true)
//       const mpi = await MPIAPI.getMPIById(id)
//       setSelectedMPI(mpi)
//     } catch (error) {
//       console.error("Failed to load MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPI details. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreateMPI = async (data: CreateMPIDto) => {
//     try {
//       setSubmitting(true)
//       const newMPI = await MPIAPI.createMPI(data)
//       await loadMPIs()
//       setCurrentView("list")
//       toast({
//         title: "Success",
//         description: "MPI created successfully.",
//       })
//     } catch (error: any) {
//       console.error("Failed to create MPI:", error)
//       throw error // Re-throw to let the form handle it
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleUpdateMPI = async (data: UpdateMPIDto) => {
//     if (!selectedMPI) return

//     try {
//       setSubmitting(true)
//       const updatedMPI = await MPIAPI.updateMPI(selectedMPI.id, data)
//       await loadMPIs()
//       // Reload the MPI to get the complete updated data including specifications
//       await loadMPIById(selectedMPI.id)
//       setCurrentView("details")
//       toast({
//         title: "Success",
//         description: "MPI updated successfully.",
//       })
//     } catch (error: any) {
//       console.error("Failed to update MPI:", error)
//       throw error // Re-throw to let the form handle it
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDeleteMPI = async (id: string) => {
//     try {
//       await MPIAPI.deleteMPI(id)
//       await loadMPIs()
//       toast({
//         title: "Success",
//         description: "MPI deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleViewMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     setCurrentView("details")
//     router.push(`/dashboard/mpi/${mpi.id}`)
//   }

//   const handleEditMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     setCurrentView("edit")
//     router.push(`/dashboard/mpi/${mpi.id}/edit`)
//   }

//   const handleBackToList = () => {
//     setCurrentView("list")
//     setSelectedMPI(null)
//     router.push("/dashboard/mpi")
//   }

//   if (currentView === "create") {
//     return <MPIForm onSubmit={handleCreateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "edit" && selectedMPI) {
//     return <MPIEdit mpi={selectedMPI} onSubmit={handleUpdateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "details" && selectedMPI) {
//     return (
//       <MPIDetails
//         mpi={selectedMPI}
//         onEdit={() => handleEditMPI(selectedMPI)}
//         onBack={handleBackToList}
//         onDelete={() => handleDeleteMPI(selectedMPI.id)}
//       />
//     )
//   }

//   return (
//     <MPIList
//       mpis={mpis}
//       onView={handleViewMPI}
//       onEdit={handleEditMPI}
//       onDelete={handleDeleteMPI}
//       onCreateNew={() => setCurrentView("create")}
//       isLoading={loading}
//     />
//   )
// }





















// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { MPIList } from "./mpi-list"
// import { MPIForm } from "./mpi-form"
// import { MPIEdit } from "./mpi-edit"
// import { MPIDetails } from "./mpi-details"
// import { MPIAPI } from "./mpi-api"
// import type { MPI, CreateMPIDto, UpdateMPIDto } from "./types"
// import { useToast } from "@/hooks/use-toast"

// interface MPIServiceProps {
//   initialView?: "list" | "create" | "edit" | "details"
//   mpiId?: string
// }

// export function MPIService({ initialView = "list", mpiId }: MPIServiceProps) {
//   const [currentView, setCurrentView] = useState(initialView)
//   const [mpis, setMpis] = useState<MPI[]>([])
//   const [selectedMPI, setSelectedMPI] = useState<MPI | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()

//   useEffect(() => {
//     loadMPIs()
//   }, [])

//   useEffect(() => {
//     if (mpiId && (initialView === "edit" || initialView === "details")) {
//       loadMPIById(mpiId)
//     }
//   }, [mpiId, initialView])

//   const loadMPIs = async () => {
//     try {
//       setLoading(true)
//       const data = await MPIAPI.getAllMPIs()
//       setMpis(data)
//     } catch (error) {
//       console.error("Failed to load MPIs:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPIs. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadMPIById = async (id: string) => {
//     try {
//       setLoading(true)
//       const mpi = await MPIAPI.getMPIById(id)
//       setSelectedMPI(mpi)
//     } catch (error) {
//       console.error("Failed to load MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPI details. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreateMPI = async (data: CreateMPIDto) => {
//     try {
//       setSubmitting(true)
//       const newMPI = await MPIAPI.createMPI(data)
//       await loadMPIs()
//       setCurrentView("list")
//       toast({
//         title: "Success",
//         description: "MPI created successfully.",
//       })
//       return newMPI // Add this line to return the created MPI
//     } catch (error: any) {
//       console.error("Failed to create MPI:", error)
//       throw error // Re-throw to let the form handle it
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleUpdateMPI = async (data: UpdateMPIDto) => {
//     if (!selectedMPI) return

//     try {
//       setSubmitting(true)
//       const updatedMPI = await MPIAPI.updateMPI(selectedMPI.id, data)
//       await loadMPIs()
//       // Reload the MPI to get the complete updated data including specifications
//       await loadMPIById(selectedMPI.id)
//       setCurrentView("details")
//       toast({
//         title: "Success",
//         description: "MPI updated successfully.",
//       })
//     } catch (error: any) {
//       console.error("Failed to update MPI:", error)
//       throw error // Re-throw to let the form handle it
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDeleteMPI = async (id: string) => {
//     try {
//       await MPIAPI.deleteMPI(id)
//       await loadMPIs()
//       toast({
//         title: "Success",
//         description: "MPI deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleViewMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     setCurrentView("details")
//     router.push(`/dashboard/mpi/${mpi.id}`)
//   }

//   const handleEditMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     setCurrentView("edit")
//     router.push(`/dashboard/mpi/${mpi.id}/edit`)
//   }

//   const handleBackToList = () => {
//     setCurrentView("list")
//     setSelectedMPI(null)
//     router.push("/dashboard/mpi")
//   }

//   if (currentView === "create") {
//     return <MPIForm onSubmit={handleCreateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "edit" && selectedMPI) {
//     return <MPIEdit mpi={selectedMPI} onSubmit={handleUpdateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "details" && selectedMPI) {
//     return (
//       <MPIDetails
//         mpi={selectedMPI}
//         onEdit={() => handleEditMPI(selectedMPI)}
//         onBack={handleBackToList}
//         onDelete={() => handleDeleteMPI(selectedMPI.id)}
//       />
//     )
//   }

//   return (
//     <MPIList
//       mpis={mpis}
//       onView={handleViewMPI}
//       onEdit={handleEditMPI}
//       onDelete={handleDeleteMPI}
//       onCreateNew={() => setCurrentView("create")}
//       isLoading={loading}
//     />
//   )
// }





// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { MPIList } from "./mpi-list"
// import { MPIForm } from "./mpi-form"
// import { MPIEdit } from "./mpi-edit"
// import { MPIDetails } from "./mpi-details"
// import { MPIAPI } from "./mpi-api"
// import type { MPI, CreateMPIDto, UpdateMPIDto } from "./types"
// import { useToast } from "@/hooks/use-toast"

// interface MPIServiceProps {
//   initialView?: "list" | "create" | "edit" | "details"
//   mpiId?: string
// }

// export function MPIService({ initialView = "list", mpiId }: MPIServiceProps) {
//   const [currentView, setCurrentView] = useState(initialView)
//   const [mpis, setMpis] = useState<MPI[]>([])
//   const [selectedMPI, setSelectedMPI] = useState<MPI | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()
//   const [stationMpiDocuments, setStationMpiDocuments] = useState<any[]>([])

//   useEffect(() => {
//     loadMPIs()
//   }, [])

//   useEffect(() => {
//     if (mpiId && (initialView === "edit" || initialView === "details")) {
//       loadMPIById(mpiId)
//     }
//   }, [mpiId, initialView])

//   const loadMPIs = async () => {
//     try {
//       setLoading(true)
//       const data = await MPIAPI.getAllMPIs()
//       setMpis(data)
//     } catch (error) {
//       console.error("Failed to load MPIs:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPIs. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadMPIById = async (id: string) => {
//     try {
//       setLoading(true)
//       const mpi = await MPIAPI.getMPIById(id)
//       setSelectedMPI(mpi)

//       // Set station MPI documents from the response
//       if (mpi.stationMpiDocuments) {
//         setStationMpiDocuments(mpi.stationMpiDocuments)
//       }

//       // Also extract station documents from individual stations
//       const allStationDocs =
//         mpi.stations?.flatMap(
//           (station) =>
//             station.documentations?.map((doc) => ({
//               ...doc,
//               stationName: station.stationName,
//               stationId: station.id,
//             })) || [],
//         ) || []

//       console.log("Station documents loaded:", allStationDocs)
//     } catch (error) {
//       console.error("Failed to load MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPI details. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStationDocumentUpload = async (stationId: string, file: File, description: string) => {
//     try {
//       // This would integrate with your station document upload API
//       console.log("Uploading station document:", { stationId, file: file.name, description })

//       // After successful upload, reload the MPI to get updated documents
//       if (selectedMPI) {
//         await loadMPIById(selectedMPI.id)
//       }

//       toast({
//         title: "Success",
//         description: "Station document uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to upload station document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleStationDocumentDelete = async (documentId: string) => {
//     try {
//       // This would integrate with your station document delete API
//       console.log("Deleting station document:", documentId)

//       // After successful deletion, reload the MPI to get updated documents
//       if (selectedMPI) {
//         await loadMPIById(selectedMPI.id)
//       }

//       toast({
//         title: "Success",
//         description: "Station document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete station document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete station document. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCreateMPI = async (data: CreateMPIDto) => {
//     try {
//       setSubmitting(true)
//       const newMPI = await MPIAPI.createMPI(data)
//       await loadMPIs()
//       setCurrentView("list")
//       toast({
//         title: "Success",
//         description: "MPI created successfully.",
//       })
//       return newMPI // Add this line to return the created MPI
//     } catch (error: any) {
//       console.error("Failed to create MPI:", error)
//       throw error // Re-throw to let the form handle it
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleUpdateMPI = async (data: UpdateMPIDto) => {
//     if (!selectedMPI) return

//     try {
//       setSubmitting(true)
//       const updatedMPI = await MPIAPI.updateMPI(selectedMPI.id, data)
//       await loadMPIs()
//       // Reload the MPI to get the complete updated data including specifications
//       await loadMPIById(selectedMPI.id)
//       setCurrentView("details")
//       toast({
//         title: "Success",
//         description: "MPI updated successfully.",
//       })
//     } catch (error: any) {
//       console.error("Failed to update MPI:", error)
//       throw error // Re-throw to let the form handle it
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDeleteMPI = async (id: string) => {
//     try {
//       await MPIAPI.deleteMPI(id)
//       await loadMPIs()
//       toast({
//         title: "Success",
//         description: "MPI deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleViewMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     setCurrentView("details")
//     router.push(`/dashboard/mpi/${mpi.id}`)
//   }

//   const handleEditMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     setCurrentView("edit")
//     router.push(`/dashboard/mpi/${mpi.id}/edit`)
//   }

//   const handleBackToList = () => {
//     setCurrentView("list")
//     setSelectedMPI(null)
//     router.push("/dashboard/mpi")
//   }

//   if (currentView === "create") {
//     return <MPIForm onSubmit={handleCreateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "edit" && selectedMPI) {
//     return <MPIEdit mpi={selectedMPI} onSubmit={handleUpdateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "details" && selectedMPI) {
//     return (
//       <MPIDetails
//         mpi={selectedMPI}
//         onEdit={() => handleEditMPI(selectedMPI)}
//         onBack={handleBackToList}
//         onDelete={() => handleDeleteMPI(selectedMPI.id)}
//       />
//     )
//   }

//   return (
//     <MPIList
//       mpis={mpis}
//       onView={handleViewMPI}
//       onEdit={handleEditMPI}
//       onDelete={handleDeleteMPI}
//       onCreateNew={() => setCurrentView("create")}
//       isLoading={loading}
//     />
//   )
// }























// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { MPIList } from "./mpi-list"
// import { MPIForm } from "./mpi-form"
// import { MPIEdit } from "./mpi-edit"
// import { MPIDetails } from "./mpi-details"
// import { MPIAPI } from "./mpi-api"
// import type { MPI, CreateMPIDto, UpdateMPIDto } from "./types"
// import { useToast } from "@/hooks/use-toast"

// interface MPIServiceProps {
//   initialView?: "list" | "create" | "edit" | "details"
//   mpiId?: string
// }

// export function MPIService({ initialView = "list", mpiId }: MPIServiceProps) {
//   const [currentView, setCurrentView] = useState(initialView)
//   const [mpis, setMpis] = useState<MPI[]>([])
//   const [selectedMPI, setSelectedMPI] = useState<MPI | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()
//   const [stationMpiDocuments, setStationMpiDocuments] = useState<any[]>([])

//   useEffect(() => {
//     loadMPIs()
//   }, [])

//   useEffect(() => {
//     if (mpiId && (initialView === "edit" || initialView === "details")) {
//       loadMPIById(mpiId)
//     }
//   }, [mpiId, initialView])

//   const loadMPIs = async () => {
//     try {
//       setLoading(true)
//       const data = await MPIAPI.getAllMPIs()
//       setMpis(data)
//     } catch (error) {
//       console.error("Failed to load MPIs:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPIs. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadMPIById = async (id: string) => {
//     try {
//       setLoading(true)
//       const mpi = await MPIAPI.getMPIById(id)
//       setSelectedMPI(mpi)

//       // Set station MPI documents from the response
//       if (mpi.stationMpiDocuments) {
//         setStationMpiDocuments(mpi.stationMpiDocuments)
//         console.log("Station MPI documents loaded:", mpi.stationMpiDocuments)
//       }

//       // Also extract station documents from individual stations
//       const allStationDocs =
//         mpi.stations?.flatMap(
//           (station) =>
//             station.documentations?.map((doc) => ({
//               ...doc,
//               stationName: station.stationName,
//               stationId: station.id,
//             })) || [],
//         ) || []

//       console.log("Station documents loaded:", allStationDocs)
//     } catch (error) {
//       console.error("Failed to load MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPI details. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStationDocumentUpload = async (stationId: string, file: File, description: string) => {
//     try {
//       // This would integrate with your station document upload API
//       console.log("Uploading station document:", { stationId, file: file.name, description })

//       // After successful upload, reload the MPI to get updated documents
//       if (selectedMPI) {
//         await loadMPIById(selectedMPI.id)
//       }

//       toast({
//         title: "Success",
//         description: "Station document uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to upload station document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleStationDocumentDelete = async (documentId: string) => {
//     try {
//       // This would integrate with your station document delete API
//       console.log("Deleting station document:", documentId)

//       // After successful deletion, reload the MPI to get updated documents
//       if (selectedMPI) {
//         await loadMPIById(selectedMPI.id)
//       }

//       toast({
//         title: "Success",
//         description: "Station document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete station document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete station document. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCreateMPI = async (data: CreateMPIDto) => {
//     try {
//       setSubmitting(true)
//       const newMPI = await MPIAPI.createMPI(data)

//       // After creating MPI, reload the list to get the updated data including station documents
//       await loadMPIs()

//       // If we have the new MPI ID, also load it specifically to get complete data including station documents
//       if (newMPI?.id) {
//         console.log("🔄 Loading newly created MPI to fetch complete data including station documents...")
//         await loadMPIById(newMPI.id)
//         console.log("✅ Newly created MPI data loaded successfully")
//       }

//       setCurrentView("list")
//       toast({
//         title: "Success",
//         description: "MPI created successfully.",
//       })
//       return newMPI
//     } catch (error: any) {
//       console.error("Failed to create MPI:", error)
//       throw error
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleUpdateMPI = async (data: UpdateMPIDto) => {
//     if (!selectedMPI) return

//     try {
//       setSubmitting(true)
//       const updatedMPI = await MPIAPI.updateMPI(selectedMPI.id, data)
//       await loadMPIs()
//       // Reload the MPI to get the complete updated data including specifications and station documents
//       await loadMPIById(selectedMPI.id)
//       setCurrentView("details")
//       toast({
//         title: "Success",
//         description: "MPI updated successfully.",
//       })
//     } catch (error: any) {
//       console.error("Failed to update MPI:", error)
//       throw error
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDeleteMPI = async (id: string) => {
//     try {
//       await MPIAPI.deleteMPI(id)
//       await loadMPIs()
//       toast({
//         title: "Success",
//         description: "MPI deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleViewMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     setCurrentView("details")
//     router.push(`/dashboard/mpi/${mpi.id}`)
//   }

//   const handleEditMPI = (mpi: MPI) => {
//     setSelectedMPI(mpi)
//     setCurrentView("edit")
//     router.push(`/dashboard/mpi/${mpi.id}/edit`)
//   }

//   const handleBackToList = () => {
//     setCurrentView("list")
//     setSelectedMPI(null)
//     router.push("/dashboard/mpi")
//   }

//   if (currentView === "create") {
//     return <MPIForm onSubmit={handleCreateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "edit" && selectedMPI) {
//     return <MPIEdit mpi={selectedMPI} onSubmit={handleUpdateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "details" && selectedMPI) {
//     return (
//       <MPIDetails
//         mpi={selectedMPI}
//         onEdit={() => handleEditMPI(selectedMPI)}
//         onBack={handleBackToList}
//         onDelete={() => handleDeleteMPI(selectedMPI.id)}
//       />
//     )
//   }

//   return (
//     <MPIList
//       mpis={mpis}
//       onView={handleViewMPI}
//       onEdit={handleEditMPI}
//       onDelete={handleDeleteMPI}
//       onCreateNew={() => setCurrentView("create")}
//       isLoading={loading}
//     />
//   )
// }







// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { MPIList } from "./mpi-list"
// import { MPIForm } from "./mpi-form"
// import { MPIEdit } from "./mpi-edit"
// import { MPIDetails } from "./mpi-details"
// import { MPIAPI } from "./mpi-api"
// import type { MPI, CreateMPIDto, UpdateMPIDto } from "./types"
// import { useToast } from "@/hooks/use-toast"
// import { StationMpiDocAPI } from "./station-mpi-doc-api"

// interface MPIServiceProps {
//   initialView?: "list" | "create" | "edit" | "details"
//   mpiId?: string
// }

// export function MPIService({ initialView = "list", mpiId }: MPIServiceProps) {
//   const [currentView, setCurrentView] = useState(initialView)
//   const [mpis, setMpis] = useState<MPI[]>([])
//   const [selectedMPI, setSelectedMPI] = useState<MPI | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [submitting, setSubmitting] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()
//   const [stationMpiDocuments, setStationMpiDocuments] = useState<any[]>([])

//   useEffect(() => {
//     loadMPIs()
//   }, [])

//   useEffect(() => {
//     if (mpiId && (initialView === "edit" || initialView === "details")) {
//       loadMPIById(mpiId)
//     }
//   }, [mpiId, initialView])

//   const loadMPIs = async () => {
//     try {
//       setLoading(true)
//       const data = await MPIAPI.getAllMPIs()
//       setMpis(data)
//       console.log("📋 Loaded MPIs:", data.length)
//     } catch (error) {
//       console.error("Failed to load MPIs:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPIs. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadMPIById = async (id: string) => {
//     try {
//       setLoading(true)
//       console.log("🔍 Loading MPI by ID:", id)

//       const mpi = await MPIAPI.getMPIById(id)
//       console.log("📄 MPI loaded successfully:", {
//         id: mpi.id,
//         jobId: mpi.jobId,
//         assemblyId: mpi.assemblyId,
//         stationsCount: mpi.stations?.length || 0,
//         checklistsCount: mpi.checklists?.length || 0,
//         mpiDocsCount: mpi.mpiDocs?.length || 0,
//         stationMpiDocsCount: mpi.stationMpiDocuments?.length || 0,
//       })

//       setSelectedMPI(mpi)

//       // Set station MPI documents from the response
//       if (mpi.stationMpiDocuments) {
//         setStationMpiDocuments(mpi.stationMpiDocuments)
//         console.log("📎 Station MPI documents loaded:", mpi.stationMpiDocuments.length)
//       }

//       // Also extract station documents from individual stations
//       const allStationDocs =
//         mpi.stations?.flatMap(
//           (station) =>
//             station.documentations?.map((doc) => ({
//               ...doc,
//               stationName: station.stationName,
//               stationId: station.id,
//             })) || [],
//         ) || []

//       console.log("📁 Station documents from stations:", allStationDocs.length)
//     } catch (error) {
//       console.error("❌ Failed to load MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load MPI details. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStationDocumentUpload = async (stationId: string, file: File, description: string) => {
//     try {
//       console.log("📤 Uploading station document:", {
//         stationId,
//         fileName: file.name,
//         description,
//         mpiId: selectedMPI?.id,
//       })

//       // Use the StationMpiDocAPI for uploads
//       const result = await StationMpiDocAPI.create(
//         {
//           stationId,
//           description,
//           mpiId: selectedMPI?.id,
//         },
//         file,
//       )

//       console.log("✅ Station document uploaded successfully:", result)

//       // After successful upload, reload the MPI to get updated documents
//       if (selectedMPI) {
//         await loadMPIById(selectedMPI.id)
//       }

//       toast({
//         title: "Success",
//         description: "Station document uploaded successfully.",
//       })

//       return result
//     } catch (error) {
//       console.error("❌ Failed to upload station document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to upload station document. Please try again.",
//         variant: "destructive",
//       })
//       throw error
//     }
//   }

//   const handleStationDocumentDelete = async (documentId: string) => {
//     try {
//       console.log("🗑️ Deleting station document:", documentId)

//       await StationMpiDocAPI.delete(documentId)
//       console.log("✅ Station document deleted successfully")

//       // After successful deletion, reload the MPI to get updated documents
//       if (selectedMPI) {
//         await loadMPIById(selectedMPI.id)
//       }

//       toast({
//         title: "Success",
//         description: "Station document deleted successfully.",
//       })
//     } catch (error) {
//       console.error("❌ Failed to delete station document:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete station document. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCreateMPI = async (data: CreateMPIDto) => {
//     try {
//       setSubmitting(true)
//       console.log("🚀 Creating MPI with data:", {
//         jobId: data.jobId,
//         assemblyId: data.assemblyId,
//         customer: data.customer,
//         instructionsCount: data.Instruction?.length || 0,
//         stationsCount: data.stations?.length || 0,
//         checklistsCount: data.checklists?.length || 0,
//         mpiDocsCount: data.mpiDocs?.length || 0,
//       })

//       const newMPI = await MPIAPI.createMPI(data)
//       console.log("✅ MPI created successfully:", newMPI)

//       // Enhanced MPI ID extraction with better error handling
//       let mpiId = null
//       if (newMPI) {
//         mpiId = newMPI.id || newMPI.mpiId || newMPI.data?.id || newMPI.data?.mpiId

//         console.log("🔍 MPI ID extraction:", {
//           resultType: typeof newMPI,
//           resultKeys: Object.keys(newMPI || {}),
//           extractedId: mpiId,
//         })

//         if (!mpiId) {
//           console.warn("⚠️ Could not extract MPI ID from response")
//           console.warn("⚠️ Full response:", JSON.stringify(newMPI, null, 2))
//           toast({
//             title: "Warning",
//             description: "MPI created but ID could not be extracted. Some features may not work properly.",
//             variant: "destructive",
//           })
//         }
//       } else {
//         console.error("❌ MPI creation returned null/undefined result")
//       }

//       // After creating MPI, reload the list to get the updated data
//       await loadMPIs()

//       // If we have the new MPI ID, load it specifically to get complete data
//       if (mpiId) {
//         console.log("🔄 Loading newly created MPI to fetch complete data...")
//         await loadMPIById(mpiId)
//         console.log("✅ Newly created MPI data loaded successfully")
//       }

//       setCurrentView("list")
//       toast({
//         title: "Success",
//         description: "MPI created successfully.",
//       })
//       return newMPI
//     } catch (error: any) {
//       console.error("❌ Failed to create MPI:", error)
//       throw error
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleUpdateMPI = async (data: UpdateMPIDto) => {
//     if (!selectedMPI) {
//       console.error("❌ No MPI selected for update")
//       return
//     }

//     try {
//       setSubmitting(true)
//       console.log("🔄 Updating MPI:", {
//         id: selectedMPI.id,
//         jobId: data.jobId,
//         assemblyId: data.assemblyId,
//         customer: data.customer,
//         instructionsCount: data.Instruction?.length || 0,
//         stationsCount: data.stations?.length || 0,
//         checklistsCount: data.checklists?.length || 0,
//         mpiDocsCount: data.mpiDocs?.length || 0,
//       })

//       const updatedMPI = await MPIAPI.updateMPI(selectedMPI.id, data)
//       console.log("✅ MPI updated successfully:", updatedMPI)

//       // Reload the MPI list and the specific MPI to get complete updated data
//       await loadMPIs()
//       await loadMPIById(selectedMPI.id)

//       setCurrentView("details")
//       toast({
//         title: "Success",
//         description: "MPI updated successfully.",
//       })
//     } catch (error: any) {
//       console.error("❌ Failed to update MPI:", error)
//       throw error
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDeleteMPI = async (id: string) => {
//     try {
//       console.log("🗑️ Deleting MPI:", id)

//       await MPIAPI.deleteMPI(id)
//       console.log("✅ MPI deleted successfully")

//       await loadMPIs()
//       toast({
//         title: "Success",
//         description: "MPI deleted successfully.",
//       })
//     } catch (error) {
//       console.error("❌ Failed to delete MPI:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete MPI. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleViewMPI = (mpi: MPI) => {
//     console.log("👁️ Viewing MPI:", mpi.id)
//     setSelectedMPI(mpi)
//     setCurrentView("details")
//     router.push(`/dashboard/mpi/${mpi.id}`)
//   }

//   const handleEditMPI = (mpi: MPI) => {
//     console.log("✏️ Editing MPI:", mpi.id)
//     setSelectedMPI(mpi)
//     setCurrentView("edit")
//     router.push(`/dashboard/mpi/${mpi.id}/edit`)
//   }

//   const handleBackToList = () => {
//     console.log("⬅️ Navigating back to MPI list")
//     setCurrentView("list")
//     setSelectedMPI(null)
//     router.push("/dashboard/mpi")
//   }

//   // Render based on current view
//   if (currentView === "create") {
//     return <MPIForm onSubmit={handleCreateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "edit" && selectedMPI) {
//     return <MPIEdit mpi={selectedMPI} onSubmit={handleUpdateMPI} onCancel={handleBackToList} isLoading={submitting} />
//   }

//   if (currentView === "details" && selectedMPI) {
//     return (
//       <MPIDetails
//         mpi={selectedMPI}
//         onEdit={() => handleEditMPI(selectedMPI)}
//         onBack={handleBackToList}
//         onDelete={() => handleDeleteMPI(selectedMPI.id)}
//         onStationDocumentUpload={handleStationDocumentUpload}
//         onStationDocumentDelete={handleStationDocumentDelete}
//       />
//     )
//   }

//   return (
//     <MPIList
//       mpis={mpis}
//       onView={handleViewMPI}
//       onEdit={handleEditMPI}
//       onDelete={handleDeleteMPI}
//       onCreateNew={() => setCurrentView("create")}
//       isLoading={loading}
//     />
//   )
// }














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





