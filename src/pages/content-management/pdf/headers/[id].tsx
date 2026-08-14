import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { useTemplateHeaderStore } from '@/hooks/stores/useTemplateHeaderStore';
import { UpdateTemplateHeaderForm } from '@/components/content-management/templates/headers/forms/UpdateTemplateHeaderForm';


export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  const templateHeaderStore = useTemplateHeaderStore();

  const { data, isPending } = useQuery({
    queryKey: ['templateHeader', id],
    queryFn: () => api.core.templateHeader.findById(id),
    enabled: !!id
  });

  React.useEffect(() => {
    if (data) {
      templateHeaderStore.set('response', data);
      templateHeaderStore.set('updateDto', {
        name: data.name,
        description: data.description,
        ejsCode: data.ejsCode,
        previewPictureId: data.previewPictureId
      });
      templateHeaderStore.set(
        'previewPicture',
        data.previewPicture ? `/storage/view/slug/${data.previewPicture.slug}` : null
      );
    }
  }, [data]);

  return (
    <>
      {isPending ? <div>Loading...</div> : <UpdateTemplateHeaderForm />}
    </>
  );
}
