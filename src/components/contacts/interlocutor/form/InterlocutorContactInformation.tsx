import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectShimmer,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SOCIAL_TITLE } from '@/api';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { PhoneInput } from '@/components/ui/phone-input';
import { useInterlocutorStore } from '@/hooks/stores/useInterlocutorStore';
import { cn } from '@/lib/utils';

interface InterlocutorContactInformationProps {
  className?: string;
  loading?: boolean;
}

export const InterlocutorContactInformation: React.FC<InterlocutorContactInformationProps> = ({
  className,
  loading
}) => {
  const { t: tCommon } = useTranslation('contacts');
  const { t: tSocial } = useTranslation('social-title');

  const interlocutorStore = useInterlocutorStore();
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* title */}
      <div>
        <Label>{tCommon('interlocutor.attributes.title')} (*)</Label>
        <div>
          <SelectShimmer isPending={loading || false}>
            <Select
              onValueChange={(e) => {
                interlocutorStore.set('title', e);
              }}
              value={interlocutorStore.title}>
              <SelectTrigger>
                <SelectValue placeholder="Titre" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SOCIAL_TITLE).map((title) => (
                  <SelectItem key={title} value={title}>
                    {tSocial(title)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SelectShimmer>
        </div>
      </div>
      {/* name */}
      <div>
        <Label>{tCommon('interlocutor.attributes.name')} (*)</Label>
        <Input
          isPending={loading || false}
          className="mt-1"
          placeholder="Ex. John"
          value={interlocutorStore.name}
          onChange={(e) => interlocutorStore.set('name', e.target.value)}
        />
      </div>
      {/* surname */}
      <div>
        <Label>{tCommon('interlocutor.attributes.surname')} (*)</Label>
        <Input
          isPending={loading || false}
          className="mt-1"
          placeholder="Ex. Doe"
          value={interlocutorStore.surname}
          onChange={(e) => interlocutorStore.set('surname', e.target.value)}
        />
      </div>
      {/* email */}
      <div>
        <div className="mx-1 w-full">
          <Label>{tCommon('interlocutor.attributes.email')}</Label>
          <Input
            isPending={loading || false}
            type="email"
            className="mt-1"
            placeholder="Ex. johndoe@zedneycreative.com"
            value={interlocutorStore.email}
            onChange={(e) => interlocutorStore.set('email', e.target.value)}
          />
        </div>
      </div>
      {/* phone */}
      <div>
        <div className="mx-1 w-full">
          <Label>{tCommon('interlocutor.attributes.phone')}</Label>
          <PhoneInput
            isPending={loading || false}
            type="tel"
            defaultCountry="TN"
            className="mt-1"
            placeholder="Ex. +216 72 398 389"
            value={interlocutorStore.phone}
            onChange={(value) => interlocutorStore.set('phone', value)}
          />
        </div>
      </div>
      {/* position */}
      <div>
        <div className="mx-1 w-full">
          <Label>{tCommon('interlocutor.attributes.position')}</Label>
          <Input
            isPending={loading || false}
            className="mt-1"
            placeholder="Ex. CEO"
            value={interlocutorStore && interlocutorStore.position}
            onChange={(e) => {
              interlocutorStore.set('position', e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};
