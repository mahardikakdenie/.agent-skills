import React, { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "react-feather";
import ApiURL from "@/constants/api-url.const";
import {
  masterdataNotV1Service,
  masterdataService,
} from "@/services/api.service";
import {
  capitalizeString,
  capitalizeStringWithChar,
  getBreadcrumbs,
  toastNotification,
  toCamelCase,
} from "@/helpers/app.helper";
import { useScreen } from "@/context/screen.context";
import { useAuth } from "@/context/auth.context";
import Input from "@/components/input";
import Button from "@/components/button";
import Papa from "papaparse";
import { primary, templateFileLink } from "@/constants/app-common.const";
import Select from "@/components/select";

export const UploadPlanView = () => {
  const [selectedDetailOption, setSelectedDetailOption] = useState("");
  const [templateFileUrl, setTemplateFileUrl] = useState("");
  const [plan, setPlan] = useState<any>({});
  const [isReadyToUpload, setIsReadyToUpload] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<any | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const { id, doc } = useParams();
  const path = usePathname();
  const router = useRouter();
  const { setLoading } = useScreen();
  const { handleResponseError } = useAuth();
  const detailOptions = [
    {
      label: "Terms and Conditions",
      value: "tnc",
    },
    {
      label: "How to Claim",
      value: "how-to-claim",
    },
    {
      label: "Exception",
      value: "exception",
    },
    {
      label: "Percentage",
      value: "persentase",
    },
  ];

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const responsePlanDetails: any = await masterdataService.get(
          ApiURL.planDetails(id.toString())
        );
        if (responsePlanDetails) {
          const key = toCamelCase(
            `${
              responsePlanDetails.data.data[0]?.products?.categories?.name || ""
            } ${doc?.toString() || ""}`
          );
          setPlan(responsePlanDetails.data.data[0]);
          setTemplateFileUrl(templateFileLink[key]);
        }
      } catch (error: any) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadToServer = async () => {
    try {
      setLoading(true);
      const category = plan.products.categories.name;
      let response: any;
      if (!id || !doc) return;
      if (doc.toString() === "benefits")
        response = await masterdataService.post(
          `${ApiURL.planBenefit}/bulk-create/${id.toString()}`,
          csvData
        );
      else if (doc.toString() === "packages")
        response = await masterdataNotV1Service.post(
          `${ApiURL.packages}/${category}/bulk-create/${id.toString()}`,
          csvData
        );
      else
        response = await masterdataService.post(
          `${
            ApiURL.plans
          }/bulk-create/${id.toString()}/${selectedDetailOption}`,
          csvData
        );

      if (response) {
        toastNotification("Upload file successfully!");
        goToPlanDetailPage();
      }
    } catch (error: any) {
      toastNotification("Failed to upload file!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFile = (file: any) => {
    if (!!file) setFileToUpload(file);
    setIsReadyToUpload(false);
  };

  const handlePreview = () => {
    Papa.parse(fileToUpload, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
        setIsReadyToUpload(true);
      },
      error: () => {
        toastNotification("Error parsing CSV file.", "error");
      },
    });
  };

  const handleOnClear = () => {
    setFileToUpload(null);
    setIsReadyToUpload(false);
  };

  const filenameTemplate = (str1: string, str2: string) => {
    if (str1 && str2)
      return `Download ${capitalizeStringWithChar(
        str1,
        "-"
      ).toLowerCase()} ${capitalizeStringWithChar(str2, "-").toLowerCase()}`;
    else return "Download";
  };

  const downloadTemplate = () => window.open(templateFileUrl, "_blank");

  const goToPlanDetailPage = () => {
    router.push(path.split("/").slice(0, -2).join("/"));
  };

  return (
    <div className="mx-auto">
      <div className="overflow-x-auto sm:scrollable bg-white flex items-center justify-between mb-5 py-5 px-7">
        <div>
          {getBreadcrumbs(["Plan", "List", "Detail", "Upload"])}
          <p className="font-bold text-lg">
            Upload {capitalizeString(doc ? doc.toString() : "")}
          </p>
        </div>
        <div
          onClick={goToPlanDetailPage}
          className="flex items-center justify-between cursor-pointer"
        >
          <ChevronLeft color="red" width="30" height="15" />
          <p className="text-sm text-red-500">Back</p>
        </div>
      </div>
      <div className="pb-5 px-7 mb-5">
        <div className="p-5 bg-white rounded-md shadow">
          <p className="font-semibold">{plan.name}</p>
          {doc && doc.toString() === "details" && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Type</p>
              <Select
                chevronColor={primary}
                placeholderSelectClassName="truncate"
                additionalClassNameSelect="pl-4 h-[46px]"
                value={selectedDetailOption}
                onChange={(value) => setSelectedDetailOption(value.toString())}
                options={detailOptions}
              />
            </div>
          )}
          {!!templateFileUrl && doc && (
            <div className="mt-2">
              <p className="text-xs">
                {filenameTemplate(
                  plan?.products?.categories?.name,
                  doc?.toString()
                )}{" "}
                template{" "}
                <span
                  className="text-primary font-medium clickable"
                  onClick={downloadTemplate}
                >
                  here
                </span>
                .
              </p>
            </div>
          )}
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">CSV File</p>
            <Input
              value=""
              type="file"
              onChangeFile={handleSelectFile}
              onClear={handleOnClear}
            />
          </div>
          <div className="flex items-center text-center mt-4">
            <Button
              variant="warning"
              additionalClassName="mr-2"
              disabled={
                doc && doc.toString() === "details"
                  ? !fileToUpload || !selectedDetailOption
                  : !fileToUpload
              }
              onClick={handlePreview}
            >
              <span
                className={`mx-3.5 ${
                  doc && doc.toString() === "details"
                    ? (!fileToUpload || !selectedDetailOption) && "text-white"
                    : !fileToUpload && "text-white"
                }`}
              >
                Preview
              </span>
            </Button>
            <Button disabled={!isReadyToUpload} onClick={uploadToServer}>
              <span className="mx-3">Upload</span>
            </Button>
          </div>
        </div>
      </div>
      {isReadyToUpload && (
        <div className="pb-5 px-7 mb-5">
          <div className="relative bg-white rounded-md shadow-md">
            <div className="overflow-x-auto sm:scrollable">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="w-1/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    {csvData.length > 0 &&
                      Object.keys(csvData[0]).map((d, idx) => (
                        <th
                          key={`header-${idx}`}
                          className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                          {d}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {csvData.length > 0 &&
                    csvData.map((d, idx) => (
                      <tr key={`data-${idx}`}>
                        <td className="w-1/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {idx + 1}
                        </td>
                        {Object.values(d).map((s: any, sIdx) => (
                          <td
                            key={`subdata-${sIdx}`}
                            className="w-1/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                          >
                            {s}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
