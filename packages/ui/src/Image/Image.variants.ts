import { cva } from 'class-variance-authority';

export const imageRootVariants = cva(
  [
    'relative isolate overflow-hidden rounded-md bg-muted text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'motion-reduce:transition-none',
  ].join(' '),
  {
    variants: {
      ratio: {
        auto: 'inline-flex',
        square: 'block w-full aspect-square',
        video: 'block w-full aspect-video',
        portrait: 'block w-full',
      },
      interactive: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      ratio: 'auto',
      interactive: false,
    },
  },
);

export const imageElementVariants = cva(
  'block h-full w-full rounded-[inherit] motion-reduce:transition-none',
  {
    variants: {
      fit: {
        cover: 'object-cover',
        contain: 'object-contain',
        fill: 'object-fill',
      },
      visible: {
        true: 'opacity-100',
        false: 'hidden opacity-0',
      },
    },
    defaultVariants: {
      fit: 'cover',
      visible: true,
    },
  },
);

export const imageFallbackVariants = cva(
  [
    'h-full w-full min-h-24 min-w-24 items-center justify-center rounded-[inherit]',
    'border border-dashed border-border bg-muted px-3 py-2 text-center text-sm font-medium text-muted-foreground',
  ].join(' '),
  {
    variants: {
      visible: {
        true: 'flex',
        false: 'hidden',
      },
    },
    defaultVariants: {
      visible: true,
    },
  },
);
