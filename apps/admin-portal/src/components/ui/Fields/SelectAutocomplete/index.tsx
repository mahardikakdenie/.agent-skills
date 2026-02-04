"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface SelectAutocompleteOption {
  value: string;
  label: string;
}

export interface SelectAutocompleteProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectAutocompleteOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  disabled?: boolean;
  loading?: boolean;
  isSearching?: boolean;
  className?: string;
  triggerClassName?: string;
  emptyText?: string;
}

export const SelectAutocomplete = React.forwardRef<
  HTMLButtonElement,
  SelectAutocompleteProps
>(
  (
    {
      value,
      onValueChange,
      options,
      placeholder = "Select an option",
      searchPlaceholder = "Search...",
      onSearchChange,
      searchValue = "",
      disabled = false,
      loading = false,
      isSearching = false,
      className,
      triggerClassName,
      emptyText = "No results found",
    },
    ref
  ) => {
    const [internalSearchValue, setInternalSearchValue] =
      React.useState(searchValue);

    const [selectedOption, setSelectedOption] =
      React.useState<SelectAutocompleteOption | null>(null);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalSearchValue(newValue);
      onSearchChange?.(newValue);
    };

    const handleValueChange = (newValue: string) => {
      const option = options.find((opt) => opt.value === newValue);
      if (option) {
        setSelectedOption(option);
      }
      onValueChange?.(newValue);
    };

    React.useEffect(() => {
      if (value) {
        const option = options.find((opt) => opt.value === value);
        if (option) {
          setSelectedOption(option);
        }
      } else {
        setSelectedOption(null);
      }
    }, [value, options]);

    React.useEffect(() => {
      setInternalSearchValue(searchValue);
    }, [searchValue]);

    const displayOptions = React.useMemo(() => {
      if (!selectedOption || !value) return options;

      const hasSelectedInOptions = options.some(
        (opt) => opt.value === selectedOption.value
      );

      if (hasSelectedInOptions) {
        return options;
      }

      return [selectedOption, ...options];
    }, [options, selectedOption, value]);

    return (
      <SelectPrimitive.Root
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          ref={ref}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            triggerClassName
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
              className
            )}
            position="popper"
          >
            {onSearchChange && (
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={internalSearchValue}
                    onChange={handleSearchChange}
                    className="h-8 pl-8 pr-2"
                    onKeyDown={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </div>
                {isSearching && (
                  <div className="text-xs text-muted-foreground mt-1 px-2">
                    Searching...
                  </div>
                )}
              </div>
            )}

            <SelectPrimitive.Viewport className="p-1 h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]">
              {loading ? (
                <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none">
                  Loading...
                </div>
              ) : displayOptions.length === 0 ? (
                <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none text-muted-foreground">
                  {emptyText}
                </div>
              ) : (
                displayOptions.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <SelectPrimitive.ItemIndicator>
                        <Check className="h-4 w-4" />
                      </SelectPrimitive.ItemIndicator>
                    </span>
                    <SelectPrimitive.ItemText>
                      {option.label}
                    </SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))
              )}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  }
);

SelectAutocomplete.displayName = "SelectAutocomplete";
