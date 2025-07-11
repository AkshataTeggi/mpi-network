"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SpecificationCard } from "./specification-card"
import { Plus, Search, Settings } from "lucide-react"
import type { Specification } from "./types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SpecificationListProps {
  specifications: Specification[]
  onCreateNew: () => void
  onEdit: (specification: Specification) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

export function SpecificationList({
  specifications,
  onCreateNew,
  onEdit,
  onDelete,
  isLoading,
}: SpecificationListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [requiredFilter, setRequiredFilter] = useState<string>("all")
  const [filteredSpecifications, setFilteredSpecifications] = useState<Specification[]>(specifications)

  // Calculate statistics
  const totalSpecifications = specifications.length
  const requiredSpecifications = specifications.filter((spec) => spec.isRequired).length
  const optionalSpecifications = specifications.filter((spec) => !spec.isRequired).length
  const uniqueTypes = [...new Set(specifications.map((spec) => spec.inputType))].length

  useEffect(() => {
    let filtered = specifications

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (spec) =>
          spec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (spec.description && spec.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((spec) => spec.inputType === typeFilter)
    }

    // Filter by required status
    if (requiredFilter !== "all") {
      filtered = filtered.filter((spec) => (requiredFilter === "required" ? spec.isRequired : !spec.isRequired))
    }

    setFilteredSpecifications(filtered)
  }, [specifications, searchTerm, typeFilter, requiredFilter])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading specifications...</p>
        </div>
      </div>
    )
  }

  const inputTypes = [...new Set(specifications.map((spec) => spec.inputType))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-red-600">Specification Management</h1>
          <p className="text-muted-foreground">Define and manage input specifications</p>
        </div>
        <Button onClick={onCreateNew} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white">
          <Plus className="w-4 h-4" />
          Add Specification
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Specifications</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalSpecifications}</div>
            <p className="text-xs text-muted-foreground">All input specifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Required</CardTitle>
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{requiredSpecifications}</div>
            <p className="text-xs text-muted-foreground">Mandatory fields</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optional</CardTitle>
            <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{optionalSpecifications}</div>
            <p className="text-xs text-muted-foreground">Optional fields</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Input Types</CardTitle>
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{uniqueTypes}</div>
            <p className="text-xs text-muted-foreground">Different input types</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search specifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {inputTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={requiredFilter} onValueChange={setRequiredFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by requirement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fields</SelectItem>
            <SelectItem value="required">Required Only</SelectItem>
            <SelectItem value="optional">Optional Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Specifications Grid */}
      {filteredSpecifications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {specifications.length === 0
              ? "No specifications found. Create your first specification!"
              : "No specifications match your search criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecifications.map((specification) => (
            <SpecificationCard
              key={specification.id}
              specification={specification}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
