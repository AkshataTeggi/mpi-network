

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MeritonicsAssemblyPage from "@/components/Assembly/meritronics-assembly"

export default function MeritronicsAssemblyPage() {
  const processSteps = [
    { id: 1, name: "Material Kitting", dataCollection: true, category: "preparation" },
    { id: 2, name: "Routed PCB - Wash using In-line Cleaner", dataCollection: true, category: "cleaning" },
    { id: 3, name: "Solder - Screen Print Top/2nd Side", dataCollection: true, category: "soldering" },
    { id: 4, name: "Solder Print Inspection (Visual 3X)", dataCollection: true, category: "inspection" },
    { id: 5, name: "Perform Masking - Wire bond/Gold Pads", dataCollection: true, category: "preparation" },
    { id: 6, name: "Affix ID labels (Single/Panel)", dataCollection: true, category: "labeling" },
    { id: 7, name: "Solder - Screen Print Bottom/1st Side", dataCollection: true, category: "soldering" },
    { id: 8, name: "Solder Print Inspection (Visual 3X)", dataCollection: true, category: "inspection" },
    { id: 9, name: "Component Placement (Pick n place)", dataCollection: true, category: "assembly" },
    {
      id: 10,
      name: "First Article Inspection & X-Ray BGA/QFN alignment",
      dataCollection: true,
      category: "inspection",
    },
    { id: 11, name: "Reflow PCBA", dataCollection: true, category: "soldering" },
    { id: 12, name: "1 Sided PCBA", dataCollection: false, category: "decision" },
    { id: 13, name: "AOI (Automatic Optical Inspection)", dataCollection: true, category: "inspection" },
    { id: 14, name: "In Process Inspection (Visual/Microscope)", dataCollection: true, category: "inspection" },
    { id: 15, name: "Touch up / Repair", dataCollection: true, category: "repair" },
    { id: 16, name: "Selective Solder - Solder Bath/Dip", dataCollection: true, category: "soldering" },
    { id: 17, name: "PTH (Load PTH Parts on PCBA)", dataCollection: true, category: "assembly" },
    { id: 18, name: "PTH First Article Inspection", dataCollection: true, category: "inspection" },
    { id: 19, name: "PTH QC Inspection", dataCollection: true, category: "inspection" },
    { id: 20, name: "Manual Solder 'NO CLEAN' Parts", dataCollection: true, category: "soldering" },
    { id: 21, name: "Flying Probe Test/Functional Test", dataCollection: true, category: "testing" },
    { id: 22, name: "Mechanical Assembly / Press Fit", dataCollection: true, category: "assembly" },
    { id: 23, name: "Conformal Coat (Outside Process)", dataCollection: true, category: "coating" },
    { id: 24, name: "BGA/QFN X-Ray", dataCollection: true, category: "inspection" },
    { id: 25, name: "Clean Assembly Wash-DI Water", dataCollection: true, category: "cleaning" },
    { id: 26, name: "Conformal Coat Incoming Inspection (Blue Light)", dataCollection: true, category: "inspection" },
    { id: 27, name: "2nd Operation", dataCollection: false, category: "decision" },
    { id: 28, name: "Flying Probe Test", dataCollection: true, category: "testing" },
    { id: 29, name: "Underfill", dataCollection: true, category: "assembly" },
    {
      id: 30,
      name: "Remove Mask and 100% microscopic Gold pads Inspection",
      dataCollection: true,
      category: "inspection",
    },
    { id: 31, name: "Final Outgoing Inspection & Document Label check", dataCollection: true, category: "inspection" },
    { id: 32, name: "Packaging", dataCollection: true, category: "packaging" },
    { id: 33, name: "SLA (Ship Lot Audit)", dataCollection: true, category: "audit" },
    { id: 34, name: "Final Inspection", dataCollection: true, category: "inspection" },
    { id: 35, name: "Shipping", dataCollection: true, category: "shipping" },
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      preparation: "bg-blue-100 text-blue-800 border-blue-200",
      cleaning: "bg-green-100 text-green-800 border-green-200",
      soldering: "bg-orange-100 text-orange-800 border-orange-200",
      inspection: "bg-purple-100 text-purple-800 border-purple-200",
      assembly: "bg-yellow-100 text-yellow-800 border-yellow-200",
      testing: "bg-red-100 text-red-800 border-red-200",
      coating: "bg-indigo-100 text-indigo-800 border-indigo-200",
      repair: "bg-pink-100 text-pink-800 border-pink-200",
      labeling: "bg-cyan-100 text-cyan-800 border-cyan-200",
      packaging: "bg-emerald-100 text-emerald-800 border-emerald-200",
      audit: "bg-violet-100 text-violet-800 border-violet-200",
      shipping: "bg-slate-100 text-slate-800 border-slate-200",
      decision: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Network PCB Assembly Process</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive assembly process documentation including standard process flow and detailed assembly
            procedures.
          </p>
        </div>

        <Tabs defaultValue="process-flow" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="process-flow" className="text-sm font-medium">
              Standard Process Flow
            </TabsTrigger>
            <TabsTrigger value="assembly-details" className="text-sm font-medium">
              Assembly Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="process-flow" className="space-y-6">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Process Overview
                 
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processSteps.map((step, index) => (
                    <div key={step.id} className="relative">
                      <Card
                        className={`transition-all duration-200 hover:shadow-md ${
                          step.dataCollection ? "ring-2 ring-blue-200 bg-blue-50/50" : "bg-white"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              Step {step.id}
                            </Badge>
                            {step.dataCollection && (
                              <Badge className="bg-blue-600 hover:bg-blue-700 text-xs">Data Required</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm mb-2 leading-tight">{step.name}</h3>
                          <Badge variant="outline" className={`text-xs ${getCategoryColor(step.category)}`}>
                            {step.category.charAt(0).toUpperCase() + step.category.slice(1)}
                          </Badge>
                        </CardContent>
                      </Card>
                      {index < processSteps.length - 1 && (
                        <div className="hidden lg:block absolute -right-2 top-1/2 transform -translate-y-1/2 z-10">
                          <div className="w-4 h-0.5 bg-gray-300"></div>
                          <div className="w-0 h-0 border-l-4 border-l-gray-300 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-4 -mt-1"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Process Categories</CardTitle>
                  <CardDescription>Steps are categorized by their function in the assembly process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from(new Set(processSteps.map((step) => step.category))).map((category) => (
                      <div key={category} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full border ${getCategoryColor(category)}`}></div>
                        <span className="text-sm capitalize">{category}</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {processSteps.filter((step) => step.category === category).length}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Process Metrics</CardTitle>
                  <CardDescription>Important statistics about the assembly process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Process Steps</span>
                      <Badge variant="outline">{processSteps.length}</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Data Collection Points</span>
                      <Badge className="bg-blue-600 hover:bg-blue-700">
                        {processSteps.filter((step) => step.dataCollection).length}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Inspection Steps</span>
                      <Badge variant="outline">
                        {processSteps.filter((step) => step.category === "inspection").length}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Testing Steps</span>
                      <Badge variant="outline">
                        {processSteps.filter((step) => step.category === "testing").length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Important Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Data Collection Requirements:</strong> All colored steps require data collection.
                    Additionally, data from any rework or repair operations must be collected, even if the step is not
                    specifically highlighted for data collection.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assembly-details" className="space-y-6">
            <Card>
            
              <CardContent>
                <MeritonicsAssemblyPage />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
