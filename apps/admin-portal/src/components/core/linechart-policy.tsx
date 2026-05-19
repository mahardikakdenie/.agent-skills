'use client';

import { Box } from '@repo/ui';

import SharedLineChart, {
  type ChartAxisConfig,
  type CustomTooltipRendererProps,
} from './line-chart';

interface LineChartCompProps {
  data: { date: string; count: number }[];
}

const policyChartSeries = [
  {
    dataKey: 'count',
    name: 'Total Transactions',
    type: 'bar' as const,
    color: '#e83f3f94',
    yAxisId: 'left',
    barSize: 40,
  },
  {
    dataKey: 'count',
    name: 'Total Transactions',
    type: 'line' as const,
    color: '#006de5',
    yAxisId: 'left',
    strokeWidth: 2,
    activeDotRadius: 8,
  },
];

const policyChartAxes: ChartAxisConfig[] = [
  { yAxisId: 'left', tickFontSize: 12, domain: [0, 'auto'] },
];

const renderPolicyTooltip = ({ active, payload }: CustomTooltipRendererProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <Box className="rounded-md border bg-white p-4 text-xs text-gray-700 shadow-md">
      <Box as="p" className="mb-2 text-xs">
        <Box as="strong">{String(payload[0]?.payload?.date ?? '-')}</Box>
      </Box>
      <Box as="p" className="text-xs">
        Total Transactions: <Box as="strong">{String(payload[0]?.value ?? '-')}</Box>
      </Box>
    </Box>
  );
};

export default function LineChartComp({ data }: LineChartCompProps) {
  return (
    <SharedLineChart
      data={data}
      series={policyChartSeries}
      yAxes={policyChartAxes}
      legendFormatter={() => 'Total Transactions'}
      tooltipContent={renderPolicyTooltip}
    />
  );
}
