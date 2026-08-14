import {
  CreateTemplateDto,
  Paginated,
  QueryParams,
  ResponseTemplateDto,
  UpdateTemplateDto
} from '@/types';
import axios from '../axios';

const findPaginated = async ({
  page = '1',
  limit = '5',
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<Paginated<ResponseTemplateDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseTemplateDto>>(`/template/list`, {
    params
  });

  return response.data;
};

const findAll = async ({
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<ResponseTemplateDto[]> => {
  const params: { [key: string]: string | undefined } = {
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<ResponseTemplateDto[]>(`/template/all`, {
    params
  });
  return response.data;
};

const findById = async (id: string, join?: string): Promise<ResponseTemplateDto> => {
  const response = await axios.get<ResponseTemplateDto>(`/template/${id}`, {
    params: { join }
  });
  return response.data;
};

const create = async (template: CreateTemplateDto): Promise<ResponseTemplateDto> => {
  const response = await axios.post('/template', template);
  return response.data;
};

const update = async (id?: string, template?: UpdateTemplateDto): Promise<ResponseTemplateDto> => {
  const response = await axios.put(`/template/${id}`, template);
  return response.data;
};

const remove = async (id?: string): Promise<ResponseTemplateDto> => {
  const response = await axios.delete(`/template/${id}`);
  return response.data;
};

export const template = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove
};
