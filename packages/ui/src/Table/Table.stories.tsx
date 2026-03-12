import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { Box } from '../Box';
import { Checkbox } from '../Checkbox';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './Table';

const invoiceRows = [
  {
    id: 'INV-001',
    status: 'Paid',
    method: 'Credit card',
    amount: 'RM 250.00',
  },
  {
    id: 'INV-002',
    status: 'Pending',
    method: 'PayPal',
    amount: 'RM 150.00',
  },
  {
    id: 'INV-003',
    status: 'Unpaid',
    method: 'Bank transfer',
    amount: 'RM 350.00',
  },
  {
    id: 'INV-004',
    status: 'Paid',
    method: 'Online banking',
    amount: 'RM 450.00',
  },
] as const;

const policyRows = [
  {
    policyNumber: 'FS-102938',
    holder: 'Alicia Tan',
    plan: 'Family Secure Plus',
    renewal: '12 Mar 2026',
    premium: 'RM 420.00',
  },
  {
    policyNumber: 'FS-102939',
    holder: 'Marcus Lim',
    plan: 'Traveller Shield',
    renewal: '18 Mar 2026',
    premium: 'RM 180.00',
  },
  {
    policyNumber: 'FS-102940',
    holder: 'Nurul Rahman',
    plan: 'Pet Care Annual',
    renewal: '25 Mar 2026',
    premium: 'RM 96.00',
  },
] as const;

type QueueRow = {
  id: string;
  holder: string;
  plan: string;
  premium: string;
  selected: boolean;
};

const queueRows: QueueRow[] = [
  {
    id: 'RQ-1048',
    holder: 'Anya Goh',
    plan: 'Motor Plus',
    premium: 'RM 205.00',
    selected: false,
  },
  {
    id: 'RQ-1049',
    holder: 'Danish Lee',
    plan: 'Family Secure Plus',
    premium: 'RM 420.00',
    selected: true,
  },
  {
    id: 'RQ-1050',
    holder: 'Farah Nordin',
    plan: 'Pet Care Annual',
    premium: 'RM 96.00',
    selected: false,
  },
];

const activityRows = Array.from({ length: 12 }, (_, index) => ({
  id: `AC-${String(index + 1).padStart(3, '0')}`,
  holder: [
    'Alicia Tan',
    'Marcus Lim',
    'Nurul Rahman',
    'Daniel Khoo',
    'Sara Ong',
    'Hafiz Ibrahim',
  ][index % 6],
  activity: [
    'Renewal reviewed',
    'Policy updated',
    'Premium adjusted',
    'Claim note added',
  ][index % 4],
  channel: ['Portal', 'Agent', 'Admin'][index % 3],
  date: `${String((index % 28) + 1).padStart(2, '0')} Mar 2026`,
  amount: `RM ${(120 + index * 17).toFixed(2)}`,
}));

function SelectableQueueTable() {
  const [rows, setRows] = React.useState(queueRows);

  const selectedCount = rows.filter((row) => row.selected).length;
  const allSelected = selectedCount === rows.length;
  const someSelected = selectedCount > 0 && !allSelected;
  const selectAllState = allSelected ? true : someSelected ? 'indeterminate' : false;

  const handleSelectAll = (nextChecked: boolean | 'indeterminate') => {
    const shouldSelect = nextChecked !== false;

    setRows((currentRows) =>
      currentRows.map((row) => ({
        ...row,
        selected: shouldSelect,
      })),
    );
  };

  const handleRowToggle = (rowId: string, nextChecked: boolean | 'indeterminate') => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              selected: nextChecked !== false,
            }
          : row,
      ),
    );
  };

  return (
    <Box className="overflow-hidden rounded-lg border border-border">
      <Table aria-label="Selectable renewal queue">
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-12">
              <Checkbox
                checked={selectAllState}
                aria-label="Select all renewal rows"
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead scope="col">Queue ID</TableHead>
            <TableHead scope="col">Holder</TableHead>
            <TableHead scope="col">Plan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} data-state={row.selected ? 'selected' : undefined}>
              <TableCell>
                <Checkbox
                  checked={row.selected}
                  aria-label={`Select row ${row.id}`}
                  onCheckedChange={(nextChecked) => handleRowToggle(row.id, nextChecked)}
                />
              </TableCell>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.holder}</TableCell>
              <TableCell>{row.plan}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

const meta = {
  title: 'Data Display/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Structural table primitive with Box-authored semantic wrappers for table, sections, rows, headers, cells, footer, and caption. Sorting, pagination, search, and empty-state orchestration stay outside this shared contract.',
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Box className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableCaption>A list of recently processed invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-[140px]">
              Invoice
            </TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col">Payment method</TableHead>
            <TableHead scope="col" className="text-right">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoiceRows.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>{invoice.method}</TableCell>
              <TableCell className="text-right">{invoice.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">RM 1,200.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Baseline structural table with caption, header, body, and footer composition for the later DataTable layer to build upon.',
      },
    },
  },
};

export const FooterSummary: Story = {
  render: () => (
    <Box className="overflow-hidden rounded-lg border border-border">
      <Table aria-label="Commission summary">
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Channel</TableHead>
            <TableHead scope="col">Policies</TableHead>
            <TableHead scope="col" className="text-right">
              Commission
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Agency</TableCell>
            <TableCell>14</TableCell>
            <TableCell className="text-right">RM 2,180.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Direct</TableCell>
            <TableCell>6</TableCell>
            <TableCell className="text-right">RM 940.00</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Grand total</TableCell>
            <TableCell className="text-right">RM 3,120.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Isolates the semantic footer-summary case so totals and aggregate rows are covered independently from the basic table example.',
      },
    },
  },
};

export const RowHeader: Story = {
  render: () => (
    <Box className="overflow-hidden rounded-lg border border-border">
      <Table aria-label="Policy holder premium summary">
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Policy holder</TableHead>
            <TableHead scope="col">Plan</TableHead>
            <TableHead scope="col" className="text-right">
              Premium
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policyRows.map((policy) => (
            <TableRow key={policy.policyNumber}>
              <TableHead scope="row" className="font-medium text-foreground">
                {policy.holder}
              </TableHead>
              <TableCell>{policy.plan}</TableCell>
              <TableCell className="text-right">{policy.premium}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the row-header semantic path with TableHead scope="row" inside the body for accessible summary tables.',
      },
    },
  },
};

export const WithCheckboxCells: Story = {
  render: () => <SelectableQueueTable />,
  parameters: {
    docs: {
      description: {
        story:
          'Covers the checkbox-cell spacing hook with interactive row selection and a select-all header checkbox.',
      },
    },
  },
};

export const SelectedRow: Story = {
  render: () => (
    <Box className="overflow-hidden rounded-lg border border-border">
      <Table aria-label="Selected renewal queue rows">
        <TableCaption>The middle row is highlighted through data-state only.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Queue ID</TableHead>
            <TableHead scope="col">Holder</TableHead>
            <TableHead scope="col">Plan</TableHead>
            <TableHead scope="col" className="text-right">
              Premium
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queueRows.map((row) => (
            <TableRow key={row.id} data-state={row.selected ? 'selected' : undefined}>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.holder}</TableCell>
              <TableCell>{row.plan}</TableCell>
              <TableCell className="text-right">{row.premium}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Isolates the selected-row visual hook so the future DataTable layer has a clearly documented structural state to compose on.',
      },
    },
  },
};

export const Dense: Story = {
  render: () => (
    <Box className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="h-9 px-3 text-xs uppercase tracking-wide">
              Policy
            </TableHead>
            <TableHead scope="col" className="h-9 px-3 text-xs uppercase tracking-wide">
              Holder
            </TableHead>
            <TableHead scope="col" className="h-9 px-3 text-xs uppercase tracking-wide">
              Plan
            </TableHead>
            <TableHead
              scope="col"
              className="h-9 px-3 text-right text-xs uppercase tracking-wide"
            >
              Premium
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policyRows.map((policy) => (
            <TableRow key={policy.policyNumber}>
              <TableCell className="px-3 py-2 text-xs font-medium">{policy.policyNumber}</TableCell>
              <TableCell className="px-3 py-2 text-xs">{policy.holder}</TableCell>
              <TableCell className="px-3 py-2 text-xs">{policy.plan}</TableCell>
              <TableCell className="px-3 py-2 text-right text-xs">{policy.premium}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows the dense presentation path through composition instead of a dedicated shared density prop.',
      },
    },
  },
};

export const Empty: Story = {
  render: () => (
    <Box className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Reference</TableHead>
            <TableHead scope="col">Customer</TableHead>
            <TableHead scope="col">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
              No matching records were found for the current filters.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the recommended empty-state composition with one full-width body row rather than a shared empty prop.',
      },
    },
  },
};

export const HorizontalScrollable: Story = {
  render: () => (
    <Box className="max-w-xl overflow-x-auto rounded-lg border border-border">
      <Table className="min-w-[60rem]" aria-label="Horizontally scrollable renewal queue">
        <TableCaption>
          Wide datasets stay in a semantic table while the consumer owns the horizontal overflow shell.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-[140px]">
              Policy
            </TableHead>
            <TableHead scope="col">Holder</TableHead>
            <TableHead scope="col">Plan</TableHead>
            <TableHead scope="col">Renewal date</TableHead>
            <TableHead scope="col">Channel</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col" className="text-right">
              Premium
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policyRows.map((policy, index) => (
            <TableRow key={policy.policyNumber}>
              <TableCell className="font-medium">{policy.policyNumber}</TableCell>
              <TableCell>{policy.holder}</TableCell>
              <TableCell>{policy.plan}</TableCell>
              <TableCell>{policy.renewal}</TableCell>
              <TableCell>{['Portal', 'Agent', 'Admin'][index % 3]}</TableCell>
              <TableCell>{['Ready', 'Pending', 'Escalated'][index % 3]}</TableCell>
              <TableCell className="text-right">{policy.premium}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Covers the explicit horizontal-scroll composition path for wide column sets.',
      },
    },
  },
};

export const VerticalScrollable: Story = {
  render: () => (
    <Box className="max-h-72 overflow-y-auto rounded-lg border border-border">
      <Table aria-label="Vertically scrollable activity history">
        <TableCaption>
          Long histories can scroll vertically in a consumer-owned viewport while keeping semantic rows and cells.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="sticky top-0 bg-background">
              Activity ID
            </TableHead>
            <TableHead scope="col" className="sticky top-0 bg-background">
              Holder
            </TableHead>
            <TableHead scope="col" className="sticky top-0 bg-background">
              Activity
            </TableHead>
            <TableHead scope="col" className="sticky top-0 bg-background">
              Channel
            </TableHead>
            <TableHead scope="col" className="sticky top-0 bg-background">
              Date
            </TableHead>
            <TableHead scope="col" className="sticky top-0 bg-background text-right">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activityRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.holder}</TableCell>
              <TableCell>{row.activity}</TableCell>
              <TableCell>{row.channel}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell className="text-right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Covers the explicit vertical-scroll composition path for long row sets, including a consumer-owned sticky header treatment.',
      },
    },
  },
};

