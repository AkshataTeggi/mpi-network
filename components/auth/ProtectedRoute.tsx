
// components/ProtectedRoute.tsx -------------------------------------------
"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/components/context/AuthContext"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login")
  }, [isLoggedIn])

  return isLoggedIn ? <>{children}</> : null
}