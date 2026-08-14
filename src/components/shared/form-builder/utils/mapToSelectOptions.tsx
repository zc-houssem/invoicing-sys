import { SelectOption } from '../types';

interface mapToSelectOptionsProps {
  data: any;
  labelKey: string;
  valueKey: string;
  labelKeyTransformer?: (label: string, entity: any) => string;
  valueKeyTransformer?: (value: string, entity: any) => string;
}

export const mapToSelectOptions = ({
  data,
  labelKey,
  valueKey,
  labelKeyTransformer = (label: string, _entity: any) => label,
  valueKeyTransformer = (value: string, _entity: any) => value
}: mapToSelectOptionsProps): SelectOption[] => {
  return data.map((item: any) => ({
    label: labelKeyTransformer?.(item?.[labelKey], item),
    value: valueKeyTransformer?.(item?.[valueKey], item).toString()
  }));
};
