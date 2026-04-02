'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Box } from '@repo/ui';

type ChartDatum = Record<string, string | number | null | undefined>;

interface TooltipPayloadEntry {
  value?: number | string;
  payload: ChartDatum;
}

interface VerticalBarChartProps {
  data: ChartDatum[];
  categoryDataKey?: string;
  valueDataKey?: string;
  tooltipLabelKey?: string;
  seriesLabel?: string;
  barColor?: string;
  barSize?: number;
  yAxisWidth?: number;
  xAxisTickFontSize?: number;
  yAxisTickFontSize?: number;
  labelFontSize?: number;
  labelFill?: string;
  className?: string;
  filterZeroValues?: boolean;
  sortValues?: boolean;
  valueFormatter?: (value: number | string) => string;
  labelFormatter?: (value: number | string) => string | number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  tooltipLabelKey: string;
  seriesLabel: string;
  valueFormatter?: (value: number | string) => string;
}

const chartMargin = { top: 20, right: 0, left: -40, bottom: 0 };

const getNumericValue = (value: ChartDatum[string]) =>
  typeof value === 'number' ? value : Number(value ?? 0);

const formatTooltipValue = (
  value: number | string | undefined,
  formatter?: (value: number | string) => string,
) => {
  if (value === undefined) {
    return '-';
  }

  return formatter ? formatter(value) : String(value);
};

const CustomTooltip = ({
  active,
  payload,
  tooltipLabelKey,
  seriesLabel,
  valueFormatter,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  const entry = payload[0];
  const label = entry.payload?.[tooltipLabelKey];

  return (
    <Box className="rounded-md border bg-white p-4 text-xs text-gray-700 shadow-md">
      <Box as="p" className="text-xs font-semibold">
        {label !== undefined ? String(label) : '-'}
      </Box>
      <Box as="p" className="mt-2 text-xs">
        {seriesLabel}: <Box as="strong">{formatTooltipValue(entry.value, valueFormatter)}</Box>
      </Box>
    </Box>
  );
};

export default function VerticalBarChart({
  data,
  categoryDataKey = 'status',
  valueDataKey = 'count',
  tooltipLabelKey = categoryDataKey,
  seriesLabel = 'Value',
  barColor = '#006de5',
  barSize = 30,
  yAxisWidth = 155,
  xAxisTickFontSize = 12,
  yAxisTickFontSize = 10,
  labelFontSize = 12,
  labelFill = 'white',
  className,
  filterZeroValues = true,
  sortValues = true,
  valueFormatter,
  labelFormatter,
}: VerticalBarChartProps) {
  const normalizedData = [...data]
    .filter((item) => (filterZeroValues ? getNumericValue(item[valueDataKey]) > 0 : true))
    .sort((firstItem, secondItem) => {
      if (!sortValues) {
        return 0;
      }

      return getNumericValue(secondItem[valueDataKey]) - getNumericValue(firstItem[valueDataKey]);
    });

  return (
    <Box className={className ?? 'flex h-full w-full items-center justify-center'}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={normalizedData} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fontSize: xAxisTickFontSize }} />
          <YAxis
            dataKey={categoryDataKey}
            type="category"
            tick={{ fontSize: yAxisTickFontSize }}
            width={yAxisWidth}
          />
          <Tooltip
            content={
              <CustomTooltip
                tooltipLabelKey={tooltipLabelKey}
                seriesLabel={seriesLabel}
                valueFormatter={valueFormatter}
              />
            }
          />
          <Legend formatter={() => seriesLabel} wrapperStyle={{ fontSize: '10px' }} />
          <Bar dataKey={valueDataKey} fill={barColor} barSize={barSize} name={seriesLabel}>
            <LabelList
              dataKey={valueDataKey}
              position="center"
              fill={labelFill}
              fontSize={labelFontSize}
              formatter={(value: number | string) =>
                labelFormatter ? labelFormatter(value) : formatTooltipValue(value, valueFormatter)
              }
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
