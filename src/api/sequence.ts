import { ResponseSequenceDto, Sequences, UpdateSequentialDto } from '@/types/sequence';
import axios from './axios';

const findByEnterprise = async (enterpriseId: number): Promise<ResponseSequenceDto[]> => {
  const { data } = await axios.get(`/sequences/${enterpriseId}`);
  return data;
};

const getNextSequencePreview = async (
  enterpriseId: number,
  type: Sequences
): Promise<{ sequence: string }> => {
  const { data } = await axios.get(`/sequences/${enterpriseId}/${type}/next`);
  return data;
};

const updateSequence = async (
  enterpriseId: number,
  type: Sequences,
  updateDto: UpdateSequentialDto
): Promise<ResponseSequenceDto> => {
  const { data } = await axios.put(`/sequences/${enterpriseId}/${type}`, updateDto);
  return data;
};

export const sequence = {
  findByEnterprise,
  getNextSequencePreview,
  updateSequence
};
