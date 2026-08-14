import {
  CreateBankAccountDto,
  Paginated,
  QueryParams,
  ResponseBankAccountDto,
  UpdateBankAccountDto
} from '@/types';
import axios from '../axios';

const findPaginated = async ({
  page = '1',
  limit = '5',
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<Paginated<ResponseBankAccountDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseBankAccountDto>>(`/bank-account/list`, {
    params
  });

  return response.data;
};

const findAll = async ({
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<ResponseBankAccountDto[]> => {
  const params: { [key: string]: string | undefined } = {
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<ResponseBankAccountDto[]>(`/bank-account/all`, {
    params
  });
  return response.data;
};

const findById = async (id: number): Promise<ResponseBankAccountDto> => {
  const response = await axios.get<ResponseBankAccountDto>(`/bank-account/${id}`);
  return response.data;
};

const create = async (bankAccount: CreateBankAccountDto): Promise<ResponseBankAccountDto> => {
  const response = await axios.post('/bank-account', bankAccount);
  return response.data;
};

const update = async (
  id?: number,
  bankAccount?: UpdateBankAccountDto
): Promise<ResponseBankAccountDto> => {
  const response = await axios.put(`/bank-account/${id}`, bankAccount);
  return response.data;
};

const remove = async (id?: number): Promise<ResponseBankAccountDto> => {
  const response = await axios.delete(`/bank-account/${id}`);
  return response.data;
};

export const bankAccount = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove
};
