import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Search,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Phone,
  CreditCard,
} from "lucide-react";
import { Input } from "./Input";
import { Box } from "../Box";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "error", "success"],
      description: "The visual style variant of the input",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the input",
    },
    disabled: {
      control: "boolean",
      description: "Disables the input when true",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the input",
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "tel", "number", "url"],
      description: "The type of input",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic inputs
export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Type something here",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

// With left icons
export const WithSearchIcon: Story = {
  args: {
    placeholder: "Search...",
    leftIcon: <Search size={20} />,
  },
};

export const WithMailIcon: Story = {
  args: {
    type: "email",
    placeholder: "Enter your email",
    leftIcon: <Mail size={20} />,
  },
};

export const WithUserIcon: Story = {
  args: {
    placeholder: "Username",
    leftIcon: <User size={20} />,
  },
};

export const WithLockIcon: Story = {
  args: {
    type: "password",
    placeholder: "Password",
    leftIcon: <Lock size={20} />,
  },
};

export const WithPhoneIcon: Story = {
  args: {
    type: "tel",
    placeholder: "Phone number",
    leftIcon: <Phone size={20} />,
  },
};

// With right icons
export const WithRightIcon: Story = {
  args: {
    type: "password",
    placeholder: "Password",
    rightIcon: <Eye size={20} />,
  },
};

export const WithCreditCardIcon: Story = {
  args: {
    placeholder: "Card number",
    rightIcon: <CreditCard size={20} />,
  },
};

// Variants
export const ErrorVariant: Story = {
  args: {
    variant: "error",
    placeholder: "Invalid email",
    leftIcon: <Mail size={20} />,
  },
};

export const SuccessVariant: Story = {
  args: {
    variant: "success",
    placeholder: "Email verified",
    leftIcon: <Mail size={20} />,
  },
};

// Sizes
export const SmallSize: Story = {
  args: {
    size: "sm",
    placeholder: "Small input",
    leftIcon: <Search size={16} />,
  },
};

export const MediumSize: Story = {
  args: {
    size: "md",
    placeholder: "Medium input",
    leftIcon: <Search size={20} />,
  },
};

export const LargeSize: Story = {
  args: {
    size: "lg",
    placeholder: "Large input",
    leftIcon: <Search size={24} />,
  },
};

// Interactive playground
export const Playground: Story = {
  args: {
    variant: "default",
    size: "md",
    placeholder: "Type here...",
    leftIcon: <Search size={20} />,
  },
};

// Showcase all variants
export const AllVariants: Story = {
  render: () => (
    <Box className="flex w-80 flex-col gap-4">
      <Input placeholder="Default variant" leftIcon={<Search size={20} />} />
      <Input
        variant="error"
        placeholder="Error variant"
        leftIcon={<Mail size={20} />}
      />
      <Input
        variant="success"
        placeholder="Success variant"
        leftIcon={<User size={20} />}
      />
    </Box>
  ),
};

// Showcase all sizes
export const AllSizes: Story = {
  render: () => (
    <Box className="flex w-80 flex-col gap-4">
      <Input size="sm" placeholder="Small" leftIcon={<Search size={16} />} />
      <Input size="md" placeholder="Medium" leftIcon={<Search size={20} />} />
      <Input size="lg" placeholder="Large" leftIcon={<Search size={24} />} />
    </Box>
  ),
};

// Icon positions
export const IconPositions: Story = {
  render: () => (
    <Box className="flex w-80 flex-col gap-4">
      <Input placeholder="Left icon" leftIcon={<Search size={20} />} />
      <Input placeholder="Right icon" rightIcon={<Eye size={20} />} />
      <Input
        placeholder="Both icons"
        leftIcon={<Lock size={20} />}
        rightIcon={<EyeOff size={20} />}
      />
    </Box>
  ),
};

// Password with toggle visibility
export const PasswordWithToggle: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Box className="w-80">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          leftIcon={<Lock size={20} />}
          rightIcon={
            <Box as="button"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Box>
          }
        />
      </Box>
    );
  },
};

// Common use cases
export const CommonUseCases: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Box className="flex w-80 flex-col gap-4">
        <Input
          type="email"
          placeholder="Email address"
          leftIcon={<Mail size={20} />}
        />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          leftIcon={<Lock size={20} />}
          rightIcon={
            <Box as="button"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Box>
          }
        />
        <Input placeholder="Search" leftIcon={<Search size={20} />} />
        <Input
          type="tel"
          placeholder="Phone number"
          leftIcon={<Phone size={20} />}
        />
      </Box>
    );
  },
};

