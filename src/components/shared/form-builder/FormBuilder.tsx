import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FieldBuilder } from './FieldBuilder';
import { FieldVariant, FormStructure } from './types';

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
            <h1
              className={cn(
                'text-2xl font-bold tracking-tight md:text-3xl',
                structure.title?.className
              )}>
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
          'flex gap-4 xl:gap-10',
          structure?.orientation === 'vertical' ? 'flex-col xl:flex-row' : 'flex-col'
        )}>
        {structure?.fieldsets?.map((fieldset, index) => (
          <div
            key={index}
            className={cn(
              'flex  w-full',
              structure.orientation === 'vertical'
                ? 'flex-row xl:flex-col gap-10'
                : 'flex-col gap-5'
            )}>
            {fieldset.includeHeader && (
              <>
                <div className="flex flex-row gap-2 justify-between">
                  <div className="flex flex-col gap-2">
                    <h2 className={cn('text-lg font-semibold', fieldset.title?.className)}>
                      {fieldset.title?.value}
                    </h2>
                    {fieldset.description && (
                      <p
                        className={cn(
                          'text-sm text-muted-foreground',
                          fieldset.description?.className
                        )}>
                        {fieldset.description.value}
                      </p>
                    )}
                  </div>
                  {fieldset.component && <div>{fieldset.component}</div>}
                </div>
                <Separator />
              </>
            )}

            {fieldset?.rows?.map((row, index) => {
              const fieldCount = row.fields.length;

              return (
                <div
                  key={index}
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
                    if (!field.hidden)
                      return (
                        <div
                          key={field.id}
                          className={cn('flex flex-col gap-1 w-full', field.wrapperClassName)}>
                          <Label className={cn('text-xs font-bold')} htmlFor={field.id}>
                            <span>{field.label}</span>
                            {field.required && <span className="text-destructive mx-1">*</span>}
                          </Label>
                          {!field.pending && <FieldBuilder field={field} />}

                          <div className="flex justify-between items-center gap-2 mt-1">
                            {![FieldVariant.SWITCH, FieldVariant.CHECKBOX].includes(
                              field.variant
                            ) &&
                              !field.error && (
                                <span className="font-medium text-xs opacity-70 leading-5">
                                  {field.description}
                                </span>
                              )}
                            {field?.error && (
                              <span className="font-bold text-xs text-destructive leading-3">
                                {field?.error}
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
        ))}
      </div>
    </div>
  );
};
