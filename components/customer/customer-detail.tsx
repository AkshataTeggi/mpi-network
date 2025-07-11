"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Edit } from "lucide-react"
import { Customer } from "./types"

interface CustomerDetailProps {
  customer: Customer
  onBack: () => void
  onEdit: () => void
}

export function CustomerDetail({ customer, onBack, onEdit }: CustomerDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onBack}>
            Back to Customers
          </Button>
          <Button onClick={onEdit}>
            <Edit className="mr-1 h-4 w-4" /> Edit Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>Detailed information about the selected customer.</CardDescription>
        </CardHeader>

        <CardContent className="mt-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium">ID</h4>
              <p className="text-sm text-muted-foreground font-mono break-all">{customer.id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Name</h4>
              <p className="text-sm text-muted-foreground">{customer.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Email</h4>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Phone</h4>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Address</h4>
              <p className="text-sm text-muted-foreground">{customer.address}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">City</h4>
              <p className="text-sm text-muted-foreground">{customer.city}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">County</h4>
              <p className="text-sm text-muted-foreground">{customer.county}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">State</h4>
              <p className="text-sm text-muted-foreground">{customer.state}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Country</h4>
              <p className="text-sm text-muted-foreground">{customer.country}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Zip Code</h4>
              <p className="text-sm text-muted-foreground">{customer.zipCode}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Website</h4>
              <p className="text-sm text-muted-foreground break-all">{customer.website}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Status</h4>
              <p
                className={`text-sm ${
                  customer.status === "active"
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {customer.status}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Created At</h4>
              <p className="text-sm text-muted-foreground">{new Date(customer.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Updated At</h4>
              <p className="text-sm text-muted-foreground">{new Date(customer.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
