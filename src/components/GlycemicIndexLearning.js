import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChevronDown, Settings } from 'lucide-react';
import { grainData } from './data/foodData';

const GlycemicIndexLearning = ({ onNavigate }) => {
  const [selectedGrain, setSelectedGrain] = useState(0);
  const [glucoseData, setGlucoseData] = useState([]);
  const baselineGlucose = 120;

  useEffect(() => {
    const grain = grainData[selectedGrain];
    const times = [];
    const startHour = 12;
    const endHour = 16;
    const pointsPerHour = 4;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let quarter = 0; quarter < pointsPerHour; quarter++) {
        if (hour === endHour && quarter > 0) break;
        
        const minutes = quarter * 15;
        const displayHour = hour === 12 ? 12 : hour > 12 ? hour - 12 : hour;
        const timeLabel = minutes === 0 ? 
          `${displayHour} PM` : 
          `${displayHour}:${minutes.toString().padStart(2, '0')} PM`;
        
        const timeIndex = (hour - startHour) + (quarter / pointsPerHour);
        let glucoseValue = baselineGlucose;
        
        if (timeIndex >= 0.5) {
          const timeSinceEating = timeIndex - 0.5;
          let multiplier = 0;
          
          if (timeSinceEating <= grain.peakTime) {
            const progress = timeSinceEating / grain.peakTime;
            multiplier = Math.sin(progress * Math.PI / 2);
          } else {
            const declineTime = timeSinceEating - grain.peakTime;
            const maxDeclineTime = 2.5;
            const declineProgress = Math.min(declineTime / maxDeclineTime, 1);
            multiplier = Math.cos(declineProgress * Math.PI / 2);
          }
          
          const maxIncrease = grain.peakValue - baselineGlucose;
          glucoseValue = baselineGlucose + (maxIncrease * multiplier);
        }
        
        times.push({
          time: timeLabel,
          glucose: Math.max(baselineGlucose - 10, glucoseValue),
          timeIndex
        });
      }
    }
    
    setGlucoseData(times);
  }, [selectedGrain]);

  const handleGrainSelect = (index) => {
    setSelectedGrain(index);
  };

  const handleNext = () => {
    if (selectedGrain < grainData.length - 1) {
      setSelectedGrain(selectedGrain + 1);
    }
  };

  const currentGrain = grainData[selectedGrain];

  return (
    <>
      {/* Header */}
      <div className="bg-gray-100 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onNavigate('glycemic-index')}
            className="border border-teal-500 text-teal-600 px-3 py-1 rounded text-sm flex items-center space-x-1"
          >
            <span>Glycemic Index</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <Settings className="w-5 h-5 text-gray-600" />
      </div>

      {/* Educational Text */}
      <div className="bg-gray-100 p-4 text-center">
        <p className="text-gray-700 text-sm leading-relaxed">
          Tap through each grain option to learn about its glycemic index.
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={glucoseData}>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
              interval="preserveStartEnd"
              tickFormatter={(value) => {
                if (value.includes(':')) return '';
                return value;
              }}
            />
            <YAxis 
              domain={[50, 200]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
              ticks={[50, 70, 120, 180, 200]}
            />
            
            <ReferenceLine y={70} stroke="#ef4444" strokeWidth={2} />
            <ReferenceLine y={180} stroke="#3b82f6" strokeWidth={2} />
            <ReferenceLine y={120} stroke="#22c55e" strokeWidth={2} strokeDasharray="4 4" />
            
            <Line 
              type="monotone" 
              dataKey="glucose" 
              stroke="#0891b2" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#0891b2' }}
            />
            
            {/* Comparison lines for other grains */}
            {grainData.map((grain, index) => {
              if (index === selectedGrain) return null;
              
              const comparisonData = glucoseData.map((point) => {
                const timeIndex = point.timeIndex;
                let glucoseValue = baselineGlucose;
                
                if (timeIndex >= 0.5) {
                  const timeSinceEating = timeIndex - 0.5;
                  let multiplier = 0;
                  
                  if (timeSinceEating <= grain.peakTime) {
                    const progress = timeSinceEating / grain.peakTime;
                    multiplier = Math.sin(progress * Math.PI / 2);
                  } else {
                    const declineTime = timeSinceEating - grain.peakTime;
                    const maxDeclineTime = 2.5;
                    const declineProgress = Math.min(declineTime / maxDeclineTime, 1);
                    multiplier = Math.cos(declineProgress * Math.PI / 2);
                  }
                  
                  const maxIncrease = grain.peakValue - baselineGlucose;
                  glucoseValue = baselineGlucose + (maxIncrease * multiplier);
                }
                
                return Math.max(baselineGlucose - 10, glucoseValue);
              });
              
              return (
                <Line
                  key={grain.id}
                  type="monotone"
                  data={glucoseData.map((point, i) => ({ ...point, glucose: comparisonData[i] }))}
                  dataKey="glucose"
                  stroke="#cbd5e1"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grain Selection Buttons */}
      <div className="px-4 py-6">
        <div className="flex justify-center space-x-4 mb-6">
          {grainData.map((grain, index) => (
            <button
              key={grain.id}
              onClick={() => handleGrainSelect(index)}
              className={`
                rounded-lg p-4 text-center transition-all relative
                ${index === selectedGrain 
                  ? 'bg-teal-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 shadow-sm hover:shadow-md'
                }
              `}
              style={{ minWidth: '80px' }}
            >
              <div className="text-2xl mb-2">{grain.icon}</div>
              <div className="text-xs font-medium">{grain.name}</div>
              
              {index === selectedGrain && (
                <div className="absolute inset-0 border-2 border-teal-600 rounded-lg pointer-events-none" />
              )}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
          <p className="text-teal-600 text-sm font-medium">
            {currentGrain.description}
          </p>
        </div>

        {/* Next Button */}
        <button 
          onClick={handleNext}
          disabled={selectedGrain >= grainData.length - 1}
          className={`
            w-full py-4 rounded-lg font-medium text-white transition-all
            ${selectedGrain >= grainData.length - 1 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-teal-600 hover:bg-teal-700'
            }
          `}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default GlycemicIndexLearning;