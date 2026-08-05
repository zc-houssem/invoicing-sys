import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { identifyEnterpriseAvatar } from '@/lib/enterprise';
import { useUpload } from '@/hooks/useUpload';

interface EnterpriseLogoProps {
  logoId?: number;
  name?: string;
  className?: string;
  fallbackClassName?: string;
}

export const EnterpriseLogo = ({
  logoId,
  name,
  className,
  fallbackClassName
}: EnterpriseLogoProps) => {
  const { url } = useUpload({ uploadId: logoId });
  const initials = identifyEnterpriseAvatar(name);

  return (
    <Avatar className={cn('shrink-0 rounded-lg', className)}>
      <AvatarImage
        src={url ?? undefined}
        alt={name ? `${name} logo` : 'Enterprise logo'}
        className="object-cover"
      />
      <AvatarFallback
        className={cn(
          'rounded-lg bg-muted text-xs font-medium text-muted-foreground',
          fallbackClassName
        )}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
