import type { Meta, StoryObj } from '@storybook/react-vite';

import { Box } from '../Box';
import { Badge } from './Badge';
import { badgeSizeValues, badgeVariantValues } from './Badge.types';

const meta = {
  title: 'Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    size: 'md',
    children: 'Active',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: badgeVariantValues,
    },
    size: {
      control: 'select',
      options: badgeSizeValues,
    },
    children: {
      control: 'text',
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
          'Compact semantic label primitive for inline status, category, and lightweight metadata surfaces.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline shared badge with the default semantic emphasis.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Box className="flex flex-wrap gap-3">
      {badgeVariantValues.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant.charAt(0).toUpperCase()}
          {variant.slice(1)}
        </Badge>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares all shared badge variants from the canonical API contract.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Box className="flex flex-wrap items-center gap-3">
      {badgeSizeValues.map((size) => (
        <Badge key={size} size={size} variant="secondary">
          {size.toUpperCase()}
        </Badge>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the compact density scale for dense and prominent badge placements.',
      },
    },
  },
};

export const Dot: Story = {
  render: () => (
    <Box className="flex flex-wrap gap-3">
      <Badge variant="outline">
        <Box as="span" data-slot="badge-dot" aria-hidden="true" />
        Syncing
      </Badge>
      <Badge variant="warning">
        <Box as="span" data-slot="badge-dot" aria-hidden="true" />
        Pending review
      </Badge>
      <Badge variant="success">
        <Box as="span" data-slot="badge-dot" aria-hidden="true" />
        Connected
      </Badge>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the approved dot pattern through child composition instead of extra props.',
      },
    },
  },
};

export const LongContent: Story = {
  render: () => (
    <Box className="max-w-xs">
      <Badge variant="outline" className="whitespace-normal leading-5">
        Awaiting an updated supporting document before this review can proceed.
      </Badge>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the consumer-controlled wrapping escape hatch for narrow layouts.',
      },
    },
  },
};
