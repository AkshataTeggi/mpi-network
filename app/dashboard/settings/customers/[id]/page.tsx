"use client"

import { CustomerService } from "@/components/customer/customer-service"
import { useParams } from "next/navigation"

export default function CustomerViewPage() {
  const params = useParams()

  if (!params?.id || typeof params.id !== "string") return null

  return <CustomerService initialView="details" customerId={params.id} />
}
