"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { User } from "./types"

interface UserDetailProps {
  user: User
  onBack: () => void
  onEdit: () => void
}

export function UserDetail({ user, onBack, onEdit }: UserDetailProps) {
  const router = useRouter()

  const handleBack = () => {
    // Navigate back to user list with refresh parameter
    router.push("/dashboard/settings/users?refresh=true")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleBack}>
            Back to Users
          </Button>
          <Button onClick={onEdit}>
            <Edit className="mr-1 h-4 w-4" /> Edit User
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6 mt-5">
          {/* User Information */}
          <div className="space-y-4">
                 <h3 className="text-lg font-semibold">User Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium">User ID</h4>
                <p className="text-sm text-muted-foreground font-mono break-all">{user.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Name</h4>
                <p className="text-sm text-muted-foreground">{user.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Username</h4>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Employee ID</h4>
                <p className="text-sm text-muted-foreground font-mono">{user.employeeId}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Email</h4>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Phone</h4>
                <p className="text-sm text-muted-foreground">{user.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <p className="text-sm text-muted-foreground capitalize">{user.status}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Role ID</h4>
                <p className="text-sm text-muted-foreground font-mono">{user.roleId}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Created At</h4>
                <p className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Updated At</h4>
                <p className="text-sm text-muted-foreground">{new Date(user.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Separator className="dark:bg-slate-700" />

          {/* Role Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Role Information</h3>
            {user.role ? (
              <div className="space-y-4">
                {/* Role fields in grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Role ID</h4>
                    <p className="text-sm text-muted-foreground font-mono break-all">{user.role.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Role Name</h4>
                    <p className="text-sm text-muted-foreground">{user.role.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Department ID</h4>
                    <p className="text-sm text-muted-foreground font-mono">{user.role.departmentId}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Is Active</h4>
                    <p
                      className={`text-sm ${user.role.isActive ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      {user.role.isActive ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Role Created At</h4>
                    <p className="text-sm text-muted-foreground">{new Date(user.role.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Role Updated At</h4>
                    <p className="text-sm text-muted-foreground">{new Date(user.role.updatedAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Description in single row */}
                <div>
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{user.role.description}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
                <p className="text-muted-foreground">No role information available</p>
              </div>
            )}
          </div>

          {user.department && (
            <>
              <Separator className="dark:bg-slate-700" />

              {/* Department Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Department Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Department ID</h4>
                    <p className="text-sm text-muted-foreground font-mono">{user.department.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Department Name</h4>
                    <p className="text-sm text-muted-foreground">{user.department.name}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
