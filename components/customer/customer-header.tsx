"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function CustomerHeader() {
  const router = useRouter()

  const handleAddCustomer = () => {
    router.push("/dashboard/settings/customers/create")
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-2xl font-bold text-red-600">Customer Management</h1>
      <div className="flex gap-2">
        <Button
          onClick={() => router.push("/dashboard/settings")}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleAddCustomer}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Create
        </Button>
      </div>
    </div>
  )
}
