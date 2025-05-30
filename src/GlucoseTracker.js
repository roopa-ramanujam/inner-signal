import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Search, Settings, RotateCcw, GripVertical } from 'lucide-react';

// Sample food data - replace with your JSON file
const foodData = [
  { item: "Tacos", category: "meal", serving_size: "2 pieces", glucose_change: 45, glycemic_index: 70, learning_module_text: "Tacos with corn tortillas can cause moderate glucose spikes...", image_url: "/taco.jpg" },
  { item: "Soda", category: "drink", serving_size: "12 oz", glucose_change: 60, glycemic_index: 85, learning_module_text: "Sugary drinks cause rapid glucose spikes...", image_url: "/soda.jpg" },
  { item: "30 min run", category: "exercise", serving_size: "30 minutes", glucose_change: -35, glycemic_index: 0, learning_module_text: "Aerobic exercise helps lower blood glucose...", image_url: "/run.jpg" },
  { item: "Chicken", category: "meat", serving_size: "4 oz", glucose_change: -5, glycemic_index: 0, learning_module_text: "Lean meats like chicken have minimal impact on glucose...", image_url: "/chicken.jpg" },
  { item: "White Rice", category: "grain", serving_size: "1 cup", glucose_change: 55, glycemic_index: 90, learning_module_text: "White rice causes significant glucose elevation...", image_url: "/rice.jpg" },
  { item: "Broccoli", category: "vegetable", serving_size: "1 cup", glucose_change: -10, glycemic_index: 15, learning_module_text: "Non-starchy vegetables help stabilize glucose...", image_url: "/broccoli.jpg" },
  { item: "Apple", category: "fruit", serving_size: "1 medium", glucose_change: 25, glycemic_index: 38, learning_module_text: "Apples provide natural sugars with fiber...", image_url: "/apple.jpg" },
  { item: "Whole Wheat Bread", category: "grain", serving_size: "2 slices", glucose_change: 40, glycemic_index: 69, learning_module_text: "Whole grains cause moderate glucose increases...", image_url: "/bread.jpg" },
  { item: "Walking", category: "exercise", serving_size: "20 minutes", glucose_change: -20, glycemic_index: 0, learning_module_text: "Light exercise helps improve glucose uptake...", image_url: "/walk.jpg" },
  { item: "Greek Yogurt", category: "dairy", serving_size: "6 oz", glucose_change: 15, glycemic_index: 35, learning_module_text: "Greek yogurt provides protein with moderate glucose impact...", image_url: "/yogurt.jpg" }
];

const GlucoseTracker = () => {
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [glucoseData, setGlucoseData] = useState([]);
  const [baselineGlucose] = useState(100);
  const [draggedItem, setDraggedItem] = useState(null);
  const [foodTimings, setFoodTimings] = useState({}); // Track when each food was consumed
  const chartRef = useRef(null);

  // Generate initial flat line data
  useEffect(() => {
    const times = [];
    for (let hour = 9; hour <= 15; hour++) {
      times.push({
        time: `${hour === 12 ? 12 : hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`,
        glucose: baselineGlucose,
        rawHour: hour
      });
    }
    setGlucoseData(times);
  }, [baselineGlucose]);

  // Update glucose curve when foods are selected or moved
  useEffect(() => {
    if (selectedFoods.length === 0) {
      // Reset to flat line
      setGlucoseData(prev => prev.map(point => ({ ...point, glucose: baselineGlucose })));
      return;
    }

    // Calculate glucose effect based on food timings
    setGlucoseData(prev => prev.map((point, timeIndex) => {
      let glucoseValue = baselineGlucose;
      
      selectedFoods.forEach((food, foodIndex) => {
        // Get the time position for this food (default to order-based if not set)
        const foodTimeIndex = foodTimings[food.item] !== undefined ? 
          foodTimings[food.item] : foodIndex * 2;
        
        if (timeIndex >= foodTimeIndex) {
          const timeSinceFood = timeIndex - foodTimeIndex;
          let multiplier;
          
          if (timeSinceFood <= 1) {
            // Gradual rise
            multiplier = timeSinceFood * 0.8;
          } else if (timeSinceFood <= 3) {
            // Peak
            multiplier = 1;
          } else {
            // Gradual decline
            multiplier = Math.max(0.2, 1 - (timeSinceFood - 3) * 0.15);
          }
          
          glucoseValue += food.glucose_change * multiplier;
        }
      });
      
      return {
        ...point,
        glucose: Math.max(70, glucoseValue)
      };
    }));
  }, [selectedFoods, baselineGlucose, foodTimings]);

  const handleFoodSelect = (food) => {
    if (selectedFoods.length >= 3) return;
    if (selectedFoods.find(f => f.item === food.item)) return;
    
    setSelectedFoods([...selectedFoods, food]);
  };

  const removeFood = (foodToRemove) => {
    setSelectedFoods(selectedFoods.filter(food => food.item !== foodToRemove.item));
  };

  const resetSelection = () => {
    setSelectedFoods([]);
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    
    const newSelectedFoods = [...selectedFoods];
    const draggedFood = newSelectedFoods[draggedItem];
    newSelectedFoods.splice(draggedItem, 1);
    newSelectedFoods.splice(index, 0, draggedFood);
    
    setSelectedFoods(newSelectedFoods);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const filteredFoods = foodData.filter(food =>
    food.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatYAxisTick = (value) => {
    return value.toString();
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded"></div>
          </div>
          <select className="border border-teal-500 text-teal-600 px-3 py-1 rounded text-sm">
            <option>Blood Sugar</option>
          </select>
        </div>
        <Settings className="w-5 h-5 text-gray-600" />
      </div>

      {/* Educational Text */}
      <div className="bg-white p-4 text-center">
        <p className="text-gray-700 text-sm leading-relaxed">
          When you eat a burger, the carbs from the buns and sauces quickly break down into sugar.
        </p>
      </div>

      {/* Chart with Connection Lines */}
      <div className="bg-white relative">
        <div className="p-4 h-64" ref={chartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={glucoseData}>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                domain={[70, 180]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={formatYAxisTick}
              />
              <ReferenceLine y={100} stroke="#ef4444" strokeWidth={1} />
              <Line 
                type="monotone" 
                dataKey="glucose" 
                stroke="#0891b2" 
                strokeWidth={3}
                dot={{ fill: '#0891b2', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 6, fill: '#0891b2' }}
                strokeDasharray="4 4"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Foods with Connection Lines */}
        {selectedFoods.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex justify-center space-x-4 relative">
              {/* Connection Lines */}
              {selectedFoods.map((food, index) => (
                <div key={`connection-${index}`} className="absolute" style={{ left: `${20 + (index * 25)}%` }}>
                  {/* Vertical line from chart to food item */}
                  <div 
                    className="absolute"
                    style={{
                      left: '50%',
                      top: '-120px',
                      width: '3px',
                      height: '80px',
                      backgroundColor: '#0891b2',
                      transform: 'translateX(-50%)',
                      borderRadius: '2px'
                    }}
                  />
                  {/* Horizontal line at bottom */}
                  <div 
                    className="absolute"
                    style={{
                      left: '50%',
                      top: '-45px',
                      width: '30px',
                      height: '3px',
                      backgroundColor: '#0891b2',
                      transform: 'translateX(-50%)',
                      borderRadius: '2px'
                    }}
                  />
                  {/* Vertical line to food item */}
                  <div 
                    className="absolute"
                    style={{
                      left: '50%',
                      top: '-45px',
                      width: '3px',
                      height: '40px',
                      backgroundColor: '#0891b2',
                      transform: 'translateX(-50%)',
                      borderRadius: '2px'
                    }}
                  />
                </div>
              ))}
              
              {/* Food Items */}
              {selectedFoods.map((food, index) => (
                <div
                  key={`food-${index}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`
                    relative bg-white rounded-lg p-2 shadow-md cursor-move
                    hover:shadow-lg transition-all duration-200
                    ${draggedItem === index ? 'opacity-50 scale-105' : ''}
                  `}
                  style={{ minWidth: '60px' }}
                >
                  <div className="w-12 h-12 bg-teal-600 rounded-lg mx-auto mb-1 flex items-center justify-center">
                    <span className="text-white text-lg">
                      {food.category === 'exercise' ? '🏃' : 
                       food.category === 'drink' ? '🥤' : 
                       food.category === 'fruit' ? '🍎' : '🍔'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-800 text-center">{food.item}</p>
                  
                  {/* Drag Handle */}
                  <div className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1">
                    <GripVertical className="w-3 h-3 text-gray-500" />
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFood(food)}
                    className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="px-4 py-2">
        <button 
          onClick={resetSelection}
          className="flex items-center space-x-2 text-teal-600 hover:text-teal-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Reset</span>
        </button>
      </div>

      {/* Selection Counter */}
      {selectedFoods.length > 0 && (
        <div className="px-4 py-2">
          <p className="text-sm font-medium text-teal-600 text-center">
            {selectedFoods.length} selected
          </p>
        </div>
      )}

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-0 bg-white rounded-lg shadow-sm text-sm"
          />
        </div>
      </div>

      {/* Food Options */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {filteredFoods.slice(0, 30).map((food, index) => (
            <button
              key={index}
              onClick={() => handleFoodSelect(food)}
              disabled={selectedFoods.length >= 3 && !selectedFoods.find(f => f.item === food.item)}
              className={`
                bg-white rounded-lg p-3 shadow-sm text-center hover:shadow-md transition-shadow
                ${selectedFoods.find(f => f.item === food.item) ? 'ring-2 ring-teal-500 bg-teal-50' : ''}
                ${selectedFoods.length >= 3 && !selectedFoods.find(f => f.item === food.item) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xl">
                  {food.category === 'exercise' ? '🏃' : 
                   food.category === 'drink' ? '🥤' : 
                   food.category === 'fruit' ? '🍎' : '🍽️'}
                </span>
              </div>
              <p className="text-xs font-medium text-gray-800">{food.item}</p>
              <p className="text-xs text-gray-500">{food.serving_size}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlucoseTracker;