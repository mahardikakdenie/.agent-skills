import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Button } from '../Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../Card';
import { Input } from '../Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';
import type { TabsOrientation, TabsProps } from './Tabs.types';
import { tabsOrientationValues } from './Tabs.types';

interface StoryTab {
  value: string;
  label: string;
  title: string;
  description: string;
  disabled?: boolean;
  content: React.ReactNode;
}

const defaultTabs: StoryTab[] = [
  {
    value: 'account',
    label: 'Account',
    title: 'Account details',
    description: 'Update the core identity fields used across your workspace.',
    content: (
      <Box className="grid gap-4">
        <Input label="Display name" defaultValue="Ariana Rahman" />
        <Input label="Workspace handle" defaultValue="@ariana" />
      </Box>
    ),
  },
  {
    value: 'security',
    label: 'Security',
    title: 'Security settings',
    description: 'Review how members sign in and which changes need confirmation.',
    content: (
      <Box className="grid gap-4">
        <Input label="Current password" type="password" defaultValue="current-password" />
        <Input label="New password" type="password" defaultValue="new-password" />
      </Box>
    ),
  },
  {
    value: 'notifications',
    label: 'Notifications',
    title: 'Notification defaults',
    description: 'Choose which summary updates stay enabled for the whole account.',
    content: (
      <Box className="grid gap-4">
        <Input label="Summary email" defaultValue="ops@friendsure.tech" />
        <Input label="Escalation channel" defaultValue="#ops-alerts" />
      </Box>
    ),
  },
];

const disabledTabs: StoryTab[] = [
  defaultTabs[0]!,
  {
    ...defaultTabs[1]!,
    disabled: true,
  },
  defaultTabs[2]!,
];

const scrollableTabs: StoryTab[] = [
  {
    value: 'summary',
    label: 'Executive summary',
    title: 'Executive summary',
    description: 'High-level KPI snapshot for the current reporting cycle.',
    content: <Box className="text-sm text-muted-foreground">Summary data goes here.</Box>,
  },
  {
    value: 'transactions',
    label: 'Transactions and statements',
    title: 'Transactions and statements',
    description: 'Operational transaction feed and downloadable statements.',
    content: <Box className="text-sm text-muted-foreground">Transaction content goes here.</Box>,
  },
  {
    value: 'commissions',
    label: 'Commission details',
    title: 'Commission details',
    description: 'Payout schedules and commission-level reconciliation.',
    content: <Box className="text-sm text-muted-foreground">Commission content goes here.</Box>,
  },
  {
    value: 'payouts',
    label: 'Payout approvals',
    title: 'Payout approvals',
    description: 'Approval stages, blockers, and release notes.',
    content: <Box className="text-sm text-muted-foreground">Payout content goes here.</Box>,
  },
  {
    value: 'documents',
    label: 'Documents and export history',
    title: 'Documents and export history',
    description: 'Generated exports and supporting document activity.',
    content: <Box className="text-sm text-muted-foreground">Document content goes here.</Box>,
  },
];

function StoryPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="justify-end">
        <Button type="button">Save changes</Button>
      </CardFooter>
    </Card>
  );
}

function TabsStoryHarness({
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
  ...props
}: TabsProps & { children?: React.ReactNode }) {
  const firstValue = defaultTabs[0]?.value;
  const isControlled = value !== undefined;
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(value ?? defaultValue ?? firstValue);

  React.useEffect(() => {
    if (isControlled) {
      setSelectedValue(value);
      return;
    }

    if (defaultValue !== undefined) {
      setSelectedValue(defaultValue);
      return;
    }

    setSelectedValue(firstValue);
  }, [defaultValue, firstValue, isControlled, value]);

  return (
    <Tabs
      {...props}
      className={className}
      defaultValue={isControlled ? undefined : defaultValue ?? firstValue}
      value={isControlled ? selectedValue : undefined}
      orientation={orientation}
      onValueChange={(nextValue) => {
        if (isControlled) {
          setSelectedValue(nextValue);
        }

        onValueChange?.(nextValue);
      }}
    >
      {children}
    </Tabs>
  );
}

function TabsExample({
  items,
  orientation = 'horizontal',
  onValueChange,
  value,
  defaultValue,
  className,
}: {
  items: StoryTab[];
  orientation?: TabsOrientation;
  onValueChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <TabsStoryHarness
      className={className}
      defaultValue={defaultValue ?? items[0]?.value}
      orientation={orientation}
      value={value}
      onValueChange={onValueChange}
    >
      <TabsList aria-label="Account settings sections">
        {items.map((item) => (
          <TabsTrigger key={item.value} value={item.value} disabled={item.disabled}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          <StoryPanel title={item.title} description={item.description}>
            {item.content}
          </StoryPanel>
        </TabsContent>
      ))}
    </TabsStoryHarness>
  );
}

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    defaultValue: defaultTabs[0]!.value,
    orientation: 'horizontal',
    onValueChange: fn(),
  },
  argTypes: {
    value: {
      control: 'select',
      options: defaultTabs.map((item) => item.value),
    },
    defaultValue: {
      control: 'select',
      options: defaultTabs.map((item) => item.value),
    },
    orientation: {
      control: 'select',
      options: tabsOrientationValues,
    },
    onValueChange: {
      action: 'value changed',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shared compound tabs primitive built on Radix Tabs with Box-authored DOM, automatic keyboard activation, horizontal overflow support, and vertical orientation.',
      },
    },
  },
  render: (args: TabsProps) => (
    <TabsExample
      className="max-w-3xl"
      defaultValue={args.defaultValue}
      orientation={args.orientation}
      value={args.value}
      onValueChange={args.onValueChange}
      items={defaultTabs}
    />
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline horizontal tabs with three shared triggers and card-backed panel content.',
      },
    },
  },
};

export const DisabledState: Story = {
  name: 'Disabled state',
  render: (args) => (
    <TabsExample
      className="max-w-3xl"
      defaultValue={args.defaultValue}
      orientation={args.orientation}
      onValueChange={args.onValueChange}
      items={disabledTabs}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows a disabled trigger that remains visible in the tablist but cannot be activated.',
      },
    },
  },
};

export const VerticalOrientation: Story = {
  name: 'Vertical orientation',
  render: (args) => (
    <TabsExample
      className="max-w-4xl"
      defaultValue={args.defaultValue}
      orientation="vertical"
      onValueChange={args.onValueChange}
      items={defaultTabs}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Uses the shared vertical orientation for settings-style side navigation.',
      },
    },
  },
};

export const Scrollable: Story = {
  args: {
    defaultValue: scrollableTabs[0]!.value,
    value: undefined,
  },
  render: (args) => (
    <TabsExample
      className="max-w-xl"
      defaultValue={scrollableTabs[0]!.value}
      orientation="horizontal"
      onValueChange={args.onValueChange}
      items={scrollableTabs}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exercises horizontal overflow for long labels and larger trigger sets without wrapping.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    onValueChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const accountTrigger = canvas.getByRole('tab', { name: /account/i });

    accountTrigger.focus();
    await expect(accountTrigger).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');

    const securityTrigger = canvas.getByRole('tab', { name: /security/i });
    await expect(securityTrigger).toHaveAttribute('aria-selected', 'true');
    await expect(args.onValueChange).toHaveBeenCalledWith('security');

    const securityPanel = canvas.getByRole('tabpanel');
    await expect(securityPanel).toHaveTextContent(/security settings/i);
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirms keyboard navigation moves selection to the next tab and updates the active panel.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  name: 'Responsive layout',
  args: {
    defaultValue: scrollableTabs[0]!.value,
    value: undefined,
  },
  render: (args) => (
    <Box className="max-w-sm">
      <TabsExample
        className="w-full"
        defaultValue={scrollableTabs[0]!.value}
        orientation="horizontal"
        onValueChange={args.onValueChange}
        items={scrollableTabs}
      />
    </Box>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Exercises narrow-width tab layout so long labels rely on horizontal scrolling instead of wrapping.',
      },
    },
  },
};
