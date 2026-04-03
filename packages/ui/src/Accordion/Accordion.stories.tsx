import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { fn } from 'storybook/test';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { Button } from '../Button';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from './Accordion';
import type {
  AccordionMultipleProps,
  AccordionProps,
  AccordionSingleProps,
} from './Accordion.types';
import { accordionTypeValues } from './Accordion.types';

interface StoryAccordionItem {
  value: string;
  title: string;
  description: string;
  note: string;
  disabled?: boolean;
}

const defaultItems: StoryAccordionItem[] = [
  {
    value: 'coverage-details',
    title: 'Coverage details',
    description: 'Protects inpatient and outpatient care for approved facilities.',
    note: 'Updated after the next billing cycle closes.',
  },
  {
    value: 'payment-schedule',
    title: 'Payment schedule',
    description: 'Monthly installments debit on the 5th and 20th of each month.',
    note: 'Late payments pause benefit activation until settlement is complete.',
  },
  {
    value: 'required-documents',
    title: 'Required documents',
    description: 'Upload policyholder ID, payment slip, and supporting medical files.',
    note: 'Accepted formats: PDF, JPG, and PNG.',
  },
];

const disabledItems: StoryAccordionItem[] = [
  defaultItems[0]!,
  {
    ...defaultItems[1]!,
    disabled: true,
  },
  defaultItems[2]!,
];

function StoryBody({ item }: { item: StoryAccordionItem }) {
  return (
    <Box className="grid gap-3">
      <Box as="p">{item.description}</Box>
      <Box className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-foreground">
        {item.note}
      </Box>
      <Box className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline">
          Review
        </Button>
        <Button type="button" size="sm">
          Continue
        </Button>
      </Box>
    </Box>
  );
}

function AccordionStoryFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <Box className={cn('mx-auto w-full max-w-3xl', className)}>{children}</Box>;
}

function AccordionExample({ items, ...props }: { items: StoryAccordionItem[] } & AccordionProps) {
  if (props.type === 'multiple') {
    const { type, defaultValue, value, onValueChange, variant, className } =
      props as AccordionMultipleProps;

    return (
      <Accordion
        type={type}
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
        variant={variant}
        className={className}
      >
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value} disabled={item.disabled}>
            <AccordionHeader>
              <AccordionTrigger>{item.title}</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <StoryBody item={item} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  const {
    type = 'single',
    collapsible = true,
    defaultValue,
    value,
    onValueChange,
    variant,
    className,
  } = props as AccordionSingleProps;

  return (
    <Accordion
      type={type}
      collapsible={collapsible}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      variant={variant}
      className={className}
    >
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value} disabled={item.disabled}>
          <AccordionHeader>
            <AccordionTrigger>{item.title}</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <StoryBody item={item} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function ControlledAccordionExample({ items }: { items: StoryAccordionItem[] }) {
  const [value, setValue] = React.useState(items[0]?.value ?? '');

  return (
    <Box className="grid gap-3">
      <Box
        as="p"
        className="text-sm text-muted-foreground"
      >{`Open section: ${value || 'none'}`}</Box>
      <AccordionExample
        type="single"
        collapsible
        value={value}
        onValueChange={(nextValue) => setValue(nextValue as string)}
        items={items}
      />
    </Box>
  );
}

const meta = {
  title: 'Data Display/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: {
    type: 'single',
    collapsible: true,
    variant: 'outline',
    defaultValue: defaultItems[0]!.value,
    onValueChange: fn(),
  },
  argTypes: {
    type: {
      control: 'select',
      options: accordionTypeValues,
    },
    collapsible: {
      control: 'boolean',
    },
    variant: {
      control: 'select',
      options: ['outline', 'shadow'],
    },
    value: {
      control: false,
    },
    defaultValue: {
      control: 'select',
      options: ['', ...defaultItems.map((item) => item.value)],
    },
    onValueChange: {
      action: 'value changed',
    },
    children: {
      control: false,
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shared inline disclosure pattern built on Radix Accordion with compound children composition, Box-authored structure, and single or multiple expansion modes.',
      },
    },
  },
  render: (args: AccordionProps) => (
    <AccordionStoryFrame>
      <AccordionExample {...args} items={defaultItems} />
    </AccordionStoryFrame>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Baseline single-mode accordion with the first section expanded and consumer-owned content inside each panel.',
      },
    },
  },
};

export const MultipleMode: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['coverage-details', 'required-documents'],
  },
  render: (args) => (
    <AccordionStoryFrame>
      <AccordionExample {...args} items={defaultItems} />
    </AccordionStoryFrame>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Allows several sections to remain open together for stacked detail review.',
      },
    },
  },
};

export const DisabledItem: Story = {
  args: {
    type: 'single',
    defaultValue: defaultItems[0]!.value,
  },
  render: (args) => (
    <AccordionStoryFrame>
      <AccordionExample {...args} items={disabledItems} />
    </AccordionStoryFrame>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows a disabled disclosure row that stays visible but cannot be activated.',
      },
    },
  },
};

export const ControlledMode: Story = {
  render: () => (
    <AccordionStoryFrame>
      <ControlledAccordionExample items={defaultItems} />
    </AccordionStoryFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Mirrors the controlled value outside the accordion so consumers can coordinate surrounding UI when the active section changes.',
      },
    },
  },
};

export const ShadowVariant: Story = {
  args: {
    variant: 'shadow',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Applies the shared `shadow` surface variant to the actual accordion item containers.',
      },
    },
  },
};
