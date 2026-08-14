import { DefaultCondition, UpdateDefaultConditionDto } from '@/types';
import axios from './axios';

const find = async (enterpriseId?: number): Promise<DefaultCondition[]> => {
  if (!enterpriseId) return [];
  const { data } = await axios.get(`/default-conditions/${enterpriseId}`);
  return data;
};

const update = async (
  enterpriseId: number,
  updateDto: UpdateDefaultConditionDto | UpdateDefaultConditionDto[]
): Promise<DefaultCondition[]> => {
  const payload = {
    conditions: Array.isArray(updateDto) ? updateDto : [updateDto]
  };
  const { data } = await axios.put(`/default-conditions/${enterpriseId}/batch`, payload);
  return data;
};

export const defaultCondition = {
  find,
  update
};
