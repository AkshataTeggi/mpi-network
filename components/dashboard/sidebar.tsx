// "use client"

// import { useState } from "react"
// import { usePathname, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import { Factory, LogOut, Menu, X, Home, Settings, ChevronDown, ChevronRight } from "lucide-react"

// interface DashboardSidebarProps {
//   onLogout: () => void
//   username: string
//   onToggle?: (collapsed: boolean) => void
// }

// const LOGO_URL =
//   "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png"

// export default function DashboardSidebar({ onLogout, username, onToggle }: DashboardSidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const pathname = usePathname()
//   const router = useRouter()
//   const [stations, setStations] = useState<any[]>([])
//   const [loadingStations, setLoadingStations] = useState(false)
//   const [expandedMenuItems, setExpandedMenuItems] = useState<string[]>([])

//   const menuItems = [
//     { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
//     { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations" },
//     {
//       id: "mpi",
//       label: "MPI",
//       icon: Settings,
//       path: "/dashboard/mpi",
//       subItems: [
//         {
//           id: "create-mpi",
//           label: "Create MPI",
//           path: "/dashboard/mpi/create",
//         },
//         ...stations.map((station) => ({
//           id: `station-${station.id}`,
//           label: station.name,
//           path: `/dashboard/mpi/station/${station.id}`,
//           icon: station.type || "Factory",
//         })),
//       ],
//     },
//     {
//       id: "settings",
//       label: "Settings",
//       icon: Settings,
//       path: "/dashboard/settings",
//       subItems: [
//         {
//           id: "services",
//           label: "Services",
//           path: "/dashboard/settings/services",
//         },
//       ],
//     },
//   ]

//   const toggleSidebar = () => {
//     const newCollapsedState = !isCollapsed
//     setIsCollapsed(newCollapsedState)
//     if (onToggle) {
//       onToggle(newCollapsedState)
//     }
//   }

//   const handleNavigation = (path: string) => {
//     router.push(path)
//   }

//   const toggleSubMenu = (itemId: string) => {
//     setExpandedMenuItems((prev) => {
//       if (prev.includes(itemId)) {
//         return prev.filter((id) => id !== itemId)
//       } else {
//         return [...prev, itemId]
//       }
//     })
//   }

//   return (
//     <div
//       className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       } min-h-screen flex flex-col fixed h-full z-10`}
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between">
//           {!isCollapsed && (
//             <Image
//               src={LOGO_URL || "/placeholder.svg"}
//               alt="Meritronics Logo"
//               width={120}
//               height={32}
//               className="h-auto"
//             />
//           )}
//           <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1 h-8 w-8">
//             {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
//           </Button>
//         </div>
//         {!isCollapsed && (
//           <div className="mt-2">
//             <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back,</p>
//             <p className="text-sm font-medium text-[hsl(var(--primary))]">{username}</p>
//           </div>
//         )}
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.path
//             const hasSubItems = item.subItems && item.subItems.length > 0
//             const isExpanded = expandedMenuItems.includes(item.id)

//             return (
//               <div key={item.id}>
//                 <Button
//                   variant={isActive ? "default" : "ghost"}
//                   className={`w-full justify-start h-10 ${
//                     isActive
//                       ? "bg-[hsl(var(--primary))] text-white"
//                       : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   } ${isCollapsed ? "px-2" : "px-3"} ${hasSubItems ? "flex items-center" : ""}`}
//                   onClick={() => {
//                     // Always navigate to the main path first
//                     handleNavigation(item.path)
//                     // Then toggle submenu if it has subitems
//                     if (hasSubItems) {
//                       toggleSubMenu(item.id)
//                     }
//                   }}
//                 >
//                   <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//                   {!isCollapsed && <span className="text-sm">{item.label}</span>}
//                   {hasSubItems && (
//                     <div className="ml-auto">
//                       {loadingStations ? (
//                         <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
//                       ) : isExpanded ? (
//                         <ChevronDown className="h-3 w-3" />
//                       ) : (
//                         <ChevronRight className="h-3 w-3" />
//                       )}
//                     </div>
//                   )}
//                 </Button>
//                 {hasSubItems && isExpanded && (
//                   <div className="space-y-2 pl-4">
//                     {item.subItems.map((subItem) => {
//                       const isSubActive = pathname === subItem.path

//                       return (
//                         <Button
//                           key={subItem.id}
//                           variant={isSubActive ? "default" : "ghost"}
//                           className={`w-full justify-start h-10 ${
//                             isSubActive
//                               ? "bg-[hsl(var(--primary))] text-white"
//                               : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                           } ${isCollapsed ? "px-2" : "px-3"}`}
//                           onClick={() => handleNavigation(subItem.path)}
//                         >
//                           {!isCollapsed && <span className="text-sm">{subItem.label}</span>}
//                         </Button>
//                       )
//                     })}
//                   </div>
//                 )}
//               </div>
//             )
//           })}
//         </div>
//       </nav>

//       {/* Footer */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//         <Button
//           variant="ghost"
//           className={`w-full justify-start h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
//             isCollapsed ? "px-2" : "px-3"
//           }`}
//           onClick={onLogout}
//         >
//           <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//           {!isCollapsed && <span className="text-sm">Logout</span>}
//         </Button>
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { usePathname, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import { Factory, LogOut, Menu, X, Home, Settings, ChevronDown, ChevronRight } from "lucide-react"

// interface DashboardSidebarProps {
//   onLogout: () => void
//   username: string
//   onToggle?: (collapsed: boolean) => void
// }

// const LOGO_URL =
//   "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png"

// export default function DashboardSidebar({ onLogout, username, onToggle }: DashboardSidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const pathname = usePathname()
//   const router = useRouter()
//   const [stations, setStations] = useState<any[]>([])
//   const [loadingStations, setLoadingStations] = useState(false)
//   const [expandedMenuItems, setExpandedMenuItems] = useState<string[]>([])

//   useEffect(() => {
//     const fetchStations = async () => {
//       setLoadingStations(true)
//       try {
//         const response = await fetch("http://54.177.111.218:4000/stations")
//         if (response.ok) {
//           const data = await response.json()
//           setStations(data)
//         }
//       } catch (error) {
//         console.error("Failed to fetch stations:", error)
//       } finally {
//         setLoadingStations(false)
//       }
//     }

//     fetchStations()
//   }, [])

//   const menuItems = [
//     { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
//     { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations" },
//     // { id: "specifications", label: "Specifications", icon: Settings, path: "/dashboard/specifications" },
//     {
//       id: "mpi",
//       label: "MPI",
//       icon: Settings,
//       path: "/dashboard/mpi",
//       subItems: [
//         {
//           id: "create-mpi",
//           label: "Create MPI",
//           path: "/dashboard/mpi/create",
//         },
//         ...stations.map((station) => ({
//           id: `station-${station.id}`,
//           label: station.stationName || station.name,
//           path: `/dashboard/station/${station.id}`,
//           icon: station.type || "Factory",
//         })),
//       ],
//     },
//     // {
//     //   id: "settings",
//     //   label: "Settings",
//     //   icon: Settings,
//     //   path: "/dashboard/settings",
//     //   subItems: [
//     //     {
//     //       id: "services",
//     //       label: "Services",
//     //       path: "/dashboard/settings/services",
//     //     },
//     //   ],
//     // },
//   ]

//   const toggleSidebar = () => {
//     const newCollapsedState = !isCollapsed
//     setIsCollapsed(newCollapsedState)
//     if (onToggle) {
//       onToggle(newCollapsedState)
//     }
//   }

//   const handleNavigation = (path: string) => {
//     router.push(path)
//   }

//   const toggleSubMenu = (itemId: string) => {
//     setExpandedMenuItems((prev) => {
//       if (prev.includes(itemId)) {
//         return prev.filter((id) => id !== itemId)
//       } else {
//         return [...prev, itemId]
//       }
//     })
//   }

//   return (
//     <div
//       className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       } min-h-screen flex flex-col fixed h-full z-10`}
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between">
//           {!isCollapsed && (
//             <Image
//               src={LOGO_URL || "/placeholder.svg"}
//               alt="Meritronics Logo"
//               width={120}
//               height={32}
//               className="h-auto"
//             />
//           )}
//           <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1 h-8 w-8">
//             {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
//           </Button>
//         </div>
//         {!isCollapsed && (
//           <div className="mt-2">
//             <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back,</p>
//             <p className="text-sm font-medium text-red-600">{username}</p>
//           </div>
//         )}
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.path
//             const hasSubItems = item.subItems && item.subItems.length > 0
//             const isExpanded = expandedMenuItems.includes(item.id)

//             return (
//               <div key={item.id}>
//                 <Button
//                   variant={isActive ? "default" : "ghost"}
//                   className={`w-full justify-start h-10 ${
//                     isActive
//                       ? "bg-red-600 text-white hover:bg-red-700"
//                       : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   } ${isCollapsed ? "px-2" : "px-3"} ${hasSubItems ? "flex items-center" : ""}`}
//                   onClick={() => {
//                     handleNavigation(item.path)

//                     if (hasSubItems) {
//                       toggleSubMenu(item.id)
//                     }
//                   }}
//                 >
//                   <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//                   {!isCollapsed && <span className="text-sm">{item.label}</span>}
//                   {hasSubItems && (
//                     <div className="ml-auto">
//                       {loadingStations ? (
//                         <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
//                       ) : isExpanded ? (
//                         <ChevronDown className="h-3 w-3" />
//                       ) : (
//                         <ChevronRight className="h-3 w-3" />
//                       )}
//                     </div>
//                   )}
//                 </Button>
//                 {hasSubItems && isExpanded && (
//                   <div className="space-y-2 pl-4">
//                     {item.subItems.map((subItem) => {
//                       const isSubActive = pathname === subItem.path

//                       return (
//                         <Button
//                           key={subItem.id}
//                           variant={isSubActive ? "default" : "ghost"}
//                           className={`w-full justify-start h-10 ${
//                             isSubActive
//                               ? "bg-red-600 text-white hover:bg-red-700"
//                               : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                           } ${isCollapsed ? "px-2" : "px-3"}`}
//                           onClick={() => handleNavigation(subItem.path)}
//                         >
//                           {!isCollapsed && <span className="text-sm">{subItem.label}</span>}
//                         </Button>
//                       )
//                     })}
//                   </div>
//                 )}
//               </div>
//             )
//           })}
//         </div>
//       </nav>

//       {/* Footer */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//         <Button
//           variant="ghost"
//           className={`w-full justify-start h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
//             isCollapsed ? "px-2" : "px-3"
//           }`}
//           onClick={onLogout}
//         >
//           <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//           {!isCollapsed && <span className="text-sm">Logout</span>}
//         </Button>
//       </div>
//     </div>
//   )
// }

// "use client";

// import { useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import {
//   Factory,
//   LogOut,
//   Menu,
//   X,
//   Home,
//   Settings,
//   ChevronDown,
//   ChevronRight,
//   ChevronLeft,
// } from "lucide-react";
// import { ThemeToggle } from "../theme-toggle";

// interface DashboardSidebarProps {
//   onLogout: () => void;
//   username: string;
//   onToggle?: (collapsed: boolean) => void;
// }

// const LOGO_URL =
//   "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png";

// export default function DashboardSidebar({
//   onLogout,
//   username,
//   onToggle,
// }: DashboardSidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();
//   const [expandedMenuItems, setExpandedMenuItems] = useState<string[]>([]);

//   type MenuItem = {
//     id: string;
//     label: string;
//     icon: React.ElementType;
//     path: string;
//     subItems?: {
//       id: string;
//       label: string;
//       path: string;
//     }[];
//   };

//   const menuItems: MenuItem[] = [
//     { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },

//     {
//       id: "mpi",
//       label: "MPI",
//       icon: Settings,
//       path: "/dashboard/mpi",
//     },
//     {
//       id: "flow",
//       label: "Assembly Process ",
//       icon: Settings,
//       path: "/dashboard/flow",
//     },
//     {
//       id: "stations",
//       label: "Stations",
//       icon: Factory,
//       path: "/dashboard/stations",
//     },

//   ];

//   const toggleSidebar = () => {
//     const newCollapsedState = !isCollapsed;
//     setIsCollapsed(newCollapsedState);
//     if (onToggle) {
//       onToggle(newCollapsedState);
//     }
//   };

//   const handleNavigation = (path: string) => {
//     router.push(path);
//   };

//   const toggleSubMenu = (itemId: string) => {
//     setExpandedMenuItems((prev) => {
//       if (prev.includes(itemId)) {
//         return prev.filter((id) => id !== itemId);
//       } else {
//         return [...prev, itemId];
//       }
//     });
//   };

//   return (
//     <div
//       className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       } min-h-screen flex flex-col fixed h-full z-10`}
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between">
//           {!isCollapsed && (
//             <Image
//               src={LOGO_URL || "/placeholder.svg"}
//               alt="Meritronics Logo"
//               width={120}
//               height={32}
//               className="h-auto"
//             />
//           )}
       
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={toggleSidebar}
//             className="p-1 h-8 w-8"
//           >
//             {isCollapsed ? (
//               <ChevronRight className="h-4 w-4" />
//             ) : (
//               <ChevronLeft className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
      
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = pathname === item.path;
//             const hasSubItems = item.subItems && item.subItems.length > 0;
//             const isExpanded = expandedMenuItems.includes(item.id);

//             return (
//               <div key={item.id}>
//                 <Button
//                   variant={isActive ? "default" : "ghost"}
//                   className={`w-full justify-start h-10 ${
//                     isActive
//                       ? "bg-red-600 text-white hover:bg-red-700"
//                       : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   } ${isCollapsed ? "px-2" : "px-3"} ${
//                     hasSubItems ? "flex items-center" : ""
//                   }`}
//                   onClick={() => {
//                     handleNavigation(item.path);

//                     if (hasSubItems) {
//                       toggleSubMenu(item.id);
//                     }
//                   }}
//                 >
//                   <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//                   {!isCollapsed && (
//                     <span className="text-sm">{item.label}</span>
//                   )}
//                   {hasSubItems && (
//                     <div className="ml-auto">
//                       {isExpanded ? (
//                         <ChevronDown className="h-3 w-3" />
//                       ) : (
//                         <ChevronRight className="h-3 w-3" />
//                       )}
//                     </div>
//                   )}
//                 </Button>
//                 {hasSubItems && isExpanded && (
//                   <div className="space-y-2 pl-4">
//                     {item.subItems.map((subItem) => {
//                       const isSubActive = pathname === subItem.path;

//                       return (
//                         <Button
//                           key={subItem.id}
//                           variant={isSubActive ? "default" : "ghost"}
//                           className={`w-full justify-start h-10 ${
//                             isSubActive
//                               ? "bg-red-600 text-white hover:bg-red-700"
//                               : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                           } ${isCollapsed ? "px-2" : "px-3"}`}
//                           onClick={() => handleNavigation(subItem.path)}
//                         >
//                           {!isCollapsed && (
//                             <span className="text-sm">{subItem.label}</span>
//                           )}
//                         </Button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </nav>

//       <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
//         <Button
//           variant="ghost"
//           className={`justify-start h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
//             isCollapsed ? "w-10 p-0" : "w-auto px-3"
//           }`}
//           onClick={onLogout}
//         >
//           <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//           {!isCollapsed && <span className="text-sm">Logout</span>}
//         </Button>
//       </div>
//     </div>
//   );
// }

















// "use client";

// import { useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import {
//   Factory,
//   LogOut,
//   Menu,
//   X,
//   Home,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
// } from "lucide-react";
// import { ThemeToggle } from "../theme-toggle";

// interface DashboardSidebarProps {
//   onLogout: () => void;
//   username: string;
//   onToggle?: (collapsed: boolean) => void;
// }

// const LOGO_URL =
//   "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png";

// export default function DashboardSidebar({
//   onLogout,
//   username,
//   onToggle,
// }: DashboardSidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();

//   type MenuItem = {
//     id: string;
//     label: string;
//     icon: React.ElementType;
//     path: string;
//   };

//   const menuItems: MenuItem[] = [
//     { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
//     { id: "mpi", label: "MPI", icon: Settings, path: "/dashboard/mpi" },
//     { id: "flow", label: "Assembly Process", icon: Settings, path: "/dashboard/flow" },
//     { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations" },
//     { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" }, // ✅ New Settings item
//   ];

//   const toggleSidebar = () => {
//     const newCollapsedState = !isCollapsed;
//     setIsCollapsed(newCollapsedState);
//     if (onToggle) {
//       onToggle(newCollapsedState);
//     }
//   };

//   const handleNavigation = (path: string) => {
//     router.push(path);
//   };

//   return (
//     <div
//       className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       } min-h-screen flex flex-col fixed h-full z-10`}
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between">
//           {!isCollapsed && (
//             <Image
//               src={LOGO_URL || "/placeholder.svg"}
//               alt="Meritronics Logo"
//               width={120}
//               height={32}
//               className="h-auto"
//             />
//           )}

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={toggleSidebar}
//             className="p-1 h-8 w-8"
//           >
//             {isCollapsed ? (
//               <ChevronRight className="h-4 w-4" />
//             ) : (
//               <ChevronLeft className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = pathname === item.path;

//             return (
//               <Button
//                 key={item.id}
//                 variant={isActive ? "default" : "ghost"}
//                 className={`w-full justify-start h-10 ${
//                   isActive
//                     ? "bg-red-600 text-white hover:bg-red-700"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 } ${isCollapsed ? "px-2" : "px-3"}`}
//                 onClick={() => handleNavigation(item.path)}
//               >
//                 <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//                 {!isCollapsed && <span className="text-sm">{item.label}</span>}
//               </Button>
//             );
//           })}
//         </div>
//       </nav>

//       {/* Logout */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
//         <Button
//           variant="ghost"
//           className={`justify-start h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
//             isCollapsed ? "w-10 p-0" : "w-auto px-3"
//           }`}
//           onClick={onLogout}
//         >
//           <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//           {!isCollapsed && <span className="text-sm">Logout</span>}
//         </Button>
//       </div>
//     </div>
//   );
// }





// "use client"

// import { useEffect, useState } from "react"
// import { usePathname, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import {
//   Factory,
//   LogOut,
//   Home,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
//   Wrench,
//   Activity,
// } from "lucide-react"

// const LOGO_URL =
//   "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png"

// interface DashboardSidebarProps {
//   onLogout: () => void
//   username: string
//   onToggle?: (collapsed: boolean) => void
// }

// type MenuItem = {
//   id: string
//   label: string
//   icon: React.ElementType
//   path: string
// }

// // All possible menu items
// const allMenuItems: MenuItem[] = [
//   { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
//   { id: "mpi", label: "MPI", icon: Wrench, path: "/dashboard/mpi" },
//   { id: "flow", label: "Assembly Process", icon: Activity, path: "/dashboard/flow" },
//   { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations" },
//   { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
// ]

// // Permissions per designation
// const permissionMap: Record<string, string[]> = {
//   account: ["dashboard", "settings"],
//   engineer: ["dashboard", "mpi", "stations"],
//   manager: ["dashboard", "mpi", "flow", "stations", "settings"],
//   admin: ["dashboard", "mpi", "flow", "stations", "settings"],
// }

// export default function DashboardSidebar({
//   onLogout,
//   username,
//   onToggle,
// }: DashboardSidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [designationPermissions, setDesignationPermissions] = useState<string[]>([])
//   const pathname = usePathname()
//   const router = useRouter()

//   // Load permissions from localStorage
//   useEffect(() => {
//     // const designation = localStorage.getItem("designation") || "account"
//     const designation = (localStorage.getItem("designation") || "account").toLowerCase()

//     setDesignationPermissions(permissionMap[designation] || [])
//   }, [])

//   const menuItems = allMenuItems.filter((item) =>
//     designationPermissions.includes(item.id)
//   )

//   const toggleSidebar = () => {
//     const newState = !isCollapsed
//     setIsCollapsed(newState)
//     if (onToggle) onToggle(newState)
//   }

//   const handleNavigation = (path: string) => {
//     router.push(path)
//   }

//   return (
//     <div
//       className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       } min-h-screen flex flex-col fixed h-full z-10`}
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between">
//           {!isCollapsed && (
//             <Image
//               src={LOGO_URL}
//               alt="Meritronics Logo"
//               width={120}
//               height={32}
//               className="h-auto"
//             />
//           )}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={toggleSidebar}
//             className="p-1 h-8 w-8"
//           >
//             {isCollapsed ? (
//               <ChevronRight className="h-4 w-4" />
//             ) : (
//               <ChevronLeft className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.path

//             return (
//               <Button
//                 key={item.id}
//                 variant={isActive ? "default" : "ghost"}
//                 className={`w-full justify-start h-10 ${
//                   isActive
//                     ? "bg-red-600 text-white hover:bg-red-700"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 } ${isCollapsed ? "px-2" : "px-3"}`}
//                 onClick={() => handleNavigation(item.path)}
//               >
//                 <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//                 {!isCollapsed && <span className="text-sm">{item.label}</span>}
//               </Button>
//             )
//           })}
//         </div>
//       </nav>

//       {/* Logout */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
//         <Button
//           variant="ghost"
//           className={`justify-start h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
//             isCollapsed ? "w-10 p-0" : "w-auto px-3"
//           }`}
//           onClick={onLogout}
//         >
//           <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//           {!isCollapsed && <span className="text-sm">Logout</span>}
//         </Button>
//       </div>
//     </div>
//   )
// }
















// "use client"

// import { useEffect, useState } from "react"
// import { usePathname, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import {
//   Factory,
//   LogOut,
//   Home,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
//   Wrench,
//   Activity,
//   UserCircle,
// } from "lucide-react"

// const LOGO_URL =
//   "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png"

// interface DashboardSidebarProps {
//   onLogout: () => void
//   username: string
//   onToggle?: (collapsed: boolean) => void
// }

// type MenuItem = {
//   id: string
//   label: string
//   icon: React.ElementType
//   path: string
// }

// // All possible menu items
// const allMenuItems: MenuItem[] = [
//   { id: "view", label: "Dashboard", icon: Home, path: "/dashboard" },
//   { id: "edit", label: "MPI", icon: Wrench, path: "/dashboard/mpi" },
//   { id: "flow", label: "Assembly Process", icon: Activity, path: "/dashboard/flow" },
//   { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations" },
//   { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
// ]

// export default function DashboardSidebar({
//   onLogout,
//   username,
//   onToggle,
// }: DashboardSidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [designationPermissions, setDesignationPermissions] = useState<string[]>([])
//  const [storedUsername, setStoredUsername] = useState("")
// const [designation, setDesignation] = useState("")

//   const pathname = usePathname()
//   const router = useRouter()

//   // Load permissions and username from localStorage
//   useEffect(() => {
//     const storedPermissions = localStorage.getItem("permissions")
//     if (storedPermissions) {
//       try {
//         const parsedPermissions = JSON.parse(storedPermissions) as string[]
//         setDesignationPermissions(parsedPermissions)
//       } catch (err) {
//         console.error("Failed to parse permissions from localStorage", err)
//       }
//     }

//    const localUsername = localStorage.getItem("username")
// const localDesignation = localStorage.getItem("designation")
// if (localUsername) setStoredUsername(localUsername)
// if (localDesignation) setDesignation(localDesignation)

//   }, [])

//   const menuItems = allMenuItems.filter((item) =>
//     designationPermissions.includes(item.id)
//   )

//   const toggleSidebar = () => {
//     const newState = !isCollapsed
//     setIsCollapsed(newState)
//     if (onToggle) onToggle(newState)
//   }

//   const handleNavigation = (path: string) => {
//     router.push(path)
//   }

//   return (
//     <div
//       className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       } min-h-screen flex flex-col fixed h-full z-10`}
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between">
//           {!isCollapsed && (
//             <Image
//               src={LOGO_URL}
//               alt="Meritronics Logo"
//               width={120}
//               height={32}
//               className="h-auto"
//             />
//           )}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={toggleSidebar}
//             className="p-1 h-8 w-8"
//           >
//             {isCollapsed ? (
//               <ChevronRight className="h-4 w-4" />
//             ) : (
//               <ChevronLeft className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* Username display */}
//      {/* Username & Designation display */}
// {!isCollapsed && (storedUsername || designation) && (
//   <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
//     <div className="flex items-center gap-2">
//       <UserCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//       <div>
//         <div className="font-medium truncate">{storedUsername}</div>
//         {designation && <div className="text-xs text-gray-500 capitalize">{designation}</div>}
//       </div>
//     </div>
//   </div>
// )}


//       {/* Navigation */}
//       <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.path

//             return (
//               <Button
//                 key={item.id}
//                 variant={isActive ? "default" : "ghost"}
//                 className={`w-full justify-start h-10 ${
//                   isActive
//                     ? "bg-red-600 text-white hover:bg-red-700"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 } ${isCollapsed ? "px-2" : "px-3"}`}
//                 onClick={() => handleNavigation(item.path)}
//               >
//                 <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//                 {!isCollapsed && <span className="text-sm">{item.label}</span>}
//               </Button>
//             )
//           })}
//         </div>
//       </nav>

//       {/* Logout */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
//         <Button
//           variant="ghost"
//           className={`justify-start h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
//             isCollapsed ? "w-10 p-0" : "w-auto px-3"
//           }`}
//           onClick={onLogout}
//         >
//           <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//           {!isCollapsed && <span className="text-sm">Logout</span>}
//         </Button>
//       </div>
//     </div>
//   )
// }















// "use client"

// import { useEffect, useState } from "react"
// import { usePathname, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import {
//   Factory,
//   LogOut,
//   Home,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
//   Wrench,
//   Activity,
//   UserCircle,
// } from "lucide-react"

// const LOGO_URL =
//   "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png"

// interface DashboardSidebarProps {
//   onLogout: () => void
//   username: string
//   onToggle?: (collapsed: boolean) => void
// }

// type MenuItem = {
//   id: string
//   label: string
//   icon: React.ElementType
//   path: string
// }

// // All possible menu items
// const allMenuItems: MenuItem[] = [
//   { id: "view", label: "Dashboard", icon: Home, path: "/dashboard" },
//   { id: "edit", label: "MPI", icon: Wrench, path: "/dashboard/mpi" },
//   { id: "flow", label: "Assembly Process", icon: Activity, path: "/dashboard/flow" },
//   { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations" },
//   { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
// ]

// // ✅ Permissions by designation
// const rolePermissionMap: Record<string, string[]> = {
//   admin: ["view", "edit", "flow", "stations", "settings"],
//   manager: ["view", "edit", "flow", "stations", "settings"],
//   engineer: ["view", "edit", "stations"],
//   account: ["view", "settings"],
// }

// export default function DashboardSidebar({
//   onLogout,
//   username,
//   onToggle,
// }: DashboardSidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [designationPermissions, setDesignationPermissions] = useState<string[]>([])
//   const [storedUsername, setStoredUsername] = useState("")
//   const [designation, setDesignation] = useState("")

//   const pathname = usePathname()
//   const router = useRouter()

//   useEffect(() => {
//     const localDesignation = localStorage.getItem("designation")?.toLowerCase() || "account"
//     setDesignationPermissions(rolePermissionMap[localDesignation] || [])

//     const localUsername = localStorage.getItem("username")
//     if (localUsername) setStoredUsername(localUsername)
//     if (localDesignation) setDesignation(localDesignation)
//   }, [])

//   const menuItems = allMenuItems.filter((item) =>
//     designationPermissions.includes(item.id)
//   )

//   const toggleSidebar = () => {
//     const newState = !isCollapsed
//     setIsCollapsed(newState)
//     if (onToggle) onToggle(newState)
//   }

//   const handleNavigation = (path: string) => {
//     router.push(path)
//   }

//   return (
//     <div
//       className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       } min-h-screen flex flex-col fixed h-full z-10`}
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between">
//           {!isCollapsed && (
//             <Image
//               src={LOGO_URL}
//               alt="Meritronics Logo"
//               width={120}
//               height={32}
//               className="h-auto"
//             />
//           )}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={toggleSidebar}
//             className="p-1 h-8 w-8"
//           >
//             {isCollapsed ? (
//               <ChevronRight className="h-4 w-4" />
//             ) : (
//               <ChevronLeft className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* Username & Designation display */}
//       {!isCollapsed && (storedUsername || designation) && (
//         <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex items-center gap-2">
//             <UserCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//             <div>
//               <div className="font-medium truncate">{storedUsername}</div>
//               {designation && (
//                 <div className="text-xs text-gray-500 capitalize">{designation}</div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.path

//             return (
//               <Button
//                 key={item.id}
//                 variant={isActive ? "default" : "ghost"}
//                 className={`w-full justify-start h-10 ${
//                   isActive
//                     ? "bg-red-600 text-white hover:bg-red-700"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 } ${isCollapsed ? "px-2" : "px-3"}`}
//                 onClick={() => handleNavigation(item.path)}
//               >
//                 <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//                 {!isCollapsed && <span className="text-sm">{item.label}</span>}
//               </Button>
//             )
//           })}
//         </div>
//       </nav>

//       {/* Logout */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
//         <Button
//           variant="ghost"
//           className={`justify-start h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
//             isCollapsed ? "w-10 p-0" : "w-auto px-3"
//           }`}
//           onClick={onLogout}
//         >
//           <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//           {!isCollapsed && <span className="text-sm">Logout</span>}
//         </Button>
//       </div>
//     </div>
//   )
// }


















// "use client"

// import { useEffect, useState } from "react"
// import { usePathname, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import {
//   Factory,
//   LogOut,
//   Home,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
//   Wrench,
//   Activity,
//   UserCircle,
// } from "lucide-react"

// const LOGO_URL =
//   "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png"

// interface DashboardSidebarProps {
//   onLogout: () => void
//   username: string
//   onToggle?: (collapsed: boolean) => void
// }

// type MenuItem = {
//   id: string
//   label: string
//   icon: React.ElementType
//   path: string
// }

// // All possible menu items
// const allMenuItems: MenuItem[] = [
//   { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
//   { id: "mpi", label: "MPI", icon: Wrench, path: "/dashboard/mpi" },
//   { id: "flow", label: "Assembly Process", icon: Activity, path: "/dashboard/flow" },
//   { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations" },
//   { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
// ]

// export default function DashboardSidebar({
//   onLogout,
//   username,
//   onToggle,
// }: DashboardSidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [allowedMenus, setAllowedMenus] = useState<string[]>([])
//   const [storedUsername, setStoredUsername] = useState("")
//   const [designation, setDesignation] = useState("")

//   const pathname = usePathname()
//   const router = useRouter()

//   useEffect(() => {
//     const menus = localStorage.getItem("menus")
//     const parsedMenus = menus ? JSON.parse(menus) : []

//     setAllowedMenus(parsedMenus)
//     setStoredUsername(localStorage.getItem("username") || "")
//     setDesignation(localStorage.getItem("designation") || "")
//   }, [])

//   const menuItems = allMenuItems.filter((item) =>
//     allowedMenus.includes(item.id)
//   )

//   const toggleSidebar = () => {
//     const newState = !isCollapsed
//     setIsCollapsed(newState)
//     if (onToggle) onToggle(newState)
//   }

//   const handleNavigation = (path: string) => {
//     router.push(path)
//   }

//   return (
//     <div
//       className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       } min-h-screen flex flex-col fixed h-full z-10`}
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between">
//           {!isCollapsed && (
//             <Image
//               src={LOGO_URL}
//               alt="Meritronics Logo"
//               width={120}
//               height={32}
//               className="h-auto"
//             />
//           )}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={toggleSidebar}
//             className="p-1 h-8 w-8"
//           >
//             {isCollapsed ? (
//               <ChevronRight className="h-4 w-4" />
//             ) : (
//               <ChevronLeft className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* Username & Designation display */}
//       {!isCollapsed && (storedUsername || designation) && (
//         <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex items-center gap-2">
//             <UserCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//             <div>
//               <div className="font-medium truncate">{storedUsername}</div>
//               {designation && (
//                 <div className="text-xs text-gray-500 capitalize">{designation}</div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.path

//             return (
//               <Button
//                 key={item.id}
//                 variant={isActive ? "default" : "ghost"}
//                 className={`w-full justify-start h-10 ${
//                   isActive
//                     ? "bg-red-600 text-white hover:bg-red-700"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 } ${isCollapsed ? "px-2" : "px-3"}`}
//                 onClick={() => handleNavigation(item.path)}
//               >
//                 <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//                 {!isCollapsed && <span className="text-sm">{item.label}</span>}
//               </Button>
//             )
//           })}
//         </div>
//       </nav>

//       {/* Logout */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
//         <Button
//           variant="ghost"
//           className={`justify-start h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
//             isCollapsed ? "w-10 p-0" : "w-auto px-3"
//           }`}
//           onClick={onLogout}
//         >
//           <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//           {!isCollapsed && <span className="text-sm">Logout</span>}
//         </Button>
//       </div>
//     </div>
//   )
// }












// "use client"

// import { useEffect, useState } from "react"
// import { usePathname, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import {
//   Factory,
//   LogOut,
//   Home,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
//   Wrench,
//   Activity,
//   UserCircle,
// } from "lucide-react"

// const LOGO_URL =
//   "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png"

// interface DashboardSidebarProps {
//   onLogout: () => void
//   username: string
//   onToggle?: (collapsed: boolean) => void
// }

// type MenuItem = {
//   id: string
//   label: string
//   icon: React.ElementType
//   path: string
// }

// // ✅ All available menu items
// const allMenuItems: MenuItem[] = [
//   { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
//   { id: "mpi", label: "MPI", icon: Wrench, path: "/dashboard/mpi" },
//   { id: "flow", label: "Assembly Process", icon: Activity, path: "/dashboard/flow" },
//   { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations" },
//   { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
// ]

// // ✅ Menus allowed by designation
// const designationToMenuMap: Record<string, string[]> = {
//   admin: ["dashboard", "mpi", "flow", "stations", "settings"],
//   manager: ["dashboard", "mpi", "flow", "stations", "settings"],
//   engineer: ["dashboard", "mpi", "stations"],
//   account: ["dashboard", "settings"],
// }

// export default function DashboardSidebar({
//   onLogout,
//   username,
//   onToggle,
// }: DashboardSidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [allowedMenus, setAllowedMenus] = useState<string[]>([])
//   const [storedUsername, setStoredUsername] = useState("")
//   const [designation, setDesignation] = useState("")

//   const pathname = usePathname()
//   const router = useRouter()

//   useEffect(() => {
//     const localDesignation = localStorage.getItem("designation")?.toLowerCase() || ""
//     const allowed = designationToMenuMap[localDesignation] || []
//     setAllowedMenus(allowed)

//     setStoredUsername(localStorage.getItem("username") || "")
//     setDesignation(localDesignation)
//   }, [])

//   const menuItems = allMenuItems.filter((item) => allowedMenus.includes(item.id))

//   const toggleSidebar = () => {
//     const newState = !isCollapsed
//     setIsCollapsed(newState)
//     if (onToggle) onToggle(newState)
//   }

//   const handleNavigation = (path: string) => {
//     router.push(path)
//   }

//   return (
//     <div
//       className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       } min-h-screen flex flex-col fixed h-full z-10`}
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between">
//           {!isCollapsed && (
//             <Image
//               src={LOGO_URL}
//               alt="Meritronics Logo"
//               width={120}
//               height={32}
//               className="h-auto"
//             />
//           )}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={toggleSidebar}
//             className="p-1 h-8 w-8"
//           >
//             {isCollapsed ? (
//               <ChevronRight className="h-4 w-4" />
//             ) : (
//               <ChevronLeft className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* Username & Designation display */}
//       {!isCollapsed && (storedUsername || designation) && (
//         <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex items-center gap-2">
//             <UserCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//             <div>
//               <div className="font-medium truncate">{storedUsername}</div>
//               {designation && (
//                 <div className="text-xs text-gray-500 capitalize">{designation}</div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.path

//             return (
//               <Button
//                 key={item.id}
//                 variant={isActive ? "default" : "ghost"}
//                 className={`w-full justify-start h-10 ${
//                   isActive
//                     ? "bg-red-600 text-white hover:bg-red-700"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 } ${isCollapsed ? "px-2" : "px-3"}`}
//                 onClick={() => handleNavigation(item.path)}
//               >
//                 <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//                 {!isCollapsed && <span className="text-sm">{item.label}</span>}
//               </Button>
//             )
//           })}
//         </div>
//       </nav>

//       {/* Logout */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
//         <Button
//           variant="ghost"
//           className={`justify-start h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
//             isCollapsed ? "w-10 p-0" : "w-auto px-3"
//           }`}
//           onClick={onLogout}
//         >
//           <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//           {!isCollapsed && <span className="text-sm">Logout</span>}
//         </Button>
//       </div>
//     </div>
//   )
// }










// "use client"

// import { useEffect, useState } from "react"
// import { usePathname, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import {
//   Factory,
//   LogOut,
//   Home,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
//   Wrench,
//   Activity,
//   UserCircle,
// } from "lucide-react"

// const LOGO_URL = "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png"

// interface DashboardSidebarProps {
//   onLogout: () => void
//   username: string
//   onToggle?: (collapsed: boolean) => void
// }

// type MenuItem = {
//   id: string
//   label: string
//   icon: React.ElementType
//   path: string
// }

// const allMenuItems: MenuItem[] = [
//   { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
//   { id: "mpi", label: "MPI", icon: Wrench, path: "/dashboard/mpi" },
//   { id: "flow", label: "Assembly Process", icon: Activity, path: "/dashboard/flow" },
//   { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations" },
//   { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
// ]

// const designationToMenuMap: Record<string, string[]> = {
//   admin: ["dashboard", "mpi", "flow", "stations", "settings"],
//   manager: ["dashboard", "mpi", "flow", "stations", "settings"],
//   engineer: ["dashboard", "mpi", "stations"],
//   account: ["dashboard", "settings"],
// }

// export default function DashboardSidebar({ onLogout, username, onToggle }: DashboardSidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [allowedMenus, setAllowedMenus] = useState<string[]>([])
//   const [storedUsername, setStoredUsername] = useState("")
//   const [designation, setDesignation] = useState("")

//   const pathname = usePathname()
//   const router = useRouter()

//   useEffect(() => {
//     const localDesignation = (localStorage.getItem("designation") || "").toLowerCase()
//     const allowed = designationToMenuMap[localDesignation] || []
//     setAllowedMenus(allowed)
//     setStoredUsername(localStorage.getItem("username") || "")
//     setDesignation(localDesignation)
//   }, [])

//   const menuItems = allMenuItems.filter((item) => allowedMenus.includes(item.id))

//   const toggleSidebar = () => {
//     const newState = !isCollapsed
//     setIsCollapsed(newState)
//     if (onToggle) onToggle(newState)
//   }

//   const handleNavigation = (path: string) => {
//     router.push(path)
//   }

//   return (
//     <div
//       className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       } min-h-screen flex flex-col fixed h-full z-10`}
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between">
//           {!isCollapsed && (
//             <Image src={LOGO_URL} alt="Meritronics Logo" width={120} height={32} className="h-auto" />
//           )}
//           <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1 h-8 w-8">
//             {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       </div>

//       {/* Username & Designation */}
//       {!isCollapsed && (storedUsername || designation) && (
//         <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex items-center gap-2">
//             <UserCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//             <div>
//               <div className="font-medium truncate">{storedUsername}</div>
//               {designation && <div className="text-xs text-gray-500 capitalize">{designation}</div>}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.path

//             return (
//               <Button
//                 key={item.id}
//                 variant={isActive ? "default" : "ghost"}
//                 className={`w-full justify-start h-10 ${
//                   isActive
//                     ? "bg-red-600 text-white hover:bg-red-700"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 } ${isCollapsed ? "px-2" : "px-3"}`}
//                 onClick={() => handleNavigation(item.path)}
//               >
//                 <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//                 {!isCollapsed && <span className="text-sm">{item.label}</span>}
//               </Button>
//             )
//           })}
//         </div>
//       </nav>

//       {/* Logout */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
//         <Button
//           variant="ghost"
//           className={`justify-start h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
//             isCollapsed ? "w-10 p-0" : "w-auto px-3"
//           }`}
//           onClick={onLogout}
//         >
//           <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//           {!isCollapsed && <span className="text-sm">Logout</span>}
//         </Button>
//       </div>
//     </div>
//   )
// }












// "use client"

// import { useState } from "react"
// import { usePathname, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import {
//   Factory,
//   LogOut,
//   Home,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
//   Wrench,
//   Activity,
//   UserCircle,
// } from "lucide-react"

// import { usePermissions } from "@/components/context/PermissionContext"

// const LOGO_URL = "https://lywntqaqlut34qdw.public.blob.vercel-storage.com/meritronics/meritronicslogo-zHESzsSyaFlGrO1eTUJsvdmqYV0AnT.png"

// interface DashboardSidebarProps {
//   onLogout: () => void
//   username: string
//   onToggle?: (collapsed: boolean) => void
// }

// type MenuItem = {
//   id: string
//   label: string
//   icon: React.ElementType
//   path: string
// }

// const allMenuItems: MenuItem[] = [
//   { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
//   { id: "mpi", label: "MPI", icon: Wrench, path: "/dashboard/mpi" },
//   { id: "flow", label: "Assembly Process", icon: Activity, path: "/dashboard/flow" },
//   { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations" },
//   { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
// ]

// const designationToMenuMap: Record<string, string[]> = {
//   admin: ["dashboard", "mpi", "flow", "stations", "settings"],
//   manager: ["dashboard", "mpi", "flow", "stations", "settings"],
//   engineer: ["dashboard", "mpi", "stations"],
//   account: ["dashboard", "settings"],
// }

// export default function DashboardSidebar({ onLogout, username, onToggle }: DashboardSidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const { designation } = usePermissions()  // Get from context

//   const pathname = usePathname()
//   const router = useRouter()

//   // Use designation from context, fallback to empty string
//   const allowedMenus = designationToMenuMap[designation?.toLowerCase() || ""] || []

//   const menuItems = allMenuItems.filter((item) => allowedMenus.includes(item.id))

//   const toggleSidebar = () => {
//     const newState = !isCollapsed
//     setIsCollapsed(newState)
//     if (onToggle) onToggle(newState)
//   }

//   const handleNavigation = (path: string) => {
//     router.push(path)
//   }

//   return (
//     <div
//       className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       } min-h-screen flex flex-col fixed h-full z-10`}
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between">
//           {!isCollapsed && (
//             <Image src={LOGO_URL} alt="Meritronics Logo" width={120} height={32} className="h-auto" />
//           )}
//           <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1 h-8 w-8">
//             {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       </div>

//       {/* Username & Designation */}
//       {!isCollapsed && (
//         <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex items-center gap-2">
//             <UserCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//             <div>
//               <div className="font-medium truncate">{username}</div>
//               {designation && <div className="text-xs text-gray-500 capitalize">{designation}</div>}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.path

//             return (
//               <Button
//                 key={item.id}
//                 variant={isActive ? "default" : "ghost"}
//                 className={`w-full justify-start h-10 ${
//                   isActive
//                     ? "bg-red-600 text-white hover:bg-red-700"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 } ${isCollapsed ? "px-2" : "px-3"}`}
//                 onClick={() => handleNavigation(item.path)}
//               >
//                 <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//                 {!isCollapsed && <span className="text-sm">{item.label}</span>}
//               </Button>
//             )
//           })}
//         </div>
//       </nav>

//       {/* Logout */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
//         <Button
//           variant="ghost"
//           className={`justify-start h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
//             isCollapsed ? "w-10 p-0" : "w-auto px-3"
//           }`}
//           onClick={onLogout}
//         >
//           <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//           {!isCollapsed && <span className="text-sm">Logout</span>}
//         </Button>
//       </div>
//     </div>
//   )
// }
























// "use client"

// import { useState } from "react"
// import { usePathname, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import {
//   Factory,
//   LogOut,
//   Home,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
//   Wrench,
//   Activity,
//   UserCircle,
// } from "lucide-react"

// import { usePermissions } from "@/components/context/PermissionContext"

// const LOGO_URL = "/logo.svg"

// interface DashboardSidebarProps {
//   onLogout: () => void
//   username: string
//   onToggle?: (collapsed: boolean) => void
// }

// type MenuItem = {
//   id: string
//   label: string
//   icon: React.ElementType
//   path: string
// }

// const allMenuItems: MenuItem[] = [
//   { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
//   { id: "mpi", label: "MPI", icon: Wrench, path: "/dashboard/mpi" },
//   { id: "flow", label: "Assembly Process", icon: Activity, path: "/dashboard/flow" },
//   { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations" },
//   { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
// ]

// const designationToMenuMap: Record<string, string[]> = {
//   admin: ["dashboard", "mpi", "flow", "stations", "settings"],
//   manager: ["dashboard", "mpi", "flow", "stations", "settings"],
//   engineer: ["dashboard", "mpi", "stations"],
//   account: ["dashboard", "settings"],
// }

// export default function DashboardSidebar({ onLogout, username, onToggle }: DashboardSidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const { designation } = usePermissions()

//   const pathname = usePathname()
//   const router = useRouter()

//   const allowedMenus = designationToMenuMap[designation?.toLowerCase() || ""] || []
//   const menuItems = allMenuItems.filter((item) => allowedMenus.includes(item.id))

//   const toggleSidebar = () => {
//     const newState = !isCollapsed
//     setIsCollapsed(newState)
//     if (onToggle) onToggle(newState)
//   }

//   const handleNavigation = (path: string) => {
//     router.push(path)
//   }

//   return (
//     <div
//     className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
//       isCollapsed ? "w-16" : "w-64"
//     } min-h-screen flex flex-col fixed h-full z-10 transition-[width] duration-300`}
//     style={{ backgroundColor: "white" }}
//   >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex items-center justify-between">
//           {!isCollapsed && (
//             <Image src={LOGO_URL} alt="Network Logo" width={120} height={32} className="h-auto" />
//           )}
//           <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1 h-8 w-8">
//             {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       </div>

//       {/* Username & Designation */}
//       {!isCollapsed && (
//         <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex items-center gap-2">
//             <UserCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//             <div>
//               <div className="font-medium truncate">{username}</div>
//               {designation && <div className="text-xs text-gray-500 capitalize">{designation}</div>}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             const isActive = pathname === item.path

//             return (
//               <Button
//                 key={item.id}
//                 variant={isActive ? "default" : "ghost"}
//                 className={`w-full justify-start h-10 ${
//                   isActive
//                     ? "bg-green-600 text-white hover:bg-green-700"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 } ${isCollapsed ? "px-2" : "px-3"}`}
//                 onClick={() => handleNavigation(item.path)}
//               >
//                 <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//                 {!isCollapsed && <span className="text-sm">{item.label}</span>}
//               </Button>
//             )
//           })}
//         </div>
//       </nav>

//       {/* Logout */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
//         <Button
//           variant="ghost"
//           className={`justify-start h-10 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 ${
//             isCollapsed ? "w-10 p-0" : "w-auto px-3"
//           }`}
//           onClick={onLogout}
//         >
//           <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//           {!isCollapsed && <span className="text-sm">Sign Out</span>}
//         </Button>
//       </div>
//     </div>
//   )
// }





// "use client"

// import { useState } from "react"
// import { usePathname, useRouter } from "next/navigation"
// import {
//   Home,
//   Wrench,
//   Activity,
//   Factory,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
//   UserCircle,
//   LogOut,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"

// const LOGO_URL = "/logo.svg"

// const MENU_ITEMS = [
//   { id: "dashboard", label: "Dashboard",           icon: Home,     path: "/dashboard" },
//   { id: "mpi",       label: "MPI",                 icon: Wrench,   path: "/dashboard/mpi" },
//   { id: "flow",      label: "Assembly Process",    icon: Activity, path: "/dashboard/flow" },
//   { id: "stations",  label: "Stations",            icon: Factory,  path: "/dashboard/stations" },
//   { id: "settings",  label: "Settings",            icon: Settings, path: "/dashboard/settings" },
// ] as const

// const ROLE_MENU_MAP: Record<string, string[]> = {
//   admin   : ["dashboard", "mpi", "flow", "stations", "settings"],
//   manager : ["dashboard", "mpi", "flow", "stations", "settings"],
//   engineer: ["dashboard", "mpi", "stations"],
//   account : ["dashboard", "settings"],
// }

// const MENU_PERM_MAP: Record<string, string> = {
//   dashboard: "dashboard:view",
//   mpi      : "mpi:view",
//   flow     : "flow:view",
//   stations : "station:view",
//   settings : "settings:view",
// }

// interface Props {
//   onLogout: () => void
//   username: string
//   onToggle?: (collapsed: boolean) => void
// }

// export default function DashboardSidebar({ onLogout, username, onToggle }: Props) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const pathname = usePathname()
//   const router   = useRouter()

//   /* ─── read role & permissions saved in LoginForm ──────────────── */
//   const role = (typeof window !== "undefined" ? localStorage.getItem("role") : "")?.toLowerCase() ?? ""

//   const permissions: string[] =
//     typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem("permissions") || "[]")
//       : []

//   /* ─── build allowed menu list (role union permissions) ────────── */
//   const roleMenus   = new Set(ROLE_MENU_MAP[role] ?? [])

//   permissions.forEach((perm) => {
//     const menuId = Object.entries(MENU_PERM_MAP).find(([, p]) => p === perm)?.[0]
//     if (menuId) roleMenus.add(menuId)
//   })

//   const menuItems = MENU_ITEMS.filter((m) => roleMenus.has(m.id))

//   /* ─── handlers ────────────────────────────────────────────────── */
//   const toggleSidebar = () => {
//     const next = !isCollapsed
//     setIsCollapsed(next)
//     onToggle?.(next)
//   }

//   const go = (path: string) => router.push(path)

//   /* ─── render ──────────────────────────────────────────────────── */
//   return (
//     <div
//       className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
//         isCollapsed ? "w-16" : "w-64"
//       } min-h-screen flex flex-col fixed h-full z-10 transition-[width] duration-300`}
//     >
//       {/* header */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//         {!isCollapsed && <Image src={LOGO_URL} alt="Logo" width={120} height={32} priority />}
//         <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1 h-8 w-8">
//           {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//         </Button>
//       </div>

//       {/* user info */}
//       {!isCollapsed && (
//         <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex items-center gap-2">
//             <UserCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
//           {menuItems.map(({ id, label, icon: Icon, path }) => {
//             const active = pathname === path
//             return (
//               <Button
//                 key={id}
//                 variant={active ? "default" : "ghost"}
//                 className={`w-full justify-start h-10 ${
//                   active
//                     ? "bg-green-600 text-white hover:bg-green-700"
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 } ${isCollapsed ? "px-2" : "px-3"}`}
//                 onClick={() => go(path)}
//               >
//                 <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//                 {!isCollapsed && <span className="text-sm">{label}</span>}
//               </Button>
//             )
//           })}
//         </div>
//       </nav>

//       {/* logout */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//         <Button
//           variant="ghost"
//           className={`justify-start h-10 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 ${
//             isCollapsed ? "w-10 p-0" : "w-auto px-3"
//           }`}
//           onClick={onLogout}
//         >
//           <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
//           {!isCollapsed && <span className="text-sm">Sign Out</span>}
//         </Button>
//       </div>
//     </div>
//   )
// }









"use client"

import { useState, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Home, Wrench, Activity, Factory, Settings,
  ChevronRight, ChevronLeft, UserCircle, LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const LOGO_URL = "/logo.svg"

type MenuDef = {
  id: string
  label: string
  icon: any
  path: string
  roles?: string[]         // optional role whitelist
  perms?: string[]         // optional permission whitelist
}

const MENUS: MenuDef[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard",
    roles: ["admin","manager","engineer","account"],
    },

  { id: "mpi", label: "MPI", icon: Wrench, path: "/dashboard/mpi",
    roles: ["admin","manager","engineer"],
     },

  { id: "flow", label: "Assembly Process", icon: Activity, path: "/dashboard/flow",
    roles: ["admin","manager"],
   },

  { id: "stations", label: "Stations", icon: Factory, path: "/dashboard/stations",
    roles: ["admin","manager","engineer"],
    },

  { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings",
    roles: ["admin","manager"],
   },
]

function getAllowedMenuItems(role: string, perms: string[]): MenuDef[] {
  return MENUS.filter(m => {
    const okByRole  = !m.roles || m.roles.includes(role)
    const okByPerms = !m.perms || m.perms.every(p => perms.includes(p))
    return okByRole && okByPerms       // union logic
  })
}

export default function DashboardSidebar({
  onLogout, username, onToggle,
}: { onLogout: () => void; username: string; onToggle?: (c:boolean)=>void }) {

  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname  = usePathname()
  const router    = useRouter()

  const role  = (typeof window !== "undefined" ? localStorage.getItem("role") : "")?.toLowerCase() ?? ""
  const perms = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("permissions") || "[]")
      : []

  const menuItems = useMemo(() => getAllowedMenuItems(role, perms), [role, perms])

  const toggle  = () => { const c=!isCollapsed; setIsCollapsed(c); onToggle?.(c) }
  const go      = (p:string) => router.push(p)

  return (
    <div className={`bg-white dark:bg-gray-800 border-r ${
      isCollapsed ? "w-16" : "w-64"} min-h-screen flex flex-col fixed h-full z-10 transition-[width] duration-300`}>

      {/* header */}
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && <Image src={LOGO_URL} alt="Logo" width={120} height={32} priority />}
        <Button variant="ghost" size="sm" onClick={toggle} className="p-1 h-8 w-8">
          {isCollapsed ? <ChevronRight className="h-4 w-4"/> : <ChevronLeft className="h-4 w-4"/>}
        </Button>
      </div>

      {/* user */}
      {!isCollapsed && (
        <div className="px-4 py-2 text-sm border-b">
          <div className="flex items-center gap-2">
            <UserCircle className="w-4 h-4"/>
            <div>
              <div className="font-medium truncate">{username}</div>
              {role && <div className="text-xs text-gray-500 capitalize">{role}</div>}
            </div>
          </div>
        </div>
      )}

      {/* navigation */}
      <nav className="flex-1 p-4 overflow-hidden hover:overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map(({ id,label,icon:Icon,path }) => {
            const active = pathname === path
            return (
              <Button key={id}
                variant={active?"default":"ghost"}
                className={`w-full justify-start h-10 ${
                  active
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isCollapsed ? "px-2" : "px-3"}`}
                onClick={() => go(path)}>
                <Icon className={`h-4 w-4 ${isCollapsed? "" : "mr-3"}`}/>
                {!isCollapsed && <span className="text-sm">{label}</span>}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* logout */}
      <div className="p-4 border-t">
        <Button variant="ghost"
          className={`justify-start h-10 text-green-600 hover:bg-green-50 ${
            isCollapsed ? "w-10 p-0" : "w-auto px-3"}`} onClick={onLogout}>
          <LogOut className={`h-4 w-4 ${isCollapsed?"":"mr-3"}`}/>
          {!isCollapsed && <span className="text-sm">Sign Out</span>}
        </Button>
      </div>
    </div>
  )
}



