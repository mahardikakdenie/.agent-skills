import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import React from 'react';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';

import { Box } from '@repo/ui';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const Chart = ({ type, data, options, minSize, width, height }: any) => {
  return (
    <Box
      style={{
        width: width || '500px',
        height: height || '250px',
        minWidth: minSize || '10px',
        minHeight: minSize || '10px',
      }}
    >
      {type === 'stacked-bar' ? (
        <Bar data={data} options={options} />
      ) : type === 'curve-line' ? (
        <Line data={data} options={options} height={400} width={800} />
      ) : type === 'doughnut' ? (
        <Doughnut data={data} options={options} />
      ) : (
        <Pie data={data} options={options} />
      )}
    </Box>
  );
};

export default Chart;
