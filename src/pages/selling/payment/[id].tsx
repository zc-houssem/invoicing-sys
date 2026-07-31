import React from 'react';
import { useRouter } from 'next/router';
import { PaymentUpdateForm } from '@/components/invoicing/payment/forms/PaymentUpdateForm';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  return <PaymentUpdateForm paymentId={id} />;
}
