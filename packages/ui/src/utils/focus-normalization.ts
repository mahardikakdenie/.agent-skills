import { cn } from '@repo/helper';

export type FieldShellFocusOwnership = 'composite' | 'composite-visible' | 'direct';
export type CompactControlFocusMode = 'standard' | 'embedded';
export type DenseSurfaceFocusOwnership = 'direct' | 'composite';

export interface FocusRecipe {
  base: string;
  invalid: string;
}

export interface SegmentedInputFocusRecipe extends FocusRecipe {
  active: string;
  invalidActive: string;
}

export interface FocusNormalizationRecipes {
  fieldShell: Record<FieldShellFocusOwnership, FocusRecipe>;
  segmentedInput: SegmentedInputFocusRecipe;
  compactControl: Record<CompactControlFocusMode, FocusRecipe>;
  denseSurface: Record<DenseSurfaceFocusOwnership, FocusRecipe>;
}

type FocusSelector = 'focus-visible' | 'focus-within';

interface BuildFocusRecipeOptions {
  selector: FocusSelector;
  ringWidth: 'ring-1' | 'ring-2';
  ringTint: string;
  invalidRingTint: string;
  includeBorderTint?: boolean;
  includeOutlineReset?: boolean;
  invalidBase?: string;
}

function selectorState(selector: FocusSelector, token: string) {
  return `${selector}:${token}`;
}

function buildFocusRecipe({
  selector,
  ringWidth,
  ringTint,
  invalidRingTint,
  includeBorderTint = false,
  includeOutlineReset = selector === 'focus-visible',
  invalidBase,
}: BuildFocusRecipeOptions): FocusRecipe {
  return {
    base: cn(
      includeOutlineReset && selectorState(selector, 'outline-none'),
      includeBorderTint && selectorState(selector, 'border-ring'),
      selectorState(selector, ringWidth),
      selectorState(selector, ringTint),
    ),
    invalid: cn(
      invalidBase,
      includeBorderTint && selectorState(selector, 'border-destructive'),
      selectorState(selector, invalidRingTint),
    ),
  };
}

function buildHasFocusVisibleRecipe({
  ringWidth,
  ringTint,
  invalidRingTint,
  includeBorderTint = false,
  invalidBase,
}: Omit<BuildFocusRecipeOptions, 'selector' | 'includeOutlineReset'>): FocusRecipe {
  return {
    base: cn(
      includeBorderTint && 'has-[:focus-visible]:border-ring',
      `has-[:focus-visible]:${ringWidth}`,
      `has-[:focus-visible]:${ringTint}`,
    ),
    invalid: cn(
      invalidBase,
      includeBorderTint && 'has-[:focus-visible]:border-destructive',
      `has-[:focus-visible]:${ringWidth}`,
      `has-[:focus-visible]:${invalidRingTint}`,
    ),
  };
}

// Keep family differences explicit so component workers can compose the right
// recipe instead of reusing one loud ring pattern across every control shape.
export const focusNormalizationRecipes = {
  fieldShell: {
    composite: buildFocusRecipe({
      selector: 'focus-within',
      ringWidth: 'ring-1',
      ringTint: 'ring-ring/20',
      invalidRingTint: 'ring-destructive/20',
      includeBorderTint: true,
      invalidBase: 'border-destructive',
    }),
    'composite-visible': buildHasFocusVisibleRecipe({
      ringWidth: 'ring-1',
      ringTint: 'ring-ring/20',
      invalidRingTint: 'ring-destructive/20',
      includeBorderTint: true,
      invalidBase: 'border-destructive',
    }),
    direct: buildFocusRecipe({
      selector: 'focus-visible',
      ringWidth: 'ring-1',
      ringTint: 'ring-ring/20',
      invalidRingTint: 'ring-destructive/20',
      includeBorderTint: true,
      invalidBase: 'border-destructive',
    }),
  },
  segmentedInput: {
    ...buildFocusRecipe({
      selector: 'focus-visible',
      ringWidth: 'ring-1',
      ringTint: 'ring-ring/20',
      invalidRingTint: 'ring-destructive/20',
      invalidBase: 'border-destructive text-destructive',
    }),
    active: 'border-ring bg-accent/30',
    invalidActive: 'border-destructive bg-destructive/5',
  },
  compactControl: {
    standard: buildFocusRecipe({
      selector: 'focus-visible',
      ringWidth: 'ring-2',
      ringTint: 'ring-ring/35',
      invalidRingTint: 'ring-destructive/30',
    }),
    embedded: buildFocusRecipe({
      selector: 'focus-visible',
      ringWidth: 'ring-1',
      ringTint: 'ring-ring/25',
      invalidRingTint: 'ring-destructive/20',
    }),
  },
  denseSurface: {
    direct: buildFocusRecipe({
      selector: 'focus-visible',
      ringWidth: 'ring-1',
      ringTint: 'ring-ring/25',
      invalidRingTint: 'ring-destructive/20',
    }),
    composite: buildFocusRecipe({
      selector: 'focus-within',
      ringWidth: 'ring-1',
      ringTint: 'ring-ring/20',
      invalidRingTint: 'ring-destructive/20',
    }),
  },
} as const satisfies FocusNormalizationRecipes;

export function getFieldShellFocusRecipe(ownership: FieldShellFocusOwnership): FocusRecipe {
  return focusNormalizationRecipes.fieldShell[ownership];
}

export function getSegmentedInputFocusRecipe(): SegmentedInputFocusRecipe {
  return focusNormalizationRecipes.segmentedInput;
}

export function getCompactControlFocusRecipe(mode: CompactControlFocusMode = 'standard'): FocusRecipe {
  return focusNormalizationRecipes.compactControl[mode];
}

export function getDenseSurfaceFocusRecipe(
  ownership: DenseSurfaceFocusOwnership = 'direct',
): FocusRecipe {
  return focusNormalizationRecipes.denseSurface[ownership];
}
