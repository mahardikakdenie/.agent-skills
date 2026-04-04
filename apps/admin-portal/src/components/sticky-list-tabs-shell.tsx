import type { HTMLAttributes } from 'react';

import { Box } from '@repo/ui';

import { cn } from '@/lib/utils';

export function StickyListTabsShell({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <Box
      className={cn(
        'sticky top-0 z-[4] -mx-4 px-4 py-1 md:-mx-6 md:px-6 bg-[#F8F8F8]/95 backdrop-blur-sm supports-[backdrop-filter]:bg-[#F8F8F8]/75',
        className,
      )}
      {...props}
    >
      <Box className="rounded-xl bg-white shadow-[0_10px_24px_-22px_rgba(15,23,42,0.45)]">
        {children}
      </Box>
    </Box>
  );
}
