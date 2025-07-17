


// "use client"

// import { useState, useMemo } from "react"
// import { usePathname, useRouter } from "next/navigation"
// import {
//   Home, Wrench, Activity, Factory, Settings,
//   ChevronRight, ChevronLeft, UserCircle, LogOut,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"

// const LOGO_URL = "/logo.svg"

// type MenuDef = {
//   id: string
//   label: string
//   icon: any
//   path: string
//   roles?: string[]         // optional role whitelist
//   perms?: string[]         // optional permission whitelist
// }

// const MENUS: MenuDef[] = [
//   { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard",
//     roles: ["admin","manager","engineer","account"],
//     },

//   { id: "mpi", label: "MPI", icon: Wrench, path: "/dashboard/mpi",
//     roles: ["admin","manager","engineer"],
//      },

//   { id: "flow", label: "Assembly Process", icon: Activity, path: "/dashboard/flow",
//     roles: ["admin","manager"],
//    },

//   { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations",
//     roles: ["admin","manager","engineer"],
//     },

//   { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings",
//     roles: ["admin","manager"],
//    },
// ]

// function getAllowedMenuItems(role: string, perms: string[]): MenuDef[] {
//   return MENUS.filter(m => {
//     const okByRole  = !m.roles || m.roles.includes(role)
//     const okByPerms = !m.perms || m.perms.every(p => perms.includes(p))
//     return okByRole && okByPerms       // union logic
//   })
// }

// export default function DashboardSidebar({
//   onLogout, username, onToggle,
// }: { onLogout: () => void; username: string; onToggle?: (c:boolean)=>void }) {

//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const pathname  = usePathname()
//   const router    = useRouter()

//   const role  = (typeof window !== "undefined" ? localStorage.getItem("role") : "")?.toLowerCase() ?? ""
//   const perms = typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem("permissions") || "[]")
//       : []

//   const menuItems = useMemo(() => getAllowedMenuItems(role, perms), [role, perms])

//   const toggle  = () => { const c=!isCollapsed; setIsCollapsed(c); onToggle?.(c) }
//   const go      = (p:string) => router.push(p)

//   return (
//     <div className={`bg-white dark:bg-gray-800 border-r ${
//       isCollapsed ? "w-16" : "w-64"} min-h-screen flex flex-col fixed h-full z-10 transition-[width] duration-300`}>

//       {/* header */}
//       <div className="p-4 border-b flex items-center justify-between">
//         {!isCollapsed && <Image src={LOGO_URL} alt="Logo" width={120} height={32} priority />}
//         <Button variant="ghost" size="sm" onClick={toggle} className="p-1 h-8 w-8">
//           {isCollapsed ? <ChevronRight className="h-4 w-4"/> : <ChevronLeft className="h-4 w-4"/>}
//         </Button>
//       </div>

//       {/* user */}
//       {!isCollapsed && (
//         <div className="px-4 py-2 text-sm border-b">
//           <div className="flex items-center gap-2">
//             <UserCircle className="w-4 h-4"/>
//             <div>
//               <div className="font-medium truncate">{username}</div>
//               {role && <div className="text-xs text-gray-500 capitalize">{role}</div>}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* navigation */}
//       <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
//         <div className="space-y-2">
//           {menuItems.map(({ id,label,icon:Icon,path }) => {
//             const active = pathname === path
//             return (
//               <Button key={id}
//                 variant={active?"default":"ghost"}
//                 className={`w-full justify-start h-10 ${
//                   active
//                     ? "bg-green-600 text-white hover:bg-green-700"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 } ${isCollapsed ? "px-2" : "px-3"}`}
//                 onClick={() => go(path)}>
//                 <Icon className={`h-4 w-4 ${isCollapsed? "" : "mr-3"}`}/>
//                 {!isCollapsed && <span className="text-sm">{label}</span>}
//               </Button>
//             )
//           })}
//         </div>
//       </nav>

//       {/* logout */}
//       <div className="p-4 border-t">
//         <Button variant="ghost"
//           className={`justify-start h-10 text-green-600 hover:bg-green-50 ${
//             isCollapsed ? "w-10 p-0" : "w-auto px-3"}`} onClick={onLogout}>
//           <LogOut className={`h-4 w-4 ${isCollapsed?"":"mr-3"}`}/>
//           {!isCollapsed && <span className="text-sm">Sign Out</span>}
//         </Button>
//       </div>
//     </div>
//   )
// }



"use client"

import {
  Home, Wrench, Activity, Factory, Settings,
  ChevronRight, ChevronLeft, UserCircle, LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"

type Menu = {
  id: string; label: string; icon: any; path: string
  roles?: string[]; perms?: string[]
}

const MENUS: Menu[] = [
  { id: "dash",  label: "Dashboard",        icon: Home,    path: "/dashboard",
    roles: ["admin","manager","engineer","account"] },
  { id: "mpi",   label: "MPI",              icon: Wrench,  path: "/dashboard/mpi",
    roles: ["admin","manager","engineer"] },
  { id: "flow",  label: "Assembly Process", icon: Activity,path: "/dashboard/flow",
    roles: ["admin","manager"] },
  { id: "stat",  label: "Stations",         icon: Factory, path: "/dashboard/stations",
    roles: ["admin","manager","engineer"] },
  { id: "set",   label: "Settings",         icon: Settings,path: "/dashboard/settings",
    roles: ["admin","manager"] },
]

const filterMenu = (role: string, perms: string[]) =>
  MENUS.filter(m => (!m.roles || m.roles.includes(role)) &&
                    (!m.perms || m.perms.every(p => perms.includes(p))))

export default function DashboardSidebar({
  onToggle,
}: { onToggle?: (c:boolean)=>void }) {

  const { username, role, perms, logout } = useAuth()
  const pathname  = usePathname()
  const router    = useRouter()

  const menu      = useMemo(() => filterMenu(role, perms), [role, perms])
  const [collapsed, setCol] = useState(false)

  const toggle = () => { const c = !collapsed; setCol(c); onToggle?.(c) }

  return (
    <aside className={`bg-white dark:bg-gray-800 border-r ${collapsed?'w-16':'w-64'} fixed min-h-screen transition-width`}>
      {/* header */}
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && <Image src="/logo.svg" alt="logo" width={120} height={32} priority />}
        <Button variant="ghost" size="sm" onClick={toggle} className="p-1 h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4"/> : <ChevronLeft className="h-4 w-4"/>}
        </Button>
      </div>

      {/* user */}
      {!collapsed && (
        <div className="px-4 py-2 border-b text-sm">
          <div className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            <div>
              <div className="font-medium truncate">{username}</div>
              {role && <div className="text-xs text-gray-500 capitalize">{role}</div>}
            </div>
          </div>
        </div>
      )}

      {/* nav */}
      <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
        {menu.map(({ id,label,icon:Icon,path }) => {
          const active = pathname === path
          return (
            <Button key={id} variant={active?"default":"ghost"}
              className={`w-full justify-start h-10 ${active
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"} ${
                collapsed ? "px-2" : "px-3"}`}
              onClick={()=>router.push(path)}>
              <Icon className={`h-4 w-4 ${collapsed?'':'mr-3'}`} />
              {!collapsed && <span className="text-sm">{label}</span>}
            </Button>
          )
        })}
      </nav>

      {/* logout */}
      <div className="p-4 border-t">
        <Button variant="ghost" onClick={logout}
          className={`justify-start h-10 text-green-600 hover:bg-green-50 ${collapsed?'w-10 p-0':'w-auto px-3'}`}>
          <LogOut className={`h-4 w-4 ${collapsed?'':'mr-3'}`} />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </Button>
      </div>
    </aside>
  )
}
