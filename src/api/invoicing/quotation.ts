import { CreateQuotationDto, ResponseQuotationDto, UpdateQuotationDto } from '@/types';
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

  const response = await axios.get<Paginated<ResponseQuotationDto>>(`/_quotation/list`, {
    params
  });

  return response.data;
};

const findAll = async (): Promise<ResponseQuotationDto[]> => {
  const response = await axios.get<ResponseQuotationDto[]>(`/_quotation/all`);
  return response.data;
};

const findById = async (id: string): Promise<ResponseQuotationDto> => {
  const response = await axios.get<ResponseQuotationDto>(`/_quotation/${id}`);
  return response.data;
};

const create = async (quotation: CreateQuotationDto): Promise<ResponseQuotationDto> => {
  const response = await axios.post('/_quotation', quotation);
  return response.data;
};

const update = async (
  id?: string,
  quotation?: UpdateQuotationDto
): Promise<ResponseQuotationDto> => {
  const response = await axios.put(`/_quotation/${id}`, quotation);
  return response.data;
};

const remove = async (id?: string): Promise<ResponseQuotationDto> => {
  const response = await axios.delete(`/_quotation/${id}`);
  return response.data;
};

export const quotation = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove
};
