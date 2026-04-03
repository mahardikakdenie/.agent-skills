import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { fn } from 'storybook/test';

import { Box } from '../Box';
import { Button } from '../Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../Form';
import { MonthPicker } from './MonthPicker';
import {
  monthPickerSizeValues,
  type MonthPickerProps,
  monthPickerVariantValues,
} from './MonthPicker.types';

interface MonthPickerStoryArgs extends MonthPickerProps {
  initialValue?: Date | null;
}

const formStoryMinMonth = new Date(2025, 0, 1);
const formStoryMaxMonth = new Date(2026, 11, 1);

const monthLabelFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  year: 'numeric',
});

function StoryFrame({ children }: { children: React.ReactNode }) {
  return <Box className="mx-auto flex w-full max-w-sm flex-col gap-4 p-4">{children}</Box>;
}

function getMonthLabel(value: Date | null) {
  if (!value) {
    return 'Selected: none';
  }

  return `Selected: ${monthLabelFormatter.format(value)}`;
}

function MonthPickerStory({
  initialValue = null,
  minMonth,
  maxMonth,
  disabled,
  clearable,
  error,
  onChange,
  ...args
}: MonthPickerStoryArgs) {
  const [value, setValue] = React.useState<Date | null>(initialValue);

  return (
    <StoryFrame>
      <MonthPicker
        value={value}
        minMonth={minMonth}
        maxMonth={maxMonth}
        disabled={disabled}
        clearable={clearable}
        error={error}
        onChange={(nextValue) => {
          setValue(nextValue);
          onChange?.(nextValue);
        }}
        {...args}
      />
      <Box as="p" aria-live="polite" className="text-sm text-muted-foreground">
        {getMonthLabel(value)}
      </Box>
    </StoryFrame>
  );
}

function FormFieldStory() {
  const form = useForm<{ billingMonth: Date | null }>({
    defaultValues: {
      billingMonth: null,
    },
    mode: 'onSubmit',
  });
  const selectedValue = form.watch('billingMonth');

  return (
    <StoryFrame>
      <Form form={form} onSubmit={form.handleSubmit(() => undefined)}>
        <FormField
          name="billingMonth"
          rules={{ required: 'Select a billing month.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Billing Month</FormLabel>
              <FormControl>
                <MonthPicker
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  clearable
                  minMonth={formStoryMinMonth}
                  maxMonth={formStoryMaxMonth}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Box className="flex gap-3">
          <Button type="submit" size="sm">
            Submit
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              form.setValue('billingMonth', new Date(2026, 6, 1));
              form.clearErrors('billingMonth');
            }}
          >
            Prefill
          </Button>
        </Box>
      </Form>

      <Box as="p" className="text-sm text-muted-foreground">
        {getMonthLabel(selectedValue)}
      </Box>
    </StoryFrame>
  );
}

const meta = {
  title: 'Inputs/MonthPicker',
  component: MonthPicker,
  tags: ['autodocs'],
  args: {
    variant: 'outline',
    size: 'md',
    initialValue: new Date(2026, 6, 1),
    minMonth: undefined,
    maxMonth: undefined,
    disabled: false,
    clearable: true,
    error: false,
    onChange: fn(),
  },
  argTypes: {
    initialValue: {
      control: false,
    },
    value: {
      control: false,
    },
    variant: {
      control: 'select',
      options: monthPickerVariantValues,
    },
    size: {
      control: 'select',
      options: monthPickerSizeValues,
    },
    minMonth: {
      control: 'date',
    },
    maxMonth: {
      control: 'date',
    },
    disabled: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
    onChange: {
      action: 'changed',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shared month-only picker with internal year navigation, clickable year jump, first-of-month normalization, min/max month bounds, clear support, and Box-only authored JSX.',
      },
    },
  },
  render: (args: MonthPickerStoryArgs) => <MonthPickerStory {...args} />,
} satisfies Meta<MonthPickerStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basic',
  parameters: {
    docs: {
      description: {
        story:
          'Baseline month picker with a selected value, internal year navigation, clickable year jump, and a clear action.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-3">
      {monthPickerVariantValues.map((variant) => (
        <Box key={variant} className="flex flex-col gap-2">
          <Box as="p" className="text-sm font-medium text-foreground">
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Box>
          <MonthPicker
            variant={variant}
            value={new Date(2026, 6, 1)}
            aria-label={`Month picker variant ${variant}`}
            clearable
          />
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares the Input-aligned MonthPicker trigger variants.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-2">
      {monthPickerSizeValues.map((size) => (
        <Box key={size} className="flex flex-col gap-2">
          <Box as="p" className="text-sm font-medium text-foreground">
            {`Size ${size.toUpperCase()}`}
          </Box>
          <MonthPicker
            size={size}
            value={new Date(2026, 6, 1)}
            aria-label={`Month picker size ${size}`}
            clearable
          />
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the full shared size scale, matching the Input component density contract.',
      },
    },
  },
};

export const MinMax: Story = {
  name: 'Min/Max',
  args: {
    initialValue: null,
    minMonth: new Date(2018, 9, 12),
    maxMonth: new Date(2028, 2, 28),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Constrains month selection and year navigation while still allowing faster year jumps from the header.',
      },
    },
  },
};

export const Clearable: Story = {
  args: {
    clearable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the inline clear affordance when a month is selected.',
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disables the trigger and prevents month selection.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    initialValue: null,
    error: 'Select a billing month before continuing.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows destructive validation treatment and inline error messaging for form usage.',
      },
    },
  },
};

export const FormFieldUsage: Story = {
  name: 'Form Field',
  render: () => <FormFieldStory />,
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates shared form composition with React Hook Form control, validation, external value updates, and the faster year jump pattern.',
      },
    },
  },
};
