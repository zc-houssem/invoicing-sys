import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useSequenceProps {
  label: string;
}

export const useSequence = ({ label }: useSequenceProps) => {
  const {
    data: sequence,
    isPending: isSequencePending,
    refetch: refetchSequence
  } = useQuery({
    queryKey: ['sequence', label],
    queryFn: async () => api.sequence.findByLabel(label),
    enabled: !!label
  });

  return { sequence, isSequencePending, refetchSequence };
};
