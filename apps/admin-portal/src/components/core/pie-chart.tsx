import { Box } from "@repo/ui";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#006de5",
  "#2a9df4",
  "#44beff",
  "#a2e2ff",
  "#00ACCC",
  "#00D6FC",
  "#2EDFFF",
  "#8EFDEF",
  "#c88849",
  "#82994c",
  "#b09fca",
  "#f10096",
];

const RADIAN = Math.PI / 180;

interface PieChartCompProps {
  data: { name: string; value: number }[];
  minLabelPercent?: number;
  showInnerPie?: boolean;
}

type CustomLabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
};

type TooltipPayloadItem = {
  name: string;
  value: number;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  totalValue: number;
};

const createPercentageLabel =
  (minLabelPercent: number) =>
  ({
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
  }: CustomLabelProps) => {
    if (percent < minLabelPercent) {
      return null;
    }

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <Box
        as="text"
        x={x}
        y={y}
        fill="white"
        fontSize="12px"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </Box>
    );
  };

const CustomTooltip = ({
  active,
  payload,
  totalValue,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const percentage =
      totalValue > 0 ? ((value / totalValue) * 100).toFixed(2) : "0.00";

    return (
      <Box className="rounded-md border bg-white p-4 text-xs text-gray-700 shadow-md">
        <Box as="p" className="text-xs">
          {payload[0].name}
        </Box>
        <Box as="p" className="mt-2 font-semibold">
          {value} ({percentage}%)
        </Box>
      </Box>
    );
  }

  return null;
};

export default function PieChartComp({
  data,
  minLabelPercent = 0,
  showInnerPie = true,
}: PieChartCompProps) {
  const filteredData = data.filter((item) => item.value > 0);
  const totalValue = filteredData.reduce((acc, item) => acc + item.value, 0);

  return (
    <Box className="flex h-full w-full items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {showInnerPie ? (
            <Pie
              data={filteredData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={50}
              fill="#8884d8"
              startAngle={90}
              endAngle={-270}
            />
          ) : null}
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={createPercentageLabel(minLabelPercent)}
            outerRadius={130}
            innerRadius={80}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip totalValue={totalValue} />} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
