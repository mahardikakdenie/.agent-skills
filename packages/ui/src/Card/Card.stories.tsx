import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Badge } from '../Badge';
import { Box } from '../Box';
import { Button } from '../Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

function InteractiveCardExample() {
  const [pressed, setPressed] = React.useState(false);

  const activate = () => {
    setPressed((current) => !current);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    activate();
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label="Open policy overview"
      aria-pressed={pressed}
      onClick={activate}
      onKeyDown={handleKeyDown}
      className="cursor-pointer hover:shadow-md"
    >
      <CardHeader>
        <Box className="flex items-start justify-between gap-3">
          <Box className="space-y-1">
            <CardTitle>Policy overview</CardTitle>
            <CardDescription>
              Consumer-owned semantics can turn the card into a keyboard-accessible control.
            </CardDescription>
          </Box>
          <Badge variant={pressed ? 'success' : 'secondary'}>{pressed ? 'Opened' : 'Idle'}</Badge>
        </Box>
      </CardHeader>
      <CardContent>
        <Box className="text-sm text-muted-foreground">
          Press Enter, Space, or click the card to toggle the interaction state.
        </Box>
      </CardContent>
    </Card>
  );
}

const meta = {
  title: 'Layout/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Structural surface with named composition slots for grouped content, summary panels, and reusable layout shells.',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader className="gap-3">
        <CardTitle>Monthly premium</CardTitle>
        <Box className="text-3xl font-semibold tracking-tight">RM 4,250</Box>
      </CardHeader>
      <CardContent>
        <CardDescription>Includes the latest approval and commission adjustments.</CardDescription>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the minimum structural usage for a simple contained panel.',
      },
    },
  },
};

export const HeaderFooter: Story = {
  name: 'Header And Footer',
  render: () => (
    <Card className="max-w-lg">
      <CardHeader>
        <Box className="flex flex-wrap items-start justify-between gap-3">
          <Box className="space-y-1">
            <CardTitle>Submission review</CardTitle>
            <CardDescription>Review the current request details before continuing.</CardDescription>
          </Box>
          <Badge variant="warning">Pending</Badge>
        </Box>
      </CardHeader>
      <CardContent>
        <Box className="space-y-3 text-sm text-muted-foreground">
          <Box className="flex items-center justify-between gap-4">
            <Box as="span">Plan</Box>
            <Box as="span" className="font-medium text-foreground">
              Family Secure Plus
            </Box>
          </Box>
          <Box className="flex items-center justify-between gap-4">
            <Box as="span">Effective date</Box>
            <Box as="span" className="font-medium text-foreground">
              12 Mar 2026
            </Box>
          </Box>
        </Box>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline">Cancel</Button>
        <Button>Continue</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exercises the named header, content, and footer slots in a realistic approval panel.',
      },
    },
  },
};

export const Interactive: Story = {
  render: () => <InteractiveCardExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('button', { name: /open policy overview/i });

    await userEvent.tab();
    await expect(card).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByText('Opened')).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the recommended consumer-owned interactive card pattern without adding a shared boolean mode.',
      },
    },
  },
};

export const ElevatedComposition: Story = {
  render: () => (
    <Card className="max-w-md shadow-md">
      <CardHeader>
        <CardTitle>Escalation queue</CardTitle>
        <CardDescription>
          Stronger elevation stays a composition concern through `className`.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Box className="space-y-3">
          <Badge variant="destructive">3 urgent</Badge>
          <Box className="text-sm text-muted-foreground">
            Keep the shared API minimal while still allowing app-level presentation tuning.
          </Box>
        </Box>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows an elevated card treatment applied through composition instead of a dedicated shared prop.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Box className="max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Compact mobile summary</CardTitle>
          <CardDescription>
            Confirms wrapping and spacing remain stable in a constrained layout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Box className="space-y-3">
            <Box className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
              Coverage starts immediately after verification is complete.
            </Box>
            <Button className="w-full">View policy</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Checks spacing, wrapping, and nested action layout in a narrow mobile viewport.',
      },
    },
  },
};



