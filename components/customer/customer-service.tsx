"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Plus, Search, Users, UserCheck, UserX } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { CustomerList } from "./customer-list"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  county: string
  zipCode: string
  state: string
  country: string
  website: string
  status: "active" | "inactive"
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}

// API functions based on your backend
const customerAPI = {
  async create(data: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<Customer> {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create customer")
    return response.json()
  },

  async findAll(): Promise<Customer[]> {
    const response = await fetch("/api/customers")
    if (!response.ok) throw new Error("Failed to fetch customers")
    return response.json()
  },

  async findOne(id: string): Promise<Customer> {
    const response = await fetch(`/api/customers/${id}`)
    if (!response.ok) {
      if (response.status === 404) throw new Error("Customer not found")
      throw new Error("Failed to fetch customer")
    }
    return response.json()
  },

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    const response = await fetch(`/api/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      if (response.status === 404) throw new Error("Customer not found")
      throw new Error("Failed to update customer")
    }
    return response.json()
  },

  async remove(id: string): Promise<void> {
    const response = await fetch(`/api/customers/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      if (response.status === 404) throw new Error("Customer not found")
      throw new Error("Failed to delete customer")
    }
  },
}

export function CustomerService() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Load customers on component mount
  useEffect(() => {
    loadCustomers()
  }, [])

  // Filter customers when search query or status filter changes
  useEffect(() => {
    filterCustomers()
  }, [customers, searchQuery, statusFilter])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const data = await customerAPI.findAll()
      setCustomers(data)
    } catch (error) {
      console.error("Error loading customers:", error)
      toast({
        title: "Error",
        description: "Failed to load customers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterCustomers = () => {
    let filtered = customers

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.includes(query) ||
          customer.city.toLowerCase().includes(query) ||
          customer.state.toLowerCase().includes(query),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((customer) => customer.status === statusFilter)
    }

    setFilteredCustomers(filtered)
  }

  const handleView = (customerId: string) => {
    // Navigate to customer detail page
    window.location.href = `/customer/${customerId}`
  }

  const handleEdit = (customerId: string) => {
    // Navigate to customer edit page
    window.location.href = `/customer/${customerId}/edit`
  }

  const handleCreate = () => {
    // Navigate to customer create page
    window.location.href = "/dashboard/settings//customers/create"
  }

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!customerToDelete) return

    try {
      setDeleting(true)
      await customerAPI.remove(customerToDelete.id)

      toast({
        title: "Success",
        description: "Customer deleted successfully",
      })

      // Refresh the customer list
      await loadCustomers()
      setDeleteDialogOpen(false)
      setCustomerToDelete(null)
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete customer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  // Calculate statistics
  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    inactive: customers.filter((c) => c.status === "inactive").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Customer Management</h1>
        <Button
          onClick={handleCreate}
          className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

     
      {/* Customer List */}
      <Card className="border-red-200 dark:border-red-800">
       
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading customers...</span>
            </div>
          ) : (
            <CustomerList
              customers={filteredCustomers}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{customerToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Customer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
