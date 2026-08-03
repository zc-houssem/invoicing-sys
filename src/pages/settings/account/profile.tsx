import React from 'react';
import { InformationalSettings } from '@/components/settings/InformationalSettings';
import { ProfilePortal } from '@/components/settings/profile/ProfilePortal';

export default function Page() {
  return (
    <InformationalSettings>
      <ProfilePortal />
    </InformationalSettings>
  );
}
