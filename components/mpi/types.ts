
export interface StationSpecification {
  id: string
  specificationId: string
  stationId: string
  value: string
  unit?: string | null
}

export interface Specification {
  id: string
  name: string
  slug: string
  inputType: string
  suggestions: string[]
  required: boolean
  stationId: string
  stationSpecifications: StationSpecification[]
}

export interface Station {
  id: string
  stationId: string
  stationName: string
  mpiId?: string | null
  status: "active" | "inactive" | "maintenance"
  description?: string
  location: string
  operator?: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  specifications?: Specification[]
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
}

export interface ChecklistItem {
  id: string
  description: string
  category?: string | null
  required: boolean
  remarks: string
  isActive: boolean
  createdBy: string
  sectionId: string
  createdAt: string
  updatedAt: string
}

export interface Checklist {
  id: string
  name: string
  mpiId: string
  createdAt: string
  updatedAt: string
  checklistItems: ChecklistItem[]
}

export interface ChangeOrderForm {
  id: string
  changeOrderNumber: string
  description: string
  requestedBy: string
  approvedBy?: string
  status: "pending" | "approved" | "rejected" | "implemented"
  priority: "low" | "medium" | "high" | "critical"
  estimatedCost?: number
  actualCost?: number
  requestDate: string
  approvalDate?: string
  implementationDate?: string
  mpiId: string
  createdAt: string
  updatedAt: string
}

export interface OrderForm {
  id: string
  orderType: string
  distributionDate: string
  requiredBy: string
  customer?: string
  internalOrderNumber: string
  revision: string
  otherAttachments: string | null
  fileAction: string | null
  markComplete: boolean
  documentControlId: string | null
  mpiId: string
}


export interface CreateMPIDto {
  jobId: string
  assemblyId: string
  customer?: string | null
  Instruction?: string[] // Backend expects 'Instruction' not 'instructions'
  orderForms?: {
    orderType: string[]
    distributionDate?: string
    requiredBy?: string
    internalOrderNumber?: string
    revision?: string
    otherAttachments?: string
    fileAction?: string[]
    markComplete?: boolean
    documentControlId?: string
  }
  stations?: Array<{
    id: string
    specificationValues?: Array<{
      specificationId: string
      value: string
      unit?: string
    }>
    documentations?: Array<{
      id?: string
      fileUrl: string
      description: string
    }>
  }>
  checklists?: Array<{
    name: string
    checklistItems: Array<{
      description: string
      required: boolean
      remarks: string
      createdBy: string
      isActive: boolean
      category?: string
    }>
  }>
  mpiDocs?: Array<{
    id?: string
    fileUrl: string
    description: string
  }>
}

export interface UpdateMPIDto {
  jobId?: string
  assemblyId?: string
  customer?: string | null
  Instruction?: string[] // Backend expects 'Instruction' not 'instructions'
  orderForms?: {
    orderType?: string[]
    distributionDate?: string
    requiredBy?: string
    internalOrderNumber?: string
    revision?: string
    otherAttachments?: string
    fileAction?: string[]
    markComplete?: boolean
    documentControlId?: string
  }
  stations?: Array<{
    id: string
    specificationValues?: Array<{
      specificationId: string
      value: string
      unit?: string
    }>
    documentations?: Array<{
      id?: string
      fileUrl: string
      description: string
    }>
  }>
  checklists?: Array<{
    id?: string
    name: string
    checklistItems: Array<{
      id?: string
      description: string
      required: boolean
      remarks: string
      createdBy: string
      isActive: boolean
      category?: string
    }>
  }>
  mpiDocs?: Array<{
    id?: string
    fileUrl: string
    description: string
  }>
}

export interface MPI {
  stationMpiDocuments: any
  id: string
  jobId: string
  assemblyId: string
  customer: string | null
  instructions?: string[]
  Instruction?: string[]
  createdAt: string
  updatedAt: string
  stations?: Array<{
    id: string
    stationId?: string
    stationName: string
    status?: string
    location?: string
    operator?: string
    description?: string
    specifications?: Array<{
      id: string
      name: string
      inputType: string
      required: boolean
      value?: string
      unit?: string
      stationSpecifications?: Array<{
        id: string
        specificationId: string
        stationId: string
        value: string
        unit?: string
      }>
    }>
    documentations?: Array<{
      id: string
      fileUrl: string
      description: string
      createdAt: string
      updatedAt: string
    }>
  }>
  orderForms?: Array<{
    id: string
    orderType: string[]
    distributionDate?: string
    requiredBy?: string
    internalOrderNumber?: string
    revision?: string
    otherAttachments?: string
    fileAction: string[]
    markComplete: boolean
    documentControlId?: string
  }>
  checklists?: Array<{
    id: string
    name: string
    checklistItems: Array<{
      id: string
      description: string
      required: boolean
      remarks: string
      category?: string
      isActive: boolean
      createdBy: string
    }>
  }>
  mpiDocs?: Array<{
    id: string
    fileUrl: string
    description: string
    createdAt: string
    updatedAt: string
  }>
}
