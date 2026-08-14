import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { FormStructure } from './types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { FieldsetBuilder } from './FieldsetBuilder';

interface FormBuilderProps {
  className?: string;
  structure: FormStructure;
}

export const FormBuilder = ({ className, structure }: FormBuilderProps) => {
  return (
    <div className={cn('flex flex-col w-full', className)}>
      {!!structure?.includeHeader && (
        <div>
          <div className="space-y-1 py-5 sm:py-0">
            <h1 className={cn('text-lg font-bold tracking-tight', structure.title?.className)}>
              {structure.title?.value}
            </h1>

            {structure.description && (
              <p className={cn('text-muted-foreground', structure.description.className)}>
                {structure.description.value}
              </p>
            )}
          </div>
          <Separator className="mt-2 mb-4 lg:mb-6" />
        </div>
      )}

      <div
        className={cn(
          'flex w-full',
          structure.gap === undefined && 'gap-4 xl:gap-10',
          structure?.orientation === 'vertical' ? 'flex-col xl:flex-row' : 'flex-col'
        )}
        style={{ gap: structure.gap }}>
        {structure.toggleableFieldsets ? (
          <Accordion
            type="multiple"
            defaultValue={structure.fieldsets.map((_, index) => `fieldset-${index}`)}
            className="w-full">
            {structure.fieldsets.map((fieldset, index) => (
              <AccordionItem key={index} value={`fieldset-${index}`} className="border-0">
                <AccordionTrigger>
                  <div className="flex flex-col text-left">
                    <span className="font-semibold">{fieldset.title?.value}</span>

                    {fieldset.description && (
                      <span className="text-xs text-muted-foreground">
                        {fieldset.description.value}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <FieldsetBuilder fieldset={fieldset} structure={structure} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          structure.fieldsets.map((fieldset, index) => (
            <FieldsetBuilder key={index} fieldset={fieldset} structure={structure} />
          ))
        )}
      </div>
    </div>
  );
};
