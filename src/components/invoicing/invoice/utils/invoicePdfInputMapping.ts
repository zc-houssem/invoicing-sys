

export const buildInvoicePdfInputMapping = (
  q: any,
  tCountry: (key: string) => string,
  systemEnterpriseLogoUrl: string,
  clientLogoUrl: string
): Record<string, string> => {
  return {
    // Flat legacy keys
    sequence: q?.sequence || '',
    object: q?.object || '',
    date: q?.date ? new Date(q.date).toLocaleDateString() : '',
    dueDate: q?.dueDate ? new Date(q.dueDate).toLocaleDateString() : '',
    status: q?.status || '',
    generalConditions: q?.generalConditions || '',
    notes: q?.notes || '',
    systemEnterpriseName: q?.systemEnterprise?.name || '',
    systemEnterprisePhone: q?.systemEnterprise?.phone || '',
    systemEnterpriseEmail: q?.systemEnterprise?.email || '',
    systemEnterpriseTaxId: q?.systemEnterprise?.taxId || '',
    systemEnterpriseAddress: q?.systemEnterprise?.invoicingAddress?.address || '',
    systemEnterpriseAddress2: q?.systemEnterprise?.invoicingAddress?.address2 || '',
    systemEnterpriseZipcode: q?.systemEnterprise?.invoicingAddress?.zipcode?.toString() || '',
    systemEnterpriseRegion: q?.systemEnterprise?.invoicingAddress?.region || '',
    systemEnterpriseCountry:
      tCountry(q?.systemEnterprise?.invoicingAddress?.country?.label || '') || '',
    enterpriseName: q?.enterprise?.name || '',
    enterpriseEmail: q?.enterprise?.email || q?.interlocutor?.email || '',
    enterprisePhone: q?.enterprise?.phone || '',
    enterpriseTaxId: q?.enterprise?.taxId || '',
    enterpriseAddress: q?.enterprise?.invoicingAddress?.address || '',
    enterpriseAddress2: q?.enterprise?.invoicingAddress?.address2 || '',
    enterpriseZipcode: q?.enterprise?.invoicingAddress?.zipcode?.toString() || '',
    enterpriseRegion: q?.enterprise?.invoicingAddress?.region || '',
    enterpriseCountry: tCountry(q?.enterprise?.invoicingAddress?.country?.label || '') || '',
    interlocutorName:
      `${q?.interlocutor?.firstName || ''} ${q?.interlocutor?.lastName || ''}`.trim(),
    interlocutorEmail: q?.interlocutor?.email || '',
    interlocutorPhone: q?.interlocutor?.phone || '',
    bankName: q?.bankAccount?.name || '',
    bankBic: q?.bankAccount?.bic || '',
    bankRib: q?.bankAccount?.rib || '',
    bankIban: q?.bankAccount?.iban || '',
    currencySymbol: q?.currency?.extras?.symbol || '',
    currencyName: q?.currency?.label || '',
    totalExcludingTaxes: q?.totalExcludingTaxes?.toString() || '',
    totalIncludingTaxes: q?.totalIncludingTaxes?.toString() || '',

    // Dotted structured keys
    'invoice.number': q?.sequence || '',
    'invoice.object': q?.object || '',
    'invoice.issueDate': q?.date ? new Date(q.date).toLocaleDateString() : '',
    'invoice.dueDate': q?.dueDate ? new Date(q.dueDate).toLocaleDateString() : '',
    'invoice.status': q?.status || '',
    'invoice.generalConditions': q?.generalConditions || '',
    'invoice.notes': q?.notes || '',

    // System Enterprise (Our Company)
    'enterprise.name': q?.systemEnterprise?.name || '',
    'enterprise.phone': q?.systemEnterprise?.phone || '',
    'enterprise.email': q?.systemEnterprise?.email || '',
    'enterprise.website': q?.systemEnterprise?.website || '',
    'enterprise.logo': systemEnterpriseLogoUrl,
    'enterprise.taxId': q?.systemEnterprise?.taxId || '',
    'enterprise.address': q?.systemEnterprise?.invoicingAddress?.address || '',
    'enterprise.address2': q?.systemEnterprise?.invoicingAddress?.address2 || '',
    'enterprise.zipcode': q?.systemEnterprise?.invoicingAddress?.zipcode?.toString() || '',
    'enterprise.region': q?.systemEnterprise?.invoicingAddress?.region || '',
    'enterprise.country': q?.systemEnterprise?.invoicingAddress?.country?.label || '',

    // Enterprise (Client)
    'client.name': q?.enterprise?.name || '',
    'client.email': q?.enterprise?.email || q?.interlocutor?.email || '',
    'client.website': q?.enterprise?.website || '',
    'client.logo': clientLogoUrl,
    'client.phone': q?.enterprise?.phone || '',
    'client.taxId': q?.enterprise?.taxId || '',
    'client.address': q?.enterprise?.invoicingAddress?.address || '',
    'client.address2': q?.enterprise?.invoicingAddress?.address2 || '',
    'client.zipcode': q?.enterprise?.invoicingAddress?.zipcode?.toString() || '',
    'client.region': q?.enterprise?.invoicingAddress?.region || '',
    'client.country': q?.enterprise?.invoicingAddress?.country?.label || '',

    // Interlocutor
    'client.contactName':
      `${q?.interlocutor?.firstName || ''} ${q?.interlocutor?.lastName || ''}`.trim(),
    'client.contactEmail': q?.interlocutor?.email || '',
    'client.contactPhone': q?.interlocutor?.phone || '',

    // Bank Account
    'bank.name': q?.bankAccount?.name || '',
    'bank.bic': q?.bankAccount?.bic || '',
    'bank.rib': q?.bankAccount?.rib || '',
    'bank.iban': q?.bankAccount?.iban || '',

    // Currency
    'currency.symbol': q?.currency?.extras?.symbol || '',
    'currency.name': q?.currency?.label || '',

    // Totals
    'invoice.subtotal': q?.totalExcludingTaxes?.toString() || '',
    'invoice.grandTotal': q?.totalIncludingTaxes?.toString() || ''
  };
};
