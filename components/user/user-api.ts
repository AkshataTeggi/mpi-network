import { API_BASE_URL } from "@/lib/constants"
import { CreateUserDto, User, UpdateUserDto } from "./types"

// API configuration
const API_ENDPOINTS = {
  users: "/users",
  userByEmail: "/users/by-email",
}

/**
 * Helper function to handle API errors consistently
 */
function handleApiError(error: unknown, operation: string): never {
  console.error(`${operation} error:`, error)

  if (error instanceof Error) {
    throw new Error(`${operation} failed: ${error.message}`)
  }

  throw new Error(`${operation} failed: Unknown error`)
}

/**
 * Creates a new user
 */
export async function createUser(user: CreateUserDto): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, "Create user")
  }
}

/**
 * Fetches all users from the API
 */
export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, "Fetch users")
  }
}

/**
 * Fetches a user by email using query parameter
 */
export async function fetchUserByEmail(email: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.userByEmail}?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found")
      }
      if (response.status === 400) {
        throw new Error("Email parameter is required")
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, `Fetch user by email ${email}`)
  }
}

/**
 * Fetches a single user by ID
 */
export async function fetchUserById(id: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found")
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, `Fetch user ${id}`)
  }
}

/**
 * Updates an existing user using PUT method
 */
export async function updateUser(id: string, user: UpdateUserDto): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found")
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    handleApiError(error, `Update user ${id}`)
  }
}

/**
 * Deletes a user
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found")
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Handle successful deletion (may return 200 with data or 204 with no content)
    if (response.status !== 204 && response.headers.get("content-length") !== "0") {
      await response.json()
    }
  } catch (error) {
    handleApiError(error, `Delete user ${id}`)
  }
}
