import React from 'react';
import { Label } from '@/components/ui/label';

import { useTranslation } from 'react-i18next';
import { useInterlocutorStore } from '@/hooks/stores/useInterlocutorStore';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combo-box';

interface InterlocutorAssociationProps {
  className?: string;
  interlocutors?: Interlocutor[];
  loading?: boolean;
}

export const InterlocutorAssociation: React.FC<InterlocutorAssociationProps> = ({
  className,
  interlocutors,
  loading
}) => {
  const { t: tCommon } = useTranslation('contacts');
  const { t: tInvoicing } = useTranslation('invoicing');

  const interlocutorStore = useInterlocutorStore();
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* interlocutor */}
      <div className="mx-1 w-full">
        <Label>{tCommon('interlocutor.singular')} (*)</Label>
        <Combobox
          value={
            interlocutorStore?.id
              ? `${interlocutorStore?.name}|${interlocutorStore?.surname}|${interlocutorStore?.id}`
              : undefined
          }
          onValueChange={(e) => {
            const [name, surname, id] = e.split('|');
            interlocutorStore.set('id', id);
            interlocutorStore.set('name', name);
            interlocutorStore.set('surname', surname);
          }}
          data={interlocutors?.map((i) => ({
            label: `${i.name} ${i.surname} (${i.email})`,
            value: `${i.name}|${i.surname}|${i.id}`
          }))}
          className={'my-4'}
          containerClassName="max-h-52"
          placeholder={tInvoicing('invoice.associate_interlocutor')}
        />
      </div>

      <div className="mx-1 w-full">
        <Label>{tCommon('interlocutor.attributes.position')}</Label>
        <Input
          className="mt-1"
          placeholder="Ex. CEO"
          value={interlocutorStore && interlocutorStore.position}
          onChange={(e) => {
            interlocutorStore.set('position', e.target.value);
          }}
        />
      </div>
    </div>
  );
};
