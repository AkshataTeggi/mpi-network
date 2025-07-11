// app/dashboard/employees/create/page.tsx

// import { EmployeeService } from "@/components/employees/employee-service"

// export default function EmployeeCreatePage() {
//   return <EmployeeService initialView="create" />
// }




// app/dashboard/employees/page.tsx

"use client"

import { EmployeeService } from "@/components/employees/employee-service"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EmployeePage() {
  const router = useRouter()

  return (
    <div className=" space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-green-600">
          Create Employee
        </h1>
        <Button onClick={() => router.push("/dashboard/settings/employees")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back 
        </Button>
      </div>

      {/* Employee Service Component */}
      <EmployeeService initialView="create" />

    </div>
  )
}
