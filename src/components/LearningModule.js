import React, { useState, useEffect } from 'react';
import { ChevronDown, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import ItemImage from './ItemImage';

const LearningModule = ({ 
  onNavigate, 
  title, 
  modules, 
  chartConfig, 
  displayConfig 
}) => {
  document.body.style.overflow = 'auto';
  
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);
  const [chartData, setChartData] = useState([]);

  const {
    type = 'glucose',
    baselineValue = 120,
    chartHeight = 275,
    chartWidth = 400,
    yMin = 20,
    yMax = 220,
    timeRange = { start: 12, end: 16 },
    dangerZones = []
  } = chartConfig;

  const {
    showComparison = true,
    backgroundColor = '#E7EEEB',
    buttonStyle = 'teal'
  } = displayConfig;

  const currentModule = modules[selectedCategory];
  const currentCategoryData = currentModule?.data || [];

  // Utility function to map Y values to pixel coordinates
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
      const y = mapYValueToPixel(point.value);
      
      // Determine color based on danger zones
      let segmentColor = '#22c55e'; // Default green
      for (const zone of dangerZones) {
        if (point.value > zone.value) {
          segmentColor = zone.color;
          break;
        }
      }
      
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

  // Generate chart data based on current item
  useEffect(() => {
    if (!currentCategoryData[selectedItem]) return;

    const item = currentCategoryData[selectedItem];
    const times = [];
    const { start: startHour, end: endHour } = timeRange;
    const duration = endHour > startHour ? endHour - startHour : (24 - startHour) + endHour;
    const pointsPerHour = 4;
    const totalPoints = duration * pointsPerHour + 1;
    
    // Handle backward compatibility - use impactStart if available, otherwise default to 0.5 (like original)
    const impactStart = item.impactStart !== undefined ? item.impactStart : 0.5;
    
    for (let i = 0; i < totalPoints; i++) {
      const hourOffset = i / pointsPerHour;
      let currentHour = (startHour + hourOffset) % 24;
      const minutes = (hourOffset % 1) * 60;
      
      // Format time label
      const displayHour = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour;
      const period = currentHour < 12 ? 'AM' : 'PM';
      const timeLabel = minutes === 0 ? 
        `${Math.floor(displayHour)} ${period}` : 
        `${Math.floor(displayHour)}:${Math.floor(minutes).toString().padStart(2, '0')} ${period}`;
      
      // Calculate value based on item properties (backward compatible with original logic)
      let value = baselineValue;
      
      if (hourOffset >= impactStart) {
        const timeSinceImpact = hourOffset - impactStart;
        let multiplier = 0;
        
        if (timeSinceImpact <= item.peakTime) {
          const progress = timeSinceImpact / item.peakTime;
          multiplier = Math.sin(progress * Math.PI / 2);
        } else {
          const declineTime = timeSinceImpact - item.peakTime;
          const maxDeclineTime = item.duration || 2.5; // Default to 2.5 like original
          const declineProgress = Math.min(declineTime / maxDeclineTime, 1);
          multiplier = Math.cos(declineProgress * Math.PI / 2);
        }
        
        const maxChange = item.peakValue - baselineValue;
        value = baselineValue + (maxChange * multiplier);
      }
      
      times.push({
        time: timeLabel,
        value: Math.max(yMin, Math.min(yMax, value)),
        timeIndex: hourOffset
      });
    }
    
    setChartData(times);
  }, [selectedItem, selectedCategory, currentCategoryData, baselineValue, timeRange, yMin, yMax]);

  const handleItemSelect = (index) => {
    setSelectedItem(index);
  };

  const currentItem = currentCategoryData[selectedItem];

  const handleCategoryChange = (direction) => {
    if (direction === 'prev' && selectedCategory > 0) {
      setSelectedCategory(selectedCategory - 1);
    } else if (direction === 'next' && selectedCategory < modules.length - 1) {
      setSelectedCategory(selectedCategory + 1);
    }
  };

  // Generate comparison data for other items
  const getComparisonData = (item) => {
    // Handle backward compatibility
    const impactStart = item.impactStart !== undefined ? item.impactStart : 0.5;
    
    return chartData.map((point) => {
      const timeIndex = point.timeIndex;
      let value = baselineValue;
      
      if (timeIndex >= impactStart) {
        const timeSinceImpact = timeIndex - impactStart;
        let multiplier = 0;
        
        if (timeSinceImpact <= item.peakTime) {
          const progress = timeSinceImpact / item.peakTime;
          multiplier = Math.sin(progress * Math.PI / 2);
        } else {
          const declineTime = timeSinceImpact - item.peakTime;
          const maxDeclineTime = item.duration || 2.5; // Default to 2.5 like original
          const declineProgress = Math.min(declineTime / maxDeclineTime, 1);
          multiplier = Math.cos(declineProgress * Math.PI / 2);
        }
        
        const maxChange = item.peakValue - baselineValue;
        value = baselineValue + (maxChange * multiplier);
      }
      
      return {
        ...point,
        value: Math.max(yMin, Math.min(yMax, value))
      };
    });
  };

  if (!currentModule) {
    return <div>No modules available</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor }}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b" style={{ backgroundColor }}>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onNavigate(title.toLowerCase().replace(/\s+/g, '-'))}
            className={`border border-${buttonStyle}-500 text-${buttonStyle}-600 px-3 py-1 rounded text-sm flex items-center space-x-1`}
          >
            <span>{title}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <Settings className="w-5 h-5 text-gray-600" />
      </div>

      {/* Category Navigation */}
      <div className="p-4" style={{ backgroundColor }}>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => handleCategoryChange('prev')}
            disabled={selectedCategory === 0}
            className={`p-2 rounded-lg ${selectedCategory === 0 ? 'text-gray-300' : `text-${buttonStyle}-600 hover:bg-gray-200`}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="text-3xl mb-1">{currentModule.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800">{currentModule.name}</h2>
            <p className="text-sm text-gray-600">
              {selectedCategory + 1} of {modules.length}
            </p>
          </div>
          
          <button
            onClick={() => handleCategoryChange('next')}
            disabled={selectedCategory === modules.length - 1}
            className={`p-2 rounded-lg ${selectedCategory === modules.length - 1 ? 'text-gray-300' : `text-${buttonStyle}-600 hover:bg-gray-200`}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Category Indicator Dots */}
        <div className="flex justify-center space-x-2">
          {modules.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedCategory ? `bg-${buttonStyle}-600` : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            {currentModule.instructions || 'Tap through each option to learn about its impact.'}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ backgroundColor, marginBottom: '20px' }}>
        {/* Y-axis Labels */}
        <div className="absolute top-5 text-xs text-gray-400" style={{ height: chartHeight }}>
          {dangerZones.map((zone, index) => (
            <div 
              key={index}
              className="absolute transform -translate-y-1/2" 
              style={{ top: `${mapYValueToPixel(zone.value)}px` }}
            >
              {zone.value}
            </div>
          ))}
        </div>
        
        <div className="bg-white mx-6 rounded-xl relative overflow-hidden" style={{ height: `${chartHeight}px` }}>
          <div className="chart-area relative" style={{ height: chartHeight, width: chartWidth, margin: '20px auto' }}>
            <svg className="w-full h-full">
              {/* Reference lines */}
              {dangerZones.map((zone, index) => (
                <line 
                  key={index}
                  x1="0" 
                  x2="100%" 
                  y1={mapYValueToPixel(zone.value)} 
                  y2={mapYValueToPixel(zone.value)} 
                  stroke={zone.color} 
                  strokeWidth="2" 
                />
              ))}
              
              {/* Comparison lines for other items */}
              {showComparison && currentCategoryData.map((item, index) => {
                if (index === selectedItem) return null;
                
                const comparisonData = getComparisonData(item);
                
                if (comparisonData.length > 1) {
                  return (
                    <polyline
                      key={`comparison-${item.id}`}
                      points={comparisonData.map((point, i) => {
                        const x = (i / (comparisonData.length - 1)) * chartWidth;
                        const y = mapYValueToPixel(point.value);
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
              
              {/* Main chart line segments */}
              {generateLineSegments(chartData).map((segment, index) => (
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
          {/* Generate time labels dynamically based on timeRange */}
          {Array.from({ length: Math.ceil((timeRange.end - timeRange.start)) + 1 }, (_, i) => {
            const hour = (timeRange.start + i) % 24;
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            const period = hour < 12 ? 'AM' : 'PM';
            return <span key={i}>{displayHour} {period}</span>;
          })}
        </div>
      </div>

      {/* Item Selection Buttons */}
      <div className="px-4 py-6">
        <div className="flex justify-center space-x-3 mb-6">
          {currentCategoryData.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleItemSelect(index)}
              className={`
                rounded-lg p-3 text-center transition-all relative flex flex-col items-center justify-center
                ${index === selectedItem 
                  ? `bg-${buttonStyle}-600 text-white shadow-lg` 
                  : 'bg-white text-gray-700 shadow-sm hover:shadow-md'
                }
              `}
              style={{ width: '85px', height: '85px' }}
            >
              {/* Standardized Icon Container */}
              <div className="flex justify-center items-center mb-1" style={{ height: '40px' }}>
                <div className="w-10 h-10 flex items-center justify-center">
                  <ItemImage 
                    item={item} 
                    size="medium"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
              
              {/* Text with wrapping */}
              <div className="text-xs font-medium leading-tight text-center" style={{ wordWrap: 'break-word', hyphens: 'auto', lineHeight: '1.1' }}>
                {item.name}
              </div>
              
              {index === selectedItem && (
                <div className={`absolute inset-0 border-2 border-${buttonStyle}-600 rounded-lg pointer-events-none`} />
              )}
            </button>
          ))}
        </div>

        {/* Description */}
        {currentItem && (
          <div className="rounded-lg p-4 mb-6 text-center" style={{ backgroundColor: `${backgroundColor}DD` }}>
            <p className={`text-${buttonStyle}-600 text-sm font-medium`}>
              {currentItem.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningModule;