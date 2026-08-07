import { api } from '@/api';
import { getValidId } from '@/utils/number.utils';

const TRANSPARENT_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

/**
 * Loads a logo from the storage API as a base64 data URI.
 * Falls back to a 1x1 transparent PNG if loading fails or no logo ID is found.
 *
 * @param entity - An object with `logoId` (or `logo`) property
 * @returns A base64 data URI string suitable for pdfme image schemas
 */
export const loadLogoAsBase64 = async (entity: any): Promise<string> => {
  const logoId = getValidId(entity?.logoId) || getValidId(entity?.logo);
  if (!logoId) return TRANSPARENT_PNG;

  try {
    const base64 = await api.core.storage.getUploadAsBase64ById(logoId);
    return base64 || TRANSPARENT_PNG;
  } catch (e) {
    console.warn('Failed to load logo as base64', e);
    return TRANSPARENT_PNG;
  }
};
