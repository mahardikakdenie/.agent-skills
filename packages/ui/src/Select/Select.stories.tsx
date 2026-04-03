import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Box } from '../Box';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './Select';
import {
  selectVariantValues,
  selectSizeValues,
  type SelectOption,
  type SelectProps,
} from './Select.types';

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

const meta = {
  title: 'Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: countryOptions,
    variant: 'outline',
    size: 'md',
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
    variant: {
      control: 'select',
      options: selectVariantValues,
    },
    size: {
      control: 'select',
      options: selectSizeValues,
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
          'Shared static single-select primitive built on Radix Select with Box-authored trigger, Input-aligned field-shell sizing, list items, portal content, loading state, and validation messaging.',
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

export const Sizes: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-2">
      {selectSizeValues.map((size) => (
        <SelectStoryHarness
          key={size}
          size={size}
          label={`Size ${size.toUpperCase()}`}
          placeholder={`Select a ${size} field`}
          defaultValue="my"
          options={countryOptions}
        />
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the full shared field-shell size scale aligned with `Input` from `xs` through `lg`.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-3">
      {selectVariantValues.map((variant) => (
        <SelectStoryHarness
          key={variant}
          variant={variant}
          label={variant.charAt(0).toUpperCase() + variant.slice(1)}
          placeholder={`Select variant: ${variant}`}
          defaultValue="my"
          options={countryOptions}
        />
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares the shared select trigger variants aligned with the input family.',
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

export const CustomOptionContent: Story = {
  args: {
    options: longCountryOptions,
    label: 'Country',
    placeholder: 'Select a country',
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

export const CompoundComposition: Story = {
  render: () => (
    <Box className="grid gap-3 md:max-w-sm">
      <Select defaultValue="sg">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Available Countries</SelectLabel>
            {countryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the Radix-style compound Select surface retained for migration-safe compatibility and advanced composition.',
      },
    },
  },
};
