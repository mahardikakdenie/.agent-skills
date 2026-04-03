import type * as React from 'react';

import type { NavigationSurfaceVariantProp } from '../utils/navigation-surface-variants';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  variant?: NavigationSurfaceVariantProp;
  className?: string;
}
