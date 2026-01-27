import type { Meta, StoryObj } from '@storybook/react';
import { useId, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { Box } from '../Box';
import { Button } from '../Button';
import { Input } from '../Input';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog';

type DialogRootProps = ComponentPropsWithoutRef<typeof Dialog>;

type RenderOptions = {
  body?: ReactNode;
  contentClassName?: string;
  description?: string;
  size?: ComponentPropsWithoutRef<typeof DialogContent>['size'];
  title?: string;
  triggerLabel?: string;
};

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the dialog is open on initial render',
    },
    modal: {
      control: 'boolean',
      description: 'When false, focus is not trapped while the dialog is open',
    },
  },
  args: {
    defaultOpen: false,
    modal: true,
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function DialogCanvas({ children }: { children: ReactNode }) {
  return (
    <Box className="relative flex min-h-[560px] w-full items-center justify-center bg-gray-50 p-12">
      {children}
    </Box>
  );
}

function renderDialog(rootProps: DialogRootProps, options: RenderOptions = {}) {
  const {
    body,
    contentClassName,
    description = 'Review the changes below before continuing.',
    size,
    title = 'Update policy',
    triggerLabel = 'Open dialog',
  } = options;

  const defaultBody = (
    <DialogBody className="flex flex-col gap-3 text-sm text-gray-700">
      <Box>
        You are about to apply updates to your auto policy. These changes will take effect
        immediately.
      </Box>
      <Box className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-800">
        Next billing date: Feb 5, 2026 � Estimated premium: $118/mo
      </Box>
    </DialogBody>
  );

  return (
    <DialogCanvas>
      <Dialog {...rootProps}>
        <DialogTrigger asChild>
          <Button variant="secondary">{triggerLabel}</Button>
        </DialogTrigger>
        <DialogContent size={size} className={contentClassName}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          {body ?? defaultBody}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogCanvas>
  );
}

export const Default: Story = {
  render: (args: DialogRootProps) => renderDialog(args),
};

export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args: DialogRootProps) => renderDialog(args),
};

export const NonModal: Story = {
  args: {
    modal: false,
  },
  render: (args: DialogRootProps) =>
    renderDialog(args, {
      title: 'Non-modal dialog',
      description:
        'Use non-modal dialogs for lightweight flows that should not fully block the page.',
      triggerLabel: 'Open non-modal',
    }),
};

export const Sizes: Story = {
  render: () => {
    const sizeConfigs: Array<{
      label: string;
      size: ComponentPropsWithoutRef<typeof DialogContent>['size'];
    }> = [
      { label: 'Small', size: '28rem' },
      { label: 'Medium', size: '40rem' },
      { label: 'Large', size: '56rem' },
    ];

    return (
      <DialogCanvas>
        <Box className="flex flex-wrap items-center justify-center gap-3">
          {sizeConfigs.map(({ label, size }) => (
            <Dialog key={label}>
              <DialogTrigger asChild>
                <Button variant="outline" className="min-w-28">
                  {label}
                </Button>
              </DialogTrigger>
              <DialogContent size={size}>
                <DialogHeader>
                  <DialogTitle>
                    {label} dialog ({String(size)})
                  </DialogTitle>
                  <DialogDescription>
                    Size is controlled via the size prop so it reliably differs.
                  </DialogDescription>
                </DialogHeader>
                <DialogBody className="text-sm text-gray-700">
                  Wider dialogs work well for forms and detailed summaries.
                </DialogBody>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Close</Button>
                  </DialogClose>
                  <Button>Continue</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </Box>
      </DialogCanvas>
    );
  },
};

export const ScrollableContent: Story = {
  render: (args: DialogRootProps) =>
    renderDialog(args, {
      size: '48rem',
      title: 'Policy changes',
      description: 'Review each change before approving the update.',
      body: (
        <DialogBody className="flex flex-col gap-4">
          <Box className="text-sm text-gray-700">
            The following coverages will be added to your policy.
          </Box>
          <Box className="grid gap-2">
            {Array.from({ length: 14 }).map((_, index) => (
              <Box
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800"
              >
                Coverage update {index + 1}: Enhanced roadside assistance with extended towing
                radius.
              </Box>
            ))}
          </Box>
        </DialogBody>
      ),
    }),
};

export const FormDialog: Story = {
  render: (args: DialogRootProps) => {
    const nameId = useId();
    const emailId = useId();

    return renderDialog(args, {
      size: '44rem',
      title: 'Update contact details',
      description: 'Make sure your contact details are accurate for policy notifications.',
      triggerLabel: 'Edit contact',
      body: (
        <DialogBody className="flex flex-col gap-4">
          <Box className="grid gap-2">
            <Box as="label" htmlFor={nameId} className="text-sm font-medium text-gray-800">
              Full name
            </Box>
            <Input id={nameId} placeholder="Alex Johnson" />
          </Box>
          <Box className="grid gap-2">
            <Box as="label" htmlFor={emailId} className="text-sm font-medium text-gray-800">
              Email address
            </Box>
            <Input id={emailId} type="email" placeholder="alex@example.com" />
          </Box>
          <Box className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
            We'll send confirmation details to this email.
          </Box>
        </DialogBody>
      ),
    });
  },
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <DialogCanvas>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">{open ? 'Close dialog' : 'Open controlled dialog'}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Controlled dialog</DialogTitle>
              <DialogDescription>
                This dialog is fully controlled via React state.
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="text-sm text-gray-700">
              Open state:{' '}
              <Box as="span" className="font-semibold">
                {String(open)}
              </Box>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogCanvas>
    );
  },
};
