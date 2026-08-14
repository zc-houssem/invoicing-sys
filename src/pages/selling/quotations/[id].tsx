import { QuotationUpdateForm } from '@/components/invoicing/quotation/forms/QuotationUpdateForm';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <QuotationUpdateForm id={Number(id)} />;
}
