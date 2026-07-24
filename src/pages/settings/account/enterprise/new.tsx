import React from 'react';
import { InformationalSettings } from '@/components/settings/InformationalSettings';
import { SystemEnterpriseCreateForm } from '@/components/administrative-tools/configuration/enterprises/SystemEnterpriseCreateForm';

export default function Page() {
  return (
    <InformationalSettings>
      <SystemEnterpriseCreateForm />
    </InformationalSettings>
  );
}
