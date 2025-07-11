"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, RefreshCw } from "lucide-react"

interface ChangeOrderDetail {
  id: string
  isRequired: boolean
  description: string
  replaceEarlier: boolean
  addRevision: boolean
  pullFromFiles: string
  changeOrderId: string
}

interface ChangeOrderResponse {
  id: string
  createdAt: string
  updatedAt: string
  changeorder_name: string
  mpiId: string | null
  detail: ChangeOrderDetail
}

interface ChangeOrderListProps {
  mpiId?: string
  onCreateNew: () => void
  onEdit: (changeOrder: ChangeOrderResponse) => void
}

export function ChangeOrderList({ mpiId, onCreateNew, onEdit }: ChangeOrderListProps) {
  const [changeOrders, setChangeOrders] = useState<ChangeOrderResponse[]>([])
  const [filteredOrders, setFilteredOrders] = useState<ChangeOrderResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadChangeOrders()
  }, [mpiId])

  useEffect(() => {
    filterOrders()
  }, [changeOrders, searchTerm])

  const loadChangeOrders = async () => {
    try {
      setIsLoading(true)
      const url = mpiId
        ? `http://54.177.111.218:4000/change-orders?mpiId=${mpiId}`
        : "http://54.177.111.218:4000/change-orders"

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch change orders")
      }
      const data = await response.json()
      setChangeOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load change orders")
    } finally {
      setIsLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = changeOrders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.changeorder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.detail.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort by newest first
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })

    setFilteredOrders(filtered)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this change order?")) return

    try {
      const response = await fetch(`http://54.177.111.218:4000/change-orders/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete change order")
      }

      await loadChangeOrders()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete change order")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-red-600">Change Orders</h1>
          <p className="text-muted-foreground mt-1">
            {mpiId ? `Change orders for MPI: ${mpiId}` : "All change orders"}
          </p>
        </div>
        <Button onClick={onCreateNew} className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Change Order
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search change orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Change Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Change Orders Found</h3>
              <p className="text-gray-500 mb-4">
                {mpiId
                  ? "No change orders have been created for this MPI yet."
                  : searchTerm
                    ? "No change orders match your search criteria."
                    : "No change orders have been created yet."}
              </p>
              <Button onClick={onCreateNew} className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Create First Change Order
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{order.changeorder_name}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>ID: {order.id}</span>
                      <span>Created: {formatDate(order.createdAt)}</span>
                      {order.updatedAt !== order.createdAt && <span>Updated: {formatDate(order.updatedAt)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={order.detail.isRequired ? "destructive" : "secondary"}>
                      {order.detail.isRequired ? "Required" : "Optional"}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => onEdit(order)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(order.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Description:</h4>
                    <p className="text-sm text-gray-600">{order.detail.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Replace Earlier:</span>
                      <Badge variant={order.detail.replaceEarlier ? "default" : "secondary"}>
                        {order.detail.replaceEarlier ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Add Revision:</span>
                      <Badge variant={order.detail.addRevision ? "default" : "secondary"}>
                        {order.detail.addRevision ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>

                  {order.detail.pullFromFiles && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Pull From Files:</h4>
                      <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                        {order.detail.pullFromFiles}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
