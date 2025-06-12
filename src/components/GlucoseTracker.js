import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Search, Settings, RotateCcw, ChevronDown } from 'lucide-react';
import { foodLibrary } from './data/foodData';
import FoodImage from './FoodImage';

const GlucoseTracker = ({ onNavigate }) => {
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [glucoseData, setGlucoseData] = useState([]);
  const [baselineGlucose] = useState(100);
  const [foodTimings, setFoodTimings] = useState({});
  const [draggedFood, setDraggedFood] = useState(null);
  const [chartBounds, setChartBounds] = useState({ left: 0, width: 0 });
  const [lastSelectedFood, setLastSelectedFood] = useState(null);
  const chartRef = useRef(null);
  
  // Bottom sheet states
  const [bottomSheetHeight, setBottomSheetHeight] = useState(200);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const bottomSheetRef = useRef(null);
  
  const COLLAPSED_HEIGHT = 200;
  const EXPANDED_HEIGHT = 400;
  const FULL_SCREEN_HEIGHT = windowHeight;

  // Track window height changes
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate initial flat line data
  useEffect(() => {
    const times = [];
    const startHour = 12;
    const endHour = 17;
    const pointsPerHour = 4;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let quarter = 0; quarter < pointsPerHour; quarter++) {
        if (hour === endHour && quarter > 0) break;
        
        const minutes = quarter * 15;
        const displayHour = hour === 12 ? 12 : hour > 12 ? hour - 12 : hour;
        const timeLabel = minutes === 0 ? 
          `${displayHour} ${hour >= 12 ? 'PM' : 'AM'}` : 
          `${displayHour}:${minutes.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        
        times.push({
          time: timeLabel,
          glucose: baselineGlucose,
          rawHour: hour,
          rawMinutes: minutes,
          timeIndex: (hour - startHour) + (quarter / pointsPerHour)
        });
      }
    }
    setGlucoseData(times);
  }, [baselineGlucose]);

  // Update chart bounds
  useEffect(() => {
    const updateChartBounds = () => {
      if (chartRef.current) {
        const rect = chartRef.current.getBoundingClientRect();
        const margin = 40;
        setChartBounds({
          left: margin,
          width: rect.width - (margin * 2)
        });
      }
    };

    updateChartBounds();
    window.addEventListener('resize', updateChartBounds);
    return () => window.removeEventListener('resize', updateChartBounds);
  }, []);

  // Update glucose curve
  useEffect(() => {
    if (selectedFoods.length === 0) {
      setGlucoseData(prev => prev.map(point => ({ ...point, glucose: baselineGlucose })));
      return;
    }

    setGlucoseData(prev => prev.map((point, timeIndex) => {
      let glucoseValue = baselineGlucose;
      
      selectedFoods.forEach((food) => {
        const foodTimePosition = foodTimings[food.item] !== undefined ? 
          foodTimings[food.item] : 0;
        const foodTimeIndex = foodTimePosition * (prev.length - 1);
        
        if (timeIndex >= foodTimeIndex) {
          const timeSinceFood = timeIndex - foodTimeIndex;
          let multiplier;
          
          if (timeSinceFood <= 1) {
            multiplier = timeSinceFood * 0.8;
          } else if (timeSinceFood <= 3) {
            const peakProgress = (timeSinceFood - 1) / 2;
            multiplier = 0.8 + (0.2 * (1 - Math.abs(peakProgress - 0.5) * 2));
          } else {
            multiplier = Math.max(0.2, 1 - (timeSinceFood - 3) * 0.15);
          }
          
          glucoseValue += food.glucose_change * multiplier;
        }
      });
      
      return {
        ...point,
        glucose: Math.max(50, glucoseValue)
      };
    }));
  }, [selectedFoods, baselineGlucose, foodTimings]);

  // Bottom sheet handlers
  const handleSheetTouchStart = (e) => {
    if (e.target.closest('.food-grid')) return;
    setIsDraggingSheet(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(bottomSheetHeight);
  };

  const handleSheetTouchMove = (e) => {
    if (!isDraggingSheet) return;
    e.preventDefault();
    
    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    const newHeight = Math.max(COLLAPSED_HEIGHT, Math.min(FULL_SCREEN_HEIGHT, startHeight + deltaY));
    
    setBottomSheetHeight(newHeight);
  };

  const handleSheetTouchEnd = () => {
    if (!isDraggingSheet) return;
    setIsDraggingSheet(false);
    
    const collapsedToExpanded = (COLLAPSED_HEIGHT + EXPANDED_HEIGHT) / 2;
    const expandedToFullScreen = (EXPANDED_HEIGHT + FULL_SCREEN_HEIGHT) / 2;
    
    let targetHeight;
    if (bottomSheetHeight < collapsedToExpanded) {
      targetHeight = COLLAPSED_HEIGHT;
    } else if (bottomSheetHeight < expandedToFullScreen) {
      targetHeight = EXPANDED_HEIGHT;
    } else {
      targetHeight = FULL_SCREEN_HEIGHT;
    }
    
    setBottomSheetHeight(targetHeight);
  };

  const handleSheetMouseDown = (e) => {
    if (e.target.closest('.food-grid')) return;
    setIsDraggingSheet(true);
    setStartY(e.clientY);
    setStartHeight(bottomSheetHeight);
  };

  const handleSheetMouseMove = (e) => {
    if (!isDraggingSheet) return;
    
    const currentY = e.clientY;
    const deltaY = startY - currentY;
    const newHeight = Math.max(COLLAPSED_HEIGHT, Math.min(FULL_SCREEN_HEIGHT, startHeight + deltaY));
    
    setBottomSheetHeight(newHeight);
  };

  const handleSheetMouseUp = () => {
    if (!isDraggingSheet) return;
    setIsDraggingSheet(false);
    
    const collapsedToExpanded = (COLLAPSED_HEIGHT + EXPANDED_HEIGHT) / 2;
    const expandedToFullScreen = (EXPANDED_HEIGHT + FULL_SCREEN_HEIGHT) / 2;
    
    let targetHeight;
    if (bottomSheetHeight < collapsedToExpanded) {
      targetHeight = COLLAPSED_HEIGHT;
    } else if (bottomSheetHeight < expandedToFullScreen) {
      targetHeight = EXPANDED_HEIGHT;
    } else {
      targetHeight = FULL_SCREEN_HEIGHT;
    }
    
    setBottomSheetHeight(targetHeight);
  };

  useEffect(() => {
    if (isDraggingSheet) {
      document.addEventListener('mousemove', handleSheetMouseMove);
      document.addEventListener('mouseup', handleSheetMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleSheetMouseMove);
      document.removeEventListener('mouseup', handleSheetMouseUp);
    };
  }, [isDraggingSheet, startY, startHeight, bottomSheetHeight]);

  const handleFoodSelect = (food) => {
    if (selectedFoods.length >= 3) return;
    if (selectedFoods.find(f => f.item === food.item)) return;
    
    setSelectedFoods([...selectedFoods, food]);
    setLastSelectedFood(food);
    setFoodTimings(prev => ({
      ...prev,
      [food.item]: (selectedFoods.length * 0.3) % 1
    }));
  };

  const removeFood = (foodToRemove) => {
    setSelectedFoods(selectedFoods.filter(food => food.item !== foodToRemove.item));
    setFoodTimings(prev => {
      const newTimings = { ...prev };
      delete newTimings[foodToRemove.item];
      return newTimings;
    });
    
    if (lastSelectedFood?.item === foodToRemove.item) {
      const remainingFoods = selectedFoods.filter(food => food.item !== foodToRemove.item);
      setLastSelectedFood(remainingFoods.length > 0 ? remainingFoods[remainingFoods.length - 1] : null);
    }
  };

  const resetSelection = () => {
    setSelectedFoods([]);
    setFoodTimings({});
    setLastSelectedFood(null);
  };

  // Slider handlers
  const handleSliderStart = (e, food) => {
    e.preventDefault();
    setDraggedFood(food);
  };

  const handleSliderMove = (clientX) => {
    if (!draggedFood || !chartBounds.width) return;

    const rect = chartRef.current.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const relativeX = mouseX - chartBounds.left;
    const percentage = Math.max(0, Math.min(1, relativeX / chartBounds.width));
    
    setFoodTimings(prev => ({
      ...prev,
      [draggedFood.item]: percentage
    }));
  };

  const handleSliderEnd = () => {
    setDraggedFood(null);
  };

  const handleSliderMouseMove = (e) => {
    handleSliderMove(e.clientX);
  };

  const handleSliderTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    if (draggedFood) {
      document.addEventListener('mousemove', handleSliderMouseMove);
      document.addEventListener('mouseup', handleSliderEnd);
      document.addEventListener('touchmove', handleSliderTouchMove, { passive: false });
      document.addEventListener('touchend', handleSliderEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleSliderMouseMove);
      document.removeEventListener('mouseup', handleSliderEnd);
      document.removeEventListener('touchmove', handleSliderTouchMove);
      document.removeEventListener('touchend', handleSliderEnd);
    };
  }, [draggedFood, chartBounds]);

  const getSliderPosition = (food) => {
    if (!chartBounds.width) return 0;
    const timePosition = foodTimings[food.item] || 0;
    return chartBounds.left + (timePosition * chartBounds.width);
  };

  const getGlucoseAtPosition = (food) => {
    const timePosition = foodTimings[food.item] || 0;
    const continuousIndex = timePosition * (glucoseData.length - 1);
    
    const lowerIndex = Math.floor(continuousIndex);
    const upperIndex = Math.ceil(continuousIndex);
    const fraction = continuousIndex - lowerIndex;
    
    if (lowerIndex >= glucoseData.length) return baselineGlucose;
    if (upperIndex >= glucoseData.length || lowerIndex === upperIndex) {
      return glucoseData[lowerIndex]?.glucose || baselineGlucose;
    }
    
    const lowerGlucose = glucoseData[lowerIndex]?.glucose || baselineGlucose;
    const upperGlucose = glucoseData[upperIndex]?.glucose || baselineGlucose;
    
    return lowerGlucose + (upperGlucose - lowerGlucose) * fraction;
  };

  // Helper function to get food icon (keeping for backwards compatibility but now uses FoodImage)
  const getFoodIcon = (food) => {
    // This function is kept for any edge cases, but we'll primarily use FoodImage component
    switch (food.category) {
      case 'exercise':
        return '🏃';
      case 'drink':
        return '🥤';
      case 'fruit':
        return '🍎';
      case 'meat':
        return '🍗';
      case 'grain':
        return '🍞';
      case 'vegetable':
        return '🥦';
      case 'dairy':
        return '🥛';
      default:
        return '🍔';
    }
  };

  const filteredFoods = foodLibrary.filter(food =>
    food.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isFullScreen = bottomSheetHeight >= FULL_SCREEN_HEIGHT - 50;
  const chartHeight = 240;
  const yMin = 50;
  const yMax = 200;
  const chartPadding = 20;

  const glucoseToPixel = (glucose) => {
    const scaledValue = (glucose - yMin) / (yMax - yMin);
    return chartHeight - chartPadding - (scaledValue * (chartHeight - 2 * chartPadding));
  };

  const getEducationalText = () => {
    if (selectedFoods.length === 0) {
      return "Add different items to the timeline to see how they affect your blood sugar...";
    }
    
    if (lastSelectedFood && lastSelectedFood.educational_text) {
      return lastSelectedFood.educational_text;
    }
    
    return "Drag the food icons below the chart to see how timing affects your glucose levels.";
  };

  return (
    <>
      {/* Header */}
      {!isFullScreen && (
        <div className="bg-gray-50 p-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onNavigate('blood-sugar')}
              className="border border-teal-500 text-teal-600 px-3 py-1 rounded text-sm flex items-center space-x-1"
            >
              <span>Blood Sugar</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <Settings className="w-5 h-5 text-gray-600" />
        </div>
      )}

      {/* Educational Text */}
      {!isFullScreen && (
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-gray-700 text-sm leading-relaxed">
            {getEducationalText()}
          </p>
        </div>
      )}

      {/* Chart */}
      {!isFullScreen && (
        <div className="bg-gray-50 relative" style={{ marginBottom: `${bottomSheetHeight}px` }}>
          <div className="bg-white p-4 h-64 relative" ref={chartRef} style={{ marginBottom: `${10}px` }}>
            {selectedFoods.length > 0 && (
              <button 
                onClick={resetSelection}
                className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-gray-600" />
              </button>
            )}
            <ResponsiveContainer width="90%" height="90%">
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
                  domain={[yMin, yMax]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                  ticks={[70, 120, 180]}
                />
                <ReferenceLine y={70} stroke="#ef4444" strokeWidth={2} />
                <ReferenceLine y={180} stroke="#3b82f6" strokeWidth={2} />
                <ReferenceLine y={120} stroke="#22c55e" strokeWidth={2} strokeDasharray="4 4" />
                
                <Line 
                  type="monotone" 
                  dataKey="glucose" 
                  stroke="#0891b2" 
                  strokeWidth={3}
                  dot={{ fill: '#0891b2', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#0891b2' }}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Vertical lines */}
            {selectedFoods.map((food) => {
              const xPosition = getSliderPosition(food);
              const glucoseValue = getGlucoseAtPosition(food);
              const yPosition = glucoseToPixel(glucoseValue);
              
              return (
                <div
                  key={`line-${food.item}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${xPosition}px`,
                    top: `${yPosition}px`,
                    bottom: '0',
                    width: '2px',
                    backgroundColor: '#0891b2',
                    height: `${chartHeight - yPosition}px`
                  }}
                />
              );
            })}
          </div>

          {/* Draggable Food Sliders */}
          {selectedFoods.length > 0 && chartBounds.width > 0 && (
            <div className="absolute bottom-4 left-0 right-0 pointer-events-none">
              {selectedFoods.map((food) => (
                <div
                  key={`slider-${food.item}`}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${getSliderPosition(food) - 24}px`,
                    bottom: '0px'
                  }}
                >
                  <div className="flex items-center justify-center mb-1">
                      <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-t-transparent border-b-transparent border-r-teal-600 mr-2"></div>
                      <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[8px] border-t-transparent border-b-transparent border-l-teal-600"></div>
                  </div>
                  
                  <div 
                    className={`
                      bg-teal-600 rounded-xl p-2 shadow-lg border-3 border-white cursor-grab touch-none
                      ${draggedFood?.item === food.item ? 'cursor-grabbing scale-110' : ''}
                      transition-transform duration-150 hover:scale-105
                    `}
                    style={{ width: '48px', height: '48px' }}
                    onMouseDown={(e) => handleSliderStart(e, food)}
                    onTouchStart={(e) => handleSliderStart(e, food)}
                  >
                    <FoodImage 
                      food={food} 
                      size="slider" 
                      className="w-full h-full flex items-center justify-center text-white"
                    />
                  </div>
                  
                  <button 
                    onClick={() => removeFood(food)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Sheet */}
      <div 
        ref={bottomSheetRef}
        className={`
          fixed left-0 right-0 bg-white shadow-2xl z-50 max-w-md mx-auto
          transition-all duration-300 ease-out
          ${isDraggingSheet ? '' : 'transition-all duration-300'}
          ${isFullScreen ? 'top-0 rounded-none' : 'bottom-0 rounded-t-3xl'}
        `}
        style={{ 
          height: `${bottomSheetHeight}px`,
          transform: isDraggingSheet ? 'none' : undefined
        }}
        onTouchStart={handleSheetTouchStart}
        onTouchMove={handleSheetTouchMove}  
        onTouchEnd={handleSheetTouchEnd}
        onMouseDown={handleSheetMouseDown}
      >
        {isFullScreen && (
          <div className="bg-white p-4 flex items-center justify-between border-b">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-gray-800">Food Library</h1>
            </div>
            <button 
              onClick={() => setBottomSheetHeight(EXPANDED_HEIGHT)}
              className="text-gray-600 hover:text-gray-800 p-2"
            >
              ✕
            </button>
          </div>
        )}

        {!isFullScreen && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full cursor-grab active:cursor-grabbing"></div>
          </div>
        )}

        <div className={`px-4 h-full overflow-hidden flex flex-col ${isFullScreen ? 'pt-0' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 mr-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-0 bg-gray-100 rounded-lg text-sm"
              />
            </div>
            <div className="text-teal-600 text-sm font-medium whitespace-nowrap">
              {selectedFoods.length} selected
            </div>
          </div>

          <div className="flex-1 overflow-y-auto food-grid">
            <div className={`grid gap-3 pb-6 ${isFullScreen ? 'grid-cols-4' : 'grid-cols-3'}`}>
              {filteredFoods.slice(0, isFullScreen ? 50 : 30).map((food, index) => (
                <button
                  key={index}
                  onClick={() => handleFoodSelect(food)}
                  disabled={selectedFoods.length >= 3 && !selectedFoods.find(f => f.item === food.item)}
                  className={`
                    bg-white rounded-lg p-3 shadow-sm text-center hover:shadow-md transition-all
                    ${selectedFoods.find(f => f.item === food.item) ? 'ring-2 ring-teal-500 bg-teal-50' : ''}
                    ${selectedFoods.length >= 3 && !selectedFoods.find(f => f.item === food.item) ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <FoodImage 
                    food={food} 
                    size={isFullScreen ? "small" : "medium"}
                    className="mx-auto mb-2"
                  />
                  <p className="text-xs font-medium text-gray-800">{food.item}</p>
                  <p className="text-xs text-gray-500">{food.serving_size}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlucoseTracker;