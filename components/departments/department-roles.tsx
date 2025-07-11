"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Department } from "./types"

interface DepartmentRolesProps {
  department: Department
}

export function DepartmentRoles({ department }: DepartmentRolesProps) {
  return (
    <div className="space-y-6">
      {department.roles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {department.roles.map((role) => (
            <Card key={role.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{role.name}</CardTitle>
                    <CardDescription className="mt-1">{role.description}</CardDescription>
                  </div>
                  <Badge variant={role.isActive ? "default" : "secondary"}>
                    {role.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>Created: {new Date(role.createdAt).toLocaleDateString()}</p>
                  {role.updatedAt && <p>Last updated: {new Date(role.updatedAt).toLocaleDateString()}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
          <p className="text-muted-foreground">No roles found for this department</p>
        </div>
      )}
    </div>
  )
}
