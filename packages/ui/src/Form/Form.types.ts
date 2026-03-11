import type * as React from 'react';
import type {
  FieldPath,
  FieldPathValue,
  FieldValues,
  RegisterOptions,
  UseControllerReturn,
  UseFormReturn,
} from 'react-hook-form';

import type { LabelProps } from '../Label';

export interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends React.FormHTMLAttributes<HTMLFormElement> {
  form: UseFormReturn<TFieldValues>;
  children?: React.ReactNode;
}

export type FormComponent = <TFieldValues extends FieldValues = FieldValues>(
  props: FormProps<TFieldValues> & React.RefAttributes<HTMLFormElement>,
) => React.ReactElement | null;

export type FormFieldRenderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Pick<UseControllerReturn<TFieldValues, TName>, 'field' | 'fieldState' | 'formState'>;

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  defaultValue?: FieldPathValue<TFieldValues, TName>;
  shouldUnregister?: boolean;
  disabled?: boolean;
  render: (props: FormFieldRenderProps<TFieldValues, TName>) => React.ReactNode;
}

export type FormFieldComponent = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FormFieldProps<TFieldValues, TName>,
) => React.ReactElement | null;

export type FormItemProps = React.HTMLAttributes<HTMLDivElement>;

export interface FormControlProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactElement;
}

export type FormLabelProps = Omit<LabelProps, 'htmlFor' | 'tone'>;

export type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}
