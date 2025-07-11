"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface MPIFormHeaderProps {
  onCancel: () => void
}

export function MPIFormHeader({ onCancel }: MPIFormHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <h1 className="text-3xl font-bold text-green-600">Create MPI</h1>
      </div>
      <Button  size="sm" onClick={onCancel}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
    </div>
  )
}
