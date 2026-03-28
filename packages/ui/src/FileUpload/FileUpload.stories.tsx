import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { fn } from 'storybook/test';

import { FileUpload } from './FileUpload';
import type { FileUploadDisplayValue, FileUploadProps, FileUploadValue } from './FileUpload.types';

function createFile(name: string, type: string, bytes: number) {
  return new File([new Uint8Array(bytes)], name, { type });
}

const invoicePdf = createFile('invoice.pdf', 'application/pdf', 48 * 1024);
const claimPng = createFile('claim.png', 'image/png', 96 * 1024);

function ControlledStoryView({
  initialValue = null,
  initialDisplayValue = null,
  onChange,
  onClear,
  ...props
}: FileUploadProps & {
  initialValue?: FileUploadValue;
  initialDisplayValue?: FileUploadDisplayValue;
}) {
  const [selectedValue, setSelectedValue] = React.useState<FileUploadValue>(initialValue);
  const [selectedDisplayValue, setSelectedDisplayValue] =
    React.useState<FileUploadDisplayValue>(initialDisplayValue);

  return (
    <FileUpload
      {...props}
      value={selectedValue}
      displayValue={selectedDisplayValue}
      onChange={(nextValue) => {
        setSelectedValue(nextValue);
        if (nextValue) {
          setSelectedDisplayValue(null);
        }
        onChange?.(nextValue);
      }}
      onClear={() => {
        setSelectedValue(null);
        setSelectedDisplayValue(null);
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
    displayValue: {
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
          'Shared file-selection field shell with visible drag-and-drop affordance, additive multiple selection, selected-file list rendering, and generic max-size validation while upload transport stays local.',
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
          'Baseline single-file picker with a visible drag target, accepted-format badges, and an enterprise-style dropzone hierarchy.',
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
          'Shows additive multi-file behavior, where later picker selections and drag-drop intake append to the existing list instead of replacing it.',
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
        story:
          'Applies destructive field styling while keeping the upload target and validation feedback explicit during correction.',
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
        story:
          'Disables selection while preserving the visible field label, current guidance, and static dropzone layout.',
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
        story:
          'Shows the item-level remove action and the richer selected-file card treatment for an already chosen file.',
      },
    },
  },
};

export const ExistingFileLabel: Story = {
  args: {
    clearable: true,
  },
  render: (args) => (
    <ControlledStoryView {...args} initialDisplayValue="already-uploaded-proof.pdf" />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the generic externally supplied filename label contract for already-uploaded files while keeping file selection itself on the shared File-based API.',
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
        story:
          'Documents the shared generic max-size validation path for lightweight upload forms with the same drag-drop affordance.',
      },
    },
  },
};
