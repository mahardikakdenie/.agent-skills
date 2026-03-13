import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, BookOpenText, FileStack, ShieldCheck, Sparkles } from 'lucide-react';
import * as React from 'react';
import { fn } from 'storybook/test';

import { Box } from '../Box';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from './NavigationMenu';
import type { NavigationMenuProps } from './NavigationMenu.types';

type NavigationMenuStoryArgs = Omit<NavigationMenuProps, 'children'>;

interface NavigationFeatureCard {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const solutionCards: NavigationFeatureCard[] = [
  {
    href: '/claims',
    title: 'Claims automation',
    description: 'Guide partners through intake, review, and approval flows.',
    icon: <ShieldCheck aria-hidden="true" className="h-4 w-4" />,
  },
  {
    href: '/products',
    title: 'Product launches',
    description: 'Bundle onboarding, distribution, and pricing governance in one place.',
    icon: <Sparkles aria-hidden="true" className="h-4 w-4" />,
  },
  {
    href: '/workflows',
    title: 'Workflow templates',
    description: 'Start from reusable task flows for support, operations, and compliance.',
    icon: <FileStack aria-hidden="true" className="h-4 w-4" />,
  },
  {
    href: '/guides',
    title: 'Implementation guides',
    description: 'Read migration playbooks and rollout checklists for shared adoption.',
    icon: <BookOpenText aria-hidden="true" className="h-4 w-4" />,
  },
];

function SolutionCard({ card }: { card: NavigationFeatureCard }) {
  return (
    <NavigationMenuLink
      href={card.href}
      className="flex h-full w-full max-w-full flex-col items-start justify-start gap-3 whitespace-normal rounded-2xl border border-border/70 bg-background/60 p-4 text-left shadow-sm ring-0 hover:border-border hover:bg-accent/40"
    >
      <Box className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {card.icon}
      </Box>
      <Box className="grid w-full gap-1">
        <Box as="span" className="text-sm font-semibold text-foreground">
          {card.title}
        </Box>
        <Box as="span" className="text-sm leading-6 text-muted-foreground">
          {card.description}
        </Box>
      </Box>
      <Box as="span" className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
        Explore
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Box>
    </NavigationMenuLink>
  );
}

function SharedNavigationMenu(
  args: Pick<
    NavigationMenuProps,
    'defaultValue' | 'value' | 'onValueChange' | 'orientation' | 'dir' | 'delayDuration' | 'skipDelayDuration'
  >,
) {
  return (
    <NavigationMenu
      defaultValue={args.defaultValue}
      value={args.value}
      onValueChange={args.onValueChange}
      orientation={args.orientation}
      dir={args.dir}
      delayDuration={args.delayDuration}
      skipDelayDuration={args.skipDelayDuration}
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/overview" active>
            Overview
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem value="solutions">
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent className="md:w-[34rem]">
            <Box className="grid gap-2 md:grid-cols-2">
              {solutionCards.map((card) => (
                <SolutionCard key={card.href} card={card} />
              ))}
            </Box>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>

      <NavigationMenuIndicator />
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}

function ActiveLinksStory() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/dashboard" active>
            Dashboard
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/partners">Partners</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/reports">Reports</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function VerticalStory() {
  return (
    <Box className="max-w-md">
      <NavigationMenu orientation="vertical" onValueChange={fn()} delayDuration={200} skipDelayDuration={300}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/overview">Overview</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem value="solutions">
            <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
            <NavigationMenuContent className="mt-2">
              <Box className="grid gap-2">
                {solutionCards.slice(0, 2).map((card) => (
                  <SolutionCard key={card.href} card={card} />
                ))}
              </Box>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </Box>
  );
}

function AsChildStory() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild active>
            <Box as="a" href="/partners">
              Partners
            </Box>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Box as="a" href="/support">
              Support
            </Box>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function DisabledTriggerStory() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/overview">Overview</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem value="solutions">
          <NavigationMenuTrigger disabled>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent className="md:w-[28rem]">
            <Box className="grid gap-2 md:grid-cols-2">
              {solutionCards.slice(0, 2).map((card) => (
                <SolutionCard key={card.href} card={card} />
              ))}
            </Box>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const meta: Meta<NavigationMenuStoryArgs> = {
  title: 'Navigation/NavigationMenu',
  component: NavigationMenu as unknown as React.ComponentType<NavigationMenuStoryArgs>,
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal',
    defaultValue: '',
    delayDuration: 200,
    skipDelayDuration: 300,
    onValueChange: fn(),
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    defaultValue: {
      control: 'select',
      options: ['', 'solutions'],
    },
    value: {
      control: false,
    },
    dir: {
      control: 'radio',
      options: ['ltr', 'rtl'],
    },
    delayDuration: {
      control: { type: 'number', min: 0, step: 50 },
    },
    skipDelayDuration: {
      control: { type: 'number', min: 0, step: 50 },
    },
    onValueChange: {
      action: 'value changed',
    },
  },
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <SharedNavigationMenu
      defaultValue={args.defaultValue}
      value={args.value}
      onValueChange={args.onValueChange}
      orientation={args.orientation}
      dir={args.dir}
      delayDuration={args.delayDuration}
      skipDelayDuration={args.skipDelayDuration}
    />
  ),
};

export default meta;
type Story = StoryObj<NavigationMenuStoryArgs>;

export const Basic: Story = {
};

export const ActiveLink: Story = {
  render: () => <ActiveLinksStory />,
};

export const VerticalOrientation: Story = {
  render: () => <VerticalStory />,
};

export const AsChildLinks: Story = {
  render: () => <AsChildStory />,
};

export const DisabledTrigger: Story = {
  render: () => <DisabledTriggerStory />,
};
