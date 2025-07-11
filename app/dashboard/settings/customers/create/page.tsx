"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CustomerService } from "@/components/customer/customer-service"

export default function CustomerCreatePage() {
  const router = useRouter()

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Create Customer
        </h1>
        <Button onClick={() => router.push("/dashboard/customers")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Customer Service Component */}
      <CustomerService initialView="create" />
    </div>
  )
}
