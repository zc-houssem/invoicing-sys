import React from 'react';
import { EnterpriseSettings } from '@/components/settings/EnterpriseSettings';
import { EnterpriseMemberPortal } from '@/components/settings/enterprise-members/EnterpriseMemberPortal';

export default function Page() {
  return (
    <EnterpriseSettings>
      <EnterpriseMemberPortal />
    </EnterpriseSettings>
  );
}
