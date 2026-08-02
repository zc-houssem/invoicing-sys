import { InformationalSettings } from '@/components/settings/InformationalSettings';
import { DefaultConditionPortal } from '@/components/settings/DefaultCondition/DefaultConditionPortal';

export default function Page() {
  return (
    <InformationalSettings>
      <DefaultConditionPortal />
    </InformationalSettings>
  );
}
