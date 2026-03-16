import * as React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type { RichTextEditorProps } from './RichTextEditor.types';
import {
  richTextEditorContentVariants,
  richTextEditorContentFrameVariants,
  richTextEditorFieldVariants,
  richTextEditorHelperTextVariants,
  richTextEditorLabelVariants,
  richTextEditorMessageVariants,
  richTextEditorShellVariants,
} from './RichTextEditor.variants';
import {
  getRichTextEditorOutput,
  richTextEditorExtensions,
  sanitizeRichTextEditorHtml,
} from './RichTextEditor.utils';
import {
  applyRichTextEditorLink,
  removeRichTextEditorLink,
  type RichTextEditorSelectionRange,
} from './RichTextEditorCommands';
import { handleRichTextEditorShellKeyDown } from './RichTextEditorShortcuts';
import { RichTextEditorLinkEditor } from './RichTextEditorLinkEditor';
import { RichTextEditorToolbar } from './RichTextEditorToolbar';

export const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      value,
      defaultValue = '',
      onChange,
      onBlur,
      onFocus,
      toolbar = 'default',
      readonly = false,
      sanitize = true,
      label,
      helperText,
      error = false,
      required = false,
      className,
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...rootProps
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const editorId = id ?? `rich-text-editor-${generatedId}`;
    const labelId = label ? `${editorId}-label` : undefined;
    const helperTextId = helperText ? `${editorId}-helper-text` : undefined;
    const errorId = typeof error === 'string' ? `${editorId}-error` : undefined;
    const hasError = Boolean(error);
    const describedBy =
      [ariaDescribedBy, helperTextId, errorId].filter(Boolean).join(' ') || undefined;
    const labelledBy = [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
    const isControlled = value !== undefined;
    const sanitizedValue = React.useMemo(
      () => sanitizeRichTextEditorHtml(value ?? '', sanitize),
      [sanitize, value],
    );
    const initialContent = React.useMemo(
      () =>
        isControlled ? sanitizedValue : sanitizeRichTextEditorHtml(defaultValue, sanitize),
      [defaultValue, isControlled, sanitize, sanitizedValue],
    );
    const sanitizeRef = React.useRef(sanitize);
    const onChangeRef = React.useRef(onChange);
    const onBlurRef = React.useRef(onBlur);
    const onFocusRef = React.useRef(onFocus);
    const shellRef = React.useRef<HTMLDivElement>(null);
    const selectionRef = React.useRef<RichTextEditorSelectionRange | null>(null);
    const linkInputRef = React.useRef<HTMLInputElement>(null);
    const [uncontrolledValue, setUncontrolledValue] = React.useState(initialContent);
    const [linkEditorOpen, setLinkEditorOpen] = React.useState(false);
    const [linkValue, setLinkValue] = React.useState('');

    React.useEffect(() => {
      sanitizeRef.current = sanitize;
      onChangeRef.current = onChange;
      onBlurRef.current = onBlur;
      onFocusRef.current = onFocus;
    }, [onBlur, onChange, onFocus, sanitize]);

    const editorAttributes = React.useMemo<Record<string, string>>(
      () => ({
        id: editorId,
        class: richTextEditorContentVariants({ readonly }),
        role: 'textbox',
        'aria-multiline': 'true',
        spellcheck: readonly ? 'false' : 'true',
        ...(hasError ? { 'aria-invalid': 'true' } : {}),
        ...(readonly ? { 'aria-readonly': 'true' } : {}),
        ...(labelledBy
          ? { 'aria-labelledby': labelledBy }
          : { 'aria-label': ariaLabel ?? 'Rich text editor' }),
        ...(describedBy ? { 'aria-describedby': describedBy } : {}),
      }),
      [ariaLabel, describedBy, editorId, hasError, labelledBy, readonly],
    );

    const editor = useEditor({
      immediatelyRender: false,
      extensions: richTextEditorExtensions,
      content: initialContent,
      editable: !readonly,
      editorProps: {
        attributes: editorAttributes,
      },
      onUpdate: ({ editor: currentEditor }) => {
        const nextValue = getRichTextEditorOutput(currentEditor, sanitizeRef.current);

        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }

        onChangeRef.current?.(nextValue);
      },
      onBlur: () => {
        onBlurRef.current?.();
      },
      onFocus: () => {
        onFocusRef.current?.();
      },
    });

    React.useImperativeHandle(ref, () => shellRef.current as HTMLDivElement);

    React.useEffect(() => {
      if (!editor) {
        return;
      }

      editor.setEditable(!readonly);
      editor.setOptions({
        editorProps: {
          attributes: editorAttributes,
        },
      });
    }, [editor, editorAttributes, readonly]);

    React.useEffect(() => {
      if (!editor || !isControlled) {
        return;
      }

      const currentValue = getRichTextEditorOutput(editor, sanitize);

      if (currentValue !== sanitizedValue) {
        editor.commands.setContent(sanitizedValue, { emitUpdate: false });
      }

      if ((value ?? '') !== sanitizedValue) {
        onChangeRef.current?.(sanitizedValue);
      }
    }, [editor, isControlled, sanitize, sanitizedValue, value]);

    React.useEffect(() => {
      if (!editor || isControlled) {
        return;
      }

      const nextValue = sanitizeRichTextEditorHtml(uncontrolledValue, sanitize);
      const currentValue = getRichTextEditorOutput(editor, sanitize);

      if (currentValue !== nextValue) {
        editor.commands.setContent(nextValue, { emitUpdate: false });
      }
    }, [editor, isControlled, sanitize, uncontrolledValue]);

    React.useEffect(() => {
      if (linkEditorOpen) {
        linkInputRef.current?.focus();
      }
    }, [linkEditorOpen]);

    const resetLinkEditor = React.useCallback(() => {
      selectionRef.current = null;
      setLinkEditorOpen(false);
      setLinkValue('');
    }, []);

    const getSelection = React.useCallback(() => {
      if (!editor) {
        return null;
      }

      return (
        selectionRef.current ?? {
          from: editor.state.selection.from,
          to: editor.state.selection.to,
        }
      );
    }, [editor]);

    const handleOpenLinkEditor = React.useCallback(() => {
      if (!editor) {
        return;
      }

      if (linkEditorOpen) {
        resetLinkEditor();
        return;
      }

      selectionRef.current = {
        from: editor.state.selection.from,
        to: editor.state.selection.to,
      };
      setLinkValue(editor.getAttributes('link').href ?? '');
      setLinkEditorOpen(true);
    }, [editor, linkEditorOpen, resetLinkEditor]);

    const handleApplyLink = React.useCallback(() => {
      if (!editor) {
        return;
      }

      const selection = getSelection();

      if (!selection) {
        return;
      }

      applyRichTextEditorLink({
        editor,
        selection,
        value: linkValue,
      });
      resetLinkEditor();
    }, [editor, getSelection, linkValue, resetLinkEditor]);

    const handleRemoveLink = React.useCallback(() => {
      if (!editor) {
        return;
      }

      const selection = getSelection();

      if (!selection) {
        return;
      }

      removeRichTextEditorLink(editor, selection);
      resetLinkEditor();
    }, [editor, getSelection, resetLinkEditor]);

    const currentValue = isControlled ? sanitizedValue : uncontrolledValue;

    return (
      <Box
        ref={shellRef}
        data-slot='rich-text-editor'
        className={cn(richTextEditorFieldVariants(), className)}
        {...rootProps}
      >
        {label ? (
          <Box as='p' id={labelId} className={richTextEditorLabelVariants()}>
            {label}
            {required ? (
              <Box as='span' aria-hidden='true' className='ml-1 text-destructive'>
                *
              </Box>
            ) : null}
          </Box>
        ) : null}

        <Box
          data-slot='rich-text-editor-shell'
          className={richTextEditorShellVariants({ invalid: hasError, readonly })}
          onKeyDownCapture={(event) => {
            handleRichTextEditorShellKeyDown({
              event,
              editor,
              readonly,
              onOpenLinkEditor: handleOpenLinkEditor,
            });
          }}
        >
          {toolbar !== 'none' ? (
            <RichTextEditorToolbar
              editor={editor}
              mode={toolbar}
              readonly={readonly}
              linkEditorOpen={linkEditorOpen}
              onOpenLinkEditor={handleOpenLinkEditor}
            />
          ) : null}

          {linkEditorOpen && !readonly ? (
            <RichTextEditorLinkEditor
              inputRef={linkInputRef}
              value={linkValue}
              onValueChange={setLinkValue}
              onApply={handleApplyLink}
              onRemove={handleRemoveLink}
              onCancel={resetLinkEditor}
            />
          ) : null}

          <Box
            data-slot='rich-text-editor-content-frame'
            className={richTextEditorContentFrameVariants({ readonly })}
          >
            {editor ? (
              <EditorContent editor={editor} />
            ) : (
              <Box
                as='p'
                aria-live='polite'
                className='min-h-[12rem] text-sm text-muted-foreground'
              >
                Loading editor...
              </Box>
            )}
          </Box>
        </Box>

        {helperText ? (
          <Box as='p' id={helperTextId} className={richTextEditorHelperTextVariants()}>
            {helperText}
          </Box>
        ) : null}

        {typeof error === 'string' ? (
          <Box as='p' id={errorId} role='alert' className={richTextEditorMessageVariants()}>
            {error}
          </Box>
        ) : null}

        <Box as='span' className='sr-only' aria-live='polite'>
          {currentValue ? 'Editor content updated.' : 'Editor is empty.'}
        </Box>
      </Box>
    );
  },
);

RichTextEditor.displayName = 'RichTextEditor';
