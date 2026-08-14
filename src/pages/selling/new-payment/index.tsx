import { PaymentCreateForm } from '@/components/invoicing/payment/forms/PaymentCreateForm';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const params = useSearchParams();
  const enterpriseId = params.get('enterpriseId') || undefined;
  return <PaymentCreateForm enterpriseId={enterpriseId} />;
}


