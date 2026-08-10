import {
  CreateTemplateFooterDto,
  Paginated,
  QueryParams,
  ResponseTemplateFooterDto,
  UpdateTemplateFooterDto
} from '@/types';
import axios from '../axios';

const findPaginated = async ({
  page = '1',
  limit = '5',
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<Paginated<ResponseTemplateFooterDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseTemplateFooterDto>>(`/template-footers/list`, {
    params
  });

  return response.data;
};

const findAll = async ({
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<ResponseTemplateFooterDto[]> => {
  const params: { [key: string]: string | undefined } = {
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<ResponseTemplateFooterDto[]>(`/template-footers/all`, {
    params
  });
  return response.data;
};

const findById = async (id: string, join?: string): Promise<ResponseTemplateFooterDto> => {
  const response = await axios.get<ResponseTemplateFooterDto>(`/template-footers/${id}`, {
    params: { join }
  });
  return response.data;
};

const create = async (template: CreateTemplateFooterDto): Promise<ResponseTemplateFooterDto> => {
  const response = await axios.post('/template-footers', template);
  return response.data;
};

const update = async (id?: string, template?: UpdateTemplateFooterDto): Promise<ResponseTemplateFooterDto> => {
  const response = await axios.put(`/template-footers/${id}`, template);
  return response.data;
};

const remove = async (id?: string): Promise<ResponseTemplateFooterDto> => {
  const response = await axios.delete(`/template-footers/${id}`);
  return response.data;
};

export const templateFooter = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove
};
