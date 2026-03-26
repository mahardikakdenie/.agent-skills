// "use client";
//
// import React from "react";
// import {TransactionAddView} from "@/views/transaction/add/add.view";
//
// export default function TransactionExportPage() {
//     return <TransactionAddView />;
// }

"use client";
import _ from "lodash";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useState, useEffect } from "react";
import { Check, ChevronLeft, Edit, Plus, Trash2 } from "react-feather";
import { Input } from "@/components/ui/input";
import { Textarea } from "@repo/ui";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui";
import { toastNotification } from "@/lib/toast";
import AppURL from "@/constants/app-url.const";
import { channelService } from "@/services/channel/api/channel.service";
import { productService } from "@/services/product/api/product.service";
import { transactionService } from "@/services/transaction/api/transaction.service";
import { useCreateTransactionsConventional } from "@/services/transaction/hooks/mutations";

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
    type: "Company" | "Individual" | "";
    participants: { value: string; isEdit: boolean }[];
};

export default function AddTransaction() {
    const [searchCustomer, setSearchCustomer] = useState<string>("");
    const [pickedPlan, setPickedPlan] = useState<any>({});
    const [pickedCustomer, setPickedCustomer] = useState<any>(null);

    const [channels, setChannels] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [insurances, setInsurances] = useState<any[]>([]);
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);

    const {
        handleSubmit,
        control,
        resetField,
        setValue,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<RenewalForm>({
        defaultValues: {
            channel_id: "40eee5bf-2b92-4d23-be55-f9caa9d3ea88",
            agent_name: "",
            agent_phone_number: "",
            agent_phone_number_code: "+62",
            customer_id: "",
            email: "",
            insured_effective_date: "",
            insured_exp_date: "",
            insured_id_number: "",
            insurance_id: "",
            insured_mailing_address: "",
            insured_product_category: "",
            insured_npwp_number: "",
            insured_payment_method: "",
            insured_payment_period: "",
            insured_phone_number: "",
            insured_phone_number_code: "+62",
            insured_plan_id: "",
            insured_premium: "",
            insured_premium_currency: "IDR",
            phone_number: "",
            phone_number_code: "+62",
            pic: "",
            type: "",
            participants: [{ value: "", isEdit: false }],
        },
    });

    const selectedType = useWatch({
        control,
        name: "type",
    });

    const selectedCustomer = useWatch({
        control,
        name: "customer_id",
    });

    const selectedInsurance = useWatch({
        control,
        name: "insurance_id",
    });

    const selectedCategory = useWatch({
        control,
        name: "insured_product_category",
    });

    const selectedPlan = useWatch({
        control,
        name: "insured_plan_id",
    });

    const participants = useWatch({
        control,
        name: "participants",
    });

    const router = useRouter();
    const { mutateAsync: createTransactionsConventional } =
        useCreateTransactionsConventional();

    const onSubmit = async (data: RenewalForm) => {
        const request = {
            channel_id: data.channel_id,
            customer: {
                type: data.type,
                name: pickedCustomer.name,
                phone: `${data.phone_number_code}${data.phone_number}`,
                email: data.email,
            },
            package_id: pickedPlan.packages?.[0]?.id || "",
            pic: {
                name: data.pic,
                phone_number: `${data.insured_phone_number_code}${data.insured_phone_number}`,
                identification_number: data.insured_id_number || "",
                npwp_number: data.insured_npwp_number || "",
                mailing_address: data.insured_mailing_address || "",
            },
            agent: {
                name: data.agent_name || "",
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
            toastNotification("Transaction created successfully!");
            router.push(AppURL.transactionList);
        } catch (error) {
            toastNotification("Failed to create transaction!", "error");
        }
    };

    const handleCustomerChange = (id: string, newOption?: any) => {
        if (newOption && !customers.find((c) => c.id === newOption.id)) {
            setCustomers((prev) => [...prev, newOption]);
        }
        setValue("customer_id", id);
    };

    const handleSearchCustomer = _.debounce((query: string) => {
        setSearchCustomer(query);
    }, 300);

    const handleAddInsuredObject = () => {
        setValue("participants", [...participants, { value: "", isEdit: false }]);
    };

    const handleSaveInsuredObject = (index: number) => {
        setValue(
            "participants",
            participants.map((item, i) =>
                i === index ? { ...item, isEdit: true } : item
            )
        );
    };

    const handleEditInsuredObject = (index: number) => {
        setValue(
            "participants",
            participants.map((item, i) =>
                i === index ? { ...item, isEdit: false } : item
            )
        );
    };

    const handleRemoveInsuredObject = (index: number) => {
        setValue(
            "participants",
            participants.filter((_, i) => i !== index)
        );
    };

    const types = [
        {
            id: "Company",
            name: "Company",
        },
        {
            id: "Individual",
            name: "Individual",
        },
    ];

    const phoneCode = [
        {
            id: "+60",
            name: "+60",
        },
        {
            id: "+62",
            name: "+62",
        },
    ];

    const paymentMethods = [
        {
            id: "transfer",
            name: "Bank Transfer",
        },
    ];

    const fetchChannels = async () => {
        try {
            const res: any = await channelService.getChannelsV1({
                page: 1,
                limit: 100,
            });
            setChannels(res?.data || []);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchCustomers = async () => {
        try {
            const params = {
                page: 1,
                limit: 100,
                type: selectedType ? selectedType : undefined,
                name: searchCustomer ? searchCustomer : undefined
            };
            const res: any = await transactionService.getCustomers(params);
            setCustomers(res?.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchInsurances = async () => {
        try {
            const res: any = await productService.getInsurances();
            setInsurances(
                ((res?.data || []) as any[]).map((item: any) => ({
                    id: item.id,
                    name: item.name,
                }))
            );
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProductCategories = async () => {
        try {
            const res: any = await productService.getCategories();
            setCategories(
                ((res?.data || []) as any[]).map((item: any) => ({
                    id: item.name,
                    name: item.name,
                }))
            );
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCurrencies = async () => {
        try {
            const res: any = await productService.getReferenceCurrencies();
            setCurrencies(
                ((res?.data || []) as any[]).map((item: any) => ({
                    id: item.name,
                    name: item.name,
                }))
            );
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPlans = async (insuranceId: string, category: string) => {
        try {
            const res: any = await productService.getPlans({
                insuranceId,
                category,
            });
            setPlans(res?.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchChannels()
        fetchInsurances();
        fetchProductCategories();
        fetchCurrencies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchCustomers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedType, searchCustomer]);

    useEffect(() => {
        if (selectedCustomer) {
            const findCustomer = customers.find(
                (customer) => customer.id === selectedCustomer
            );
            if (findCustomer && findCustomer.phone && findCustomer.email) {
                setValue(
                    "phone_number",
                    findCustomer.phone
                        .replace(/^\+60/, "")
                        .replace(/^\+62/, "")
                        .replace(/^0/, "")
                );
                setValue("email", findCustomer.email);
                clearErrors("customer_id");
                clearErrors("phone_number");
                clearErrors("email");
            } else {
                clearErrors("customer_id");
                resetField("phone_number");
                resetField("email");
            }
            setPickedCustomer(findCustomer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCustomer, resetField]);

    useEffect(() => {
        if (selectedCategory) {
            fetchPlans(selectedInsurance, selectedCategory);
            if (selectedPlan) {
                resetField("insured_plan_id");
                resetField("insured_premium");
                resetField("insured_premium_currency");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedInsurance, selectedCategory, resetField]);

    useEffect(() => {
        const findPlan = plans.find((plan) => plan.id === selectedPlan);

        if (findPlan) {
            setValue("insured_premium", +findPlan.packages?.[0]?.premium || 0);
            setValue(
                "insured_premium_currency",
                findPlan.packages?.[0]?.currency || "IDR"
            );
            setPickedPlan(findPlan);
            if (errors.insured_premium?.message) {
                clearErrors("insured_premium");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPlan, resetField]);

    return (
        <div className="flex flex-col w-full">
            <div className="bg-white md:px-6 p-4 flex items-center">
                <div>
                    <Breadcrumb className="sm:block hidden">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={AppURL.transactionList}>
                                    Transaction List
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Add</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
                        Add Transaction
                    </h2>
                </div>
                <div className="flex space-x-4 ml-auto">
                    <div
                        onClick={() => router.back()}
                        className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </div>
                    <Button
                        onClick={() => handleSubmit(onSubmit)()}
                        disabled={isSubmitting}
                        className="bg-[#F5BA41] min-w-24 text-black hover:bg-[#e6a92d] rounded-full"
                    >
                        Save
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6 p-6">
                    {/* Channel */}
                    <div className="flex flex-col gap-4 pt-5 md:px-6 p-4 rounded-lg bg-white">
                        <div>
                            <h2 className="font-semibold text-[#016DA1]">
                                Channel
                            </h2>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label
                                    htmlFor="channel_id"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Channel Name
                                </label>
                                <Controller
                                    name="channel_id"
                                    control={control}
                                    rules={{ required: "Channel is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        >
                                            <SelectTrigger
                                                className={`h-16 border border-gray-300 shadow-sm ${cn(
                                                    errors.channel_id && "border-red-500"
                                                )}`}
                                            >
                                                <SelectValue placeholder="Choose channel">
                                                    {field.value
                                                        ? channels.find(
                                                            (chn) => chn.id === field.value
                                                        )?.name
                                                        : "Choose channel"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {channels.map((chn) => (
                                                        <SelectItem key={chn.id} value={chn.id}>
                                                            {chn.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.channel_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.channel_id?.message?.toString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Policy Holder Information */}
                    <div className="flex flex-col gap-4 pt-5 md:px-6 p-4 rounded-lg bg-white">
                        <div>
                            <h2 className="font-semibold text-[#016DA1]">
                                Policy Holder Information
                            </h2>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label
                                    htmlFor="insuranceId"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Type
                                </label>
                                <Controller
                                    name="type"
                                    control={control}
                                    rules={{ required: "Type is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        >
                                            <SelectTrigger
                                                className={`h-16 border border-gray-300 shadow-sm ${cn(
                                                    errors.type && "border-red-500"
                                                )}`}
                                            >
                                                <SelectValue placeholder="Choose type">
                                                    {field.value
                                                        ? types.find((type) => type.id === field.value)
                                                            ?.name
                                                        : "Choose type"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {types.map((type) => (
                                                        <SelectItem key={type.id} value={type.id}>
                                                            {type.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.type && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.type?.message?.toString()}
                                    </p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label
                                    htmlFor="customer_id"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Customer Name
                                </label>
                                <Controller
                                    name="customer_id"
                                    control={control}
                                    rules={{ required: "Customer Name is required" }}
                                    render={({ field }) => (
                                        <Combobox
                                            {...field}
                                            onChange={handleCustomerChange}
                                            onSearch={handleSearchCustomer}
                                            className={`h-16 border border-gray-300 shadow-sm ${cn(
                                                errors.customer_id && "border-red-500"
                                            )}`}
                                            options={customers}
                                            newOptionText="Type something and press ‘Enter’ to add a new customer"
                                            placeholder="Input name"
                                            placeholderInput="Find Customer Name"
                                        />
                                    )}
                                />
                                {errors.customer_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.customer_id?.message?.toString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label
                                    htmlFor="phone_number"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Phone Number
                                </label>
                                <div className="flex space-x-1">
                                    <Controller
                                        name="phone_number_code"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                defaultValue="+62"
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                }}
                                            >
                                                <SelectTrigger
                                                    className={`h-16 bg-gray-100 border border-gray-300 rounded-tr-none rounded-br-none shadow-sm w-full max-w-[90px] ${cn(
                                                        errors.phone_number_code && "border-red-500"
                                                    )}`}
                                                >
                                                    <SelectValue>
                                                        {field.value
                                                            ? phoneCode.find(
                                                                (item) => item.id === field.value
                                                            )?.name
                                                            : "+62"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {phoneCode.map((item) => (
                                                            <SelectItem key={item.id} value={item.id}>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />

                                    <Controller
                                        name="phone_number"
                                        control={control}
                                        rules={{
                                            required: "Phone Number is required",
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: "Phone Number must contain only numbers",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                id="phone_number"
                                                inputMode="numeric"
                                                placeholder="812xxxxxxx"
                                                {...field}
                                                readOnly={
                                                    pickedCustomer?.phone || pickedCustomer?.email
                                                }
                                                className={`block w-full !rounded-tl-none !rounded-bl-none placeholder:text-black h-16 ${
                                                    errors.phone_number
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                } rounded-md shadow-sm`}
                                            />
                                        )}
                                    />
                                </div>
                                {errors.phone_number && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.phone_number?.message?.toString()}
                                    </p>
                                )}
                            </div>

                            <div className="w-1/2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email
                                </label>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Email invalid",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="email"
                                            placeholder="Input email address, e.g. example@mail.com"
                                            readOnly={pickedCustomer?.phone || pickedCustomer?.email}
                                            {...field}
                                            className={`mt-1 block w-full placeholder:text-black h-16 ${
                                                errors.email ? "border-red-500" : "border-gray-300"
                                            } rounded-md shadow-sm`}
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.email?.message?.toString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Insured Information */}
                    <div className="flex flex-col gap-4 pt-5 md:px-6 p-4 rounded-lg bg-white">
                        <div>
                            <h2 className="font-semibold text-[#016DA1]">
                                Insured Information
                            </h2>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label
                                    htmlFor="pic"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    PIC Name
                                </label>
                                <Controller
                                    name="pic"
                                    control={control}
                                    rules={{ required: "PIC is required" }}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="pic"
                                            placeholder="Insert PIC name"
                                            {...field}
                                            className={`mt-1 block w-full placeholder:text-black h-16 ${
                                                errors.pic ? "border-red-500" : "border-gray-300"
                                            } rounded-md shadow-sm`}
                                        />
                                    )}
                                />
                                {errors.pic && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.pic?.message?.toString()}
                                    </p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label
                                    htmlFor="insured_phone_number"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Phone Number
                                </label>

                                <div className="flex space-x-1">
                                    <Controller
                                        name="insured_phone_number_code"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                defaultValue="+62"
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                }}
                                            >
                                                <SelectTrigger
                                                    className={`h-16 bg-gray-100 border border-gray-300 rounded-tr-none rounded-br-none shadow-sm w-full max-w-[90px] ${cn(
                                                        errors.insured_phone_number_code && "border-red-500"
                                                    )}`}
                                                >
                                                    <SelectValue>
                                                        {field.value
                                                            ? phoneCode.find(
                                                                (item) => item.id === field.value
                                                            )?.name
                                                            : "+62"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {phoneCode.map((item) => (
                                                            <SelectItem key={item.id} value={item.id}>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />

                                    <Controller
                                        name="insured_phone_number"
                                        control={control}
                                        rules={{
                                            required: "Phone Number is required",
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: "Phone Number must contain only numbers",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                id="insured_phone_number"
                                                placeholder="Input number"
                                                {...field}
                                                className={`block w-full !rounded-tl-none !rounded-bl-none placeholder:text-black h-16 ${
                                                    errors.insured_phone_number
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                } rounded-md shadow-sm`}
                                            />
                                        )}
                                    />
                                </div>
                                {errors.insured_phone_number && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.insured_phone_number?.message?.toString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label
                                    htmlFor="insured_id_number"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    ID Number (Optional)
                                </label>
                                <Controller
                                    name="insured_id_number"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 16,
                                            message: "ID Number must be 16 digits",
                                        },
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: "ID Number must contain only numbers",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="insured_id_number"
                                            placeholder="Input 16 digit ID number"
                                            {...field}
                                            className={`mt-1 block w-full placeholder:text-black h-16 ${
                                                errors.insured_id_number
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } rounded-md shadow-sm`}
                                        />
                                    )}
                                />
                                {errors.insured_id_number && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.insured_id_number?.message?.toString()}
                                    </p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label
                                    htmlFor="insured_npwp_number"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    NPWP Number (Optional)
                                </label>
                                <Controller
                                    name="insured_npwp_number"
                                    control={control}
                                    rules={{
                                        maxLength: {
                                            value: 16,
                                            message: "NPWP Number must be 16 digits",
                                        },
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: "NPWP Number must contain only numbers",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="insured_npwp_number"
                                            placeholder="Input 16 digit NPWP number"
                                            {...field}
                                            className={`mt-1 block w-full placeholder:text-black h-16 ${
                                                errors.insured_npwp_number
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } rounded-md shadow-sm`}
                                        />
                                    )}
                                />
                                {errors.insured_npwp_number && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.insured_npwp_number?.message?.toString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="w-full">
                                <label
                                    htmlFor="insured_mailing_address"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Mailing Address (Optional)
                                </label>
                                <Controller
                                    name="insured_mailing_address"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            id="insured_mailing_address"
                                            placeholder="Input address"
                                            {...field}
                                            className={`mt-1 min-h-[80px] block w-full placeholder:text-black h-16 ${
                                                errors.insured_mailing_address
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } rounded-md shadow-sm`}
                                        />
                                    )}
                                />
                                {errors.insured_mailing_address && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.insured_mailing_address?.message?.toString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label
                                    htmlFor="insurance_id"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Insurance Name
                                </label>
                                <Controller
                                    name="insurance_id"
                                    control={control}
                                    rules={{ required: "Insurance Name is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        >
                                            <SelectTrigger
                                                className={`h-16 border border-gray-300 shadow-sm ${cn(
                                                    errors.insurance_id && "border-red-500"
                                                )}`}
                                            >
                                                <SelectValue placeholder="Choose insurance company">
                                                    {field.value
                                                        ? insurances.find((comp) => comp.id === field.value)
                                                            ?.name
                                                        : "Choose insurance company"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {insurances.map((comp) => (
                                                        <SelectItem key={comp.id} value={comp.id}>
                                                            {comp.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.insurance_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.insurance_id?.message?.toString()}
                                    </p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label
                                    htmlFor="insured_product_category"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Product Category
                                </label>
                                <Controller
                                    name="insured_product_category"
                                    control={control}
                                    rules={{ required: "Product Category is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        >
                                            <SelectTrigger
                                                className={`h-16 border border-gray-300 shadow-sm ${cn(
                                                    errors.insured_product_category && "border-red-500"
                                                )}`}
                                            >
                                                <SelectValue placeholder="Choose product category">
                                                    {field.value
                                                        ? categories.find(
                                                            (category) => category.id === field.value
                                                        )?.name
                                                        : "Choose product category"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.insured_product_category && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.insured_product_category?.message?.toString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label
                                    htmlFor="insured_plan_id"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Plan Name
                                </label>
                                <Controller
                                    name="insured_plan_id"
                                    control={control}
                                    rules={{ required: "Plan Name is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        >
                                            <SelectTrigger
                                                className={`h-16 border border-gray-300 shadow-sm ${cn(
                                                    errors.insured_plan_id && "border-red-500"
                                                )}`}
                                            >
                                                <SelectValue placeholder="Choose plan name">
                                                    {field.value
                                                        ? plans.find((plan) => plan.id === field.value)
                                                            ?.name
                                                        : "Choose plan name"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {plans.map((plan) => (
                                                        <SelectItem key={plan.id} value={plan.id}>
                                                            {plan.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.insured_plan_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.insured_plan_id?.message?.toString()}
                                    </p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label
                                    htmlFor="insured_premium"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Premium
                                </label>
                                <div className="flex space-x-1">
                                    <Controller
                                        name="insured_premium_currency"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                defaultValue="IDR"
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                }}
                                            >
                                                <SelectTrigger
                                                    className={`h-16 bg-gray-100 border border-gray-300 rounded-tr-none rounded-br-none shadow-sm w-full max-w-[90px] ${cn(
                                                        errors.insured_premium_currency && "border-red-500"
                                                    )}`}
                                                >
                                                    <SelectValue>
                                                        {field.value
                                                            ? currencies.find(
                                                                (item) => item.id === field.value
                                                            )?.name
                                                            : "IDR"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {currencies.map((item) => (
                                                            <SelectItem key={item.id} value={item.id}>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />

                                    <Controller
                                        name="insured_premium"
                                        control={control}
                                        rules={{
                                            required: "Premium is required",
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: "Premium must contain only numbers",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                id="insured_premium"
                                                placeholder="Input amount"
                                                {...field}
                                                className={`block w-full !rounded-tl-none !rounded-bl-none placeholder:text-black h-16 ${
                                                    errors.insured_premium
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                } rounded-md shadow-sm`}
                                            />
                                        )}
                                    />
                                </div>

                                {errors.insured_premium && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.insured_premium?.message?.toString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label
                                    htmlFor="insured_effective_date"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Effective Date
                                </label>
                                <Controller
                                    name="insured_effective_date"
                                    control={control}
                                    rules={{ required: "Effective Date is required" }}
                                    render={({ field }) => (
                                        <Input
                                            type="date"
                                            id="insured_effective_date"
                                            placeholder="Choose Date"
                                            {...field}
                                            className={`mt-1 block w-full h-16 ${
                                                errors.insured_effective_date
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } rounded-md shadow-sm`}
                                        />
                                    )}
                                />
                                {errors.insured_effective_date && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.insured_effective_date?.message?.toString()}
                                    </p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label
                                    htmlFor="insured_exp_date"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Expiry Date
                                </label>
                                <Controller
                                    name="insured_exp_date"
                                    control={control}
                                    rules={{ required: "Effective Date is required" }}
                                    render={({ field }) => (
                                        <Input
                                            type="date"
                                            id="insured_exp_date"
                                            placeholder="Choose Date"
                                            {...field}
                                            className={`mt-1 block w-full h-16 ${
                                                errors.insured_exp_date
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } rounded-md shadow-sm`}
                                        />
                                    )}
                                />
                                {errors.insured_exp_date && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.insured_exp_date?.message?.toString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label
                                    htmlFor="insured_payment_period"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Payment Period
                                </label>
                                <Controller
                                    name="insured_payment_period"
                                    control={control}
                                    rules={{ required: "Payment Period is required" }}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="insured_payment_period"
                                            placeholder="Insert payment period"
                                            {...field}
                                            className={`block w-full !rounded-tl-none !rounded-bl-none placeholder:text-black h-16 ${
                                                errors.insured_payment_period
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } rounded-md shadow-sm`}
                                        />
                                    )}
                                />
                                {errors.insured_payment_period && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.insured_payment_period?.message?.toString()}
                                    </p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label
                                    htmlFor="insured_payment_method"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Payment Method
                                </label>
                                <Controller
                                    name="insured_payment_method"
                                    control={control}
                                    rules={{ required: "Payment Method is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                        >
                                            <SelectTrigger
                                                className={`h-16 border border-gray-300 shadow-sm ${cn(
                                                    errors.insured_payment_method && "border-red-500"
                                                )}`}
                                            >
                                                <SelectValue placeholder="Choose payment method">
                                                    {field.value
                                                        ? paymentMethods.find(
                                                            (plan) => plan.id === field.value
                                                        )?.name
                                                        : "Choose payment method"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {paymentMethods.map((plan) => (
                                                        <SelectItem key={plan.id} value={plan.id}>
                                                            {plan.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.insured_payment_method && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.insured_payment_method?.message?.toString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Agent Information */}
                    <div className="flex flex-col gap-4 pt-5 md:px-6 p-4 rounded-lg bg-white">
                        <div>
                            <h2 className="font-semibold text-[#016DA1]">
                                Agent Information
                            </h2>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label
                                    htmlFor="agent_name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Agent Name (Optional)
                                </label>
                                <Controller
                                    name="agent_name"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="agent_name"
                                            placeholder="Input full name"
                                            {...field}
                                            className={`mt-1 block w-full placeholder:text-black h-16 ${
                                                errors.agent_name ? "border-red-500" : "border-gray-300"
                                            } rounded-md shadow-sm`}
                                        />
                                    )}
                                />
                                {errors.agent_name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.agent_name?.message?.toString()}
                                    </p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label
                                    htmlFor="agent_phone_number"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Phone Number
                                </label>

                                <div className="flex space-x-1">
                                    <Controller
                                        name="agent_phone_number_code"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                defaultValue="+62"
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                }}
                                            >
                                                <SelectTrigger
                                                    className={`h-16 bg-gray-100 border border-gray-300 rounded-tr-none rounded-br-none shadow-sm w-full max-w-[90px] ${cn(
                                                        errors.agent_phone_number_code && "border-red-500"
                                                    )}`}
                                                >
                                                    <SelectValue>
                                                        {field.value
                                                            ? phoneCode.find(
                                                                (item) => item.id === field.value
                                                            )?.name
                                                            : "+62"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {phoneCode.map((item) => (
                                                            <SelectItem key={item.id} value={item.id}>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />

                                    <Controller
                                        name="agent_phone_number"
                                        control={control}
                                        rules={{
                                            required: "Phone Number is required",
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: "Phone Number must contain only numbers",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                id="agent_phone_number"
                                                placeholder="Input number"
                                                {...field}
                                                className={`block w-full !rounded-tl-none !rounded-bl-none placeholder:text-black h-16 ${
                                                    errors.agent_phone_number
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                } rounded-md shadow-sm`}
                                            />
                                        )}
                                    />
                                </div>
                                {errors.agent_phone_number && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.agent_phone_number?.message?.toString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex gap-4 items-center mb-4">
                            <div>
                                <div className="text-primary font-bold">Insured Object</div>
                                <p className="text-sm text-black/60">
                                    <i>
                                        Enter the items or assets to be insured under this policy
                                    </i>
                                </p>
                            </div>
                            <Button
                                color="warning"
                                className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full ml-auto w-32"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddInsuredObject();
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Object
                            </Button>
                        </div>
                        <div className="w-full bg-white rounded-lg overflow-auto">
                            <Table className="table-search-params">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap py-2">
                                            Name
                                        </TableHead>
                                        <TableHead className="text-center py-2 w-28">
                                            Action
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {participants.map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Controller
                                                    name={`participants.${index}.value`}
                                                    control={control}
                                                    rules={{
                                                        required: "Name is required",
                                                    }}
                                                    render={({ field }) => (
                                                        <Input
                                                            type="text"
                                                            id="participants.${index}"
                                                            placeholder="E.g. Office Building"
                                                            readOnly={!!participants?.[index]?.isEdit}
                                                            {...field}
                                                            className={`mt-1 block w-full placeholder:text-black h-16 ${
                                                                errors.participants?.[index]
                                                                    ? "border-red-500"
                                                                    : "border-gray-300"
                                                            } rounded-md shadow-sm`}
                                                        />
                                                    )}
                                                />
                                                {errors.participants?.[index]?.value && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.participants?.[
                                                            index
                                                            ]?.value?.message?.toString()}
                                                    </p>
                                                )}
                                            </TableCell>

                                            <TableCell className="text-center space-x-4">
                                                {participants?.[index]?.isEdit ? (
                                                    <Button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleEditInsuredObject(index);
                                                        }}
                                                        className="text-black/50 hover:text-black bg-transparent hover:bg-transparent p-0"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleSaveInsuredObject(index);
                                                        }}
                                                        className="text-black/50 hover:text-black bg-transparent hover:bg-transparent p-0"
                                                        disabled={!participants[index].value}
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </Button>
                                                )}
                                                <Button
                                                    className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleRemoveInsuredObject(index);
                                                    }}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
