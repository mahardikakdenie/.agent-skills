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

interface BreadcrumbLinkBaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface BreadcrumbLinkAsChildProps
  extends BreadcrumbLinkBaseProps,
    Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'className' | 'href'> {
  asChild: true;
  children: React.ReactElement;
  href?: never;
}

export interface BreadcrumbLinkAnchorProps
  extends BreadcrumbLinkBaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'> {
  asChild?: false;
  href: string;
}

export interface BreadcrumbLinkButtonProps
  extends BreadcrumbLinkBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'href'> {
  asChild?: false;
  href?: undefined;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export interface BreadcrumbLinkTextProps
  extends BreadcrumbLinkBaseProps,
    Omit<React.HTMLAttributes<HTMLSpanElement>, 'children' | 'className' | 'href' | 'onClick'> {
  asChild?: false;
  href?: undefined;
  onClick?: undefined;
}

export type BreadcrumbLinkProps =
  | BreadcrumbLinkAsChildProps
  | BreadcrumbLinkAnchorProps
  | BreadcrumbLinkButtonProps
  | BreadcrumbLinkTextProps;

export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

export interface BreadcrumbSeparatorProps extends React.LiHTMLAttributes<HTMLLIElement> {
  className?: string;
}
