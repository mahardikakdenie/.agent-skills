import type { Meta, StoryObj } from '@storybook/react';
import { useId, useState } from 'react';

import { Box } from '../Box';
import { Label } from '../Label';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'The visual style variant of the textarea',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the textarea',
    },
    resize: {
      control: 'select',
      options: ['vertical', 'both', 'none'],
      description: 'Controls whether the textarea can be resized by the user',
    },
    rows: {
      control: { type: 'number', min: 2, max: 12, step: 1 },
      description: 'Initial number of visible text rows',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the textarea when true',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the textarea',
    },
    maxLength: {
      control: { type: 'number', min: 20, max: 500, step: 10 },
      description: 'Maximum number of characters allowed',
    },
  },
  args: {
    placeholder: 'Add more detail...',
    resize: 'vertical',
    rows: 4,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue:
      'This textarea shows how longer content wraps and keeps a consistent line height.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'This field is read-only while we verify your policy details.',
  },
};

export const ErrorVariant: Story = {
  args: {
    variant: 'error',
    defaultValue: 'Please include your claim number.',
  },
};

export const SuccessVariant: Story = {
  args: {
    variant: 'success',
    defaultValue: 'All required information is included.',
  },
};

export const SmallSize: Story = {
  args: {
    size: 'sm',
    placeholder: 'Short note',
  },
};

export const MediumSize: Story = {
  args: {
    size: 'md',
    placeholder: 'Standard response',
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    placeholder: 'Detailed response',
  },
};

export const ResizeNone: Story = {
  args: {
    resize: 'none',
    defaultValue: 'Resizing is disabled for this field.',
  },
};

export const ResizeBoth: Story = {
  args: {
    resize: 'both',
    defaultValue: 'You can resize this textarea in both directions.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Box className="flex w-96 flex-col gap-4">
      <Textarea placeholder="Default variant" />
      <Textarea variant="error" defaultValue="Missing policy number." aria-invalid />
      <Textarea variant="success" defaultValue="Information looks good." aria-invalid={false} />
    </Box>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <Box className="flex w-96 flex-col gap-4">
      <Textarea size="sm" placeholder="Small" />
      <Textarea size="md" placeholder="Medium" />
      <Textarea size="lg" placeholder="Large" />
    </Box>
  ),
};

export const WithLabelAndHelperText: Story = {
  render: () => {
    const id = useId();

    return (
      <Box className="flex w-[420px] flex-col gap-2">
        <Label htmlFor={id} className="text-gray-900">
          Additional context
        </Label>
        <Textarea id={id} placeholder="Describe what happened, including dates and locations." />
        <Box className="text-xs text-gray-500">Avoid including sensitive personal information.</Box>
      </Box>
    );
  },
};

export const CharacterCount: Story = {
  render: () => {
    const id = useId();
    const maxLength = 160;
    const [value, setValue] = useState('');
    const remaining = maxLength - value.length;
    const isNearLimit = remaining <= 20;

    return (
      <Box className="flex w-[420px] flex-col gap-2">
        <Label htmlFor={id} className="text-gray-900">
          Public notes
        </Label>
        <Textarea
          id={id}
          maxLength={maxLength}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Share a short update that will appear in the activity feed."
          aria-describedby={`${id}-count`}
          variant={isNearLimit ? 'error' : 'default'}
        />
        <Box id={`${id}-count`} className="flex items-center justify-between text-xs">
          <Box className="text-gray-500">Keep it concise and respectful.</Box>
          <Box className={isNearLimit ? 'text-[var(--color-danger)]' : 'text-gray-500'}>
            {remaining} characters left
          </Box>
        </Box>
      </Box>
    );
  },
};

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    resize: 'vertical',
    placeholder: 'Use the controls to explore textarea states',
    rows: 4,
  },
};
