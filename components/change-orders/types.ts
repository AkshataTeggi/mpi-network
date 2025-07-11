export interface ChangeOrderSection {
  id?: string
  section: string
  value: string
  replaceEarlier: boolean
  addRevision: boolean
  pullFromFiles: boolean
}

export interface ChangeOrder {
  id: string
  briefDescription: string
  mpiId: string
  createdAt: string
  updatedAt: string
  sections: ChangeOrderSection[]
}

export interface CreateChangeOrderDto {
  briefDescription: string
  mpiId: string
  sections: Omit<ChangeOrderSection, "id">[]
}

export interface UpdateChangeOrderDto {
  briefDescription?: string
  mpiId?: string
  sections?: Omit<ChangeOrderSection, "id">[]
}

export const CHANGE_ORDER_SECTION_TYPES = [
  "GENERAL",
  "TECHNICAL",
  "SAFETY",
  "QUALITY",
  "DOCUMENTATION",
  "MATERIALS",
  "EQUIPMENT",
  "PERSONNEL",
  "SCHEDULE",
  "COST",
] as const

export type ChangeOrderSectionType = (typeof CHANGE_ORDER_SECTION_TYPES)[number]
