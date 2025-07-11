export interface Specification {
  isRequired: any
  id: string
  name: string
  slug: string
  inputType: StationInputType
  stationId: string
  suggestions?: string[]
  required?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSpecificationDto {
  name: string
  slug: string
  inputType: StationInputType
  stationId: string
  suggestions?: string[]
  required?: boolean
}

export interface UpdateSpecificationDto {
  name?: string
  slug?: string
  inputType?: StationInputType
  stationId?: string
  suggestions?: string[]
  required?: boolean
}

export type StationInputType = "TEXT" | "CHECKBOX" | "DROPDOWN" | "FILE_UPLOAD" | "number"
