import type { Meta, StoryObj } from '@storybook/react';
import { ChevronRight, FileText, Folder, Home, Settings, Slash } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { Box } from '../Box';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  type BreadcrumbProps,
} from './Breadcrumb';

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Optional className applied to the breadcrumb nav',
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

const StoryAnchor = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>((props, ref) => (
  <Box as="a" ref={ref} {...props} />
));
StoryAnchor.displayName = 'StoryAnchor';

function renderBreadcrumb(args: BreadcrumbProps, content: React.ReactNode) {
  return (
    <Box className="w-[720px]">
      <Breadcrumb {...args}>{content}</Breadcrumb>
    </Box>
  );
}

export const Default: Story = {
  args: {},
  render: (args) =>
    renderBreadcrumb(
      args,
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Policies</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Auto Policy</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>,
    ),
};

export const WithIcons: Story = {
  args: {},
  render: (args) =>
    renderBreadcrumb(
      args,
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#" className="flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5" />
            <Box as="span">Home</Box>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#" className="flex items-center gap-1.5">
            <Folder className="h-3.5 w-3.5" />
            <Box as="span">Documents</Box>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            <Box as="span">Policy Overview</Box>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>,
    ),
};

export const CustomSeparator: Story = {
  args: {},
  render: (args) =>
    renderBreadcrumb(
      {
        ...args,
        separator: <Slash className="h-3.5 w-3.5" />,
      },
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Account</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Billing</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>,
    ),
};

export const CollapsedWithEllipsis: Story = {
  args: {},
  render: (args) =>
    renderBreadcrumb(
      args,
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Account</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-1.5">
            <Settings className="h-3.5 w-3.5" />
            <Box as="span">Preferences</Box>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>,
    ),
};

export const LongLabels: Story = {
  args: {},
  render: (args) =>
    renderBreadcrumb(
      args,
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-3.5 w-3.5" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Policies And Documents</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-3.5 w-3.5" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>
            Comprehensive Insurance Policy Documentation With Very Long Title
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>,
    ),
};

export const AsChildLink: Story = {
  args: {},
  render: (args) =>
    renderBreadcrumb(
      args,
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <StoryAnchor href="#" className="text-[var(--color-primary)]">
              Home
            </StoryAnchor>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <StoryAnchor href="#">Account</StoryAnchor>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Security</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>,
    ),
};

export const Playground: Story = {
  args: {
    className: '',
  },
  render: (args) =>
    renderBreadcrumb(
      args,
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Section</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Current Page</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>,
    ),
};
