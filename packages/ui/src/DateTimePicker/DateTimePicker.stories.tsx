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
import { DateTimePicker } from './DateTimePicker';
import type { DateTimePickerProps } from './DateTimePicker.types';

interface DateTimePickerStoryArgs extends DateTimePickerProps {
  initialValue?: Date | null;
}

function StoryFrame({ children }: { children: React.ReactNode }) {
  return <Box className="mx-auto flex w-full max-w-sm flex-col gap-4 p-4">{children}</Box>;
}

function getValueLabel(value: Date | null) {
  if (!value) {
    return 'Selected: none';
  }

  return `Selected: ${value.toLocaleString()}`;
}

function DateTimePickerStory({
  initialValue = null,
  minDateTime,
  maxDateTime,
  timezone,
  disabled,
  clearable,
  error,
  onChange,
  ...args
}: DateTimePickerStoryArgs) {
  const [value, setValue] = React.useState<Date | null>(initialValue);

  return (
    <StoryFrame>
      <DateTimePicker
        value={value}
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
        {getValueLabel(value)}
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
          rules={{ required: 'Select an appointment date and time.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Appointment</FormLabel>
              <FormControl>
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  clearable
                  aria-label="Appointment date and time"
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
              form.setValue('appointment', new Date(2026, 0, 16, 14, 30));
              form.clearErrors('appointment');
            }}
          >
            Prefill
          </Button>
        </Box>
      </Form>

      <Box as="p" className="text-sm text-muted-foreground">
        {getValueLabel(selectedValue)}
      </Box>
    </StoryFrame>
  );
}

const meta = {
  title: 'Inputs/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  args: {
    initialValue: new Date(2026, 0, 15, 10, 30),
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
          'Shared date-time picker composed from Calendar and Popover with minute-precision time entry, UI-enforced bounds, display-context timezone support, and Box-only authored JSX.',
      },
    },
  },
  render: (args: DateTimePickerStoryArgs) => <DateTimePickerStory {...args} />,
} satisfies Meta<DateTimePickerStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Baseline date-time picker with a selected value, shared trigger shell, inline time field, and clear action.',
      },
    },
  },
};

export const WithBounds: Story = {
  args: {
    initialValue: new Date(2026, 0, 15, 10, 30),
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

export const Timezone: Story = {
  args: {
    timezone: 'UTC',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the display-context timezone note while keeping the emitted value contract as a plain Date.',
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
        story: 'Shows the explicit clear affordance for resetting the selected date and time.',
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
        story: 'Disables the trigger, popover interaction, and clear affordance.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    initialValue: null,
    error: 'Select an appointment date and time before continuing.',
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
          'Demonstrates shared form composition with React Hook Form control, validation, and external value updates.',
      },
    },
  },
};
