'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Edit2 } from 'react-feather';

import { Box, Button, Spinner } from '@repo/ui';

import AppURL from '@/constants/app-url.const';
import { channelService } from '@/services/channel/api/channel.service';
import { productService } from '@/services/product/api/product.service';
import { promotionService } from '@/services/promotion/api/promotion.service';

import type {
  EmbeddedDiscountChannel,
  EmbeddedDiscountInsurance,
  EmbeddedDiscountPlan,
  EmbeddedDiscountProduct,
  PromotionDetails,
} from '../../../dto/promotion.details.dto';

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box className="mb-6 w-full max-w-2xl rounded-lg border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
      <Box as="h2" className="mb-4 text-lg font-semibold text-slate-950">
        {title}
      </Box>
      {children}
    </Box>
  );
}

function DetailItem({
  label,
  value,
  children,
  valueClassName = '',
}: {
  label: string;
  value?: ReactNode;
  children?: ReactNode;
  valueClassName?: string;
}) {
  return (
    <Box className="grid grid-cols-[minmax(7.5rem,10rem)_0.5rem_minmax(0,1fr)] items-start gap-x-3 text-sm leading-6">
      <Box className="font-medium text-slate-600">{label}</Box>
      <Box className="text-slate-400">:</Box>
      <Box className={`min-w-0 break-words text-slate-900 ${valueClassName}`}>
        {children ?? value ?? '-'}
      </Box>
    </Box>
  );
}

function EmptyText({ children }: { children: ReactNode }) {
  return <Box className="text-sm text-slate-500">{children}</Box>;
}

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value));

const getStringValue = (value: unknown) => (typeof value === 'string' ? value : '');

const normalizeResponseItem = (response: unknown): UnknownRecord | null => {
  let item: unknown = response;

  if (Array.isArray(item)) {
    item = item[0];
  } else if (isRecord(item)) {
    const data = item.data;

    if (Array.isArray(data)) {
      item = data[0];
    } else if (isRecord(data)) {
      item = Array.isArray(data.data) ? data.data[0] : data;
    }
  }

  if (!isRecord(item)) {
    return null;
  }

  return item;
};

const getNestedName = (item: UnknownRecord, key: string) => {
  const nestedValue = item[key];
  return isRecord(nestedValue) ? getStringValue(nestedValue.name) : '';
};

const getRelationName = (item: UnknownRecord | null, primaryNameKey: string) => {
  if (!item) {
    return '';
  }

  return (
    getStringValue(item[primaryNameKey]) ||
    getStringValue(item.name) ||
    getNestedName(item, 'channel') ||
    getNestedName(item, 'insurance') ||
    getNestedName(item, 'product') ||
    getNestedName(item, 'plan')
  );
};

const buildRelationNameMap = (
  relations: UnknownRecord[],
  idKey: string,
  nameKey: string,
  responses: unknown[],
) => {
  const entries: [string, string][] = [];

  relations.forEach((relation, index) => {
    const relationId = getStringValue(relation[idKey]);
    const responseItem = normalizeResponseItem(responses[index]);
    const responseName = getRelationName(responseItem, 'name');
    const relationName = getRelationName(relation, nameKey) || responseName;

    if (relationId && relationName) {
      entries.push([relationId, relationName]);
    }

    if (!responseItem || !responseName) {
      return;
    }

    Array.from(new Set(['id', idKey])).forEach((aliasKey) => {
      const aliasId = getStringValue(responseItem[aliasKey]);
      if (aliasId) {
        entries.push([aliasId, responseName]);
      }
    });
  });

  return new Map(entries);
};

const normalizeCampaignDetail = (response: unknown): PromotionDetails | null => {
  const item = normalizeResponseItem(response);
  return item ? (item as unknown as PromotionDetails) : null;
};

type VoucherDetail = {
  code: string;
  usage_limit: number;
  used_count: number;
};

const normalizeVoucherResponse = (response: unknown): VoucherDetail[] => {
  if (Array.isArray(response)) {
    return response as VoucherDetail[];
  }

  if (!isRecord(response)) {
    return [];
  }

  const data = response.data;

  if (Array.isArray(data)) {
    return data as VoucherDetail[];
  }

  if (isRecord(data) && Array.isArray(data.data)) {
    return data.data as VoucherDetail[];
  }

  return [];
};

export default function ViewPromotionDetails() {
  const [promotion, setPromotion] = useState<PromotionDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [channelNames, setChannelNames] = useState<Map<string, string>>(new Map());
  const [insuranceNames, setInsuranceNames] = useState<Map<string, string>>(new Map());
  const [productNames, setProductNames] = useState<Map<string, string>>(new Map());
  const [planNames, setPlanNames] = useState<Map<string, string>>(new Map());
  const [vouchers, setVouchers] = useState<VoucherDetail[]>([]);

  const params = useParams();
  const idParam = params.id;
  const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : '';
  const router = useRouter();

  useEffect(() => {
    if (!id) return; // Exit if no ID is available

    const fetchPromotionDetails = async () => {
      try {
        const response = await promotionService.getCampaignById(id);
        const promotionData = normalizeCampaignDetail(response);
        setPromotion(promotionData);

        if (!promotionData) {
          return;
        }

        const fetchNames = async () => {
          const channels = promotionData.embedded_discount_channels ?? [];
          const insurances = promotionData.embedded_discount_insurances ?? [];
          const products = promotionData.embedded_discount_products ?? [];
          const plans = promotionData.embedded_discount_plans ?? [];

          const channelFetches = channels.map(async (channel: EmbeddedDiscountChannel) => {
            return channelService.getChannelByIdV1(channel.channel_id);
          });
          const insuranceFetches = insurances.map(async (insurance: EmbeddedDiscountInsurance) => {
            return productService.getInsuranceById(insurance.insurance_id);
          });
          const productFetches = products.map(async (product: EmbeddedDiscountProduct) => {
            return productService.getProductById(product.product_id);
          });
          const planFetches = plans.map(async (plan: EmbeddedDiscountPlan) => {
            return productService.getPlanById(plan.plan_id);
          });

          const [channelResponses, insuranceResponses, productResponses, planResponses] =
            await Promise.all([
              Promise.all(channelFetches),
              Promise.all(insuranceFetches),
              Promise.all(productFetches),
              Promise.all(planFetches),
            ]);

          setChannelNames(
            buildRelationNameMap(
              channels as unknown as UnknownRecord[],
              'channel_id',
              'channel_name',
              channelResponses,
            ),
          );
          setInsuranceNames(
            buildRelationNameMap(
              insurances as unknown as UnknownRecord[],
              'insurance_id',
              'insurance_name',
              insuranceResponses,
            ),
          );
          setProductNames(
            buildRelationNameMap(
              products as unknown as UnknownRecord[],
              'product_id',
              'product_name',
              productResponses,
            ),
          );
          setPlanNames(
            buildRelationNameMap(
              plans as unknown as UnknownRecord[],
              'plan_id',
              'name',
              planResponses,
            ),
          );
        };

        await fetchNames();

        if (promotionData.type === 'voucher') {
          const vouchersResponse = await promotionService.getVoucherById(promotionData.campaign_id);
          setVouchers(normalizeVoucherResponse(vouchersResponse));
        }
      } catch (err) {
        setError('Failed to fetch promotion details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionDetails();
  }, [id]);

  const handleEditCampaign = (id: string) => {
    router.push(`${AppURL.promotionCampaignEdit}/${id}`);
  };

  const formatDate = (date: string) => {
    if (!date) return '-';

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
  };

  const formatPromotionValue = () => {
    if (promotion?.value_type === 'percentage') {
      return `${promotion.value}%`;
    }

    return `${promotion?.value_currency ?? ''} ${Number(
      promotion?.value ?? 0,
    ).toLocaleString()}`.trim();
  };

  if (loading) {
    return (
      <Box className="flex min-h-[60vh] items-center justify-center">
        <Spinner
          inline
          className="[&_[data-slot=spinner-icon]]:size-10 [&_[data-slot=spinner-icon]]:text-blue-500"
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="container mx-auto p-6">
        <Box className="w-full max-w-2xl rounded-lg border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </Box>
      </Box>
    );
  }

  if (!promotion) {
    return (
      <Box className="container mx-auto p-6">
        <Box className="w-full max-w-2xl rounded-lg border border-slate-100 bg-white p-6 text-sm font-medium text-slate-600 shadow-sm">
          No promotion details available.
        </Box>
      </Box>
    );
  }

  const channels = promotion.embedded_discount_channels ?? [];
  const insurances = promotion.embedded_discount_insurances ?? [];
  const products = promotion.embedded_discount_products ?? [];
  const plans = promotion.embedded_discount_plans ?? [];

  return (
    <Box className="container mx-auto p-4 md:p-6">
      <SectionCard title="Promotion Details">
        <Box className="grid gap-3">
          <DetailItem label="Name" value={promotion.name} />
          <DetailItem label="Promotion Type" value={promotion.type} />
          <DetailItem label="Start Date" value={formatDate(promotion.start_date)} />
          <DetailItem label="End Date" value={formatDate(promotion.end_date)} />
          <DetailItem label="Value" value={formatPromotionValue()} valueClassName="tabular-nums" />
          <DetailItem label="Status">
            <Box
              as="span"
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                promotion.active
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                  : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
              }`}
            >
              {promotion.active ? 'Active' : 'Inactive'}
            </Box>
          </DetailItem>
          <DetailItem label="Minimum Amount" value={promotion.minimum_amount} />
          <DetailItem label="Maximum Amount" value={promotion.maximum_amount} />
        </Box>
      </SectionCard>

      <SectionCard title="Associated Details">
        <Box className="grid grid-cols-1 gap-5">
          <Box>
            <Box as="p" className="mb-2 text-sm font-semibold text-slate-800">
              Channels
            </Box>
            <Box className="grid gap-1.5">
              {channels.length > 0 ? (
                channels.map((channel: { channel_id: string }) => (
                  <Box
                    as="p"
                    key={channel.channel_id}
                    className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-900"
                  >
                    {channelNames.get(channel.channel_id) || 'Unknown'}
                  </Box>
                ))
              ) : (
                <EmptyText>No channels</EmptyText>
              )}
            </Box>
          </Box>
          <Box>
            <Box as="p" className="mb-2 text-sm font-semibold text-slate-800">
              Insurances
            </Box>
            <Box className="grid gap-1.5">
              {insurances.length > 0 ? (
                insurances.map((insurance: { insurance_id: string }) => (
                  <Box
                    as="p"
                    key={insurance.insurance_id}
                    className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-900"
                  >
                    {insuranceNames.get(insurance.insurance_id) || 'Unknown'}
                  </Box>
                ))
              ) : (
                <EmptyText>No insurances</EmptyText>
              )}
            </Box>
          </Box>
          <Box>
            <Box as="p" className="mb-2 text-sm font-semibold text-slate-800">
              Products
            </Box>
            <Box className="grid gap-1.5">
              {products.length > 0 ? (
                products.map((product: { product_id: string }) => (
                  <Box
                    as="p"
                    key={product.product_id}
                    className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-900"
                  >
                    {productNames.get(product.product_id) || 'Unknown'}
                  </Box>
                ))
              ) : (
                <EmptyText>No products</EmptyText>
              )}
            </Box>
          </Box>
          <Box>
            <Box as="p" className="mb-2 text-sm font-semibold text-slate-800">
              Plans
            </Box>
            <Box className="grid gap-1.5">
              {plans.length > 0 ? (
                plans.map((plan: { plan_id: string }) => (
                  <Box
                    as="p"
                    key={plan.plan_id}
                    className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-900"
                  >
                    {planNames.get(plan.plan_id) || 'Unknown'}
                  </Box>
                ))
              ) : (
                <EmptyText>No plans</EmptyText>
              )}
            </Box>
          </Box>
        </Box>
      </SectionCard>

      {promotion.type === 'voucher' && vouchers.length > 0 && (
        <SectionCard title="Voucher Details">
          <Box className="grid gap-3">
            {vouchers.map((voucher, index) => (
              <Box
                key={index}
                className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3"
              >
                <DetailItem label="Code" value={voucher.code} />
                <DetailItem
                  label="Usage Limit"
                  value={voucher.usage_limit}
                  valueClassName="tabular-nums"
                />
                <DetailItem
                  label="Used Count"
                  value={voucher.used_count}
                  valueClassName="tabular-nums"
                />
              </Box>
            ))}
          </Box>
        </SectionCard>
      )}

      <Box className="flex w-full max-w-2xl justify-center pt-1">
        <Button
          onClick={() => handleEditCampaign(promotion.campaign_id)}
          className="h-10 min-w-32 rounded-full bg-[#F5BA41] px-5 text-black shadow-none hover:bg-[#e6a92d]"
          leftIcon={<Edit2 className="h-4.5 w-4.5" />}
        >
          Edit
        </Button>
      </Box>
    </Box>
  );
}
