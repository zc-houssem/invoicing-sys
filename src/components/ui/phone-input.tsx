import * as React from 'react';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Skeleton } from './skeleton';

type PhoneInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (value: RPNInput.Value) => void;
    isPending?: boolean;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps & { isPending?: boolean }
>(({ className, onChange, isPending, ...props }, ref) => {
  return (
    <>
      {!isPending ? (
        <RPNInput.default
          ref={ref}
          className={cn('flex', className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          onChange={(value) => onChange?.(value as any)}
          {...props}
        />
      ) : (
        <Skeleton className="h-11" />
      )}
    </>
  );
});
PhoneInput.displayName = 'PhoneInput';

const InputComponent = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => (
    <Input className={cn('rounded-e-lg rounded-s-none', className)} {...props} ref={ref} />
  )
);
InputComponent.displayName = 'InputComponent';

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const getCallingCode = (country: RPNInput.Country) => {
  try {
    return country ? RPNInput.getCountryCallingCode(country) : '';
  } catch {
    return '';
  }
};

const CountrySelect = ({ disabled, value, onChange, options }: CountrySelectProps) => {
  const { t: tCommon } = useTranslation('common');
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange]
  );

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={'outline'}
          className={cn('flex gap-1 rounded-e-none rounded-s-lg px-3 border-r-0 h-9')}
          disabled={disabled}>
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn('-mr-1 h-4 w-4 opacity-50', disabled ? 'hidden' : 'opacity-100')}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-75 p-0">
        <Command className="bg-background">
          <CommandInput placeholder={tCommon('phone-input.search') + '...'} />
          <CommandList>
            <CommandEmpty>{tCommon('phone-input.not_found')}</CommandEmpty>
            <CommandGroup>
              {options
                .filter((x) => x.value)
                .map((option) => {
                  const code = getCallingCode(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={`${option.label} ${option.value} ${code}`}
                      onSelect={() => handleSelect(option.value)}>
                      <span className="w-1/3 text-start">
                        <FlagComponent country={option.value} countryName={option.label} />
                      </span>
                      <span className="flex-1 text-sm w-1/3 text-center">{option.value}</span>
                      {code && (
                        <span className="text-foreground/50 text-sm w-1/3 text-end">
                          {`+${code}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          option.value === value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-muted [&_svg]:h-full [&_svg]:w-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = 'FlagComponent';

export { PhoneInput };
