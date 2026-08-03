import React from 'react';
import { useRouter } from 'next/router';
import { EnterpriseUpdateForm } from '@/components/contacts/enterprise/form/EnterpriseUpdateForm';
import { Page404 } from '@/components/shared';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  if (!id) return <Page404 />;
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <EnterpriseUpdateForm enterpriseId={parseInt(id)} className="mx-5 lg:mx-10" />
    </div>
  );
}
