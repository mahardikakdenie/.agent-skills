"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isValid } from "date-fns";
import { ChevronLeft, Trash } from "react-feather";
import { FaCheck, FaPlus } from "react-icons/fa";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DetailsBlackListDTO,
  UpdateBlackListDTO,
} from "../../../dto/sanction.dto";
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
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import ApiURL from "@/constants/api-url.const";
import { countryService, sanctionService } from "@/services/api.service";
import { useParams } from "next/navigation";

interface Source {
  id: string;
  source_name: string;
  source_type: string;
  source_url: string;
  insurance_id: string;
}

interface CountryAPI {
  id: string;
  name: string;
}

export default function EditSanctionPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params.id;
  const id =
    typeof idParam === "string"
      ? idParam
      : Array.isArray(idParam)
      ? idParam[0]
      : "";
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Sanction.Update");
      setHasAccess(access);
      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router]);
  const [source, setSource] = useState<Source[]>([]);
  const [countryAPI, setCountryAPI] = useState<CountryAPI[]>([]);
  const [errorFName, setErrorFName] = useState("");
  const [errorMName, setErrorMName] = useState("");
  const [errorLName, setErrorLName] = useState("");
  const [errorIDNumber, setErrorIDNumber] = useState("");
  const [errorPNumber, setErrorPNumber] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorBDate, setErrorBDate] = useState("");
  const [errorReason, setErrorReason] = useState("");
  const [country, setCountry] = useState("");
  const [source_id, setSource_id] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [middle_name, setMiddle_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [id_number, setId_number] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [email, setEmail] = useState("");
  const [date_blacklisted, setDate_blacklisted] = useState("");
  const [blacklist_reason, setBlacklist_reason] = useState("");

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      country: country,
      source_id: source_id,
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      id_number: id_number,
      phone_number: phone_number,
      email: email,
      date_blacklisted: date_blacklisted,
      blacklist_reason: blacklist_reason,
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
    date_blacklisted: "",
  });
  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchSources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCountry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSources = async () => {
    try {
      const response: any = await sanctionService.get(ApiURL.v1Sources);
      setSource(response.data.data);
    } catch (error) {
      console.error("Failed to fetch sources:", error);
    }
  };

  const fetchCountry = async () => {
    try {
      const response: any = await countryService.get(ApiURL.countries);
      setCountryAPI(response.data.data);
    } catch (error) {
      console.error("Failed to fetch country:", error);
    }
  };

  const ErrorModal = ({
    isOpen,
    message,
    onClose,
  }: {
    isOpen: boolean;
    message: string;
    onClose: () => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-md w-1/3">
          <h2 className="text-lg font-semibold mb-4">Alert</h2>
          <p>{message}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (id) {
      sanctionService
        .get(ApiURL.v1BlacklistDetails(id as string))
        .then((response: any) => {
          const res = response.data;
          const sanctionData: DetailsBlackListDTO = res.data[0];
          setSanction(sanctionData);
          reset({
            country: sanctionData.country, // Update form with fetched data
            source_id: sanctionData.source_id,
            first_name: sanctionData.first_name,
            middle_name: sanctionData.middle_name,
            last_name: sanctionData.last_name,
            id_number: sanctionData.id_number,
            phone_number: sanctionData.phone_number,
            email: sanctionData.email,
            date_blacklisted: sanctionData.date_blacklisted,
            blacklist_reason: sanctionData.blacklist_reason,
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch sanction details:", error);
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSave = async (formData: any) => {
    // Reset alert messages before validation
    setErrorMessage("");
    setAlertMessage("");
    setShowAlert(false);

    // Check for required fields
    if (
      !formData.blacklist_reason ||
      !formData.country ||
      !formData.date_blacklisted ||
      !formData.email ||
      !formData.first_name ||
      !formData.id_number ||
      !formData.last_name ||
      !formData.middle_name ||
      !formData.phone_number ||
      !formData.source_id
    ) {
      setErrorMessage("Please fill in all required fields.");
      setShowAlert(true);
      return;
    }

    const date_blacklisted = parseISO(formData.date_blacklisted);

    if (!isValid(date_blacklisted)) {
      setErrorMessage("Invalid date format. Please use DD-MM-YYYY format.");
      setShowAlert(true);
      return;
    }

    // Validate phone number format
    const phoneNumberPattern = /^\d{10,15}$/;
    if (!phoneNumberPattern.test(formData.phone_number)) {
      setErrorMessage(
        "Phone number must be numeric and between 10 to 15 digits."
      );
      setShowAlert(true);
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)?$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage(
        "Invalid email format. Please enter a valid email address."
      );
      setShowAlert(true);
      return;
    }

    // Prepare the payload for submission
    const payload = {
      id_number: formData.id_number,
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      email: formData.email,
      blacklist_reason: formData.blacklist_reason,
      source_id: formData.source_id,
      country: formData.country,
      date_blacklisted: formData.date_blacklisted,
    };

    try {
      // Update the sanction
      if (!id) {
        throw new Error("Missing sanction id");
      }
      const response: any = await sanctionService.put(
        ApiURL.v1BlacklistUpdateDetails(id),
        [payload]
      );
      const { data } = response;

      if (data != null) {
        setErrorMessage("Sanction Saved!");
      } else {
        setErrorMessage("Failed to save sanction. Please try again.");
        setShowAlert(true);
      }

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        router.push(AppURL.sanctionList);
      }, 2000);
    } catch (error) {
      console.error("Failed to update promotion:", error);
      setErrorMessage("Failed to update promotion.");
    }
  };

  const handleValueTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSanction((prevState) => ({
      ...prevState,
      value_type: e.target.value,
    }));
  };

  const isCheckbox = (
    element: HTMLInputElement | HTMLSelectElement
  ): element is HTMLInputElement => {
    return element.type === "checkbox";
  };

  const handleCancel = () => {
    router.push(AppURL.sanctionList);
  };

  const handleChangeCountry = (value: string) => {
    setSanction((prevState) => ({
      ...prevState,
      country: value,
    }));
  };

  const handleChangeReason = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (name === "blacklist_reason" && value == "") {
      setErrorReason("Blacklisted reason date cannot be empty.");
    } else {
      setErrorReason("");
    }

    setSanction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeBDate = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (name === "date_blacklisted" && value == "") {
      setErrorBDate("Blacklisted date cannot be empty.");
    } else {
      setErrorBDate("");
    }

    setSanction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeSourceId = (value: string) => {
    setSanction((prevState) => ({
      ...prevState,
      source_id: value,
    }));
  };

  const handleChangeEmail = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (name === "email" && value == "") {
      setErrorEmail("Email cannot be empty.");
    } else {
      setErrorEmail("");
    }

    setSanction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangePNumber = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (name === "phone_number" && value == "") {
      setErrorPNumber("Phone number cannot be empty.");
    } else {
      setErrorPNumber("");
    }

    setSanction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeFName = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (name === "first_name" && value == "") {
      setErrorFName("First name cannot be empty.");
    } else {
      setErrorFName("");
    }

    setSanction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeMName = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (name === "middle_name" && value == "") {
      setErrorMName("Middle name cannot be empty.");
    } else {
      setErrorMName("");
    }

    setSanction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeLName = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (name === "last_name" && value == "") {
      setErrorLName("Last name cannot be empty.");
    } else {
      setErrorLName("");
    }

    setSanction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeIDNumber = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (name === "id_number" && value == "") {
      setErrorIDNumber("ID Number cannot be empty.");
    } else {
      setErrorIDNumber("");
    }

    setSanction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
                  <BreadcrumbLink>Sanction List</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Sanction</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
              Edit Sanction
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
            {/* Identity Details Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 text-[#016DA1]">
                Identity Details
              </h3>
              <div className="flex space-x-4 mb-4">
                <div className="flex flex-col w-1/2">
                  <label htmlFor="first_name" className="font-normal">
                    First Name
                  </label>
                  <Controller
                    name="first_name"
                    control={control}
                    defaultValue=""
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="first_name"
                        required
                        placeholder="Insert First Name"
                        {...field}
                        className={`mt-1 block w-full h-16 ${
                          errors.first_name
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm`}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label htmlFor="middle_name" className="font-normal">
                    Middle Name
                  </label>
                  <Controller
                    name="middle_name"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Middle name is required" }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="middle_name"
                        required
                        placeholder="Insert Middle Name"
                        {...field}
                        className={`mt-1 block w-full h-16 ${
                          errors.middle_name
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm`}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex space-x-4 mb-4">
                <div className="flex flex-col w-1/2">
                  <label htmlFor="last_name" className="font-normal">
                    Last Name
                  </label>
                  <Controller
                    name="last_name"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="last_name"
                        required
                        placeholder="Insert Last Name"
                        {...field}
                        className={`mt-1 block w-full h-16 ${
                          errors.last_name
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm`}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Personal Data Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 text-[#016DA1]">
                Personal Data
              </h3>
              <div className="flex space-x-4 mb-4">
                <div className="flex flex-col w-1/2">
                  <label htmlFor="country" className="font-normal">
                    Country
                  </label>
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
                              <SelectItem
                                key={countryItem.id}
                                value={countryItem.id}
                              >
                                {countryItem.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label htmlFor="id_number" className="font-normal">
                    ID Number
                  </label>
                  <Controller
                    name="id_number"
                    control={control}
                    defaultValue=""
                    rules={{ required: "ID number is required" }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="id_number"
                        required
                        placeholder="Insert ID Number"
                        {...field}
                        className={`mt-1 block w-full h-16 ${
                          errors.id_number
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm`}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex space-x-4 mb-4">
                <div className="flex flex-col w-1/2">
                  <label htmlFor="phone_number" className="font-normal">
                    Phone Number
                  </label>
                  <Controller
                    name="phone_number"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Phone number is required" }}
                    render={({ field }) => (
                      <Input
                        type="tel"
                        id="phone_number"
                        required
                        placeholder="Insert phone Number"
                        {...field}
                        className={`mt-1 block w-full h-16 ${
                          errors.phone_number
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm`}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label htmlFor="email" className="font-normal">
                    Email
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Email is required" }}
                    render={({ field }) => (
                      <Input
                        type="email"
                        id="email"
                        required
                        placeholder="Insert email"
                        {...field}
                        className={`mt-1 block w-full h-16 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm`}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Source Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 text-[#016DA1]">Source</h3>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="source_id" className="font-normal">
                  Source Name
                </label>
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
                            <SelectItem
                              key={sourceItem.id}
                              value={sourceItem.id}
                            >
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
                  <label htmlFor="date_blacklisted" className="font-normal">
                    Blacklist Date
                  </label>
                  <Controller
                    name="date_blacklisted"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Blacklisted Date is required" }}
                    render={({ field }) => (
                      <Input
                        type="date"
                        id="date_blacklisted"
                        required
                        placeholder="Insert blacklisted date"
                        {...field}
                        className={`mt-1 block w-full h-16 ${
                          errors.date_blacklisted
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm`}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label htmlFor="blacklist_reason" className="font-normal">
                    Blacklist Reason
                  </label>
                  <Controller
                    name="blacklist_reason"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Blacklist Reason is required" }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="blacklist_reason"
                        required
                        placeholder="Insert blacklist reason"
                        {...field}
                        className={`mt-1 block w-full h-16 ${
                          errors.blacklist_reason
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm`}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Alert Popup */}
      {showAlert && <div className="alert">{alertMessage}</div>}

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
}
