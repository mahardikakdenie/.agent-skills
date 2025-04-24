import { formatMoney, numberSimpleFormatter } from "@/lib/formatter";
import React from "react";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Line, ComposedChart } from "recharts";

interface BarChartCompProps {
  data: { status: string; count: number }[];
}

const CustomTooltip = ({ active, payload }: any) => { if (active && payload && payload.length) {
  const value = payload[0].value;
  return (
    <div className="bg-white text-gray-700 text-xs p-4 border rounded-md shadow-md">
      <p className="font-semibold text-xs">{payload[0].payload.status}</p>
      <p className="mt-2">Price: <strong>IDR {formatMoney(value)}</strong></p>
    </div>
  ); } return null;
};

export default function BarChartComp({ data }: BarChartCompProps) {
  const sortedData = data.filter((item) => item.count > 0).sort((a, b) => new Date(a.status).getTime() - new Date(b.status).getTime());

  return (
    <div className="flex justify-center items-center w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart layout="horizontal" data={sortedData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" type="category" tick={{ fontSize: 12 }} textAnchor="end"/>
          <YAxis type="number" tickFormatter={(value: number) => String(numberSimpleFormatter(value))} tick={{ fontSize: 10 }}/>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "10px" }} formatter={() => "Price"} />
          <Bar dataKey="count" fill="#006de5" barSize={35}>
            <LabelList dataKey="count" position="center" fill="white" fontSize={8} formatter={(value: number) => numberSimpleFormatter(value)} />
          </Bar>
          <Line type="monotone" dataKey="count" stroke="#e83f3f94" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
