import React from 'react';
import { useInterlocutor } from '@/hooks/content/core/useInterlocutor';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail, Building2 } from 'lucide-react';

interface InterlocutorOverviewProps {
  className?: string;
  id: number;
}

export const InterlocutorOverview = ({ className, id }: InterlocutorOverviewProps) => {
  const { t: tContacts } = useTranslation('contacts');

  const { interlocutor, isFetchInterlocutorPending } = useInterlocutor({ id });

  if (isFetchInterlocutorPending) {
    return <Spinner className="h-96" show={true} />;
  }

  if (!interlocutor) {
    return null;
  }

  const fullName = `${interlocutor.firstName || ''} ${interlocutor.lastName || ''}`.trim();

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            {tContacts('interlocutor.details.general_information')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <InfoItem label={tContacts('interlocutor.details.title')} value={interlocutor.title} />
          <InfoItem label={tContacts('interlocutor.details.name')} value={fullName} />
          <InfoItem
            label={tContacts('interlocutor.details.phone')}
            value={interlocutor.phone}
            icon={<Phone size={14} className="text-muted-foreground" />}
          />
          <InfoItem
            label={tContacts('interlocutor.details.email')}
            value={interlocutor.email}
            icon={<Mail size={14} className="text-muted-foreground" />}
          />
        </CardContent>
      </Card>

      {interlocutor.enterpriseInterlocutors && interlocutor.enterpriseInterlocutors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 size={20} />
              {tContacts('interlocutor.details.associated_enterprises')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {interlocutor.enterpriseInterlocutors.map((ei) => (
              <div key={ei.id} className="flex flex-col gap-1">
                <span className="text-sm font-medium">{ei.enterprise?.name}</span>
                {ei.main && (
                  <span className="text-xs text-muted-foreground">
                    {tContacts('interlocutor.details.main_contact')}
                  </span>
                )}
              </div>
            ))}
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
