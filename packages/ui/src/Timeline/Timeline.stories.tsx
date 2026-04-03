import type { Meta, StoryObj } from '@storybook/react-vite';

import { Box } from '../Box';
import { Timeline } from './Timeline';
import {
  timelineOrientationValues,
  timelineStatusToneValues,
  type TimelineItem,
} from './Timeline.types';

const defaultItems: TimelineItem[] = [
  {
    id: 'submitted',
    title: 'Submitted',
    description: 'Your request was received and entered into the review queue.',
  },
  {
    id: 'review',
    title: 'Under review',
    description: 'A reviewer is checking the supporting details and attached documents.',
  },
  {
    id: 'complete',
    title: 'Completed',
    description: 'The process is finished and the final outcome is available.',
  },
];

const statusItems: TimelineItem[] = [
  {
    id: 'verified',
    title: 'Verified',
    description: 'The latest documents matched the account record.',
    statusTone: 'success',
  },
  {
    id: 'follow-up',
    title: 'Needs follow-up',
    description: 'One remaining item still needs clarification from the submitter.',
    statusTone: 'warning',
  },
  {
    id: 'paused',
    title: 'Paused',
    description: 'Processing is blocked until the upstream dependency recovers.',
    statusTone: 'destructive',
  },
  {
    id: 'note',
    title: 'Note added',
    description: 'A reviewer left additional context for the next handoff.',
    statusTone: 'info',
  },
];

const meta = {
  title: 'Data Display/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  args: {
    items: defaultItems,
    orientation: 'vertical',
    variant: 'outline',
    statusTone: 'default',
  },
  argTypes: {
    items: {
      control: false,
    },
    orientation: {
      control: 'select',
      options: timelineOrientationValues,
    },
    variant: {
      control: 'select',
      options: ['outline', 'shadow'],
    },
    statusTone: {
      control: 'select',
      options: timelineStatusToneValues,
    },
    className: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Presentation-only milestone timeline for status history and compact progress summaries, authored entirely with Box-based markup.',
      },
    },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline vertical timeline for ordered status or milestone history.',
      },
    },
  },
};

export const Horizontal: Story = {
  args: {
    items: defaultItems,
    orientation: 'horizontal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal layout for compact milestone summaries and side-by-side stage tracking.',
      },
    },
  },
};

export const Dense: Story = {
  render: () => (
    <Box className="max-w-sm">
      <Timeline
        items={[
          {
            id: 'received',
            title: 'Received',
            description: '08:15',
          },
          {
            id: 'queued',
            title: 'Queued',
            description: '08:21',
          },
          {
            id: 'reviewed',
            title: 'Reviewed',
            description: '08:34',
          },
          {
            id: 'approved',
            title: 'Approved',
            description: '08:42',
          },
        ]}
        className="[&_[data-slot=timeline-item]]:gap-x-3 [&_[data-slot=timeline-body]]:gap-0.5 [&_[data-slot=timeline-body]]:pb-4 [&_[data-slot=timeline-description]]:text-xs"
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows a denser presentation using consumer-owned className overrides instead of an extra density prop.',
      },
    },
  },
};

export const Status: Story = {
  args: {
    items: statusItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates per-item semantic marker tones for mixed status history inside one timeline.',
      },
    },
  },
};

export const ShadowMarkers: Story = {
  args: {
    items: statusItems,
    variant: 'shadow',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Adds the explicit `shadow` marker treatment while keeping tone-driven color semantics unchanged.',
      },
    },
  },
};
