import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box } from '../Box'
import { Spinner } from './Spinner'

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: {
    size: 'md',
    inline: false,
    overlay: false,
    label: undefined,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    label: {
      control: 'text',
    },
    inline: {
      control: 'boolean',
    },
    overlay: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Indeterminate loading primitive for inline busy states, centered loading shells, and simple blocking overlays.',
      },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline centered spinner with the default accessible loading label.',
      },
    },
  },
}

export const Sizes: Story = {
  render: () => (
    <Box className="flex flex-wrap items-center justify-center gap-6">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares the shared size scale used for compact, default, and prominent loading states.',
      },
    },
  },
}

export const Inline: Story = {
  args: {
    inline: true,
    label: 'Saving changes',
  },
  render: (args) => (
    <Box className="flex flex-wrap items-center gap-3 text-sm text-foreground">
      <Box as="span">Action status:</Box>
      <Spinner {...args} />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Uses inline mode for dense in-flow loading feedback next to surrounding content.',
      },
    },
  },
}

export const Overlay: Story = {
  args: {
    overlay: true,
    label: 'Loading account summary',
  },
  render: (args) => (
    <Box className="relative min-h-64 overflow-hidden rounded-xl border border-border bg-card">
      <Box className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
        Demo surface behind the blocking overlay
      </Box>
      <Spinner {...args} className="absolute inset-0" />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the blocking overlay treatment while constraining the demo to the story frame.',
      },
    },
  },
}

export const Labeled: Story = {
  args: {
    label: 'Preparing dashboard data',
  },
  parameters: {
    docs: {
      description: {
        story: 'Adds visible loading copy while preserving the spinner as a polite status region.',
      },
    },
  },
}

