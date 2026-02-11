import React from 'react';
import { useSession } from 'next-auth/react';
import { useAuthPersistStore } from '@/hooks/stores/useAuthPersistStore';
import { Session } from 'next-auth';

export function AuthTokenSync() {
  const { data: rawSession, status } = useSession();
  const authPersistStore = useAuthPersistStore();

  const session = rawSession as Session;

  React.useEffect(() => {
    if (session?.user?.access_token && session?.user?.refresh_token) {
      authPersistStore.setAccessToken(session.user.access_token);
      authPersistStore.setRefreshToken(session.user.refresh_token);
      authPersistStore.setAuthenticated(true);
    }
  }, [session, status, authPersistStore.isAuthenticated]);

  return null;
}
