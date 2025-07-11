"use client"

import { Button } from "@/components/ui/button"
import { Mail, Phone, Calendar, Hash, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"

// Define or import UserType before using it
// Example definition (replace with your actual UserType if different)
export interface UserType {
  id: string
  name: string
  username: string
  status: string
  employeeId: string
  roleId: string
  email: string
  phone: string
  createdAt: string | Date
  updatedAt: string | Date
}

interface UserListMobileProps {
  users: UserType[]
  onView: (userId: string) => void
  onEdit: (userId: string) => void
  onDelete: (user: UserType) => void
}

export function UserListMobile({ users, onView, onEdit, onDelete }: UserListMobileProps) {
  const router = useRouter()

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
        <p className="text-muted-foreground">No users found</p>
      </div>
    )
  }

  const handleViewClick = (userId: string) => {
    router.push(`/dashboard/settings/users/${userId}`)
  }

  const handleEditClick = (userId: string) => {
    router.push(`/dashboard/settings/users/${userId}/edit`)
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="rounded-lg border p-4 dark:border-slate-700 bg-card">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
            <span
              className={`text-sm ${user.status === "active" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
            >
              {user.status}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="mr-2 h-4 w-4" />
              <span className="font-mono text-xs">Employee ID: {user.employeeId}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Hash className="mr-2 h-4 w-4" />
              <span className="font-mono text-xs">Role ID: {user.roleId}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="mr-2 h-4 w-4" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-3">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Created: {new Date(user.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Updated: {new Date(user.updatedAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleViewClick(user.id)}>
              View
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEditClick(user.id)}>
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              onClick={() => onDelete(user)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
