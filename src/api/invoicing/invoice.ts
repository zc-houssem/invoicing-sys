import {
  CreateInvoiceDto,
  ResponseInvoiceDto,
  ResponseInvoiceWorkflowDto,
  UpdateInvoiceDto
} from '@/types/core/invoicing/invoice';
import axios from '../axios';
import { Paginated, QueryParams } from '@/types/response';

const findPaginated = async ({
  page = '1',
  limit = '5',
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<Paginated<ResponseInvoiceDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseInvoiceDto>>(`/_invoice/list`, {
    params
  });

  return response.data;
};

const findAll = async (): Promise<ResponseInvoiceDto[]> => {
  const response = await axios.get<ResponseInvoiceDto[]>(`/_invoice/all`);
  return response.data;
};

const findById = async (id: number, join?: string): Promise<ResponseInvoiceDto> => {
  const response = await axios.get<ResponseInvoiceDto>(`/_invoice/${id}`, { params: { join } });
  return response.data;
};

const findWorkflowById = async (
  id: number,
  join?: string
): Promise<ResponseInvoiceWorkflowDto> => {
  const response = await axios.get<ResponseInvoiceWorkflowDto>(`/invoice-workflow/${id}`, {
    params: { join }
  });
  return response.data;
};

const create = async (invoice: CreateInvoiceDto): Promise<ResponseInvoiceDto> => {
  const response = await axios.post('/_invoice', invoice);
  return response.data;
};

const update = async (
  id?: number,
  invoice?: UpdateInvoiceDto
): Promise<ResponseInvoiceDto> => {
  const response = await axios.put(`/_invoice/${id}`, invoice);
  return response.data;
};

const next = async (id: number, event: string): Promise<ResponseInvoiceWorkflowDto> => {
  const response = await axios.post(`/invoice-workflow/${id}/next`, { event });
  return response.data;
};

const remove = async (id?: number): Promise<ResponseInvoiceDto> => {
  const response = await axios.delete(`/_invoice/${id}`);
  return response.data;
};

const fromQuotation = async (id: number): Promise<ResponseInvoiceDto> => {
  const response = await axios.post(`/_invoice/from-quotation/${id}`);
  return response.data;
};

const duplicate = async (id: number): Promise<ResponseInvoiceDto> => {
  const response = await axios.post(`/_invoice/duplicate/${id}`);
  return response.data;
};

export const invoice = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove,
  fromQuotation,
  duplicate,
  workflow: {
    findById: findWorkflowById,
    next
  }
};
