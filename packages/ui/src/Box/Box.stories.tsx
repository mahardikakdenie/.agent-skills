import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';

import { Box } from './Box';

const meta = {
  title: 'Misc/Box',
  component: Box,
  tags: ['autodocs'],
  args: {
    as: 'div',
    asChild: false,
    padding: 'none',
    centered: false,
  },
  argTypes: {
    as: {
      control: 'text',
    },
    asChild: {
      control: 'boolean',
    },
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
    className: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`Box` is the foundational layout primitive and the authored DOM primitive for shared source.',
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
        Routes semantic output through Box while staying fully polymorphic and type-safe.
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Routes semantic output through Box and keeps the wrapper app-agnostic.',
      },
    },
  },
};

export const Padding: Story = {
  render: () => (
    <Box className="space-y-4 rounded-lg border border-dashed border-border p-4">
      {(['sm', 'md', 'lg'] as const).map((preset) => (
        <Box
          key={preset}
          className="space-y-2 rounded-md border border-border py-3"
          padding={preset}
        >
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
  parameters: {
    docs: {
      description: {
        story: 'Shows the shared horizontal padding presets used by migrated body wrappers.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          'Compares the approved max-width container presets without introducing app-specific shells.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Applies the generic centering preset for empty or placeholder wrappers.',
      },
    },
  },
};

export const SemanticElements: Story = {
  render: () => (
    <Box
      as="article"
      aria-labelledby="semantic-elements-heading"
      className="space-y-3 rounded-lg border border-border p-4"
    >
      <Box as="h3" id="semantic-elements-heading" className="text-base font-semibold">
        Semantic structure stays explicit
      </Box>
      <Box as="p" className="text-sm text-muted-foreground">
        `Box` should preserve semantic HTML choices instead of hiding them behind app-specific
        wrappers.
      </Box>
      <Box as="ul" className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        <Box as="li">Use `main` or `section` for landmark structure.</Box>
        <Box as="li">Use `ul` and `li` for real list content.</Box>
        <Box as="li">Use `span` only for inline semantics.</Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates semantic element selection, which remains the caller responsibility.',
      },
    },
  },
};

export const AsChild: Story = {
  render: () => (
    <Box
      asChild
      className="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
    >
      <Box as="button" type="button">
        Button via asChild
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Composes onto a single child element and keeps authored JSX on Box rather than adding an extra wrapper.',
      },
    },
  },
};

function RefForwardingDemo() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Box ref={ref} className="rounded-md border border-border p-4 text-sm">
      <Box as="p">
        This Box has a <code>ref</code> forwarded to the underlying semantic target.
      </Box>
    </Box>
  );
}

export const RefForwarding: Story = {
  render: () => <RefForwardingDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Confirms the forwarded ref resolves to the rendered element when `asChild` is not used.',
      },
    },
  },
};


