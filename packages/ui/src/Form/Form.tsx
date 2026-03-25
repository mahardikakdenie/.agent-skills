import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
  FormProvider,
  useController,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { Label } from '../Label';
import type {
  FormComponent,
  FormControlProps,
  FormDescriptionProps,
  FormFieldComponent,
  FormFieldProps,
  FormItemProps,
  FormLabelProps,
  FormMessageProps,
  FormProps,
} from './Form.types';
import {
  formDescriptionVariants,
  formItemVariants,
  formMessageVariants,
  formVariants,
} from './Form.variants';

interface FormFieldContextValue {
  name: string;
  disabled: boolean;
}

interface FormItemContextValue {
  id: string;
  descriptionId: string;
  messageId: string;
  hasDescription: boolean;
  setHasDescription: React.Dispatch<React.SetStateAction<boolean>>;
  hasMessage: boolean;
  setHasMessage: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);
const FormItemContext = React.createContext<FormItemContextValue | null>(null);

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error('Form components must be used within <FormField>.');
  }

  if (!itemContext) {
    throw new Error('Form components must be used within <FormItem>.');
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  return {
    name: fieldContext.name,
    disabled: fieldContext.disabled,
    formControlId: itemContext.id,
    formDescriptionId: itemContext.descriptionId,
    formMessageId: itemContext.messageId,
    hasDescription: itemContext.hasDescription,
    setHasDescription: itemContext.setHasDescription,
    hasMessage: itemContext.hasMessage,
    setHasMessage: itemContext.setHasMessage,
    ...fieldState,
  };
}

const FormBase = React.forwardRef(function Form(
  { form, className, noValidate = true, children, ...props }: FormProps<FieldValues>,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  return (
    <FormProvider {...form}>
      <Box
        as="form"
        ref={ref}
        data-slot="form"
        noValidate={noValidate}
        className={cn(formVariants(), className)}
        {...props}
      >
        {children}
      </Box>
    </FormProvider>
  );
});

FormBase.displayName = 'Form';

const Form = FormBase as unknown as FormComponent;

const FormFieldImpl = function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  rules,
  defaultValue,
  shouldUnregister,
  disabled = false,
  render,
}: FormFieldProps<TFieldValues, TName>) {
  const context = useFormContext<TFieldValues>();
  const controller = useController<TFieldValues, TName>({
    name,
    control: context.control,
    rules,
    defaultValue,
    shouldUnregister,
    disabled,
  });

  return (
    <FormFieldContext.Provider value={{ name: String(name), disabled }}>
      {render(controller)}
    </FormFieldContext.Provider>
  );
};

const FormField = FormFieldImpl as FormFieldComponent;

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, children, ...props }, ref) => {
    const generatedId = React.useId();
    const [hasDescription, setHasDescription] = React.useState(false);
    const [hasMessage, setHasMessage] = React.useState(false);

    return (
      <FormItemContext.Provider
        value={{
          id: `form-item-${generatedId}`,
          descriptionId: `form-item-${generatedId}-description`,
          messageId: `form-item-${generatedId}-message`,
          hasDescription,
          setHasDescription,
          hasMessage,
          setHasMessage,
        }}
      >
        <Box
          ref={ref}
          data-slot="form-item"
          className={cn(formItemVariants(), className)}
          {...props}
        >
          {children}
        </Box>
      </FormItemContext.Provider>
    );
  },
);

FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<React.ElementRef<typeof Label>, FormLabelProps>(
  ({ className, disabled, ...props }, ref) => {
    const { error, formControlId, disabled: fieldDisabled } = useFormField();

    return (
      <Label
        ref={ref}
        htmlFor={formControlId}
        tone={error ? 'destructive' : 'default'}
        disabled={disabled ?? fieldDisabled}
        className={className}
        {...props}
      />
    );
  },
);

FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, FormControlProps>(
  ({ children, ...props }, ref) => {
    const { error, formControlId, formDescriptionId, formMessageId, hasDescription, hasMessage } =
      useFormField();

    const describedBy =
      [hasDescription ? formDescriptionId : undefined, hasMessage ? formMessageId : undefined]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <Slot
        ref={ref}
        id={formControlId}
        aria-describedby={describedBy}
        aria-invalid={error ? 'true' : undefined}
        data-slot="form-control"
        {...props}
      >
        {children}
      </Slot>
    );
  },
);

FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    const { formDescriptionId, setHasDescription } = useFormField();

    React.useEffect(() => {
      setHasDescription(Boolean(children));

      return () => {
        setHasDescription(false);
      };
    }, [children, setHasDescription]);

    if (!children) {
      return null;
    }

    return (
      <Box
        as="p"
        ref={ref}
        id={formDescriptionId}
        data-slot="form-description"
        className={cn(formDescriptionVariants(), className)}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId, setHasMessage } = useFormField();

    const errorMessage =
      typeof error?.message === 'string'
        ? error.message
        : error?.message != null
          ? String(error.message)
          : undefined;
    const body = errorMessage ?? children;

    React.useEffect(() => {
      setHasMessage(Boolean(body));

      return () => {
        setHasMessage(false);
      };
    }, [body, setHasMessage]);

    if (!body) {
      return null;
    }

    return (
      <Box
        as="p"
        ref={ref}
        id={formMessageId}
        role="alert"
        data-slot="form-message"
        className={cn(formMessageVariants(), className)}
        {...props}
      >
        {body}
      </Box>
    );
  },
);

FormMessage.displayName = 'FormMessage';

export { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage };
