import { useParams, usePathname, useRouter } from 'next/navigation';
import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'react-feather';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import Input from '@/components/input';
import Select from '@/components/select';
import { primary, templateFileLink } from '@/constants/app-common.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import {
  capitalizeString,
  capitalizeStringWithChar,
  getBreadcrumbs,
  toastNotification,
  toCamelCase,
} from '@/helpers/app.helper';
import { productService } from '@/services/product/api/product.service';

export const UploadPlanView = () => {
  const [selectedDetailOption, setSelectedDetailOption] = useState('');
  const [templateFileUrl, setTemplateFileUrl] = useState('');
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
      label: 'Terms and Conditions',
      value: 'tnc',
    },
    {
      label: 'How to Claim',
      value: 'how-to-claim',
    },
    {
      label: 'Exception',
      value: 'exception',
    },
    {
      label: 'Percentage',
      value: 'persentase',
    },
  ];

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const responsePlanDetails: any = await productService.getPlanById(id.toString());
        if (responsePlanDetails) {
          const planData =
            responsePlanDetails?.data?.[0] || responsePlanDetails?.data || responsePlanDetails;
          const key = toCamelCase(
            `${planData?.products?.categories?.name || ''} ${doc?.toString() || ''}`,
          );
          setPlan(planData);
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
      if (doc.toString() === 'benefits')
        response = await productService.bulkCreatePlanBenefits(id.toString(), csvData);
      else if (doc.toString() === 'packages')
        response = await productService.bulkCreatePackagesByCategory(
          category,
          id.toString(),
          csvData,
        );
      else
        response = await productService.bulkCreatePlanDetails(
          id.toString(),
          selectedDetailOption,
          csvData,
        );

      if (response) {
        toastNotification('Upload file successfully!');
        goToPlanDetailPage();
      }
    } catch (error: any) {
      toastNotification('Failed to upload file!', 'error');
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
        toastNotification('Error parsing CSV file.', 'error');
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
        '-',
      ).toLowerCase()} ${capitalizeStringWithChar(str2, '-').toLowerCase()}`;
    else return 'Download';
  };

  const downloadTemplate = () => window.open(templateFileUrl, '_blank');

  const goToPlanDetailPage = () => {
    router.push(path.split('/').slice(0, -2).join('/'));
  };

  return (
    <Box className="mx-auto">
      <Box className="overflow-x-auto sm:scrollable bg-white flex items-center justify-between mb-5 py-5 px-7">
        <Box>
          {getBreadcrumbs(['Plan', 'List', 'Detail', 'Upload'])}
          <Box as="p" className="font-bold text-lg">
            Upload {capitalizeString(doc ? doc.toString() : '')}
          </Box>
        </Box>
        <Box
          onClick={goToPlanDetailPage}
          className="flex items-center justify-between cursor-pointer"
        >
          <ChevronLeft color="red" width="30" height="15" />
          <Box as="p" className="text-sm text-red-500">
            Back
          </Box>
        </Box>
      </Box>
      <Box className="pb-5 px-7 mb-5">
        <Box className="p-5 bg-white rounded-md shadow">
          <Box as="p" className="font-semibold">
            {plan.name}
          </Box>
          {doc && doc.toString() === 'details' && (
            <Box className="mt-4">
              <Box as="p" className="text-sm font-medium mb-2">
                Type
              </Box>
              <Select
                chevronColor={primary}
                placeholderSelectClassName="truncate"
                additionalClassNameSelect="pl-4 h-[46px]"
                value={selectedDetailOption}
                onChange={(value) => setSelectedDetailOption(value.toString())}
                options={detailOptions}
              />
            </Box>
          )}
          {!!templateFileUrl && doc && (
            <Box className="mt-2">
              <Box as="p" className="text-xs">
                {filenameTemplate(plan?.products?.categories?.name, doc?.toString())} template{' '}
                <Box
                  as="span"
                  className="text-primary font-medium clickable"
                  onClick={downloadTemplate}
                >
                  here
                </Box>
                .
              </Box>
            </Box>
          )}
          <Box className="mt-4">
            <Box as="p" className="text-sm font-medium mb-2">
              CSV File
            </Box>
            <Input value="" type="file" onChangeFile={handleSelectFile} onClear={handleOnClear} />
          </Box>
          <Box className="flex items-center text-center mt-4">
            <Button
              variant="warning"
              additionalClassName="mr-2"
              disabled={
                doc && doc.toString() === 'details'
                  ? !fileToUpload || !selectedDetailOption
                  : !fileToUpload
              }
              onClick={handlePreview}
            >
              <Box
                as="span"
                className={`mx-3.5 ${
                  doc && doc.toString() === 'details'
                    ? (!fileToUpload || !selectedDetailOption) && 'text-white'
                    : !fileToUpload && 'text-white'
                }`}
              >
                Preview
              </Box>
            </Button>
            <Button disabled={!isReadyToUpload} onClick={uploadToServer}>
              <Box as="span" className="mx-3">
                Upload
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>
      {isReadyToUpload && (
        <Box className="pb-5 px-7 mb-5">
          <Box className="relative bg-white rounded-md shadow-md">
            <Box className="overflow-x-auto sm:scrollable">
              <Box as="table" className="min-w-full divide-y divide-gray-200">
                <Box as="thead" className="bg-white">
                  <Box as="tr">
                    <Box
                      as="th"
                      className="w-1/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      No.
                    </Box>
                    {csvData.length > 0 &&
                      Object.keys(csvData[0]).map((d, idx) => (
                        <Box
                          as="th"
                          key={`header-${idx}`}
                          className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                          {d}
                        </Box>
                      ))}
                  </Box>
                </Box>
                <Box as="tbody" className="bg-white divide-y divide-gray-200">
                  {csvData.length > 0 &&
                    csvData.map((d, idx) => (
                      <Box as="tr" key={`data-${idx}`}>
                        <Box
                          as="td"
                          className="w-1/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                        >
                          {idx + 1}
                        </Box>
                        {Object.values(d).map((s: any, sIdx) => (
                          <Box
                            as="td"
                            key={`subdata-${sIdx}`}
                            className="w-1/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                          >
                            {s}
                          </Box>
                        ))}
                      </Box>
                    ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
