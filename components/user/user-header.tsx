"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserHeader() {
  const router = useRouter()

  const handleAddUser = () => {
    router.push("/dashboard/settings/users/create")
  }

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Users</h1>
      <Button onClick={handleAddUser}>
        <Plus className="mr-2 h-4 w-4" /> Add User
      </Button>
    </div>
  )
}
