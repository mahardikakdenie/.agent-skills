import type * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert, CircleCheckBig, CircleX, Info, TriangleAlert } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Alert } from './Alert';
import { alertVariantValues, type AlertVariant } from './Alert.types';

const iconMap: Record<AlertVariant, React.ReactNode> = {
  default: <Info aria-hidden="true" className="h-5 w-5" />,
  success: <CircleCheckBig aria-hidden="true" className="h-5 w-5" />,
  info: <CircleAlert aria-hidden="true" className="h-5 w-5" />,
  warning: <TriangleAlert aria-hidden="true" className="h-5 w-5" />,
  destructive: <CircleX aria-hidden="true" className="h-5 w-5" />,
};

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    title: 'Changes saved',
    description: 'Your updates are now available to the rest of the team.',
    dismissible: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: alertVariantValues,
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    dismissible: {
      control: 'boolean',
    },
    icon: {
      control: false,
    },
    children: {
      control: false,
    },
    onClose: {
      action: 'close',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Inline semantic feedback surface for neutral, success, info, warning, and destructive messaging.',
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline inline alert with title and supporting description.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Box className="grid max-w-3xl gap-4">
      {alertVariantValues.map((variant) => (
        <Alert
          key={variant}
          variant={variant}
          title={`${variant.charAt(0).toUpperCase()}${variant.slice(1)} state`}
          description="Shared semantic variants stay token-driven and inline."
          icon={iconMap[variant]}
        />
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows all supported semantic variants with representative icons.',
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'info',
    title: 'Verification pending',
    description: 'We sent a confirmation code to the registered mobile number.',
    icon: <CircleAlert aria-hidden="true" className="h-5 w-5" />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Adds a leading icon without coupling the component to a specific app icon system.',
      },
    },
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'warning',
    title: 'Review incomplete details',
    description: 'A few required fields still need attention before continuing.',
    dismissible: true,
    onClose: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /dismiss alert/i });

    await userEvent.click(button);
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirms the controlled dismiss action is exposed through `onClose`.',
      },
    },
  },
};

export const LongContent: Story = {
  render: () => (
    <Alert
      variant="destructive"
      title="Unable to process the latest update"
      description="Please review the highlighted items below before trying again."
      icon={<CircleX aria-hidden="true" className="h-5 w-5" />}
    >
      <Box as="ul" className="list-inside list-disc space-y-1 text-sm">
        <Box as="li">Verify the policy number and plan selection.</Box>
        <Box as="li">Confirm the billing address still matches the payment method.</Box>
        <Box as="li">Retry after the upstream system is available again.</Box>
      </Box>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exercises wrapped body content and mixed semantic children inside the alert body.',
      },
    },
  },
};

