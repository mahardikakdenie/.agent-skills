'use client';

import EmailTemplateForm from '@/components/forms/email-template-form';
import { useEmailTemplateForm } from '@/hooks/useEmailTemplateForm.hooks';

export default function AddEmailTemplate() {
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
    setContent,
    selectedTemplateType,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    selectedProductId,
    setSelectedProductId,
    selectedJourneyId,
    setSelectedJourneyId,
    isLoadingCategories,
    isLoadingInsurances,
    isLoadingProducts,
    isLoadingPlans,
    isLoadingJourneys,
    isLoadingEmailTags,
    isSaving,
    watch,
    handleSave,
    handleEditorChange,
    handleEditorInsert,
    handleSelectTemplateType,
    goBack,
  } = useEmailTemplateForm('create');

  return (
    <EmailTemplateForm
      watch={watch}
      mode="create"
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
      isLoadingDetail={false}
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
      onContentChange={setContent}
      onSelectTemplateType={handleSelectTemplateType}
    />
  );
}
