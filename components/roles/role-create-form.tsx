
// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm, Controller } from "react-hook-form"
// import * as z from "zod"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { useToast } from "@/hooks/use-toast"

// import { fetchDepartments, fetchPermissions, createRole } from "./role-api"
// import { ChevronDown } from "lucide-react"

// const formSchema = z.object({
//   name: z.string().min(1, "Role name is required").max(100),
//   description: z.string().optional(),
//   isActive: z.boolean().default(true),
//   departmentId: z.string().optional(),
//   permissionIds: z.array(z.string()).min(1, "Select at least one permission"),
//   createdBy: z.string().optional(),
// })

// type FormData = z.infer<typeof formSchema>

// function PermissionMultiSelect({
//   value,
//   onChange,
//   options,
  
// }: {
//   value: string[]
//   onChange: (v: string[]) => void
//   options: { id: string; name: string }[]
// }) 
// {
//   const [open, setOpen] = useState(false)

//   const toggle = () => setOpen(!open)
//   const toggleItem = (id: string) =>
//     onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])

//   const displayValue =
//     value.length === 0
//       ? "Select permissions"
//       : value.length <= 3
//       ? options
//           .filter((o) => value.includes(o.id))
//           .map((o) => o.name)
//           .join(", ")
//       : `${value.length} permissions selected`

//   return (
//     <div className="relative">
//       <div
//         role="button"
//         tabIndex={0}
//         onClick={toggle}
//         className="h-10 w-full rounded border border-gray-300 px-3 py-2 cursor-pointer select-none flex justify-between items-center text-sm"
//       >
//         <span className="truncate">{displayValue}</span>
//         <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
//       </div>

//       {open && (
//         <div className="mt-2 mb-4 w-full max-h-60 overflow-auto rounded border border-gray-300 bg-white p-2 shadow-lg">
//           {options.map((opt) => (
//             <label
//               key={opt.id}
//               className="flex items-center space-x-2 py-1 px-1 hover:bg-gray-100 rounded cursor-pointer text-sm"
//             >
//               <input
//                 type="checkbox"
//                 checked={value.includes(opt.id)}
//                 onChange={() => toggleItem(opt.id)}
//                 className="h-4 w-4 cursor-pointer"
//               />
//               <span>{opt.name}</span>
//             </label>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// interface RoleCreateFormProps {
//   onSuccess?: () => void
//   onCancel?: () => void
//   showCard?: boolean
// }

// export function RoleCreateForm({ onSuccess, onCancel, showCard = true }: RoleCreateFormProps) {
//   const { toast } = useToast()
//   const router = useRouter()

//   const [departments, setDepartments] = useState<{ id: string; name: string }[]>([])
//   const [permissions, setPermissions] = useState<{ id: string; name: string }[]>([])
//   const [submitting, setSubmitting] = useState(false)

//   const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? "" : ""

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       isActive: true,
//       departmentId: "",
//       permissionIds: [],
//       createdBy: userId || undefined,
//     },
//   })

//   useEffect(() => {
//     async function load() {
//       try {
//         const [depts, perms] = await Promise.all([fetchDepartments(), fetchPermissions()])
//         setDepartments(depts)
//         setPermissions(perms)
//       } catch {
//         toast({
//           title: "Error",
//           description: "Failed to load departments or permissions",
//           variant: "destructive",
//         })
//       }
//     }
//     load()
//   }, [])

//   const onSubmit = async (data: FormData) => {
//     try {
//       setSubmitting(true)
//       const cleanedData = {
//         name: data.name,
//         description: data.description || undefined,
//         departmentId: data.departmentId || undefined,
//         createdBy: data.createdBy || undefined,
//         permissionIds: Array.isArray(data.permissionIds)
//           ? data.permissionIds
//           : data.permissionIds
//           ? [data.permissionIds]
//           : [],
//       }

//       const response = await createRole(cleanedData)
//       if ("error" in response) {
//         throw new Error(response.error)
//       }
//       const role = "data" in response ? response.data : response
//       if (!role?.id) {
//         throw new Error("Invalid response: Missing role ID")
//       }
//       toast({ title: "Success", description: "Role created successfully" })
//       onSuccess ? onSuccess() : router.push(`/dashboard/settings/roles`)
//     } catch (error) {
//       console.error("Role creation failed:", error)
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to create role",
//         variant: "destructive",
//       })
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleCancel = () => {
//     onCancel ? onCancel() : router.back()
//   }

//   const formContent = (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Role Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="e.g., Admin, Manager" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />



//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description (optional)</FormLabel>
//               <FormControl>
//                 <Textarea placeholder="Describe the role..." className="resize-none" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
//           <FormField
//             control={form.control}
//             name="departmentId"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Department (optional)</FormLabel>
//                 <FormControl>
//                   <div className="relative">
//                     <select
//                       {...field}
//                       className="h-10 w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 pr-8 text-sm"
//                     >
//                       <option value="">Select a department </option>
//                       {departments.map((d) => (
//                         <option key={d.id} value={d.id}>
//                           {d.name}
//                         </option>
//                       ))}
//                     </select>
//                     <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Controller
//             control={form.control}
//             name="permissionIds"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Permissions</FormLabel>
//                 <PermissionMultiSelect value={field.value} onChange={field.onChange} options={permissions} />
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

    

//         </div>

//         <FormField
//           control={form.control}
//           name="isActive"
//           render={({ field }) => (
//             <FormItem className="flex items-center justify-between rounded-lg border p-4">
//               <FormLabel className="text-base"> Status</FormLabel>
//               <FormControl>
//                 <Switch checked={field.value} onCheckedChange={field.onChange} />
//               </FormControl>
//             </FormItem>
//           )}
//         />

//         <input type="hidden" {...form.register("createdBy" as const)} />

//         <div className="flex justify-end">

//           <Button type="submit" disabled={submitting} className="ml-auto w-auto">
//             {submitting ? "Creating…" : "Create Role"}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )

//   if (!showCard) return formContent

//   return (
//     <Card>
    
//       <CardContent className="mt-5">{formContent}</CardContent>
//     </Card>
//   )
// }
















"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { fetchDepartments, fetchPermissions, createRole } from "./role-api";
import { ChevronDown } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Validation schema                              */
/* -------------------------------------------------------------------------- */

const formSchema = z.object({
  name: z.string().min(1, "Role name is required").max(100),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  departmentId: z.string().optional(),
  permissionIds: z
    .array(z.string())
    .min(1, "Select at least one permission"),
  createdBy: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

/* -------------------------------------------------------------------------- */
/*                          Permission multi‑select                           */
/* -------------------------------------------------------------------------- */

function PermissionMultiSelect({
  value,
  onChange,
  options,
  error = false,
}: {
  value: string[]
  onChange: (v: string[]) => void
  options: { id: string; name: string }[]
  error?: boolean
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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
    <div ref={containerRef} className="relative">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        className={`h-10 w-full rounded px-3 py-2 cursor-pointer select-none flex justify-between items-center text-sm
          ${error ? "border-red-500" : "border-gray-300"} border bg-white dark:bg-slate-900`}
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div className="mt-2 mb-4 w-full max-h-60 overflow-auto rounded border border-gray-300 bg-white dark:bg-slate-800 p-2 shadow-lg z-10">
          {options.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center space-x-2 py-1 px-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={value.includes(opt.id)}
                onChange={() => toggleItem(opt.id)}
                className="h-4 w-4 cursor-pointer"
              />
              <span>{opt.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}


/* -------------------------------------------------------------------------- */
/*                               Main component                               */
/* -------------------------------------------------------------------------- */

interface RoleCreateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  showCard?: boolean;
}

export function RoleCreateForm({
  onSuccess,
  onCancel,
  showCard = true,
}: RoleCreateFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  /* ----------------------------- local state ----------------------------- */

  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [permissions, setPermissions] = useState<
    { id: string; name: string }[]
  >([]);
  const [submitting, setSubmitting] = useState(false);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") ?? "" : "";

  /* ------------------------------ form hook ------------------------------ */

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // live validation
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      departmentId: "",
      permissionIds: [],
      createdBy: userId || undefined,
    },
  });

  /* ----------------------------- initial data ---------------------------- */

  useEffect(() => {
    (async () => {
      try {
        const [depts, perms] = await Promise.all([
          fetchDepartments(),
          fetchPermissions(),
        ]);
        setDepartments(depts);
        setPermissions(perms);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load departments or permissions",
          variant: "destructive",
        });
      }
    })();
  }, []);

  /* ------------------------------- submit ------------------------------- */

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);

      const payload = {
        name: data.name,
        description: data.description || undefined,
        departmentId: data.departmentId || undefined,
        createdBy: data.createdBy || undefined,
        permissionIds: data.permissionIds,
      };

      const res = await createRole(payload);
      if ("error" in res) throw new Error(res.error);

      const role = "data" in res ? res.data : res;
      if (!role?.id) throw new Error("Invalid response: Missing role ID");

      toast({ title: "Success", description: "Role created successfully" });
      onSuccess ? onSuccess() : router.push("/dashboard/settings/roles");
    } catch (err) {
      console.error("Role creation failed:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to create role",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    onCancel ? onCancel() : router.back();
  };

  /* ------------------------------ form DOM ------------------------------ */

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Role name ------------------------------------------------------- */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Role Name<span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Admin, Manager"
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description ----------------------------------------------------- */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the role…"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Department + permissions grid ---------------------------------- */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* Department */}
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
                      className="h-10 w-full appearance-none rounded border border-gray-300 bg-white dark:bg-slate-900 px-3 py-2 pr-8 text-sm"
                    >
                      <option value="">Select a department</option>
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

          {/* Permissions */}
          <Controller
            control={form.control}
            name="permissionIds"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Permissions<span className="text-red-600">*</span>
                </FormLabel>
                <PermissionMultiSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={permissions}
                  error={!!fieldState.error}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status switch --------------------------------------------------- */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <FormLabel className="text-base">Status</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* hidden createdBy ------------------------------------------------ */}
        <input type="hidden" {...form.register("createdBy" as const)} />

        {/* actions row ----------------------------------------------------- */}
        <div className="flex justify-end gap-2">
          

          <Button
            type="submit"
            disabled={submitting || !form.formState.isValid}
            className="ml-auto w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            {submitting ? "Creating…" : "Create Role"}
          </Button>
        </div>
      </form>
    </Form>
  );

  /* ----------------------------- card wrapper --------------------------- */

  if (!showCard) return content;

  return (
    <Card>
      <CardContent className="mt-5">{content}</CardContent>
    </Card>
  );
}
