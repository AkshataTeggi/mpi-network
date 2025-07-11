"use client"

import { useParams } from "next/navigation"
import { MPIService } from "@/components/mpi/mpi-service"

export default function EditMPIPage() {
  const params = useParams()

  return <MPIService initialView="edit" mpiId={params.id as string} />
}
