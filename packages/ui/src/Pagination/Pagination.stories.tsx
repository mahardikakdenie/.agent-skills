import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Pagination } from './Pagination';
import type { PaginationProps } from './Pagination.types';

function ControlledPaginationStory({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  className,
  ...props
}: PaginationProps) {
  const [page, setPage] = React.useState(currentPage);
  const [size, setSize] = React.useState(pageSize);

  React.useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  React.useEffect(() => {
    setSize(pageSize);
  }, [pageSize]);

  return (
    <Box className="grid gap-3">
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={size}
        pageSizeOptions={pageSizeOptions}
        className={className}
        onPageChange={(nextPage) => {
          setPage(nextPage);
          onPageChange(nextPage);
        }}
        onPageSizeChange={
          onPageSizeChange
            ? (nextPageSize) => {
                setSize(nextPageSize);
                onPageSizeChange(nextPageSize);
              }
            : undefined
        }
        {...props}
      />
      <Box as="p" className="text-sm text-muted-foreground">
        Active page:{' '}
        <Box as="span" className="font-medium text-foreground tabular-nums">
          {page}
        </Box>
        {size !== undefined ? (
          <Box as="span">
            {' '}
            - Rows per page:{' '}
            <Box as="span" className="font-medium text-foreground tabular-nums">
              {size}
            </Box>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    currentPage: 4,
    totalPages: 12,
    onPageChange: fn(),
    pageSize: 20,
    onPageSizeChange: fn(),
    pageSizeOptions: [10, 20, 50],
  },
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1, step: 1 },
    },
    totalPages: {
      control: { type: 'number', min: 1, step: 1 },
    },
    pageSize: {
      control: { type: 'number', min: 1, step: 1 },
    },
    pageSizeOptions: {
      control: 'object',
    },
    onPageChange: {
      action: 'page changed',
    },
    onPageSizeChange: {
      action: 'page size changed',
    },
    className: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shared pagination shell with first, previous, next, and last controls, numeric page links, compact ellipsis behavior, and an optional page-size selector.',
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline numeric pagination with the optional rows-per-page selector visible.',
      },
    },
  },
};

export const WithPageSizeSelector: Story = {
  name: 'With page size selector',
  render: (args) => <ControlledPaginationStory {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates controlled page and page-size changes in a typical table or list footer.',
      },
    },
  },
};

export const Compact: Story = {
  render: (args) => (
    <Box className="max-w-md">
      <Pagination
        {...args}
        currentPage={48}
        totalPages={120}
        pageSize={undefined}
        onPageSizeChange={undefined}
        pageSizeOptions={undefined}
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the compact range behavior that replaces extra public compact-mode props with automatic ellipsis handling.',
      },
    },
  },
};

export const DisabledState: Story = {
  name: 'Disabled state',
  render: (args) => (
    <Pagination
      {...args}
      currentPage={1}
      totalPages={1}
      pageSize={20}
      pageSizeOptions={[20]}
      onPageSizeChange={undefined}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the edge treatment when the list only has a single page and navigation controls are unavailable.',
      },
    },
  },
};

export const Interactive: Story = {
  render: (args) => <ControlledPaginationStory {...args} />,
  args: {
    currentPage: 3,
    totalPages: 12,
    onPageChange: fn(),
    onPageSizeChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /go to next page/i }));
    await expect(
      canvas.getByText('4', { selector: 'span[aria-current="page"]' }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(args.onPageChange).toHaveBeenCalledWith(4);

    const select = canvas.getByRole('combobox', { name: /rows per page/i });
    await userEvent.selectOptions(select, '50');
    await expect(args.onPageSizeChange).toHaveBeenCalledWith(50);
    await expect(canvas.getByText(/rows per page:/i)).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirms both page navigation and page-size changes in a controlled usage pattern.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  name: 'Responsive layout',
  render: (args) => (
    <Box className="max-w-sm">
      <Pagination {...args} currentPage={9} totalPages={42} />
    </Box>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Checks wrapping, control spacing, and page-size alignment in a constrained mobile viewport.',
      },
    },
  },
};
