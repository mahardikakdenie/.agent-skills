"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useEmailTemplateForm } from "@/hooks/useEmailTemplateForm.hooks";
import EmailTemplateForm from "@/components/forms/EmailTemplateForm";

export default function EditEmailTemplate() {
  const params = useParams();
  const templateId =
    typeof params.id === "string" ? params.id : params.id?.[0] || "";

  const {
    handleSubmit,
    control,
    errors,
    setValue,
    categories,
    insurances,
    products,
    plans,
    journeys,
    emailTags,
    editorState,
    content,
    selectedTemplateType,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    selectedProductId,
    setSelectedProductId,
    selectedJourneyId,
    setSelectedJourneyId,
    isLoadingDetail,
    isLoadingCategories,
    isLoadingInsurances,
    isLoadingProducts,
    isLoadingPlans,
    isLoadingJourneys,
    isLoadingEmailTags,
    isSaving,
    watch,
    handleSave,
    loadTemplateDetail,
    handleEditorChange,
    handleEditorInsert,
    handleSelectTemplateType,
    goBack,
  } = useEmailTemplateForm("edit");

  useEffect(() => {
    if (templateId) {
      loadTemplateDetail(templateId);
    }
  }, [templateId, loadTemplateDetail]);

  return (
    <EmailTemplateForm
      mode="edit"
      watch={watch}
      templateId={templateId}
      handleSubmit={handleSubmit}
      control={control}
      errors={errors}
      setValue={setValue}
      categories={categories}
      insurances={insurances}
      products={products}
      plans={plans}
      journeys={journeys}
      emailTags={emailTags}
      editorState={editorState}
      content={content}
      selectedTemplateType={selectedTemplateType}
      selectedCategoryId={selectedCategoryId}
      setSelectedCategoryId={setSelectedCategoryId}
      selectedInsuranceId={selectedInsuranceId}
      setSelectedInsuranceId={setSelectedInsuranceId}
      selectedProductId={selectedProductId}
      setSelectedProductId={setSelectedProductId}
      selectedJourneyId={selectedJourneyId}
      setSelectedJourneyId={setSelectedJourneyId}
      isLoadingDetail={isLoadingDetail}
      isLoadingCategories={isLoadingCategories}
      isLoadingInsurances={isLoadingInsurances}
      isLoadingProducts={isLoadingProducts}
      isLoadingPlans={isLoadingPlans}
      isLoadingJourneys={isLoadingJourneys}
      isLoadingEmailTags={isLoadingEmailTags}
      isSaving={isSaving}
      onSave={handleSave}
      onBack={goBack}
      onEditorChange={handleEditorChange}
      onEditorInsert={handleEditorInsert}
      onSelectTemplateType={handleSelectTemplateType}
    />
  );
}
