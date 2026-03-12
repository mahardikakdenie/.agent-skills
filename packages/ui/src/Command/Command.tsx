import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import type {
  CommandEmptyProps,
  CommandGroupProps,
  CommandInputProps,
  CommandItemProps,
  CommandListProps,
  CommandProps,
  CommandSeparatorProps,
  CommandShortcutProps,
} from './Command.types';
import {
  commandEmptyVariants,
  commandGroupVariants,
  commandInputIconVariants,
  commandInputRowVariants,
  commandInputVariants,
  commandItemVariants,
  commandListVariants,
  commandRootVariants,
  commandSeparatorVariants,
  commandShortcutVariants,
} from './Command.variants';

/**
 * Shared low-level command surface built on cmdk.
 *
 * The component family stays compound so consumers can compose inline command
 * lists or dialog-based command palettes without widening the shared API into
 * a rigid `items[]` schema.
 */
export const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, CommandProps>(
  ({ className, label = 'Command menu', ...props }, ref) => (
    <CommandPrimitive
      ref={ref}
      label={label}
      data-slot="command"
      className={cn(commandRootVariants(), className)}
      {...props}
    />
  ),
);

Command.displayName = 'Command';

export const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(({ className, autoComplete = 'off', spellCheck = false, ...props }, ref) => (
  <Box data-slot="command-input-row" cmdk-input-wrapper="" className={commandInputRowVariants()}>
    <Box as="span" aria-hidden="true" data-slot="command-input-icon" className={commandInputIconVariants()}>
      <Search className="h-4 w-4" />
    </Box>
    <CommandPrimitive.Input
      ref={ref}
      autoComplete={autoComplete}
      spellCheck={spellCheck}
      className={cn(commandInputVariants(), className)}
      {...props}
    />
  </Box>
));

CommandInput.displayName = 'CommandInput';

export const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  CommandListProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    data-slot="command-list"
    className={cn(commandListVariants(), className)}
    {...props}
  />
));

CommandList.displayName = 'CommandList';

export const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  CommandEmptyProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    data-slot="command-empty"
    className={cn(commandEmptyVariants(), className)}
    {...props}
  />
));

CommandEmpty.displayName = 'CommandEmpty';

export const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  CommandGroupProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    data-slot="command-group"
    className={cn(commandGroupVariants(), className)}
    {...props}
  />
));

CommandGroup.displayName = 'CommandGroup';

export const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    data-slot="command-item"
    className={cn(commandItemVariants(), className)}
    {...props}
  />
));

CommandItem.displayName = 'CommandItem';

export const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    data-slot="command-separator"
    className={cn(commandSeparatorVariants(), className)}
    {...props}
  />
));

CommandSeparator.displayName = 'CommandSeparator';

export const CommandShortcut = React.forwardRef<HTMLSpanElement, CommandShortcutProps>(
  ({ className, ...props }, ref) => (
    <Box
      ref={ref}
      as="span"
      data-slot="command-shortcut"
      className={cn(commandShortcutVariants(), className)}
      {...props}
    />
  ),
);

CommandShortcut.displayName = 'CommandShortcut';
