import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const CvssChart = ({ data }) => {
  return (
    <BarChart width={400} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="severity" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="score" fill="#8884d8" />
    </BarChart>
  );
};

export default CvssChart;
