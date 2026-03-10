import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowLeft, ArrowRight, ExternalLink, TriangleAlert } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Button } from './Button';
import { buttonSizeValues, buttonVariantValues } from './Button.types';

const meta = {
  title: 'Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    size: 'md',
    loading: false,
    disabled: false,
    children: 'Continue',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: buttonVariantValues,
    },
    size: {
      control: 'select',
      options: buttonSizeValues,
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
    leftIcon: {
      control: false,
    },
    rightIcon: {
      control: false,
    },
    asChild: {
      control: false,
    },
    onClick: {
      action: 'clicked',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shared action primitive for CTA, toolbar, and submit usage with token-driven variants, sizes, loading state, and optional `asChild` composition.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline filled CTA using the default shared emphasis.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Box className="flex flex-wrap items-center gap-3">
      {buttonVariantValues.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant.charAt(0).toUpperCase()}
          {variant.slice(1)}
        </Button>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares every canonical shared button variant, including the normalized warning state.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Box className="flex flex-wrap items-center gap-3">
      {buttonSizeValues.map((size) => (
        <Button key={size} size={size} variant="secondary">
          {size.toUpperCase()}
        </Button>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the full shared size scale from dense actions to extra-large emphasis.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Submitting',
  },
  parameters: {
    docs: {
      description: {
        story: 'Marks the action busy, shows the spinner, and blocks repeated interaction.',
      },
    },
  },
};

export const AsChild: Story = {
  render: () => (
    <Button asChild variant="outline" rightIcon={<ExternalLink aria-hidden="true" className="h-4 w-4" />}>
      <Box as="a" href="https://example.com" target="_blank" rel="noreferrer">
        Open documentation
      </Box>
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Applies button styling to a consumer-owned anchor through `asChild` while keeping authored JSX Box-based.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => (
    <Box className="flex flex-wrap items-center gap-3">
      <Button disabled>Disabled action</Button>
      <Button disabled variant="outline" leftIcon={<TriangleAlert aria-hidden="true" className="h-4 w-4" />}>
        Disabled warning
      </Button>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the disabled treatment on filled and outline variants.',
      },
    },
  },
};

export const IconSlots: Story = {
  render: () => (
    <Box className="flex flex-wrap items-center gap-3">
      <Button leftIcon={<ArrowLeft aria-hidden="true" className="h-4 w-4" />}>Back</Button>
      <Button rightIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>Continue</Button>
      <Button
        variant="warning"
        leftIcon={<TriangleAlert aria-hidden="true" className="h-4 w-4" />}
      >
        Review details
      </Button>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exercises the approved left and right icon slots without introducing icon-specific booleans.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    children: 'Trigger action',
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /trigger action/i });

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(button).toHaveAttribute('aria-busy', 'false');
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirms the button remains clickable and exposes the busy attribute in the default idle state.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Box className="flex max-w-sm flex-col gap-3">
      <Button size="xl">Save and continue</Button>
      <Button
        variant="outline"
        rightIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}
        className="w-full justify-between"
      >
        Review the updated submission details
      </Button>
    </Box>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Checks stacking, wrapping, and alignment in a constrained mobile layout.',
      },
    },
  },
};


