import type { Meta, StoryObj } from '@storybook/react-vite';

import { Box } from '../Box';
import { Label } from './Label';
import { labelToneValues } from './Label.types';

const fieldClassName =
  'peer h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm text-foreground shadow-sm outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60';

const meta = {
  title: 'Inputs/Label',
  component: Label,
  tags: ['autodocs'],
  args: {
    htmlFor: 'label-default-field',
    tone: 'default',
    required: false,
    disabled: false,
    children: 'Email address',
  },
  argTypes: {
    htmlFor: {
      control: 'text',
    },
    tone: {
      control: 'select',
      options: labelToneValues,
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    children: {
      control: 'text',
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
          'Shared form-label primitive that links readable caption text to labelable controls while keeping authored shared DOM on Box.',
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Box className="grid max-w-sm gap-2">
      <Label {...args} />
      <Box
        as="input"
        id={args.htmlFor}
        type="email"
        placeholder="customer@example.com"
        className={fieldClassName}
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Baseline label associated with a standard text field.',
      },
    },
  },
};

export const Tones: Story = {
  render: () => (
    <Box className="grid gap-4 md:grid-cols-3">
      {labelToneValues.map((tone) => {
        const id = `label-tone-${tone}`;

        return (
          <Box key={tone} className="grid gap-2">
            <Label htmlFor={id} tone={tone}>
              {tone.charAt(0).toUpperCase() + tone.slice(1)} label
            </Label>
            <Box as="input" id={id} type="text" className={fieldClassName} />
          </Box>
        );
      })}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares the full shared tone scale for default, muted, and destructive field captions.',
      },
    },
  },
};

export const RequiredState: Story = {
  render: () => (
    <Box className="grid max-w-sm gap-2">
      <Label htmlFor="label-required-field" required>
        Policy number
      </Label>
      <Box
        as="input"
        id="label-required-field"
        type="text"
        required
        placeholder="POL-000123"
        className={fieldClassName}
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the inline required indicator alongside the associated form control.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => (
    <Box className="grid max-w-sm gap-2">
      <Label htmlFor="label-disabled-field" disabled>
        Archived email address
      </Label>
      <Box
        as="input"
        id="label-disabled-field"
        type="email"
        disabled
        value="archived@example.com"
        readOnly
        className={fieldClassName}
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the muted disabled treatment for labels paired with disabled controls.',
      },
    },
  },
};

