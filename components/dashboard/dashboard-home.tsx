// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Settings, Plus, Loader2, AlertCircle } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";

// // Types
// interface OrderForm {
//   id: string;
//   internalOrderNumber?: string;
//   revision?: string;
//   documentControlId?: string;
//   orderType?: string[];
//   distributionDate?: string | null;
//   requiredBy?: string | null;
//   otherAttachments?: string | null;
//   fileAction?: string[];
//   markComplete?: boolean;
//   mpiId: string;
// }

// interface MPI {
//   id: string;
//   jobId: string;
//   assemblyId: string;
//   customer?: string;
//   orderForms?: OrderForm[];
//   stations?: any[];
//   checklists?: any[];
//   createdAt: string;
//   updatedAt: string;
// }

// // API Functions
// const fetchMPIs = async (): Promise<MPI[]> => {
//   const response = await fetch("http://54.177.111.218:4000/mpi");
//   if (!response.ok) {
//     throw new Error("Failed to fetch MPIs");
//   }
//   return response.json();
// };

// export default function DashboardHome() {
//   const [mpis, setMPIs] = useState<MPI[]>([]);
//   const [loadingMPIs, setLoadingMPIs] = useState(false);
//   const [mpisError, setMPIsError] = useState<string | null>(null);
//   const { toast } = useToast();
//   const router = useRouter();

//   // Load MPIs
//   const loadMPIs = async () => {
//     try {
//       setLoadingMPIs(true);
//       setMPIsError(null);
//       const data = await fetchMPIs();
//       setMPIs(data);
//     } catch (error) {
//       console.error("Error loading MPIs:", error);
//       setMPIsError("Failed to load MPIs");
//       toast({
//         title: "Error",
//         description: "Failed to load MPIs. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoadingMPIs(false);
//     }
//   };

//   // Load data on component mount
//   useEffect(() => {
//     loadMPIs();
//   }, []);

//   // Handle MPI click
//   const handleMPIClick = (mpiId: string) => {
//     router.push(`/dashboard/mpi/${mpiId}`);
//   };

//   return (
//     <div className="space-y-6">
//       {/* MPI Content */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-red-600">Dashboard</CardTitle>
//             <Button
//               className="bg-red-600 hover:bg-red-700 text-white"
//               onClick={() => {
//                 window.location.href = "/dashboard/mpi/create";
//               }}
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Create MPI
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {loadingMPIs ? (
//             <div className="flex items-center justify-center py-8">
//               <Loader2 className="w-6 h-6 animate-spin text-red-600" />
//               <span className="ml-2 text-muted-foreground">
//                 Loading MPIs...
//               </span>
//             </div>
//           ) : mpisError ? (
//             <div className="flex items-center justify-center py-8 text-red-600">
//               <AlertCircle className="w-5 h-5 mr-2" />
//               <span>{mpisError}</span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="ml-4"
//                 onClick={loadMPIs}
//               >
//                 Retry
//               </Button>
//             </div>
//           ) : mpis.length === 0 ? (
//             <div className="text-center py-8 text-muted-foreground">
//               <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//               <p>No MPIs found. Create your first MPI to get started.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {mpis.map((mpi) => (
//                 <Card
//                   key={mpi.id}
//                   onClick={() => handleMPIClick(mpi.id)}
//                   className="hover:shadow-md transition-shadow cursor-pointer"
//                 >
//                   <CardContent className="p-4">
//                     <div className="space-y-3">
//                       <div className="space-y-1">
//                         <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                           MPI ID
//                         </label>
//                         <button
//                           onClick={() => handleMPIClick(mpi.id)}
//                           className="text-lg font-bold text-gray-900 hover:text-gray-700 hover:underline transition-colors text-left w-full"
//                         >
//                           {mpi.jobId}
//                         </button>
//                       </div>

//                       <div className="space-y-1">
//                         <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                           Assembly ID
//                         </label>
//                         <p className="text-sm font-medium text-gray-900">
//                           {mpi.assemblyId}
//                         </p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

















// "use client"

// import { useState, useEffect, useMemo } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Settings, Plus, Loader2, AlertCircle, Search, FileText, CheckCircle, XCircle } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { useRouter } from "next/navigation"
// import MeritonicsAssemblyPage from "../Assembly/meritronics-assembly"

// // Types
// interface OrderForm {
//   id: string
//   internalOrderNumber?: string
//   revision?: string
//   documentControlId?: string
//   orderType?: string[]
//   distributionDate?: string | null
//   requiredBy?: string | null
//   otherAttachments?: string | null
//   fileAction?: string[]
//   markComplete?: boolean
//   mpiId: string
// }

// interface MPI {
//   id: string
//   jobId: string
//   assemblyId: string
//   customer?: string
//   orderForms?: OrderForm[]
//   stations?: any[]
//   checklists?: any[]
//   createdAt: string
//   updatedAt: string
// }

// // API Functions
// const fetchMPIs = async (): Promise<MPI[]> => {
//   const response = await fetch("http://54.177.111.218:4000/mpi")
//   if (!response.ok) {
//     throw new Error("Failed to fetch MPIs")
//   }
//   return response.json()
// }

// export default function DashboardHome() {
//   const [mpis, setMPIs] = useState<MPI[]>([])
//   const [loadingMPIs, setLoadingMPIs] = useState(false)
//   const [mpisError, setMPIsError] = useState<string | null>(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const { toast } = useToast()
//   const router = useRouter()

//   // Load MPIs
//   const loadMPIs = async () => {
//     try {
//       setLoadingMPIs(true)
//       setMPIsError(null)
//       const data = await fetchMPIs()
//       setMPIs(data)
//     } catch (error) {
//       console.error("Error loading MPIs:", error)
//       setMPIsError("Failed to load MPIs")
//       toast({
//         title: "Error",
//         description: "Failed to load MPIs. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingMPIs(false)
//     }
//   }

//   // Load data on component mount
//   useEffect(() => {
//     loadMPIs()
//   }, [])

//   // Filter MPIs based on search term
//   const filteredMPIs = useMemo(() => {
//     if (!searchTerm.trim()) return mpis

//     return mpis.filter((mpi) => {
//       const searchLower = searchTerm.toLowerCase()
//       return mpi.jobId.toLowerCase().includes(searchLower) || mpi.assemblyId.toLowerCase().includes(searchLower)
//     })
//   }, [mpis, searchTerm])

//   // Calculate summary statistics
//   const summaryStats = useMemo(() => {
//     const totalMPIs = mpis.length

//     // For this example, we'll consider an MPI "closed" if it has orderForms with markComplete = true
//     // and "open" otherwise. You can adjust this logic based on your actual business rules.
//     const closedMPIs = mpis.filter(
//       (mpi) => mpi.orderForms && mpi.orderForms.some((form) => form.markComplete === true),
//     ).length

//     const openMPIs = totalMPIs - closedMPIs

//     return {
//       total: totalMPIs,
//       open: openMPIs,
//       closed: closedMPIs,
//     }
//   }, [mpis])

//   // Handle MPI click
//   const handleMPIClick = (mpiId: string) => {
//     router.push(`/dashboard/mpi/${mpiId}`)
//   }

//   return (
//     <div className="space-y-6">
//       {/* Summary Cards */}

//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-red-600">Dashboard</CardTitle>
//             <Button
//               className="bg-red-600 hover:bg-red-700 text-white"
//               onClick={() => {
//                 window.location.href = "/dashboard/mpi/create"
//               }}
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Create MPI
//             </Button>
//           </div>
//         </CardHeader>
//          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total MPIs</p>
//                 <p className="text-2xl font-bold text-gray-900">{summaryStats.total}</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <FileText className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Open MPIs</p>
//                 <p className="text-2xl font-bold text-orange-600">{summaryStats.open}</p>
//               </div>
//               <div className="p-3 bg-orange-100 rounded-full">
//                 <XCircle className="w-6 h-6 text-orange-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Closed MPIs</p>
//                 <p className="text-2xl font-bold text-green-600">{summaryStats.closed}</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <CheckCircle className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//         <CardContent>
//           {/* Search Bar */}
//           <div className="mb-6">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 type="text"
//                 placeholder="Search by Job ID or Assembly ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>

//           {loadingMPIs ? (
//             <div className="flex items-center justify-center py-8">
//               <Loader2 className="w-6 h-6 animate-spin text-red-600" />
//               <span className="ml-2 text-muted-foreground">Loading MPIs...</span>
//             </div>
//           ) : mpisError ? (
//             <div className="flex items-center justify-center py-8 text-red-600">
//               <AlertCircle className="w-5 h-5 mr-2" />
//               <span>{mpisError}</span>
//               <Button variant="outline" size="sm" className="ml-4 bg-transparent" onClick={loadMPIs}>
//                 Retry
//               </Button>
//             </div>
//           ) : filteredMPIs.length === 0 ? (
//             <div className="text-center py-8 text-muted-foreground">
//               <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//               {searchTerm ? (
//                 <p>No MPIs found matching "{searchTerm}". Try a different search term.</p>
//               ) : (
//                 <p>No MPIs found. Create your first MPI to get started.</p>
//               )}
//             </div>
//           ) : (
//             <>
//               {/* Results count */}
//               {searchTerm && (
//                 <div className="mb-4 text-sm text-gray-600">
//                   Showing {filteredMPIs.length} of {mpis.length} MPIs
//                 </div>
//               )}

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                 {filteredMPIs.map((mpi) => (
//                   <Card
//                     key={mpi.id}
//                     onClick={() => handleMPIClick(mpi.id)}
//                     className="hover:shadow-md transition-shadow cursor-pointer"
//                   >
//                     <CardContent className="p-4">
//                       <div className="space-y-3">
//                         <div className="space-y-1">
//                           <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">MPI ID</label>
//                           <button
//                             onClick={() => handleMPIClick(mpi.id)}
//                             className="text-lg font-bold text-gray-900 hover:text-gray-700 hover:underline transition-colors text-left w-full"
//                           >
//                             {mpi.jobId}
//                           </button>
//                         </div>
//                         <div className="space-y-1">
//                           <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                             Assembly ID
//                           </label>
//                           <p className="text-sm font-medium text-gray-900">{mpi.assemblyId}</p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>

           
//       {/* <MeritonicsAssemblyPage /> */}
//       {/* MPI Content */}
//     </div>
//   )
// }




















"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Plus, Loader2, AlertCircle, Search, FileText, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Types
interface OrderForm {
  id: string
  internalOrderNumber?: string
  revision?: string
  documentControlId?: string
  orderType?: string[]
  distributionDate?: string | null
  requiredBy?: string | null
  otherAttachments?: string | null
  fileAction?: string[]
  markComplete?: boolean
  mpiId: string
}

interface MPI {
  id: string
  jobId: string
  assemblyId: string
  customer?: string
  orderForms?: OrderForm[]
  stations?: any[]
  checklists?: any[]
  createdAt: string
  updatedAt: string
}

// API Functions
const fetchMPIs = async (): Promise<MPI[]> => {
  const response = await fetch("http://35.166.254.199:5000/mpi")
  if (!response.ok) {
    throw new Error("Failed to fetch MPIs")
  }
  return response.json()
}

export default function DashboardHome() {
  const [mpis, setMPIs] = useState<MPI[]>([])
  const [loadingMPIs, setLoadingMPIs] = useState(false)
  const [mpisError, setMPIsError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  // Load MPIs
  const loadMPIs = async () => {
    try {
      setLoadingMPIs(true)
      setMPIsError(null)
      const data = await fetchMPIs()
      setMPIs(data)
    } catch (error) {
      console.error("Error loading MPIs:", error)
      setMPIsError("Failed to load MPIs")
      toast({
        title: "Error",
        description: "Failed to load MPIs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingMPIs(false)
    }
  }

  useEffect(() => {
    loadMPIs()
  }, [])

  const filteredMPIs = useMemo(() => {
    if (!searchTerm.trim()) return mpis

    return mpis.filter((mpi) => {
      const searchLower = searchTerm.toLowerCase()
      return mpi.jobId.toLowerCase().includes(searchLower) || mpi.assemblyId.toLowerCase().includes(searchLower)
    })
  }, [mpis, searchTerm])

  const summaryStats = useMemo(() => {
    const totalMPIs = mpis.length
    const closedMPIs = mpis.filter(
      (mpi) => mpi.orderForms && mpi.orderForms.some((form) => form.markComplete === true),
    ).length
    const openMPIs = totalMPIs - closedMPIs

    return {
      total: totalMPIs,
      open: openMPIs,
      closed: closedMPIs,
    }
  }, [mpis])

  const handleMPIClick = (mpiId: string) => {
    router.push(`/dashboard/mpi/${mpiId}`)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-600">Dashboard</CardTitle>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                window.location.href = "/dashboard/mpi/create"
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create MPI
            </Button>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total MPIs</p>
                  <p className="text-2xl font-bold text-gray-900">{summaryStats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open MPIs</p>
                  <p className="text-2xl font-bold text-orange-600">{summaryStats.open}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <XCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Closed MPIs</p>
                  <p className="text-2xl font-bold text-green-600">{summaryStats.closed}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by Job ID or Assembly ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loadingMPIs ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              <span className="ml-2 text-muted-foreground">Loading MPIs...</span>
            </div>
          ) : mpisError ? (
            <div className="flex items-center justify-center py-8 text-green-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{mpisError}</span>
              <Button variant="outline" size="sm" className="ml-4 bg-transparent" onClick={loadMPIs}>
                Retry
              </Button>
            </div>
          ) : filteredMPIs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              {searchTerm ? (
                <p>No MPIs found matching "{searchTerm}". Try a different search term.</p>
              ) : (
                <p>No MPIs found. Create your first MPI to get started.</p>
              )}
            </div>
          ) : (
            <>
              {searchTerm && (
                <div className="mb-4 text-sm text-gray-600">
                  Showing {filteredMPIs.length} of {mpis.length} MPIs
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMPIs.map((mpi) => (
                  <Card
                    key={mpi.id}
                    onClick={() => handleMPIClick(mpi.id)}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">MPI ID</label>
                          <button
                            onClick={() => handleMPIClick(mpi.id)}
                            className="text-lg font-bold text-gray-900 hover:text-gray-700 hover:underline transition-colors text-left w-full"
                          >
                            {mpi.jobId}
                          </button>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Assembly ID
                          </label>
                          <p className="text-sm font-medium text-gray-900">{mpi.assemblyId}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* <NetworkAssemblyPage /> */}
    </div>
  )
}
