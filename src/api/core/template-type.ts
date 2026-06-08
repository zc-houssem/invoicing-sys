import { QueryParams } from '@/types';
import { ResponseTemplateTypeDto } from '@/types/core/template-type';
import axios from '../axios';

const findAll = async ({
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<ResponseTemplateTypeDto[]> => {
  const params: { [key: string]: string | undefined } = {
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<ResponseTemplateTypeDto[]>(`/template-types/all`, {
    params
  });
  return response.data;
};

export const templateType = {
  findAll
};
