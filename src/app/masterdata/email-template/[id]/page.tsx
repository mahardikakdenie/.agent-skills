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
import useRequireAuth from "@/hooks/useRequireAuth";
import { Input } from "@/components/ui/input";
import WithSidebar from "@/hoc/with-sidebar";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, Eye, X } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { usePages } from "../hooks";
import { hasPermission } from "@/context/auth.context";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { stateToHTML } from "draft-js-export-html";

const EditPage = ({ params }: { params: { id: string } }) => {
  useRequireAuth();
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
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [category] = useState("");
  const [insurance] = useState("");
  const [product] = useState("");
  const [plan] = useState("");

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
    emailTag,
    updatePages,
    fetchEmailTag,
    fetchMailTemplateById,
    mailTemplate,
  } = usePages();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "",
      insurance: undefined,
      product: undefined,
      plan: undefined,
      journey: "",
      emailTag: "",
      subject: "",
      content: content,
    },
    values: {
      category,
      insurance,
      product,
      plan,
      journey,
      subject,
    },
  });

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

  useEffect(() => {
    fetchMailTemplateById(id);
    fetchJourney({});
    fetchInsurances({});
    fetchProductSelect({});
    fetchPlans({});
    fetchEmailTag({});
  }, [id]);

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Masterdata.Edit");
      setHasAccess(access);
      if (!access) {
        router.push("/forbidden");
      }
    };

    checkAccess();
    fetchCategories({});
  }, [router]);

  useEffect(() => {
    if (selectedInsuranceId) {
      fetchProductSelect({
        insuranceId: selectedInsuranceId,
      });
    }
  }, [selectedInsuranceId]);

  useEffect(() => {
    if (selectedProductId) {
      fetchPlans({
        product: selectedProductId,
      });
    }
  }, [selectedProductId]);

  useEffect(() => {
    if (mailTemplate && mailTemplate.length > 0) {
      setValue("category", mailTemplate[0].category);
      setValue("insurance", mailTemplate[0].insurance ?? null);
      setValue("product", mailTemplate[0].product ?? null);
      setValue("plan", mailTemplate[0].plan ?? null);
      setValue("journey", mailTemplate[0].journey);
      setValue("subject", mailTemplate[0].subject);

      const selectedJourney = journey.find(
        (jour) => jour.code === mailTemplate[0].journey
      );
      if (selectedJourney) {
        setSelectedJourneyId(selectedJourney.code); // Store journey ID if needed
      }

      const blocksFromHTML = convertFromHTML(mailTemplate[0].content);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setEditorState(EditorState.createWithContent(contentState));
      setContent(mailTemplate[0].content);
      setSubject(mailTemplate[0].subject);
      setSelectedCategoryId(mailTemplate[0].category);
      setSelectedInsuranceId(mailTemplate[0].insurance ?? null);
      setSelectedProductId(mailTemplate[0].product ?? null);
      setSelectedPlanId(mailTemplate[0].plan ?? null);
      setSelectedJourneyId(mailTemplate[0].journey);
      setEmailTitlePreview(mailTemplate[0].subject);
    }
  }, [mailTemplate, journey]);

  const onSubmit = async (data: any) => {
    try {
      const requestData = {
        ...data,
        content,
      };
      console.log(requestData);

      delete requestData.emailTag;
      const response = await updatePages(requestData, id);
      if (response.id != null) {
        router.back();
      }
    } catch (error) {
      setUpdateSuccess(false);
    }
  };

  useEffect(() => {
    if (saveSuccess === true) {
      alert("Data berhasil disimpan!");
      router.back();
    } else if (saveSuccess === false) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
    setSaveSuccess(null);
  }, [saveSuccess, router]);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const htmlContent = stateToHTML(state.getCurrentContent());
    setContent(htmlContent);
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
                    }}
                  >
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                      <SelectValue placeholder="Select Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((categorie: any) => (
                          <SelectItem key={categorie.id} value={categorie.id}>
                            {categorie.name
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

            <div>
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
                    value={field.value}
                    disabled={!selectedCategoryId}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedInsuranceId(value);
                    }}
                  >
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
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
              {errors.insurance && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.insurance.message?.toString()}
                </p>
              )}
            </div>
            <div>
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
                    value={field.value}
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
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
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
              {errors.product && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.product.message?.toString()}
                </p>
              )}
            </div>

            <div>
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
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedPlanId(value);
                    }}
                  >
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
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
              {errors.plan && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.plan.message?.toString()}
                </p>
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
                    value={field.value.toString()}
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
                        {journey.map((jour: any) => (
                          <SelectItem key={jour.code} value={jour.code}>
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
                    // disabled={!selectedInsuranceId}
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
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
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
                      <h3 className="text-black text-lg font-semibold mb-2">
                        {emailTitlePreview}
                      </h3>
                      <div className="text-xs">
                        Friendsure Teknologi Indonesia (no-reply@friendsure.id)
                      </div>
                      <div className="mt-6 bg-white rounded-lg">
                        <div className="editor-preview">
                          <div dangerouslySetInnerHTML={{ __html: html }} />
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
              Judul email<span className="text-red-500">*</span>
            </label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="Insert Judul Email"
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />

            <div className="mt-4">
              <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={handleEditorChange}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const EditPageWithSidebar = (params: any) => WithSidebar(EditPage)(params);
export default EditPageWithSidebar;
