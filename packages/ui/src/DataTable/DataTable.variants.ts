import { cva } from 'class-variance-authority';

export const dataTableRootVariants = cva('flex flex-col gap-4');

export const dataTableToolbarVariants = cva(
  'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
);

export const dataTableToolbarInputVariants = cva('w-full sm:max-w-sm');

export const dataTableToolbarActionsVariants = cva(
  'flex flex-wrap items-center gap-2 sm:justify-end',
);

export const dataTableViewportVariants = cva(
  'overflow-hidden rounded-lg border border-border bg-background',
);

export const dataTableSortButtonVariants = cva(
  'flex w-full items-center gap-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none',
  {
    variants: {
      sortable: {
        true: 'cursor-pointer hover:text-foreground',
        false: 'cursor-default',
      },
      sorted: {
        true: 'text-foreground',
        false: '',
      },
    },
    defaultVariants: {
      sortable: true,
      sorted: false,
    },
  },
);

export const dataTableStatusCellVariants = cva('px-6 py-8 text-center text-muted-foreground');

export const dataTableStatusContentVariants = cva(
  'inline-flex items-center justify-center gap-2 text-sm text-muted-foreground',
);

export const dataTableEmptyStateVariants = cva(
  'mx-auto flex max-w-md flex-col items-center gap-2 py-0.5 text-center',
);

export const dataTableEmptyTitleVariants = cva('text-sm font-semibold tracking-tight text-foreground');


export const dataTableSkeletonRowVariants = cva('flex items-center py-1');

export const dataTableSkeletonCellVariants = cva('py-4');

export const dataTableSortIconVariants = cva('h-4 w-4 shrink-0 text-muted-foreground');

export const dataTablePaginationShellVariants = cva('pt-1');
