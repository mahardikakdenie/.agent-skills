import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { Box } from '../Box';
import { Button } from '../Button';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from './Drawer';
import type { DrawerDirection, DrawerProps } from './Drawer.types';
import { drawerDirectionValues } from './Drawer.types';

function DrawerStoryFrame({ children }: { children: React.ReactNode }) {
  return <Box className="flex min-h-[26rem] items-start justify-center p-4">{children}</Box>;
}

function DrawerBodyCopy() {
  return (
    <Box className="grid gap-3">
      <Box as="p" className="text-sm leading-6 text-muted-foreground">
        Shared drawer content stays app-agnostic and focuses on shell layout only.
      </Box>
      <Box as="p" className="text-sm leading-6 text-muted-foreground">
        Domain actions, validation, and service orchestration remain in consuming apps.
      </Box>
    </Box>
  );
}

function UncontrolledDrawerStory(args: DrawerProps) {
  return (
    <DrawerStoryFrame>
      <Drawer direction={args.direction} onClose={args.onClose}>
        <DrawerTrigger asChild>
          <Button variant="outline">Open drawer</Button>
        </DrawerTrigger>
        <DrawerContent
          title="Drawer title"
          description="Shared drawer shell with convenience title, description, and footer support."
          footer={
            <>
              <Button>Confirm</Button>
              <DrawerClose asChild>
                <Button variant="outline">Close drawer</Button>
              </DrawerClose>
            </>
          }
        >
          <DrawerBodyCopy />
        </DrawerContent>
      </Drawer>
    </DrawerStoryFrame>
  );
}

function ControlledDrawerStory({
  direction = 'right',
  onClose,
}: Pick<DrawerProps, 'direction' | 'onClose'>) {
  const [open, setOpen] = React.useState(false);

  return (
    <DrawerStoryFrame>
      <Box className="grid gap-3">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open controlled drawer
        </Button>
        <Drawer
          direction={direction}
          open={open}
          onClose={() => {
            setOpen(false);
            onClose?.();
          }}
        >
          <DrawerContent
            title="Controlled drawer"
            description="External state owns opening; the shared shell only reports close requests."
            footer={
              <DrawerClose asChild>
                <Button variant="outline">Dismiss</Button>
              </DrawerClose>
            }
          >
            <DrawerBodyCopy />
          </DrawerContent>
        </Drawer>
      </Box>
    </DrawerStoryFrame>
  );
}

const meta = {
  title: 'Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: {
    children: null,
    direction: 'bottom',
  },
  argTypes: {
    direction: {
      control: 'select',
      options: drawerDirectionValues,
    },
    onClose: {
      action: 'closed',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      story: {
        inline: false,
      },
      description: {
        component:
          'Shared drawer shell built on vaul for bottom sheets and side panels, with Box-authored wrappers and compound exports for consumer composition.',
      },
    },
  },
  render: (args) => <UncontrolledDrawerStory {...args} />,
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Baseline uncontrolled drawer with convenience header copy and a footer close action.',
      },
    },
  },
};

export const Sides: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DrawerStoryFrame>
      <Box className="grid gap-3 sm:grid-cols-2">
        {(['bottom', 'top', 'left', 'right'] as DrawerDirection[]).map((direction) => (
          <Drawer key={direction} direction={direction}>
            <DrawerTrigger asChild>
              <Button variant="outline">Open {direction} drawer</Button>
            </DrawerTrigger>
            <DrawerContent
              title={`${direction.charAt(0).toUpperCase()}${direction.slice(1)} drawer`}
              description="Direction changes how the same shared shell anchors to the viewport edge."
            >
              <DrawerBodyCopy />
            </DrawerContent>
          </Drawer>
        ))}
      </Box>
    </DrawerStoryFrame>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the supported edge directions without changing the public drawer contract.',
      },
    },
  },
};

export const Scrollable: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DrawerStoryFrame>
      <Drawer open>
        <DrawerContent
          title="Scrollable drawer"
          description="Long content should stay scrollable inside the shared panel shell."
        >
          <Box as="ul" className="grid gap-3">
            {Array.from({ length: 16 }, (_, index) => (
              <Box
                as="li"
                key={`drawer-item-${index + 1}`}
                className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground"
              >
                Content block {index + 1}
              </Box>
            ))}
          </Box>
        </DrawerContent>
      </Drawer>
    </DrawerStoryFrame>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Keeps long content within an internally scrollable drawer body.',
      },
    },
  },
};

export const FormAction: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DrawerStoryFrame>
      <Drawer open>
        <DrawerContent
          title="Quick action form"
          description="The shared drawer shell can host app-local form layouts without owning validation logic."
          actions={<Button variant="ghost">Secondary action</Button>}
          footer={
            <>
              <Button>Save changes</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </>
          }
        >
          <Box as="form" className="grid gap-4">
            <Box className="grid gap-2">
              <Box as="label" className="text-sm font-medium text-foreground" htmlFor="drawer-name">
                Display name
              </Box>
              <Box
                as="input"
                autoComplete="name"
                id="drawer-name"
                name="displayName"
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                placeholder="e.g. Olivia Tan"
                type="text"
              />
            </Box>
            <Box className="grid gap-2">
              <Box
                as="label"
                className="text-sm font-medium text-foreground"
                htmlFor="drawer-notes"
              >
                Notes
              </Box>
              <Box
                as="textarea"
                autoComplete="off"
                id="drawer-notes"
                name="notes"
                className="min-h-28 rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                placeholder="Add context for this change"
              />
            </Box>
          </Box>
        </DrawerContent>
      </Drawer>
    </DrawerStoryFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates a drawer used as a form shell with convenience actions and footer buttons.',
      },
    },
  },
};

export const Controlled: Story = {
  args: {
    children: null,
  },
  render: (args) => <ControlledDrawerStory direction={args.direction} onClose={args.onClose} />,
  parameters: {
    docs: {
      description: {
        story:
          'Shows the controlled pattern where an external button opens the drawer and `onClose` owns dismissal.',
      },
    },
  },
};

export const NonDismissible: Story = {
  name: 'Non-Dismissible',
  args: {
    children: null,
  },
  render: () => {
    const [open, setOpen] = React.useState(true);

    return (
      <DrawerStoryFrame>
        <Box className="grid gap-3">
          <Button variant="outline" onClick={() => setOpen(true)}>
            Re-open drawer
          </Button>
          <Drawer open={open} onClose={() => setOpen(false)}>
            <DrawerContent
              title="Explicit close only"
              description="Outside clicks and Escape are intentionally prevented for this story."
              onEscapeKeyDown={(event) => event.preventDefault()}
              onPointerDownOutside={(event) => event.preventDefault()}
              footer={
                <DrawerClose asChild>
                  <Button variant="outline">Understood</Button>
                </DrawerClose>
              }
            >
              <DrawerBodyCopy />
            </DrawerContent>
          </Drawer>
        </Box>
      </DrawerStoryFrame>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Prevents outside dismissal and keeps the close action explicit inside the drawer body.',
      },
    },
  },
};

