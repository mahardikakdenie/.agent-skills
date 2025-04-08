import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";

interface BarChartCompProps {
  data: { status: string; count: number }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-white text-gray-700 text-xs p-4 border rounded-md shadow-md">
        <p className="font-semibold text-xs">{payload[0].payload.status}</p>
        <p className="mt-2">id: <strong>{value}</strong></p>
      </div>
    );
  }
  return null;
};

export default function BarChartComp({ data }: BarChartCompProps) {
  const sortedData = data.filter((item) => item.count > 0).sort((a, b) => b.count - a.count);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={sortedData} margin={{ top: 20, right: 0, left: -40, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis dataKey="status" type="category" tick={{ fontSize: 10 }} width={155}/>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "10px" }} formatter={() => "Total Claim"} />
          <Bar dataKey="count" fill="#006de5" barSize={30}>
            <LabelList dataKey="count" position="center" fill="white" fontSize={12}/>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
