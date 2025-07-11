"use client"

import { useState } from "react"
import { ChangeOrderList } from "./change-order-list"
import { ChangeOrderForm } from "./change-order-form"
import type { ChangeOrder } from "./types"

interface ChangeOrderServiceProps {
  mpiId?: string
  initialView?: "list" | "create" | "edit"
  changeOrderId?: string
}

export function ChangeOrderService({ mpiId, initialView = "list", changeOrderId }: ChangeOrderServiceProps) {
  const [currentView, setCurrentView] = useState<"list" | "create" | "edit">(initialView)
  const [selectedChangeOrder, setSelectedChangeOrder] = useState<ChangeOrder | null>(null)

  const handleCreateNew = () => {
    setSelectedChangeOrder(null)
    setCurrentView("create")
  }

  const handleEdit = (changeOrder: ChangeOrder) => {
    setSelectedChangeOrder(changeOrder)
    setCurrentView("edit")
  }

  const handleSave = (changeOrder: ChangeOrder) => {
    setCurrentView("list")
    setSelectedChangeOrder(null)
  }

  const handleCancel = () => {
    setCurrentView("list")
    setSelectedChangeOrder(null)
  }

  if (currentView === "create") {
    return <ChangeOrderForm mpiId={mpiId} onSave={handleSave} onCancel={handleCancel} />
  }

  if (currentView === "edit" && selectedChangeOrder) {
    return <ChangeOrderForm changeOrder={selectedChangeOrder} onSave={handleSave} onCancel={handleCancel} />
  }

  return <ChangeOrderList mpiId={mpiId} onCreateNew={handleCreateNew} onEdit={handleEdit} />
}
