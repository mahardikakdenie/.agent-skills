'use client';

import React from 'react';
import { Check, Plus, Save, Trash2, X } from 'react-feather';
import { Controller } from 'react-hook-form';

import {
  Box,
  Button,
  Combobox,
  DatePicker,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';

import ChannelSelectionModal from '@/app/promotion/components/channel-selection-modal';
import InsuranceSelectionModal from '@/app/promotion/components/insurance-selection-modal';
import PlanSelectionModal from '@/app/promotion/components/plan-selection-modal';
import ProductSelectionModal from '@/app/promotion/components/product-selection-modal';
import type {
  EmbeddedDiscountPlan,
  EmbeddedDiscountProduct,
} from '@/app/promotion/dto/promotion.details.dto';
import AppURL from '@/constants/app-url.const';
import { useCampaignForm } from '@/hooks/useCampaignForm.hooks';

import { PageHeader } from '../../page-header';
import { ContentLoadingWrapper } from '../../ui/loading';

interface CampaignFormProps {
  mode: 'create' | 'edit';
  campaignId?: string;
}

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

interface SelectionSectionProps<TItem> {
  label: string;
  items: TItem[];
  emptyText: string;
  actionLabel: string;
  disabled?: boolean;
  getItemLabel: (item: TItem) => string;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const sectionClassName =
  'p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100';
const primaryActionClassName = 'h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]';
const disabledActionClassName = 'h-10 rounded-full bg-gray-300 px-5 text-black hover:bg-gray-300';

const parseDateFieldValue = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

const formatDateFieldValue = (date: Date | null) => {
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

function ErrorModal({ isOpen, message, onClose }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="w-[420px] max-w-[calc(100vw-32px)] p-0">
        <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
          <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
            Alert
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="ml-auto bg-transparent hover:bg-transparent text-black p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <Box className="px-4 py-5 sm:px-6">
          <Box as="p" className="text-sm text-slate-700">
            {message}
          </Box>
        </Box>

        <DialogFooter className="pb-4 px-4 sm:px-6 sm:justify-end">
          <Button type="button" className={primaryActionClassName} onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SelectionSection<TItem>({
  label,
  items,
  emptyText,
  actionLabel,
  disabled = false,
  getItemLabel,
  onAdd,
  onRemove,
}: SelectionSectionProps<TItem>) {
  return (
    <Box>
      <Box className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Box className="min-w-0 flex-1">
          <Box as="label" className="inline-block text-sm font-medium text-slate-700 mb-2">
            {label}
          </Box>
          <Box className="min-h-32 rounded-md border border-slate-200 bg-white p-2">
            <Box className="flex max-h-28 flex-col gap-2 overflow-y-auto">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <Box
                    key={`${label}-${index}`}
                    className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm"
                  >
                    <Box as="span" className="min-w-0 flex-1 whitespace-normal break-words">
                      {getItemLabel(item)}
                    </Box>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      className="h-8 w-8 shrink-0 rounded-full p-0 text-slate-600 hover:bg-red-50 hover:!text-red-600"
                      onClick={() => onRemove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Box>
                ))
              ) : (
                <Box as="span" className="px-2 py-1 text-sm text-slate-500">
                  {emptyText}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Button
          type="button"
          disabled={disabled}
          onClick={onAdd}
          className={`${disabled ? disabledActionClassName : primaryActionClassName} sm:mt-7 sm:w-40`}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          {actionLabel}
        </Button>
      </Box>
    </Box>
  );
}

export default function CampaignForm({ mode, campaignId }: CampaignFormProps) {
  const {
    handleSubmit,
    control,
    errors,
    isSubmitting,

    promotion,
    currency,

    hasAccess,
    showAlert,
    errorMessage,
    isEdit,

    handleSave,
    setShowAlert,
    goBack,
    loadCampaignDetail,
    handleChangeType,
    handleChangeValueType,
    handleChangeInsurance,

    channels,
    isChannelModalOpen,
    selectedChannelIds,
    globalSelectedChannels,
    showChannelsPerPage,
    setIsChannelModalOpen,
    setGlobalSelectedChannels,
    handleAddChannel,
    handleSelectChannel,
    handleRemoveChannel,
    handleRemoveArrayItemChan,
    handlePageChangeChannel,
    handleChannelsPerPageChange,

    insurances,
    isInsuranceModalOpen,
    globalSelectedInsuranceIds,
    selectedInsurances,
    currentPageIns,
    showInsPerPage,
    setIsInsuranceModalOpen,
    setGlobalSelectedInsuranceIds,
    handleAddInsurance,
    handleSelectInsurance,
    handleRemoveInsurance,
    handleRemoveArrayItemIns,
    handlePageChangeInsurances,
    handleInsurancePerPageChange,

    products,
    isProductModalOpen,
    selectedProductIds,
    globalSelectedProdIds,
    currentPageProd,
    showProdPerPage,
    setIsProductModalOpen,
    setGlobalSelectedProdIds,
    handleAddProduct,
    handleSelectProduct,
    handleRemoveProduct,
    handleRemoveProd,
    handlePageChangeProd,
    handleProdPerPageChange,

    plans,
    isPlanModalOpen,
    globalSelectedPlanIds,
    currentPagePlan,
    showPlansPerPage,
    totalPlanItems,
    setIsPlanModalOpen,
    setGlobalSelectedPlanIds,
    handleAddPlan,
    handleSelectPlan,
    handleRemovePlan,
    handleRemovePlans,
    handlePageChangePlans,
    handlePlansPerPageChange,
    handleSearch,

    vouchers,
    voucherCode,
    voucherUsageLimit,
    setVoucherCode,
    handleAddVoucher,
    handleRemoveVoucher,
    handleChangeVoucherLimit,
    handleVoucherLimitBlur,

    isLoadingCurrency,
    isLoadingDetail,
    isSaving,
  } = useCampaignForm(mode);

  React.useEffect(() => {
    if (isEdit && campaignId) {
      loadCampaignDetail(campaignId);
    }
  }, [isEdit, campaignId, loadCampaignDetail]);

  const getErrorMessage = (fieldName: string) => errors[fieldName]?.message?.toString();

  const renderLabel = (htmlFor: string, label: string, required = false) => (
    <Box
      as="label"
      htmlFor={htmlFor}
      className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
    >
      {label}
      {required ? (
        <Box as="span" className="text-red-500">
          {' '}
          *
        </Box>
      ) : null}
    </Box>
  );

  const renderFieldError = (fieldName: string) => {
    const message = getErrorMessage(fieldName);

    if (!message) {
      return null;
    }

    return (
      <Box as="p" className="text-red-500 text-xs mt-1">
        {message}
      </Box>
    );
  };

  const breadcrumbs = [
    { label: 'Campaign', href: AppURL.promotionCampaign },
    { label: isEdit ? 'Detail' : 'Add', isCurrentPage: true },
  ];
  const isSubmitInProgress = isSubmitting || isSaving;

  const currencyOptions = React.useMemo(
    () =>
      currency
        .filter((currencyItem) => currencyItem?.code)
        .map((currencyItem) => {
          const code = String(currencyItem.code);
          const name = currencyItem.name ? String(currencyItem.name) : code;

          return {
            label: name,
            value: code,
            keywords: [code, name],
          };
        }),
    [currency],
  );

  if (hasAccess === false) {
    return null;
  }

  return (
    <ContentLoadingWrapper isLoading={isLoadingDetail}>
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(handleSave)} className="w-full">
          <PageHeader
            title={isEdit ? 'Edit Campaign' : 'Add Campaign'}
            breadcrumbs={breadcrumbs}
            showBackButton={true}
            onBackClick={goBack}
          >
            <Button
              type="submit"
              disabled={isSubmitInProgress}
              loading={isSubmitInProgress}
              className={primaryActionClassName}
              leftIcon={
                isSubmitInProgress ? undefined : isEdit ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )
              }
            >
              {isSubmitInProgress ? 'Saving...' : 'Save'}
            </Button>
          </PageHeader>

          <ErrorModal
            isOpen={showAlert}
            message={errorMessage}
            onClose={() => setShowAlert(false)}
          />

          <Box className="flex flex-col w-full p-4 md:p-6 gap-6">
            <Box className={sectionClassName}>
              <Box className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Box>
                  {renderLabel('name', 'Campaign Name', true)}
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Campaign Name is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="name"
                        size="lg"
                        placeholder="Insert Campaign Name"
                        error={!!errors.name}
                        className="bg-transparent"
                      />
                    )}
                  />
                  {renderFieldError('name')}
                </Box>

                <Box>
                  {renderLabel('type', 'Type', true)}
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          handleChangeType(value || '');
                          field.onChange(value);
                        }}
                        disabled={isEdit}
                        required
                        error={!!errors.type}
                      >
                        <SelectTrigger className="h-12 bg-transparent">
                          <SelectValue placeholder="Select a Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="embedded">Embedded</SelectItem>
                            <SelectItem value="voucher">Voucher</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {renderFieldError('type')}
                </Box>

                <Box>
                  {renderLabel('start_date', 'Start Date', true)}
                  <Controller
                    name="start_date"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Start date is required' }}
                    render={({ field }) => (
                      <DatePicker
                        id="start_date"
                        value={parseDateFieldValue(field.value)}
                        onChange={(date) => field.onChange(formatDateFieldValue(date))}
                        onBlur={field.onBlur}
                        size="lg"
                        iconPosition="end"
                        placeholder="Select start date"
                        required
                        error={!!errors.start_date}
                      />
                    )}
                  />
                  {renderFieldError('start_date')}
                </Box>

                <Box>
                  {renderLabel('end_date', 'End Date', true)}
                  <Controller
                    name="end_date"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'End date is required' }}
                    render={({ field }) => (
                      <DatePicker
                        id="end_date"
                        value={parseDateFieldValue(field.value)}
                        onChange={(date) => field.onChange(formatDateFieldValue(date))}
                        onBlur={field.onBlur}
                        size="lg"
                        iconPosition="end"
                        placeholder="Select end date"
                        required
                        error={!!errors.end_date}
                      />
                    )}
                  />
                  {renderFieldError('end_date')}
                </Box>

                <Box>
                  {renderLabel('value_type', 'Value Type', true)}
                  <Controller
                    name="value_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          handleChangeValueType(value || '');
                          field.onChange(value);
                        }}
                        disabled={isEdit}
                        required
                        error={!!errors.value_type}
                      >
                        <SelectTrigger className="h-12 bg-transparent">
                          <SelectValue placeholder="Select Value Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="fixed">Fixed</SelectItem>
                            <SelectItem value="percentage">Percentage</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {renderFieldError('value_type')}
                </Box>

                <Box>
                  {renderLabel('value', 'Value', true)}
                  <Controller
                    name="value"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Value is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="value"
                        type="number"
                        size="lg"
                        disabled={isEdit}
                        required
                        placeholder="Insert a value"
                        error={!!errors.value}
                        className="bg-transparent"
                      />
                    )}
                  />
                  {renderFieldError('value')}
                </Box>

                <Box>
                  {renderLabel('minimum_amount', 'Minimum Transaction Amount')}
                  <Controller
                    name="minimum_amount"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="minimum_amount"
                        type="number"
                        size="lg"
                        required
                        placeholder="Insert a minimum amount"
                        error={!!errors.minimum_amount}
                        className="bg-transparent"
                      />
                    )}
                  />
                  {renderFieldError('minimum_amount')}
                </Box>

                <Box>
                  {renderLabel('maximum_amount', 'Maximum Discount Amount')}
                  <Controller
                    name="maximum_amount"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="maximum_amount"
                        type="number"
                        size="lg"
                        required
                        placeholder="Insert a maximum amount"
                        error={!!errors.maximum_amount}
                        className="bg-transparent"
                      />
                    )}
                  />
                  {renderFieldError('maximum_amount')}
                </Box>

                <Box className="md:col-span-2">
                  {renderLabel('value_currency', 'Currency')}
                  <Controller
                    name="value_currency"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        id="value_currency"
                        value={field.value || ''}
                        onValueChange={(currencyCode) => {
                          const selectedCurrency = currency.find(
                            (item) => item.code === currencyCode,
                          );

                          handleChangeInsurance({
                            currencyName: selectedCurrency?.name || '',
                          });

                          field.onChange(currencyCode || '');
                        }}
                        onBlur={field.onBlur}
                        options={currencyOptions}
                        placeholder="Select Currency"
                        searchPlaceholder="Search currency"
                        size="lg"
                        disabled={isEdit || isLoadingCurrency}
                        loading={isLoadingCurrency}
                        error={!!errors.value_currency}
                      />
                    )}
                  />
                  {renderFieldError('value_currency')}
                </Box>

                <Box className="md:col-span-2 grid grid-cols-1 gap-5 pt-2">
                  <SelectionSection
                    label="Channels"
                    items={promotion.embedded_discount_channels}
                    emptyText="No channels added"
                    actionLabel="Channel"
                    getItemLabel={(channel) => channel.channel_name || 'Unknown Channel'}
                    onAdd={handleAddChannel}
                    onRemove={(index) =>
                      handleRemoveArrayItemChan('embedded_discount_channels', index)
                    }
                  />

                  <SelectionSection
                    label="Insurances"
                    items={promotion.embedded_discount_insurances}
                    emptyText="No insurances added"
                    actionLabel="Insurance"
                    disabled={promotion.embedded_discount_channels.length === 0}
                    getItemLabel={(insurance) => insurance.insurance_name || 'Unknown Insurance'}
                    onAdd={handleAddInsurance}
                    onRemove={(index) =>
                      handleRemoveArrayItemIns('embedded_discount_insurances', index)
                    }
                  />

                  <SelectionSection
                    label="Products"
                    items={promotion.embedded_discount_products}
                    emptyText="No products added"
                    actionLabel="Product"
                    disabled={promotion.embedded_discount_insurances.length === 0}
                    getItemLabel={(product) => product.product_name || 'Unknown Product'}
                    onAdd={handleAddProduct}
                    onRemove={handleRemoveProduct}
                  />

                  <SelectionSection
                    label="Plans"
                    items={promotion.embedded_discount_plans}
                    emptyText="No plans added"
                    actionLabel="Plan"
                    disabled={promotion.embedded_discount_products.length === 0}
                    getItemLabel={(plan) => plan.name || 'Unknown Plan'}
                    onAdd={handleAddPlan}
                    onRemove={handleRemovePlan}
                  />
                </Box>

                {isEdit && (
                  <Box>
                    {renderLabel('status', 'Status')}
                    <Input
                      id="status"
                      size="lg"
                      value={promotion.active ? 'Active' : 'Inactive'}
                      readOnly
                      inputClassName={promotion.active ? 'text-green-600' : 'text-red-600'}
                      className="bg-white"
                    />
                  </Box>
                )}
              </Box>
            </Box>

            {promotion.type === 'voucher' && (
              <Box className={sectionClassName}>
                {!isEdit || !promotion.active ? (
                  <Box className="flex flex-col gap-4">
                    <Box className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_160px_auto] md:items-end">
                      <Input
                        id="voucher_code"
                        size="lg"
                        label="Voucher Code"
                        value={voucherCode}
                        onValueChange={setVoucherCode}
                        placeholder="Enter voucher code"
                        className="bg-transparent"
                      />
                      <Input
                        id="voucher_usage_limit"
                        type="number"
                        size="lg"
                        label="Usage Limit"
                        value={voucherUsageLimit === 0 ? '' : voucherUsageLimit}
                        onKeyDown={(event) => {
                          const currentValue = event.currentTarget.value;

                          if (
                            event.key === '0' &&
                            (currentValue === '' ||
                              currentValue === '0' ||
                              event.currentTarget.selectionStart === 0)
                          ) {
                            event.preventDefault();
                            return;
                          }

                          if (
                            currentValue.length >= 5 &&
                            !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
                              event.key,
                            )
                          ) {
                            event.preventDefault();
                            return;
                          }

                          if (
                            !/^\d$/.test(event.key) &&
                            !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
                              event.key,
                            )
                          ) {
                            event.preventDefault();
                          }
                        }}
                        onValueChange={handleChangeVoucherLimit}
                        onBlur={handleVoucherLimitBlur}
                        placeholder="Usage limit"
                        className="bg-transparent"
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddVoucher(voucherCode, voucherUsageLimit)}
                        className={primaryActionClassName}
                        disabled={!voucherCode || voucherUsageLimit <= 0}
                        leftIcon={<Plus className="w-5 h-5" />}
                      >
                        Add Voucher
                      </Button>
                    </Box>

                    <Box className="flex flex-col gap-2">
                      {vouchers.length > 0 ? (
                        vouchers.map((voucher, index) => (
                          <Box
                            key={`${voucher.code}-${index}`}
                            className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm"
                          >
                            <Box as="span" className="min-w-0 flex-1 break-words">
                              {voucher.code} (Usage Limit: {voucher.usageLimit})
                            </Box>
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              className="h-8 w-8 rounded-full p-0 text-slate-600 hover:bg-red-50 hover:!text-red-600"
                              onClick={() => handleRemoveVoucher(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </Box>
                        ))
                      ) : (
                        <Box as="span" className="text-sm text-slate-500">
                          No vouchers added
                        </Box>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Box as="p" className="text-sm text-red-500">
                    Cannot add vouchers while the promotion is active.
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>

        <ChannelSelectionModal
          isOpen={isChannelModalOpen}
          onClose={() => setIsChannelModalOpen(false)}
          onSelect={handleSelectChannel}
          channels={channels}
          onPageChangeChannel={handlePageChangeChannel}
          selectedChannelIds={selectedChannelIds}
          showChannelsPerPage={showChannelsPerPage}
          onChannelsPerPageChange={handleChannelsPerPageChange}
          globalSelectedChannels={globalSelectedChannels}
          setGlobalSelectedChannels={setGlobalSelectedChannels}
          onRemoveChannel={handleRemoveChannel}
        />

        <InsuranceSelectionModal
          isOpen={isInsuranceModalOpen}
          onClose={() => setIsInsuranceModalOpen(false)}
          onSelect={handleSelectInsurance}
          insurances={insurances}
          initialSelectedInsurances={selectedInsurances}
          onPageChangeIns={handlePageChangeInsurances}
          showInsPerPage={showInsPerPage}
          onInsurancePerPageChange={handleInsurancePerPageChange}
          globalSelectedInsuranceIds={globalSelectedInsuranceIds}
          setGlobalSelectedInsuranceIds={setGlobalSelectedInsuranceIds}
          currentPageIns={currentPageIns}
          onRemoveInsurance={handleRemoveInsurance}
        />

        <ProductSelectionModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSelect={handleSelectProduct}
          products={products}
          initialSelectedProductIds={
            new Set(
              promotion.embedded_discount_products.map(
                (product: EmbeddedDiscountProduct) => product.product_id,
              ),
            )
          }
          selectedProductIds={selectedProductIds}
          showProdPerPage={showProdPerPage}
          onProdPerPageChange={handleProdPerPageChange}
          globalSelectedProdIds={globalSelectedProdIds}
          setGlobalSelectedProdIds={setGlobalSelectedProdIds}
          onPageChangeProd={handlePageChangeProd}
          currentPageProd={currentPageProd}
          onRemoveProd={handleRemoveProd}
        />

        <PlanSelectionModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          onSelect={handleSelectPlan}
          plans={plans}
          products={promotion.embedded_discount_products.map(
            (product: EmbeddedDiscountProduct) => ({
              id: product.product_id,
              name: product.product_name,
            }),
          )}
          preSelectedPlanIds={
            new Set(
              promotion.embedded_discount_plans.map((plan: EmbeddedDiscountPlan) => plan.plan_id),
            )
          }
          selectedProductIds={
            new Set(
              promotion.embedded_discount_products.map(
                (product: EmbeddedDiscountProduct) => product.product_id,
              ),
            )
          }
          onPageChangePlan={handlePageChangePlans}
          totalPlanItems={totalPlanItems}
          pagePlan={currentPagePlan}
          showPlansPerPage={showPlansPerPage}
          onPlansPerPageChange={handlePlansPerPageChange}
          globalSelectedPlanIds={globalSelectedPlanIds}
          setGlobalSelectedPlanIds={setGlobalSelectedPlanIds}
          globalSelectedProdIds={globalSelectedProdIds}
          onRemovePlan={handleRemovePlans}
          onSearch={handleSearch}
        />
      </Box>
    </ContentLoadingWrapper>
  );
}
