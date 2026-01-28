import type { CheckedState } from '@radix-ui/react-checkbox';
import type { Meta, StoryObj } from '@storybook/react';
import { clsx } from 'clsx';
import { useId, useState, type ReactNode } from 'react';

import { Box } from '../Box';
import { Button } from '../Button';
import { Checkbox, type CheckboxProps } from './Checkbox';

type CheckboxFieldProps = CheckboxProps & {
  label: ReactNode;
  description?: ReactNode;
  containerClassName?: string;
};

type NotificationOption = {
  value: string;
  label: string;
  description: string;
};

const checkboxSizes = ['sm', 'md', 'lg'] as const;
const checkboxVariants = ['default', 'danger'] as const;

const notificationOptions: NotificationOption[] = [
  {
    value: 'claims',
    label: 'Claims alerts',
    description: 'Get notified when a claim status changes.',
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
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: checkboxVariants,
      description: 'Visual variant',
    },
    size: {
      control: 'select',
      options: checkboxSizes,
      description: 'Checkbox size',
    },
    checked: {
      control: 'select',
      options: [false, true, 'indeterminate'],
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
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function CheckboxCanvas({ children }: { children: ReactNode }) {
  return (
    <Box className="flex min-h-[320px] min-w-[560px] items-center justify-center bg-white p-10">
      {children}
    </Box>
  );
}

function CheckboxField({
  label,
  description,
  containerClassName,
  className,
  id: idProp,
  ...props
}: CheckboxFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <Box
      as="label"
      htmlFor={id}
      className={clsx('flex items-start gap-3 text-sm text-gray-700', containerClassName)}
    >
      <Checkbox id={id} className={clsx('mt-0.5', className)} {...props} />
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
    </Box>
  );
}

function IndeterminateDemo(args: CheckboxProps) {
  const [checked, setChecked] = useState<CheckedState>('indeterminate');

  const statusLabel =
    checked === 'indeterminate' ? 'Indeterminate' : checked ? 'Checked' : 'Unchecked';

  return (
    <CheckboxCanvas>
      <Box className="flex w-[420px] flex-col gap-4">
        <CheckboxField
          {...args}
          checked={checked}
          onCheckedChange={setChecked}
          label="Partial selection"
          description="Use indeterminate when only some nested items are selected."
        />
        <Box className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setChecked(false)}>
            Unchecked
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setChecked(true)}>
            Checked
          </Button>
          <Button size="sm" variant="outline" onClick={() => setChecked('indeterminate')}>
            Indeterminate
          </Button>
        </Box>
        <Box className="text-xs font-medium uppercase tracking-wide text-gray-500">
          State: {statusLabel}
        </Box>
      </Box>
    </CheckboxCanvas>
  );
}

function GroupSelectionDemo(args: CheckboxProps) {
  const [selected, setSelected] = useState<string[]>(['claims', 'billing']);

  const handleCheckedChange = (value: string) => (nextChecked: CheckedState) => {
    setSelected((previous) => {
      if (nextChecked === true) {
        return previous.includes(value) ? previous : [...previous, value];
      }

      return previous.filter((item) => item !== value);
    });
  };

  return (
    <CheckboxCanvas>
      <Box className="flex w-[440px] flex-col gap-4">
        <Box className="text-sm font-semibold text-gray-900">Notification preferences</Box>
        <Box className="flex flex-col gap-3">
          {notificationOptions.map((option) => (
            <CheckboxField
              key={option.value}
              {...args}
              checked={selected.includes(option.value)}
              onCheckedChange={handleCheckedChange(option.value)}
              label={option.label}
              description={option.description}
            />
          ))}
        </Box>
        <Box className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
          Selected: {selected.join(', ')}
        </Box>
      </Box>
    </CheckboxCanvas>
  );
}

export const Default: Story = {
  render: (args) => (
    <CheckboxCanvas>
      <CheckboxField
        {...args}
        label="Accept terms"
        description="You agree to the processing of your data for policy management."
      />
    </CheckboxCanvas>
  ),
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
  render: (args) => (
    <CheckboxCanvas>
      <CheckboxField
        {...args}
        label="Enable roadside assistance"
        description="Adds 24/7 towing and lockout coverage."
      />
    </CheckboxCanvas>
  ),
};

export const Indeterminate: Story = {
  render: (args) => <IndeterminateDemo {...args} />,
};

export const DisabledStates: Story = {
  render: (args) => (
    <CheckboxCanvas>
      <Box className="flex flex-col gap-4">
        <CheckboxField
          {...args}
          disabled
          label="Disabled"
          description="This option is not available on your current plan."
        />
        <CheckboxField
          {...args}
          disabled
          defaultChecked
          label="Disabled and checked"
          description="This coverage is locked in for the policy term."
        />
      </Box>
    </CheckboxCanvas>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <CheckboxCanvas>
      <Box className="flex flex-col gap-4">
        <CheckboxField
          {...args}
          variant="default"
          label="Email updates"
          description="Receive policy updates and reminders by email."
        />
        <CheckboxField
          {...args}
          variant="danger"
          defaultChecked
          label="I understand this cannot be undone"
          description="Cancelling coverage will remove all benefits immediately."
        />
      </Box>
    </CheckboxCanvas>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <CheckboxCanvas>
      <Box className="flex flex-col gap-4">
        <CheckboxField
          {...args}
          size="sm"
          label="Small checkbox"
          description="Helpful in dense tables or filters."
        />
        <CheckboxField
          {...args}
          size="md"
          defaultChecked
          label="Medium checkbox"
          description="Default size for most forms."
        />
        <CheckboxField
          {...args}
          size="lg"
          label="Large checkbox"
          description="Use when extra emphasis or touch targets are needed."
        />
      </Box>
    </CheckboxCanvas>
  ),
};

export const GroupSelection: Story = {
  render: (args) => <GroupSelectionDemo {...args} />,
};

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    defaultChecked: false,
    disabled: false,
  },
  render: (args) => (
    <CheckboxCanvas>
      <CheckboxField
        {...args}
        label="Interactive playground"
        description="Use the controls panel to explore states and variants."
      />
    </CheckboxCanvas>
  ),
};
