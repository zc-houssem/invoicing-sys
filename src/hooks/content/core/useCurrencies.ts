import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { CurrencyPayload, ResponseRefParamDto } from '@/types';

interface useCurrenciesProps {
  enabled?: boolean;
}

export const useCurrencies = ({ enabled = true }: useCurrenciesProps = { enabled: true }) => {
  const {
    data: currenciesResp,
    isPending: isCurrenciesPending,
    refetch: refetchCurrencies
  } = useQuery({
    queryKey: ['currencies'],
    queryFn: () =>
      api.admin.refParam.findAll({
        filter: 'refTypeId||$eq||currency'
      }),
    enabled
  });

  const currencies = React.useMemo(() => {
    if (!currenciesResp) return [];
    return currenciesResp as ResponseRefParamDto<CurrencyPayload>[];
  }, [currenciesResp]);

  return {
    currencies,
    isCurrenciesPending,
    refetchCurrencies
  };
};
