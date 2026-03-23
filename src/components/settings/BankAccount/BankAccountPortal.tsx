import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { api } from '@/api';
import { cn } from '@/lib/utils';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useRouter } from 'next/router';
import { useIntro } from '@/context/IntroContext';
import { useBankAccountCreateSheet } from './modals/BankAccountCreateSheet';
import { DataTable } from '@/components/shared/data-table/data-table';
import { useBankAccountColumns } from './columns';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useBankAccountStore } from '@/hooks/stores/useBankAccountStore';
import { useBankAccountUpdateSheet } from './modals/BankAccountUpdateSheet';
import { ResponseBankAccountDto, UpdateBankAccountDto } from '@/types';
import { useBankAccountDeleteDialog } from './modals/BankAccountDeleteDialog';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface BankAccountPortalProps {
  className?: string;
}

export const BankAccountPortal = ({ className }: BankAccountPortalProps) => {
  //next-router
  const router = useRouter();

  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const { t: tCurrency } = useTranslation('currency');

  //set page title in the breadcrumb
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setIntro?.(
      'Bank Accounts',
      'Here you can manage your bank accounts, which will be used for payments and invoicing.'
    );
    setRoutes?.([
      { title: tCommon('menu.settings') },
      { title: tCommon('submenu.account') },
      { title: tCommon('settings.account.bank_accounts') }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const bankAccountStore = useBankAccountStore();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [sortDetails, setSortDetails] = React.useState({ order: true, sortKey: 'id' });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const {
    isPending: isFetchPending,
    error,
    data: bankAccountsResp,
    refetch: refetchBankAccounts
  } = useQuery({
    queryKey: [
      'bank-accounts',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.bankAccount.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm
      )
  });

  const bankAccounts = React.useMemo(() => {
    return bankAccountsResp?.data || [];
  }, [bankAccountsResp]);

  // determine if there are bank accounts available so we let the client decide to switch its main account
  const [hasToCreateMainByDefault, setHasToCreateMainByDefault] = React.useState<boolean>(false);
  const [hasToUpdateMainByDefault, setHasToUpdateMainByDefault] = React.useState<boolean>(false);
  React.useEffect(() => {
    const fetchInitialAccounts = async () => {
      const resp = await api.bankAccount.findPaginated();
      setHasToCreateMainByDefault(resp.data.length === 0);
      setHasToUpdateMainByDefault(resp.data.length === 1);
    };
    fetchInitialAccounts();
  }, [bankAccounts]);

  //create bank account
  const { mutate: createBankAccount, isPending: isCreatePending } = useMutation({
    mutationFn: () => api.bankAccount.create(bankAccountStore.createDto),
    onSuccess: () => {
      toast.success(tSettings('bank_account.action_add_success'));
      refetchBankAccounts();
      bankAccountStore.reset();
      closeCreateBankAccountSheet();
    },
    onError: (error) => {
      const message = getErrorMessage('settings', error, 'bank_account.action_add_failure');
      toast.error(message);
    }
  });

  //update bank account
  const { mutate: updateBankAccount, isPending: isUpdatePending } = useMutation({
    mutationFn: () =>
      api.bankAccount.update(bankAccountStore?.response?.id, bankAccountStore.updateDto),
    onSuccess: () => {
      toast.success(tSettings('bank_account.action_add_success'));
      refetchBankAccounts();
      bankAccountStore.reset();
      closeUpdateBankAccountSheet();
    },
    onError: (error) => {
      const message = getErrorMessage('settings', error, 'bank_account.action_add_failure');
      toast.error(message);
    }
  });

  //remove bank account
  const { mutate: removeBankAccount, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.bankAccount.remove(id),
    onSuccess: () => {
      if (bankAccounts?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tSettings('bank_account.action_remove_success'));
      refetchBankAccounts();
    },
    onError: (error) => {
      toast.error(getErrorMessage('settings', error, 'bank_account.action_remove_failure'));
    }
  });

  //promote bank account
  const { mutate: promoteBankAccount, isPending: isPromotionPending } = useMutation({
    mutationFn: () =>
      api.bankAccount.update(bankAccountStore?.response?.id, bankAccountStore.updateDto),
    onSuccess: (data) => {
      toast.success(tSettings('bank_account.action_promote_success', { name: data.name }));
      refetchBankAccounts();
      bankAccountStore.reset();
    },
    onError: (error) => {
      const message = getErrorMessage('settings', error, 'bank_account.action_promote_success');
      toast.error(message);
    }
  });

  const { createBankAccountSheet, openCreateBankAccountSheet, closeCreateBankAccountSheet } =
    useBankAccountCreateSheet({
      createBankAccount,
      isCreatePending,
      resetBankAccount: bankAccountStore.reset
    });

  const { updateBankAccountSheet, openUpdateBankAccountSheet, closeUpdateBankAccountSheet } =
    useBankAccountUpdateSheet({
      updateBankAccount,
      isUpdatePending,
      resetBankAccount: bankAccountStore.reset
    });

  const { deleteBankAccountDialog, openDeleteBankAccountDialog, closeDeleteBankAccountDialog } =
    useBankAccountDeleteDialog({
      representation: bankAccountStore?.response?.name,
      deleteBankAccount: () => removeBankAccount(bankAccountStore?.response?.id || 0),
      isDeletionPending: isDeletePending,
      reset: bankAccountStore.reset
    });

  const context: DataTableConfig<ResponseBankAccountDto> = {
    singularName: 'Bank Account',
    pluralName: 'Bank Accounts',
    //dialogs
    createCallback: () => {
      openCreateBankAccountSheet();
    },
    updateCallback: () => {
      openUpdateBankAccountSheet();
    },
    deleteCallback: () => {
      openDeleteBankAccountDialog();
    },
    additionalActions: {
      1: [
        {
          actionLabel: 'Promote',
          actionIcon: <ArrowUp />,
          actionCallback: (entity) => {},
          isActionVisible: (entity) => !entity.isMain
        },
        {
          actionLabel: 'Demote',
          actionIcon: <ArrowDown />,
          actionCallback: (entity) => {},
          isActionVisible: (entity) => entity.isMain
        }
      ]
    },
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: bankAccountsResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    targetEntity: (entity) => {
      bankAccountStore.set('response', entity);
      bankAccountStore.set('updateDto', {
        name: entity.name,
        iban: entity.iban,
        bic: entity.bic,
        rib: entity.rib,
        currencyId: entity?.currency?.id,
        isMain: entity.isMain
      });
    }
  };

  const columns = useBankAccountColumns(context);

  const isPending =
    isFetchPending ||
    isCreatePending ||
    isUpdatePending ||
    isDeletePending ||
    paging ||
    resizing ||
    searching ||
    sorting;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        data={bankAccounts}
        columns={columns}
        context={context}
        isPending={isPending}
      />
      {createBankAccountSheet}
      {updateBankAccountSheet}
      {deleteBankAccountDialog}
    </div>
  );
};
