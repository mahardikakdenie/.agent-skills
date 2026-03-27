import { addDays } from 'date-fns';
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
import { DateRangePicker } from './DateRangePicker';
import {
  dateRangePickerChangeBehaviorValues,
  dateRangePickerSizeValues,
  dateRangePickerVariantValues,
  type DateRangePickerPreset,
  type DateRangePickerProps,
  type DateRangeValue,
} from './DateRangePicker.types';

interface DateRangePickerStoryArgs extends DateRangePickerProps {
  initialValue?: DateRangeValue | null;
}

const presetBaseDate = new Date(2026, 0, 15);
const storyPresets: DateRangePickerPreset[] = [
  {
    label: 'Last 7 days',
    value: {
      from: addDays(presetBaseDate, -6),
      to: presetBaseDate,
    },
  },
  {
    label: 'This month',
    value: {
      from: new Date(2026, 0, 1),
      to: new Date(2026, 0, 31),
    },
  },
  {
    label: 'Next 30 days',
    value: {
      from: presetBaseDate,
      to: addDays(presetBaseDate, 29),
    },
  },
];

function StoryFrame({ children }: { children: React.ReactNode }) {
  return <Box className="mx-auto flex w-full max-w-sm flex-col gap-4 p-4">{children}</Box>;
}

function getRangeLabel(value: DateRangeValue | null | undefined, withTime: boolean) {
  if (!value?.from) {
    return 'Selected: none';
  }

  if (!value.to) {
    return withTime
      ? `Selected: ${value.from.toLocaleString()} - ...`
      : `Selected: ${value.from.toDateString()} - ...`;
  }

  return withTime
    ? `Selected: ${value.from.toLocaleString()} - ${value.to.toLocaleString()}`
    : `Selected: ${value.from.toDateString()} - ${value.to.toDateString()}`;
}

function DateRangePickerStory({
  initialValue = null,
  changeBehavior,
  presets,
  minDate,
  maxDate,
  withTime = false,
  minDateTime,
  maxDateTime,
  timezone,
  disabled,
  clearable,
  error,
  onChange,
  ...args
}: DateRangePickerStoryArgs) {
  const [value, setValue] = React.useState<DateRangeValue | null>(initialValue);

  return (
    <StoryFrame>
      <DateRangePicker
        value={value}
        changeBehavior={changeBehavior}
        presets={presets}
        minDate={minDate}
        maxDate={maxDate}
        withTime={withTime}
        minDateTime={minDateTime}
        maxDateTime={maxDateTime}
        timezone={timezone}
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
        {getRangeLabel(value, withTime)}
      </Box>
    </StoryFrame>
  );
}

function FormFieldStory() {
  const form = useForm<{ travelWindow: DateRangeValue | null }>({
    defaultValues: {
      travelWindow: null,
    },
    mode: 'onSubmit',
  });
  const selectedValue = form.watch('travelWindow');

  return (
    <StoryFrame>
      <Form form={form} onSubmit={form.handleSubmit(() => undefined)}>
        <FormField
          name="travelWindow"
          rules={{
            validate: (value) =>
              value?.from && value?.to ? true : 'Select both start and end dates.',
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Travel window</FormLabel>
              <FormControl>
                <DateRangePicker
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  clearable
                  withTime
                  presets={storyPresets}
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
              form.setValue('travelWindow', {
                from: new Date(2026, 1, 10, 9, 0),
                to: new Date(2026, 1, 18, 17, 0),
              });
              form.clearErrors('travelWindow');
            }}
          >
            Prefill
          </Button>
        </Box>
      </Form>

      <Box as="p" className="text-sm text-muted-foreground">
        {getRangeLabel(selectedValue, true)}
      </Box>
    </StoryFrame>
  );
}

const meta = {
  title: 'Inputs/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    size: 'md',
    changeBehavior: 'partial',
    initialValue: {
      from: new Date(2026, 0, 15),
      to: new Date(2026, 0, 21),
    },
    presets: undefined,
    minDate: undefined,
    maxDate: undefined,
    withTime: false,
    minDateTime: undefined,
    maxDateTime: undefined,
    timezone: undefined,
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
      options: dateRangePickerVariantValues,
    },
    size: {
      control: 'select',
      options: dateRangePickerSizeValues,
    },
    changeBehavior: {
      control: 'select',
      options: dateRangePickerChangeBehaviorValues,
    },
    presets: {
      control: false,
    },
    minDate: {
      control: 'date',
    },
    maxDate: {
      control: 'date',
    },
    withTime: {
      control: 'boolean',
    },
    minDateTime: {
      control: 'date',
    },
    maxDateTime: {
      control: 'date',
    },
    timezone: {
      control: 'text',
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
          'Shared date-range picker composed from the Calendar and Popover primitives, with optional generic presets, optional time entry, min/max bounds, clear support, configurable partial-versus-complete change emission, and Box-only authored JSX.',
      },
    },
  },
  render: (args: DateRangePickerStoryArgs) => <DateRangePickerStory {...args} />,
} satisfies Meta<DateRangePickerStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Basic',
  parameters: {
    docs: {
      description: {
        story:
          'Baseline range picker with a selected start and end date, shared trigger shell, and clear action.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-3">
      {dateRangePickerVariantValues.map((variant) => (
        <Box key={variant} className="flex flex-col gap-2">
          <Box as="p" className="text-sm font-medium text-foreground">
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Box>
          <DateRangePicker
            variant={variant}
            value={{
              from: new Date(2026, 0, 15),
              to: new Date(2026, 0, 21),
            }}
            aria-label={`Date range picker variant ${variant}`}
            clearable
          />
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares the Input-aligned DateRangePicker trigger variants.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-2">
      {dateRangePickerSizeValues.map((size) => (
        <Box key={size} className="flex flex-col gap-2">
          <Box as="p" className="text-sm font-medium text-foreground">
            {`Size ${size.toUpperCase()}`}
          </Box>
          <DateRangePicker
            size={size}
            value={{
              from: new Date(2026, 0, 15),
              to: new Date(2026, 0, 21),
            }}
            aria-label={`Date range picker size ${size}`}
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

export const CompleteOnlyChange: Story = {
  args: {
    initialValue: null,
    changeBehavior: 'complete',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Defers the parent onChange callback until both range boundaries are selected while the picker still previews the in-progress selection internally.',
      },
    },
  },
};

export const WithPresets: Story = {
  args: {
    initialValue: null,
    presets: storyPresets,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the optional generic preset row for common shortcut ranges without introducing workflow-specific apply buttons.',
      },
    },
  },
};

export const WithBounds: Story = {
  args: {
    initialValue: null,
    minDate: new Date(2026, 0, 1),
    maxDate: new Date(2026, 2, 31),
    presets: storyPresets,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Constrains calendar selection and disables preset ranges that fall outside the allowed window.',
      },
    },
  },
};

export const WithTime: Story = {
  args: {
    initialValue: {
      from: new Date(2026, 0, 15, 9, 0),
      to: new Date(2026, 0, 18, 17, 0),
    },
    withTime: true,
    timezone: 'UTC',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Expands the shared range picker with start and end time inputs while keeping the value contract as a plain Date range.',
      },
    },
  },
};

export const WithTimeBounds: Story = {
  args: {
    initialValue: {
      from: new Date(2026, 0, 15, 10, 30),
      to: new Date(2026, 0, 16, 16, 15),
    },
    withTime: true,
    minDateTime: new Date(2026, 0, 15, 9, 15),
    maxDateTime: new Date(2026, 0, 16, 17, 45),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Constrains both date selection and each time field when the range touches the minimum or maximum datetime boundary.',
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
        story: 'Shows the inline clear affordance when any start or end date is selected.',
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
        story: 'Disables the trigger and prevents range selection.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    initialValue: null,
    error: 'Select a valid date range before continuing.',
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
          'Demonstrates shared form composition with React Hook Form control, validation, preset shortcuts, external value updates, and optional time entry.',
      },
    },
  },
};

