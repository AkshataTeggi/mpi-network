"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Save, ArrowLeft, Edit, Check, X } from "lucide-react"

interface ChangeOrderDetail {
  id?: string
  isRequired: boolean
  description: string
  replaceEarlier: boolean
  addRevision: boolean
  pullFromFiles: string
  changeOrderId?: string
}

interface ChangeOrderResponse {
  id?: string
  createdAt?: string
  updatedAt?: string
  changeorder_name: string
  mpiId: string | null
  detail: ChangeOrderDetail
}

interface ChangeOrderFormProps {
  changeOrder?: ChangeOrderResponse
  mpiId?: string
  onSave: (changeOrder: ChangeOrderResponse) => void
  onCancel: () => void
}

export function ChangeOrderForm({ changeOrder, mpiId, onSave, onCancel }: ChangeOrderFormProps) {
  const [changeOrderName, setChangeOrderName] = useState(changeOrder?.changeorder_name || "")
  const [existingOrders, setExistingOrders] = useState<ChangeOrderResponse[]>([])
  const [newDetails, setNewDetails] = useState<ChangeOrderDetail[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<ChangeOrderDetail | null>(null)

  const isEdit = !!changeOrder

  useEffect(() => {
    if (mpiId || changeOrder?.mpiId) {
      loadExistingOrders()
    }
  }, [mpiId, changeOrder])

  const loadExistingOrders = async () => {
    try {
      const targetMpiId = mpiId || changeOrder?.mpiId
      const url = `http://54.177.111.218:4000/change-orders?mpiId=${targetMpiId}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setExistingOrders(data)
      }
    } catch (err) {
      console.error("Failed to load existing orders:", err)
    }
  }

  const addNewDetail = () => {
    const newDetail: ChangeOrderDetail = {
      isRequired: false,
      description: "",
      replaceEarlier: false,
      addRevision: false,
      pullFromFiles: "",
    }
    setNewDetails([...newDetails, newDetail])
  }

  const removeNewDetail = (index: number) => {
    setNewDetails(newDetails.filter((_, i) => i !== index))
  }

  const updateNewDetail = (index: number, field: keyof ChangeOrderDetail, value: any) => {
    const updated = [...newDetails]
    updated[index] = { ...updated[index], [field]: value }
    setNewDetails(updated)
  }

  const handleEditExisting = (order: ChangeOrderResponse) => {
    setEditingId(order.id!)
    setEditingData({ ...order.detail })
  }

  const handleSaveExisting = async (orderId: string) => {
    if (!editingData) return

    try {
      const response = await fetch(`http://54.177.111.218:4000/change-orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          detail: editingData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update change order")
      }

      await loadExistingOrders()
      setEditingId(null)
      setEditingData(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update change order")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingData(null)
  }

  const updateEditingData = (field: keyof ChangeOrderDetail, value: any) => {
    if (editingData) {
      setEditingData({ ...editingData, [field]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newDetails.length === 0 && !isEdit) {
      setError("Please add at least one detail entry")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create new change orders for each new detail
      for (const detail of newDetails) {
        const data = {
          changeorder_name: changeOrderName,
          mpiId: mpiId || changeOrder?.mpiId || null,
          detail,
        }

        const response = await fetch("http://54.177.111.218:4000/change-orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to create change order")
        }
      }

      // Return success
      onSave({
        changeorder_name: changeOrderName,
        mpiId: mpiId || changeOrder?.mpiId || null,
        detail: newDetails[0] || changeOrder!.detail,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-red-600">{isEdit ? "Edit Change Order" : "Create Change Order"}</h1>
            <p className="text-muted-foreground mt-1">{mpiId && `For MPI: ${mpiId}`}</p>
          </div>
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Existing Change Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Change Orders</CardTitle>
              <CardDescription>
                {existingOrders.length > 0
                  ? "Edit existing change orders for this MPI"
                  : "No existing change orders found"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {existingOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {existingOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.changeorder_name}</TableCell>
                          <TableCell>
                            {editingId === order.id ? (
                              <Textarea
                                value={editingData?.description || ""}
                                onChange={(e) => updateEditingData("description", e.target.value)}
                                className="min-h-[60px]"
                              />
                            ) : (
                              <div className="max-w-[200px] truncate" title={order.detail.description}>
                                {order.detail.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === order.id ? (
                              <Checkbox
                                checked={editingData?.isRequired || false}
                                onCheckedChange={(checked) => updateEditingData("isRequired", checked)}
                              />
                            ) : (
                              <span>{order.detail.isRequired ? "Yes" : "No"}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === order.id ? (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSaveExisting(order.id!)}
                                  className="text-green-600"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button variant="outline" size="sm" onClick={() => handleEditExisting(order)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No existing change orders found for this MPI
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create New Change Order Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Create New Change Order</CardTitle>
                  <CardDescription>Add new change order details</CardDescription>
                </div>
                <Button type="button" onClick={addNewDetail} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Detail
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Change Order Name */}
                <div>
                  <Label htmlFor="changeOrderName">Change Order Name *</Label>
                  <Input
                    id="changeOrderName"
                    value={changeOrderName}
                    onChange={(e) => setChangeOrderName(e.target.value)}
                    placeholder="Enter change order name..."
                    required
                    className="mt-1"
                  />
                </div>

                {/* New Details Table */}
                {newDetails.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">New Details</Label>
                    <div className="mt-2 overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Required</TableHead>
                            <TableHead>Replace</TableHead>
                            <TableHead>Revision</TableHead>
                            <TableHead>Files</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {newDetails.map((detail, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Textarea
                                  value={detail.description}
                                  onChange={(e) => updateNewDetail(index, "description", e.target.value)}
                                  placeholder="Description..."
                                  className="min-h-[60px]"
                                />
                              </TableCell>
                              <TableCell>
                                <Checkbox
                                  checked={detail.isRequired}
                                  onCheckedChange={(checked) => updateNewDetail(index, "isRequired", checked)}
                                />
                              </TableCell>
                              <TableCell>
                                <Checkbox
                                  checked={detail.replaceEarlier}
                                  onCheckedChange={(checked) => updateNewDetail(index, "replaceEarlier", checked)}
                                />
                              </TableCell>
                              <TableCell>
                                <Checkbox
                                  checked={detail.addRevision}
                                  onCheckedChange={(checked) => updateNewDetail(index, "addRevision", checked)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={detail.pullFromFiles}
                                  onChange={(e) => updateNewDetail(index, "pullFromFiles", e.target.value)}
                                  placeholder="File path..."
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeNewDetail(index)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !changeOrderName.trim() || newDetails.length === 0}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Change Order
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
