import React from 'react';
import { useCreateTemplateHeaderFormStructure } from './useCreateTemplateHeaderFormStructure';
import { useTemplateHeaderStore } from '@/hooks/stores/useTemplateHeaderStore';
import { useIntro } from '@/context/IntroContext';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useTranslation } from 'react-i18next';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { templateHeaderSchema } from '@/types/validations/template.validation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { ServerErrorResponse } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { useTemplateTypes } from '@/hooks/content/core/useTemplateTypes';
import { Spinner } from '@/components/shared';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';

interface CreateTemplateHeaderFormProps {
  className?: string;
}

export const CreateTemplateHeaderForm = ({ className }: CreateTemplateHeaderFormProps) => {
  const router = useRouter();
  const templateHeaderStore = useTemplateHeaderStore();
  const { setIntro, clearIntro } = useIntro();
  const { templateTypes, isTemplateTypePending } = useTemplateTypes();

  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { t: tCommon } = useTranslation('common');
  const { t: tContentManagement } = useTranslation('content-management');

  React.useEffect(() => {
    setIntro?.('Create Header', 'Register a template header.');
    setRoutes?.([
      { title: tCommon('menu.contentManagement.title') },
      { title: tCommon('menu.contentManagement.subs.pdf', { defaultValue: 'PDF Settings' }) },
      { title: tContentManagement('pdf.menu.headers', { defaultValue: 'Headers' }), href: '/content-management/pdf/headers' },
      { title: 'Create Header' }
    ]);
    return () => {
      templateHeaderStore.reset();
      clearIntro?.();
      clearRoutes?.();
    };
  }, []);

  const { formStructure } = useCreateTemplateHeaderFormStructure({
    store: templateHeaderStore,
    templateTypes: mapToSelectOptions({
      data: templateTypes || [],
      valueKey: 'id',
      labelKey: 'name'
    })
  });

  const { mutate: createTemplateHeader, isPending: isCreateTemplateHeaderPending } = useMutation({
    mutationFn: async () => api.core.templateHeader.create(templateHeaderStore.createDto),
    onSuccess() {
      toast.success('Header created successfully');
      templateHeaderStore.reset();
      router.push('/content-management/pdf/headers');
    },
    onError(error: ServerErrorResponse) {
      toast.error(error.response?.data?.message || 'Failed to create header');
    }
  });

  const handleSubmit = () => {
    const result = templateHeaderSchema.safeParse(templateHeaderStore.createDto);
    if (!result.success) {
      templateHeaderStore.set('createDtoErrors', result.error.flatten().fieldErrors);
      return;
    }
    createTemplateHeader();
  };

  if (isTemplateTypePending) return <Spinner />;

  return (
    <div className={cn('flex flex-col flex-1 overflow-auto p-4 gap-4', className)}>
      <div className="max-w-xl mx-auto w-full my-auto space-y-4">
        <FormBuilder structure={formStructure} />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isCreateTemplateHeaderPending}>
            <Save className="size-4 mr-2" />
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};
