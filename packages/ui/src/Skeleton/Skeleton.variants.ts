import { cva } from 'class-variance-authority'

export const skeletonVariants = cva(
  [
    'relative isolate block animate-pulse overflow-hidden rounded-md bg-[hsl(var(--muted-foreground)/0.22)]',
    'shadow-[inset_0_0_0_1px_hsl(var(--border)/0.52)]',
    "after:absolute after:inset-0 after:bg-[linear-gradient(180deg,hsl(var(--background)/0.08),transparent_45%,hsl(var(--foreground)/0.03))] after:content-['']",
    "before:absolute before:inset-y-0 before:left-0 before:w-[55%] before:min-w-[4rem] before:[transform:translateX(-150%)_skewX(-18deg)] before:bg-[linear-gradient(90deg,transparent_0%,hsl(var(--background)/0.22)_12%,hsl(var(--background)/1)_50%,hsl(var(--background)/0.22)_88%,transparent_100%)] before:shadow-[0_0_34px_hsl(var(--background)/0.85)] before:content-[''] before:animate-skeleton-shimmer",
  ].join(' '),
)
