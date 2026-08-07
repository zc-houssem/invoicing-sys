import { BLANK_A4_PDF, cloneDeep } from '@pdfme/common';
import type { Template } from '@pdfme/common';

const TRANSPARENT_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const COMPACT_CELL_PADDING = { top: 2, right: 3, bottom: 2, left: 3 };

export const DEFAULT_ITEMS_TABLE_HEAD = ['Article', 'Qty', 'Unit Price', 'Total'];

export const DEFAULT_ITEMS_TABLE_SCHEMA = {
  showHead: true,
  repeatHead: true,
  head: DEFAULT_ITEMS_TABLE_HEAD,
  headWidthPercentages: [45, 15, 20, 20],
  tableStyles: { borderColor: '#000000', borderWidth: 0.1 },
  headStyles: {
    fontName: undefined,
    alignment: 'left' as const,
    verticalAlignment: 'middle' as const,
    fontSize: 9,
    lineHeight: 1,
    characterSpacing: 0,
    fontColor: '#000000',
    backgroundColor: '#e5e5e5',
    borderColor: '#888888',
    borderWidth: { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 },
    padding: COMPACT_CELL_PADDING
  },
  bodyStyles: {
    fontName: undefined,
    alignment: 'left' as const,
    verticalAlignment: 'middle' as const,
    fontSize: 9,
    lineHeight: 1,
    characterSpacing: 0,
    fontColor: '#000000',
    backgroundColor: '',
    alternateBackgroundColor: '#f5f5f5',
    borderColor: '#888888',
    borderWidth: { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 },
    padding: COMPACT_CELL_PADDING
  },
  columnStyles: {
    alignment: {
      0: 'left' as const,
      1: 'center' as const,
      2: 'right' as const,
      3: 'right' as const
    }
  }
};

type LineItemArticle = {
  quantity?: number;
  unitPrice?: number;
  discountType?: 'rate' | 'fixed';
  discountValue?: number;
  taxes?: Array<{ rate?: number; value?: number; type?: string }>;
  title?: string;
  article?: {
    title?: string;
    description?: string;
  };
};

const TITLE_HEADER_PATTERN =
  /title|article|item|description|nom|name|label|libell|d[ée]signation|produit|service|r[ée]f/i;
const QTY_HEADER_PATTERN = /qty|quantity|quantit/i;
const PRICE_HEADER_PATTERN = /price|unit|prix|pu|tarif/i;
const DISCOUNT_HEADER_PATTERN = /discount|remise|r[ée]duction/i;
const TAX_HEADER_PATTERN = /tax|tva|vat/i;
const TOTAL_HEADER_PATTERN = /total|amount|montant|subtotal|ht|ttc/i;

export const getArticleTitle = (article: LineItemArticle): string =>
  article.article?.title?.trim() ||
  article.title?.trim() ||
  article.article?.description?.trim() ||
  '';

const getLineTotal = (article: LineItemArticle): string => {
  const qty = article.quantity || 0;
  const price = article.unitPrice || 0;
  const discount =
    article.discountType === 'rate'
      ? (qty * price * (article.discountValue || 0)) / 100
      : article.discountValue || 0;

  return (qty * price - discount).toString();
};

const getDiscountValue = (article: LineItemArticle): string => {
  if (article.discountType === 'rate') {
    return `${article.discountValue || 0}%`;
  }

  return article.discountValue?.toString() || '0';
};

export const resolveArticleCellValue = (
  header: string,
  columnIndex: number,
  article: LineItemArticle
): string => {
  const normalizedHeader = header.toLowerCase();

  if (TITLE_HEADER_PATTERN.test(normalizedHeader) || columnIndex === 0) {
    return getArticleTitle(article);
  }
  if (QTY_HEADER_PATTERN.test(normalizedHeader)) {
    return article.quantity?.toString() || '0';
  }
  if (PRICE_HEADER_PATTERN.test(normalizedHeader)) {
    return article.unitPrice?.toString() || '0';
  }
  if (DISCOUNT_HEADER_PATTERN.test(normalizedHeader)) {
    return getDiscountValue(article);
  }
  if (TAX_HEADER_PATTERN.test(normalizedHeader)) {
    return (
      article.taxes
        ?.map((tax) => `${tax.rate ?? tax.value ?? 0}${tax.type === 'fixed' ? '' : '%'}`)
        .join(', ') || ''
    );
  }
  if (TOTAL_HEADER_PATTERN.test(normalizedHeader)) {
    return getLineTotal(article);
  }

  return '';
};

export const buildArticleTableRows = (
  field: { head?: string[] },
  articles: LineItemArticle[]
): string[][] => {
  const head = field.head?.length ? field.head : DEFAULT_ITEMS_TABLE_HEAD;

  if (articles.length === 0) {
    return [head.map(() => '')];
  }

  return articles.map((article) =>
    head.map((header, columnIndex) => resolveArticleCellValue(header, columnIndex, article))
  );
};

const mergeCompactStyles = (existing: Record<string, any> | undefined, compact: Record<string, any>) => ({
  ...compact,
  ...existing,
  padding: {
    ...compact.padding,
    ...(existing?.padding ?? {})
  },
  borderWidth: {
    ...compact.borderWidth,
    ...(existing?.borderWidth ?? {})
  },
  fontSize: existing?.fontSize ?? compact.fontSize,
  lineHeight: existing?.lineHeight ?? compact.lineHeight
});

export const normalizeTableSchema = (field: Record<string, any>): Record<string, any> => {
  if (field.type !== 'table') {
    return field;
  }

  const head = field.head?.length ? field.head : DEFAULT_ITEMS_TABLE_HEAD;

  return {
    ...DEFAULT_ITEMS_TABLE_SCHEMA,
    ...field,
    showHead: field.showHead !== false,
    repeatHead: field.repeatHead !== false,
    head,
    headWidthPercentages:
      field.headWidthPercentages?.length === head.length
        ? field.headWidthPercentages
        : DEFAULT_ITEMS_TABLE_SCHEMA.headWidthPercentages,
    headStyles: mergeCompactStyles(field.headStyles, DEFAULT_ITEMS_TABLE_SCHEMA.headStyles),
    bodyStyles: mergeCompactStyles(field.bodyStyles, DEFAULT_ITEMS_TABLE_SCHEMA.bodyStyles)
  };
};

/**
 * Sorts schemas so that elements above the table come first,
 * then the table itself, then elements below the table.
 * pdfme pushes content based on schema array order, not absolute Y position.
 */
const sortSchemasForDynamicLayout = (schemas: any[]): any[] => {
  const tables = schemas.filter((s) => s.type === 'table');
  if (tables.length === 0) return schemas;

  const tableTopY = Math.min(...tables.map((t) => t.position?.y ?? 0));

  const before = schemas.filter(
    (s) => s.type !== 'table' && (s.position?.y ?? 0) < tableTopY
  );
  const after = schemas.filter(
    (s) => s.type !== 'table' && (s.position?.y ?? 0) >= tableTopY
  );

  return [...before, ...tables, ...after];
};

export const normalizeSchemasForGeneration = (schemas: any[][] = [[]]): any[][] =>
  schemas.map((pageSchemas) =>
    Array.isArray(pageSchemas)
      ? sortSchemasForDynamicLayout(pageSchemas.map((field) => normalizeTableSchema(field)))
      : []
  );

export const prepareGenerationTemplate = (
  variables: Record<string, any> | undefined,
  letterheadBuffer?: ArrayBuffer
): { template: Template; letterheadBuffer?: ArrayBuffer } => {
  const stored = variables ? cloneDeep(variables) : { schemas: [[]] };

  return {
    template: {
      basePdf: BLANK_A4_PDF,
      schemas: normalizeSchemasForGeneration(stored.schemas),
      ...(stored.pdfmeVersion ? { pdfmeVersion: stored.pdfmeVersion } : {})
    },
    letterheadBuffer
  };
};

export const buildPdfInputs = ({
  schemas,
  inputMapping,
  articles
}: {
  schemas: any[][];
  inputMapping: Record<string, string>;
  articles: any[];
}): Record<string, any>[] =>
  schemas.map((pageSchemas) => {
    const pageInput: Record<string, any> = {};

    if (!Array.isArray(pageSchemas)) {
      return pageInput;
    }

    pageSchemas.forEach((field) => {
      if (!field?.name) {
        return;
      }

      if (field.type === 'table') {
        pageInput[field.name] = buildArticleTableRows(field, articles);
        return;
      }

      let content = field.content ?? '';

      Object.entries(inputMapping).forEach(([key, value]) => {
        const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        content = content.replace(new RegExp(`\\{${safeKey}\\}`, 'g'), value);
      });

      if (inputMapping[field.name] !== undefined && content === (field.content ?? '')) {
        pageInput[field.name] = inputMapping[field.name];
      } else {
        pageInput[field.name] = content;
      }

      if (field.type === 'image' && (!pageInput[field.name] || pageInput[field.name] === '')) {
        pageInput[field.name] = TRANSPARENT_PNG;
      }
    });

    return pageInput;
  });

export const mergeWithLetterhead = async (
  contentPdf: Uint8Array,
  letterheadBuffer: ArrayBuffer
): Promise<Uint8Array> => {
  const { PDFDocument } = await import('@pdfme/pdf-lib');

  const contentDoc = await PDFDocument.load(contentPdf);
  const letterheadDoc = await PDFDocument.load(letterheadBuffer);
  const letterheadPages = letterheadDoc.getPages();

  if (letterheadPages.length === 0) {
    return contentPdf;
  }

  const outputDoc = await PDFDocument.create();
  const contentPages = contentDoc.getPages();

  for (let index = 0; index < contentPages.length; index += 1) {
    const contentPage = contentPages[index];
    const { width, height } = contentPage.getSize();
    const outputPage = outputDoc.addPage([width, height]);

    const letterheadIndex = Math.min(index, letterheadPages.length - 1);
    const embeddedLetterhead = await outputDoc.embedPage(letterheadPages[letterheadIndex]);
    outputPage.drawPage(embeddedLetterhead, { x: 0, y: 0, width, height });

    const embeddedContent = await outputDoc.embedPage(contentPage);
    outputPage.drawPage(embeddedContent, { x: 0, y: 0, width, height });
  }

  return outputDoc.save();
};

export const generatePdfDocument = async ({
  templateVariables,
  letterheadBuffer,
  inputMapping,
  articles
}: {
  templateVariables?: Record<string, any>;
  letterheadBuffer?: ArrayBuffer;
  inputMapping: Record<string, string>;
  articles: any[];
}): Promise<Uint8Array> => {
  const { generate } = await import('@pdfme/generator');
  const { text, image, date, table, multiVariableText } = await import('@pdfme/schemas');
  const { loadFonts } = await import('./loadFonts');

  const fonts = await loadFonts();
  const { template } = prepareGenerationTemplate(templateVariables, letterheadBuffer);
  const inputs = buildPdfInputs({
    schemas: template.schemas as any[][],
    inputMapping,
    articles
  });

  const pdf = await generate({
    template,
    inputs: inputs.length > 0 ? inputs : [{}],
    plugins: { text, image, date, table, multiVariableText },
    options: { font: fonts }
  });

  if (letterheadBuffer) {
    return mergeWithLetterhead(pdf, letterheadBuffer);
  }

  return pdf;
};

export const openPdfInNewTab = (pdf: Uint8Array) => {
  const blob = new Blob([pdf as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 30000);
};
