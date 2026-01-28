import type { Meta, StoryObj } from '@storybook/react';

import { Box } from '../Box';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';

const avatarPlaceholder = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='80' height='80' fill='%23E2E8F0'/><text x='40' y='50' font-size='28' text-anchor='middle' fill='%230F172A' font-family='Arial' dominant-baseline='middle'>FS</text></svg>`;

const meta = {
  title: 'Components/Data Display/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  render: () => (
    <Box className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src={avatarPlaceholder} alt="Friendsure" />
        <AvatarFallback>FS</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarImage src={avatarPlaceholder} alt="Friendsure" />
        <AvatarFallback>FS</AvatarFallback>
      </Avatar>
      <Avatar className="h-14 w-14">
        <AvatarImage src={avatarPlaceholder} alt="Friendsure" />
        <AvatarFallback>FS</AvatarFallback>
      </Avatar>
    </Box>
  ),
};

export const FallbackOnly: Story = {
  render: () => (
    <Box className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>FS</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar className="h-14 w-14">
        <AvatarFallback>LT</AvatarFallback>
      </Avatar>
    </Box>
  ),
};
