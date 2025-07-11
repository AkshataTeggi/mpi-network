"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { User } from "./types"

interface UserListProps {
  users: User[]
  onView: (userId: string) => void
  onEdit: (userId: string) => void
  onDelete: (user: User) => void
}

export function UserList({ users, onView, onEdit, onDelete }: UserListProps) {
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
    <div className="rounded-md border dark:border-slate-700">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b dark:[&_tr]:border-slate-700">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-slate-700">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Username</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Employee ID</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-slate-700"
              >
                <td className="p-4 align-middle">@{user.username}</td>
                <td className="p-4 align-middle">{user.email}</td>
                <td className="p-4 align-middle font-mono text-sm">{user.employeeId}</td>
                <td className="p-4 align-middle">
                  <span
                    className={
                      user.status === "active"
                        ? "text-green-600 dark:text-green-400"
                        : user.status === "pending"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-gray-500 dark:text-gray-400"
                    }
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewClick(user.id)}>
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(user.id)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-transparent"
                      onClick={() => onDelete(user)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
