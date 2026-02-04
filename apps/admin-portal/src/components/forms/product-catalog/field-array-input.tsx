import {
  useFieldArray,
  Controller,
  Control,
  FieldErrors,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ArrayFieldProps = {
  name: string;
  label: string;
  control: Control<any>;
  errors: FieldErrors;
};

export function FieldArrayInput({
  name,
  label,
  control,
  errors,
}: ArrayFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-x-2 mb-2">
          <div className="space-y-1 w-full">
            <Controller
              name={`${name}.${index}`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder={`Insert ${label}`}
                  {...field}
                  className={`mt-1 block w-full h-12 ${
                    Array.isArray(errors[name]) && errors[name]?.[index]
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm`}
                />
              )}
            />
            {Array.isArray(errors[name]) && errors[name]?.[index] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[name][index].message}
              </p>
            )}
          </div>
          <Button
            type="button"
            onClick={() => remove(index)}
            variant="destructive"
            className="mt-2"
          >
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" onClick={() => append("")}>
        Add
      </Button>
    </div>
  );
}
