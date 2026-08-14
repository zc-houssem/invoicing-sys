import React from 'react';
import { api } from '@/api';
import useSocket from '@/hooks/useSocket';
import { Sequences } from '@/types/sequence';

export const useSequence = (enterpriseId: number | null | undefined, type: Sequences, setSequencePreview: (sequence: string) => void) => {
  const socket = useSocket('/socket.io');

  React.useEffect(() => {
    let mounted = true;
    if (enterpriseId) {
      api.sequence.getNextSequencePreview(enterpriseId, type).then((preview) => {
        if (mounted) setSequencePreview(preview.sequence);
      });
    }

    return () => {
      mounted = false;
    };
  }, [enterpriseId, type, setSequencePreview]);

  React.useEffect(() => {
    if (!socket || !enterpriseId) return;
    const handleSequenceUpdated = (data: { type: string; sequence: string }) => {
      if (data.type === type) {
        setSequencePreview(data.sequence);
      }
    };
    const eventName = `sequence_updated_${enterpriseId}`;
    socket.on(eventName, handleSequenceUpdated);
    return () => {
      socket.off(eventName, handleSequenceUpdated);
    };
  }, [socket, enterpriseId, type, setSequencePreview]);
};
