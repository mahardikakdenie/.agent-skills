import React from 'react';
import { Check, Plus, Trash, Save, AlertCircle } from 'react-feather';
import { Controller } from 'react-hook-form';

import {
  Box,
  Button,
  Combobox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui';

import { PageHeader } from '@/components/page-header';
import { ContentLoadingWrapper } from '@/components/ui/loading';
import AppURL from '@/constants/app-url.const';

interface CurrencyFormProps {
  mode: 'create' | 'edit';
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
  alertType: 'success' | 'error';

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

export function CurrencyForm({
  mode,
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
  const isEdit = mode === 'edit';

  const insuranceOptions = React.useMemo(() => {
    return insurances.map((insurance: any) => ({
      value: insurance.id,
      label: insurance.name,
    }));
  }, [insurances]);

  const breadcrumbs = [
    { label: 'Currency', href: AppURL.masterdataCurrency },
    { label: isEdit ? 'Edit' : 'Add', isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingCurrencies || isLoadingInsurances}>
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Edit Currency' : 'Add Currency'}
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

          {showAlert && (
            <Dialog open={showAlert} onClose={onCloseAlert}>
              <DialogContent size="sm">
                <DialogHeader className="flex flex-row items-center gap-3 px-6 pt-6 pb-0">
                  {alertType === 'success' ? (
                    <>
                      <Box className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Check className="h-5 w-5" />
                      </Box>
                      <DialogTitle className="text-lg font-semibold text-slate-900">
                        Changes saved
                      </DialogTitle>
                    </>
                  ) : (
                    <>
                      <Box className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <AlertCircle className="h-5 w-5" />
                      </Box>
                      <DialogTitle className="text-lg font-semibold text-slate-900">
                        Unable to save changes
                      </DialogTitle>
                    </>
                  )}
                </DialogHeader>

                <DialogDescription className="px-6 pt-1.5 pb-0 text-[15px] leading-relaxed text-slate-600">
                  {alertMessage ||
                    (alertType === 'success'
                      ? 'Your changes have been saved successfully.'
                      : 'An error occurred while processing your request. Please review the form data and try again.')}
                </DialogDescription>

                <DialogFooter className="px-6 pt-10 pb-6 border-t-0 sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={onCloseAlert}
                    className="h-10 min-w-[100px] rounded-lg px-6 text-sm font-medium transition-all duration-200"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Box className="flex flex-col w-full p-4 md:p-6 gap-6">
            <Box className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-slate-100">
              <Box className="text-primary font-bold mb-4">Currency Details</Box>
              <Box className="w-full">
                <Box
                  as="label"
                  htmlFor="insurance"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Insurance Name{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>

                <Controller
                  name="insurance"
                  control={control}
                  rules={{ required: 'Insurance is required' }}
                  render={({ field }) => (
                    <Combobox
                      id="insurance"
                      size="lg"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        onInsuranceChange?.(value);
                      }}
                      options={insuranceOptions}
                      placeholder={isLoadingInsurances ? 'Loading...' : 'Select Insurance'}
                      disabled={isEdit || isLoadingInsurances}
                      className={`bg-transparent ${
                        errors.insurance ? 'border-destructive' : 'border-slate-300'
                      }`}
                    />
                  )}
                />
                {errors.insurance && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.insurance.message?.toString()}
                  </Box>
                )}
              </Box>
            </Box>

            <Box className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-slate-100">
              <Box className="flex gap-4 items-center">
                <Box className="text-primary font-bold">Currency Exchange</Box>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddCurrency();
                  }}
                  className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] ml-auto"
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  Add Currency
                </Button>
              </Box>

              <Box className="w-full bg-white rounded-lg overflow-auto mt-5">
                <Table className="table-search-params border-collapse">
                  <TableHeader className="bg-[#0073A8] hover:bg-[#0073A8] border-none">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="whitespace-nowrap py-3 pl-4 pr-1 text-white font-bold h-11 border-none">
                        From
                      </TableHead>
                      <TableHead className="whitespace-nowrap py-3 px-1 text-white font-bold h-11 border-none">
                        To
                      </TableHead>
                      <TableHead className="whitespace-nowrap py-3 px-1 text-white font-bold h-11 border-none">
                        Rate
                      </TableHead>
                      <TableHead className="whitespace-nowrap py-3 px-1 text-white font-bold h-11 border-none">
                        Last Rate
                      </TableHead>
                      <TableHead className="whitespace-nowrap py-3 px-1 text-white font-bold h-11 border-none">
                        Update Date
                      </TableHead>
                      <TableHead className="whitespace-nowrap py-3 px-1 text-white font-bold h-11 border-none">
                        Edited by
                      </TableHead>
                      <TableHead className="py-3 pl-1 pr-4 w-20 text-center text-white font-bold h-11 border-none">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currencyFields.map((item, index) => (
                      <TableRow
                        key={item.id || index}
                        className="group hover:bg-[#F2F4F7] transition-all duration-200 border-b border-slate-100 last:border-0"
                      >
                        <TableCell className="py-3 pl-4 pr-1 border-none">
                          <Combobox
                            value={item.currency_from}
                            onValueChange={(value) => onChangeCurrencyFrom(index, value)}
                            options={typeCurrencies.map((typeItem: any) => ({
                              value: typeItem.name,
                              label: typeItem.name,
                            }))}
                            placeholder="Select"
                            size="sm"
                            className="bg-white border-slate-200 min-w-28"
                          />
                        </TableCell>
                        <TableCell className="py-3 px-1 border-none">
                          <Combobox
                            value={item.currency_to}
                            onValueChange={(value) => onChangeCurrencyTo(index, value)}
                            options={typeCurrencies.map((typeItem: any) => ({
                              value: typeItem.name,
                              label: typeItem.name,
                            }))}
                            placeholder="Select"
                            size="sm"
                            className="bg-white border-slate-200 min-w-28"
                          />
                        </TableCell>
                        <TableCell className="py-3 px-1 border-none">
                          <Input
                            type="text"
                            size="sm"
                            value={new Intl.NumberFormat('en-US').format(Number(item.rate) || 0)}
                            onChange={(e) => {
                              const value = e.target.value.replace(/,/g, '');
                              onChangeRate(index, value);
                            }}
                            className="bg-white border-slate-200 min-w-28"
                          />
                        </TableCell>
                        <TableCell className="py-3 px-1 border-none text-slate-500 text-sm">
                          {item.lastRate
                            ? new Intl.NumberFormat('en-US').format(Number(item.lastRate))
                            : '-'}
                        </TableCell>
                        <TableCell className="py-3 px-1 border-none text-slate-500 text-sm">
                          {item.updated_at
                            ? new Date(item.updated_at).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              })
                            : 'No Date'}
                        </TableCell>
                        <TableCell className="py-3 px-1 border-none text-slate-500 text-sm">
                          {item.edit_by || '-'}
                        </TableCell>
                        <TableCell className="py-3 pl-1 pr-4 text-center border-none">
                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={(e) => {
                              e.preventDefault();
                              onDeleteCurrency(item.id, index);
                            }}
                            className="h-9 w-9 p-0 rounded-md text-red-600 hover:bg-red-50 hover:!text-red-700 transition-colors"
                            disabled={currencyFields.length === 1}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
