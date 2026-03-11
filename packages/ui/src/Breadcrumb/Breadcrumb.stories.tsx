import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Breadcrumb } from './Breadcrumb';
import type { BreadcrumbItem } from './Breadcrumb.types';

const baseItems: BreadcrumbItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Settings', href: '/dashboard/settings' },
];

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    items: baseItems,
    currentLabel: 'Profile',
  },
  argTypes: {
    items: {
      control: 'object',
    },
    currentLabel: {
      control: 'text',
    },
    separator: {
      control: false,
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
          'Shared breadcrumb trail for ancestor navigation, with semantic nav/list markup and an optional appended current page label.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline ancestor trail with the current page appended through `currentLabel`.',
      },
    },
  },
};

export const CurrentItem: Story = {
  name: 'Current item',
  args: {
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Settings', href: '/dashboard/settings' },
      { label: 'Profile', current: true },
    ],
    currentLabel: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses an explicit current item inside `items` instead of a separate appended label.',
      },
    },
  },
};

export const CustomSeparator: Story = {
  name: 'Custom separator',
  args: {
    separator: '/',
  },
  parameters: {
    docs: {
      description: {
        story: 'Replaces the default chevron with a consumer-supplied decorative separator.',
      },
    },
  },
};

export const LongLabels: Story = {
  name: 'Long labels',
  render: (args) => (
    <Box className="max-w-sm">
      <Breadcrumb
        {...args}
        items={[
          {
            label: 'Customer relationship management workspace',
            href: '/workspace',
          },
          {
            label: 'Partner configuration for international distribution',
            href: '/workspace/partner-configuration',
          },
        ]}
        currentLabel="Regional approval workflow settings"
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows wrapping behavior for long breadcrumb labels in constrained layouts.',
      },
    },
  },
};

export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Dashboard' })).toHaveFocus();
    await expect(canvas.getByText('Profile')).toHaveAttribute('aria-current', 'page');
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirms keyboard focus reaches the first link and the current page is announced semantically.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  name: 'Responsive layout',
  render: (args) => (
    <Box className="max-w-xs">
      <Breadcrumb
        {...args}
        items={[
          { label: 'Account', href: '/account' },
          { label: 'Billing & invoices', href: '/account/billing' },
        ]}
        currentLabel="Payment method details"
      />
    </Box>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Exercises the wrapping trail at a mobile viewport width without collapsing semantics.',
      },
    },
  },
};

