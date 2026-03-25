import { FileText, Upload, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { Label } from '../Label';
import type { FileUploadProps, FileUploadValue } from './FileUpload.types';
import {
  fileUploadActionButtonVariants,
  fileUploadBodyVariants,
  fileUploadControlVariants,
  fileUploadDropzoneVariants,
  fileUploadFieldVariants,
  fileUploadFileBodyVariants,
  fileUploadFileIconVariants,
  fileUploadFileMetaVariants,
  fileUploadFileNameVariants,
  fileUploadIconVariants,
  fileUploadInputVariants,
  fileUploadListItemVariants,
  fileUploadListVariants,
  fileUploadMessageVariants,
  fileUploadPresentationVariants,
  fileUploadSummaryVariants,
  fileUploadTitleVariants,
} from './FileUpload.variants';

function normalizeFileUploadValue(value: FileUploadValue | undefined): File[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function resolveFileUploadChangeValue(files: File[], multiple: boolean): FileUploadValue {
  if (files.length === 0) {
    return null;
  }

  return multiple ? files : (files[0] ?? null);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatAcceptLabel(accept: string): string {
  return accept
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => token.replace(/^\./, '').toUpperCase())
    .join(', ');
}

function getFileIdentity(file: File): string {
  return `${file.name}-${file.lastModified}-${file.size}`;
}

function mergeSequentialFiles(existingFiles: File[], incomingFiles: File[]): File[] {
  const mergedFiles = [...existingFiles];
  const seenFiles = new Set(existingFiles.map(getFileIdentity));

  for (const file of incomingFiles) {
    const identity = getFileIdentity(file);

    if (seenFiles.has(identity)) {
      continue;
    }

    seenFiles.add(identity);
    mergedFiles.push(file);
  }

  return mergedFiles;
}

function containsDraggedFiles(dataTransfer: DataTransfer | null | undefined): boolean {
  if (!dataTransfer) {
    return false;
  }

  return Array.from(dataTransfer.types ?? []).includes('Files');
}

function getSelectionTitle({
  dragActive,
  files,
  multiple,
}: {
  dragActive: boolean;
  files: File[];
  multiple: boolean;
}): string {
  if (dragActive) {
    if (multiple) {
      return files.length > 0 ? 'Drop files to add' : 'Drop files to upload';
    }

    return files.length > 0 ? 'Drop file to replace' : 'Drop file to upload';
  }

  if (files.length === 0) {
    return multiple ? 'Drag and drop files here' : 'Drag and drop a file here';
  }

  return multiple ? 'Add more files' : 'Replace file';
}

function getSelectionSummary({
  accept,
  dragActive,
  files,
  maxSize,
  multiple,
}: {
  accept?: string;
  dragActive: boolean;
  files: File[];
  maxSize?: number;
  multiple: boolean;
}): string {
  if (dragActive) {
    if (multiple) {
      return files.length > 0
        ? 'Release to append these files to the current selection.'
        : 'Release to select these files.';
    }

    return files.length > 0
      ? 'Release to replace the current file.'
      : 'Release to select this file.';
  }

  if (files.length > 0) {
    return multiple
      ? `${files.length} files selected. Review the list below or keep adding more.`
      : '1 file selected. Review the item below or replace it anytime.';
  }

  const hints = [
    accept ? `${formatAcceptLabel(accept)} accepted` : undefined,
    maxSize ? `Max ${formatBytes(maxSize)} each` : undefined,
  ]
    .filter(Boolean)
    .join(' - ');

  if (hints) {
    return hints;
  }

  return multiple
    ? 'Drop files here or browse from your device.'
    : 'Drop a file here or browse from your device.';
}

function getFileKey(file: File, index: number): string {
  return `${file.name}-${file.lastModified}-${file.size}-${index}`;
}

function getFileMetaLabel(file: File): string {
  const fileNameSegments = file.name.split('.');
  const extension =
    fileNameSegments.length > 1 ? fileNameSegments[fileNameSegments.length - 1] : undefined;

  return extension
    ? `${extension.toUpperCase()} - ${formatBytes(file.size)}`
    : formatBytes(file.size);
}

/**
 * Shared file-selection field shell with optional list rendering, item-level
 * remove actions, and generic max-size validation. Upload transport, previews,
 * cropping, and domain-specific orchestration stay local.
 */
export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (fileUploadProps, ref) => {
    const {
      value,
      onChange,
      accept,
      multiple = false,
      disabled = false,
      maxSize,
      error = false,
      clearable = false,
      onClear,
      label,
      className,
      id,
      required = false,
      name,
      form,
      capture,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      ...props
    } = fileUploadProps;

    const isControlled = Object.prototype.hasOwnProperty.call(fileUploadProps, 'value');
    const [uncontrolledFiles, setUncontrolledFiles] = React.useState<File[]>([]);
    const [localError, setLocalError] = React.useState<string | null>(null);
    const [isDragActive, setIsDragActive] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dragDepthRef = React.useRef(0);
    const generatedId = React.useId();
    const inputId = id ?? `file-upload-${generatedId}`;
    const labelId = label ? `${inputId}-label` : undefined;
    const summaryId = `${inputId}-summary`;
    const messageId = typeof error === 'string' || localError ? `${inputId}-message` : undefined;
    const files = isControlled ? normalizeFileUploadValue(value) : uncontrolledFiles;
    const hasFiles = files.length > 0;
    const invalid = Boolean(error) || Boolean(localError);
    const message = typeof error === 'string' ? error : localError;
    const describedBy =
      [ariaDescribedBy, summaryId, messageId].filter(Boolean).join(' ') || undefined;
    const labelledBy = [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
    const showRemoveButtons = clearable && !disabled && hasFiles;
    const summaryTone = invalid
      ? 'destructive'
      : isDragActive
        ? 'accent'
        : hasFiles
          ? 'default'
          : 'muted';
    const actionLabel = getSelectionTitle({ dragActive: isDragActive, files, multiple });
    const selectionSummary = getSelectionSummary({
      accept,
      dragActive: isDragActive,
      files,
      maxSize,
      multiple,
    });

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const resetDragState = React.useCallback(() => {
      dragDepthRef.current = 0;
      setIsDragActive(false);
    }, []);

    React.useEffect(() => {
      if (disabled) {
        resetDragState();
      }
    }, [disabled, resetDragState]);

    const commitFiles = React.useCallback(
      (nextFiles: File[], nextLocalError: string | null) => {
        setLocalError(nextLocalError);

        if (!isControlled) {
          setUncontrolledFiles(nextFiles);
        }

        onChange?.(resolveFileUploadChangeValue(nextFiles, multiple));
      },
      [isControlled, multiple, onChange],
    );

    const processFiles = React.useCallback(
      (incomingFiles: File[]) => {
        const selectedFiles = multiple ? incomingFiles : incomingFiles.slice(0, 1);

        if (!maxSize) {
          const nextFiles = multiple ? mergeSequentialFiles(files, selectedFiles) : selectedFiles;
          commitFiles(nextFiles, null);
          return;
        }

        const validFiles = selectedFiles.filter((file) => file.size <= maxSize);
        const rejectedFiles = selectedFiles.filter((file) => file.size > maxSize);
        const nextLocalError =
          rejectedFiles.length === 0
            ? null
            : rejectedFiles.length === 1
              ? `${rejectedFiles[0]?.name ?? 'File'} exceeds the ${formatBytes(maxSize)} limit.`
              : `${rejectedFiles.length} files exceed the ${formatBytes(maxSize)} limit.`;

        if (validFiles.length === 0 && rejectedFiles.length > 0) {
          setLocalError(nextLocalError);

          if (inputRef.current) {
            inputRef.current.value = '';
          }

          return;
        }

        const nextFiles = multiple ? mergeSequentialFiles(files, validFiles) : validFiles;
        commitFiles(nextFiles, nextLocalError);
      },
      [commitFiles, files, maxSize, multiple],
    );

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      const incomingFiles = Array.from(event.currentTarget.files ?? []);

      if (incomingFiles.length === 0) {
        return;
      }

      resetDragState();
      processFiles(incomingFiles);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    };

    const handleDragEnter: React.DragEventHandler<HTMLDivElement> = (event) => {
      if (disabled || !containsDraggedFiles(event.dataTransfer)) {
        return;
      }

      event.preventDefault();
      dragDepthRef.current += 1;
      setIsDragActive(true);
    };

    const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
      if (disabled || !containsDraggedFiles(event.dataTransfer)) {
        return;
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';

      if (!isDragActive) {
        setIsDragActive(true);
      }
    };

    const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (event) => {
      if (disabled || !containsDraggedFiles(event.dataTransfer)) {
        return;
      }

      event.preventDefault();
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

      if (dragDepthRef.current === 0) {
        setIsDragActive(false);
      }
    };

    const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
      if (disabled || !containsDraggedFiles(event.dataTransfer)) {
        return;
      }

      event.preventDefault();
      resetDragState();

      const droppedFiles = Array.from(event.dataTransfer.files ?? []);

      if (droppedFiles.length === 0) {
        return;
      }

      processFiles(droppedFiles);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    };

    const handleRemove = (targetIndex: number) => {
      const nextFiles = files.filter((_, index) => index !== targetIndex);

      if (inputRef.current) {
        inputRef.current.value = '';
      }

      commitFiles(nextFiles, null);

      if (nextFiles.length === 0) {
        onClear?.();
      }

      inputRef.current?.focus();
    };

    return (
      <Box data-slot="file-upload-field" className={cn(fileUploadFieldVariants(), className)}>
        {label ? (
          <Label id={labelId} htmlFor={inputId} required={required} disabled={disabled}>
            {label}
          </Label>
        ) : null}

        <Box data-slot="file-upload-control" className={fileUploadControlVariants()}>
          <Box
            data-slot="file-upload-dropzone"
            className={fileUploadDropzoneVariants({
              invalid,
              disabled,
              dragActive: isDragActive,
              hasFiles,
            })}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Box
              as="input"
              ref={inputRef}
              id={inputId}
              type="file"
              accept={accept}
              multiple={multiple}
              disabled={disabled}
              required={required}
              name={name}
              form={form}
              capture={capture}
              aria-labelledby={labelledBy}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              className={fileUploadInputVariants()}
              onChange={handleInputChange}
              {...props}
            />

            <Box
              data-slot="file-upload-presentation"
              className={fileUploadPresentationVariants({
                invalid,
                dragActive: isDragActive,
                hasFiles,
                disabled,
              })}
            >
              <Box
                as="span"
                aria-hidden="true"
                className={fileUploadIconVariants({
                  invalid,
                  disabled,
                  dragActive: isDragActive,
                  hasFiles,
                })}
              >
                <Upload className="h-5 w-5" />
              </Box>

              <Box data-slot="file-upload-body" className={fileUploadBodyVariants()}>
                <Box
                  as="span"
                  className={fileUploadTitleVariants({
                    disabled,
                    dragActive: isDragActive,
                  })}
                >
                  {actionLabel}
                </Box>
                <Box
                  as="span"
                  id={summaryId}
                  aria-live="polite"
                  className={fileUploadSummaryVariants({ tone: summaryTone })}
                >
                  {selectionSummary}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {hasFiles ? (
          <Box as="ul" data-slot="file-upload-list" className={fileUploadListVariants()}>
            {files.map((file, index) => (
              <Box as="li" key={getFileKey(file, index)} className={fileUploadListItemVariants()}>
                <Box as="span" aria-hidden="true" className={fileUploadFileIconVariants()}>
                  <FileText />
                </Box>
                <Box className={fileUploadFileBodyVariants()}>
                  <Box as="span" className={fileUploadFileNameVariants()}>
                    {file.name}
                  </Box>
                  <Box as="span" className={fileUploadFileMetaVariants()}>
                    {getFileMetaLabel(file)}
                  </Box>
                </Box>
                {showRemoveButtons ? (
                  <Box
                    as="button"
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    className={fileUploadActionButtonVariants()}
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                    onClick={() => {
                      handleRemove(index);
                    }}
                  >
                    <X aria-hidden="true" className="h-4 w-4" />
                  </Box>
                ) : null}
              </Box>
            ))}
          </Box>
        ) : null}

        {message ? (
          <Box as="p" id={messageId} role="alert" className={fileUploadMessageVariants()}>
            {message}
          </Box>
        ) : null}
      </Box>
    );
  },
);

FileUpload.displayName = 'FileUpload';
