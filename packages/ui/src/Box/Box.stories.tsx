import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "./Box";

const baseCardClassName =
  "w-[340px] rounded-lg border border-gray-200 bg-white p-4 text-gray-900 shadow-sm";

const meta = {
  title: "Components/Box",
  component: Box,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      options: ["div", "section", "article", "button", "a", "span"],
      description: "Render Box as a different HTML element",
    },
    className: {
      control: "text",
      description: "Tailwind or custom classes",
    },
    children: {
      control: "text",
      description: "Box content",
    },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    as: "div",
    className: baseCardClassName,
    children: "Default Box rendered as a div.",
  },
};

export const AsSection: Story = {
  render: () => (
    <Box as="section" className={baseCardClassName} aria-label="Policy summary">
      <Box as="h3" className="text-base font-semibold">
        Policy Summary
      </Box>
      <Box as="p" className="mt-1 text-sm text-gray-600">
        Box can render semantic elements while keeping a consistent API.
      </Box>
    </Box>
  ),
};

export const AsArticle: Story = {
  render: () => (
    <Box as="article" className={baseCardClassName}>
      <Box as="header" className="text-sm font-medium text-gray-600">
        Article Header
      </Box>
      <Box as="p" className="mt-2 text-sm">
        Use Box as a lightweight layout primitive across different semantic tags.
      </Box>
    </Box>
  ),
};

export const AsButton: Story = {
  render: () => (
    <Box
      as="button"
      type="button"
      className="inline-flex items-center rounded-full border border-[var(--color-primary-20)] bg-[var(--color-primary-10)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary-80)] hover:bg-[var(--color-primary-20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
    >
      Clickable Box
    </Box>
  ),
};

export const AsLink: Story = {
  render: () => (
    <Box
      as="a"
      href="#"
      className="inline-flex items-center rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
    >
      Link Box
    </Box>
  ),
};

export const LayoutComposition: Story = {
  render: () => (
    <Box className="flex w-[520px] flex-col gap-3">
      <Box className={baseCardClassName}>
        <Box as="h3" className="text-base font-semibold">
          Claim Review
        </Box>
        <Box as="p" className="mt-1 text-sm text-gray-600">
          Compose layout and semantic structure without falling back to raw divs.
        </Box>
      </Box>
      <Box className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
        <Box as="span" className="text-sm font-medium">
          Status
        </Box>
        <Box className="inline-flex items-center rounded-full border border-[var(--color-primary-20)] bg-[var(--color-primary-10)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-primary-80)]">
          In Review
        </Box>
      </Box>
    </Box>
  ),
};

export const Playground: Story = {
  args: {
    as: "div",
    className: baseCardClassName,
    children: "Playground Box",
  },
};

