import React from 'react';
import { api } from '@/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sequences, UpdateSequentialDto } from '@/types/sequence';
import { toast } from 'sonner';

export const useSequence = (enterpriseId?: number, enabled: boolean = true) => {
  const queryClient = useQueryClient();

  const {
    isPending: isSequencesPending,
    data,
    refetch: refetchSequences
  } = useQuery({
    queryKey: ['sequences', enterpriseId],
    queryFn: () => {
      if (!enterpriseId) return [];
      return api.sequence.findByEnterprise(enterpriseId);
    },
    enabled: enabled && !!enterpriseId
  });

  const sequences = React.useMemo(() => {
    return data || [];
  }, [data]);

  const { mutateAsync: updateSequenceAsync, isPending: isUpdating } = useMutation({
    mutationFn: ({ type, dto }: { type: Sequences; dto: UpdateSequentialDto }) => {
      if (!enterpriseId) throw new Error('Enterprise ID is required');
      return api.sequence.updateSequence(enterpriseId, type, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sequences', enterpriseId] });
      toast.success('Séquence mise à jour avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour de la séquence');
    }
  });

  return {
    sequences,
    isSequencesPending,
    refetchSequences,
    updateSequenceAsync,
    isUpdating
  };
};

export default useSequence;
