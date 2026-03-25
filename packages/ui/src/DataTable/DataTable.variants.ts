import { cva } from 'class-variance-authority';

export const dataTableRootVariants = cva('flex w-full min-w-0 flex-col gap-4');

export const dataTableToolbarVariants = cva(
  'flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between',
);

export const dataTableToolbarGroupVariants = cva('flex flex-1 flex-wrap items-center gap-2');

export const dataTableToolbarInputVariants = cva('w-full sm:max-w-sm');

export const dataTableToolbarActionsVariants = cva(
  'flex flex-wrap items-center gap-2 lg:justify-end',
);

export const dataTableViewportVariants = cva(
  'w-full max-w-full overflow-auto rounded-lg border border-border bg-background',
);

export const dataTableHeaderContentVariants = cva('block min-w-0 max-w-full truncate');

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

export const dataTableSortIndexVariants = cva(
  'inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1 text-[11px] font-semibold text-muted-foreground',
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

export const dataTablePaginationMetaVariants = cva('mb-3 flex items-center justify-between gap-3');

export const dataTableResizeHandleVariants = cva(
  'absolute top-0 right-0 h-full w-2 cursor-col-resize touch-none rounded-full bg-transparent transition-colors hover:bg-border/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  {
    variants: {
      resizing: {
        true: 'bg-ring/60',
        false: '',
      },
    },
    defaultVariants: {
      resizing: false,
    },
  },
);

export const dataTableGroupedCellVariants = cva('flex min-w-0 items-center gap-2');

export const dataTableGroupedToggleVariants = cva(
  'inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
);

export const dataTableGroupedCellCountVariants = cva(
  'inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground',
);

export const dataTableExpandedContentCellVariants = cva('bg-muted/20 px-6 py-4');

export const dataTableFacetTriggerVariants = cva('gap-2');

export const dataTableFacetCountVariants = cva(
  'inline-flex min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-semibold text-muted-foreground',
);

export const dataTableFacetOptionCountVariants = cva(
  'inline-flex min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-medium text-muted-foreground',
);

export const dataTableViewOptionsButtonVariants = cva('gap-2');

export const dataTableSelectionSummaryVariants = cva(
  'inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5 text-sm text-muted-foreground',
);


