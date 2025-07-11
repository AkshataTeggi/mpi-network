
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

import { fetchDepartments, fetchPermissions, updateRole } from "./role-api"

import type { Role, Permission } from "./types"
import { ArrowLeft, ChevronDown } from "lucide-react"

/* ------------------------------------------------------------------ */
/* Zod schema                                                          */
/* ------------------------------------------------------------------ */
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
  departmentId: z.string().optional(),
  permissionIds: z.array(z.string()).min(1, "Select at least one permission"),
})

type FormData = z.infer<typeof formSchema>

/* ------------------------------------------------------------------ */
/* Permission multi‑select                                             */
/* ------------------------------------------------------------------ */
function PermissionMultiSelect({
  value,
  onChange,
  options,
}: {
  value: string[]
  onChange: (v: string[]) => void
  options: Permission[]
}) {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(!open)
  const toggleItem = (id: string) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])

  const displayValue =
    value.length === 0
      ? "Select permissions"
      : value.length <= 3
      ? options
          .filter((o) => value.includes(o.id))
          .map((o) => o.name)
          .join(", ")
      : `${value.length} permissions selected`

  return (
    <div className="relative">
      <div
        role="button"
        tabIndex={0}
        onClick={toggle}
        className="h-10 w-full cursor-pointer select-none rounded border border-gray-300 px-3 py-2 text-sm flex items-center justify-between"
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div className="mt-2 mb-4 w-full max-h-60 overflow-auto rounded border border-gray-300 bg-white p-2 shadow-lg">
          {options.map((perm) => (
            <label
              key={perm.id}
              className="flex cursor-pointer items-center space-x-2 rounded py-1 px-1 text-sm hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={value.includes(perm.id)}
                onChange={() => toggleItem(perm.id)}
                className="h-4 w-4 cursor-pointer"
              />
              <span>{perm.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* RoleEditForm component                                              */
/* ------------------------------------------------------------------ */
interface RoleEditFormProps {
  role: Role
  onBack?: () => void
  onUpdate?: () => void
}

export function RoleEditForm({ role, onBack, onUpdate }: RoleEditFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: role.name,
      description: role.description || "",
      isActive: role.isActive ?? true,
      departmentId: role.departmentId || "",
      permissionIds: role.permissions?.map((p) => p.id) || [],
    },
  })

  useEffect(() => {
    ;(async () => {
      try {
        const [depts, perms] = await Promise.all([fetchDepartments(), fetchPermissions()])
        setDepartments(depts)
        setPermissions(perms)
      } catch {
        toast({
          title: "Error",
          description: "Failed to load departments or permissions",
          variant: "destructive",
        })
      }
    })()
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      const updateData = {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        departmentId: data.departmentId || null,
        permissionIds: data.permissionIds,
      }
      await updateRole(role.id, updateData)
      toast({ title: "Success", description: "Role updated successfully" })
      onUpdate ? onUpdate() : router.push(`/dashboard/settings/roles/${role.id}`)
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Update failed",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => (onBack ? onBack() : router.back())

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-green-700">Edit Role</h1>
        <Button
          onClick={handleBack}
          className="bg-green-600 px-4 text-white hover:bg-green-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader />
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department & Permissions */}
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department (optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <select
                            {...field}
                            className="h-10 w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 pr-8 text-sm"
                          >
                            <option value="">Select department (optional)</option>
                            {departments.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Controller
                  control={form.control}
                  name="permissionIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permissions</FormLabel>
                      <PermissionMultiSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={permissions}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                <Button type="submit" disabled={loading} className="sm:w-40">
                  {loading ? "Saving…" : "Update Role"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
