import axios from '../axios';
import { ResponsePermissionDto } from '@/types';

const findAll = async (): Promise<ResponsePermissionDto[]> => {
  const response = await axios.get<ResponsePermissionDto[]>(`/admin/permission/all`);
  return response.data;
};

const findById = async (id: string): Promise<ResponsePermissionDto> => {
  const response = await axios.get<ResponsePermissionDto>(`/admin/permission/${id}`);
  return response.data;
};

export const permission = {
  findAll,
  findById
};
