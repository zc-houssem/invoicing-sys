import { InformationalSettings } from '@/components/settings/InformationalSettings';
import { ActiveEnterpriseAddressEditForm } from '@/components/administrative-tools/configuration/enterprises/ActiveEnterpriseAddressEditForm';

export default function Page() {
  return (
    <InformationalSettings>
      <ActiveEnterpriseAddressEditForm />
    </InformationalSettings>
  );
}
