import { useTranslation } from 'react-i18next';
import {
  FormStructure,
  Field,
  FieldVariant,
  SelectFieldProps,
  TextFieldProps,
  TelFieldProps
} from '@/components/shared/form-builder/types';
import { SOCIAL_TITLE } from '@/api';
import { InterlocutorStore } from '@/hooks/stores/useInterlocutorStore';

interface UseInterlocutorUpdateFormStructureProps {
  store: InterlocutorStore;
  enterpriseId?: number;
}

export const useInterlocutorUpdateFormStructure = ({
  store,
  enterpriseId
}: UseInterlocutorUpdateFormStructureProps) => {
  const { t: tContact } = useTranslation('contacts');
  const { t: tSocial } = useTranslation('social-title');

  const socialTitleField: Field<SelectFieldProps> = {
    id: 'interlocutor-title',
    label: tContact('interlocutor.form.socialTitle'),
    variant: FieldVariant.SELECT,
    description: tContact('interlocutor.form.descriptions.socialTitle'),
    placeholder: tContact('interlocutor.form.placeholders.socialTitle'),
    error: store.errors?.title?.[0],
    props: {
      value: store.updateDto?.title || '',
      onValueChange: (value: string) => {
        store.setNested('updateDto.title', value);
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
    error: store.errors?.firstName?.[0],
    props: {
      value: store.updateDto?.firstName || '',
      onChange: (value: string) => {
        store.setNested('updateDto.firstName', value);
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
    error: store.errors?.lastName?.[0],
    props: {
      value: store.updateDto?.lastName || '',
      onChange: (value: string) => {
        store.setNested('updateDto.lastName', value);
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
      value: store.updateDto?.email || '',
      onChange: (value: string) => {
        store.setNested('updateDto.email', value);
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
      value: store.updateDto?.phone || '',
      onChange: (value: string) => {
        store.setNested('updateDto.phone', value);
        store.setNested?.('errors.phone', undefined);
      }
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
      value: store.updateDto?.position || '',
      onChange: (value: string) => {
        store.setNested('updateDto.position', value);
        store.setNested?.('errors.position', undefined);
      }
    }
  };

  let rows = [];
  rows.push({ fields: [socialTitleField] });
  rows.push({ fields: [firstNameField, lastNameField] });
  rows.push({ fields: [emailField] });
  rows.push({ fields: [phoneField] });
  if (enterpriseId) {
    rows.push({ fields: [positionField] });
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
