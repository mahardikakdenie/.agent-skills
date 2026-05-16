import { useFieldArray, Controller, Control, FieldErrors } from 'react-hook-form';

import { Box, Button, Input } from '@repo/ui';

type ArrayFieldProps = {
  name: string;
  label: string;
  control: Control<any>;
  errors: FieldErrors;
};

export function FieldArrayInput({ name, label, control, errors }: ArrayFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const getErrorMessage = (index: number) => {
    const fieldErrors = errors[name];

    if (!Array.isArray(fieldErrors)) {
      return undefined;
    }

    const message = fieldErrors[index]?.message;

    return typeof message === 'string' ? message : undefined;
  };

  return (
    <Box className="flex flex-col items-start gap-2">
      {fields.map((field, index) => (
        <Box
          key={field.id}
          className="grid w-full grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
        >
          <Box className="min-w-0">
            <Controller
              name={`${name}.${index}`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  type="text"
                  size="lg"
                  label={index === 0 ? label : undefined}
                  placeholder={`Insert ${label}`}
                  error={getErrorMessage(index)}
                  {...field}
                  className="bg-transparent"
                />
              )}
            />
          </Box>
          <Button
            type="button"
            onClick={() => remove(index)}
            variant="destructive"
            size="lg"
            className={`h-12 w-fit px-4 ${index === 0 ? 'sm:mt-[22px]' : ''}`}
          >
            Remove
          </Button>
        </Box>
      ))}
      <Button type="button" onClick={() => append('')} className="min-w-24 self-start px-5">
        Add
      </Button>
    </Box>
  );
}
