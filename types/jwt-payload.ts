export interface JwtPayload {
  userId: string
  role: string
  permissions?: string[]
  exp: number
  iat: number
}
