"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isValid } from "date-fns";
import WithSidebar from "@/hoc/with-sidebar";
import axios, { AxiosResponse } from "axios";
import { ChevronLeft, Trash } from "react-feather";
import { FaCheck, FaPlus } from 'react-icons/fa';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DetailsBlackListDTO, UpdateBlackListDTO } from "../../dto/sanction.dto";
import { SanctionService } from "@/services/sanction.service";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";


interface Source {
    id: string;
    source_name: string;
    source_type: string;
    source_url: string;
    insurance_id: string;
}

const EditSanctionPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const sanctionService = new SanctionService();
    const [source, setSource] = useState<Source[]>([]);
    const [errorFName, setErrorFName] = useState('');
    const [errorMName, setErrorMName] = useState('');
    const [errorLName, setErrorLName] = useState('');
    const [errorIDNumber, setErrorIDNumber] = useState('');
    const [errorPNumber, setErrorPNumber] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorBDate, setErrorBDate] = useState('');
    const [errorReason, setErrorReason] = useState('');
    const [country, setCountry] = useState("");
    const [source_id, setSource_id] = useState("");

    const {
        reset,
        control,
        formState: { errors },
    } = useForm({
        shouldUnregister: false,
        defaultValues: {
            country: country,
            source_id: source_id
        },
    });

    const [sanction, setSanction] = useState<UpdateBlackListDTO>({
        first_name: "",
        middle_name: "",
        last_name: "",
        id_number: "",
        phone_number: "",
        country: "",
        email: "",
        blacklist_reason: "",
        source_id: "",
        created_at: "",
        date_blacklisted: ""
    });
    const [loading, setLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');


    useEffect(() => {
        fetchSources();
    }, []);

    const fetchSources = async () => {
        try {
            const response = await sanctionService.getSources();
            setSource(response.data);
        } catch (error) {
            console.error("Failed to fetch sources:", error);
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




    useEffect(() => {
        if (params.id) {
            sanctionService.getSanctionById(params.id as string)
                .then((res) => {
                    const sanctionData: DetailsBlackListDTO = res.data[0];
                    // console.log('Fetched Promotion Data:', promotionData);
                    setSanction(sanctionData);
                    reset({
                        country: sanctionData.country, // Update form with fetched data
                        source_id: sanctionData.source_id,
                    });
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Failed to fetch sanction details:", error);
                    setLoading(false);
                });
        }
    }, [params.id]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Reset alert messages before validation
        setErrorMessage('');
        setAlertMessage('');
        setShowAlert(false);

        if (!sanction.blacklist_reason || !sanction.country || !sanction.date_blacklisted || !sanction.email ||
            !sanction.first_name || !sanction.id_number || !sanction.last_name || !sanction.middle_name || !sanction.phone_number
            || !sanction.source_id) {
            setErrorMessage('Please fill in all required fields.');
            setShowAlert(true);
            return;
        }


        const date_blacklisted = parseISO(sanction.date_blacklisted);

        if (!isValid(date_blacklisted)) {
            setErrorMessage('Invalid date format. Please use DD-MM-YYYY format.');
            setShowAlert(true);
            return;
        }

        // Validate phone number (must be numeric and within a specified length)
        const phoneNumberPattern = /^\d{10,15}$/; // 10 to 15 digits
        if (!phoneNumberPattern.test(sanction.phone_number)) {
            setErrorMessage('Phone number must be numeric and between 10 to 15 digits.');
            setShowAlert(true);
            return;
        }

        // Validate email format (basic validation for '@' and a domain)
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)?$/;
        if (!emailPattern.test(sanction.email)) {
            setErrorMessage('Invalid email format. Please enter a valid email address.');
            setShowAlert(true);
            return;
        }


        const payload = {

            id_number: sanction.id_number,
            first_name: sanction.first_name,
            middle_name: sanction.middle_name,
            last_name: sanction.last_name,
            phone_number: sanction.phone_number,
            email: sanction.email,
            blacklist_reason: sanction.blacklist_reason,
            source_id: sanction.source_id,
            country: sanction.country,
            date_blacklisted: sanction.date_blacklisted,

        };


        try {


            // Update the sanction
            const response: AxiosResponse<any> = await sanctionService.updateSanction(params.id, payload);
            const { data } = response;

            if (data != null) {
                setErrorMessage("Sanction Saved!");
            } else {
                setErrorMessage('Failed to save sanction. Please try again.');
                setShowAlert(true);
            }

            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                router.push("/sanction");
            }, 2000);


        } catch (error) {
            console.error("Failed to update promotion:", error);
            setErrorMessage("Failed to update promotion.");
        }
    };

    const handleValueTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSanction(prevState => ({
            ...prevState,
            value_type: e.target.value
        }));
    };

    const isCheckbox = (element: HTMLInputElement | HTMLSelectElement): element is HTMLInputElement => {
        return element.type === 'checkbox';
    };


    const handleCancel = () => {
        router.push("/sanction");
    };

    const handleChangeCountry = (value: string) => {
        setSanction(prevState => ({
            ...prevState,
            country: value,
        }));
    };

    const handleChangeReason = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value } = target;

        if (name === 'blacklist_reason' && value == "") {
            setErrorReason('Blacklisted reason date cannot be empty.');
        } else {
            setErrorReason('');
        }

        setSanction(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeBDate = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value } = target;

        if (name === 'date_blacklisted' && value == "") {
            setErrorBDate('Blacklisted date cannot be empty.');
        } else {
            setErrorBDate('');
        }

        setSanction(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeSourceId = (value: string) => {
        setSanction(prevState => ({
            ...prevState,
            source_id: value,
        }));
    };

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value } = target;

        if (name === 'email' && value == "") {
            setErrorEmail('Email cannot be empty.');
        } else {
            setErrorEmail('');
        }

        setSanction(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangePNumber = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value } = target;

        if (name === 'phone_number' && value == "") {
            setErrorPNumber('Phone number cannot be empty.');
        } else {
            setErrorPNumber('');
        }

        setSanction(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeFName = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value } = target;

        if (name === 'first_name' && value == "") {
            setErrorFName('First name cannot be empty.');
        } else {
            setErrorFName('');
        }

        setSanction(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeMName = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value } = target;

        if (name === 'middle_name' && value == "") {
            setErrorMName('Middle name cannot be empty.');
        } else {
            setErrorMName('');
        }

        setSanction(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeLName = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value } = target;

        if (name === 'last_name' && value == "") {
            setErrorLName('Last name cannot be empty.');
        } else {
            setErrorLName('');
        }

        setSanction(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeIDNumber = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value } = target;

        if (name === 'id_number' && value == "") {
            setErrorIDNumber('ID Number cannot be empty.');
        } else {
            setErrorIDNumber('');
        }

        setSanction(prevState => ({
            ...prevState,
            [name]: value
        }));
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

                {/* Identity Details Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-[#016DA1]">Identity Details</h3>
                    <div className="flex space-x-4 mb-4">
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="first_name" className="font-normal">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={sanction.first_name}
                                onChange={handleChangeFName}
                                className={`p-2 border rounded w-full ${errorFName ? 'border-red-500' : ''}`}
                                required
                            />
                            {errorFName && <span className="text-red-500">{errorFName}</span>}
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="middle_name" className="font-normal">Middle Name</label>
                            <input
                                type="text"
                                id="middle_name"
                                name="middle_name"
                                value={sanction.middle_name}
                                onChange={handleChangeMName}
                                className={`p-2 border rounded w-full ${errorMName ? 'border-red-500' : ''}`}
                                required
                            />
                            {errorMName && <span className="text-red-500">{errorMName}</span>}
                        </div>
                    </div>

                    <div className="flex space-x-4 mb-4">
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="last_name" className="font-normal">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={sanction.last_name}
                                onChange={handleChangeLName}
                                className={`p-2 border rounded w-full ${errorLName ? 'border-red-500' : ''}`}
                                required
                            />
                            {errorLName && <span className="text-red-500">{errorLName}</span>}
                        </div>
                    </div>
                </div>


                {/* Personal Data Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-[#016DA1]">Personal Data</h3>
                    <div className="flex space-x-4 mb-4">
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
                                                <SelectItem value="BRN">
                                                    Brunei
                                                </SelectItem>
                                                <SelectItem value="KHM">
                                                    Cambodia
                                                </SelectItem>
                                                <SelectItem value="IDN">
                                                    Indonesia
                                                </SelectItem>
                                                <SelectItem value="LAO">
                                                    Laos
                                                </SelectItem>
                                                <SelectItem value="MYS">
                                                    Malaysia
                                                </SelectItem>
                                                <SelectItem value="MMR">
                                                    Myanmar
                                                </SelectItem>
                                                <SelectItem value="PHL">
                                                    Philippines
                                                </SelectItem>
                                                <SelectItem value="SGP">
                                                    Singapore
                                                </SelectItem>
                                                <SelectItem value="THA">
                                                    Thailand
                                                </SelectItem>
                                                <SelectItem value="VNM">
                                                    Vietnam
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="id_number" className="font-normal">ID Number</label>
                            <input
                                type="text"
                                id="id_number"
                                name="id_number"
                                value={sanction.id_number}
                                onChange={handleChangeIDNumber}
                                className={`p-2 border rounded w-full ${errorIDNumber ? 'border-red-500' : ''}`}
                                required
                            />
                            {errorIDNumber && <span className="text-red-500">{errorIDNumber}</span>}
                        </div>
                    </div>

                    <div className="flex space-x-4 mb-4">
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="phone_number" className="font-normal">Phone Number</label>
                            <input
                                type="tel"
                                id="phone_number"
                                name="phone_number"
                                value={sanction.phone_number}
                                onChange={handleChangePNumber}
                                className={`p-2 border rounded w-full ${errorPNumber ? 'border-red-500' : ''}`}
                                required
                            />
                            {errorPNumber && <span className="text-red-500">{errorPNumber}</span>}
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="email" className="font-normal">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={sanction.email}
                                onChange={handleChangeEmail}
                                className={`p-2 border rounded w-full ${errorEmail ? 'border-red-500' : ''}`}
                                required
                            />
                            {errorEmail && <span className="text-red-500">{errorEmail}</span>}
                        </div>
                    </div>
                </div>


                {/* Source Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-[#016DA1]">Source</h3>
                    <div className="flex flex-col w-full mb-4">
                        <label htmlFor="source_id" className="font-normal">Source Name</label>
                         <Controller
                            name="source_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                        handleChangeSourceId(value);
                                        field.onChange(value);
                                    }}
                                    disabled={false}
                                >
                                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                                        <SelectValue placeholder="Select Source Type " />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {source.map((sourceItem) => (
                                                <SelectItem key={sourceItem.id} value={sourceItem.id}>
                                                    {sourceItem.source_name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>


                {/* Details Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-[#016DA1]">Details</h3>
                    <div className="flex space-x-4 mb-4">
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="date_blacklisted" className="font-normal">Blacklist Date</label>
                            <input
                                type="date"
                                id="date_blacklisted"
                                name="date_blacklisted"
                                value={sanction.date_blacklisted}
                                onChange={handleChangeBDate}
                                className={`p-2 border rounded w-full ${errorBDate ? 'border-red-500' : ''}`}
                                required
                            />
                            {errorBDate && <span className="text-red-500">{errorBDate}</span>}
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="blacklist_reason" className="font-normal">Blacklist Reason</label>
                            <input
                                type="text"
                                id="blacklist_reason"
                                name="blacklist_reason"
                                value={sanction.blacklist_reason}
                                onChange={handleChangeReason}
                                className={`p-2 border rounded w-full ${errorReason ? 'border-red-500' : ''}`}
                                required
                            />
                            {errorReason && <span className="text-red-500">{errorReason}</span>}
                        </div>
                    </div>
                </div>



            </form>

            {/* Alert Popup */}
            {showAlert && (
                <div className="alert">
                    {alertMessage}
                </div>
            )}

            {/* Error Modal */}
            {errorMessage && (
                <ErrorModal
                    isOpen={!!errorMessage}
                    message={errorMessage}
                    onClose={() => setErrorMessage(null)}
                />
            )}



        </div>
    );
};

const EditSanctionPageWithSidebar = (params: any) =>
    WithSidebar(EditSanctionPage)(params);
export default EditSanctionPageWithSidebar;