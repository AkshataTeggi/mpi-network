"use client"

import { useEffect, useState } from "react"
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
import type { Service, UpdateServiceDto } from "./types"
import { ArrowLeft } from "lucide-react"

/* ------------------------------------------------------------------ */
/* Zod schema                                                          */
/* ------------------------------------------------------------------ */

const formSchema = z.object({
  name: z.string().min(1, "Service name is required").max(100),
  description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

/* ------------------------------------------------------------------ */
/* ServiceEditForm component                                           */
/* ------------------------------------------------------------------ */

interface ServiceEditFormProps {
  service: Service
  onSuccess?: () => void
  onCancel?: () => void
}

export function ServiceEditForm({ service, onSuccess, onCancel }: ServiceEditFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service.name,
      description: service.description || "",
    },
  })

  // Reset form when service prop changes (e.g., navigating between different services)
  useEffect(() => {
    form.reset({
      name: service.name,
      description: service.description || "",
    })
  }, [service, form])

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true)
      await ServiceAPI.update(service.id, data as UpdateServiceDto) // Corrected call

      toast({
        title: "Success",
        description: "Service updated successfully",
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/dashboard/settings/roles`) // Redirect to roles list after update (or services list if implemented)
      }
    } catch (error) {
      console.error("Service update failed:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update service",
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

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-green-700">Edit Service</h1>
        <Button onClick={handleCancel} className="bg-green-600 px-4 text-white hover:bg-green-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      {/* Form */}
      <Card>
      
        <CardContent className="mt-5">
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
                      <Input {...field} />
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
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                <Button type="submit" disabled={submitting} className="sm:w-40">
                  {submitting ? "Saving…" : "Update "}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
