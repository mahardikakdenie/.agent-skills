import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { Box } from '../Box';
import { Switch } from './Switch';
import type { SwitchProps } from './Switch.types';
import { switchSizeValues } from './Switch.types';

function SwitchStoryHarness(args: SwitchProps) {
  const [checked, setChecked] = React.useState(args.checked ?? args.defaultChecked ?? false);

  React.useEffect(() => {
    if (args.checked !== undefined) {
      setChecked(args.checked);
      return;
    }

    if (args.defaultChecked !== undefined) {
      setChecked(args.defaultChecked);
      return;
    }

    setChecked(false);
  }, [args.checked, args.defaultChecked]);

  return (
    <Switch
      {...args}
      checked={checked}
      onCheckedChange={(nextChecked) => {
        setChecked(nextChecked);
        args.onCheckedChange?.(nextChecked);
      }}
    />
  );
}

const meta = {
  title: 'Inputs/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    label: 'Enable email notifications',
    disabled: false,
    required: false,
    error: false,
    size: 'md',
  },
  argTypes: {
    checked: {
      control: 'boolean',
    },
    defaultChecked: {
      control: false,
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: switchSizeValues,
    },
    label: {
      control: 'text',
    },
    onCheckedChange: {
      action: 'checked changed',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shared binary toggle primitive built on Radix Switch with Box-authored DOM, shared size density, and inline invalid treatment for form-facing use cases.',
      },
    },
  },
  render: (args) => <SwitchStoryHarness {...args} />,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline medium-density switch with the shared label contract.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Box className="grid gap-4">
      {switchSizeValues.map((size) => (
        <Switch
          key={size}
          size={size}
          label={`${size.toUpperCase()} toggle`}
          defaultChecked={size !== 'sm'}
        />
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares the compact, default, and large switch densities.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => (
    <Box className="grid gap-4">
      <Switch disabled label="Disabled off toggle" />
      <Switch checked disabled label="Disabled on toggle" />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows disabled off and disabled on states with muted interaction treatment that still preserves clear track contrast on light surfaces.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Accept recurring billing',
    error: 'Please confirm recurring billing before continuing.',
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Applies destructive invalid treatment and links the inline error message to the control.',
      },
    },
  },
};

export const WithDescription: Story = {
  render: () => (
    <Box className="grid gap-1.5">
      <Switch
        id="account-activity-alerts"
        label="Enable account activity alerts"
        defaultChecked
        aria-describedby="account-activity-alerts-description"
      />
      <Box
        as="p"
        id="account-activity-alerts-description"
        className="pl-14 text-sm text-muted-foreground"
      >
        We only send this when sign-in, payout, or billing activity needs attention.
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the roadmap description case through consumer composition without widening the shared primitive API.',
      },
    },
  },
};
