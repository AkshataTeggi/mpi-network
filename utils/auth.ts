// utils/auth.ts ------------------------------------------------------------
export const saveAuth = (data: {
  accessToken: string
  refreshToken: string
  role: string
  menus: string[]
  username: string
}) => {
  localStorage.setItem("access_token", data.accessToken)
  localStorage.setItem("refresh_token", data.refreshToken)
  localStorage.setItem("role", data.role.toLowerCase())
  localStorage.setItem("menus", JSON.stringify(data.menus))
  localStorage.setItem("username", data.username)
}

export const getAccessToken = () => localStorage.getItem("access_token")
export const clearAuth = () => localStorage.clear()