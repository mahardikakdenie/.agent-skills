"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaSave } from "react-icons/fa";
import WithSidebar from "@/hoc/with-sidebar";
import { AxiosResponse } from "axios";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ChevronLeft } from "react-feather";
import { SanctionService } from "@/services/sanction.service";
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
import Papa from "papaparse";

const UploadSanctionPage = () => {
    const router = useRouter();
    const sanctionService = new SanctionService();
    const insuranceService = new InsuranceService();


    const [loading, setLoading] = useState(false);
    const [errorSourceName, setErrorSourceName] = useState('');
    const [error, setError] = useState('');
    const [csvData, setCsvData] = useState<any[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);

    const handleFileParse = (file: File) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                const data = result.data.slice(1).map((row: any) => ({
                    first_name: row[0],
                    middle_name: row[1],
                    last_name: row[2],
                    country: row[3],
                    id_number: row[4],
                    phone_number: row[5],
                    email: row[6],
                    source_type: row[7],
                    source_name: row[8],
                    insurance: row[9],
                    blacklist_date: row[10],
                    blacklist_reason: row[11],
                }));
                setCsvData(data);
            },
            error: (error) => {
                console.error("Error parsing CSV:", error);
                setErrorMessage("Failed to parse CSV file.");
                setShowAlert(true);
            },
        });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "text/csv") {
            handleFileParse(file);
        } else {
            setErrorMessage("Please upload a valid CSV file.");
            setShowAlert(true);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === "text/csv") {
            handleFileParse(file);
        } else {
            setErrorMessage("Please upload a valid CSV file.");
            setShowAlert(true);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setShowAlert(false);
        setLoading(true);

        // Ensure csvData is not null
        if (csvData != null) {
            // Define the required fields, excluding `insurance` for now
            const requiredFields = [
                'first_name', 'middle_name', 'last_name', 'country',
                'id_number', 'phone_number', 'email', 'source_type',
                'source_name', 'blacklist_date', 'blacklist_reason'
            ];

            // Apply checking to ensure each row has all required fields
            const isDataValid = csvData.every((row: any) =>
                requiredFields.every(field => row[field] != null && row[field] !== "") &&
                // Additional check for insurance if source_type is "insurance"
                (row.source_type !== "insurance" || (row.insurance != null && row.insurance !== ""))
            );

            if (!isDataValid) {
                setErrorMessage("Please ensure all required fields are filled, including 'insurance' when 'source_type' is 'insurance'.");
                setShowAlert(true);
                setLoading(false);
                return;
            }
        } else {
            setErrorMessage('Failed to create sanction. Please try again.');
            setShowAlert(true);
            setLoading(false);
            return;
        }

        try {
            await sanctionService.createSanction(csvData);
            setErrorMessage("Sanction Uploaded!");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                router.push("/sanction");
            }, 2000);
        } catch (error) {
            console.error("Failed to upload sanction:", error);
            setErrorMessage("Failed to upload sanction. Please try again.");
            setShowAlert(true);
        } finally {
            setLoading(false);
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
        <div className="flex flex-col w-full gap-4">
            <form onSubmit={handleUpload}>
                <div className="bg-white md:px-6 p-4 flex items-center">
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink>Sanction List</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Upload Sanction</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
                            Upload Blacklist
                        </h2>
                    </div>
                    <div className="flex space-x-4 ml-auto">
                        <div
                            onClick={() => router.push('/sanction')}
                            className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-2"
                        >
                            {loading ? <span>Saving...</span> : <FaSave className="mr-2" />}
                            Submit
                        </button>
                    </div>
                </div>
                {showAlert && (
                    <ErrorModal isOpen={showAlert} message={errorMessage!} onClose={() => setShowAlert(false)} />
                )}

                <div
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer 
                        ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <p className="text-gray-500 mb-4">Drag and drop your CSV file here, or</p>
                    <label
                        htmlFor="fileUpload"
                        className="px-4 py-2 bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full cursor-pointer"
                    >
                        Browse Files
                    </label>
                    <input
                        id="fileUpload"
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>

                {showAlert && (
                    <div className="mt-4 text-red-600">
                        <p>{errorMessage}</p>
                    </div>
                )}

            </form >
        </div >
    );
};

const UploadSanctionPageWithSidebar = (params: any) =>
    WithSidebar(UploadSanctionPage)(params);

export default UploadSanctionPageWithSidebar;
