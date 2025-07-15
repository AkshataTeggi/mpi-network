// "use client"

// import DashboardSidebar from "@/components/dashboard/sidebar"
// import type React from "react"
// import { useState } from "react"

// interface DashboardLayoutProps {
//   children: React.ReactNode
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [username] = useState("Admin") // This would come from auth context in real app
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

//   const handleLogout = () => {
//     // In a real app, this would handle logout logic
//     window.location.href = "/"
//   }

//   const handleSidebarToggle = (collapsed: boolean) => {
//     setSidebarCollapsed(collapsed)
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//       <DashboardSidebar onLogout={handleLogout} username={username} onToggle={handleSidebarToggle} />
//       <main
//         className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"} w-[calc(100%-${sidebarCollapsed ? "4rem" : "16rem"})] min-h-screen overflow-y-auto`}
//       >
//         <div className="p-6 max-w-full">{children}</div>
//       </main>
//     </div>
//   )
// }












// "use client"

// import DashboardSidebar from "@/components/dashboard/sidebar"
// import type React from "react"
// import { useState, useEffect } from "react"

// interface DashboardLayoutProps {
//   children: React.ReactNode
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [username] = useState("Admin") // This would come from auth context in real app
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
//   const [isClient, setIsClient] = useState(false)

//   useEffect(() => {
//     setIsClient(true)
//   }, [])

//   const handleLogout = () => {
//     // In a real app, this would handle logout logic
//     window.location.href = "/"
//   }

//   const handleSidebarToggle = (collapsed: boolean) => {
//     setSidebarCollapsed(collapsed)
//   }

//   // Show loading state during hydration
//   if (!isClient) {
//     return (
//       <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
//           <div className="p-4">
//             <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//           </div>
//         </div>
//         <main className="flex-1 p-6">
//           <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
//           <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//         </main>
//       </div>
//     )
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//       <DashboardSidebar onLogout={handleLogout} username={username} onToggle={handleSidebarToggle} />
//       <main
//         className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"} w-[calc(100%-${sidebarCollapsed ? "4rem" : "16rem"})] min-h-screen overflow-y-auto`}
//       >
//         <div className="p-6 max-w-full">{children}</div>
//       </main>
//     </div>
//   )
// }











// "use client";

// import DashboardSidebar from "@/components/dashboard/sidebar";
// import type React from "react";
// import { useState, useEffect } from "react";

// interface DashboardLayoutProps {
//   children: React.ReactNode;
// }

// // Mapping designation to permission ids
// const permissionsByDesignation: Record<string, string[]> = {
//   account: ["dashboard", "settings"],
//   manager: ["dashboard", "mpi", "flow", "stations", "settings"],
//   engineer: ["dashboard", "mpi", "stations"],
//   admin: ["dashboard", "mpi", "flow", "stations", "settings"],
// };

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [username] = useState("Admin"); // Ideally from auth context
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [isClient, setIsClient] = useState(false);
//   const [designationPermissions, setDesignationPermissions] = useState<string[]>([]);

//   useEffect(() => {
//     setIsClient(true);

//     // Step 1: Read designation from localStorage
//     const designation = localStorage.getItem("designation") || "engineer"; // fallback to engineer

//     // Step 2: Set permission list
//     const permissions = permissionsByDesignation[designation] || [];
//     setDesignationPermissions(permissions);
//   }, []);

//   const handleLogout = () => {
//     window.location.href = "/";
//   };

//   const handleSidebarToggle = (collapsed: boolean) => {
//     setSidebarCollapsed(collapsed);
//   };

//   if (!isClient) {
//     return (
//       <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
//           <div className="p-4">
//             <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//           </div>
//         </div>
//         <main className="flex-1 p-6">
//           <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
//           <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//       <DashboardSidebar
//         onLogout={handleLogout}
//         username={username}
//         onToggle={handleSidebarToggle}
//         designationPermissions={designationPermissions}
//       />
//       <main
//         className={`flex-1 transition-all duration-300 ${
//           sidebarCollapsed ? "ml-16" : "ml-64"
//         } w-[calc(100%-${sidebarCollapsed ? "4rem" : "16rem"})] min-h-screen overflow-y-auto`}
//       >
//         <div className="p-6 max-w-full">{children}</div>
//       </main>
//     </div>
//   );
// }








// "use client";

// import DashboardSidebar from "@/components/dashboard/sidebar";
// import type React from "react";
// import { useState, useEffect } from "react";

// interface DashboardLayoutProps {
//   children: React.ReactNode;
// }

// // Mapping designation to permission ids
// const permissionsByDesignation: Record<string, string[]> = {
//   account: ["dashboard", "settings"],
//   manager: ["dashboard", "mpi", "flow", "stations", "settings"],
//   engineer: ["dashboard", "mpi", "stations"],
//   admin: ["dashboard", "mpi", "flow", "stations", "settings"],
// };

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [username] = useState("Admin"); // Ideally from auth context
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [isClient, setIsClient] = useState(false);
//   const [designationPermissions, setDesignationPermissions] = useState<string[]>([]);

//   useEffect(() => {
//     setIsClient(true);

//     // ✅ Normalize case for consistent key lookup
//     const designation = (localStorage.getItem("designation") || "engineer").toLowerCase();

//     const permissions = permissionsByDesignation[designation] || [];
//     setDesignationPermissions(permissions);
//   }, []);

//   const handleLogout = () => {
//     window.location.href = "/";
//   };

//   const handleSidebarToggle = (collapsed: boolean) => {
//     setSidebarCollapsed(collapsed);
//   };

//   if (!isClient) {
//     return (
//       <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
//           <div className="p-4">
//             <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//           </div>
//         </div>
//         <main className="flex-1 p-6">
//           <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
//           <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//       <DashboardSidebar
//         onLogout={handleLogout}
//         username={username}
//         onToggle={handleSidebarToggle}
//         designationPermissions={designationPermissions}
//       />
//       <main
//         className={`flex-1 transition-all duration-300 ${
//           sidebarCollapsed ? "ml-16" : "ml-64"
//         } w-[calc(100%-${sidebarCollapsed ? "4rem" : "16rem"})] min-h-screen overflow-y-auto`}
//       >
//         <div className="p-6 max-w-full">{children}</div>
//       </main>
//     </div>
//   );
// }












// "use client";

// import DashboardSidebar from "@/components/dashboard/sidebar";
// import type React from "react";
// import { useState, useEffect } from "react";
// import { PermissionProvider } from "@/components/context/PermissionContext";

// interface DashboardLayoutProps {
//   children: React.ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [username] = useState("Admin"); // Ideally from auth context
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const handleLogout = () => {
//     window.location.href = "/";
//   };

//   const handleSidebarToggle = (collapsed: boolean) => {
//     setSidebarCollapsed(collapsed);
//   };

//   if (!isClient) {
//     return (
//       <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
//           <div className="p-4">
//             <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//           </div>
//         </div>
//         <main className="flex-1 p-6">
//           <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
//           <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <PermissionProvider>
//       <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//         <DashboardSidebar
//           onLogout={handleLogout}
//           username={username}
//           onToggle={handleSidebarToggle}
//           // No more passing designationPermissions here
//         />
//         <main
//           className={`flex-1 transition-all duration-300 ${
//             sidebarCollapsed ? "ml-16" : "ml-64"
//           } w-[calc(100%-${sidebarCollapsed ? "4rem" : "16rem"})] min-h-screen overflow-y-auto`}
//         >
//           <div className="p-6 max-w-full">{children}</div>
//         </main>
//       </div>
//     </PermissionProvider>
//   );
// }














// "use client";

// import DashboardSidebar from "@/components/dashboard/sidebar";
// import type React from "react";
// import { useState, useEffect } from "react";
// import { PermissionProvider } from "@/components/context/PermissionContext";

// interface DashboardLayoutProps {
//   children: React.ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [username] = useState("NetworkPCB Admin"); // Updated display name
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const handleLogout = () => {
//     window.location.href = "/";
//   };

//   const handleSidebarToggle = (collapsed: boolean) => {
//     setSidebarCollapsed(collapsed);
//   };

//   if (!isClient) {
//     return (
//       <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="w-64 bg-primary text-primary-foreground border-r border-gray-200 dark:border-gray-700">
//           <div className="p-4">
//             <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//           </div>
//         </div>
//         <main className="flex-1 p-6">
//           <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
//           <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <PermissionProvider>
//       <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//         <DashboardSidebar
//           onLogout={handleLogout}
//           username={username}
//           onToggle={handleSidebarToggle}
//         />
//         <main
//           className={`flex-1 transition-all duration-300 ${
//             sidebarCollapsed ? "ml-16" : "ml-64"
//           } w-[calc(100%-${sidebarCollapsed ? "4rem" : "16rem"})] min-h-screen overflow-y-auto`}
//         >
//           <div className="p-6 max-w-full">{children}</div>
//         </main>
//       </div>
//     </PermissionProvider>
//   );
// }











// "use client";

// import DashboardSidebar from "@/components/dashboard/sidebar";
// import type React from "react";
// import { useState, useEffect } from "react";
// import { PermissionProvider } from "@/components/context/PermissionContext";

// interface DashboardLayoutProps {
//   children: React.ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [username, setUsername] = useState("");
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);

//     const storedName = localStorage.getItem("username");
//     if (storedName) {
//       setUsername(storedName);
//     }
//   }, []);

//   const handleLogout = () => {
//     window.location.href = "/";
//   };

//   const handleSidebarToggle = (collapsed: boolean) => {
//     setSidebarCollapsed(collapsed);
//   };

//   if (!isClient) {
//     return (
//       <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="w-64 bg-primary text-primary-foreground border-r border-gray-200 dark:border-gray-700">
//           <div className="p-4">
//             <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//           </div>
//         </div>
//         <main className="flex-1 p-6">
//           <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
//           <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <PermissionProvider>
//       <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//         <DashboardSidebar
//           onLogout={handleLogout}
//           username={username}
//           onToggle={handleSidebarToggle}
//         />
//         <main
//           className={`flex-1 transition-all duration-300 ${
//             sidebarCollapsed ? "ml-16" : "ml-64"
//           } w-[calc(100%-${sidebarCollapsed ? "4rem" : "16rem"})] min-h-screen overflow-y-auto`}
//         >
//           <div className="p-6 max-w-full">{children}</div>
//         </main>
//       </div>
//     </PermissionProvider>
//   );
// }



"use client"

import type React from "react"
import { useState } from "react"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { useAuth } from "@/components/context/AuthContext"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth()
  const [collapsed, setCol] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar onToggle={setCol}/>
      <main className={`flex-1 transition-all ${collapsed?'ml-16':'ml-64'}`}>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
