"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserType } from "./user-list-mobile"
import { UserList } from "./user-list"
import { UserListMobile } from "./user-list-mobile"

interface UserTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  users: UserType[]
  onView: (userId: string) => void
  onEdit: (userId: string) => void
  onDelete: (user: UserType) => void
}

export function UserTabs({ activeTab, onTabChange, users, onView, onEdit, onDelete }: UserTabsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="w-full grid grid-cols-4">
        <TabsTrigger value="all" className="w-full">
          All
        </TabsTrigger>
        <TabsTrigger value="active" className="w-full">
          Active
        </TabsTrigger>
        <TabsTrigger value="inactive" className="w-full">
          Inactive
        </TabsTrigger>
        <TabsTrigger value="pending" className="w-full">
          Pending
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-6">
        {isDesktop ? (
          <UserList
            users={users.map((user) => ({
              ...user,
              createdAt: typeof user.createdAt === "string" ? user.createdAt : user.createdAt.toISOString(),
              updatedAt: typeof user.updatedAt === "string" ? user.updatedAt : user.updatedAt.toISOString(),
            }))}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ) : (
          <UserListMobile users={users} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>
      <TabsContent value="active" className="mt-6">
        {isDesktop ? (
          <UserList
            users={users.map((user) => ({
              ...user,
              createdAt: typeof user.createdAt === "string" ? user.createdAt : user.createdAt.toISOString(),
              updatedAt: typeof user.updatedAt === "string" ? user.updatedAt : user.updatedAt.toISOString(),
            }))}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ) : (
          <UserListMobile users={users} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>
      <TabsContent value="inactive" className="mt-6">
        {isDesktop ? (
          <UserList
            users={users.map((user) => ({
              ...user,
              createdAt: typeof user.createdAt === "string" ? user.createdAt : user.createdAt.toISOString(),
              updatedAt: typeof user.updatedAt === "string" ? user.updatedAt : user.updatedAt.toISOString(),
            }))}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ) : (
          <UserListMobile users={users} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>
      <TabsContent value="pending" className="mt-6">
        {isDesktop ? (
          <UserList
            users={users.map((user) => ({
              ...user,
              createdAt: typeof user.createdAt === "string" ? user.createdAt : user.createdAt.toISOString(),
              updatedAt: typeof user.updatedAt === "string" ? user.updatedAt : user.updatedAt.toISOString(),
            }))}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ) : (
          <UserListMobile users={users} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        )}
      </TabsContent>
    </Tabs>
  )
}
