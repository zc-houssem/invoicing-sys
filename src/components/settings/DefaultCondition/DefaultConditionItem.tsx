import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Editor } from '@/components/shared/editor/blocks/editor-x/editor';
import { cn } from '@/lib/utils';
import { SerializedEditorState } from 'lexical';

interface DefaultConditionItemProps {
  className?: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
}

export const DefaultConditionItem: React.FC<DefaultConditionItemProps> = React.memo(
  ({ className, title, value, onChange, loading }) => {
    const editorState = React.useMemo(() => {
      if (!value) return undefined;
      try {
        return JSON.parse(value) as SerializedEditorState;
      } catch (e) {
        // It might be old plain text value, skip parse
        return undefined;
      }
    }, [value]);

    const handleSerializedChange = React.useCallback(
      (state: SerializedEditorState) => {
        onChange(JSON.stringify(state));
      },
      [onChange]
    );

    return (
      <Card className={cn('border-none', className)}>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Editor
            editorSerializedState={editorState}
            onSerializedChange={handleSerializedChange}
            disabled={loading}
          />
        </CardContent>
      </Card>
    );
  }
);

DefaultConditionItem.displayName = 'DefaultConditionItem';

