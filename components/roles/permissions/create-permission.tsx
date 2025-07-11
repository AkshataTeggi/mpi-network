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

import { createPermission } from "../role-api"

/* ------------------------------------------------------------------ */
/* Zod schema                                                          */
/* ------------------------------------------------------------------ */

const formSchema = z.object({
  name: z.string().min(1, "Permission name is required").max(100),
  description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

/* ------------------------------------------------------------------ */
/* PermissionCreateForm component                                      */
/* ------------------------------------------------------------------ */

interface PermissionCreateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  showCard?: boolean
}

export function PermissionCreateForm({ onSuccess, onCancel, showCard = true }: PermissionCreateFormProps) {
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
      const response = await createPermission(data)

      if (!response?.id) {
        throw new Error("Invalid response: Missing permission ID")
      }

      toast({
        title: "Success",
        description: "Permission created successfully",
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/dashboard/settings/roles`) // Redirect to roles list after creation
      }
    } catch (error) {
      console.error("Permission creation failed:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create permission",
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
              <FormLabel>Permission Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., user.read, product.create" {...field} />
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
                <Textarea placeholder="Describe the permission..." className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? "Creating…" : "Create Permission"}
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
      <CardHeader>
        <CardTitle>Create New Permission</CardTitle>
      </CardHeader>
      <CardContent className="mt-5">{formContent}</CardContent>
    </Card>
  )
}
