import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

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

function InteractiveCalendarStory() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [visibleMonth, setVisibleMonth] = React.useState(new Date(2026, 0, 1));

  return (
    <Box className="grid gap-3">
      <Calendar
        mode="single"
        month={visibleMonth}
        onMonthChange={setVisibleMonth}
        selected={selectedDate}
        onSelect={setSelectedDate}
      />
      <Box as="p" className="text-sm text-muted-foreground">
        {selectedDate ? `Selected: ${formatStoryDate(selectedDate)}` : 'Selected: none'}
      </Box>
    </Box>
  );
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
  name: 'Multiple Selection',
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
  name: 'Disabled Dates',
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
  name: 'Range Preview',
  render: () => <RangePreviewStory />,
  parameters: {
    docs: {
      description: {
        story: 'Exercises the shared range styling across two visible months without adding field-shell behavior.',
      },
    },
  },
};

export const Interactive: Story = {
  render: () => <InteractiveCalendarStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /next month/i }));
    await expect(canvas.getByRole('button', { name: 'February 2026' })).toBeInTheDocument();

    const dayButton = canvas
      .getAllByRole('gridcell')
      .find((button) => button.textContent?.trim() === '15');

    if (!dayButton) {
      throw new Error('Unable to find the day button for the interactive story.');
    }

    await userEvent.click(dayButton);
    await expect(canvas.getByText('Selected: Feb 15, 2026')).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirms month navigation and single-date selection in a controlled story.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Box className="max-w-xs">
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 0, 1)}
        selected={new Date(2026, 0, 15)}
      />
    </Box>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Checks that the shared calendar grid remains legible and navigable in a constrained mobile viewport.',
      },
    },
  },
};



