// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"
// import { X, Plus } from "lucide-react"
// import type { Specification, CreateSpecificationDto, UpdateSpecificationDto, InputType } from "./types"
// import { SpecificationAPI } from "./specification-api"

// interface SpecificationFormProps {
//   specification?: Specification
//   onSubmit: (data: CreateSpecificationDto | UpdateSpecificationDto) => Promise<void>
//   onCancel: () => void
//   isLoading?: boolean
// }

// export function SpecificationForm({ specification, onSubmit, onCancel, isLoading }: SpecificationFormProps) {
//   const [inputTypes, setInputTypes] = useState<InputType[]>([])
//   const [loadingInputTypes, setLoadingInputTypes] = useState(true)
//   const [formData, setFormData] = useState({
//     name: specification?.name || "",
//     description: specification?.description || "",
//     inputType: specification?.inputType || ("TEXT" as InputType),
//     isRequired: specification?.isRequired || false,
//     defaultValue: specification?.defaultValue || "",
//     options: specification?.options || [],
//     minValue: specification?.minValue || undefined,
//     maxValue: specification?.maxValue || undefined,
//     minLength: specification?.minLength || undefined,
//     maxLength: specification?.maxLength || undefined,
//     pattern: specification?.pattern || "",
//     placeholder: specification?.placeholder || "",
//   })
//   const [newOption, setNewOption] = useState("")

//   useEffect(() => {
//     loadInputTypes()
//   }, [])

//   const loadInputTypes = async () => {
//     try {
//       setLoadingInputTypes(true)
//       const types = await SpecificationAPI.getInputTypes()
//       setInputTypes(types)

//       // If this is a new specification and we have types, set the first one as default
//       if (!specification && types.length > 0) {
//         setFormData((prev) => ({ ...prev, inputType: types[0] }))
//       }
//     } catch (error) {
//       console.error("Failed to load input types:", error)
//       // Fallback to basic types if API fails
//       setInputTypes(["TEXT", "CHECKBOX", "DROPDOWN", "FILE_UPLOAD", "number"])
//     } finally {
//       setLoadingInputTypes(false)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const submitData = { ...formData }

//     // Clean up data based on input type
//     if (!["DROPDOWN", "CHECKBOX"].includes(formData.inputType)) {
//       delete submitData.options
//     }
//     if (!["number"].includes(formData.inputType)) {
//       delete submitData.minValue
//       delete submitData.maxValue
//     }
//     if (!["TEXT"].includes(formData.inputType)) {
//       delete submitData.minLength
//       delete submitData.maxLength
//       delete submitData.pattern
//     }

//     await onSubmit(submitData)
//   }

//   const handleChange = (field: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const addOption = () => {
//     if (newOption.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         options: [...prev.options, newOption.trim()],
//       }))
//       setNewOption("")
//     }
//   }

//   const removeOption = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       options: prev.options.filter((_, i) => i !== index),
//     }))
//   }

//   const requiresOptions = ["DROPDOWN", "CHECKBOX"].includes(formData.inputType)
//   const requiresMinMax = ["number"].includes(formData.inputType)
//   const requiresLength = ["TEXT"].includes(formData.inputType)
//   const requiresPattern = formData.inputType === "TEXT"

//   if (loadingInputTypes) {
//     return (
//       <div className="flex items-center justify-center py-8">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
//           <p className="mt-2 text-sm text-muted-foreground">Loading form configuration...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <CardTitle className="text-red-600">
//           {specification ? "Edit Specification" : "Create New Specification"}
//         </CardTitle>
//         <CardDescription>
//           {specification ? "Update specification configuration" : "Define a new input specification"}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Specification Name</Label>
//               <Input
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) => handleChange("name", e.target.value)}
//                 placeholder="Enter specification name"
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="inputType">Input Type</Label>
//               <Select value={formData.inputType} onValueChange={(value) => handleChange("inputType", value)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select input type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {inputTypes.map((type) => (
//                     <SelectItem key={type} value={type}>
//                       {type
//                         .replace("_", " ")
//                         .toLowerCase()
//                         .replace(/\b\w/g, (l) => l.toUpperCase())}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               value={formData.description}
//               onChange={(e) => handleChange("description", e.target.value)}
//               placeholder="Enter specification description (optional)"
//               rows={3}
//             />
//           </div>

//           {/* Configuration Options */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="placeholder">Placeholder</Label>
//               <Input
//                 id="placeholder"
//                 value={formData.placeholder}
//                 onChange={(e) => handleChange("placeholder", e.target.value)}
//                 placeholder="Enter placeholder text"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="defaultValue">Default Value</Label>
//               <Input
//                 id="defaultValue"
//                 value={formData.defaultValue}
//                 onChange={(e) => handleChange("defaultValue", e.target.value)}
//                 placeholder="Enter default value"
//               />
//             </div>
//           </div>

//           {/* Required Checkbox */}
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="isRequired"
//               checked={formData.isRequired}
//               onCheckedChange={(checked) => handleChange("isRequired", checked)}
//             />
//             <Label htmlFor="isRequired">This field is required</Label>
//           </div>

//           {/* Conditional Fields */}
//           {requiresOptions && (
//             <div className="space-y-4">
//               <Label>Options</Label>
//               <div className="flex gap-2">
//                 <Input
//                   value={newOption}
//                   onChange={(e) => setNewOption(e.target.value)}
//                   placeholder="Add option"
//                   onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addOption())}
//                 />
//                 <Button type="button" onClick={addOption} size="sm" className="bg-red-600 hover:bg-red-700">
//                   <Plus className="w-4 h-4" />
//                 </Button>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {formData.options.map((option, index) => (
//                   <Badge key={index} variant="secondary" className="flex items-center gap-1">
//                     {option}
//                     <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => removeOption(index)} />
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}

//           {requiresMinMax && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="minValue">Minimum Value</Label>
//                 <Input
//                   id="minValue"
//                   type="number"
//                   value={formData.minValue || ""}
//                   onChange={(e) => handleChange("minValue", e.target.value ? Number(e.target.value) : undefined)}
//                   placeholder="Enter minimum value"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="maxValue">Maximum Value</Label>
//                 <Input
//                   id="maxValue"
//                   type="number"
//                   value={formData.maxValue || ""}
//                   onChange={(e) => handleChange("maxValue", e.target.value ? Number(e.target.value) : undefined)}
//                   placeholder="Enter maximum value"
//                 />
//               </div>
//             </div>
//           )}

//           {requiresLength && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="minLength">Minimum Length</Label>
//                 <Input
//                   id="minLength"
//                   type="number"
//                   value={formData.minLength || ""}
//                   onChange={(e) => handleChange("minLength", e.target.value ? Number(e.target.value) : undefined)}
//                   placeholder="Enter minimum length"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="maxLength">Maximum Length</Label>
//                 <Input
//                   id="maxLength"
//                   type="number"
//                   value={formData.maxLength || ""}
//                   onChange={(e) => handleChange("maxLength", e.target.value ? Number(e.target.value) : undefined)}
//                   placeholder="Enter maximum length"
//                 />
//               </div>
//             </div>
//           )}

//           {requiresPattern && (
//             <div className="space-y-2">
//               <Label htmlFor="pattern">Validation Pattern (Regex)</Label>
//               <Input
//                 id="pattern"
//                 value={formData.pattern}
//                 onChange={(e) => handleChange("pattern", e.target.value)}
//                 placeholder="Enter regex pattern for validation"
//               />
//             </div>
//           )}

//           <div className="flex gap-2 pt-4">
//             <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
//               {isLoading ? "Saving..." : specification ? "Update Specification" : "Create Specification"}
//             </Button>
//             <Button type="button" variant="outline" onClick={onCancel}>
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }
