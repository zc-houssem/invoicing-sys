import { ResponseEnterpriseDto } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { transformDateTime } from '@/utils/date.utils';
import { ExternalLinkIcon } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/shared/data-table/data-table-row-actions';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { useTranslation } from 'react-i18next';
import { FIRM_FILTER_ATTRIBUTES } from '@/constants/firm.filter-attributes';

export const useEnterpriseColumns = (
  context: DataTableConfig<ResponseEnterpriseDto>
): ColumnDef<ResponseEnterpriseDto>[] => {
  const { t } = useTranslation('contacts');
  const { t: tCurrency } = useTranslation('currency');

  return [
    {
      accessorKey: 'entreprise_name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('enterprise.attributes.entreprise_name')}
          attribute={FIRM_FILTER_ATTRIBUTES.ENTREPRISENAME}
        />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      enableSorting: true,
      enableHiding: true
    },
    // {
    //   accessorKey: 'main_interlocurtor_name',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader
    //       column={column}
    //       context={context}
    //       title={t('enterprise.attributes.main_interlocurtor_name')}
    //       attribute={FIRM_FILTER_ATTRIBUTES.INTERLOCUTORNAME}
    //     />
    //   ),
    //   cell: ({ row }) => {
    //     const mainInterlocutor = row.original.interlocutorsToEnterprise?.find(
    //       (entry) => entry.isMain
    //     )?.interlocutor;
    //     return <div>{mainInterlocutor?.name}</div>;
    //   },
    //   enableSorting: true,
    //   enableHiding: true
    // },
    // {
    //   accessorKey: 'main_interlocurtor_surname',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader
    //       column={column}
    //       context={context}
    //       title={t('enterprise.attributes.main_interlocurtor_surname')}
    //       attribute={FIRM_FILTER_ATTRIBUTES.INTERLOCUTORSURNAME}
    //     />
    //   ),
    //   cell: ({ row }) => {
    //     const mainInterlocutor = row.original.interlocutorsToEnterprise?.find(
    //       (interlocutor) => interlocutor.isMain
    //     )?.interlocutor;
    //     return <div>{mainInterlocutor?.surname}</div>;
    //   },
    //   enableSorting: true,
    //   enableHiding: true
    // },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('enterprise.attributes.phone')}
          attribute={FIRM_FILTER_ATTRIBUTES.PHONE}
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.phone ? (
            row.original?.phone
          ) : (
            <span className="text-zinc-400">{t('enterprise.empty_cells.phone')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'website',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('enterprise.attributes.website')}
          attribute={FIRM_FILTER_ATTRIBUTES.WEBSITE}
        />
      ),
      cell: ({ row }) => (
        <div className="font-bold">
          {' '}
          {row.original?.website ? (
            <a
              className="flex items-center gap-1"
              href={row.original?.website}
              target="_blank"
              rel="noreferrer">
              {row.original?.website}
              <ExternalLinkIcon className="h-5 w-5" />
            </a>
          ) : (
            <span className="text-zinc-400">{t('enterprise.empty_cells.website')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'tax_number',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('enterprise.attributes.tax_number')}
          attribute={FIRM_FILTER_ATTRIBUTES.TAXIDNUMBER}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.taxId || (
            <span className="text-zinc-400">{t('enterprise.empty_cells.tax_number')}</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('enterprise.attributes.type')}
          attribute={FIRM_FILTER_ATTRIBUTES.ISPERSON}
        />
      ),
      cell: ({ row }) => (
        <div>
          <Badge className="px-4 py-1">
            {row.original?.particular
              ? t('enterprise.attributes.particular_entreprise_type')
              : t('enterprise.attributes.entreprise_type')}
          </Badge>
        </div>
      ),
      enableSorting: true,
      enableHiding: true
    },
    // {
    //   accessorKey: 'activity',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader
    //       column={column}
    //       context={context}
    //       title={t('enterprise.attributes.activity')}
    //       attribute={FIRM_FILTER_ATTRIBUTES.ACTIVITY}
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <div>
    //       {row.original?.activity?.label ? (
    //         row.original?.activity?.label
    //       ) : (
    //         <span className="text-zinc-400">{t('enterprise.empty_cells.activity')}</span>
    //       )}
    //     </div>
    //   ),
    //   enableSorting: true,
    //   enableHiding: true
    // },
    // {
    //   accessorKey: 'currency',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader
    //       column={column}
    //       context={context}
    //       title={t('enterprise.attributes.currency')}
    //       attribute={FIRM_FILTER_ATTRIBUTES.CURRENCY}
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <div>
    //       {row.original?.currency ? (
    //         <span>
    //           {row.original?.currency?.code && tCurrency(row.original?.currency?.code)} (
    //           {row.original?.currency?.symbol})
    //         </span>
    //       ) : (
    //         <span className="text-zinc-400">{t('enterprise.empty_cells.currency')}</span>
    //       )}
    //     </div>
    //   ),
    //   enableSorting: true,
    //   enableHiding: true
    // },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          context={context}
          title={t('enterprise.attributes.created_at')}
          attribute={FIRM_FILTER_ATTRIBUTES.CREATEDAT}
        />
      ),
      cell: ({ row }) => <div>{transformDateTime(row.original?.createdAt || '')}</div>,
      enableSorting: true,
      enableHiding: true
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DataTableRowActions row={row} context={context} />
        </div>
      )
    }
  ];
};
