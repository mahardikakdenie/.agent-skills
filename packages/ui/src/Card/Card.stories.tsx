import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../Badge';
import { Box } from '../Box';
import { Button } from '../Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

const meta = {
  title: 'Data Display/Card',
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

