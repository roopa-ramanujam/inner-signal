import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';

// Dummy X-axis data to stretch the chart
const domain = [50, 250];      
const chartHeight = 300;
const chartWidth = 450;

const ChartCard = ({ data }) => {
  const yValues = [50, 70, 120, 180];
  const xValues = ['12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];

  const mapYValueToPixel = (yValue) => {
    const [min, max] = domain;
    return chartHeight - ((yValue - min) / (max - min)) * chartHeight;
  };

  const mapXIndexToPixel = (index) => {
    const spacing = chartWidth / (xValues.length);
    return spacing * index;
  };

  const FullWidthLine = ({ y, stroke, strokeDasharray }) => (
    <line
      x1="0"
      x2="100%"
      y1={mapYValueToPixel(y)}
      y2={mapYValueToPixel(y)}
      stroke={stroke}
      strokeWidth={2}
      strokeDasharray={strokeDasharray}
    />
  );


  return (
    <div className="bg-[#E7EEEB] pr-7 pl-7 relative" style={{ width: chartWidth }}>
      {/* Y-axis Labels */}
      {yValues.map((val) => (
        <div
          key={val}
          className="absolute left-0 text-xs text-gray-400"
          style={{
            top: mapYValueToPixel(val),
            transform: 'translateY(-50%)',
          }}
        >
          {val}
        </div>
      ))}

      {/* X-axis Labels */}
      {xValues.map((val, index) => (
        <div
          key={val}
          className="absolute text-xs text-gray-400"
          style={{
            left: mapXIndexToPixel(index),
            top: chartHeight,
            transform: 'translateX(50%)',
          }}
        >
          {val}
        </div>
      ))}

      {/* Chart Container */}
      <div className="relative bg-white rounded-xl overflow-hidden" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              type="category"
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <YAxis
              domain={domain}
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <ReferenceLine y={70} stroke="#ef4444" shape={<FullWidthLine y={70} />} />
            <ReferenceLine y={120} stroke="#22c55e" strokeDasharray="4 4" shape={<FullWidthLine y={120} />} />
            <ReferenceLine y={180} stroke="#3b82f6" shape={<FullWidthLine y={180} />} />
            <Line 
                  type="monotone" 
                  dataKey="glucose" 
                  stroke="#0891b2" 
                  strokeWidth={2}
                  dot={{ fill: '#0891b2', strokeWidth: 2, r: 2 }}
                  activeDot={{ r: 6, fill: '#0891b2' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
