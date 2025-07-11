import { API_BASE_URL } from "@/lib/constants"
import type { ChangeOrder, CreateChangeOrderDto, UpdateChangeOrderDto } from "./types"


export class ChangeOrderAPI {
  static async getAll(): Promise<ChangeOrder[]> {
    const response = await fetch(`${API_BASE_URL}/change-orders`)
    if (!response.ok) {
      throw new Error("Failed to fetch change orders")
    }
    return response.json()
  }

  static async getById(id: string): Promise<ChangeOrder> {
    const response = await fetch(`${API_BASE_URL}/change-orders/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch change order")
    }
    return response.json()
  }

  static async create(data: CreateChangeOrderDto): Promise<ChangeOrder> {
    const response = await fetch(`${API_BASE_URL}/change-orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to create change order")
    }
    return response.json()
  }

  static async update(id: string, data: UpdateChangeOrderDto): Promise<ChangeOrder> {
    const response = await fetch(`${API_BASE_URL}/change-orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to update change order")
    }
    return response.json()
  }

  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/change-orders/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete change order")
    }
  }

  static async getSectionTypes(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/change-orders/sections`)
    if (!response.ok) {
      throw new Error("Failed to fetch section types")
    }
    return response.json()
  }
}
