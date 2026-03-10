import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Button } from '../Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog';
import type { DialogProps, DialogSize } from './Dialog.types';
import { dialogSizeValues } from './Dialog.types';

function DialogStoryFrame({ children }: { children: React.ReactNode }) {
  return <Box className="flex min-h-[30rem] items-start justify-center p-4">{children}</Box>;
}

function DialogBodyCopy() {
  return (
    <Box className="grid gap-3">
      <Box as="p" className="text-sm leading-6 text-muted-foreground">
        Shared dialog content stays app-agnostic and focuses on shell behavior, spacing, and accessibility.
      </Box>
      <Box as="p" className="text-sm leading-6 text-muted-foreground">
        Domain actions, service hooks, and route behavior remain in consuming apps.
      </Box>
    </Box>
  );
}

function UncontrolledDialogStory(args: Pick<DialogProps, 'defaultOpen' | 'onClose'>) {
  return (
    <DialogStoryFrame>
      <Dialog defaultOpen={args.defaultOpen} onClose={args.onClose}>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent
          title="Edit profile"
          description="Update shared profile details without leaving the current page."
          footer={
            <>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button>Save Changes</Button>
            </>
          }
        >
          <DialogBodyCopy />
        </DialogContent>
      </Dialog>
    </DialogStoryFrame>
  );
}

function DialogSizeShowcase() {
  const [activeSize, setActiveSize] = React.useState<DialogSize>('md');
  const [open, setOpen] = React.useState(false);

  return (
    <DialogStoryFrame>
      <Box className="grid gap-4">
        <Box className="flex flex-wrap gap-2">
          {dialogSizeValues.map((size) => (
            <Button
              key={size}
              variant={activeSize === size ? 'default' : 'outline'}
              onClick={() => {
                setActiveSize(size);
                setOpen(true);
              }}
            >
              Open {size.toUpperCase()} Dialog
            </Button>
          ))}
        </Box>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogContent
            size={activeSize}
            title={`${activeSize.toUpperCase()} dialog`}
            description="The shared shell changes width through the size prop without changing modal semantics."
            footer={
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            }
          >
            <DialogBodyCopy />
          </DialogContent>
        </Dialog>
      </Box>
    </DialogStoryFrame>
  );
}

function AsyncCloseDialogStory({ onClose }: Pick<DialogProps, 'onClose'>) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <DialogStoryFrame>
      <Box className="grid gap-3">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open Async Dialog
        </Button>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
            onClose?.();
          }}
        >
          <DialogContent
            title="Save changes"
            description="Keep the dialog open until the async action finishes."
            footer={
              <>
                <DialogClose asChild>
                  <Button variant="outline" disabled={loading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  loading={loading}
                  onClick={() => {
                    setLoading(true);
                    timeoutRef.current = window.setTimeout(() => {
                      setLoading(false);
                      setOpen(false);
                      onClose?.();
                    }, 700);
                  }}
                >
                  Save Changes
                </Button>
              </>
            }
          >
            <DialogBodyCopy />
          </DialogContent>
        </Dialog>
      </Box>
    </DialogStoryFrame>
  );
}

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: {
    children: null,
    defaultOpen: false,
  },
  argTypes: {
    defaultOpen: {
      control: 'boolean',
    },
    open: {
      control: false,
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
          'Shared centered modal shell built on Radix Dialog with Box-authored wrappers, explicit compound exports, and canonical size presets.',
      },
    },
  },
  render: (args) => <UncontrolledDialogStory defaultOpen={args.defaultOpen} onClose={args.onClose} />,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline dialog with convenience title, description, and footer actions.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /open dialog/i }));
    await expect(within(document.body).getByText(/edit profile/i)).toBeInTheDocument();
  },
};

export const Scrollable: Story = {
  render: () => (
    <DialogStoryFrame>
      <Dialog open>
        <DialogContent
          title="Scrollable content"
          description="Long bodies should scroll inside the shared dialog shell."
          footer={
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          }
        >
          <Box as="ul" className="grid gap-3">
            {Array.from({ length: 18 }, (_, index) => (
              <Box
                as="li"
                key={`dialog-item-${index + 1}`}
                className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground"
              >
                Content block {index + 1}
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </DialogStoryFrame>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exercises internal body scrolling without collapsing the header and footer shell.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => <DialogSizeShowcase />,
  parameters: {
    docs: {
      description: {
        story: 'Lets the reviewer open each supported size preset from the same shared dialog API.',
      },
    },
  },
};

export const Destructive: Story = {
  render: () => (
    <DialogStoryFrame>
      <Dialog open>
        <DialogContent
          size="sm"
          title="Delete Record"
          description="This action cannot be undone and will remove the selected item permanently."
          footer={
            <>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive">Delete</Button>
            </>
          }
        >
          <Box className="grid gap-3">
            <Box as="p" className="text-sm leading-6 text-muted-foreground">
              Destructive emphasis stays in composed content and actions instead of becoming a dialog-level mode.
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </DialogStoryFrame>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows a destructive confirmation flow without widening the shared dialog API.',
      },
    },
  },
};

export const AsyncClose: Story = {
  args: {
    onClose: fn(),
  },
  render: (args) => <AsyncCloseDialogStory onClose={args.onClose} />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the controlled pattern where the consumer defers closing until async work finishes.',
      },
    },
  },
};

export const HiddenAccessibleHeader: Story = {
  render: () => (
    <DialogStoryFrame>
      <Dialog open>
        <DialogContent footer={<DialogClose asChild><Button variant="outline">Close</Button></DialogClose>}>
          <DialogHeader className="sr-only">
            <DialogTitle>Security Review</DialogTitle>
            <DialogDescription>This hidden header remains available to assistive technology.</DialogDescription>
          </DialogHeader>
          <Box className="grid gap-3">
            <Box className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm font-medium text-foreground">
              Accessibility regression check
            </Box>
            <Box as="p" className="text-sm leading-6 text-muted-foreground">
              The visible layout is intentionally minimal.
            </Box>
            <Box as="p" className="text-sm leading-6 text-muted-foreground">
              This story verifies that a hidden title and description still provide an accessible dialog name and description.
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </DialogStoryFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Accessibility edge-case story. The header is visually hidden on purpose to verify the dialog still exposes an accessible title and description.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  render: () => (
    <DialogStoryFrame>
      <Dialog open>
        <DialogContent
          title="Responsive dialog"
          description="The shared modal shell should stay readable inside a narrow viewport."
          footer={
            <>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button>Continue Setup</Button>
            </>
          }
        >
          <DialogBodyCopy />
        </DialogContent>
      </Dialog>
    </DialogStoryFrame>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Checks spacing and footer stacking in a mobile-width viewport.',
      },
    },
  },
};

