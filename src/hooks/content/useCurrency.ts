import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useCurrenciesProps {
  enabled?: boolean;
}

const useCurrencies = ({ enabled }: useCurrenciesProps = { enabled: true }) => {
  const {
    data: currenciesResp,
    isPending: isCurrenciesPending,
    refetch: refetchCurrencies
  } = useQuery({
    queryKey: ['currencies'],
    queryFn: () => api.currency.find(),
    enabled
  });

  const currencies = React.useMemo(() => {
    if (!currenciesResp) return [];
    return currenciesResp;
  }, [currenciesResp]);

  return {
    currencies,
    isCurrenciesPending,
    refetchCurrencies
  };
};

export default useCurrencies;
