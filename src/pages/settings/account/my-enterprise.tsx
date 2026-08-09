import React from 'react';
import { EnterpriseSettings } from '@/components/settings/EnterpriseSettings';
import { ActiveEnterpriseEditForm } from '@/components/administrative-tools/configuration/enterprises/ActiveEnterpriseEditForm';

export default function Page() {
  return (
    <EnterpriseSettings>
      <ActiveEnterpriseEditForm />
    </EnterpriseSettings>
  );
}
