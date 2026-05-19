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

import { PageHeader } from '@/components/core/page-header';
import { ContentLoadingWrapper } from '@/components/core/loading';
import AppURL from '@/constants/app-url.const';

interface ProductFormProps {
  mode: 'create' | 'edit';
  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;

  categories: any[];
  insurances: any[];
  productFields: any[];

  selectedCategoryId: string;
  selectedInsuranceId: string;

  showAlert: boolean;
  alertMessage: string;
  alertType: 'success' | 'error';

  isLoadingCategories: boolean;
  isLoadingInsurances: boolean;
  isLoadingProducts: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onAddProduct: () => void;
  onChangeProduct: (index: number, value: string) => void;
  onDeleteProduct: (id: string, index: number) => void;
  onBack: () => void;
  onCloseAlert: () => void;
}

export function ProductForm({
  mode,
  handleSubmit,
  control,
  errors,
  watch,
  categories,
  insurances,
  productFields,
  selectedCategoryId,
  showAlert,
  alertMessage,
  alertType,
  isLoadingCategories,
  isLoadingInsurances,
  isLoadingProducts,
  isSaving,
  onSave,
  onAddProduct,
  onChangeProduct,
  onDeleteProduct,
  onBack,
  onCloseAlert,
}: ProductFormProps) {
  const isEdit = mode === 'edit';

  const categoryOptions = React.useMemo(() => {
    return categories.map((category: any) => ({
      value: category.id,
      label: category.name
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    }));
  }, [categories]);

  const insuranceOptions = React.useMemo(() => {
    return insurances.map((insurance: any) => ({
      value: insurance.id,
      label: insurance.name,
    }));
  }, [insurances]);

  const breadcrumbs = [
    { label: 'Product', href: AppURL.masterdataProduct },
    { label: isEdit ? 'Edit' : 'Add', isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingProducts || isLoadingCategories}>
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Edit Product' : 'Add Product'}
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
            <Box className="p-4 sm:p-6 bg-white rounded-lg grid sm:grid-cols-2 gap-4 shadow-sm border border-slate-100">
              <Box className="text-primary font-bold sm:col-span-2">Product Details</Box>
              <Box>
                <Box
                  as="label"
                  htmlFor="category"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Product Category{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Product Category is required' }}
                  render={({ field }) => (
                    <Combobox
                      id="category"
                      size="lg"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={categoryOptions}
                      placeholder="Select Categories"
                      disabled={isEdit}
                      className={`bg-transparent ${
                        errors.category ? 'border-destructive' : 'border-slate-300'
                      }`}
                    />
                  )}
                />
                {errors.category && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.category.message?.toString()}
                  </Box>
                )}
              </Box>

              <Box>
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
                  rules={{ required: 'Insurance Name is required' }}
                  render={({ field }) => (
                    <Combobox
                      id="insurance"
                      size="lg"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={insuranceOptions}
                      placeholder={isLoadingInsurances ? 'Loading...' : 'Select Insurance'}
                      disabled={!selectedCategoryId || isEdit || isLoadingInsurances}
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

            <Box className="p-4 sm:p-6 bg-white rounded-lg gap-4 shadow-sm border border-slate-100">
              <Box className="flex gap-4 items-center">
                <Box>
                  <Box className="text-primary font-bold mb-2">Product Name</Box>
                </Box>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddProduct();
                  }}
                  className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] ml-auto"
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  Add Product
                </Button>
              </Box>

              <Box className="w-full bg-white rounded-lg overflow-auto mt-5">
                <Table className="table-search-params border-collapse">
                  <TableHeader className="bg-[#0073A8] hover:bg-[#0073A8] border-none">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="whitespace-nowrap py-3 pl-4 pr-1 text-white font-bold h-11 border-none">
                        Name
                      </TableHead>
                      <TableHead className="py-3 pl-1 pr-4 w-20 text-center text-white font-bold h-11 border-none">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productFields.map((item, index) => (
                      <TableRow
                        key={index}
                        className="group hover:bg-[#F2F4F7] transition-all duration-200 border-b border-slate-100 last:border-0"
                      >
                        <TableCell className="py-3 pl-4 pr-1 border-none">
                          <Input
                            type="text"
                            size="lg"
                            placeholder="Insert Product Name"
                            value={item.name}
                            onChange={(e) => onChangeProduct(index, e.target.value)}
                            className="bg-white border-slate-200 transition-all duration-200 group-hover:border-slate-300 group-hover:shadow-sm focus:border-[#0073A8] focus:ring-1 focus:ring-[#0073A8]/10"
                          />
                        </TableCell>
                        <TableCell className="py-3 pl-1 pr-4 text-center border-none">
                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={(e) => {
                              e.preventDefault();
                              onDeleteProduct(item.id, index);
                            }}
                            className="h-9 w-9 p-0 rounded-md text-red-600 hover:bg-red-50 hover:!text-red-700 transition-colors"
                            disabled={productFields.length === 1}
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
