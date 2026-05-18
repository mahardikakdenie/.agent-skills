import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'react-feather';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import AlertCircleIcon from '@/components/icons/alert-circle-icon';
import Input from '@/components/input';
import Modal from '@/components/modal';
import NotFound from '@/components/not-found';
import Select from '@/components/select';
import { primary, primaryRed } from '@/constants/app-common.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import { getBreadcrumbs, getHeaderPage, toastNotification } from '@/helpers/app.helper';
import AddIcon from '@/images/add.icon';
import TrashIcon from '@/images/trash.icon';
import { channelService } from '@/services/channel/api/channel.service';
import { productService } from '@/services/product/api/product.service';

export const PlanDetailView = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [planName, setPlanName] = useState('');
  const [planSlug, setPlanSlug] = useState('');
  const [selectedDetailOption, setSelectedDetailOption] = useState('');
  const [selectedAssignOption, setSelectedAssignOption] = useState('');
  const [selectedOccupationOption, setSelectedOccupationOption] = useState('all');
  const [selectedAgeOption, setSelectedAgeOption] = useState('all');
  const [selectedAdultOption, setSelectedAdultOption] = useState('all');
  const [selectedChildOption, setSelectedChildOption] = useState('all');
  const [productCategory, setProductCategory] = useState('');
  const [selectedUnassignChannel, setSelectedUnassignChannel] = useState<any>({});
  const [tab, setTab] = useState('packages');
  const [productList, setProductList] = useState<any[]>([]);
  const [allPackagesData, setAllPackagesData] = useState<any[]>([]);
  const [packagesData, setPackagesData] = useState<any[]>([]);
  const [benefitsData, setBenefitsData] = useState<any[]>([]);
  const [detailsData, setDetailsData] = useState<any[]>([]);
  const [channelsData, setChannelsData] = useState<any[]>([]);
  const [assignOptions, setAssignOptions] = useState<any[]>([]);
  const [occupationOptions, setOccupationOptions] = useState<any[]>([]);
  const [ageOptions, setAgeOptions] = useState<any[]>([]);
  const [adultsOptions, setAdultsOptions] = useState<any[]>([]);
  const [childOptions, setChildOptions] = useState<any[]>([]);
  const [isAssignModal, setIsAssignModal] = useState(false);
  const [isUnassignModal, setIsUnassignModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1000);
  const [totalData, setTotalData] = useState(0);
  const path = usePathname();
  const router = useRouter();
  const { id } = useParams();
  const { isMobileView, setLoading } = useScreen();
  const { handleResponseError, user } = useAuth();
  const { pageName, breadcrumbsArray } = getHeaderPage(3, path, false);
  const insurerId = user?.account_insurers[0]?.insurance;
  const delimiter = ';;;';
  const tabList = [
    {
      label: 'Packages',
      value: 'packages',
    },
    {
      label: 'Benefits',
      value: 'benefits',
    },
    {
      label: 'Details',
      value: 'details',
    },
    {
      label: 'Channels',
      value: 'channels',
    },
  ];
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
    fetchProducts().then(() =>
      fetchPlanDetails().then(() => fetchPackagesData(currentPage, itemsPerPage)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchAssignOptions = async () => {
      try {
        setLoading(true);
        const response: any = await channelService.getChannels({
          page: 1,
          limit: 100,
        });
        if (response) {
          const list = response?.data || [];
          setAssignOptions(
            list.map((item: any) => ({
              label: item.name || '-',
              value: `${item.id}${delimiter}${item.name}`,
            })),
          );
        }
      } catch (error: any) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    if (tab === 'benefits') fetchTabData().then();
    else if (tab === 'details') setSelectedDetailOption(detailOptions[0].value);
    else if (tab === 'channels') fetchAssignOptions().finally(() => fetchTabData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    const fetchDetailsData = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const response: any = await productService.getPlanDetails(
          id.toString(),
          selectedDetailOption,
        );
        if (response) setDetailsData(response?.data || []);
      } catch (error: any) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    if (!!selectedDetailOption) fetchDetailsData().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDetailOption]);

  const fetchTabData = async () => {
    try {
      setLoading(true);
      if (!id) return;
      if (tab === 'benefits') {
        const response: any = await productService.getPlanBenefits(id.toString());
        if (response) setBenefitsData(response?.data || []);
      } else if (tab === 'channels') {
        const response: any = await productService.getPlanChannels(id.toString());
        if (response) setChannelsData(response?.data || []);
      }
    } catch (error: any) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response: any = await productService.getProducts({ insuranceId: insurerId });
      if (response) {
        const list = response?.data || [];
        setProductList(
          list.map((item: any) => ({
            label: item.name || '-',
            value: item.id,
          })),
        );
      }
    } catch (error: any) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      if (!id) return;
      const responsePlanDetails: any = await productService.getPlanById(id.toString());
      if (responsePlanDetails) {
        const generalData =
          responsePlanDetails?.data?.[0] || responsePlanDetails?.data || responsePlanDetails;
        setSelectedProduct(generalData.product);
        setPlanName(generalData.name);
        setPlanSlug(generalData.slug);
        setProductCategory(generalData.products?.categories?.name);
      }
    } catch (error: any) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackagesData = async (page: number, limit: number, active: boolean = true) => {
    try {
      setLoading(true);
      if (!id) return;
      const params = {
        active,
        planId: id.toString(),
        pageSize: limit,
        page,
      };
      const response: any = await productService.getPackages(params as any);
      if (response) {
        setCurrentPage(page);
        const packageList = response?.data || [];
        setTotalData(response?.meta?.total || response?.total || 0);
        setPackagesData(packageList);
        setAllPackagesData(packageList);

        const occupations = Array.from(
          new Set(
            packageList
              .map((pkg: any) => String(pkg.search_params.occupation_class))
              .filter((occupation_class: any) => occupation_class),
          ),
        ).map((item: any) => ({ label: item || '-', value: item }));
        setOccupationOptions([{ label: 'All occupation class', value: 'all' }, ...occupations]);
        setSelectedOccupationOption('all');

        const ages = Array.from(
          new Set(
            packageList.map((pkg: any) => String(pkg.search_params.age)).filter((age: any) => age),
          ),
        ).map((item: any) => {
          const firstAge = item ? item.split(',')[0] : '';
          const lastAge = item ? item.split(',')[item.split(',').length - 1] : '';
          return { label: `${firstAge}-${lastAge}`, value: item };
        });
        setAgeOptions([{ label: 'All ages', value: 'all' }, ...ages]);
        setSelectedAgeOption('all');

        const adults = Array.from(
          new Set(packageList.map((pkg: any) => pkg.search_params.adult).filter(Boolean)),
        ).map((item: any) => ({ label: `${item}` || '-', value: `${item}` }));
        setAdultsOptions([{ label: 'All adults', value: 'all' }, ...adults]);
        setSelectedAdultOption('all');

        const children = Array.from(
          new Set(packageList.map((pkg: any) => pkg.search_params.children).filter(Boolean)),
        ).map((item: any) => ({ label: `${item}` || '-', value: `${item}` }));
        setChildOptions([{ label: 'All children', value: 'all' }, ...children]);
        setSelectedChildOption('all');
      }
    } catch (error: any) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateGeneralDataPlan = async () => {
    try {
      setLoading(true);
      const requestBody = {
        insuranceId: insurerId,
        productId: selectedProduct,
        name: planName,
        slug: planSlug,
      };
      if (!id) return;
      const response: any = await productService.updatePlan(id.toString(), requestBody);
      if (response) toastNotification('Plan updated successfully!');
    } catch (error: any) {
      toastNotification('Failed to update plan!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const doAssign = async () => {
    try {
      setLoading(true);
      if (!id) return;
      const requestBody = {
        channel: selectedAssignOption.split(delimiter)[0],
        channelName: selectedAssignOption.split(delimiter)[1],
        plans: [id.toString()],
      };
      const response: any = await productService.assignChannelPlans(requestBody);
      if (response) {
        toggleAssignModal();
        setSelectedAssignOption('');
        toastNotification('Plan assigned successfully!');
        fetchTabData().then();
      }
    } catch (error: any) {
      toastNotification('Failed to assign plan!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const doUnassign = async () => {
    try {
      setLoading(true);
      if (!id) return;
      const requestBody = {
        channel: selectedUnassignChannel.channel,
        plans: [id.toString()],
      };
      const response: any = await productService.unassignChannelPlans(requestBody);
      if (response) {
        toggleAssignModal(false);
        setSelectedUnassignChannel({});
        toastNotification('Plan unassigned successfully!');
        fetchTabData().then();
      }
    } catch (error: any) {
      toastNotification('Failed to unassign plan!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOccupationClass = (value: string) => {
    setSelectedOccupationOption(value);
    if (value !== 'all') {
      const filteredData = allPackagesData.filter(
        (pkg) => String(pkg?.search_params?.occupation_class) === value,
      );
      setPackagesData(filteredData);
    } else {
      setPackagesData(allPackagesData);
    }
  };

  const handleSelectAge = (value: string) => {
    setSelectedAgeOption(value);
    if (value !== 'all') {
      const filteredData = allPackagesData.filter(
        (pkg) =>
          `${pkg.search_params.age[0]}-${pkg.search_params.age.slice(-1)[0]}` ===
          `${value.split(',')[0]}-${value.split(',')[value.split(',').length - 1]}`,
      );
      setPackagesData(filteredData);
    } else {
      setPackagesData(allPackagesData);
    }
  };

  const handleSelectAdult = (value: string) => {
    setSelectedAdultOption(value);
    if (value !== 'all') {
      const filteredData = allPackagesData.filter(
        (pkg) => pkg.search_params.adult.toString() === value,
      );
      setPackagesData(filteredData);
    } else {
      setPackagesData(allPackagesData);
    }
  };

  const handleSelectChild = (value: string) => {
    setSelectedChildOption(value);
    if (value !== 'all') {
      const filteredData = allPackagesData.filter(
        (pkg) => pkg.search_params.children.toString() === value,
      );
      setPackagesData(filteredData);
    } else {
      setPackagesData(allPackagesData);
    }
  };

  const handleUnassign = (channel: any) => {
    setSelectedUnassignChannel(channel);
    toggleAssignModal(false);
  };

  const toggleAssignModal = (isAssign: boolean = true) => {
    if (isAssign) setIsAssignModal(!isAssignModal);
    else setIsUnassignModal(!isUnassignModal);
  };

  const goToPlanListPage = () => {
    router.push(path.split('/').slice(0, -2).join('/'));
  };

  const goToUploadPage = (document: string) => {
    router.push(`${path}/upload/${document}`);
  };

  return (
    <Box className="mx-auto">
      <Box className="overflow-x-auto sm:scrollable bg-white flex items-center justify-between mb-5 py-5 px-7">
        <Box>
          {getBreadcrumbs(breadcrumbsArray)}
          <Box as="p" className="font-bold text-lg">
            {pageName}
          </Box>
        </Box>
        <Box
          onClick={goToPlanListPage}
          className="flex items-center justify-between cursor-pointer"
        >
          <ChevronLeft color="red" width="30" height="15" />
          <Box as="p" className="text-sm text-red-500">
            Back
          </Box>
        </Box>
      </Box>
      <Box className="pb-5 px-7">
        <Box className="p-5 bg-white rounded-md shadow">
          <Box className="mb-3">
            <Box as="p" className="mb-2 text-sm font-medium">
              Product
            </Box>
            <Select
              chevronColor={primary}
              placeholderSelectClassName="truncate"
              additionalClassNameSelect="pl-4 h-[46px]"
              value={selectedProduct}
              onChange={(value) => setSelectedProduct(value.toString())}
              options={productList}
            />
          </Box>
          <Box className="mb-3">
            <Box as="p" className="mb-2 text-sm font-medium">
              Plan Name
            </Box>
            <Input
              key={selectedProduct}
              value={planName}
              onChange={(value) => setPlanName(value.toString())}
              onClear={() => setPlanName('')}
              placeholder="Type plan name"
            />
          </Box>
          <Box className="mb-3">
            <Box as="p" className="mb-2 text-sm font-medium">
              Slug
            </Box>
            <Input
              key={selectedProduct}
              value={planSlug}
              onChange={(value) => setPlanSlug(value.toString())}
              onClear={() => setPlanSlug('')}
              placeholder="Type slug"
            />
          </Box>
          <Box>
            <Button
              disabled={!selectedProduct || !planName || !planSlug}
              onClick={updateGeneralDataPlan}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
      <Box className="pb-5 px-7">
        {isMobileView ? (
          <Select
            additionalClassNameSelect="pl-4 shadow mb-3 h-[46px]"
            withBorder={false}
            value={tab}
            onChange={(event) => setTab(event.toString())}
            options={tabList}
          />
        ) : (
          <Box className="flex items-center justify-start h-16 bg-white rounded-md mb-3 shadow">
            {tabList.map((tl, tlIndex) => (
              <Box
                key={`tab-${tl.value}`}
                onClick={() => setTab(tl.value)}
                style={{ width: `calc(100% / ${tabList.length})` }}
                className={`cursor-pointer h-full flex items-center justify-center ${tlIndex !== tabList.length - 1 && 'mr-5'} ${tab === tl.value && 'border-b-[3px] border-primary'}`}
              >
                <Box
                  as="p"
                  className={`text-sm mr-3 ${tab === tl.value && 'font-semibold text-primary'}`}
                >
                  {tl.label}
                </Box>
              </Box>
            ))}
          </Box>
        )}
        {tab === 'packages' && (
          <Box className="relative bg-white rounded-md shadow-md p-5">
            <Box className="flex items-center justify-end mb-4">
              <Button onClick={() => goToUploadPage('packages')} withIcon={true}>
                {AddIcon('#FFF')}
                <Box as="span" className="ml-1 text-white">
                  Upload
                </Box>
              </Button>
            </Box>
            <Box className="flex items-center justify-between mb-4">
              <Box className="w-full mr-2.5">
                {productCategory === 'personal-accident' ? (
                  <Select
                    chevronColor={primary}
                    placeholderSelectClassName="truncate"
                    additionalClassNameSelect="pl-4 h-[46px]"
                    value={selectedOccupationOption}
                    onChange={(value) => handleSelectOccupationClass(value.toString())}
                    options={occupationOptions}
                  />
                ) : (
                  <Select
                    chevronColor={primary}
                    placeholderSelectClassName="truncate"
                    additionalClassNameSelect="pl-4 h-[46px]"
                    value={selectedAdultOption}
                    onChange={(value) => handleSelectAdult(value.toString())}
                    options={adultsOptions}
                  />
                )}
              </Box>
              <Box className="w-full ml-2.5">
                {productCategory === 'personal-accident' ? (
                  <Select
                    chevronColor={primary}
                    placeholderSelectClassName="truncate"
                    additionalClassNameSelect="pl-4 h-[46px]"
                    value={selectedAgeOption}
                    onChange={(value) => handleSelectAge(value.toString())}
                    options={ageOptions}
                  />
                ) : (
                  <Select
                    chevronColor={primary}
                    placeholderSelectClassName="truncate"
                    additionalClassNameSelect="pl-4 h-[46px]"
                    value={selectedChildOption}
                    onChange={(value) => handleSelectChild(value.toString())}
                    options={childOptions}
                  />
                )}
              </Box>
            </Box>
            {packagesData && packagesData.length > 0 ? (
              <Box className="overflow-x-auto sm:scrollable">
                <Box as="table" className="min-w-full divide-y divide-gray-200 table-auto">
                  <Box as="thead" className="bg-primary">
                    <Box as="tr">
                      <Box
                        as="th"
                        className="w-1/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        No.
                      </Box>
                      {productCategory === 'personal-accident' ? (
                        <>
                          <Box
                            as="th"
                            className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                          >
                            Occupation Class
                          </Box>
                          <Box
                            as="th"
                            className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                          >
                            Ages
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box
                            as="th"
                            className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                          >
                            Type
                          </Box>
                          <Box
                            as="th"
                            className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                          >
                            Origin
                          </Box>
                          <Box
                            as="th"
                            className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                          >
                            Duration
                          </Box>
                          <Box
                            as="th"
                            className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                          >
                            Adult Participant
                          </Box>
                          <Box
                            as="th"
                            className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                          >
                            Children Participant
                          </Box>
                        </>
                      )}
                      <Box
                        as="th"
                        className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        Currency
                      </Box>
                      <Box
                        as="th"
                        className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        Premium
                      </Box>
                    </Box>
                  </Box>
                  <Box as="tbody" className="bg-white divide-y divide-gray-200">
                    {packagesData.map((p, pIndex) => (
                      <Box as="tr" key={`package-${pIndex}`} className="hover:bg-gray-50">
                        <Box
                          as="td"
                          className="w-1/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                        >
                          {pIndex + 1}
                        </Box>
                        {productCategory === 'personal-accident' ? (
                          <>
                            <Box
                              as="td"
                              className="px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                            >
                              {p.search_params?.occupation_class?.join(',') || '-'}
                            </Box>
                            <Box
                              as="td"
                              className="px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                            >{`${p.search_params.age[0]}-${p.search_params.age.slice(-1)[0]}`}</Box>
                          </>
                        ) : (
                          <>
                            <Box
                              as="td"
                              className="px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                            >
                              {p.search_params?.trip || '-'}
                            </Box>
                            <Box
                              as="td"
                              className="px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                            >
                              {p.search_params?.origin || '-'}
                            </Box>
                            <Box
                              as="td"
                              className="px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                            >
                              {p.search_params?.duration_to
                                ? `${p.search_params?.duration_to} days`
                                : '-'}
                            </Box>
                            <Box
                              as="td"
                              className="px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                            >
                              {p.search_params?.adult || '-'}
                            </Box>
                            <Box
                              as="td"
                              className="px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                            >
                              {p.search_params?.children || '-'}
                            </Box>
                          </>
                        )}
                        <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {p.currency || '-'}
                        </Box>
                        <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {p.premium || '-'}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box className="flex items-center justify-center bg-white pt-10 pb-20">
                <NotFound
                  width={isMobileView && '143'}
                  height={isMobileView && '144'}
                  size1={isMobileView && '143'}
                  size3={isMobileView && '95'}
                  viewBox={isMobileView && '-17 -5 87 70'}
                  text="No package data available"
                  textClassName={isMobileView && 'text-xs'}
                />
              </Box>
            )}
          </Box>
        )}
        {tab === 'benefits' && (
          <Box className="relative bg-white rounded-md shadow-md p-5">
            <Box className="flex items-center justify-end mb-4">
              <Button onClick={() => goToUploadPage('benefits')} withIcon={true}>
                {AddIcon('#FFF')}
                <Box as="span" className="ml-1 text-white">
                  Upload
                </Box>
              </Button>
            </Box>
            {benefitsData && benefitsData.length > 0 ? (
              <Box className="overflow-x-auto sm:scrollable">
                <Box as="table" className="min-w-full divide-y divide-gray-200 table-auto">
                  <Box as="thead" className="bg-primary">
                    <Box as="tr">
                      <Box
                        as="th"
                        className="w-1/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        No.
                      </Box>
                      <Box
                        as="th"
                        className="w-8/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        Benefit
                      </Box>
                      <Box
                        as="th"
                        className="w-1/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        Currency
                      </Box>
                      <Box
                        as="th"
                        className="w-2/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        Value
                      </Box>
                    </Box>
                  </Box>
                  <Box as="tbody" className="bg-white divide-y divide-gray-200">
                    {benefitsData.map((b, bIndex) => (
                      <Box as="tr" key={`benefit-${bIndex}`} className="hover:bg-gray-50">
                        <Box
                          as="td"
                          className="w-1/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                        >
                          {bIndex + 1}
                        </Box>
                        <Box
                          as="td"
                          className="w-8/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                        >
                          {b.name || b.benefits?.description_en || '-'}
                        </Box>
                        <Box
                          as="td"
                          className="w-1/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                        >
                          {b.currency || '-'}
                        </Box>
                        <Box
                          as="td"
                          className="w-2/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                        >
                          {b.value || b.html || '-'}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box className="flex items-center justify-center bg-white pt-10 pb-20">
                <NotFound
                  width={isMobileView && '143'}
                  height={isMobileView && '144'}
                  size1={isMobileView && '143'}
                  size3={isMobileView && '95'}
                  viewBox={isMobileView && '-17 -5 87 70'}
                  text="No benefit data available"
                  textClassName={isMobileView && 'text-xs'}
                />
              </Box>
            )}
          </Box>
        )}
        {tab === 'details' && (
          <Box className="relative bg-white rounded-md shadow-md p-5">
            <Box className="flex items-center justify-end mb-4">
              <Button onClick={() => goToUploadPage('details')} withIcon={true}>
                {AddIcon('#FFF')}
                <Box as="span" className="ml-1 text-white">
                  Upload
                </Box>
              </Button>
            </Box>
            <Box className="flex items-center justify-end mb-4">
              <Select
                chevronColor={primary}
                placeholderSelectClassName="truncate"
                additionalClassNameSelect="pl-4 h-[46px]"
                value={selectedDetailOption}
                onChange={(value) => setSelectedDetailOption(value.toString())}
                options={detailOptions}
              />
            </Box>
            {detailsData && detailsData.length > 0 ? (
              <Box className="overflow-x-auto sm:scrollable">
                <Box as="table" className="min-w-full divide-y divide-gray-200 table-auto">
                  <Box as="thead" className="bg-primary">
                    <Box as="tr">
                      <Box
                        as="th"
                        className="w-1/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        No.
                      </Box>
                      <Box
                        as="th"
                        className="w-11/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        Detail
                      </Box>
                    </Box>
                  </Box>
                  <Box as="tbody" className="bg-white divide-y divide-gray-200">
                    {detailsData.map((d, dIndex) => (
                      <Box as="tr" key={`detail-${dIndex}`} className="hover:bg-gray-50">
                        <Box
                          as="td"
                          className="w-1/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                        >
                          {dIndex + 1}
                        </Box>
                        <Box
                          as="td"
                          className="w-11/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                        >
                          {d.detail || '-'}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box className="flex items-center justify-center bg-white pt-10 pb-20">
                <NotFound
                  width={isMobileView && '143'}
                  height={isMobileView && '144'}
                  size1={isMobileView && '143'}
                  size3={isMobileView && '95'}
                  viewBox={isMobileView && '-17 -5 87 70'}
                  text="No detail data available"
                  textClassName={isMobileView && 'text-xs'}
                />
              </Box>
            )}
          </Box>
        )}
        {tab === 'channels' && (
          <Box className="relative bg-white rounded-md shadow-md p-5">
            <Box className="flex items-center justify-end mb-4">
              <Button onClick={toggleAssignModal} withIcon={true}>
                Assign Plan
              </Button>
            </Box>
            {channelsData && channelsData.length > 0 ? (
              <Box className="overflow-x-auto sm:scrollable">
                <Box as="table" className="min-w-full divide-y divide-gray-200 table-auto">
                  <Box as="thead" className="bg-primary">
                    <Box as="tr">
                      <Box
                        as="th"
                        className="w-1/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        No.
                      </Box>
                      <Box
                        as="th"
                        className="w-10/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        Channel Name
                      </Box>
                      <Box
                        as="th"
                        className="w-1/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        Action
                      </Box>
                    </Box>
                  </Box>
                  <Box as="tbody" className="bg-white divide-y divide-gray-200">
                    {channelsData.map((c, cIndex) => (
                      <Box as="tr" key={`channel-${cIndex}`} className="hover:bg-gray-50">
                        <Box
                          as="td"
                          className="w-1/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                        >
                          {cIndex + 1}
                        </Box>
                        <Box
                          as="td"
                          className="w-10/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                        >
                          {c.channel_name || '-'}
                        </Box>
                        <Box
                          as="td"
                          className="w-1/12 px-6 py-3 whitespace-nowrap text-sm font-medium"
                        >
                          <Box className="flex items-center">
                            <Box onClick={() => handleUnassign(c)} className="ml-3 clickable">
                              {TrashIcon(primaryRed, '16', '16', '0 0 24 24')}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box className="flex items-center justify-center bg-white pt-10 pb-20">
                <NotFound
                  width={isMobileView && '143'}
                  height={isMobileView && '144'}
                  size1={isMobileView && '143'}
                  size3={isMobileView && '95'}
                  viewBox={isMobileView && '-17 -5 87 70'}
                  text="No channel data available"
                  textClassName={isMobileView && 'text-xs'}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Modal
        widthClassName="w-full lg:w-[500px]"
        heightClassName="h-[40%] overflow-y-auto sm:scrollable"
        isOpen={isAssignModal}
        onClose={toggleAssignModal}
      >
        <Box className="py-5">
          <Box as="h1" className="font-bold text-lg text-center mb-3">
            Assign Plan
          </Box>
          <Box>
            <Select
              chevronColor={primary}
              placeholderSelectClassName="truncate"
              additionalClassNameSelect="pl-4 h-[46px]"
              value={selectedAssignOption}
              onChange={(value) => setSelectedAssignOption(value.toString())}
              options={assignOptions}
            />
          </Box>
          <Box className="flex items-center justify-center text-center mt-10">
            <Button variant="danger" additionalClassName="mr-2" onClick={toggleAssignModal}>
              <Box as="span" className="mx-3.5">
                Cancel
              </Box>
            </Button>
            <Button variant="warning" disabled={!selectedAssignOption} onClick={doAssign}>
              <Box as="span" className={`mx-3 ${!selectedAssignOption && 'text-white'}`}>
                Assign
              </Box>
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        widthClassName="w-full lg:w-[500px]"
        heightClassName="max-h-[70%] overflow-y-auto sm:scrollable lg:max-h-fit"
        isOpen={isUnassignModal}
        onClose={() => toggleAssignModal(false)}
      >
        <Box className="py-5">
          <Box className="flex items-center justify-center mb-3">
            {AlertCircleIcon(undefined, '70', '70', '0 0 24 24')}
          </Box>
          <Box as="h1" className="font-bold text-lg text-center mb-2">
            Are you sure?
          </Box>
          <Box as="p" className="text-center text-sm">
            Unassign {selectedUnassignChannel.channel_name}.
          </Box>
          <Box className="flex items-center justify-center text-center mt-4">
            <Button
              variant="danger"
              additionalClassName="mr-2"
              onClick={() => toggleAssignModal(false)}
            >
              <Box as="span" className="mx-3.5">
                No
              </Box>
            </Button>
            <Button variant="warning" onClick={doUnassign}>
              <Box as="span" className="mx-3">
                Yes
              </Box>
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
