"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isValid } from "date-fns";
import WithSidebar from "@/hoc/with-sidebar";
import axios, { AxiosResponse } from "axios";
import { ChevronLeft, Trash } from "react-feather";
import { FaCheck, FaPlus } from 'react-icons/fa';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SanctionService } from "@/services/sanction.service";
import { SourceDTO, UpdateSourceDTO } from "../../dto/source.dto";
import { InsuranceService } from "@/services/insurance.services";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { hasPermission } from "@/context/auth.context";
import { FORBIDDEN, SOURCE } from "@/constants/routes";

interface Insurance {
    id: string;
    name: string;
}

interface CountryAPI {
    id: string;
    name: string;
}

const EditSourcePage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    useEffect(() => {
      const checkAccess = async () => {
        const access = await hasPermission("Sanction.Update");
        setHasAccess(access);
        if (!access) {
          router.push(FORBIDDEN);
        }
      };
  
      checkAccess();
    }, [router]);
    const sanctionService = new SanctionService();
    const insuranceService = new InsuranceService();

    const [source, setSource] = useState<UpdateSourceDTO>({
        source_name: "",
        source_type: "",
        source_url: "",
        insurance_id: "",
        insurance_name: "",
        country: ""
    });
    const [loading, setLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [error, setError] = useState('');
    const [errorSourceName, setErrorSourceName] = useState('');
    const [countryAPI, setCountryAPI] = useState<CountryAPI[]>([]);
    const [insurance, setInsurance] = useState<Insurance[]>([]);
    const [source_type, setSource_type] = useState("");
    const [country, setCountry] = useState("");
    const [insurance_id, setInsurance_id] = useState("");
    const [source_name, setSource_name] = useState("");
    const [source_url, setSource_url] = useState("");

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        shouldUnregister: false,
        defaultValues: {
            source_type,
            country,
            insurance_id,
            source_name,
            source_url
        },
        values: {
            source_type,
            country,
            insurance_id,
            source_name,
            source_url
        },
    });

    const ErrorModal = ({ isOpen, message, onClose }: { isOpen: boolean, message: string, onClose: () => void }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded shadow-md w-1/3">
                    <h2 className="text-lg font-semibold mb-4">Alert</h2>
                    <p>{message}</p>
                    <div className="flex justify-end mt-4">
                        <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        fetchInsurance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchCountry();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCountry = async () => {
        try {
            const response = await sanctionService.getCountry();
            setCountryAPI(response.data);
        } catch (error) {
            console.error("Failed to fetch country:", error);
        }
    };

    const fetchInsurance = async () => {
        try {
            const response = await insuranceService.getAllInsurances();
            setInsurance(response.data);
        } catch (error) {
            console.error("Failed to fetch insurance:", error);
        }
    };

    useEffect(() => {
        if (params.id) {
            sanctionService.getSourceById(params.id as string)
                .then((res) => {
                    const sourceData: SourceDTO = res.data[0];
                    setSource(sourceData);
                    reset({
                        source_type: sourceData.source_type,
                        insurance_id: sourceData.insurance_id,
                        country: sourceData.country,
                        source_name: sourceData.source_name,
                        source_url: sourceData.source_url
                    });
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Failed to fetch source details:", error);
                    setLoading(false);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    const handleChangeInsurance = (selectedInsurance: { insurance_id: string, insurance_name: string }) => {
        setSource((prevState) => ({
            ...prevState,
            insurance_id: selectedInsurance.insurance_id,
            insurance_name: selectedInsurance.insurance_name,
        }));
    };

    const handleSave = async (formData: any) => {
        setErrorMessage('');
        setShowAlert(false);

        // Validations for form fields
        if (!formData.source_name || !formData.source_type || !formData.source_url || !formData.country) {
            setErrorMessage('Please fill in all required fields.');
            setShowAlert(true);
            return;
        }

        if (formData.source_type === "insurance" && !formData.insurance_id) {
            setErrorMessage('Please select an insurance.');
            setShowAlert(true);
            return;
        }

        // Regex to validate URLs that start with https://
        const urlPattern = /^https:\/\/.+\..+/;

        // Validate the URL field
        if (!urlPattern.test(formData.source_url)) {
            setErrorMessage('URL must start with "https://" and be a valid URL with at least one dot.');
            setShowAlert(true);
            return;
        }


        const payload = {
            source_name: formData.source_name,
            source_type: formData.source_type,
            source_url: formData.source_url,
            insurance_id: formData.source_type === "insurance" ? formData.insurance_id : null,
            insurance_name: source.source_type === "insurance" ? source.insurance_name : null,
            country: formData.country,
        };

        setLoading(true); // Show loading spinner during the save operation

        try {
            // Update the source
            const response: AxiosResponse<any> = await sanctionService.updateSource(params.id, payload);
            // const { status, data } = response;
            if (response != null) {
                setAlertMessage("Source Saved!");
                setShowAlert(true);

                setTimeout(() => {
                    setShowAlert(false);
                    router.push(SOURCE);
                }, 2000);
            } else {
                setErrorMessage('Failed to update source. Please try again.');
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Failed to update source:", error);
            setErrorMessage("Failed to update source.");
            setShowAlert(true);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const handleChangeSourceName = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value } = target;

        if (name === 'source_name' && value == "") {
            setErrorSourceName('Source name cannot be empty.');
        } else {
            setErrorSourceName('');
        }

        setSource(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeCountry = (value: string) => {
        setSource(prevState => ({
            ...prevState,
            country: value,
        }));
    };

    const handleChangeURL = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value } = target;

        const urlPattern = /^https:\/\/.+\..+/;

        if (name === 'source_url' && !urlPattern.test(value)) {
            setError('URL must start with "https://" and be a valid URL with at least one dot.');
        }
        else {
            setError('');
        }

        setSource(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleValueTypeChange = (value: string) => {
        setSource(prevState => ({
            ...prevState,
            source_type: value,
            insurance_id: value === "insurance" ? "" : prevState.insurance_id // Clear insurance_id if not insurance
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value } = target;


        setSource(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCancel = () => {
        router.push(SOURCE);
    };


    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col w-full gap-4">
            <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
                <div className="bg-white md:px-6 p-4 flex items-center">
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink>Source List</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Edit Source</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
                            Edit Source
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
                        <button
                            type="submit"
                            className="flex items-center bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-2"
                        >
                            <FaCheck className="mr-2" />
                            Save
                        </button>
                    </div>
                </div>

                <div className="w-full flex flex-col p-4 sm:p-6">
                    <div className="bg-white md:px-6 p-4">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-4 text-[#016DA1]">Source Details</h3>
                            <div className="flex space-x-4 mb-4">
                                <div className="flex flex-col w-1/2">
                                    <label htmlFor="source_name" className="font-normal">Source Name</label>
                                    <Controller
                                        name="source_name"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: "Source name is required" }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                id="source_name"
                                                required
                                                placeholder="Insert Source Name"
                                                {...field}
                                                className={`mt-1 block w-full h-16 ${errors.source_name ? "border-red-500" : "border-gray-300"
                                                    } rounded-md shadow-sm`}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label htmlFor="source_url" className="font-normal">URL</label>
                                    <Controller
                                        name="source_url"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: "Source URL is required" }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                id="source_url"
                                                required
                                                placeholder="Insert Source URL"
                                                {...field}
                                                className={`mt-1 block w-full h-16 ${errors.source_url ? "border-red-500" : "border-gray-300"
                                                    } rounded-md shadow-sm`}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-4 mb-4">
                                <div className="flex flex-col w-1/2">
                                    <label htmlFor="source_type" className="font-normal">Source Type</label>
                                    <Controller
                                        name="source_type"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={(value) => {
                                                    handleValueTypeChange(value);
                                                    field.onChange(value);
                                                }}
                                                disabled={false}
                                            >
                                                <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                                                    <SelectValue placeholder="Select Source Type " />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="government">
                                                            Government
                                                        </SelectItem>
                                                        <SelectItem value="insurance">
                                                            Insurance
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label htmlFor="country" className="font-normal">Country</label>
                                    <Controller
                                        name="country"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={(value) => {
                                                    handleChangeCountry(value);
                                                    field.onChange(value);
                                                }}
                                                disabled={false}
                                            >
                                                <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                                                    <SelectValue placeholder="Select a Country " />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {countryAPI.map((countryItem) => (
                                                            <SelectItem key={countryItem.id} value={countryItem.id}>
                                                                {countryItem.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Render Insurance section only when source type is "insurance" */}
                            {source.source_type === "insurance" && (
                                <div className="mb-4">
                                    <h4 className="font-bold mb-2">Insurance</h4>
                                    <Controller
                                        name="insurance_id"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value || ""}
                                                onValueChange={(insuranceId) => {
                                                    // Find the selected insurance object
                                                    const selectedInsurance = insurance.find((item) => item.id === insuranceId);

                                                    handleChangeInsurance({
                                                        insurance_id: selectedInsurance?.id || "",
                                                        insurance_name: selectedInsurance?.name || ""
                                                    });
                                                    field.onChange(insuranceId);
                                                }}
                                                required={source.source_type === "insurance"} // Only required if type is "insurance"
                                                disabled={false}
                                            >
                                                <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                                                    <SelectValue placeholder="Select Insurance " />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {insurance.map((insuranceItem) => (
                                                            <SelectItem key={insuranceItem.id} value={insuranceItem.id}>
                                                                {insuranceItem.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Alert Modal */}
                <ErrorModal
                    isOpen={showAlert}
                    message={alertMessage || errorMessage || "Error occurred"}
                    onClose={() => setShowAlert(false)}
                />
            </form>
        </div>
    );
};

const EditSourcePageWithSidebar = (params: any) =>
    WithSidebar(EditSourcePage)(params);

export default EditSourcePageWithSidebar;
