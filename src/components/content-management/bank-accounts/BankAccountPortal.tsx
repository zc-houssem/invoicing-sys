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
import { useDataTableState } from '@/hooks/other/useDataTableState';

interface BankAccountPortalProps {
  className?: string;
}

export const BankAccountPortal = ({ className }: BankAccountPortalProps) => {
  //next-router
  const router = useRouter();

  const { t: tCommon } = useTranslation('common');
  const { t: tContentManagement } = useTranslation('content-management');

  //set page title in the breadcrumb
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setIntro?.(
      tContentManagement('bankAccount.page.title'),
      tContentManagement('bankAccount.page.description')
    );
    setRoutes?.([
      { title: tCommon('menu.contentManagement.title') },
      { title: tCommon('menu.contentManagement.subs.bankAccounts') }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const bankAccountStore = useBankAccountStore();

    const {
    page, setPage,
    size, setSize,
    sortDetails, setSortDetails,
    searchTerm, setSearchTerm,
    columnFilters, setColumnFilters,
    tableReset
  } = useDataTableState('bankaccountportal-table', { order: true, sortKey: 'id' });

  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const {
    data: bankAccountsResp,
    isPending: isFetchPending,
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
      api.core.bankAccount.findPaginated({
        page: debouncedPage.toString(),
        limit: debouncedSize.toString(),
        sort: `${debouncedSortDetails.sortKey},${debouncedSortDetails.order ? 'asc' : 'desc'}`,
        search: debouncedSearchTerm,
        join: 'currency'
      })
  });

  const bankAccounts = React.useMemo(() => {
    return bankAccountsResp?.data || [];
  }, [bankAccountsResp]);

  //create bank account
  const { mutate: createBankAccount, isPending: isCreatePending } = useMutation({
    mutationFn: () => api.core.bankAccount.create(bankAccountStore.createDto),
    onSuccess: () => {
      toast.success(tContentManagement('bankAccount.messages.createSuccess'));
      refetchBankAccounts();
      bankAccountStore.reset();
      closeCreateBankAccountSheet();
    },
    onError: (error) => {
      const message = getErrorMessage(
        'content-management',
        error,
        'bankAccount.messages.createFailure'
      );
      toast.error(message);
    }
  });

  //update bank account
  const { mutate: updateBankAccount, isPending: isUpdatePending } = useMutation({
    mutationFn: () =>
      api.core.bankAccount.update(bankAccountStore?.response?.id, bankAccountStore.updateDto),
    onSuccess: () => {
      toast.success(tContentManagement('bankAccount.messages.updateSuccess'));
      refetchBankAccounts();
      bankAccountStore.reset();
      closeUpdateBankAccountSheet();
    },
    onError: (error) => {
      const message = getErrorMessage(
        'content-management',
        error,
        'bankAccount.messages.updateFailure'
      );
      toast.error(message);
    }
  });

  //remove bank account
  const { mutate: removeBankAccount, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.core.bankAccount.remove(id),
    onSuccess: () => {
      if (bankAccounts?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tContentManagement('bankAccount.messages.deleteSuccess'));
      refetchBankAccounts();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('content-management', error, 'bankAccount.messages.deleteFailure')
      );
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
    singularName: tContentManagement('bankAccount.entity.singular'),
    pluralName: tContentManagement('bankAccount.entity.plural'),
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
          actionLabel: tContentManagement('bankAccount.actions.promote'),
          actionIcon: <ArrowUp />,
          actionCallback: (entity) => {},
          isActionVisible: (entity) => !entity.isMain
        },
        {
          actionLabel: tContentManagement('bankAccount.actions.demote'),
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
    ...tableReset,
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
