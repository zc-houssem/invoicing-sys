import React from 'react';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar, CalendarProps } from './calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { getDateFnsLocale } from '@/lib/language';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: Date | string | number | null;
  onChange?: (date: any) => void;
  onDateChange?: (date: any) => void;
  calendarProps?: Partial<CalendarProps>;
  error?: boolean;
  locale?: string;
  popoverAlign?: 'start' | 'end' | 'center';
  nullable?: boolean;
  isPending?: boolean;
}

const DatePicker = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      onBlur,
      onChange,
      onDateChange,
      value: _value,
      calendarProps,
      error,
      locale: propLocale,
      popoverAlign = 'start',
      nullable,
      isPending,
      disabled,
      ...props
    },
    ref
  ) => {
    const formatValueForInput = (val?: Date | string | number | null) => {
      if (!val) return '';
      if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
      const date = new Date(val);
      if (!isNaN(date.getTime())) {
        return format(date, 'yyyy-MM-dd');
      }
      return typeof val === 'string' ? val : '';
    };

    const dateFnsLocale = getDateFnsLocale();
    const [value, setValue] = React.useState(() => formatValueForInput(_value));
    const [open, setOpen] = React.useState(false);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
    };

    const handleDateChange = (newDate: Date | null) => {
      if (newDate) {
        setValue(format(newDate, 'yyyy-MM-dd'));
        onDateChange?.(newDate);
        onChange?.(newDate);
      } else {
        setValue('');
        onDateChange?.(null);
        onChange?.(null);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue(val);
      if (!val) {
        onDateChange?.(null);
        onChange?.(null);
        return;
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        const [year, month, day] = val.split('-').map(Number);
        const dateObj = new Date();
        dateObj.setFullYear(year, month - 1, day);
        dateObj.setHours(0, 0, 0, 0);
        if (!isNaN(dateObj.getTime())) {
          onDateChange?.(dateObj);
          onChange?.(dateObj);
        }
      } else {
        const dateObj = new Date(val);
        if (!isNaN(dateObj.getTime())) {
          onDateChange?.(dateObj);
          onChange?.(dateObj);
        }
      }
    };

    React.useEffect(() => {
      if (_value !== undefined) {
        setValue(formatValueForInput(_value));
      }
    }, [_value]);

    const selectedDate = React.useMemo(() => {
      if (!value) return undefined;
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split('-').map(Number);
        const date = new Date();
        date.setFullYear(year, month - 1, day);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    }, [value]);

    const isDisabled = disabled || isPending;

    return (
      <Popover
        open={isDisabled ? false : open}
        onOpenChange={(newOpen) => {
          if (!isDisabled) setOpen(newOpen);
        }}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              className={cn(
                'focus-visible:ring-0 focus-visible:ring-ring focus-visible:border-primary focus-visible:ring-offset-0',
                error &&
                  'border-red-600 focus-visible:ring-0 focus-visible:ring-ring focus-visible:border-red-600 focus-visible:ring-offset-0',
                className
              )}
              onBlur={handleBlur}
              type={type || 'date'}
              placeholder={format(new Date(), 'P', { locale: dateFnsLocale })}
              onClick={(e) => {
                if (type === 'date' || !type) {
                  e.stopPropagation();
                }
                props.onClick?.(e);
              }}
              ref={ref}
              value={value ?? ''}
              onChange={handleInputChange}
              disabled={isDisabled}
              {...props}
            />
            <div className="absolute flex right-0 top-0 h-full w-10 justify-center items-center z-50">
              <CalendarIcon
                className={cn(
                  'h-4 w-4 cursor-pointer text-muted-foreground',
                  error && 'text-red-600',
                  isDisabled && 'pointer-events-none opacity-50'
                )}
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent align={popoverAlign}>
          <Calendar
            className="w-full"
            locale={dateFnsLocale}
            mode="single"
            selected={selectedDate}
            defaultMonth={selectedDate || new Date()}
            captionLayout="dropdown"
            startMonth={new Date(1890, 0)}
            endMonth={new Date(2200, 11)}
            onSelect={(date) => {
              if (date) {
                handleDateChange(date);
                setOpen(false);
              } else {
                handleDateChange(null);
              }
            }}
            initialFocus={true}
            {...(calendarProps as any)}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export { DatePicker };
