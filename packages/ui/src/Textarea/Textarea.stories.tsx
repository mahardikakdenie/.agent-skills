import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Box } from '../Box';
import { Textarea } from './Textarea';

function ControlledTextareaStory(props: React.ComponentProps<typeof Textarea>) {
  const [value, setValue] = React.useState('');

  return <Textarea {...props} value={value} onValueChange={setValue} />;
}

const meta = {
  title: 'Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    disabled: false,
    clearable: false,
    label: 'Notes',
    placeholder: 'Add internal notes…',
    helperText: 'Use plain text only.',
    rows: 4,
  },
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    onChange: {
      action: 'changed',
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
          'Shared multiline text-entry primitive with label, helper and error text, clearable content, and native textarea semantics routed through Box.',
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Add internal notes…',
    rows: 4,
  },
  parameters: {
    docs: {
      description: {
        story: 'Baseline shared textarea for plain-text notes and comments.',
      },
    },
  },
};

export const Resize: Story = {
  render: () => (
    <Box className="grid max-w-3xl gap-4 md:grid-cols-2">
      <Textarea
        label="Short remarks"
        placeholder="This textarea uses the default row count and native resize handle…"
        rows={4}
      />
      <Textarea
        label="Longer description"
        placeholder="This textarea starts taller through native rows while retaining browser resize behavior…"
        rows={8}
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exercises the shared multiline shell with native row sizing and browser resize behavior.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Description',
    placeholder: 'Add a plain-text description…',
    error: 'Description is required.',
    helperText: 'Use plain text only.',
    rows: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows invalid styling and inline error messaging on the shared textarea shell.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => (
    <Box className="grid max-w-3xl gap-4 md:grid-cols-2">
      <Textarea
        disabled
        label="Disabled notes"
        defaultValue="This field is locked while the workflow is pending."
        rows={4}
      />
      <Textarea
        disabled
        label="Disabled remarks"
        placeholder="Disabled placeholder…"
        helperText="Editing is unavailable in this state."
        rows={5}
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows disabled treatment with both default value and placeholder-only states.',
      },
    },
  },
};

export const Clearable: Story = {
  render: () => (
    <ControlledTextareaStory
      label="Remarks"
      placeholder="Type a note and clear it…"
      helperText="The clear action only appears when content is present."
      clearable
      rows={5}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the clear action in a controlled textarea usage pattern.',
      },
    },
  },
};

