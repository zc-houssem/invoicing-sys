import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-table/data-table-row-actions";
import { ResponseRefParamDto } from "@/types";
import { useTranslation } from "react-i18next";
import {
  DataTableCellVariant,
  DataTableConfig,
} from "@/components/shared/data-table/types";
import { Badge } from "@/components/ui/badge";
import { JsonToggler } from "@/components/shared/JsonToggler";
import DataTableCell from "@/components/shared/data-table/core/data-table-cell";

export const useRefParamColumns = (
  context: DataTableConfig<ResponseRefParamDto>
): ColumnDef<ResponseRefParamDto>[] => {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("content-management");
  return [
    {
      accessorKey: `${t("refParam.columns.label")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("refParam.columns.label")}
          attribute="label"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.label}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("refParam.columns.description")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("refParam.columns.description")}
          attribute="description"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.description || t("refParam.columns.noDescription")}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("refParam.columns.refTypeId")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("refParam.columns.refTypeId")}
          attribute="refTypeId"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.refType?.label} ({row.original.refTypeId})
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("refParam.columns.createdAt")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("refParam.columns.createdAt")}
          attribute="createdAt"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row?.original?.createdAt);
        return (
          <DataTableCell
            variant={DataTableCellVariant.DATE_TIME}
            value={date}
          />
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("refParam.columns.updatedAt")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("refParam.columns.updatedAt")}
          attribute="updatedAt"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row?.original?.updatedAt);
        return (
          <DataTableCell
            variant={DataTableCellVariant.DATE_TIME}
            value={date}
          />
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("refParam.columns.extras")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("refParam.columns.extras")}
          attribute="extras"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const extras = row?.original?.extras;
        return extras && Object.keys(extras).length > 0 ? (
          <JsonToggler data={extras} className="w-full" />
        ) : (
          <Badge variant="outline" className="text-xs">
            {tCommon("common.table.noData")}
          </Badge>
        );
      },
      enableSorting: false,
      enableHiding: true,
      size: 200,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DataTableRowActions row={row} context={context} />
        </div>
      ),
    },
  ];
};
