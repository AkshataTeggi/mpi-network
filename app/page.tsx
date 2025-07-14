


"use client"

import { useState, useEffect } from "react"
import LoginForm from "@/components/login-form"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [permissions, setPermissions] = useState<string[]>([])

  useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions")
    const token = localStorage.getItem("access_token")

    if (token && storedPermissions) {
      setIsLoggedIn(true)
      setPermissions(JSON.parse(storedPermissions))
    }
  }, [])

  const handleLogin = (user: any, perms: string[]) => {
    setUsername(user?.email || "User")
    setPermissions(perms)

    // Store permissions to localStorage
    localStorage.setItem("permissions", JSON.stringify(perms))

    setIsLoggedIn(true)

    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername("")
    localStorage.clear()
    window.location.href = "/"
  }

  return <LoginForm onLogin={handleLogin} />
}
