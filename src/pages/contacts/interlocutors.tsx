import React from 'react';
import { InterlocutorPortal } from '@/components/contacts/interlocutor/InterlocutorPortal';

export default function Page() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden p-8">
      <InterlocutorPortal />
    </div>
  );
}
