import {
  CreateEnterpriseMemberDto,
  Paginated,
  QueryParams,
  ResponseEnterpriseMemberDto,
  ResponseUserDto,
  UpdateEnterpriseMemberDto
} from '@/types';
import axios from '../axios';

const findByEnterprise = async (
  enterpriseId: number
): Promise<ResponseEnterpriseMemberDto[]> => {
  const response = await axios.get<ResponseEnterpriseMemberDto[]>(
    `/enterprise-member/enterprise/${enterpriseId}`
  );
  return response.data;
};

const findPaginated = async (
  enterpriseId: number,
  { page = '1', limit = '5', sort, filter = '', search = '' }: QueryParams
): Promise<Paginated<ResponseEnterpriseMemberDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;

  const response = await axios.get<Paginated<ResponseEnterpriseMemberDto>>(
    `/enterprise-member/enterprise/${enterpriseId}/list`,
    { params }
  );

  return response.data;
};

const findAvailableUsers = async (enterpriseId: number): Promise<ResponseUserDto[]> => {
  const response = await axios.get<ResponseUserDto[]>(
    `/enterprise-member/enterprise/${enterpriseId}/available-users`
  );
  return response.data;
};

const create = async (
  data: CreateEnterpriseMemberDto
): Promise<ResponseEnterpriseMemberDto> => {
  const response = await axios.post('/enterprise-member', data);
  return response.data;
};

const update = async (
  id: number,
  data: UpdateEnterpriseMemberDto
): Promise<ResponseEnterpriseMemberDto> => {
  const response = await axios.put(`/enterprise-member/${id}`, data);
  return response.data;
};

const remove = async (id: number): Promise<ResponseEnterpriseMemberDto> => {
  const response = await axios.delete(`/enterprise-member/${id}`);
  return response.data;
};

export const enterpriseMember = {
  findByEnterprise,
  findPaginated,
  findAvailableUsers,
  create,
  update,
  remove
};
