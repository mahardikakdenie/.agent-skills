import type { Meta, StoryObj } from "@storybook/react";
import {
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { clsx } from "clsx";
import { Box } from "../Box";
import { Button } from "../Button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./Select";

type SelectRootProps = ComponentPropsWithoutRef<typeof Select>;

type Option = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

const billingOptions: Option[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annual", label: "Annual (save 12%)" },
];

const coverageOptions: Option[] = [
  { value: "basic", label: "Basic coverage" },
  { value: "standard", label: "Standard coverage" },
  { value: "premium", label: "Premium coverage", disabled: true },
];

const roadsideOptions: Option[] = [
  { value: "none", label: "No roadside assistance" },
  { value: "standard", label: "Standard roadside assistance" },
  { value: "plus", label: "Roadside Plus", description: "Adds concierge towing" },
];

const locationOptions = [
  "Alabama",
  "Alaska",
  "Arizona",
  "California",
  "Colorado",
  "Connecticut",
  "Florida",
  "Georgia",
  "Illinois",
  "Maryland",
  "Minnesota",
  "New Jersey",
  "New York",
  "North Carolina",
  "Ohio",
  "Pennsylvania",
  "Texas",
  "Utah",
  "Virginia",
  "Washington",
];

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: "select",
      options: billingOptions.map((option) => option.value),
      description: "Initial selected value for uncontrolled usage",
    },
    disabled: {
      control: "boolean",
      description: "Disables the select trigger",
    },
    required: {
      control: "boolean",
      description: "Marks the field as required",
    },
    dir: {
      control: "inline-radio",
      options: ["ltr", "rtl"],
      description: "Reading direction",
    },
    onValueChange: {
      action: "valueChange",
      description: "Callback fired when the value changes",
    },
  },
  args: {
    disabled: false,
    required: false,
    dir: "ltr",
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

function SelectCanvas({ children }: { children: ReactNode }) {
  return (
    <Box className="flex min-h-[360px] min-w-[640px] items-center justify-center bg-white p-10">
      {children}
    </Box>
  );
}

type LabeledSelectProps = SelectRootProps & {
  label: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  triggerClassName?: string;
  children: ReactNode;
};

function LabeledSelect({
  label,
  description,
  placeholder,
  triggerClassName,
  children,
  required,
  ...props
}: LabeledSelectProps) {
  const generatedId = useId();
  const id = generatedId;

  return (
    <Box className="flex w-[320px] flex-col gap-2">
      <Box as="label" htmlFor={id} className="text-sm font-medium text-gray-900">
        {label}
        {required && (
          <Box as="span" className="ml-1 text-[var(--color-danger)]">
            *
          </Box>
        )}
      </Box>
      <Select {...props}>
        <SelectTrigger id={id} className={clsx("w-full", triggerClassName)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {children}
      </Select>
      {description && <Box className="text-xs text-gray-500">{description}</Box>}
    </Box>
  );
}

function renderOptions(options: Option[]) {
  return options.map((option) => (
    <SelectItem
      key={option.value}
      value={option.value}
      textValue={option.label}
      disabled={option.disabled}
    >
      <Box className="flex flex-col">
        <Box className="text-sm">{option.label}</Box>
        {option.description && (
          <Box className="text-xs text-gray-500">{option.description}</Box>
        )}
      </Box>
    </SelectItem>
  ));
}

export const Default: Story = {
  render: (args: SelectRootProps) => (
    <SelectCanvas>
      <LabeledSelect
        {...args}
        label="Billing cycle"
        description="Choose how often your premium is billed."
        placeholder="Select a cycle"
      >
        <SelectContent>{renderOptions(billingOptions)}</SelectContent>
      </LabeledSelect>
    </SelectCanvas>
  ),
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: "annual",
  },
  render: (args: SelectRootProps) => (
    <SelectCanvas>
      <LabeledSelect
        {...args}
        label="Payment cadence"
        description="Annual plans include a 12% savings."
        placeholder="Pick a cadence"
      >
        <SelectContent>{renderOptions(billingOptions)}</SelectContent>
      </LabeledSelect>
    </SelectCanvas>
  ),
};

export const GroupedOptions: Story = {
  render: (args: SelectRootProps) => (
    <SelectCanvas>
      <LabeledSelect
        {...args}
        label="Coverage tier"
        description="Premium tiers unlock concierge services."
        placeholder="Choose a tier"
      >
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Standard</SelectLabel>
            <SelectItem value="basic" textValue="Basic coverage">
              Basic coverage
            </SelectItem>
            <SelectItem value="standard" textValue="Standard coverage">
              Standard coverage
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Enhanced</SelectLabel>
            <SelectItem value="premium" textValue="Premium coverage">
              Premium coverage
            </SelectItem>
            <SelectItem value="elite" textValue="Elite coverage" disabled>
              Elite coverage (coming soon)
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </LabeledSelect>
    </SelectCanvas>
  ),
};

export const DisabledSelect: Story = {
  args: {
    disabled: true,
  },
  render: (args: SelectRootProps) => (
    <SelectCanvas>
      <LabeledSelect
        {...args}
        label="Roadside assistance"
        description="This option is locked on your current plan."
        placeholder="Select coverage"
      >
        <SelectContent>{renderOptions(roadsideOptions)}</SelectContent>
      </LabeledSelect>
    </SelectCanvas>
  ),
};

export const DisabledOptions: Story = {
  args: {
    defaultValue: "standard",
  },
  render: (args: SelectRootProps) => (
    <SelectCanvas>
      <LabeledSelect
        {...args}
        label="Coverage level"
        description="Premium is currently unavailable."
        placeholder="Select a level"
      >
        <SelectContent>{renderOptions(coverageOptions)}</SelectContent>
      </LabeledSelect>
    </SelectCanvas>
  ),
};

export const ScrollableOptions: Story = {
  render: (args: SelectRootProps) => (
    <SelectCanvas>
      <LabeledSelect
        {...args}
        label="Policy state"
        description="Use your garaging state for accurate pricing."
        placeholder="Select a state"
      >
        <SelectContent>
          {locationOptions.map((option) => (
            <SelectItem
              key={option}
              value={option.toLowerCase()}
              textValue={option}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </LabeledSelect>
    </SelectCanvas>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("monthly");

    return (
      <SelectCanvas>
        <Box className="flex w-[360px] flex-col gap-4">
          <LabeledSelect
            value={value}
            onValueChange={setValue}
            label="Billing cadence"
            description="Updates in real time as you choose."
            placeholder="Select cadence"
          >
            <SelectContent>{renderOptions(billingOptions)}</SelectContent>
          </LabeledSelect>
          <Box className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
            Selected value:{" "}
            <Box as="span" className="font-semibold text-gray-900">
              {value}
            </Box>
          </Box>
          <Box className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => setValue("monthly")}>
              Monthly
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setValue("quarterly")}>
              Quarterly
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setValue("annual")}>
              Annual
            </Button>
          </Box>
        </Box>
      </SelectCanvas>
    );
  },
};

export const Playground: Story = {
  args: {
    defaultValue: "monthly",
    disabled: false,
    required: false,
  },
  render: (args: SelectRootProps) => (
    <SelectCanvas>
      <LabeledSelect
        {...args}
        label="Interactive playground"
        description="Use controls to toggle props and defaults."
        placeholder="Select a cycle"
      >
        <SelectContent>{renderOptions(billingOptions)}</SelectContent>
      </LabeledSelect>
    </SelectCanvas>
  ),
};
