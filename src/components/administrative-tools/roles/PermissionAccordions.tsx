import { sortedGroupedPermissions } from './grouped-permissions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Toggle } from '@/components/ui/toggle';
import { useRoleStore } from '@/hooks/stores/useRoleStore';
import { useTranslation } from 'react-i18next';
import { formatPermissionLabel } from './utils';
import { ResponsePermissionDto } from '@/types';

interface PermissionAccordionsProps {
  permissions?: ResponsePermissionDto[];
  type: 'create' | 'update';
}
export const PermissionAccordions = ({ permissions, type }: PermissionAccordionsProps) => {
  const roleStore = useRoleStore();
  const { t } = useTranslation('role');

  if (!permissions) return null;
  return (
    <Accordion type="multiple" className="w-full mt-0">
      {Object.entries(sortedGroupedPermissions(permissions)).map(([entity, permissions]) => (
        <AccordionItem key={entity} value={entity}>
          <AccordionTrigger className="text-sm font-extrabold py-2">
            {t(`role.permissions.entities.${entity}`, {
              defaultValue: formatPermissionLabel(entity)
            })}
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div key={entity}>
              {/* Toggles for Permissions */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {permissions.map((permission) => {
                  const isSelected = roleStore.isPermissionSelected(
                    permission?.id?.toString() || '',
                    type
                  );
                  return (
                    <Toggle
                      key={permission.id}
                      pressed={isSelected}
                      value={permission?.id?.toString()}
                      onPressedChange={(pressed) => {
                        if (!pressed) {
                          roleStore.removePermission(permission?.id?.toString() || '', type);
                        } else {
                          roleStore.addPermission(permission as any, type);
                        }
                      }}
                      className="border">
                      {t(`role.permissions.labels.${permission?.label}`, {
                        defaultValue: formatPermissionLabel(permission?.label)
                      })}
                    </Toggle>
                  );
                })}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
