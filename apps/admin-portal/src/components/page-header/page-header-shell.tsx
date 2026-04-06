import Link from 'next/link';
import React from 'react';
import { ChevronLeft } from 'react-feather';

import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/ui';

export interface PageHeaderBreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface PageHeaderShellProps {
  title: string;
  breadcrumbs?: PageHeaderBreadcrumbItem[];
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const PageHeaderShell: React.FC<PageHeaderShellProps> = ({
  title,
  breadcrumbs,
  showBackButton = true,
  onBackClick,
  className = '',
  children,
}) => {
  return (
    <Box className={`bg-white md:px-6 p-4 flex items-center ${className}`}>
      <Box className="flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb className="sm:block hidden">
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {item.isCurrentPage ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : item.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbLink>{item.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <Box as="h2" className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
          {title}
        </Box>
      </Box>

      {children && <Box className="flex items-center gap-2">{children}</Box>}

      {showBackButton && (
        <Box
          as="button"
          type="button"
          onClick={onBackClick}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Box>
      )}
    </Box>
  );
};
