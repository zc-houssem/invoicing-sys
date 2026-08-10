import React from 'react';
import { useCreateTemplateHeaderFormStructure } from './useCreateTemplateHeaderFormStructure';
import { useTemplateHeaderStore } from '@/hooks/stores/useTemplateHeaderStore';
import { useIntro } from '@/context/IntroContext';
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

interface CreateTemplateHeaderFormProps {
  className?: string;
}

export const CreateTemplateHeaderForm = ({ className }: CreateTemplateHeaderFormProps) => {
  const router = useRouter();
  const templateHeaderStore = useTemplateHeaderStore();
  const { setIntro, clearIntro } = useIntro();

  React.useEffect(() => {
    setIntro?.(
      'Create Header',
      'Register a template header.'
    );
    return () => {
      templateHeaderStore.reset();
      clearIntro?.();
    };
  }, []);

  const { formStructure } = useCreateTemplateHeaderFormStructure({
    store: templateHeaderStore,
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
