
// components/context/AuthContext.tsx --------------------------------------
"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { getAccessToken, clearAuth } from "@/utils/auth"

type Ctx = {
  isLoggedIn: boolean
  role: string
  menus: string[]
  username: string
  logout: () => void
}

const AuthContext = createContext<Ctx | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState("")
  const [menus, setMenus] = useState<string[]>([])
  const [username, setUsername] = useState("")

  useEffect(() => {
    if (getAccessToken()) {
      setIsLoggedIn(true)
      setRole(localStorage.getItem("role") || "")
      setMenus(JSON.parse(localStorage.getItem("menus") || "[]"))
      setUsername(localStorage.getItem("username") || "")
    }
  }, [])

  const logout = () => {
    clearAuth()
    setIsLoggedIn(false)
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, menus, username, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}