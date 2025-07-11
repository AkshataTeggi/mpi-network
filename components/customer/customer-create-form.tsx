"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Loader2, Save } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { createCustomer } from "./customer-api"
import { CreateCustomerDto } from "./types"

interface CustomerCreateProps {
  onBack: () => void
  onSuccess: () => void
}

export function CustomerCreate({ onBack, onSuccess }: CustomerCreateProps) {
  const [formData, setFormData] = useState<CreateCustomerDto>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    county: "",
    zipCode: "",
    state: "",
    country: "USA",
    website: "",
    status: "active",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof CreateCustomerDto, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await createCustomer(formData)

      toast({
        title: "Success",
        description: "Customer created successfully",
      })

      onSuccess()
    } catch (err) {
      console.error("Error creating customer:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to create customer. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Create New Customer</h1>
        <Button
          variant="outline"
          onClick={onBack}
          className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 bg-transparent"
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-red-50 dark:bg-red-950/20">
            <TabsTrigger value="basic" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Basic Information
            </TabsTrigger>
            <TabsTrigger value="address" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Address Information
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="border-b border-red-200 dark:border-red-800">
                <CardTitle className="text-red-600 dark:text-red-400">Basic Information</CardTitle>
                <CardDescription>Enter the customer's basic details</CardDescription>
              </CardHeader>
              <CardContent className="mt-6 space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-red-600 dark:text-red-400">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Customer name"
                      required
                      disabled={isSubmitting}
                      className="border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-red-600 dark:text-red-400">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="customer@example.com"
                      required
                      disabled={isSubmitting}
                      className="border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-red-600 dark:text-red-400">
                      Phone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="1234567890"
                      required
                      disabled={isSubmitting}
                      className="border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-red-600 dark:text-red-400">
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://example.com"
                      disabled={isSubmitting}
                      className="border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="status" className="text-red-600 dark:text-red-400">
                      Status *
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "active" | "inactive") => handleInputChange("status", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address">
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="border-b border-red-200 dark:border-red-800">
                <CardTitle className="text-red-600 dark:text-red-400">Address Information</CardTitle>
                <CardDescription>Enter the customer's address details</CardDescription>
              </CardHeader>
              <CardContent className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-red-600 dark:text-red-400">
                      Address *
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="123 Main St"
                      required
                      disabled={isSubmitting}
                      className="border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-red-600 dark:text-red-400">
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="New York"
                      required
                      disabled={isSubmitting}
                      className="border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="county" className="text-red-600 dark:text-red-400">
                      County
                    </Label>
                    <Input
                      id="county"
                      value={formData.county}
                      onChange={(e) => handleInputChange("county", e.target.value)}
                      placeholder="New York"
                      disabled={isSubmitting}
                      className="border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-red-600 dark:text-red-400">
                      State *
                    </Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="NY"
                      required
                      disabled={isSubmitting}
                      className="border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-red-600 dark:text-red-400">
                      ZIP Code *
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      placeholder="10001"
                      required
                      disabled={isSubmitting}
                      className="border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-red-600 dark:text-red-400">
                      Country *
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      placeholder="USA"
                      required
                      disabled={isSubmitting}
                      className="border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end space-x-4 pt-6 border-t border-red-200 dark:border-red-800">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Customer
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  )
}
