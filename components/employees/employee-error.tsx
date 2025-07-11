"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface EmployeeErrorProps {
  error: string
  onRetry?: () => void
}

export function EmployeeError({ error, onRetry }: EmployeeErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Employees</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage your organization's employees and their roles
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Employees</AlertTitle>
            <AlertDescription className="mt-2">
              {error}
              {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry} className="mt-3 ml-0 bg-transparent">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              )}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
