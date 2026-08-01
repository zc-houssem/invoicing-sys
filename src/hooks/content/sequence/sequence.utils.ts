import { format } from 'date-fns';
import { DateFormat, Sequences } from '@/types/sequence';

export interface SequenceParams {
  type?: Sequences;
  prefix: string;
  dateFormat?: DateFormat | string;
  nextValue: number;
  padding: number;
}

/**
 * Optimized Sequence formatting that exactly mirrors the backend's formatSequence logic.
 */
export const formatSequence = (sequence: SequenceParams): string => {
  const { prefix, dateFormat, nextValue, padding } = sequence;

  let datePart = '';
  if (dateFormat) {
    datePart = format(new Date(), dateFormat) + '-';
  }

  const numberPart = nextValue.toString().padStart(padding, '0');
  return `${prefix}-${datePart}${numberPart}`;
};

/**
 * Note on Parsing (fromStringToSequentialObject):
 *
 * Parsing a raw sequence string (e.g. "INV-2023-001") back into a structured object
 * is highly brittle because prefixes can contain dashes, and date formats can vary drastically.
 *
 * BETTER SOLUTION:
 * We should completely avoid parsing flat sequence strings on the frontend.
 * Sequence state should strictly be maintained and passed around as structured objects
 * (prefix, dateFormat, nextValue, padding). The frontend should only use this utility
 * for one-way formatting (displaying the preview), and rely entirely on the backend
 * or the structured DTO for edits and logic.
 */
