import type * as React from 'react';

import { type InputVariant } from '../Input/Input.types';

export const richTextEditorToolbarModeValues = ['default', 'minimal', 'none'] as const;
export const richTextEditorToolbarActionValues = [
  'paragraph',
  'heading1',
  'heading2',
  'heading3',
  'bold',
  'italic',
  'strike',
  'inlineCode',
  'bulletList',
  'orderedList',
  'blockquote',
  'codeBlock',
  'link',
  'clearFormatting',
  'undo',
  'redo',
] as const;

export type RichTextEditorToolbarMode = (typeof richTextEditorToolbarModeValues)[number];
export type RichTextEditorToolbarAction = (typeof richTextEditorToolbarActionValues)[number];

export type RichTextEditorSanitizer = (html: string) => string;

export interface RichTextEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onBlur' | 'onChange' | 'onFocus'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  variant?: InputVariant;
  toolbar?: RichTextEditorToolbarMode;
  readonly?: boolean;
  sanitize?: boolean | RichTextEditorSanitizer;
  label?: string;
  helperText?: string;
  error?: string | boolean;
  required?: boolean;
  id?: string;
}
