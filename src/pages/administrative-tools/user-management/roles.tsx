import RoleMain from '@/components/administrative-tools/user-management/role/RoleMain';
import UserManagementSettings from '@/components/administrative-tools/UserManagementSettings';
import React from 'react';

export default function Page() {
  return (
    <UserManagementSettings>
      <RoleMain />
    </UserManagementSettings>
  );
}
