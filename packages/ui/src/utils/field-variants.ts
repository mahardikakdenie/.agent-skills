export const fieldVariantValues = ['outline', 'shadow', 'ghost'] as const;
export const fieldVariantAliasValues = ['default'] as const;

export type FieldVariant = (typeof fieldVariantValues)[number];
export type FieldVariantAlias = (typeof fieldVariantAliasValues)[number];
export type FieldVariantProp = FieldVariant | FieldVariantAlias;

export const fieldVariantClassNames = {
  outline: 'border-border bg-background shadow-none',
  shadow: 'border-input bg-background shadow-sm',
  ghost: 'border-transparent bg-muted/40 shadow-none',
} as const satisfies Record<FieldVariant, string>;

export const fieldVariantOptions = {
  ...fieldVariantClassNames,
  default: fieldVariantClassNames.shadow,
} as const satisfies Record<FieldVariantProp, string>;

export function resolveFieldVariant(variant?: FieldVariantProp): FieldVariant {
  if (!variant || variant === 'outline') {
    return 'outline';
  }

  if (variant === 'default') {
    return 'shadow';
  }

  return variant;
}
