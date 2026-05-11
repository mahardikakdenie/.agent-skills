'use client';

import { format } from 'date-fns';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Check, Edit, Plus, Save, Trash2 } from 'react-feather';
import { Controller, useForm, useWatch } from 'react-hook-form';

import {
  Box,
  Button,
  Combobox,
  DatePicker,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '@repo/ui';

import { PageHeader } from '@/components/page-header';
import { ContentLoadingWrapper } from '@/components/ui/loading';
import AppURL from '@/constants/app-url.const';
import { toastNotification } from '@/lib/toast';
import { channelService } from '@/services/channel/api/channel.service';
import { productService } from '@/services/product/api/product.service';
import { transactionService } from '@/services/transaction/api/transaction.service';
import { useCreateTransactionsConventional } from '@/services/transaction/hooks/mutations';

type RenewalForm = {
  channel_id: string;
  agent_name?: string;
  agent_phone_number: string;
  agent_phone_number_code: string;
  customer_id: string;
  email: string;
  insured_effective_date: string;
  insured_exp_date: string;
  insurance_id: string;
  insured_id_number?: string;
  insured_mailing_address?: string;
  insured_npwp_number?: string;
  insured_payment_method: string;
  insured_payment_period: string | number;
  insured_phone_number: string;
  insured_phone_number_code: string;
  insured_plan_id: string;
  insured_premium: string | number;
  insured_premium_currency: string;
  insured_product_category: string;
  phone_number: string;
  phone_number_code: string;
  pic: string;
  type: 'Company' | 'Individual' | '';
  participants: { value: string; isEdit: boolean }[];
};

type Option = {
  id: string;
  name: string;
};

type ApiList<T> = {
  data?: T[];
};

type ApiOption = {
  id?: string;
  name?: string;
};

type Customer = {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
};

type PlanPackage = {
  id?: string;
  premium?: string | number;
  currency?: string;
};

type Plan = Option & {
  packages?: PlanPackage[];
};

const fieldLabelClassName = 'inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer';
const invalidControlClassName = 'border-red-500';
const defaultControlClassName = 'border-slate-300';

function RequiredMark() {
  return (
    <Box as="span" className="text-red-500">
      {' '}
      *
    </Box>
  );
}

function FieldError({ message }: { message?: unknown }) {
  if (!message) {
    return null;
  }

  return (
    <Box as="p" className="text-red-500 text-xs mt-1">
      {message.toString()}
    </Box>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100">
      <Box className="text-[#016DA1] font-bold text-lg mb-2">{title}</Box>
      {children}
    </Box>
  );
}

function optionList(items: Option[]) {
  return items.map((item) => ({
    label: item.name,
    value: item.id,
    keywords: [item.name, item.id],
  }));
}

function SelectOptionItems({ options }: { options: Option[] }) {
  return (
    <>
      {options.map((option) => (
        <SelectItem key={option.id} value={option.id}>
          {option.name}
        </SelectItem>
      ))}
    </>
  );
}

function InlineSelect({
  id,
  value,
  options,
  placeholder,
  className,
  triggerClassName,
  onValueChange,
}: {
  id: string;
  value?: string;
  options: Option[];
  placeholder: string;
  className?: string;
  triggerClassName?: string;
  onValueChange?: (value: string | undefined) => void;
}) {
  return (
    <Select id={id} size="lg" value={value} onValueChange={onValueChange} className={className}>
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectOptionItems options={options} />
      </SelectContent>
    </Select>
  );
}

function parseDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function AddTransaction() {
  const [searchCustomer, setSearchCustomer] = useState<string>('');
  const [pickedPlan, setPickedPlan] = useState<Plan | null>(null);
  const [pickedCustomer, setPickedCustomer] = useState<Customer | null>(null);

  const [channels, setChannels] = useState<Option[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [insurances, setInsurances] = useState<Option[]>([]);
  const [currencies, setCurrencies] = useState<Option[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  const {
    handleSubmit,
    control,
    resetField,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RenewalForm>({
    defaultValues: {
      channel_id: '40eee5bf-2b92-4d23-be55-f9caa9d3ea88',
      agent_name: '',
      agent_phone_number: '',
      agent_phone_number_code: '+62',
      customer_id: '',
      email: '',
      insured_effective_date: '',
      insured_exp_date: '',
      insured_id_number: '',
      insurance_id: '',
      insured_mailing_address: '',
      insured_product_category: '',
      insured_npwp_number: '',
      insured_payment_method: '',
      insured_payment_period: '',
      insured_phone_number: '',
      insured_phone_number_code: '+62',
      insured_plan_id: '',
      insured_premium: '',
      insured_premium_currency: 'IDR',
      phone_number: '',
      phone_number_code: '+62',
      pic: '',
      type: '',
      participants: [{ value: '', isEdit: false }],
    },
  });

  const selectedType = useWatch({
    control,
    name: 'type',
  });

  const selectedCustomer = useWatch({
    control,
    name: 'customer_id',
  });

  const selectedInsurance = useWatch({
    control,
    name: 'insurance_id',
  });

  const selectedCategory = useWatch({
    control,
    name: 'insured_product_category',
  });

  const selectedPlan = useWatch({
    control,
    name: 'insured_plan_id',
  });

  const participants = useWatch({
    control,
    name: 'participants',
  });

  const router = useRouter();
  const { mutateAsync: createTransactionsConventional } = useCreateTransactionsConventional();

  const breadcrumbs = [
    { label: 'Transaction List', href: AppURL.transactionList },
    { label: 'Add', isCurrentPage: true },
  ];

  const types = [
    {
      id: 'Company',
      name: 'Company',
    },
    {
      id: 'Individual',
      name: 'Individual',
    },
  ];

  const phoneCode = [
    {
      id: '+60',
      name: '+60',
    },
    {
      id: '+62',
      name: '+62',
    },
  ];

  const paymentMethods = [
    {
      id: 'transfer',
      name: 'Bank Transfer',
    },
  ];

  const customerOptions = customers.map((customer) => ({
    label: customer?.name ?? '',
    value: customer?.id ?? '',
    keywords: [customer?.name ?? '', customer?.id ?? ''],
  }));

  const channelOptions = optionList(channels);
  const typeOptions = optionList(types);
  const insuranceOptions = optionList(insurances);
  const categoryOptions = optionList(categories);
  const planOptions = optionList(plans);
  const paymentMethodOptions = optionList(paymentMethods);

  const onSubmit = async (data: RenewalForm) => {
    const request = {
      channel_id: data.channel_id,
      customer: {
        type: data.type,
        name: pickedCustomer?.name ?? '',
        phone: `${data.phone_number_code}${data.phone_number}`,
        email: data.email,
      },
      package_id: pickedPlan?.packages?.[0]?.id || '',
      pic: {
        name: data.pic,
        phone_number: `${data.insured_phone_number_code}${data.insured_phone_number}`,
        identification_number: data.insured_id_number || '',
        npwp_number: data.insured_npwp_number || '',
        mailing_address: data.insured_mailing_address || '',
      },
      agent: {
        name: data.agent_name || '',
        phone_number: `${data.agent_phone_number_code}${data.agent_phone_number}`,
      },
      currency: data.insured_premium_currency,
      premium: +data.insured_premium,
      effective_date: data.insured_effective_date,
      expiry_date: data.insured_exp_date,
      payment_period: data.insured_payment_period,
      payment_method: data.insured_payment_method,
      participants: data.participants.map((item) => item.value),
    };

    try {
      await createTransactionsConventional(request);
      toastNotification('Transaction created successfully!');
      router.push(AppURL.transactionList);
    } catch {
      toastNotification('Failed to create transaction!', 'error');
    }
  };

  const handleCustomerChange = (id: string, newOption?: Customer) => {
    if (newOption && !customers.find((c) => c.id === newOption.id)) {
      setCustomers((prev) => [...prev, newOption]);
    }
    setValue('customer_id', id);
  };

  const handleSearchCustomer = _.debounce((query: string) => {
    setSearchCustomer(query);
  }, 300);

  const handleAddInsuredObject = () => {
    setValue('participants', [...participants, { value: '', isEdit: false }]);
  };

  const handleSaveInsuredObject = (index: number) => {
    setValue(
      'participants',
      participants.map((item, i) => (i === index ? { ...item, isEdit: true } : item)),
    );
  };

  const handleEditInsuredObject = (index: number) => {
    setValue(
      'participants',
      participants.map((item, i) => (i === index ? { ...item, isEdit: false } : item)),
    );
  };

  const handleRemoveInsuredObject = (index: number) => {
    setValue(
      'participants',
      participants.filter((_, i) => i !== index),
    );
  };

  const fetchChannels = async () => {
    try {
      const res = (await channelService.getChannelsV1({
        page: 1,
        limit: 100,
      })) as ApiList<Option>;
      setChannels(res?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const params = {
        page: 1,
        limit: 100,
        type: selectedType ? selectedType : undefined,
        name: searchCustomer ? searchCustomer : undefined,
      };
      const res = (await transactionService.getCustomers(params)) as ApiList<Customer>;
      setCustomers(res?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInsurances = async () => {
    try {
      const res = (await productService.getInsurances()) as ApiList<ApiOption>;
      setInsurances(
        (res?.data || []).map((item) => ({
          id: item.id ?? '',
          name: item.name ?? '',
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProductCategories = async () => {
    try {
      const res = (await productService.getCategories()) as ApiList<ApiOption>;
      setCategories(
        (res?.data || []).map((item) => ({
          id: item.name ?? '',
          name: item.name ?? '',
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const res = (await productService.getReferenceCurrencies()) as ApiList<ApiOption>;
      setCurrencies(
        (res?.data || []).map((item) => ({
          id: item.name ?? '',
          name: item.name ?? '',
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPlans = async (insuranceId: string, category: string) => {
    try {
      const res = (await productService.getPlans({
        insuranceId,
        category,
      })) as ApiList<Plan>;
      setPlans(res?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChannels();
    fetchInsurances();
    fetchProductCategories();
    fetchCurrencies();
  }, []);

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, searchCustomer]);

  useEffect(() => {
    if (selectedCustomer) {
      const findCustomer = customers.find((customer) => customer.id === selectedCustomer);
      if (findCustomer && findCustomer.phone && findCustomer.email) {
        setValue(
          'phone_number',
          findCustomer.phone.replace(/^\+60/, '').replace(/^\+62/, '').replace(/^0/, ''),
        );
        setValue('email', findCustomer.email);
        clearErrors('customer_id');
        clearErrors('phone_number');
        clearErrors('email');
      } else {
        clearErrors('customer_id');
        resetField('phone_number');
        resetField('email');
      }
      setPickedCustomer(findCustomer ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomer, resetField]);

  useEffect(() => {
    if (selectedCategory) {
      fetchPlans(selectedInsurance, selectedCategory);
      if (selectedPlan) {
        resetField('insured_plan_id');
        resetField('insured_premium');
        resetField('insured_premium_currency');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInsurance, selectedCategory, resetField]);

  useEffect(() => {
    const findPlan = plans.find((plan) => plan.id === selectedPlan);

    if (findPlan) {
      setValue('insured_premium', +findPlan.packages?.[0]?.premium || 0);
      setValue('insured_premium_currency', findPlan.packages?.[0]?.currency || 'IDR');
      setPickedPlan(findPlan);
      if (errors.insured_premium?.message) {
        clearErrors('insured_premium');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan, resetField]);

  return (
    <ContentLoadingWrapper isLoading={isSubmitting} loadingText="Saving transaction...">
      <Box className="flex flex-col w-full">
        <Box as="form" id="transaction-add-form" onSubmit={handleSubmit(onSubmit)}>
          <PageHeader
            title="Add Transaction"
            breadcrumbs={breadcrumbs}
            showBackButton={true}
            onBackClick={() => router.back()}
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
              leftIcon={<Save className="w-5 h-5" />}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </PageHeader>

          <Box className="flex flex-col w-full p-4 md:p-6 gap-6">
            <FormSection title="Channel">
              <Box className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <Box>
                  <Box as="label" htmlFor="channel_id" className={fieldLabelClassName}>
                    Channel Name
                    <RequiredMark />
                  </Box>
                  <Controller
                    name="channel_id"
                    control={control}
                    rules={{ required: 'Channel is required' }}
                    render={({ field }) => (
                      <Combobox
                        id="channel_id"
                        size="lg"
                        options={channelOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Choose channel"
                        searchPlaceholder="Search channel..."
                        triggerClassName={`bg-transparent ${
                          errors.channel_id ? invalidControlClassName : defaultControlClassName
                        }`}
                      />
                    )}
                  />
                  <FieldError message={errors.channel_id?.message} />
                </Box>
              </Box>
            </FormSection>

            <FormSection title="Policy Holder Information">
              <Box className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <Box>
                  <Box as="label" htmlFor="type" className={fieldLabelClassName}>
                    Type
                    <RequiredMark />
                  </Box>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: 'Type is required' }}
                    render={({ field }) => (
                      <Select
                        id="type"
                        size="lg"
                        options={typeOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Choose type"
                        error={Boolean(errors.type)}
                      />
                    )}
                  />
                  <FieldError message={errors.type?.message} />
                </Box>

                <Box>
                  <Box as="label" htmlFor="customer_id" className={fieldLabelClassName}>
                    Customer Name
                    <RequiredMark />
                  </Box>
                  <Controller
                    name="customer_id"
                    control={control}
                    rules={{ required: 'Customer Name is required' }}
                    render={({ field }) => (
                      <Combobox
                        id={field.name}
                        name={field.name}
                        value={field.value}
                        onBlur={field.onBlur}
                        onValueChange={(value) => {
                          if (value) {
                            handleCustomerChange(value);
                          }
                        }}
                        onSearchValueChange={handleSearchCustomer}
                        size="lg"
                        options={customerOptions}
                        createOptionLabel='Type something and press "Enter" to add a new customer'
                        onCreateOption={(searchValue) => {
                          handleCustomerChange(searchValue, {
                            id: searchValue,
                            name: searchValue,
                          });
                        }}
                        placeholder="Input name"
                        searchPlaceholder="Find customer name"
                        triggerClassName={`bg-transparent ${
                          errors.customer_id ? invalidControlClassName : defaultControlClassName
                        }`}
                      />
                    )}
                  />
                  <FieldError message={errors.customer_id?.message} />
                </Box>

                <Box>
                  <Box as="label" htmlFor="phone_number" className={fieldLabelClassName}>
                    Phone Number
                    <RequiredMark />
                  </Box>
                  <Box className="flex gap-1">
                    <Controller
                      name="phone_number_code"
                      control={control}
                      render={({ field }) => (
                        <InlineSelect
                          id="phone_number_code"
                          options={phoneCode}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="+62"
                          className="w-[96px] shrink-0"
                          triggerClassName="rounded-r-none bg-slate-50 border-slate-300"
                        />
                      )}
                    />

                    <Controller
                      name="phone_number"
                      control={control}
                      rules={{
                        required: 'Phone Number is required',
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'Phone Number must contain only numbers',
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          inputMode="number"
                          id="phone_number"
                          size="lg"
                          placeholder="812xxxxxxx"
                          {...field}
                          readOnly={Boolean(pickedCustomer?.phone || pickedCustomer?.email)}
                          className={`rounded-l-none bg-transparent ${
                            errors.phone_number ? invalidControlClassName : defaultControlClassName
                          }`}
                        />
                      )}
                    />
                  </Box>
                  <FieldError message={errors.phone_number?.message} />
                </Box>

                <Box>
                  <Box as="label" htmlFor="email" className={fieldLabelClassName}>
                    Email
                    <RequiredMark />
                  </Box>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Email invalid',
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="email"
                        id="email"
                        size="lg"
                        placeholder="Input email address, e.g. example@mail.com"
                        readOnly={Boolean(pickedCustomer?.phone || pickedCustomer?.email)}
                        {...field}
                        className={`bg-transparent ${
                          errors.email ? invalidControlClassName : defaultControlClassName
                        }`}
                      />
                    )}
                  />
                  <FieldError message={errors.email?.message} />
                </Box>
              </Box>
            </FormSection>

            <FormSection title="Insured Information">
              <Box className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <Box>
                  <Box as="label" htmlFor="pic" className={fieldLabelClassName}>
                    PIC Name
                    <RequiredMark />
                  </Box>
                  <Controller
                    name="pic"
                    control={control}
                    rules={{ required: 'PIC is required' }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="pic"
                        size="lg"
                        placeholder="Insert PIC name"
                        {...field}
                        className={`bg-transparent ${
                          errors.pic ? invalidControlClassName : defaultControlClassName
                        }`}
                      />
                    )}
                  />
                  <FieldError message={errors.pic?.message} />
                </Box>

                <Box>
                  <Box as="label" htmlFor="insured_phone_number" className={fieldLabelClassName}>
                    Phone Number
                    <RequiredMark />
                  </Box>
                  <Box className="flex gap-1">
                    <Controller
                      name="insured_phone_number_code"
                      control={control}
                      render={({ field }) => (
                        <InlineSelect
                          id="insured_phone_number_code"
                          options={phoneCode}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="+62"
                          className="w-[96px] shrink-0"
                          triggerClassName="rounded-r-none bg-slate-50 border-slate-300"
                        />
                      )}
                    />

                    <Controller
                      name="insured_phone_number"
                      control={control}
                      rules={{
                        required: 'Phone Number is required',
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'Phone Number must contain only numbers',
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="insured_phone_number"
                          size="lg"
                          placeholder="Input number"
                          {...field}
                          className={`rounded-l-none bg-transparent ${
                            errors.insured_phone_number
                              ? invalidControlClassName
                              : defaultControlClassName
                          }`}
                        />
                      )}
                    />
                  </Box>
                  <FieldError message={errors.insured_phone_number?.message} />
                </Box>

                <Box>
                  <Box as="label" htmlFor="insured_id_number" className={fieldLabelClassName}>
                    ID Number (Optional)
                  </Box>
                  <Controller
                    name="insured_id_number"
                    control={control}
                    rules={{
                      maxLength: {
                        value: 16,
                        message: 'ID Number must be 16 digits',
                      },
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'ID Number must contain only numbers',
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="insured_id_number"
                        inputMode="number"
                        size="lg"
                        placeholder="Input 16 digit ID number"
                        {...field}
                        className={`bg-transparent ${
                          errors.insured_id_number
                            ? invalidControlClassName
                            : defaultControlClassName
                        }`}
                      />
                    )}
                  />
                  <FieldError message={errors.insured_id_number?.message} />
                </Box>

                <Box>
                  <Box as="label" htmlFor="insured_npwp_number" className={fieldLabelClassName}>
                    NPWP Number (Optional)
                  </Box>
                  <Controller
                    name="insured_npwp_number"
                    control={control}
                    rules={{
                      maxLength: {
                        value: 16,
                        message: 'NPWP Number must be 16 digits',
                      },
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'NPWP Number must contain only numbers',
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="insured_npwp_number"
                        inputMode="number"
                        size="lg"
                        placeholder="Input 16 digit NPWP number"
                        {...field}
                        className={`bg-transparent ${
                          errors.insured_npwp_number
                            ? invalidControlClassName
                            : defaultControlClassName
                        }`}
                      />
                    )}
                  />
                  <FieldError message={errors.insured_npwp_number?.message} />
                </Box>

                <Box className="sm:col-span-2">
                  <Box as="label" htmlFor="insured_mailing_address" className={fieldLabelClassName}>
                    Mailing Address (Optional)
                  </Box>
                  <Controller
                    name="insured_mailing_address"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="insured_mailing_address"
                        size="lg"
                        rows={4}
                        placeholder="Input address"
                        {...field}
                        className={`bg-transparent ${
                          errors.insured_mailing_address
                            ? invalidControlClassName
                            : defaultControlClassName
                        }`}
                      />
                    )}
                  />
                  <FieldError message={errors.insured_mailing_address?.message} />
                </Box>

                <Box>
                  <Box as="label" htmlFor="insurance_id" className={fieldLabelClassName}>
                    Insurance Name
                    <RequiredMark />
                  </Box>
                  <Controller
                    name="insurance_id"
                    control={control}
                    rules={{ required: 'Insurance Name is required' }}
                    render={({ field }) => (
                      <Combobox
                        id="insurance_id"
                        size="lg"
                        options={insuranceOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Choose insurance company"
                        searchPlaceholder="Search insurance..."
                        triggerClassName={`bg-transparent ${
                          errors.insurance_id ? invalidControlClassName : defaultControlClassName
                        }`}
                      />
                    )}
                  />
                  <FieldError message={errors.insurance_id?.message} />
                </Box>

                <Box>
                  <Box
                    as="label"
                    htmlFor="insured_product_category"
                    className={fieldLabelClassName}
                  >
                    Product Category
                    <RequiredMark />
                  </Box>
                  <Controller
                    name="insured_product_category"
                    control={control}
                    rules={{ required: 'Product Category is required' }}
                    render={({ field }) => (
                      <Combobox
                        id="insured_product_category"
                        size="lg"
                        options={categoryOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Choose product category"
                        searchPlaceholder="Search category..."
                        triggerClassName={`bg-transparent ${
                          errors.insured_product_category
                            ? invalidControlClassName
                            : defaultControlClassName
                        }`}
                      />
                    )}
                  />
                  <FieldError message={errors.insured_product_category?.message} />
                </Box>

                <Box>
                  <Box as="label" htmlFor="insured_plan_id" className={fieldLabelClassName}>
                    Plan Name
                    <RequiredMark />
                  </Box>
                  <Controller
                    name="insured_plan_id"
                    control={control}
                    rules={{ required: 'Plan Name is required' }}
                    render={({ field }) => (
                      <Combobox
                        id="insured_plan_id"
                        size="lg"
                        options={planOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Choose plan name"
                        searchPlaceholder="Search plan..."
                        triggerClassName={`bg-transparent ${
                          errors.insured_plan_id ? invalidControlClassName : defaultControlClassName
                        }`}
                      />
                    )}
                  />
                  <FieldError message={errors.insured_plan_id?.message} />
                </Box>

                <Box>
                  <Box as="label" htmlFor="insured_premium" className={fieldLabelClassName}>
                    Premium
                    <RequiredMark />
                  </Box>
                  <Box className="flex gap-1">
                    <Controller
                      name="insured_premium_currency"
                      control={control}
                      render={({ field }) => (
                        <InlineSelect
                          id="insured_premium_currency"
                          options={currencies}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="IDR"
                          className="w-[104px] shrink-0"
                          triggerClassName="rounded-r-none bg-slate-50 border-slate-300"
                        />
                      )}
                    />

                    <Controller
                      name="insured_premium"
                      control={control}
                      rules={{
                        required: 'Premium is required',
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'Premium must contain only numbers',
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="insured_premium"
                          inputMode="number"
                          size="lg"
                          placeholder="Input amount"
                          {...field}
                          className={`rounded-l-none bg-transparent ${
                            errors.insured_premium
                              ? invalidControlClassName
                              : defaultControlClassName
                          }`}
                        />
                      )}
                    />
                  </Box>
                  <FieldError message={errors.insured_premium?.message} />
                </Box>

                <Box>
                  <Box as="label" htmlFor="insured_effective_date" className={fieldLabelClassName}>
                    Effective Date
                    <RequiredMark />
                  </Box>
                  <Controller
                    name="insured_effective_date"
                    control={control}
                    rules={{ required: 'Effective Date is required' }}
                    render={({ field }) => (
                      <DatePicker
                        id="insured_effective_date"
                        size="lg"
                        placeholder="Choose Date"
                        iconPosition="end"
                        value={parseDate(field.value)}
                        onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        error={Boolean(errors.insured_effective_date)}
                        className="w-full"
                        classNames={{
                          control: `bg-transparent ${
                            errors.insured_effective_date
                              ? invalidControlClassName
                              : defaultControlClassName
                          }`,
                        }}
                      />
                    )}
                  />
                  <FieldError message={errors.insured_effective_date?.message} />
                </Box>

                <Box>
                  <Box as="label" htmlFor="insured_exp_date" className={fieldLabelClassName}>
                    Expiry Date
                    <RequiredMark />
                  </Box>
                  <Controller
                    name="insured_exp_date"
                    control={control}
                    rules={{ required: 'Expiry Date is required' }}
                    render={({ field }) => (
                      <DatePicker
                        id="insured_exp_date"
                        size="lg"
                        placeholder="Choose Date"
                        iconPosition="end"
                        value={parseDate(field.value)}
                        onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        error={Boolean(errors.insured_exp_date)}
                        className="w-full"
                        classNames={{
                          control: `bg-transparent ${
                            errors.insured_exp_date
                              ? invalidControlClassName
                              : defaultControlClassName
                          }`,
                        }}
                      />
                    )}
                  />
                  <FieldError message={errors.insured_exp_date?.message} />
                </Box>

                <Box>
                  <Box as="label" htmlFor="insured_payment_period" className={fieldLabelClassName}>
                    Payment Period
                    <RequiredMark />
                  </Box>
                  <Controller
                    name="insured_payment_period"
                    control={control}
                    rules={{ required: 'Payment Period is required' }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="insured_payment_period"
                        inputMode="number"
                        size="lg"
                        placeholder="Insert payment period"
                        {...field}
                        className={`bg-transparent ${
                          errors.insured_payment_period
                            ? invalidControlClassName
                            : defaultControlClassName
                        }`}
                      />
                    )}
                  />
                  <FieldError message={errors.insured_payment_period?.message} />
                </Box>

                <Box>
                  <Box as="label" htmlFor="insured_payment_method" className={fieldLabelClassName}>
                    Payment Method
                    <RequiredMark />
                  </Box>
                  <Controller
                    name="insured_payment_method"
                    control={control}
                    rules={{ required: 'Payment Method is required' }}
                    render={({ field }) => (
                      <Select
                        id="insured_payment_method"
                        size="lg"
                        options={paymentMethodOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Choose payment method"
                        error={Boolean(errors.insured_payment_method)}
                      />
                    )}
                  />
                  <FieldError message={errors.insured_payment_method?.message} />
                </Box>
              </Box>
            </FormSection>

            <FormSection title="Agent Information">
              <Box className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <Box>
                  <Box as="label" htmlFor="agent_name" className={fieldLabelClassName}>
                    Agent Name (Optional)
                  </Box>
                  <Controller
                    name="agent_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="agent_name"
                        size="lg"
                        placeholder="Input full name"
                        {...field}
                        className={`bg-transparent ${
                          errors.agent_name ? invalidControlClassName : defaultControlClassName
                        }`}
                      />
                    )}
                  />
                  <FieldError message={errors.agent_name?.message} />
                </Box>

                <Box>
                  <Box as="label" htmlFor="agent_phone_number" className={fieldLabelClassName}>
                    Phone Number
                    <RequiredMark />
                  </Box>

                  <Box className="flex gap-1">
                    <Controller
                      name="agent_phone_number_code"
                      control={control}
                      render={({ field }) => (
                        <InlineSelect
                          id="agent_phone_number_code"
                          options={phoneCode}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="+62"
                          className="w-[96px] shrink-0"
                          triggerClassName="rounded-r-none bg-slate-50 border-slate-300"
                        />
                      )}
                    />

                    <Controller
                      name="agent_phone_number"
                      control={control}
                      rules={{
                        required: 'Phone Number is required',
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'Phone Number must contain only numbers',
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="agent_phone_number"
                          inputMode="number"
                          size="lg"
                          placeholder="Input number"
                          {...field}
                          className={`rounded-l-none bg-transparent ${
                            errors.agent_phone_number
                              ? invalidControlClassName
                              : defaultControlClassName
                          }`}
                        />
                      )}
                    />
                  </Box>
                  <FieldError message={errors.agent_phone_number?.message} />
                </Box>
              </Box>
            </FormSection>

            <FormSection title="Insured Object">
              <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Box as="p" className="max-w-2xl text-sm leading-6 text-slate-600">
                  Enter the items or assets to be insured under this policy.
                </Box>
                <Button
                  type="button"
                  className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:w-auto"
                  onClick={handleAddInsuredObject}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Object
                </Button>
              </Box>

              <Box className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                <Table className="table-search-params">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="whitespace-nowrap py-3 px-4 text-sm font-semibold">
                        Name
                      </TableHead>
                      <TableHead className="w-32 py-3 px-4 text-center text-sm font-semibold">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((_, index) => (
                      <TableRow key={index} className="align-top bg-white hover:bg-white">
                        <TableCell className="px-4 py-4">
                          <Controller
                            name={`participants.${index}.value`}
                            control={control}
                            rules={{
                              required: 'Name is required',
                            }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                id={`participants.${index}`}
                                size="lg"
                                placeholder="E.g. Office Building"
                                readOnly={!!participants?.[index]?.isEdit}
                                {...field}
                                className={`bg-white ${
                                  errors.participants?.[index]
                                    ? invalidControlClassName
                                    : defaultControlClassName
                                } ${
                                  participants?.[index]?.isEdit
                                    ? 'border-slate-200 bg-slate-50 text-slate-700'
                                    : ''
                                }`}
                              />
                            )}
                          />
                          <FieldError message={errors.participants?.[index]?.value?.message} />
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <Box className="flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                participants?.[index]?.isEdit
                                  ? handleEditInsuredObject(index)
                                  : handleSaveInsuredObject(index)
                              }
                              className={`h-9 w-9 rounded-md border px-0 shadow-none ${
                                participants?.[index]?.isEdit
                                  ? 'border-slate-200 bg-white text-slate-600 enabled:hover:bg-slate-50 enabled:hover:text-slate-900'
                                  : 'border-emerald-100 bg-white text-emerald-700 enabled:hover:bg-emerald-50 enabled:hover:text-emerald-800 disabled:bg-white'
                              }`}
                              disabled={
                                !participants?.[index]?.isEdit && !participants[index].value
                              }
                              aria-label={
                                participants?.[index]?.isEdit
                                  ? 'Edit insured object'
                                  : 'Save insured object'
                              }
                            >
                              {participants?.[index]?.isEdit ? (
                                <Edit className="w-4 h-4" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-9 w-9 rounded-md border border-rose-100 bg-white px-0 text-rose-600 shadow-none enabled:hover:bg-rose-50 enabled:hover:text-rose-700"
                              onClick={() => handleRemoveInsuredObject(index)}
                              aria-label="Remove insured object"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </FormSection>
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
