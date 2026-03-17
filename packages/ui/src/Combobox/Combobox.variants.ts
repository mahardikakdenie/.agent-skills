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
    'flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-background text-left shadow-sm',
    'ring-offset-background transition-colors touch-manipulation',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'motion-reduce:transition-none',
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'min-h-8 px-2.5 text-xs',
        sm: 'min-h-9 px-3 text-sm',
        md: 'min-h-10 px-3 text-sm',
        lg: 'min-h-11 px-4 text-base',
      },
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
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        clearable: true,
        size: 'xs',
        className: 'pr-8',
      },
      {
        clearable: true,
        size: 'sm',
        className: 'pr-10',
      },
      {
        clearable: true,
        size: 'md',
        className: 'pr-10',
      },
      {
        clearable: true,
        size: 'lg',
        className: 'pr-12',
      },
    ],
    defaultVariants: {
      size: 'md',
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

export const comboboxTriggerIconVariants = cva('text-muted-foreground', {
  variants: {
    size: {
      xs: 'h-3.5 w-3.5',
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-[18px] w-[18px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const comboboxContentVariants = cva(
  'w-[var(--radix-popover-trigger-width)] min-w-[16rem] max-h-[min(calc(var(--radix-popover-content-available-height)-0.75rem),24rem)] overflow-hidden p-0',
);

export const comboboxCommandVariants = cva(
  'flex h-full w-full flex-col bg-popover text-popover-foreground',
);

export const comboboxSearchRowVariants = cva(
  'flex items-center gap-2 border-b border-border',
  {
    variants: {
      size: {
        xs: 'min-h-8 px-2.5',
        sm: 'min-h-9 px-3',
        md: 'min-h-10 px-3',
        lg: 'min-h-11 px-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const comboboxSearchIconVariants = cva('text-muted-foreground', {
  variants: {
    size: {
      xs: 'h-3.5 w-3.5',
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-[18px] w-[18px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const comboboxSearchInputVariants = cva(
  'w-full bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const comboboxListVariants = cva(
  'max-h-[min(calc(var(--radix-popover-content-available-height)-3.5rem),20rem)] overflow-y-auto overflow-x-hidden p-1',
);

export const comboboxEmptyVariants = cva('px-3 py-6 text-center text-sm text-muted-foreground');

export const comboboxLoadingRowVariants = cva(
  'flex items-center gap-2 px-3 py-6 text-sm text-muted-foreground',
);

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
    'absolute top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm text-muted-foreground',
    'transition-colors motion-reduce:transition-none',
    'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'right-2.5 h-5 w-5',
        sm: 'right-3 h-6 w-6',
        md: 'right-3 h-6 w-6',
        lg: 'right-4 h-7 w-7',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);
