import { Spinner } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useSequenceStore } from '../../../hooks/stores/useSequenceStore';
import React from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useSequence } from '@/hooks/content/sequence/useSequence';
import { useActiveCompanyContext } from '@/context/ActiveCompanyContext';
import { useFooter } from '@/context/FooterContext';
import { SequenceItem } from './SequeceItem';
import { DateFormat, UpdateSequentialDto } from '@/types';

interface SequencePortalProps {
  className?: string;
}

export const SequencePortal = ({ className }: SequencePortalProps) => {
  const router = useRouter();
  const { t: tSettings } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');

  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.([
      { title: tCommon('menu.settings') },
      { title: tCommon('submenu.system') },
      { title: tCommon('settings.system.sequence') }
    ]);
  }, [router.locale, setRoutes, tCommon]);

  const sequenceStore = useSequenceStore();
  const { activeCompanyId } = useActiveCompanyContext();
  const { sequences, isSequencesPending, updateSequenceBatchAsync, isBatchUpdating } = useSequence(
    activeCompanyId || undefined
  );
  const { setContent, clearContent } = useFooter();

  React.useEffect(() => {
    if (!isSequencesPending) {
      sequences.forEach((seq) => {
        sequenceStore.setSequence(seq.type, {
          prefix: seq.prefix,
          dateFormat: seq.dateFormat,
          nextValue: seq.nextValue,
          padding: seq.padding
        });
      });
    }
  }, [sequences, isSequencesPending]);

  const handleSubmit = React.useCallback(async () => {
    const currentSequences = useSequenceStore.getState().sequences;

    const batchUpdates = Object.keys(currentSequences).map((type) => ({
      type: type as any,
      ...currentSequences[type]
    }));

    if (batchUpdates.length > 0) {
      await updateSequenceBatchAsync({ sequences: batchUpdates });
    }
  }, [updateSequenceBatchAsync]);

  const handleCancel = React.useCallback(() => {
    const store = useSequenceStore.getState();
    store.reset();
    sequences.forEach((seq) => {
      store.setSequence(seq.type, {
        prefix: seq.prefix,
        dateFormat: seq.dateFormat,
        nextValue: seq.nextValue,
        padding: seq.padding
      });
    });
  }, [sequences]);

  React.useEffect(() => {
    setContent?.(
      <div className="flex justify-end w-full gap-2">
        <Button onClick={handleSubmit} disabled={isBatchUpdating || isSequencesPending}>
          {tCommon('commands.save')}
          {isBatchUpdating && <Spinner show />}
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          {tCommon('commands.cancel')}
        </Button>
      </div>
    );
    return () => clearContent?.();
  }, [
    handleSubmit,
    handleCancel,
    isBatchUpdating,
    isSequencesPending,
    tCommon,
    setContent,
    clearContent
  ]);

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <div className={cn('grid grid-cols-1 2xl:grid-cols-2 gap-4')}>
        {sequences.map((sequence) => (
          <SequenceItem
            key={sequence.id}
            title={tSettings(`sequence.elements.${sequence.type}`)}
            prefix={sequenceStore.sequences[sequence.type]?.prefix}
            dateFormat={sequenceStore.sequences[sequence.type]?.dateFormat || DateFormat.YYYY}
            nextNumber={sequenceStore.sequences[sequence.type]?.nextValue || 0}
            padding={sequenceStore.sequences[sequence.type]?.padding || 0}
            loading={isSequencesPending}
            onSequenceChange={(key, value) =>
              sequenceStore.set(sequence.type, key as keyof UpdateSequentialDto, value)
            }
          />
        ))}
      </div>
    </div>
  );
};
