import {
  ResponseSequenceDto,
  Sequences,
  UpdateSequentialDto,
  BatchUpdateSequenceDto
} from '@/types/sequence';
import axios from './axios';

const findByEnterprise = async (enterpriseId: number): Promise<ResponseSequenceDto[]> => {
  const { data } = await axios.get(`/sequence/${enterpriseId}`);
  return data;
};

const getNextSequencePreview = async (
  enterpriseId: number,
  type: Sequences
): Promise<{ sequence: string }> => {
  const { data } = await axios.get(`/sequence/${enterpriseId}/${type}/next`);
  return data;
};

const updateSequence = async (
  enterpriseId: number,
  type: Sequences,
  updateDto: UpdateSequentialDto
): Promise<ResponseSequenceDto> => {
  const { data } = await axios.put(`/sequence/${enterpriseId}/${type}`, updateDto);
  return data;
};

const updateSequenceBatch = async (
  enterpriseId: number,
  updateDto: BatchUpdateSequenceDto
): Promise<ResponseSequenceDto[]> => {
  const { data } = await axios.put(`/sequence/${enterpriseId}/batch`, updateDto);
  return data;
};

export const sequence = {
  findByEnterprise,
  getNextSequencePreview,
  updateSequence,
  updateSequenceBatch
};
