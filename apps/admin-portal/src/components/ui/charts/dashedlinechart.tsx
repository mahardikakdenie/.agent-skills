'use client';

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
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

interface DashedLineChartProps {
  data: ChartDatum[];
  xAxisDataKey?: string;
  valueDataKey?: string;
  tooltipLabelKey?: string;
  seriesLabel?: string;
  barColor?: string;
  lineColor?: string;
  lineStrokeWidth?: number;
  lineActiveDotRadius?: number;
  lineStrokeDasharray?: string;
  barSize?: number;
  valueFormatter?: (value: number | string) => string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  tooltipLabelKey: string;
  seriesLabel: string;
  valueFormatter?: (value: number | string) => string;
}

const chartMargin = { top: 5, right: 50, left: 0, bottom: 5 };

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

export default function DashedLineChart({
  data,
  xAxisDataKey = 'date',
  valueDataKey = 'count',
  tooltipLabelKey = xAxisDataKey,
  seriesLabel = 'Value',
  barColor = '#e83f3f94',
  lineColor = '#006de5',
  lineStrokeWidth = 2,
  lineActiveDotRadius = 8,
  lineStrokeDasharray = '5 5',
  barSize = 35,
  valueFormatter,
}: DashedLineChartProps) {
  return (
    <Box className="flex h-full w-full items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart width={600} height={400} data={data} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisDataKey} tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 'auto']} tick={{ fontSize: 12 }} />
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
          <Bar dataKey={valueDataKey} fill={barColor} barSize={barSize} />
          <Line
            type="monotone"
            dataKey={valueDataKey}
            stroke={lineColor}
            strokeWidth={lineStrokeWidth}
            activeDot={{ r: lineActiveDotRadius }}
            strokeDasharray={lineStrokeDasharray}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
