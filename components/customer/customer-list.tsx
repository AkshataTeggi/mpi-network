"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Edit, Trash2 } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

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

interface CustomerListProps {
  customers: Customer[]
  onView: (customerId: string) => void
  onEdit: (customerId: string) => void
  onDelete: (customer: Customer) => void
}

export function CustomerList({ customers, onView, onEdit, onDelete }: CustomerListProps) {
  const isMobile = useIsMobile()

  if (customers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No customers found.</p>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="border-red-100 dark:border-red-900">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-red-600 dark:text-red-400">{customer.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID: {customer.id.slice(-8)}</p>
                </div>
                <Badge
                  variant={customer.status === "active" ? "default" : "secondary"}
                  className={
                    customer.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                  }
                >
                  {customer.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="font-medium w-16">Email:</span>
                  <span className="text-gray-600 dark:text-gray-300">{customer.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-16">Phone:</span>
                  <span className="text-gray-600 dark:text-gray-300">{customer.phone}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-16">Location:</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {customer.city}, {customer.state}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(customer.id)}
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(customer.id)}
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(customer)}
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-red-200 dark:border-red-800">
            <th className="text-left py-3 px-4 font-medium text-red-600 dark:text-red-400">Name</th>
            <th className="text-left py-3 px-4 font-medium text-red-600 dark:text-red-400">Email</th>
            <th className="text-left py-3 px-4 font-medium text-red-600 dark:text-red-400">Phone</th>
            <th className="text-left py-3 px-4 font-medium text-red-600 dark:text-red-400">Location</th>
            <th className="text-left py-3 px-4 font-medium text-red-600 dark:text-red-400">Status</th>
            <th className="text-left py-3 px-4 font-medium text-red-600 dark:text-red-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <td className="py-3 px-4">
                <div>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">ID: {customer.id.slice(-8)}</div>
                </div>
              </td>
              <td className="py-3 px-4 text-sm">{customer.email}</td>
              <td className="py-3 px-4 text-sm">{customer.phone}</td>
              <td className="py-3 px-4 text-sm">
                {customer.city}, {customer.state}
              </td>
              <td className="py-3 px-4">
                <Badge
                  variant={customer.status === "active" ? "default" : "secondary"}
                  className={
                    customer.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                  }
                >
                  {customer.status}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView(customer.id)}
                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(customer.id)}
                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(customer)}
                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
