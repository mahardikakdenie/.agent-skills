import type { Meta, StoryObj } from '@storybook/react';

import { Box } from '../Box';
import { Button } from '../Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './Card';

const meta = {
  title: 'Components/Layout/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Coverage summary</CardTitle>
        <CardDescription>Review the latest policy changes before submitting.</CardDescription>
      </CardHeader>
      <CardContent>
        <Box className="space-y-2 text-sm text-gray-600">
          <Box as="p">Primary insured: Olivia Harper</Box>
          <Box as="p">Renewal date: March 18, 2026</Box>
          <Box as="p">Coverage limit: $1,000,000</Box>
        </Box>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="secondary">Edit</Button>
        <Button>Approve</Button>
      </CardFooter>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardContent className="pt-6">
        <Box className="space-y-3">
          <CardTitle>Upcoming renewal</CardTitle>
          <CardDescription>
            Your current coverage expires soon. Review the updated premium options.
          </CardDescription>
          <Button size="sm">View details</Button>
        </Box>
      </CardContent>
    </Card>
  ),
};

export const WithMutedFooter: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Billing alert</CardTitle>
        <CardDescription>Payment method expires in 5 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <Box className="space-y-1 text-sm text-gray-600">
          <Box as="p">Card ending: 1241</Box>
          <Box as="p">Next invoice: $482.50</Box>
        </Box>
      </CardContent>
      <CardFooter className="justify-between text-xs text-gray-500">
        <Box as="span">Updated 2 hours ago</Box>
        <Button variant="ghost" size="sm">
          Update card
        </Button>
      </CardFooter>
    </Card>
  ),
};
