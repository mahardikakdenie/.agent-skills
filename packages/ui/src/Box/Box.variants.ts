import { cva } from 'class-variance-authority';

export const boxVariants = cva('', {
  variants: {
    padding: {
      none: '',
      sm: 'px-4 sm:px-5',
      md: 'px-4 sm:px-6 lg:px-7',
      lg: 'px-4 sm:px-6 lg:px-8 xl:px-10',
    },
    container: {
      sm: 'mx-auto w-full max-w-screen-sm',
      md: 'mx-auto w-full max-w-screen-md',
      lg: 'mx-auto w-full max-w-screen-lg',
      xl: 'mx-auto w-full max-w-screen-xl',
      full: 'mx-auto w-full max-w-full',
    },
    centered: {
      false: '',
      true: 'flex items-center justify-center',
    },
  },
  defaultVariants: {
    padding: 'none',
    centered: false,
  },
});
