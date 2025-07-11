"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, X, Edit, Save } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

interface StationNotesProps {
  notes: string[]
  onChange: (notes: string[]) => void
  onSubmit: () => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  isEdit?: boolean
}

export function StationNotes({ notes, onChange, onSubmit, onCancel, isLoading, isEdit }: StationNotesProps) {
  const [newNote, setNewNote] = useState<string>("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingNote, setEditingNote] = useState<string>("")

  const handleAddNote = () => {
    if (!newNote.trim()) return

    const updatedNotes = [...notes, newNote.trim()]
    onChange(updatedNotes)
    setNewNote("")
  }

  const handleRemoveNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index)
    onChange(updatedNotes)
  }

  const startEditingNote = (index: number) => {
    setEditingIndex(index)
    setEditingNote(notes[index])
  }

  const saveEditingNote = () => {
    if (editingIndex === null) return

    const updatedNotes = [...notes]
    updatedNotes[editingIndex] = editingNote.trim()
    onChange(updatedNotes)
    setEditingIndex(null)
    setEditingNote("")
  }

  const cancelEditingNote = () => {
    setEditingIndex(null)
    setEditingNote("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="mt-5">
          {/* Existing Notes Table */}
          {notes.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold">Existing Notes</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4">#</TableHead>
                      <TableHead className="px-4">Note</TableHead>
                      <TableHead className="text-right px-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notes.map((note, index) => (
                      <TableRow key={index}>
                        <TableCell className="px-4">
                          <span className="text-sm text-muted-foreground">{index + 1}</span>
                        </TableCell>
                        <TableCell className="px-4">
                          {editingIndex === index ? (
                            <Textarea
                              value={editingNote}
                              onChange={(e) => setEditingNote(e.target.value)}
                              className="min-h-[60px] resize-none"
                              placeholder="Enter note"
                            />
                          ) : (
                            <div className="whitespace-pre-wrap text-sm">{note}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-right px-4">
                          <div className="flex items-center justify-end gap-2">
                            {editingIndex === index ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={saveEditingNote}
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  title="Save changes"
                                  disabled={!editingNote.trim()}
                                >
                                  <Save className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEditingNote}
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
                                  onClick={() => startEditingNote(index)}
                                  className="h-8 w-8 p-0"
                                  title="Edit note"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRemoveNote(index)}
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  title="Delete note"
                                >
                                  <X className="w-3 h-3" />
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

          {/* Add New Note */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold">Add New Note</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newNote">Note Content</Label>
                <Textarea
                  id="newNote"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note here..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Button
                onClick={handleAddNote}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!newNote.trim() || isLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>
          </div>

          {/* Summary */}
          {notes.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No notes added to this station.</p>
          )}

       
        </CardContent>
      </Card>
    </div>
  )
}
