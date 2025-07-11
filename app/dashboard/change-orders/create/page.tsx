"use client"

import { useSearchParams } from "next/navigation"
import { ChangeOrderService } from "@/components/change-orders/change-order-service"

export default function CreateChangeOrderPage() {
  const searchParams = useSearchParams()
  const mpiId = searchParams.get("mpiId") || undefined

  return <ChangeOrderService mpiId={mpiId} initialView="create" />
}
