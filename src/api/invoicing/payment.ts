import {
  CreatePaymentDto,
  ResponsePaymentDto,
  UpdatePaymentDto
} from '@/types/core/invoicing/payment';
import axios from '../axios';
import { Paginated, QueryParams } from '@/types/response';

const findPaginated = async ({
  page = '1',
  limit = '5',
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<Paginated<ResponsePaymentDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponsePaymentDto>>(`/payment/list`, {
    params
  });

  return response.data;
};

const findAll = async (): Promise<ResponsePaymentDto[]> => {
  const response = await axios.get<ResponsePaymentDto[]>(`/payment/all`);
  return response.data;
};

const findById = async (id: number, join?: string): Promise<ResponsePaymentDto> => {
  const response = await axios.get<ResponsePaymentDto>(`/payment/${id}`, { params: { join } });
  return response.data;
};

const create = async (payment: CreatePaymentDto): Promise<ResponsePaymentDto> => {
  const response = await axios.post('/payment', payment);
  return response.data;
};

const update = async (
  id?: number,
  payment?: UpdatePaymentDto
): Promise<ResponsePaymentDto> => {
  const response = await axios.put(`/payment/${id}`, payment);
  return response.data;
};

const remove = async (id?: number): Promise<ResponsePaymentDto> => {
  const response = await axios.delete(`/payment/${id}`);
  return response.data;
};

export const payment = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove
};
