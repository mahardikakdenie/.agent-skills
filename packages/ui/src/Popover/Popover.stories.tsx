import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Button } from "../Button";
import { Box } from "../Box";
import { Input } from "../Input";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "./Popover";

type PopoverRootProps = ComponentPropsWithoutRef<typeof Popover>;
type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverContent>;

const meta = {
  title: "Components/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Whether the popover should be open on initial render",
    },
    modal: {
      control: "boolean",
      description: "When true, interaction outside is disabled while open",
    },
  },
  args: {
    defaultOpen: false,
    modal: false,
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

function PopoverCanvas({ children }: { children: ReactNode }) {
  return (
    <Box className="flex min-h-[260px] min-w-[520px] items-center justify-center p-16">
      {children}
    </Box>
  );
}

function renderBasicPopover(
  rootProps: PopoverRootProps,
  contentProps: PopoverContentProps = {},
) {
  const { children, ...restContentProps } = contentProps;

  const defaultContent = (
    <Box className="flex flex-col gap-2">
      <Box as="h4" className="text-sm font-semibold">
        Auto policy
      </Box>
      <Box className="text-sm text-gray-600">
        Coverage starts on March 1, 2026. Premium due in 5 days.
      </Box>
    </Box>
  );

  return (
    <PopoverCanvas>
      <Popover {...rootProps}>
        <PopoverTrigger asChild>
          <Button variant="secondary">Policy details</Button>
        </PopoverTrigger>
        <PopoverContent {...restContentProps}>
          {children ?? defaultContent}
        </PopoverContent>
      </Popover>
    </PopoverCanvas>
  );
}

export const Default: Story = {
  render: (args: PopoverRootProps) => renderBasicPopover(args),
};

export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args: PopoverRootProps) => renderBasicPopover(args),
};

export const WithArrow: Story = {
  render: (args: PopoverRootProps) =>
    renderBasicPopover(args, {
      sideOffset: 8,
      children: (
        <Box className="flex flex-col gap-3">
          <Box>
            <Box as="h4" className="text-sm font-semibold">
              Renewal reminder
            </Box>
            <Box className="text-sm text-gray-600">
              Your renewal window opens next week. Review your coverages early.
            </Box>
          </Box>
          <Button size="sm">Review coverages</Button>
          <PopoverArrow />
        </Box>
      ),
    }),
};

export const SideVariants: Story = {
  render: () => {
    const sides: PopoverContentProps["side"][] = [
      "top",
      "right",
      "bottom",
      "left",
    ];

    return (
      <PopoverCanvas>
        <Box className="grid grid-cols-2 gap-6">
          {sides.map((side) => (
            <Popover key={side}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-36">
                  Side: {side}
                </Button>
              </PopoverTrigger>
              <PopoverContent side={side} sideOffset={10}>
                <Box className="text-sm text-gray-700">
                  Positioned on the {side} side.
                </Box>
                <PopoverArrow />
              </PopoverContent>
            </Popover>
          ))}
        </Box>
      </PopoverCanvas>
    );
  },
};

export const AlignVariants: Story = {
  render: () => {
    const aligns: PopoverContentProps["align"][] = ["start", "center", "end"];

    return (
      <PopoverCanvas>
        <Box className="flex flex-col items-center gap-4">
          {aligns.map((align) => (
            <Popover key={align}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-44">
                  Align: {align}
                </Button>
              </PopoverTrigger>
              <PopoverContent align={align} sideOffset={8}>
                <Box className="text-sm text-gray-700">
                  Alignment set to {align}.
                </Box>
                <PopoverArrow />
              </PopoverContent>
            </Popover>
          ))}
        </Box>
      </PopoverCanvas>
    );
  },
};

export const RichContent: Story = {
  render: (args: PopoverRootProps) => (
    <PopoverCanvas>
      <Popover {...args}>
        <PopoverTrigger asChild>
          <Button>Update contact</Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={10} className="w-[360px]">
          <Box className="flex flex-col gap-4">
            <Box>
              <Box as="h4" className="text-sm font-semibold">
                Contact preferences
              </Box>
              <Box className="text-sm text-gray-600">
                Choose where we should send policy updates.
              </Box>
            </Box>
            <Box className="flex flex-col gap-2">
              <Box as="label" className="text-xs font-medium text-gray-600">
                Email
              </Box>
              <Input placeholder="name@example.com" />
            </Box>
            <Box className="flex flex-col gap-2">
              <Box as="label" className="text-xs font-medium text-gray-600">
                Phone
              </Box>
              <Input placeholder="(555) 123-4567" />
            </Box>
            <Box className="flex justify-end gap-2">
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
              <Button size="sm">Save</Button>
            </Box>
          </Box>
          <PopoverArrow />
        </PopoverContent>
      </Popover>
    </PopoverCanvas>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <PopoverCanvas>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="secondary">
              {open ? "Hide summary" : "Show summary"}
            </Button>
          </PopoverTrigger>
          <PopoverContent sideOffset={8}>
            <Box className="flex flex-col gap-3">
              <Box className="text-sm text-gray-700">
                Your roadside assistance add-on is active.
              </Box>
              <Box className="flex justify-end">
                <Button size="sm" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </Box>
            </Box>
            <PopoverArrow />
          </PopoverContent>
        </Popover>
      </PopoverCanvas>
    );
  },
};
