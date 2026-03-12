import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarDays, Info, SlidersHorizontal } from 'lucide-react';
import * as React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Button } from '../Button';
import { Input } from '../Input';
import { Popover, PopoverAnchor, PopoverClose, PopoverContent, PopoverTrigger } from './Popover';
import {
  popoverAlignValues,
  popoverSideValues,
  type PopoverAlign,
  type PopoverContentProps,
  type PopoverProps,
  type PopoverSide,
} from './Popover.types';

interface PopoverStoryArgs extends PopoverProps {
  align: PopoverAlign;
  side: PopoverSide;
  sideOffset: number;
  triggerDisabled: boolean;
}

function StoryFrame({ children }: { children: React.ReactNode }) {
  return <Box className="flex min-h-[20rem] items-start justify-center p-4">{children}</Box>;
}

function BasicPopover({
  defaultOpen,
  onOpen,
  onClose,
  align,
  side,
  sideOffset,
  triggerDisabled,
}: Pick<
  PopoverStoryArgs,
  'defaultOpen' | 'onOpen' | 'onClose' | 'align' | 'side' | 'sideOffset' | 'triggerDisabled'
>) {
  return (
    <StoryFrame>
      <Popover defaultOpen={defaultOpen} onOpen={onOpen} onClose={onClose}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" disabled={triggerDisabled}>
            <Info aria-hidden="true" className="h-4 w-4" />
            View Details
          </Button>
        </PopoverTrigger>
        <PopoverContent align={align} side={side} sideOffset={sideOffset}>
          <Box className="grid gap-3">
            <Box className="grid gap-1">
              <Box as="h3" className="text-sm font-semibold text-foreground">
                Renewal Reminder
              </Box>
              <Box as="p" className="text-sm leading-6 text-muted-foreground">
                Confirm the policy dates and supporting details before sending the renewal prompt.
              </Box>
            </Box>
            <Box className="flex justify-end">
              <PopoverClose asChild>
                <Button variant="outline" size="sm">
                  Done
                </Button>
              </PopoverClose>
            </Box>
          </Box>
        </PopoverContent>
      </Popover>
    </StoryFrame>
  );
}

function FormPopover(args: Pick<PopoverStoryArgs, 'align' | 'side' | 'sideOffset'>) {
  return (
    <StoryFrame>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <CalendarDays aria-hidden="true" className="h-4 w-4" />
            Quick Note
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align={args.align}
          side={args.side}
          sideOffset={args.sideOffset}
          className="w-80"
        >
          <Box className="grid gap-4">
            <Box className="grid gap-1">
              <Box as="h3" className="text-sm font-semibold text-foreground">
                Contact Follow-up
              </Box>
              <Box as="p" className="text-sm leading-6 text-muted-foreground">
                Small app-local form shells can compose shared inputs inside the floating surface.
              </Box>
            </Box>
            <Box className="grid gap-3">
              <Input label="Subject" placeholder="Add a short subject" />
              <Input label="Owner" placeholder="Assign a reviewer" />
            </Box>
            <Box className="flex justify-end gap-2">
              <PopoverClose asChild>
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              </PopoverClose>
              <PopoverClose asChild>
                <Button size="sm">Save Note</Button>
              </PopoverClose>
            </Box>
          </Box>
        </PopoverContent>
      </Popover>
    </StoryFrame>
  );
}

function ControlledPopover({
  onOpen,
  onClose,
  align,
  side,
  sideOffset,
}: Pick<PopoverStoryArgs, 'onOpen' | 'onClose' | 'align' | 'side' | 'sideOffset'>) {
  const [open, setOpen] = React.useState(false);

  return (
    <StoryFrame>
      <Popover
        open={open}
        onOpen={() => {
          setOpen(true);
          onOpen?.();
        }}
        onClose={() => {
          setOpen(false);
          onClose?.();
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
            {open ? 'Close Filters' : 'Open Filters'}
          </Button>
        </PopoverTrigger>
        <PopoverContent align={align} side={side} sideOffset={sideOffset} className="w-72">
          <Box className="grid gap-3">
            <Box className="grid gap-1">
              <Box as="h3" className="text-sm font-semibold text-foreground">
                Claim Filters
              </Box>
              <Box as="p" className="text-sm leading-6 text-muted-foreground">
                Controlled usage keeps open state in the parent without turning the shared API into
                a full filter component.
              </Box>
            </Box>
            <Box className="grid gap-2">
              <Button variant="ghost" size="sm" className="justify-start">
                Open claims
              </Button>
              <Button variant="ghost" size="sm" className="justify-start">
                Pending review
              </Button>
              <Button variant="ghost" size="sm" className="justify-start">
                Archived
              </Button>
            </Box>
            <Box className="flex justify-end">
              <PopoverClose asChild>
                <Button variant="outline" size="sm">
                  Apply
                </Button>
              </PopoverClose>
            </Box>
          </Box>
        </PopoverContent>
      </Popover>
    </StoryFrame>
  );
}

function AnchoredPopover(args: Pick<PopoverContentProps, 'align' | 'side' | 'sideOffset'>) {
  return (
    <StoryFrame>
      <Box className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-5">
        <Popover>
          <PopoverAnchor asChild>
            <Box className="inline-flex rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Anchored tag
            </Box>
          </PopoverAnchor>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="ml-3">
              Open Anchor Demo
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align={args.align}
            side={args.side}
            sideOffset={args.sideOffset}
            className="w-64"
          >
            <Box className="grid gap-2">
              <Box as="h3" className="text-sm font-semibold text-foreground">
                Custom Anchor
              </Box>
              <Box as="p" className="text-sm leading-6 text-muted-foreground">
                Use `PopoverAnchor` when the overlay should align to a surface other than the
                trigger.
              </Box>
            </Box>
          </PopoverContent>
        </Popover>
      </Box>
    </StoryFrame>
  );
}

const meta = {
  title: 'Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: {
    defaultOpen: false,
    onOpen: fn(),
    onClose: fn(),
    align: 'center',
    side: 'bottom',
    sideOffset: 8,
    triggerDisabled: false,
    children: null,
  },
  argTypes: {
    defaultOpen: {
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
      options: popoverAlignValues,
    },
    side: {
      control: 'select',
      options: popoverSideValues,
    },
    sideOffset: {
      control: {
        type: 'number',
        min: 0,
        max: 24,
        step: 1,
      },
    },
    triggerDisabled: {
      control: 'boolean',
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
          'Shared non-modal floating surface built on Radix Popover with Box-authored content wrappers, controlled and uncontrolled open handling, and anchored composition for contextual details or compact forms.',
      },
    },
  },
  render: (args: PopoverStoryArgs) => (
    <BasicPopover
      defaultOpen={args.defaultOpen}
      onOpen={args.onOpen}
      onClose={args.onClose}
      align={args.align}
      side={args.side}
      sideOffset={args.sideOffset}
      triggerDisabled={args.triggerDisabled}
    />
  ),
} satisfies Meta<PopoverStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Baseline contextual popover with a short summary and a close action inside the floating surface.',
      },
    },
  },
};

export const Form: Story = {
  render: (args) => (
    <FormPopover align={args.align} side={args.side} sideOffset={args.sideOffset} />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows a compact form-like layout composed from shared inputs without turning Popover into a form abstraction.',
      },
    },
  },
};

export const Controlled: Story = {
  render: (args) => (
    <ControlledPopover
      onOpen={args.onOpen}
      onClose={args.onClose}
      align={args.align}
      side={args.side}
      sideOffset={args.sideOffset}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates controlled open state driven by the parent through the shared `onOpen` and `onClose` callbacks.',
      },
    },
  },
};

export const DisabledTrigger: Story = {
  name: 'Disabled trigger',
  args: {
    triggerDisabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uses a disabled shared trigger to show that the popover does not open when interaction is blocked upstream.',
      },
    },
  },
};

export const Anchored: Story = {
  render: (args) => (
    <AnchoredPopover align={args.align} side={args.side} sideOffset={args.sideOffset} />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows custom anchor positioning when the overlay should align to a surface other than the trigger.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    onOpen: fn(),
    onClose: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: /view details/i });

    await userEvent.click(trigger);
    await expect(args.onOpen).toHaveBeenCalledTimes(1);

    const closeButton = await body.findByRole('button', { name: /done/i });
    await userEvent.click(closeButton);

    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await expect(trigger).toHaveFocus();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Verifies trigger activation, content rendering, close handling, and focus return through a Storybook interaction test.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  name: 'Responsive layout',
  render: (args) => (
    <Box className="w-[18rem]">
      <BasicPopover
        defaultOpen={args.defaultOpen}
        onOpen={args.onOpen}
        onClose={args.onClose}
        align="start"
        side={args.side}
        sideOffset={args.sideOffset}
        triggerDisabled={args.triggerDisabled}
      />
    </Box>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Checks trigger spacing and content sizing inside a narrow mobile-width container.',
      },
    },
  },
};
