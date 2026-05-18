'use client';

import * as React from 'react';
import { Unlink } from 'lucide-react';

import { Box } from '../Box';
import { Button } from '../Button';
import { Input } from '../Input';
import {
  richTextEditorLinkActionsVariants,
  richTextEditorLinkEditorVariants,
} from './RichTextEditor.variants';

interface RichTextEditorLinkEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
  onCancel: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

export function RichTextEditorLinkEditor({
  value,
  onValueChange,
  onApply,
  onRemove,
  onCancel,
  inputRef,
}: RichTextEditorLinkEditorProps) {
  return (
    <Box data-slot='rich-text-editor-link-editor' className={richTextEditorLinkEditorVariants()}>
      <Input
        ref={inputRef}
        value={value}
        onValueChange={onValueChange}
        name='linkUrl'
        type='url'
        size='sm'
        autoComplete='off'
        spellCheck={false}
        placeholder='Paste or type a URL...'
        aria-label='Link URL'
        className='min-w-0 [&_[data-slot=input-control]]:min-h-8 [&_[data-slot=input-control]]:px-2.5 [&_input]:text-sm'
      />
      <Box
        data-slot='rich-text-editor-link-actions'
        className={richTextEditorLinkActionsVariants()}
      >
        <Button
          type='button'
          size='sm'
          onMouseDown={(event) => event.preventDefault()}
          onClick={onApply}
        >
          Apply
        </Button>
        <Button
          type='button'
          size='sm'
          variant='outline'
          onMouseDown={(event) => event.preventDefault()}
          onClick={onRemove}
        >
          <Unlink className='h-4 w-4' aria-hidden='true' />
          Remove
        </Button>
        <Button
          type='button'
          size='sm'
          variant='ghost'
          onMouseDown={(event) => event.preventDefault()}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
