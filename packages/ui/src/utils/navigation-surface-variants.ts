export const navigationSurfaceVariantValues = ['outline', 'shadow', 'ghost'] as const;
export const navigationSurfaceVariantAliasValues = ['default'] as const;

export type NavigationSurfaceVariant = (typeof navigationSurfaceVariantValues)[number];
export type NavigationSurfaceVariantAlias = (typeof navigationSurfaceVariantAliasValues)[number];
export type NavigationSurfaceVariantProp = NavigationSurfaceVariant | NavigationSurfaceVariantAlias;

export const navigationSurfaceVariantClassNames = {
  outline: 'border border-border bg-background shadow-none',
  shadow: 'border border-border bg-background shadow-sm',
  ghost: 'border-transparent bg-transparent shadow-none',
} as const satisfies Record<NavigationSurfaceVariant, string>;

export const navigationSurfaceVariantOptions = {
  ...navigationSurfaceVariantClassNames,
  default: navigationSurfaceVariantClassNames.shadow,
} as const satisfies Record<NavigationSurfaceVariantProp, string>;

export function resolveNavigationSurfaceVariant(
  variant?: NavigationSurfaceVariantProp,
): NavigationSurfaceVariant {
  if (!variant || variant === 'outline') {
    return 'outline';
  }

  if (variant === 'default') {
    return 'shadow';
  }

  return variant;
}
