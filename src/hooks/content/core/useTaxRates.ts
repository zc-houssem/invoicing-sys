import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useTaxRatesProps {
  enabled?: boolean;
}

export const useTaxRates = ({ enabled = true }: useTaxRatesProps = { enabled: true }) => {
  const {
    data: taxRatesResp,
    isPending: isTaxRatesPending,
    refetch: refetchTaxRates
  } = useQuery({
    queryKey: ['tax-rates'],
    queryFn: () => api.core.taxRate.findAll({}),
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
