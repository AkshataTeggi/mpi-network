"use client"

import { useParams } from "next/navigation"
import { MPIService } from "@/components/mpi/mpi-service"

export default function MPIDetailsPage() {
  const params = useParams()

  return <MPIService initialView="details" mpiId={params.id as string} />
}
