import { api } from '@/api';
import { CreateInterlocutorDto, Interlocutor, UpdateInterlocutorDto } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { useInterlocutorDeleteDialog } from './modals/InterlocutorDeleteDialog';
import { useInterlocutorCreateOrAssociateSheet } from './modals/InterlocutorCreateOrAssociateSheet';
import { useInterlocutorUpdateSheet } from './modals/InterlocutorUpdateSheet';
import { useInterlocutorPromoteDialog } from './modals/InterlocutorPromoteDialog';
import { useInterlocutorDisassociateDialog } from './modals/InterlocutorDisassociateDialog';
import { useInterlocutorColumns } from './columns';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useIntro } from '@/context/IntroContext';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useInterlocutorStore } from '@/hooks/stores/useInterlocutorStore';
import { ArrowUp, Trash2, Unlink } from 'lucide-react';

interface InterlocutorPortalProps {
  className?: string;
  firmId?: number;
}

export const InterlocutorPortal = ({ className, firmId }: InterlocutorPortalProps) => {
  const router = useRouter();

  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();

  React.useEffect(() => {
    if (!firmId) {
      setIntro?.(
        tCommon('routes.contacts.interlocutor.title'),
        tCommon('routes.contacts.interlocutor.description')
      );
      setRoutes?.([
        { title: tCommon('menu.contacts'), href: '/contacts' },
        { title: tCommon('submenu.interlocutors') }
      ]);
    }
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const interlocutorStore = useInterlocutorStore();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(10);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [sortDetails, setSortDetails] = React.useState({ order: true, sortKey: 'id' });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const [deleteDialog, setDeleteDialog] = React.useState(false);

  const {
    isPending: isFetchPending,
    error,
    data: interlocutorsResp,
    refetch: refetchInterlocutors
  } = useQuery({
    queryKey: [
      'interlocutors',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
      firmId
    ],
    queryFn: () =>
      api.interlocutor.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm,
        firmId
      )
  });

  const interlocutors = React.useMemo(() => {
    return interlocutorsResp?.data || [];
  }, [interlocutorsResp]);

  const { mutate: associateInterlocutor, isPending: isAssociatePending } = useMutation({
    mutationFn: (interlocutorId?: number) =>
      api.firmInterlocutorEntry.create({
        firmId,
        position: interlocutorStore.position,
        interlocutorId: interlocutorId
      }),
    onSuccess: () => {
      refetchInterlocutors();
      toast.success(tContacts('interlocutor.action_associate_success'));
      interlocutorStore.reset();
    },
    onError: () => {
      toast.error(tContacts('interlocutor.action_associate_error'));
    }
  });

  const { mutate: disassociateInterlocutor, isPending: isDisassociatePending } = useMutation({
    mutationFn: (id?: number) => api.firmInterlocutorEntry.remove(firmId, id),
    onSuccess: () => {
      refetchInterlocutors();
      toast.success(tContacts('interlocutor.action_disassociate_success'));
    },
    onError: () => {
      toast.error(tContacts('interlocutor.action_disassociate_error'));
    }
  });

  const { mutate: promoteInterlocutor, isPending: isPromotionPending } = useMutation({
    mutationFn: (id?: number) => api.interlocutor.promote(id, firmId),
    onSuccess: () => {
      refetchInterlocutors();
      toast.success(tContacts('interlocutor.action_promote_success'));
    },
    onError: (error): void => {
      toast.error(
        getErrorMessage('contacts', error, tContacts('interlocutor.action_promote_failure'))
      );
    }
  });

  const { mutate: createInterlocutor, isPending: isCreatePending } = useMutation({
    mutationFn: (data: CreateInterlocutorDto) => api.interlocutor.create(data),
    onSuccess: (data) => {
      associateInterlocutor(data.id);
      toast.success(tContacts('interlocutor.action_add_success'));
    },
    onError: (error): void => {
      toast.error(getErrorMessage('contacts', error, tContacts('interlocutor.action_add_failure')));
    }
  });

  const { mutate: updateInterlocutor, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: UpdateInterlocutorDto) => api.interlocutor.update(data),
    onSuccess: (data) => {
      associateInterlocutor(data.id);
      toast.success(tContacts('interlocutor.action_update_success'));
    },
    onError: (error): void => {
      toast.error(
        getErrorMessage('contacts', error, tContacts('interlocutor.action_update_failure'))
      );
    }
  });

  const { mutate: removeInterlocutor, isPending: isDeletePending } = useMutation({
    mutationFn: (id?: number) => api.interlocutor.remove(id),
    onSuccess: () => {
      if (interlocutors?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tContacts('interlocutor.action_remove_success'));
      refetchInterlocutors();
      interlocutorStore.reset();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('contacts', error, tContacts('interlocutor.action_remove_failure'))
      );
    }
  });

  const handleUpdateSubmit = () => {
    const data: UpdateInterlocutorDto = {
      title: interlocutorStore.title,
      firstName: interlocutorStore.name,
      lastName: interlocutorStore.surname,
      email: interlocutorStore.email,
      phone: interlocutorStore.phone
    };
    const validation = api.interlocutor.validate(data);
    if (validation.message) toast.error(validation.message);
    else {
      updateInterlocutor(data);
      closeUpdateInterlocutorSheet();
    }
  };

  const { updateInterlocutorSheet, openUpdateInterlocutorSheet, closeUpdateInterlocutorSheet } =
    useInterlocutorUpdateSheet(
      firmId,
      handleUpdateSubmit,
      isUpdatePending,
      interlocutorStore.reset
    );

  const handleCreateSubmit = () => {
    const data: CreateInterlocutorDto = {
      title: interlocutorStore.title,
      firstName: interlocutorStore.name,
      lastName: interlocutorStore.surname,
      email: interlocutorStore.email,
      phone: interlocutorStore.phone
    };
    const validation = api.interlocutor.validate(data);
    if (validation.message) toast.error(validation.message);
    else {
      createInterlocutor(data);
      closeCreateInterlocutorSheet();
    }
  };

  const handleAssociateSubmit = () => {
    const validation = api.interlocutor.validateAssociations(
      interlocutorStore?.id,
      interlocutorStore?.position
    );
    if (validation.message) toast.error(validation.message);
    else {
      associateInterlocutor(interlocutorStore?.id);
      closeCreateInterlocutorSheet();
    }
  };

  const { createInterlocutorSheet, openCreateInterlocutorSheet, closeCreateInterlocutorSheet } =
    useInterlocutorCreateOrAssociateSheet(
      firmId,
      handleCreateSubmit,
      handleAssociateSubmit,
      isCreatePending || isAssociatePending,
      interlocutorStore.reset
    );

  const { deleteInterlocutorDialog, openDeleteInterlocutorDialog } = useInterlocutorDeleteDialog(
    `${interlocutorStore.name} ${interlocutorStore.surname}`,
    () => removeInterlocutor(interlocutorStore.id),
    isDeletePending
  );

  const { promoteInterlocutorDialog, openPromoteInterlocutorDialog } = useInterlocutorPromoteDialog(
    `${interlocutorStore.name} ${interlocutorStore.surname}`,
    () => promoteInterlocutor(interlocutorStore.id),
    isPromotionPending
  );

  const { disassociateInterlocutorDialog, openDisassociateInterlocutorDialog } =
    useInterlocutorDisassociateDialog(
      `${interlocutorStore.name} ${interlocutorStore.surname}`,
      (id?: number) => disassociateInterlocutor(id),
      isDisassociatePending
    );

  const isMainInterlocutor = (entity: Interlocutor) => {
    if (!firmId) return false;
    return !!entity.firmsToInterlocutor?.find((e) => e.firmId === firmId && e.isMain)?.isMain;
  };

  const additionalActions: Record<
    number,
    {
      actionCallback?: (entity: Interlocutor) => void;
      actionLabel: string;
      actionIcon: React.ReactNode;
      isActionVisible?: (entity: Interlocutor) => boolean;
    }[]
  > = {};
  let groupIndex = 0;

  if (firmId) {
    additionalActions[groupIndex++] = [
      {
        actionLabel: tCommon('commands.promote'),
        actionIcon: <ArrowUp className="size-4" />,
        actionCallback: () => openPromoteInterlocutorDialog(),
        isActionVisible: (entity: Interlocutor) => !isMainInterlocutor(entity)
      },
      {
        actionLabel: tCommon('commands.unassociate'),
        actionIcon: <Unlink className="size-4" />,
        actionCallback: () => openDisassociateInterlocutorDialog(),
        isActionVisible: (entity: Interlocutor) => !isMainInterlocutor(entity)
      }
    ];
  }

  additionalActions[groupIndex] = [
    {
      actionLabel: tCommon('commands.delete'),
      actionIcon: <Trash2 className="size-4" />,
      actionCallback: () => openDeleteInterlocutorDialog(),
      isActionVisible: (entity: Interlocutor) => !isMainInterlocutor(entity)
    }
  ];

  const context: DataTableConfig<Interlocutor> = {
    singularName: tContacts('interlocutor.singular'),
    pluralName: tContacts('interlocutor.plural'),
    inspectCallback: (entity: Interlocutor) => {
      router.push(`/contacts/interlocutor/${entity.id}`);
    },
    createCallback: firmId ? () => openCreateInterlocutorSheet() : undefined,
    updateCallback: firmId ? () => openUpdateInterlocutorSheet() : undefined,
    additionalActions,
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: interlocutorsResp?.meta.pageCount || 0,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey }),
    targetEntity: (interlocutor: Interlocutor) => {
      interlocutorStore.setInterlocutor(interlocutor, firmId);
    }
  };

  const columns = useInterlocutorColumns(context, firmId);

  const isPending =
    isFetchPending ||
    isAssociatePending ||
    isDisassociatePending ||
    isPromotionPending ||
    isDeletePending ||
    paging ||
    resizing ||
    searching ||
    sorting;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden container mx-auto', className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-auto p-1"
        containerClassName="overflow-auto"
        data={interlocutors}
        columns={columns}
        context={context}
        isPending={isPending}
      />

      {createInterlocutorSheet}
      {updateInterlocutorSheet}
      {deleteInterlocutorDialog}
      {promoteInterlocutorDialog}
      {disassociateInterlocutorDialog}
    </div>
  );
};
