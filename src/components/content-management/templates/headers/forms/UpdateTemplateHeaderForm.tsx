import React from 'react';
import { useUpdateTemplateHeaderFormStructure } from './useUpdateTemplateHeaderFormStructure';
import { useTemplateHeaderStore } from '@/hooks/stores/useTemplateHeaderStore';
import { useIntro } from '@/context/IntroContext';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useTranslation } from 'react-i18next';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { updateTemplateHeaderSchema } from '@/types/validations/template.validation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { ServerErrorResponse } from '@/types';
import { toast } from 'sonner';
import { useTemplateTypes } from '@/hooks/content/core/useTemplateTypes';
import { Spinner } from '@/components/shared';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';

interface UpdateTemplateHeaderFormProps {
  className?: string;
  onSuccess?: () => void;
}

export const UpdateTemplateHeaderForm = ({ className, onSuccess }: UpdateTemplateHeaderFormProps) => {
  const templateHeaderStore = useTemplateHeaderStore();
  const { setIntro, clearIntro } = useIntro();
  const { templateTypes, isTemplateTypePending } = useTemplateTypes();

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { t: tCommon } = useTranslation('common');
  const { t: tContentManagement } = useTranslation('content-management');

  React.useEffect(() => {
    setIntro?.(
      'Update Header',
      'Update a template header.'
    );
    setRoutes?.([
      { title: tCommon('menu.contentManagement.title') },
      { title: tCommon('menu.contentManagement.subs.pdf', { defaultValue: 'PDF Settings' }) },
      { title: tContentManagement('pdf.menu.headers', { defaultValue: 'Headers' }), href: '/content-management/pdf/headers' },
      { title: 'Update Header' }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, []);

  const { formStructure } = useUpdateTemplateHeaderFormStructure({
    store: templateHeaderStore,
    templateTypes: mapToSelectOptions({
      data: templateTypes || [],
      valueKey: 'id',
      labelKey: 'name'
    })
  });

  const { mutate: updateTemplateHeader, isPending: isUpdateTemplateHeaderPending } = useMutation({
    mutationFn: async () =>
      api.core.templateHeader.update(templateHeaderStore.response?.id as string, templateHeaderStore.updateDto as any),
    onSuccess() {
      toast.success('Header updated successfully');
      onSuccess?.();
    },
    onError(error: ServerErrorResponse) {
      toast.error(error.response?.data?.message || 'Failed to update header');
    }
  });

  const handleSubmit = () => {
    const result = updateTemplateHeaderSchema.safeParse(templateHeaderStore.updateDto);
    if (!result.success) {
      templateHeaderStore.set('updateDtoErrors', result.error.flatten().fieldErrors);
      return;
    }
    updateTemplateHeader();
  };

  if (isTemplateTypePending) return <Spinner />;

  return (
    <div className={cn('flex flex-col flex-1 overflow-auto p-4 gap-4', className)}>
      <div className="max-w-xl mx-auto w-full my-auto space-y-4">
        <FormBuilder structure={formStructure} />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isUpdateTemplateHeaderPending}>
            <Save className="size-4 mr-2" />
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};
