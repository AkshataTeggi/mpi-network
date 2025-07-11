import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

type PermissionContextType = {
  designation: string
  permissions: string[]
  setDesignation: (d: string) => void
  setPermissions: (p: string[]) => void
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

export function PermissionProvider({ children }: { children: ReactNode }) {
  const [designation, setDesignation] = useState("")
  const [permissions, setPermissions] = useState<string[]>([])

  useEffect(() => {
    const storedDesignation = localStorage.getItem("designation") || ""
    const storedPermissions = JSON.parse(localStorage.getItem("menus") || "[]")
    setDesignation(storedDesignation)
    setPermissions(storedPermissions)
  }, [])

  return (
    <PermissionContext.Provider
      value={{ designation, permissions, setDesignation, setPermissions }}
    >
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionContext)
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider")
  }
  return context
}
