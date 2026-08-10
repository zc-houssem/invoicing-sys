import React from 'react';
import { useCreateTemplateFooterFormStructure } from './useCreateTemplateFooterFormStructure';
import { useTemplateFooterStore } from '@/hooks/stores/useTemplateFooterStore';
import { useIntro } from '@/context/IntroContext';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { templateFooterSchema } from '@/types/validations/template.validation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { ServerErrorResponse } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { useTemplateTypes } from '@/hooks/content/core/useTemplateTypes';
import { Spinner } from '@/components/shared';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';

interface CreateTemplateFooterFormProps {
  className?: string;
}

export const CreateTemplateFooterForm = ({ className }: CreateTemplateFooterFormProps) => {
  const router = useRouter();
  const templateFooterStore = useTemplateFooterStore();
  const { setIntro, clearIntro } = useIntro();
  const { templateTypes, isTemplateTypePending } = useTemplateTypes();

  React.useEffect(() => {
    setIntro?.(
      'Create Footer',
      'Register a template footer.'
    );
    return () => {
      templateFooterStore.reset();
      clearIntro?.();
    };
  }, []);

  const { formStructure } = useCreateTemplateFooterFormStructure({
    store: templateFooterStore,
    templateTypes: mapToSelectOptions({
      data: templateTypes || [],
      valueKey: 'id',
      labelKey: 'name'
    })
  });

  const { mutate: createTemplateFooter, isPending: isCreateTemplateFooterPending } = useMutation({
    mutationFn: async () => api.core.templateFooter.create(templateFooterStore.createDto),
    onSuccess() {
      toast.success('Footer created successfully');
      templateFooterStore.reset();
      router.push('/content-management/pdf/footers');
    },
    onError(error: ServerErrorResponse) {
      toast.error(error.response?.data?.message || 'Failed to create footer');
    }
  });

  const handleSubmit = () => {
    const result = templateFooterSchema.safeParse(templateFooterStore.createDto);
    if (!result.success) {
      templateFooterStore.set('createDtoErrors', result.error.flatten().fieldErrors);
      return;
    }
    createTemplateFooter();
  };

  if (isTemplateTypePending) return <Spinner />;

  return (
    <div className={cn('flex flex-col flex-1 overflow-auto p-4 gap-4', className)}>
      <div className="max-w-xl mx-auto w-full my-auto space-y-4">
        <FormBuilder structure={formStructure} />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isCreateTemplateFooterPending}>
            <Save className="size-4 mr-2" />
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};
