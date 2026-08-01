import React from 'react';
import { InformationalSettings } from '@/components/settings/InformationalSettings';
import { SequencePortal } from '@/components/settings/Sequentials/SequencePortal';

export default function Page() {
  return (
    <InformationalSettings>
      <SequencePortal />
    </InformationalSettings>
  );
}
