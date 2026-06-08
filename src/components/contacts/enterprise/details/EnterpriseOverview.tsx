import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Phone, Globe, FileText, MapPin, Banknote, CalendarClock } from 'lucide-react';

interface EnterpriseOverviewProps {
  className?: string;
  id: number;
}

export const EnterpriseOverview = ({ className, id }: EnterpriseOverviewProps) => {
  const { t: tContacts } = useTranslation('contacts');

  const { data: enterprise, isPending } = useQuery({
    queryKey: ['enterprise', id],
    queryFn: () => api.core.enterprise.findById(id),
    enabled: !!id
  });

  if (isPending) {
    return <Spinner className="h-96" show={true} />;
  }

  if (!enterprise) {
    return null;
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 size={20} />
            {tContacts('enterprise.details.general_information')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <InfoItem label={tContacts('enterprise.details.name')} value={enterprise.name} />
          <InfoItem
            label={tContacts('enterprise.details.phone')}
            value={enterprise.phone}
            icon={<Phone size={14} className="text-muted-foreground" />}
          />
          <InfoItem
            label={tContacts('enterprise.details.website')}
            value={enterprise.website}
            icon={<Globe size={14} className="text-muted-foreground" />}
          />
          <InfoItem
            label={tContacts('enterprise.details.tax_id')}
            value={enterprise.taxId}
            icon={<FileText size={14} className="text-muted-foreground" />}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              {tContacts('enterprise.details.type')}
            </span>
            <Badge variant={enterprise.particular ? 'secondary' : 'default'} className="w-fit">
              {enterprise.particular
                ? tContacts('enterprise.details.particular')
                : tContacts('enterprise.details.company')}
            </Badge>
          </div>
          {enterprise.activity && (
            <InfoItem
              label={tContacts('enterprise.details.activity')}
              value={enterprise.activity.label}
            />
          )}
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote size={20} />
            {tContacts('enterprise.details.financial_information')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {enterprise.currency && (
            <InfoItem
              label={tContacts('enterprise.details.currency')}
              value={enterprise.currency.label}
            />
          )}
          {enterprise.paymentCondition && (
            <InfoItem
              label={tContacts('enterprise.details.payment_condition')}
              value={enterprise.paymentCondition.label}
              icon={<CalendarClock size={14} className="text-muted-foreground" />}
            />
          )}
        </CardContent>
      </Card>

      {/* Addresses */}
      <div className="grid gap-6 md:grid-cols-2">
        {enterprise.invoicingAddress && (
          <AddressCard
            title={tContacts('enterprise.details.invoicing_address')}
            address={enterprise.invoicingAddress}
          />
        )}
        {enterprise.deliveryAddress && (
          <AddressCard
            title={tContacts('enterprise.details.delivery_address')}
            address={enterprise.deliveryAddress}
          />
        )}
      </div>

      {/* Notes */}
      {enterprise.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              {tContacts('enterprise.details.notes')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{enterprise.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

function InfoItem({
  label,
  value,
  icon
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium flex items-center gap-1.5">
        {icon}
        {value}
      </span>
    </div>
  );
}

function AddressCard({ title, address }: { title: string; address: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin size={18} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-1">
          {address.address && <p>{address.address}</p>}
          {address.complement && <p>{address.complement}</p>}
          <p>{[address.zipCode, address.city].filter(Boolean).join(' ')}</p>
          {address.region && <p>{address.region}</p>}
          {address.country && <p>{address.country}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
