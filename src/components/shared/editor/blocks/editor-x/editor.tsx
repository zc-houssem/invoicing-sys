'use client';

import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, SerializedEditorState } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { editorTheme } from '@/components/shared/editor/themes/editor-theme';
import { TooltipProvider } from '@/components/ui/tooltip';

import { nodes } from './nodes';
import { Plugins } from './plugins';
import React from 'react';

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  disabled
}: {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  disabled?: boolean;
}) {
  const editorConfig: InitialConfigType = {
    namespace: 'Editor',
    theme: editorTheme,
    editable: !disabled,
    nodes,
    onError: (error: Error) => {
      console.error(error);
    }
  };

  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState ? { editorState: JSON.stringify(editorSerializedState) } : {})
        }}>
        <TooltipProvider>
          <EditorUpdateHandler
            editorSerializedState={editorSerializedState}
            onSerializedChange={onSerializedChange}
          />
          <Plugins />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState);
              onSerializedChange?.(editorState.toJSON());
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}

function EditorUpdateHandler({
  editorSerializedState,
  onSerializedChange
}: {
  editorSerializedState?: SerializedEditorState;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
}) {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    if (editorSerializedState) {
      editor.update(() => {
        const state = editor.parseEditorState(JSON.stringify(editorSerializedState));
        editor.setEditorState(state);
      });
    }
  }, [editor]);

  return null;
}
