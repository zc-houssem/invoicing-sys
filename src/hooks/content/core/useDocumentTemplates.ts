import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { ResponseTemplateDto } from '@/types';

export const useDocumentTemplates = (documentType: 'invoice' | 'quotation') =>
  useQuery({
    queryKey: ['document-templates', documentType],
    queryFn: async (): Promise<ResponseTemplateDto[]> =>
      api.core.template.findAll({
        filter: `templateType.code||$eq||${documentType}`,
        join: 'templateType',
        sort: 'name,ASC'
      })
  });
