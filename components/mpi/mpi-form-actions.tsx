"use client"

import { Button } from "@/components/ui/button"

interface MPIFormActionsProps {
  isLoading: boolean
  isFormValid: boolean
  onCancel: () => void
}

export function MPIFormActions({ isLoading, isFormValid, onCancel }: MPIFormActionsProps) {
  return (
    <div className="flex justify-end gap-4">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading || !isFormValid}>
        {isLoading ? (
          <div className="flex items-center gap-2 animate-pulse">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            <span>Saving...</span>
          </div>
        ) : (
          <>Create MPI</>
        )}
      </Button>
    </div>
  )
}
