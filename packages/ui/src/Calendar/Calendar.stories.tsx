import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Box } from '../Box';
import { Calendar } from './Calendar';
import { calendarCaptionLayoutValues, calendarModeValues, type DateRange } from './Calendar.types';

const dateLabelFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

function formatStoryDate(date: Date) {
  return dateLabelFormatter.format(date);
}

function MultipleSelectionStory() {
  const [selectedDates, setSelectedDates] = React.useState<Date[] | undefined>([
    new Date(2026, 0, 8),
    new Date(2026, 0, 15),
  ]);

  return (
    <Box className="grid gap-3">
      <Calendar
        mode="multiple"
        month={new Date(2026, 0, 1)}
        selected={selectedDates}
        onSelect={setSelectedDates}
        min={1}
        max={5}
      />
      <Box as="p" className="text-sm text-muted-foreground">
        {selectedDates?.length ? `Selected days: ${selectedDates.length}` : 'Selected days: none'}
      </Box>
    </Box>
  );
}

function RangePreviewStory() {
  const [selectedRange, setSelectedRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 0, 12),
    to: new Date(2026, 0, 18),
  });

  return (
    <Box className="grid gap-3">
      <Calendar
        mode="range"
        numberOfMonths={2}
        defaultMonth={new Date(2026, 0, 1)}
        selected={selectedRange}
        onSelect={setSelectedRange}
      />
      <Box as="p" className="text-sm text-muted-foreground">
        {selectedRange?.from && selectedRange?.to
          ? `Range: ${formatStoryDate(selectedRange.from)} to ${formatStoryDate(selectedRange.to)}`
          : 'Range: incomplete'}
      </Box>
    </Box>
  );
}

const meta = {
  title: 'Data Display/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: {
    mode: 'single',
    defaultMonth: new Date(2026, 0, 1),
    selected: new Date(2026, 0, 15),
    showOutsideDays: true,
    captionLayout: 'buttons',
  },
  argTypes: {
    mode: {
      control: 'select',
      options: calendarModeValues,
    },
    captionLayout: {
      control: 'select',
      options: calendarCaptionLayoutValues,
    },
    showOutsideDays: {
      control: 'boolean',
    },
    numberOfMonths: {
      control: 'number',
    },
    fixedWeeks: {
      control: 'boolean',
    },
    showWeekNumber: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
    onMonthChange: {
      action: 'month changed',
    },
    onSelect: {
      action: 'selected',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Shared inline calendar primitive backed by react-day-picker, with tokenized styling, typed selection modes, and month-navigation pass-through.',
      },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline single-date calendar with the shared tokenized grid, direct date selection, and built-in month navigation behavior.',
      },
    },
  },
};

export const MultipleSelection: Story = {
  render: () => <MultipleSelectionStory />,
  parameters: {
    docs: {
      description: {
        story: 'Shows the shared multiple-date selection mode with selected-day counting.',
      },
    },
  },
};

export const DisabledDates: Story = {
  args: {
    mode: 'single',
    month: new Date(2026, 0, 1),
    disabled: [{ before: new Date(2026, 0, 10) }, { dayOfWeek: [0, 6] }],
    selected: new Date(2026, 0, 15),
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses DayPicker matchers to disable weekends and dates before the allowed window.',
      },
    },
  },
};

export const RangePreview: Story = {
  render: () => <RangePreviewStory />,
  parameters: {
    docs: {
      description: {
        story: 'Exercises the shared range styling across two visible months without adding field-shell behavior.',
      },
    },
  },
};

