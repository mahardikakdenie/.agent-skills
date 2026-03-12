import type { Meta, StoryObj } from '@storybook/react-vite'

import { cn } from '@repo/helper'

import { Box } from '../Box'
import { Card, CardContent, CardHeader } from '../Card'
import { Skeleton } from './Skeleton'

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    className: 'h-4 w-[220px]',
  },
  argTypes: {
    className: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shape-only loading placeholder primitive for inline, block, and composed skeleton layouts.',
      },
    },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline block placeholder shaped only through `className`.',
      },
    },
  },
}

export const Text: Story = {
  render: (args) => (
    <Box className="flex max-w-sm flex-col gap-2">
      <Skeleton {...args} className={cn('h-4 w-full', args.className)} />
      <Skeleton className="h-4 w-[88%]" />
      <Skeleton className="h-4 w-[72%]" />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common stacked text-line loading treatment for paragraphs and list copy.',
      },
    },
  },
}

export const Block: Story = {
  render: () => (
    <Box className="flex flex-wrap items-end gap-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <Skeleton className="h-24 w-[320px]" />
      <Skeleton className="h-40 w-[220px] rounded-xl" />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows avatar, panel, and large-block placeholder shapes without adding public variants.',
      },
    },
  },
}

export const CardPlaceholder: Story = {
  name: 'Card',
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader className="gap-3">
        <Skeleton className="h-6 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[78%]" />
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Composes a realistic card placeholder using shared layout primitives.',
      },
    },
  },
}

