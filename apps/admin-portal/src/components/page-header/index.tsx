import React from "react";
import { useRouter } from "next/navigation";
import { PageHeaderShell, type PageHeaderBreadcrumbItem } from "./page-header-shell";

interface PageHeaderProps {
  title: string;
  breadcrumbs?: PageHeaderBreadcrumbItem[];
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  showBackButton = true,
  onBackClick,
  className = "",
  children,
}) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <PageHeaderShell
      title={title}
      breadcrumbs={breadcrumbs}
      showBackButton={showBackButton}
      onBackClick={handleBackClick}
      className={className}
    >
      {children}
    </PageHeaderShell>
  );
};
