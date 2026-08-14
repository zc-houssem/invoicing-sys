import {
  CreateTemplateHeaderDto,
  Paginated,
  QueryParams,
  ResponseTemplateHeaderDto,
  UpdateTemplateHeaderDto
} from '@/types';
import axios from '../axios';

const findPaginated = async ({
  page = '1',
  limit = '5',
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<Paginated<ResponseTemplateHeaderDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseTemplateHeaderDto>>(`/template-headers/list`, {
    params
  });

  return response.data;
};

const findAll = async ({
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<ResponseTemplateHeaderDto[]> => {
  const params: { [key: string]: string | undefined } = {
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<ResponseTemplateHeaderDto[]>(`/template-headers/all`, {
    params
  });
  return response.data;
};

const findById = async (id: string, join?: string): Promise<ResponseTemplateHeaderDto> => {
  const response = await axios.get<ResponseTemplateHeaderDto>(`/template-headers/${id}`, {
    params: { join }
  });
  return response.data;
};

const create = async (template: CreateTemplateHeaderDto): Promise<ResponseTemplateHeaderDto> => {
  const response = await axios.post('/template-headers', template);
  return response.data;
};

const update = async (id?: string, template?: UpdateTemplateHeaderDto): Promise<ResponseTemplateHeaderDto> => {
  const response = await axios.put(`/template-headers/${id}`, template);
  return response.data;
};

const remove = async (id?: string): Promise<ResponseTemplateHeaderDto> => {
  const response = await axios.delete(`/template-headers/${id}`);
  return response.data;
};

export const templateHeader = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove
};
