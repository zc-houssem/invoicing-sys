import {
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  SelectOption,
  SwitchFieldProps
} from '@/components/shared/form-builder/types';
import { EnterpriseMemberStore } from '@/hooks/stores/useEnterpriseMemberStore';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { useTranslation } from 'react-i18next';

interface UseEnterpriseMemberCreateFormStructureProps {
  store: EnterpriseMemberStore;
  enterpriseId?: number;
}

export const useEnterpriseMemberCreateFormStructure = ({
  store,
  enterpriseId
}: UseEnterpriseMemberCreateFormStructureProps) => {
  const { t: tSettings } = useTranslation('settings');

  const { data: availableUsers = [], isPending: isUsersPending } = useQuery({
    queryKey: ['enterprise-available-users', enterpriseId],
    queryFn: () => api.core.enterpriseMember.findAvailableUsers(enterpriseId as number),
    enabled: !!enterpriseId
  });

  const userOptions: SelectOption[] = availableUsers.map((user) => ({
    value: user.id,
    label:
      [user.firstName, user.lastName].filter(Boolean).join(' ') ||
      user.username ||
      user.email
  }));

  const userField: Field<SelectFieldProps> = {
    id: 'user',
    label: tSettings('members.form.user'),
    description: isUsersPending
      ? undefined
      : userOptions.length === 0
        ? tSettings('members.form.noAvailableUsers')
        : undefined,
    required: true,
    variant: FieldVariant.SELECT,
    placeholder: tSettings('members.form.userPlaceholder'),
    error: store.createDtoErrors?.userId?.[0],
    props: {
      value: store.createDto.userId || undefined,
      disabled: isUsersPending || userOptions.length === 0,
      options: userOptions,
      onValueChange: (value) => {
        store.setNested('createDto.userId', value);
        store.setNested('createDtoErrors.userId', []);
      }
    }
  };

  const proprietaryField: Field<SwitchFieldProps> = {
    id: 'isOwner',
    label: tSettings('members.form.isProprietary'),
    description: tSettings('members.form.isProprietaryDescription'),
    variant: FieldVariant.SWITCH,
    props: {
      checked: store.createDto.isOwner ?? false,
      onCheckedChange: (checked) => {
        store.setNested('createDto.isOwner', checked);
      }
    }
  };

  const structure: FormStructure = {
    title: {
      value: tSettings('members.sheets.create.title')
    },
    orientation: 'horizontal',
    fieldsets: [
      {
        rows: [{ fields: [userField] }, { fields: [proprietaryField] }]
      }
    ]
  };

  return { structure, isUsersPending, hasAvailableUsers: userOptions.length > 0 };
};
