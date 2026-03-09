import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Checkbox } from './Checkbox';
import type { CheckboxCheckedState, CheckboxProps } from './Checkbox.types';
import { checkboxSizeValues } from './Checkbox.types';

function CheckboxStoryHarness(args: CheckboxProps) {
  const [checked, setChecked] = React.useState<CheckboxCheckedState>(
    args.checked ?? args.defaultChecked ?? false,
  );

  React.useEffect(() => {
    if (args.checked !== undefined) {
      setChecked(args.checked);
      return;
    }

    if (args.defaultChecked !== undefined) {
      setChecked(args.defaultChecked);
      return;
    }

    setChecked(false);
  }, [args.checked, args.defaultChecked]);

  return (
    <Checkbox
      {...args}
      checked={checked}
      onCheckedChange={(nextChecked) => {
        setChecked(nextChecked);
        args.onCheckedChange?.(nextChecked);
      }}
    />
  );
}

const meta = {
  title: 'Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'Accept terms and conditions',
    description: 'This consent can be updated later in the account settings flow.',
    disabled: false,
    required: false,
    error: false,
    size: 'md',
  },
  argTypes: {
    checked: {
      control: 'radio',
      options: [false, true, 'indeterminate'],
    },
    defaultChecked: {
      control: false,
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: checkboxSizeValues,
    },
    label: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    onCheckedChange: {
      action: 'checked changed',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shared checkbox primitive with optional label, description, error messaging, and indeterminate support while keeping authored DOM on Box.',
      },
    },
  },
  render: (args) => <CheckboxStoryHarness {...args} />,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline checkbox with helper copy and the default medium density.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Box className="grid gap-4">
      {checkboxSizeValues.map((size) => (
        <Checkbox
          key={size}
          size={size}
          label={`${size.toUpperCase()} checkbox`}
          description="Size changes the control density while keeping the same semantic contract."
        />
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares the supported size scale for compact, default, and large checkbox layouts.',
      },
    },
  },
};

export const Indeterminate: Story = {
  args: {
    defaultChecked: 'indeterminate',
    label: 'Select all notifications',
    description: 'Some nested options are already selected.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: /select all notifications/i });

    await expect(checkbox).toHaveAttribute('aria-checked', 'mixed');

    await userEvent.click(checkbox);

    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the explicit indeterminate state required by the Wave B4 contract and verifies the first click resolves it to checked.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => (
    <Box className="grid gap-4">
      <Checkbox
        disabled
        label="Disabled unchecked"
        description="This option is unavailable in the current context."
      />
      <Checkbox
        checked
        disabled
        label="Disabled checked"
        description="A disabled checked state preserves the chosen value."
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares disabled unchecked and disabled checked states.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    error: 'You must accept the terms before continuing.',
    label: 'Accept terms and conditions',
    description: 'Required consent for this submission flow.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Applies destructive styling and links the inline error message with the control.',
      },
    },
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Enable account activity email',
    description: 'We only send critical security and billing notifications to this address.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the common label-plus-description presentation used in form scaffolding.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    label: 'Receive product updates',
    description: 'Toggle the checkbox to opt into release and maintenance notices.',
    onCheckedChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: /receive product updates/i });

    await userEvent.click(checkbox);

    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirms click interaction updates the checked state and calls the shared event prop.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  render: () => (
    <Box className="max-w-sm">
      <Checkbox
        label="Keep me signed in on this device"
        description="Recommended only for personal devices. Shared or public devices should require sign-in every session."
      />
    </Box>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Exercises wrapping and alignment in a constrained mobile-width container.',
      },
    },
  },
};
