import type { Editor } from '@tiptap/react';
import type { ComponentType } from 'react';
import {
  Bold,
  Code,
  Code2,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from 'lucide-react';

import type { RichTextEditorToolbarAction } from './RichTextEditor.types';

export interface RichTextEditorToolbarActionDefinition {
  label: string;
  description: string;
  shortcuts?: readonly string[];
  icon: ComponentType<{ className?: string }>;
}

interface RichTextEditorToolbarCommandActionDefinition extends RichTextEditorToolbarActionDefinition {
  kind: 'command';
  execute: (editor: Editor) => void;
}

interface RichTextEditorToolbarWorkflowActionDefinition extends RichTextEditorToolbarActionDefinition {
  kind: 'workflow';
}

export type RichTextEditorToolbarActionConfig =
  | RichTextEditorToolbarCommandActionDefinition
  | RichTextEditorToolbarWorkflowActionDefinition;

const richTextEditorShortcutLabels = {
  paragraph: 'Mod+Alt+0',
  heading1: 'Mod+Alt+1',
  heading2: 'Mod+Alt+2',
  heading3: 'Mod+Alt+3',
  bold: 'Mod+B',
  italic: 'Mod+I',
  strike: 'Mod+Shift+S',
  inlineCode: 'Mod+E',
  bulletList: 'Mod+Shift+8',
  orderedList: 'Mod+Shift+7',
  blockquote: 'Mod+Shift+B',
  codeBlock: 'Mod+Alt+C',
  link: 'Mod+K',
  clearFormatting: 'Mod+\\',
  undo: 'Mod+Z',
  redo: 'Mod+Y',
} as const;

export const richTextEditorToolbarActionDefinitions: Record<
  RichTextEditorToolbarAction,
  RichTextEditorToolbarActionConfig
> = {
  paragraph: {
    kind: 'command',
    label: 'Body text',
    description: 'Reset the current block to standard body copy.',
    shortcuts: [richTextEditorShortcutLabels.paragraph],
    icon: Pilcrow,
    execute: (editor) => {
      editor.chain().focus().setParagraph().run();
    },
  },
  heading1: {
    kind: 'command',
    label: 'Heading 1',
    description: 'Promote the current block into a primary section heading.',
    shortcuts: [richTextEditorShortcutLabels.heading1],
    icon: Heading1,
    execute: (editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    },
  },
  heading2: {
    kind: 'command',
    label: 'Heading 2',
    description: 'Use a secondary heading for nested sections or subsections.',
    shortcuts: [richTextEditorShortcutLabels.heading2],
    icon: Heading2,
    execute: (editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    },
  },
  heading3: {
    kind: 'command',
    label: 'Heading 3',
    description:
      'Use a tertiary heading for deeper nested sections without over-weighting the page hierarchy.',
    shortcuts: [richTextEditorShortcutLabels.heading3],
    icon: Heading3,
    execute: (editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    },
  },
  bold: {
    kind: 'command',
    label: 'Bold',
    description: 'Emphasize the selected text with stronger visual weight.',
    shortcuts: [richTextEditorShortcutLabels.bold],
    icon: Bold,
    execute: (editor) => {
      editor.chain().focus().toggleBold().run();
    },
  },
  italic: {
    kind: 'command',
    label: 'Italic',
    description: 'Add subtle emphasis without breaking paragraph rhythm.',
    shortcuts: [richTextEditorShortcutLabels.italic],
    icon: Italic,
    execute: (editor) => {
      editor.chain().focus().toggleItalic().run();
    },
  },
  strike: {
    kind: 'command',
    label: 'Strikethrough',
    description: 'Mark text as revised, deprecated, or no longer current.',
    shortcuts: [richTextEditorShortcutLabels.strike],
    icon: Strikethrough,
    execute: (editor) => {
      editor.chain().focus().toggleStrike().run();
    },
  },
  inlineCode: {
    kind: 'command',
    label: 'Inline Code',
    description: 'Format short code fragments or tokens inside a sentence.',
    shortcuts: [richTextEditorShortcutLabels.inlineCode],
    icon: Code,
    execute: (editor) => {
      editor.chain().focus().toggleCode().run();
    },
  },
  bulletList: {
    kind: 'command',
    label: 'Bullet List',
    description: 'Create an unordered list for grouped supporting points.',
    shortcuts: [richTextEditorShortcutLabels.bulletList],
    icon: List,
    execute: (editor) => {
      editor.chain().focus().toggleBulletList().run();
    },
  },
  orderedList: {
    kind: 'command',
    label: 'Ordered List',
    description: 'Create a numbered list for steps, ranking, or sequences.',
    shortcuts: [richTextEditorShortcutLabels.orderedList],
    icon: ListOrdered,
    execute: (editor) => {
      editor.chain().focus().toggleOrderedList().run();
    },
  },
  blockquote: {
    kind: 'command',
    label: 'Block Quote',
    description: 'Highlight quoted statements or emphasized supporting excerpts.',
    shortcuts: [richTextEditorShortcutLabels.blockquote],
    icon: Quote,
    execute: (editor) => {
      editor.chain().focus().toggleBlockquote().run();
    },
  },
  codeBlock: {
    kind: 'command',
    label: 'Code Block',
    description: 'Use a dedicated code block for snippets that need preserved spacing.',
    shortcuts: [richTextEditorShortcutLabels.codeBlock],
    icon: Code2,
    execute: (editor) => {
      editor.chain().focus().toggleCodeBlock().run();
    },
  },
  link: {
    kind: 'workflow',
    label: 'Link',
    description: 'Add, update, or remove a destination URL for the current selection.',
    shortcuts: [richTextEditorShortcutLabels.link],
    icon: Link2,
  },
  clearFormatting: {
    kind: 'command',
    label: 'Clear Formatting',
    description: 'Remove marks and normalize the current selection back to plain text blocks.',
    shortcuts: [richTextEditorShortcutLabels.clearFormatting],
    icon: Eraser,
    execute: (editor) => {
      editor.chain().focus().clearNodes().unsetAllMarks().run();
    },
  },
  undo: {
    kind: 'command',
    label: 'Undo',
    description: 'Reverse the most recent editing change.',
    shortcuts: [richTextEditorShortcutLabels.undo],
    icon: Undo2,
    execute: (editor) => {
      editor.chain().focus().undo().run();
    },
  },
  redo: {
    kind: 'command',
    label: 'Redo',
    description: 'Restore the last change that was undone.',
    shortcuts: [richTextEditorShortcutLabels.redo],
    icon: Redo2,
    execute: (editor) => {
      editor.chain().focus().redo().run();
    },
  },
};

export function isRichTextEditorToolbarToggleAction(actionId: RichTextEditorToolbarAction) {
  return actionId !== 'clearFormatting' && actionId !== 'undo' && actionId !== 'redo';
}
