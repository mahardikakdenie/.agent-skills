import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Select } from './Select';
import type { SelectOption, SelectProps } from './Select.types';

const countryOptions: SelectOption[] = [
  { label: 'Malaysia', value: 'my' },
  { label: 'Singapore', value: 'sg' },
  { label: 'Indonesia', value: 'id' },
  { label: 'Thailand', value: 'th', disabled: true },
];

const longCountryOptions: SelectOption[] = [
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

function renderCountryOption(
  option: SelectOption,
  state: { selected: boolean; disabled: boolean },
) {
  const badgeClassName = state.disabled
    ? 'border-border bg-muted/40 text-muted-foreground'
    : state.selected
      ? 'border-primary/20 bg-primary/10 text-primary'
      : 'border-border bg-muted/60 text-muted-foreground';

  return (
    <Box className="flex min-w-0 flex-1 items-center gap-2.5">
      <Box
        as="span"
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-[10px] font-semibold uppercase tracking-[0.12em] ${badgeClassName}`}
      >
        {option.value}
      </Box>
      <Box className="min-w-0 flex-1">
        <Box as="span" className="block truncate text-sm font-medium leading-none text-foreground">
          {option.label}
        </Box>
        <Box as="span" className="mt-0.5 block truncate text-[11px] leading-none text-muted-foreground">
          Country Code {option.value.toUpperCase()}
        </Box>
      </Box>
      {state.disabled ? (
        <Box
          as="span"
          className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
        >
          Disabled
        </Box>
      ) : null}
    </Box>
  );
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
    placeholder: 'Select A Country',
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
    renderOption: {
      table: { disable: true },
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
    placeholder: 'Select A Destination',
    label: 'Destination Country',
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

export const DisabledOption: Story = {
  args: {
    defaultValue: 'sg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Keeps disabled options visible but non-interactive inside the Radix option list.',
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
    placeholder: 'Loading Countries',
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

export const CustomOptionContent: Story = {
  args: {
    options: longCountryOptions,
    label: 'Country',
    placeholder: 'Select A Country',
    renderOption: renderCountryOption,
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses a custom ReactNode option layout while keeping the selected trigger value text-driven.',
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
        title="Mobile Field Width"
        description="Confirms trigger truncation and menu sizing remain usable in a narrow layout."
      >
        <SelectStoryHarness
          {...args}
          label="Country Of Residence"
          clearable
          placeholder="Select Your Country"
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


