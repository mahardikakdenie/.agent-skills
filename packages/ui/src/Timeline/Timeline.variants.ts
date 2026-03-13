import { cva } from 'class-variance-authority';

export const timelineRootVariants = cva('relative min-w-0', {
  variants: {
    orientation: {
      vertical: 'flex flex-col',
      horizontal: 'flex flex-row flex-wrap items-stretch gap-4',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export const timelineItemVariants = cva('min-w-0', {
  variants: {
    orientation: {
      vertical: 'grid grid-cols-[auto_minmax(0,1fr)] gap-x-4',
      horizontal: 'flex min-w-[12rem] flex-1 basis-48 flex-col gap-3',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export const timelineRailVariants = cva('min-w-0', {
  variants: {
    orientation: {
      vertical: 'flex w-5 flex-col items-center pt-1',
      horizontal: 'flex items-center gap-3',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export const timelineConnectorVariants = cva('bg-border', {
  variants: {
    orientation: {
      vertical: 'mt-2 w-px flex-1',
      horizontal: 'h-px flex-1',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export const timelineMarkerVariants = cva(
  [
    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
    'shadow-sm',
    'transition-colors motion-reduce:transition-none',
  ].join(' '),
  {
    variants: {
      statusTone: {
        default: 'border-border bg-muted text-foreground',
        success: 'border-success/30 bg-success/10 text-success',
        warning: 'border-warning/30 bg-warning/10 text-warning',
        destructive: 'border-destructive/30 bg-destructive/10 text-destructive',
        info: 'border-info/30 bg-info/10 text-info',
      },
    },
    defaultVariants: {
      statusTone: 'default',
    },
  },
);

export const timelineBodyVariants = cva('flex min-w-0 flex-col', {
  variants: {
    orientation: {
      vertical: 'gap-1 pb-6',
      horizontal: 'gap-1',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export const timelineTitleVariants = cva('min-w-0 break-words text-sm font-semibold leading-5 text-foreground');
export const timelineDescriptionVariants = cva('min-w-0 break-words text-sm leading-5 text-muted-foreground');

