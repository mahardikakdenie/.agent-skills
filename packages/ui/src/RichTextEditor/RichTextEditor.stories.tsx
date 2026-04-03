import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { fn } from 'storybook/test';

import { Box } from '../Box';
import { inputVariantValues } from '../Input/Input.types';
import { RichTextEditor } from './RichTextEditor';
import { richTextEditorToolbarModeValues, type RichTextEditorProps } from './RichTextEditor.types';

interface RichTextEditorStoryArgs extends RichTextEditorProps {
  initialValue?: string;
}

function StoryFrame({ children }: { children: React.ReactNode }) {
  return <Box className='mx-auto flex w-full max-w-4xl flex-col gap-4 p-4'>{children}</Box>;
}

function RichTextEditorStory({
  initialValue = '<p>Start with a short update.</p>',
  onChange,
  ...args
}: RichTextEditorStoryArgs) {
  const [value, setValue] = React.useState(initialValue);

  return (
    <StoryFrame>
      <RichTextEditor
        {...args}
        value={value}
        onChange={(nextValue) => {
          setValue(nextValue);
          onChange?.(nextValue);
        }}
      />
      <Box as='p' className='text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground'>
        Current HTML
      </Box>
      <Box
        as='pre'
        aria-label='Current HTML output'
        className='overflow-x-auto rounded-md border border-border bg-muted/30 p-3 text-xs text-foreground'
      >
        {value || '(empty)'}
      </Box>
    </StoryFrame>
  );
}

const meta = {
  title: 'Inputs/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
  args: {
    initialValue: '<p>Start with a short update.</p>',
    variant: 'outline',
    toolbar: 'default',
    readonly: false,
    sanitize: true,
    label: 'Update',
    helperText: 'Formatting stays within the shared safe HTML contract.',
    error: false,
    required: false,
    onChange: fn(),
  },
  argTypes: {
    value: {
      control: false,
    },
    defaultValue: {
      control: false,
    },
    initialValue: {
      control: 'text',
    },
    onChange: {
      action: 'changed',
    },
    onBlur: {
      action: 'blurred',
    },
    onFocus: {
      action: 'focused',
    },
    variant: {
      control: 'select',
      options: inputVariantValues,
    },
    toolbar: {
      control: 'select',
      options: richTextEditorToolbarModeValues,
    },
    readonly: {
      control: 'boolean',
    },
    sanitize: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
    className: {
      control: false,
    },
    id: {
      control: false,
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shared rich text editor built on Tiptap with a bounded toolbar surface, readonly mode, default sanitization, and Box-authored wrappers around the third-party editor DOM.',
      },
    },
  },
  render: (args: RichTextEditorStoryArgs) => <RichTextEditorStory {...args} />,
} satisfies Meta<RichTextEditorStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Baseline rich text editor with the default shared toolbar and HTML preview output.',
      },
    },
  },
};

export const Toolbar: Story = {
  render: () => (
    <Box className='grid gap-6 lg:grid-cols-2'>
      <RichTextEditorStory
        initialValue='<p>Use the full toolbar for longer updates.</p>'
        toolbar='default'
        label='Default toolbar'
        helperText='Headings, formatting, lists, quotes, code, and links stay enabled.'
      />
      <RichTextEditorStory
        initialValue='<p>Use the smaller toolbar for compact comment flows.</p>'
        toolbar='minimal'
        label='Minimal toolbar'
        helperText='Minimal mode keeps only the most common formatting actions.'
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Compares the default and minimal toolbar presets without widening the shared API into app-specific actions.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Box className='grid gap-6 lg:grid-cols-3'>
      {inputVariantValues.map((variant) => (
        <RichTextEditorStory
          key={variant}
          variant={variant}
          initialValue='<p>Field variant preview.</p>'
          label={variant.charAt(0).toUpperCase() + variant.slice(1)}
          helperText={`Rich text editor using the ${variant} field shell.`}
        />
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares the shared rich text editor field variants on the outer editor shell.',
      },
    },
  },
};

export const Readonly: Story = {
  args: {
    initialValue:
      '<h1>Read only summary</h1><p>This surface keeps formatting visible while the editor itself is non-editable.</p><ul><li>Readonly hides the toolbar</li><li>Sanitization remains enabled</li></ul>',
    readonly: true,
    label: 'Readonly summary',
    helperText: 'Readonly mode keeps the editor in a viewer-friendly shell.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the readonly presentation with the toolbar removed and editing disabled.',
      },
    },
  },
};

export const Sanitization: Story = {
  args: {
    initialValue:
      '<p onclick="alert(1)">Unsafe inline handler</p><script>alert(1)</script><p><a href="javascript:alert(1)">Untrusted link</a></p>',
    label: 'Sanitized input',
    helperText: 'Unsafe tags and attributes are stripped before the shared value is emitted.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the default sanitization boundary by starting from intentionally unsafe HTML.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    initialValue: '<p>Please provide more context for this update.</p>',
    error: 'Add at least one more sentence before saving.',
    label: 'Update',
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows inline validation treatment on the shared field shell.',
      },
    },
  },
};
