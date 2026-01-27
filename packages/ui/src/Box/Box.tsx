"use client";

import {
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
  forwardRef,
} from "react";

type AsProp<T extends ElementType> = {
  as?: T;
};

type PropsToOmit<T extends ElementType, P> = keyof (AsProp<T> & P);

type PolymorphicRef<T extends ElementType> = ComponentPropsWithRef<T>["ref"];

type PolymorphicComponentProps<T extends ElementType, P = {}> = P &
  AsProp<T> &
  Omit<ComponentPropsWithoutRef<T>, PropsToOmit<T, P>>;

export type BoxOwnProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  "data-testid"?: string;
};

export type BoxProps<T extends ElementType = "div"> = PolymorphicComponentProps<
  T,
  BoxOwnProps
>;

const BoxImpl = <T extends ElementType = "div">(
  { as, className, style, children, ...props }: BoxProps<T>,
  ref: PolymorphicRef<T>,
) => {
  const Component = as ?? "div";

  return (
    <Component ref={ref} className={className} style={style} {...props}>
      {children}
    </Component>
  );
};

type BoxComponent = <T extends ElementType = "div">(
  props: BoxProps<T> & { ref?: PolymorphicRef<T> },
) => ReactElement | null;

export const Box = forwardRef(
  BoxImpl as (
    props: BoxProps<ElementType>,
    ref: PolymorphicRef<ElementType>,
  ) => ReactElement | null,
) as BoxComponent;

(Box as { displayName?: string }).displayName = "Box";
