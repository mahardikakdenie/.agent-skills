import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, screen, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { TableCell, TableRow } from '../Table';
import {
  DataTableColumnFilter,
  DataTableFacetedFilter,
  DataTableSearch,
  DataTableSelectionSummary,
  DataTableToolbar,
  DataTableViewOptions,
} from './DataTable.story-helpers';
import type {
  ColumnDef,
  DataTableInstance,
  DataTableOptions,
  RowPinningState,
} from './DataTable.types';
import {
  DataTable,
  DataTableVirtualized,
  dataTableFacetedFilterFn,
  dataTableFuzzyFilterFn,
  useDataTable,
} from './index';

type InvoiceRow = {
  id: string;
  customer: string;
  status: 'Active' | 'Pending' | 'Expired';
  channel: 'Portal' | 'Agent' | 'Admin';
  region: 'MY' | 'SG' | 'TH';
  premium: number;
  assignee: string;
  notes: string;
};

const invoices: InvoiceRow[] = [
  {
    id: 'INV-1048',
    customer: 'Marcus Lim',
    status: 'Pending',
    channel: 'Portal',
    region: 'MY',
    premium: 215,
    assignee: 'Anis',
    notes: 'Awaiting payment confirmation.',
  },
  {
    id: 'INV-1049',
    customer: 'Alicia Tan',
    status: 'Active',
    channel: 'Agent',
    region: 'SG',
    premium: 420,
    assignee: 'Nur',
    notes: 'Policy pack sent to broker inbox.',
  },
  {
    id: 'INV-1050',
    customer: 'Farah Nordin',
    status: 'Expired',
    channel: 'Admin',
    region: 'MY',
    premium: 96,
    assignee: 'Hakim',
    notes: 'Retention outreach required.',
  },
  {
    id: 'INV-1051',
    customer: 'Daniel Khoo',
    status: 'Active',
    channel: 'Portal',
    region: 'TH',
    premium: 188,
    assignee: 'Mira',
    notes: 'Renewal scheduled next month.',
  },
  {
    id: 'INV-1052',
    customer: 'Nurul Rahman',
    status: 'Pending',
    channel: 'Agent',
    region: 'MY',
    premium: 260,
    assignee: 'Jia',
    notes: 'Waiting for KYC attachment.',
  },
  {
    id: 'INV-1053',
    customer: 'Siti Ong',
    status: 'Active',
    channel: 'Admin',
    region: 'SG',
    premium: 512,
    assignee: 'Anis',
    notes: 'Escalated corporate account.',
  },
  {
    id: 'INV-1054',
    customer: 'Hafiz Ibrahim',
    status: 'Expired',
    channel: 'Portal',
    region: 'TH',
    premium: 174,
    assignee: 'Nur',
    notes: 'Requires follow-up before archive.',
  },
  {
    id: 'INV-1055',
    customer: 'Clara Lim',
    status: 'Active',
    channel: 'Agent',
    region: 'MY',
    premium: 302,
    assignee: 'Hakim',
    notes: 'Broker requested endorsement copy.',
  },
  {
    id: 'INV-1056',
    customer: 'Budi Santoso',
    status: 'Pending',
    channel: 'Portal',
    region: 'SG',
    premium: 244,
    assignee: 'Mira',
    notes: 'Waiting for underwriting note.',
  },
  {
    id: 'INV-1057',
    customer: 'Anya Goh',
    status: 'Active',
    channel: 'Admin',
    region: 'MY',
    premium: 389,
    assignee: 'Jia',
    notes: 'Preferred customer, fast-track approved.',
  },
  {
    id: 'INV-1058',
    customer: 'Rizal Putra',
    status: 'Expired',
    channel: 'Agent',
    region: 'TH',
    premium: 133,
    assignee: 'Anis',
    notes: 'Renewal declined by customer.',
  },
  {
    id: 'INV-1059',
    customer: 'Jia Wen',
    status: 'Active',
    channel: 'Portal',
    region: 'SG',
    premium: 276,
    assignee: 'Nur',
    notes: 'Document pack downloaded today.',
  },
];

function createLargeInvoices(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const template = invoices[index % invoices.length]!;

    return {
      ...template,
      id: `INV-${2000 + index}`,
      customer: `${template.customer} ${index + 1}`,
      premium: template.premium + (index % 9) * 17,
    } satisfies InvoiceRow;
  });
}

const largeInvoices = createLargeInvoices(240);
const scrollInvoices = createLargeInvoices(64);
const defaultPageSizeOptions = [4, 6, 10];
const facetedFilter = dataTableFacetedFilterFn as ColumnDef<InvoiceRow>['filterFn'];
const fuzzyGlobalFilter = dataTableFuzzyFilterFn as NonNullable<
  DataTableOptions<InvoiceRow>['globalFilterFn']
>;

const invoiceColumns: ColumnDef<InvoiceRow>[] = [
  {
    accessorKey: 'id',
    header: 'Invoice',
    enableHiding: false,
    size: 120,
    cell: ({ row }) => (
      <Box as="span" className="font-medium">
        {row.original.id}
      </Box>
    ),
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    size: 180,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: facetedFilter,
    aggregationFn: 'count',
    size: 120,
    aggregatedCell: ({ row }) => <Box as="span">{row.subRows.length} invoices</Box>,
  },
  {
    accessorKey: 'channel',
    header: 'Channel',
    filterFn: facetedFilter,
    size: 120,
  },
  {
    accessorKey: 'region',
    header: 'Region',
    filterFn: facetedFilter,
    size: 100,
  },
  {
    accessorKey: 'assignee',
    header: 'Owner',
    size: 140,
  },
  {
    accessorKey: 'premium',
    header: 'Premium',
    aggregationFn: 'sum',
    size: 140,
    cell: ({ row }) => (
      <Box as="span" className="tabular-nums">
        RM {row.original.premium.toFixed(2)}
      </Box>
    ),
    aggregatedCell: ({ getValue }) => (
      <Box as="span" className="font-medium tabular-nums">
        RM {Number(getValue() ?? 0).toFixed(2)}
      </Box>
    ),
  },
];
const wideInvoiceColumns: ColumnDef<InvoiceRow>[] = [
  ...invoiceColumns,
  {
    accessorKey: 'notes',
    header: 'Notes',
    size: 320,
  },
];

const styledInvoiceColumns: ColumnDef<InvoiceRow>[] = [
  {
    accessorKey: 'customer',
    header: 'Customer',
    size: 180,
    meta: {
      cellClassName: 'font-medium',
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 120,
  },
  {
    accessorKey: 'region',
    header: 'Region',
    size: 100,
  },
  {
    accessorKey: 'premium',
    header: 'Premium',
    size: 140,
    meta: {
      headerCellClassName: 'text-right',
      cellClassName: 'text-right',
    },
    cell: ({ row }) => (
      <Box as="span" className="tabular-nums">
        RM {row.original.premium.toFixed(2)}
      </Box>
    ),
  },
];

function createSelectionColumn(): ColumnDef<InvoiceRow> {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
        }
        onCheckedChange={(checked) => {
          table.toggleAllPageRowsSelected(Boolean(checked));
        }}
      />
    ),
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableGrouping: false,
    enableHiding: false,
    enableSorting: false,
    size: 56,
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.customer}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => {
          row.toggleSelected(Boolean(checked));
        }}
      />
    ),
  };
}

function createExpandColumn(): ColumnDef<InvoiceRow> {
  return {
    id: 'detail-toggle',
    header: '',
    enableSorting: false,
    enableHiding: false,
    size: 120,
    cell: ({ row }) => (
      <Button size="sm" variant="ghost" onClick={row.getToggleExpandedHandler()}>
        {row.getIsExpanded() ? 'Hide notes' : 'Show notes'}
      </Button>
    ),
  };
}

function setPinnedRow(
  table: DataTableInstance<InvoiceRow>,
  rowId: string,
  position: false | 'top' | 'bottom',
) {
  table.setRowPinning((current) => {
    const nextTop = (current.top ?? []).filter((value) => value !== rowId);
    const nextBottom = (current.bottom ?? []).filter((value) => value !== rowId);

    if (position === 'top') {
      return {
        top: [rowId, ...nextTop],
        bottom: nextBottom,
      } satisfies RowPinningState;
    }

    if (position === 'bottom') {
      return {
        top: nextTop,
        bottom: [...nextBottom, rowId],
      } satisfies RowPinningState;
    }

    return {
      top: nextTop,
      bottom: nextBottom,
    } satisfies RowPinningState;
  });
}

function createRowPinningColumn(): ColumnDef<InvoiceRow> {
  return {
    id: 'pin',
    header: 'Pin',
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    size: 272,
    minSize: 272,
    cell: ({ row, table }) => (
      <Box className="flex min-w-[252px] items-center gap-1.5 whitespace-nowrap">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setPinnedRow(table as DataTableInstance<InvoiceRow>, row.id, 'top');
          }}
        >
          Top
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setPinnedRow(table as DataTableInstance<InvoiceRow>, row.id, 'bottom');
          }}
        >
          Bottom
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setPinnedRow(table as DataTableInstance<InvoiceRow>, row.id, false);
          }}
        >
          Clear
        </Button>
      </Box>
    ),
  };
}

function NotesPanel({ row }: { row: InvoiceRow }) {
  return (
    <Box className="grid gap-2 md:grid-cols-[160px_1fr]">
      <Box
        as="span"
        className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
      >
        Underwriting Note
      </Box>
      <Box as="p" className="text-sm leading-6 text-foreground">
        {row.notes}
      </Box>
    </Box>
  );
}

function StoryHint({ children }: { children: React.ReactNode }) {
  return (
    <Box className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm leading-6 text-muted-foreground">
      {children}
    </Box>
  );
}

function GlobalFacetPanel({
  suggestions,
  premiumRange,
}: {
  suggestions: Array<{ label: string; count: number }>;
  premiumRange?: [number, number];
}) {
  return (
    <Box className="grid gap-4 rounded-lg border border-border bg-muted/20 p-4">
      <Box>
        <Box as="h3" className="text-sm font-semibold text-foreground">
          Global facet intelligence
        </Box>
        <Box as="p" className="mt-1 text-sm leading-6 text-muted-foreground">
          Unlike column faceting, global faceting derives one suggestion pool across every globally
          searchable column. It is useful for autocomplete, search hints, and derived global ranges.
        </Box>
      </Box>
      <Box>
        <Box
          as="p"
          className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
        >
          Autocomplete suggestions
        </Box>
        <Box className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <Box
              key={suggestion.label}
              as="span"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground"
            >
              <Box as="span">{suggestion.label}</Box>
              <Box
                as="span"
                className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {suggestion.count}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {premiumRange ? (
        <Box>
          <Box
            as="p"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            Global numeric range
          </Box>
          <Box as="p" className="mt-2 text-sm text-foreground">
            Premium values currently span RM {premiumRange[0].toFixed(2)} to RM{' '}
            {premiumRange[1].toFixed(2)}.
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}

const meta = {
  title: 'Data Display/DataTable',
  component: DataTable as React.ComponentType<object>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Capability-first shared DataTable foundation built on TanStack Table v8. Each story isolates one major feature so consumers can evaluate the shared contract one behavior at a time.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'shadow'],
    },
    renderToolbar: { control: false },
    renderPagination: { control: false },
    renderStatus: { control: false },
    renderExpandedContent: { control: false },
    emptyState: { control: false },
    getRowClassName: { control: false },
    loadingState: { control: false },
    state: { control: false },
    defaultState: { control: false },
    onStateChange: { control: false },
    pagination: { control: false },
    tableOptions: { control: false },
    table: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const SurfaceVariants: Story = {
  render: () => {
    const outlineTable = useDataTable({
      data: invoices.slice(0, 6),
      columns: invoiceColumns,
      defaultState: {
        pagination: {
          pageIndex: 0,
          pageSize: 6,
        },
      },
      tableOptions: {
        getRowId: (row) => row.id,
      },
    });
    const shadowTable = useDataTable({
      data: invoices.slice(0, 6),
      columns: invoiceColumns,
      defaultState: {
        pagination: {
          pageIndex: 0,
          pageSize: 6,
        },
      },
      tableOptions: {
        getRowId: (row) => row.id,
      },
    });

    return (
      <Box className="grid gap-6 xl:grid-cols-2">
        <Box className="space-y-3">
          <Box as="h3" className="text-sm font-semibold tracking-tight text-foreground">
            Outline
          </Box>
          <DataTable table={outlineTable} variant="outline" />
        </Box>
        <Box className="space-y-3">
          <Box as="h3" className="text-sm font-semibold tracking-tight text-foreground">
            Shadow
          </Box>
          <DataTable table={shadowTable} variant="shadow" />
        </Box>
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Compares the normalized default outline viewport against the explicit shadow viewport on the actual DataTable shell.',
      },
    },
  },
};

function SortingExample() {
  const table = useDataTable({
    data: invoices,
    columns: invoiceColumns,
    defaultState: {
      sorting: [
        { id: 'status', desc: false },
        { id: 'premium', desc: true },
      ],
      pagination: {
        pageIndex: 0,
        pageSize: 6,
      },
    },
    tableOptions: {
      enableMultiSort: true,
      getRowId: (row) => row.id,
    },
  });

  return (
    <DataTable
      table={table}
      renderToolbar={() => (
        <DataTableToolbar
          actions={
            <Box as="span" className="text-sm text-muted-foreground">
              Shift-click a second sortable header to stack sort order.
            </Box>
          }
        />
      )}
    />
  );
}

function ColumnOrderingExample() {
  const table = useDataTable({
    data: invoices,
    columns: invoiceColumns,
    defaultState: {
      pagination: {
        pageIndex: 0,
        pageSize: 6,
      },
    },
    tableOptions: {
      getRowId: (row) => row.id,
    },
  });

  return (
    <DataTable
      table={table}
      renderToolbar={(currentTable) => (
        <DataTableToolbar
          actions={
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  currentTable.setColumnOrder([
                    'customer',
                    'id',
                    'status',
                    'region',
                    'channel',
                    'premium',
                    'assignee',
                  ]);
                }}
              >
                Customer-first layout
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  currentTable.setColumnOrder([
                    'region',
                    'channel',
                    'status',
                    'customer',
                    'assignee',
                    'premium',
                    'id',
                  ]);
                }}
              >
                Operations layout
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  currentTable.resetColumnOrder();
                }}
              >
                Reset order
              </Button>
            </>
          }
        />
      )}
    />
  );
}

function ColumnPinningExample() {
  const table = useDataTable({
    data: invoices,
    columns: invoiceColumns,
    defaultState: {
      columnPinning: {
        left: ['customer'],
        right: ['premium'],
      },
      pagination: {
        pageIndex: 0,
        pageSize: 6,
      },
    },
    tableOptions: {
      enableColumnPinning: true,
      enableColumnResizing: true,
      defaultColumn: {
        minSize: 110,
        size: 150,
      },
      getRowId: (row) => row.id,
    },
  });

  return (
    <Box className="grid max-w-[780px] gap-4">
      <StoryHint>
        Scroll horizontally. `Customer` should stay pinned on the left and `Premium` on the right.
      </StoryHint>
      <DataTable
        table={table}
        layout={{ stickyHeader: true, maxBodyHeight: 320 }}
        renderToolbar={(currentTable) => (
          <DataTableToolbar
            actions={
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    currentTable.setColumnPinning({ left: ['id', 'customer'], right: ['premium'] });
                  }}
                >
                  Pin invoice + customer
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    currentTable.resetColumnPinning();
                  }}
                >
                  Reset pinning
                </Button>
              </>
            }
          />
        )}
      />
    </Box>
  );
}

function ColumnSizingExample() {
  const table = useDataTable({
    data: invoices,
    columns: invoiceColumns,
    defaultState: {
      columnSizing: {
        customer: 240,
        premium: 180,
      },
      pagination: {
        pageIndex: 0,
        pageSize: 6,
      },
    },
    tableOptions: {
      enableColumnResizing: true,
      columnResizeMode: 'onChange',
      defaultColumn: {
        minSize: 96,
        size: 140,
      },
      getRowId: (row) => row.id,
    },
  });

  return (
    <DataTable
      table={table}
      renderToolbar={(currentTable) => (
        <DataTableToolbar
          actions={
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                currentTable.resetColumnSizing();
              }}
            >
              Reset sizes
            </Button>
          }
        />
      )}
    />
  );
}

function ColumnVisibilityExample() {
  const table = useDataTable({
    data: invoices,
    columns: invoiceColumns,
    defaultState: {
      pagination: {
        pageIndex: 0,
        pageSize: 6,
      },
    },
    tableOptions: {
      getRowId: (row) => row.id,
    },
  });

  return (
    <DataTable
      table={table}
      renderToolbar={(currentTable) => (
        <DataTableToolbar actions={<DataTableViewOptions table={currentTable} />} />
      )}
    />
  );
}

function ColumnFilteringExample() {
  const table = useDataTable({
    data: invoices,
    columns: invoiceColumns,
    defaultState: {
      pagination: {
        pageIndex: 0,
        pageSize: 6,
      },
    },
    tableOptions: {
      enableColumnFilters: true,
      getRowId: (row) => row.id,
    },
  });

  return (
    <DataTable
      table={table}
      renderToolbar={(currentTable) => (
        <DataTableToolbar>
          <DataTableColumnFilter
            table={currentTable}
            columnId="customer"
            placeholder="Filter customer names..."
          />
          <DataTableColumnFilter
            table={currentTable}
            columnId="assignee"
            placeholder="Filter owners..."
          />
        </DataTableToolbar>
      )}
    />
  );
}

function GlobalFilteringExample() {
  const table = useDataTable({
    data: invoices,
    columns: invoiceColumns,
    defaultState: {
      globalFilter: 'Alica',
      pagination: {
        pageIndex: 0,
        pageSize: 6,
      },
    },
    tableOptions: {
      enableGlobalFilter: true,
      getRowId: (row) => row.id,
    },
  });

  return (
    <Box className="grid gap-4">
      <StoryHint>
        This story uses the same approximate query as `FuzzyFiltering`, but keeps the default strict
        substring matcher. It should return no rows.
      </StoryHint>
      <DataTable
        table={table}
        renderToolbar={(currentTable) => (
          <DataTableToolbar>
            <DataTableSearch
              table={currentTable}
              placeholder="Search strictly across all columns..."
            />
          </DataTableToolbar>
        )}
      />
    </Box>
  );
}

function FuzzyFilteringExample() {
  const table = useDataTable({
    data: invoices,
    columns: invoiceColumns,
    defaultState: {
      globalFilter: 'Alica',
      pagination: {
        pageIndex: 0,
        pageSize: 6,
      },
    },
    tableOptions: {
      enableGlobalFilter: true,
      getRowId: (row) => row.id,
      globalFilterFn: fuzzyGlobalFilter,
    },
  });

  return (
    <Box className="grid gap-4">
      <StoryHint>
        This story starts with the same `Alica` query, but uses the shared fuzzy filter. Approximate
        matches such as `Alica`, `Dnl`, or `Rzal` should still resolve.
      </StoryHint>
      <DataTable
        table={table}
        renderToolbar={(currentTable) => (
          <DataTableToolbar>
            <DataTableSearch
              table={currentTable}
              placeholder="Search with approximate matches..."
            />
          </DataTableToolbar>
        )}
      />
    </Box>
  );
}

function ColumnFacetingExample() {
  const table = useDataTable({
    data: invoices,
    columns: invoiceColumns,
    defaultState: {
      pagination: {
        pageIndex: 0,
        pageSize: 6,
      },
    },
    tableOptions: {
      getRowId: (row) => row.id,
    },
  });

  return (
    <DataTable
      table={table}
      renderToolbar={(currentTable) => (
        <DataTableToolbar>
          <DataTableFacetedFilter table={currentTable} columnId="status" title="Status" />
          <DataTableFacetedFilter table={currentTable} columnId="channel" title="Channel" />
          <DataTableFacetedFilter table={currentTable} columnId="region" title="Region" />
        </DataTableToolbar>
      )}
    />
  );
}

function GlobalFacetingExample() {
  const table = useDataTable({
    data: invoices,
    columns: invoiceColumns,
    defaultState: {
      pagination: {
        pageIndex: 0,
        pageSize: 6,
      },
    },
    tableOptions: {
      enableGlobalFilter: true,
      getRowId: (row) => row.id,
    },
  });

  const facetEntries = Array.from(table.getGlobalFacetedUniqueValues().entries())
    .map(([label, count]) => ({ label: String(label), count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))
    .slice(0, 10);
  const premiumRange = table.getGlobalFacetedMinMaxValues();

  return (
    <Box className="grid gap-4">
      <DataTable
        table={table}
        renderToolbar={(currentTable) => (
          <DataTableToolbar>
            <DataTableSearch
              table={currentTable}
              list="invoice-global-facet-suggestions"
              placeholder="Search with global facet suggestions..."
            />
          </DataTableToolbar>
        )}
      />
      <datalist id="invoice-global-facet-suggestions">
        {facetEntries.map((entry) => (
          <option key={entry.label} value={entry.label} />
        ))}
      </datalist>
      <GlobalFacetPanel
        suggestions={facetEntries}
        premiumRange={
          Array.isArray(premiumRange) && premiumRange.length === 2
            ? [Number(premiumRange[0]), Number(premiumRange[1])]
            : undefined
        }
      />
    </Box>
  );
}

function GroupingExample() {
  const table = useDataTable({
    data: invoices,
    columns: invoiceColumns,
    defaultState: {
      grouping: ['status'],
      expanded: true,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    tableOptions: {
      enableGrouping: true,
      getRowId: (row) => row.id,
    },
  });

  return (
    <DataTable
      table={table}
      renderToolbar={(currentTable) => (
        <DataTableToolbar
          actions={
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  currentTable.setGrouping(['status']);
                }}
              >
                Group by status
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  currentTable.setGrouping(['region']);
                }}
              >
                Group by region
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  currentTable.setGrouping([]);
                }}
              >
                Clear grouping
              </Button>
            </>
          }
        />
      )}
    />
  );
}

function ExpandingExample() {
  const columns = React.useMemo<ColumnDef<InvoiceRow>[]>(
    () => [createExpandColumn(), ...invoiceColumns],
    [],
  );
  const table = useDataTable({
    data: invoices,
    columns,
    defaultState: {
      pagination: {
        pageIndex: 0,
        pageSize: 4,
      },
    },
    tableOptions: {
      enableExpanding: true,
      getRowCanExpand: () => true,
      getRowId: (row) => row.id,
    },
  });

  return (
    <DataTable table={table} renderExpandedContent={(row) => <NotesPanel row={row.original} />} />
  );
}

function PaginationExample() {
  return (
    <DataTable<InvoiceRow, unknown>
      columns={invoiceColumns}
      data={invoices}
      defaultState={{
        pagination: {
          pageIndex: 0,
          pageSize: 4,
        },
      }}
      pageSizeOptions={defaultPageSizeOptions}
      tableOptions={{
        getRowId: (row) => row.id,
      }}
    />
  );
}

function RowSelectionExample() {
  const columns = React.useMemo<ColumnDef<InvoiceRow>[]>(
    () => [createSelectionColumn(), ...invoiceColumns],
    [],
  );
  const table = useDataTable({
    data: invoices,
    columns,
    defaultState: {
      pagination: {
        pageIndex: 0,
        pageSize: 6,
      },
    },
    tableOptions: {
      enableRowSelection: true,
      getRowId: (row) => row.id,
    },
  });

  return (
    <DataTable
      table={table}
      renderToolbar={(currentTable) => (
        <DataTableToolbar>
          <DataTableSelectionSummary table={currentTable} />
        </DataTableToolbar>
      )}
    />
  );
}

function RowPinningExample() {
  const columns = React.useMemo<ColumnDef<InvoiceRow>[]>(
    () => [createRowPinningColumn(), ...wideInvoiceColumns],
    [],
  );
  const table = useDataTable({
    data: invoices,
    columns,
    defaultState: {
      rowPinning: {
        top: ['INV-1049'],
        bottom: ['INV-1058'],
      },
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
    tableOptions: {
      enableRowPinning: true,
      getRowId: (row) => row.id,
      keepPinnedRows: true,
    },
  });

  return (
    <Box className="grid gap-4">
      <StoryHint>
        `Top` prepends the clicked row into the pinned-top section, `Bottom` appends it into the
        pinned-bottom section, and `Clear` returns it to the center rows.
      </StoryHint>
      <DataTable
        table={table}
        renderToolbar={(currentTable) => (
          <DataTableToolbar
            actions={
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  currentTable.resetRowPinning();
                }}
              >
                Reset pinned rows
              </Button>
            }
          />
        )}
      />
    </Box>
  );
}

function StylingHooksExample() {
  return (
    <Box className="grid gap-4">
      <StoryHint>
        This isolates the shared styling surfaces: `getRowClassName` for row-level treatment and
        `columnDef.meta.headerCellClassName` / `columnDef.meta.cellClassName` for header and body
        cells.
      </StoryHint>
      <DataTable<InvoiceRow, unknown>
        columns={styledInvoiceColumns}
        data={invoices}
        defaultState={{
          pagination: {
            pageIndex: 0,
            pageSize: 6,
          },
        }}
        getRowClassName={({ row }) =>
          row.original.status === 'Pending' ? 'bg-muted/30' : undefined
        }
        tableOptions={{
          getRowId: (row) => row.id,
        }}
      />
    </Box>
  );
}

function StickyHeaderExample() {
  const table = useDataTable({
    data: scrollInvoices,
    columns: wideInvoiceColumns,
    defaultState: {
      pagination: {
        pageIndex: 0,
        pageSize: scrollInvoices.length,
      },
    },
    tableOptions: {
      enableGlobalFilter: true,
      getRowId: (row) => row.id,
    },
  });

  return (
    <Box className="grid w-full gap-4">
      <StoryHint>
        Scroll vertically. The header should remain attached to the top of the viewport.
      </StoryHint>
      <DataTable
        table={table}
        layout={{ stickyHeader: true, maxBodyHeight: 320 }}
        renderToolbar={(currentTable) => (
          <DataTableToolbar>
            <DataTableSearch
              table={currentTable}
              placeholder="Search while the header stays sticky..."
            />
          </DataTableToolbar>
        )}
      />
    </Box>
  );
}

function StickyFooterExample() {
  const table = useDataTable({
    data: scrollInvoices,
    columns: invoiceColumns,
    defaultState: {
      pagination: {
        pageIndex: 0,
        pageSize: scrollInvoices.length,
      },
    },
    tableOptions: {
      getRowId: (row) => row.id,
    },
  });

  return (
    <Box className="grid w-full gap-4">
      <StoryHint>
        Scroll vertically. The footer summary should stay pinned to the bottom edge of the viewport.
      </StoryHint>
      <DataTable
        table={table}
        layout={{ stickyFooter: true, maxBodyHeight: 320 }}
        renderFooter={(currentTable) => {
          const filteredTotal = currentTable
            .getFilteredRowModel()
            .rows.reduce((sum, row) => sum + row.original.premium, 0);

          return (
            <TableRow>
              <TableCell
                colSpan={currentTable.getVisibleLeafColumns().length}
                className="bg-background text-sm font-medium"
              >
                Filtered premium total: RM {filteredTotal.toFixed(2)}
              </TableCell>
            </TableRow>
          );
        }}
      />
    </Box>
  );
}

function VirtualizationExample() {
  const table = useDataTable({
    data: largeInvoices,
    columns: wideInvoiceColumns,
    defaultState: {
      pagination: {
        pageIndex: 0,
        pageSize: largeInvoices.length,
      },
    },
    tableOptions: {
      enableGlobalFilter: true,
      enableColumnPinning: true,
      getRowId: (row) => row.id,
    },
  });

  return (
    <Box className="grid gap-4">
      <StoryHint>
        This uses the shared `DataTableVirtualized` companion with TanStack Virtual, while
        preserving the same shared shell, toolbar composition, and sticky header behavior.
      </StoryHint>
      <DataTableVirtualized
        table={table}
        height={420}
        estimateRowHeight={52}
        layout={{ stickyHeader: true }}
        renderToolbar={(currentTable) => (
          <DataTableToolbar>
            <DataTableSearch
              table={currentTable}
              placeholder="Search the large virtualized dataset..."
            />
          </DataTableToolbar>
        )}
      />
    </Box>
  );
}

export const Sorting: Story = {
  render: () => <SortingExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('columnheader', { name: /status/i })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await expect(canvas.getByRole('columnheader', { name: /premium/i })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
  },
};

export const ColumnOrdering: Story = {
  render: () => <ColumnOrderingExample />,
};

export const ColumnPinning: Story = {
  render: () => <ColumnPinningExample />,
};

export const ColumnSizing: Story = {
  render: () => <ColumnSizingExample />,
};

export const ColumnVisibility: Story = {
  render: () => <ColumnVisibilityExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /columns/i }));
    await userEvent.click(screen.getByRole('menuitemcheckbox', { name: /channel/i }));
    await expect(canvas.queryByRole('columnheader', { name: /channel/i })).not.toBeInTheDocument();
  },
};

export const ColumnFiltering: Story = {
  render: () => <ColumnFilteringExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: /filter customer names/i }), 'Clara');
    await expect(canvas.getByText('Clara Lim')).toBeInTheDocument();
    await expect(canvas.queryByText('Marcus Lim')).not.toBeInTheDocument();
  },
};

export const GlobalFiltering: Story = {
  render: () => <GlobalFilteringExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByDisplayValue('Alica')).toBeInTheDocument();
    await expect(canvas.getByText(/no matching rows/i)).toBeInTheDocument();
    await expect(canvas.queryByText('Alicia Tan')).not.toBeInTheDocument();
  },
};

export const FuzzyFiltering: Story = {
  render: () => <FuzzyFilteringExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByDisplayValue('Alica')).toBeInTheDocument();
    await expect(canvas.getByText('Alicia Tan')).toBeInTheDocument();
  },
};

export const ColumnFaceting: Story = {
  render: () => <ColumnFacetingExample />,
};

export const GlobalFaceting: Story = {
  render: () => <GlobalFacetingExample />,
};

export const Grouping: Story = {
  render: () => <GroupingExample />,
};

export const Expanding: Story = {
  render: () => <ExpandingExample />,
};

export const Pagination: Story = {
  render: () => <PaginationExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /go to next page/i }));
    await expect(canvas.getByText('Nurul Rahman')).toBeInTheDocument();
  },
};

export const RowSelection: Story = {
  render: () => <RowSelectionExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: /select alicia tan/i }));
    await expect(canvas.getByText(/1 of 12 visible row selected/i)).toBeInTheDocument();
  },
};

export const RowPinning: Story = {
  render: () => <RowPinningExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getAllByRole('button', { name: /^top$/i })[1]!);
    const rows = canvas.getAllByRole('row');
    await expect(rows[1]).toHaveTextContent('Marcus Lim');
  },
};

export const StylingHooks: Story = {
  render: () => <StylingHooksExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const premiumCell = canvas.getByText('RM 215.00').closest('td');
    const pendingRow = canvas.getByText('Marcus Lim').closest('tr');

    await expect(premiumCell).not.toBeNull();
    await expect(pendingRow).not.toBeNull();
    await expect(canvas.getByRole('columnheader', { name: /premium/i })).toHaveClass('text-right');
    await expect(premiumCell).toHaveClass('text-right');
    await expect(pendingRow).toHaveClass('bg-muted/30');
  },
};

export const StickyHeader: Story = {
  render: () => <StickyHeaderExample />,
};

export const StickyFooter: Story = {
  render: () => <StickyFooterExample />,
};

export const Virtualization: Story = {
  render: () => <VirtualizationExample />,
};
