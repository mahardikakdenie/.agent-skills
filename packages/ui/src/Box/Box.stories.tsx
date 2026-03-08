import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';

import { Box } from './Box';

const meta = {
  title: 'Primitives/Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    container: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    centered: {
      control: 'boolean',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          '`Box` is the foundational layout primitive. It renders any HTML element via the `as` prop, supports `asChild` for renderless composition, and exposes a narrow set of migration-safe layout presets: `padding`, `container`, and `centered`.',
      },
    },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Box
      as="section"
      aria-labelledby="box-default-heading"
      className="space-y-2 rounded-lg border border-border p-4"
    >
      <Box as="h2" id="box-default-heading" className="text-lg font-semibold">
        Default Box
      </Box>
      <Box as="p" className="text-sm text-muted-foreground">
        Renders semantic HTML directly while staying fully polymorphic and type-safe.
      </Box>
    </Box>
  ),
};

export const Padding: Story = {
  render: () => (
    <Box className="space-y-4 rounded-lg border border-dashed border-border p-4">
      {(['sm', 'md', 'lg'] as const).map((preset) => (
        <Box key={preset} className="space-y-2 rounded-md border border-border py-3" padding={preset}>
          <Box as="p" className="text-sm font-medium">
            <code>padding=&quot;{preset}&quot;</code>
          </Box>
          <Box className="rounded bg-muted py-2 text-center text-xs text-muted-foreground">
            Shared shell spacing preset
          </Box>
        </Box>
      ))}
    </Box>
  ),
};

export const Container: Story = {
  render: () => (
    <Box className="space-y-4 rounded-lg border border-dashed border-border p-4">
      {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((preset) => (
        <Box key={preset} className="rounded bg-muted/40 py-3" container={preset} padding="sm">
          <Box className="rounded border border-border bg-background py-3 text-center text-xs font-medium">
            <code>container=&quot;{preset}&quot;</code>
          </Box>
        </Box>
      ))}
    </Box>
  ),
};

export const Centered: Story = {
  render: () => (
    <Box
      centered
      className="min-h-48 rounded-lg border border-border bg-muted/40 p-4 text-center text-sm"
    >
      <Box className="rounded-md bg-background px-4 py-3 shadow-sm">
        Children are centered with a minimal flex preset.
      </Box>
    </Box>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Box
      asChild
      className="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
    >
      <button type="button">Button via asChild</button>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When `asChild={true}`, Box delegates rendering to the child element and merges all props onto it. Inspect the DOM — there is no wrapping div.',
      },
    },
  },
};

function WithRefDemo() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Box ref={ref} className="rounded-md border border-border p-4 text-sm">
      <p>
        This Box has a <code>ref</code> forwarded to the underlying <code>&lt;div&gt;</code>. Open
        the browser console and run <code>window.__boxRef</code> to inspect after Storybook mounts.
      </p>
    </Box>
  );
}

export const WithRef: Story = {
  render: () => <WithRefDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Box forwards `ref` to the underlying element. When `as="div"` (default) the ref type is `React.RefObject<HTMLDivElement>`.',
      },
    },
  },
};

export const TypeSafetyDemo: Story = {
  render: () => (
    <Box as="article" className="space-y-3 rounded-md border border-border p-4">
      <Box as="h3" className="font-semibold">
        Box is fully type-safe
      </Box>
      <Box as="p" className="text-sm text-muted-foreground">
        When you write <code className="rounded bg-muted px-1">{'<Box as="a" href="/home">'}</code>,
        TypeScript knows <code>href</code> is valid for <code>&lt;a&gt;</code>.
      </Box>
      <Box as="p" className="text-sm text-muted-foreground">
        Writing <code className="rounded bg-muted px-1">{'<Box href="/home">'}</code> (default div)
        produces a compile-time error — <code>href</code> is not a valid <code>&lt;div&gt;</code>{' '}
        attribute.
      </Box>
      <Box as="code" className="block rounded bg-muted p-2 text-xs">
        {'// valid\n<Box as="a" href="/home">Home</Box>'}
        {'\n'}
        {'// TypeScript error: href not valid on div\n<Box href="/home">Home</Box>'}
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "This story documents Box's type-safety guarantee. The TypeScript errors shown are compile-time and do not appear at runtime.",
      },
    },
  },
};
