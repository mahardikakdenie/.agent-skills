import type { Editor } from '@tiptap/react';

import { normalizeRichTextEditorUrl } from './RichTextEditor.utils';

const richTextEditorLinkAttributes = {
  rel: 'noopener noreferrer nofollow',
  target: '_blank',
} as const;

export interface RichTextEditorSelectionRange {
  from: number;
  to: number;
}

interface ApplyRichTextEditorLinkOptions {
  editor: Editor;
  selection: RichTextEditorSelectionRange;
  value: string;
}

export function applyRichTextEditorLink({
  editor,
  selection,
  value,
}: ApplyRichTextEditorLinkOptions) {
  const normalizedUrl = normalizeRichTextEditorUrl(value);
  const chain = editor.chain().focus().setTextSelection(selection);

  if (!normalizedUrl) {
    chain.extendMarkRange('link').unsetLink().run();
    return;
  }

  if (selection.from === selection.to) {
    chain
      .insertContent({
        type: 'text',
        text: normalizedUrl,
        marks: [
          {
            type: 'link',
            attrs: {
              href: normalizedUrl,
              ...richTextEditorLinkAttributes,
            },
          },
        ],
      })
      .run();
    return;
  }

  chain
    .extendMarkRange('link')
    .setLink({
      href: normalizedUrl,
      ...richTextEditorLinkAttributes,
    })
    .run();
}

export function removeRichTextEditorLink(
  editor: Editor,
  selection: RichTextEditorSelectionRange,
) {
  editor.chain().focus().setTextSelection(selection).extendMarkRange('link').unsetLink().run();
}
