import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, RotateCcw, ChevronDown, X} from 'lucide-react';
import { settings } from './data/settings';
import ItemImage from './ItemImage';

// Import the JSON data (you'll need to fetch this or import it)
// For now, assuming you have a way to import it
import libraryData from './data/library.json';

// Calculate heights based on screen size
const getBottomSheetHeights = (screenHeight, isStandaloneMode = false) => {
  const isMobileBrowser = !isStandaloneMode && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  let targetHeight;
  if (isMobileBrowser) {
    // 35-40% for mobile browsers, but ensure minimum usability
    targetHeight = screenHeight * 0.33;
  } 

  else if (isStandaloneMode) {
    targetHeight = screenHeight * 0.44;
  }

  else {
    // 50% for desktop
    targetHeight = screenHeight * 0.49;
  }
  
  return {
    COLLAPSED_HEIGHT: targetHeight,
  };
};

const GlucoseTracker = ({ onNavigate = () => {} }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [glucoseData, setGlucoseData] = useState([]);
  const [baselineGlucose] = useState(settings.baselineGlucose);
  const [itemTimings, setItemTimings] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [clickedItem, setClickedItem] = useState(null);
  const [lastSelectedFood, setLastSelectedFood] = useState(null);
  const chartRef = useRef(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isStandaloneMode, setIsStandaloneMode] = useState(false);

  // Extract itemLibrary from the JSON data
  const itemLibrary = libraryData.itemLibrary;

  const [windowHeight, setWindowHeight] = useState(() => {
    // Get the actual viewport height accounting for mobile URL bars
    return window.visualViewport ? window.visualViewport.height : window.innerHeight;
  });

  // Initialize bottomSheetHeight - moved before it's used
  const getCurrentCollapsedHeight = useCallback(() => getBottomSheetHeights(windowHeight, isStandaloneMode).COLLAPSED_HEIGHT, [windowHeight, isStandaloneMode]);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(() => getCurrentCollapsedHeight());

  // Detect if we're in standalone/PWA mode
  useEffect(() => {
    const checkStandaloneMode = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone ||
                          document.referrer.includes('android-app://');
      setIsStandaloneMode(isStandalone);
    };
    
    checkStandaloneMode();
  }, []);

  // 1. Add a function to control body scroll
  const setBodyScrolling = useCallback((enabled) => {
    if (enabled) {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    } else {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }
  }, []);

  // Function to get real viewport height
  const getRealViewportHeight = useCallback(() => {
    return window.visualViewport ? window.visualViewport.height : window.innerHeight;
  }, []);

  // Enhanced keyboard detection
  useEffect(() => {
    const handleViewportChange = () => {
      const currentHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const windowHeight = window.innerHeight;
      
      // If viewport height is significantly less than window height, keyboard is likely visible
      if (windowHeight - currentHeight > 100) {
        setIsKeyboardVisible(true);
        setKeyboardHeight(windowHeight - currentHeight);
      } else {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    };

    // Set initial value
    handleViewportChange();

    // Listen for viewport changes
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
    }

    // Also listen for focus/blur on inputs
    const handleFocus = (e) => {
      if (e.target.tagName === 'INPUT') {
        // Small delay to let keyboard animation complete
        setTimeout(handleViewportChange, 300);
      }
    };

    const handleBlur = () => {
      setTimeout(() => {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }, 100);
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  // Set CSS custom property for viewport height
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = getRealViewportHeight();
      setWindowHeight(vh);
      // Set CSS custom property that you can use in your styles
      document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`);
    };

    // Set initial value
    setViewportHeight();

    // Listen for viewport changes (better than just resize)
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, [getRealViewportHeight]);
  
  // Bottom sheet states
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const bottomSheetRef = useRef(null);

  const FULL_SCREEN_HEIGHT = windowHeight;

  // Calculate the effective height when keyboard is visible
  const getEffectiveHeight = useCallback((targetHeight) => {
    if (!isKeyboardVisible) return targetHeight;
    
    // When keyboard is visible, ensure we have enough space for search bar and first row
    const minVisibleHeight = 200; // Space for search bar (~60px) + one row (~90px) + padding (~50px)
    const availableHeight = windowHeight - keyboardHeight;
    const effectiveHeight = Math.min(targetHeight, Math.max(minVisibleHeight, availableHeight));
    
    return effectiveHeight;
  }, [isKeyboardVisible, windowHeight, keyboardHeight]);

  // Update bottom sheet height when keyboard visibility changes
  useEffect(() => {
    if (isKeyboardVisible) {
      const currentCollapsedHeight = getCurrentCollapsedHeight();
      const isCurrentlyFullScreen = bottomSheetHeight >= FULL_SCREEN_HEIGHT - 50;
      
      if (isCurrentlyFullScreen) {
        // If full screen, maintain full screen but adjust for keyboard
        const newHeight = getEffectiveHeight(FULL_SCREEN_HEIGHT);
        setBottomSheetHeight(newHeight);
      } else {
        // If collapsed, adjust collapsed height for keyboard
        const newHeight = getEffectiveHeight(currentCollapsedHeight);
        setBottomSheetHeight(newHeight);
      }
    } else {
      // Keyboard hidden - restore to previous state
      const currentCollapsedHeight = getCurrentCollapsedHeight();
      const wasFullScreen = bottomSheetHeight >= (windowHeight - keyboardHeight) * 0.8; // Roughly detect if it was full screen
      
      if (wasFullScreen) {
        setBottomSheetHeight(FULL_SCREEN_HEIGHT);
      } else {
        setBottomSheetHeight(currentCollapsedHeight);
      }
    }
  }, [isKeyboardVisible, keyboardHeight, windowHeight, FULL_SCREEN_HEIGHT, bottomSheetHeight, getCurrentCollapsedHeight, getEffectiveHeight]);

  // Chart dimensions from settings
  const chartHeight = settings.chartHeight;
  const chartWidth = settings.chartWidth;
  const yMin = settings.yMin;
  const yMax = settings.yMax;

  // Track window height changes
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle clicks outside bottom sheet - modified to not trigger when keyboard is visible
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isKeyboardVisible) return; // Don't handle clicks when keyboard is visible
      
      if (bottomSheetRef.current && !bottomSheetRef.current.contains(e.target)) {
        const currentCollapsedHeight = getCurrentCollapsedHeight();
        if (bottomSheetHeight > currentCollapsedHeight) {
          setBottomSheetHeight(currentCollapsedHeight);
        }
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [bottomSheetHeight, windowHeight, isKeyboardVisible, getCurrentCollapsedHeight]);

  // Generate initial flat line data
  useEffect(() => {
    const times = [];
    const startHour = settings.startHour;
    const endHour = settings.endHour;
    const pointsPerHour = settings.pointsPerHour;
    
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

  // Calculate glucose effect for a specific food at a specific time
  const calculateFoodEffect = useCallback((food, timeSinceConsumption) => {
    // Use food-specific timing or fallback to defaults
    const peakTime = food.peakTime || 1.5; // Default peak at 1.5 hours
    const duration = food.duration || 4.0; // Default duration of 4 hours
    
    // If before consumption or after duration, no effect
    if (timeSinceConsumption < 0 || timeSinceConsumption > duration) {
      return 0;
    }
    
    let multiplier = 0;
    
    if (timeSinceConsumption <= peakTime) {
      // Ramp up to peak - using a smooth curve
      const progress = timeSinceConsumption / peakTime;
      multiplier = Math.sin(progress * Math.PI / 2); // Smooth ramp up
    } else {
      // Ramp down from peak - using exponential decay
      const declineTime = timeSinceConsumption - peakTime;
      const maxDeclineTime = duration - peakTime;
      const declineProgress = declineTime / maxDeclineTime;
      multiplier = Math.cos(declineProgress * Math.PI / 2); // Smooth ramp down
    }
    
    return food.glucose_change * multiplier;
  }, []);

  // Update glucose curve with realistic timing
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
        
        // Convert time indices to hours for realistic calculation
        const currentTimeHours = (timeIndex / (prev.length - 1)) * 5; // 5-hour span
        const foodTimeHours = (foodTimeIndex / (prev.length - 1)) * 5;
        const timeSinceFood = currentTimeHours - foodTimeHours;
        
        const foodEffect = calculateFoodEffect(food, timeSinceFood);
        glucoseValue += foodEffect;
      });
      
      return {
        ...point,
        glucose: Math.max(50, glucoseValue)
      };
    }));
  }, [selectedItems, baselineGlucose, itemTimings, calculateFoodEffect]);

  // Utility functions
  const mapYValueToPixel = useCallback((yValue) => {
    return chartHeight - ((yValue - yMin) / (yMax - yMin)) * chartHeight;
  }, [chartHeight, yMin, yMax]);

  const getGlucoseAtPosition = useCallback((food) => {
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
  }, [itemTimings, glucoseData, baselineGlucose]);

  // Function to generate line segments with appropriate colors
  const generateLineSegments = useCallback(() => {
    if (glucoseData.length < 2) return [];
    
    const segments = [];
    let currentSegment = [];
    let currentColor = null;
    
    for (let i = 0; i < glucoseData.length; i++) {
      const point = glucoseData[i];
      const x = (i / (glucoseData.length - 1)) * chartWidth;
      const y = mapYValueToPixel(point.glucose);
      
      // Determine color based on glucose value
      const isOutOfRange = point.glucose > settings.highGlucoseThreshold || point.glucose < settings.lowGlucoseThreshold;
      const segmentColor = isOutOfRange ? settings.highGlucoseColor : settings.normalGlucoseColor;
      
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
  }, [glucoseData, chartWidth, mapYValueToPixel]);

  // Bottom sheet handlers - modified to prevent dragging when keyboard is visible
  const handleSheetTouchStart = useCallback((e) => {
    if (e.target.closest('.food-grid') || isKeyboardVisible) return;
    
    setIsDraggingSheet(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(bottomSheetHeight);
    
    // Prevent body scrolling when starting to drag
    setBodyScrolling(false);
  }, [isKeyboardVisible, bottomSheetHeight, setBodyScrolling]);

  const handleSheetTouchMove = useCallback((e) => {
    if (!isDraggingSheet || isKeyboardVisible) return;
    
    // Always prevent default when dragging
    e.preventDefault();
    e.stopPropagation();
    
    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    const currentCollapsedHeight = getCurrentCollapsedHeight();
    const newHeight = Math.max(currentCollapsedHeight, Math.min(FULL_SCREEN_HEIGHT, startHeight + deltaY));
    
    setBottomSheetHeight(newHeight);
  }, [isDraggingSheet, isKeyboardVisible, startY, startHeight, getCurrentCollapsedHeight, FULL_SCREEN_HEIGHT]);

  const handleSheetTouchEnd = useCallback(() => {
    if (!isDraggingSheet || isKeyboardVisible) return;
    
    setIsDraggingSheet(false);
    
    // Re-enable body scrolling
    setBodyScrolling(true);
    
    // Only two states: collapsed or full screen
    const currentCollapsedHeight = getCurrentCollapsedHeight();
    const midPoint = (currentCollapsedHeight + FULL_SCREEN_HEIGHT) / 2;
    
    let targetHeight;
    if (bottomSheetHeight < midPoint) {
      targetHeight = currentCollapsedHeight;
    } else {
      targetHeight = FULL_SCREEN_HEIGHT;
    }
    
    setBottomSheetHeight(targetHeight);
  }, [isDraggingSheet, isKeyboardVisible, setBodyScrolling, getCurrentCollapsedHeight, FULL_SCREEN_HEIGHT, bottomSheetHeight]);

  const handleSheetMouseDown = useCallback((e) => {
    if (e.target.closest('.food-grid') || isKeyboardVisible) return;
    
    setIsDraggingSheet(true);
    setStartY(e.clientY);
    setStartHeight(bottomSheetHeight);
    
    // Prevent body scrolling when starting to drag
    setBodyScrolling(false);
  }, [isKeyboardVisible, bottomSheetHeight, setBodyScrolling]);

  const handleSheetMouseMove = useCallback((e) => {
    if (!isDraggingSheet || isKeyboardVisible) return;
    
    const currentY = e.clientY;
    const deltaY = startY - currentY;
    const currentCollapsedHeight = getCurrentCollapsedHeight();
    const newHeight = Math.max(currentCollapsedHeight, Math.min(FULL_SCREEN_HEIGHT, startHeight + deltaY));
    
    setBottomSheetHeight(newHeight);
  }, [isDraggingSheet, isKeyboardVisible, startY, startHeight, getCurrentCollapsedHeight, FULL_SCREEN_HEIGHT]);

  const handleSheetMouseUp = useCallback(() => {
    if (!isDraggingSheet || isKeyboardVisible) return;
    
    setIsDraggingSheet(false);
    
    // Re-enable body scrolling
    setBodyScrolling(true);
    
    // Only two states: collapsed or full screen
    const currentCollapsedHeight = getCurrentCollapsedHeight();
    const midPoint = (currentCollapsedHeight + FULL_SCREEN_HEIGHT) / 2;
    
    let targetHeight;
    if (bottomSheetHeight < midPoint) {
      targetHeight = currentCollapsedHeight;
    } else {
      targetHeight = FULL_SCREEN_HEIGHT;
    }
    
    setBottomSheetHeight(targetHeight);
  }, [isDraggingSheet, isKeyboardVisible, setBodyScrolling, getCurrentCollapsedHeight, FULL_SCREEN_HEIGHT, bottomSheetHeight]);

  useEffect(() => {
    // Cleanup function to restore scrolling if component unmounts during drag
    return () => {
      setBodyScrolling(true);
    };
  }, [setBodyScrolling]);

  useEffect(() => {
    if (isDraggingSheet) {
      document.addEventListener('mousemove', handleSheetMouseMove);
      document.addEventListener('mouseup', handleSheetMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleSheetMouseMove);
      document.removeEventListener('mouseup', handleSheetMouseUp);
    };
  }, [isDraggingSheet, handleSheetMouseMove, handleSheetMouseUp]);

  const removeFood = useCallback((foodToRemove) => {
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
  }, [selectedItems, lastSelectedFood, clickedItem]);
  
  const handleFoodSelect = useCallback((food) => {
    if (selectedItems.find(f => f.item === food.item)) {
      removeFood(food);
      return;
    }
    
    if (selectedItems.length >= settings.maxSelectedItems) return;
    
    setSelectedItems([...selectedItems, food]);
    setLastSelectedFood(food);
    
    // Clear clicked item when selecting a new food to ensure educational text updates
    setClickedItem(null);
    
    const spacing = 0.25;
    const startPosition = 0.1;
    const newPosition = startPosition + (selectedItems.length * spacing);
    
    setItemTimings(prev => ({
      ...prev,
      [food.item]: Math.min(newPosition, 0.9)
    }));
  }, [selectedItems, removeFood]);

  const resetSelection = useCallback(() => {
    setSelectedItems([]);
    setItemTimings({});
    setLastSelectedFood(null);
    setClickedItem(null);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Slider handlers
  const handleSliderStart = useCallback((e, food) => {
    e.preventDefault();
    setDraggedItem(food);
    // Clear clicked item when starting to drag to prevent conflicts
    setClickedItem(null);
  }, []);

  const handleSliderClick = useCallback((e, food) => {
    if (!draggedItem) {
      e.stopPropagation();
      setClickedItem(clickedItem?.item === food.item ? null : food);
    }
  }, [draggedItem, clickedItem]);

  const handleSliderMove = useCallback((clientX) => {
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
  }, [draggedItem, chartWidth]);

  const handleSliderEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const handleSliderMouseMove = useCallback((e) => {
    handleSliderMove(e.clientX);
  }, [handleSliderMove]);

  const handleSliderTouchMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  }, [handleSliderMove]);

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
  }, [draggedItem, handleSliderMouseMove, handleSliderEnd, handleSliderTouchMove]);

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
        </div>
      )}

      {/* Educational Text */}
      {!isFullScreen && (
        <div className="bg-[#E7EEEB] p-4 text-center">
          <p className="text-gray-700 text-sm font-semibold leading-relaxed">
            {getEducationalText()}
          </p>
        </div>
      )}

      {/* Chart */}
      {!isFullScreen && (
        <div className="bg-[#E7EEEB] relative mb-20">
            {/* Y-axis Labels - positioned at exact reference line positions */}
            <div 
              className={`absolute text-xs text-gray-400`} 
              style={{ 
                height: chartHeight, 
                top: '20px',
                left: '5px'
              }}
            >
              <div 
                className="absolute transform -translate-y-1/2" 
                style={{ top: `${mapYValueToPixel(settings.highGlucoseThreshold)}px` }}
              >
                {settings.highGlucoseThreshold}
              </div>
              <div 
                className="absolute transform -translate-y-1/2" 
                style={{ top: `${mapYValueToPixel(settings.baselineGlucose)}px` }}
              >
                {settings.baselineGlucose}
              </div>
              <div 
                className="absolute transform -translate-y-1/2" 
                style={{ top: `${mapYValueToPixel(settings.lowGlucoseThreshold)}px` }}
              >
                {settings.lowGlucoseThreshold}
              </div>
              <div 
                className="absolute transform -translate-y-1/2" 
                style={{ top: `${mapYValueToPixel(50)}px` }}
              >
                50
              </div>
            </div>
          <div className="bg-white mx-6 rounded-xl relative overflow-hidden" ref={chartRef} style={{ height: `${chartHeight}px` }}>
            {/* Chart area - full width clean chart */}
            <div className="chart-area relative" style={{ height: chartHeight, width: chartWidth, margin: '20px auto' }}>
              
              {/* Custom SVG for everything - full control */}
              <svg className="w-full h-full">
                {/* Full-width reference lines */}
                <line x1="0" x2="100%" y1={mapYValueToPixel(settings.lowGlucoseThreshold)} y2={mapYValueToPixel(settings.lowGlucoseThreshold)} stroke={settings.lowGlucoseReferenceLine} strokeWidth="2" />
                <line x1="0" x2="100%" y1={mapYValueToPixel(settings.highGlucoseThreshold)} y2={mapYValueToPixel(settings.highGlucoseThreshold)} stroke={settings.highGlucoseReferenceLine} strokeWidth="2" />
                
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
              </svg>
            </div>
          </div>

          {/* Connection Lines Overlay - NEW SVG OVERLAY */}
          {selectedItems.length > 0 && (
            <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none" style={{ top: '20px', width: `${chartWidth}px` }}>
              <svg 
                className="w-full h-full absolute"
                style={{ 
                  width: `${chartWidth}px`,
                  height: `${chartHeight + 125}px`,
                  left: '0',
                  top: '0'
                }}
                viewBox={`0 0 ${chartWidth} ${chartHeight + 125}`}
              >
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
                      y2={chartHeight + 25} // Line extends to food icon level
                      stroke={settings.connectionLineColor}
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  );
                })}
              </svg>
            </div>
          )}

          {/* X-axis Labels - outside the chart */}
          <div 
            className={`absolute left-1/2 transform -translate-x-1/2 flex justify-between text-xs text-gray-400`} 
            style={{ 
              width: chartWidth,
              bottom: '-25px'
            }}
          >
              <span className='ml-5'>{settings.startHour === 12 ? '12' : settings.startHour > 12 ? settings.startHour - 12 : settings.startHour} PM</span>
              <span>{settings.startHour + 1 === 12 ? '12' : settings.startHour + 1 > 12 ? settings.startHour + 1 - 12 : settings.startHour + 1} PM</span>
              <span>{settings.startHour + 2 === 12 ? '12' : settings.startHour + 2 > 12 ? settings.startHour + 2 - 12 : settings.startHour + 2} PM</span>
              <span>{settings.startHour + 3 === 12 ? '12' : settings.startHour + 3 > 12 ? settings.startHour + 3 - 12 : settings.startHour + 3} PM</span>
              <span>{settings.startHour + 4 === 12 ? '12' : settings.startHour + 4 > 12 ? settings.startHour + 4 - 12 : settings.startHour + 4} PM</span>
              <span className='mr-5'>{settings.endHour === 12 ? '12' : settings.endHour > 12 ? settings.endHour - 12 : settings.endHour} PM</span>
            </div>
            {/* Draggable Food Icons */}
            {selectedItems.length > 0 && (
            <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none" style={{ width: `${chartWidth}px`, top: `${chartHeight + 15}px` }}>
              {selectedItems.map((menuItem) => {
                const timePosition = itemTimings[menuItem.item] || 0;
                const x = timePosition * chartWidth;
                
                return (
                  <div
                    key={`slider-${menuItem.item}`}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${x}px`,
                      top: '0px',
                      transform: 'translateX(-50%)' // Center the icon on the line
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
          bottom: '0', // Always keep at bottom
          transform: isDraggingSheet ? 'none' : undefined,
          touchAction: 'none', // Add this to prevent default touch behaviors
          position: 'fixed'
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
              onClick={() => setBottomSheetHeight(getCurrentCollapsedHeight())}
              className="text-gray-600 hover:text-gray-800 p-2"
            >
              ✕
            </button>
          </div>
        )}

        {!isFullScreen && !isKeyboardVisible && (
          <div 
            className="flex justify-center pt-3 pb-2"
            style={{ touchAction: 'none' }}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full cursor-grab active:cursor-grabbing"></div>
          </div>
        )}
        <div className={`px-4 h-full overflow-hidden flex flex-col ${isFullScreen ? 'pt-0' : ''} ${!isFullScreen && isKeyboardVisible ? 'pt-4' : ''}`}>
          {/* Search bar and refresh button row */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border-0 bg-gray-100 rounded-2xl text-sm focus:outline-none"
                style={{
                  WebkitAppearance: 'none',
                  fontSize: '16px' // Prevents zoom on iOS
                }}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {selectedItems.length > 0 && (
              <button 
                onClick={resetSelection}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors flex-shrink-0"
              >
                <RotateCcw className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto food-grid">
            <div className={`grid gap-3 pb-6 grid-cols-3 justify-items-center pt-4`}>
              {filteredItems.slice(0, itemLibrary.length).map((menuItem) => (
                <button
                  key={menuItem.item}
                  onClick={() => handleFoodSelect(menuItem)}
                  disabled={selectedItems.length >= settings.maxSelectedItems && !selectedItems.find(f => f.item === menuItem.item)}
                  className={`
                    bg-gray-200 rounded-2xl p-3 shadow-sm text-center hover:shadow-md transition-all flex flex-col justify-center items-center
                    ${selectedItems.find(f => f.item === menuItem.item) ? 'ring-2 ring-teal-500 bg-teal-50' : ''}
                    ${selectedItems.length >= settings.maxSelectedItems && !selectedItems.find(f => f.item === menuItem.item) ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  style={{ width: '90px', height: '90px' }}
                >
                  {/* Standardized Icon Container */}
                  <div className="flex justify-center items-center mb-1" style={{ height: '36px' }}>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <ItemImage 
                        item={menuItem} 
                        size="medium"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* Text with wrapping */}
                  <div className="text-center flex-1 flex flex-col justify-center">
                    <p className="text-xs font-semibold text-gray-900 leading-tight mb-1" style={{ lineHeight: '1.1' }}>
                      {menuItem.item}
                    </p>
                    {settings.showServingSize && (
                      <p className="text-xs text-gray-500 leading-tight" style={{ fontSize: '10px', lineHeight: '1.0' }}>
                        {menuItem.serving_size}
                      </p>
                    )}
                  </div>
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