import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import DataTableCell from '@/components/shared/data-table/core/data-table-cell';
import { DataTableCellVariant } from '@/components/shared/data-table/types';

const UserAvatarCell = React.memo(
  ({ pictureId, fallback }: { pictureId?: number; fallback?: string }) => {
    const { data: url } = useQuery({
      queryKey: ['profile-picture', pictureId],
      queryFn: () => api.upload.getUploadById(pictureId!),
      enabled: !!pictureId,
      staleTime: Infinity
    });

    return (
      <DataTableCell
        variant={DataTableCellVariant.AVATAR}
        value={{ url, fallback }}
        className="my-2 w-10 h-10 bg-muted border-2 rounded-full"
      />
    );
  }
);

UserAvatarCell.displayName = 'UserAvatarCell';

export default UserAvatarCell;
