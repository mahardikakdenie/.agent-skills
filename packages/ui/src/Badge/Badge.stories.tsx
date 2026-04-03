import type { Meta, StoryObj } from '@storybook/react-vite';

import { Box } from '../Box';
import { Badge } from './Badge';
import { badgeSizeValues, badgeSurfaceVariantValues, badgeToneValues } from './Badge.types';

const meta = {
  title: 'Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    tone: 'default',
    size: 'md',
    children: 'Active',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: badgeSurfaceVariantValues,
    },
    tone: {
      control: 'select',
      options: badgeToneValues,
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
          'Compact semantic label primitive with normalized outline and solid surfaces plus shared status tones.',
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
        story: 'Baseline shared badge using the default outline surface with no shadow.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Box className="grid gap-5">
      {badgeSurfaceVariantValues.map((variant) => (
        <Box key={variant} className="grid gap-3">
          <Box as="p" className="text-sm font-semibold text-foreground">
            {variant.charAt(0).toUpperCase()}
            {variant.slice(1)}
          </Box>
          <Box className="flex flex-wrap gap-3">
            {badgeToneValues.map((tone) => (
              <Badge key={`${variant}-${tone}`} variant={variant} tone={tone}>
                {tone.charAt(0).toUpperCase()}
                {tone.slice(1)}
              </Badge>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares both supported badge surfaces across every shared tone.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Box className="flex flex-wrap items-center gap-3">
      {badgeSizeValues.map((size) => (
        <Badge key={size} size={size} variant="solid" tone="secondary">
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
      <Badge>
        <Box as="span" data-slot="badge-dot" aria-hidden="true" />
        Syncing
      </Badge>
      <Badge variant="solid" tone="warning">
        <Box as="span" data-slot="badge-dot" aria-hidden="true" />
        Pending review
      </Badge>
      <Badge variant="solid" tone="success">
        <Box as="span" data-slot="badge-dot" aria-hidden="true" />
        Connected
      </Badge>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the approved dot pattern through child composition instead of extra props.',
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
