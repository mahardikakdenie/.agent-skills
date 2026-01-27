import type { Meta, StoryObj } from '@storybook/react';
import { clsx } from 'clsx';
import { useId, useState, type ReactNode } from 'react';

import { Box } from '../Box';
import { Button } from '../Button';
import { Switch, type SwitchProps } from './Switch';

type SwitchFieldProps = SwitchProps & {
  label: ReactNode;
  description?: ReactNode;
  containerClassName?: string;
};

type PreferenceOption = {
  value: string;
  label: string;
  description: string;
};

const switchSizes = ['sm', 'md', 'lg'] as const;
const switchVariants = ['default', 'danger'] as const;

const preferenceOptions: PreferenceOption[] = [
  {
    value: 'claims',
    label: 'Claims alerts',
    description: 'Get notified whenever a claim status changes.',
  },
  {
    value: 'billing',
    label: 'Billing reminders',
    description: 'Receive reminders before payments are due.',
  },
  {
    value: 'offers',
    label: 'Product offers',
    description: 'Hear about new coverage options and discounts.',
  },
];

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: switchVariants,
      description: 'Visual variant',
    },
    size: {
      control: 'select',
      options: switchSizes,
      description: 'Switch size',
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state for uncontrolled usage',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interactions',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required',
    },
    onCheckedChange: {
      action: 'checkedChange',
      description: 'Callback fired when the checked state changes',
    },
  },
  args: {
    variant: 'default',
    size: 'md',
    defaultChecked: false,
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

function SwitchCanvas({ children }: { children: ReactNode }) {
  return (
    <Box className="flex min-h-[320px] min-w-[560px] items-center justify-center bg-white p-10">
      {children}
    </Box>
  );
}

function SwitchField({
  label,
  description,
  containerClassName,
  className,
  id: idProp,
  ...props
}: SwitchFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <Box
      as="label"
      htmlFor={id}
      className={clsx(
        'flex w-full items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700',
        containerClassName,
      )}
    >
      <Box className="flex flex-col gap-1">
        <Box as="span" className="font-medium text-gray-900">
          {label}
        </Box>
        {description && (
          <Box as="span" className="text-xs text-gray-500">
            {description}
          </Box>
        )}
      </Box>
      <Switch id={id} className={className} {...props} />
    </Box>
  );
}

function ControlledDemo(args: SwitchProps) {
  const [checked, setChecked] = useState(false);

  const statusLabel = checked ? 'Enabled' : 'Disabled';

  return (
    <SwitchCanvas>
      <Box className="flex w-[420px] flex-col gap-4">
        <SwitchField
          {...args}
          checked={checked}
          onCheckedChange={setChecked}
          label="Policy auto-renew"
          description="Automatically renew your policy before it expires."
        />
        <Box className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setChecked(false)}>
            Turn off
          </Button>
          <Button size="sm" variant="outline" onClick={() => setChecked(true)}>
            Turn on
          </Button>
        </Box>
        <Box className="text-xs font-medium uppercase tracking-wide text-gray-500">
          State: {statusLabel}
        </Box>
      </Box>
    </SwitchCanvas>
  );
}

function PreferenceGroupDemo(args: SwitchProps) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    claims: true,
    billing: true,
    offers: false,
  });

  const handleCheckedChange = (value: string) => (nextChecked: boolean) => {
    setEnabled((previous) => ({
      ...previous,
      [value]: nextChecked,
    }));
  };

  const enabledList = preferenceOptions
    .filter((option) => enabled[option.value])
    .map((option) => option.label);

  return (
    <SwitchCanvas>
      <Box className="flex w-[460px] flex-col gap-4">
        <Box className="text-sm font-semibold text-gray-900">Notification preferences</Box>
        <Box className="flex flex-col gap-3">
          {preferenceOptions.map((option) => (
            <SwitchField
              key={option.value}
              {...args}
              checked={enabled[option.value]}
              onCheckedChange={handleCheckedChange(option.value)}
              label={option.label}
              description={option.description}
            />
          ))}
        </Box>
        <Box className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
          Enabled: {enabledList.length > 0 ? enabledList.join(', ') : 'None'}
        </Box>
      </Box>
    </SwitchCanvas>
  );
}

export const Default: Story = {
  render: (args) => (
    <SwitchCanvas>
      <Box className="flex w-[420px] flex-col gap-3">
        <SwitchField
          {...args}
          label="Email updates"
          description="Receive important policy updates by email."
        />
      </Box>
    </SwitchCanvas>
  ),
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
  render: (args) => (
    <SwitchCanvas>
      <SwitchField
        {...args}
        label="Roadside assistance"
        description="Adds 24/7 towing and lockout coverage."
      />
    </SwitchCanvas>
  ),
};

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};

export const DisabledStates: Story = {
  render: (args) => (
    <SwitchCanvas>
      <Box className="flex w-[420px] flex-col gap-3">
        <SwitchField
          {...args}
          disabled
          label="Disabled"
          description="This option is not available on your current plan."
        />
        <SwitchField
          {...args}
          disabled
          defaultChecked
          label="Disabled and enabled"
          description="This setting is locked in for the policy term."
        />
      </Box>
    </SwitchCanvas>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <SwitchCanvas>
      <Box className="flex w-[420px] flex-col gap-3">
        <SwitchField
          {...args}
          variant="default"
          defaultChecked
          label="Standard variant"
          description="Uses the primary brand color when enabled."
        />
        <SwitchField
          {...args}
          variant="danger"
          defaultChecked
          label="Danger variant"
          description="Highlights destructive or risky settings."
        />
      </Box>
    </SwitchCanvas>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <SwitchCanvas>
      <Box className="flex w-[420px] flex-col gap-3">
        <SwitchField
          {...args}
          size="sm"
          label="Small switch"
          description="Helpful in dense preference lists."
        />
        <SwitchField
          {...args}
          size="md"
          defaultChecked
          label="Medium switch"
          description="Default size for most forms."
        />
        <SwitchField
          {...args}
          size="lg"
          label="Large switch"
          description="Use when larger touch targets are needed."
        />
      </Box>
    </SwitchCanvas>
  ),
};

export const PreferenceGroup: Story = {
  render: (args) => <PreferenceGroupDemo {...args} />,
};

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    defaultChecked: false,
    disabled: false,
  },
  render: (args) => (
    <SwitchCanvas>
      <SwitchField
        {...args}
        label="Interactive playground"
        description="Use the controls panel to explore states and variants."
      />
    </SwitchCanvas>
  ),
};
