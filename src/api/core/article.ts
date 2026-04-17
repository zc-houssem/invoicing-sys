import { Paginated, QueryParams } from '@/types';
import { CreateArticleDto, ResponseArticleDto, UpdateArticleDto } from '@/types/core/article';
import axios from '../axios';

const findPaginated = async ({
  page = '1',
  limit = '5',
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<Paginated<ResponseArticleDto>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<ResponseArticleDto>>(`/article-family/list`, {
    params
  });

  return response.data;
};

const findAll = async ({
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<ResponseArticleDto[]> => {
  const params: { [key: string]: string | undefined } = {
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<ResponseArticleDto[]>(`/article-family/all`, {
    params
  });
  return response.data;
};

const findById = async (id: number): Promise<ResponseArticleDto> => {
  const response = await axios.get<ResponseArticleDto>(`/article-family/${id}`);
  return response.data;
};

const create = async (article: CreateArticleDto): Promise<ResponseArticleDto> => {
  const response = await axios.post('/article-family', article);
  return response.data;
};

const update = async (id?: number, article?: UpdateArticleDto): Promise<ResponseArticleDto> => {
  const response = await axios.put(`/article-family/${id}`, article);
  return response.data;
};

const remove = async (id?: number): Promise<ResponseArticleDto> => {
  const response = await axios.delete(`/article-family/${id}`);
  return response.data;
};

export const article = {
  findPaginated,
  findAll,
  findById,
  create,
  update,
  remove
};
