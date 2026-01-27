import type { Meta, StoryObj } from '@storybook/react';

import { Box } from '../Box';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'outline', 'ghost'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the button',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading spinner when true',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button when true',
    },
    children: {
      control: 'text',
      description: 'The content of the button',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary variant stories
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const PrimaryLoading: Story = {
  args: {
    variant: 'primary',
    children: 'Loading...',
    loading: true,
  },
};

export const PrimaryDisabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled',
    disabled: true,
  },
};

// Secondary variant stories
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const SecondaryLoading: Story = {
  args: {
    variant: 'secondary',
    children: 'Loading...',
    loading: true,
  },
};

// Danger variant stories
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete',
  },
};

export const DangerLoading: Story = {
  args: {
    variant: 'danger',
    children: 'Deleting...',
    loading: true,
  },
};

// Outline variant stories
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const OutlineLoading: Story = {
  args: {
    variant: 'outline',
    children: 'Loading...',
    loading: true,
  },
};

// Ghost variant stories
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const GhostLoading: Story = {
  args: {
    variant: 'ghost',
    children: 'Loading...',
    loading: true,
  },
};

// Size variants
export const SmallSize: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const MediumSize: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

// Interactive playground
export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Click me!',
    loading: false,
    disabled: false,
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <Box className="flex flex-col gap-4">
      <Box className="flex gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </Box>
      <Box className="flex gap-3">
        <Button variant="primary" loading>
          Loading
        </Button>
        <Button variant="secondary" loading>
          Loading
        </Button>
        <Button variant="danger" loading>
          Loading
        </Button>
      </Box>
      <Box className="flex gap-3">
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button variant="danger" disabled>
          Disabled
        </Button>
      </Box>
    </Box>
  ),
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <Box className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Box>
  ),
};
