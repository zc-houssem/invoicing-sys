import React from 'react';
import { useUpdateTemplateFooterFormStructure } from './useUpdateTemplateFooterFormStructure';
import { useTemplateFooterStore } from '@/hooks/stores/useTemplateFooterStore';
import { useIntro } from '@/context/IntroContext';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useTranslation } from 'react-i18next';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { updateTemplateFooterSchema } from '@/types/validations/template.validation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { ServerErrorResponse } from '@/types';
import { toast } from 'sonner';
import { useTemplateTypes } from '@/hooks/content/core/useTemplateTypes';
import { Spinner } from '@/components/shared';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';

interface UpdateTemplateFooterFormProps {
  className?: string;
  onSuccess?: () => void;
}

export const UpdateTemplateFooterForm = ({
  className,
  onSuccess
}: UpdateTemplateFooterFormProps) => {
  const templateFooterStore = useTemplateFooterStore();
  const { setIntro, clearIntro } = useIntro();
  const { templateTypes, isTemplateTypePending } = useTemplateTypes();

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { t: tCommon } = useTranslation('common');
  const { t: tContentManagement } = useTranslation('content-management');

  React.useEffect(() => {
    setIntro?.('Update Footer', 'Update a template footer.');
    setRoutes?.([
      { title: tCommon('menu.contentManagement.title') },
      { title: tCommon('menu.contentManagement.subs.pdf', { defaultValue: 'PDF Settings' }) },
      { title: tContentManagement('pdf.menu.footers', { defaultValue: 'Footers' }), href: '/content-management/pdf/footers' },
      { title: 'Update Footer' }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, []);

  const { formStructure } = useUpdateTemplateFooterFormStructure({
    store: templateFooterStore,
    templateTypes: mapToSelectOptions({
      data: templateTypes || [],
      valueKey: 'id',
      labelKey: 'name'
    })
  });

  const { mutate: updateTemplateFooter, isPending: isUpdateTemplateFooterPending } = useMutation({
    mutationFn: async () =>
      api.core.templateFooter.update(
        templateFooterStore.response?.id as string,
        templateFooterStore.updateDto as any
      ),
    onSuccess() {
      toast.success('Footer updated successfully');
      onSuccess?.();
    },
    onError(error: ServerErrorResponse) {
      toast.error(error.response?.data?.message || 'Failed to update footer');
    }
  });

  const handleSubmit = () => {
    const result = updateTemplateFooterSchema.safeParse(templateFooterStore.updateDto);
    if (!result.success) {
      templateFooterStore.set('updateDtoErrors', result.error.flatten().fieldErrors);
      return;
    }
    updateTemplateFooter();
  };

  if (isTemplateTypePending) return <Spinner />;

  return (
    <div className={cn('flex flex-col flex-1 overflow-auto p-4 gap-4', className)}>
      <div className="max-w-xl mx-auto w-full my-auto space-y-4">
        <FormBuilder structure={formStructure} />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isUpdateTemplateFooterPending}>
            <Save className="size-4 mr-2" />
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};
