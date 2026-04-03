import type { Meta, StoryObj } from '@storybook/react-vite';

import { Box } from '../Box';
import { Avatar } from './Avatar';
import { avatarSizeValues } from './Avatar.types';

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'Shadcn UI',
    variant: 'outline',
    size: 'md',
  },
  argTypes: {
    src: {
      control: 'text',
    },
    alt: {
      control: 'text',
    },
    fallback: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: avatarSizeValues,
    },
    variant: {
      control: 'select',
      options: ['outline', 'shadow'],
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
          'Compact identity-image primitive backed by Radix Avatar with text fallback and shared size scaling.',
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline shared avatar with a loaded image source.',
      },
    },
  },
};

export const Fallback: Story = {
  args: {
    src: undefined,
    alt: 'Ayu Pratama',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the derived initials fallback when no image source is provided.',
      },
    },
  },
};

export const Shadow: Story = {
  args: {
    variant: 'shadow',
  },
  parameters: {
    docs: {
      description: {
        story: 'Applies the explicit `shadow` surface variant on the avatar shell.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Box className="flex flex-wrap items-end gap-4">
      {avatarSizeValues.map((size) => (
        <Box key={size} className="flex flex-col items-center gap-2">
          <Avatar size={size} alt="Mina Putri" />
          <Box as="span" className="text-xs text-muted-foreground uppercase">
            {size}
          </Box>
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares the shared avatar size scale from compact to profile-summary usage.',
      },
    },
  },
};

export const StackedGroup: Story = {
  render: () => (
    <Box className="flex -space-x-2">
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Shadcn UI"
        className="ring-2 ring-background"
      />
      <Avatar
        src="https://github.com/evilrabbit.png"
        alt="Evil Rabbit"
        className="ring-2 ring-background"
      />
      <Avatar alt="Mina Putri" className="ring-2 ring-background" />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows the approved consumer-composed stacked-avatar pattern without widening the shared API.',
      },
    },
  },
};
