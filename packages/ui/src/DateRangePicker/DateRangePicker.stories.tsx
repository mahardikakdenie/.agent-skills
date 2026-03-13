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
import type {
  DateRangePickerPreset,
  DateRangePickerProps,
  DateRangeValue,
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

function getRangeLabel(value: DateRangeValue | null | undefined) {
  if (!value?.from) {
    return 'Selected: none';
  }

  if (!value.to) {
    return `Selected: ${value.from.toDateString()} - ...`;
  }

  return `Selected: ${value.from.toDateString()} - ${value.to.toDateString()}`;
}

function DateRangePickerStory({
  initialValue = null,
  presets,
  minDate,
  maxDate,
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
        presets={presets}
        minDate={minDate}
        maxDate={maxDate}
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
        {getRangeLabel(value)}
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
                from: new Date(2026, 1, 10),
                to: new Date(2026, 1, 18),
              });
              form.clearErrors('travelWindow');
            }}
          >
            Prefill
          </Button>
        </Box>
      </Form>

      <Box as="p" className="text-sm text-muted-foreground">
        {getRangeLabel(selectedValue)}
      </Box>
    </StoryFrame>
  );
}

const meta = {
  title: 'Inputs/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  args: {
    initialValue: {
      from: new Date(2026, 0, 15),
      to: new Date(2026, 0, 21),
    },
    presets: undefined,
    minDate: undefined,
    maxDate: undefined,
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
    presets: {
      control: false,
    },
    minDate: {
      control: 'date',
    },
    maxDate: {
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
          'Shared date-range picker composed from the Calendar and Popover primitives, with optional generic presets, min/max bounds, clear support, and Box-only authored JSX.',
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
          'Demonstrates shared form composition with React Hook Form control, validation, preset shortcuts, and external value updates.',
      },
    },
  },
};
