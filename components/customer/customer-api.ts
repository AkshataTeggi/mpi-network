import { API_BASE_URL } from "@/lib/constants"
import { CreateCustomerDto, Customer, UpdateCustomerDto } from "./types"


// Create customer
export async function createCustomer(data: CreateCustomerDto): Promise<Customer> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating customer:", error)
    throw error
  }
}

// Get all customers
export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
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
    console.error("Error fetching customers:", error)
    throw error
  }
}

// Get single customer
export async function fetchCustomer(id: string): Promise<Customer> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Customer not found")
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching customer:", error)
    throw error
  }
}

// Update customer
export async function updateCustomer(id: string, data: UpdateCustomerDto): Promise<Customer> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Customer not found")
      }
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating customer:", error)
    throw error
  }
}

// Delete customer
export async function deleteCustomer(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Customer not found")
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // DELETE might return empty response
    if (response.status !== 204) {
      await response.json()
    }
  } catch (error) {
    console.error("Error deleting customer:", error)
    throw error
  }
}
