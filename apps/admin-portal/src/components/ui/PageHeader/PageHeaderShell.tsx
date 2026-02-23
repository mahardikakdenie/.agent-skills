import React from "react";
import { ChevronLeft } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
  className = "",
  children,
}) => {
  return (
    <div className={`bg-white md:px-6 p-4 flex items-center ${className}`}>
      <div className="flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb className="sm:block hidden">
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {item.isCurrentPage ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : item.href ? (
                      <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
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
        <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">{title}</h2>
      </div>

      {children && <div className="flex items-center gap-2">{children}</div>}

      {showBackButton && (
        <div
          onClick={onBackClick}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </div>
      )}
    </div>
  );
};
