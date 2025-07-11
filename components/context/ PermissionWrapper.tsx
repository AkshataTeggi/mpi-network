import React from "react"
import { usePermissions } from "./PermissionContext"

interface PermissionWrapperProps {
  requiredPermissions: string[] // permissions needed to show content
  children: React.ReactNode
}

export default function PermissionWrapper({ requiredPermissions, children }: PermissionWrapperProps) {
  const { permissions } = usePermissions()

  // Check if user has at least one of the required permissions
  const hasPermission = requiredPermissions.some((perm) => permissions.includes(perm.toLowerCase()))

  if (!hasPermission) {
    // Optionally render null or a fallback UI here
    return null
  }

  return <>{children}</>
}
