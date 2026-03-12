import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Calendar,
  Calculator,
  CreditCard,
  FileText,
  Search as SearchIcon,
  Settings,
  User,
} from 'lucide-react';
import * as React from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../Dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './Command';

interface StoryCommandItem {
  value: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  keywords?: string[];
  icon: React.ReactNode;
}

const suggestionItems: StoryCommandItem[] = [
  {
    value: 'calendar',
    label: 'Calendar',
    icon: <Calendar className="h-4 w-4" />,
    keywords: ['schedule', 'date'],
  },
  {
    value: 'emoji',
    label: 'Search emoji',
    icon: <SearchIcon className="h-4 w-4" />,
    keywords: ['icons', 'reaction'],
  },
  {
    value: 'calculator',
    label: 'Calculator',
    icon: <Calculator className="h-4 w-4" />,
    disabled: true,
    keywords: ['math', 'estimate'],
  },
];

const settingsItems: StoryCommandItem[] = [
  {
    value: 'profile',
    label: 'Profile',
    shortcut: '⌘ P',
    icon: <User className="h-4 w-4" />,
    keywords: ['account', 'member'],
  },
  {
    value: 'billing',
    label: 'Billing',
    shortcut: '⌘ B',
    icon: <CreditCard className="h-4 w-4" />,
    keywords: ['invoice', 'payments'],
  },
  {
    value: 'reports',
    label: 'Reports',
    shortcut: '⌘ R',
    icon: <FileText className="h-4 w-4" />,
    keywords: ['analytics', 'export'],
  },
  {
    value: 'settings',
    label: 'Settings',
    shortcut: '⌘ S',
    icon: <Settings className="h-4 w-4" />,
    keywords: ['preferences', 'workspace'],
  },
];

function CommandStoryFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Box className={className ?? 'mx-auto w-full max-w-xl'}>
      {children}
    </Box>
  );
}

function CommandItemRow({ item }: { item: StoryCommandItem }) {
  return (
    <CommandItem
      value={item.value}
      disabled={item.disabled}
      keywords={item.keywords ?? [item.label, item.value]}
    >
      {item.icon}
      <Box as="span" className="min-w-0 flex-1 truncate">
        {item.label}
      </Box>
      {item.shortcut ? <CommandShortcut>{item.shortcut}</CommandShortcut> : null}
    </CommandItem>
  );
}

function BaseCommand({
  inputValue,
  includeSuggestions = true,
  includeSettings = true,
  className,
}: {
  inputValue?: string;
  includeSuggestions?: boolean;
  includeSettings?: boolean;
  className?: string;
}) {
  return (
    <Command label="Workspace commands" className={className}>
      <CommandInput value={inputValue} placeholder="Search commands…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {includeSuggestions ? (
          <CommandGroup heading="Suggestions">
            {suggestionItems.map((item) => (
              <CommandItemRow key={item.value} item={item} />
            ))}
          </CommandGroup>
        ) : null}
        {includeSuggestions && includeSettings ? <CommandSeparator /> : null}
        {includeSettings ? (
          <CommandGroup heading="Workspace">
            {settingsItems.map((item) => (
              <CommandItemRow key={item.value} item={item} />
            ))}
          </CommandGroup>
        ) : null}
      </CommandList>
    </Command>
  );
}

function DialogCommandExample() {
  return (
    <Dialog defaultOpen>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Command palette</DialogTitle>
          <DialogDescription>Search destinations and quick actions.</DialogDescription>
        </DialogHeader>
        <BaseCommand className="rounded-none border-0 shadow-none" />
      </DialogContent>
    </Dialog>
  );
}

const meta = {
  title: 'Misc/Command',
  component: Command,
  tags: ['autodocs'],
  args: {
    label: 'Workspace commands',
    loop: false,
  },
  argTypes: {
    label: {
      control: 'text',
    },
    loop: {
      control: 'boolean',
    },
    value: {
      control: false,
    },
    onValueChange: {
      control: false,
    },
    filter: {
      control: false,
    },
    children: {
      control: false,
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Shared low-level cmdk surface for searchable action lists and command palettes, composed through Box-authored wrappers and shared Dialog when overlay behavior is needed.',
      },
    },
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline inline command surface with suggestions, grouped results, and a disabled item.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Search commands…');

    await userEvent.clear(input);
    await userEvent.type(input, 'billing');

    await expect(canvas.getByText('Billing')).toBeVisible();
  },
  render: () => (
    <CommandStoryFrame>
      <BaseCommand className="max-w-xl" />
    </CommandStoryFrame>
  ),
};

export const EmptyState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Prefills the search input so the list falls through to the shared empty state.',
      },
    },
  },
  render: () => (
    <CommandStoryFrame>
      <BaseCommand className="max-w-xl" inputValue="missing command" />
    </CommandStoryFrame>
  ),
};

export const GroupedResults: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows multiple logical result groups separated by a shared command separator.',
      },
    },
  },
  render: () => (
    <CommandStoryFrame>
      <BaseCommand className="max-w-xl" />
    </CommandStoryFrame>
  ),
};

export const WithShortcuts: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Uses trailing shortcut hints for desktop-oriented command rows.',
      },
    },
  },
  render: () => (
    <CommandStoryFrame>
      <BaseCommand className="max-w-xl" includeSuggestions={false} includeSettings />
    </CommandStoryFrame>
  ),
};

export const DialogComposed: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Composes the shared command surface inside the already-shipped Dialog primitives instead of introducing a dedicated CommandDialog wrapper.',
      },
    },
  },
  render: () => (
    <CommandStoryFrame className="mx-auto w-full max-w-3xl">
      <DialogCommandExample />
    </CommandStoryFrame>
  ),
};
