import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface usePaymentConditionProps {
  enabled?: boolean;
}

export const usePaymentCondition = (
  { enabled = true }: usePaymentConditionProps = { enabled: true }
) => {
  const {
    data: paymentConditionsResp,
    isPending: isFetchPaymentConditionsPending,
    refetch: refetchPaymentConditions
  } = useQuery({
    queryKey: ['payment-conditions'],
    queryFn: () =>
      api.admin.refParam.findAll({
        filter: 'refTypeId||$eq||payment-conditions'
      }),
    enabled
  });

  const paymentConditions = React.useMemo(() => {
    if (!paymentConditionsResp) return [];
    return paymentConditionsResp;
  }, [paymentConditionsResp]);

  return {
    paymentConditions,
    isFetchPaymentConditionsPending,
    refetchPaymentConditions
  };
};
