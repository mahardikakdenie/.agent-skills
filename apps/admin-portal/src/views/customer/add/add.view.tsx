import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'react-feather';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import Modal from '@/components/modal';
import Select from '@/components/select';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import {
  getBreadcrumbs,
  getHeaderPage,
  moneyFormatter,
  toastNotification,
} from '@/helpers/app.helper';
import { productService } from '@/services/product/api/product.service';
import { transactionService } from '@/services/transaction/api/transaction.service';
import { Option } from '@/types/common';
import { Customer, RequestAddCustomer } from '@/types/customer';

import './add.view.css';

export const CustomerAddView = () => {
  const { isMobileView, setLoading } = useScreen();
  const router = useRouter();
  const path = usePathname();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { pageName, breadcrumbsArray } = getHeaderPage(3, path, true);
  const [payload, setPayload] = React.useState<RequestAddCustomer>({
    channel: '',
    customer: {} as Customer,
    category: '',
    package: '',
    quantity: 0,
    search_params: {},
    participant: {
      'imei/serial_number': '',
      brand_gadget: '',
      type_gadget: '',
    },
  });
  const { user, handleResponseError } = useAuth();
  const channel = user?.channel || undefined;
  const [selectedPlan, setSelectedPlan] = React.useState<any>();
  const [selectedLabelPlan, setSelectedLabelPlan] = React.useState<string>();
  const [optionListPlan, setOptionListPlan] = React.useState<Option[]>([]);
  const [listPlan, setListPlan] = React.useState<any[]>();
  const [phoneNumber, setPhoneNumber] = React.useState<string>();
  const [selectedAreaPhone, setSelectedAreaPhone] = React.useState<string>('+62');
  const phoneNumberOptions = [
    { value: '+62', label: '+62' },
    { value: '+60', label: '+60' },
    { value: '+65', label: '+65' },
    { value: '+63', label: '+63' },
  ];

  // const [imei, setImei] = useState<string>()
  // useEffect(() => {
  //     if (imei && imei.length > 14) {
  //         const searchImei = async () => {
  //             try {
  //                 const response = await fetch(`https://alpha.imeicheck.com/api/modelBrandName?imei=352322311421731`);
  //                 const data = await response.json();
  //                 setPayload((prev: RequestAddCustomer) => ({
  //                     ...prev,
  //                     participant: {
  //                         "imei/serial_number": data.imei,
  //                         type_gadget: data.object.model,
  //                         brand_gadget: data.object.brand,
  //                     }
  //                 }))
  //             } catch (e) {
  //                 toastNotification("IMEI not found!", "error");
  //             }
  //         }
  //         searchImei().catch();
  //     }
  // }, [imei]);

  const findListPlan = async () => {
    try {
      const response: any = await productService.getPlans({
        page: 1,
        pageSize: 9999,
        category: 'gadget',
        channelId: channel,
      });
      const tempOptions: Option[] = [];
      const tempPayload = [];
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].packages.length > 0) {
          tempOptions.push({
            label: response.data[i].name,
            value: response.data[i].name,
          });
          tempPayload.push({
            name: response.data[i].name,
            package_id: response.data[i].packages.length > 0 ? response.data[i].packages[0].id : 0,
            premium:
              response.data[i].packages.length > 0 ? response.data[i].packages[0].premium : 0,
            period: response.data[i].products.active_period
              ? response.data[i].products.active_period
              : 0,
          });
        }
      }
      setOptionListPlan(tempOptions);
      setListPlan(tempPayload);
    } catch (e) {
      handleResponseError(e);
    }
  };

  useEffect(() => {
    findListPlan().catch();
  }, []);

  const handleConfirmSubmit = () => {
    payload.package = selectedPlan?.package_id;
    payload.channel = channel ?? '';
    payload.customer.phone = `${selectedAreaPhone}${phoneNumber}`;
    payload.category = '71e00391-7dca-4a0c-a42f-d077d08b7ccd';
    setIsSubmitted(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await transactionService.completeTransaction(payload);
      if (response) {
        setIsSubmitted(false);
        setPayload({
          channel: '',
          customer: {} as Customer,
          category: '',
          package: '',
          quantity: 1,
          search_params: {},
          participant: {
            'imei/serial_number': '',
            brand_gadget: '',
            type_gadget: '',
          },
        });
        setPhoneNumber('');
        setSelectedPlan(null);
        setSelectedLabelPlan('');
        toastNotification('Success Add Customer!', 'success');
      }
    } catch (e) {
      setIsSubmitted(false);
      toastNotification('Failed to adding customer!', 'error');
      handleResponseError(e);
    }
  };

  const handleSelectArea = (e: string) => {
    setSelectedAreaPhone(e);
  };

  const handleSelectPlan = (e: any) => {
    setSelectedLabelPlan(e);
    setSelectedPlan(listPlan?.find((item) => item.name === e));
  };
  return (
    <Box className="mx-auto py-5 px-7">
      <Box className="overflow-x-auto sm:scrollable bg-white flex items-center justify-between mb-5 py-5 px-7">
        <Box>
          {getBreadcrumbs(breadcrumbsArray)}
          <Box as="p" className="font-bold text-lg">
            {pageName}
          </Box>
        </Box>
        <Box className="flex flex-col lg:flex-row items-center justify-end">
          <Box className="w-full lg:w-24 mr-0 lg:mr-5 mb-3 lg:mb-0">
            <Box
              onClick={() => router.push('/customer/list')}
              className="flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft color="red" width="30" height="15" />
              <Box as="p" className="text-sm text-red-500">
                Back
              </Box>
            </Box>
          </Box>
          <Button
            additionalClassName={`w-full lg:w-fit justify-center lg:justify-between`}
            onClick={() => handleConfirmSubmit()}
            withIcon={true}
            disabled={
              !(
                payload.customer.name &&
                payload.customer.email &&
                payload.participant.type_gadget &&
                payload.participant.brand_gadget &&
                (selectedPlan?.premium || selectedPlan?.period)
              )
            }
          >
            <Box as="span" className=" font-semibold">
              Submit
            </Box>
          </Button>
        </Box>
      </Box>

      <Box className="overflow-x-auto bg-white flex flex-col gap-3 justify-between mb-5 py-5 px-7">
        <Box>
          <Box as="p" className={`font-semibold`}>
            Customer Detail
          </Box>
        </Box>
        <Box className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Box className="flex flex-col gap-1">
            <Box as="label" className="text-sm">
              Customer Name
            </Box>
            <Box
              as="input"
              placeholder="ex: John Doe"
              value={(payload.customer.name as string) ?? ''}
              type="text"
              name="name"
              onChange={(e) =>
                setPayload((prevState: RequestAddCustomer) => ({
                  ...prevState,
                  customer: {
                    ...prevState.customer,
                    name: e.target.value,
                  },
                }))
              }
              className="w-full h-full rounded-md border border-gray-300 overflow-hidden px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-0 focus:shadow-none"
            />
          </Box>
          <Box className="flex flex-col gap-1">
            <Box as="label" className="text-sm">
              Phone Number
            </Box>
            <Box className="flex w-full h-full rounded-md border border-gray-300 overflow-hidden">
              <Box
                as="select"
                className="bg-gray-100 cursor-pointer text-sm text-gray-800 px-3 py-2 border-r border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none"
                defaultValue={selectedAreaPhone}
                onChange={(e) => handleSelectArea(e.target.value)}
              >
                {phoneNumberOptions.map((item, index) => (
                  <Box as="option" key={index} value={item.value}>
                    {item.label}
                  </Box>
                ))}
              </Box>
              <Box
                as="input"
                placeholder="ex: 81234567890"
                value={(phoneNumber as string) ?? ''}
                type="number"
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none"
              />
            </Box>
          </Box>
          <Box className="flex flex-col gap-1">
            <Box as="label" className="text-sm">
              Email
            </Box>
            <Box
              as="input"
              placeholder="ex: customer@gmail.com"
              value={(payload.customer.email as string) ?? ''}
              type="email"
              name="email"
              onChange={(e) =>
                setPayload((prevState: RequestAddCustomer) => ({
                  ...prevState,
                  customer: {
                    ...prevState.customer,
                    email: e.target.value,
                  },
                }))
              }
              className="w-full h-full rounded-md border border-gray-300 overflow-hidden px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-0 focus:shadow-none"
            />
          </Box>
        </Box>
      </Box>

      <Box className="overflow-x-auto bg-white flex flex-col gap-5 justify-between mb-5 py-5 px-7">
        <Box>
          <Box as="p" className={`font-semibold`}>
            Gadget Details
          </Box>
        </Box>
        <Box className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Box className="flex flex-col gap-1">
            <Box as="label" className="text-sm">
              Imei/Serial Number
            </Box>
            <Box
              as="input"
              placeholder="ex: 12345678901234567890"
              value={payload?.participant['imei/serial_number'] ?? ''}
              type="number"
              name="imei/serial_number"
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  participant: {
                    ...prev.participant,
                    [e.target.name]: e.target.value,
                  },
                }))
              }
              className="w-full h-full rounded-md border border-gray-300 overflow-hidden px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-0 focus:shadow-none"
            />
          </Box>
          <Box className="flex flex-col gap-1">
            <Box as="label" className="text-sm">
              Brand Gadget
            </Box>
            <Box
              as="input"
              placeholder="ex: Motorola"
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  participant: {
                    ...prev.participant,
                    [e.target.name]: e.target.value,
                  },
                }))
              }
              name="brand_gadget"
              value={payload?.participant?.brand_gadget ?? ''}
              className="w-full h-full rounded-md border border-gray-300 overflow-hidden px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-0 focus:shadow-none"
            />
          </Box>
          <Box className="flex flex-col gap-1">
            <Box as="label" className="text-sm">
              Type Gadget
            </Box>
            <Box
              as="input"
              placeholder="ex: XT2231-5"
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  participant: {
                    ...prev.participant,
                    [e.target.name]: e.target.value,
                  },
                }))
              }
              name={`type_gadget`}
              value={payload?.participant?.type_gadget ?? ''}
              className="w-full h-full rounded-md border border-gray-300 overflow-hidden px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-0 focus:shadow-none"
            />
          </Box>
        </Box>
        <Box className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Box className="flex flex-col gap-1">
            <Box as="label" className="text-sm">
              Plan
            </Box>
            <Select
              value={selectedLabelPlan as string}
              placeholderSelect={selectedLabelPlan}
              onChange={(e) => handleSelectPlan(e)}
              options={optionListPlan as Option[]}
            />
          </Box>
          <Box className="flex flex-col gap-1">
            <Box as="label" className="text-sm">
              Premium
            </Box>
            <Box
              as="input"
              placeholder="Input number"
              disabled={true}
              value={moneyFormatter('IDR').format(selectedPlan?.premium | 0) ?? ''}
              className="w-full h-full cursor-not-allowed rounded-md border border-gray-300 overflow-hidden px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none"
            />
          </Box>
          <Box className="flex flex-col gap-1">
            <Box as="label" className="text-sm">
              Periode (year)
            </Box>
            <Box
              as="input"
              placeholder="ex: 2 year"
              disabled={true}
              value={selectedPlan?.period ?? ''}
              className="w-full h-full cursor-not-allowed rounded-md border border-gray-300 overflow-hidden px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none"
            />
          </Box>
        </Box>
      </Box>
      <Modal
        widthClassName="w-fit max-w-full lg:max-w-[60%]"
        heightClassName="h-fit max-h-full"
        isOpen={isSubmitted}
        onClose={() => setIsSubmitted(false)}
      >
        <Box className={`flex flex-col gap-5 p-5`}>
          <Box>
            <Box as="p" className={`font-bold text-center`}>
              Please review the data below before uploading it to the customer data
            </Box>
            <Box as="p" className={`text-center`}>
              Click Cancel to make changes.
            </Box>
          </Box>
          <Box className={`flex flex-col gap-4 mt-3`}>
            {[
              ['Customer Name', payload?.customer?.name],
              ['Phone Number', payload?.customer?.phone],
              ['Email', payload?.customer?.email],
              ['Imei/Serial Number', payload?.participant['imei/serial_number']],
              ['Brand Gadget', payload?.participant?.brand_gadget],
              ['Type Gadget', payload?.participant?.type_gadget],
              ['Plan', selectedPlan?.name],
              ['Premium', `${moneyFormatter('IDR').format(selectedPlan?.premium)}`],
              ['Periode', `${selectedPlan?.period} year`],
            ].map(([label, value], index) => (
              <Box className="flex" key={index}>
                <Box className="w-44 min-w-[11rem] text-sm font-medium">{label}</Box>
                <Box className="pr-1 text-sm">:</Box>
                <Box className="flex-1 text-sm">{value ?? '-'}</Box>
              </Box>
            ))}
          </Box>
          <Box className={`flex justify-center gap-4`}>
            <Button variant={`danger`} onClick={() => setIsSubmitted(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmit()}>Upload</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
