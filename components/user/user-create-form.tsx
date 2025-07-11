"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Search, CheckCircle, X, AlertTriangle } from "lucide-react"
import { EmployeeSearchDialog } from "@/components/user/employee-search-dialog"
import { Employee } from "../employees/types"
import { CreateUserDto } from "./types"
import { fetchUserByEmail, createUser } from "./user-api"

interface UserCreateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  showCard?: boolean
}

// Popup notification component
interface PopupNotificationProps {
  message: string
  type: "success" | "error" | "warning"
  onClose: () => void
}

function PopupNotification({ message, type, onClose }: PopupNotificationProps) {
  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
  }[type]

  const icon = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
  }[type]

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div
        className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px] max-w-[400px]`}
      >
        {icon}
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Helper function to check if employee has existing user account
const hasExistingUserAccount = (employee: Employee | null): boolean => {
  return employee?.user !== null && employee?.user !== undefined
}

export function UserCreateForm({ onSuccess, onCancel, showCard = true }: UserCreateFormProps) {
  // Auto-filled fields from employee
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [roleId, setRoleId] = useState("")
  const [roleName, setRoleName] = useState("")

  // Manual entry fields
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [status, setStatus] = useState("active")

  // Component state
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isEmployeeSearchOpen, setIsEmployeeSearchOpen] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailConflict, setEmailConflict] = useState(false)

  // Popup notification state
  const [popup, setPopup] = useState<{
    show: boolean
    message: string
    type: "success" | "error" | "warning"
  }>({
    show: false,
    message: "",
    type: "success",
  })

  const showPopup = (message: string, type: "success" | "error" | "warning") => {
    setPopup({ show: true, message, type })
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setPopup((prev) => ({ ...prev, show: false }))
    }, 5000)
  }

  const hidePopup = () => {
    setPopup((prev) => ({ ...prev, show: false }))
  }

  const checkEmailAvailability = async (email: string) => {
    if (!email) return

    setIsCheckingEmail(true)
    setEmailConflict(false)

    try {
      await fetchUserByEmail(email)
      // If we get here, user exists
      setEmailConflict(true)
      // Remove the error setting and let the warning display handle it
      setError(null)
    } catch (err) {
      // If user not found, that's good - email is available
      if (err instanceof Error && err.message.includes("User not found")) {
        setEmailConflict(false)
        setError(null)
      } else {
        console.error("Error checking email:", err)
      }
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee)

    // Auto-fill all employee information
    setEmployeeId(employee.id)
    setName(`${employee.firstName} ${employee.lastName}`)
    setEmail(employee.email)

    // Auto-fill role information if available
    if (employee.role) {
      setRoleId(employee.role.id)
      setRoleName(employee.role.name)
    } else {
      setRoleId(employee.roleId)
      setRoleName("Role information not available")
    }

    // Check if employee already has a user account
    const hasExistingUser = employee.user !== null && employee.user !== undefined

    if (hasExistingUser) {
      // Employee already has a user account
      setEmailConflict(true)
      setError(null)
      showPopup("This employee already has a user account. Please select a different employee.", "warning")
    } else {
      // Check if email is already in use by another user
      checkEmailAvailability(employee.email)
    }

    // Clear manual entry fields for fresh input
    setUsername("")
    setPassword("")
    setPhone("")
    setStatus("active")
  }

  const resetForm = () => {
    // Auto-filled fields
    setName("")
    setEmail("")
    setEmployeeId("")
    setRoleId("")
    setRoleName("")

    // Manual entry fields
    setUsername("")
    setPassword("")
    setPhone("")
    setStatus("active")

    // Component state
    setSelectedEmployee(null)
    setError(null)
    setSuccess(false)
    setEmailConflict(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    // Don't submit if there's an email conflict
    if (emailConflict) {
      showPopup(
        "A user account already exists with this email address. This employee may already have a user account.",
        "warning",
      )
      setIsSubmitting(false)
      return
    }

    try {
      const userData: CreateUserDto = {
        employeeId,
        username,
        password,
        phone,
        status,
        name: "",
        email: "",
        roleId: "",
      }

      await createUser(userData)
      setSuccess(true)
      showPopup("✅ User account created successfully!", "success")
      resetForm()

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (err) {
      console.error("Error creating user:", err)

      if (err instanceof Error) {
        if (err.message.includes("username") && err.message.includes("already exists")) {
          // Show popup for username conflict instead of error display
          showPopup("This username is already taken. Please choose a different username.", "warning")
        } else if (err.message.includes("email") && err.message.includes("already exists")) {
          showPopup(
            "A user account already exists with this email address. This employee may already have a user account.",
            "warning",
          )
        } else {
          setError(err.message)
        }
      } else {
        setError("Failed to create user. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    if (onCancel) {
      onCancel()
    }
  }

  const formContent = (
    <>
      {/* Popup Notification */}
      {popup.show && <PopupNotification message={popup.message} type={popup.type} onClose={hidePopup} />}

      {/* Only show error for non-username and non-email related errors */}
      {error && !error.includes("username") && !error.includes("email") && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>✅ User created successfully!</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employee Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Employee Selection</h3>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEmployeeSearchOpen(true)}
              disabled={isSubmitting || success}
              className="flex-1"
            >
              <Search className="mr-2 h-4 w-4" />
              {selectedEmployee ? "Change Employee" : "Search Employee"}
            </Button>
          </div>
        </div>

        {/* Auto-filled Employee Information */}
        {selectedEmployee && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Employee Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Employee ID */}
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" value={employeeId} disabled className="bg-muted" />
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} disabled className="bg-muted" />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input id="email" type="email" value={email} disabled className="bg-muted" />
                  {isCheckingEmail && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={roleName} disabled className="bg-muted" />
              </div>
            </div>
          </div>
        )}

        {/* Manual Entry Fields */}
        {selectedEmployee && !emailConflict && !hasExistingUserAccount(selectedEmployee) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="john_doe"
                  required
                  disabled={isSubmitting || success}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting || success}
                />
                <p className="text-xs text-muted-foreground">Enter a secure password</p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91-9876543210"
                  required
                  disabled={isSubmitting || success}
                />
                <p className="text-xs text-muted-foreground">Enter mobile number</p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={status} onValueChange={setStatus} disabled={isSubmitting || success}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Select user account status</p>
              </div>
            </div>
          </div>
        )}

        {/* Show warning if employee already has user account */}
        {selectedEmployee && hasExistingUserAccount(selectedEmployee) && (
          <div className="space-y-4">
            <Alert className="border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This employee already has a user account. Please select a different employee.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !employeeId ||
              !username ||
              !password ||
              !phone ||
              success ||
              emailConflict ||
              isCheckingEmail ||
              hasExistingUserAccount(selectedEmployee)
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : isCheckingEmail ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : hasExistingUserAccount(selectedEmployee) ? (
              "Employee Already Has Account"
            ) : (
              "Create User"
            )}
          </Button>
        </div>
      </form>

      <EmployeeSearchDialog
        open={isEmployeeSearchOpen}
        onOpenChange={setIsEmployeeSearchOpen}
        onSelectEmployee={handleEmployeeSelect}
      />
    </>
  )

  if (showCard) {
    return (
      <Card>
        <CardContent className="mt-5">{formContent}</CardContent>
      </Card>
    )
  }

  return <div className="space-y-4">{formContent}</div>
}
