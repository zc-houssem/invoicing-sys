import React from 'react';
import { UpdateTemplateForm } from '@/components/content-management/templates/forms/UpdateTemplateForm';
import { useRouter } from 'next/router';
import { PdfSettingsLayout } from '@/components/content-management/pdf/PdfSettingsLayout';
import { useTemplateStore } from '@/hooks/stores/useTemplateStore';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  const templateStore = useTemplateStore();

  const { data, isPending } = useQuery({
    queryKey: ['template', id],
    queryFn: () => api.core.template.findById(id),
    enabled: !!id
  });

  React.useEffect(() => {
    if (data) {
      templateStore.set('response', data);
      templateStore.set('updateDto', {
        name: data.name,
        description: data.description,
        templateTypeId: data.templateType?.id,
        documentId: data.document?.id,
        variables: data.variables ? JSON.stringify(data.variables) : undefined,
        previewPictureId: data.previewPictureId
      });
      templateStore.set('previewPicture', data.previewPicture ? `/storage/view/slug/${data.previewPicture.slug}` : null);
    }
  }, [data]);

  return (
    <PdfSettingsLayout>
      {isPending ? <div>Loading...</div> : <UpdateTemplateForm id={id} />}
    </PdfSettingsLayout>
  );
}
