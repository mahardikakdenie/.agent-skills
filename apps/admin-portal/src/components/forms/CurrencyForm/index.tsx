import React from "react";
import { Check, ChevronLeft, Plus, Trash } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@repo/ui";
import { Input } from "@repo/ui";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { Controller } from "react-hook-form";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";

interface CurrencyFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;

  insurances: any[];
  typeCurrencies: any[];
  currencyFields: any[];

  selectedInsuranceId: string;

  showAlert: boolean;
  alertMessage: string;
  alertType: "success" | "error";
  isEdit: boolean;

  isLoadingInsurances: boolean;
  isLoadingTypeCurrencies: boolean;
  isLoadingCurrencies: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onAddCurrency: () => void;
  onChangeRate: (index: number, value: string) => void;
  onChangeCurrencyFrom: (index: number, value: string) => void;
  onChangeCurrencyTo: (index: number, value: string) => void;
  onDeleteCurrency: (id: string, index: number) => void;
  onBack: () => void;
  onCloseAlert: () => void;
  onInsuranceChange?: (value: string) => void;
}

const AlertModal = ({
  isOpen,
  message,
  type,
  onClose,
}: {
  isOpen: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-1/3">
        <h2
          className={`text-lg font-semibold mb-4 ${
            type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {type === "success" ? "Success" : "Error"}
        </h2>
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export function CurrencyForm({
  handleSubmit,
  control,
  errors,
  watch,
  insurances,
  typeCurrencies,
  currencyFields,
  selectedInsuranceId,
  showAlert,
  alertMessage,
  alertType,
  isEdit,
  isLoadingInsurances,
  isLoadingTypeCurrencies,
  isLoadingCurrencies,
  isSaving,
  onSave,
  onAddCurrency,
  onChangeRate,
  onChangeCurrencyFrom,
  onChangeCurrencyTo,
  onDeleteCurrency,
  onBack,
  onCloseAlert,
  onInsuranceChange,
}: CurrencyFormProps) {
  return (
    <ContentLoadingWrapper
      isLoading={isSaving || isLoadingCurrencies || isLoadingInsurances}
    >
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
                      Currency
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{isEdit ? "Edit" : "Add"}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
                {isEdit ? "Edit Currency" : "Add Currency"}
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
                {isSaving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Check className="mr-2 w-4 h-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>

          {showAlert && (
            <AlertModal
              isOpen={showAlert}
              message={alertMessage}
              type={alertType}
              onClose={onCloseAlert}
            />
          )}

          <div className="flex flex-col w-full p-4 md:p-6 gap-4">
            <div className="p-4 sm:p-6 bg-white rounded-lg">
              <div>
                <label
                  htmlFor="insurance"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Insurance Name <span className="text-red-500">*</span>
                </label>

                <Controller
                  name="insurance"
                  control={control}
                  rules={{ required: "Insurance is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        onInsuranceChange?.(value);
                      }}
                      disabled={isEdit}
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
                    <TableRow key={item.id || index}>
                      <TableCell>
                        <Select
                          value={item.currency_from}
                          onValueChange={(value) =>
                            onChangeCurrencyFrom(index, value)
                          }
                        >
                          <SelectTrigger className="w-full h-10 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 rounded-xl min-w-28">
                            <SelectValue placeholder="Select" />
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
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.currency_to}
                          onValueChange={(value) =>
                            onChangeCurrencyTo(index, value)
                          }
                        >
                          <SelectTrigger className="w-full h-10 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 rounded-xl min-w-28">
                            <SelectValue placeholder="Select" />
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
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={new Intl.NumberFormat("en-US").format(
                            Number(item.rate) || 0
                          )}
                          onChange={(e) => {
                            const value = e.target.value.replace(/,/g, "");
                            onChangeRate(index, value);
                          }}
                          className="block w-full h-10 rounded-xl border-gray-300 min-w-28"
                        />
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {item.lastRate
                          ? new Intl.NumberFormat("en-US").format(
                              Number(item.lastRate)
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {item.updated_at
                          ? new Date(item.updated_at).toLocaleDateString(
                              "en-GB",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )
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
                            onDeleteCurrency(item.id, index);
                          }}
                          className="text-red-600 px-0"
                          disabled={currencyFields.length === 1}
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
                  onAddCurrency();
                }}
              >
                <Plus className="mr-1" width={18} height={18} />
                Add Currency
              </Button>
            </div>
          </div>
        </form>
      </div>
    </ContentLoadingWrapper>
  );
}
