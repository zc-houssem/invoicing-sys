import { toast } from 'sonner';
import { useUpload } from '@/hooks/useUpload';
import { useUploadMutation } from '@/hooks/useUploadMutation';
import { EnterpriseStore } from '@/hooks/stores/useEnterpriseStore';
import { ServerErrorResponse, Upload } from '@/types';

export const useEnterpriseLogoUpload = (
  store: EnterpriseStore,
  dtoKey: 'createDto' | 'updateDto'
) => {
  const logoId = store[dtoKey]?.logoId;
  const pendingFile = store.logo instanceof File ? store.logo : null;
  const { url: serverLogoUrl } = useUpload({ uploadId: logoId });
  const logoImage = pendingFile ?? serverLogoUrl ?? null;

  const { uploadFiles: uploadLogo, isUploadPending: isLogoUploadPending } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      store.setNested(`${dtoKey}.logoId`, response?.[0]?.id);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data?.message ?? 'Failed to upload logo');
    }
  });

  return {
    logoImage,
    uploadLogo,
    isLogoUploadPending
  };
};
