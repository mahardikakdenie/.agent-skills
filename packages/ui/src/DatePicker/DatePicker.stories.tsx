import { format } from 'date-fns';
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
import { DatePicker } from './DatePicker';
import {
  datePickerModeValues,
  datePickerSizeValues,
  type DatePickerProps,
  datePickerVariantValues,
} from './DatePicker.types';

interface DatePickerStoryArgs extends DatePickerProps {
  initialValue?: Date | null;
}

function StoryFrame({ children }: { children: React.ReactNode }) {
  return <Box className="mx-auto flex w-full max-w-sm flex-col gap-4 p-4">{children}</Box>;
}

function getValueLabel(value: Date | null, withTime: boolean) {
  if (!value) {
    return 'Selected: none';
  }

  return withTime ? `Selected: ${value.toLocaleString()}` : `Selected: ${value.toDateString()}`;
}

function DatePickerStory({
  variant,
  size,
  formatDate,
  initialValue = null,
  minDate,
  maxDate,
  withTime = false,
  minDateTime,
  maxDateTime,
  timezone,
  placeholder,
  disabled,
  clearable,
  required,
  label,
  error,
  onChange,
  onClose,
}: DatePickerStoryArgs) {
  const [value, setValue] = React.useState<Date | null>(initialValue);

  return (
    <StoryFrame>
      <DatePicker
        variant={variant}
        size={size}
        formatDate={formatDate}
        label={label}
        value={value}
        onChange={(nextValue) => {
          setValue(nextValue);
          onChange?.(nextValue);
        }}
        minDate={minDate}
        maxDate={maxDate}
        withTime={withTime}
        minDateTime={minDateTime}
        maxDateTime={maxDateTime}
        timezone={timezone}
        placeholder={placeholder}
        disabled={disabled}
        clearable={clearable}
        required={required}
        error={error}
        onClose={onClose}
      />
      <Box as="p" aria-live="polite" className="text-sm text-muted-foreground">
        {getValueLabel(value, withTime)}
      </Box>
    </StoryFrame>
  );
}

function FormFieldStory() {
  const form = useForm<{ appointment: Date | null }>({
    defaultValues: {
      appointment: null,
    },
    mode: 'onSubmit',
  });
  const selectedValue = form.watch('appointment');

  return (
    <StoryFrame>
      <Form form={form} onSubmit={form.handleSubmit(() => undefined)}>
        <FormField
          name="appointment"
          rules={{ required: 'Select an appointment date.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Appointment</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Choose an appointment"
                  withTime
                  clearable
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
              form.setValue('appointment', new Date(2026, 1, 20, 14, 30));
              form.clearErrors('appointment');
            }}
          >
            Prefill
          </Button>
        </Box>
      </Form>

      <Box as="p" className="text-sm text-muted-foreground">
        {getValueLabel(selectedValue, true)}
      </Box>
    </StoryFrame>
  );
}

const meta = {
  title: 'Inputs/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    size: 'md',
    formatDate: undefined,
    label: 'Travel Date',
    placeholder: 'Pick a date',
    disabled: false,
    clearable: true,
    required: false,
    error: false,
    mode: 'single',
    withTime: false,
    initialValue: new Date(2026, 0, 15),
    minDate: undefined,
    maxDate: undefined,
    minDateTime: undefined,
    maxDateTime: undefined,
    timezone: undefined,
    onChange: fn(),
    onClose: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: datePickerVariantValues,
    },
    size: {
      control: 'select',
      options: datePickerSizeValues,
    },
    formatDate: {
      control: false,
    },
    label: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
    mode: {
      control: 'select',
      options: datePickerModeValues,
    },
    withTime: {
      control: 'boolean',
    },
    timezone: {
      control: 'text',
    },
    initialValue: {
      control: false,
    },
    value: {
      control: false,
    },
    open: {
      control: false,
    },
    minDate: {
      control: 'date',
    },
    maxDate: {
      control: 'date',
    },
    minDateTime: {
      control: 'date',
    },
    maxDateTime: {
      control: 'date',
    },
    onChange: {
      action: 'changed',
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
          'Shared single-date picker composed from the Calendar and Popover primitives, with Input-aligned trigger variants, size scale, optional time entry, min/max bounds, clear support, and Box-only authored JSX.',
      },
    },
  },
  render: (args: DatePickerStoryArgs) => <DatePickerStory {...args} />,
} satisfies Meta<DatePickerStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Baseline single-date picker with a selected value, shared trigger shell, and clear action.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-3">
      {datePickerVariantValues.map((variant) => (
        <DatePicker
          key={variant}
          variant={variant}
          label={variant.charAt(0).toUpperCase() + variant.slice(1)}
          placeholder={`Variant: ${variant}`}
          value={new Date(2026, 0, 15)}
        />
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares the Input-aligned DatePicker trigger variants.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-2">
      {datePickerSizeValues.map((size) => (
        <DatePicker
          key={size}
          size={size}
          label={`Size ${size.toUpperCase()}`}
          placeholder={`Date picker size: ${size}`}
          value={new Date(2026, 0, 15)}
        />
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

export const WithMinMax: Story = {
  name: 'With Min/Max',
  args: {
    initialValue: null,
    minDate: new Date(2026, 0, 10),
    maxDate: new Date(2026, 0, 24),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Constrains calendar selection and month navigation to the allowed booking window.',
      },
    },
  },
};

export const WithTime: Story = {
  name: 'With Time',
  args: {
    initialValue: new Date(2026, 0, 15, 10, 30),
    label: 'Appointment',
    placeholder: 'Pick a date and time',
    withTime: true,
    timezone: 'UTC',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Expands the shared picker with an inline time field while keeping the emitted value a plain Date.',
      },
    },
  },
};

export const WithTimeBounds: Story = {
  name: 'With Time Bounds',
  args: {
    initialValue: new Date(2026, 0, 15, 10, 30),
    label: 'Deadline',
    withTime: true,
    minDateTime: new Date(2026, 0, 15, 9, 15),
    maxDateTime: new Date(2026, 0, 16, 17, 45),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Constrains both calendar selection and time entry when the selected day hits the minimum or maximum boundary.',
      },
    },
  },
};

export const CustomFormat: Story = {
  render: (args) => (
    <DatePickerStory
      {...args}
      label="Long Date"
      formatDate={(date) => format(date, 'EEEE, d MMMM yyyy')}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Overrides the trigger display string without changing the selected Date value contract.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    initialValue: null,
    error: 'Select a valid travel date before continuing.',
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

export const DisabledState: Story = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Keeps the trigger and clear affordance inactive when the field is disabled.',
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
          'Demonstrates shared form composition with React Hook Form control, validation, external value updates, and optional time entry.',
      },
    },
  },
};
