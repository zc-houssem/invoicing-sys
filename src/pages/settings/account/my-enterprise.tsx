import React from 'react';
import { InformationalSettings } from '@/components/settings/InformationalSettings';
import { ActiveEnterpriseEditForm } from '@/components/administrative-tools/configuration/enterprises/ActiveEnterpriseEditForm';

export default function Page() {
  return (
    <InformationalSettings>
      <ActiveEnterpriseEditForm />
    </InformationalSettings>
  );
}
