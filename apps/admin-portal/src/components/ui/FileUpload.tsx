'use client';

import { FileUpload as BaseFileUpload } from '@repo/ui';

type UploadFileValue = File | string | string[] | null;

interface UploadFileProps {
  accept?: string;
  placeholder?: string;
  className?: string;
  onChange?: (file: File | null) => void;
  onFileChange?: (data: {
    file: File | null;
    base64: string | null;
    fileName: string | null;
  }) => void;
  disabled?: boolean;
  label?: string;
  error?: string;
  value?: UploadFileValue;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export default function FileUpload({
  accept = '.png,.jpg,.jpeg,.pdf',
  placeholder: _placeholder,
  className = '',
  onChange = () => undefined,
  onFileChange = () => undefined,
  disabled = false,
  label,
  error,
  value = null,
}: UploadFileProps) {
  const fileValue = value instanceof File ? value : null;
  const displayValue = typeof value === 'string' || Array.isArray(value) ? value : null;

  const handleChange = async (nextValue: File | File[] | null) => {
    const file = nextValue instanceof File ? nextValue : null;

    if (!file) {
      onFileChange({ file: null, base64: null, fileName: null });
      onChange(null);
      return;
    }

    try {
      const base64 = await readFileAsDataUrl(file);
      onFileChange({ file, base64, fileName: file.name });
    } catch {
      onFileChange({ file, base64: null, fileName: file.name });
    }

    onChange(file);
  };

  return (
    <BaseFileUpload
      accept={accept}
      className={className}
      clearable
      disabled={disabled}
      displayValue={displayValue}
      error={error}
      label={label}
      onChange={handleChange}
      value={fileValue}
    />
  );
}
