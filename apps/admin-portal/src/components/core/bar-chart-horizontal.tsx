'use client';

import { Box } from '@repo/ui';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { numberSimpleFormatter } from '@/lib/formatter';

type ChartDatum = Record<string, string | number | null | undefined>;

interface TooltipPayloadEntry {
  value?: number | string;
  payload: ChartDatum;
}

interface HorizontalBarChartProps {
  data: ChartDatum[];
  categoryDataKey?: string;
  valueDataKey?: string;
  tooltipLabelKey?: string;
  seriesLabel?: string;
  barColor?: string;
  lineColor?: string;
  barSize?: number;
  lineStrokeWidth?: number;
  valueFormatter?: (value: number | string) => string;
  tickFormatter?: (value: number) => string | number;
  labelFormatter?: (value: number | string) => string | number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  tooltipLabelKey: string;
  seriesLabel: string;
  valueFormatter?: (value: number | string) => string;
}

const chartMargin = { top: 20, right: 20, left: 0, bottom: 20 };

const defaultTickFormatter = (value: number) => numberSimpleFormatter(value);

const defaultLabelFormatter = (value: number | string) =>
  numberSimpleFormatter(Number(value) || 0);

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
      <Box as="p" className="mb-2 text-xs">
        <Box as="strong">{label !== undefined ? String(label) : '-'}</Box>
      </Box>
      <Box as="p" className="text-xs">
        {seriesLabel}: <Box as="strong">{formatTooltipValue(entry.value, valueFormatter)}</Box>
      </Box>
    </Box>
  );
};

export default function HorizontalBarChart({
  data,
  categoryDataKey = 'status',
  valueDataKey = 'count',
  tooltipLabelKey = categoryDataKey,
  seriesLabel = 'Value',
  barColor = '#006de5',
  lineColor = '#e83f3f94',
  barSize = 35,
  lineStrokeWidth = 2,
  valueFormatter,
  tickFormatter = defaultTickFormatter,
  labelFormatter = defaultLabelFormatter,
}: HorizontalBarChartProps) {
  return (
    <Box className="flex h-full w-full items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart layout="horizontal" data={data} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={categoryDataKey} type="category" tick={{ fontSize: 12 }} textAnchor="end" />
          <YAxis
            type="number"
            tickFormatter={(value: number) => String(tickFormatter(value))}
            tick={{ fontSize: 10 }}
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
              fill="white"
              fontSize={8}
              formatter={labelFormatter}
            />
          </Bar>
          <Line
            type="monotone"
            dataKey={valueDataKey}
            stroke={lineColor}
            strokeWidth={lineStrokeWidth}
            name={seriesLabel}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
