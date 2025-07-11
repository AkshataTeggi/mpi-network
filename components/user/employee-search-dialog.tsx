"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Search, Loader2 } from "lucide-react"
import { fetchEmployees } from "../employees/employee-api"
import { Employee } from "../employees/types"

interface EmployeeSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectEmployee: (employee: Employee) => void
}

export function EmployeeSearchDialog({ open, onOpenChange, onSelectEmployee }: EmployeeSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      loadEmployees()
    }
  }, [open])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmployees(employees)
    } else {
      const filtered = employees.filter(
        (employee) =>
          employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredEmployees(filtered)
    }
  }, [searchTerm, employees])

  const loadEmployees = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchEmployees()
      setEmployees(data)
      setFilteredEmployees(data)
    } catch (err) {
      setError("Failed to load employees. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectEmployee = (employee: Employee) => {
    onSelectEmployee(employee)
    onOpenChange(false)
    setSearchTerm("")
  }

  const handleClose = () => {
    onOpenChange(false)
    setSearchTerm("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Search Employees</DialogTitle>
          <DialogDescription>Search and select an employee to create a user account for.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search by name, email, or ID</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Type to search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="border rounded-md max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading employees...</span>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                {searchTerm ? "No employees found matching your search." : "No employees available."}
              </div>
            ) : (
              <div className="divide-y">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="p-4 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleSelectEmployee(employee)}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Name:</span>
                            <h4 className="font-medium">
                              {employee.firstName} {employee.lastName}
                            </h4>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Email:</span>
                            <p className="text-sm text-muted-foreground">{employee.email}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Employee ID:</span>
                            <p className="text-xs text-muted-foreground font-mono">{employee.id}</p>
                          </div>
                          {employee.role && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground">Role:</span>
                              <p className="text-xs text-muted-foreground">{employee.role.name}</p>
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            employee.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                          }`}
                        >
                          {employee.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
