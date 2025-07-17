

"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeList } from "./employee-list"
import { EmployeeListMobile } from "./employee-list-mobile"
import { Employee } from "./types"

interface EmployeeTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  employees: Employee[] // Full list for tab count
  filteredEmployees: Employee[] // Only render filtered list here
  onView: (employeeId: string) => void
  onEdit: (employeeId: string) => void
  onDelete: (employee: Employee) => void
}

export function EmployeeTabs({
  activeTab,
  onTabChange,
  employees,
  filteredEmployees,
  onView,
  onEdit,
  onDelete,
}: EmployeeTabsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
        <TabsTrigger
          value="all"
          className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 text-slate-600 dark:text-slate-400"
        >
          All ({employees.length})
        </TabsTrigger>
        <TabsTrigger
          value="active"
          className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 text-slate-600 dark:text-slate-400"
        >
          Active ({employees.filter((emp) => emp.isActive).length})
        </TabsTrigger>
        <TabsTrigger
          value="inactive"
          className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 text-slate-600 dark:text-slate-400"
        >
          Inactive ({employees.filter((emp) => !emp.isActive).length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="mt-6">
        {isDesktop ? (
          <EmployeeList
            employees={filteredEmployees}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ) : (
          <EmployeeListMobile
            employees={filteredEmployees}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </TabsContent>
    </Tabs>
  )
}
