"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { Customer, UpdateCustomerDto } from "./types"
import { updateCustomer } from "./customer-api"

interface CustomerEditProps {
  customer: Customer
  onBack: () => void
  onUpdate: () => void
}

export function CustomerEdit({ customer, onBack, onUpdate }: CustomerEditProps) {
  const [form, setForm] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    county: customer.county,
    zipCode: customer.zipCode,
    state: customer.state,
    country: customer.country,
    website: customer.website,
    status: customer.status === "active",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      const dto: UpdateCustomerDto = {
        ...form,
        status: form.status ? "active" : "inactive",
      }

      await updateCustomer(customer.id, dto)
      setSuccess(true)
      onUpdate()

      setTimeout(() => {
        onBack()
      }, 1500)
    } catch (err) {
      console.error("Error updating customer:", err)
      setError("Failed to update customer. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Customer</h1>
        <Button onClick={onBack}>Cancel</Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
                <AlertDescription>Customer updated successfully!</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={(e) => handleChange("city", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="county">County</Label>
                <Input id="county" value={form.county} onChange={(e) => handleChange("county", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input id="zipCode" value={form.zipCode} onChange={(e) => handleChange("zipCode", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={form.state} onChange={(e) => handleChange("state", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={form.country} onChange={(e) => handleChange("country", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={form.website} onChange={(e) => handleChange("website", e.target.value)} />
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Switch id="status" checked={form.status} onCheckedChange={(val) => handleChange("status", val)} />
                <Label htmlFor="status">Active</Label>
              </div>
            </div>

            <Separator className="dark:bg-slate-700" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Created At</Label>
                <Input value={new Date(customer.createdAt).toLocaleString()} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Updated At</Label>
                <Input value={new Date(customer.updatedAt).toLocaleString()} disabled className="bg-muted" />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onBack}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
