import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useTaxRatesProps {
  enabled?: boolean;
  join: string[];
}

export const useTaxRates = (
  { enabled = true, join = [] }: useTaxRatesProps = { enabled: true, join: [] }
) => {
  const {
    data: taxRatesResp,
    isPending: isTaxRatesPending,
    refetch: refetchTaxRates
  } = useQuery({
    queryKey: ['tax-rates'],
    queryFn: () =>
      api.core.taxRate.findAll({
        join: join.join(',')
      }),
    enabled
  });

  const taxRates = React.useMemo(() => {
    if (!taxRatesResp) return [];
    return taxRatesResp;
  }, [taxRatesResp]);

  return {
    taxRates,
    isTaxRatesPending,
    refetchTaxRates
  };
};
