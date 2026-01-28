import type { Meta, StoryObj } from '@storybook/react';
import { clsx } from 'clsx';
import { useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { Badge } from '../Badge';
import { Box } from '../Box';
import { Button } from '../Button';
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';

type TooltipRootProps = ComponentPropsWithoutRef<typeof Tooltip>;
type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipContent>;
type TooltipProviderProps = ComponentPropsWithoutRef<typeof TooltipProvider>;

type RenderOptions = {
  contentProps?: TooltipContentProps;
  providerProps?: TooltipProviderProps;
  canvasClassName?: string;
};

const meta = {
  title: 'Components/Overlays/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the tooltip should be open on initial render',
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state of the tooltip',
    },
    delayDuration: {
      control: 'number',
      description: 'The delay in milliseconds before showing the tooltip (provider)',
    },
    disableHoverableContent: {
      control: 'boolean',
      description: 'When true, hovering tooltip content will close it (provider)',
    },
  },
  args: {
    defaultOpen: false,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

function TooltipCanvas({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Box
      className={clsx(
        'flex min-h-[240px] min-w-[520px] items-center justify-center p-16',
        className,
      )}
    >
      {children}
    </Box>
  );
}

function renderBasicTooltip(rootProps: TooltipRootProps, options: RenderOptions = {}) {
  const { contentProps, providerProps, canvasClassName } = options;
  const { children, ...restContentProps } = contentProps ?? {};

  const defaultContent = (
    <Box className="text-sm text-gray-700">Your next payment is due in 3 days.</Box>
  );

  return (
    <TooltipCanvas className={canvasClassName}>
      <TooltipProvider delayDuration={300} {...providerProps}>
        <Tooltip {...rootProps}>
          <TooltipTrigger asChild>
            <Button variant="secondary">Hover for details</Button>
          </TooltipTrigger>
          <TooltipContent {...restContentProps}>{children ?? defaultContent}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TooltipCanvas>
  );
}

export const Default: Story = {
  render: (args: TooltipRootProps) => renderBasicTooltip(args),
};

export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args: TooltipRootProps) => renderBasicTooltip(args),
};

export const WithArrow: Story = {
  render: (args: TooltipRootProps) =>
    renderBasicTooltip(args, {
      contentProps: {
        sideOffset: 8,
        children: (
          <Box className="flex items-center gap-2 text-sm text-gray-700">
            <Badge size="sm">Tip</Badge>
            Savings applied at checkout.
            <TooltipArrow />
          </Box>
        ),
      },
    }),
};

export const SideVariants: Story = {
  render: () => {
    const sides: NonNullable<TooltipContentProps['side']>[] = ['top', 'right', 'bottom', 'left'];

    return (
      <TooltipCanvas>
        <TooltipProvider delayDuration={150}>
          <Box className="grid grid-cols-2 gap-6">
            {sides.map((side) => (
              <Tooltip key={side}>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="w-40">
                    Side: {side}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={side} sideOffset={10}>
                  <Box className="text-sm text-gray-700">Positioned on the {side} side.</Box>
                  <TooltipArrow />
                </TooltipContent>
              </Tooltip>
            ))}
          </Box>
        </TooltipProvider>
      </TooltipCanvas>
    );
  },
};

export const AlignVariants: Story = {
  render: () => {
    const aligns: NonNullable<TooltipContentProps['align']>[] = ['start', 'center', 'end'];

    return (
      <TooltipCanvas className="min-h-[280px]">
        <TooltipProvider delayDuration={200}>
          <Box className="flex flex-col items-center gap-6">
            {aligns.map((align) => (
              <Box key={align} className="flex w-[320px] justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="w-full">
                      Align: {align}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent align={align} sideOffset={8}>
                    <Box className="text-sm text-gray-700">Alignment set to {align}.</Box>
                    <TooltipArrow />
                  </TooltipContent>
                </Tooltip>
              </Box>
            ))}
          </Box>
        </TooltipProvider>
      </TooltipCanvas>
    );
  },
};

export const DelayDurations: Story = {
  render: () => (
    <TooltipCanvas>
      <TooltipProvider delayDuration={700} skipDelayDuration={300}>
        <Box className="flex flex-col items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary">Long delay</Button>
            </TooltipTrigger>
            <TooltipContent>
              <Box className="text-sm text-gray-700">This tooltip waits 700ms before opening.</Box>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Quick follow-up</Button>
            </TooltipTrigger>
            <TooltipContent>
              <Box className="text-sm text-gray-700">
                Hovering shortly after another tooltip uses the skip delay.
              </Box>
            </TooltipContent>
          </Tooltip>
        </Box>
      </TooltipProvider>
    </TooltipCanvas>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <TooltipCanvas>
        <TooltipProvider delayDuration={0}>
          <Box className="flex flex-col items-center gap-4">
            <Tooltip open={open} onOpenChange={setOpen}>
              <TooltipTrigger asChild>
                <Button variant="secondary">{open ? 'Hide tip' : 'Show tip'}</Button>
              </TooltipTrigger>
              <TooltipContent>
                <Box className="text-sm text-gray-700">
                  Controlled open state: {open ? 'open' : 'closed'}.
                </Box>
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>

            <Button size="sm" variant="ghost" onClick={() => setOpen((prev) => !prev)}>
              Toggle programmatically
            </Button>
          </Box>
        </TooltipProvider>
      </TooltipCanvas>
    );
  },
};

export const DisableHoverableContent: Story = {
  render: () => (
    <TooltipCanvas>
      <TooltipProvider delayDuration={200} disableHoverableContent>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover and move into content</Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-[220px]">
            <Box className="flex flex-col gap-1 text-sm text-gray-700">
              <Box className="font-medium text-gray-900">Hoverable content disabled</Box>
              <Box>Moving your pointer into the tooltip will close it immediately.</Box>
            </Box>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TooltipCanvas>
  ),
};
