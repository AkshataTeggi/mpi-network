import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "@/lib/auth"
import { API_BASE_URL } from "@/lib/constants"

/**
 * Wrapper for fetch with automatic token injection and refresh handling.
 */
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAccessToken()

  // Use Headers object for type-safe header manipulation
  const headers = new Headers(options.headers ?? {})
  headers.set("Content-Type", "application/json")

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  // Make the request
  let res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  // If token expired and refresh token is available
  if (res.status === 401 && getRefreshToken()) {
    try {
      const refreshToken = getRefreshToken()!
      const { sub: userId } = JSON.parse(atob(refreshToken.split(".")[1]))

      // Try refreshing the access token
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, refreshToken }),
      })

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json()
        setTokens(refreshData.accessToken, refreshToken)

        // Retry original request with new token
        headers.set("Authorization", `Bearer ${refreshData.accessToken}`)
        res = await fetch(`${API_BASE_URL}${path}`, {
          ...options,
          headers,
        })
      } else {
        clearTokens()
        throw new Error("Session expired. Please login again.")
      }
    } catch (err) {
      clearTokens()
      throw new Error("Session expired. Please login again.")
    }
  }

  // Throw error if not ok
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "API error")
  }

  return res.json()
}
