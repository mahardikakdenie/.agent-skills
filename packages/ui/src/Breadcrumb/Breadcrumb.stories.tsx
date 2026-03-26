import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Box } from '../Box';
import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbItemSlot,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './Breadcrumb';
import type { BreadcrumbItem as BreadcrumbDataItem } from './Breadcrumb.types';

const baseItems: BreadcrumbDataItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Settings', href: '/dashboard/settings' },
];

const DemoRouteLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<'a'>>(
  (props, ref) => <Box as="a" ref={ref} {...props} />,
);

DemoRouteLink.displayName = 'DemoRouteLink';

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
          'Shared breadcrumb trail for ancestor navigation, with semantic nav/list markup, a canonical flat API, and additive compound exports for legacy authored trails.',
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

export const Compound: Story = {
  render: (args) => (
    <Breadcrumb {...args} items={undefined} currentLabel={undefined}>
      <BreadcrumbList>
        <BreadcrumbItemSlot>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItemSlot>
        <BreadcrumbSeparator />
        <BreadcrumbItemSlot>
          <BreadcrumbLink href="/dashboard/settings">Settings</BreadcrumbLink>
        </BreadcrumbItemSlot>
        <BreadcrumbSeparator />
        <BreadcrumbItemSlot>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItemSlot>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Compatibility path for legacy compound breadcrumb markup. Keep route construction local while reusing the shared semantic shell.',
      },
    },
  },
};

export const InteractiveModes: Story = {
  render: (args) => (
    <Breadcrumb {...args} items={undefined} currentLabel={undefined}>
      <BreadcrumbList>
        <BreadcrumbItemSlot>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItemSlot>
        <BreadcrumbSeparator />
        <BreadcrumbItemSlot>
          <BreadcrumbLink onClick={() => undefined}>Users</BreadcrumbLink>
        </BreadcrumbItemSlot>
        <BreadcrumbSeparator />
        <BreadcrumbItemSlot>
          <BreadcrumbLink asChild>
            <DemoRouteLink href="/users/detail">Detail</DemoRouteLink>
          </BreadcrumbLink>
        </BreadcrumbItemSlot>
        <BreadcrumbSeparator />
        <BreadcrumbItemSlot>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItemSlot>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Exercises the three supported interactive breadcrumb paths: direct `href` anchors, callback-only button crumbs, and framework-routing composition through `BreadcrumbLink asChild`.',
      },
    },
  },
};

export const LongLabels: Story = {
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
