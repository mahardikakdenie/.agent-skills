import type * as React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  currentLabel?: string;
  className?: string;
}

export interface BreadcrumbListProps extends React.OlHTMLAttributes<HTMLOListElement> {
  className?: string;
}

export interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  className?: string;
}

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  className?: string;
}

export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

export interface BreadcrumbSeparatorProps extends React.LiHTMLAttributes<HTMLLIElement> {
  className?: string;
}
