import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { useIdentifiedUser } from '@/hooks/content/user/useIdentifiedUser';
import { identifyUser, identifyUserAvatar } from '@/lib/user';
import { useUpload } from '@/hooks/useUpload';
import { format } from 'date-fns';

interface UserOverviewProps {
  className?: string;
  id: string;
}

export const UserOverview = ({ className, id }: UserOverviewProps) => {
  const { t: tUser } = useTranslation('user-management');

  const { user, isFetchUserPending } = useIdentifiedUser({
    id,
    join: ['role'],
    enabled: Boolean(id)
  });
  const { url } = useUpload({ uploadId: user?.pictureId });

  if (isFetchUserPending) {
    return <Spinner className="h-96" show={true} />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            {tUser('userManagement.details.general_information')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-4 md:col-span-2">
            <Avatar className="h-16 w-16 border-2 border-border">
              <AvatarImage src={url ?? undefined} alt={identifyUser(user)} />
              <AvatarFallback className="bg-muted text-lg font-medium">
                {identifyUserAvatar(user)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold">{identifyUser(user)}</span>
              <span className="text-sm text-muted-foreground">@{user.username}</span>
            </div>
          </div>
          <InfoItem
            label={tUser('userManagement.columns.username')}
            value={user.username}
          />
          <InfoItem
            label={tUser('userManagement.columns.email')}
            value={user.email}
            icon={<Mail size={14} className="text-muted-foreground" />}
          />
          {user.role && (
            <InfoItem
              label={tUser('userManagement.columns.role')}
              value={user.role.label}
              icon={<Shield size={14} className="text-muted-foreground" />}
            />
          )}
          {user.dateOfBirth && (
            <InfoItem
              label={tUser('userManagement.columns.dateOfBirth')}
              value={format(new Date(user.dateOfBirth), 'PPP')}
              icon={<Calendar size={14} className="text-muted-foreground" />}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} />
            {tUser('userManagement.details.account_information')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              {tUser('userManagement.columns.isActive')}
            </span>
            <Badge variant={user.isActive ? 'default' : 'secondary'} className="w-fit">
              {user.isActive
                ? tUser('userManagement.details.active')
                : tUser('userManagement.details.inactive')}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              {tUser('userManagement.columns.isApproved')}
            </span>
            <Badge variant={user.isApproved ? 'default' : 'secondary'} className="w-fit">
              {user.isApproved
                ? tUser('userManagement.details.approved')
                : tUser('userManagement.details.pending_approval')}
            </Badge>
          </div>
          <InfoItem
            label={tUser('userManagement.details.emailVerified')}
            value={
              user.emailVerified
                ? format(new Date(user.emailVerified), 'PPP')
                : tUser('userManagement.details.notVerified')
            }
          />
          {user.createdAt && (
            <InfoItem
              label={tUser('userManagement.details.memberSince')}
              value={format(new Date(user.createdAt), 'PPP')}
            />
          )}
          {user.updatedAt && (
            <InfoItem
              label={tUser('userManagement.details.lastUpdated')}
              value={format(new Date(user.updatedAt), 'PPP')}
            />
          )}
        </CardContent>
      </Card>
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
