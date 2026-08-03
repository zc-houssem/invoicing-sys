import { ResponseUserDto, UpdateUserDto } from '@/types';
import axios from './axios';

const find = async (): Promise<ResponseUserDto | null> => {
  const { data } = await axios.get<ResponseUserDto | null>('/current-user');
  return data;
};

const update = async (user: UpdateUserDto): Promise<ResponseUserDto | null> => {
  const { data } = await axios.put<ResponseUserDto | null>('/current-user', user);
  return data;
};

export const currentUser = {
  find,
  update
};
