import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Select } from './Select';
import type { SelectProps } from './Select.types';

const countryOptions = [
  { label: 'Malaysia', value: 'my' },
  { label: 'Singapore', value: 'sg' },
  { label: 'Indonesia', value: 'id' },
  { label: 'Thailand', value: 'th' },
];

const longCountryOptions = [
  { label: 'Argentina', value: 'ar' },
  { label: 'Australia', value: 'au' },
  { label: 'Canada', value: 'ca' },
  { label: 'France', value: 'fr' },
  { label: 'Germany', value: 'de' },
  { label: 'India', value: 'in' },
  { label: 'Japan', value: 'jp' },
  { label: 'Malaysia', value: 'my' },
  { label: 'New Zealand', value: 'nz' },
  { label: 'Singapore', value: 'sg' },
  { label: 'South Korea', value: 'kr' },
  { label: 'United Kingdom', value: 'gb' },
  { label: 'United States', value: 'us' },
];

function normalizeSelectValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function SelectStoryHarness(selectProps: SelectProps) {
  const { value, defaultValue, onValueChange, ...props } = selectProps;
  const isControlled = Object.prototype.hasOwnProperty.call(selectProps, 'value');
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
    normalizeSelectValue(value) ?? normalizeSelectValue(defaultValue),
  );

  React.useEffect(() => {
    if (isControlled) {
      setSelectedValue(normalizeSelectValue(value));
    }
  }, [isControlled, value]);

  return (
    <Select
      {...props}
      {...(isControlled ? { value: selectedValue } : { defaultValue })}
      onValueChange={(nextValue) => {
        if (isControlled) {
          setSelectedValue(nextValue);
        }

        onValueChange?.(nextValue);
      }}
    />
  );
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
      <Box className="grid gap-1">
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

const meta = {
  title: 'Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: countryOptions,
    defaultValue: undefined,
    disabled: false,
    loading: false,
    required: false,
    error: false,
    clearable: false,
    onValueChange: fn(),
    onOpen: fn(),
    onClose: fn(),
  },
  argTypes: {
    label: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    defaultValue: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
    onValueChange: {
      action: 'value changed',
    },
    onOpen: {
      action: 'opened',
    },
    onClose: {
      action: 'closed',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shared static single-select primitive built on Radix Select with Box-authored trigger, list items, portal content, loading state, and validation messaging.',
      },
    },
  },
  render: (args: SelectProps) => <SelectStoryHarness {...args} />,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 'my',
  },
  parameters: {
    docs: {
      description: {
        story: 'Baseline static single-select with one value already chosen.',
      },
    },
  },
};

export const Placeholder: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the muted placeholder treatment before a value has been selected.',
      },
    },
  },
};

export const LongList: Story = {
  args: {
    options: longCountryOptions,
    placeholder: 'Select a destination',
    label: 'Destination country',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Exercises the capped viewport and scroll affordances for longer but still static option lists.',
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    defaultValue: 'sg',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disables the trigger while preserving the selected value and visible label.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    error: 'Please choose a country before continuing.',
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Applies destructive field styling and renders an accessible inline validation message.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    loading: true,
    placeholder: 'Loading countries',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disables interaction and replaces the chevron with a loading spinner while options are pending.',
      },
    },
  },
};

export const Clearable: Story = {
  args: {
    defaultValue: 'my',
    clearable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the shared clear action when a selected value should return to the placeholder state.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    clearable: true,
    onValueChange: fn(),
    onOpen: fn(),
    onClose: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('combobox', { name: /country/i });

    await userEvent.click(trigger);
    await expect(args.onOpen).toHaveBeenCalledTimes(1);

    const malaysiaOption = await body.findByRole('option', { name: /malaysia/i });
    await userEvent.click(malaysiaOption);

    await expect(args.onValueChange).toHaveBeenCalledWith('my');
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await expect(trigger).toHaveTextContent('Malaysia');

    const clearButton = await canvas.findByRole('button', { name: /clear selection/i });
    await userEvent.click(clearButton);
    await expect(args.onValueChange).toHaveBeenCalledWith(undefined);
    await expect(trigger).toHaveTextContent(/select a country/i);
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirms open, selection, close, and trigger text update behavior through Storybook interaction testing.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  render: (args) => (
    <Box className="max-w-sm">
      <StorySection
        title="Mobile field width"
        description="Confirms trigger truncation and menu sizing remain usable in a narrow layout."
      >
        <SelectStoryHarness
          {...args}
          label="Country of residence"
          clearable
          placeholder="Select your country"
          options={longCountryOptions}
        />
      </StorySection>
    </Box>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Exercises the field width, trigger truncation, and menu sizing within a narrow mobile container.',
      },
    },
  },
};
