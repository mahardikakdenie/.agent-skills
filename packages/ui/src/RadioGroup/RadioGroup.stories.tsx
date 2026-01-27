import type { Meta, StoryObj } from "@storybook/react";
import { clsx } from "clsx";
import {
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { Box } from "../Box";
import { Button } from "../Button";
import {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupItemProps,
} from "./RadioGroup";

type RadioGroupRootProps = ComponentPropsWithoutRef<typeof RadioGroup>;

type Option = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

type RadioOptionProps = RadioGroupItemProps &
  Option & {
    containerClassName?: string;
    labelClassName?: string;
    id?: string;
  };

const radioSizes = ["sm", "md", "lg"] as const;

const billingOptions: Option[] = [
  {
    value: "monthly",
    label: "Monthly",
    description: "Lower upfront cost with more frequent payments.",
  },
  {
    value: "quarterly",
    label: "Quarterly",
    description: "A balanced option for budgeting.",
  },
  {
    value: "annual",
    label: "Annual (save 12%)",
    description: "Pay once and lock in the best available rate.",
  },
];

const coverageOptions: Option[] = [
  {
    value: "basic",
    label: "Basic coverage",
    description: "Meets state minimums and core protections.",
  },
  {
    value: "standard",
    label: "Standard coverage",
    description: "Adds collision and comprehensive protection.",
  },
  {
    value: "premium",
    label: "Premium coverage",
    description: "Includes concierge claims support and rental upgrades.",
    disabled: true,
  },
];

const cancellationOptions: Option[] = [
  {
    value: "switching",
    label: "I'm switching providers",
    description: "You already have another policy lined up.",
  },
  {
    value: "too-expensive",
    label: "It's too expensive",
    description: "You're looking for a lower premium right now.",
  },
  {
    value: "sold-vehicle",
    label: "I sold the vehicle",
    description: "The insured vehicle is no longer in your name.",
  },
];

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: "select",
      options: coverageOptions.map((option) => option.value),
      description: "Initial selected value for uncontrolled usage",
    },
    value: {
      control: "select",
      options: coverageOptions.map((option) => option.value),
      description: "Controlled selected value",
    },
    dir: {
      control: "inline-radio",
      options: ["ltr", "rtl"],
      description: "Reading direction",
    },
    disabled: {
      control: "boolean",
      description: "Disables all options",
    },
    required: {
      control: "boolean",
      description: "Marks the group as required",
    },
    loop: {
      control: "boolean",
      description: "Whether keyboard navigation loops at the ends",
    },
    onValueChange: {
      action: "valueChange",
      description: "Callback fired when selection changes",
    },
  },
  args: {
    defaultValue: "standard",
    dir: "ltr",
    disabled: false,
    required: false,
    loop: true,
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

function RadioCanvas({ children }: { children: ReactNode }) {
  return (
    <Box className="flex min-h-[360px] min-w-[680px] items-center justify-center bg-white p-10">
      {children}
    </Box>
  );
}

function RadioOption({
  value,
  label,
  description,
  containerClassName,
  labelClassName,
  className,
  id: idProp,
  ...props
}: RadioOptionProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <Box
      as="label"
      htmlFor={id}
      className={clsx("flex items-start gap-3 text-sm text-gray-700", containerClassName)}
    >
      <RadioGroupItem id={id} value={value} className={clsx("mt-0.5", className)} {...props} />
      <Box className="flex flex-col gap-1">
        <Box as="span" className={clsx("font-medium text-gray-900", labelClassName)}>
          {label}
        </Box>
        {description && <Box className="text-xs text-gray-500">{description}</Box>}
      </Box>
    </Box>
  );
}

type RadioFieldsetProps = RadioGroupRootProps & {
  legend: ReactNode;
  description?: ReactNode;
  options: Option[];
  groupClassName?: string;
  itemProps?: Partial<RadioGroupItemProps>;
  defaultValueStrategy?: "first" | "none";
};

function RadioFieldset({
  legend,
  description,
  options,
  groupClassName,
  itemProps,
  required,
  defaultValue,
  defaultValueStrategy = "first",
  value,
  className: rootClassName,
  ...rootProps
}: RadioFieldsetProps) {
  const legendId = useId();
  const shouldFallbackToFirst = defaultValueStrategy !== "none";
  const resolvedDefaultValue =
    defaultValue ?? (shouldFallbackToFirst ? options[0]?.value : undefined);
  const defaultValueProp = value === undefined ? resolvedDefaultValue : undefined;

  return (
    <Box
      as="fieldset"
      className="flex w-[460px] flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <Box as="legend" id={legendId} className="text-sm font-semibold text-gray-900">
        {legend}
        {required && <Box as="span" className="ml-1 text-[var(--color-danger)]">*</Box>}
      </Box>
      {description && <Box className="text-xs text-gray-500">{description}</Box>}

      <RadioGroup
        aria-labelledby={legendId}
        defaultValue={defaultValueProp}
        value={value}
        required={required}
        className={clsx("mt-1", groupClassName, rootClassName)}
        {...rootProps}
      >
        {options.map((option) => (
          <RadioOption
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            {...itemProps}
          />
        ))}
      </RadioGroup>
    </Box>
  );
}

export const Default: Story = {
  render: (args: RadioGroupRootProps) => (
    <RadioCanvas>
      <RadioFieldset
        {...args}
        legend="Coverage level"
        description="Choose the tier that best fits your risk tolerance."
        options={coverageOptions}
      />
    </RadioCanvas>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string>("standard");

    return (
      <RadioCanvas>
        <Box className="flex w-[520px] flex-col gap-4">
          <RadioFieldset
            legend="Coverage level"
            description="This story keeps selection in React state."
            options={coverageOptions}
            value={value}
            onValueChange={setValue}
            defaultValueStrategy="none"
          />
          <Box className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
            Selected: <Box as="span" className="font-semibold text-gray-900">{value}</Box>
          </Box>
          <Box className="flex flex-wrap gap-2">
            {coverageOptions.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant="secondary"
                onClick={() => setValue(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </Box>
      </RadioCanvas>
    );
  },
};

export const DisabledOptions: Story = {
  render: (args: RadioGroupRootProps) => (
    <RadioCanvas>
      <RadioFieldset
        {...args}
        legend="Coverage level"
        description="Premium is temporarily unavailable."
        options={coverageOptions}
        defaultValue="basic"
      />
    </RadioCanvas>
  ),
};

export const DisabledGroup: Story = {
  args: {
    disabled: true,
  },
  render: (args: RadioGroupRootProps) => (
    <RadioCanvas>
      <RadioFieldset
        {...args}
        legend="Billing cycle"
        description="This group is disabled for the current policy term."
        options={billingOptions}
        defaultValue="monthly"
      />
    </RadioCanvas>
  ),
};

export const Variants: Story = {
  render: (args: RadioGroupRootProps) => (
    <RadioCanvas>
      <Box className="grid w-[960px] grid-cols-2 gap-6">
        <RadioFieldset
          {...args}
          legend="Standard selection"
          description="Use the default variant for most choices."
          options={coverageOptions}
          defaultValue="standard"
          itemProps={{ variant: "default" }}
        />
        <RadioFieldset
          {...args}
          legend="Cancellation reason"
          description="Use the danger variant for destructive flows."
          options={cancellationOptions}
          defaultValue="too-expensive"
          itemProps={{ variant: "danger" }}
        />
      </Box>
    </RadioCanvas>
  ),
};

export const Sizes: Story = {
  render: (args: RadioGroupRootProps) => (
    <RadioCanvas>
      <Box className="flex w-[520px] flex-col gap-4">
        {radioSizes.map((size) => (
          <RadioFieldset
            key={size}
            {...args}
            legend={`${size.toUpperCase()} radios`}
            description="Sizing can improve density or touch targets."
            options={coverageOptions}
            defaultValue="standard"
            itemProps={{ size }}
          />
        ))}
      </Box>
    </RadioCanvas>
  ),
};

export const Required: Story = {
  args: {
    required: true,
    defaultValue: undefined,
  },
  render: (args: RadioGroupRootProps) => (
    <RadioCanvas>
      <RadioFieldset
        {...args}
        legend="Primary payment method"
        description="A required radio group should clearly indicate the obligation."
        options={billingOptions}
        defaultValueStrategy="none"
      />
    </RadioCanvas>
  ),
};

export const Playground: Story = {
  args: {
    defaultValue: "standard",
    disabled: false,
    required: false,
  },
  render: (args: RadioGroupRootProps) => (
    <RadioCanvas>
      <RadioFieldset
        {...args}
        legend="Interactive playground"
        description="Use Storybook controls to explore props and states."
        options={coverageOptions}
      />
    </RadioCanvas>
  ),
};


