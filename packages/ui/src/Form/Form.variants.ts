import { cva } from 'class-variance-authority';

export const formVariants = cva('grid gap-6');

export const formItemVariants = cva('grid gap-2');

export const formDescriptionVariants = cva('text-sm text-muted-foreground');

export const formMessageVariants = cva('text-sm font-medium text-destructive');
