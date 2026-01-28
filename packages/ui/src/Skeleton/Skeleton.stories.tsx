import type { Meta, StoryObj } from '@storybook/react';

import { Box } from '../Box';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Tailwind classes for size and shape',
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'h-4 w-40',
  },
};

export const CardPreview: Story = {
  render: () => (
    <Box className="w-[320px] rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <Box className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Box className="flex-1 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
        </Box>
      </Box>
      <Box className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </Box>
    </Box>
  ),
};
