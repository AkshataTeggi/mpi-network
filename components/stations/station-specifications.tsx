

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, X, Edit, Save } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StationAPI } from "./station-api"
import type { StationInputType } from "./types"
import type { CreateSpecificationDto } from "../specifications/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SpecificationAPI } from "../specifications/specification-api"

interface StationSpecificationsProps {
  specifications: any[]
  onChange: (specifications: any[]) => void
  stationId?: string
  onSubmit: () => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  isEdit?: boolean
}

interface NewSpecification {
  name: string
  inputType: StationInputType | ""
  options: string[]
  fileValue?: File | null
  unit?: string
}

export function StationSpecifications({
  specifications,
  onChange,
  stationId,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: StationSpecificationsProps) {
  const inputTypes: StationInputType[] = ["TEXT", "CHECKBOX", "DROPDOWN", "FILE_UPLOAD", "number"]
  const [newSpec, setNewSpec] = useState<NewSpecification>({
    name: "",
    inputType: "",
    options: [],
    fileValue: null,
    unit: "",
  })
  const [showDuplicateSpecDialog, setShowDuplicateSpecDialog] = useState(false)
  const [duplicateSpecInfo, setDuplicateSpecInfo] = useState<{
    name: string
    existingSpec?: any
  }>({ name: "" })
  const [newOption, setNewOption] = useState("")
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())
  const [creatingSpec, setCreatingSpec] = useState(false)
  const [deletingSpecs, setDeletingSpecs] = useState<Set<string>>(new Set())
  const [editingSpec, setEditingSpec] = useState<string | null>(null)
  const [editingSpecData, setEditingSpecData] = useState<any>({})
  const { toast } = useToast()
  const [editingOptions, setEditingOptions] = useState<string[]>([])
  const [newEditOption, setNewEditOption] = useState("")

  // Handle specification value changes
  const handleSpecificationValueChange = (specId: string, value: any) => {
    console.log(`🔧 Updating spec ${specId} with value:`, value)

    onChange(specifications.map((spec) => (spec.id === specId ? { ...spec, value: value } : spec)))
  }

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const addNewSpecification = async () => {
    if (!newSpec.name.trim() || !newSpec.inputType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (newSpec.inputType === "DROPDOWN" && newSpec.options.length === 0) {
      toast({
        title: "Validation Error",
        description: "Dropdown specifications require at least one option.",
        variant: "destructive",
      })
      return
    }

    const existingSpec = specifications.find((spec) => spec.name.toLowerCase() === newSpec.name.trim().toLowerCase())

    if (existingSpec) {
      setDuplicateSpecInfo({
        name: newSpec.name.trim(),
        existingSpec,
      })
      setShowDuplicateSpecDialog(true)
      return
    }

    try {
      setCreatingSpec(true)

      if (stationId) {
        const createDto: CreateSpecificationDto = {
          name: newSpec.name.trim(),
          slug: generateSlug(newSpec.name.trim()),
          inputType: newSpec.inputType,
          stationId: stationId,
        }

        console.log("Creating specification with DTO:", createDto)
        const createdSpec = await SpecificationAPI.createSpecification(createDto)
        console.log("Created specification:", createdSpec)

        const specificationWithOptions = {
          ...createdSpec,
          originalName: newSpec.name.trim(), // Store original name
          options: newSpec.options,
          suggestions: newSpec.inputType === "DROPDOWN" ? newSpec.options : [],
          required: newSpec.inputType === "CHECKBOX" ? true : false,
          fileValue: newSpec.inputType === "FILE_UPLOAD" ? newSpec.fileValue : null,
          unit: newSpec.unit || null,
          isNew: true,
        }

        onChange([...specifications, specificationWithOptions])
      } else {
        const tempSpec = {
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: newSpec.name.trim(),
          originalName: newSpec.name.trim(), // Store original name
          slug: generateSlug(newSpec.name.trim()),
          inputType: newSpec.inputType,
          options: newSpec.options,
          suggestions: newSpec.inputType === "DROPDOWN" ? newSpec.options : [],
          required: newSpec.inputType === "CHECKBOX" ? true : false,
          fileValue: newSpec.inputType === "FILE_UPLOAD" ? newSpec.fileValue : null,
          unit: newSpec.unit || null,
          isNew: true,
          isTemporary: true,
        }

        onChange([...specifications, tempSpec])
      }

      setNewSpec({ name: "", inputType: "", options: [], fileValue: null, unit: "" })

      toast({
        title: "Success",
        description: stationId ? "Specification created successfully." : "Specification added to station.",
      })
    } catch (error) {
      console.error("Failed to create specification:", error)
      toast({
        title: "Error",
        description: "Failed to create specification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCreatingSpec(false)
    }
  }

  const handleFileUpload = async (specId: string, file: File, specificationId: string) => {
    if (!stationId || !file) return

    setUploadingFiles((prev) => new Set(prev).add(specId))

    try {
      const result = await StationAPI.uploadStationSpecificationFile(
        file,
        specificationId,
        stationId,
        specifications.find((spec) => spec.id === specId)?.unit,
      )

      onChange(
        specifications.map((spec) =>
          spec.id === specId ? { ...spec, fileUrl: result.fileUrl, value: result.value } : spec,
        ),
      )

      toast({
        title: "Success",
        description: "File uploaded successfully.",
      })
    } catch (error) {
      console.error("File upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(specId)
        return newSet
      })
    }
  }

  const handleChooseDifferentSpecName = () => {
    setShowDuplicateSpecDialog(false)
    setNewSpec((prev) => ({ ...prev, name: "" }))
    setTimeout(() => {
      document.getElementById("specName")?.focus()
    }, 100)
  }

  const removeSpecification = async (specId: string) => {
    const spec = specifications.find((s) => s.id === specId)
    if (!spec) return

    if (spec.isNew && spec.id.startsWith("temp-")) {
      const newSpecs = specifications.filter((s) => s.id !== specId)
      onChange(newSpecs)
      return
    }

    if (!confirm(`Are you sure you want to delete the specification "${spec.name}"?`)) {
      return
    }

    try {
      setDeletingSpecs((prev) => new Set(prev).add(specId))

      console.log("Deleting specification with ID:", specId)
      await SpecificationAPI.deleteSpecification(specId)

      const newSpecs = specifications.filter((s) => s.id !== specId)
      onChange(newSpecs)

      toast({
        title: "Success",
        description: "Specification deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete specification:", error)
      toast({
        title: "Error",
        description: "Failed to delete specification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingSpecs((prev) => {
        const newSet = new Set(prev)
        newSet.delete(specId)
        return newSet
      })
    }
  }

  const startEditingSpec = (spec: any) => {
    setEditingSpec(spec.id)
    const options = spec.options || spec.suggestions || []
    const optionsArray = typeof options === "string" ? JSON.parse(options) : options
    setEditingSpecData({
      name: spec.name,
      inputType: spec.inputType,
      options: optionsArray,
    })
    setEditingOptions(optionsArray)
  }

  const cancelEditingSpec = () => {
    setEditingSpec(null)
    setEditingSpecData({})
    setEditingOptions([])
    setNewEditOption("")
  }

  const saveEditingSpec = async () => {
    if (!editingSpec) return

    try {
      const updateDto = {
        name: editingSpecData.name,
        inputType: editingSpecData.inputType,
        suggestions: editingSpecData.inputType === "DROPDOWN" ? editingSpecData.options : [],
      }

      await SpecificationAPI.updateSpecification(editingSpec, updateDto)

      onChange(
        specifications.map((spec) =>
          spec.id === editingSpec
            ? {
                ...spec,
                name: editingSpecData.name,
                inputType: editingSpecData.inputType,
                options: editingSpecData.options,
                suggestions: editingSpecData.inputType === "DROPDOWN" ? editingSpecData.options : [],
              }
            : spec,
        ),
      )

      setEditingSpec(null)
      setEditingSpecData({})

      toast({
        title: "Success",
        description: "Specification updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update specification:", error)
      toast({
        title: "Error",
        description: "Failed to update specification. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addOption = () => {
    if (newOption.trim()) {
      setNewSpec((prev) => ({
        ...prev,
        options: [...prev.options, newOption.trim()],
      }))
      setNewOption("")
    }
  }

  const removeOption = (index: number) => {
    setNewSpec((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
  }

  const handleInputTypeChange = (value: StationInputType) => {
    setNewSpec((prev) => ({
      ...prev,
      inputType: value,
      options: value === "DROPDOWN" ? prev.options : [],
    }))
  }

  const formatInputType = (inputType: string) => {
    return inputType
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatOptions = (options: any) => {
    if (!options || options.length === 0) return "No options"

    try {
      const optionsArray = typeof options === "string" ? JSON.parse(options) : options
      return optionsArray.join(", ")
    } catch {
      return "Invalid options"
    }
  }

  const requiresOptions = newSpec.inputType === "DROPDOWN"

  const addEditOption = () => {
    if (newEditOption.trim()) {
      const updatedOptions = [...editingOptions, newEditOption.trim()]
      setEditingOptions(updatedOptions)
      setEditingSpecData((prev: any) => ({ ...prev, options: updatedOptions }))
      setNewEditOption("")
    }
  }

  const removeEditOption = (index: number) => {
    const updatedOptions = editingOptions.filter((_, i) => i !== index)
    setEditingOptions(updatedOptions)
    setEditingSpecData((prev: any) => ({ ...prev, options: updatedOptions }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="mt-5">
          {/* Specifications Table */}
          {specifications.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold">Existing Specifications</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4">Name</TableHead>
                      <TableHead className="px-4">Type</TableHead>
                      <TableHead className="px-4">Options</TableHead>
                      <TableHead className="px-4">Status</TableHead>
                      <TableHead className="text-right px-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specifications.map((spec) => (
                      <TableRow key={spec.id}>
                        <TableCell className="px-4">
                          {editingSpec === spec.id ? (
                            <Input
                              value={editingSpecData.name || ""}
                              onChange={(e) => setEditingSpecData((prev: any) => ({ ...prev, name: e.target.value }))}
                              className="h-8"
                            />
                          ) : (
                            <span className="font-medium">{spec.name}</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4">
                          {editingSpec === spec.id ? (
                            <Select
                              value={editingSpecData.inputType || ""}
                              onValueChange={(value) =>
                                setEditingSpecData((prev: any) => ({ ...prev, inputType: value }))
                              }
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {inputTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {formatInputType(type)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span>{formatInputType(spec.inputType)}</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4">
                          {editingSpec === spec.id && editingSpecData.inputType === "DROPDOWN" ? (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  value={newEditOption}
                                  onChange={(e) => setNewEditOption(e.target.value)}
                                  placeholder="Add option"
                                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEditOption())}
                                  className="h-8 text-sm"
                                />
                                <Button
                                  type="button"
                                  onClick={addEditOption}
                                  size="sm"
                                  className="h-8 px-2 bg-green-600 hover:bg-green-700"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="max-h-20 overflow-y-auto bg-gray-50 border rounded p-2">
                                <div className="flex flex-wrap gap-1">
                                  {editingOptions.map((option, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center gap-1 bg-white border rounded px-2 py-1 text-xs"
                                    >
                                      {option}
                                      <X
                                        className="w-3 h-3 cursor-pointer hover:text-green-600"
                                        onClick={() => removeEditOption(index)}
                                      />
                                    </span>
                                  ))}
                                </div>
                                {editingOptions.length === 0 && (
                                  <span className="text-xs text-muted-foreground">No options</span>
                                )}
                              </div>
                            </div>
                          ) : editingSpec === spec.id ? (
                            <div className="max-h-20 overflow-y-auto bg-gray-50 border rounded p-2 text-sm">
                              {editingSpecData.inputType === "DROPDOWN"
                                ? "Select dropdown type to edit options"
                                : "No options for this type"}
                            </div>
                          ) : (
                            <div className="max-h-20 overflow-y-auto">
                              <span className="text-sm">{formatOptions(spec.options || spec.suggestions)}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4">
                          <span className="text-sm">
                            {spec.isNew ? "New" : "Existing"}
                            {uploadingFiles.has(spec.id) && " (Uploading...)"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right px-4">
                          <div className="flex items-center justify-end gap-2">
                            {editingSpec === spec.id ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={saveEditingSpec}
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  title="Save changes"
                                >
                                  <Save className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEditingSpec}
                                  className="h-8 w-8 p-0"
                                  title="Cancel editing"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEditingSpec(spec)}
                                  className="h-8 w-8 p-0"
                                  title="Edit specification"
                                  disabled={spec.isNew && spec.id.startsWith("temp-")}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeSpecification(spec.id)}
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  disabled={deletingSpecs.has(spec.id)}
                                  title="Delete specification"
                                >
                                  {deletingSpecs.has(spec.id) ? (
                                    <div className="w-3 h-3 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                                  ) : (
                                    <Trash2 className="w-3 h-3" />
                                  )}
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Add New Specification */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold">Create New Specification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specName">Specification Name</Label>
                <Input
                  id="specName"
                  value={newSpec.name}
                  onChange={(e) => setNewSpec((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter specification name"
                  disabled={creatingSpec}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specType">Input Type</Label>
                <Select value={newSpec.inputType} onValueChange={handleInputTypeChange} disabled={creatingSpec}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select input type" />
                  </SelectTrigger>
                  <SelectContent>
                    {inputTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatInputType(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options for Dropdown */}
            {requiresOptions && (
              <div className="space-y-4">
                <Label>Dropdown Options </Label>
                <div className="flex gap-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add option"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addOption())}
                    disabled={creatingSpec}
                  />
                  <Button
                    type="button"
                    onClick={addOption}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={creatingSpec}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newSpec.options.map((option, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {option}
                      <X className="w-3 h-3 cursor-pointer hover:text-green-600" onClick={() => removeOption(index)} />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* File Upload for FILE_UPLOAD type */}
            {newSpec.inputType === "FILE_UPLOAD" && (
              <div className="space-y-4">
                <Label>File Upload</Label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    onChange={(e) => setNewSpec((prev) => ({ ...prev, fileValue: e.target.files?.[0] || null }))}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif,.svg"
                    className="cursor-pointer"
                    disabled={creatingSpec}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, SVG (Max 10MB)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit (Optional)</Label>
                  <Input
                    id="unit"
                    value={newSpec.unit || ""}
                    onChange={(e) => setNewSpec((prev) => ({ ...prev, unit: e.target.value }))}
                    placeholder="Enter unit (e.g., mm, kg, V)"
                    disabled={creatingSpec}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={addNewSpecification}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={
                !newSpec.name.trim() ||
                !newSpec.inputType ||
                (requiresOptions && newSpec.options.length === 0) ||
                creatingSpec
              }
            >
              {creatingSpec ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Specification
                </>
              )}
            </Button>
          </div>

          {/* Summary */}
          {specifications.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No specifications added to this station.</p>
          )}

         

          {/* Duplicate Specification Name Dialog */}
          <Dialog open={showDuplicateSpecDialog} onOpenChange={setShowDuplicateSpecDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  Specification Name Already Exists
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-3">
                    <div>
                      A specification with the name <strong>"{duplicateSpecInfo.name}"</strong> already exists in this
                      station.
                    </div>
                    {duplicateSpecInfo.existingSpec && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-amber-800">Existing Specification Details:</div>
                        <ul className="text-sm text-amber-700 mt-1 space-y-1">
                          <li>• Name: {duplicateSpecInfo.existingSpec.name}</li>
                          <li>• Type: {formatInputType(duplicateSpecInfo.existingSpec.inputType)}</li>
                          {/* <li>• Slug: {duplicateSpecInfo.existingSpec.slug}</li> */}
                        </ul>
                      </div>
                    )}
                    <div className="text-sm">Please choose a different specification name to continue.</div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-center">
                <Button
                  onClick={handleChooseDifferentSpecName}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                >
                  Choose Different Name
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}



