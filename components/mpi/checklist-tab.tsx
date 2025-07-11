"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface ChecklistSection {
  id: string
  name: string
  description: string
  items: ChecklistItem[]
}

interface ChecklistItem {
  id: string
  description: string
  required: boolean
  remarks: string
  category?: string
  isActive: boolean
  createdBy: string
  sectionId: string
}

interface ChecklistTabProps {
  checklistTemplate: ChecklistSection[]
  loadingChecklist: boolean
  checklistModifications: Record<string, { required: boolean; remarks: string }>
  onChecklistItemChange: (itemId: string, field: "required" | "remarks", value: boolean | string) => void
  getChecklistItemValue: (itemId: string, field: "required" | "remarks", defaultValue: boolean | string) => any
}

export function ChecklistTab({
  checklistTemplate,
  loadingChecklist,
  checklistModifications,
  onChecklistItemChange,
  getChecklistItemValue,
}: ChecklistTabProps) {
  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardContent className="mt-5">
          {loadingChecklist ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading checklist template...</p>
              </div>
            </div>
          ) : checklistTemplate.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No checklist template available.</p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {checklistTemplate.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{section.name}</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Configure quality control checklist items. Items marked as "Required" will be included in the
                        MPI.
                      </p>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Required</TableHead>
                            <TableHead>Remarks</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(section.items || []).map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.description}</TableCell>
                              <TableCell>
                                <Select
                                  value={getChecklistItemValue(item.id, "required", item.required) ? "yes" : "no"}
                                  onValueChange={(value) => onChecklistItemChange(item.id, "required", value === "yes")}
                                >
                                  <SelectTrigger className="w-20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={getChecklistItemValue(item.id, "remarks", item.remarks) as string}
                                  onChange={(e) => onChecklistItemChange(item.id, "remarks", e.target.value)}
                                  placeholder="Enter remarks (optional)"
                                  className="min-w-[200px]"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
