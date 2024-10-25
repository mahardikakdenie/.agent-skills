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

const UploadSanctionPage = () => {
    const router = useRouter();
    const sanctionService = new SanctionService();
    const insuranceService = new InsuranceService();


    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [errorSourceName, setErrorSourceName] = useState('');
    const [error, setError] = useState('');

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form from submitting the traditional way
        setErrorMessage(''); // Clear previous error message
        setShowAlert(false); // Reset alert visibility


        setLoading(true); // Show loading spinner during the save operation

        try {
            // const response: AxiosResponse<any> = await sanctionService.createSource(payload);
            // const { data } = response;

            // if (data != null) {
            //     setErrorMessage("Sanction Uploaded!");
            // } else {
            //     setErrorMessage('Failed to upload sanction. Please try again.');
            //     setShowAlert(true);
            // }

            // setShowAlert(true);
            // setTimeout(() => {
            //     setShowAlert(false);
            //     router.push("/source");
            // }, 2000);
        } catch (error) {
            console.error('Failed to upload sanction:', error);
            setErrorMessage('Failed to upload sanction. Please try again.');
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
                                    <BreadcrumbPage>Upload Blacklist</BreadcrumbPage>
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
                    </div>
                </div>
                {showAlert && (
                    <ErrorModal isOpen={showAlert} message={errorMessage!} onClose={() => setShowAlert(false)} />
                )}

                <div className="w-full flex flex-col p-4 sm:p-6">
                    <div className="bg-white md:px-6 p-4">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-4 text-[#016DA1]">Upload Sanction</h3>
                            <div className="flex space-x-4 mb-4">
                                <div className="flex flex-col w-1/2">
                                    <label htmlFor="source_name" className="font-normal">CSV Document</label>
                                  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </form >
        </div >
    );
};

const UploadSanctionPageWithSidebar = (params: any) =>
    WithSidebar(UploadSanctionPage)(params);

export default UploadSanctionPageWithSidebar;
