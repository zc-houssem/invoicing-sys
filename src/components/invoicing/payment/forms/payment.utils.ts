/**
 * Calculates the already paid amount for an invoice, excluding payments that belong to the current payment being updated.
 *
 * @param invoice The invoice object (ResponseInvoiceDto)
 * @param currentPaymentId The ID of the current payment being updated (if any)
 * @param initialInvoices Initial invoice entries from store response
 * @param currentInvoiceId ID of the invoice
 * @returns Total amount paid on this invoice prior to/excluding the current payment
 */
export const getInvoiceAlreadyPaid = (
  invoice: any,
  currentPaymentId?: number,
  initialInvoices?: any[],
  currentInvoiceId?: number
): number => {
  if (!invoice) return 0;

  const paymentsArr = invoice.payments;
  if (Array.isArray(paymentsArr) && paymentsArr.length > 0) {
    return paymentsArr.reduce((acc: number, p: any) => {
      if (
        currentPaymentId &&
        (p.paymentId === currentPaymentId || p.payment?.id === currentPaymentId || p.id === currentPaymentId)
      ) {
        return acc;
      }
      return acc + Number(p.amount || 0);
    }, 0);
  }

  let rawPaid = typeof invoice.amountPaid === 'number' ? invoice.amountPaid : 0;
  if (currentPaymentId && initialInvoices && currentInvoiceId) {
    const initialEntry = initialInvoices.find((i: any) => (i.invoiceId || i.invoice?.id) === currentInvoiceId);
    if (initialEntry) {
      rawPaid = Math.max(0, rawPaid - Number(initialEntry.amount || 0));
    }
  }
  return rawPaid;
};
