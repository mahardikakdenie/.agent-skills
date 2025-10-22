import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#006de5", "#2a9df4", "#44beff", "#a2e2ff", "#00ACCC", "#00D6FC", "#2EDFFF", "#8EFDEF", "#c88849", "#82994c", "#b09fca", "#f10096"];
const RADIAN = Math.PI / 180;

interface PieChartCompProps {
  data: { name: string; value: number }[];
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      fontSize="12px"
      fontWeight="bold"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload, totalValue }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const percentage = ((value / totalValue) * 100).toFixed(2);
    return (
      <div className="bg-white text-gray-700 text-xs p-4 border rounded-md shadow-md">
        <p className="text-xs">{payload[0].name}</p>
        <p className="font-semibold mt-2">
          {value} ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export default function PieChartComp({ data }: PieChartCompProps) {
  const filteredData = data.filter((item) => item.value > 0);
  const totalValue = filteredData.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
        <Pie data={filteredData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8"
            startAngle={90}
            endAngle={-270} />
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={130}
            innerRadius={80}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip totalValue={totalValue} />} />
          {/* <Legend wrapperStyle={{ fontSize: "11px" }} /> */}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
