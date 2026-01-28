import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Box } from '../Box';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Input } from '../Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Select';
import { Textarea } from '../Textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './Form';

const meta = {
  title: 'Components/Forms/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

function FormCanvas({ children }: { children: React.ReactNode }) {
  return (
    <Box className="flex min-h-[560px] min-w-[760px] items-center justify-center bg-white p-10">
      {children}
    </Box>
  );
}

function FormCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Box className="flex w-[600px] flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Box className="space-y-1">
        <Box className="text-sm font-semibold text-gray-900">{title}</Box>
        {subtitle && <Box className="text-xs text-gray-500">{subtitle}</Box>}
      </Box>
      {children}
    </Box>
  );
}

type AnatomyValues = {
  email: string;
  nickname: string;
};

function FieldAnatomyForm() {
  const form = useForm<AnatomyValues>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      nickname: 'Jay',
    },
  });

  const email = useWatch({ control: form.control, name: 'email' });
  const hasEmail = Boolean(email && email.length > 3);
  const hasEmailError = Boolean(form.formState.errors.email);

  return (
    <Form {...form}>
      <FormCard
        title="Field anatomy"
        subtitle="Shows label, control, description, and messages working together."
      >
        <Box
          as="form"
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit(() => undefined)}
        >
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: 'Email is required.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address.',
              },
            }}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="jane.doe@example.com"
                    variant={fieldState.error ? 'error' : 'default'}
                    {...field}
                  />
                </FormControl>
                <FormDescription>We send updates about the status of this request.</FormDescription>
                <FormMessage>
                  {!hasEmailError && hasEmail ? 'Looks good — we can reach you.' : null}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred name</FormLabel>
                <FormControl>
                  <Input placeholder="Optional" {...field} />
                </FormControl>
                <FormDescription>Used in email responses and SMS.</FormDescription>
              </FormItem>
            )}
          />
          <Box className="flex items-center justify-end gap-3 pt-2">
            <Button type="submit">Save preferences</Button>
          </Box>
        </Box>
      </FormCard>
    </Form>
  );
}

type ValidationValues = {
  email: string;
  policyNumber: string;
};

function ValidationForm() {
  const form = useForm<ValidationValues>({
    mode: 'onBlur',
    defaultValues: {
      email: 'jane@',
      policyNumber: '',
    },
  });

  React.useEffect(() => {
    form.setError('email', {
      type: 'manual',
      message: 'Enter a valid email address.',
    });
    form.setError('policyNumber', {
      type: 'manual',
      message: 'Policy number is required.',
    });
  }, [form]);

  return (
    <Form {...form}>
      <FormCard
        title="Validation states"
        subtitle="Immediate error messaging with multiple fields."
      >
        <Box
          as="form"
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit(() => undefined)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" variant={fieldState.error ? 'error' : 'default'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="policyNumber"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Policy number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ABC-102938"
                    variant={fieldState.error ? 'error' : 'default'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Box className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" type="button">
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </Box>
        </Box>
      </FormCard>
    </Form>
  );
}

type CaseStudyValues = {
  firstName: string;
  lastName: string;
  email: string;
  policyType: string;
  details: string;
  updates: boolean;
};

function CaseStudyFormExample() {
  const form = useForm<CaseStudyValues>({
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      policyType: 'auto',
      details: '',
      updates: true,
    },
  });

  return (
    <Form {...form}>
      <FormCard
        title="Case study: end-to-end form"
        subtitle="Demonstrates sections, grid layout, select, textarea, and checkbox."
      >
        <Box
          as="form"
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(() => undefined)}
        >
          <Box className="space-y-4">
            <Box className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Policyholder
            </Box>
            <Box className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                rules={{ required: 'First name is required.' }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jane"
                        variant={fieldState.error ? 'error' : 'default'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                rules={{ required: 'Last name is required.' }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        variant={fieldState.error ? 'error' : 'default'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Box>
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: 'Email is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address.',
                },
              }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jane.doe@example.com"
                      variant={fieldState.error ? 'error' : 'default'}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>We will only use this for policy updates.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>

          <Box className="space-y-4">
            <Box className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Change details
            </Box>
            <FormField
              control={form.control}
              name="policyType"
              rules={{ required: 'Choose a policy type.' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select policy type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the line of business you want to update.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              rules={{ required: 'Share a brief summary of the request.' }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Request summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Example: update my deductible and add rental coverage."
                      variant={fieldState.error ? 'error' : 'default'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="updates"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      className="mt-1"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Box className="space-y-1">
                    <FormLabel>Send progress updates</FormLabel>
                    <FormDescription>
                      We will email you when we need more information.
                    </FormDescription>
                  </Box>
                </FormItem>
              )}
            />
          </Box>

          <Box className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" type="button">
              Save draft
            </Button>
            <Button type="submit">Submit request</Button>
          </Box>
        </Box>
      </FormCard>
    </Form>
  );
}

type InlineValues = {
  policyId: string;
  zipCode: string;
  claimType: string;
};

function InlineForm() {
  const form = useForm<InlineValues>({
    mode: 'onBlur',
    defaultValues: {
      policyId: '',
      zipCode: '',
      claimType: 'auto',
    },
  });

  return (
    <Form {...form}>
      <FormCard title="Quick intake layout" subtitle="Compact grid layout with inline actions.">
        <Box
          as="form"
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit(() => undefined)}
        >
          <Box className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="policyId"
              rules={{ required: 'Policy ID is required.' }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Policy ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="POL-23049"
                      variant={fieldState.error ? 'error' : 'default'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipCode"
              rules={{ required: 'ZIP code is required.' }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>ZIP code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="94107"
                      variant={fieldState.error ? 'error' : 'default'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <FormField
            control={form.control}
            name="claimType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Claim type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Box className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" type="button">
              Reset
            </Button>
            <Button type="submit">Start claim</Button>
          </Box>
        </Box>
      </FormCard>
    </Form>
  );
}

export const FieldAnatomy: Story = {
  render: () => (
    <FormCanvas>
      <FieldAnatomyForm />
    </FormCanvas>
  ),
};

export const ValidationStates: Story = {
  render: () => (
    <FormCanvas>
      <ValidationForm />
    </FormCanvas>
  ),
};

export const CaseStudyForm: Story = {
  render: () => (
    <FormCanvas>
      <CaseStudyFormExample />
    </FormCanvas>
  ),
};

export const InlineGridLayout: Story = {
  render: () => (
    <FormCanvas>
      <InlineForm />
    </FormCanvas>
  ),
};
