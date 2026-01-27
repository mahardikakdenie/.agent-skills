import type { Meta, StoryObj } from '@storybook/react';
import { AlertCircle, AlertTriangle, CircleDot, ShieldCheck, Tag } from 'lucide-react';
import type { ComponentType } from 'react';

import { Box } from '../Box';
import { Badge, type BadgeProps } from './Badge';

type BadgeVariant = NonNullable<BadgeProps['variant']>;
type BadgeSize = NonNullable<BadgeProps['size']>;

const variantIcons: Record<BadgeVariant, ComponentType<{ className?: string }>> = {
  default: Tag,
  secondary: CircleDot,
  danger: AlertCircle,
  warning: AlertTriangle,
  outline: ShieldCheck,
};

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'danger', 'warning', 'outline'],
      description: 'The visual style variant of the badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the badge',
    },
    children: {
      control: 'text',
      description: 'The content of the badge',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

function renderBadge(args: BadgeProps, label: string) {
  const variant: BadgeVariant = args.variant ?? 'default';
  const Icon = variantIcons[variant];

  return (
    <Box className="flex items-center gap-2">
      <Badge {...args}>
        <Icon className="h-3.5 w-3.5" />
        <Box as="span">{label}</Box>
      </Badge>
    </Box>
  );
}

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    children: 'Default',
  },
  render: (args) => renderBadge(args, String(args.children ?? 'Default')),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
  render: (args) => renderBadge(args, String(args.children ?? 'Secondary')),
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger',
  },
  render: (args) => renderBadge(args, String(args.children ?? 'Danger')),
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
  render: (args) => renderBadge(args, String(args.children ?? 'Warning')),
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
  render: (args) => renderBadge(args, String(args.children ?? 'Outline')),
};

export const SmallSize: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
  render: (args) => renderBadge(args, String(args.children ?? 'Small')),
};

export const MediumSize: Story = {
  args: {
    size: 'md',
    children: 'Medium',
  },
  render: (args) => renderBadge(args, String(args.children ?? 'Medium')),
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
  render: (args) => renderBadge(args, String(args.children ?? 'Large')),
};

export const TextOnly: Story = {
  args: {
    variant: 'secondary',
    children: 'No icon',
  },
  render: (args) => (
    <Badge {...args}>
      <Box as="span">{String(args.children ?? 'No icon')}</Box>
    </Badge>
  ),
};

export const Numeric: Story = {
  args: {
    variant: 'default',
    children: '12',
  },
  render: (args) => (
    <Box className="flex items-center gap-2">
      <Badge {...args}>
        <Box as="span" className="tabular-nums">
          {String(args.children ?? '12')}
        </Box>
      </Badge>
      <Badge variant="danger" size={args.size}>
        <Box as="span" className="tabular-nums">
          99+
        </Box>
      </Badge>
    </Box>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    children: 'Playground',
  },
  render: (args) => renderBadge(args, String(args.children ?? 'Playground')),
};

export const AllVariants: Story = {
  render: () => {
    const variants: BadgeVariant[] = ['default', 'secondary', 'danger', 'warning', 'outline'];

    return (
      <Box className="flex flex-wrap items-center gap-2">
        {variants.map((variant) => {
          const Icon = variantIcons[variant];

          return (
            <Badge key={variant} variant={variant}>
              <Icon className="h-3.5 w-3.5" />
              <Box as="span" className="capitalize">
                {variant}
              </Box>
            </Badge>
          );
        })}
      </Box>
    );
  },
};

export const AllSizes: Story = {
  render: () => {
    const sizes: BadgeSize[] = ['sm', 'md', 'lg'];

    return (
      <Box className="flex items-center gap-2">
        {sizes.map((size) => (
          <Badge key={size} size={size} variant="secondary">
            <CircleDot className="h-3.5 w-3.5" />
            <Box as="span">{size.toUpperCase()}</Box>
          </Badge>
        ))}
      </Box>
    );
  },
};
