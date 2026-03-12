import { cva } from 'class-variance-authority';

export const commandRootVariants = cva(
  [
    'flex h-full w-full flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md',
    'motion-reduce:transition-none',
  ].join(' '),
);

export const commandInputRowVariants = cva(
  [
    'flex items-center gap-2 border-b border-border px-3',
    'focus-within:ring-2 focus-within:ring-ring/20',
    'motion-reduce:transition-none',
  ].join(' '),
);

export const commandInputIconVariants = cva('shrink-0 text-muted-foreground');

export const commandInputVariants = cva(
  'flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
);

export const commandListVariants = cva('max-h-[320px] overflow-y-auto overflow-x-hidden p-1');

export const commandEmptyVariants = cva('px-3 py-6 text-center text-sm text-muted-foreground');

export const commandGroupVariants = cva(
  [
    'overflow-hidden p-1 text-foreground',
    '[&_[cmdk-group-heading]]:px-2',
    '[&_[cmdk-group-heading]]:py-1.5',
    '[&_[cmdk-group-heading]]:text-xs',
    '[&_[cmdk-group-heading]]:font-medium',
    '[&_[cmdk-group-heading]]:uppercase',
    '[&_[cmdk-group-heading]]:tracking-wide',
    '[&_[cmdk-group-heading]]:text-muted-foreground',
  ].join(' '),
);

export const commandSeparatorVariants = cva('-mx-1 h-px bg-border');

export const commandItemVariants = cva(
  [
    'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-2 text-sm outline-none transition-colors',
    'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
    'data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
    'motion-reduce:transition-none',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ].join(' '),
);

export const commandShortcutVariants = cva('ml-auto text-xs uppercase tracking-widest text-muted-foreground');
