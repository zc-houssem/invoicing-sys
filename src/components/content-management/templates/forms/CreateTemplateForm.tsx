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
  const templateStore = useTemplateStore();
  const { formStructure } = useCreateTemplateFormStructure({ store: templateStore });
  const { setIntro, clearIntro } = useIntro();

  React.useEffect(() => {
    setIntro?.('Create Template', 'Fill out the form below to create a new document template.');
    return () => {
      templateStore.reset();
      clearIntro?.();
    };
  }, []);

  // Simple validation: require a name (customize as needed)
  const validateStep = (stepId: string) => {
    if (stepId === '1') {
      return true;
    }
    if (stepId === '2') {
      return true;
    }
    return true;
  };

  // Submit handler (customize as needed)
  const handleSubmit = () => {
    // TODO: Implement actual submit logic
    // Example: toast.success('Template created!');
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
                    file={templateStore.document}
                    seVariables={(variables) =>
                      templateStore.setNested('createDto.variables', variables)
                    }
                  />
                )}
              </div>

              {/* Controls */}
              <Stepper.Controls className="shrink-0 flex items-center justify-end gap-2 px-4">
                {!methods.isFirst && (
                  <Button variant="outline" size="sm" onClick={methods.prev} disabled={false}>
                    <div className="flex items-center gap-2">
                      <ChevronLeft /> <span>Previous</span>
                    </div>
                  </Button>
                )}
                <Button size="sm" onClick={handleNext} disabled={false}>
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
