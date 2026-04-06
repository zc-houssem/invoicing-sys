import { Spinner } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { defineStepper } from '@/components/ui/stepper';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import React from 'react';

const steps = [
  {
    id: '1',
    title: 'Title 1'
  },
  {
    id: '2',
    title: 'Title 2'
  },
  {
    id: '3',
    title: 'Title 3'
  },
  {
    id: '4',
    title: 'Title 4'
  }
];

const { Stepper } = defineStepper(...steps);

export default function Test() {
  const validateStep = React.useCallback((stepId: string) => {
    if (stepId === '1') {
    }

    if (stepId === '2') {
    }

    if (stepId === '3') {
    }

    if (stepId === '4') {
    }
    return true;
  }, []);

  const handleSubmit = () => {
    console.log('submit');
  };

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden')}>
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
              {/* Navigation */}
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
                    }}
                    disabled={false}>
                    <Stepper.Title>{step.title}</Stepper.Title>
                  </Stepper.Step>
                ))}
              </Stepper.Navigation>

              {/* Content */}
              {false ? (
                <Spinner />
              ) : (
                <div className="flex flex-col flex-1 h-full overflow-hidden mt-4">
                  <div className="flex-1 overflow-auto px-2">
                    {methods.current.id === '1' && <div>Content 1</div>}
                    {methods.current.id === '2' && <div>Content 2</div>}
                    {methods.current.id === '3' && <div>Content 3</div>}
                    {methods.current.id === '4' && <div>Content 4</div>}
                  </div>
                </div>
              )}

              {/* Controls */}
              <Stepper.Controls className="shrink-0 flex items-center justify-end gap-2 px-4 py-3 border-t">
                {!methods.isFirst && (
                  <Button variant="outline" onClick={methods.prev} disabled={false}>
                    <ArrowLeft /> Previous
                  </Button>
                )}
                <Button onClick={handleNext} disabled={false}>
                  {methods.isLast ? (
                    <>
                      <Save /> Create
                    </>
                  ) : (
                    <>
                      Next <ArrowRight />
                    </>
                  )}
                </Button>
              </Stepper.Controls>
            </>
          );
        }}
      </Stepper.Provider>
    </div>
  );
}
