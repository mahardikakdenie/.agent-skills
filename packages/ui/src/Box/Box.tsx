import { Slot } from '@radix-ui/react-slot';
import React from 'react';

import { cn } from '@repo/helper';

import { boxVariants } from './Box.variants';
import type { BoxComponent, BoxProps } from './Box.types';

/**
 * `Box` - the foundational layout primitive.
 *
 * A polymorphic, type-safe wrapper around any native HTML element (or custom
 * component). Its job is to forward all props - including `ref` and
 * `className` - to the rendered element while offering a small, app-agnostic
 * set of layout presets for migration work.
 *
 * @example
 * // Replace a bare <div>
 * <Box className="flex items-center gap-4">...</Box>
 *
 * // Render as a <section>
 * <Box as="section" aria-labelledby="heading">...</Box>
 *
 * // Render as <span>
 * <Box as="span" className="text-sm text-muted-foreground">...</Box>
 *
 * // Shared shell preset
 * <Box as="main" container="xl" padding="md">...</Box>
 *
 * // asChild - merges props onto the child element, Box renders no DOM node
 * <Box asChild className="flex justify-center">
 *   <button onClick={handleClick}>Submit</button>
 * </Box>
 */
// We cannot use React.forwardRef with a fully-generic polymorphic signature
// because forwardRef does not support generic type parameters. The workaround
// is to cast the function to the exported `BoxComponent` type after definition,
// preserving generics at the call site while still forwarding refs internally.
const BoxImpl = React.forwardRef(function Box(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { as, asChild = false, className, padding = 'none', container, centered = false, ...rest }: BoxProps<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: React.Ref<any>,
) {
  const Comp: React.ElementType = asChild ? Slot : (as ?? 'div');

  return (
    <Comp
      ref={ref}
      className={cn(boxVariants({ padding, container, centered }), className)}
      {...rest}
    />
  );
});

BoxImpl.displayName = 'Box';

/**
 * Exported as a typed polymorphic component.
 *
 * When `as` is provided, all valid HTML attributes for that element are
 * available and type-checked. The `ref` type is also narrowed accordingly.
 *
 * ```tsx
 * // Valid - `href` is a valid <a> attribute
 * <Box as="a" href="/home">Home</Box>
 *
 * // TypeScript error - `href` is not valid on <div>
 * <Box href="/home">Home</Box>
 * ```
 */
export const Box = BoxImpl as unknown as BoxComponent;
