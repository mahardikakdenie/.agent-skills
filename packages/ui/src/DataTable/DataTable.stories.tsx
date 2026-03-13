import type * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown } from 'lucide-react';
import { expect, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { DataTable, DataTableToolbar } from './DataTable';
import type { ColumnDef, DataTableProps } from './DataTable.types';

type InvoiceRow = {
  id: string;
  customer: string;
  status: 'Active' | 'Pending' | 'Expired';
  channel: 'Portal' | 'Agent' | 'Admin';
  premium: number;
};

const invoices: InvoiceRow[] = [
  { id: 'INV-1048', customer: 'Marcus Lim', status: 'Pending', channel: 'Portal', premium: 215 },
  { id: 'INV-1049', customer: 'Alicia Tan', status: 'Active', channel: 'Agent', premium: 420 },
  { id: 'INV-1050', customer: 'Farah Nordin', status: 'Expired', channel: 'Admin', premium: 96 },
  { id: 'INV-1051', customer: 'Daniel Khoo', status: 'Active', channel: 'Portal', premium: 188 },
  { id: 'INV-1052', customer: 'Nurul Rahman', status: 'Pending', channel: 'Agent', premium: 260 },
  { id: 'INV-1053', customer: 'Siti Ong', status: 'Active', channel: 'Admin', premium: 512 },
  { id: 'INV-1054', customer: 'Hafiz Ibrahim', status: 'Expired', channel: 'Portal', premium: 174 },
  { id: 'INV-1055', customer: 'Clara Lim', status: 'Active', channel: 'Agent', premium: 302 },
  { id: 'INV-1056', customer: 'Budi Santoso', status: 'Pending', channel: 'Portal', premium: 244 },
  { id: 'INV-1057', customer: 'Anya Goh', status: 'Active', channel: 'Admin', premium: 389 },
  { id: 'INV-1058', customer: 'Rizal Putra', status: 'Expired', channel: 'Agent', premium: 133 },
  { id: 'INV-1059', customer: 'Jia Wen', status: 'Active', channel: 'Portal', premium: 276 },
];

const columns: ColumnDef<InvoiceRow>[] = [
  {
    accessorKey: 'id',
    header: 'Invoice',
    cell: ({ row }) => <Box as="span" className="font-medium">{row.original.id}</Box>,
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'channel',
    header: 'Channel',
  },
  {
    accessorKey: 'premium',
    header: 'Premium',
    cell: ({ row }) => (
      <Box as="span" className="tabular-nums">
        RM {row.original.premium.toFixed(2)}
      </Box>
    ),
  },
];

const meta = {
  title: 'Data Display/DataTable',
  component: DataTable as React.ComponentType<DataTableProps<InvoiceRow, unknown>>,
  tags: ['autodocs'],
  args: {
    data: invoices,
    columns,
    loading: false,
    pageSizeOptions: [5, 10, 20],
  },
  argTypes: {
    data: { control: 'object' },
    columns: { control: 'object' },
    caption: { control: 'text' },
    loading: { control: 'boolean' },
    emptyState: { control: false },
    loadingState: { control: false },
    renderToolbar: { control: false },
    pagination: { control: false },
    pageSizeOptions: { control: 'object' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Headless data table composed from TanStack Table v8 plus the shared Table and Pagination primitives.',
      },
    },
  },
} satisfies Meta<React.ComponentType<DataTableProps<InvoiceRow, unknown>>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline shared data-table shell with client-side pagination and no persistent caption copy.',
      },
    },
  },
  render: (args) => <DataTable<InvoiceRow, unknown> {...args} />,
};

export const Sorting: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Sortable headers toggle ascending order through the shared header buttons.',
      },
    },
  },
  render: (args) => <DataTable<InvoiceRow, unknown> {...args} data={invoices.slice(0, 5)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const customerSortButton = canvas.getByRole('button', { name: /customer/i });

    await userEvent.click(customerSortButton);

    const rows = canvas.getAllByRole('row');
    const firstDataRow = rows[1];

    if (!firstDataRow) {
      throw new Error('Expected a first data row after sorting.');
    }

    await expect(within(firstDataRow).getByText('Alicia Tan')).toBeInTheDocument();
  },
};

export const Filtering: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Uses the shared DataTableToolbar helper to drive one-column filtering and column visibility actions.',
      },
    },
  },
  render: (args) => (
    <DataTable<InvoiceRow, unknown>
      {...args}
      renderToolbar={(table) => (
        <DataTableToolbar
          actions={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  rightIcon={<ChevronDown aria-hidden="true" className="h-4 w-4" />}
                  variant="outline"
                >
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllLeafColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(checked) => {
                        column.toggleVisibility(checked);
                      }}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          }
          filterColumnId="customer"
          filterPlaceholder="Filter customers..."
          table={table}
        />
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const filterInput = canvas.getByRole('textbox', { name: /filter customers/i });

    await userEvent.type(filterInput, 'Alicia');

    await expect(canvas.getByText('Alicia Tan')).toBeInTheDocument();
    await expect(canvas.queryByText('Marcus Lim')).not.toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Default empty state uses a restrained icon, short heading, and supporting line so the table feels clean without looking empty or ornamental.',
      },
    },
  },
  render: (args) => <DataTable<InvoiceRow, unknown> {...args} />,
};

export const Pagination: Story = {
  args: {
    pagination: {
      pageSize: 5,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Client-side pagination with shared footer controls and page-size switching.',
      },
    },
  },
  render: (args) => <DataTable<InvoiceRow, unknown> {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nextButton = canvas.getByRole('button', { name: /go to next page/i });

    await userEvent.click(nextButton);

    await expect(canvas.getByText('INV-1053')).toBeInTheDocument();
  },
};

export const LoadingState: Story = {
  args: {
    data: [],
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Busy table state keeps the table structure visible with shared skeleton rows instead of collapsing to a spinner-only row.',
      },
    },
  },
  render: (args) => <DataTable<InvoiceRow, unknown> {...args} />,
};




