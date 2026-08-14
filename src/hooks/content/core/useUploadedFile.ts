import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useUploadedFileProps {
  id?: number;
  enabled?: boolean;
}

export const useUploadedFile = (
  { id, enabled = true }: useUploadedFileProps = {
    id: undefined,
    enabled: true
  }
) => {
  const {
    data: fileResp,
    isPending: isFilePending,
    refetch: refetchFile
  } = useQuery({
    queryKey: ['file', id],
    queryFn: () => api.core.storage.getFileById(id!),
    enabled: enabled && !!id
  });

  const file = React.useMemo(() => {
    if (!fileResp) return null;
    return fileResp;
  }, [fileResp]);

  return {
    file,
    isFilePending,
    refetchFile
  };
};
