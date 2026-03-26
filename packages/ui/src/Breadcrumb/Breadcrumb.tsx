import * as React from 'react';
import { ChevronRight } from 'lucide-react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type {
  BreadcrumbItem as BreadcrumbDataItem,
  BreadcrumbItemProps,
  BreadcrumbLinkAnchorProps,
  BreadcrumbLinkButtonProps,
  BreadcrumbLinkProps,
  BreadcrumbListProps,
  BreadcrumbPageProps,
  BreadcrumbProps,
  BreadcrumbSeparatorProps,
} from './Breadcrumb.types';
import {
  breadcrumbItemVariants,
  breadcrumbListVariants,
  breadcrumbRootVariants,
  breadcrumbSeparatorVariants,
  breadcrumbTextVariants,
} from './Breadcrumb.variants';

const BreadcrumbSeparatorContext = React.createContext<React.ReactNode | undefined>(undefined);

function resolveTrailItems(items: BreadcrumbDataItem[] = [], currentLabel?: string) {
  if (items.some((item) => item.current)) {
    return items;
  }

  if (!currentLabel) {
    return items;
  }

  return [...items, { label: currentLabel, current: true }];
}

function renderTrailItems(items: BreadcrumbDataItem[]) {
  return items.map((item, index) => {
    const isCurrent = Boolean(item.current);
    const key = item.href ?? `${item.label}-${index}`;

    return (
      <React.Fragment key={key}>
        <BreadcrumbItem>
          {isCurrent ? (
            <BreadcrumbPage>{item.label}</BreadcrumbPage>
          ) : item.href ? (
            <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
          ) : (
            <Box
              as="span"
              data-slot="breadcrumb-text"
              className={breadcrumbTextVariants({ tone: 'muted' })}
            >
              {item.label}
            </Box>
          )}
        </BreadcrumbItem>

        {index < items.length - 1 ? <BreadcrumbSeparator /> : null}
      </React.Fragment>
    );
  });
}

function isBreadcrumbLinkAnchorProps(props: BreadcrumbLinkProps): props is BreadcrumbLinkAnchorProps {
  return !props.asChild && typeof props.href === 'string';
}

function isBreadcrumbLinkButtonProps(props: BreadcrumbLinkProps): props is BreadcrumbLinkButtonProps {
  return !props.asChild && props.href === undefined && typeof props.onClick === 'function';
}

/**
 * Shared breadcrumb trail for app-agnostic ancestor navigation.
 *
 * It renders semantic `nav` and ordered-list structure through `Box`, keeps
 * route behavior local by accepting plain `href` strings in the flat API or
 * composition via the compound exports, and supports either a current item in
 * `items` or a separate `currentLabel`.
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator, currentLabel, className, children, 'aria-label': ariaLabel = 'Breadcrumb', ...props }, ref) => {
    const trailItems = resolveTrailItems(items, currentLabel);
    const hasAutoItems = trailItems.length > 0;

    if (!hasAutoItems && !children) {
      return null;
    }

    return (
      <BreadcrumbSeparatorContext.Provider value={separator}>
        <Box
          as="nav"
          ref={ref}
          aria-label={ariaLabel}
          data-slot="breadcrumb"
          className={cn(breadcrumbRootVariants(), className)}
          {...props}
        >
          {hasAutoItems ? <BreadcrumbList>{renderTrailItems(trailItems)}</BreadcrumbList> : children}
        </Box>
      </BreadcrumbSeparatorContext.Provider>
    );
  },
);

Breadcrumb.displayName = 'Breadcrumb';

export const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => (
    <Box
      as="ol"
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(breadcrumbListVariants(), className)}
      {...props}
    />
  ),
);

BreadcrumbList.displayName = 'BreadcrumbList';

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    <Box
      as="li"
      ref={ref}
      data-slot="breadcrumb-item"
      className={cn(breadcrumbItemVariants(), className)}
      {...props}
    />
  ),
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

export const BreadcrumbLink = React.forwardRef<HTMLElement, BreadcrumbLinkProps>((props, ref) => {
  const interactiveClassName = cn(breadcrumbTextVariants({ tone: 'link' }), props.className);
  const textClassName = cn(breadcrumbTextVariants({ tone: 'muted' }), props.className);

  if (props.asChild) {
    const { asChild: _asChild, className: _className, children, ...slotProps } = props;

    return (
      <Box asChild data-slot="breadcrumb-link" className={interactiveClassName} {...slotProps}>
        {children}
      </Box>
    );
  }

  if (isBreadcrumbLinkAnchorProps(props)) {
    const { className: _className, children, href, ...anchorProps } = props;

    return (
      <Box
        as="a"
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        data-slot="breadcrumb-link"
        className={interactiveClassName}
        {...anchorProps}
      >
        {children}
      </Box>
    );
  }

  if (isBreadcrumbLinkButtonProps(props)) {
    const { className: _className, children, onClick, type = 'button', ...buttonProps } = props;

    return (
      <Box
        as="button"
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        data-slot="breadcrumb-link"
        className={interactiveClassName}
        onClick={onClick}
        {...buttonProps}
      >
        {children}
      </Box>
    );
  }

  const { className: _className, children, ...spanProps } = props;

  return (
    <Box
      as="span"
      ref={ref as React.Ref<HTMLSpanElement>}
      data-slot="breadcrumb-text"
      className={textClassName}
      {...spanProps}
    >
      {children}
    </Box>
  );
});

BreadcrumbLink.displayName = 'BreadcrumbLink';

export const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => (
    <Box
      as="span"
      ref={ref}
      aria-current="page"
      data-slot="breadcrumb-current"
      className={cn(breadcrumbTextVariants({ tone: 'current' }), className)}
      {...props}
    />
  ),
);

BreadcrumbPage.displayName = 'BreadcrumbPage';

export const BreadcrumbSeparator = ({ children, className, ...props }: BreadcrumbSeparatorProps) => {
  const separator = React.use(BreadcrumbSeparatorContext);

  return (
    <Box
      as="li"
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      className={cn(breadcrumbSeparatorVariants(), className)}
      {...props}
    >
      <Box as="span" className="inline-flex items-center">
        {children ?? separator ?? <ChevronRight className="h-4 w-4" />}
      </Box>
    </Box>
  );
};

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
