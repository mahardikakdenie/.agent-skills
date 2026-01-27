import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertOctagon,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
} from "lucide-react";
import type { ComponentType } from "react";
import { Alert, AlertDescription, AlertTitle, type AlertProps } from "./Alert";
import { Box } from "../Box";

type AlertVariant = NonNullable<AlertProps["variant"]>;

const variantIcons: Record<AlertVariant, ComponentType<{ className?: string }>> = {
  default: Bell,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertOctagon,
};

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "info", "success", "warning", "danger"],
      description: "The visual style variant of the alert",
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

function renderAlert(args: AlertProps, content: { title: string; description: string }) {
  const variant: AlertVariant = args.variant ?? "default";
  const Icon = variantIcons[variant];

  return (
    <Box className="w-[420px]">
      <Alert {...args}>
        <Icon />
        <AlertTitle>{content.title}</AlertTitle>
        <AlertDescription>{content.description}</AlertDescription>
      </Alert>
    </Box>
  );
}

export const Default: Story = {
  args: {
    variant: "default",
  },
  render: (args) =>
    renderAlert(args, {
      title: "Heads up",
      description: "This alert surfaces general information that does not require action.",
    }),
};

export const InfoVariant: Story = {
  args: {
    variant: "info",
  },
  render: (args) =>
    renderAlert(args, {
      title: "New feature available",
      description: "You can now filter results by policy status directly from the dashboard.",
    }),
};

export const SuccessVariant: Story = {
  args: {
    variant: "success",
  },
  render: (args) =>
    renderAlert(args, {
      title: "Changes saved",
      description: "Your policy updates have been stored successfully.",
    }),
};

export const WarningVariant: Story = {
  args: {
    variant: "warning",
  },
  render: (args) =>
    renderAlert(args, {
      title: "Action recommended",
      description: "Your billing details are about to expire. Please review them soon.",
    }),
};

export const DangerVariant: Story = {
  args: {
    variant: "danger",
  },
  render: (args) =>
    renderAlert(args, {
      title: "Payment failed",
      description: "We could not process your payment. Update your details and try again.",
    }),
};

export const WithoutIcon: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <Box className="w-[420px]">
      <Alert {...args}>
        <AlertTitle>Plain alert</AlertTitle>
        <AlertDescription>
          Use this version when the message is short and the icon would add noise.
        </AlertDescription>
      </Alert>
    </Box>
  ),
};

export const LongDescription: Story = {
  args: {
    variant: "info",
  },
  render: (args) =>
    renderAlert(args, {
      title: "Planned maintenance",
      description:
        "Scheduled maintenance will take place tonight between 11:00 PM and 1:00 AM UTC. During this window, some policy actions may be temporarily unavailable.",
    }),
};

export const Playground: Story = {
  args: {
    variant: "default",
  },
  render: (args) =>
    renderAlert(args, {
      title: "Playground alert",
      description: "Switch variants from the controls panel to preview different alert styles.",
    }),
};

export const AllVariants: Story = {
  render: () => {
    const variants: AlertVariant[] = [
      "default",
      "info",
      "success",
      "warning",
      "danger",
    ];

    const content: Record<AlertVariant, { title: string; description: string }> = {
      default: {
        title: "General notice",
        description: "This is the default alert variant.",
      },
      info: {
        title: "Informational update",
        description: "Use info for neutral, helpful context.",
      },
      success: {
        title: "Success",
        description: "Use success to confirm completed actions.",
      },
      warning: {
        title: "Warning",
        description: "Use warning when attention is needed soon.",
      },
      danger: {
        title: "Danger",
        description: "Use danger for errors or destructive states.",
      },
    };

    return (
      <Box className="flex w-[520px] flex-col gap-3">
        {variants.map((variant) => {
          const Icon = variantIcons[variant];
          const item = content[variant];

          return (
            <Alert key={variant} variant={variant}>
              <Icon />
              <AlertTitle>{item.title}</AlertTitle>
              <AlertDescription>{item.description}</AlertDescription>
            </Alert>
          );
        })}
      </Box>
    );
  },
};
