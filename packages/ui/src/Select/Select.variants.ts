import { cva } from 'class-variance-authority';

export const selectFieldVariants = cva('grid w-full gap-1.5');

export const selectLabelVariants = cva('text-sm font-medium leading-none', {
  variants: {
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    tone: 'default',
  },
});

export const selectTriggerVariants = cva(
  [
    'flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-left text-sm shadow-sm',
    'ring-offset-background transition-colors motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'data-[placeholder]:text-muted-foreground data-[state=open]:border-ring',
  ].join(' '),
  {
    variants: {
      invalid: {
        true: 'border-destructive focus-visible:ring-destructive/30',
        false: 'border-input',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-60',
        false: '',
      },
    },
    defaultVariants: {
      invalid: false,
      disabled: false,
    },
  },
);

export const selectValueVariants = cva('line-clamp-1 flex-1 text-foreground');

export const selectIconVariants = cva('ml-auto shrink-0 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4');

export const selectContentVariants = cva(
  [
    'z-50 w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-1rem)] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md',
    'max-h-[min(var(--radix-select-content-available-height),20rem)]',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
    'motion-reduce:animate-none',
  ].join(' '),
);

export const selectViewportVariants = cva('max-h-[inherit] p-1');

export const selectItemVariants = cva(
  [
    'relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-8 text-sm outline-none',
    'transition-colors motion-reduce:transition-none',
    'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  ].join(' '),
);

export const selectItemTextVariants = cva('line-clamp-1');

export const selectItemIndicatorVariants = cva(
  'absolute right-2 inline-flex h-4 w-4 items-center justify-center text-foreground',
);

export const selectScrollButtonVariants = cva(
  'flex cursor-default items-center justify-center py-1 text-muted-foreground',
);

export const selectMessageVariants = cva('text-sm leading-5 text-destructive');
