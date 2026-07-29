'use client';

import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, SerializedEditorState } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { editorTheme } from '@/components/shared/editor/themes/editor-theme';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useFullScreen } from '@/hooks/useFullScreen';
import { cn } from '@/lib/utils';

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
  disabled,
  maxLength,
  autoFocus = false,
  namespace
}: {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  disabled?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  namespace?: string;
}) {
  const validSerializedState = isValidSerializedState(editorSerializedState)
    ? editorSerializedState
    : undefined;

  const id = React.useId();

  const editorConfig: InitialConfigType = {
    namespace: namespace || `Editor-${id}`,
    theme: editorTheme,
    editable: !disabled,
    nodes,
    onError: (error: Error) => {
      console.error(error);
    }
  };

  const { isFullscreen, toggle: toggleFullscreen } = useFullScreen();

  React.useEffect(() => {
    const hamburgerButton = document.getElementById('nav-toggler');
    if (hamburgerButton) hamburgerButton.style.display = isFullscreen ? 'none' : '';
  }, [isFullscreen]);

  return (
    <div
      className={cn(
        'bg-background overflow-hidden rounded-lg border shadow',
        isFullscreen &&
          'fixed inset-0 z-50 flex flex-col rounded-none p-4 animate-in fade-in zoom-in-95'
      )}>
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
          <div className={cn(isFullscreen && 'flex min-h-0 flex-1 flex-col')}>
            <Plugins
              maxLength={maxLength}
              autoFocus={autoFocus}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </div>

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
        const currentEditorState = editor.getEditorState();
        const incomingStateStr = JSON.stringify(editorSerializedState);
        const currentStateStr = JSON.stringify(currentEditorState.toJSON());

        if (incomingStateStr !== currentStateStr) {
          const state = editor.parseEditorState(incomingStateStr);
          if (state) {
            editor.setEditorState(state);
          }
        }
      } catch (error) {
        console.error('Failed to parse editor state:', error);
      }
    } else if (editorSerializedState === undefined || editorSerializedState === null) {
      const emptyStateStr = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
      const currentEditorState = editor.getEditorState();
      const currentStateStr = JSON.stringify(currentEditorState.toJSON());

      if (currentStateStr !== emptyStateStr) {
        const state = editor.parseEditorState(emptyStateStr);
        editor.setEditorState(state);
      }
    }
  }, [editor, editorSerializedState]);

  return null;
}
