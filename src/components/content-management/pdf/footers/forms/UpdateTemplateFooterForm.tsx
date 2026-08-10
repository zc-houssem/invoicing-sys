import React from 'react';
import { useUpdateTemplateFooterFormStructure } from './useUpdateTemplateFooterFormStructure';
import { useTemplateFooterStore } from '@/hooks/stores/useTemplateFooterStore';
import { useIntro } from '@/context/IntroContext';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { updateTemplateFooterSchema } from '@/types/validations/template.validation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { ServerErrorResponse } from '@/types';
import { toast } from 'sonner';

interface UpdateTemplateFooterFormProps {
  className?: string;
  onSuccess?: () => void;
}

export const UpdateTemplateFooterForm = ({ className, onSuccess }: UpdateTemplateFooterFormProps) => {
  const templateFooterStore = useTemplateFooterStore();
  const { setIntro, clearIntro } = useIntro();

  React.useEffect(() => {
    setIntro?.(
      'Update Footer',
      'Update a template footer.'
    );
    return () => {
      clearIntro?.();
    };
  }, []);

  const { formStructure } = useUpdateTemplateFooterFormStructure({
    store: templateFooterStore,
  });

  const { mutate: updateTemplateFooter, isPending: isUpdateTemplateFooterPending } = useMutation({
    mutationFn: async () =>
      api.core.templateFooter.update(templateFooterStore.response?.id as string, templateFooterStore.updateDto as any),
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
