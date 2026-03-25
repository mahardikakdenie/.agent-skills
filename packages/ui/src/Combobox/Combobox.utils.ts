import type { ComboboxOption } from './Combobox.types';

export function getComboboxOption(options: ComboboxOption[], value: string | undefined) {
  if (!value) {
    return undefined;
  }

  return options.find((option) => option.value === value);
}

export function getComboboxEmptyText(options: ComboboxOption[], searchValue: string) {
  if (options.length === 0 && searchValue.trim().length === 0) {
    return 'No options available';
  }

  return 'No options found';
}

export function getComboboxSearchLabel(label: string | undefined, searchPlaceholder: string) {
  return label ? `Search ${label}` : searchPlaceholder;
}
