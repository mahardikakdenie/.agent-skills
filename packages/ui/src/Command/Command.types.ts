import { Command as CommandPrimitive } from 'cmdk';
import * as React from 'react';

export interface CommandProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  /**
   * Accessible label announced for the command surface.
   *
   * @default 'Command menu'
   */
  label?: string;
}

export type CommandInputProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>;

export type CommandListProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>;

export type CommandEmptyProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>;

export type CommandGroupProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>;

export type CommandItemProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>;

export type CommandSeparatorProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>;

export type CommandShortcutProps = React.HTMLAttributes<HTMLSpanElement>;
