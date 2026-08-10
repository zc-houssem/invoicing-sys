import React from 'react';
import { useCreateTemplateFormStructure } from './useCreateTemplateFormStructure';
import { useTemplateStore } from '@/hooks/stores/useTemplateStore';
import { useIntro } from '@/context/IntroContext';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { templateSchema } from '@/types/validations/template.validation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { ServerErrorResponse } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { useTemplateTypes } from '@/hooks/content/core/useTemplateTypes';
import { Spinner } from '@/components/shared';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';

interface CreateTemplateFormProps {
  className?: string;
}

export const CreateTemplateForm = ({ className }: CreateTemplateFormProps) => {
  const router = useRouter();
  const templateStore = useTemplateStore();
  const { setIntro, clearIntro } = useIntro();
  const { templateTypes, isTemplateTypePending } = useTemplateTypes();

  React.useEffect(() => {
    setIntro?.(
      'Create Template',
      'Register a template record linked to a document type. PDF output uses EJS + Puppeteer on the server.'
    );
    return () => {
      templateStore.reset();
      clearIntro?.();
    };
  }, []);

  const { formStructure } = useCreateTemplateFormStructure({
    store: templateStore,
    templateTypes: mapToSelectOptions({
      data: templateTypes || [],
      valueKey: 'id',
      labelKey: 'name'
    })
  });

  const { mutate: createTemplate, isPending: isCreateTemplatePending } = useMutation({
    mutationFn: async () => api.core.template.create(templateStore.createDto),
    onSuccess() {
      toast.success('Template created successfully');
      templateStore.reset();
      router.push('/content-management/pdf/templates');
    },
    onError(error: ServerErrorResponse) {
      toast.error(error.response?.data?.message || 'Failed to create template');
    }
  });

  const handleSubmit = () => {
    const result = templateSchema.safeParse(templateStore.createDto);
    if (!result.success) {
      templateStore.set('createDtoErrors', result.error.flatten().fieldErrors);
      return;
    }
    createTemplate();
  };

  if (isTemplateTypePending) return <Spinner />;

  return (
    <div className={cn('flex flex-col flex-1 overflow-auto p-4 gap-4', className)}>
      <div className="max-w-xl mx-auto w-full my-auto space-y-4">
        <p className="text-sm text-muted-foreground">
          Templates link a name and document type to a server-side EJS template. PDF layout
          is defined in backend template files — no file upload or visual editor required.
        </p>
        <FormBuilder structure={formStructure} />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isCreateTemplatePending}>
            <Save className="size-4 mr-2" />
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};
