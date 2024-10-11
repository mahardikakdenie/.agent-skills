"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaSave } from "react-icons/fa";
import WithSidebar from "@/hoc/with-sidebar";
import { AxiosResponse } from "axios";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ChevronLeft } from "react-feather";
import { SanctionService } from "@/services/sanction.service";
import { NewSourceDTO } from "../dto/source.dto";
import { InsuranceService } from "@/services/insurance.services";

interface Insurance {
    id: string;
    name: string;
}

const CreateSourcePage = () => {
    const router = useRouter();
    const sanctionService = new SanctionService();
    const insuranceService = new InsuranceService();

    const [source, setSource] = useState<NewSourceDTO>({
        source_name: "",
        source_type: "government",
        source_url: "",
        insurance_id: "",
        country: 'IDN'
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [errorSourceName, setErrorSourceName] = useState('');
    const [error, setError] = useState('');
    const [insurance, setInsurance] = useState<Insurance[]>([]);
    const [alertMessage, setAlertMessage] = useState('');

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value } = target;


        setSource(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleValueTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSource(prevState => ({
            ...prevState,
            source_type: e.target.value,
            insurance_id: e.target.value === "insurance" ? "" : prevState.insurance_id // Clear insurance_id if not insurance
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form from submitting the traditional way
        setErrorMessage(''); // Clear previous error message
        setShowAlert(false); // Reset alert visibility

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
        const urlPattern = /^https:\/\/.+\..+/;

        // Validate the URL field
        if (!urlPattern.test(source.source_url)) {
            setErrorMessage('URL must start with "https://" and be a valid URL with at least one dot.');
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
            const response: AxiosResponse<any> = await sanctionService.createSource(payload);
            const { data } = response;

            if (data != null) {
                setErrorMessage("Source Submitted!");
            } else {
                setErrorMessage('Failed to create source. Please try again.');
                setShowAlert(true);
            }

            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                router.push("/source");
            }, 2000);
        } catch (error) {
            console.error('Failed to save source:', error);
            setErrorMessage('Failed to create source. Please try again.');
            setShowAlert(true);
        } finally {
            setLoading(false); // Stop the loading spinner
        }
    };

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

    return (
        <div className="container mx-auto p-6">
            <form onSubmit={handleSave}>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink>Source List</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Add New</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <h2 className="text-black font-bold text-2xl mt-2">
                            Add New Source
                        </h2>
                    </div>
                    <div className="flex space-x-4">
                        <div
                            onClick={() => router.push('/source')}
                            className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-3"
                        >
                            {loading ? <span>Saving...</span> : <FaSave className="mr-2" />}
                            Submit
                        </button>
                    </div>
                </div>
                {showAlert && (
                    <ErrorModal isOpen={showAlert} message={errorMessage!} onClose={() => setShowAlert(false)} />
                )}

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
                                onChange={handleChangeSourceName}
                                className={`p-2 border rounded w-full ${errorSourceName ? 'border-red-500' : ''}`}
                                required
                            />
                            {errorSourceName && <span className="text-red-500">{errorSourceName}</span>}
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="source_url" className="font-normal">URL</label>
                            <input
                                type="text"
                                id="source_url"
                                name="source_url"
                                value={source.source_url}
                                onChange={handleChangeURL}
                                className={`p-2 border rounded w-full ${error ? 'border-red-500' : ''}`}
                                required
                            />
                            {error && <span className="text-red-500">{error}</span>}
                        </div>
                    </div>

                    <div className="flex space-x-4 mb-4">
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="source_type" className="font-normal">Type</label>
                            <select
                                id="source_type"
                                name="source_type"
                                value={source.source_type}
                                onChange={handleValueTypeChange}
                                className="p-2 border rounded w-full"
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
                            >
                                <option value="BRN">Brunei</option>
                                <option value="KHM">Cambodia</option>
                                <option value="IDN">Indonesia</option>
                                <option value="LAO">Laos</option>
                                <option value="MYS">Malaysia</option>
                                <option value="MMR">Myanmar</option>
                                <option value="PHL">Philippines</option>
                                <option value="SGP">Singapore</option>
                                <option value="THA">Thailand</option>
                                <option value="VNM">Vietnam</option>
                            </select>
                        </div>
                    </div>

                    {source.source_type === "insurance" && (
                        <div className="flex space-x-4 mb-4">
                            <div className="flex flex-col w-full mb-4">
                                <label htmlFor="insurance_id" className="font-normal">Insurance ID</label>
                                <select
                                    id="insurance_id"
                                    name="insurance_id"
                                    value={source.insurance_id}
                                    onChange={handleChange}
                                    className="p-2 border rounded w-full"
                                    required={source.source_type === "insurance"} // Only required if type is "insurance"
                                >
                                    <option value="" disabled>Select an insurance</option>
                                    {insurance.map((insuranceItem) => (
                                        <option key={insuranceItem.id} value={insuranceItem.id}>
                                            {insuranceItem.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
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

const CreateSourcePageWithSidebar = (params: any) =>
    WithSidebar(CreateSourcePage)(params);

export default CreateSourcePageWithSidebar;
