import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { expect, userEvent, within } from 'storybook/test';

import { Box } from '../Box';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './Form';

interface AccountFormValues {
  email: string;
  role: 'admin' | 'member';
  contacts: Array<{ value: string }>;
}

const meta = {
  title: 'Inputs/Form',
  component: Form,
  tags: ['autodocs'],
  args: {
    form: undefined as never,
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Shared React Hook Form composition layer for field labels, descriptions, and validation messaging.',
      },
    },
  },
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

function createDefaultValues(): AccountFormValues {
  return {
    email: '',
    role: 'member',
    contacts: [{ value: '' }],
  };
}

function FieldStoryView() {
  const form = useForm<AccountFormValues>({
    defaultValues: createDefaultValues(),
    mode: 'onTouched',
  });

  return (
    <Form form={form} onSubmit={form.handleSubmit(() => undefined)}>
      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Email address</FormLabel>
            <FormControl>
              <Input {...field} inputMode="email" placeholder="name@example.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}

function DescriptionStoryView() {
  const form = useForm<AccountFormValues>({
    defaultValues: createDefaultValues(),
  });

  return (
    <Form form={form} onSubmit={form.handleSubmit(() => undefined)}>
      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email address</FormLabel>
            <FormControl>
              <Input {...field} inputMode="email" placeholder="name@example.com" />
            </FormControl>
            <FormDescription>We use this address for security notices only.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}

function ErrorStoryView() {
  const form = useForm<AccountFormValues>({
    defaultValues: createDefaultValues(),
    mode: 'onTouched',
  });

  React.useEffect(() => {
    form.setError('email', {
      type: 'manual',
      message: 'Enter a valid email address.',
    });
  }, [form]);

  return (
    <Form form={form} onSubmit={form.handleSubmit(() => undefined)}>
      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email address</FormLabel>
            <FormControl>
              <Input {...field} inputMode="email" placeholder="name@example.com" />
            </FormControl>
            <FormDescription>The form wrapper owns the helper and error wiring.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}

function CustomControlStoryView() {
  const form = useForm<AccountFormValues>({
    defaultValues: createDefaultValues(),
  });

  return (
    <Form form={form} onSubmit={form.handleSubmit(() => undefined)}>
      <FormField
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Access role</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                options={[
                  { label: 'Admin', value: 'admin' },
                  { label: 'Member', value: 'member' },
                ]}
                placeholder="Select a role"
              />
            </FormControl>
            <FormDescription>Custom shared controls compose through FormControl.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}

function DisabledFieldStoryView() {
  const form = useForm<AccountFormValues>({
    defaultValues: {
      ...createDefaultValues(),
      email: 'disabled@example.com',
    },
  });

  return (
    <Form form={form} onSubmit={form.handleSubmit(() => undefined)}>
      <FormField
        name="email"
        disabled
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email address</FormLabel>
            <FormControl>
              <Input {...field} disabled inputMode="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}

function ArrayFieldStoryView() {
  const form = useForm<AccountFormValues>({
    defaultValues: createDefaultValues(),
    mode: 'onTouched',
  });
  const contacts = useFieldArray({
    control: form.control,
    name: 'contacts',
  });

  return (
    <Form form={form} onSubmit={form.handleSubmit(() => undefined)}>
      <Box className="grid gap-4">
        {contacts.fields.map((contact, index) => (
          <FormField
            key={contact.id}
            name={`contacts.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact {index + 1}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter a contact value" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Box className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => contacts.append({ value: '' })}
          >
            Add contact
          </Button>
          {contacts.fields.length > 1 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => contacts.remove(contacts.fields.length - 1)}
            >
              Remove last
            </Button>
          ) : null}
        </Box>
      </Box>
    </Form>
  );
}

function InteractiveStoryView() {
  const form = useForm<AccountFormValues>({
    defaultValues: createDefaultValues(),
    mode: 'onSubmit',
  });
  const [submittedValue, setSubmittedValue] = React.useState('');

  return (
    <Box className="grid gap-4">
      <Form
        form={form}
        onSubmit={form.handleSubmit((values) => {
          setSubmittedValue(values.email);
        })}
      >
        <FormField
          name="email"
          rules={{ required: 'Email is required.' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email address</FormLabel>
              <FormControl>
                <Input {...field} inputMode="email" placeholder="name@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save profile</Button>
      </Form>

      <Box as="p" aria-live="polite" className="text-sm text-muted-foreground">
        Submitted value: {submittedValue || 'none'}
      </Box>
    </Box>
  );
}

export const Field: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Basic field composition with a shared input and message slot.',
      },
    },
  },
  render: () => <FieldStoryView />,
};

export const Description: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Field description copy is linked through aria-describedby.',
      },
    },
  },
  render: () => <DescriptionStoryView />,
};

export const ErrorState: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Validation feedback updates label tone, inline message, and aria-invalid.',
      },
    },
  },
  render: () => <ErrorStoryView />,
};

export const CustomControl: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Custom shared controls such as Select compose through FormControl.',
      },
    },
  },
  render: () => <CustomControlStoryView />,
};

export const DisabledField: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Disabled controller state keeps label and control presentation aligned.',
      },
    },
  },
  render: () => <DisabledFieldStoryView />,
};

export const ArrayField: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Repeated fields pair useFieldArray with the shared FormField composition.',
      },
    },
  },
  render: () => <ArrayFieldStoryView />,
};

export const Interactive: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Interactive story submits the form and exposes the submitted value in the canvas.',
      },
    },
  },
  render: () => <InteractiveStoryView />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByLabelText(/email address/i);

    await userEvent.type(emailInput, 'person@example.com');
    await userEvent.click(canvas.getByRole('button', { name: /save profile/i }));

    await expect(canvas.getByText(/submitted value:/i)).toHaveTextContent('person@example.com');
  },
};

export const ResponsiveLayout: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Field composition remains readable at mobile viewport widths.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => <DescriptionStoryView />,
};
