import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert, CircleCheckBig, CircleX, Info, TriangleAlert } from 'lucide-react';
import type * as React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Alert } from './Alert';
import { alertToneValues, alertSurfaceVariantValues, type AlertTone } from './Alert.types';

const iconMap: Record<AlertTone, React.ReactNode> = {
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
    tone: 'default',
    title: 'Changes saved',
    description: 'Your updates are now available to the rest of the team.',
    dismissible: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: alertSurfaceVariantValues,
    },
    tone: {
      control: 'select',
      options: alertToneValues,
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
          'Inline semantic feedback surface with normalized `outline` and `shadow` surface variants plus semantic `tone`.',
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
        story: 'Baseline inline alert using the default outline surface with no shadow.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Box className="grid max-w-5xl gap-5">
      {alertSurfaceVariantValues.map((variant) => (
        <Box key={variant} className="grid gap-3">
          <Box as="p" className="text-sm font-semibold text-foreground">
            {variant.charAt(0).toUpperCase()}
            {variant.slice(1)}
          </Box>
          <Box className="grid gap-3">
            {alertToneValues.map((tone) => (
              <Alert
                key={`${variant}-${tone}`}
                variant={variant}
                tone={tone}
                title={`${tone.charAt(0).toUpperCase()}${tone.slice(1)} state`}
                description="Shared feedback tones stay semantic while surface treatment stays explicit."
                icon={iconMap[tone]}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares every supported surface and tone combination on the actual alert root.',
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    tone: 'info',
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
    variant: 'shadow',
    tone: 'warning',
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
      variant="shadow"
      tone="destructive"
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
