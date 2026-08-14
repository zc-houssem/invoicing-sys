import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Field, SelectOption } from './types';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { ImageUploaderManager } from '@/components/shared/form-builder/ImageUploaderManager';
import { ImageUploader } from './ImageUploader';
import { PasswordField } from './PasswordField';
import { Editor } from '@/components/shared/editor/blocks/editor-x/editor';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import MultipleSelector from '@/components/ui/multi-select';
import { ComboboxMultiSelectField } from './ComboboxMultiSelectField';
import { MultipleFilesUploader } from './MultipleFilesUploader';
import { PhoneInput } from '@/components/ui/phone-input';

const EditorWrapper: React.FC<{ props: any }> = React.memo(({ props }) => {
  const { value, onChange, ...restProps } = props || {};

  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const parsedEditorState = React.useMemo(() => {
    if (!value) return undefined;
    try {
      let state = JSON.parse(value);
      while (typeof state === 'string') {
        state = JSON.parse(state);
      }
      return state;
    } catch {
      return undefined;
    }
  }, [value]);

  const handleSerializedChange = React.useCallback((val: any) => {
    onChangeRef.current?.(JSON.stringify(val));
  }, []);

  return (
    <Editor
      {...restProps}
      editorSerializedState={parsedEditorState}
      onSerializedChange={handleSerializedChange}
    />
  );
});
EditorWrapper.displayName = 'EditorWrapper';

interface FieldBuilderProps {
  field?: Field<any>;
}

export const FieldBuilder = ({ field }: FieldBuilderProps) => {
  const { t } = useTranslation('common');

  switch (field?.variant) {
    case 'text':
    case 'email':
    case 'url':
      return (
        <Input
          {...field.props}
          className={cn(
            field?.className,
            field.error && 'border-destructive focus-visible:ring-destructive'
          )}
          type={field.variant}
          placeholder={field.placeholder}
          value={field.props?.value ?? ''}
          onChange={(event) => {
            field?.props?.onChange?.(event.target.value);
          }}
        />
      );
    case 'tel':
      return (
        <PhoneInput
          {...field.props}
          className={cn(
            field?.className,
            field.error && 'border-destructive focus-visible:ring-destructive'
          )}
          value={field?.props?.value ?? ''}
          onChange={(value) => field?.props?.onChange?.(value)}
          placeholder={field?.placeholder}
        />
      );
    case 'number':
      return (
        <Input
          {...field.props}
          className={cn(
            field?.className,
            field.error && 'border-destructive focus-visible:ring-destructive'
          )}
          type={field.variant}
          min={field.props?.min}
          max={field.props?.max}
          value={field.props?.value ?? ''}
          placeholder={field?.placeholder}
          onChange={(event) => {
            if (event.target.value === '') {
              field?.props?.onChange?.(undefined);
              return;
            }
            const inputValue = Number(event.target.value);
            if (isNaN(inputValue)) return;
            const min = field.props?.min ?? -Infinity;
            const max = field.props?.max ?? Infinity;
            const clampedValue = Math.max(min, Math.min(max, inputValue));
            field?.props?.onChange?.(clampedValue);
          }}
        />
      );
    case 'select':
      return (
        <Select
          {...field.props}
          value={field?.props?.value ?? ''}
          onValueChange={(value) => {
            if (value === '__clear__') {
              field?.props?.onValueChange?.(undefined);
            } else {
              field?.props?.onValueChange?.(value);
            }
          }}
          disabled={field?.props?.disabled}>
          <SelectTrigger
            id={field.id}
            className={cn(
              'w-full',
              field?.className,
              field.error && 'border-destructive focus-visible:ring-destructive'
            )}>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent className="overflow-y-auto max-h-60">
            {field?.props?.nullable && (
              <SelectItem value="__clear__" className="text-muted-foreground font-thin italic">
                {field.placeholder || '---'}
              </SelectItem>
            )}
            {field?.props?.options?.map((option: SelectOption) => {
              return (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      );
    case 'multi_select': {
      const selectedOptions = (field.props?.options || []).filter((opt: SelectOption) =>
        field.props?.value?.includes(opt.value)
      );
      return (
        <MultipleSelector
          {...field.props}
          className={cn('w-full', field?.className)}
          options={field.props?.options}
          value={selectedOptions}
          disabled={field.props?.disabled}
          onChange={(value) => field?.props?.onValueChange?.(value.map((v: any) => v.value))}
          placeholder={field?.placeholder}
          hidePlaceholderWhenSelected={field.props?.hidePlaceholderWhenSelected}
          creatable={field.props?.creatable}
          emptyIndicator={<p className="text-center text-sm">{t('table.no_results')}</p>}
        />
      );
    }
    case 'combo_box':
      return (
        <ComboboxMultiSelectField
          {...field.props}
          className={cn(
            field?.className,
            field.error && 'border-destructive focus-within:ring-destructive/20'
          )}
          placeholder={field.placeholder}
          options={field.props?.options}
          value={field.props?.value}
          disabled={field.props?.disabled}
          onValueChange={field?.props?.onValueChange}
        />
      );

    case 'date':
      return (
        <DatePicker
          {...field.props}
          className={cn(
            'w-full',
            field?.className,
            field.error && 'border-destructive focus-visible:ring-destructive'
          )}
          value={
            (field?.props?.value && new Date(field?.props?.value as string | Date | number)) ||
            undefined
          }
          placeholder={field.placeholder}
          onDateChange={(value: Date | null) => field?.props?.onDateChange?.(value)}
          nullable={field?.props?.nullable}
          disabled={field?.props?.disabled}
        />
      );
    case 'checkbox':
      if (field.props?.selectOptions?.length) {
        return (
          <div className="flex flex-col gap-2 my-1">
            {field.props.selectOptions.map((option: SelectOption) => (
              <div key={option.label} className="flex items-center gap-2">
                <Checkbox
                  id={option.label}
                  className={field?.className}
                  checked={field.props?.value as CheckedState}
                  onCheckedChange={(value: CheckedState) => field?.props?.onCheckedChange?.(value)}
                />
                <Label className="text-sm font-semibold">{option.label}</Label>
              </div>
            ))}
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2 h-8">
          <Checkbox
            id={field.id}
            className={field?.className}
            disabled={field?.props?.disabled}
            checked={field?.props?.checked ?? field?.props?.value ?? false}
            defaultChecked={field?.props?.defaultChecked}
            onCheckedChange={(value) => field?.props?.onCheckedChange?.(value)}
          />
          <Label className={cn('text-xs')} htmlFor={field.id}>
            {field.description}
          </Label>
        </div>
      );

    case 'radio':
      return (
        <RadioGroup
          value={field.props?.value ?? ''}
          className={cn(
            'flex w-fit my-2.5',
            field?.props?.spread === 'horizontal' ? 'flex-row' : 'flex-col',
            field?.className
          )}
          onValueChange={(value) => {
            field?.props?.onValueChange?.(value);
          }}>
          {field.props?.options?.map((option: SelectOption) => (
            <div key={option.value} className="flex items-center gap-3">
              <RadioGroupItem
                value={option.value}
                id={`${field.id}-${option.value}`}
                disabled={field?.props?.disabled}
                className={cn(field?.className)}
              />
              <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    case 'password':
      return (
        <PasswordField
          {...field.props}
          className={cn(
            'pr-10',
            field.error && 'border-destructive focus-visible:ring-destructive',
            field?.className
          )}
          value={(field?.props?.value as string) ?? ''}
          onChange={(e) => field?.props?.onChange?.(e.target.value)}
        />
      );
    case 'switch':
      return (
        <div className={cn('flex items-center gap-2', field?.className)}>
          <Switch
            {...field.props}
            id={field.label}
            checked={field?.props?.checked ?? field?.props?.value ?? false}
            onCheckedChange={(value) => field?.props?.onCheckedChange?.(value)}
          />{' '}
          <Label className="text-xs font-light">{field.description}</Label>
        </div>
      );
    case 'textarea':
      return (
        <Textarea
          {...field.props}
          id={field.id}
          className={cn(!field.props?.resizable && 'resize-none', field?.className)}
          placeholder={field.placeholder}
          value={field.props?.value ?? ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            field?.props?.onChange?.(e.target.value)
          }
        />
      );
    case 'editor': {
      return <EditorWrapper props={field.props} />;
    }
    case 'file':
      return (
        <div className={cn('flex flex-col', field?.wrapperClassName)}>
          <Input
            id={field.id}
            type="file"
            accept={field.props?.accept}
            placeholder={field.placeholder}
            className={cn(
              'flex items-center',
              field?.className,
              field.error && 'border-destructive focus-visible:ring-destructive'
            )}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                field?.props?.onFileChange?.(file);
                if (field.props?.onUpload) {
                  field.props.onUpload(file, (percent: number) => {
                    field.props.progress = percent;
                  });
                }
              }
            }}
          />
          {typeof field.props?.progress === 'number' && (
            <div className="mt-2">
              <Progress value={field.props.progress} />
              <span className="text-xs text-muted-foreground text-center">
                {field.props.progress}%
              </span>
            </div>
          )}
        </div>
      );
    case 'files':
      return (
        <MultipleFilesUploader
          {...field.props}
          className={cn(field?.className)}
          disabled={field?.props?.disabled}
          files={field.props.files}
          accept={field.props?.accept}
          progress={field.props?.progress}
          onFilesChange={(files: any) => field?.props?.onFilesChange?.(files)}
          onUpload={(files, options) => field?.props?.onUpload?.(files, options)}
          onFileOpen={field?.props?.onFileOpen}
          onFileDownload={field?.props?.onFileDownload}
        />
      );
    case 'image':
      return (
        <ImageUploader
          {...field.props}
          wrapperClassName={cn(field?.wrapperClassName)}
          className={cn('flex flex-col gap-2 items-center', field?.className)}
          id={field.id}
          image={field?.props?.image}
          fallback={field?.props?.fallback}
          disabled={field?.props?.disabled}
          accept={field?.props?.accept}
          onFileChange={(e: File) => field?.props?.onFileChange?.(e)}
          onUpload={(file, onProgress) => field?.props?.onUpload?.(file, onProgress)}
        />
      );

    case 'image_gallery':
      return <ImageUploaderManager {...field.props} />;

    case 'custom':
      return (
        <div className={cn('flex flex-col gap-2', field?.className)}>{field.props?.children}</div>
      );
    case 'empty':
      return null;
    default:
      return <span className="text-xs text-red-500">Cannot Render Element</span>;
  }
};
