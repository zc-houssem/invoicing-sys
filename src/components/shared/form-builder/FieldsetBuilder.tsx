import { cn } from '@/lib/utils';
import { Fieldset, FieldVariant, FormStructure } from './types';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { FieldBuilder } from './FieldBuilder';

interface FieldsetContentProps {
  fieldset: Fieldset;
  structure: FormStructure;
}

export const FieldsetBuilder = ({ fieldset, structure }: FieldsetContentProps) => {
  return (
    <div
      className={cn(
        'flex w-full',
        structure.orientation === 'vertical' ? 'flex-row xl:flex-col gap-10' : 'flex-col gap-5'
      )}>
      {fieldset.includeHeader && !structure.toggleableFieldsets && (
        <>
          <div className="flex flex-row gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <h2 className={cn('text-lg font-semibold', fieldset.title?.className)}>
                {fieldset.title?.value}
              </h2>

              {fieldset.description && (
                <p className={cn('text-sm text-muted-foreground', fieldset.description?.className)}>
                  {fieldset.description.value}
                </p>
              )}
            </div>

            {fieldset.component && <div>{fieldset.component}</div>}
          </div>

          <Separator />
        </>
      )}

      {fieldset.component && !fieldset.includeHeader && !structure.toggleableFieldsets && (
        <div className="flex justify-end">{fieldset.component}</div>
      )}

      {fieldset.rows.map((row, rowIndex) => {
        const fieldCount = row.fields.length;

        return (
          <div
            key={rowIndex}
            className={cn(
              'grid gap-6 w-full',
              structure.orientation === 'vertical' || fieldCount === 1
                ? 'grid-cols-1'
                : fieldCount === 2
                  ? 'grid-cols-1 lg:grid-cols-2'
                  : fieldCount === 3
                    ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
                    : fieldCount === 4
                      ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                      : 'w-full'
            )}>
            {row.fields.map((field) => {
              if (field.hidden) return null;

              return (
                <div
                  key={field.id}
                  className={cn('flex flex-col gap-1 w-full px-0.5', field.wrapperClassName)}>
                  {/* LABEL */}
                  <Label className="text-xs font-bold" htmlFor={field.id}>
                    <span>{field.label}</span>
                    {field.required && <span className="text-destructive mx-1">*</span>}
                  </Label>

                  {/* FIELD */}
                  {!field.pending && <FieldBuilder field={field} />}

                  {/* DESCRIPTION / ERROR */}
                  <div className="flex justify-between items-center gap-2 mt-1">
                    {![FieldVariant.SWITCH, FieldVariant.CHECKBOX].includes(field.variant) &&
                      !field.error && (
                        <span className="font-medium text-xs opacity-70 leading-5">
                          {field.description}
                        </span>
                      )}

                    {field.error && (
                      <span className="font-bold text-xs text-destructive leading-3">
                        {field.error}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
