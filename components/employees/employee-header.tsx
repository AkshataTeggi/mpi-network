"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function EmployeeHeader() {
  const router = useRouter()

  const handleAddEmployee = () => {
    router.push("/dashboard/settings/employees/create")
  }

  return (
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-green-600">Employee Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/dashboard/settings")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleAddEmployee}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4" />
            Create
          </Button>
        </div>
      </div>
  )
}
