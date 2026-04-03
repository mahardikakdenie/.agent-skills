export const displaySurfaceVariantValues = ['outline', 'shadow'] as const;

export type DisplaySurfaceVariant = (typeof displaySurfaceVariantValues)[number];
