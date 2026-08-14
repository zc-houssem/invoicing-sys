import React from 'react';
import { Table } from '@tanstack/react-table';
import { FileSpreadsheet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/other/useMediaQuery';
import { Spinner } from '@/components/shared/Spinner';
import { DataTableConfig } from './types';
import { buildExportRows, downloadExcel } from './export-to-excel';

interface DataTableExportButtonProps<TData> {
  table: Table<TData>;
  data: TData[];
  context: DataTableConfig<TData>;
}

export function DataTableExportButton<TData>({
  table,
  data,
  context
}: DataTableExportButtonProps<TData>) {
  const { t } = useTranslation('common');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [open, setOpen] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  const exportConfig = context.exportConfig;
  if (!exportConfig?.enabled) return null;

  const handleExport = async (scope: 'currentPage' | 'all') => {
    setIsExporting(true);
    try {
      const rows = scope === 'currentPage' ? data : await exportConfig.fetchAll?.();
      if (!rows?.length) {
        toast.error(t('datatable.export.noData'));
        return;
      }

      const exportRows = buildExportRows(table, rows);
      downloadExcel(exportRows, exportConfig.filename);
      setOpen(false);
      toast.success(t('datatable.export.success'));
    } catch {
      toast.error(t('datatable.export.error'));
    } finally {
      setIsExporting(false);
    }
  };

  const content = (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        disabled={isExporting || !data.length}
        onClick={() => handleExport('currentPage')}>
        {isExporting ? <Spinner /> : t('datatable.export.currentPage')}
      </Button>
      <Button
        variant="outline"
        disabled={isExporting || !exportConfig.fetchAll}
        onClick={() => handleExport('all')}>
        {isExporting ? <Spinner /> : t('datatable.export.allData')}
      </Button>
    </div>
  );

  return (
    <>
      <Button size="icon" variant="outline" onClick={() => setOpen(true)}>
        <FileSpreadsheet className="h-4 w-4" />
      </Button>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="w-[400px]">
            <DialogHeader>
              <DialogTitle>{t('datatable.export.title')}</DialogTitle>
              <DialogDescription>{t('datatable.export.description')}</DialogDescription>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="px-4 pb-6">
            <DrawerHeader>
              <DrawerTitle>{t('datatable.export.title')}</DrawerTitle>
              <DrawerDescription>{t('datatable.export.description')}</DrawerDescription>
            </DrawerHeader>
            {content}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
