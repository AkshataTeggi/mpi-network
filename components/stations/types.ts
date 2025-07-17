

export interface Station {
  specificationValues: boolean
  id: string
  stationId: string
  stationName: string
  mpiId?: string | null
  status: "active" | "inactive" | "maintenance"
  description?: string
  location: string
  operator?: string
  priority?: number | null
  Note?: string[] | null
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  documentations?: Array<{
    id: string
    fileUrl: string
    description: string
    stationId: string
    createdAt: string
    updatedAt: string
  }>
  flowcharts?: Array<{
    id: string
    fileUrl: string
    description: string
    stationId: string
    createdAt: string
    updatedAt: string
  }>
  specifications?: Array<{
    stationSpecifications: any
    value: any
    unit: any
    fileUrl: any
    id: string
    name: string
    slug: string
    inputType: string
    suggestions?: string[]
    required?: boolean
    stationId: string
  }>
}

export interface CreateStationDto {
  stationId: string
  stationName: string
  location: string
  status: "active" | "inactive" | "maintenance"
  description?: string
  operator?: string
  priority?: number | null
  Note?: string[]
  documentations?: Array<{
    description: string
    fileUrl: string
  }>
  flowcharts?: Array<{
    description: string
    fileUrl: string
  }>
  specifications?: Array<{
    name: string
    inputType: string
    suggestions?: string[]
    required?: boolean
  }>
}

export interface UpdateStationDto {
  stationId?: string
  stationName?: string
  location?: string
  status?: "active" | "inactive" | "maintenance"
  description?: string
  operator?: string
  priority?: number | null
  Note?: string[] | null
  documentations?: Array<{
    description: string
    fileUrl: string
  }>
  flowcharts?: Array<{
    description: string
    fileUrl: string
  }>
  specifications?: Array<{
    name: string
    inputType: string
    suggestions?: string[]
    required?: boolean
  }>
  specificationValues?: Array<{
    specificationId: string
    value: string
    unit?: string
  }>
}

// Station-related specification types
export type StationInputType = "TEXT" | "CHECKBOX" | "DROPDOWN" | "FILE_UPLOAD" | "number"

export interface StationSpecification {
  id: string
  name: string
  slug: string
  inputType: StationInputType
  stationId: string
  suggestions?: string[]
  required?: boolean
}

export interface CreateStationSpecificationDto {
  name: string
  inputType: StationInputType
  stationId: string
  suggestions?: string[]
  required?: boolean
}

export interface UpdateStationSpecificationDto {
  name?: string
  inputType?: StationInputType
  stationId?: string
  suggestions?: string[]
  required?: boolean
}
