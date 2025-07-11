// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { ArrowLeft, Plus } from "lucide-react";

// import type { Role, Permission } from "./types";
// import {
//   fetchRoles,
//   getRoleById,
//   deleteRole as deleteRoleApi,
//   fetchPermissions,
// } from "./role-api";

// import { RoleCreateForm } from "./role-create-form";
// import { RoleDetail } from "./role-detail";
// import { RoleEditForm } from "./role-edit";
// import { RoleError } from "./role-error";
// import { RoleLoading } from "./role-loading";
// import { RoleTabs } from "./role-tabs";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation"; 

// type ViewType = "list" | "details" | "edit" | "create";

// interface RoleServiceProps {
//   initialView?: ViewType;
//   roleId?: string;
// }

// export function RoleService({ initialView = "list", roleId }: RoleServiceProps) {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//   const [currentView, setCurrentView] = useState<ViewType>(initialView);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [permissions, setPermissions] = useState<Permission[]>([]);
//   const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");
//     const router = useRouter();         

//   // Load roles and permissions on first render
//   useEffect(() => {
//     loadRoles();
//     loadPermissions();
//   }, []);

//   // Load role by ID when switching to details or edit
//   useEffect(() => {
//     if (roleId && (currentView === "details" || currentView === "edit")) {
//       loadRoleById(roleId);
//     }
//   }, [roleId, currentView]);

//   const loadRoles = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const data = await fetchRoles();
//       setRoles(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to load roles");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadPermissions = async () => {
//     try {
//       const data = await fetchPermissions(); // ✅ FIXED HERE
//       setPermissions(data);
//     } catch (err) {
//       console.error("Failed to load permissions", err);
//     }
//   };

//   const loadRoleById = async (id: string) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const role = await getRoleById(id);
//       setSelectedRole(role);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to load role");
//     } finally {
//       setIsLoading(false);
//     }
//   };

  
//   const handleBack = () => {
//     router.push("/dashboard/settings/roles");  // navigate
//     // optional: keep these for a smooth UX while the new page is loading
//     setCurrentView("list");
//     setSelectedRole(null);
//     setError(null);
//   };

//   // Main UI render logic
//   if (isLoading && currentView === "list") return <RoleLoading />;
//   if (error && currentView === "list")
//     return <RoleError error={new Error(error)} onRetry={loadRoles} />;

//   switch (currentView) {
//     case "details":
//       if (!selectedRole) return <RoleLoading />;
//       return <RoleDetail role={selectedRole} onBack={handleBack} />;

//     case "edit":
//       if (!selectedRole) return <RoleLoading />;
//       return (
//         <RoleEditForm
//           role={selectedRole}
//           onBack={handleBack}
//           onUpdate={handleBack}
//         />
//       );

//     case "create":
//   return (
//     <div className="space-y-6">
//       {/* Header row */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold tracking-tight text-green-700">
//           Create Role
//         </h1>

//         {/* Back button */}
//         <Button
//           size="sm"
//           className="bg-green-600 hover:bg-green-700 text-white"
//           onClick={handleBack}          // ⬅︎ uses your existing handler
//         >
//           <ArrowLeft className="h-5 w-5 mr-1" />
//           Back
//         </Button>
//       </div>

//       {/* Form */}
//       <RoleCreateForm
//         onSuccess={handleBack}
//         onCancel={handleBack}
//         showCard
//       />
//     </div>
//   );


//     default:
//       return (
//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <h1 className="text-3xl font-bold tracking-tight text-green-700">Roles</h1>

//             <div className="flex items-center gap-2">
//               <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
//                 <Link href="/dashboard/settings" className="flex items-center gap-1">
//                   <ArrowLeft className="h-5 w-5" />
//                   Back
//                 </Link>
//               </Button>

//               <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
//                 <Link href="/dashboard/settings/roles/create" className="flex items-center gap-2">
//                   <Plus className="h-4 w-4" />
//                   Create
//                 </Link>
//               </Button>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
//             <RoleTabs
//               roles={roles}
//               permissions={permissions}
//               onRefresh={loadRoles}
//               activeTab={activeTab}
//               onTabChange={setActiveTab}
//             />
//           </div>
//         </div>
//       );
//   }
// }













// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { ArrowLeft, Plus } from "lucide-react"

// import type { Role, Permission } from "./types"
// import {
//   fetchRoles,
//   getRoleById,
//   fetchPermissions,
//   getPermissionById, // Import new API function
// } from "./role-api"

// import { RoleCreateForm } from "./role-create-form"
// import { RoleEditForm } from "./role-edit"
// import { RoleError } from "./role-error"
// import { RoleLoading } from "./role-loading"
// import { RoleTabs } from "./role-tabs"
// import { Button } from "@/components/ui/button"
// import { PermissionCreateForm } from "./permissions/create-permission"
// import { PermissionEditForm } from "./permissions/permission-edit"
// import { RoleDetail } from "./role-detail"

// type ViewType = "list" | "details" | "edit" | "create" | "create-permission" | "edit-permission" // Updated ViewType

// interface RoleServiceProps {
//   initialView?: ViewType
//   roleId?: string
//   permissionId?: string // New prop for permission ID
// }

// export function RoleService({ initialView = "list", roleId, permissionId }: RoleServiceProps) {
//   const [roles, setRoles] = useState<Role[]>([])
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null)
//   const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null) // New state
//   const [currentView, setCurrentView] = useState<ViewType>(initialView)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [permissions, setPermissions] = useState<Permission[]>([])
//   const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles")

//   // Load roles and permissions on first render
//   useEffect(() => {
//     loadRoles()
//     loadPermissions()
//   }, [])

//   // Load role by ID when switching to details or edit
//   useEffect(() => {
//     if (roleId && (currentView === "details" || currentView === "edit")) {
//       loadRoleById(roleId)
//     }
//   }, [roleId, currentView])

//   // Load permission by ID when switching to edit-permission
//   useEffect(() => {
//     if (permissionId && currentView === "edit-permission") {
//       loadPermissionById(permissionId)
//     }
//   }, [permissionId, currentView])

//   const loadRoles = async () => {
//     try {
//       setIsLoading(true)
//       setError(null)
//       const data = await fetchRoles()
//       setRoles(data)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to load roles")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const loadPermissions = async () => {
//     try {
//       const data = await fetchPermissions()
//       setPermissions(data)
//     } catch (err) {
//       console.error("Failed to load permissions", err)
//     }
//   }

//   const loadRoleById = async (id: string) => {
//     try {
//       setIsLoading(true)
//       setError(null)
//       const role = await getRoleById(id)
//       setSelectedRole(role)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to load role")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const loadPermissionById = async (id: string) => {
//     try {
//       setIsLoading(true)
//       setError(null)
//       const permission = await getPermissionById(id)
//       setSelectedPermission(permission)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to load permission")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleBack = () => {
//     setCurrentView("list")
//     setSelectedRole(null)
//     setSelectedPermission(null) // Clear selected permission
//     setError(null)
//     loadRoles() // Refresh roles
//     loadPermissions() // Refresh permissions
//   }

//   // Determine the "Create" button's link based on the active tab
//   const createButtonLink =
//     activeTab === "roles" ? "/dashboard/settings/roles/create" : "/dashboard/settings/permissions/create"

//   // Main UI render logic
//   if (isLoading && currentView === "list") return <RoleLoading />
//   if (error && currentView === "list") return <RoleError error={new Error(error)} onRetry={loadRoles} />

//   switch (currentView) {
//     case "details":
//       if (!selectedRole) return <RoleLoading />
//       return <RoleDetail role={selectedRole} onBack={handleBack} />

//     case "edit":
//       if (!selectedRole) return <RoleLoading />
//       return <RoleEditForm role={selectedRole} onBack={handleBack} onUpdate={handleBack} />

//     case "create":
//       return (
//         <div className="space-y-6">
//           <h1 className="text-3xl font-bold tracking-tight">Create Role</h1>
//           <RoleCreateForm onSuccess={handleBack} onCancel={handleBack} showCard />
//         </div>
//       )

//     case "create-permission": // New case for creating permissions
//       return (
//         <div className="space-y-6">
//           <h1 className="text-3xl font-bold tracking-tight">Create Permission</h1>
//           <PermissionCreateForm onSuccess={handleBack} onCancel={handleBack} showCard />
//         </div>
//       )

//     case "edit-permission": // New case for editing permissions
//       if (!selectedPermission) return <RoleLoading /> // Use RoleLoading for consistency
//       return <PermissionEditForm permission={selectedPermission} onSuccess={handleBack} onCancel={handleBack} />

//     default:
//       return (
//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <h1 className="text-3xl font-bold tracking-tight text-green-700">
//               {activeTab === "roles" ? "Roles" : "Permissions"}
//             </h1>

//             <div className="flex items-center gap-2">
//               <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
//                 <Link href="/dashboard/settings" className="flex items-center gap-1">
//                   <ArrowLeft className="h-5 w-5" />
//                   Back
//                 </Link>
//               </Button>

//               <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
//                 <Link href={createButtonLink} className="flex items-center gap-2">
//                   <Plus className="h-4 w-4" />
//                   Create
//                 </Link>
//               </Button>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
//             <RoleTabs
//               roles={roles}
//               permissions={permissions}
//               onRefresh={handleBack} // Refresh both roles and permissions on tab change/refresh
//               activeTab={activeTab}
//               onTabChange={setActiveTab}
//             />
//           </div>
//         </div>
//       )
//   }
// }

















"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"

import type { Role, Permission } from "./types"
import {
  fetchRoles,
  getRoleById,
  fetchPermissions,
  getPermissionById, // Import new API function
} from "./role-api"

import { RoleCreateForm } from "./role-create-form"
import { RoleEditForm } from "./role-edit"
import { RoleError } from "./role-error"
import { RoleLoading } from "./role-loading"
import { RoleTabs } from "./role-tabs"
import { Button } from "@/components/ui/button"
import { PermissionCreateForm } from "./permissions/create-permission"
import { PermissionEditForm } from "./permissions/permission-edit"
import { RoleDetail } from "./role-detail"
import { useRouter } from "next/navigation";

type ViewType = "list" | "details" | "edit" | "create" | "create-permission" | "edit-permission"

interface RoleServiceProps {
  initialView?: ViewType
  roleId?: string
  permissionId?: string
}

export function RoleService({ initialView = "list", roleId, permissionId }: RoleServiceProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>(initialView)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles")

  const router = useRouter();

  // Load roles and permissions on first render
  useEffect(() => {
    loadRoles()
    loadPermissions()
  }, [])

  // Load role by ID when switching to details or edit
  useEffect(() => {
    if (roleId && (currentView === "details" || currentView === "edit")) {
      loadRoleById(roleId)
    }
  }, [roleId, currentView])

  // Load permission by ID when switching to edit-permission
  useEffect(() => {
    if (permissionId && currentView === "edit-permission") {
      loadPermissionById(permissionId)
    }
  }, [permissionId, currentView])

  const loadRoles = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchRoles()
      setRoles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load roles")
    } finally {
      setIsLoading(false)
    }
  }

  const loadPermissions = async () => {
    try {
      const data = await fetchPermissions()
      setPermissions(data)
    } catch (err) {
      console.error("Failed to load permissions", err)
    }
  }

  const loadRoleById = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const role = await getRoleById(id)
      setSelectedRole(role)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load role")
    } finally {
      setIsLoading(false)
    }
  }

  const loadPermissionById = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const permission = await getPermissionById(id)
      setSelectedPermission(permission)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load permission")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    // Determine which tab to activate based on the current view before going back
    if (currentView === "create-permission" || currentView === "edit-permission") {
      setActiveTab("permissions")
    } else if (currentView === "create" || currentView === "edit" || currentView === "details") {
      setActiveTab("roles")
    }

    setCurrentView("list")
    setSelectedRole(null)
    setSelectedPermission(null)
    setError(null)
    loadRoles()
    loadPermissions()
     router.push("/dashboard/settings/roles");
  }

  const createButtonLink =
    activeTab === "roles" ? "/dashboard/settings/roles/create" : "/dashboard/settings/permissions/create"

  if (isLoading && currentView === "list") return <RoleLoading />
  if (error && currentView === "list") return <RoleError error={new Error(error)} onRetry={loadRoles} />

  switch (currentView) {
    case "details":
      if (!selectedRole) return <RoleLoading />
      return <RoleDetail role={selectedRole} onBack={handleBack} />

    case "edit":
      if (!selectedRole) return <RoleLoading />
      return <RoleEditForm role={selectedRole} onBack={handleBack} onUpdate={handleBack} />

    case "create":
  return (
    <div className="space-y-6">
      {/* header row */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-green-700">
          Create Role
        </h1>

        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={handleBack}          // go back to list
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </Button>
      </div>

      {/* form */}
      <RoleCreateForm
        onSuccess={handleBack}
        onCancel={handleBack}
        showCard
      />
    </div>
  );


    case "create-permission":
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Create Permission</h1>
          <PermissionCreateForm onSuccess={handleBack} onCancel={handleBack} showCard />
        </div>
      )

    case "edit-permission":
      if (!selectedPermission) return <RoleLoading />
      return <PermissionEditForm permission={selectedPermission} onSuccess={handleBack} onCancel={handleBack} />

    default:
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-green-700">
              {activeTab === "roles" ? "Roles" : "Permissions"}
            </h1>

            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <Link href="/dashboard/settings" className="flex items-center gap-1">
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </Link>
              </Button>

              <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <Link href={createButtonLink} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <RoleTabs
              roles={roles}
              permissions={permissions}
              onRefresh={handleBack}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
      )
  }
}
