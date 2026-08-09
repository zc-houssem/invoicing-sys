import { useIntro } from '@/context/IntroContext';
import { useTemplateStore } from '@/hooks/stores/useTemplateStore';
import { cn } from '@/lib/utils';
import { ServerErrorResponse, UpdateTemplateDto } from '@/types';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'sonner';
import { useUpdateTemplateFormStructure } from './useUpdateTemplateFormStructure';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { templateSchema } from '@/types/validations/template.validation';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { Button } from '@/components/ui/button';
import { useTemplate } from '@/hooks/content/core/useTemplate';
import { useTemplateTypes } from '@/hooks/content/core/useTemplateTypes';
import { Spinner } from '@/components/shared';
import { Save } from 'lucide-react';
import { mapToSelectOptions } from '@/components/shared/form-builder/utils/mapToSelectOptions';
import { TemplatePdfPreview } from '../TemplatePdfPreview';
import { Separator } from '@/components/ui/separator';

interface UpdateTemplateFormProps {
  id: string;
  className?: string;
}

export const UpdateTemplateForm = ({ id, className }: UpdateTemplateFormProps) => {
  const router = useRouter();
  const { template, isTemplatePending } = useTemplate({ id, join: ['templateType'] });
  const templateStore = useTemplateStore();
  const { setIntro, clearIntro } = useIntro();
  const { templateTypes, isTemplateTypePending } = useTemplateTypes();

  React.useEffect(() => {
    setIntro?.(
      'Update Template',
      'Update template metadata and preview PDF output with a real quotation or invoice.'
    );
    return () => {
      templateStore.reset();
      clearIntro?.();
    };
  }, []);

  React.useEffect(() => {
    if (template) {
      templateStore.set('response', template);
      templateStore.set('updateDto', {
        name: template.name,
        description: template.description,
        templateTypeId: template.templateTypeId || template.templateType?.id
      });
    }
  }, [template]);

  const { formStructure } = useUpdateTemplateFormStructure({
    store: templateStore,
    templateTypes: mapToSelectOptions({
      data: templateTypes || [],
      valueKey: 'id',
      labelKey: 'name'
    })
  });

  const { mutate: updateTemplate, isPending: isUpdateTemplatePending } = useMutation({
    mutationFn: async (updateDto: UpdateTemplateDto) =>
      api.core.template.update(templateStore?.response?.id, updateDto),
    onSuccess() {
      toast.success('Template updated successfully');
      router.push('/content-management/templates');
    },
    onError(error: ServerErrorResponse) {
      toast.error(error.response?.data?.message || 'Failed to update template');
    }
  });

  const handleSubmit = () => {
    const result = templateSchema.safeParse(templateStore.updateDto);
    if (!result.success) {
      templateStore.set('updateDtoErrors', result.error.flatten().fieldErrors);
      return;
    }
    updateTemplate(templateStore.updateDto!);
  };

  const templateTypeCode =
    template?.templateType?.code ||
    templateTypes?.find((t) => t.id === templateStore.updateDto?.templateTypeId)?.code;

  if (isTemplatePending || isTemplateTypePending) return <Spinner />;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden lg:flex-row gap-4 p-4', className)}>
      <div className="flex flex-col gap-4 lg:w-[min(420px,100%)] shrink-0 overflow-auto">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Template details</h2>
          <p className="text-sm text-muted-foreground">
            Layout is configured via EJS templates on the server. Use the preview panel to test
            with live data.
          </p>
        </div>
        <FormBuilder structure={formStructure} />
        <div className="flex justify-end pb-2">
          <Button onClick={handleSubmit} disabled={isUpdateTemplatePending}>
            <Save className="size-4 mr-2" />
            Update
          </Button>
        </div>
      </div>

      <Separator orientation="vertical" className="hidden lg:block h-auto" />
      <Separator orientation="horizontal" className="lg:hidden" />

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="shrink-0 mb-3">
          <h2 className="text-lg font-semibold">PDF preview</h2>
          <p className="text-sm text-muted-foreground">
            {templateTypeCode === 'quotation'
              ? 'Pick a quotation to see how this template renders.'
              : templateTypeCode === 'invoice'
                ? 'Pick an invoice to see how this template renders.'
                : 'Preview is available for invoice and quotation templates.'}
          </p>
        </div>
        <TemplatePdfPreview
          className="flex-1 min-h-0"
          templateId={id}
          templateTypeCode={templateTypeCode}
        />
      </div>
    </div>
  );
};
