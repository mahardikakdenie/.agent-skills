import { cva } from 'class-variance-authority';

export const dropdownMenuContentVariants = cva(
  'z-50 min-w-56 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none motion-reduce:transition-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2'
);

export const dropdownMenuLabelVariants = cva('px-2 py-1.5 text-xs font-semibold text-muted-foreground', {
  variants: {
    inset: {
      true: 'pl-8',
      false: '',
    },
  },
  defaultVariants: {
    inset: false,
  },
});

export const dropdownMenuSeparatorVariants = cva('-mx-1 my-1 h-px bg-border');

export const dropdownMenuItemVariants = cva(
  'relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-2 text-sm outline-none transition-colors motion-reduce:transition-none data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
  {
    variants: {
      variant: {
        outline:
          'border border-border bg-background text-foreground shadow-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
        shadow:
          'border border-border bg-background text-foreground shadow-sm data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
        ghost:
          'border border-transparent bg-transparent text-foreground shadow-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
        default:
          'border border-border bg-background text-foreground shadow-sm data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
      },
      inset: {
        true: 'pl-8',
        false: '',
      },
      destructive: {
        true: 'text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'outline',
      inset: false,
      destructive: false,
    },
  }
);

export const dropdownMenuSelectionItemVariants = cva(
  'relative flex cursor-pointer select-none items-center gap-2 rounded-lg py-2 pl-8 pr-2 text-sm outline-none transition-colors motion-reduce:transition-none data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
  {
    variants: {
      variant: {
        outline:
          'border border-border bg-background text-foreground shadow-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
        shadow:
          'border border-border bg-background text-foreground shadow-sm data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
        ghost:
          'border border-transparent bg-transparent text-foreground shadow-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
        default:
          'border border-border bg-background text-foreground shadow-sm data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
      },
      destructive: {
        true: 'text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'outline',
      destructive: false,
    },
  }
);

export const dropdownMenuIndicatorVariants = cva('absolute left-2 inline-flex h-4 w-4 items-center justify-center');

export const dropdownMenuShortcutVariants = cva('ml-auto text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground');

export const dropdownMenuIconVariants = cva('inline-flex h-4 w-4 shrink-0 items-center justify-center');

export const dropdownMenuChevronVariants = cva('ml-auto inline-flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground');
