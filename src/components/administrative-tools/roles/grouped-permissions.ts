import { Permission } from "@/types/permission";

export const groupedPermissions = (permissions: Permission[]) =>
  permissions?.reduce((groups, permission) => {
    const [_, ...rest] = permission?.label?.split("_") || [];
    const entity = rest.join("_");
    if (!groups[entity]) {
      groups[entity] = [];
    }
    groups[entity].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

export const sortedGroupedPermissions = (
  permissions: Permission[]
) =>
  Object.entries(groupedPermissions(permissions) || {})
    .sort(([entityA], [entityB]) => entityA.localeCompare(entityB))
    .reduce((sortedGroups, [entity, permissions]) => {
      sortedGroups[entity] = permissions;
      return sortedGroups;
    }, {} as Record<string, Permission[]>);
