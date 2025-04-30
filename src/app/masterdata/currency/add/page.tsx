"use client";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Check, ChevronLeft, Plus, Trash, Trash2, Upload } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useCurrency } from "../hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import {
  CurrenciesService,
  CurrencyResponse,
  TypeCurreciesResponse,
} from "@/services/masterdata/currency.service";
import noData from "/public/images/no-data.webp";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoneyClaim } from "@/lib/formatter";
import { hasPermission } from "@/context/auth.context";

const AddProduct = ({ params }: { params: { id: string } }) => {
  useRequireAuth();
  const router = useRouter();
  const { id } = params;
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const path = usePathname();
  const currencyService = new CurrenciesService();
  const [currencyData, setCurrencyData] = useState<CurrencyResponse[]>([]);
  const [rate, setRate] = useState("");
  const [message, setMessage] = useState("");
  const [insurance, setInsurance] = useState("");
  const [lastRate, setLastRate] = useState("");
  const [currency_from, setCurrencyFrom] = useState("");
  const [currency_to, setCurrencyTo] = useState("");
  const [category, setCategory] = useState("");
  const [selectedInsurances, setSelectedInsurances] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedInsuranceId, setSelectedInsuranceId] = useState("");
  const [typeCurrency, setTypeCurrency] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState<string[]>([]);
  const [currencyFields, setCurrencyFields] = useState<any[]>([
    { id: "", rate: "", currency_from: "", currency_to: "" },
  ]);

  
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Masterdata.Create");
      setHasAccess(access);
      if (!access) {
        router.push("/forbidden");
      }
    };

    checkAccess();
  }, [router]);


  const {
    saveCurrency,
    updateCurrency,
    categories = [],
    currencies = [],
    insurances = [],
    typeCurrencies = [],
    fetchInsurances,
    fetchCategories,
    fetchTypeCurrencies,
  } = useCurrency();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      rate,
      message,
      insurances: selectedInsurances,
      currency_from: selectedTypeId || [],
      typeCurrencies: selectedTypeId,
      lastRate,
      currency_to: selectedTypeId || [],
    },
    values: {
      rate,
      message,
      insurance,
      currency_from,
      currency_to,
      lastRate,
    },
  });

  const onSubmit = async () => {
    try {
      for (let i = 0; i < currencyFields.length; i++) {
        await saveCurrency(
          {
            insurance: "",
            value: currencyFields[i].rate,
            currency_from: currencyFields[i].currency_from,
            currency_to: currencyFields[i].currency_to,
            start_from: new Date(),
            active: true,
          },
          selectedInsuranceId
        );
      }
      setSaveSuccess(true);
    } catch (error) {
      setSaveSuccess(false);
    }
  };

  useEffect(() => {
    const searchParam = new URLSearchParams(window.location.search);
    const insuranceId = searchParam.get("insurance-id") ?? "";
    const categoryId = searchParam.get("category-id") ?? "";
    setSelectedCategoryId(categoryId);
    setSelectedInsuranceId(insuranceId);
    fetchCategories({});
    fetchInsurances({});
    fetchTypeCurrencies({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (saveSuccess === true) {
      alert("Data berhasil disimpan!");
      router.back();
    } else if (saveSuccess === false) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
    setSaveSuccess(null);
  }, [saveSuccess, router]);

  useEffect(() => {
    if (currencies.length > 0 && currencies[0].currencies.length > 0) {
      let groupExchangeRate: any = {};
      currencies[0].currencies
        .sort(
          (a: any, b: any) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
        .map((item: any) => {
          if (
            !groupExchangeRate.hasOwnProperty(
              `${item.currency_from}_${item.currency_to}`
            )
          ) {
            groupExchangeRate[`${item.currency_from}_${item.currency_to}`] = [];
          }
          groupExchangeRate[`${item.currency_from}_${item.currency_to}`].push(
            item
          );
        });
      setCurrencyFields(
        Object.keys(groupExchangeRate).map((key: any) => {
          const exchangeRateLog = groupExchangeRate[key];

          const formValue = {
            id: exchangeRateLog[0].id,
            rate: exchangeRateLog[0].value,
            lastRate: exchangeRateLog[0].value,
            currency_from: exchangeRateLog[0].currency_from,
            currency_to: exchangeRateLog[0].currency_to,
            updated_at: exchangeRateLog[0].updated_at,
          };
          if (exchangeRateLog.length > 1) {
            formValue.lastRate = exchangeRateLog[1].value;
          }

          return formValue;
        })
      );
    }
  }, [currencies]);

  const handleAddCurrency = () => {
    const updateFormValue = [...currencyFields];
    updateFormValue.push({
      id: "",
      rate: "",
      currency_from: "",
      currency_to: "",
    });
    setCurrencyFields(updateFormValue);
  };

  const handleChangeRate = (index: number, value: string) => {
    const updateFormValue = [...currencyFields];
    updateFormValue[index] = { ...updateFormValue[index], rate: value };
    setCurrencyFields(updateFormValue);
  };

  const handleDeleteCurrencies = async (idCurrency: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await currencyService.deleteCurrency(selectedInsuranceId, idCurrency);
        setCurrencyFields((prevFields) =>
          prevFields.filter((currencyField) => currencyField.id !== idCurrency)
        );
        setCurrencyData((prevCurrencies) =>
          prevCurrencies.filter((currency) => currency.id !== idCurrency)
        );
      } catch (error) {
        console.error("Failed to delete currency:", error);
      }
    }
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
                    Currency
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              Add Currency
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
        <div className="flex flex-col w-full p-4 md:p-6 gap-4">
          <div className="p-4 sm:p-6 bg-white rounded-lg">
            <div>
              <label
                htmlFor="insurance"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Insurance Name
              </label>

              <Controller
                name="insurance"
                control={control}
                defaultValue=""
                rules={{ required: "Product Category is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedInsuranceId(value);
                    }}
                  >
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                      <SelectValue placeholder="Select Insurance " />
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
          </div>

          <div className="w-full bg-white rounded-lg overflow-auto">
            <Table className="table-search-params">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-56">From</TableHead>
                  <TableHead className="w-56">To</TableHead>
                  <TableHead className="w-56">Rate</TableHead>
                  <TableHead>Last Rate</TableHead>
                  <TableHead>Update Date</TableHead>
                  <TableHead>Edited by</TableHead>
                  <TableHead className="whitespace-nowrap w-12">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencyFields.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Controller
                        key={index}
                        name={`currency_from.${index}` as const}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);

                              const updated = [...currencyFields];
                              updated[index].currency_from = value;
                              setCurrencyFields(updated);
                            }}
                          >
                            <SelectTrigger className="w-full h-10 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 rounded-xl min-w-28">
                              <SelectValue placeholder={item.currency_from} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {typeCurrencies.map((typeItem: any) => (
                                  <SelectItem
                                    key={typeItem.id}
                                    value={typeItem.name}
                                  >
                                    {typeItem?.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        key={index}
                        name={`currency_to.${index}` as const}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);

                              const updated = [...currencyFields];
                              updated[index].currency_to = value;
                              setCurrencyFields(updated);
                            }}
                          >
                            <SelectTrigger className="w-full h-10 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 rounded-xl min-w-28">
                              <SelectValue placeholder={item.currency_to} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {typeCurrencies.map((typeItem: any) => (
                                  <SelectItem
                                    key={typeItem.id}
                                    value={typeItem.name}
                                  >
                                    {typeItem?.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <React.Fragment>
                        <Input
                          type="text"
                          id="rate"
                          value={new Intl.NumberFormat("en-US").format(
                            item.rate
                          )}
                          onChange={(e) => {
                            const value = e.target.value.replace(/,/g, "");
                            handleChangeRate(index, value);
                          }}
                          className={`block w-full h-10 rounded-xl border-gray-300 min-w-28`}
                        />

                        {errors.rate && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.rate.message?.toString()}
                          </p>
                        )}
                      </React.Fragment>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {item.lastRate
                        ? new Intl.NumberFormat("en-US").format(item.lastRate)
                        : "-"}
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {item.updated_at
                        ? `${new Date(item.updated_at).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}`
                        : "No Date"}
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {item.edit_by || "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteCurrencies(item.id);
                        }}
                        className="text-red-600 px-0"
                      >
                        <Trash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            <Button
              className="bg-[#F5BA41] hover:bg-[#e6a92d] text-black rounded-full px-5"
              onClick={(e) => {
                e.preventDefault();
                handleAddCurrency();
              }}
            >
              <Plus className="mr-1" width={18} height={18} />
              Add Currency
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

const AddProductWithSidebar = (params: any) => WithSidebar(AddProduct)(params);
export default AddProductWithSidebar;
