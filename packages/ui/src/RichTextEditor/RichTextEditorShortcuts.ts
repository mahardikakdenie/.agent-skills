import type * as React from 'react';
import type { Editor } from '@tiptap/react';

interface HandleRichTextEditorShellKeyDownOptions {
  event: React.KeyboardEvent;
  editor: Editor | null;
  readonly?: boolean;
  onOpenLinkEditor: () => void;
}

function isModKeyShortcut(event: React.KeyboardEvent) {
  return (event.ctrlKey || event.metaKey) && !event.altKey;
}

function isShiftModKeyShortcut(event: React.KeyboardEvent) {
  return (event.ctrlKey || event.metaKey) && event.shiftKey && !event.altKey;
}

function isAltModKeyShortcut(event: React.KeyboardEvent) {
  return (event.ctrlKey || event.metaKey) && event.altKey && !event.shiftKey;
}

function matchesShortcutKey(event: React.KeyboardEvent, key: string, code: string) {
  return event.key.toLowerCase() === key || event.code === code;
}

export function handleRichTextEditorShellKeyDown({
  event,
  editor,
  readonly = false,
  onOpenLinkEditor,
}: HandleRichTextEditorShellKeyDownOptions) {
  if (!editor || readonly) {
    return;
  }

  const target = event.target instanceof HTMLElement ? event.target : null;

  if (target?.closest('[data-slot="rich-text-editor-link-editor"]')) {
    return;
  }
  if (isShiftModKeyShortcut(event) && matchesShortcutKey(event, 'z', 'KeyZ')) {
    event.preventDefault();
    return;
  }

  if (isAltModKeyShortcut(event) && matchesShortcutKey(event, '0', 'Digit0')) {
    event.preventDefault();
    editor.chain().focus().setParagraph().run();
    return;
  }

  if (isModKeyShortcut(event) && matchesShortcutKey(event, '\\', 'Backslash')) {
    event.preventDefault();
    editor.chain().focus().clearNodes().unsetAllMarks().run();
    return;
  }

  if (isModKeyShortcut(event) && matchesShortcutKey(event, 'k', 'KeyK')) {
    event.preventDefault();
    onOpenLinkEditor();
    return;
  }

  if (isModKeyShortcut(event) && matchesShortcutKey(event, 'y', 'KeyY')) {
    event.preventDefault();
    editor.commands.redo();
  }
}
