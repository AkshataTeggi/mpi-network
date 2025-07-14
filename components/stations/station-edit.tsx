
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react"
import { StationAPI } from "./station-api"
import type { Station, UpdateStationDto } from "./types"
import { useToast } from "@/hooks/use-toast"
import { StationSpecifications } from "./station-specifications"
import { StationDocumentation } from "./station-documentation"
import StationFlowcharts from "./station-flowcharts"

interface StationEditProps {
  stationId: string
}

// Enhanced helper function to initialize specifications with existing values
const initializeSpecifications = (stationData: Station): any[] => {
  console.log("🔍 Initializing specifications from station data:", stationData)

  if (!stationData.specifications || !Array.isArray(stationData.specifications)) {
    console.log("📋 No specifications found in station data")
    return []
  }

  const initializedSpecs = stationData.specifications.map((spec: any) => {
    console.log(`🔧 Processing specification: ${spec.name} (${spec.id})`)

    // Initialize with the specification structure
    let initializedSpec = {
      id: spec.id,
      name: spec.name || "",
      slug: spec.slug || "",
      inputType: spec.inputType || "TEXT",
      suggestions: spec.suggestions || [],
      required: spec.required || false,
      value: "", // Default empty value
      unit: undefined,
      fileUrl: undefined,
    }

    // Look for existing values in multiple places
    let existingValue = null

    // Priority 1: Check stationSpecifications array
    if (spec.stationSpecifications && Array.isArray(spec.stationSpecifications)) {
      existingValue = spec.stationSpecifications.find(
        (ss: any) => ss.stationId === stationData.id && ss.specificationId === spec.id,
      )
      if (existingValue) {
        console.log(`📋 Found in stationSpecifications:`, existingValue)
      }
    }

    // Priority 2: Check if there's a direct value on the spec
    if (!existingValue && (spec.value || spec.unit || spec.fileUrl)) {
      existingValue = {
        value: spec.value || "",
        unit: spec.unit,
        fileUrl: spec.fileUrl,
      }
      console.log(`📋 Found direct value on spec:`, existingValue)
    }

    // Priority 3: Check station's specificationValues if it exists
    if (!existingValue && stationData.specificationValues && Array.isArray(stationData.specificationValues)) {
      const stationSpecValue = stationData.specificationValues.find((sv: any) => sv.specificationId === spec.id)
      if (stationSpecValue) {
        existingValue = {
          value: stationSpecValue.value || "",
          unit: stationSpecValue.unit,
          fileUrl: stationSpecValue.fileUrl,
        }
        console.log(`📋 Found in station specificationValues:`, existingValue)
      }
    }

    // Apply the found value
    if (existingValue) {
      initializedSpec = {
        ...initializedSpec,
        value: existingValue.value || "",
        unit: existingValue.unit || undefined,
        fileUrl: existingValue.fileUrl || undefined,
      }
      console.log(`✅ Initialized spec ${spec.id} with value:`, initializedSpec)
    } else {
      console.log(`🆕 No existing value found for spec ${spec.id}, using empty value`)
    }

    return initializedSpec
  })

  console.log("🎯 Final initialized specifications:", initializedSpecs)
  return initializedSpecs
}

export function StationEdit({ stationId }: StationEditProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("basic")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [station, setStation] = useState<Station | null>(null)
  const [allStations, setAllStations] = useState<Station[]>([])
  const [error, setError] = useState<string | null>(null)

  // Form state - Only fields that can be updated
  const [basicInfo, setBasicInfo] = useState({
    stationName: "",
    location: "",
    status: "active" as "active" | "inactive" | "maintenance",
    description: "",
    operator: "",
    priority: "",
    Note: [] as string[],
  })

  const [specifications, setSpecifications] = useState<any[]>([])
  const [documentations, setDocumentations] = useState<any[]>([])
  const [flowcharts, setFlowcharts] = useState<any[]>([])

  useEffect(() => {
    if (stationId && stationId !== "undefined") {
      loadStationData()
    } else {
      setError("Invalid station ID")
      setLoading(false)
    }
  }, [stationId])

  const loadStationData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load station data and all stations in parallel
      const [stationData, allStationsData] = await Promise.all([
        StationAPI.getStationById(stationId),
        StationAPI.getAllStations(),
      ])

      // Validate station data
      if (!stationData) {
        throw new Error("Station data is null")
      }

      if (!stationData.id) {
        throw new Error("Station data missing ID field")
      }

      setStation(stationData)
      setAllStations(allStationsData)

      // Populate form state with the exact API response structure
      setBasicInfo({
        stationName: stationData.stationName || "",
        location: stationData.location || "",
        status: (stationData.status as "active" | "inactive" | "maintenance") || "active",
        description: stationData.description || "",
        operator: stationData.operator || "",
        priority:
          stationData.priority !== undefined && stationData.priority !== null ? String(stationData.priority) : "",
        Note: Array.isArray(stationData.Note) ? stationData.Note : [],
      })

      // ✅ FIXED: Properly initialize specifications with existing values
      const initializedSpecs = initializeSpecifications(stationData)
      setSpecifications(initializedSpecs)

      // Handle related data with proper filename mapping
      setDocumentations(
        (stationData.documentations || []).map((doc: any) => ({
          ...doc,
          fileName: doc.originalName || doc.fileName || "",
          originalName: doc.originalName || doc.fileName || "",
        })),
      )

      setFlowcharts(
        (stationData.flowcharts || []).map((chart: any) => ({
          ...chart,
          filename: chart.originalName || chart.filename || "",
          originalName: chart.originalName || chart.filename || "",
        })),
      )
    } catch (error: any) {
      const errorMessage = error.message || "Failed to load station data"
      setError(errorMessage)
      toast({
        title: "Error Loading Station",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Re-initialize specifications when station data changes
  useEffect(() => {
    if (station) {
      console.log("🔄 Station data changed, re-initializing specifications")
      const newSpecs = initializeSpecifications(station)
      setSpecifications(newSpecs)
    }
  }, [station])

  const validateBasicInfo = () => {
    const errors: string[] = []

    if (!basicInfo.stationName.trim()) {
      errors.push("Station Name is required")
    }

    // Check for duplicate station name (excluding current station)
    const duplicateStationName = allStations.find(
      (s) => s.stationName?.toLowerCase() === basicInfo.stationName.trim().toLowerCase() && s.id !== station?.id,
    )

    if (duplicateStationName) {
      errors.push(`Station Name "${basicInfo.stationName}" already exists`)
    }

    return errors
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      // Validate basic info
      const validationErrors = validateBasicInfo()
      if (validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: validationErrors.join(", "),
          variant: "destructive",
        })
        setActiveTab("basic")
        return
      }

      if (!station?.id) {
        throw new Error("Station ID is required for update")
      }

      // ✅ ENHANCED: Prepare specification values with better preservation logic
      const specificationValues = specifications.map((spec) => {
        // Find existing value to compare
        let existingValue = null
        if (station.specifications) {
          const existingSpec = station.specifications.find((s: any) => s.id === spec.id)
          if (existingSpec) {
            if (existingSpec.stationSpecifications?.length > 0) {
              existingValue = existingSpec.stationSpecifications.find((ss: any) => ss.stationId === station.id)
            } else if (existingSpec.value || existingSpec.unit || existingSpec.fileUrl) {
              existingValue = {
                value: existingSpec.value,
                unit: existingSpec.unit,
                fileUrl: existingSpec.fileUrl,
              }
            }
          }
        }

        // Use current value or preserve existing value
        const finalValue =
          spec.value !== undefined && spec.value !== null ? String(spec.value) : existingValue?.value || ""

        return {
          specificationId: spec.id,
          value: finalValue,
          unit: spec.unit || existingValue?.unit || undefined,
          fileUrl: spec.fileUrl || existingValue?.fileUrl || undefined,
        }
      })

      // Send ALL documentations (backend will sync based on fileUrl)
      const allDocumentations = documentations
        .filter((doc) => doc.fileUrl)
        .map((doc) => ({
          description: doc.description || "",
          fileUrl: doc.fileUrl,
          originalName: doc.originalName || doc.fileName || "", // ✅ Use originalName from API response
        }))

      // Send ALL flowcharts (backend will sync based on fileUrl)
      const allFlowcharts = flowcharts
        .filter((chart) => chart.fileUrl)
        .map((chart) => ({
          description: chart.description || "",
          fileUrl: chart.fileUrl,
          originalName: chart.originalName || chart.filename || "", // ✅ Use originalName from API response
        }))

      // ✅ ENHANCED: Send ALL specifications with preserved data
      const allSpecifications = specifications.map((spec) => ({
        name: spec.name,
        slug: spec.slug,
        inputType: spec.inputType,
        suggestions: spec.suggestions || [],
        required: spec.required || false,
      }))

      // Prepare the update data
      const updateData: UpdateStationDto = {
        stationName: basicInfo.stationName.trim(),
        location: basicInfo.location.trim(),
        status: basicInfo.status,
        description: basicInfo.description.trim() || "",
        operator: basicInfo.operator.trim() || undefined,
        priority: basicInfo.priority.trim() === "" ? undefined : Number(basicInfo.priority),
        Note: basicInfo.Note.filter((note) => note.trim() !== ""),
        specificationValues: specificationValues,
        documentations: allDocumentations, // Send ALL current documentations
        flowcharts: allFlowcharts, // Send ALL current flowcharts
        specifications: allSpecifications, // Send ALL current specifications
      }

      console.log("🔧 Station Update Debug Info:")
      console.log("Station ID:", station.id)
      console.log("Documentations being sent:", allDocumentations)
      console.log("Flowcharts being sent:", allFlowcharts)
      console.log("Specifications being sent:", allSpecifications)
      console.log("Specification Values being sent:", specificationValues)
      console.log("Complete Update Data:", updateData)

      // Update the station
      const updatedStation = await StationAPI.updateStation(station.id, updateData)

      toast({
        title: "Success",
        description: "Station updated successfully!",
      })

      // Navigate back to station details
      router.push(`/dashboard/stations/${updatedStation.id}`)
    } catch (error: any) {
      // Handle specific error types
      if (error.message?.includes("Unique constraint failed")) {
        toast({
          title: "Duplicate Error",
          description: "A station with similar information already exists.",
          variant: "destructive",
        })
      } else if (error.message?.includes("500") || error.message?.includes("Internal server error")) {
        toast({
          title: "Server Error",
          description: "Internal server error occurred. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to update station. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/dashboard/stations/${stationId}`)
  }

  const handleRetry = () => {
    loadStationData()
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading station data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !station) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-600 mb-2">Failed to Load Station</h1>
          <p className="text-muted-foreground mb-4">{error || "Station not found"}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => router.push("/dashboard/stations")}>Back to Stations</Button>
          </div>
        </div>
      </div>
    )
  }

  const isLoading = loading || submitting

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-600">Edit Station</h1>
            <p className="text-muted-foreground mt-1">
              Station: {station.stationName} • ID: {station.stationId}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Station
          </Button>
        </div>

        {/* Full Width Tabs Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-2 ">
              <TabsList className="grid w-full grid-cols-4 h-12 mb-2 mt-2">
                <TabsTrigger value="basic" className="text-sm font-medium">
                  Basic Information
                  {basicInfo.stationName && <span className="ml-2 text-xs text-green-600">✓</span>}
                </TabsTrigger>
                <TabsTrigger value="specifications" className="text-sm font-medium">
                  Specifications ({specifications.length})
                  {specifications.length > 0 && <span className="ml-2 text-xs text-green-600">✓</span>}
                </TabsTrigger>
                <TabsTrigger value="documentation" className="text-sm font-medium">
                  Files ({documentations.length})
                  {documentations.length > 0 && <span className="ml-2 text-xs text-green-600">✓</span>}
                </TabsTrigger>
                <TabsTrigger value="flowcharts" className="text-sm font-medium">
                  Flowcharts ({flowcharts.length})
                  {flowcharts.length > 0 && <span className="ml-2 text-xs text-green-600">✓</span>}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <TabsContent value="basic" className="mt-0">
                <StationEditBasicInfo
                  basicInfo={basicInfo}
                  stationId={station.stationId}
                  onChange={setBasicInfo}
                  isLoading={isLoading}
                  existingStations={allStations}
                />
              </TabsContent>

              <TabsContent value="specifications" className="mt-0">
                <StationSpecifications
                  specifications={specifications}
                  onChange={setSpecifications}
                  stationId={station.id}
                  isLoading={isLoading}
                  isEdit={true}
                />
              </TabsContent>

              <TabsContent value="documentation" className="mt-0">
                <StationDocumentation
                  documentations={documentations}
                  onChange={setDocumentations}
                  stationId={station.id}
                  isLoading={isLoading}
                  isEdit={true}
                />
              </TabsContent>

              <TabsContent value="flowcharts" className="mt-0">
                <StationFlowcharts
                  flowcharts={flowcharts}
                  onChange={setFlowcharts}
                  stationId={station.id}
                  isLoading={isLoading}
                  isEdit={true}
                />
              </TabsContent>
            </div>

            {/* Fixed Action Buttons */}
            <div className="flex justify-end space-x-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <Button variant="outline" onClick={handleCancel} disabled={isLoading} size="lg">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                {isLoading ? "Updating..." : "Update Station"}
              </Button>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Updated StationEditBasicInfo component for full width layout
function StationEditBasicInfo({
  basicInfo,
  stationId,
  onChange,
  isLoading,
  existingStations,
}: {
  basicInfo: {
    stationName: string
    location: string
    status: "active" | "inactive" | "maintenance"
    description: string
    operator: string
    priority: string
    Note: string[]
  }
  stationId: string
  onChange: (info: any) => void
  isLoading: boolean
  existingStations: Station[]
}) {
  const [stationNameError, setStationNameError] = useState<string>("")
  const [newNote, setNewNote] = useState<string>("")

  const handleFieldChange = (field: string, value: any) => {
    const newInfo = {
      ...basicInfo,
      [field]: value,
    }
    onChange(newInfo)

    // Clear error when user starts typing
    if (field === "stationName" && stationNameError) {
      setStationNameError("")
    }
  }

  const handleStationNameBlur = () => {
    if (!basicInfo.stationName.trim()) {
      setStationNameError("Station Name is required")
      return
    }

    // Check for duplicates (excluding current station)
    const duplicate = existingStations.find(
      (station) =>
        station.stationName.toLowerCase() === basicInfo.stationName.toLowerCase() && station.stationId !== stationId,
    )

    if (duplicate) {
      setStationNameError(`Station Name "${basicInfo.stationName}" already exists`)
    }
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Safe access to Note array with fallback to empty array
      const currentNotes = Array.isArray(basicInfo.Note) ? basicInfo.Note : []
      const updatedNotes = [...currentNotes, newNote.trim()]
      handleFieldChange("Note", updatedNotes)
      setNewNote("")
    }
  }

  const handleRemoveNote = (index: number) => {
    // Safe access to Note array with fallback to empty array
    const currentNotes = Array.isArray(basicInfo.Note) ? basicInfo.Note : []
    const updatedNotes = currentNotes.filter((_, i) => i !== index)
    handleFieldChange("Note", updatedNotes)
  }

  const handleEditNote = (index: number, newValue: string) => {
    // Safe access to Note array with fallback to empty array
    const currentNotes = Array.isArray(basicInfo.Note) ? basicInfo.Note : []
    const updatedNotes = [...currentNotes]
    updatedNotes[index] = newValue
    handleFieldChange("Note", updatedNotes)
  }

  const isFormValid = () => {
    return basicInfo.stationName.trim() && !stationNameError
  }

  return (
    <div className="space-y-8">
      {/* Station Information Section */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Station ID - Read Only */}
          <div className="space-y-2">
            <Label htmlFor="stationId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Station ID
            </Label>
            <Input
              id="stationId"
              value={stationId}
              disabled
              className="bg-gray-50 dark:bg-gray-700 cursor-not-allowed border-gray-200 dark:border-gray-600"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">Station ID cannot be changed after creation</p>
          </div>

          {/* Station Name */}
          <div className="space-y-2">
            <Label htmlFor="stationName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Station Name <span className="text-green-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="stationName"
                value={basicInfo.stationName}
                onChange={(e) => handleFieldChange("stationName", e.target.value)}
                onBlur={handleStationNameBlur}
                placeholder="Enter station name"
                className={`${stationNameError ? "border-green-500 focus:border-green-500" : ""} ${
                  basicInfo.stationName && !stationNameError ? "border-green-500 focus:border-green-500" : ""
                }`}
                disabled={isLoading}
              />
              {stationNameError && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {stationNameError && <p className="text-sm text-green-500">{stationNameError}</p>}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Location
            </Label>
            <Input
              id="location"
              value={basicInfo.location}
              onChange={(e) => handleFieldChange("location", e.target.value)}
              placeholder="Enter location"
              className={basicInfo.location ? "border-green-500 focus:border-green-500" : ""}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </Label>
            <Select
              value={basicInfo.status}
              onValueChange={(value) => handleFieldChange("status", value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Operator */}
          <div className="space-y-2">
            <Label htmlFor="operator" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Operator
            </Label>
            <Input
              id="operator"
              value={basicInfo.operator}
              onChange={(e) => handleFieldChange("operator", e.target.value)}
              placeholder="Enter operator name"
              disabled={isLoading}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </Label>
            <Input
              id="priority"
              value={basicInfo.priority}
              onChange={(e) => handleFieldChange("priority", e.target.value)}
              placeholder="Enter priority level"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Description - Full Width */}
        <div className="space-y-2 mt-6">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </Label>
          <Textarea
            id="description"
            value={basicInfo.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            placeholder="Enter station description"
            rows={4}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Notes Section */}
        <div className="space-y-4 mt-6">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</Label>

          {/* Add New Note */}
          <div className="flex gap-2">
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note..."
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddNote()
                }
              }}
            />
            <Button type="button" onClick={handleAddNote} disabled={!newNote.trim() || isLoading} variant="outline">
              Add Note
            </Button>
          </div>

          {/* Display Existing Notes */}
          {Array.isArray(basicInfo.Note) && basicInfo.Note.length > 0 && (
            <div className="space-y-2">
              {basicInfo.Note.map((note: string, index: number) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{index + 1}.</span>
                  <Input
                    value={note}
                    onChange={(e) => handleEditNote(index, e.target.value)}
                    disabled={isLoading}
                    className="flex-1 bg-white dark:bg-gray-800"
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveNote(index)}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    className="text-green-600 hover:text-green-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
