import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Download, FilePlus2, Layers3, PencilLine, Settings2, Trash2 } from 'lucide-react';
import { fn } from 'storybook/test';

import { Box } from '../Box';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from './Menubar';
import type { MenubarProps } from './Menubar.types';

type MenubarStoryArgs = Omit<MenubarProps, 'children'>;

function StorySurface({ children }: { children: React.ReactNode }) {
  return (
    <Box className="flex min-h-[18rem] w-full items-start justify-center bg-muted/20 p-8">
      <Box className="w-full max-w-3xl rounded-2xl border border-border/70 bg-background p-5 shadow-sm">
        {children}
      </Box>
    </Box>
  );
}

function StoryStack({ children }: { children: React.ReactNode }) {
  return <Box className="grid w-full gap-4">{children}</Box>;
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <Box className="flex items-center gap-2 text-sm text-muted-foreground">
      <Box as="span">{label}</Box>
      <Box
        as="span"
        className="inline-flex items-center rounded-full border border-border bg-muted/40 px-2.5 py-1 font-medium text-foreground"
      >
        {value}
      </Box>
    </Box>
  );
}

function FileCommandMenubar(
  args: Pick<MenubarProps, 'defaultValue' | 'value' | 'onValueChange' | 'disabled' | 'onAction' | 'loop' | 'dir'>,
) {
  return (
    <Menubar
      defaultValue={args.defaultValue}
      value={args.value}
      onValueChange={args.onValueChange}
      disabled={args.disabled}
      loop={args.loop}
      dir={args.dir}
      onAction={args.onAction}
    >
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem value="new-file" shortcut="Ctrl+N" icon={<FilePlus2 aria-hidden="true" className="h-4 w-4" />}>
            New file
          </MenubarItem>
          <MenubarItem value="rename-file" shortcut="F2" icon={<PencilLine aria-hidden="true" className="h-4 w-4" />}>
            Rename
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger icon={<Download aria-hidden="true" className="h-4 w-4" />}>
              Export
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem value="export-pdf">PDF document</MenubarItem>
              <MenubarItem value="export-csv">CSV file</MenubarItem>
              <MenubarItem value="export-image">PNG image</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem
            value="delete-project"
            destructive
            icon={<Trash2 aria-hidden="true" className="h-4 w-4" />}
          >
            Delete project
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem value="undo">Undo</MenubarItem>
          <MenubarItem value="redo">Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem value="duplicate" icon={<Layers3 aria-hidden="true" className="h-4 w-4" />}>
            Duplicate layer
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu value="settings">
        <MenubarTrigger>Settings</MenubarTrigger>
        <MenubarContent>
          <MenubarItem value="preferences" icon={<Settings2 aria-hidden="true" className="h-4 w-4" />}>
            Preferences
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function BasicMenubar(
  args: Pick<MenubarProps, 'defaultValue' | 'value' | 'onValueChange' | 'disabled' | 'onAction' | 'loop' | 'dir'>,
) {
  return (
    <StorySurface>
      <FileCommandMenubar {...args} />
    </StorySurface>
  );
}

function PreferenceMenubar() {
  const [showSidebar, setShowSidebar] = React.useState<boolean | 'indeterminate'>(true);
  const [showInspector, setShowInspector] = React.useState<boolean | 'indeterminate'>(false);
  const [density, setDensity] = React.useState('comfortable');

  return (
    <StorySurface>
      <Menubar>
        <MenubarMenu value="view">
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Workspace</MenubarLabel>
            <MenubarSeparator />
            <MenubarCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
              Show sidebar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={showInspector} onCheckedChange={setShowInspector}>
              Show inspector
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarLabel inset>Density</MenubarLabel>
              <MenubarRadioGroup value={density} onValueChange={setDensity}>
                <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
                <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </StorySurface>
  );
}

function ControlledMenubar({
  onAction,
  onValueChange,
}: Pick<MenubarProps, 'onAction' | 'onValueChange'>) {
  const [value, setValue] = React.useState('');
  const [activeMenuLabel, setActiveMenuLabel] = React.useState('none');

  return (
    <StorySurface>
      <StoryStack>
        <StatusRow label="Active menu:" value={activeMenuLabel} />
        <FileCommandMenubar
          value={value}
          onAction={onAction}
          onValueChange={(nextValue) => {
            setValue(nextValue);
            if (nextValue) {
              setActiveMenuLabel(nextValue);
            }
            onValueChange?.(nextValue);
          }}
        />
      </StoryStack>
    </StorySurface>
  );
}

function DisabledMenusStory() {
  return (
    <StorySurface>
      <StoryStack>
        <StatusRow label="Disabled coverage:" value="Trigger + item states" />
        <Menubar>
          <MenubarMenu value="file">
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem value="new-file">New file</MenubarItem>
              <MenubarItem value="rename-file" disabled>
                Rename
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem value="delete-project" destructive disabled>
                Delete project
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu value="edit">
            <MenubarTrigger disabled>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem value="undo">Undo</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu value="view">
            <MenubarTrigger disabled>View</MenubarTrigger>
            <MenubarContent>
              <MenubarItem value="show-sidebar">Show sidebar</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </StoryStack>
    </StorySurface>
  );
}

const meta: Meta<MenubarStoryArgs> = {
  title: 'Navigation/Menubar',
  component: Menubar as unknown as React.ComponentType<MenubarStoryArgs>,
  tags: ['autodocs'],
  args: {
    loop: true,
    disabled: false,
    defaultValue: '',
    onValueChange: fn(),
    onAction: fn(),
  },
  argTypes: {
    loop: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    defaultValue: {
      control: 'select',
      options: ['', 'file', 'edit', 'settings'],
    },
    value: {
      control: false,
    },
    dir: {
      control: 'radio',
      options: ['ltr', 'rtl'],
    },
    onValueChange: {
      action: 'value changed',
    },
    onAction: {
      action: 'action',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Shared Radix-backed menubar surface with Box-authored root, trigger, item, submenu, checkbox, radio, and shortcut composition for desktop-style command bars.',
      },
    },
  },
  render: (args: MenubarStoryArgs) => (
    <BasicMenubar
      defaultValue={args.defaultValue}
      disabled={args.disabled}
      onAction={args.onAction}
      onValueChange={args.onValueChange}
      loop={args.loop}
      dir={args.dir}
      value={args.value}
    />
  ),
};

export default meta;
type Story = StoryObj<MenubarStoryArgs>;

export const Basic: Story = {
  args: {
    defaultValue: '',
  },
};

export const SelectionItems: Story = {
  render: () => <PreferenceMenubar />,
};

export const Submenu: Story = {
  args: {
    defaultValue: '',
  },
  render: () => (
    <StorySurface>
      <Menubar onAction={fn()}>
        <MenubarMenu value="file">
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger icon={<Download aria-hidden="true" className="h-4 w-4" />}>
                Share
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem value="share-pdf">Send PDF</MenubarItem>
                <MenubarItem value="share-link">Copy share link</MenubarItem>
                <MenubarItem value="share-email">Send by email</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </StorySurface>
  ),
};

export const ControlledValue: Story = {
  args: {
    onAction: fn(),
    onValueChange: fn(),
  },
  render: (args) => <ControlledMenubar onAction={args.onAction} onValueChange={args.onValueChange} />,
};

export const DisabledMenus: Story = {
  render: () => <DisabledMenusStory />,
};