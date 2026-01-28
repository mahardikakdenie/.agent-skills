import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { Box } from '../Box';
import { Calendar } from './Calendar';

const meta = {
  title: 'Components/Forms/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <Box className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </Box>
    );
  },
};

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(new Date().getFullYear(), 0, 10),
      to: new Date(new Date().getFullYear(), 0, 17),
    });

    return (
      <Box className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} />
      </Box>
    );
  },
};
