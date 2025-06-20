import React, { useState, useEffect } from 'react';
import { ChevronDown, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { learningModules } from './data/learningModules';
import ItemImage from './ItemImage';

const GlycemicIndexLearning = ({ onNavigate }) => {
  document.body.style.overflow='auto';
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);
  const [glucoseData, setGlucoseData] = useState([]);
  const baselineGlucose = 120;

  // Chart dimensions
  const chartHeight = 275;
  const chartWidth = 400;
  const yMin = 20;
  const yMax = 220;

  const currentModule = learningModules[selectedCategory];
  const currentCategoryData = currentModule.data;

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
      const segmentColor = isOutOfRange ? '#ef4444' : '#22c55e';
      
      if (currentColor !== segmentColor) {
        if (currentSegment.length > 0) {
          segments.push({
            points: [...currentSegment, `${x},${y}`],
            color: currentColor
          });
        }
        currentSegment = [`${x},${y}`];
        currentColor = segmentColor;
      } else {
        currentSegment.push(`${x},${y}`);
      }
      
      if (i === data.length - 1 && currentSegment.length > 0) {
        segments.push({
          points: currentSegment,
          color: currentColor
        });
      }
    }
    
    return segments;
  };

  // Reset selectedItem when category changes
  useEffect(() => {
    setSelectedItem(0);
  }, [selectedCategory]);

  useEffect(() => {
    const item = currentCategoryData[selectedItem];
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
          
          if (timeSinceEating <= item.peakTime) {
            const progress = timeSinceEating / item.peakTime;
            multiplier = Math.sin(progress * Math.PI / 2);
          } else {
            const declineTime = timeSinceEating - item.peakTime;
            const maxDeclineTime = 2.5;
            const declineProgress = Math.min(declineTime / maxDeclineTime, 1);
            multiplier = Math.cos(declineProgress * Math.PI / 2);
          }
          
          const maxIncrease = item.peakValue - baselineGlucose;
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
  }, [selectedItem, selectedCategory, currentCategoryData]);

  const handleItemSelect = (index) => {
    setSelectedItem(index);
  };

  const handleNext = () => {
    if (selectedItem < currentCategoryData.length - 1) {
      setSelectedItem(selectedItem + 1);
    }
  };

  const currentItem = currentCategoryData[selectedItem];

  const handleCategoryChange = (direction) => {
    if (direction === 'prev' && selectedCategory > 0) {
      setSelectedCategory(selectedCategory - 1);
    } else if (direction === 'next' && selectedCategory < learningModules.length - 1) {
      setSelectedCategory(selectedCategory + 1);
    }
  };

  // Generate comparison data for other items
  const getComparisonData = (item) => {
    return glucoseData.map((point) => {
      const timeIndex = point.timeIndex;
      let glucoseValue = baselineGlucose;
      
      if (timeIndex >= 0.5) {
        const timeSinceEating = timeIndex - 0.5;
        let multiplier = 0;
        
        if (timeSinceEating <= item.peakTime) {
          const progress = timeSinceEating / item.peakTime;
          multiplier = Math.sin(progress * Math.PI / 2);
        } else {
          const declineTime = timeSinceEating - item.peakTime;
          const maxDeclineTime = 2.5;
          const declineProgress = Math.min(declineTime / maxDeclineTime, 1);
          multiplier = Math.cos(declineProgress * Math.PI / 2);
        }
        
        const maxIncrease = item.peakValue - baselineGlucose;
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
      <div className="bg-[#E7EEEB] p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onNavigate('glycemic-index')}
            className="border border-teal-500 text-teal-600 px-3 py-1 rounded text-sm flex items-center space-x-1"
          >
            <span>Food Learning</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <Settings className="w-5 h-5 text-gray-600" />
      </div>

      {/* Category Navigation */}
      <div className="bg-[#E7EEEB] p-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => handleCategoryChange('prev')}
            disabled={selectedCategory === 0}
            className={`p-2 rounded-lg ${selectedCategory === 0 ? 'text-gray-300' : 'text-teal-600 hover:bg-gray-200'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="text-3xl mb-1">{currentModule.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800">{currentModule.name}</h2>
            <p className="text-sm text-gray-600">
              {selectedCategory + 1} of {learningModules.length}
            </p>
          </div>
          
          <button
            onClick={() => handleCategoryChange('next')}
            disabled={selectedCategory === learningModules.length - 1}
            className={`p-2 rounded-lg ${selectedCategory === learningModules.length - 1 ? 'text-gray-300' : 'text-teal-600 hover:bg-gray-200'}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Category Indicator Dots */}
        <div className="flex justify-center space-x-2">
          {learningModules.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedCategory ? 'bg-teal-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            Tap through each option to learn about its glucose impact.
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[#E7EEEB] relative" style={{ marginBottom: '20px' }}>
        {/* Y-axis Labels */}
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
          <div className="chart-area relative" style={{ height: chartHeight, width: chartWidth, margin: '20px auto' }}>
            <svg className="w-full h-full">
              {/* Reference lines */}
              <line x1="0" x2="100%" y1={mapYValueToPixel(70)} y2={mapYValueToPixel(70)} stroke="#FF7B7B" strokeWidth="2" />
              <line x1="0" x2="100%" y1={mapYValueToPixel(180)} y2={mapYValueToPixel(180)} stroke="#B9BCF9" strokeWidth="2" />
              
              {/* Comparison lines for other items in current category */}
              {currentCategoryData.map((item, index) => {
                if (index === selectedItem) return null;
                
                const comparisonData = getComparisonData(item);
                
                if (comparisonData.length > 1) {
                  return (
                    <polyline
                      key={`comparison-${item.id}`}
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
              
              {/* Main glucose line segments */}
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
        
        {/* X-axis Labels */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-between text-xs text-gray-400" style={{ width: chartWidth }}>
          <span>12 PM</span>
          <span>1 PM</span>
          <span>2 PM</span>
          <span>3 PM</span>
          <span>4 PM</span>
          <span>5 PM</span>
        </div>
      </div>

      {/* Item Selection Buttons */}
      <div className="px-4 py-6">
        <div className="flex justify-center space-x-4 mb-6">
          {currentCategoryData.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleItemSelect(index)}
              className={`
                rounded-lg p-4 text-center transition-all relative
                ${index === selectedItem 
                  ? 'bg-teal-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 shadow-sm hover:shadow-md'
                }
              `}
              style={{ minWidth: '80px' }}
            >
              <div className="mb-2 flex justify-center">
                <ItemImage 
                  item={item} 
                  size="medium"
                />
              </div>
              <div className="text-xs font-medium">{item.name}</div>
              
              {index === selectedItem && (
                <div className="absolute inset-0 border-2 border-teal-600 rounded-lg pointer-events-none" />
              )}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="bg-[#D6E3E2] rounded-lg p-4 mb-6 text-center">
          <p className="text-teal-600 text-sm font-medium">
            {currentItem.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlycemicIndexLearning;