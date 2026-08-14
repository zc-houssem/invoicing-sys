import { Paginated, QueryParams } from '@/types';
import {
  CreateArticleFamilyDto,
  ResponseArticleFamilyDto,
  UpdateArticleFamilyDto
} from '@/types/core/article';
import axios from '../axios';

const findPaginated = async ({
  page = '1',
  limit = '5',
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<Paginated<ResponseArticleFamilyDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseArticleFamilyDto>>(`/article-family/list`, {
    params
  });

  return response.data;
};

const findAll = async ({
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<ResponseArticleFamilyDto[]> => {
  const params: { [key: string]: string | undefined } = {
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<ResponseArticleFamilyDto[]>(`/article-family/all`, {
    params
  });
  return response.data;
};

const findById = async (id: number): Promise<ResponseArticleFamilyDto> => {
  const response = await axios.get<ResponseArticleFamilyDto>(`/article-family/${id}`);
  return response.data;
};

const create = async (articleFamily: CreateArticleFamilyDto): Promise<ResponseArticleFamilyDto> => {
  const response = await axios.post('/article-family', articleFamily);
  return response.data;
};

const update = async (
  id?: number,
  articleFamily?: UpdateArticleFamilyDto
): Promise<ResponseArticleFamilyDto> => {
  const response = await axios.put(`/article-family/${id}`, articleFamily);
  return response.data;
};

const remove = async (id?: number): Promise<ResponseArticleFamilyDto> => {
  const response = await axios.delete(`/article-family/${id}`);
  return response.data;
};

export const articleFamily = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove
};
