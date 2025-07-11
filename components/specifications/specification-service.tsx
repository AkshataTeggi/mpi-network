// "use client"

// import { useState, useEffect } from "react"
// import { SpecificationList } from "./specification-list"
// import { SpecificationForm } from "./specification-form"
// import { SpecificationAPI } from "./specification-api"
// import { useToast } from "@/hooks/use-toast"
// import type { Specification, CreateSpecificationDto, UpdateSpecificationDto } from "./types"

// type ViewMode = "list" | "create" | "edit"

// interface SpecificationServiceProps {
//   initialView?: ViewMode
//   specificationId?: string
// }

// export function SpecificationService({ initialView = "list", specificationId }: SpecificationServiceProps) {
//   const [specifications, setSpecifications] = useState<Specification[]>([])
//   const [currentView, setCurrentView] = useState<ViewMode>(initialView)
//   const [selectedSpecification, setSelectedSpecification] = useState<Specification | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const { toast } = useToast()

//   // Load specifications on component mount
//   useEffect(() => {
//     loadSpecifications()
//   }, [])

//   // Load specific specification if specificationId is provided
//   useEffect(() => {
//     if (specificationId && initialView === "edit") {
//       loadSpecificSpecification(specificationId)
//     }
//   }, [specificationId, initialView])

//   const loadSpecifications = async () => {
//     try {
//       setIsLoading(true)
//       const data = await SpecificationAPI.getAllSpecifications()
//       setSpecifications(data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load specifications. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const loadSpecificSpecification = async (id: string) => {
//     try {
//       setIsLoading(true)
//       const specification = await SpecificationAPI.getSpecificationById(id)
//       setSelectedSpecification(specification)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load specification details. Please try again.",
//         variant: "destructive",
//       })
//       setCurrentView("list")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleCreateSpecification = async (dto: CreateSpecificationDto) => {
//     try {
//       setIsSubmitting(true)
//       const newSpecification = await SpecificationAPI.createSpecification(dto)
//       setSpecifications((prev) => [...prev, newSpecification])
//       setCurrentView("list")
//       toast({
//         title: "Success",
//         description: "Specification created successfully.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to create specification. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleUpdateSpecification = async (dto: UpdateSpecificationDto) => {
//     if (!selectedSpecification) return

//     try {
//       setIsSubmitting(true)
//       const updatedSpecification = await SpecificationAPI.updateSpecification(selectedSpecification.id, dto)
//       setSpecifications((prev) =>
//         prev.map((spec) => (spec.id === selectedSpecification.id ? updatedSpecification : spec)),
//       )
//       setSelectedSpecification(updatedSpecification)
//       setCurrentView("list")
//       toast({
//         title: "Success",
//         description: "Specification updated successfully.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update specification. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleDeleteSpecification = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this specification?")) return

//     try {
//       await SpecificationAPI.deleteSpecification(id)
//       setSpecifications((prev) => prev.filter((spec) => spec.id !== id))
//       toast({
//         title: "Success",
//         description: "Specification deleted successfully.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete specification. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleEditSpecification = (specification: Specification) => {
//     setSelectedSpecification(specification)
//     setCurrentView("edit")
//   }

//   const handleBackToList = () => {
//     setCurrentView("list")
//     setSelectedSpecification(null)
//   }

//   // Loading state
//   if (isLoading && initialView === "edit" && specificationId) {
//     return (
//       <div className="flex items-center justify-center py-8">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-2 text-sm text-muted-foreground">Loading specification details...</p>
//         </div>
//       </div>
//     )
//   }

//   // Error state for specific specification not found
//   if (!isLoading && initialView === "edit" && specificationId && !selectedSpecification) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-muted-foreground">Specification not found.</p>
//       </div>
//     )
//   }

//   // Render based on current view
//   switch (currentView) {
//     case "create":
//       return (
//         <SpecificationForm onSubmit={handleCreateSpecification} onCancel={handleBackToList} isLoading={isSubmitting} />
//       )

//     case "edit":
//       return (
//         <SpecificationForm
//           specification={selectedSpecification!}
//           onSubmit={handleUpdateSpecification}
//           onCancel={handleBackToList}
//           isLoading={isSubmitting}
//         />
//       )

//     default:
//       return (
//         <SpecificationList
//           specifications={specifications}
//           onCreateNew={() => setCurrentView("create")}
//           onEdit={handleEditSpecification}
//           onDelete={handleDeleteSpecification}
//           isLoading={isLoading}
//         />
//       )
//   }
// }
