import { cva } from 'class-variance-authority'

export const skeletonVariants = cva(
  'animate-pulse rounded-md bg-muted motion-reduce:animate-none',
)
