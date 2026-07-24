import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

export default function useFirm(id?: number, enabled: boolean = true) {
  const { data: firm, isPending: isFetchFirmPending } = useQuery({
    queryKey: ['firm', id],
    queryFn: () => api.core.enterprise.findById(id!),
    enabled: enabled && !!id
  });

  return { firm, isFetchFirmPending };
}
