'use client';

import { EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useMemo } from 'react';
import { Check, Eye, Save, X } from 'react-feather';
import { Controller } from 'react-hook-form';

import {
  Box,
  Button,
  Combobox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  RadioGroup,
  RadioGroupItem,
  Textarea,
} from '@repo/ui';

import { PageHeader } from '@/components/core/page-header';
import { ContentLoadingWrapper } from '@/components/core/loading';
import AppURL from '@/constants/app-url.const';
import { renderEmailTemplateHtml } from '@/lib/email-template-html';

const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), {
  ssr: false,
  loading: () => (
    <Box as="p" className="text-sm text-slate-500">
      Loading editor...
    </Box>
  ),
});

interface EmailTemplateFormProps {
  mode: 'create' | 'edit';
  templateId?: string;

  handleSubmit: any;
  control: any;
  errors: any;
  setValue: any;
  watch: any;

  categories: any[];
  insurances: any[];
  products: any[];
  plans: any[];
  journeys: any[];
  emailTags: any[];

  editorState: EditorState;
  content: string;
  selectedTemplateType: string;

  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  selectedInsuranceId: string;
  setSelectedInsuranceId: (id: string) => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  selectedJourneyId: string;
  setSelectedJourneyId: (id: string) => void;

  isLoadingDetail: boolean;
  isLoadingCategories: boolean;
  isLoadingInsurances: boolean;
  isLoadingProducts: boolean;
  isLoadingPlans: boolean;
  isLoadingJourneys: boolean;
  isLoadingEmailTags: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
  onEditorChange: (state: EditorState) => void;
  onEditorInsert: (text: string) => void;
  onContentChange: (content: string) => void;
  onSelectTemplateType: (type: string) => void;
}

function FieldLabel({
  htmlFor,
  children,
  required = false,
}: {
  htmlFor: string;
  children: string;
  required?: boolean;
}) {
  return (
    <Box
      as="label"
      htmlFor={htmlFor}
      className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
    >
      {children}
      {required ? (
        <Box as="span" className="text-red-500">
          *
        </Box>
      ) : null}
    </Box>
  );
}

function FieldError({ children }: { children?: string }) {
  if (!children) {
    return null;
  }

  return (
    <Box as="p" className="text-red-500 text-xs mt-1">
      {children}
    </Box>
  );
}

function formatCategoryName(name: string) {
  return name
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function EmailTemplateForm({
  mode,
  handleSubmit,
  control,
  errors,
  setValue,
  watch,
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
  onSave,
  onBack,
  onEditorChange,
  onEditorInsert,
  onContentChange,
  onSelectTemplateType,
}: EmailTemplateFormProps) {
  const isEdit = mode === 'edit';
  const subject = watch('subject');
  const html = renderEmailTemplateHtml(editorState.getCurrentContent());
  const fieldTriggerClassName = 'bg-transparent border-slate-300';

  const categoryOptions = useMemo(
    () =>
      categories.map((category: any) => ({
        label: formatCategoryName(category.name),
        value: category.id,
      })),
    [categories],
  );

  const insuranceOptions = useMemo(
    () =>
      insurances.map((insurance: any) => ({
        label: insurance.name,
        value: insurance.id,
      })),
    [insurances],
  );

  const productOptions = useMemo(
    () =>
      products.map((product: any) => ({
        label: product.name,
        value: product.id,
      })),
    [products],
  );

  const planOptions = useMemo(
    () =>
      plans.map((plan: any) => ({
        label: plan.name,
        value: plan.id,
      })),
    [plans],
  );

  const journeyOptions = useMemo(
    () =>
      journeys.map((journey: any) => ({
        label: journey.name,
        value: journey.code,
      })),
    [journeys],
  );

  const emailTagOptions = useMemo(
    () =>
      emailTags.map((tag: any) => ({
        label: tag.tag,
        value: tag.id,
      })),
    [emailTags],
  );

  const breadcrumbs = [
    { label: 'Mail Template', href: AppURL.masterdataEmailTemplate },
    {
      label: isEdit ? 'Update Mail Template' : 'Create Mail Template',
      isCurrentPage: true,
    },
  ];

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Update Mail Template' : 'Create Mail Template'}
            breadcrumbs={breadcrumbs}
            showBackButton={true}
            onBackClick={onBack}
          >
            <Button
              type="submit"
              disabled={isSaving}
              className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
              leftIcon={
                isSaving ? undefined : isEdit ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )
              }
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </PageHeader>

          <Box className="grid grid-cols-12 w-full p-4 md:p-6 gap-6">
            <Box className="col-span-12 xl:col-span-4 p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-5 shadow-sm border border-slate-100">
              <Box as="h3" className="text-primary font-bold">
                Settings
              </Box>

              <Box>
                <FieldLabel htmlFor="templateType" required>
                  Choose Channel
                </FieldLabel>
                <RadioGroup
                  id="templateType"
                  value={selectedTemplateType}
                  orientation="horizontal"
                  onValueChange={onSelectTemplateType}
                >
                  <RadioGroupItem value="whatsapp" id="whatsapp" label="WhatsApp" />
                  <RadioGroupItem value="email" id="email" label="Email" />
                </RadioGroup>
              </Box>

              <Box>
                <FieldLabel htmlFor="category" required>
                  Product Category
                </FieldLabel>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Product Category is required' }}
                  render={({ field }) => (
                    <Combobox
                      id="category"
                      size="lg"
                      value={field.value}
                      onValueChange={(value) => {
                        const nextValue = value ?? '';

                        field.onChange(nextValue);
                        setSelectedCategoryId(nextValue);
                        setValue('insurance', '');
                        setValue('product', '');
                        setValue('plan', '');
                        setSelectedInsuranceId('');
                        setSelectedProductId('');
                      }}
                      options={categoryOptions}
                      loading={isLoadingCategories}
                      placeholder="Select Categories"
                      searchPlaceholder="Search categories..."
                      error={Boolean(errors.category)}
                      triggerClassName={fieldTriggerClassName}
                    />
                  )}
                />
                <FieldError>{errors.category?.message?.toString()}</FieldError>
              </Box>

              <Box>
                <FieldLabel htmlFor="insurance">Insurance</FieldLabel>
                <Controller
                  name="insurance"
                  control={control}
                  render={({ field }) => (
                    <Combobox
                      id="insurance"
                      size="lg"
                      value={field.value || ''}
                      onValueChange={(value) => {
                        const nextValue = value ?? '';

                        field.onChange(nextValue);
                        setSelectedInsuranceId(nextValue);
                        setValue('product', '');
                        setValue('plan', '');
                        setSelectedProductId('');
                      }}
                      options={insuranceOptions}
                      loading={isLoadingInsurances}
                      disabled={!selectedCategoryId}
                      clearable
                      placeholder="Select Insurance"
                      searchPlaceholder="Search insurance..."
                      triggerClassName={fieldTriggerClassName}
                    />
                  )}
                />
              </Box>

              <Box>
                <FieldLabel htmlFor="product">Product</FieldLabel>
                <Controller
                  name="product"
                  control={control}
                  render={({ field }) => (
                    <Combobox
                      id="product"
                      size="lg"
                      value={field.value || ''}
                      onValueChange={(value) => {
                        const nextValue = value ?? '';

                        field.onChange(nextValue);
                        setSelectedProductId(nextValue);
                        setValue('plan', '');
                      }}
                      options={productOptions}
                      loading={isLoadingProducts}
                      disabled={!selectedInsuranceId}
                      clearable
                      placeholder="Select Product"
                      searchPlaceholder="Search product..."
                      triggerClassName={fieldTriggerClassName}
                    />
                  )}
                />
              </Box>

              <Box>
                <FieldLabel htmlFor="plan">Plan</FieldLabel>
                <Controller
                  name="plan"
                  control={control}
                  render={({ field }) => (
                    <Combobox
                      id="plan"
                      size="lg"
                      value={selectedProductId ? field.value || '' : ''}
                      onValueChange={(value) => {
                        field.onChange(value ?? '');
                      }}
                      options={planOptions}
                      loading={isLoadingPlans}
                      disabled={!selectedProductId}
                      clearable
                      placeholder="Select Plan"
                      searchPlaceholder="Search plan..."
                      triggerClassName={fieldTriggerClassName}
                    />
                  )}
                />
              </Box>

              <Box>
                <FieldLabel htmlFor="journey" required>
                  Journey
                </FieldLabel>
                <Controller
                  name="journey"
                  control={control}
                  rules={{ required: 'Journey is required' }}
                  render={({ field }) => (
                    <Combobox
                      id="journey"
                      size="lg"
                      value={field.value || ''}
                      onValueChange={(value) => {
                        const nextValue = value ?? '';

                        field.onChange(nextValue);
                        setSelectedJourneyId(nextValue);
                      }}
                      options={journeyOptions}
                      loading={isLoadingJourneys}
                      placeholder="Select Journey"
                      searchPlaceholder="Search journey..."
                      error={Boolean(errors.journey)}
                      triggerClassName={fieldTriggerClassName}
                    />
                  )}
                />
                <FieldError>{errors.journey?.message?.toString()}</FieldError>
              </Box>

              <Box>
                <FieldLabel htmlFor="emailTag">Insert Tags to Template</FieldLabel>
                <Controller
                  name="emailTag"
                  control={control}
                  render={({ field }) => (
                    <Combobox
                      id="emailTag"
                      size="lg"
                      value={field.value}
                      onValueChange={(value) => {
                        if (!value) {
                          field.onChange('');
                          return;
                        }

                        field.onChange(value);
                        const selectedEmailTag = emailTags.find((tag) => tag.id === value);

                        if (selectedEmailTag) {
                          const tagValue = `{{${selectedEmailTag.tag}}}`;

                          if (selectedTemplateType === 'email') {
                            onEditorInsert(tagValue);
                            return;
                          }

                          const nextContent = `${content}${tagValue}`;
                          setValue('content', nextContent, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          onContentChange(nextContent);
                        }
                      }}
                      options={emailTagOptions}
                      loading={isLoadingEmailTags}
                      disabled={!selectedJourneyId}
                      clearable
                      placeholder="Select tag"
                      searchPlaceholder="Search tags..."
                      triggerClassName={fieldTriggerClassName}
                    />
                  )}
                />
              </Box>
            </Box>

            <Box className="col-span-12 xl:col-span-8 p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100">
              <Box className="flex items-center gap-4">
                <Box as="h3" className="text-primary font-bold">
                  Template
                </Box>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="ml-auto rounded-full"
                      leftIcon={<Eye className="w-4 h-4" />}
                    >
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="xl" className="dialog-email-template p-0 overflow-hidden">
                    <DialogHeader className="dialog-email-template-header">
                      <DialogTitle className="text-base font-semibold text-slate-900">
                        Preview Message
                      </DialogTitle>
                      <DialogDescription className="sr-only">Preview Message</DialogDescription>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-auto h-8 w-8 rounded-full p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </DialogClose>
                    </DialogHeader>

                    <Box className="dialog-email-template-body">
                      {selectedTemplateType === 'email' ? (
                        <Box className="dialog-email-template-meta">
                          <Box as="h3" className="text-base font-semibold text-slate-900">
                            {subject || '(No Subject)'}
                          </Box>
                          <Box className="text-xs text-slate-500">
                            Friendsure Teknologi Indonesia (no-reply@friendsure.id)
                          </Box>
                        </Box>
                      ) : null}

                      <Box className="editor-preview">
                        {selectedTemplateType === 'email' ? (
                          <Box dangerouslySetInnerHTML={{ __html: html }} />
                        ) : (
                          <Box>{content}</Box>
                        )}
                      </Box>
                    </Box>
                  </DialogContent>
                </Dialog>
              </Box>

              <Box>
                <FieldLabel htmlFor="subject" required>
                  {selectedTemplateType === 'email' ? 'Judul email' : 'Judul'}
                </FieldLabel>
                <Controller
                  name="subject"
                  control={control}
                  rules={{ required: 'Subject is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="subject"
                      type="text"
                      size="lg"
                      className="bg-transparent border-slate-300"
                      placeholder={
                        selectedTemplateType === 'email' ? 'Insert Judul Email' : 'Insert Judul'
                      }
                    />
                  )}
                />
                <FieldError>{errors.subject?.message?.toString()}</FieldError>
              </Box>

              <Box className="email-template-editor-shell min-h-[520px] rounded-lg bg-white">
                {selectedTemplateType === 'email' ? (
                  <Editor
                    editorState={editorState}
                    toolbarClassName="email-template-editor-toolbar"
                    wrapperClassName="email-template-editor-wrapper"
                    editorClassName="email-template-editor-main"
                    onEditorStateChange={onEditorChange}
                  />
                ) : (
                  <Textarea
                    id="content"
                    size="lg"
                    rows={20}
                    value={content}
                    onValueChange={(value) => {
                      setValue('content', value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      onContentChange(value);
                    }}
                    className="border-slate-300 bg-transparent"
                    textareaClassName="min-h-[500px] resize-none"
                    placeholder="Insert content"
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
