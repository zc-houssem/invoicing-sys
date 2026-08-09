import { EnterpriseSettings } from '@/components/settings/EnterpriseSettings';
import { DefaultConditionPortal } from '@/components/settings/DefaultCondition/DefaultConditionPortal';

export default function Page() {
  return (
    <EnterpriseSettings>
      <DefaultConditionPortal />
    </EnterpriseSettings>
  );
}
