import axios from './axios';
import { CreateTaxDto, PagedTax, Tax, ToastValidation, UpdateTaxDto, QueryParams } from '@/types';

const findPaginated = async ({
  page,
  limit,
  sort,
  filter,
  join = 'currency'
}: QueryParams): Promise<PagedTax> => {
  const response = await axios.get<PagedTax>(`public/tax/list`, {
    params: {
      page,
      limit,
      sort,
      filter,
      join
    }
  });
  return response.data;
};

const find = async (): Promise<Tax[]> => {
  const response = await axios.get<Tax[]>(`public/tax/all`);
  return response.data;
};

const create = async (tax: CreateTaxDto): Promise<Tax> => {
  const response = await axios.post<Tax>('public/tax', tax);
  return response.data;
};

const update = async (tax: UpdateTaxDto): Promise<Tax> => {
  const response = await axios.put<Tax>(`public/tax/${tax.id}`, tax);
  return response.data;
};

const remove = async (id?: number) => {
  const { data, status } = await axios.delete<Tax>(`public/tax/${id}`);
  return { data, status };
};

export const tax = { findPaginated, find, create, update, remove };
