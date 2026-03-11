import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoreHorizontal, PencilLine, Share2, Trash2 } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './DropdownMenu';
import type { DropdownMenuProps } from './DropdownMenu.types';

function StoryFrame({ children }: { children: React.ReactNode }) {
  return <Box className="flex min-h-[18rem] items-start justify-center p-4">{children}</Box>;
}

function ActionTrigger({ disabled = false }: { disabled?: boolean }) {
  return (
    <DropdownMenuTrigger asChild disabled={disabled}>
      <Button variant="outline" size="sm" disabled={disabled}>
        Actions
      </Button>
    </DropdownMenuTrigger>
  );
}

function IconTrigger({ disabled = false }: { disabled?: boolean }) {
  return (
    <DropdownMenuTrigger asChild disabled={disabled}>
      <Button variant="ghost" size="sm" className="h-9 w-9 p-0" aria-label="Open row actions" disabled={disabled}>
        <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
  );
}

function BasicMenu(args: Pick<DropdownMenuProps, 'defaultOpen' | 'disabled' | 'onOpen' | 'onClose' | 'onAction'>) {
  return (
    <StoryFrame>
      <DropdownMenu
        defaultOpen={args.defaultOpen}
        disabled={args.disabled}
        onOpen={args.onOpen}
        onClose={args.onClose}
        onAction={args.onAction}
      >
        <ActionTrigger disabled={args.disabled} />
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Profile</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem value="edit" icon={<PencilLine aria-hidden="true" className="h-4 w-4" />}>
              Edit profile
            </DropdownMenuItem>
            <DropdownMenuItem value="share" icon={<Share2 aria-hidden="true" className="h-4 w-4" />}>
              Share access
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            value="delete"
            destructive
            icon={<Trash2 aria-hidden="true" className="h-4 w-4" />}
            shortcut="Del"
          >
            Delete record
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryFrame>
  );
}

function CheckboxMenu() {
  const [showStatus, setShowStatus] = React.useState(true);
  const [showNotes, setShowNotes] = React.useState(false);
  const [density, setDensity] = React.useState('comfortable');

  return (
    <StoryFrame>
      <DropdownMenu>
        <ActionTrigger />
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Table settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
            Status column
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showNotes} onCheckedChange={setShowNotes}>
            Notes column
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel inset>Density</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
            <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryFrame>
  );
}

function SubmenuMenu() {
  return (
    <StoryFrame>
      <DropdownMenu onAction={fn()}>
        <ActionTrigger />
        <DropdownMenuContent align="end">
          <DropdownMenuItem value="rename">Rename</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger inset>Export</DropdownMenuSubTrigger>
            <DropdownMenuSubContent sideOffset={10}>
              <DropdownMenuItem value="pdf">Export as PDF</DropdownMenuItem>
              <DropdownMenuItem value="csv">Export as CSV</DropdownMenuItem>
              <DropdownMenuItem value="png">Export as PNG</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem value="archive" destructive>
            Archive project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </StoryFrame>
  );
}

function ControlledMenu({
  onOpen,
  onClose,
  onAction,
}: Pick<DropdownMenuProps, 'onOpen' | 'onClose' | 'onAction'>) {
  const [open, setOpen] = React.useState(true);

  return (
    <StoryFrame>
      <Box className="grid gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setOpen((current) => !current);
          }}
        >
          Toggle menu
        </Button>
        <DropdownMenu
          open={open}
          onOpen={onOpen}
          onClose={() => {
            setOpen(false);
            onClose?.();
          }}
          onAction={onAction}
        >
          <IconTrigger />
          <DropdownMenuContent align="end">
            <DropdownMenuItem value="view">View details</DropdownMenuItem>
            <DropdownMenuItem value="duplicate">Duplicate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Box>
    </StoryFrame>
  );
}

const meta = {
  title: 'Overlays/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  args: {
    defaultOpen: false,
    disabled: false,
    modal: true,
    onOpen: fn(),
    onClose: fn(),
    onAction: fn(),
    children: null,
  },
  argTypes: {
    defaultOpen: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    modal: {
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
    onAction: {
      action: 'action',
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
          'Shared Radix-backed dropdown menu surface with Box-authored content wrappers, checkbox and radio items, submenu support, and optional root-level action dispatch.',
      },
    },
  },
  render: (args: DropdownMenuProps) => (
    <BasicMenu
      defaultOpen={args.defaultOpen}
      disabled={args.disabled}
      onOpen={args.onOpen}
      onClose={args.onClose}
      onAction={args.onAction}
    />
  ),
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline action menu with grouped items, a section label, and a destructive action row.',
      },
    },
  },
};

export const CheckboxItems: Story = {
  render: () => <CheckboxMenu />,
  parameters: {
    docs: {
      description: {
        story: 'Shows checkbox and radio item composition for small local preference menus.',
      },
    },
  },
};

export const Submenu: Story = {
  render: () => <SubmenuMenu />,
  parameters: {
    docs: {
      description: {
        story: 'Exercises nested submenu composition for grouped secondary actions.',
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
        story: 'Disables the trigger through the shared root contract and prevents menu interaction.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    onOpen: fn(),
    onClose: fn(),
    onAction: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: /actions/i });

    await userEvent.click(trigger);
    await expect(args.onOpen).toHaveBeenCalledTimes(1);

    const editItem = await body.findByRole('menuitem', { name: /edit profile/i });
    await userEvent.click(editItem);

    await expect(args.onAction).toHaveBeenCalledWith('edit');
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await expect(trigger).toHaveFocus();
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirms open, action dispatch, close, and focus return behavior through Storybook interaction testing.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Box className="max-w-[20rem]">
      <StoryFrame>
        <DropdownMenu>
          <IconTrigger />
          <DropdownMenuContent align="end">
            <DropdownMenuItem value="view">View policy details</DropdownMenuItem>
            <DropdownMenuItem value="resend" shortcut="R">
              Resend invitation email
            </DropdownMenuItem>
            <DropdownMenuItem value="delete" destructive>
              Delete collaborator
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </StoryFrame>
    </Box>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Checks trigger spacing and menu sizing within a narrow mobile-width container.',
      },
    },
  },
};

export const ControlledOpen: Story = {
  args: {
    onOpen: fn(),
    onClose: fn(),
    onAction: fn(),
  },
  render: (args) => (
    <ControlledMenu onOpen={args.onOpen} onClose={args.onClose} onAction={args.onAction} />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the controlled pattern where menu visibility is driven by parent state.',
      },
    },
  },
};