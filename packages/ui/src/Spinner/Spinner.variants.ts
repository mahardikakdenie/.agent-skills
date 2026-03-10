import { cva } from 'class-variance-authority'

export const spinnerVariants = cva('items-center justify-center', {
  variants: {
    size: {
      sm: 'gap-2 text-xs',
      md: 'gap-2.5 text-sm',
      lg: 'gap-3 text-base',
    },
    layout: {
      default: 'flex w-full flex-col',
      inline: 'inline-flex w-auto flex-row',
      overlay: 'fixed inset-0 z-50 flex w-full flex-col bg-background/80 backdrop-blur-sm',
    },
  },
  defaultVariants: {
    size: 'md',
    layout: 'default',
  },
})

export const spinnerIconVariants = cva('inline-flex shrink-0 items-center justify-center text-primary', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const spinnerIconRingVariants = cva(
  'block size-full rounded-full border-2 border-current border-b-transparent animate-spin motion-reduce:animate-none',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

export const spinnerLabelVariants = cva('text-center text-muted-foreground', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
    layout: {
      default: '',
      inline: 'text-left',
      overlay: 'max-w-xs',
    },
  },
  defaultVariants: {
    size: 'md',
    layout: 'default',
  },
})
