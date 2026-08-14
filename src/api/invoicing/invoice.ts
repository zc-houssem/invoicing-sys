import {
  CreateInvoiceDto,
  ResponseInvoiceDto,
  ResponseInvoiceWorkflowDto,
  UpdateInvoiceDto
} from '@/types/core/invoicing/invoice';
import axios from '../axios';
import { Paginated, QueryParams } from '@/types/response';

export interface PdfPreviewOptions {
  includeHeader?: boolean;
  includeFooter?: boolean;
  headerId?: string;
  footerId?: string;
}

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

  const response = await axios.get<Paginated<ResponseInvoiceDto>>(`/invoice/list`, {
    params
  });

  return response.data;
};

const findAll = async (params?: QueryParams): Promise<ResponseInvoiceDto[]> => {
  const queryParams: { [key: string]: string | undefined } = {};
  if (params?.sort) queryParams.sort = params.sort;
  if (params?.search) queryParams.search = params.search;
  if (params?.filter) queryParams.filter = params.filter;
  if (params?.join) queryParams.join = params.join;

  const response = await axios.get<ResponseInvoiceDto[]>(`/invoice/all`, {
    params: queryParams
  });
  return response.data;
};

const findById = async (id: number, join?: string): Promise<ResponseInvoiceDto> => {
  const response = await axios.get<ResponseInvoiceDto>(`/invoice/${id}`, { params: { join } });
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
  const response = await axios.post('/invoice', invoice);
  return response.data;
};

const update = async (
  id?: number,
  invoice?: UpdateInvoiceDto
): Promise<ResponseInvoiceDto> => {
  const response = await axios.put(`/invoice/${id}`, invoice);
  return response.data;
};

const next = async (id: number, event: string): Promise<ResponseInvoiceWorkflowDto> => {
  const response = await axios.post(`/invoice-workflow/${id}/next`, { event });
  return response.data;
};

const remove = async (id?: number): Promise<ResponseInvoiceDto> => {
  const response = await axios.delete(`/invoice/${id}`);
  return response.data;
};

const fromQuotation = async (id: number): Promise<ResponseInvoiceDto> => {
  const response = await axios.post(`/invoice/from-quotation/${id}`);
  return response.data;
};

const duplicate = async (id: number): Promise<ResponseInvoiceDto> => {
  const response = await axios.post(`/invoice/duplicate/${id}`);
  return response.data;
};

const downloadPdf = async (
  id: number, 
  templateId?: string,
  options?: { includeHeader?: boolean; includeFooter?: boolean; headerId?: string; footerId?: string }
): Promise<Blob> => {
  const response = await axios.get(`/invoice/${id}/pdf`, {
    responseType: 'blob',
    params: {
      ...(templateId ? { templateId } : {}),
      ...options
    }
  });
  return response.data;
};

const previewPdf = async (
  templateId: string,
  id: number,
  options?: PdfPreviewOptions
): Promise<Blob> => {
  const response = await axios.get(
    `/invoice/${id}/pdf/${templateId}/preview`,
    { 
      responseType: 'arraybuffer',
      headers: { Accept: 'application/pdf' },
      params: options
    }
  );
  return new Blob([response.data], { type: 'application/pdf' });
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
  downloadPdf,
  previewPdf,
  workflow: {
    findById: findWorkflowById,
    next
  }
};
