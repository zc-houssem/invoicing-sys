import {
  CreateQuotationDto,
  ResponseQuotationDto,
  ResponseQuotationWorkflowDto,
  UpdateQuotationDto
} from '@/types';
import axios from '../axios';
import { Paginated, QueryParams } from '@/types/response';

const findPaginated = async ({
  page = '1',
  limit = '5',
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<Paginated<ResponseQuotationDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseQuotationDto>>(`/quotation/list`, {
    params
  });

  return response.data;
};

const findAll = async (): Promise<ResponseQuotationDto[]> => {
  const response = await axios.get<ResponseQuotationDto[]>(`/quotation/all`);
  return response.data;
};

const findById = async (id: number, join?: string): Promise<ResponseQuotationDto> => {
  const response = await axios.get<ResponseQuotationDto>(`/quotation/${id}`, { params: { join } });
  return response.data;
};

const findWorkflowById = async (
  id: number,
  join?: string
): Promise<ResponseQuotationWorkflowDto> => {
  const response = await axios.get<ResponseQuotationWorkflowDto>(`/quotation-workflow/${id}`, {
    params: { join }
  });
  return response.data;
};

const create = async (quotation: CreateQuotationDto): Promise<ResponseQuotationDto> => {
  const response = await axios.post('/quotation', quotation);
  return response.data;
};

const update = async (
  id?: number,
  quotation?: UpdateQuotationDto
): Promise<ResponseQuotationDto> => {
  const response = await axios.put(`/quotation/${id}`, quotation);
  return response.data;
};

const next = async (id: number, event: string): Promise<ResponseQuotationWorkflowDto> => {
  const response = await axios.post(`/quotation-workflow/${id}/next`, { event });
  return response.data;
};

const remove = async (id?: number): Promise<ResponseQuotationDto> => {
  const response = await axios.delete(`/quotation/${id}`);
  return response.data;
};

const duplicate = async (id: number): Promise<ResponseQuotationDto> => {
  const response = await axios.post(`/quotation/duplicate/${id}`);
  return response.data;
};

export const quotation = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove,
  duplicate,
  workflow: {
    findById: findWorkflowById,
    next
  }
};
