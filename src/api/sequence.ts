import { ResponseSequenceDto } from '@/types';
import axios from './axios';

const findAll = async (): Promise<ResponseSequenceDto[]> => {
  const response = await axios.get<ResponseSequenceDto[]>(`/public/sequence/all`);
  return response.data;
};

const findById = async (id: string): Promise<ResponseSequenceDto> => {
  const response = await axios.get<ResponseSequenceDto>(`/public/sequence/${id}`);
  return response.data;
};

const findByLabel = async (label: string): Promise<ResponseSequenceDto> => {
  const response = await axios.get<ResponseSequenceDto>(`/public/sequence/label/${label}`);
  return response.data;
};

export const sequence = { findAll, findById, findByLabel };
