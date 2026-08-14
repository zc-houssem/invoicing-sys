import {
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  SelectOption,
  SwitchFieldProps
} from '@/components/shared/form-builder/types';
import { useEnterpriseMemberStore } from '@/hooks/stores/useEnterpriseMemberStore';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { useTranslation } from 'react-i18next';

interface UseUserSystemEnterpriseAddFormStructureProps {
  userId: string;
}

export const useUserSystemEnterpriseAddFormStructure = ({
  userId
}: UseUserSystemEnterpriseAddFormStructureProps) => {
  const { t: tUser } = useTranslation('user-management');
  const { t: tSettings } = useTranslation('settings');
  const createDto = useEnterpriseMemberStore((state) => state.createDto);
  const createDtoErrors = useEnterpriseMemberStore((state) => state.createDtoErrors);
  const setNested = useEnterpriseMemberStore((state) => state.setNested);

  const { data: availableEnterprises = [], isPending: isEnterprisesPending } = useQuery({
    queryKey: ['user-available-system-enterprises', userId],
    queryFn: () => api.core.enterpriseMember.findAvailableSystemEnterprises(userId),
    enabled: Boolean(userId)
  });

  const enterpriseOptions: SelectOption[] = availableEnterprises.map((enterprise) => ({
    value: enterprise.id.toString(),
    label: enterprise.name
  }));

  const enterpriseField: Field<SelectFieldProps> = {
    id: 'enterprise',
    label: tUser('userManagement.details.systemEnterprises.form.enterprise'),
    description: isEnterprisesPending
      ? undefined
      : enterpriseOptions.length === 0
        ? tUser('userManagement.details.systemEnterprises.form.noAvailableEnterprises')
        : tUser('userManagement.details.systemEnterprises.form.enterpriseDescription'),
    required: true,
    variant: FieldVariant.SELECT,
    placeholder: tUser('userManagement.details.systemEnterprises.form.enterprisePlaceholder'),
    error: createDtoErrors?.enterpriseId?.[0],
    props: {
      value: createDto.enterpriseId?.toString(),
      disabled: isEnterprisesPending || enterpriseOptions.length === 0,
      options: enterpriseOptions,
      onValueChange: (value) => {
        setNested('createDto.enterpriseId', Number(value));
        setNested('createDtoErrors.enterpriseId', []);
      }
    }
  };

  const proprietaryField: Field<SwitchFieldProps> = {
    id: 'isOwner',
    label: tSettings('members.form.isProprietary'),
    description: tSettings('members.form.isProprietaryDescription'),
    variant: FieldVariant.SWITCH,
    props: {
      checked: createDto.isOwner ?? false,
      onCheckedChange: (checked) => {
        setNested('createDto.isOwner', checked);
      }
    }
  };

  const structure: FormStructure = {
    title: {
      value: tUser('userManagement.details.systemEnterprises.sheets.create.title')
    },
    orientation: 'horizontal',
    fieldsets: [
      {
        rows: [{ fields: [enterpriseField] }, { fields: [proprietaryField] }]
      }
    ]
  };

  return {
    structure,
    isEnterprisesPending,
    hasAvailableEnterprises: enterpriseOptions.length > 0
  };
};
