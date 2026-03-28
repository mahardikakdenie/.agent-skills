import { Command as CommandPrimitive } from 'cmdk';
import { Check, ChevronsUpDown, LoaderCircle, Plus, Search, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import type { ComboboxProps } from './Combobox.types';
import {
  getComboboxEmptyText,
  getComboboxOption,
  getComboboxSearchLabel,
} from './Combobox.utils';
import {
  comboboxActionButtonVariants,
  comboboxCommandVariants,
  comboboxContentVariants,
  comboboxControlVariants,
  comboboxEmptyVariants,
  comboboxFieldVariants,
  comboboxItemContentVariants,
  comboboxItemIndicatorVariants,
  comboboxItemLabelVariants,
  comboboxItemVariants,
  comboboxLabelVariants,
  comboboxListVariants,
  comboboxLoadingRowVariants,
  comboboxMessageVariants,
  comboboxSearchIconVariants,
  comboboxSearchInputVariants,
  comboboxSearchRowVariants,
  comboboxTriggerIconVariants,
  comboboxTriggerTextVariants,
  comboboxTriggerVariants,
} from './Combobox.variants';

/**
 * Shared searchable single-select field built from the shared Popover surface
 * and a cmdk command list.
 */
export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      value,
      onValueChange,
      options,
      placeholder = 'Select an option',
      searchPlaceholder = 'Search options…',
      searchValue,
      onSearchValueChange,
      size = 'md',
      disabled = false,
      loading = false,
      required = false,
      error = false,
      label,
      clearable = false,
      createOptionLabel,
      onCreateOption,
      renderOption,
      className,
      open,
      onClose,
      id,
      type,
      name,
      tabIndex,
      onBlur,
      onFocus,
      onKeyDown,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const isSearchControlled = searchValue !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(undefined);
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
    const [uncontrolledSearchValue, setUncontrolledSearchValue] = React.useState('');
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const generatedId = React.useId();
    const triggerId = id ?? `combobox-${generatedId}`;
    const listId = `${triggerId}-listbox`;
    const labelId = label ? `${triggerId}-label` : undefined;
    const errorId = typeof error === 'string' ? `${triggerId}-error` : undefined;
    const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;
    const labelledBy = [ariaLabelledBy, labelId].filter(Boolean).join(' ') || undefined;
    const resolvedOpen = open ?? uncontrolledOpen;
    const currentValue = isControlled ? value : uncontrolledValue;
    const resolvedSearchValue = isSearchControlled ? searchValue : uncontrolledSearchValue;
    const trimmedSearchValue = resolvedSearchValue.trim();
    const normalizedSearchValue = trimmedSearchValue.toLowerCase();
    const selectedOption = getComboboxOption(options, currentValue);
    const searchLabel = getComboboxSearchLabel(label, searchPlaceholder);
    const invalid = Boolean(error);
    const interactiveDisabled = disabled || loading;
    const hasExactMatch =
      normalizedSearchValue.length > 0 &&
      options.some((option) => [option.label, option.value].some((candidate) => candidate.trim().toLowerCase() === normalizedSearchValue));
    const canCreateOption = Boolean(onCreateOption) && !interactiveDisabled && normalizedSearchValue.length > 0 && !hasExactMatch;
    const resolvedCreateOptionLabel =
      typeof createOptionLabel === 'function'
        ? createOptionLabel(trimmedSearchValue)
        : createOptionLabel ?? `Create "${trimmedSearchValue}"`;
    const labelTone = invalid && !interactiveDisabled ? 'destructive' : interactiveDisabled ? 'muted' : 'default';
    const showClearButton = clearable && !interactiveDisabled && currentValue !== undefined;

    React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

    React.useEffect(() => {
      if (!resolvedOpen || typeof window === 'undefined') {
        return;
      }

      const frame = window.requestAnimationFrame(() => {
        const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;

        if (!isCoarsePointer) {
          searchInputRef.current?.focus();
        }
      });

      return () => window.cancelAnimationFrame(frame);
    }, [resolvedOpen]);

    const handleSearchValueChange = (nextSearchValue: string) => {
      if (!isSearchControlled) {
        setUncontrolledSearchValue(nextSearchValue);
      }

      onSearchValueChange?.(nextSearchValue);
    };

    const handleOpen = () => {
      if (open === undefined) {
        setUncontrolledOpen(true);
      }
    };

    const handleClose = () => {
      if (open === undefined) {
        setUncontrolledOpen(false);
      }

      handleSearchValueChange('');
      onClose?.();
    };

    const handleCreateOption = () => {
      if (!canCreateOption || !onCreateOption) {
        return;
      }

      onCreateOption(trimmedSearchValue);
      handleClose();
      triggerRef.current?.focus();
    };

    const handleOptionSelect = (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
      handleClose();
      triggerRef.current?.focus();
    };

    const handleClear = () => {
      if (!isControlled) {
        setUncontrolledValue(undefined);
      }

      onValueChange?.(undefined);
      handleClose();
      triggerRef.current?.focus();
    };

    const handleTriggerKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
      onKeyDown?.(event);

      if (event.defaultPrevented || interactiveDisabled) {
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        handleOpen();
      }
    };

    const renderOptionContent = (
      option: (typeof options)[number],
      selected: boolean,
    ) => {
      if (!renderOption) {
        return <Box as="span" className={comboboxItemLabelVariants()}>{option.label}</Box>;
      }

      return (
        <>
          <Box as="span" className="sr-only">
            {option.label}
          </Box>
          <Box as="span" className={comboboxItemContentVariants()}>
            {renderOption(option, { selected, disabled: Boolean(option.disabled) })}
          </Box>
        </>
      );
    };

    return (
      <Box data-slot="combobox-field" className={cn(comboboxFieldVariants(), className)}>
        {label ? (
          <Box
            as="label"
            id={labelId}
            htmlFor={triggerId}
            className={comboboxLabelVariants({ tone: labelTone })}
          >
            {label}
            {required ? (
              <Box as="span" aria-hidden="true" className="ml-1 text-destructive">
                *
              </Box>
            ) : null}
          </Box>
        ) : null}

        <Popover open={resolvedOpen} onOpen={handleOpen} onClose={handleClose}>
          <Box data-slot="combobox-control" className={comboboxControlVariants()}>
            <PopoverTrigger asChild>
              <Box
                as="button"
                ref={triggerRef}
                id={triggerId}
                type={type ?? 'button'}
                name={name}
                tabIndex={tabIndex}
                disabled={interactiveDisabled}
                role="combobox"
                aria-label={ariaLabel}
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
                aria-invalid={invalid || undefined}
                aria-busy={loading || undefined}
                aria-expanded={resolvedOpen}
                aria-haspopup="listbox"
                aria-controls={listId}
                className={comboboxTriggerVariants({
                  size,
                  disabled: interactiveDisabled,
                  invalid,
                  open: resolvedOpen,
                  clearable: showClearButton,
                })}
                onBlur={onBlur}
                onFocus={onFocus}
                onKeyDown={handleTriggerKeyDown}
                {...props}
              >
                <Box
                  as="span"
                  className={comboboxTriggerTextVariants({ hasValue: Boolean(selectedOption) })}
                >
                  {selectedOption?.label ?? placeholder}
                </Box>
                {!showClearButton ? (
                  <Box as="span" aria-hidden="true" className="shrink-0">
                    {loading ? (
                      <LoaderCircle
                        className={cn(comboboxTriggerIconVariants({ size }), 'animate-spin')}
                      />
                    ) : (
                      <ChevronsUpDown className={comboboxTriggerIconVariants({ size })} />
                    )}
                  </Box>
                ) : null}
              </Box>
            </PopoverTrigger>

            {showClearButton ? (
              <Box
                as="button"
                type="button"
                aria-label="Clear selection"
                className={cn(comboboxActionButtonVariants({ size }), 'touch-manipulation')}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={handleClear}
              >
                <X aria-hidden="true" className={comboboxTriggerIconVariants({ size })} />
              </Box>
            ) : null}
          </Box>

          <PopoverContent
            align="start"
            side="bottom"
            sideOffset={8}
            collisionPadding={12}
            className={comboboxContentVariants()}
          >
            <CommandPrimitive
              label={label ?? 'Combobox options'}
              className={comboboxCommandVariants()}
              shouldFilter
              filter={(itemValue, search, keywords = []) => {
                const normalizedSearch = search.trim().toLowerCase();

                if (!normalizedSearch) {
                  return 1;
                }

                const haystack = [itemValue, ...keywords].join(' ').toLowerCase();
                return haystack.includes(normalizedSearch) ? 1 : 0;
              }}
            >
              <Box data-slot="combobox-search-row" className={comboboxSearchRowVariants({ size })}>
                <Box as="span" aria-hidden="true" className="shrink-0">
                  <Search className={comboboxSearchIconVariants({ size })} />
                </Box>
                <CommandPrimitive.Input
                  ref={searchInputRef}
                  value={resolvedSearchValue}
                  onValueChange={handleSearchValueChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && canCreateOption) {
                      event.preventDefault();
                      handleCreateOption();
                    }
                  }}
                  aria-label={searchLabel}
                  autoComplete="off"
                  placeholder={searchPlaceholder}
                  spellCheck={false}
                  className={comboboxSearchInputVariants({ size })}
                />
              </Box>

              <CommandPrimitive.List id={listId} className={comboboxListVariants()}>
                {loading ? (
                  <Box
                    as="div"
                    data-slot="combobox-loading"
                    role="status"
                    aria-live="polite"
                    className={comboboxLoadingRowVariants()}
                  >
                    <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                    Loading options…
                  </Box>
                ) : (
                  <>
                    <CommandPrimitive.Empty className={comboboxEmptyVariants()}>
                      {getComboboxEmptyText(options, resolvedSearchValue)}
                    </CommandPrimitive.Empty>
                    {canCreateOption ? (
                      <CommandPrimitive.Item
                        value={trimmedSearchValue}
                        keywords={[trimmedSearchValue, 'create', 'add new']}
                        className={comboboxItemVariants()}
                        onSelect={handleCreateOption}
                      >
                        <Box as="span" className={comboboxItemContentVariants()}>
                          <Box as="span" className="flex min-w-0 flex-1 items-center gap-2.5">
                            <Plus aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                            <Box as="span" className={comboboxItemLabelVariants()}>
                              {resolvedCreateOptionLabel}
                            </Box>
                          </Box>
                        </Box>
                      </CommandPrimitive.Item>
                    ) : null}
                    {options.map((option) => {
                      const selected = option.value === currentValue;

                      return (
                        <CommandPrimitive.Item
                          key={option.value}
                          value={option.value}
                          keywords={option.keywords ?? [option.label, option.value]}
                          disabled={option.disabled}
                          className={comboboxItemVariants()}
                          onSelect={handleOptionSelect}
                        >
                          {renderOptionContent(option, selected)}
                          <Box
                            as="span"
                            aria-hidden="true"
                            className={cn(
                              comboboxItemIndicatorVariants(),
                              selected ? 'opacity-100' : 'opacity-0',
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </Box>
                        </CommandPrimitive.Item>
                      );
                    })}
                  </>
                )}
              </CommandPrimitive.List>
            </CommandPrimitive>
          </PopoverContent>
        </Popover>

        {typeof error === 'string' ? (
          <Box as="p" id={errorId} role="alert" className={comboboxMessageVariants()}>
            {error}
          </Box>
        ) : null}
      </Box>
    );
  },
);

Combobox.displayName = 'Combobox';

