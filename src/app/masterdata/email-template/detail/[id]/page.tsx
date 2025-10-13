"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, Eye, X } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { usePages } from "../../hooks";
import { useAuth } from "@/context/auth.context";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, Modifier, ContentState, convertFromHTML } from "draft-js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { stateToHTML } from "draft-js-export-html";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { EMAIL_TEMPLATE, FORBIDDEN } from "@/constants/routes";

export default function EditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const { id } = params;
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedInsuranceId, setSelectedInsuranceId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedJourneyId, setSelectedJourneyId] = useState("");
  const [emailTitlePreview, setEmailTitlePreview] = useState("");
  const html = stateToHTML(editorState.getCurrentContent());
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedTemplateType, setSelectedTemplateType] = useState<string | null>(null);

  const {
    categories = [],
    fetchCategories,
    fetchInsurances,
    insurances = [],
    products = [],
    fetchProductSelect,
    plans = [],
    fetchPlans,
    journey,
    fetchJourney,
    mailTemplateById,
    emailTag,
    updatePages,
    fetchEmailTag,
    fetchMailTemplateById,
  } = usePages();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: selectedCategoryId,
      insurance: selectedInsuranceId,
      product: selectedProductId,
      plan: selectedPlanId,
      journey: "",
      emailTag: "",
      subject: subject,
      content: content,
    },
  });
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Masterdata.Update");
      setHasAccess(access);
      if (!access) {
        router.push(FORBIDDEN);
      }
    };

    checkAccess();
    fetchCategories({});
    fetchJourney({});
    fetchMailTemplateById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, id]);

  useEffect(() => {
    if (mailTemplateById && mailTemplateById.length > 0) {
      const categoryValue = mailTemplateById[0].category || "";
      setValue("category", categoryValue);

      const insuraceValue = mailTemplateById[0].insurance ?? null;
      setValue("insurance", insuraceValue);

      const productValue = mailTemplateById[0].product ?? null;
      setValue("product", productValue);

      const planValue = mailTemplateById[0].plan ?? null;
      setValue("plan", planValue);

      setValue("journey", mailTemplateById[0].journey || "");

      const selectedJourney = journey.find(
        (jour) => jour.code === mailTemplateById[0].journey
      );

      if (selectedJourney) {
        setSelectedJourneyId(selectedJourney.code);
      }

      setValue("subject", mailTemplateById[0].subject || "");

      const blocksFromHTML = convertFromHTML(mailTemplateById[0].content);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );

      setEditorState(EditorState.createWithContent(contentState));
      setContent(mailTemplateById[0].content);
      setSubject(mailTemplateById[0].subject);
      setSelectedCategoryId(mailTemplateById[0].category);
      setSelectedInsuranceId(mailTemplateById[0].insurance ?? null);
      setSelectedProductId(mailTemplateById[0].product ?? null);
      setSelectedPlanId(mailTemplateById[0].plan ?? null);
      setSelectedJourneyId(mailTemplateById[0].journey);
      setEmailTitlePreview(mailTemplateById[0].subject);
      if (mailTemplateById[0].type) {
        setSelectedTemplateType(mailTemplateById[0].type);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mailTemplateById, selectedCategoryId]);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchInsurances({
        page: 1,
        categoryId: selectedCategoryId,
      });
    }
    if (selectedInsuranceId) {
      fetchProductSelect({
        page: 1,
        insuranceId: selectedInsuranceId,
      });
    }
    if (selectedProductId) {
      fetchPlans({
        page: 1,
        productId: selectedProductId,
      });
    }
    if (selectedJourneyId) {
      fetchEmailTag({
        page: 1,
        pageSize: 100,
        journey: selectedJourneyId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCategoryId,
    selectedInsuranceId,
    selectedProductId,
    selectedJourneyId,
  ]);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);

    let htmlContent = stateToHTML(state.getCurrentContent());
    htmlContent = htmlContent
      .replace(/\s+/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/ {2}/g, " ");

    setContent(htmlContent);
  };

  const handleEditorInsert = (text: string) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    const newContentState = Modifier.replaceText(
      contentState,
      selectionState,
      text
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-characters"
    );
    setEditorState(newEditorState);
  };

  const onSubmit = async (data: any) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries({ ...data })
          .map(([key, value]) => [key, value === "" ? null : value])
          .filter(([_, value]) => value !== undefined)
      );

      const requestData = {
        ...cleanedData,
        content,
        type: selectedTemplateType,
      };

      delete (requestData as any).emailTag;

      const response = await updatePages(requestData, id);
      if (response.id != null) {
        router.back();
      }
      setUpdateSuccess(true);
    } catch (error) {
      setUpdateSuccess(false);
    }
  };

  useEffect(() => {
    if (updateSuccess === true) {
      alert("Data has been successfully saved!");
      router.replace(EMAIL_TEMPLATE);
    } else if (updateSuccess === false) {
      alert("Email Tag has already been used for this Journey!");
    }
    setUpdateSuccess(null);
  }, [updateSuccess, router]);

  const handleSelectTemplateType = (value: string) => {
      // Reset content input field
      setContent("");
      setEditorState(EditorState.createEmpty());
      setSelectedTemplateType(value);
    };

  return (
    <div className="flex flex-col w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white md:px-6 p-4 flex items-center">
          <div>
            <Breadcrumb className="sm:block hidden">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Masterdata</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="cursor-pointer"
                    onClick={() => router.back()}
                  >
                    Mail Template
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              Edit New Mail Template
            </h2>
          </div>

          <div className="flex ml-auto">
            <div
              onClick={() => router.back()}
              className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </div>
            <Button
              type="submit"
              className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
            >
              <Check className="mr-2 w-4 h-4" />
              Save
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
                  value={selectedTemplateType || "email"}
                  className="flex flex-row gap-4"
                  onValueChange={handleSelectTemplateType}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="whatsapp" id="whatsapp" />
                    <Label className="text-sm" htmlFor="whatsapp">WhatsApp</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label className="text-sm" htmlFor="email">Email</Label>
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
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger
                      id="category"
                      className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2"
                    >
                      <SelectValue placeholder="Select Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((categorie: any) => (
                          <SelectItem key={categorie.id} value={categorie.id}>
                            {categorie?.name
                              .split("-")
                              .map(
                                (word: string) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </SelectItem>
                        ))}
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
                    value={selectedInsuranceId ?? ""}
                    disabled={!selectedCategoryId}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedInsuranceId(value);
                    }}
                  >
                    <SelectTrigger
                      id="insurance"
                      className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2"
                    >
                      <SelectValue placeholder="Select Insurance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {insurances.map((insurance: any) => (
                          <SelectItem key={insurance.id} value={insurance.id}>
                            {insurance.name}
                          </SelectItem>
                        ))}
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
                    value={selectedProductId ?? ""}
                    disabled={!selectedInsuranceId}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedProductId(value);
                      const selectedProduct = products.find(
                        (prod) => prod.id === value
                      );
                      if (selectedProduct) {
                        handleEditorInsert(`${selectedProduct.name}\n`);
                      }
                    }}
                  >
                    <SelectTrigger
                      id="product"
                      className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2"
                    >
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {products.map((prod: any) => (
                          <SelectItem key={prod.id} value={prod.id}>
                            {prod.name}
                          </SelectItem>
                        ))}
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
                    key={selectedPlanId}
                    value={selectedPlanId ?? ""}
                    disabled={!selectedProductId}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedPlanId(value);
                    }}
                  >
                    <SelectTrigger
                      id="plan"
                      className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2"
                    >
                      <SelectValue placeholder="Select Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {plans.map((plan: any) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {selectedPlanId && (
                <button
                  type="button"
                  className="absolute right-8 top-10 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setValue("plan", "", { shouldValidate: true });
                    setSelectedPlanId("");
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
                    value={selectedJourneyId ?? ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedJourneyId(value);
                    }}
                  >
                    <SelectTrigger
                      id="journey"
                      className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2"
                    >
                      <SelectValue placeholder="Select Journey" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {journey.map((jour: any) => (
                          <SelectItem key={jour.id} value={jour.code}>
                            {jour.name}
                          </SelectItem>
                        ))}
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedEmailTag = emailTag.find(
                        (tag) => tag.id === value
                      );
                      if (selectedEmailTag) {
                        handleEditorInsert(`{{${selectedEmailTag.tag}}}\n`);
                      }
                    }}
                  >
                    <SelectTrigger
                      id="emailTag"
                      className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2"
                    >
                      <SelectValue placeholder="Select tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {emailTag.map((tag: any) => (
                          <SelectItem key={tag.id} value={tag.id}>
                            {tag.tag}
                          </SelectItem>
                        ))}
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
                      <VisuallyHidden>This title is provided to prevent DialogTitle warning</VisuallyHidden>
                    </DialogTitle>
                    <DialogDescription>
                      <div className="bg-primary absolute top-0 left-0 text-white flex items-center w-full py-1 px-5">
                        <div className="text-sm font-semibold">
                          Preview Message
                        </div>
                        <DialogClose asChild>
                          <Button
                            type="button"
                            className="ml-auto bg-transparent p-0 text-white hover:bg-transparent  "
                          >
                            <X />
                          </Button>
                        </DialogClose>
                      </div>
                      {
                        selectedTemplateType === "email" ? (
                          <>
                            <h3 className="text-black text-lg font-semibold mb-2">
                              {emailTitlePreview}
                            </h3>
                            <div className="text-xs">
                              Friendsure Teknologi Indonesia (no-reply@friendsure.id)
                            </div>
                          </>
                        ) : null
                      }
                      <div className="mt-6 bg-white rounded-lg">
                        <div className="editor-preview">
                        {
                          selectedTemplateType === "email" ? (
                            <div dangerouslySetInnerHTML={{ __html: html }} />
                          ) : (
                            <div>{content}</div>
                          )
                        }
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
              {
                selectedTemplateType === "email" ? "Judul email" : "Judul"
              }
              <span className="text-red-500">*</span>
            </label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="subject"
                  type="text"
                  placeholder={selectedTemplateType === "email" ? "Insert Judul Email" : "Insert Judul"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setEmailTitlePreview(e.target.value);
                  }}
                />
              )}
            />

            <div className="mt-4">
            {
                selectedTemplateType === "email" ? (
                  <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={handleEditorChange}
                  />
                ) : (
                  <textarea
                    name=""
                    id=""
                    rows={20}
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                    }}
                    className="w-full text-sm p-2 border border-gray-200 rounded-md"
                    placeholder="Insert content"
                  >
                  </textarea>
                )
              }
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};