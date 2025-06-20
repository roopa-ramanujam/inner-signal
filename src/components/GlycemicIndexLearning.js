import React, { useState, useEffect } from 'react';
import { ChevronDown, Settings } from 'lucide-react';
import { grainData } from './data/library';

const GlycemicIndexLearning = ({ onNavigate }) => {
  const [selectedGrain, setSelectedGrain] = useState(0);
  const [glucoseData, setGlucoseData] = useState([]);
  const baselineGlucose = 120;

  // Chart dimensions
  const chartHeight = 275;
  const chartWidth = 400;
  const yMin = 20;
  const yMax = 220;

  // Utility function
  const mapYValueToPixel = (yValue) => {
    return chartHeight - ((yValue - yMin) / (yMax - yMin)) * chartHeight;
  };

  // Function to generate line segments with appropriate colors
  const generateLineSegments = (data) => {
    if (data.length < 2) return [];
    
    const segments = [];
    let currentSegment = [];
    let currentColor = null;
    
    for (let i = 0; i < data.length; i++) {
      const point = data[i];
      const x = (i / (data.length - 1)) * chartWidth;
      const y = mapYValueToPixel(point.glucose);
      
      // Determine color based on glucose value
      const isOutOfRange = point.glucose > 180 || point.glucose < 70;
      const segmentColor = isOutOfRange ? '#ef4444' : '#22c55e'; // red for out of range, green for normal
      
      // If color changes or this is the first point, handle segment transition
      if (currentColor !== segmentColor) {
        // If we have a current segment, close it
        if (currentSegment.length > 0) {
          segments.push({
            points: [...currentSegment, `${x},${y}`], // Add current point to close the segment
            color: currentColor
          });
        }
        
        // Start new segment
        currentSegment = [`${x},${y}`];
        currentColor = segmentColor;
      } else {
        // Continue current segment
        currentSegment.push(`${x},${y}`);
      }
      
      // If this is the last point, close the segment
      if (i === data.length - 1 && currentSegment.length > 0) {
        segments.push({
          points: currentSegment,
          color: currentColor
        });
      }
    }
    
    return segments;
  };

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

  // Generate comparison data for other grains
  const getComparisonData = (grain) => {
    return glucoseData.map((point) => {
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
      
      return {
        ...point,
        glucose: Math.max(baselineGlucose - 10, glucoseValue)
      };
    });
  };

  return (
    <div className="bg-[#E7EEEB] min-h-screen">
      {/* Header */}
      <div className="bg-[#E7EEEB] p-4 flex items-center justify-between">
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
      <div className="bg-[#E7EEEB] p-4 text-center">
        <p className="text-gray-700 text-md font-semibold leading-relaxed">
          Tap through each grain option to learn about its glycemic index.
        </p>
      </div>

      {/* Chart */}
      <div className="bg-[#E7EEEB] relative" style={{ marginBottom: '20px' }}>
        {/* Y-axis Labels - positioned at exact reference line positions */}
        <div className="absolute top-5 text-xs text-gray-400" style={{ height: chartHeight }}>
          <div 
            className="absolute transform -translate-y-1/2" 
            style={{ top: `${mapYValueToPixel(180)}px` }}
          >
            180
          </div>
          <div 
            className="absolute transform -translate-y-1/2" 
            style={{ top: `${mapYValueToPixel(70)}px` }}
          >
            70
          </div>
          <div 
            className="absolute transform -translate-y-1/2" 
            style={{ top: `${mapYValueToPixel(50)}px` }}
          >
            50
          </div>
        </div>
        
        <div className="bg-white mx-6 rounded-xl relative overflow-hidden" style={{ height: `${chartHeight}px` }}>
          {/* Chart area - full width clean chart */}
          <div className="chart-area relative" style={{ height: chartHeight, width: chartWidth, margin: '20px auto' }}>
            
            {/* Custom SVG for everything - full control */}
            <svg className="w-full h-full">
              {/* Full-width reference lines */}
              <line x1="0" x2="100%" y1={mapYValueToPixel(70)} y2={mapYValueToPixel(70)} stroke="#ef4444" strokeWidth="2" />
              <line x1="0" x2="100%" y1={mapYValueToPixel(180)} y2={mapYValueToPixel(180)} stroke="#3b82f6" strokeWidth="2" />
              
              {/* Comparison lines for other grains (background) */}
              {grainData.map((grain, index) => {
                if (index === selectedGrain) return null;
                
                const comparisonData = getComparisonData(grain);
                
                if (comparisonData.length > 1) {
                  return (
                    <polyline
                      key={`comparison-${grain.id}`}
                      points={comparisonData.map((point, i) => {
                        const x = (i / (comparisonData.length - 1)) * chartWidth;
                        const y = mapYValueToPixel(point.glucose);
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  );
                }
                return null;
              })}
              
              {/* Main glucose line segments with appropriate colors */}
              {generateLineSegments(glucoseData).map((segment, index) => (
                <polyline
                  key={`segment-${index}`}
                  points={segment.points.join(' ')}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="3"
                  strokeDasharray="4 4"
                />
              ))}
            </svg>
          </div>
        </div>
        
        {/* X-axis Labels - outside the chart */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-between text-xs text-gray-400" style={{ width: chartWidth }}>
          <span>12 PM</span>
          <span>1 PM</span>
          <span>2 PM</span>
          <span>3 PM</span>
          <span>4 PM</span>
        </div>
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
        <div className="bg-[#D6E3E2] rounded-lg p-4 mb-6 text-center">
          <p className="text-teal-600 text-sm font-medium">
            {currentGrain.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlycemicIndexLearning;