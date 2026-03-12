import { cva } from 'class-variance-authority';

export const comboboxFieldVariants = cva('flex flex-col gap-1.5');

export const comboboxLabelVariants = cva('text-sm font-medium', {
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

export const comboboxControlVariants = cva('relative w-full');

export const comboboxTriggerVariants = cva(
  [
    'flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-left text-sm shadow-sm',
    'ring-offset-background transition-colors touch-manipulation',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'motion-reduce:transition-none',
  ].join(' '),
  {
    variants: {
      invalid: {
        true: 'border-destructive focus-visible:ring-destructive/30',
        false: 'border-input',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-60',
        false: 'hover:bg-accent/40',
      },
      open: {
        true: 'border-ring ring-2 ring-ring/20',
        false: '',
      },
      clearable: {
        true: 'pr-10',
        false: '',
      },
    },
    defaultVariants: {
      invalid: false,
      disabled: false,
      open: false,
      clearable: false,
    },
  },
);

export const comboboxTriggerTextVariants = cva('flex-1 truncate', {
  variants: {
    hasValue: {
      true: 'text-foreground',
      false: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    hasValue: false,
  },
});

export const comboboxTriggerIconVariants = cva('shrink-0 text-muted-foreground');

export const comboboxContentVariants = cva(
  'w-[var(--radix-popover-trigger-width)] min-w-[16rem] max-h-[min(calc(var(--radix-popover-content-available-height)-0.75rem),24rem)] overflow-hidden p-0',
);

export const comboboxCommandVariants = cva('flex h-full w-full flex-col bg-popover text-popover-foreground');

export const comboboxSearchRowVariants = cva('flex items-center gap-2 border-b border-border px-3');

export const comboboxSearchIconVariants = cva('shrink-0 text-muted-foreground');

export const comboboxSearchInputVariants = cva(
  'h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
);

export const comboboxListVariants = cva(
  'max-h-[min(calc(var(--radix-popover-content-available-height)-3.5rem),20rem)] overflow-y-auto overflow-x-hidden p-1',
);

export const comboboxEmptyVariants = cva('px-3 py-6 text-center text-sm text-muted-foreground');

export const comboboxLoadingRowVariants = cva('flex items-center gap-2 px-3 py-6 text-sm text-muted-foreground');

export const comboboxItemVariants = cva(
  [
    'relative flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none transition-colors',
    'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
    'data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
    'motion-reduce:transition-none',
  ].join(' '),
);

export const comboboxItemLabelVariants = cva('min-w-0 flex-1 truncate');

export const comboboxItemContentVariants = cva('min-w-0 flex-1');

export const comboboxItemIndicatorVariants = cva('ml-auto shrink-0 text-foreground');

export const comboboxMessageVariants = cva('text-sm text-destructive');

export const comboboxActionButtonVariants = cva(
  [
    'absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm text-muted-foreground',
    'transition-colors motion-reduce:transition-none',
    'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
);
