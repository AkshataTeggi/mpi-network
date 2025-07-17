

"use client"

import type React from "react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Info, FileText, ClipboardList, Factory } from "lucide-react"
import type { Station } from "../stations/types"
import { ChecklistTab } from "./checklist-tab"
import { DocumentationTab } from "./documentation-tab"
import { OrderDetailsTab } from "./order-details-tab"
import InstructionsTab from "./instructions-tab"

interface MPIFormTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  documentationCount: number
  checklistCount: number
  selectedStationsCount: number
  // Add all the props needed for the tab content components
  formData: {
    jobId: string
    assemblyId: string
    customer: string
    selectedStationIds: string[]
  }
  orderFormData: {
    orderType: string[]
    distributionDate: string
    requiredBy: string
    internalOrderNumber: string
    revision: string
    otherAttachments: string
    fileAction: string[]
    markComplete: boolean
    documentControlId: string
  }
  enums: any
  loadingEnums: boolean
  checkingIds: boolean
  onFormDataChange: (field: string, value: string) => void
  onOrderFormChange: (field: string, value: string | boolean | string[]) => void
  validateJobId: (jobId: string) => string | null
  validateAssemblyId: (assemblyId: string) => string | null
  validateDocumentControlId: (assemblyControlControlId: string) => string | null
  // Documentation tab props
  mpiDocumentation: any[]
  uploadingMpiDoc: boolean
  onDocumentUpload: (file: File, description: string) => Promise<void>
  onRemoveDocument: (index: number) => void
  toast: any
  // Checklist tab props
  checklistTemplate: any[]
  loadingChecklist: boolean
  checklistModifications: Record<string, { required: boolean; remarks: string }>
  onChecklistItemChange: (itemId: string, field: "required" | "remarks", value: boolean | string) => void
  getChecklistItemValue: (itemId: string, field: "required" | "remarks", defaultValue: boolean | string) => any
  // Instructions tab props
  availableStations: Station[]
  selectedStationIds: string[]
  loadingStations: boolean
  activeStationId: string | null
  stationViewMode: "specifications" | "documents" | "notes"
  specificationValues: Record<string, any>
  uploadingFiles: Set<string>
  mpiId?: string
  onStationSelectionChange: (stationIds: string[]) => void
  onActiveStationChange: (stationId: string | null) => void
  onStationViewModeChange: (mode: "specifications" | "documents" | "notes") => void
  onSpecificationValueChange: (specificationId: string, value: string, unit?: string) => void
  onFileUpload: (specificationId: string, file: File, stationId: string, unit?: string) => Promise<void>
  renderSpecificationInput: (spec: any, stationId: string) => React.ReactNode
  renderStationDocuments: (station: Station) => React.ReactNode
  instructions: string[]
  onAddInstruction: () => void
  onInstructionChange: (index: number, value: string) => void
  onRemoveInstruction: (index: number) => void

  // Add these missing props:
  stationDocuments: Record<string, any[]>
  onStationDocumentUpload: (stationId: string, file: File, description: string) => Promise<void>
  onStationDocumentRemove: (stationId: string, documentIndex: number) => void
}

export function MPIFormTabs({
  activeTab,
  onTabChange,
  documentationCount,
  checklistCount,
  selectedStationsCount,
  formData,
  orderFormData,
  enums,
  loadingEnums,
  checkingIds,
  onFormDataChange,
  onOrderFormChange,
  validateJobId,
  validateAssemblyId,
  validateDocumentControlId,
  mpiDocumentation,
  uploadingMpiDoc,
  onDocumentUpload,
  onRemoveDocument,
  toast,
  checklistTemplate,
  loadingChecklist,
  checklistModifications,
  onChecklistItemChange,
  getChecklistItemValue,
  availableStations,
  selectedStationIds,
  loadingStations,
  activeStationId,
  stationViewMode,
  specificationValues,
  uploadingFiles,
  mpiId,
  onStationSelectionChange,
  onActiveStationChange,
  onStationViewModeChange,
  onSpecificationValueChange,
  onFileUpload,
  renderSpecificationInput,
  renderStationDocuments,
  instructions,
  onAddInstruction,
  onInstructionChange,
  onRemoveInstruction,
  stationDocuments,
  onStationDocumentUpload,
  onStationDocumentRemove,
}: MPIFormTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic-info" className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          Order Details
        </TabsTrigger>
        <TabsTrigger value="documentation" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Files
          {documentationCount > 0 && (
            <Badge variant="secondary" size="sm" className="ml-1">
              {documentationCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="checklist" className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          Checklist
          {checklistCount > 0 && (
            <Badge variant="secondary" size="sm" className="ml-1">
              {checklistCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="stations" className="flex items-center gap-2">
          <Factory className="w-4 h-4" />
          Instructions
          {selectedStationsCount > 0 && (
            <Badge variant="secondary" size="sm" className="ml-1">
              {selectedStationsCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      {/* Tab Contents */}
      <TabsContent value="basic-info">
        <OrderDetailsTab
          formData={formData}
          orderFormData={orderFormData}
          enums={enums}
          loadingEnums={loadingEnums}
          checkingIds={checkingIds}
          onFormDataChange={onFormDataChange}
          onOrderFormChange={onOrderFormChange}
          validateJobId={validateJobId}
          validateAssemblyId={validateAssemblyId}
          validateDocumentControlId={validateDocumentControlId}
        />
      </TabsContent>

      <TabsContent value="documentation">
        <DocumentationTab
          mpiDocumentation={mpiDocumentation}
          uploadingMpiDoc={uploadingMpiDoc}
          onDocumentUpload={onDocumentUpload}
          onRemoveDocument={onRemoveDocument}
          toast={toast}
        />
      </TabsContent>

      <TabsContent value="checklist">
        <ChecklistTab
          checklistTemplate={checklistTemplate}
          loadingChecklist={loadingChecklist}
          checklistModifications={checklistModifications}
          onChecklistItemChange={onChecklistItemChange}
          getChecklistItemValue={getChecklistItemValue}
        />
      </TabsContent>

      <TabsContent value="stations">
        <InstructionsTab
          availableStations={availableStations}
          selectedStationIds={selectedStationIds}
          loadingStations={loadingStations}
          activeStationId={activeStationId}
          stationViewMode={stationViewMode}
          specificationValues={specificationValues}
          uploadingFiles={uploadingFiles}
          mpiId={mpiId}
          onStationSelectionChange={onStationSelectionChange}
          onActiveStationChange={onActiveStationChange}
          onStationViewModeChange={onStationViewModeChange}
          onSpecificationValueChange={onSpecificationValueChange}
          onFileUpload={onFileUpload}
          renderSpecificationInput={renderSpecificationInput}
          renderStationDocuments={renderStationDocuments}
          instructions={instructions}
          onAddInstruction={onAddInstruction}
          onInstructionChange={onInstructionChange}
          onRemoveInstruction={onRemoveInstruction}
          stationDocuments={stationDocuments}
          onStationDocumentUpload={onStationDocumentUpload}
          onStationDocumentRemove={onStationDocumentRemove}
        />
      </TabsContent>
    </Tabs>
  )
}
