import axios from './axios';
import { CreateBankAccountDto, ResponseBankAccountDto, UpdateBankAccountDto } from '@/types';
import { BANK_ACCOUNT_FILTER_ATTRIBUTES } from '@/constants/bank-account.filter-attributes';
import { PagedResponse } from '@/types/response';

const factory = (): UpdateBankAccountDto => {
  return {
    name: '',
    bic: '',
    iban: '',
    rib: '',
    isMain: false
  };
};

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = '',
  search: string = ''
): Promise<PagedResponse<ResponseBankAccountDto>> => {
  const generalFilters = search
    ? Object.values(BANK_ACCOUNT_FILTER_ATTRIBUTES)
        .map((key) => `${key}||$cont||${search}`)
        .join('||$or||')
    : '';

  let requestUrl = `public/bank-account/list?join=currency&limit=${size}&page=${page}`;

  if (sortKey) {
    requestUrl += `&sort=${sortKey},${order}`;
  }

  if (generalFilters) {
    requestUrl += `&filter=${generalFilters}`;
  }

  const response = await axios.get<PagedResponse<ResponseBankAccountDto>>(requestUrl);
  return response.data;
};

const find = async (): Promise<ResponseBankAccountDto[]> => {
  const response = await axios.get('public/bank-account/all');
  return response.data;
};

const create = async (bankAccount: CreateBankAccountDto): Promise<ResponseBankAccountDto> => {
  const response = await axios.post<ResponseBankAccountDto>('public/bank-account', bankAccount);
  return response.data;
};

const update = async (
  id?: number,
  bankAccount?: UpdateBankAccountDto
): Promise<ResponseBankAccountDto> => {
  const response = await axios.put<ResponseBankAccountDto>(
    `public/bank-account/${id}`,
    bankAccount
  );
  return response.data;
};

const remove = async (id: number) => {
  const { data, status } = await axios.delete<ResponseBankAccountDto>(`public/bank-account/${id}`);
  return { data, status };
};

export const bankAccount = {
  factory,
  find,
  findPaginated,
  create,
  update,
  remove
};
