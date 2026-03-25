import type * as React from 'react';

export const timelineOrientationValues = ['vertical', 'horizontal'] as const;
export type TimelineOrientation = (typeof timelineOrientationValues)[number];

export const timelineStatusToneValues = [
  'default',
  'success',
  'warning',
  'destructive',
  'info',
] as const;

export type TimelineStatusTone = (typeof timelineStatusToneValues)[number];

export interface TimelineItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  statusTone?: TimelineStatusTone;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
  orientation?: TimelineOrientation;
  statusTone?: TimelineStatusTone;
  className?: string;
}
