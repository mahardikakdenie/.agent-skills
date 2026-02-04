import { formatMoney } from "@/lib/formatter";
import { ResponsiveContainer, Legend, Tooltip, CartesianGrid, XAxis, YAxis, Line, Bar, ComposedChart } from "recharts";

interface LineChartCompProps {
  data: { date: string; count: number; total_claim_amount: number }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-gray-700 text-xs p-4 border rounded-md shadow-md">
        <p className="text-xs mb-2"><strong>{payload[0].payload.date}</strong></p>
        <p className="text-xs">Total Claims: <strong>{formatMoney(payload.find((p: any) => p.dataKey === "count")?.value)}</strong></p>
        <p className="text-xs">Total Claim Amount: <strong>{formatMoney(payload.find((p: any) => p.dataKey === "total_claim_amount")?.value)}</strong></p>
      </div>
    );
  }
  return null;
};

export default function LineChartComp({ data }: LineChartCompProps) {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart width={600} height={400} data={data} margin={{ top: 5, right: 50, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "10px" }} />
          <Bar yAxisId="right" dataKey="total_claim_amount" fill="#e83f3f94" barSize={40} name="Total Claim Amount" />
          <Line yAxisId="left" type="monotone" dataKey="count" stroke="#006de5" strokeWidth={2} activeDot={{ r: 8 }} name="Total Claims" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
