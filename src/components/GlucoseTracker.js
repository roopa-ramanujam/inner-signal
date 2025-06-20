import React, { useState, useEffect, useRef } from 'react';
import { Search, Settings, RotateCcw, ChevronDown, X} from 'lucide-react';
import { itemLibrary } from './data/library';
import ItemImage from './ItemImage';

const GlucoseTracker = ({ onNavigate = () => {} }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [glucoseData, setGlucoseData] = useState([]);
  const [baselineGlucose] = useState(120);
  const [itemTimings, setItemTimings] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [clickedItem, setClickedItem] = useState(null);
  const [lastSelectedFood, setLastSelectedFood] = useState(null);
  const chartRef = useRef(null);
  
  // Bottom sheet states
  const [bottomSheetHeight, setBottomSheetHeight] = useState(225);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const bottomSheetRef = useRef(null);
  
  const COLLAPSED_HEIGHT = 225;
  const EXPANDED_HEIGHT = 500;
  const FULL_SCREEN_HEIGHT = windowHeight;

  document.body.style.overflow='hidden';

  // Chart dimensions
  const chartHeight = 225; // 30% less than 300
  const chartWidth = 400;
  const yMin = 20;
  const yMax = 220;

  // Track window height changes
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle clicks outside bottom sheet
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bottomSheetRef.current && !bottomSheetRef.current.contains(e.target)) {
        if (bottomSheetHeight > COLLAPSED_HEIGHT) {
          setBottomSheetHeight(COLLAPSED_HEIGHT);
        }
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [bottomSheetHeight, COLLAPSED_HEIGHT]);

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

  // Update glucose curve
  useEffect(() => {
    if (selectedItems.length === 0) {
      setGlucoseData(prev => prev.map(point => ({ ...point, glucose: baselineGlucose })));
      return;
    }

    setGlucoseData(prev => prev.map((point, timeIndex) => {
      let glucoseValue = baselineGlucose;
      
      selectedItems.forEach((food) => {
        const foodTimePosition = itemTimings[food.item] !== undefined ? 
          itemTimings[food.item] : 0;
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
  }, [selectedItems, baselineGlucose, itemTimings]);

  // Utility functions
  const mapYValueToPixel = (yValue) => {
    return chartHeight - ((yValue - yMin) / (yMax - yMin)) * chartHeight;
  };

  const getGlucoseAtPosition = (food) => {
    const timePosition = itemTimings[food.item] || 0;
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

  // Function to generate line segments with appropriate colors
  const generateLineSegments = () => {
    if (glucoseData.length < 2) return [];
    
    const segments = [];
    let currentSegment = [];
    let currentColor = null;
    
    for (let i = 0; i < glucoseData.length; i++) {
      const point = glucoseData[i];
      const x = (i / (glucoseData.length - 1)) * chartWidth;
      const y = mapYValueToPixel(point.glucose);
      
      // Determine color based on glucose value
      const isOutOfRange = point.glucose > 180 || point.glucose < 70;
      const segmentColor = isOutOfRange ? '#FF7B7B' : '#629C47'; // red for out of range, green for normal
      
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
      if (i === glucoseData.length - 1 && currentSegment.length > 0) {
        segments.push({
          points: currentSegment,
          color: currentColor
        });
      }
    }
    
    return segments;
  };

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
    if (selectedItems.find(f => f.item === food.item)) {
      removeFood(food);
      return;
    }
    
    if (selectedItems.length >= 3) return;
    
    setSelectedItems([...selectedItems, food]);
    setLastSelectedFood(food);
    
    const spacing = 0.25;
    const startPosition = 0.1;
    const newPosition = startPosition + (selectedItems.length * spacing);
    
    setItemTimings(prev => ({
      ...prev,
      [food.item]: Math.min(newPosition, 0.9)
    }));
  };

  const removeFood = (foodToRemove) => {
    setSelectedItems(selectedItems.filter(food => food.item !== foodToRemove.item));
    setItemTimings(prev => {
      const newTimings = { ...prev };
      delete newTimings[foodToRemove.item];
      return newTimings;
    });
    
    if (lastSelectedFood?.item === foodToRemove.item) {
      const remainingFoods = selectedItems.filter(food => food.item !== foodToRemove.item);
      setLastSelectedFood(remainingFoods.length > 0 ? remainingFoods[remainingFoods.length - 1] : null);
    }

    if (clickedItem?.item === foodToRemove.item) {
      setClickedItem(null);
    }
  };

  const resetSelection = () => {
    setSelectedItems([]);
    setItemTimings({});
    setLastSelectedFood(null);
    setClickedItem(null);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Slider handlers
  const handleSliderStart = (e, food) => {
    e.preventDefault();
    setDraggedItem(food);
  };

  const handleSliderClick = (e, food) => {
    if (!draggedItem) {
      e.stopPropagation();
      setClickedItem(clickedItem?.item === food.item ? null : food);
    }
  };

  const handleSliderMove = (clientX) => {
    if (!draggedItem || !chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const chartArea = chartRef.current.querySelector('.chart-area');
    const chartRect = chartArea ? chartArea.getBoundingClientRect() : rect;
    
    const mouseX = clientX - chartRect.left;
    const percentage = Math.max(0, Math.min(1, mouseX / chartWidth));
    
    setItemTimings(prev => ({
      ...prev,
      [draggedItem.item]: percentage
    }));
  };

  const handleSliderEnd = () => {
    setDraggedItem(null);
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
    if (draggedItem) {
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
  }, [draggedItem]);

  const filteredItems = itemLibrary.filter(food =>
    food.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isFullScreen = bottomSheetHeight >= FULL_SCREEN_HEIGHT - 50;

  const getEducationalText = () => {
    if (selectedItems.length === 0) {
      return "Add different items to the timeline to see how they affect your blood sugar...";
    }
    
    if (clickedItem && clickedItem.educational_text) {
      return clickedItem.educational_text;
    }
    
    if (lastSelectedFood && lastSelectedFood.educational_text) {
      return lastSelectedFood.educational_text;
    }
    
    return "Drag the food icons below the chart to see how timing affects your glucose levels. Click on an icon to learn more about it.";
  };

  return (
    <div className="bg-[#E7EEEB] min-h-screen">
      {/* Header */}
      {!isFullScreen && (
        <div className="bg-[#E7EEEB] p-4 flex items-center justify-between border-b">
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
        <div className="bg-[#E7EEEB] p-4 text-center">
          <p className="text-gray-700 text-md font-semibold leading-relaxed">
            {getEducationalText()}
          </p>
        </div>
      )}

      {/* Chart */}
      {!isFullScreen && (
        <div className="bg-[#E7EEEB] relative" style={{ marginBottom: `${bottomSheetHeight + 80}px` }}>
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
          <div className="bg-white mx-6 rounded-xl relative overflow-hidden" ref={chartRef} style={{ height: `${chartHeight}px` }}>
            {selectedItems.length > 0 && (
              <button 
                onClick={resetSelection}
                className="absolute top-4 right-4 z-20 bg-[#E7EEEB] hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-gray-600" />
              </button>
            )}

            {/* Chart area - full width clean chart */}
            <div className="chart-area relative" style={{ height: chartHeight, width: chartWidth, margin: '20px auto' }}>
              
              {/* Custom SVG for everything - full control */}
              <svg className="w-full h-full">
                {/* Full-width reference lines */}
                <line x1="0" x2="100%" y1={mapYValueToPixel(70)} y2={mapYValueToPixel(70)} stroke="#FF7B7B" strokeWidth="2" />
                <line x1="0" x2="100%" y1={mapYValueToPixel(180)} y2={mapYValueToPixel(180)} stroke="#B9BCF9" strokeWidth="2" />
                
                {/* Glucose line segments with appropriate colors */}
                {generateLineSegments().map((segment, index) => (
                  <polyline
                    key={`segment-${index}`}
                    points={segment.points.join(' ')}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="3"
                    strokeDasharray="4 4"
                  />
                ))}
                
                {/* Glucose data points with color based on range - commented out to remove dots */}
                {/* {glucoseData.map((point, index) => {
                  const x = (index / (glucoseData.length - 1)) * chartWidth;
                  const y = mapYValueToPixel(point.glucose);
                  const isOutOfRange = point.glucose > 180 || point.glucose < 70;
                  const pointColor = isOutOfRange ? '#ef4444' : '#22c55e';
                  
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="2"
                      fill={pointColor}
                      stroke={pointColor}
                      strokeWidth="2"
                    />
                  );
                })} */}

                {/* Connection lines from food icons to glucose curve */}
                {selectedItems.map((food) => {
                  const timePosition = itemTimings[food.item] || 0;
                  const x = timePosition * chartWidth;
                  const glucoseValue = getGlucoseAtPosition(food);
                  const y = mapYValueToPixel(glucoseValue);
                  
                  return (
                    <line
                      key={`connection-${food.item}`}
                      x1={x}
                      y1={y}
                      x2={x}
                      y2={chartHeight + 40}
                      stroke="#0891b2"
                      strokeWidth="2"
                    />
                  );
                })}
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
              <span>5 PM</span>
            </div>
            {/* Draggable Food Icons */}
            {selectedItems.length > 0 && (
            <div className="absolute inset-0 pointer-events-none"> {/* Changed this line */}
              {selectedItems.map((menuItem) => {
                const timePosition = itemTimings[menuItem.item] || 0;
                const x = timePosition * chartWidth;
                
                return (
                  <div
                    key={`slider-${menuItem.item}`}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${x}px`,
                      bottom: '-60px'
                    }}
                  >
                    <div 
                      className={`
                        bg-teal-600 rounded-xl p-2 border-3 border-white cursor-grab touch-none
                        ${draggedItem?.item === menuItem.item ? 'cursor-grabbing scale-110' : ''}
                        ${clickedItem?.item === menuItem.item ? 'bg-gray-500' : ''}
                        transition-all duration-150 hover:scale-105
                        drop-shadow-2xl shadow-2xl
                      `}
                      style={{ width: '48px', height: '48px' }}
                      onMouseDown={(e) => handleSliderStart(e, menuItem)}
                      onTouchStart={(e) => handleSliderStart(e, menuItem)}
                      onClick={(e) => handleSliderClick(e, menuItem)}
                    >
                      <ItemImage 
                        item={menuItem} 
                        size="slider" 
                        className="w-full h-full flex items-center justify-center text-white"
                      />
                    </div>
                    
                    <button 
                      onClick={() => removeFood(menuItem)}
                      className="absolute -top-1 -right-1 bg-gray-300 text-gray-600 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-400 z-10 font-light"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
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
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-0 bg-gray-100 rounded-3xl text-lg focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="text-center mb-2">
            <div className="text-teal-600 text-lg font-medium">
              {selectedItems.length} selected
            </div>
          </div>

          <div className="flex-1 overflow-y-auto food-grid">
            <div className={`grid gap-4 pb-6 grid-cols-3 justify-items-center pt-4`}>
              {filteredItems.slice(0, itemLibrary.length).map((menuItem, index) => (
                <button
                  key={index}
                  onClick={() => handleFoodSelect(menuItem)}
                  disabled={selectedItems.length >= 3 && !selectedItems.find(f => f.item === menuItem.item)}
                  className={`
                    bg-gray-200 rounded-2xl p-4 shadow-sm text-center hover:shadow-md transition-all w-24 h-24 flex flex-col justify-center items-center
                    ${selectedItems.find(f => f.item === menuItem.item) ? 'ring-2 ring-teal-500 bg-teal-50' : ''}
                    ${selectedItems.length >= 3 && !selectedItems.find(f => f.item === menuItem.item) ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <ItemImage 
                    item={menuItem} 
                    size="medium"
                    className="mx-auto mb-2"
                  />
                  <p className="text-sm font-semibold text-gray-900">{menuItem.item}</p>
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