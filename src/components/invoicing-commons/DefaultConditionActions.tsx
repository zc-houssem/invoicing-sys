import React from 'react';
import { Button } from '@/components/ui/button';
import { BrushCleaning, Newspaper } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DefaultConditionActionsProps {
  onInsert: () => void | Promise<void>;
  onClear: () => void;
}

export const DefaultConditionActions: React.FC<DefaultConditionActionsProps> = ({
  onInsert,
  onClear,
}) => {
  const { t } = useTranslation('invoicing');

  return (
    <div className="flex gap-2">
      <Button size="sm" type="button" onClick={onInsert}>
        <Newspaper className="mr-2" />
        <span>{t('form.insert_default_general_conditions', 'Insert Default General Conditions')}</span>
      </Button>
      <Button size="sm" type="button" variant="outline" onClick={onClear}>
        <BrushCleaning className="mr-2" />
        <span>{t('form.clear_general_conditions', 'Clear General Conditions')}</span>
      </Button>
    </div>
  );
};
