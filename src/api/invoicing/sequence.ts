import axios from '../axios';

export const sequence = {
  getPreview: async (type: string) => {
    const res = await axios.get<{ sequence: string }>(`/sequence/${type}/next`);
    return res.data.sequence;
  }
};
