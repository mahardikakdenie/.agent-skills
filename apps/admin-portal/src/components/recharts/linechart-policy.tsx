import {
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Bar,
  ComposedChart,
} from "recharts";

interface LineChartCompProps {
  data: { date: string; count: number }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-gray-700 text-xs p-4 border rounded-md shadow-md">
        <p className="text-xs mb-2">
          <strong>{payload[0].payload.date}</strong>
        </p>
        <p className="text-xs">
          Total Transactions: <strong>{payload[0].value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export default function LineChartComp({ data }: LineChartCompProps) {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={600}
          height={400}
          data={data}
          margin={{ top: 5, right: 50, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, "auto"]} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={() => "Total Transactions"}
            wrapperStyle={{ fontSize: "10px" }}
          />
          <Bar dataKey="count" fill="#e83f3f94" barSize={40} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#006de5"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
