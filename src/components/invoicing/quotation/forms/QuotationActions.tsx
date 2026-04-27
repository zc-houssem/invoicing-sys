import { api } from '@/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ResponseQuotationWorkflowDto } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { Printer, Repeat2, Save } from 'lucide-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface QuotationActionsProps {
  className?: string;
  workflow: ResponseQuotationWorkflowDto | null;
  save: () => void;
  reload: () => void;
  reset: () => void;
}

export const QuotationActions = ({
  className,
  workflow,
  save,
  reload,
  reset
}: QuotationActionsProps) => {
  const { t } = useTranslation('common');

  const { mutate: next, isPending: isNextPending } = useMutation({
    mutationFn: async (event: string) =>
      api.invoicing.quotation.workflow.next(workflow?.quotation?.id!, event),
    onSuccess: () => {
      reload();
      toast.success('Quotation status updated successfully');
    }
  });

  return (
    <div className={cn('flex flex-col gap-2 items-start justify-center w-full', className)}>
      <Button
        variant={'default'}
        className="w-full"
        disabled={!workflow?.isUpdatable || isNextPending}
        onClick={save}>
        <Save />
        <span>{t('commands.save')}</span>
      </Button>
      <Button
        variant={'outline'}
        className="w-full"
        disabled={!workflow?.isPrintable || isNextPending}
        onClick={() => {}}>
        <Printer />
        <span>{t('commands.print')}</span>
      </Button>
      {workflow?.nextSteps.map((step) => (
        <Button
          key={step.label}
          variant={'outline'}
          className="w-full"
          disabled={isNextPending}
          onClick={() => next(step.label)}>
          {step.label}
        </Button>
      ))}
      <Button
        variant={'ghost'}
        className="w-full"
        disabled={!workflow?.isUpdatable}
        onClick={reset}>
        <Repeat2 />
        <span>{t('commands.reset')}</span>
      </Button>
    </div>
  );
};
