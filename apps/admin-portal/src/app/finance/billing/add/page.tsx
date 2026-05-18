'use client';

import noData from '@public/images/no-data.webp';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Select, Combobox, Button, Alert, Box, DataTable } from '@repo/ui';

import { PageHeader } from '@/components/page-header';
import { createBillingTransactionTableColumns } from '@/components/table-config/billing-transaction-table-config';
import AppURL from '@/constants/app-url.const';
import { generateYears, generateMonths } from '@/lib/utils';
import { financeService } from '@/services/finance/api/finance.service';

import { useBilling } from '../hook';

const CreateBillingPage = () => {
  const router = useRouter();

  const {
    channels,
    insurances,
    categories,
    transactions,
    isLoadingTransactions,
    fetchTransactions,
    createBilling,
    checkDuplicateBilling,
  } = useBilling();

  const [type, setType] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  const [billingNotExist, setBillingNotExist] = useState(true);
  const [existingBillingId, setExistingBillingId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingFees, setIsLoadingFees] = useState(false);

  const [feesMap, setFeesMap] = useState<any>({});

  const companies = type === 'insurer' ? insurances : channels;

  const months = useMemo(() => generateMonths(), []);
  const years = useMemo(() => generateYears(), []);

  const companyOptions = useMemo(() => {
    return companies.map((item: any) => ({
      value: item.id,
      label: item.name,
    }));
  }, [companies]);

  const categoryOptions = useMemo(() => {
    return categories.map((item: any) => ({
      value: item.id,
      label: item.name,
    }));
  }, [categories]);

  const monthOptions = useMemo(() => {
    return months.map((data) => ({
      value: data.value,
      label: data.name,
    }));
  }, [months]);

  const yearOptions = useMemo(() => {
    return years.map((y) => ({
      value: y,
      label: y,
    }));
  }, [years]);

  const typeOptions = [
    { value: 'partner', label: 'Partner' },
    { value: 'insurer', label: 'Insurer' },
  ];

  const breadcrumbs = [
    { label: 'Billing', href: AppURL.financeBilling },
    { label: 'Create Billing', isCurrentPage: true },
  ];

  const processedTransactions = useMemo(() => {
    return transactions.map((transaction: any) => {
      const premium = parseFloat(transaction.insurance.premium);
      const currency = transaction.insurance.currency;
      let newPremium = premium;

      if (currency !== 'IDR' && transaction.insurance.insurance.currencies) {
        const currencyData = transaction.insurance.insurance.currencies.find(
          (c: any) => c.currency_from === currency && c.currency_to === 'IDR',
        );
        newPremium = premium * (currencyData?.value ?? 1);
      }

      const insuranceId = transaction.insurance?.insurance?.id?.id;
      const productId = transaction.insurance?.product?.id;
      const planId = transaction.insurance?.plan?.id;

      const feeKey =
        type === 'partner'
          ? `${company}-${insuranceId}-${productId}-${planId}`
          : `${insuranceId}-${productId}-${planId}`;

      return {
        ...transaction,
        newPremium,
        currency,
        feeKey,
        insuranceId,
        productId,
        planId,
      };
    });
  }, [transactions, type, company]);

  useEffect(() => {
    if (!processedTransactions.length || !type) return;

    const fetchAllFees = async () => {
      setIsLoadingFees(true);
      const newFeesMap: any = {};

      try {
        const uniqueFeeKeys = new Set<string>();
        const feeRequests: Array<{
          key: string;
          insuranceId: string;
          productId: string;
          planId: string;
        }> = [];

        processedTransactions.forEach((transaction: any) => {
          if (!uniqueFeeKeys.has(transaction.feeKey)) {
            uniqueFeeKeys.add(transaction.feeKey);
            feeRequests.push({
              key: transaction.feeKey,
              insuranceId: transaction.insuranceId,
              productId: transaction.productId,
              planId: transaction.planId,
            });
          }
        });

        const feePromises = feeRequests.map(async (req) => {
          try {
            if (type === 'partner') {
              const feesResponse: any = await financeService.getChannelFeesFilter({
                channelId: company,
                insuranceId: req.insuranceId,
              });

              if (feesResponse && feesResponse.data.length > 0) {
                return {
                  key: req.key,
                  fee: {
                    channel: company,
                    insurance: feesResponse.data[0].insurance,
                    fee: feesResponse.data[0].fee,
                    fee_type: feesResponse.data[0].fee_type,
                  },
                };
              }
            } else if (type === 'insurer') {
              const feesResponse: any = await financeService.getBrokerFeesFilter({
                insuranceId: req.insuranceId,
                productId: req.productId,
                planId: req.planId,
              });

              if (feesResponse && feesResponse.data.length > 0) {
                return {
                  key: req.key,
                  fee: {
                    insurance: feesResponse.data[0].insurance,
                    fee: feesResponse.data[0].fee,
                    fee_type: feesResponse.data[0].fee_type,
                  },
                };
              }
            }

            return {
              key: req.key,
              fee: { insurance: '', fee: 0, fee_type: '' },
            };
          } catch (error) {
            console.error(`Error fetching fee for ${req.key}:`, error);
            return {
              key: req.key,
              fee: { insurance: '', fee: 0, fee_type: '' },
            };
          }
        });

        const results = await Promise.all(feePromises);

        results.forEach((result) => {
          if (result) {
            newFeesMap[result.key] = result.fee;
          }
        });

        setFeesMap(newFeesMap);
      } catch (error) {
        console.error('Error fetching fees:', error);
      } finally {
        setIsLoadingFees(false);
      }
    };

    fetchAllFees();
  }, [processedTransactions, type, company]);

  const handleGetTransaction = async () => {
    if (!month || !year || !company || !type || !category) {
      alert('Please fill all fields');
      return;
    }

    try {
      const billing = await checkDuplicateBilling(
        type,
        company,
        `${year}-${month.padStart(2, '0')}`,
      );

      if (billing.data.length) {
        setBillingNotExist(false);
        setExistingBillingId(billing.data[0].id);
        return;
      }

      setBillingNotExist(true);
      setExistingBillingId('');

      await fetchTransactions({
        type,
        company,
        category,
        from: `${year}-${month.padStart(2, '0')}-01`,
        to: `${year}-${month.padStart(2, '0')}-31`,
        page: 1,
        limit: 100000000,
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCreateBilling = async () => {
    if (!processedTransactions.length) {
      alert('No transaction to create billing');
      return;
    }

    setIsSubmitting(true);

    try {
      const detail = processedTransactions.map((transaction: any) => {
        const feePercentage = feesMap[transaction.feeKey]?.fee ?? 0;
        const commission = (feePercentage / 100) * transaction.newPremium;

        return {
          transaction: transaction.id,
          invoice_no: transaction.invoice ?? '',
          transaction_no: transaction.invoice ?? '',
          product: transaction.insurance.product.id,
          plan: transaction.insurance.plan.id,
          amount: transaction.newPremium,
          commission_percentage: feePercentage,
          commission_amount: commission,
          details: {
            plan_name: transaction.insurance.plan.name,
            product_name: transaction.insurance.product.name,
            transaction_date: transaction.created_at,
            insurance_name: transaction.insurance?.insurance?.id?.name,
          },
          category: category !== 'All' ? category : null,
        };
      });

      const totalCommission = detail.reduce((sum, item) => sum + item.commission_amount, 0);

      await createBilling({
        currency: 'IDR',
        billing_details: detail,
        status: 'pending-reconcilliation',
        amount: totalCommission,
        type,
        company,
        company_name: companyName,
        transaction_period: `${year}-${month.padStart(2, '0')}`,
        category: category !== 'All' ? category : null,
      });

      router.push(`${AppURL.financeBilling}?type=${type}&channel=${company}`);
    } catch (error) {
      console.error(error);
      alert('Failed to create billing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = createBillingTransactionTableColumns({
    type,
    fees: feesMap,
    company,
    page: 1,
    rowsPerPage: 100000000,
  });

  return (
    <Box className="flex flex-col w-full">
      <PageHeader
        title="Create Billing"
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        onBackClick={() => router.push(AppURL.financeBilling)}
      >
        <Button
          onClick={handleCreateBilling}
          disabled={!processedTransactions.length || isSubmitting || isLoadingFees}
          className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto"
          leftIcon={isSubmitting ? undefined : <CheckIcon className="w-5 h-5" />}
        >
          {isSubmitting ? 'Creating...' : 'Create Billing'}
        </Button>
      </PageHeader>

      <Box className="m-5 md:m-6 pt-5 md:px-6 p-4 bg-white rounded-lg shadow-sm border border-slate-100">
        <Box className="space-y-6">
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Box>
              <Select
                label="Choose Type"
                size="lg"
                value={type}
                options={typeOptions}
                placeholder="Choose Type"
                onValueChange={(value) => {
                  setType(value || '');
                  setCompany('');
                  setCompanyName('');
                  setCategory('');
                  setFeesMap({});
                }}
              />
            </Box>

            <Box>
              <Combobox
                id="company"
                label={type === 'insurer' ? 'Choose Insurance Company' : 'Choose Partner'}
                size="lg"
                value={company}
                disabled={!type}
                onValueChange={(value) => {
                  const selectedCompany = companies.find((item) => item.id === value);
                  setCompany(value || '');
                  setCompanyName(selectedCompany?.name || '');
                  setCategory('');
                  setFeesMap({});
                }}
                options={companyOptions}
                placeholder="Choose Company"
                className="bg-transparent border-slate-300"
              />
            </Box>

            <Box>
              <Combobox
                id="category"
                label="Choose Category"
                size="lg"
                value={category}
                disabled={!company}
                onValueChange={(value) => setCategory(value || '')}
                options={categoryOptions}
                placeholder="Choose Category"
                className="bg-transparent border-slate-300"
              />
            </Box>

            <Box>
              <Select
                label="Choose Month"
                size="lg"
                value={month}
                options={monthOptions}
                placeholder="Choose Month"
                onValueChange={(value) => setMonth(value || '')}
              />
            </Box>

            <Box>
              <Select
                label="Choose Year"
                size="lg"
                value={year}
                options={yearOptions}
                placeholder="Choose Year"
                onValueChange={(value) => setYear(value || '')}
              />
            </Box>

            <Box className="flex items-end">
              <Button
                disabled={!type || !company || !category || !month || !year}
                onClick={handleGetTransaction}
                className="h-11 rounded-full bg-[#016DA1] text-white hover:bg-[#015a85] px-8 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100 transition-all shadow-sm"
              >
                Get Transactions
              </Button>
            </Box>
          </Box>

          {isLoadingFees && (
            <Alert>
              Loading fee information for {processedTransactions.length} transactions...
            </Alert>
          )}

          {!billingNotExist && (
            <Alert variant="destructive">
              Billing already exists.{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-white underline font-medium"
                onClick={() =>
                  router.push(
                    `${AppURL.financeBillingDetail}/${existingBillingId}?channel=${company}&type=${type}`,
                  )
                }
              >
                Click here to view detail
              </Button>
            </Alert>
          )}
        </Box>
      </Box>

      <Box className="mx-5 md:mx-6 mb-8 p-4 md:p-6 bg-white rounded-lg shadow-sm border border-slate-100">
        <DataTable
          data={processedTransactions}
          columns={columns}
          loading={isLoadingTransactions || isLoadingFees}
          className="table-claims"
          emptyState={
            <Box className="sticky left-0 flex min-h-[12rem] w-[100cqw] items-center justify-center py-6 md:min-h-[14rem] md:py-8">
              <Box className="flex flex-col items-center justify-center gap-4 text-center max-w-md">
                <Image alt="No transaction data" src={noData} width={140} className="opacity-80" />
                <Box className="space-y-1">
                  <Box as="p" className="text-lg font-semibold text-slate-800">
                    No transactions available
                  </Box>
                  <Box as="p" className="text-sm text-slate-500">
                    Please select filters above and click 'Get Transactions' to see results here.
                  </Box>
                </Box>
              </Box>
            </Box>
          }
          tableOptions={{
            getRowId: (row, index) => row?.id || `billing-transaction-row-${index}`,
          }}
        />
      </Box>
    </Box>
  );
};

export default CreateBillingPage;
