"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { UserService } from "@/components/user/user-service"

export default function UserDetailPage() {
  const params = useParams()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof params.id === "string") {
      setUserId(params.id)
    }
  }, [params])

  if (!userId) return null // or a loading skeleton

  return <UserService initialView="details" userId={userId} />
}
