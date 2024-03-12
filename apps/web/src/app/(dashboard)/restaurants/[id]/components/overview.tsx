'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: 'Kebabsallad',
    total: Math.floor(Math.random() * 50) + 100
  },
  {
    name: 'Hawaiisallad',
    total: Math.floor(Math.random() * 50) + 100
  },
  {
    name: 'Salami',
    total: Math.floor(Math.random() * 50) + 100
  },
  {
    name: 'Capricciosa',
    total: Math.floor(Math.random() * 50) + 100
  },
  {
    name: 'Margherita',
    total: Math.floor(Math.random() * 50) + 100
  },
  {
    name: 'Picasso',
    total: Math.floor(Math.random() * 50) + 100
  },
  {
    name: 'Tropicana',
    total: Math.floor(Math.random() * 50) + 100
  }
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          axisLine={true}
          // tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
