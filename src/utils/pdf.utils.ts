export const openPdfBlob = (blob: Blob) => {
  const pdfBlob = new Blob([blob], { type: 'application/pdf' });
  const url = URL.createObjectURL(pdfBlob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 30000);
};

export const createPdfBlobUrl = (blob: Blob): string => {
  const pdfBlob = new Blob([blob], { type: 'application/pdf' });
  return URL.createObjectURL(pdfBlob);
};

export const revokePdfBlobUrl = (url: string) => URL.revokeObjectURL(url);
