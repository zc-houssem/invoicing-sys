import { EnterpriseSettings } from '@/components/settings/EnterpriseSettings';
import { ActiveEnterpriseAddressEditForm } from '@/components/administrative-tools/configuration/enterprises/ActiveEnterpriseAddressEditForm';

export default function Page() {
  return (
    <EnterpriseSettings>
      <ActiveEnterpriseAddressEditForm />
    </EnterpriseSettings>
  );
}
