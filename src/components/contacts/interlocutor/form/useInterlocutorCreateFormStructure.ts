import { useTranslation } from 'react-i18next';
import {
  FormStructure,
  Field,
  FieldVariant,
  SelectFieldProps,
  TextFieldProps,
  TelFieldProps,
  CheckboxFieldProps
} from '@/components/shared/form-builder/types';
import { SOCIAL_TITLE } from '@/api';
import { InterlocutorStore } from '@/hooks/stores/useInterlocutorStore';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';

interface UseInterlocutorCreateFormStructureProps {
  store: InterlocutorStore;
  enterpriseId?: number;
}

export const useInterlocutorCreateFormStructure = ({
  store,
  enterpriseId
}: UseInterlocutorCreateFormStructureProps) => {
  const { t: tContact } = useTranslation('contacts');
  const { t: tSocial } = useTranslation('social-title');

  const { data: existingInterlocutors } = useQuery({
    queryKey: ['all-interlocutors'],
    queryFn: () => api.core.interlocutor.findAll({}),
    enabled: !!enterpriseId && !!store.createDto.associateExisting
  });

  const associateExistingField: Field<CheckboxFieldProps> = {
    id: 'associate-existing',
    variant: FieldVariant.CHECKBOX,
    description: tContact('interlocutor.form.associateExisting', 'Associer un interlocuteur existant'),
    props: {
      checked: store.createDto.associateExisting || false,
      onCheckedChange: (checked: boolean | string) => {
        store.setNested('createDto.associateExisting', !!checked);
      }
    }
  };

  const existingInterlocutorField: Field<SelectFieldProps> = {
    id: 'existing-interlocutor',
    label: tContact('interlocutor.form.existingInterlocutor', 'Interlocuteur'),
    variant: FieldVariant.SELECT,
    error: store.errors?.interlocutorId?.[0],
    props: {
      value: store.createDto.interlocutorId?.toString() || '',
      onValueChange: (value: string) => {
        store.setNested('createDto.interlocutorId', parseInt(value));
        store.setNested?.('errors.interlocutorId', undefined);
      },
      options:
        existingInterlocutors?.map((i) => ({
          label: `${i.firstName} ${i.lastName} (${i.email || ''})`,
          value: i.id.toString()
        })) || []
    }
  };

  const positionField: Field<TextFieldProps> = {
    id: 'interlocutor-position',
    label: tContact('interlocutor.form.position', 'Fonction / Position'),
    variant: FieldVariant.TEXT,
    description: tContact('interlocutor.form.descriptions.position', "La position de l'interlocuteur dans l'entreprise"),
    placeholder: tContact('interlocutor.form.placeholders.position', 'ex: Directeur Général'),
    error: store.errors?.position?.[0],
    props: {
      value: store.createDto.position || '',
      onChange: (value: string) => {
        store.setNested('createDto.position', value);
        store.setNested?.('errors.position', undefined);
      }
    }
  };

  const socialTitleField: Field<SelectFieldProps> = {
    id: 'interlocutor-title',
    label: tContact('interlocutor.form.socialTitle'),
    variant: FieldVariant.SELECT,
    description: tContact('interlocutor.form.descriptions.socialTitle'),
    placeholder: tContact('interlocutor.form.placeholders.socialTitle'),
    error: store.errors?.title?.[0],
    props: {
      value: store.createDto.title || '',
      onValueChange: (value: string) => {
        store.setNested('createDto.title', value);
        store.setNested?.('errors.title', undefined);
      },
      options: Object.values(SOCIAL_TITLE).map((title) => ({
        label: tSocial(title),
        value: title
      }))
    }
  };

  const firstNameField: Field<TextFieldProps> = {
    id: 'interlocutor-first-name',
    label: tContact('interlocutor.form.firstName'),
    variant: FieldVariant.TEXT,
    description: tContact('interlocutor.form.descriptions.firstName'),
    placeholder: tContact('interlocutor.form.placeholders.firstName'),
    error: store.errors?.name?.[0],
    props: {
      value: store.createDto.firstName || '',
      onChange: (value: string) => {
        store.setNested('createDto.firstName', value);
        store.setNested?.('errors.firstName', undefined);
      }
    }
  };

  const lastNameField: Field<TextFieldProps> = {
    id: 'interlocutor-last-name',
    label: tContact('interlocutor.form.lastName'),
    variant: FieldVariant.TEXT,
    description: tContact('interlocutor.form.descriptions.lastName'),
    placeholder: tContact('interlocutor.form.placeholders.lastName'),
    error: store.errors?.surname?.[0],
    props: {
      value: store.createDto.lastName || '',
      onChange: (value: string) => {
        store.setNested('createDto.lastName', value);
        store.setNested?.('errors.lastName', undefined);
      }
    }
  };

  const emailField: Field<TextFieldProps> = {
    id: 'interlocutor-email',
    label: tContact('interlocutor.form.email'),
    variant: FieldVariant.EMAIL,
    description: tContact('interlocutor.form.descriptions.email'),
    placeholder: tContact('interlocutor.form.placeholders.email'),
    error: store.errors?.email?.[0],
    props: {
      value: store.createDto.email || '',
      onChange: (value: string) => {
        store.setNested('createDto.email', value);
        store.setNested?.('errors.email', undefined);
      }
    }
  };

  const phoneField: Field<TelFieldProps> = {
    id: 'interlocutor-phone',
    label: tContact('interlocutor.form.phone'),
    variant: FieldVariant.TEL,
    description: tContact('interlocutor.form.descriptions.phone'),
    placeholder: tContact('interlocutor.form.placeholders.phone'),
    error: store.errors?.phone?.[0],
    props: {
      value: store.createDto.phone || '',
      onChange: (value: string) => {
        store.setNested('createDto.phone', value);
        store.setNested?.('errors.phone', undefined);
      }
    }
  };

  let rows = [];
  if (enterpriseId) {
    rows.push({ fields: [associateExistingField] });
    if (store.createDto.associateExisting) {
      rows.push({ fields: [existingInterlocutorField] });
      rows.push({ fields: [positionField] });
    } else {
      rows.push({ fields: [socialTitleField] });
      rows.push({ fields: [firstNameField, lastNameField] });
      rows.push({ fields: [emailField] });
      rows.push({ fields: [phoneField] });
      rows.push({ fields: [positionField] });
    }
  } else {
    rows.push({ fields: [socialTitleField] });
    rows.push({ fields: [firstNameField, lastNameField] });
    rows.push({ fields: [emailField] });
    rows.push({ fields: [phoneField] });
  }

  const interlocutorInformation: FormStructure = {
    title: {
      value: tContact('interlocutor.detailmenu.title')
    },
    fieldsets: [
      {
        rows
      }
    ]
  };

  return { interlocutorInformation };
};
