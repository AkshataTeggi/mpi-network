// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { FileText, Users, Settings, Clock, CheckCircle2 } from "lucide-react"
// import { useRouter } from "next/navigation"

// export default function Dashboard() {
//   const router = useRouter()

//   // Get stats from localStorage
//   const getCompletedSteps = () => {
//     try {
//       const savedSteps = localStorage.getItem("mpi-completed-steps")
//       return savedSteps ? JSON.parse(savedSteps).length : 0
//     } catch (error) {
//       return 0
//     }
//   }

//   const getStationCount = () => {
//     try {
//       const savedStations = localStorage.getItem("meritronics-stations")
//       return savedStations ? JSON.parse(savedStations).length : 0
//     } catch (error) {
//       return 0
//     }
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Manufacturing Process Dashboard</h1>
//         <div className="flex gap-2">
//           <Button variant="outline" size="sm" className="flex items-center gap-1">
//             <Settings className="h-4 w-4" />
//             <span>Settings</span>
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Completed Steps</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between">
//               <div className="text-2xl font-bold">{getCompletedSteps()}</div>
//               <CheckCircle2 className="h-5 w-5 text-green-500" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Stations</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between">
//               <div className="text-2xl font-bold">{getStationCount()}</div>
//               <Users className="h-5 w-5 text-blue-500" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Last Updated</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between">
//               <div className="text-sm font-medium">{new Date().toLocaleDateString()}</div>
//               <Clock className="h-5 w-5 text-orange-500" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Manufacturing Process Instructions</CardTitle>
//             <CardDescription>
//               Create and manage manufacturing process instructions for your production line
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <p className="text-sm text-muted-foreground">
//                 The MPI module allows you to document and standardize your manufacturing processes, ensuring consistency
//                 and quality across production.
//               </p>
//               <Button className="w-full" onClick={() => router.push("/mpi")}>
//                 <FileText className="h-4 w-4 mr-2" />
//                 Open MPI Module
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Station Management</CardTitle>
//             <CardDescription>Define and manage production stations in your manufacturing process</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <p className="text-sm text-muted-foreground">
//                 The Station module helps you organize your production floor by defining stations, their capabilities,
//                 and requirements.
//               </p>
//               <Button className="w-full" onClick={() => router.push("/stations")}>
//                 <Users className="h-4 w-4 mr-2" />
//                 Open Station Module
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Activity</CardTitle>
//             <CardDescription>Latest updates to your manufacturing process</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="border-l-2 border-muted pl-4 py-2">
//                 <p className="text-sm font-medium">Station Module Updated</p>
//                 <p className="text-xs text-muted-foreground">Today</p>
//               </div>
//               <div className="border-l-2 border-muted pl-4 py-2">
//                 <p className="text-sm font-medium">MPI Documentation Updated</p>
//                 <p className="text-xs text-muted-foreground">Yesterday</p>
//               </div>
//               <div className="border-l-2 border-muted pl-4 py-2">
//                 <p className="text-sm font-medium">New Process Flow Added</p>
//                 <p className="text-xs text-muted-foreground">3 days ago</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }












"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Users, Settings, Clock, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()

  // Get stats from localStorage
  const getCompletedSteps = () => {
    try {
      const savedSteps = localStorage.getItem("mpi-completed-steps")
      return savedSteps ? JSON.parse(savedSteps).length : 0
    } catch (error) {
      return 0
    }
  }

  const getStationCount = () => {
    try {
      const savedStations = localStorage.getItem("networkpcb-stations")
      return savedStations ? JSON.parse(savedStations).length : 0
    } catch (error) {
      return 0
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">
          Manufacturing Process Dashboard
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1 text-green-700 border-green-600 hover:bg-green-50">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{getCompletedSteps()}</div>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{getStationCount()}</div>
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{new Date().toLocaleDateString()}</div>
              <Clock className="h-5 w-5 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manufacturing Process Instructions</CardTitle>
            <CardDescription>
              Create and manage manufacturing process instructions for your production line
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The MPI module allows you to document and standardize your manufacturing processes, ensuring consistency
                and quality across production.
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => router.push("/mpi")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Open MPI Module
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Station Management</CardTitle>
            <CardDescription>Define and manage production stations in your manufacturing process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The Station module helps you organize your production floor by defining stations, their capabilities,
                and requirements.
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => router.push("/stations")}
              >
                <Users className="h-4 w-4 mr-2" />
                Open Station Module
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates to your manufacturing process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-green-400 pl-4 py-2">
                <p className="text-sm font-medium">Station Module Updated</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
              <div className="border-l-2 border-green-400 pl-4 py-2">
                <p className="text-sm font-medium">MPI Documentation Updated</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
              <div className="border-l-2 border-green-400 pl-4 py-2">
                <p className="text-sm font-medium">New Process Flow Added</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
