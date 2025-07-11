"use client"

import { Button } from "@/components/ui/button"
import { Mail, UserCog, Calendar, User, AtSign, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { Customer } from "./types"

interface CustomerListMobileProps {
  customers: Customer[]
  onView: (customerId: string) => void
  onEdit: (customerId: string) => void
  onDelete: (customer: Customer) => void
}

export function CustomerListMobile({ customers, onView, onEdit, onDelete }: CustomerListMobileProps) {
  const router = useRouter()

  const handleViewClick = (customerId: string) => {
    router.push(`/dashboard/settings/customers/${customerId}`)
  }

  const handleEditClick = (customerId: string) => {
    router.push(`/dashboard/settings/customers/${customerId}/edit`)
  }

  if (customers.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
        <p className="text-muted-foreground">No customers found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => (
        <div
          key={customer.id}
          className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">
                {customer.firstName} {customer.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                customer.isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
              }`}
            >
              {customer.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              <span>{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-2 h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.user?.username && (
              <div className="flex items-center text-sm text-muted-foreground">
                <AtSign className="mr-2 h-4 w-4" />
                <span>{customer.user.username}</span>
              </div>
            )}
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Created: {new Date(customer.createdAt).toLocaleString()}</span>
            </div>
            {customer.createdBy && (
              <div className="flex items-center text-xs text-muted-foreground">
                <User className="mr-1 h-3 w-3" />
                <span>Created by: {customer.createdBy}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewClick(customer.id)}
              className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditClick(customer.id)}
              className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 bg-transparent"
              onClick={() => onDelete(customer)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
