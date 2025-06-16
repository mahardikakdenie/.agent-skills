"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { hasPermission } from "@/context/auth.context";


interface CountryAPI {
    id: string;
    name: string;
}

interface Insurance {
    id: string;
    name: string;
}

interface Source {
    id: string;
    source_name: string;
    source_type: string;
    source_url: string;
    insurance_id: string;
}

const UploadSanctionPage = () => {
    const router = useRouter();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    useEffect(() => {
      const checkAccess = async () => {
        const access = await hasPermission("Sanction.Create");
        setHasAccess(access);
        if (!access) {
          router.push("/forbidden");
        }
      };
  
      checkAccess();
    }, [router]);
    const sanctionService = new SanctionService();
    const insuranceService = new InsuranceService();

    const [insurance, setInsurance] = useState<Insurance[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorSourceName, setErrorSourceName] = useState('');
    const [error, setError] = useState('');
    const [csvData, setCsvData] = useState<any[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [countryAPI, setCountryAPI] = useState<CountryAPI[]>([]);
    const [insuranceList, setInsuranceList] = useState<Insurance[]>([]);
    const [source, setSource] = useState<Source[]>([]);


    useEffect(() => {
        fetchCountry();
        fetchInsurance();
        fetchSources();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const fetchSources = async () => {
        try {
            const response = await sanctionService.getSources();
            setSource(response.data);
        } catch (error) {
            console.error("Failed to fetch sources:", error);
        }
    };


    const fetchInsurance = async () => {
        try {
            const response = await insuranceService.getAllInsurances();
            setInsuranceList(response.data);
        } catch (error) {
            console.error("Failed to fetch insurances:", error);
        }
    };

    const fetchCountry = async () => {
        try {
            const response = await sanctionService.getCountry();
            setCountryAPI(response.data);
        } catch (error) {
            console.error("Failed to fetch country:", error);
        }
    };

    const handleFileParse = (file: File) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                // Create maps for case-insensitive lookups
                const insuranceMap = new Map(insuranceList.map(insurance => [insurance.name.toLowerCase(), insurance.id]));
                const sourceMap = new Map(source.map(src => [src.source_name.toLowerCase(), src.id]));

                const data = result.data.map((row: any) => {
                    // Create a default data structure for each row
                    const parsedRow = {
                        first_name: row.first_name || "",
                        middle_name: row.middle_name || "",
                        last_name: row.last_name || "",
                        country: row.country || "",
                        id_number: row.id_number || "",
                        phone_number: row.phone_number || "",
                        email: row.email || "",
                        source_type: row.source_type || "",
                        source_name: row.source_name || "",
                        insurance: row.insurance || "",
                        blacklist_date: row.blacklist_date || "",
                        blacklist_reason: row.blacklist_reason || "",
                        insurance_id: "", // default empty value
                        source_id: "", // default empty value
                    };

                    // Format blacklist_date to YYYY-MM-DD if it exists
                    if (parsedRow.blacklist_date) {
                        const date = new Date(parsedRow.blacklist_date);
                        if (!isNaN(date.getTime())) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            parsedRow.blacklist_date = `${year}-${month}-${day}`;
                        }
                    }

                    // Assign insurance_id if the source_type is 'insurance' and insurance name matches
                    if (parsedRow.source_type === "insurance" && parsedRow.insurance) {
                        const insuranceId = insuranceMap.get(parsedRow.insurance.toLowerCase());
                        if (insuranceId) {
                            parsedRow.insurance_id = insuranceId;
                        }
                    }

                    // Assign source_id if the source_name matches
                    if (parsedRow.source_name) {
                        const sourceId = sourceMap.get(parsedRow.source_name.toLowerCase());
                        if (sourceId) {
                            parsedRow.source_id = sourceId;
                        }
                    }

                    return parsedRow;
                });

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
            setFileName(file.name);
            handleFileParse(file);

            // Clear the file input after processing
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
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
            setFileName(file.name);
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

        if (csvData != null) {
            const requiredFields = [
                'first_name', 'middle_name', 'last_name', 'country',
                'id_number', 'phone_number', 'email', 'source_type',
                'blacklist_date', 'blacklist_reason'
            ];
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            const isDataValid = csvData.every((row: any) => {
                // Create a case-insensitive set of valid country names
                const validCountryNames = new Set(countryAPI.map(country => country.name.toLowerCase()));

                // Create a map of insurance names to IDs for easy lookup
                const insuranceMap = new Map(insuranceList.map(insurance => [insurance.name.toLowerCase(), insurance.id]));

                // Create a map of sources for easy validation
                const sourceMap = new Map(source.map(src => [src.source_name.toLowerCase(), src]));

                // Check if the insurance is valid based on the source type
                const isInsuranceValid = row.source_type !== "insurance" || (row.insurance && insuranceMap.has(row.insurance.toLowerCase()));

                if (isInsuranceValid && row.source_type === "insurance") {
                    row.insurance_id = insuranceMap.get(row.insurance.toLowerCase()); // Update row with insurance_id
                }

                // Validate the source_name, insurance, and source_id
                const sourceEntry = sourceMap.get(row.source_name.toLowerCase());

                // Ensure the csvData source_id matches the fetched source API
                const isSourceIdValid = sourceEntry && sourceEntry.id === row.source_id;

                // Check that id_number and phone_number are numeric
                const isIdNumberValid = (typeof row.id_number === 'number' && !isNaN(row.id_number)) ||
                    (typeof row.id_number === 'string' && /^\d+$/.test(row.id_number));
                const isPhoneNumberValid = (typeof row.phone_number === 'number' && !isNaN(row.phone_number)) ||
                    (typeof row.phone_number === 'string' && /^\d+$/.test(row.phone_number));

                return (
                    requiredFields.every(field => row[field] != null && row[field] !== "") &&
                    (row.source_type === "insurance" || row.source_type === "government") &&
                    emailRegex.test(row.email) &&
                    dateRegex.test(row.blacklist_date) &&
                    validCountryNames.has(row.country.toLowerCase()) &&
                    isInsuranceValid &&
                    isSourceIdValid &&
                    isIdNumberValid &&
                    isPhoneNumberValid
                );
            });

            if (!isDataValid) {
                setErrorMessage("Invalid data in the CSV document file.");
                setShowAlert(true);
                setLoading(false);
                return;
            }

            try {
                
                await Promise.all(csvData.map(async (row) => {
                    // Map csvData fields to PostBlackListDTO structure
                    const sanctionData = {
                        id_number: row.id_number.toString(),
                        first_name: row.first_name,
                        middle_name: row.middle_name || "",
                        last_name: row.last_name,
                        phone_number: row.phone_number.toString(),
                        email: row.email,
                        blacklist_reason: row.blacklist_reason,
                        source_id: row.source_id,
                        country: row.country,
                        created_at: new Date().toISOString(),
                        date_blacklisted: row.blacklist_date
                    };

                    await sanctionService.createSanction(sanctionData);
                }));

                // After all sanctions have been created
                setErrorMessage("Sanction Uploaded!");
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                    router.push("/sanction");
                }, 2000);

            } catch (error) {
                console.error("Failed to create sanction:", error);
                setErrorMessage("Failed to create sanction. Please try again.");
                setShowAlert(true);
            } finally {
                setLoading(false);
            }
        } else {
            setErrorMessage('Failed to create sanction: CSV file is empty.');
            setShowAlert(true);
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
                        ref={fileInputRef}  // Attach the ref to the file input
                        className="hidden"
                    />
                </div>

                {fileName && (
                    <div className="mt-2 text-gray-600">
                        <p>Selected file: <span className="font-semibold">{fileName}</span></p>
                    </div>
                )}

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
