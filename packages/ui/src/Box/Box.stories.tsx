import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';

import { Box } from './Box';

const meta = {
  title: 'Primitives/Box',
  component: Box,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`Box` is the foundational layout primitive. It renders any HTML element via the `as` prop and supports `asChild` for renderless composition. It has no visual opinions — all styling comes from `className`.',
      },
    },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Default — renders as div
// ---------------------------------------------------------------------------

export const Default: Story = {
  name: 'Default (div)',
  render: () => (
    <Box className="flex items-center gap-2 rounded-md border border-border p-4">
      <span>I am a</span>
      <code className="rounded bg-muted px-1 text-sm">&lt;div&gt;</code>
      <span>rendered via Box</span>
    </Box>
  ),
};

// ---------------------------------------------------------------------------
// As span
// ---------------------------------------------------------------------------

export const AsSpan: Story = {
  name: 'As span',
  render: () => (
    <p>
      This paragraph contains a{' '}
      <Box as="span" className="font-semibold text-primary">
        highlighted span
      </Box>{' '}
      rendered via Box.
    </p>
  ),
};

// ---------------------------------------------------------------------------
// As section
// ---------------------------------------------------------------------------

export const AsSection: Story = {
  name: 'As section',
  render: () => (
    <Box
      as="section"
      aria-labelledby="section-heading"
      className="rounded-lg border border-border p-6"
    >
      <h2 id="section-heading" className="text-lg font-semibold">
        Section Heading
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This is a <code>&lt;section&gt;</code> rendered via Box with correct semantic HTML and ARIA
        labelling.
      </p>
    </Box>
  ),
};

// ---------------------------------------------------------------------------
// As unordered list
// ---------------------------------------------------------------------------

export const AsUnorderedList: Story = {
  name: 'As ul + li',
  render: () => (
    <Box as="ul" className="list-disc space-y-1 pl-5">
      {['First item', 'Second item', 'Third item'].map((item) => (
        <Box key={item} as="li" className="text-sm">
          {item}
        </Box>
      ))}
    </Box>
  ),
};

// ---------------------------------------------------------------------------
// asChild — merges className onto child element, renders NO extra DOM node
// ---------------------------------------------------------------------------

export const AsChild: Story = {
  name: 'asChild (no extra DOM node)',
  render: () => (
    <Box
      asChild
      className="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
    >
      {/* Box renders no <div>. The <button> is the only DOM node. */}
      <button type="button">Button via asChild</button>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When `asChild={true}`, Box delegates rendering to the child element and merges all props onto it. Inspect the DOM — there is **no wrapping div**.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Ref forwarding — extracted to named component to satisfy hooks rules
// ---------------------------------------------------------------------------

function WithRefDemo() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Box ref={ref} className="rounded-md border border-border p-4 text-sm">
      <p>
        This Box has a <code>ref</code> forwarded to the underlying <code>&lt;div&gt;</code>. Open
        the browser console and run <code>window.__boxRef</code> to inspect after storybook mounts.
      </p>
    </Box>
  );
}

export const WithRef: Story = {
  name: 'With ref',
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

// ---------------------------------------------------------------------------
// Type-safety narrative (documentation story)
// ---------------------------------------------------------------------------

export const TypeSafetyDemo: Story = {
  name: 'Type safety (docs)',
  render: () => (
    <Box as="article" className="space-y-3 rounded-md border border-border p-4">
      <Box as="h3" className="font-semibold">
        Box is fully type-safe
      </Box>
      <Box as="p" className="text-sm text-muted-foreground">
        When you write <code className="rounded bg-muted px-1">{'<Box as="a" href="…">'}</code>,
        TypeScript knows <code>href</code> is valid for <code>&lt;a&gt;</code>.
      </Box>
      <Box as="p" className="text-sm text-muted-foreground">
        Writing <code className="rounded bg-muted px-1">{'<Box href="…">'}</code> (default div)
        produces a compile-time error — <code>href</code> is not a valid <code>&lt;div&gt;</code>{' '}
        attribute.
      </Box>
      <Box as="code" className="block rounded bg-muted p-2 text-xs">
        {'// ✅\n<Box as="a" href="/home">Home</Box>'}
        {'\n'}
        {'// ❌ TypeScript Error: href not valid on div\n<Box href="/home">Home</Box>'}
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "This story documents Box's type-safety guarantee. The TypeScript errors shown are compile-time — they do not appear at runtime.",
      },
    },
  },
};
