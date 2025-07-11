"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerList } from "./customer-list"
import { CustomerListMobile } from "./customer-list-mobile"
import { Customer } from "./types"

interface CustomerTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  customers: Customer[]
  onView: (customerId: string) => void
  onEdit: (customerId: string) => void
  onDelete: (customer: Customer) => void
}

export function CustomerTabs({ activeTab, onTabChange, customers, onView, onEdit, onDelete }: CustomerTabsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
        <TabsTrigger
          value="all"
          className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 text-slate-600 dark:text-slate-400"
        >
          All ({customers.length})
        </TabsTrigger>
        <TabsTrigger
          value="active"
          className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 text-slate-600 dark:text-slate-400"
        >
          Active ({customers.filter((c) => c.isActive).length})
        </TabsTrigger>
        <TabsTrigger
          value="inactive"
          className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100 text-slate-600 dark:text-slate-400"
        >
          Inactive ({customers.filter((c) => !c.isActive).length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6">
        {isDesktop ? (
          <CustomerList customers={customers} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <CustomerListMobile customers={customers} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>

      <TabsContent value="active" className="mt-6">
        {isDesktop ? (
          <CustomerList customers={customers} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <CustomerListMobile customers={customers} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>

      <TabsContent value="inactive" className="mt-6">
        {isDesktop ? (
          <CustomerList customers={customers} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <CustomerListMobile customers={customers} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>
    </Tabs>
  )
}
