import { cva } from 'class-variance-authority';

import { fieldVariantOptions } from '../utils/field-variants';

export const richTextEditorFieldVariants = cva('flex w-full flex-col gap-2');

export const richTextEditorLabelVariants = cva('text-sm font-medium text-foreground');

export const richTextEditorShellVariants = cva(
  'overflow-hidden rounded-lg border bg-background text-foreground transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20',
  {
    variants: {
      variant: fieldVariantOptions,
      invalid: {
        true: 'border-destructive/70 focus-within:border-destructive focus-within:ring-destructive/15',
        false: '',
      },
      readonly: {
        true: 'bg-muted/20',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'outline',
      invalid: false,
      readonly: false,
    },
  },
);

export const richTextEditorToolbarVariants = cva(
  'flex flex-wrap items-start gap-1.5 border-b border-border bg-muted/30 px-2.5 py-1.5',
);

export const richTextEditorToolbarGroupVariants = cva(
  'flex items-center gap-0.5 rounded-md border border-border bg-background/90 p-0.5 shadow-sm backdrop-blur-sm',
);

export const richTextEditorToolbarButtonVariants = cva(
  'inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md border text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none',
  {
    variants: {
      active: {
        true: 'border-primary bg-primary/10 text-primary shadow-sm',
        false:
          'border-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-accent-foreground',
      },
      disabled: {
        true:
          'cursor-not-allowed border-transparent bg-transparent text-muted-foreground/55 opacity-60 hover:border-transparent hover:bg-transparent hover:text-muted-foreground/55',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
    },
  },
);

export const richTextEditorToolbarTooltipVariants = cva('flex max-w-64 flex-col gap-1.5');

export const richTextEditorToolbarTooltipTitleVariants = cva(
  'text-[11px] font-semibold leading-none text-popover-foreground',
);

export const richTextEditorToolbarTooltipDescriptionVariants = cva(
  'text-[11px] leading-4 text-muted-foreground',
);

export const richTextEditorToolbarTooltipMetaVariants = cva(
  'flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px] text-muted-foreground',
);

export const richTextEditorToolbarTooltipKbdVariants = cva(
  'inline-flex min-h-5 min-w-5 items-center justify-center rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-foreground shadow-sm',
);

export const richTextEditorLinkEditorVariants = cva(
  'grid gap-2 border-b border-border bg-background px-3 py-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center',
);

export const richTextEditorLinkActionsVariants = cva(
  'flex flex-wrap items-center gap-1.5 lg:flex-nowrap lg:justify-end',
);

export const richTextEditorContentFrameVariants = cva('bg-background px-4 py-3', {
  variants: {
    readonly: {
      true: 'cursor-default',
      false: '',
    },
  },
  defaultVariants: {
    readonly: false,
  },
});

export const richTextEditorContentVariants = cva(
  [
    'min-h-[12rem] w-full text-sm leading-6 text-foreground outline-none',
    '[&_p]:m-0 [&_p+_p]:mt-3',
    '[&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1:first-child]:mt-0',
    '[&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-semibold [&_h2:first-child]:mt-0',
    '[&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3:first-child]:mt-0',
    '[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6',
    '[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6',
    '[&_li]:marker:text-muted-foreground',
    '[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground',
    '[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:px-3 [&_pre]:py-2 [&_pre]:text-foreground',
    '[&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.875em]',
    '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
    '[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
  ].join(' '),
  {
    variants: {
      readonly: {
        true: 'cursor-default',
        false: 'cursor-text',
      },
    },
    defaultVariants: {
      readonly: false,
    },
  },
);

export const richTextEditorHelperTextVariants = cva('text-sm text-muted-foreground');

export const richTextEditorMessageVariants = cva('text-sm text-destructive');
