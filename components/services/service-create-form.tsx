"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

import { ServiceAPI } from "./service-api" // Corrected import
import type { CreateServiceDto } from "./types"


const formSchema = z.object({
  name: z.string().min(1, "Service name is required").max(100),
  description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface ServiceCreateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  showCard?: boolean
}

export function ServiceCreateForm({ onSuccess, onCancel, showCard = true }: ServiceCreateFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true)
      const response = await ServiceAPI.create(data as CreateServiceDto) // Corrected call

      if (!response?.id) {
        throw new Error("Invalid response: Missing service ID")
      }

      toast({
        title: "Success",
        description: "Service created successfully",
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/dashboard/settings/roles`) // Redirect to roles list after creation (or services list if implemented)
      }
    } catch (error) {
      console.error("Service creation failed:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create service",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.back()
    }
  }

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., User Management, Billing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the service..." className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
       <div className="flex justify-end">
  <Button
    type="submit"
    disabled={submitting}
    className="w-auto"   
  >
    {submitting ? "Creating…" : "Create Service"}
  </Button>
</div>

      </form>
    </Form>
  )

  if (!showCard) {
    return formContent
  }

  return (
    <Card>
  
      <CardContent className="mt-5">{formContent}</CardContent>
    </Card>
  )
}
