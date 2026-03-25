import * as React from 'react';
import { ChevronRight } from 'lucide-react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type { BreadcrumbItem, BreadcrumbProps } from './Breadcrumb.types';
import {
  breadcrumbItemVariants,
  breadcrumbListVariants,
  breadcrumbRootVariants,
  breadcrumbSeparatorVariants,
  breadcrumbTextVariants,
} from './Breadcrumb.variants';

function resolveTrailItems(items: BreadcrumbItem[], currentLabel?: string) {
  if (items.some((item) => item.current)) {
    return items;
  }

  if (!currentLabel) {
    return items;
  }

  return [...items, { label: currentLabel, current: true }];
}

/**
 * Shared breadcrumb trail for app-agnostic ancestor navigation.
 *
 * It renders semantic `nav` and ordered-list structure through `Box`, keeps
 * route behavior local by accepting plain `href` strings only, and supports
 * either a current item in `items` or a separate `currentLabel`.
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      separator,
      currentLabel,
      className,
      'aria-label': ariaLabel = 'Breadcrumb',
      ...props
    },
    ref,
  ) => {
    const trailItems = resolveTrailItems(items, currentLabel);

    if (trailItems.length === 0) {
      return null;
    }

    return (
      <Box
        as="nav"
        ref={ref}
        aria-label={ariaLabel}
        data-slot="breadcrumb"
        className={cn(breadcrumbRootVariants(), className)}
        {...props}
      >
        <Box as="ol" data-slot="breadcrumb-list" className={breadcrumbListVariants()}>
          {trailItems.map((item, index) => {
            const isCurrent = Boolean(item.current);
            const key = item.href ?? `${item.label}-${index}`;

            return (
              <React.Fragment key={key}>
                <Box as="li" data-slot="breadcrumb-item" className={breadcrumbItemVariants()}>
                  {isCurrent ? (
                    <Box
                      as="span"
                      aria-current="page"
                      data-slot="breadcrumb-current"
                      className={breadcrumbTextVariants({ tone: 'current' })}
                    >
                      {item.label}
                    </Box>
                  ) : item.href ? (
                    <Box
                      as="a"
                      href={item.href}
                      data-slot="breadcrumb-link"
                      className={breadcrumbTextVariants({ tone: 'link' })}
                    >
                      {item.label}
                    </Box>
                  ) : (
                    <Box
                      as="span"
                      data-slot="breadcrumb-text"
                      className={breadcrumbTextVariants({ tone: 'muted' })}
                    >
                      {item.label}
                    </Box>
                  )}
                </Box>

                {index < trailItems.length - 1 ? (
                  <Box
                    as="li"
                    role="presentation"
                    aria-hidden="true"
                    data-slot="breadcrumb-separator"
                    className={breadcrumbSeparatorVariants()}
                  >
                    <Box as="span" className="inline-flex items-center">
                      {separator ?? <ChevronRight className="h-4 w-4" />}
                    </Box>
                  </Box>
                ) : null}
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
    );
  },
);

Breadcrumb.displayName = 'Breadcrumb';
