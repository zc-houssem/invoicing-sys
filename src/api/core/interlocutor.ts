import { CreateInterlocutorDto, ResponseInterlocutorDto, UpdateInterlocutorDto } from '@/types';
import axios from '../axios';
import { Paginated, QueryParams } from '@/types/response';

const findPaginated = async ({
  page = '1',
  limit = '5',
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<Paginated<ResponseInterlocutorDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseInterlocutorDto>>(`/interlocutor/list`, {
    params
  });

  return response.data;
};

const findAll = async ({
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<ResponseInterlocutorDto[]> => {
  const params: { [key: string]: string | undefined } = {
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;
  const response = await axios.get<ResponseInterlocutorDto[]>(`/interlocutor/all`, {
    params
  });
  return response.data;
};

const findByEnterprise = async (enterpriseId: number): Promise<ResponseInterlocutorDto[]> => {
  const response = await axios.get<ResponseInterlocutorDto[]>(
    `/interlocutor/enterprise/${enterpriseId}`
  );
  return response.data;
};

const findById = async (id: number): Promise<ResponseInterlocutorDto> => {
  const response = await axios.get<ResponseInterlocutorDto>(`/interlocutor/${id}`);
  return response.data;
};

const create = async (interlocutor: CreateInterlocutorDto): Promise<ResponseInterlocutorDto> => {
  const response = await axios.post('/interlocutor', interlocutor);
  return response.data;
};

const update = async (
  id?: number,
  interlocutor?: UpdateInterlocutorDto
): Promise<ResponseInterlocutorDto> => {
  const response = await axios.put(`/interlocutor/${id}`, interlocutor);
  return response.data;
};

const remove = async (id?: number): Promise<ResponseInterlocutorDto> => {
  const response = await axios.delete(`/interlocutor/${id}`);
  return response.data;
};

export const interlocutor = {
  findPaginated,
  findAll,
  findByEnterprise,
  findById,
  create,
  update,
  remove
};
