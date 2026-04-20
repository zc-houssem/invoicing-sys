'use client';

import { TableIcon } from 'lucide-react';

import { useToolbarContext } from '@/components/shared/editor/context/toolbar-context';
import { InsertTableDialog } from '@/components/shared/editor/plugins/table-plugin';
import { SelectItem } from '@/components/ui/select';

export function InsertTable() {
  const { activeEditor, showModal } = useToolbarContext();

  return (
    <SelectItem
      value="table"
      onPointerUp={() =>
        showModal('Insert Table', (onClose) => (
          <InsertTableDialog activeEditor={activeEditor} onClose={onClose} />
        ))
      }
      className="">
      <div className="flex items-center gap-1">
        <TableIcon className="size-4" />
        <span>Table</span>
      </div>
    </SelectItem>
  );
}
