import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { Box } from '../Box';
import { Combobox } from './Combobox';
import {
  comboboxSizeValues,
  type ComboboxOption,
  type ComboboxProps,
} from './Combobox.types';

const options: ComboboxOption[] = [
  { label: 'Malaysia', value: 'my' },
  { label: 'Singapore', value: 'sg' },
  { label: 'Thailand', value: 'th' },
  { label: 'Indonesia', value: 'id' },
  { label: 'Philippines', value: 'ph' },
  { label: 'Vietnam', value: 'vn' },
];

const assigneeOptions: ComboboxOption[] = [
  { label: 'Aina Yusuf', value: 'aina', keywords: ['product', 'ops'] },
  { label: 'Budi Santoso', value: 'budi', keywords: ['engineering', 'payments'] },
  { label: 'Clara Lim', value: 'clara', keywords: ['support', 'claims'] },
  { label: 'Dion Prasetyo', value: 'dion', disabled: true, keywords: ['finance'] },
];

const customerSeedOptions: ComboboxOption[] = [
  { label: 'Atlas Shipping', value: 'atlas-shipping', keywords: ['atlas', 'shipping'] },
  { label: 'Beacon Logistics', value: 'beacon-logistics', keywords: ['beacon', 'logistics'] },
  { label: 'Crescent Foods', value: 'crescent-foods', keywords: ['crescent', 'foods'] },
];

function renderCountryOption(
  option: ComboboxOption,
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

function ComboboxStoryHarness({
  initialValue,
  onValueChange,
  ...props
}: ComboboxProps & { initialValue?: string }) {
  const [value, setValue] = React.useState<string | undefined>(initialValue);

  return (
    <Combobox
      {...props}
      value={value}
      onValueChange={(nextValue) => {
        setValue(nextValue);
        onValueChange?.(nextValue);
      }}
    />
  );
}

const meta = {
  title: 'Inputs/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: {
    label: 'Country',
    placeholder: 'Select an option',
    searchPlaceholder: 'Search Countries',
    size: 'md',
    options,
    disabled: false,
    loading: false,
    required: false,
    error: false,
    clearable: false,
    createOptionLabel: undefined,
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    size: {
      control: 'select',
      options: comboboxSizeValues,
    },
    options: { control: 'object' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'text' },
    clearable: { control: 'boolean' },
    createOptionLabel: { control: 'text' },
    open: { control: 'boolean' },
    renderOption: { table: { disable: true } },
    onValueChange: { action: 'value changed' },
    onSearchValueChange: { action: 'search changed' },
    onCreateOption: { action: 'create option' },
    onClose: { action: 'closed' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Searchable single-select field built from the shared Popover surface and a cmdk command list, with optional parent-owned search refresh and create-option hooks.',
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Baseline searchable single-select field with the shared trigger shell.',
      },
    },
  },
  render: (args) => (
    <Box className="w-[320px]">
      <Combobox {...args} />
    </Box>
  ),
};

export const Search: Story = {
  args: {
    label: 'Assignee',
    placeholder: 'Select Assignee',
    searchPlaceholder: 'Search Team Members',
    options: assigneeOptions,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the searchable option surface for a typical assignee picker.',
      },
    },
  },
  render: (args) => (
    <Box className="w-[320px]">
      <Combobox {...args} />
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-2">
      {comboboxSizeValues.map((size) => (
        <ComboboxStoryHarness
          key={size}
          label={`Size ${size.toUpperCase()}`}
          size={size}
          placeholder={`Select a ${size} field`}
          searchPlaceholder={`Search ${size} options`}
          initialValue="my"
          options={options}
        />
      ))}
    </Box>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Shows the full shared field-shell size scale aligned with `Select` from `xs` through `lg`.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    label: 'Occupation',
    options: [],
    searchPlaceholder: 'Search Occupations',
  },
  parameters: {
    docs: {
      description: {
        story: 'Open state with no available options so the empty message is visible.',
      },
    },
  },
  render: (args) => (
    <Box className="w-[320px]">
      <Combobox {...args} />
    </Box>
  ),
};

export const DisabledState: Story = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled trigger treatment for non-interactive flows.',
      },
    },
  },
  render: (args) => (
    <Box className="w-[320px]">
      <Combobox {...args} />
    </Box>
  ),
};

export const DisabledOption: Story = {
  args: {
    label: 'Assignee',
    placeholder: 'Select Assignee',
    searchPlaceholder: 'Search Team Members',
    options: assigneeOptions,
  },
  parameters: {
    docs: {
      description: {
        story: 'Keeps disabled options visible but non-interactive inside the searchable list.',
      },
    },
  },
  render: (args) => (
    <Box className="w-[320px]">
      <Combobox {...args} />
    </Box>
  ),
};

export const ErrorState: Story = {
  args: {
    error: 'Please choose a country before continuing.',
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Invalid state with visible required treatment and inline error messaging.',
      },
    },
  },
  render: (args) => (
    <Box className="w-[320px]">
      <Combobox {...args} />
    </Box>
  ),
};

export const ControlledMode: Story = {
  args: {
    label: 'Country',
    options,
    value: 'sg',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Externally controlled selection state using the shared `value` and `onValueChange` contract.',
      },
    },
  },
  render: (args) => {
    const ControlledStory = () => {
      const [value, setValue] = React.useState<string | undefined>(args.value);

      return (
        <Box className="flex w-[320px] flex-col gap-3">
          <Combobox {...args} value={value} onValueChange={setValue} />
          <Box as="p" className="text-sm text-muted-foreground">
            Selected Value: {value || 'none'}
          </Box>
        </Box>
      );
    };

    return <ControlledStory />;
  },
};

export const Clearable: Story = {
  args: {
    clearable: true,
    label: 'Country',
    options,
    value: 'sg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the clear action when a selected value should return to the placeholder state.',
      },
    },
  },
  render: (args) => {
    const ClearableStory = () => {
      const [value, setValue] = React.useState<string | undefined>(args.value);

      return (
        <Box className="w-[320px]">
          <Combobox {...args} value={value} onValueChange={setValue} />
        </Box>
      );
    };

    return <ClearableStory />;
  },
};

export const ExternalSearchAndCreate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Parent-owned search refresh and create-on-enter flow: the shared field emits search changes, the parent debounces and refreshes options, and creation stays a generic callback.',
      },
    },
  },
  render: () => {
    const ExternalSearchAndCreateStory = () => {
      const [value, setValue] = React.useState<string | undefined>(undefined);
      const [query, setQuery] = React.useState('');
      const deferredQuery = React.useDeferredValue(query);
      const [loading, setLoading] = React.useState(false);
      const [allOptions, setAllOptions] = React.useState(customerSeedOptions);
      const [visibleOptions, setVisibleOptions] = React.useState(customerSeedOptions);

      React.useEffect(() => {
        setLoading(true);

        const timer = window.setTimeout(() => {
          const normalizedQuery = deferredQuery.trim().toLowerCase();

          setVisibleOptions(
            normalizedQuery.length === 0
              ? allOptions
              : allOptions.filter((option) => {
                  const haystack = [option.label, option.value, ...(option.keywords ?? [])]
                    .join(' ')
                    .toLowerCase();
                  return haystack.includes(normalizedQuery);
                }),
          );
          setLoading(false);
        }, 300);

        return () => window.clearTimeout(timer);
      }, [allOptions, deferredQuery]);

      return (
        <Box className="flex w-[360px] flex-col gap-3">
          <Combobox
            label="Customer"
            placeholder="Input name"
            searchPlaceholder="Find Customer Name"
            options={visibleOptions}
            value={value}
            loading={loading}
            onValueChange={setValue}
            onSearchValueChange={setQuery}
            createOptionLabel="Type something and press Enter to add a new customer"
            onCreateOption={(searchValue) => {
              const nextOption = {
                label: searchValue,
                value: searchValue,
                keywords: [searchValue],
              };

              setAllOptions((previousOptions) => [...previousOptions, nextOption]);
              setVisibleOptions((previousOptions) => [...previousOptions, nextOption]);
              setValue(nextOption.value);
              setQuery('');
            }}
          />
          <Box as="p" className="text-sm text-muted-foreground">
            Search Query: {query || 'none'}
          </Box>
          <Box as="p" className="text-sm text-muted-foreground">
            Selected Value: {value || 'none'}
          </Box>
        </Box>
      );
    };

    return <ExternalSearchAndCreateStory />;
  },
};

export const CustomOptionContent: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select An Option',
    searchPlaceholder: 'Search Countries',
    options,
    renderOption: renderCountryOption,
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses a custom ReactNode option layout while preserving label-based selection and accessibility.',
      },
    },
  },
  render: (args) => (
    <Box className="w-[320px]">
      <Combobox {...args} />
    </Box>
  ),
};
