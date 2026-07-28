import { CreateEnterpriseInterlocutorDto, ResponseEnterpriseInterlocutorDto, UpdateEnterpriseInterlocutorDto } from '@/types';
import axios from '../axios';

const create = async (
  data: CreateEnterpriseInterlocutorDto
): Promise<ResponseEnterpriseInterlocutorDto> => {
  const response = await axios.post('/enterprise-interlocutor', data);
  return response.data;
};

const update = async (
  id: number,
  data: UpdateEnterpriseInterlocutorDto
): Promise<ResponseEnterpriseInterlocutorDto> => {
  const response = await axios.put(`/enterprise-interlocutor/${id}`, data);
  return response.data;
};

const remove = async (id: number): Promise<ResponseEnterpriseInterlocutorDto> => {
  const response = await axios.delete(`/enterprise-interlocutor/${id}`);
  return response.data;
};

export const enterpriseInterlocutor = {
  create,
  update,
  remove
};
