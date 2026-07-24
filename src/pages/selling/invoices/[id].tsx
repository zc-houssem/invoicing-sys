import React from 'react';
import { useRouter } from 'next/router';
import { InvoiceUpdateForm } from '@/components/invoicing/invoice/forms/InvoiceUpdateForm';

export default function EditInvoicePage() {
  const router = useRouter();
  const id = Number(router.query.id);

  if (!id) return null;

  return <InvoiceUpdateForm id={id} />;
}
