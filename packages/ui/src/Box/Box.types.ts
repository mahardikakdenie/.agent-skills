import type React from 'react';

// ---------------------------------------------------------------------------
// Polymorphic helper types
// ---------------------------------------------------------------------------

/**
 * Extract own props - ensures that consumer-defined props take precedence
 * over the HTML attribute of the same name when there is a conflict.
 */
type AsProp<C extends React.ElementType> = {
  /** The HTML tag or React component to render as. Defaults to `"div"`. */
  as?: C;
};

/**
 * The full, merged prop type for a polymorphic component.
 *
 * It merges:
 *  1. `OwnProps` - the component's explicit prop interface
 *  2. All native HTML attribute props from `React.ComponentPropsWithoutRef<C>`
 *     minus any keys already declared in `OwnProps` (no conflicts)
 */
export type PolymorphicComponentProps<C extends React.ElementType, OwnProps = object> = AsProp<C> &
  OwnProps &
  Omit<React.ComponentPropsWithoutRef<C>, keyof OwnProps | 'as'>;

/**
 * The full polymorphic prop type WITH a forwarded `ref`.
 *
 * Use this when the component definition uses `React.forwardRef`.
 */
export type PolymorphicComponentPropsWithRef<
  C extends React.ElementType,
  OwnProps = object,
> = PolymorphicComponentProps<C, OwnProps> & {
  ref?: React.ComponentPropsWithRef<C>['ref'];
};

// ---------------------------------------------------------------------------
// Box-specific types
// ---------------------------------------------------------------------------

export type BoxPadding = 'none' | 'sm' | 'md' | 'lg';

export type BoxContainer = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/** Own props unique to `Box` (beyond HTML passthrough + polymorphism). */
export interface BoxOwnProps {
  /**
   * When `true`, `Box` uses Radix `<Slot>` to merge all props onto the
   * single child element. The child element's tag wins; `Box` renders no
   * DOM node of its own.
   *
   * @default false
   */
  asChild?: boolean;
  /**
   * Applies a responsive horizontal padding preset.
   *
   * @default 'none'
   */
  padding?: BoxPadding;
  /**
   * Applies a max-width container preset and centers the rendered element.
   */
  container?: BoxContainer;
  /**
   * Centers child content with a minimal flex preset.
   *
   * @default false
   */
  centered?: boolean;
  /**
   * Additional classes merged after the preset variants.
   */
  className?: string;
}

/** Full props for `Box` when used with a specific element type `C`. */
export type BoxProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  BoxOwnProps
>;

/**
 * The polymorphic `Box` component type - exposes the generic signature so
 * consumers can annotate component props that accept a `Box`-like API.
 */
export type BoxComponent = <C extends React.ElementType = 'div'>(
  props: BoxProps<C>,
) => React.ReactElement | null;
