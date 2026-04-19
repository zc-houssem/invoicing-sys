import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { ResponseAddressDto } from '@/types';

interface AddressDetailsProps {
  className?: string;
  address?: ResponseAddressDto;
}

export const AddressDetails = ({ className, address }: AddressDetailsProps) => {
  const { t: tContacts } = useTranslation('contacts');
  const { t: tCountry } = useTranslation('country');

  if (!address) return null;
  return (
    <div className={cn(className)}>
      <div className="flex flex-col gap-1 mt-2">
        {address?.address && (
          <Label>
            <span className="font-bold">{tContacts('address.form.address')}: </span>
            <span className="font-light">{address?.address}</span>
          </Label>
        )}
        {address?.address2 && (
          <Label>
            <span className="font-bold">{tContacts('address.form.address2')}: </span>
            <span className="font-light">{address?.address2}</span>
          </Label>
        )}
        {address?.zipcode && (
          <Label>
            <span className="font-bold">{tContacts('address.form.zipCode')}: </span>
            <span className="font-light">{address?.zipcode}</span>
          </Label>
        )}
        {address?.region && (
          <Label>
            <span className="font-bold">{tContacts('address.form.region')}: </span>
            <span className="font-light">{address?.region}</span>
          </Label>
        )}
        {address?.country && (
          <Label>
            <span className="font-bold">{tContacts('address.form.country')}: </span>
            <span className="font-light">
              {address?.country?.label && tCountry(address?.country.label)}
            </span>
          </Label>
        )}
      </div>
    </div>
  );
};
