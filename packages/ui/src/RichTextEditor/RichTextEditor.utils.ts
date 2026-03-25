import Link from '@tiptap/extension-link';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import DOMPurify from 'dompurify';

import type {
  RichTextEditorSanitizer,
  RichTextEditorToolbarAction,
  RichTextEditorToolbarMode,
} from './RichTextEditor.types';

export const richTextEditorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
    link: false,
  }),
  Link.configure({
    autolink: false,
    openOnClick: false,
    HTMLAttributes: {
      rel: 'noopener noreferrer nofollow',
      target: '_blank',
    },
  }),
];

export const richTextEditorToolbarActionGroups = {
  default: [
    {
      id: 'structure',
      label: 'Document structure',
      actions: ['paragraph', 'heading1', 'heading2', 'heading3'],
    },
    {
      id: 'inline-formatting',
      label: 'Inline formatting',
      actions: ['bold', 'italic', 'strike', 'inlineCode'],
    },
    {
      id: 'blocks',
      label: 'Lists and blocks',
      actions: ['bulletList', 'orderedList', 'blockquote', 'codeBlock'],
    },
    {
      id: 'links-and-cleanup',
      label: 'Links and cleanup',
      actions: ['link', 'clearFormatting'],
    },
    {
      id: 'history',
      label: 'History',
      actions: ['undo', 'redo'],
    },
  ],
  minimal: [
    {
      id: 'inline-formatting',
      label: 'Inline formatting',
      actions: ['bold', 'italic', 'strike', 'inlineCode'],
    },
    {
      id: 'lists-and-links',
      label: 'Lists and links',
      actions: ['bulletList', 'orderedList', 'link'],
    },
    {
      id: 'history',
      label: 'History',
      actions: ['undo', 'redo'],
    },
  ],
} as const satisfies Record<
  Exclude<RichTextEditorToolbarMode, 'none'>,
  readonly {
    id: string;
    label: string;
    actions: readonly RichTextEditorToolbarAction[];
  }[]
>;

const richTextEditorAllowedTags = [
  'p',
  'br',
  'strong',
  'em',
  's',
  'ul',
  'ol',
  'li',
  'blockquote',
  'code',
  'pre',
  'h1',
  'h2',
  'h3',
  'a',
];

const richTextEditorAllowedAttributes = ['href', 'target', 'rel'];

export function normalizeRichTextEditorHtml(html: string | null | undefined) {
  const normalized = (html ?? '').replace(/\r\n/g, '\n').trim();

  if (!normalized) {
    return '';
  }

  const plainText = normalized
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return plainText ? normalized : '';
}

export function sanitizeRichTextEditorHtml(
  html: string | null | undefined,
  sanitize: boolean | RichTextEditorSanitizer = true,
) {
  const normalized = normalizeRichTextEditorHtml(html);

  if (!normalized) {
    return '';
  }

  if (sanitize === false) {
    return normalized;
  }

  if (typeof sanitize === 'function') {
    return normalizeRichTextEditorHtml(sanitize(normalized));
  }

  if (typeof window === 'undefined') {
    return normalized;
  }

  return normalizeRichTextEditorHtml(
    DOMPurify.sanitize(normalized, {
      ALLOWED_TAGS: richTextEditorAllowedTags,
      ALLOWED_ATTR: richTextEditorAllowedAttributes,
      ALLOW_DATA_ATTR: false,
    }),
  );
}

export function getRichTextEditorOutput(
  editor: Editor,
  sanitize: boolean | RichTextEditorSanitizer = true,
) {
  if (editor.isEmpty) {
    return '';
  }

  return sanitizeRichTextEditorHtml(editor.getHTML(), sanitize);
}

export function normalizeRichTextEditorUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
