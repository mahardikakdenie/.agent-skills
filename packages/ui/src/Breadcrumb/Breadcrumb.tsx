'use client';

import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import { Box } from '../Box';

const BreadcrumbSeparatorContext = React.createContext<React.ReactNode | undefined>(undefined);

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
  separator?: React.ReactNode;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ separator, ...props }, ref) => (
    <BreadcrumbSeparatorContext.Provider value={separator}>
      <Box as="nav" ref={ref} aria-label="breadcrumb" {...props} />
    </BreadcrumbSeparatorContext.Provider>
  ),
);
Breadcrumb.displayName = 'Breadcrumb';

export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
  <Box
    as="ol"
    ref={ref}
    className={clsx(
      'm-0 flex list-none flex-wrap items-center gap-1.5 break-words p-0 text-sm text-gray-600 sm:gap-2.5',
      className,
    )}
    {...props}
  />
));
BreadcrumbList.displayName = 'BreadcrumbList';

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  ({ className, ...props }, ref) => (
    <Box
      as="li"
      ref={ref}
      className={clsx('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  ),
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  asChild?: boolean;
}

export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={clsx('text-gray-600 transition-colors hover:text-gray-900', className)}
          {...props}
        />
      );
    }

    return (
      <Box
        as="a"
        ref={ref}
        className={clsx('text-gray-600 transition-colors hover:text-gray-900', className)}
        {...props}
      />
    );
  },
);
BreadcrumbLink.displayName = 'BreadcrumbLink';

export const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <Box
    as="span"
    ref={ref}
    role="link"
    aria-current="page"
    aria-disabled="true"
    className={clsx('font-normal text-gray-900', className)}
    {...props}
  />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

export type BreadcrumbSeparatorProps = React.ComponentPropsWithoutRef<'li'>;

export const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps) => {
  const separator = React.useContext(BreadcrumbSeparatorContext);

  return (
    <Box
      as="li"
      role="presentation"
      aria-hidden="true"
      className={clsx('text-gray-400 [&>svg]:h-3.5 [&>svg]:w-3.5', className)}
      {...props}
    >
      {children ?? separator ?? <ChevronRight />}
    </Box>
  );
};
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export type BreadcrumbEllipsisProps = React.ComponentPropsWithoutRef<'span'>;

export const BreadcrumbEllipsis = ({ className, ...props }: BreadcrumbEllipsisProps) => (
  <Box
    as="span"
    role="presentation"
    aria-hidden="true"
    className={clsx('flex h-9 w-9 items-center justify-center text-gray-500', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <Box as="span" className="sr-only">
      More
    </Box>
  </Box>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';
