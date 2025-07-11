"use client"

import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { User, CreateUserDto } from "./types"
import { fetchUsers, fetchUserById, createUser as createUserApi, deleteUser as deleteUserApi } from "./user-api"

// Import all existing components
import { UserHeader } from "./user-header"
import { UserTabs } from "./user-tabs"
import { UserLoading } from "./user-loading"
import { UserError } from "./user-error"
import { UserDetail } from "./user-detail"
import { UserEdit } from "./user-edit"
import { UserCreateForm } from "./user-create-form"
import { UserDialog } from "./user-dialog"

type ViewType = "list" | "details" | "edit" | "create"

interface UserServiceProps {
  initialView?: ViewType
  userId?: string
}

export function UserService({ initialView = "list", userId }: UserServiceProps) {
  // State management
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>(initialView)
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Responsive design
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  // Load specific user if userId is provided
  useEffect(() => {
    if (userId && (currentView === "details" || currentView === "edit")) {
      loadUserById(userId)
    }
  }, [userId, currentView])

  // Filter users based on active tab
  useEffect(() => {
    filterUsers()
  }, [users, activeTab])

  const loadUsers = async () => {
    try {
      console.log("🔍 Loading users...")
      setIsLoading(true)
      setError(null)
      const data = await fetchUsers()
      console.log("✅ Users loaded successfully:", data.length)
      setUsers(data)
    } catch (err) {
      console.error("❌ Failed to load users:", err)
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserById = async (id: string) => {
    try {
      console.log("🔍 Loading user:", id)
      setIsLoading(true)
      setError(null)
      const user = await fetchUserById(id)
      console.log("✅ User loaded successfully:", user)
      setSelectedUser(user)
    } catch (err) {
      console.error("❌ Failed to load user:", err)
      setError(err instanceof Error ? err.message : "Failed to load user")
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    switch (activeTab) {
      case "active":
        filtered = users.filter((user) => user.status === "active")
        break
      case "inactive":
        filtered = users.filter((user) => user.status !== "active")
        break
      case "pending":
        filtered = users.filter((user) => user.status === "pending")
        break
      default:
        filtered = users
    }

    setFilteredUsers(filtered)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleView = (userId: string) => {
    setCurrentView("details")
    loadUserById(userId)
  }

  const handleEdit = (userId: string) => {
    setCurrentView("edit")
    loadUserById(userId)
  }

  const handleCreate = () => {
    setCurrentView("create")
    setSelectedUser(null)
  }

  const handleBack = () => {
    setCurrentView("list")
    setSelectedUser(null)
    setError(null)
    // Refresh the list
    loadUsers()
  }

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete user ${user.name} (@${user.username})?`)) {
      return
    }

    try {
      console.log("🗑️ Deleting user:", user.id)
      await deleteUserApi(user.id)
      console.log("✅ User deleted successfully")

      // Remove from local state
      setUsers((prev) => prev.filter((u) => u.id !== user.id))

      // Show success message (you can implement toast notifications)
      alert("User deleted successfully")
    } catch (err) {
      console.error("❌ Failed to delete user:", err)
      alert("Failed to delete user. Please try again.")
    }
  }

  const handleCreateUser = async (userData: CreateUserDto) => {
    try {
      console.log("➕ Creating user:", userData)
      const newUser = await createUserApi(userData)
      console.log("✅ User created successfully:", newUser)

      // Add to local state
      setUsers((prev) => [...prev, newUser])

      // Close dialog and return to list
      setIsDialogOpen(false)
      setCurrentView("list")

      // Show success message
      alert("User created successfully")
    } catch (err) {
      console.error("❌ Failed to create user:", err)
      throw err // Re-throw to let the form handle the error
    }
  }

  const handleUpdateUser = () => {
    // Refresh the user data and return to details view
    if (selectedUser) {
      loadUserById(selectedUser.id)
      setCurrentView("details")
    }
  }

  const handleCreateSuccess = () => {
    setCurrentView("list")
    loadUsers()
  }

  const handleCreateCancel = () => {
    setCurrentView("list")
  }

  // Render loading state
  if (isLoading && currentView === "list") {
    return <UserLoading />
  }

  // Render error state
  if (error && currentView === "list") {
    return <UserError error={error} />
  }

  // Render different views
  switch (currentView) {
    case "details":
      if (!selectedUser) {
        return <UserLoading />
      }
      return <UserDetail user={selectedUser} onBack={handleBack} onEdit={() => setCurrentView("edit")} />

    case "edit":
      if (!selectedUser) {
        return <UserLoading />
      }
      return <UserEdit user={selectedUser} onBack={handleBack} onUpdate={handleUpdateUser} />

    case "create":
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Create User</h1>
          </div>
          <UserCreateForm onSuccess={handleCreateSuccess} onCancel={handleCreateCancel} showCard={true} />
        </div>
      )

    default: // list view
      return (
        <div className="min-h-screen ">
          <div className="space-y-8">
            <UserHeader />

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <UserTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                users={filteredUsers}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            <UserDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onSubmit={handleCreateUser}
              title="Create New User"
            />
          </div>
        </div>
      )
  }
}
