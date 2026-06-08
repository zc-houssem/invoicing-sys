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

/**
 * Validates that a serialized editor state has the required structure
 * for Lexical to initialize without errors.
 */
function isValidSerializedState(
  state: SerializedEditorState | undefined | null
): state is SerializedEditorState {
  return (
    !!state &&
    typeof state === 'object' &&
    !!state.root &&
    typeof state.root.type === 'string' &&
    Array.isArray(state.root.children)
  );
}

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
  const validSerializedState = isValidSerializedState(editorSerializedState)
    ? editorSerializedState
    : undefined;

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
          ...(validSerializedState ? { editorState: JSON.stringify(validSerializedState) } : {})
        }}>
        <TooltipProvider>
          <EditorUpdateHandler
            editorSerializedState={validSerializedState}
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
    if (isValidSerializedState(editorSerializedState)) {
      try {
        const state = editor.parseEditorState(JSON.stringify(editorSerializedState));
        if (state && !state.isEmpty()) {
          editor.setEditorState(state);
        }
      } catch (error) {
        console.error('Failed to parse editor state:', error);
      }
    }
  }, [editor]);

  return null;
}
