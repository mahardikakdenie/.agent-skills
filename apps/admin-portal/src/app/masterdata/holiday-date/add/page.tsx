"use client";

import { useHolidayDateForm } from "@/hooks/useHolidayDateForm.hooks";
import HolidayDateForm from "@/components/forms/HolidayDateForm";

export default function CreateHoliday() {
  const {
    handleSubmit,
    control,
    errors,
    setValue,
    watch,
    types,
    countries,
    isSaving,
    handleSave,
    goBack,
  } = useHolidayDateForm("create");

  return (
    <HolidayDateForm
      mode="create"
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      setValue={setValue}
      watch={watch}
      types={types}
      countries={countries}
      isLoadingDetail={false}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
    />
  );
}
