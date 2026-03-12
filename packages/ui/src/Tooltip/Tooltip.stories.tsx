import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleHelp, Info, ShieldCheck } from 'lucide-react';
import * as React from 'react';
import { fn } from 'storybook/test';

import { Box } from '../Box';
import { Button } from '../Button';
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';
import {
  tooltipAlignValues,
  type TooltipAlign,
  tooltipSideValues,
  type TooltipProps,
  type TooltipSide,
} from './Tooltip.types';

interface TooltipStoryArgs extends TooltipProps {
  align: TooltipAlign;
  side: TooltipSide;
  sideOffset: number;
}

function StoryFrame({ children }: { children: React.ReactNode }) {
  return <Box className='flex min-h-[18rem] items-start justify-center p-4'>{children}</Box>;
}

function BasicTooltip({
  defaultOpen,
  onOpen,
  onClose,
  delayDuration,
  disableHoverableContent,
  disabled,
  align,
  side,
  sideOffset,
}: TooltipStoryArgs) {
  return (
    <StoryFrame>
      <Tooltip
        defaultOpen={defaultOpen}
        onOpen={onOpen}
        onClose={onClose}
        delayDuration={delayDuration}
        disableHoverableContent={disableHoverableContent}
        disabled={disabled}
      >
        <TooltipTrigger asChild>
          <Button variant='outline' size='sm' disabled={disabled}>
            <Info aria-hidden='true' className='h-4 w-4' />
            Coverage Notes
          </Button>
        </TooltipTrigger>
        <TooltipContent align={align} side={side} sideOffset={sideOffset}>
          Renewal details become available after the policy enters review.
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </StoryFrame>
  );
}

function SideVariantsStory() {
  return (
    <StoryFrame>
      <TooltipProvider delayDuration={0}>
        <Box className='grid gap-12 pt-10 sm:grid-cols-2'>
          {tooltipSideValues.map((currentSide) => (
            <Tooltip key={currentSide} delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant='outline' size='sm'>
                  {currentSide[0]?.toUpperCase()}
                  {currentSide.slice(1)}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={currentSide} sideOffset={8}>
                {currentSide[0]?.toUpperCase()}
                {currentSide.slice(1)} aligned helper copy
              </TooltipContent>
            </Tooltip>
          ))}
        </Box>
      </TooltipProvider>
    </StoryFrame>
  );
}

function LongContentStory(args: Pick<TooltipStoryArgs, 'align' | 'side' | 'sideOffset'>) {
  return (
    <StoryFrame>
      <TooltipProvider delayDuration={0}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button variant='outline' size='sm'>
              <ShieldCheck aria-hidden='true' className='h-4 w-4' />
              View Long Guidance
            </Button>
          </TooltipTrigger>
          <TooltipContent
            align={args.align}
            side={args.side}
            sideOffset={args.sideOffset}
            className='max-w-80'
          >
            Tooltips should stay brief and assistive, but the shared surface still needs to wrap
            longer migration copy without clipping, overflow, or unreadable line breaks on narrow
            screens.
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </StoryFrame>
  );
}

function ProviderGroupStory() {
  return (
    <StoryFrame>
      <TooltipProvider delayDuration={150} skipDelayDuration={400}>
        <Box className='flex flex-wrap items-center justify-center gap-4'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline' size='sm'>
                <CircleHelp aria-hidden='true' className='h-4 w-4' />
                Payment
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Payment windows close at midnight local time.
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline' size='sm'>
                <CircleHelp aria-hidden='true' className='h-4 w-4' />
                Claim
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Claim uploads accept PDF and PNG files only.
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
        </Box>
      </TooltipProvider>
    </StoryFrame>
  );
}

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    defaultOpen: false,
    delayDuration: 200,
    disableHoverableContent: true,
    disabled: false,
    onOpen: fn(),
    onClose: fn(),
    align: 'center',
    side: 'top',
    sideOffset: 8,
    children: null,
  },
  argTypes: {
    defaultOpen: {
      control: 'boolean',
    },
    delayDuration: {
      control: {
        type: 'number',
        min: 0,
        max: 1000,
        step: 50,
      },
    },
    disableHoverableContent: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    open: {
      control: false,
    },
    onOpen: {
      action: 'opened',
    },
    onClose: {
      action: 'closed',
    },
    align: {
      control: 'select',
      options: tooltipAlignValues,
    },
    side: {
      control: 'select',
      options: tooltipSideValues,
    },
    sideOffset: {
      control: {
        type: 'number',
        min: 0,
        max: 24,
        step: 1,
      },
    },
    children: {
      control: false,
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shared Radix-backed assistive tooltip surface with Box-authored content wrappers, optional grouped timing through TooltipProvider, and tokenized positioning for brief hover or focus help.',
      },
    },
  },
  render: (args: TooltipStoryArgs) => <BasicTooltip {...args} />,
} satisfies Meta<TooltipStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline tooltip for short assistive copy attached to a shared button trigger.',
      },
    },
  },
};

export const SideVariants: Story = {
  render: () => <SideVariantsStory />,
  parameters: {
    docs: {
      description: {
        story:
          'Shows the shared tooltip surface on all four supported placement sides and opens each tooltip only on hover or focus.',
      },
    },
  },
};

export const LongContent: Story = {
  render: (args) => (
    <LongContentStory align={args.align} side={args.side} sideOffset={args.sideOffset} />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Exercises wrapping and readable sizing for longer helper text while keeping the tooltip closed until hover or focus.',
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Disables tooltip activation, keeps the root closed, and forwards the disabled state to the composed trigger.',
      },
    },
  },
};

export const ProviderGroup: Story = {
  render: () => <ProviderGroupStory />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates shared delay timing across multiple tooltips through TooltipProvider.',
      },
    },
  },
};

