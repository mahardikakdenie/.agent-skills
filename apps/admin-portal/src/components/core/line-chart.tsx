'use client';

import type { ReactNode } from 'react';
import {
  ResponsiveContainer,
  Legend,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Bar,
  ComposedChart,
} from 'recharts';

import { Box } from '@repo/ui';

export type ChartDatum = Record<string, string | number | null | undefined>;

export interface ChartSeriesConfig {
  dataKey: string;
  name: string;
  type: 'line' | 'bar';
  color: string;
  yAxisId?: string;
  valueFormatter?: (value: number | string) => string;
  barSize?: number;
  strokeWidth?: number;
  activeDotRadius?: number;
}

type ChartAxisDomainValue = number | 'auto' | 'dataMin' | 'dataMax';

export interface ChartAxisConfig {
  yAxisId: string;
  orientation?: 'left' | 'right';
  tickFontSize?: number;
  domain?: [ChartAxisDomainValue, ChartAxisDomainValue];
}

export interface LineChartTooltipEntry {
  dataKey?: string;
  name?: string;
  value?: number | string;
  payload: ChartDatum;
}

export interface CustomTooltipRendererProps {
  active?: boolean;
  payload?: LineChartTooltipEntry[];
  tooltipLabelKey: string;
  seriesByKey: Record<string, ChartSeriesConfig>;
}

interface LineChartCompProps {
  data: ChartDatum[];
  series: ChartSeriesConfig[];
  xAxisDataKey?: string;
  tooltipLabelKey?: string;
  yAxes?: ChartAxisConfig[];
  legendFormatter?: (value: string, entry: unknown, index: number) => ReactNode;
  tooltipContent?: (props: CustomTooltipRendererProps) => ReactNode;
}

const defaultYAxisConfig: ChartAxisConfig[] = [
  { yAxisId: 'left', tickFontSize: 12 },
  { yAxisId: 'right', orientation: 'right', tickFontSize: 12 },
];

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
  seriesByKey,
  tooltipContent,
}: CustomTooltipRendererProps & {
  tooltipContent?: (props: CustomTooltipRendererProps) => ReactNode;
}) => {
  if (tooltipContent) {
    return tooltipContent({ active, payload, tooltipLabelKey, seriesByKey });
  }

  if (active && payload && payload.length) {
    const label = payload[0]?.payload?.[tooltipLabelKey];

    return (
      <Box className="rounded-md border bg-white p-4 text-xs text-gray-700 shadow-md">
        <Box as="p" className="mb-2 text-xs">
          <Box as="strong">{label !== undefined ? String(label) : '-'}</Box>
        </Box>
        {payload.map((entry, index) => {
          const config = entry.dataKey ? seriesByKey[entry.dataKey] : undefined;
          const entryLabel = entry.name ?? config?.name ?? entry.dataKey ?? `Series ${index + 1}`;

          return (
            <Box as="p" key={`${entry.dataKey ?? entryLabel}-${index}`} className="text-xs">
              {entryLabel}:{' '}
              <Box as="strong">{formatTooltipValue(entry.value, config?.valueFormatter)}</Box>
            </Box>
          );
        })}
      </Box>
    );
  }
  return null;
};

export default function LineChartComp({
  data,
  series,
  xAxisDataKey = 'date',
  tooltipLabelKey = 'date',
  yAxes = defaultYAxisConfig,
  legendFormatter,
  tooltipContent,
}: LineChartCompProps) {
  const seriesByKey = Object.fromEntries(series.map((entry) => [entry.dataKey, entry]));

  return (
    <Box className="flex h-full w-full items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart width={600} height={400} data={data} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisDataKey} tick={{ fontSize: 12 }} />
          {yAxes.map((axis) => (
            <YAxis
              key={axis.yAxisId}
              yAxisId={axis.yAxisId}
              orientation={axis.orientation ?? 'left'}
              domain={axis.domain}
              tick={{ fontSize: axis.tickFontSize ?? 12 }}
            />
          ))}
          <Tooltip
            content={
              <CustomTooltip
                tooltipLabelKey={tooltipLabelKey}
                seriesByKey={seriesByKey}
                tooltipContent={tooltipContent}
              />
            }
          />
          <Legend formatter={legendFormatter} wrapperStyle={{ fontSize: '10px' }} />
          {series.map((entry) =>
            entry.type === 'bar' ? (
              <Bar
                key={entry.dataKey}
                yAxisId={entry.yAxisId ?? 'right'}
                dataKey={entry.dataKey}
                fill={entry.color}
                barSize={entry.barSize ?? 40}
                name={entry.name}
              />
            ) : (
              <Line
                key={entry.dataKey}
                yAxisId={entry.yAxisId ?? 'left'}
                type="monotone"
                dataKey={entry.dataKey}
                stroke={entry.color}
                strokeWidth={entry.strokeWidth ?? 2}
                activeDot={{ r: entry.activeDotRadius ?? 8 }}
                name={entry.name}
              />
            ),
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
