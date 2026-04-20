import {
  CreateBankAccountDto,
  CreateTaxRateDto,
  Paginated,
  QueryParams,
  ResponseBankAccountDto,
  ResponseTaxRateDto,
  UpdateBankAccountDto,
  UpdateTaxRateDto
} from '@/types';
import axios from '../axios';

const findPaginated = async ({
  page = '1',
  limit = '5',
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<Paginated<ResponseTaxRateDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseTaxRateDto>>(`/tax-rate/list`, {
    params
  });

  return response.data;
};

const findAll = async ({
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<ResponseTaxRateDto[]> => {
  const params: { [key: string]: string | undefined } = {
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<ResponseTaxRateDto[]>(`/tax-rate/all`, {
    params
  });
  return response.data;
};

const findById = async (id: number): Promise<ResponseTaxRateDto> => {
  const response = await axios.get<ResponseTaxRateDto>(`/tax-rate/${id}`);
  return response.data;
};

const create = async (taxRate: CreateTaxRateDto): Promise<ResponseTaxRateDto> => {
  const response = await axios.post('/tax-rate', taxRate);
  return response.data;
};

const update = async (id?: number, taxRate?: UpdateTaxRateDto): Promise<ResponseTaxRateDto> => {
  const response = await axios.put(`/tax-rate/${id}`, taxRate);
  return response.data;
};

const remove = async (id?: number): Promise<ResponseTaxRateDto> => {
  const response = await axios.delete(`/tax-rate/${id}`);
  return response.data;
};

export const taxRate = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove
};
