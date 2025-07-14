
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleList } from "./role-list";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RoleListMobile } from "./role-list-mobile";
import { PermissionListMobile } from "./permissions/permission-list-mobile";
import { PermissionList } from "./permissions/permission-list";
import { Permission, Role } from "./types";

interface RoleTabsProps {
  roles: Role[];
  permissions: Permission[];
  onRefresh: () => void;
  activeTab: "roles" | "permissions";
  onTabChange: (tab: "roles" | "permissions") => void;
}

export function RoleTabs({ roles, permissions, onRefresh, activeTab, onTabChange }: RoleTabsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "roles" | "permissions")}>
      {/* <TabsList className="w-full">
        <TabsTrigger value="roles" className="flex-1">
          Roles
        </TabsTrigger>
        <TabsTrigger value="permissions" className="flex-1">
          Permissions
        </TabsTrigger>
      </TabsList> */}

      <TabsContent value="roles">
        {isDesktop ? (
          <RoleList roles={roles} onRefresh={onRefresh} />
        ) : (
          <RoleListMobile roles={roles} onRefresh={onRefresh} />
        )}
      </TabsContent>

      <TabsContent value="permissions">
        {isDesktop ? (
          <PermissionList permissions={permissions} onRefresh={onRefresh} />
        ) : (
          <PermissionListMobile permissions={permissions} onRefresh={onRefresh} />
        )}
      </TabsContent>
    </Tabs>
  );
}
