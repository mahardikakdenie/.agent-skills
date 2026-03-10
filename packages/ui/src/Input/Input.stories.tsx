import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleDollarSign, Mail, Search } from 'lucide-react';
import { expect, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Input } from './Input';
import { inputModeValues, inputSizeValues, inputVariantValues } from './Input.types';

function ControlledInputStory(props: React.ComponentProps<typeof Input>) {
  const [value, setValue] = React.useState('');

  return <Input {...props} value={value} onValueChange={setValue} />;
}

const meta = {
  title: 'Inputs/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    size: 'md',
    inputMode: 'text',
    disabled: false,
    loading: false,
    clearable: false,
    label: 'Search',
    placeholder: 'Search documents',
    helperText: 'Use keywords or document IDs.',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: inputVariantValues,
    },
    size: {
      control: 'select',
      options: inputSizeValues,
    },
    inputMode: {
      control: 'select',
      options: inputModeValues,
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    leftIcon: {
      control: false,
    },
    rightIcon: {
      control: false,
    },
    onChange: {
      action: 'changed',
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
          'Shared single-line input primitive with label, helper and error text, normalized input modes, affixes, loading state, and optional clear action.',
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search documents',
  },
  parameters: {
    docs: {
      description: {
        story: 'Baseline shared text input with label and helper text.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-3">
      {inputVariantValues.map((variant) => (
        <Input
          key={variant}
          variant={variant}
          label={variant.charAt(0).toUpperCase() + variant.slice(1)}
          placeholder={`Variant: ${variant}`}
        />
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares the canonical shared field-shell variants.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-2">
      {inputSizeValues.map((size) => (
        <Input
          key={size}
          size={size}
          label={`Size ${size.toUpperCase()}`}
          placeholder={`Input size: ${size}`}
          leftIcon={<Search aria-hidden="true" className="h-4 w-4" />}
        />
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the full shared size scale from compact inline fields to larger touch-friendly inputs.',
      },
    },
  },
};

export const Types: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-2">
      <Input
        label="Email"
        inputMode="email"
        placeholder="name@example.com"
        leftIcon={<Mail aria-hidden="true" className="h-4 w-4" />}
      />
      <Input label="Phone" inputMode="phone" placeholder="+60 12 345 6789" />
      <Input
        label="Amount"
        inputMode="currency"
        placeholder="100.00"
        leftIcon={<CircleDollarSign aria-hidden="true" className="h-4 w-4" />}
      />
      <Input label="Password" inputMode="password" placeholder="Password" />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the normalized shared input modes used to replace app-local text, email, phone, currency, and password shells.',
      },
    },
  },
};

export const WithAffixes: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-2">
      <Input
        label="Search"
        placeholder="Search documents"
        leftIcon={<Search aria-hidden="true" className="h-4 w-4" />}
      />
      <Input
        label="Amount"
        placeholder="100.00"
        inputMode="currency"
        leftIcon={<CircleDollarSign aria-hidden="true" className="h-4 w-4" />}
        rightIcon={
          <Box as="span" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            MYR
          </Box>
        }
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exercises left and right adornment slots without widening the shared API.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Amount',
    inputMode: 'currency',
    placeholder: '0.00',
    error: 'Enter a valid amount.',
    helperText: 'Use whole numbers or decimals.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows invalid styling and inline error copy while preserving helper-text linkage.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-2">
      <Input
        disabled
        label="Disabled search"
        placeholder="Search disabled"
        leftIcon={<Search aria-hidden="true" className="h-4 w-4" />}
      />
      <Input disabled label="Disabled amount" inputMode="currency" value="100.00" />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the disabled treatment on inputs with and without affixes.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    label: 'Searching',
    placeholder: 'Search documents',
    leftIcon: <Search aria-hidden="true" className="h-4 w-4" />,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the trailing loading spinner and busy state on the shared field shell.',
      },
    },
  },
};

export const Clearable: Story = {
  render: () => (
    <ControlledInputStory
      label="Filter results"
      placeholder="Type to filter"
      clearable
      leftIcon={<Search aria-hidden="true" className="h-4 w-4" />}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the clear action on a controlled input.',
      },
    },
  },
};

export const Interactive: Story = {
  render: () => (
    <ControlledInputStory
      label="Search"
      placeholder="Type to search"
      clearable
      leftIcon={<Search aria-hidden="true" className="h-4 w-4" />}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /search/i });

    await userEvent.type(input, 'policy');
    await expect(input).toHaveValue('policy');

    const clearButton = canvas.getByRole('button', { name: /clear input/i });
    await userEvent.click(clearButton);
    await expect(input).toHaveValue('');
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirms typing and the clear action in a controlled usage pattern.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Box className="grid max-w-sm gap-4">
      <Input
        size="lg"
        label="Search documents"
        placeholder="Search policy IDs, claim numbers, or customer names"
        leftIcon={<Search aria-hidden="true" className="h-4 w-4" />}
        helperText="Long helper copy should remain readable in narrow layouts without clipping the input shell."
      />
      <Input
        variant="ghost"
        size="sm"
        label="Secondary filter"
        placeholder="Optional inline filter"
        clearable
      />
    </Box>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Checks label wrapping, shell sizing, and helper-text flow in a constrained mobile viewport.',
      },
    },
  },
};




