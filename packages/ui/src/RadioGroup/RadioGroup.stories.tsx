import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { RadioGroup, RadioGroupItem } from './RadioGroup';
import type { RadioGroupProps } from './RadioGroup.types';
import { radioGroupOrientationValues, radioGroupSizeValues } from './RadioGroup.types';

type RadioGroupStoryArgs = Omit<RadioGroupProps, 'children'>;

function normalizeRadioValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function StorySection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Box className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <Box as="div" className="grid gap-1">
        <Box as="h3" className="text-sm font-semibold text-foreground">
          {title}
        </Box>
        <Box as="p" className="text-sm leading-5 text-muted-foreground">
          {description}
        </Box>
      </Box>
      {children}
    </Box>
  );
}

function RadioGroupStoryHarness({
  value,
  defaultValue,
  onValueChange,
  orientation,
  size,
  error,
  disabled,
  required,
  className,
  ...props
}: RadioGroupStoryArgs) {
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
    normalizeRadioValue(value) ?? normalizeRadioValue(defaultValue),
  );

  React.useEffect(() => {
    setSelectedValue(normalizeRadioValue(value) ?? normalizeRadioValue(defaultValue));
  }, [defaultValue, value]);

  return (
    <RadioGroup
      {...props}
      value={selectedValue}
      orientation={orientation}
      size={size}
      error={error}
      disabled={disabled}
      required={required}
      className={className}
      onValueChange={(nextValue) => {
        setSelectedValue(nextValue);
        onValueChange?.(nextValue);
      }}
    >
      <RadioGroupItem
        value="email"
        label="Email"
        description="Recommended for account notices and policy updates."
      />
      <RadioGroupItem
        value="sms"
        label="SMS"
        description="Use for short urgent notifications on supported devices."
      />
      <RadioGroupItem
        value="push"
        label="Push notification"
        description="Best for authenticated mobile app sessions."
      />
    </RadioGroup>
  );
}

const meta = {
  title: 'Inputs/RadioGroup',
  component: RadioGroupStoryHarness,
  tags: ['autodocs'],
  args: {
    defaultValue: 'email',
    orientation: 'vertical',
    size: 'md',
    error: false,
    disabled: false,
    required: false,
    onValueChange: fn(),
  },
  argTypes: {
    value: {
      control: 'text',
    },
    defaultValue: {
      control: 'text',
    },
    orientation: {
      control: 'radio',
      options: radioGroupOrientationValues,
    },
    size: {
      control: 'select',
      options: radioGroupSizeValues,
    },
    error: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    onValueChange: {
      action: 'value changed',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shared single-select choice primitive built on Radix Radio Group with Box-authored labels, descriptions, validation messaging, and indicator wrappers.',
      },
    },
  },
  render: (args: RadioGroupStoryArgs) => <RadioGroupStoryHarness {...args} />,
} satisfies Meta<RadioGroupStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline stacked radio group with shared label and description treatment.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Box className="grid max-w-2xl gap-4">
      <StorySection
        title="Small"
        description="Compact density for tighter forms, filters, and side-panel controls."
      >
        <RadioGroup defaultValue="email" size="sm">
          <RadioGroupItem
            value="email"
            label="Email"
            description="Recommended for account notices and policy updates."
          />
          <RadioGroupItem value="sms" label="SMS" />
        </RadioGroup>
      </StorySection>

      <StorySection
        title="Medium"
        description="Default density for the majority of shared product forms."
      >
        <RadioGroup defaultValue="email" size="md">
          <RadioGroupItem
            value="email"
            label="Email"
            description="Recommended for account notices and policy updates."
          />
          <RadioGroupItem value="sms" label="SMS" />
        </RadioGroup>
      </StorySection>

      <StorySection
        title="Large"
        description="Larger touch target for emphasis-heavy flows or more spacious layouts."
      >
        <RadioGroup defaultValue="email" size="lg">
          <RadioGroupItem
            value="email"
            label="Email"
            description="Recommended for account notices and policy updates."
          />
          <RadioGroupItem value="sms" label="SMS" />
        </RadioGroup>
      </StorySection>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Compares the supported density scale with natural option labels and clear usage guidance for each size.',
      },
    },
  },
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses horizontal orientation for compact option sets without introducing a separate visual variant prop.',
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    defaultValue: 'sms',
  },
  render: () => (
    <Box className="grid max-w-2xl gap-4">
      <StorySection
        title="Entire group disabled"
        description="Use this when the whole choice set is temporarily unavailable or read-only."
      >
        <RadioGroup defaultValue="sms" disabled>
          <RadioGroupItem value="email" label="Email" />
          <RadioGroupItem value="sms" label="SMS" />
          <RadioGroupItem value="push" label="Push notification" />
        </RadioGroup>
      </StorySection>

      <StorySection
        title="Single option disabled"
        description="Use this when one option is unavailable but the rest of the group is still selectable."
      >
        <RadioGroup defaultValue="email">
          <RadioGroupItem value="email" label="Email" />
          <RadioGroupItem
            value="sms"
            label="SMS"
            disabled
            description="Unavailable for this account."
          />
          <RadioGroupItem value="push" label="Push notification" />
        </RadioGroup>
      </StorySection>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Separates the two disabled scenarios into clearly labeled examples: a disabled group and a disabled item within an enabled group.',
      },
    },
  },
};

export const WithDescription: Story = {
  args: {
    defaultValue: 'standard',
    name: 'delivery-speed',
  },
  render: () => (
    <RadioGroup defaultValue="standard" name="delivery-speed">
      <RadioGroupItem
        value="standard"
        label="Standard delivery"
        description="Estimated arrival in 3 to 5 business days."
      />
      <RadioGroupItem
        value="express"
        label="Express delivery"
        description="Prioritized handling and next-day delivery where available."
      />
      <RadioGroupItem
        value="pickup"
        label="Store pickup"
        description="Collect from the selected branch once preparation is complete."
      />
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the form-aligned label plus supporting description contract required by the roadmap.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    defaultValue: undefined,
    error: 'Please choose one notification method before continuing.',
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Applies destructive styling and an accessible group-level validation message for form usage.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    defaultValue: 'email',
    onValueChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const emailRadio = canvas.getByRole('radio', { name: /email/i });
    const smsRadio = canvas.getByRole('radio', { name: /^sms$/i });

    await userEvent.tab();
    await expect(emailRadio).toHaveFocus();
    await expect(emailRadio).toHaveAttribute('aria-checked', 'true');

    await userEvent.keyboard('{ArrowDown}');
    await expect(smsRadio).toHaveFocus();

    await userEvent.keyboard(' ');
    await expect(smsRadio).toHaveAttribute('aria-checked', 'true');
    await expect(args.onValueChange).toHaveBeenCalledWith('sms');
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirms keyboard-only focus movement and selection for the shared radio-group contract.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  args: {
    defaultValue: 'push',
  },
  render: () => (
    <Box className="max-w-sm">
      <RadioGroup defaultValue="push">
        <RadioGroupItem
          value="email"
          label="Email summary"
          description="A complete daily digest with supporting details and links."
        />
        <RadioGroupItem
          value="push"
          label="Push notification"
          description="A concise mobile alert for time-sensitive account activity."
        />
      </RadioGroup>
    </Box>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Exercises wrapping and vertical rhythm inside a narrow mobile container.',
      },
    },
  },
};
