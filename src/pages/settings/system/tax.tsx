import React from 'react';
import { SystemSettings } from '@/components/settings/SystemSettings';
import TaxMain from '@/components/content-management/tax-rates/TaxMain';

export default function Page() {
  return (
    <SystemSettings>
      <TaxMain />
    </SystemSettings>
  );
}
