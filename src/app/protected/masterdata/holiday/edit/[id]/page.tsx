"use client";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import WithSidebar from "@/hoc/with-sidebar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Check } from "react-feather";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useLoading } from "@/context/loading.context";
import useCalendar from "../../hook";
import { formatDate } from "@/lib/formatter";
import { HOLIDAY } from "@/constants/routes";

const EditHolidayPage = () => {
    const { id } = useParams();
    const { getCalendarHoliday, dataCalendar, updateCalendar } = useCalendar();
    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
        setValue,
    } = useForm({
        defaultValues: {
            date: "",
            country: "",
            type: "",
            name: "",
        },
    });

    const router = useRouter();
    const handleCancel = () => {
        router.push(HOLIDAY);
    };

    const { setLoading } = useLoading();
    const [types, setTypes] = useState<any[]>([
        { name: "Joint Leave", code: "Joint Leave" },
        { name: "National Holiday", code: "National Holiday" },
    ]);
    const [countries, setCountries] = useState<any[]>([
        { name: "Indonesia", code: "id" },
        { name: "Malaysia", code: "my" },
    ]);

    const handleUpdateHoliday = async (data: any) => {
        try {
            setLoading(true);
            await updateCalendar(id as string, {
                ...data,
            });
            router.push(HOLIDAY);

        } catch (error) {
            console.error(error);
            alert("Failed to update holiday");
        } finally {
            setLoading(false);
        }
    };

    // const watchInsurance = useWatch({ control, name: "insurance" });
    // const watchProduct = useWatch({ control, name: "product" });
    // const watchPlan = useWatch({ control, name: "plan" });

    useEffect(() => {
        setLoading(true);
        getCalendarHoliday({ id }).then((x) => {
            setLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (dataCalendar && dataCalendar.data[0]) {
            setValue("date", formatDate(dataCalendar.data[0].date, "YYYY-MM-DD"));
            setValue("type", dataCalendar.data[0].type);
            setValue("country", dataCalendar.data[0].country);
            setValue("name", dataCalendar.data[0].name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataCalendar]);

    return (
        <div className="flex flex-col w-full">
            <div className="bg-white md:px-6 p-4 flex items-center">
                <div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={HOLIDAY}>Holiday</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Update Holiday</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
                        Update Holiday
                    </h2>
                </div>
                <div className="flex space-x-4 ml-auto">
                    <div
                        onClick={handleCancel}
                        className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </div>
                    <Button
                        type="submit"
                        onClick={handleSubmit(handleUpdateHoliday)}
                        className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
                    >
                        <Check className="mr-2 w-4 h-4" />
                        Save
                    </Button>
                </div>
            </div>

            <div className="flex flex-col w-full p-4 md:p-6 gap-4">
                <div className="p-4 sm:p-6 bg-white rounded-lg flex-col gap-4 grid sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Country
                        </label>

                        <Controller
                            name="country"
                            control={control}
                            rules={{ required: "Country is required" }}
                            render={({ field }) => (
                                <Select value={field.value}
                                    onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                                        <SelectValue placeholder="Select Country " />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {countries.map((item: any) => (
                                                <SelectItem key={item.code} value={item.code}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.country && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.country.message?.toString()}
                            </p>
                        )}
                    </div>
                    <div></div>
                    <div>
                        <label
                            htmlFor="type"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Holiday Type
                        </label>

                        <Controller
                            name="type"
                            control={control}
                            rules={{ required: "Holiday Type is required" }}
                            render={({ field }) => (
                                <Select value={field.value}
                                    onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                                        <SelectValue placeholder="Select Holiday Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {types.map((item: any) => (
                                                <SelectItem key={item.code} value={item.code}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.type && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.type.message?.toString()}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Holiday Name
                        </label>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Holiday Name is required" }}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2"
                                    {...field}
                                />
                            )}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name.message?.toString()}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="date"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Date
                        </label>
                        <Controller
                            name="date"
                            control={control}
                            rules={{ required: "Date is required" }}
                            render={({ field }) => (
                                <Input
                                    type="date"
                                    id="date"
                                    required
                                    placeholder="Insert date"
                                    {...field}
                                />
                            )}
                        />
                        {errors.date && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.date.message?.toString()}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const EditHolidayPageWithSidebar = (params: any) =>
    WithSidebar(EditHolidayPage)(params);

export default EditHolidayPageWithSidebar;
