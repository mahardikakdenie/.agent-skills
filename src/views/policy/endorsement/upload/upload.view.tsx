"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, X } from "react-feather";
import * as XLSX from "xlsx";
import moment from "moment";

import Select from "@/components/select";
import Button from "@/components/button";
import UploadIcon from "@/images/upload.icon";
import Modal from "@/components/modal";

import { getBreadcrumbs, getHeaderPage, toastNotification } from "@/helpers/app.helper";
import { useAuth } from "@/context/auth.context";
import { useScreen } from "@/context/screen.context";
import ApiURL from "@/constants/api-url.const";
import AppURL from "@/constants/app-url.const";
import { policyService } from "@/services/api.service";

export const EndorsementUploadView = () => {
  const [selectedFileType, setSelectedFileType] = useState("");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [rawDataForUpload, setRawDataForUpload] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [uploadStats, setUploadStats] = useState({ success: 0, failed: 0 });
  const [dateFormatError, setDateFormatError] = useState(false);

  const path = usePathname();
  const router = useRouter();
  const { breadcrumbsArray } = getHeaderPage(3, path, true);
  const { user } = useAuth();
  const { setLoading } = useScreen();

  const relationTypes = [
    { label: "Additional", value: "Additional" },
    { label: "Termination", value: "Reduction" },
  ];
  const [relationOptions] = useState(relationTypes);

  const toSnakeCase = (str: string) =>
    str.replace(/\s+/g, "_").replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();

  const isValidYYYYMMDDFormat = (val: string): boolean => {
    return moment(val, "YYYY-MM-DD", true).isValid();
  };

  const handlePreview = () => {
    if (!fileToUpload) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
        defval: "",
        raw: false,
      });

      if (!rawData.length) return;

      const nonEmptyKeys = Object.keys(rawData[0]).filter((key) =>
        rawData.some((row) => row[key]?.toString().trim() !== "")
      );

      const previewData: any[] = [];
      const uploadData: any[] = [];

      for (const row of rawData) {
        const previewRow: Record<string, any> = {};
        const uploadRow: Record<string, any> = {};

        for (const key of nonEmptyKeys) {
          let val = row[key];
          const isDateField = /date|birth/i.test(key);

          if (isDateField) {
            if (typeof val === "number") {
              const date = XLSX.SSF.parse_date_code(val);
              if (date) {
                val = `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
              } else {
                setDateFormatError(true);
                return;
              }
            }

            if (typeof val === "string" && !isValidYYYYMMDDFormat(val)) {
              setDateFormatError(true);
              return;
            }

            previewRow[key] = moment(val, "YYYY-MM-DD").format("DD/MM/YYYY");
            uploadRow[key] = val;
          } else {
            previewRow[key] = val;
            uploadRow[key] = val;
          }
        }

        previewData.push(previewRow);
        uploadData.push(uploadRow);
      }

      setParsedData(previewData);
      setRawDataForUpload(uploadData);
    };

    reader.readAsArrayBuffer(fileToUpload);
  };

  const handleUpload = async () => {
    if (!fileToUpload || !selectedFileType || rawDataForUpload.length === 0) {
      toastNotification("Please choose file and file type before uploading.", "error");
      return;
    }

    setLoading(true);

    try {
      const headerKeyMap: Record<string, string> = {
        "Member Status (E/S/C)": "member_status",
        "Subsidiary / Entity": "subsidiary",
        "Bank Account Name (Owner)": "bank_account_name",
        "Bank Number": "bank_account_number",
      };

      const mappedData = rawDataForUpload.map((item) => {
        const profile: Record<string, any> = {};

        for (const key in item) {
          const originalValue = item[key];
          const mappedKey = headerKeyMap[key] || toSnakeCase(key);
          profile[mappedKey] = originalValue;
        }

        return { profile };
      });

      const masterResult = await policyService.get(ApiURL.masterPolicy(user?.channel), {
        params: { is_only_master_policy: true },
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      const policyId = masterResult.data?.id;

      const uploadResponse = await policyService.post(ApiURL.endorsementUpload, {
        policy: policyId,
        type: selectedFileType,
        data: mappedData,
      });

      const failedData = uploadResponse.data?.failed_data || [];
      setUploadStats({ success: mappedData.length - failedData.length, failed: failedData.length });
      setShowModal(true);
    } catch (error) {
      toastNotification(`Upload failed! Error: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const clearFileUploadInput = () => {
    setFileToUpload(null);
    setParsedData([]);
    setRawDataForUpload([]);
  };

  const thClass = "px-6 py-6 text-left text-base font-semibold text-gray-500 tracking-wider whitespace-nowrap";
  const tdClass = "px-6 py-3 text-sm text-gray-500 whitespace-nowrap";

  return (
    <div className="min-h-screen bg-white">
      <div className="overflow-x-auto sm:scrollable flex items-center justify-between py-5 px-7">
        <div>
          {getBreadcrumbs(breadcrumbsArray)}
          <p className="font-bold text-lg mt-0">Upload Data</p>
        </div>
        <div onClick={() => router.back()} className="flex items-center justify-between cursor-pointer">
          <ChevronLeft color="red" width="30" height="15" />
          <p className="text-sm text-red-500 ml-1">Kembali</p>
        </div>
      </div>

      <div className="pb-5 px-7">
        <div className="flex flex-col lg:flex-row gap-2.5">
          <div className="w-full lg:w-[220px]">
            <Select
              additionalClassNameSelect="w-full pl-4"
              withBorder={true}
              value={selectedFileType}
              onChange={(event) => setSelectedFileType(event.toString())}
              options={relationOptions}
              placeholderSelect="Choose File Type"
            />
          </div>

          <div className="relative flex-grow">
            <input
              key={fileToUpload ? fileToUpload.name : "empty"}
              type="file"
              id="fileUpload"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
            />
            <label
              htmlFor="fileUpload"
              className="w-full h-8 flex items-center px-4 text-xs rounded-md border border-gray-300 cursor-pointer bg-white pr-16"
            >
              <span className="truncate">{fileToUpload?.name || "Choose File"}</span>
            </label>

            {fileToUpload && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div onClick={handlePreview} className="cursor-pointer" title="Preview File">
                  {UploadIcon("#4CAF50", "16", "16", "0 0 24 24")}
                </div>
                <div onClick={clearFileUploadInput} className="cursor-pointer text-red-500" title="Remove File">
                  <X size={16} />
                </div>
              </div>
            )}
          </div>

          <Button disabled={!fileToUpload} onClick={handlePreview}>Preview</Button>
          <Button disabled={!fileToUpload || !selectedFileType} onClick={handleUpload}>Upload</Button>
        </div>

        {parsedData.length > 0 && (
          <div className="overflow-x-auto" style={{ minHeight: "60vh" }}>
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead>
                <tr>
                  {Object.keys(parsedData[0]).map((key) => (
                    <th key={key} className={thClass}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {parsedData.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    {Object.entries(row).map(([_, value], cellIndex) => (
                      <td key={`cell-${rowIndex}-${cellIndex}`} className={tdClass}>
                        {value?.toString?.() || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal upload result */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} widthClassName="w-full max-w-sm" heightClassName="max-h-[40vh]">
        <div className="text-center p-6">
          <p className="text-lg font-semibold mb-4">Data Uploaded</p>
          <p className="text-sm text-primary">
            {uploadStats.success} records uploaded successfully
          </p>
          <p className="text-sm text-red-500">
            {uploadStats.failed} records failed to upload
          </p>
          <p className="text-sm mt-4">
            View the list to see detailed results
          </p>
          <Button additionalClassName="mt-4" onClick={() => router.push(AppURL.endorsementList)}>
            View List
          </Button>
        </div>
      </Modal>

      {/* Modal format error */}
      <Modal isOpen={dateFormatError} onClose={() => setDateFormatError(false)} widthClassName="w-full max-w-sm" heightClassName="max-h-[40vh]">
        <div className="text-center p-6">
          <p className="text-base font-semibold">Make sure date is in correct format</p>
          <p className="text-sm mt-2">
            Invalid date format detected. Please correct the date format in your file to match the required format (e.g., YYYY-MM-DD) and re-upload.
          </p>
          <Button additionalClassName="mt-4" onClick={() => setDateFormatError(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};
