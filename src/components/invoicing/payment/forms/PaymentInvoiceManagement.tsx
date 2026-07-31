import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePaymentStore } from '@/hooks/stores/usePaymentStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentInvoiceManagementProps {
  className?: string;
  loading?: boolean;
}

export const PaymentInvoiceManagement = ({
  className,
  loading
}: PaymentInvoiceManagementProps) => {
  const { t: tInvoicing } = useTranslation('invoicing');
  const store = usePaymentStore();
  const invoices = store.createDto.invoices || [];

  if (invoices.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 font-bold h-24 text-center ">
        {tInvoicing('payment.no_invoices')} <PackageOpen />
      </div>
    );
  }

  return (
    <div className="border-b">
      <Card className={cn('w-full border-0 shadow-none', className)}>
        <CardHeader className="space-y-1 w-full">
          <div className="flex flex-row items-center">
            <div>
              <CardTitle className="text-2xl flex justify-between">
                {tInvoicing('invoice.plural')}
              </CardTitle>
              <CardDescription>{tInvoicing('article.manager-statement')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {/* Implement Invoice List Rendering Here */}
        </CardContent>
      </Card>
    </div>
  );
};
