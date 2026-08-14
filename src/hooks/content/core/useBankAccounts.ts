import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

interface useBankAccountsProps {
  enabled?: boolean;
}

export const useBankAccounts = ({ enabled = true }: useBankAccountsProps = { enabled: true }) => {
  const {
    data: bankAccountsResp,
    isPending: isBankAccountsPending,
    refetch: refetchBankAccounts
  } = useQuery({
    queryKey: ['bank-accounts'],
    queryFn: () => api.core.bankAccount.findAll({}),
    enabled
  });

  const bankAccounts = React.useMemo(() => {
    if (!bankAccountsResp) return [];
    return bankAccountsResp;
  }, [bankAccountsResp]);

  return {
    bankAccounts,
    isBankAccountsPending,
    refetchBankAccounts
  };
};
