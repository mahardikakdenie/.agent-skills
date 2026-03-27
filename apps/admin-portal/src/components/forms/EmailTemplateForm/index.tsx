"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Check, ChevronLeft, Eye, X } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui";
import { Input } from "@repo/ui";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { EditorState } from "draft-js";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { stateToHTML } from "draft-js-export-html";
import { RadioGroup, RadioGroupItem } from "@repo/ui";
import { Label } from "@radix-ui/react-label";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

interface EmailTemplateFormProps {
  mode: "create" | "edit";
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
  onSelectTemplateType: (type: string) => void;
}

export default function EmailTemplateForm({
  mode,
  templateId,
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
  onSelectTemplateType,
}: EmailTemplateFormProps) {
  const isEdit = mode === "edit";
  const subject = watch("subject");
  const html = stateToHTML(editorState.getCurrentContent());

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <div className="flex flex-col w-full">
        <form onSubmit={handleSubmit(onSave)}>
          <div className="bg-white md:px-6 p-4 flex items-center">
            <div>
              <Breadcrumb className="sm:block hidden">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink>Masterdata</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink className="cursor-pointer" onClick={onBack}>
                      Mail Template
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{isEdit ? "Edit" : "Add"}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
                {isEdit ? "Edit Mail Template" : "Add New Mail Template"}
              </h2>
            </div>

            <div className="flex ml-auto">
              <div
                onClick={onBack}
                className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </div>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
              >
                <Check className="mr-2 w-4 h-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-6 w-full p-4 md:p-6 gap-4">
            <div className="md:col-span-2 col-span-6 p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4">
              <div className="text-primary font-bold">Settings</div>

              <div>
                <label
                  htmlFor="templateType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Choose Channel<span className="text-red-500">*</span>
                </label>
                <div>
                  <RadioGroup
                    defaultValue={selectedTemplateType}
                    className="flex flex-row gap-4"
                    onValueChange={onSelectTemplateType}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="whatsapp" id="whatsapp" />
                      <Label className="text-sm" htmlFor="whatsapp">
                        WhatsApp
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label className="text-sm" htmlFor="email">
                        Email
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Category<span className="text-red-500">*</span>
                </label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Product Category is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedCategoryId(value);
                        setValue("insurance", "");
                        setValue("product", "");
                        setValue("plan", "");
                        setSelectedInsuranceId("");
                        setSelectedProductId("");
                      }}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {isLoadingCategories ? (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              Loading...
                            </div>
                          ) : (
                            categories.map((categorie: any) => (
                              <SelectItem
                                key={categorie.id}
                                value={categorie.id}
                              >
                                {categorie.name
                                  .split("-")
                                  .map(
                                    (word: string) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1)
                                  )
                                  .join(" ")}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.category.message?.toString()}
                  </p>
                )}
              </div>

              <div className="relative field-combobox">
                <label
                  htmlFor="insurance"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Insurance
                </label>
                <Controller
                  name="insurance"
                  control={control}
                  render={({ field }) => (
                    <Select
                      key={selectedInsuranceId}
                      value={selectedInsuranceId || ""}
                      disabled={!selectedCategoryId}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedInsuranceId(value);
                        setValue("product", "");
                        setValue("plan", "");
                        setSelectedProductId("");
                      }}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Insurance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {isLoadingInsurances ? (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              Loading...
                            </div>
                          ) : insurances.length > 0 ? (
                            insurances.map((insurance: any) => (
                              <SelectItem
                                key={insurance.id}
                                value={insurance.id}
                              >
                                {insurance.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              No insurances available
                            </div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {selectedInsuranceId && (
                  <button
                    type="button"
                    className="absolute right-8 top-10 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setValue("insurance", "", { shouldValidate: true });
                      setSelectedInsuranceId("");
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="relative field-combobox">
                <label
                  htmlFor="product"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product
                </label>
                <Controller
                  name="product"
                  control={control}
                  render={({ field }) => (
                    <Select
                      key={selectedProductId}
                      value={selectedProductId || ""}
                      disabled={!selectedInsuranceId}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedProductId(value);
                        setValue("plan", "");
                      }}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {isLoadingProducts ? (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              Loading...
                            </div>
                          ) : products.length > 0 ? (
                            products.map((prod: any) => (
                              <SelectItem key={prod.id} value={prod.id}>
                                {prod.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              No products available
                            </div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {selectedProductId && (
                  <button
                    type="button"
                    className="absolute right-8 top-10 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setValue("product", "", { shouldValidate: true });
                      setSelectedProductId("");
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="relative field-combobox">
                <label
                  htmlFor="plan"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Plan
                </label>
                <Controller
                  name="plan"
                  control={control}
                  render={({ field }) => (
                    <Select
                      key={selectedProductId}
                      value={selectedProductId ? field.value || "" : ""}
                      disabled={!selectedProductId}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {isLoadingPlans ? (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              Loading...
                            </div>
                          ) : plans.length > 0 ? (
                            plans.map((plan: any) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              No plans available
                            </div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {watch("plan") && (
                  <button
                    type="button"
                    className="absolute right-8 top-10 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setValue("plan", "", { shouldValidate: true });
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div>
                <label
                  htmlFor="journey"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Journey<span className="text-red-500">*</span>
                </label>
                <Controller
                  name="journey"
                  control={control}
                  rules={{ required: "Journey is required" }}
                  render={({ field }) => (
                    <Select
                      key={selectedJourneyId}
                      value={selectedJourneyId || ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedJourneyId(value);
                      }}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Journey" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {isLoadingJourneys ? (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              Loading...
                            </div>
                          ) : (
                            journeys.map((jour: any) => (
                              <SelectItem key={jour.id} value={jour.code}>
                                {jour.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.journey && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.journey.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="emailTag"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Insert Tags to Template
                </label>
                <Controller
                  name="emailTag"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      disabled={!selectedJourneyId}
                      onValueChange={(value) => {
                        field.onChange(value);
                        const selectedEmailTag = emailTags.find(
                          (tag) => tag.id === value
                        );
                        if (selectedEmailTag) {
                          onEditorInsert(`{{${selectedEmailTag.tag}}}`);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {isLoadingEmailTags ? (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              Loading...
                            </div>
                          ) : emailTags.length > 0 ? (
                            emailTags.map((tag: any) => (
                              <SelectItem key={tag.id} value={tag.id}>
                                {tag.tag}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              No tags available
                            </div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="md:col-span-4 col-span-6 p-4 sm:p-6 bg-white rounded-lg flex flex-col relative">
              <div className="absolute top-5 right-5">
                <Dialog>
                  <DialogTrigger className="inline-flex border rounded-full border-gray-500 gap-1 py-1 px-3 text-sm items-center">
                    <Eye className="w-4 h-4" /> Preview
                  </DialogTrigger>
                  <DialogContent className="dialog-email-template overflow-hidden">
                    <DialogHeader>
                      <DialogTitle>
                        <VisuallyHidden>
                          This title is provided to prevent DialogTitle warning
                        </VisuallyHidden>
                      </DialogTitle>
                      <DialogDescription>
                        <div className="bg-primary absolute top-0 left-0 text-white flex items-center w-full py-1 px-5">
                          <div className="text-sm font-semibold">
                            Preview Message
                          </div>
                          <DialogClose asChild>
                            <Button
                              type="button"
                              className="ml-auto bg-transparent p-0 text-white hover:bg-transparent"
                            >
                              <X />
                            </Button>
                          </DialogClose>
                        </div>
                        {selectedTemplateType === "email" ? (
                          <>
                            <h3 className="text-black text-lg font-semibold mb-2">
                              {subject || "(No Subject)"}
                            </h3>
                            <div className="text-xs">
                              Friendsure Teknologi Indonesia
                              (no-reply@friendsure.id)
                            </div>
                          </>
                        ) : null}
                        <div className="mt-6 bg-white rounded-lg">
                          <div className="editor-preview">
                            {selectedTemplateType === "email" ? (
                              <div dangerouslySetInnerHTML={{ __html: html }} />
                            ) : (
                              <div>{content}</div>
                            )}
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="text-primary font-bold mb-4">Template</div>

              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {selectedTemplateType === "email" ? "Judul email" : "Judul"}
                <span className="text-red-500">*</span>
              </label>
              <Controller
                name="subject"
                control={control}
                rules={{ required: "Subject is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder={
                      selectedTemplateType === "email"
                        ? "Insert Judul Email"
                        : "Insert Judul"
                    }
                  />
                )}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.subject.message?.toString()}
                </p>
              )}

              <div className="mt-4">
                {selectedTemplateType === "email" ? (
                  <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={onEditorChange}
                  />
                ) : (
                  <textarea
                    name=""
                    id=""
                    rows={20}
                    value={content}
                    onChange={(e) => {
                      setValue("content", e.target.value);
                    }}
                    className="w-full text-sm p-2 border border-gray-200 rounded-md"
                    placeholder="Insert content"
                  ></textarea>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </ContentLoadingWrapper>
  );
}

