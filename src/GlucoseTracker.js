import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Search, Settings, RotateCcw, GripVertical } from 'lucide-react';

// Sample food data
const foodLibrary = [
  { item: "Burger", category: "meat", serving_size: "1 piece", glucose_change: 45 },
  { item: "Tacos", category: "meat", serving_size: "2 pieces", glucose_change: 40 },
  { item: "Soda", category: "drink", serving_size: "12 oz", glucose_change: 35 },
  { item: "30 min run", category: "exercise", serving_size: "30 minutes", glucose_change: -25 },
  { item: "Chicken", category: "meat", serving_size: "4 oz", glucose_change: 5 },
  { item: "White Rice", category: "grain", serving_size: "1 cup", glucose_change: 40 },
  { item: "Broccoli", category: "vegetable", serving_size: "1 cup", glucose_change: 5 },
  { item: "Apple", category: "fruit", serving_size: "1 medium", glucose_change: 15 },
  { item: "Whole Wheat Bread", category: "grain", serving_size: "2 slices", glucose_change: 30 },
];

const GlucoseTracker = () => {
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [glucoseData, setGlucoseData] = useState([]);
  const [baselineGlucose] = useState(100);
  const [foodTimings, setFoodTimings] = useState({}); // Track continuous time positions (0-1 range)
  const [draggedFood, setDraggedFood] = useState(null);
  const [chartBounds, setChartBounds] = useState({ left: 0, width: 0 });
  const chartRef = useRef(null);
  
  // Bottom sheet states - Updated for full screen support
  const [bottomSheetHeight, setBottomSheetHeight] = useState(200); // Initial collapsed height
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const bottomSheetRef = useRef(null);
  
  const COLLAPSED_HEIGHT = 200;
  const EXPANDED_HEIGHT = 400;
  const FULL_SCREEN_HEIGHT = windowHeight;
  const SNAP_THRESHOLD = 50;

  // Track window height changes
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate initial flat line data with more granular time points
  useEffect(() => {
    const times = [];
    const startHour = 12;
    const endHour = 17;
    const pointsPerHour = 4; // 15-minute intervals
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let quarter = 0; quarter < pointsPerHour; quarter++) {
        if (hour === endHour && quarter > 0) break; // Don't go past 5 PM
        
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

  // Update chart bounds when component mounts or resizes
  useEffect(() => {
    const updateChartBounds = () => {
      if (chartRef.current) {
        const rect = chartRef.current.getBoundingClientRect();
        const margin = 40; // Chart margin
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

  // Update glucose curve when foods are selected or moved
  useEffect(() => {
    if (selectedFoods.length === 0) {
      // Reset to flat line
      setGlucoseData(prev => prev.map(point => ({ ...point, glucose: baselineGlucose })));
      return;
    }

    // Calculate glucose effect based on continuous food timings
    setGlucoseData(prev => prev.map((point, timeIndex) => {
      let glucoseValue = baselineGlucose;
      
      selectedFoods.forEach((food) => {
        // Get the continuous time position for this food (0-1 range)
        const foodTimePosition = foodTimings[food.item] !== undefined ? 
          foodTimings[food.item] : 0;
        
        // Convert to continuous time index (0 to length-1)
        const foodTimeIndex = foodTimePosition * (prev.length - 1);
        
        if (timeIndex >= foodTimeIndex) {
          const timeSinceFood = timeIndex - foodTimeIndex;
          let multiplier;
          
          if (timeSinceFood <= 1) {
            // Gradual rise - smooth interpolation
            multiplier = timeSinceFood * 0.8;
          } else if (timeSinceFood <= 3) {
            // Peak with smooth transitions
            const peakProgress = (timeSinceFood - 1) / 2; // 0 to 1 over 2 time units
            multiplier = 0.8 + (0.2 * (1 - Math.abs(peakProgress - 0.5) * 2)); // Smooth peak curve
          } else {
            // Gradual decline
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

  // Bottom sheet drag handlers - Updated for 3-state system
  const handleSheetTouchStart = (e) => {
    if (e.target.closest('.food-grid')) return; // Don't drag when interacting with food items
    setIsDraggingSheet(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(bottomSheetHeight);
  };

  const handleSheetTouchMove = (e) => {
    if (!isDraggingSheet) return;
    e.preventDefault();
    
    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY; // Positive when dragging up
    const newHeight = Math.max(COLLAPSED_HEIGHT, Math.min(FULL_SCREEN_HEIGHT, startHeight + deltaY));
    
    setBottomSheetHeight(newHeight);
  };

  const handleSheetTouchEnd = () => {
    if (!isDraggingSheet) return;
    setIsDraggingSheet(false);
    
    // 3-state snapping logic
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

  // Mouse handlers for desktop - Updated for 3-state system
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
    
    // 3-state snapping logic
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

  // Add global mouse event listeners for sheet dragging
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
    // Set default continuous timing for new food (0-1 range)
    setFoodTimings(prev => ({
      ...prev,
      [food.item]: (selectedFoods.length * 0.3) % 1 // Default spacing in continuous range
    }));
  };

  const removeFood = (foodToRemove) => {
    setSelectedFoods(selectedFoods.filter(food => food.item !== foodToRemove.item));
    setFoodTimings(prev => {
      const newTimings = { ...prev };
      delete newTimings[foodToRemove.item];
      return newTimings;
    });
  };

  const resetSelection = () => {
    setSelectedFoods([]);
    setFoodTimings({});
  };

  // Unified pointer event handlers for both mouse and touch
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
    
    // Store as continuous percentage (0-1)
    setFoodTimings(prev => ({
      ...prev,
      [draggedFood.item]: percentage
    }));
  };

  const handleSliderEnd = () => {
    setDraggedFood(null);
  };

  // Mouse event handlers
  const handleSliderMouseMove = (e) => {
    handleSliderMove(e.clientX);
  };

  // Touch event handlers
  const handleSliderTouchMove = (e) => {
    e.preventDefault(); // Prevent scrolling
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    if (draggedFood) {
      // Mouse events
      document.addEventListener('mousemove', handleSliderMouseMove);
      document.addEventListener('mouseup', handleSliderEnd);
      
      // Touch events
      document.addEventListener('touchmove', handleSliderTouchMove, { passive: false });
      document.addEventListener('touchend', handleSliderEnd);
    }

    return () => {
      // Clean up both mouse and touch events
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

  // Get glucose value at a specific time position
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
    
    // Interpolate between two points
    const lowerGlucose = glucoseData[lowerIndex]?.glucose || baselineGlucose;
    const upperGlucose = glucoseData[upperIndex]?.glucose || baselineGlucose;
    
    return lowerGlucose + (upperGlucose - lowerGlucose) * fraction;
  };

  const getFoodIcon = (food) => {
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

  const formatYAxisTick = (value) => {
    return value.toString();
  };

  // Updated state detection for 3 states
  const isFullScreen = bottomSheetHeight >= FULL_SCREEN_HEIGHT - 50;
  const isExpanded = bottomSheetHeight > (COLLAPSED_HEIGHT + EXPANDED_HEIGHT) / 2 && !isFullScreen;

  // Calculate chart height and vertical scale - Updated Y-axis range
  const chartHeight = 240; // Height of the chart area in pixels
  const yMin = 50;
  const yMax = 200; // Adjusted to ensure 180 is visible
  const chartPadding = 20; // Padding at top and bottom of chart

  // Convert glucose value to pixel position
  const glucoseToPixel = (glucose) => {
    const scaledValue = (glucose - yMin) / (yMax - yMin);
    return chartHeight - chartPadding - (scaledValue * (chartHeight - 2 * chartPadding));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Header - Hide when full screen */}
      {!isFullScreen && (
        <div className="bg-gray-50 p-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-2">
            <select className="border border-teal-500 text-teal-600 px-3 py-1 rounded text-sm">
              <option>Blood Sugar</option>
            </select>
          </div>
          <Settings className="w-5 h-5 text-gray-600" />
        </div>
      )}

      {/* Educational Text - Hide when full screen */}
      {!isFullScreen && (
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-gray-700 text-sm leading-relaxed">
            {selectedFoods.length === 0 
              ? "Add different items to the timeline to see how they affect your blood sugar..."
              : "Drag the food icons below the chart to see how timing affects your glucose levels."
            }
          </p>
        </div>
      )}

      {/* Chart with Draggable Sliders - Hide when full screen */}
      {!isFullScreen && (
        <div className="bg-gray-50 relative" style={{ marginBottom: `${bottomSheetHeight}px` }}>
          <div className="bg-white p-4 h-64 relative" ref={chartRef} style={{ marginBottom: `${10}px` }}>
            {/* Reset Button in top right corner */}
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
                  tickFormatter={(value, index) => {
                    // Only show hour labels, skip quarter-hour labels
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
                  tickFormatter={formatYAxisTick}
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

            {/* Custom vertical lines that stop at the curve */}
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
              {selectedFoods.map((food, index) => (
                <div
                  key={`slider-${food.item}`}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${getSliderPosition(food) - 24}px`, // Center the 48px wide element
                    bottom: '0px'
                  }}
                >
                  {/* Triangular arrows */}
                  <div className="flex items-center justify-center mb-1">
                      <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-t-transparent border-b-transparent border-r-teal-600 mr-2"></div>
                      <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[8px] border-t-transparent border-b-transparent border-l-teal-600"></div>
                  </div>
                  
                  {/* Draggable handle with food icon */}
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
                    <div className="text-xl flex items-center justify-center">
                      {getFoodIcon(food)}
                    </div>
                  </div>
                  
                  {/* Remove button */}
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

      {/* Bottom Sheet - Updated styling for full screen */}
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
        {/* Full Screen Header */}
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

        {/* Drag Handle - Hide in full screen */}
        {!isFullScreen && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full cursor-grab active:cursor-grabbing"></div>
          </div>
        )}

        {/* Content */}
        <div className={`px-4 h-full overflow-hidden flex flex-col ${isFullScreen ? 'pt-0' : ''}`}>
          {/* Search and Selection Count */}
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



          {/* Food Grid */}
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
                  <div className={`bg-gradient-to-br from-orange-400 to-red-500 rounded-lg mx-auto mb-2 flex items-center justify-center ${isFullScreen ? 'w-10 h-10' : 'w-12 h-12'}`}>
                    <span className={`text-white ${isFullScreen ? 'text-lg' : 'text-xl'}`}>
                      {getFoodIcon(food)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-800">{food.item}</p>
                  <p className="text-xs text-gray-500">{food.serving_size}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlucoseTracker;