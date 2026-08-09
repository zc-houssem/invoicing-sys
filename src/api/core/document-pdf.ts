import axios from '../axios';

const previewWithQuotation = async (
  templateId: string,
  quotationId: number
): Promise<Blob> => {
  const response = await axios.get(
    `/document-pdf/template/${templateId}/preview/quotation/${quotationId}`,
    { 
      responseType: 'arraybuffer',
      headers: { Accept: 'application/pdf' }
    }
  );
  return new Blob([response.data], { type: 'application/pdf' });
};

const previewWithInvoice = async (templateId: string, invoiceId: number): Promise<Blob> => {
  const response = await axios.get(
    `/document-pdf/template/${templateId}/preview/invoice/${invoiceId}`,
    { 
      responseType: 'arraybuffer',
      headers: { Accept: 'application/pdf' }
    }
  );
  return new Blob([response.data], { type: 'application/pdf' });
};

export const documentPdf = {
  previewWithQuotation,
  previewWithInvoice
};
