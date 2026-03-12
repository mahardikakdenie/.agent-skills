import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { fn } from 'storybook/test';

import { Box } from '../Box';
import { FileUpload } from './FileUpload';
import type { FileUploadProps, FileUploadValue } from './FileUpload.types';

function createFile(name: string, type: string, bytes: number) {
  return new File([new Uint8Array(bytes)], name, { type });
}

const invoicePdf = createFile('invoice.pdf', 'application/pdf', 48 * 1024);
const claimPng = createFile('claim.png', 'image/png', 96 * 1024);

function ControlledStoryView({
  initialValue = null,
  onChange,
  onClear,
  ...props
}: FileUploadProps & { initialValue?: FileUploadValue }) {
  const [selectedValue, setSelectedValue] = React.useState<FileUploadValue>(initialValue);

  return (
    <FileUpload
      {...props}
      value={selectedValue}
      onChange={(nextValue) => {
        setSelectedValue(nextValue);
        onChange?.(nextValue);
      }}
      onClear={() => {
        setSelectedValue(null);
        onClear?.();
      }}
    />
  );
}

const meta = {
  title: 'Inputs/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  args: {
    label: 'Supporting documents',
    accept: '.pdf,.png,.jpg',
    multiple: false,
    disabled: false,
    maxSize: 5 * 1024 * 1024,
    error: false,
    clearable: false,
    onChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    label: {
      control: 'text',
    },
    accept: {
      control: 'text',
    },
    multiple: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    maxSize: {
      control: 'number',
    },
    error: {
      control: 'text',
    },
    clearable: {
      control: 'boolean',
    },
    value: {
      control: false,
    },
    onChange: {
      action: 'files changed',
    },
    onClear: {
      action: 'files cleared',
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shared file-selection field shell with optional selected-file list, item-level remove actions, additive multiple selection, and generic max-size validation.',
      },
    },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Baseline single-file picker with visible label, accepted-format hint, and tokenized dropzone shell.',
      },
    },
  },
};

export const MultipleFiles: Story = {
  args: {
    label: 'Claim attachments',
    multiple: true,
    clearable: true,
  },
  render: (args) => <ControlledStoryView {...args} initialValue={[invoicePdf, claimPng]} />,
  parameters: {
    docs: {
      description: {
        story:
          'Shows the additive multi-file list treatment, where later picks add more files instead of replacing the existing list.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    error: 'Please choose a PDF or PNG smaller than 5 MB.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Applies destructive field styling and accessible inline validation messaging.',
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disables selection while preserving the visible field label and static summary copy.',
      },
    },
  },
};

export const ClearableSelection: Story = {
  args: {
    clearable: true,
  },
  render: (args) => <ControlledStoryView {...args} initialValue={invoicePdf} />,
  parameters: {
    docs: {
      description: {
        story: 'Shows the item-level remove action when a single file has already been selected.',
      },
    },
  },
};

export const MaxSizeValidation: Story = {
  args: {
    accept: '.csv',
    label: 'Import file',
    maxSize: 1024,
  },
  parameters: {
    docs: {
      description: {
        story: 'Documents the shared generic max-size validation path for lightweight upload forms.',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  args: {
    accept: '.pdf,.png',
  },
  render: (args) => (
    <Box className="max-w-xs">
      <ControlledStoryView {...args} />
    </Box>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Confirms the additive selection shell and item-level file actions remain readable in a narrow mobile container.',
      },
    },
  },
};
