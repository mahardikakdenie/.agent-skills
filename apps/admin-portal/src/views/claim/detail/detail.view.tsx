import moment from 'moment';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'react-feather';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import ImageOrDefault from '@/components/image-or-default';
import Modal from '@/components/modal';
import NotFound from '@/components/not-found';
import Select from '@/components/select';
import { primary } from '@/constants/app-common.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import {
  forLabelString,
  getBreadcrumbs,
  getHeaderPage,
  moneyFormatter,
  toastNotification,
} from '@/helpers/app.helper';
import { claimsService } from '@/services/claims/api/claims.service';
import { Claim, ClaimHistory } from '@/types/claim';

export const ClaimDetailView = () => {
  const [tab, setTab] = useState('Summary');
  const [claimCurrency, setClaimCurrency] = useState<string | undefined>();
  const [identityCardLink, setIdentityCardLink] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [docToOpen, setDocToOpen] = useState<any>(null);
  const [isForceCannotViewDocument, setIsForceCannotViewDocument] = useState(false);
  const [isForceCannotViewDocumentFields, setIsForceCannotViewDocumentFields] = useState<boolean[]>(
    [],
  );
  const [isViewDocument, setIsViewDocument] = useState(false);
  const [isIdentityCardPdf, setIsIdentityCardPdf] = useState(false);
  const [data, setData] = useState<Claim>();
  const [histories, setHistories] = useState<ClaimHistory[]>();
  const [documents, setDocuments] = useState<any[]>([]);
  const path = usePathname();
  const router = useRouter();
  const { id } = useParams();
  const { isMobileView, setLoading } = useScreen();
  const { handleResponseError } = useAuth();
  const { pageName, breadcrumbsArray } = getHeaderPage(3, path, false);
  const personalInfo = [
    data?.personal_info?.address,
    data?.personal_info?.address2,
    data?.personal_info?.subdistrict,
    data?.personal_info?.district,
    data?.personal_info?.city,
    data?.personal_info?.state,
  ];

  useEffect(() => {
    const fetchClaimDetail = async () => {
      try {
        setLoading(true);
        const responseClaimHistories: any = await claimsService.getClaimHistories({
          claim: `${id}`,
          limit: 100,
          page: 1,
        });
        if (responseClaimHistories) setHistories(responseClaimHistories.data);
        if (!id) return;
        const responseClaim: any = await claimsService.getClaimById(id.toString());
        const forClaimCurrency: string | undefined = responseClaim?.policy_data?.declarations
          ?.transaction_data?.insurance?.currency
          ? responseClaim?.policy_data?.declarations?.transaction_data?.insurance?.currency
          : undefined;
        const identityCardParticipant: string =
          responseClaim?.participant_data?.data?.ktp ||
          responseClaim?.participant_data?.data?.passport ||
          '';
        const identityCardParticipantArray = !!identityCardParticipant
          ? identityCardParticipant?.split('.')
          : null;
        const claimAmountParticipant: any = responseClaim.claim.find(
          (d: any) => d.type === 'Number' && d.name === 'claim',
        );
        if (identityCardParticipant) setIdentityCardLink(identityCardParticipant);
        if (
          !!identityCardParticipantArray &&
          identityCardParticipantArray?.[identityCardParticipantArray.length - 1]?.toLowerCase() ===
            'pdf'
        ) {
          setIsIdentityCardPdf(true);
          processUrl(identityCardParticipant, 'pdfIdentityCardParticipant');
        }
        if (claimAmountParticipant)
          setClaimAmount(moneyFormatter(forClaimCurrency).format(claimAmountParticipant.value));
        if (responseClaim) {
          const filteredGeneral = responseClaim?.general?.length
            ? responseClaim?.general?.filter((item: any) => !!item.value || !!item.fields)
            : [];
          const filteredClaim = responseClaim?.claim?.length
            ? responseClaim?.claim?.filter((item: any) => !!item.value || !!item.fields)
            : [];
          const filteredClaimConfig = responseClaim?.claim_config?.length
            ? responseClaim?.claim_config?.filter((item: any) => !!item.value || !!item.fields)
            : [];

          setData(responseClaim);
          setClaimCurrency(forClaimCurrency);
          setDocuments([...filteredGeneral, ...filteredClaim, ...filteredClaimConfig]);
        }
      } catch (error: any) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaimDetail().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === 'Summary' && !!identityCardLink)
      processUrl(identityCardLink, 'pdfIdentityCardParticipant');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const processUrl = (url: string, id: string, setIsForce: boolean = false, index: number = 0) => {
    const urlArr = url?.split('.') || '';
    const mimeType =
      urlArr?.[urlArr.length - 1]?.toLowerCase() !== 'pdf'
        ? `image/${urlArr?.[urlArr.length - 1]?.toLowerCase()}`
        : 'application/pdf';
    fetch(url, {})
      .then((res) => res.blob())
      .then((blob) => {
        const file = new Blob([blob], { type: mimeType });
        let fileURL = URL.createObjectURL(file);
        let element = document.getElementById(id);
        // element?.setAttribute("src", fileURL)
        if (element) {
          if (element instanceof HTMLImageElement || element instanceof HTMLIFrameElement) {
            element.src = fileURL;
          } else {
            toastNotification('Element is not an image or iframe', 'error');
          }
        }
      })
      .catch((_err) => {
        if (setIsForce) {
          setIsForceCannotViewDocument(true);
        } else if (index >= 0 && index < isForceCannotViewDocumentFields.length) {
          let newArray = [...isForceCannotViewDocumentFields];
          newArray[index] = true;
          setIsForceCannotViewDocumentFields(newArray);
        }
      });
  };

  const viewDocument = (documentObject: any) => {
    if (documentObject?.type?.toLowerCase() === 'file' && documentObject?.value) {
      processUrl(documentObject.value, 'pdfFrame', true);
    } else if (documentObject?.type?.toLowerCase() === 'fields') {
      setIsForceCannotViewDocumentFields(documentObject?.fields?.map(() => false));
      for (let i = 0; i < documentObject.fields.length; i++) {
        const field = documentObject.fields[i];
        if (field?.type?.toLowerCase() === 'file') {
          const fieldValue = field?.value;
          processUrl(fieldValue, `pdfFrameField${i}`, false, i);
        }
      }
    } else if (documentObject?.type?.toLowerCase() === 'multiple file') {
      documentObject.value.forEach((item: any) => {
        processUrl(item, 'pdfFrame', true);
      });
    }
    setDocToOpen(documentObject);
    setIsViewDocument(true);
  };

  const downloadDocument = (url: string) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.onload = function () {
      if (this.status === 200) {
        const blob = new Blob([this.response], { type: 'image' });
        const downloadUrl = URL.createObjectURL(blob);
        const fileNameMatch = url.split('/');
        const fileName =
          fileNameMatch.length > 0 ? fileNameMatch[fileNameMatch.length - 1] : 'claim.png';
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        a.style.display = 'none';

        document.body.appendChild(a);

        const evt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        a.dispatchEvent(evt);

        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(downloadUrl);
        }, 100);
      }
    };

    xhr.onerror = function () {
      window.open(url, '_blank');
    };

    xhr.send();
  };

  const goToClaimListPage = () => {
    router.push(path?.split('/')?.slice(0, -2)?.join('/'));
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
          onClick={goToClaimListPage}
          className="flex items-center justify-between cursor-pointer"
        >
          <ChevronLeft color="red" width="30" height="15" />
          <Box as="p" className="text-sm text-red-500">
            Back
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
            options={[
              { label: 'Summary', value: 'Summary' },
              { label: 'Documents', value: 'Documents' },
            ]}
          />
        ) : (
          <Box className="flex items-center justify-start h-16 bg-white rounded-md mb-3 shadow">
            <Box
              onClick={() => setTab('Summary')}
              style={{ width: 'calc(100% / 2)' }}
              className={`cursor-pointer h-full flex items-center justify-center mr-5 ${tab === 'Summary' && 'border-b-[3px] border-primary'}`}
            >
              <Box
                as="p"
                className={`text-sm mr-3 ${tab === 'Summary' && 'font-semibold text-primary'}`}
              >
                Summary
              </Box>
            </Box>
            <Box
              onClick={() => setTab('Documents')}
              style={{ width: 'calc(100% / 2)' }}
              className={`cursor-pointer h-full flex items-center justify-center ${tab === 'Documents' && 'border-b-[3px] border-primary'}`}
            >
              <Box
                as="p"
                className={`text-sm mr-3 ${tab === 'Documents' && 'font-semibold text-primary'}`}
              >
                Documents
              </Box>
            </Box>
          </Box>
        )}
        {tab === 'Summary' && (
          <Box className="lg:flex">
            <Box className="lg:w-1/3 bg-white rounded-md py-5 px-7 mb-3 lg:mb-0 lg:mr-3 h-fit max-h-full overflow-y-auto sm:scrollable shadow">
              <Box as="p" className="font-semibold mb-3">
                Status
              </Box>
              <Box className="max-h-[250px] overflow-y-auto sm:scrollable">
                {histories &&
                  histories?.length > 0 &&
                  histories.map(
                    (h, historyIndex) =>
                      h.status !== 'Draft' && (
                        <Box key={`history-${historyIndex}`} className="flex items-center">
                          <Box className="w-1/12">
                            <svg
                              width="10"
                              height="70"
                              className="min-w-[10px]"
                              viewBox="0 0 10 70"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <line
                                x1="4.5"
                                y1="2.18557e-08"
                                x2="4.5"
                                y2="70"
                                stroke={historyIndex !== 0 ? '#C4C4C4' : primary}
                                strokeDasharray="2 2"
                              />
                              <circle
                                cx="5"
                                cy="35"
                                r="5"
                                fill={historyIndex !== 0 ? '#C4C4C4' : primary}
                              />
                            </svg>
                          </Box>
                          <Box className="w-11/12">
                            <Box as="p" className="text-sm lg:text-base font-medium">
                              {h.status || '-'}
                            </Box>
                            <Box as="p" className="text-xs text-gray-400">
                              {moment(h.created_at).format('LLLL')}
                            </Box>
                            {!!h.note && (
                              <Box
                                as="p"
                                title={h?.note || '-'}
                                className={`${h?.status?.toLowerCase() !== 'approved' && 'text-red-500'} text-xs truncate`}
                              >
                                Note: {h?.note || '-'}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ),
                  )}
              </Box>
            </Box>
            <Box className="lg:w-2/3">
              <Box className="bg-white rounded-md mb-3 py-5 px-7 shadow">
                <Box as="p" className="font-semibold mb-3">
                  Detail
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Claim Number
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">{data?.number || '-'}</Box>
                  </Box>
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Customer Name
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">{data?.policy_data?.policy_holder?.name || '-'}</Box>
                  </Box>
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Plan Name
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">{data?.package?.plan?.name || '-'}</Box>
                  </Box>
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Benefit
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">{data?.benefit?.description_en || '-'}</Box>
                  </Box>
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Requested Amount
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">{claimAmount || '-'}</Box>
                  </Box>
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Approved Amount
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">
                      {moneyFormatter(claimCurrency).format(data?.amount_approved || 0)}
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box className="bg-white rounded-md mb-3 py-5 px-7 shadow">
                <Box as="p" className="font-semibold mb-3">
                  Policy Holder Information
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Customer Name
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">{data?.policy_data?.policy_holder?.name || '-'}</Box>
                  </Box>
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Phone Number
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">{data?.policy_data?.policy_holder?.phone || '-'}</Box>
                  </Box>
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Email
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">{data?.policy_data?.policy_holder?.email || '-'}</Box>
                  </Box>
                </Box>
              </Box>
              <Box className="bg-white rounded-md mb-3 py-5 px-7 shadow">
                <Box as="p" className="font-semibold mb-3">
                  Participants Information
                </Box>
                {data?.participant_data ? (
                  <Box className="flex flex-col lg:flex-row">
                    <Box className="lg:w-1/3 mb-3 lg:mr-2">
                      {isIdentityCardPdf ? (
                        <iframe
                          id="pdfIdentityCardParticipant"
                          src=""
                          style={{
                            border: 'none',
                            width: isMobileView ? '50%' : '100%',
                            height: '100%',
                          }}
                          title="passport-participant"
                        ></iframe>
                      ) : (
                        <ImageOrDefault
                          width={460}
                          height={300}
                          alt="identity-card-participant"
                          src={identityCardLink}
                          additionalClassNameP="py-14 px-3"
                        />
                      )}
                    </Box>
                    <Box className="w-full">
                      <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                          Policy Number
                        </Box>
                        <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                          <Box as="p" className="hidden lg:block lg:mr-2">
                            :
                          </Box>
                          <Box as="p">{data?.policy_data?.number || '-'}</Box>
                        </Box>
                      </Box>
                      <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                          Participant Number
                        </Box>
                        <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                          <Box as="p" className="hidden lg:block lg:mr-2">
                            :
                          </Box>
                          <Box as="p">{data?.participant_data?.data?.reg_no || '-'}</Box>
                        </Box>
                      </Box>
                      <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                          Full Name
                        </Box>
                        <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                          <Box as="p" className="hidden lg:block lg:mr-2">
                            :
                          </Box>
                          <Box as="p">{data?.participant_data?.data?.name || '-'}</Box>
                        </Box>
                      </Box>
                      <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                          Gender
                        </Box>
                        <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                          <Box as="p" className="hidden lg:block lg:mr-2">
                            :
                          </Box>
                          <Box as="p">{data?.participant_data?.data?.gender || '-'}</Box>
                        </Box>
                      </Box>
                      <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                          Country Code
                        </Box>
                        <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                          <Box as="p" className="hidden lg:block lg:mr-2">
                            :
                          </Box>
                          <Box as="p">{data?.participant_data?.data?.country_code || '-'}</Box>
                        </Box>
                      </Box>
                      {!!data?.participant_data?.data?.nik ? (
                        <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                          <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                            Identity Number (NIK)
                          </Box>
                          <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                            <Box as="p" className="hidden lg:block lg:mr-2">
                              :
                            </Box>
                            <Box as="p">{data?.participant_data?.data?.nik || '-'}</Box>
                          </Box>
                        </Box>
                      ) : !!data?.participant_data?.data?.passport_no ? (
                        <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                          <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                            Passport Number
                          </Box>
                          <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                            <Box as="p" className="hidden lg:block lg:mr-2">
                              :
                            </Box>
                            <Box as="p">{data?.participant_data?.data?.passport_no || '-'}</Box>
                          </Box>
                        </Box>
                      ) : null}
                      <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                          Nationality
                        </Box>
                        <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                          <Box as="p" className="hidden lg:block lg:mr-2">
                            :
                          </Box>
                          <Box as="p">{data?.participant_data?.data?.nationality || '-'}</Box>
                        </Box>
                      </Box>
                      <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                          Birthdate
                        </Box>
                        <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                          <Box as="p" className="hidden lg:block lg:mr-2">
                            :
                          </Box>
                          <Box as="p">{data?.participant_data?.data?.dob || '-'}</Box>
                        </Box>
                      </Box>
                      <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                        <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                          Place of Birth
                        </Box>
                        <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                          <Box as="p" className="hidden lg:block lg:mr-2">
                            :
                          </Box>
                          <Box as="p">{data?.participant_data?.data?.pob || '-'}</Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box className="flex items-center justify-center bg-white rounded-md pb-10">
                    <NotFound
                      width={isMobileView && '143'}
                      height={isMobileView && '144'}
                      size1={isMobileView && '143'}
                      size3={isMobileView && '95'}
                      viewBox={isMobileView && '-15 -5 87 70'}
                      text="No participant data available"
                      textClassName={isMobileView && 'text-xs'}
                    />
                  </Box>
                )}
              </Box>
              <Box className="bg-white rounded-md mb-3 py-5 px-7 shadow">
                <Box as="p" className="font-semibold mb-3">
                  Personal Information
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Phone Number
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">{data?.personal_info?.phone || '-'}</Box>
                  </Box>
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Address
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">{personalInfo.filter(Boolean).join(' ') || '-'}</Box>
                  </Box>
                </Box>
              </Box>
              <Box className="bg-white rounded-md mb-3 py-5 px-7 shadow">
                <Box as="p" className="font-semibold mb-3">
                  Account Bank Information
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Account Name
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">{data?.bank_info?.account_name || '-'}</Box>
                  </Box>
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Bank
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">{data?.bank_info?.bank?.name || '-'}</Box>
                  </Box>
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Branch
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">{data?.bank_info?.branch || '-'}</Box>
                  </Box>
                </Box>
                <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                  <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                    Account Number
                  </Box>
                  <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                    <Box as="p" className="hidden lg:block lg:mr-2">
                      :
                    </Box>
                    <Box as="p">{data?.bank_info?.account_number || '-'}</Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        {tab === 'Documents' &&
          (documents.length > 0 ? (
            <Box className="relative bg-white rounded-md shadow-md">
              <Box className="overflow-x-auto sm:scrollable">
                <Box as="table" className="min-w-full divide-y divide-gray-200 table-auto">
                  <Box as="thead" className="bg-white">
                    <Box as="tr">
                      <Box
                        as="th"
                        className="w-1/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        No.
                      </Box>
                      <Box
                        as="th"
                        className="w-10/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Filename
                      </Box>
                      <Box
                        as="th"
                        className="w-1/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </Box>
                    </Box>
                  </Box>
                  <Box as="tbody" className="bg-white divide-y divide-gray-200">
                    {documents.map((doc, docIndex) => (
                      <Box as="tr" key={`document-${docIndex}`} className="hover:bg-gray-50">
                        <Box
                          as="td"
                          className="w-1/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                        >
                          {docIndex + 1}
                        </Box>
                        <Box
                          as="td"
                          className="w-10/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                        >
                          {forLabelString(doc)}
                        </Box>
                        <Box
                          as="td"
                          className="w-1/12 px-6 py-3 whitespace-nowrap text-sm font-medium"
                        >
                          <Button onClick={() => viewDocument(doc)}>View</Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box className="flex items-center justify-center bg-white rounded-md pt-10 pb-20 shadow">
              <NotFound
                width={isMobileView && '143'}
                height={isMobileView && '144'}
                size1={isMobileView && '143'}
                size3={isMobileView && '95'}
                viewBox={isMobileView && '-17 -5 87 70'}
                text="No document data available"
                textClassName={isMobileView && 'text-xs'}
              />
            </Box>
          ))}
        {isViewDocument && (
          <Modal
            widthClassName="w-fit max-w-full lg:max-w-[50%]"
            heightClassName="h-fit"
            isOpen={isViewDocument}
            onClose={() => setIsViewDocument(false)}
          >
            <Box className="py-4 px-6">
              <Box as="p" className="font-bold mb-3 text-center">
                {forLabelString(docToOpen)}
              </Box>
              {docToOpen?.type?.toLowerCase() === 'fields' ? (
                <Box className="max-h-[calc(70vh)] overflow-y-auto sm:scrollable">
                  {docToOpen?.fields?.map((f: any, fIndex: number) => (
                    <Box key={`field-${fIndex}`} className={`${fIndex > 0 && 'mt-3'}`}>
                      <Box as="p" className="font-medium mb-3">
                        {forLabelString(f)}
                      </Box>
                      {f?.type?.toLowerCase() === 'file' ? (
                        <Box>
                          {f?.value?.split('.').at(-1) === 'pdf' ? (
                            <Box
                              key={`field-${fIndex}-${isForceCannotViewDocumentFields[fIndex]}`}
                              className={`${!isForceCannotViewDocumentFields[fIndex] && 'w-[calc(90vh)] h-[calc(50vh)]'}`}
                            >
                              {isForceCannotViewDocumentFields[fIndex] ? (
                                <Box
                                  as="p"
                                  className="text-center text-gray-400 font-semibold text-sm border border-gray-300 rounded-md py-14 px-3 lg:py-[135px]"
                                >
                                  The document cannot be previewed, please download if you want to
                                  see it.
                                </Box>
                              ) : (
                                <iframe
                                  id={`pdfFrameField${fIndex}`}
                                  src=""
                                  title={forLabelString(f)}
                                  style={{
                                    border: 'none',
                                    width: isMobileView ? '50%' : '100%',
                                    height: '100%',
                                  }}
                                ></iframe>
                              )}
                            </Box>
                          ) : (
                            <Box className="lg:w-[460px] lg:h-[300px] overflow-auto sm:scrollable">
                              <ImageOrDefault
                                width={460}
                                height={300}
                                alt={forLabelString(f)}
                                src={f.value}
                                additionalClassNameP="py-14 px-3 lg:py-[135px]"
                                layout="responsive"
                              />
                            </Box>
                          )}
                          <Box className="w-full flex items-center justify-center mt-3">
                            <Button disabled={!f?.value} onClick={() => downloadDocument(f.value)}>
                              Download
                            </Button>
                          </Box>
                        </Box>
                      ) : f?.type?.toLowerCase() === 'number' ? (
                        <Box as="p">
                          {moneyFormatter(claimCurrency).format(!!f?.value ? f.value : 0)}
                        </Box>
                      ) : f?.type?.toLowerCase() === 'datetime' ? (
                        <Box as="p">{!!f?.value ? moment(f?.value).format('LLLL') : '-'}</Box>
                      ) : (
                        <Box as="p">{f?.value || '-'}</Box>
                      )}
                    </Box>
                  ))}
                </Box>
              ) : docToOpen?.type?.toLowerCase() === 'file' ? (
                <Box>
                  {docToOpen?.value?.split('.').at(-1) === 'pdf' ? (
                    <Box
                      key={`doc-${isForceCannotViewDocument}`}
                      className={`${!isForceCannotViewDocument && 'w-[calc(90vh)] h-[calc(50vh)]'}`}
                    >
                      {isForceCannotViewDocument ? (
                        <Box
                          as="p"
                          className="text-center text-gray-400 font-semibold text-sm border border-gray-300 rounded-md py-14 px-3 lg:py-[135px]"
                        >
                          The document cannot be previewed, please download if you want to see it.
                        </Box>
                      ) : (
                        <iframe
                          id="pdfFrame"
                          src=""
                          title={forLabelString(docToOpen)}
                          style={{
                            border: 'none',
                            width: isMobileView ? '50%' : '100%',
                            height: '100%',
                          }}
                        ></iframe>
                      )}
                    </Box>
                  ) : (
                    <Box className="lg:w-[460px] lg:h-[300px] overflow-auto sm:scrollable">
                      <ImageOrDefault
                        width={460}
                        height={300}
                        alt={forLabelString(docToOpen)}
                        src={docToOpen.value}
                        additionalClassNameP="py-14 px-3 lg:py-[135px]"
                        layout="responsive"
                      />
                    </Box>
                  )}
                  <Box className="w-full flex items-center justify-center mt-3">
                    <Button
                      disabled={!docToOpen?.value}
                      onClick={() => downloadDocument(docToOpen.value)}
                    >
                      Download
                    </Button>
                  </Box>
                </Box>
              ) : docToOpen?.type?.toLowerCase() === 'multiple file' ? (
                <Box className="lg:w-[460px] lg:h-[300px] overflow-auto sm:scrollable">
                  {docToOpen?.value.map((f: string, fIndex: number) => (
                    <Box key={fIndex}>
                      <ImageOrDefault
                        width={460}
                        height={300}
                        alt={forLabelString(docToOpen)}
                        src={f}
                        additionalClassNameP="py-14 px-3 lg:py-[135px]"
                        layout="responsive"
                      />
                    </Box>
                  ))}
                </Box>
              ) : docToOpen?.type?.toLowerCase() === 'number' ? (
                <Box as="p">
                  {moneyFormatter(claimCurrency).format(!!docToOpen?.value ? docToOpen?.value : 0)}
                </Box>
              ) : docToOpen?.type?.toLowerCase() === 'datetime' ? (
                <Box as="p">
                  {!!docToOpen?.value ? moment(docToOpen?.value).format('LLLL') : '-'}
                </Box>
              ) : (
                <Box as="p">{docToOpen?.value || '-'}</Box>
              )}
            </Box>
          </Modal>
        )}
      </Box>
    </Box>
  );
};
