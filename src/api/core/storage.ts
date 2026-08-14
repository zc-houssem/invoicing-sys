import { Paginated, QueryParams, ServerResponse, Upload } from '@/types';
import axios from '../axios';

const findPaginated = async ({
  page = '1',
  limit = '5',
  sort,
  search = '',
  filter = '',
  join = ''
}: QueryParams): Promise<Paginated<Upload>> => {
  const params: { [key: string]: string | undefined } = {
    page,
    limit,
    sort
  };

  if (search) params.search = search;
  if (filter) params.filter = filter;
  if (join) params.join = join;

  const response = await axios.get<Paginated<Upload>>(`/storage/list`, {
    params
  });

  return response.data;
};

const uploadFiles = async (
  files: File[],
  onProgress?: (percent: number) => void,
  temporary: boolean = true
): Promise<Upload[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await axios.post<Upload[]>(
    temporary ? '/storage/multiple/temporary' : '/storage/multiple',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      }
    }
  );
  return response.data;
};

const downloadFile = async (slug: string, filename?: string) => {
  try {
    const response = await axios.get(`/storage/download/slug/${slug}`, {
      responseType: 'blob'
    });

    const contentDisposition = response.headers['content-disposition'];
    let finalFilename = filename || slug;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch.length === 2) {
        finalFilename = filenameMatch[1];
      }
    }

    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
  }
};

const downloadFileById = async (id: number, filename?: string) => {
  try {
    const response = await axios.get(`/storage/download/id/${id}`, {
      responseType: 'blob'
    });

    const contentDisposition = response.headers['content-disposition'];
    let finalFilename = filename || `file_${id}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch.length === 2) {
        finalFilename = filenameMatch[1];
      }
    }

    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
  }
};

const openFile = async (slug: string, fallbackMimeType?: string) => {
  try {
    const response = await axios.get(`/storage/download/slug/${slug}`, {
      responseType: 'blob'
    });

    const contentType = response.headers['content-type'] || response.data?.type || fallbackMimeType || 'application/pdf';
    const blob = new Blob([response.data], { type: contentType });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (error) {
    console.error('Open failed:', error);
  }
};

const openFileById = async (id: number, fallbackMimeType?: string) => {
  try {
    const response = await axios.get(`/storage/download/id/${id}`, {
      responseType: 'blob'
    });

    const contentType = response.headers['content-type'] || response.data?.type || fallbackMimeType || 'application/pdf';
    const blob = new Blob([response.data], { type: contentType });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (error) {
    console.error('Open failed:', error);
  }
};

const getUploadBySlug = async (slug: string) => {
  const url = `/storage/view/slug/${slug}`;
  const { data } = await axios.get(url, { responseType: 'blob' });
  return URL.createObjectURL(data);
};

const getUploadById = async (id: number) => {
  const url = `/storage/view/id/${id}`;
  console.log(`[getUploadById] fetching ${url}`);
  try {
    const { data } = await axios.get(url, { responseType: 'blob' });
    return URL.createObjectURL(data);
  } catch (error: any) {
    console.warn(`[getUploadById] failed to fetch ${url}`, error.response?.data);
    return '';
  }
};

/**
 * Fetches an upload by ID and returns it as a base64 data URI string.
 * This is required for PDF image elements which cannot resolve blob: URLs.
 */
const getUploadAsBase64ById = async (id: number): Promise<string> => {
  const url = `/storage/view/id/${id}`;
  try {
    const { data } = await axios.get(url, { responseType: 'blob' });
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(data);
    });
  } catch (error: any) {
    console.warn(`[getUploadAsBase64ById] failed to fetch ${url}`, error.response?.data);
    return '';
  }
};

const getFileById = async (id: number): Promise<File> => {
  const metadata = await axios.get<Upload>(`/storage/${id}`);
  const { data } = await axios.get(`/storage/view/id/${id}`, { responseType: 'blob' });
  const file = new File([data], metadata.data.filename || 'unknown', {
    type: metadata.data.mimetype || 'application/octet-stream'
  });
  // console.log('Fetched file:', file);
  return file;
};

const deleteFile = async (slug: string): Promise<ServerResponse<Upload>> => {
  const response = await axios.delete(`/storage/${slug}`);
  return response.data;
};

export const storage = {
  findPaginated,
  uploadFiles,
  downloadFile,
  downloadFileById,
  deleteFile,
  openFile,
  openFileById,
  getUploadBySlug,
  getUploadById,
  getUploadAsBase64ById,
  getFileById
};
