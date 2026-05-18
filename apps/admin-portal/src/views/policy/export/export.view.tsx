import jsPDF from 'jspdf';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'react-feather';
import * as XLSX from 'xlsx';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import NotFound from '@/components/not-found';
import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import { getLocalStorage, toastNotification } from '@/helpers/app.helper';
import DownloadIcon from '@/images/download.icon';
import { policyService } from '@/services/policy/api/policy.service';

export const PolicyExportView = () => {
  const [data, setData] = useState<any[]>([]);
  const { handleResponseError, user } = useAuth();
  const { isMobileView, setLoading } = useScreen();
  const router = useRouter();
  const reportTemplateRef = useRef(null);
  const channel = user?.channel || undefined;
  useEffect(() => {
    const fetchAllDataPolicy = async (page = 1, accumulatedData: any[] = []) => {
      try {
        setLoading(true);
        const filterPolicyData = getLocalStorage('filterPolicyData');
        const params = {
          status: filterPolicyData.filterStatus,
          keyword: filterPolicyData.filterKeyword,
          limit: 100,
          page,
          channel,
        };
        const response: any = await policyService.getPolicies(params);

        if (response) {
          const newData = response.data || [];
          const updatedData = [...accumulatedData, ...newData];
          setData(updatedData);

          if (page < response.pageTotal) {
            await fetchAllDataPolicy(page + 1, updatedData);
          }
        }
      } catch (error) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDataPolicy().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGeneratePdf = () => {
    if (!reportTemplateRef.current) {
      toastNotification('Policy template element is not found!', 'error');
      return;
    }

    const doc = new jsPDF({
      format: 'a1',
      unit: 'px',
    });
    doc.setFontSize(10);
    doc.setFont('Inter-Regular', 'normal');
    doc.html(reportTemplateRef.current, {
      async callback(doc: any) {
        await doc.save(`Policy List - ${moment(new Date()).format('lll')}.pdf`);
      },
      x: 30,
      y: 30,
    });
  };

  const handleGenerateXlsx = () => {
    if (data.length === 0) {
      toastNotification('No policy data to export!', 'error');
      return;
    }

    const sheetData = data.map((item, index) => ({
      No: index + 1,
      'Customer Name': item.policy_holder?.name || '-',
      'Policy Number': item.number || '-',
      'Plan Name': item.policy_products?.plan_data?.name?.split('|').join(' - ') || '-',
      Status: item.status || '-',
      'Issued Date': !!item.created_at ? moment(item.created_at).format('LL') : '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Policy List');
    XLSX.writeFile(workbook, `Policy List - ${moment(new Date()).format('lll')}.xlsx`);
  };

  const stylesPolicyData = {
    table: {
      width: '100%',
      border: '0.5px solid #cccccc',
    },
    th: {
      padding: '10px',
      border: '0.5px solid #cccccc',
      fontWeight: 'bold',
      fontSize: '12px',
      height: 'auto',
      background: '#e7e7e7',
      verticalAlign: 'middle',
    },
    td: {
      padding: '10px',
      height: 'auto',
      border: '0.5px solid #cccccc',
      fontSize: '12px',
      verticalAlign: 'middle',
    },
  };

  return (
    <Box className="mx-auto py-5 px-7">
      <Box className="lg:flex lg:items-center lg:justify-between lg:mb-3">
        <Box className="flex items-center justify-between mb-5">
          <Box as="p" className="font-bold text-lg lg:mt-2">
            Policy List
          </Box>
          {isMobileView && (
            <Box
              onClick={() => router.push(AppURL.policyList)}
              className="ml-auto items-center flex gap-1 text-red-500 text-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Box>
          )}
        </Box>
        {!isMobileView && (
          <Box
            onClick={() => router.push(AppURL.policyList)}
            className="ml-auto items-center flex gap-1 text-red-500 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Box>
        )}
        <Box className="lg:ml-5">
          <Button
            additionalClassName="w-full lg:w-fit justify-center lg:justify-between mr-0 mb-3 lg:mb-0"
            onClick={handleGeneratePdf}
            variant="warning"
            withIcon={true}
            disabled={data.length < 1}
          >
            {DownloadIcon(data.length < 1 ? '#FFF' : '#000')}
            <Box as="span" className={`ml-1 ${data.length < 1 && 'text-white'}`}>
              Generate PDF
            </Box>
          </Button>
        </Box>
        <Box className="mb-5 lg:mb-0 lg:ml-3">
          <Button
            additionalClassName="w-full lg:w-fit justify-center lg:justify-between mr-0 mb-3 lg:mb-0"
            onClick={handleGenerateXlsx}
            withIcon={true}
            disabled={data.length < 1}
          >
            {DownloadIcon('#FFF')}
            <Box as="span" className="ml-1">
              Generate XLXS
            </Box>
          </Button>
        </Box>
      </Box>
      <Box className="w-full bg-white rounded-lg">
        {data.length < 1 ? (
          <Box className="flex items-center justify-center bg-white rounded-md py-20 shadow">
            <NotFound
              width={isMobileView && '143'}
              height={isMobileView && '144'}
              size1={isMobileView && '143'}
              size3={isMobileView && '95'}
              viewBox={isMobileView && '0 0 70 70'}
              text="No policy data available"
              textClassName={isMobileView && 'text-xs'}
            />
          </Box>
        ) : (
          <Box className="overflow-x-auto sm:scrollable">
            <Box as="table" style={stylesPolicyData.table} ref={reportTemplateRef} border={1}>
              <Box as="thead">
                <Box as="tr">
                  <Box as="td" style={stylesPolicyData.th} valign="middle">
                    No.
                  </Box>
                  <Box as="td" style={stylesPolicyData.th} valign="middle">
                    Customer Name
                  </Box>
                  <Box as="td" style={stylesPolicyData.th} valign="middle">
                    Policy Number
                  </Box>
                  <Box as="td" style={stylesPolicyData.th} valign="middle">
                    Plan Name
                  </Box>
                  <Box as="td" style={stylesPolicyData.th} valign="middle">
                    Status
                  </Box>
                  <Box as="td" style={stylesPolicyData.th} valign="middle">
                    Issued Date
                  </Box>
                </Box>
              </Box>
              <Box as="tbody">
                {data.map((item, index) => (
                  <Box as="tr" key={item.id}>
                    <Box as="td" style={stylesPolicyData.td} valign="middle">
                      {index + 1}
                    </Box>
                    <Box as="td" style={stylesPolicyData.td} valign="middle">
                      <Box className="flex gap-2 items-center">
                        {item.policy_holder?.name || '-'}
                      </Box>
                    </Box>
                    <Box as="td" style={stylesPolicyData.td} valign="middle">
                      {item.number || '-'}
                    </Box>
                    <Box as="td" style={stylesPolicyData.td} valign="middle">
                      {item.policy_products?.plan_data?.name?.split('|').join(' - ') || '-'}
                    </Box>
                    <Box as="td" style={stylesPolicyData.td} valign="middle">
                      {item.status || '-'}
                    </Box>
                    <Box as="td" style={stylesPolicyData.td} valign="middle">
                      {!!item.created_at ? moment(item.created_at).format('LL') : '-'}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
