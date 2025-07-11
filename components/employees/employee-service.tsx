"use client"

import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { Employee, CreateEmployeeDto } from "./types"
import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployee as createEmployeeApi,
  deleteEmployee as deleteEmployeeApi,
} from "./employee-api"

// Import all existing components
import { EmployeeHeader } from "./employee-header"
import { EmployeeTabs } from "./employee-tabs"
import { EmployeeLoading } from "./employee-loading"
import { EmployeeError } from "./employee-error"
import { EmployeeEdit } from "./employee-edit"
import { EmployeeCreateForm } from "./employee-create-form"
import { EmployeeDialog } from "./employee-dialog"
import { EmployeeDetail } from "./employee-detail"

type ViewType = "list" | "details" | "edit" | "create"

interface EmployeeServiceProps {
  initialView?: ViewType
  employeeId?: string
}

export function EmployeeService({ initialView = "list", employeeId }: EmployeeServiceProps) {
  // State management
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>(initialView)
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Responsive design
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Load employees on component mount
  useEffect(() => {
    loadEmployees()
  }, [])

  // Load specific employee if employeeId is provided
  useEffect(() => {
    if (employeeId && (currentView === "details" || currentView === "edit")) {
      loadEmployeeById(employeeId)
    }
  }, [employeeId, currentView])

  // Filter employees based on active tab
  useEffect(() => {
    filterEmployees()
  }, [employees, activeTab])

  const loadEmployees = async () => {
    try {
      console.log("🔍 Loading employees...")
      setIsLoading(true)
      setError(null)
      const data = await fetchEmployees()
      console.log("✅ Employees loaded successfully:", data.length)
      setEmployees(data)
    } catch (err) {
      console.error("❌ Failed to load employees:", err)
      setError(err instanceof Error ? err.message : "Failed to load employees")
    } finally {
      setIsLoading(false)
    }
  }

  const loadEmployeeById = async (id: string) => {
    try {
      console.log("🔍 Loading employee:", id)
      setIsLoading(true)
      setError(null)
      const employee = await fetchEmployeeById(id)
      console.log("✅ Employee loaded successfully:", employee)
      setSelectedEmployee(employee)
    } catch (err) {
      console.error("❌ Failed to load employee:", err)
      setError(err instanceof Error ? err.message : "Failed to load employee")
    } finally {
      setIsLoading(false)
    }
  }

  const filterEmployees = () => {
    let filtered = employees

    switch (activeTab) {
      case "active":
        filtered = employees.filter((emp) => emp.isActive)
        break
      case "inactive":
        filtered = employees.filter((emp) => !emp.isActive)
        break
      default:
        filtered = employees
    }

    setFilteredEmployees(filtered)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleView = (employeeId: string) => {
    setCurrentView("details")
    loadEmployeeById(employeeId)
  }

  const handleEdit = (employeeId: string) => {
    setCurrentView("edit")
    loadEmployeeById(employeeId)
  }

  const handleCreate = () => {
    setCurrentView("create")
    setSelectedEmployee(null)
  }

  const handleBack = () => {
    setCurrentView("list")
    setSelectedEmployee(null)
    setError(null)
    // Refresh the list
    loadEmployees()
  }

  // const handleDelete = async (employee: Employee) => {
  //   if (!confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
  //     return
  //   }

  //   try {
  //     console.log("🗑️ Deleting employee:", employee.id)
  //     await deleteEmployeeApi(employee.id)
  //     console.log("✅ Employee deleted successfully")

  //     // Remove from local state
  //     setEmployees((prev) => prev.filter((emp) => emp.id !== employee.id))

  //     // Show success message (you can implement toast notifications)
  //     alert("Employee deleted successfully")
  //   } catch (err) {
  //     console.error("❌ Failed to delete employee:", err)
  //     alert("Failed to delete employee. Please try again.")
  //   }
  // }


  const handleDelete = async (employee: Employee) => {
  if (!confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
    return
  }

  try {
    console.log("🗑️ Deleting employee:", employee.id)
    await deleteEmployeeApi(employee.id)
    console.log("✅ Employee deleted successfully")

    // Remove from local state
    setEmployees((prev) => prev.filter((emp) => emp.id !== employee.id))

    alert("Employee deleted successfully")

    // If current view is details/edit, go back to list
    setCurrentView("list")
    setSelectedEmployee(null)
  } catch (err) {
    console.error("❌ Failed to delete employee:", err)
    alert("Failed to delete employee. Please try again.")
  }
}


  const handleCreateEmployee = async (employeeData: CreateEmployeeDto) => {
    try {
      console.log("➕ Creating employee:", employeeData)
      const newEmployee = await createEmployeeApi(employeeData)
      console.log("✅ Employee created successfully:", newEmployee)

      // Add to local state
      setEmployees((prev) => [...prev, newEmployee])

      // Close dialog and return to list
      setIsDialogOpen(false)
      setCurrentView("list")

      // Show success message
      alert("Employee created successfully")
    } catch (err) {
      console.error("❌ Failed to create employee:", err)
      throw err // Re-throw to let the form handle the error
    }
  }

  const handleUpdateEmployee = () => {
    // Refresh the employee data and return to details view
    if (selectedEmployee) {
      loadEmployeeById(selectedEmployee.id)
      setCurrentView("details")
    }
  }

  const handleCreateSuccess = () => {
    setCurrentView("list")
    loadEmployees()
  }

  const handleCreateCancel = () => {
    setCurrentView("list")
  }

  // Render loading state
  if (isLoading && currentView === "list") {
    return <EmployeeLoading />
  }

  // Render error state
  if (error && currentView === "list") {
    return <EmployeeError error={error} />
  }

  // Render different views
  switch (currentView) {
    case "details":
      if (!selectedEmployee) {
        return <EmployeeLoading />
      }
      return <EmployeeDetail employee={selectedEmployee} onBack={handleBack}  onDelete={() => handleDelete(selectedEmployee)} onEdit={() => setCurrentView("edit")} />

    case "edit":
      if (!selectedEmployee) {
        return <EmployeeLoading />
      }
      return <EmployeeEdit employee={selectedEmployee} onBack={handleBack} onUpdate={handleUpdateEmployee} />

    case "create":
      return (
        <div className="min-h-screen ">
       
           
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <EmployeeCreateForm onSuccess={handleCreateSuccess} onCancel={handleCreateCancel} showCard={false} />
            </div>
        
        </div>
      )

    default: // list view
      return (
        <div className="min-h-screen ">
          <div className="space-y-8">
            <EmployeeHeader />

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <EmployeeTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                employees={employees} // 🔁 all employees for count
  filteredEmployees={filteredEmployees}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            <EmployeeDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onSubmit={handleCreateEmployee}
              title="Create New Employee"
            />
          </div>
        </div>
      )
  }
}
