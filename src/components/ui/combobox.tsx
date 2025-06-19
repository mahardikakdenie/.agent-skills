import * as React from "react";
import { Check, ChevronDown, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type Option = {
  id: string;
  name: string;
};

interface ComboBoxProps {
  options: Option[];
  value: string;
  onChange: (value: string, newOption?: Option) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  placeholderInput?: string;
  className?: string;
  newOptionText?: string;
}

export const Combobox: React.FC<ComboBoxProps> = ({
  options,
  value,
  onChange,
  onSearch,
  placeholder,
  placeholderInput,
  className,
  newOptionText,
}) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const selected = options.find((opt) => opt.id === value);
  const optionMatch = options.find(
    (opt) => opt?.name?.toLowerCase() === inputValue?.toLowerCase()
  );

  const handleAddNew = () => {
    if (!optionMatch && inputValue.trim() !== "") {
      const newOption = {
        id: inputValue.trim(),
        name: inputValue.trim(),
      };
      onChange(newOption.id, newOption);
      setInputValue(newOption.name);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between hover:bg-transparent",
            className
          )}
        >
          {selected ? selected.name : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-h-96 min-w-[var(--radix-popover-trigger-width)] overflow-y-auto p-0">
        <Command>
          <CommandInput
            placeholder={placeholderInput}
            value={inputValue}
            onValueChange={(val) => {
              setInputValue(val);
              if (onSearch) {
                onSearch(val);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddNew();
              }
            }}
          />

          {!optionMatch && inputValue && (
            <div
              className="flex items-center gap-2 py-2 ml-4 cursor-pointer"
              onClick={handleAddNew}
            >
              <PlusIcon className="h-5 w-5 text-[#016DA1]" />
              <p className="text-xs">{newOptionText}</p>
            </div>
          )}

          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.id}
                value={option?.name ?? ''}
                onSelect={() => {
                  onChange(option.id);
                  setOpen(false);
                  setInputValue(option?.name ?? '');
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {option?.name ?? ''}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
