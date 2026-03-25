import type * as React from 'react';

export const imageRatioValues = ['auto', 'square', 'video', 'portrait'] as const;
export const imageFitValues = ['cover', 'contain', 'fill'] as const;

export type ImageRatio = (typeof imageRatioValues)[number];
export type ImageFit = (typeof imageFitValues)[number];

export interface ImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    'alt' | 'children' | 'className' | 'src'
  > {
  src?: string | null;
  alt?: string;
  fallback?: React.ReactNode;
  ratio?: ImageRatio;
  fit?: ImageFit;
  className?: string;
}
