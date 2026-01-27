import type { Meta, StoryObj } from '@storybook/react';
import { clsx } from 'clsx';
import { useId, type ReactNode } from 'react';

import { Box } from '../Box';
import { Checkbox } from '../Checkbox';
import { Input } from '../Input';
import { Switch } from '../Switch';
import { Label } from './Label';

const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Label content',
    },
    htmlFor: {
      control: 'text',
      description: 'Associates the label with a form control id',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    children: 'Email address',
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

function LabelCanvas({ children }: { children: ReactNode }) {
  return (
    <Box className="flex min-h-[320px] min-w-[640px] items-center justify-center bg-white p-10">
      {children}
    </Box>
  );
}

function TextFieldDemo({
  label,
  description,
  variant = 'default',
}: {
  label: ReactNode;
  description?: ReactNode;
  variant?: 'default' | 'error' | 'success';
}) {
  const id = useId();

  return (
    <Box className="flex w-[380px] flex-col gap-2">
      <Label htmlFor={id} className="text-gray-900">
        {label}
      </Label>
      <Input id={id} variant={variant} placeholder="name@example.com" />
      {description && <Box className="text-xs text-gray-500">{description}</Box>}
    </Box>
  );
}

export const Default: Story = {
  render: (args) => (
    <LabelCanvas>
      <Label {...args} />
    </LabelCanvas>
  ),
};

export const WithInput: Story = {
  render: () => (
    <LabelCanvas>
      <TextFieldDemo
        label="Email address"
        description="We will only use this for policy-related communication."
      />
    </LabelCanvas>
  ),
};

export const Required: Story = {
  render: () => (
    <LabelCanvas>
      <TextFieldDemo
        label={
          <Box as="span" className="inline-flex items-center gap-1">
            Policy number
            <Box as="span" className="text-[var(--color-danger)]" aria-hidden>
              *
            </Box>
          </Box>
        }
        description="Required to link an existing policy."
      />
    </LabelCanvas>
  ),
};

export const PeerDisabled: Story = {
  render: () => {
    const checkboxId = useId();
    const switchId = useId();

    return (
      <LabelCanvas>
        <Box className="flex w-[420px] flex-col gap-4">
          <Box className="flex items-center gap-3">
            <Checkbox id={checkboxId} disabled />
            <Label htmlFor={checkboxId} className="text-gray-900">
              Disabled checkbox label (peer-disabled styles)
            </Label>
          </Box>
          <Box className="flex items-center gap-3">
            <Switch id={switchId} disabled defaultChecked />
            <Label htmlFor={switchId} className="text-gray-900">
              Disabled switch label (peer-disabled styles)
            </Label>
          </Box>
        </Box>
      </LabelCanvas>
    );
  },
};

export const VariantsWithInput: Story = {
  render: () => (
    <LabelCanvas>
      <Box className="flex w-[420px] flex-col gap-5">
        <TextFieldDemo
          label="Default input"
          description="Base label and input styling."
          variant="default"
        />
        <TextFieldDemo
          label="Error input"
          description="Helpful for validation states."
          variant="error"
        />
        <TextFieldDemo
          label="Success input"
          description="Use when the field validates."
          variant="success"
        />
      </Box>
    </LabelCanvas>
  ),
};

export const FormLayout: Story = {
  render: () => {
    const firstNameId = useId();
    const lastNameId = useId();
    const emailId = useId();
    const marketingId = useId();

    return (
      <LabelCanvas>
        <Box className="flex w-[520px] flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <Box className="text-sm font-semibold text-gray-900">Policyholder details</Box>
          <Box className="grid grid-cols-2 gap-4">
            <Box className="flex flex-col gap-2">
              <Label htmlFor={firstNameId} className="text-gray-900">
                First name
              </Label>
              <Input id={firstNameId} placeholder="Jane" />
            </Box>
            <Box className="flex flex-col gap-2">
              <Label htmlFor={lastNameId} className="text-gray-900">
                Last name
              </Label>
              <Input id={lastNameId} placeholder="Doe" />
            </Box>
          </Box>
          <Box className="flex flex-col gap-2">
            <Label htmlFor={emailId} className="text-gray-900">
              Email
            </Label>
            <Input id={emailId} type="email" placeholder="jane.doe@example.com" />
          </Box>
          <Box className="flex items-start gap-3">
            <Checkbox id={marketingId} />
            <Box className="flex flex-col gap-1">
              <Label htmlFor={marketingId} className="text-gray-900">
                Product updates
              </Label>
              <Box className="text-xs text-gray-500">
                Send occasional emails about new coverage options.
              </Box>
            </Box>
          </Box>
        </Box>
      </LabelCanvas>
    );
  },
};

export const Playground: Story = {
  args: {
    children: 'Interactive label',
  },
  render: (args) => {
    const id = useId();
    const controlId = args.htmlFor ?? id;

    return (
      <LabelCanvas>
        <Box className="flex w-[380px] flex-col gap-2">
          <Label {...args} htmlFor={controlId} className={clsx('text-gray-900', args.className)} />
          <Input id={controlId} placeholder="Use controls to change the label" />
        </Box>
      </LabelCanvas>
    );
  },
};
