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
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "react-feather";
import { Controller, useForm, useWatch } from "react-hook-form";
import useHoliday from "../hook";
import { useLoading } from "@/context/loading.context";

const CreateHoliday = () => {
    const router = useRouter();
    const handleCancel = () => {
        router.push("/masterdata/holiday");
    };

    const { createCalendar } = useHoliday();
    const { setLoading } = useLoading();

    const [types, setTypes] = useState<any[]>([
        { name: "Joint Leave", code: "Joint Leave" },
        { name: "National Holiday", code: "National Holiday" },
    ]);
    const [countries, setCountries] = useState<any[]>([
        { name: "Indonesia", code: "id" },
        { name: "Malaysia", code: "my" },
    ]);

    const handleCreateHoliday = async (data: any) => {
        try {
            setLoading(true);
            console.log(data)
            var res = await createCalendar({
                ...data,
                date: data.startdate,
                year: new Date(data.startdate).getFullYear().toString()
            });
            router.push("/masterdata/holiday");
        } catch (error) {
            console.error(error);
            alert("Failed to create holiday");
        } finally {
            setLoading(false);
        }
    };

    const {
        handleSubmit,
        reset,
        resetField,
        setValue,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: undefined,
            type: undefined,
            country: undefined,
            startdate: '',
            enddate: ''
        },
    });

    const watchType = useWatch({
        control,
        name: "type",
    });
    const watchCountry = useWatch({
        control,
        name: "country",
    });
    const watchStartdate = useWatch({
        control,
        name: "startdate",
    });

    return (
        <div className="flex flex-col w-full">
            <div className="bg-white md:px-6 p-4 flex items-center">
                <div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/masterdata/holiday">Holiday</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Create Holiday Date</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
                        Create Holiday Date
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
                        onClick={handleSubmit(handleCreateHoliday)}
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
                            htmlFor="startdate"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Start Date
                        </label>
                        <Controller
                            name="startdate"
                            control={control}
                            rules={{ required: "Start date is required" }}
                            render={({ field }) => (
                                <Input
                                    type="date"
                                    id="start_date"
                                    required
                                    placeholder="Insert start date"
                                    {...field}
                                />
                            )}
                        />
                        {errors.startdate && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.startdate.message?.toString()}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="enddate"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            End Date
                        </label>
                        <Controller
                            name="enddate"
                            control={control}
                            rules={{ required: "End date is required" }}
                            render={({ field }) => (
                                <Input
                                    type="date"
                                    id="end_date"
                                    required
                                    min={watchStartdate ? watchStartdate : undefined}
                                    placeholder="Insert end date"
                                    {...field}
                                />
                            )}
                        />
                        {errors.enddate && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.enddate.message?.toString()}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CreateHolidayPageWithSidebar = (params: any) =>
    WithSidebar(CreateHoliday)(params);
export default CreateHolidayPageWithSidebar;
