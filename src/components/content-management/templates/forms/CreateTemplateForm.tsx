import React from 'react';
import { useCreateTemplateFormStructure } from './useCreateTemplateFormStructure';
import { useTemplateStore } from '@/hooks/stores/useTemplateStore';
import { useIntro } from '@/context/IntroContext';
import { defineStepper } from '@/components/ui/stepper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormBuilder } from '@/components/shared/form-builder/FormBuilder';
import { cn } from '@/lib/utils';
import { PDFEditor } from '../pdfme/PDFTemplateEditor';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { templateSchema } from '@/types/validations/template.validation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { useUploadMutation } from '@/hooks/content/core/useUploadMutation';
import { ServerErrorResponse, Upload } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

const steps = [
  {
    id: '1',
    title: 'Template Details',
    description: 'Fill out the template details.'
  },
  {
    id: '2',
    title: 'Template Editor',
    description: 'Design your template.'
  }
];

const { Stepper } = defineStepper(...steps);

interface CreateTemplateFormProps {
  className?: string;
}

export const CreateTemplateForm = ({ className }: CreateTemplateFormProps) => {
  const [key, setKey] = React.useState(uuidv4());
  const router = useRouter();
  const templateStore = useTemplateStore();
  const { setIntro, clearIntro } = useIntro();

  React.useEffect(() => {
    setIntro?.('Create Template', 'Fill out the form below to create a new document template.');
    return () => {
      templateStore.reset();
      clearIntro?.();
    };
  }, []);

  const { uploadFiles: uploadDocument, isUploadPending } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      templateStore.setNested('createDto.documentId', response[0].id);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    }
  });

  const { formStructure } = useCreateTemplateFormStructure({
    store: templateStore,
    uploadDocument
  });

  const { mutate: createTemplate, isPending: isCreateTemplatePending } = useMutation({
    mutationFn: async () => api.core.template.create(templateStore.createDto),
    onSuccess() {
      toast.success('Template created successfully');
      templateStore.reset();
      router.push('/content-management/templates');
    },
    onError(error: ServerErrorResponse) {
      toast.error(error.response?.data?.message || 'Failed to create template');
    }
  });

  // Simple validation: require a name (customize as needed)
  const validateStep = (stepId: string) => {
    if (stepId === '1') {
      const result = templateSchema.safeParse(templateStore.createDto);
      if (!result.success) {
        templateStore.set('createDtoErrors', result.error.flatten().fieldErrors);
        return false;
      }
      return true;
    }
    return true;
  };

  const handleSubmit = () => {
    createTemplate();
  };

  const exportVariables = () => {
    templateStore.set('backupVariables', templateStore.variables);
    toast.success('Variables exported successfully');
  };

  const importVariables = () => {
    if (!templateStore.backupVariables) {
      toast.error('No backup variables found to import');
      return;
    }
    templateStore.set('variables', templateStore.backupVariables);
    setKey(uuidv4());
    toast.success('Variables imported successfully');
  };

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden pb-4', className)}>
      <Stepper.Provider className="flex flex-col flex-1 overflow-hidden" variant="horizontal">
        {({ methods }) => {
          const activeIndex = steps.findIndex((step) => step.id === methods.current.id);

          const handleNext = () => {
            const valid = validateStep(methods.current.id);
            if (!valid) return;
            if (methods.isLast) {
              handleSubmit();
            } else {
              methods.next();
            }
          };

          return (
            <>
              {/* Stepper Navigation */}
              <Stepper.Navigation className="shrink">
                {methods.all.map((step, index) => (
                  <Stepper.Step
                    key={step.id}
                    of={step.id}
                    onClick={() => {
                      if (index > activeIndex) {
                        let valid = true;
                        for (let i = 0; i <= activeIndex; i++) {
                          valid = valid && validateStep(steps[i].id);
                        }
                        if (!valid) return;
                      }
                      methods.goTo(step.id);
                      console.log('STEP CHANGE:', step.id);
                    }}
                    disabled={false}>
                    <Stepper.Title>{step.title}</Stepper.Title>
                  </Stepper.Step>
                ))}
              </Stepper.Navigation>

              {/* Step Content */}
              <div className="flex flex-col flex-1 h-full overflow-hidden my-4">
                {methods.current.id === '1' && (
                  <div className="flex flex-col flex-1 overflow-auto p-2">
                    <Card className="flex flex-col flex-1">
                      <CardHeader>
                        <CardTitle>{methods.current.title}</CardTitle>
                        <CardDescription>{methods.current.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-1 overflow-hidden">
                        <FormBuilder structure={formStructure} />
                      </CardContent>
                    </Card>
                  </div>
                )}
                {methods.current.id === '2' && (
                  <PDFEditor
                    key={key}
                    file={templateStore.document}
                    setVariables={(variables) =>
                      templateStore.setNested('createDto.variables', JSON.stringify(variables))
                    }
                    exportCallback={exportVariables}
                    importCallback={importVariables}
                  />
                )}
              </div>

              {/* Controls */}
              <Stepper.Controls className="shrink-0 flex items-center justify-end gap-2 px-4">
                {!methods.isFirst && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={methods.prev}
                    disabled={isUploadPending || isCreateTemplatePending}>
                    <div className="flex items-center gap-2">
                      <ChevronLeft /> <span>Previous</span>
                    </div>
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleNext}
                  disabled={isUploadPending || isCreateTemplatePending}>
                  {methods.isLast ? (
                    <div className="flex items-center gap-2">
                      <span>Create</span>
                      <Save />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Next</span>
                      <ChevronRight />
                    </div>
                  )}
                </Button>
              </Stepper.Controls>
            </>
          );
        }}
      </Stepper.Provider>
    </div>
  );
};
