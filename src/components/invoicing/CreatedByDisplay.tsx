import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { identifyUser, identifyUserAvatar } from '@/lib/user';
import { useUpload } from '@/hooks/useUpload';
import { ResponseUserDto } from '@/types';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user: ResponseUserDto;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  const { url } = useUpload({ uploadId: user.pictureId });

  return (
    <Avatar className="h-8 w-8 shrink-0 border border-border">
      <AvatarImage src={url ?? undefined} alt={identifyUser(user)} />
      <AvatarFallback className="bg-muted text-[10px] font-medium text-muted-foreground">
        {identifyUserAvatar(user)}
      </AvatarFallback>
    </Avatar>
  );
};

interface CreatedByDisplayProps {
  user?: ResponseUserDto | null;
  className?: string;
}

export const CreatedByDisplay = ({ user, className }: CreatedByDisplayProps) => {
  if (!user) {
    return <span className={cn('text-sm text-muted-foreground', className)}>—</span>;
  }

  return (
    <div className={cn('flex items-center gap-2 min-w-0', className)}>
      <UserAvatar user={user} />
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium leading-tight">{identifyUser(user)}</span>
        {user.email && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
      </div>
    </div>
  );
};
