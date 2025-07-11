"use client"

import { use } from "react"
import { ChangeOrderService } from "@/components/change-orders/change-order-service"

interface EditChangeOrderPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditChangeOrderPage({ params }: EditChangeOrderPageProps) {
  const { id } = use(params)

  return <ChangeOrderService changeOrderId={id} initialView="edit" />
}
