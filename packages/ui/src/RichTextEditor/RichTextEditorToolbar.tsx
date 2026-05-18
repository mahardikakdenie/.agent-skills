'use client';

import { useEditorState, type Editor } from '@tiptap/react';

import { Box } from '../Box';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../Tooltip';
import type { RichTextEditorToolbarAction, RichTextEditorToolbarMode } from './RichTextEditor.types';
import {
  richTextEditorToolbarButtonVariants,
  richTextEditorToolbarGroupVariants,
  richTextEditorToolbarTooltipDescriptionVariants,
  richTextEditorToolbarTooltipKbdVariants,
  richTextEditorToolbarTooltipMetaVariants,
  richTextEditorToolbarTooltipTitleVariants,
  richTextEditorToolbarTooltipVariants,
  richTextEditorToolbarVariants,
} from './RichTextEditor.variants';
import { richTextEditorToolbarActionGroups } from './RichTextEditor.utils';
import {
  isRichTextEditorToolbarToggleAction,
  richTextEditorToolbarActionDefinitions,
} from './RichTextEditorToolbar.config';

interface RichTextEditorToolbarProps {
  editor: Editor | null;
  mode: Exclude<RichTextEditorToolbarMode, 'none'>;
  readonly?: boolean;
  linkEditorOpen: boolean;
  onOpenLinkEditor: () => void;
}

interface ToolbarEditorState {
  paragraph: boolean;
  heading1: boolean;
  heading2: boolean;
  heading3: boolean;
  bold: boolean;
  italic: boolean;
  strike: boolean;
  inlineCode: boolean;
  bulletList: boolean;
  orderedList: boolean;
  blockquote: boolean;
  codeBlock: boolean;
  link: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

const toolbarDefaultState: ToolbarEditorState = {
  paragraph: false,
  heading1: false,
  heading2: false,
  heading3: false,
  bold: false,
  italic: false,
  strike: false,
  inlineCode: false,
  bulletList: false,
  orderedList: false,
  blockquote: false,
  codeBlock: false,
  link: false,
  canUndo: false,
  canRedo: false,
};

function selectToolbarEditorState(editor: Editor | null): ToolbarEditorState {
  return {
    paragraph: editor?.isActive('paragraph') ?? false,
    heading1: editor?.isActive('heading', { level: 1 }) ?? false,
    heading2: editor?.isActive('heading', { level: 2 }) ?? false,
    heading3: editor?.isActive('heading', { level: 3 }) ?? false,
    bold: editor?.isActive('bold') ?? false,
    italic: editor?.isActive('italic') ?? false,
    strike: editor?.isActive('strike') ?? false,
    inlineCode: editor?.isActive('code') ?? false,
    bulletList: editor?.isActive('bulletList') ?? false,
    orderedList: editor?.isActive('orderedList') ?? false,
    blockquote: editor?.isActive('blockquote') ?? false,
    codeBlock: editor?.isActive('codeBlock') ?? false,
    link: editor?.isActive('link') ?? false,
    canUndo: editor?.can().undo() ?? false,
    canRedo: editor?.can().redo() ?? false,
  };
}

function getToolbarActionDisabledState(
  actionId: RichTextEditorToolbarAction,
  editorState: ToolbarEditorState,
) {
  switch (actionId) {
    case 'undo':
      return !editorState.canUndo;
    case 'redo':
      return !editorState.canRedo;
    case 'paragraph':
    case 'heading1':
    case 'heading2':
    case 'heading3':
    case 'bold':
    case 'italic':
    case 'strike':
    case 'inlineCode':
    case 'bulletList':
    case 'orderedList':
    case 'blockquote':
    case 'codeBlock':
    case 'link':
    case 'clearFormatting':
      return false;
  }
}

function getToolbarActionActiveState(
  actionId: RichTextEditorToolbarAction,
  editorState: ToolbarEditorState,
  linkEditorOpen: boolean,
) {
  switch (actionId) {
    case 'paragraph':
      return editorState.paragraph;
    case 'heading1':
      return editorState.heading1;
    case 'heading2':
      return editorState.heading2;
    case 'heading3':
      return editorState.heading3;
    case 'bold':
      return editorState.bold;
    case 'italic':
      return editorState.italic;
    case 'strike':
      return editorState.strike;
    case 'inlineCode':
      return editorState.inlineCode;
    case 'bulletList':
      return editorState.bulletList;
    case 'orderedList':
      return editorState.orderedList;
    case 'blockquote':
      return editorState.blockquote;
    case 'codeBlock':
      return editorState.codeBlock;
    case 'link':
      return linkEditorOpen || editorState.link;
    case 'clearFormatting':
    case 'undo':
    case 'redo':
      return false;
  }
}

export function RichTextEditorToolbar({
  editor,
  mode,
  readonly = false,
  linkEditorOpen,
  onOpenLinkEditor,
}: RichTextEditorToolbarProps) {
  const editorState =
    useEditorState({
      editor,
      selector: ({ editor: currentEditor }) => selectToolbarEditorState(currentEditor),
    }) ?? toolbarDefaultState;

  if (!editor || readonly) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={120} skipDelayDuration={250}>
      <Box
        data-slot='rich-text-editor-toolbar'
        role='toolbar'
        aria-label='Rich text formatting'
        className={richTextEditorToolbarVariants()}
      >
        {richTextEditorToolbarActionGroups[mode].map((group) => (
          <Box
            key={group.id}
            data-slot='rich-text-editor-toolbar-group'
            role='group'
            aria-label={group.label}
            className={richTextEditorToolbarGroupVariants()}
          >
            {group.actions.map((actionId) => {
              const action = richTextEditorToolbarActionDefinitions[actionId];
              const Icon = action.icon;
              const isActive = getToolbarActionActiveState(actionId, editorState, linkEditorOpen);
              const isDisabled = getToolbarActionDisabledState(actionId, editorState);

              return (
                <Tooltip key={actionId} delayDuration={80}>
                  <TooltipTrigger asChild>
                    <Box
                      as='button'
                      type='button'
                      aria-label={action.label}
                      aria-pressed={
                        isRichTextEditorToolbarToggleAction(actionId) ? isActive : undefined
                      }
                      aria-disabled={isDisabled || undefined}
                      data-disabled={isDisabled ? 'true' : undefined}
                      className={richTextEditorToolbarButtonVariants({
                        active: isActive,
                        disabled: isDisabled,
                      })}
                      onMouseDown={(event) => {
                        event.preventDefault();
                      }}
                      onClick={() => {
                        if (isDisabled) {
                          return;
                        }

                        if (action.kind === 'workflow') {
                          onOpenLinkEditor();
                          return;
                        }

                        action.execute(editor);
                      }}
                    >
                      <Icon className='h-4 w-4' aria-hidden='true' />
                    </Box>
                  </TooltipTrigger>
                  <TooltipContent side='top' sideOffset={10} className='max-w-64'>
                    <Box className={richTextEditorToolbarTooltipVariants()}>
                      <Box as='span' className={richTextEditorToolbarTooltipTitleVariants()}>
                        {action.label}
                      </Box>
                      <Box as='span' className={richTextEditorToolbarTooltipDescriptionVariants()}>
                        {action.description}
                      </Box>
                      {action.shortcuts?.length ? (
                        <Box className={richTextEditorToolbarTooltipMetaVariants()}>
                          <Box as='span'>
                            {action.shortcuts.length > 1 ? 'Shortcuts' : 'Shortcut'}
                          </Box>
                          {action.shortcuts.map((shortcut) => (
                            <Box
                              key={shortcut}
                              as='kbd'
                              className={richTextEditorToolbarTooltipKbdVariants()}
                            >
                              {shortcut}
                            </Box>
                          ))}
                        </Box>
                      ) : null}
                    </Box>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </Box>
        ))}
      </Box>
    </TooltipProvider>
  );
}
