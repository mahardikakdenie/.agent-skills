'use client';

import noData from '@public/images/no-data.webp';
import { format } from 'date-fns';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { AlertCircle, Check, Download, Plus, Trash2, Upload, X } from 'react-feather';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@repo/ui';
import { Box, Button, DataTable, DateRangePicker, Input } from '@repo/ui';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui';

import {
  createClaimsTableColumns,
  createDocumentTableColumns,
} from '@/components/tableConfig/claimTableConfig';
import { DataTable as LegacyDataTable } from '@/components/ui/DataTable';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import { DebouncedSearchInput } from '@/components/ui/debounced-search-input';
import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';
import useClaims from '@/hooks/useClaims.hooks';
import { ClaimItem } from '@/interface';
import { formatDate, formatMoneyClaim } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import { claimsService } from '@/services/claims/api/claims.service';
import { useUpdateClaimStatus } from '@/services/claims/hooks/mutations';
import { useClaimConfigurations } from '@/services/claims/hooks/queries';

const formatCompactCount = (value: number) => new Intl.NumberFormat('id-ID').format(value);

let claimMeasureContext: CanvasRenderingContext2D | null = null;

const CLAIM_STATUS_VALUES = [
  'Submitted',
  'Acknowledged',
  'Document Review Operator',
  'Reupload Document Review Operator',
  'Lack of Documents Operator',
  'Document Review Insurance',
  'Reupload Document Review Insurance',
  'Lack of Documents Insurance',
  'Claim Assessment',
  'Approved',
  'Rejected',
  'Paid',
  'Closed',
] as const;

const LONGEST_CLAIM_STATUS_LABEL = 'Reupload Document Review Insurance';

const measureTextWidth = (label: string, font: string, fallbackCharWidth: number) => {
  if (typeof document === 'undefined') {
    return label.length * fallbackCharWidth;
  }

  if (!claimMeasureContext) {
    claimMeasureContext = document.createElement('canvas').getContext('2d');
  }

  if (!claimMeasureContext) {
    return label.length * fallbackCharWidth;
  }

  claimMeasureContext.font = font;

  return claimMeasureContext.measureText(label).width;
};

const getRequestedClaimAmount = (claim: ClaimItem) => {
  const claimValue = claim.claim?.find(
    (item) => item.type === 'Number' && item.name === 'claim',
  )?.value;
  const numericValue = Number(claimValue);

  return Number.isNaN(numericValue) ? null : numericValue;
};

const getClaimStatusTone = (status: string) => {
  switch (status) {
    case 'Submitted':
      return 'border border-amber-200/80 bg-amber-50 text-amber-700 data-[state=open]:border-amber-200/80 focus-visible:border-amber-200/80';
    case 'Acknowledged':
    case 'Document Review Operator':
    case 'Reupload Document Review Operator':
    case 'Document Review Insurance':
    case 'Reupload Document Review Insurance':
    case 'Claim Assessment':
      return 'border border-sky-200/80 bg-sky-50 text-sky-700 data-[state=open]:border-sky-200/80 focus-visible:border-sky-200/80';
    case 'Approved':
    case 'Paid':
      return 'border border-emerald-200/80 bg-emerald-50 text-emerald-700 data-[state=open]:border-emerald-200/80 focus-visible:border-emerald-200/80';
    case 'Lack of Documents Operator':
    case 'Lack of Documents Insurance':
    case 'Rejected':
      return 'border border-rose-200/80 bg-rose-50 text-rose-700 data-[state=open]:border-rose-200/80 focus-visible:border-rose-200/80';
    case 'Closed':
      return 'border border-slate-200/80 bg-slate-50 text-slate-500 data-[state=open]:border-slate-200/80 focus-visible:border-slate-200/80';
    default:
      return 'border border-slate-200/80 bg-slate-50 text-slate-600 data-[state=open]:border-slate-200/80 focus-visible:border-slate-200/80';
  }
};

const isClaimStatusOptionDisabled = (
  currentStatus: string,
  nextStatus: string,
  openAllStatus: boolean,
) => {
  if (currentStatus === 'Closed') {
    return true;
  }

  if (openAllStatus) {
    return false;
  }

  switch (nextStatus) {
    case 'Submitted':
      return currentStatus !== 'Draft';
    case 'Acknowledged':
      return currentStatus !== 'Submitted';
    case 'Document Review Operator':
      return currentStatus !== 'Acknowledged' && currentStatus !== 'Lack of Documents Operator';
    case 'Reupload Document Review Operator':
      return currentStatus !== 'Lack of Documents Operator';
    case 'Lack of Documents Operator':
      return (
        currentStatus !== 'Document Review Operator' &&
        currentStatus !== 'Reupload Document Review Operator'
      );
    case 'Document Review Insurance':
      return (
        currentStatus !== 'Document Review Operator' &&
        currentStatus !== 'Lack of Documents Insurance'
      );
    case 'Reupload Document Review Insurance':
      return currentStatus !== 'Lack of Documents Insurance';
    case 'Lack of Documents Insurance':
      return (
        currentStatus !== 'Document Review Insurance' &&
        currentStatus !== 'Reupload Document Review Insurance'
      );
    case 'Claim Assessment':
      return currentStatus !== 'Document Review' && currentStatus !== 'Document Review Insurance';
    case 'Approved':
    case 'Rejected':
      return currentStatus !== 'Claim Assessment';
    case 'Paid':
      return currentStatus !== 'Approved';
    case 'Closed':
      return currentStatus !== 'Paid' && currentStatus !== 'Rejected';
    default:
      return false;
  }
};

const ClaimsPage = () => {
  const path = usePathname();
  const {
    // Data
    filteredClaims,
    totalPages,
    totalData,
    channels,

    // States
    page,
    rowsPerPage,
    tab,
    date,
    searchSlaStatus,
    searchChannel,
    searchData,
    selectedChannel,

    // Loading
    isLoading,
    isFetching,

    // Methods
    refetch,
    setPage,
    setDate,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
    handleSearchSlaStatusChange,
    handleChannelChange,
  } = useClaims();
  const { data: claimConfigurations } = useClaimConfigurations();
  const { mutateAsync: updateClaimStatusMutation } = useUpdateClaimStatus();
  const router = useRouter();
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [amountApproved, setAmountApproved] = useState(0);
  const [reqAmountApproved, setReqAmountApproved] = useState(0);
  const [numberId, setNumberID] = useState('-');
  const [statusOld, setStatusOld] = useState('-');
  const [notes, setNotes] = useState('');
  const [amApprovedMsg, setAmApprovedMsg] = useState('');
  const [noteMsg, setNoteMsg] = useState('');
  const [docsMsg, setDocsMsg] = useState('');
  const [currencyApp, setCurrencyApp] = useState(' ');
  const [dataDocument, setDataDocument] = useState<any[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [finalSelectedDocuments, setFinalSelectedDocuments] = useState<any[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

  const [claimStatusOptions, setClaimStatusOptions] = useState<any[]>([]);
  const [openAllStatus, setOpenAllStatus] = useState<boolean>(false);
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes('Claim.Read');
      const editBtn = permissionList.includes('Claim.Update');
      const deleteBtn = permissionList.includes('Claim.Delete');
      const openAllStatus = permissionList.includes('Claim.AllowChangeAllStatus');

      setCanEdit(editBtn);
      setCanDelete(deleteBtn);
      setHasAccess(access);
      setOpenAllStatus(openAllStatus);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList]);

  const goToDetail = (claimId: string) => {
    router.push(`${path}/detail/${claimId}`);
  };

  const selectChannel = (id: string) => {
    claimsService.getClaimChannelForms(id).then((res: any) => {
      setDataDocument(res?.data || []);
    });
  };

  const selectCategory = (id: string, dataId: string) => {
    claimsService.getClaimCategoryForms(id).then((response: any) => {
      const label = filteredClaims?.filter((f: any) => f?.id === dataId)?.[0]?.claim_config;

      const updatedDataDocument = response?.data
        .filter(
          (doc: any) =>
            doc.type.toLowerCase() === 'file' || doc.type.toLowerCase() === 'file multiple',
        )
        .map((document: any) => ({
          ...document,
          label: {
            ...document.label,
            en: document.label?.en || document?.label_multilanguage?.en || document.label,
          },
        }));

      const updatedDataDocumentFields =
        response?.data
          ?.filter((doc: any) => doc?.type?.toLowerCase() === 'fields' && doc?.fields?.length > 0)
          .map((a: any) =>
            a?.fields?.filter(
              (doc: any) =>
                doc?.type?.toLowerCase() === 'file' || doc?.type?.toLowerCase() === 'file multiple',
            ),
          )
          ?.flat() || [];

      setDataDocument([...updatedDataDocument, ...updatedDataDocumentFields, ...label]);
    });
  };

  const handleSelectDocument = () => {
    if (selectedClaim) {
      if (selectedClaim.policy) {
        selectCategory(selectedClaim.category, selectedClaim.id);
      } else {
        selectChannel(selectedClaim.channel);
      }
    }
  };

  const handleChangeStatus = (data: any, newStatus: string) => {
    const claimId = data.id;
    setSelectedClaim(data);
    setSelectedClaimId(claimId);
    setPendingStatus(newStatus);
    setIsModalOpen(true);
    setNotes('');
    setNoteMsg('');

    const reqAmount = filteredClaims
      .map((item) => {
        const matchingClaim = item.claim.find(
          (d: any) => d.type === 'Number' && d.name === 'claim',
        );
        return item.id === claimId ? (matchingClaim ? matchingClaim.value : '-') : null;
      })
      .filter(Boolean);
    const numberId = filteredClaims
      .map((item) => {
        const matchingClaim = item.number;
        return item.id === claimId ? (matchingClaim ? matchingClaim : '-') : null;
      })
      .filter(Boolean);
    const statusOld = filteredClaims
      .map((item) => {
        const matchingClaim = item.status;
        return item.id === claimId ? (matchingClaim ? matchingClaim : '-') : null;
      })
      .filter(Boolean);
    const currencyApp = filteredClaims
      .map((item) => {
        const matchingClaim = item?.currency;
        return item.id === claimId ? (matchingClaim ? matchingClaim : '-') : null;
      })
      .filter(Boolean);

    setReqAmountApproved(reqAmount[0]);
    setNumberID(numberId[0]);
    setStatusOld(statusOld[0]);
    setCurrencyApp(currencyApp[0]);
    setFinalSelectedDocuments([]);
    setSelectedDocuments([]);
  };

  const updateStatus = (
    claimId: string,
    newStatus: string,
    amount_approved?: number,
    note?: string,
    lack_of_documents?: string[],
  ) => {
    updateClaimStatusMutation({
      id: claimId,
      payload: {
        status: newStatus,
        note,
        amount_approved,
        lack_of_documents,
      },
    })
      .then(() => {
        alert('Update status successfully.');
        refetch();
      })
      .catch((error) => {
        console.error('Error updating status:', error);
        alert('Failed to update status. Please try again.');
      });
  };

  const confirmModal = () => {
    if (selectedClaim.amount && selectedClaim.amount > 0) {
      if (amountApproved > reqAmountApproved) {
        setAmApprovedMsg('Your approval amount limit cannot exceed the requested amount');
        return;
      }
      if (amountApproved === 0 && pendingStatus === 'Approved') {
        setAmApprovedMsg('Approved Amount required!');
        return;
      }
    }

    if (
      (notes === '' && pendingStatus === 'Approved' && selectedChannel.name != 'drgadget') ||
      (notes === '' && pendingStatus === 'Rejected') ||
      (notes === '' && pendingStatus === 'Lack of Documents Operator') ||
      (notes === '' && pendingStatus === 'Lack of Documents Insurance')
    ) {
      setNoteMsg('Required!');
      return;
    }

    if (
      (finalSelectedDocuments.length < 1 && pendingStatus === 'Lack of Documents Operator') ||
      (finalSelectedDocuments.length < 1 && pendingStatus === 'Lack of Documents Insurance')
    ) {
      setDocsMsg('Required!');
      return;
    }

    if (selectedClaimId && pendingStatus) {
      updateStatus(
        selectedClaimId,
        pendingStatus,
        amountApproved,
        notes,
        finalSelectedDocuments.map((item) =>
          !!item.nameForUpdateStatus ? item.nameForUpdateStatus : item.name,
        ),
      );
      setIsModalOpen(false);
      setFinalSelectedDocuments([]);
    }
  };

  const cancelModal = () => {
    setIsModalOpen(false);
    setSelectedClaimId(null);
    setPendingStatus(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numericValue = input.replace(/[^0-9]/g, '');
    setAmountApproved(Number(numericValue));
    setAmApprovedMsg('');
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedDocuments((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((docId) => docId !== id)
        : [...prevSelected, id],
    );
  };

  const handleAddSelectedDocuments = () => {
    const selected = dataDocument.filter((doc) => selectedDocuments.includes(doc.name));
    const docListFields =
      dataDocument.length > 0
        ? dataDocument
            .filter((doc: any) => doc.type.toLowerCase() === 'fields' && doc.fields.length > 0)
            .map((a: any) =>
              a.fields.filter(
                (doc: any) =>
                  doc.type.toLowerCase() === 'file' || doc.type.toLowerCase() === 'file multiple',
              ),
            )
            .flat()
            .map((d: any) => ({
              ...d,
              nameForUpdateStatus: `${d?.name}-fields.${d?.name}` || '-',
            }))
        : [];
    const selectedFields = docListFields.filter((doc) => selectedDocuments.includes(doc.name));
    setFinalSelectedDocuments([...selected, ...selectedFields]);
  };

  const handleDeleteSelectedDocument = (id: string) => {
    setFinalSelectedDocuments((prev) => prev.filter((doc) => doc.name !== id));
    setSelectedDocuments((prev) => prev.filter((docId) => docId !== id));
  };

  const isDocumentSelected = (id: string) => selectedDocuments.includes(id);

  useEffect(() => {
    if (Array.isArray(claimConfigurations)) {
      const filteredStatus = claimConfigurations.filter((cs: any) => cs.status !== 'Draft');
      setClaimStatusOptions(filteredStatus);
    }
  }, [claimConfigurations]);

  const handleExport = () => {
    const exportData = {
      page,
      limit: rowsPerPage,
      status: tab === 'All' ? '' : tab,
      search: searchData,
      sla_status: searchSlaStatus === 'All' ? '' : searchSlaStatus,
      date_from: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
      date_to: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
      channel: searchChannel,
    };

    localStorage.setItem('exportClaimData', JSON.stringify(exportData));
    router.push(`${path}/export`);
  };

  const claimIdColumnSize = useMemo(
    () =>
      Math.min(
        240,
        Math.ceil(
          Math.max(
            measureTextWidth('CLM-20260211-00009', '400 12px Arial', 6.1),
            measureTextWidth('Claim ID', '500 14px Arial', 6.8),
            filteredClaims.reduce((widest, claim) => {
              const label = claim?.number || '-';

              return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
            }, 0),
          ) + 52,
        ),
      ),
    [filteredClaims],
  );
  const customerNameColumnSize = 164;
  const planNameColumnSize = 220;

  const currencyColumnSize = useMemo(
    () =>
      Math.min(
        120,
        Math.ceil(
          Math.max(
            measureTextWidth('Currency', '500 14px Arial', 7.2),
            filteredClaims.reduce((widest, claim) => {
              const label = claim?.currency || 'IDR';

              return Math.max(widest, measureTextWidth(label, '600 12px Arial', 6.2));
            }, 0),
          ) + 28,
        ),
      ),
    [filteredClaims],
  );

  const amountColumnSize = useMemo(
    () =>
      Math.min(
        240,
        Math.ceil(
          Math.max(
            measureTextWidth('Requested Amount', '500 14px Arial', 6.8),
            measureTextWidth('Approved Amount', '500 14px Arial', 6.8),
            filteredClaims.reduce((widest, claim) => {
              const requestedAmount = getRequestedClaimAmount(claim);
              const requestedLabel =
                requestedAmount !== null ? formatMoneyClaim(requestedAmount) : '-';
              const approvedLabel = formatMoneyClaim(claim.amount_approved ?? 0);

              return Math.max(
                widest,
                measureTextWidth(requestedLabel, '400 13px Arial', 6.6),
                measureTextWidth(approvedLabel, '400 13px Arial', 6.6),
              );
            }, 0),
          ) + 40,
        ),
      ),
    [filteredClaims],
  );

  const lastModifiedColumnSize = useMemo(
    () =>
      Math.min(
        180,
        Math.ceil(
          Math.max(
            measureTextWidth('Last Modified', '500 14px Arial', 6.8),
            filteredClaims.reduce((widest, claim) => {
              const label = claim.updated_at
                ? formatDate(claim.updated_at, 'DD/MM/YYYY, HH:mm')
                : '-';

              return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
            }, 0),
          ) + 24,
        ),
      ),
    [filteredClaims],
  );

  const statusColumnSize = useMemo(
    () =>
      Math.ceil(
        Math.max(
          measureTextWidth('Status', '500 14px Arial', 7.2),
          measureTextWidth(LONGEST_CLAIM_STATUS_LABEL, '600 10px Arial', 7.4),
          ...filteredClaims.map((claim) =>
            measureTextWidth(claim?.status || '-', '600 10px Arial', 7.4),
          ),
        ) + 72,
      ),
    [filteredClaims],
  );

  const actionColumnSize = useMemo(
    () =>
      Math.max(
        68,
        Math.ceil(
          Math.max(
            measureTextWidth('Action', '500 14px Arial', 6.8),
            measureTextWidth('View', '600 11px Arial', 5.9) + 18,
          ) + 12,
        ),
      ),
    [],
  );

  const renderStatusCell = (claim: ClaimItem) => (
    <Select
      value={claim.status}
      disabled={!canEdit}
      onValueChange={(value) => {
        if (value !== claim.status) {
          handleChangeStatus(claim, value);
        }
      }}
    >
      <SelectTrigger
        className={cn(
          'mx-auto h-7 min-h-7 w-fit min-w-0 max-w-full justify-start gap-0.5 rounded-full px-2.5 text-[10px] font-semibold shadow-none transition-colors focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 [&_[data-slot=select-value]]:min-w-0 [&_[data-slot=select-value]]:flex-none [&_[data-slot=select-value]]:text-left [&_[data-slot=select-icon]]:ml-0.5 [&_[data-slot=select-icon]]:shrink-0 [&_[data-slot=select-icon]]:text-current [&>svg]:h-3.5 [&>svg]:w-3.5',
          getClaimStatusTone(claim.status),
          !canEdit && 'cursor-default opacity-100',
        )}
      >
        <SelectValue
          placeholder="Select Status"
          className="line-clamp-none whitespace-nowrap text-inherit"
        />
      </SelectTrigger>
      <SelectContent className="max-h-60 w-max min-w-[max(var(--radix-select-trigger-width),14rem)] max-w-[min(calc(100vw-1rem),24rem)] overflow-auto">
        {CLAIM_STATUS_VALUES.map((status) => (
          <SelectItem
            key={status}
            value={status}
            disabled={isClaimStatusOptionDisabled(claim.status, status, openAllStatus)}
            className="[&_[data-slot=select-item-text]]:line-clamp-none [&_[data-slot=select-item-text]]:whitespace-nowrap"
          >
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const claimsTableColumns = createClaimsTableColumns({
    page,
    rowsPerPage,
    claimIdColumnSize,
    customerNameColumnSize,
    planNameColumnSize,
    currencyColumnSize,
    amountColumnSize,
    lastModifiedColumnSize,
    statusColumnSize,
    actionColumnSize,
    renderStatusCell,
    onViewDetail: goToDetail,
  });

  const documentTableColumns = createDocumentTableColumns({
    selectedDocuments,
    onCheckboxChange: handleCheckboxChange,
    onSelectDocument: handleSelectDocument,
    isDocumentSelected,
  });
  const formattedTotalData = formatCompactCount(Number(totalData) || 0);
  const isPaginationBusy = isLoading || isFetching;

  const getRowClassName = ({ row }: { row: { original: ClaimItem } }) => {
    return row.original.sla_status === 'Due Date'
      ? 'bg-[#FFFEE2]'
      : row.original.sla_status === 'Overdue'
        ? 'bg-[#fadede]'
        : undefined;
  };

  if (hasAccess === null) {
    return null;
  }

  return (
    <Box className="flex min-h-0 w-full flex-1 flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Claim List
        </Box>

        <Box className="flex w-full flex-col gap-2.5 xl:w-auto xl:items-end">
          <Box className="flex w-full flex-col gap-2.5 sm:grid sm:grid-cols-2 sm:gap-3 xl:w-auto xl:flex xl:flex-row xl:flex-nowrap xl:justify-end">
            <DateRangePicker
              value={date ?? null}
              changeBehavior="complete"
              onChange={(range) =>
                setDate(range?.from ? { from: range.from, to: range.to } : undefined)
              }
              clearable
              variant="outline"
              className="w-full sm:col-span-2 xl:w-[280px] xl:shrink-0"
            />

            <Box className="w-full xl:w-48 xl:shrink-0">
              <Select value={searchChannel || ''} onValueChange={handleChannelChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {channels.map((item, index) => (
                      <SelectItem key={index} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Box>

            <Box className="w-full xl:w-40 xl:shrink-0">
              <Select value={searchSlaStatus} onValueChange={handleSearchSlaStatusChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="SLA Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="All">All Priority</SelectItem>
                    <SelectItem value="On Track">On Track</SelectItem>
                    <SelectItem value="Due Date">Due Date</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Box>
          </Box>

          <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
            <Button
              onClick={() => router.push(`${path}/import`)}
              className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto xl:ml-0"
              leftIcon={<Upload className="w-5 h-5" />}
            >
              Import
            </Button>
            <Button
              onClick={() => router.push(`${path}/import-with-preview`)}
              className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
              leftIcon={<Upload className="w-5 h-5" />}
            >
              Import with Preview
            </Button>
            <Button
              onClick={handleExport}
              className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
              leftIcon={<Download className="w-5 h-5" />}
            >
              Export
            </Button>
          </Box>
        </Box>
      </Box>
      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogContent className="min-w-96 w-auto max-w-full">
            <Box as="p" className="text-center">
              <AlertCircle width={88} height={88} className="mx-auto text-[#F5AB1D]" />
            </Box>
            <Box as="p" className="text-center font-bold mb-0 text-sm">
              Are you sure?
            </Box>
            <Box className="flex flex-col gap-4">
              <Box as="p" className="text-center text-sm">
                Update <Box as="strong">{numberId}</Box> status <br />
                from <Box as="strong">{statusOld}</Box> to <Box as="strong">{pendingStatus}</Box>
              </Box>
              {pendingStatus === 'Approved' && (
                <>
                  {selectedClaim.amount && selectedClaim.amount > 0 ? (
                    <>
                      <Box>
                        <Box as="p" className="text-sm mb-2">
                          Requested Amount
                        </Box>
                        <Box className="relative">
                          <Box
                            as="span"
                            className="absolute left-0 top-0 h-full inline-flex items-center pl-4 text-sm"
                          >
                            {currencyApp}
                          </Box>
                          <Box className="bg-gray-50 text-sm h-12 w-full flex pl-12 items-center rounded-md border border-gray-200">
                            {formatMoneyClaim(reqAmountApproved)}
                          </Box>
                        </Box>
                      </Box>
                      <Box>
                        <Box as="p" className="text-sm mb-2">
                          Approved Amount{' '}
                          <Box as="span" className="!text-red-500">
                            *
                          </Box>
                        </Box>
                        <Box className="relative">
                          <Box
                            as="span"
                            className="absolute left-0 top-0 h-full inline-flex items-center pl-4 text-sm"
                          >
                            {currencyApp}
                          </Box>
                          <Input
                            type="text"
                            value={amountApproved === 0 ? '' : formatMoneyClaim(amountApproved)}
                            onChange={handleInputChange}
                            className="h-12 pl-12"
                            required
                          />
                        </Box>
                        <Box as="p" className="text-xs text-red-500 mt-2">
                          {amApprovedMsg}
                        </Box>
                      </Box>
                    </>
                  ) : (
                    ''
                  )}

                  {selectedChannel.name != 'drgadget' ? (
                    <Box
                      as="textarea"
                      name=""
                      id=""
                      rows={4}
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                      }}
                      className="w-full text-sm p-2 border border-gray-200 rounded-md"
                      placeholder="Insert Reason"
                    ></Box>
                  ) : (
                    ''
                  )}
                </>
              )}

              {pendingStatus === 'Rejected' && (
                <>
                  <Box className="w-full">
                    <Box as="p" className="text-sm mb-2">
                      Reason{' '}
                      <Box as="span" className="!text-red-500">
                        *
                      </Box>
                    </Box>
                    <Box
                      as="textarea"
                      name=""
                      id=""
                      rows={4}
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                        setNoteMsg('');
                      }}
                      className="w-full text-sm p-2 border border-gray-200 rounded-md"
                      placeholder="Insert Reason"
                      required
                    ></Box>
                    <Box as="p" className="text-xs text-red-500">
                      {noteMsg}
                    </Box>
                  </Box>
                </>
              )}

              {(pendingStatus === 'Lack of Documents Operator' ||
                pendingStatus === 'Lack of Documents Insurance') && (
                <>
                  <Box className="w-[600px]">
                    <Box as="p" className="text-sm mb-2">
                      Reason{' '}
                      <Box as="span" className="!text-red-500">
                        *
                      </Box>
                    </Box>
                    <Box
                      as="textarea"
                      name=""
                      id=""
                      rows={4}
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                        setNoteMsg('');
                      }}
                      className="w-full text-sm p-2 border border-gray-200 rounded-md"
                      placeholder="Insert detailed reason, e.g.: Harap upload berkas KTP, bukti foto mengalami kerugian, dan foto dokumen keterangan polisi"
                      required
                    ></Box>
                    <Box as="p" className="text-xs text-red-500">
                      {noteMsg}
                    </Box>
                  </Box>
                  <Box className="w-full">
                    <Box as="p" className="text-sm">
                      Lack of Document Reasons{' '}
                      <Box as="span" className="!text-red-500">
                        *
                      </Box>
                    </Box>
                    {finalSelectedDocuments.length > 0 && (
                      <Box as="ul" className="mt-3">
                        {finalSelectedDocuments.map((doc) => (
                          <Box
                            as="li"
                            key={doc.id}
                            className="flex justify-between items-center mb-2 gap-2"
                          >
                            <Input
                              name="lack_of_documents"
                              value={
                                doc?.label?.en || doc?.label_multilanguage?.en || doc?.label || '-'
                              }
                              className="bg-[#F8F8F8] py-3 px-4 w-full text-sm text-[#525252] rounded-md border-transparent"
                            />
                            <Button
                              disabled={!canDelete}
                              className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                              onClick={() => handleDeleteSelectedDocument(doc.name)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    )}
                    <Box as="p" className="text-xs text-red-500">
                      {docsMsg}
                    </Box>

                    <Dialog>
                      {filteredClaims.slice(0, 1).map((document) => (
                        <DialogTrigger asChild key={document.id}>
                          <Button
                            color="warning"
                            className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black w-auto mt-4"
                            onClick={() => handleSelectDocument()}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add Document
                          </Button>
                        </DialogTrigger>
                      ))}
                      <DialogContent className="p-0 w-[1000px] max-w-full overflow-hidden">
                        <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
                          <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                            Lack of Document Reasons
                            <DialogClose className="ml-auto">
                              <Button
                                type="button"
                                className="bg-transparent hover:bg-transparent text-black p-0"
                              >
                                <X className="w-5 h-5" />
                              </Button>
                            </DialogClose>
                          </DialogTitle>
                        </DialogHeader>

                        <Box className="p-4 h-full overflow-auto max-h-[70vh]">
                          <LegacyDataTable
                            data={dataDocument.filter(
                              (document) =>
                                document.type.toLowerCase() === 'file' ||
                                document.type.toLowerCase() === 'file multiple' ||
                                document.type.toLowerCase() === 'fields',
                            )}
                            columns={documentTableColumns}
                            noDataImage={noData}
                            noDataText="No document data available"
                            className="table-claims"
                          />
                        </Box>

                        <DialogFooter className="sm:justify-center justify-center pb-4 sm:pb-6">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                              onClick={handleAddSelectedDocuments}
                            >
                              <Check className="w-4 h-4 mr-2" /> Add selected document
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </Box>
                </>
              )}

              <Box className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={cancelModal}
                  className="border-[#E83F3F] text-[#E83F3F] rounded-full w-24"
                >
                  No
                </Button>
                <Button
                  color="warning"
                  onClick={confirmModal}
                  className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full w-24 text-black"
                >
                  Yes
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      <Box className="block rounded-xl bg-white">
        <Tabs
          value={tab}
          onValueChange={selectTab}
          variant="underline"
          className="w-full [&_[data-slot=tabs-list-shell]]:rounded-md"
        >
          <TabsList
            aria-label="Claim status tabs"
            className="w-full justify-start rounded-md border-0 bg-transparent p-0 text-inherit"
          >
            <TabsTrigger
              value="All"
              variant="underline"
              className="h-12 px-4 py-2.5 text-sm font-normal"
            >
              <Box as="span" className="mr-2.5">
                All Claim
              </Box>
              {tab === 'All' ? (
                <Box
                  as="span"
                  className={`inline-flex h-5 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-center text-[11px] leading-none text-white ${
                    formattedTotalData.length > 2 ? 'min-w-8' : ''
                  }`}
                >
                  {formattedTotalData}
                </Box>
              ) : null}
            </TabsTrigger>
            {claimStatusOptions.map((status, index) => (
              <TabsTrigger
                key={status.id || index}
                value={status.status}
                variant="underline"
                className="h-12 px-4 py-2.5 text-sm font-normal"
              >
                <Box as="span" className="mr-2.5">
                  {status.status}
                </Box>
                {tab === status.status ? (
                  <Box
                    as="span"
                    className={`inline-flex h-5 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-center text-[11px] leading-none text-white ${
                      formattedTotalData.length > 2 ? 'min-w-8' : ''
                    }`}
                  >
                    {formattedTotalData}
                  </Box>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Box>
      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isPaginationBusy}
        data={filteredClaims}
        columns={claimsTableColumns}
        defaultState={{
          columnPinning: {
            left: ['id', 'claimId'],
            right: ['status', 'action'],
          },
        }}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalData,
          onPageChange: (pageIndex) => {
            if (isPaginationBusy) {
              return;
            }

            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            if (isPaginationBusy) {
              return;
            }

            handleRowsPerPageChange({
              target: { value: String(pageSize) },
            } as ChangeEvent<HTMLSelectElement>);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No claim data" src={noData} width={128} />
              <Box as="span">No claim data available</Box>
            </Box>
          </Box>
        }
        renderToolbar={() => (
          <Box className="w-full">
            <DebouncedSearchInput
              value={searchData}
              placeholder="Search by Claim ID"
              ariaLabel="Search by Claim ID"
              onDebouncedChange={handleSearch}
              className="h-10 rounded-xl border-slate-300 bg-white text-slate-900 shadow-none transition-colors placeholder:text-slate-400 focus-within:ring-0 focus-within:shadow-none"
            />
          </Box>
        )}
        renderPagination={(table) => (
          <Box className="-mt-1">
            <CompactTablePagination
              table={table}
              pageSizeOptions={[10, 20, 30, 50, 100]}
              disabled={isPaginationBusy}
            />
          </Box>
        )}
        getRowClassName={getRowClassName}
        tableOptions={{
          manualPagination: true,
          enableColumnPinning: true,
          enableColumnResizing: true,
          defaultColumn: {
            minSize: 48,
            size: 96,
          },
          getRowId: (row, index) => row?.id || `claim-row-${index}`,
        }}
      />
    </Box>
  );
};

export default ClaimsPage;
