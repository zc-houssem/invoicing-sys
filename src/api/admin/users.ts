import { Paginated, QueryParams, ResponseUserDto, CreateUserDto, UpdateUserDto } from '@/types';
import axios from '../axios';

const findPaginated = async ({
  page = '1',
  limit = '5',
  sort,
  filter = '',
  search = ''
}: QueryParams): Promise<Paginated<ResponseUserDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;

  const response = await axios.get<Paginated<ResponseUserDto>>(`/admin/user/list`, {
    params
  });

  return response.data;
};

const activate = async (id?: string): Promise<ResponseUserDto> => {
  const response = await axios.put(`/admin/user/activate/${id}`);
  return response.data;
};

const deactivate = async (id?: string): Promise<ResponseUserDto> => {
  const response = await axios.put(`/admin/user/deactivate/${id}`);
  return response.data;
};

const approve = async (id?: string): Promise<ResponseUserDto> => {
  const response = await axios.put(`/admin/user/approve/${id}`);
  return response.data;
};

const disapprove = async (id?: string): Promise<ResponseUserDto> => {
  const response = await axios.put(`/admin/user/disapprove/${id}`);
  return response.data;
};

const findAll = async (): Promise<ResponseUserDto[]> => {
  const response = await axios.get<ResponseUserDto[]>(`/admin/user/all`);
  return response.data;
};

const findById = async (userId?: string, join?: string): Promise<ResponseUserDto> => {
  const response = await axios.get<ResponseUserDto>(`/admin/user/${userId}`, {
    params: { join }
  });
  return response.data;
};

const findByEmail = async (email?: string, join?: string): Promise<ResponseUserDto> => {
  const response = await axios.get<ResponseUserDto>(`/admin/user/email/${email}`, {
    params: { join }
  });
  return response.data;
};

const create = async (user: CreateUserDto): Promise<ResponseUserDto> => {
  const response = await axios.post('/admin/user', user);
  return response.data;
};

const update = async (id?: string, user?: UpdateUserDto): Promise<ResponseUserDto> => {
  const response = await axios.put(`/admin/user/${id}`, user);
  return response.data;
};

const updateCover = async (id: string, coverId: number): Promise<ResponseUserDto> => {
  const response = await axios.put(`/admin/user/cover/${id}`, { coverId });
  return response.data;
};

const remove = async (userId?: string): Promise<ResponseUserDto> => {
  const response = await axios.delete(`/admin/user/${userId}`);
  return response.data;
};

const hasPermissions = async (userId?: string, permissions?: string[]): Promise<boolean> => {
  const response = await axios.get(`/admin/user/${userId}/permissions`);
  return permissions?.every((permission) => response.data.includes(permission)) || false;
};

const updateObjectives = async (id: string, objectives: number[]): Promise<ResponseUserDto> => {
  const response = await axios.put(`/admin/user/objectives/${id}`, {
    objectives
  });
  return response.data;
};

const updateIndustries = async (id: string, industries: number[]): Promise<ResponseUserDto> => {
  const response = await axios.put(`/admin/user/industries/${id}`, {
    industries
  });
  return response.data;
};

const getObjectives = async (id: string): Promise<number[] | null> => {
  const response = await axios.get(`/admin/user/objectives/${id}`);
  return response.data;
};

const getIndustries = async (id: string): Promise<number[] | null> => {
  const response = await axios.get(`/admin/user/industries/${id}`);
  return response.data;
};

export const user = {
  findPaginated,
  findAll,
  findById,
  findByEmail,
  create,
  update,
  updateCover,
  activate,
  deactivate,
  approve,
  disapprove,
  remove,
  hasPermissions,
  updateIndustries,
  updateObjectives,
  getIndustries,
  getObjectives
};
