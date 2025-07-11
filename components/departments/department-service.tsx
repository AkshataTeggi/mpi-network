"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { DepartmentCreateForm } from "./department-create-form"
import { DepartmentDetail } from "./department-details"
import { DepartmentDialog } from "./department-dialog"
import { DepartmentEditForm } from "./department-edit"
import { DepartmentError } from "./department-error"
import { DepartmentLoading } from "./department-loading"
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from "./types"
import { fetchDepartments, fetchDepartmentById, createDepartment, updateDepartment, deleteDepartment } from "./department-api"
import { DepartmentList } from "./department-list"

interface DepartmentServiceProps {
    initialView?: "list" | "create" | "edit" | "details"
    departmentId?: string
}

export function DepartmentService({ initialView = "list", departmentId }: DepartmentServiceProps) {
    const [currentView, setCurrentView] = useState(initialView)
    const [departments, setDepartments] = useState<Department[]>([])
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("all")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        loadDepartments()
    }, [])

    useEffect(() => {
        if (departmentId && (initialView === "edit" || initialView === "details")) {
            loadDepartmentById(departmentId)
        }
    }, [departmentId, initialView])

    const loadDepartments = async () => {
        try {
            setLoading(true)
            setError(null)
            console.log("🔍 Loading departments...")

            const data = await fetchDepartments()
            setDepartments(data)
            console.log("✅ Departments loaded:", data.length)
        } catch (err) {
            console.error("❌ Failed to load departments:", err)
            setError(err instanceof Error ? err.message : "Failed to load departments")
            toast({
                title: "Error",
                description: "Failed to load departments. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const loadDepartmentById = async (id: string) => {
        try {
            setLoading(true)
            setError(null)
            console.log("🔍 Loading department by ID:", id)

            const department = await fetchDepartmentById(id)
            setSelectedDepartment(department)
            console.log("✅ Department loaded:", department.name)
        } catch (err) {
            console.error("❌ Failed to load department:", err)
            setError(err instanceof Error ? err.message : "Failed to load department")
            toast({
                title: "Error",
                description: "Failed to load department details. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCreateDepartment = async (data: CreateDepartmentDto) => {
        try {
            console.log("🚀 Creating department:", data.name)

            const newDepartment = await createDepartment(data)
            console.log("✅ Department created successfully:", newDepartment.id)

            await loadDepartments()
            setCurrentView("list")
            setIsDialogOpen(false)

            toast({
                title: "Success",
                description: "Department created successfully.",
            })

            return newDepartment
        } catch (err) {
            console.error("❌ Failed to create department:", err)
            toast({
                title: "Error",
                description: "Failed to create department. Please try again.",
                variant: "destructive",
            })
            throw err
        }
    }

    const handleUpdateDepartment = async (id: string, data: UpdateDepartmentDto) => {
        try {
            console.log("🔄 Updating department:", id)

            const updatedDepartment = await updateDepartment(id, data)
            console.log("✅ Department updated successfully:", updatedDepartment.id)

            await loadDepartments()
            if (selectedDepartment?.id === id) {
                setSelectedDepartment(updatedDepartment)
            }

            setIsDialogOpen(false)

            toast({
                title: "Success",
                description: "Department updated successfully.",
            })

            return updatedDepartment
        } catch (err) {
            console.error("❌ Failed to update department:", err)
            toast({
                title: "Error",
                description: "Failed to update department. Please try again.",
                variant: "destructive",
            })
            throw err
        }
    }

    const handleDeleteDepartment = async (department: Department) => {
        if (!confirm(`Are you sure you want to delete "${department.name}"?`)) {
            return
        }

        try {
            console.log("🗑️ Deleting department:", department.id)

            await deleteDepartment(department.id)
            console.log("✅ Department deleted successfully")

            await loadDepartments()

            if (selectedDepartment?.id === department.id) {
                setCurrentView("list")
                setSelectedDepartment(null)
            }

            toast({
                title: "Success",
                description: "Department deleted successfully.",
            })
        } catch (err) {
            console.error("❌ Failed to delete department:", err)
            toast({
                title: "Error",
                description: "Failed to delete department. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleViewDepartment = (department: Department) => {
        console.log("👁️ Viewing department:", department.id)
        setSelectedDepartment(department)
        setCurrentView("details")
        router.push(`/dashboard/settings/departments/${department.id}`)
    }

    const handleEditDepartment = (department: Department) => {
        console.log("✏️ Editing department:", department.id)
        setSelectedDepartment(department)
        setCurrentView("edit")
        router.push(`/dashboard/settings/departments/${department.id}/edit`)
    }

    const handleViewRoles = (departmentId: string) => {
        const department = departments.find((d) => d.id === departmentId)
        if (department) {
            handleViewDepartment(department)
        }
    }

    const handleBackToList = () => {
        console.log("⬅️ Navigating back to departments list")
        setCurrentView("list")
        setSelectedDepartment(null)
        router.push("/dashboard/settings/departments")
    }

    const handleCreateNew = () => {
        console.log("➕ Creating new department")
        setCurrentView("create")
        setSelectedDepartment(null)
        router.push("/dashboard/settings/departments/create")
    }

    const handleOpenCreateDialog = () => {
        setDialogMode("create")
        setSelectedDepartment(null)
        setIsDialogOpen(true)
    }

    const handleOpenEditDialog = (department: Department) => {
        setDialogMode("edit")
        setSelectedDepartment(department)
        setIsDialogOpen(true)
    }

    const handleDialogSubmit = async (data: CreateDepartmentDto | UpdateDepartmentDto) => {
        if (dialogMode === "create") {
            await handleCreateDepartment(data as CreateDepartmentDto)
        } else if (selectedDepartment) {
            await handleUpdateDepartment(selectedDepartment.id, data as UpdateDepartmentDto)
        }
    }

    const getFilteredDepartments = () => {
        switch (activeTab) {
            case "active":
                return departments.filter((dept) => dept.isActive)
            case "inactive":
                return departments.filter((dept) => !dept.isActive)
            default:
                return departments
        }
    }

    if (loading && currentView === "list") {
        return <DepartmentLoading />
    }

    if (error && currentView === "list") {
        return <DepartmentError error={error} />
    }

    if (currentView === "create") {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        {/* Left side: Title and Subtitle */}
                        <div>
                            <h1 className="text-2xl font-bold text-green-700">Create New Department</h1>
                        </div>

                        {/* Right side: Back Button */}
                        <Button size="sm" onClick={handleBackToList} className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </div>


                    <DepartmentCreateForm onSuccess={handleBackToList} onCancel={handleBackToList} showCard={true} />
                </div>
            </div>
        )
    }




if (currentView === "edit" && selectedDepartment) {
  return (
    <div >
      <DepartmentEditForm
        department={selectedDepartment}
        onSuccess={async () => {
          await loadDepartments()
          handleBackToList()
        }}
        onCancel={handleBackToList}
      />
    </div>
  )
}


    if (currentView === "details" && selectedDepartment) {
        return (
            <div className="min-h-screen bg-gray-50">
                <DepartmentDetail
                    department={selectedDepartment}
                    onBack={handleBackToList}
                    onEdit={() => handleEditDepartment(selectedDepartment)}
                        onDelete={() => handleDeleteDepartment(selectedDepartment)}
                />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="space-y-6">

                <DepartmentList
                    departments={getFilteredDepartments()}
                    onViewRoles={handleViewRoles}
                    onEdit={(id) => {
                        const dept = departments.find((d) => d.id === id)
                        if (dept) handleEditDepartment(dept)
                    }}
                    onDelete={handleDeleteDepartment}
                />


                <DepartmentDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onSubmit={handleDialogSubmit}
                    title={dialogMode === "create" ? "Create Department" : "Edit Department"}
                    department={dialogMode === "edit" ? selectedDepartment : null}
                />
            </div>
        </div>
    )
}
