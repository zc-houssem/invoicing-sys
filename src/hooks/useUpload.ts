import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useUploadProps {
  uploadId?: number;
}

export const useUpload = ({ uploadId }: useUploadProps) => {
  const { data: url, isPending } = useQuery({
    queryKey: ['upload', uploadId],
    queryFn: () => api.upload.getUploadById(uploadId!),
    enabled: !!uploadId,
    staleTime: Infinity
  });

  return {
    url: url ?? null,
    isPending
  };
};
