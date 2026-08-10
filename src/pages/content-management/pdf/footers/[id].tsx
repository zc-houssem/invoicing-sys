import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { useTemplateFooterStore } from '@/hooks/stores/useTemplateFooterStore';
import { UpdateTemplateFooterForm } from '@/components/content-management/templates/footers/forms/UpdateTemplateFooterForm';
import { PdfSettingsLayout } from '@/components/content-management/templates/PdfSettingsLayout';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  const templateFooterStore = useTemplateFooterStore();

  const { data, isPending } = useQuery({
    queryKey: ['templateFooter', id],
    queryFn: () => api.core.templateFooter.findById(id),
    enabled: !!id
  });

  React.useEffect(() => {
    if (data) {
      templateFooterStore.set('response', data);
      templateFooterStore.set('updateDto', {
        name: data.name,
        description: data.description,
        ejsCode: data.ejsCode,
        previewPictureId: data.previewPictureId
      });
      templateFooterStore.set(
        'previewPicture',
        data.previewPicture ? `/storage/view/slug/${data.previewPicture.slug}` : null
      );
    }
  }, [data]);

  return (
    <PdfSettingsLayout>
      {isPending ? <div>Loading...</div> : <UpdateTemplateFooterForm />}
    </PdfSettingsLayout>
  );
}
