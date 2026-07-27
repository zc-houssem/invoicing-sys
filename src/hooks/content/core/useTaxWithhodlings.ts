import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { CurrencyPayload, ResponseRefParamDto } from '@/types';

interface useTaxWithholdingsProps {
  enabled?: boolean;
}

export const useTaxWithholdings = (
  { enabled = true }: useTaxWithholdingsProps = { enabled: true }
) => {
  const {
    data: taxWithholdingsResp,
    isPending: isTaxWithholdingsPending,
    refetch: refetchTaxWithholdings
  } = useQuery({
    queryKey: ['taxWithholdings'],
    queryFn: () =>
      api.admin.refParam.findAll({
        filter: 'refTypeId||$eq||tax-withholding'
      }),
    enabled
  });

  const taxWithholdings = React.useMemo(() => {
    if (!taxWithholdingsResp) return [];
    return taxWithholdingsResp as ResponseRefParamDto<CurrencyPayload>[];
  }, [taxWithholdingsResp]);

  return {
    taxWithholdings,
    isTaxWithholdingsPending,
    refetchTaxWithholdings
  };
};
