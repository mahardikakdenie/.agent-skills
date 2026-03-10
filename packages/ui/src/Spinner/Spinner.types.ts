import type * as React from 'react'

export const spinnerSizeValues = ['sm', 'md', 'lg'] as const

export type SpinnerSize = (typeof spinnerSizeValues)[number]

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize
  label?: string
  inline?: boolean
  overlay?: boolean
}
