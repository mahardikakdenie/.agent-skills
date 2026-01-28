import type { Meta, StoryObj } from '@storybook/react';
import { clsx } from 'clsx';
import { useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { Badge } from '../Badge';
import { Box } from '../Box';
import { Button } from '../Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

type TabsRootProps = ComponentPropsWithoutRef<typeof Tabs>;

const tabValues = ['overview', 'benefits', 'billing'] as const;
type TabValue = (typeof tabValues)[number];

type RenderOptions = {
  disabledTab?: TabValue;
  listClassName?: string;
  rootClassName?: string;
  contentClassName?: string;
};

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'select',
      options: tabValues,
      description: 'The tab that is active on initial render',
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the tab list',
    },
    activationMode: {
      control: 'inline-radio',
      options: ['automatic', 'manual'],
      description: 'Whether tabs activate on focus (automatic) or only on click/Enter (manual)',
    },
    dir: {
      control: 'inline-radio',
      options: ['ltr', 'rtl'],
      description: 'Reading direction',
    },
  },
  args: {
    defaultValue: 'overview',
    orientation: 'horizontal',
    activationMode: 'automatic',
    dir: 'ltr',
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

function TabsCanvas({ children }: { children: ReactNode }) {
  return (
    <Box className="flex min-h-[360px] min-w-[720px] items-start justify-center bg-white p-10">
      {children}
    </Box>
  );
}

type ContentCardProps = {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
};

function ContentCard({ title, description, children, className }: ContentCardProps) {
  return (
    <Box
      className={clsx('w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm', className)}
    >
      <Box className="flex flex-col gap-2">
        <Box as="h4" className="text-base font-semibold text-gray-900">
          {title}
        </Box>
        <Box className="text-sm text-gray-600">{description}</Box>
      </Box>
      {children}
    </Box>
  );
}

function renderPolicyTabs(rootProps: TabsRootProps, options: RenderOptions = {}) {
  const { disabledTab, listClassName, rootClassName, contentClassName } = options;

  return (
    <TabsCanvas>
      <Tabs
        {...rootProps}
        className={clsx('w-[640px]', rootClassName)}
        defaultValue={rootProps.defaultValue ?? 'overview'}
      >
        <TabsList className={listClassName}>
          <TabsTrigger value="overview" disabled={disabledTab === 'overview'}>
            Overview
          </TabsTrigger>
          <TabsTrigger value="benefits" disabled={disabledTab === 'benefits'}>
            Benefits
          </TabsTrigger>
          <TabsTrigger value="billing" disabled={disabledTab === 'billing'}>
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className={contentClassName}>
          <ContentCard
            title="Policy overview"
            description="Your auto policy is active and includes comprehensive coverage."
          >
            <Box className="mt-4 flex flex-wrap items-center gap-2">
              <Badge>Active</Badge>
              <Badge variant="secondary">Next renewal: Mar 1, 2026</Badge>
              <Badge variant="outline">Premium: $118/mo</Badge>
            </Box>
          </ContentCard>
        </TabsContent>

        <TabsContent value="benefits" className={contentClassName}>
          <ContentCard
            title="Included benefits"
            description="These add-ons are currently enabled on your policy."
          >
            <Box className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-700">
              <Box className="rounded-lg border border-gray-200 p-3">Roadside assistance</Box>
              <Box className="rounded-lg border border-gray-200 p-3">Rental reimbursement</Box>
              <Box className="rounded-lg border border-gray-200 p-3">Glass coverage</Box>
              <Box className="rounded-lg border border-gray-200 p-3">Accident forgiveness</Box>
            </Box>
          </ContentCard>
        </TabsContent>

        <TabsContent value="billing" className={contentClassName}>
          <ContentCard
            title="Billing"
            description="Your next payment is scheduled for Feb 5, 2026."
          >
            <Box className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <Box>
                <Box className="text-sm font-medium text-gray-900">$118.00</Box>
                <Box className="text-xs text-gray-600">Auto-pay � Visa ending in 4242</Box>
              </Box>
              <Button size="sm" variant="secondary">
                Update payment
              </Button>
            </Box>
          </ContentCard>
        </TabsContent>
      </Tabs>
    </TabsCanvas>
  );
}

export const Default: Story = {
  render: (args: TabsRootProps) => renderPolicyTabs(args),
};

export const DefaultBillingTab: Story = {
  args: {
    defaultValue: 'billing',
  },
  render: (args: TabsRootProps) => renderPolicyTabs(args),
};

export const DisabledTab: Story = {
  render: (args: TabsRootProps) =>
    renderPolicyTabs(args, {
      disabledTab: 'benefits',
    }),
};

export const ManualActivation: Story = {
  args: {
    activationMode: 'manual',
  },
  render: (args: TabsRootProps) => renderPolicyTabs(args),
};

export const VerticalOrientation: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args: TabsRootProps) =>
    renderPolicyTabs(args, {
      rootClassName: 'flex w-[760px] gap-6',
      listClassName:
        'h-auto min-w-[200px] flex-col items-stretch justify-start gap-1 rounded-xl border border-gray-200 bg-gray-50 p-2',
      contentClassName: 'mt-0 flex-1',
    }),
};

export const WithBadges: Story = {
  render: (args: TabsRootProps) => (
    <TabsCanvas>
      <Tabs {...args} className="w-[680px]" defaultValue="overview">
        <TabsList className="w-full justify-start gap-1">
          <TabsTrigger value="overview" className="gap-2">
            Overview
            <Badge variant="secondary" size="sm">
              New
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="benefits" className="gap-2">
            Benefits
            <Badge variant="outline" size="sm">
              4
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            Billing
            <Badge variant="danger" size="sm">
              Due
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ContentCard title="Highlights" description="Key updates since your last renewal.">
            <Box className="mt-4 text-sm text-gray-700">
              We lowered your deductible and added roadside assistance at no additional cost.
            </Box>
          </ContentCard>
        </TabsContent>
        <TabsContent value="benefits">
          <ContentCard
            title="Benefits summary"
            description="You currently have four optional protections enabled."
          />
        </TabsContent>
        <TabsContent value="billing">
          <ContentCard title="Payment status" description="A payment is due in 3 days." />
        </TabsContent>
      </Tabs>
    </TabsCanvas>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<TabValue>('overview');

    const handleValueChange = (nextValue: string) => {
      setValue(nextValue as TabValue);
    };

    return (
      <TabsCanvas>
        <Tabs value={value} onValueChange={handleValueChange} className="w-[640px]">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ContentCard title="Controlled tabs" description={`The active tab is "${value}".`}>
              <Box className="mt-4 text-sm text-gray-700">
                This story keeps the active tab in React state.
              </Box>
            </ContentCard>
          </TabsContent>
          <TabsContent value="benefits">
            <ContentCard title="Benefits" description="State is shared across all tabs." />
          </TabsContent>
          <TabsContent value="billing">
            <ContentCard
              title="Billing"
              description="Value changes update the state immediately."
            />
          </TabsContent>
        </Tabs>
      </TabsCanvas>
    );
  },
};
