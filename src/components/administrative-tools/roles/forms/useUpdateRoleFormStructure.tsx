import {
  CustomFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { RoleStore } from "@/hooks/stores/useRoleStore";
import { PermissionAccordions } from "../PermissionAccordions";
import { ResponsePermissionDto } from "@/types";
import { useTranslation } from "react-i18next";

interface RoleUpdateFormStructureProps {
  roleStore: RoleStore;
  permissions?: ResponsePermissionDto[];
}
export const useUpdateRoleFormStructure = ({
  roleStore,
  permissions,
}: RoleUpdateFormStructureProps) => {
  const { t } = useTranslation("role");
  const { t: tCommon } = useTranslation("common");

  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: t("forms.update.fields.label.label"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t("forms.update.fields.label.placeholder"),
    description: t("forms.update.fields.label.description"),
    error: roleStore.updateDtoErrors?.label?.[0],
    props: {
      value: roleStore.updateDto.label || undefined,
      onChange: (value) => {
        roleStore.setNested("updateDto.label", value);
        roleStore.setNested("updateDtoErrors.label", []);
      },
    },
  };

  const descriptionField: Field<TextFieldProps> = {
    id: "description",
    label: t("forms.update.fields.description.label"),
    variant: FieldVariant.TEXTAREA,
    required: true,
    placeholder: t("forms.update.fields.description.placeholder"),
    description: t("forms.update.fields.description.description"),
    error: roleStore.updateDtoErrors?.description?.[0],
    props: {
      value: roleStore.updateDto.description || undefined,
      onChange: (value) => {
        roleStore.setNested("updateDto.description", value);
        roleStore.setNested("updateDtoErrors.description", []);
      },
    },
  };

  const permissionsField: Field<CustomFieldProps> = {
    id: "permissions",
    label: t("forms.update.fields.permissions.label"),
    variant: FieldVariant.CUSTOM,
    required: true,
    description: t("forms.update.fields.permissions.description"),
    error: roleStore.updateDtoErrors?.permissions?.[0],
    props: {
      children: (
        <PermissionAccordions permissions={permissions} type="update" />
      ),
    },
  };

  const roleUpdateFormStructure: FormStructure = {
    title: { value: "" },
    description: { value: "" },
    fieldsets: [
      {
        title: { value: t("forms.update.title") },
        description: { value: t("forms.update.description") },
        rows: [
          {
            fields: [labelField],
          },
          {
            fields: [descriptionField],
          },
          {
            fields: [permissionsField],
          },
        ],
      },
    ],
  };

  return {
    roleUpdateFormStructure,
  };
};
