"use client"

import { AlertCircle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

interface CustomerErrorProps {
  error: string
  onRetry?: () => void
}

export function CustomerError({ error, onRetry }: CustomerErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 max-w-md">{error}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}
