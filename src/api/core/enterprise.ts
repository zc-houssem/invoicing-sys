import { CreateEnterpriseDto, ResponseEnterpriseDto, UpdateEnterpriseDto } from '@/types';
import axios from '../axios';
import { Paginated, QueryParams } from '@/types/response';

const findPaginated = async ({
  page = '1',
  limit = '5',
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<Paginated<ResponseEnterpriseDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseEnterpriseDto>>(`/enterprise/list`, {
    params
  });

  return response.data;
};

const findAll = async (): Promise<ResponseEnterpriseDto[]> => {
  const response = await axios.get<ResponseEnterpriseDto[]>(`/enterprise/all`);
  return response.data;
};

const findById = async (id: string): Promise<ResponseEnterpriseDto> => {
  const response = await axios.get<ResponseEnterpriseDto>(`/enterprise/${id}`);
  return response.data;
};

const create = async (enterprise: CreateEnterpriseDto): Promise<ResponseEnterpriseDto> => {
  const response = await axios.post('/enterprise', enterprise);
  return response.data;
};

const update = async (
  id?: string,
  enterprise?: UpdateEnterpriseDto
): Promise<ResponseEnterpriseDto> => {
  const response = await axios.put(`/enterprise/${id}`, enterprise);
  return response.data;
};

const remove = async (id?: string): Promise<ResponseEnterpriseDto> => {
  const response = await axios.delete(`/enterprise/${id}`);
  return response.data;
};

export const enterprise = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove
};
