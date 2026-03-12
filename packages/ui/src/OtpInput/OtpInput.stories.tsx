import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { fn } from 'storybook/test';

import { Box } from '../Box';
import { OtpInput } from './OtpInput';
import type { OtpInputProps } from './OtpInput.types';
import { otpInputSizeValues, otpInputVariantValues } from './OtpInput.types';

function OtpInputStoryHarness({
  value,
  onValueChange,
  ...props
}: OtpInputProps & { value?: string }) {
  const [currentValue, setCurrentValue] = React.useState(value ?? '');

  React.useEffect(() => {
    setCurrentValue(value ?? '');
  }, [value]);

  return (
    <Box className="grid gap-3">
      <OtpInput
        {...props}
        value={currentValue}
        onValueChange={(nextValue) => {
          setCurrentValue(nextValue);
          onValueChange?.(nextValue);
        }}
      />
      <Box as="p" className="text-sm text-muted-foreground">
        Current value: {currentValue || 'empty'}
      </Box>
    </Box>
  );
}

const meta = {
  title: 'Inputs/OtpInput',
  component: OtpInput,
  tags: ['autodocs'],
  args: {
    value: '',
    length: 6,
    variant: 'default',
    size: 'md',
    disabled: false,
    error: false,
    autoFocus: false,
    onValueChange: fn(),
  },
  argTypes: {
    value: {
      control: 'text',
    },
    length: {
      control: 'number',
    },
    variant: {
      control: 'radio',
      options: otpInputVariantValues,
    },
    size: {
      control: 'radio',
      options: otpInputSizeValues,
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
    autoFocus: {
      control: 'boolean',
    },
    onValueChange: {
      action: 'value changed',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Shared segmented one-time-password field with numeric sanitization, focus movement, whole-code paste support, and accessible error wiring.',
      },
    },
  },
  render: (args: OtpInputProps) => (
    <Box className="w-fit min-w-[320px]">
      <OtpInputStoryHarness {...args} />
    </Box>
  ),
} satisfies Meta<typeof OtpInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline six-digit OTP field with shared segmented slot styling and live value output.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Box className="grid gap-4">
      {otpInputVariantValues.map((variant) => (
        <Box
          key={variant}
          className="grid gap-2 rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <Box as="p" className="text-sm font-medium text-foreground">
            Variant: {variant}
          </Box>
          <OtpInputStoryHarness variant={variant} value="4821" />
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares the shared `default`, `outline`, and `ghost` slot chrome aligned with the input family.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Box className="grid gap-4">
      {otpInputSizeValues.map((size) => (
        <Box key={size} className="grid gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
          <Box as="p" className="text-sm font-medium text-foreground">
            Size: {size}
          </Box>
          <OtpInputStoryHarness size={size} />
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares the supported OTP slot density scale in the shared input family.',
      },
    },
  },
};

export const DisabledState: Story = {
  name: 'Disabled state',
  args: {
    disabled: true,
    value: '4821',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the disabled filled-state treatment while preserving the segmented code layout.',
      },
    },
  },
};

export const ErrorState: Story = {
  name: 'Error state',
  args: {
    error: 'Please enter the six-digit verification code.',
    value: '48',
  },
  parameters: {
    docs: {
      description: {
        story: 'Applies destructive styling and inline accessible validation messaging.',
      },
    },
  },
};

export const AutoFocus: Story = {
  name: 'Auto focus',
  args: {
    autoFocus: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Focuses the first empty slot on mount when the parent flow explicitly opts in.',
      },
    },
  },
};
