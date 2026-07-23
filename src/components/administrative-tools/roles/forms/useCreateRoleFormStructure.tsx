import {
  CustomFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { RoleStore } from "@/hooks/stores/useRoleStore";
import { PermissionAccordions } from "../PermissionAccordions";
import { Permission } from "@/types/permission";
import { useTranslation } from "react-i18next";

interface RoleCreateFormStructureProps {
  roleStore: RoleStore;
  permissions?: Permission[];
}
export const useCreateRoleFormStructure = ({
  roleStore,
  permissions,
}: RoleCreateFormStructureProps) => {
  const { t } = useTranslation("role");
  const { t: tCommon } = useTranslation("common");

  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: t("forms.create.fields.label.label"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t("forms.create.fields.label.placeholder"),
    description: t("forms.create.fields.label.description"),
    error: roleStore.createDtoErrors?.label?.[0],
    props: {
      value: roleStore.createDto.label || undefined,
      onChange: (value) => {
        roleStore.setNested("createDto.label", value);
        roleStore.setNested("createDtoErrors.label", []);
      },
    },
  };

  const descriptionField: Field<TextFieldProps> = {
    id: "description",
    label: t("forms.create.fields.description.label"),
    variant: FieldVariant.TEXTAREA,
    required: true,
    placeholder: t("forms.create.fields.description.placeholder"),
    description: t("forms.create.fields.description.description"),
    error: roleStore.createDtoErrors?.description?.[0],
    props: {
      value: roleStore.createDto.description || undefined,
      onChange: (value) => {
        roleStore.setNested("createDto.description", value);
        roleStore.setNested("createDtoErrors.description", []);
      },
    },
  };

  const permissionsField: Field<CustomFieldProps> = {
    id: "permissions",
    label: t("forms.create.fields.permissions.label"),
    variant: FieldVariant.CUSTOM,
    required: true,
    description: t("forms.create.fields.permissions.description"),
    error: roleStore.createDtoErrors?.permissions?.[0],
    props: {
      children: (
        <PermissionAccordions permissions={permissions} type="create" />
      ),
    },
  };

  const roleCreateFormStructure: FormStructure = {
    title: { value: "" },
    description: { value: "" },
    fieldsets: [
      {
        title: { value: t("forms.create.title") },
        description: { value: t("forms.create.description") },
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
    roleCreateFormStructure,
  };
};
