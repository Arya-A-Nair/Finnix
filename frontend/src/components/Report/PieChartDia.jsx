import { Box, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { TbReportAnalytics } from 'react-icons/tb';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#00C49F', '#FD0004', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieChartDia({ chartData, fraud, total, totalTitle }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minWidth: '300px',
        borderRadius: '0.5rem',
        padding: '1rem 2rem',
        height: '100%',
        textAlign: 'start',
      }}
    >
      <Typography variant="h5" fontWeight="700" color="primary" sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <TbReportAnalytics />
        Transaction Statistics
      </Typography>
      <PieChart width={200} height={250}>
        <Pie
          data={chartData}
          cx={100}
          cy={100}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          height={50}
          verticalAlign="bottom"
          align="left"
          layout="horizontal"
        />
      </PieChart>
      <Typography variant="h6" fontWeight="500" color="primary">
        {totalTitle}
      </Typography>
      <Typography variant="h5" fontWeight="700" color="primary">
        {total}
      </Typography>
    </Box>
  );
}
