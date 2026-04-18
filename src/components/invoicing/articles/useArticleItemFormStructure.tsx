import {
  Field,
  FieldVariant,
  FormStructure,
  NumberFieldProps,
  SelectFieldProps,
  TextareaFieldProps,
  TextFieldProps
} from '@/components/shared/form-builder/types';
import { ArticleStore } from '@/hooks/stores/useArticleStore';
import { useTranslation } from 'react-i18next';

interface useArticleItemFormStructureProps {
  store: ArticleStore;
  index: number;
}

export const useArticleItemFormStructure = ({
  store,
  index
}: useArticleItemFormStructureProps): FormStructure => {
  const { t } = useTranslation('invoicing');

  const titleField: Field<TextFieldProps> = {
    id: `article-${index}-title`,
    label: t('article.form.title'),
    variant: FieldVariant.TEXT,
    placeholder: t('article.form.placeholders.title'),
    props: {
      value: store.articles[index].title,
      onChange: (value) => {
        store.updateArticle(store.articles[index].clientId, { title: value });
      }
    }
  };

  const quantityField: Field<NumberFieldProps> = {
    id: `article-${index}-quantity`,
    label: t('article.form.quantity'),
    variant: FieldVariant.NUMBER,
    placeholder: t('article.form.placeholders.quantity'),
    props: {
      value: store.articles[index].quantity,
      onChange: (value) => {
        store.updateArticle(store.articles[index].clientId, { quantity: value });
      }
    }
  };

  const unitPriceField: Field<NumberFieldProps> = {
    id: `article-${index}-unitPrice`,
    label: t('article.form.unitPrice'),
    variant: FieldVariant.NUMBER,
    placeholder: t('article.form.placeholders.unitPrice'),
    props: {
      value: store.articles[index].unitPrice,
      onChange: (value) => {
        store.updateArticle(store.articles[index].clientId, { unitPrice: value });
      }
    }
  };

  const descriptionField: Field<TextareaFieldProps> = {
    id: `article-${index}-description`,
    label: t('article.form.description'),
    variant: FieldVariant.TEXTAREA,
    placeholder: t('article.form.placeholders.description'),
    props: {
      value: store.articles[index].description,
      onChange: (value) => {
        store.updateArticle(store.articles[index].clientId, { description: value });
      },
      rows: 5
    }
  };

  const discountTypeField: Field<SelectFieldProps> = {
    id: `article-${index}-discountType`,
    label: t('article.form.discountType.label'),
    variant: FieldVariant.SELECT,
    placeholder: t('article.form.placeholders.discountType'),
    props: {
      value: store.articles[index].discountType,
      onValueChange: (value) => {
        store.updateArticle(store.articles[index].clientId, {
          discountType: value as 'rate' | 'fixed'
        });
      },
      options: [
        { label: t('article.form.discountType.options.rate'), value: 'rate' },
        { label: t('article.form.discountType.options.fixed'), value: 'fixed' }
      ]
    }
  };

  const discountValueField: Field<NumberFieldProps> = {
    id: `article-${index}-discountValue`,
    label: t('article.form.discountValue'),
    variant: FieldVariant.NUMBER,
    placeholder: t('article.form.placeholders.discountValue'),
    props: {
      value: store.articles[index].discountValue,
      onChange: (value) => {
        store.updateArticle(store.articles[index].clientId, { discountValue: value });
      }
    }
  };

  return {
    title: {
      value: `article-${index}`
    },
    fieldsets: [
      {
        rows: [
          {
            fields: [titleField, quantityField, unitPriceField]
          },
          {
            fields: [discountTypeField, discountValueField]
          },
          {
            fields: [descriptionField]
          }
        ]
      }
    ]
  };
};
