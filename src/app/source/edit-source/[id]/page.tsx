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

interface Insurance {
    id: string;
    name: string;
}

const EditSourcePage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const sanctionService = new SanctionService();
    const insuranceService = new InsuranceService();

    const [source, setSource] = useState<UpdateSourceDTO>({
        source_name: "",
        source_type: "",
        source_url: "",
        insurance_id: "",
        country: 'IDN'
    });
    const [loading, setLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [error, setError] = useState('');
    const [insurance, setInsurance] = useState<Insurance[]>([]);

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
    }, []);

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
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Failed to fetch source details:", error);
                    setLoading(false);
                });
        }
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent form from submitting the traditional way
        setErrorMessage(''); // Clear previous error message
        setShowAlert(false); // Reset alert visibility

        // Validations for form fields
        if (!source.source_name || !source.source_type || !source.source_url || !source.country) {
            setErrorMessage('Please fill in all required fields.');
            setShowAlert(true);
            return;
        }

        if (source.source_type === "insurance" && !source.insurance_id) {
            setErrorMessage('Please select an insurance.');
            setShowAlert(true);
            return;
        }

        // Regex to validate URLs that start with https://
        const urlPattern = /^https:\/\/.+/;

        // Validate the URL field
        if (!urlPattern.test(source.source_url)) {
            setErrorMessage('Please enter a valid URL that starts with "https://".');
            setShowAlert(true);
            return;
        }


        const payload = {
            source_name: source.source_name,
            source_type: source.source_type,
            source_url: source.source_url,
            insurance_id: source.source_type === "insurance" ? source.insurance_id : null,
            country: source.country,
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
                    router.push("/source");
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

    const handleValueTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSource(prevState => ({
            ...prevState,
            source_type: e.target.value,
            insurance_id: e.target.value === 'insurance' ? prevState.insurance_id : '', // Reset insurance_id if type changes
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Regex to validate URLs that start with https://
        const urlPattern = /^https:\/\/.+/;

        if (name === 'source_url' && !urlPattern.test(value)) {
            setError('URL must start with "https://" and be a valid URL');
        } else {
            setError('');
        }

        setSource(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCancel = () => {
        router.push("/source");
    };


    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink>Sanction List</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Edit Sanction</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <h2 className="text-black font-bold text-2xl mt-2">
                            Edit Sanction
                        </h2>
                    </div>
                    <div className="flex space-x-4">
                        <div
                            onClick={handleCancel}
                            className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </div>
                        <button
                            type="submit"
                            className="flex items-center bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-3"
                        >
                            <FaCheck className="mr-2" />
                            Save
                        </button>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-[#016DA1]">Source Details</h3>
                    <div className="flex space-x-4 mb-4">
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="source_name" className="font-normal">Source Name</label>
                            <input
                                type="text"
                                id="source_name"
                                name="source_name"
                                value={source.source_name}
                                onChange={handleChange}
                                className="p-2 border rounded w-full"
                                required
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="source_url" className="font-normal">URL</label>
                            <input
                                type="text"
                                id="source_url"
                                name="source_url"
                                value={source.source_url}
                                onChange={handleChange}
                                className={`p-2 border rounded w-full ${error ? 'border-red-500' : ''}`}
                                required
                            />
                            {error && <span className="text-red-500">{error}</span>}
                        </div>
                    </div>
                    <div className="flex space-x-4 mb-4">
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="source_type" className="font-normal">Source Type</label>
                            <select
                                id="source_type"
                                name="source_type"
                                value={source.source_type}
                                onChange={handleValueTypeChange}
                                className="p-2 border rounded w-full"
                                required
                            >
                                <option value="government">Government</option>
                                <option value="insurance">Insurance</option>
                            </select>
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="country" className="font-normal">Country</label>
                            <select
                                id="country"
                                name="country"
                                value={source.country}
                                onChange={handleChange}
                                className="p-2 border rounded w-full"
                                required
                            >
                                <option value="IDN">Indonesia</option>
                                {/* Add other countries here */}
                            </select>
                        </div>
                    </div>

                    {/* Render Insurance section only when source type is "insurance" */}
                    {source.source_type === "insurance" && (
                        <div className="mb-4">
                            <h4 className="font-bold mb-2">Insurance</h4>
                            <select
                                id="insurance_id"
                                name="insurance_id"
                                value={source.insurance_id}
                                onChange={handleChange}
                                className="p-2 border rounded w-full"
                                required
                            >
                                <option value="">Select Insurance</option>
                                {insurance.map(ins => (
                                    <option key={ins.id} value={ins.id}>{ins.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
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
