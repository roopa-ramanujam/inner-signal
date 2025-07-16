// settings.js - Configuration file for GlucoseTracker

export const settings = {
  // Display options
  showServingSize: true,           // Show/hide serving size below food items
  
  // Glucose settings  
  baselineGlucose: 120,           // Default baseline glucose level (mg/dL)
  
  // Chart settings
  chartHeight: 225,               // Chart height in pixels
  chartWidth: 400,                // Chart width in pixels
  yMin: 20,                       // Minimum Y-axis value
  yMax: 220,                      // Maximum Y-axis value
  
  // Timeline settings
  startHour: 12,                  // Starting hour for timeline (12 PM)
  endHour: 17,                    // Ending hour for timeline (5 PM)
  pointsPerHour: 4,               // Data points per hour (every 15 minutes)
  
  // Interaction settings
  maxSelectedItems: 3,            // Maximum number of items that can be selected
  
  // Visual settings
  normalGlucoseColor: '#629C47',  // Green color for normal glucose range
  highGlucoseColor: '#FF7B7B',    // Red color for out-of-range glucose values
  lowGlucoseColor: '#FF7B7B',    // Red color for out-of-range glucose values
  connectionLineColor: '#0891b2', // Blue color for connection lines
  highGlucoseReferenceLine: '#B9BCF9', // Blue color for high glucose reference line
  lowGlucoseReferenceLine: '#FF7B7B', // Red color for high glucose reference line
  
  // Glucose range thresholds
  lowGlucoseThreshold: 70,        // Below this is considered low
  highGlucoseThreshold: 180,      // Above this is considered high
};

// Helper function to update settings
export const updateSetting = (key, value) => {
  if (key in settings) {
      settings[key] = value;
      return true;
  }
  return false;
};

// Helper function to reset to defaults
export const resetToDefaults = () => {
  settings.showServingSize = true;
  settings.baselineGlucose = 120;
  settings.chartHeight = 225;
  settings.chartWidth = 400;
  settings.yMin = 20;
  settings.yMax = 220;
  settings.startHour = 12;
  settings.endHour = 17;
  settings.pointsPerHour = 4;
  settings.maxSelectedItems = 3;
  settings.normalGlucoseColor = '#629C47';
  settings.highGlucoseColor = '#FF7B7B';
  settings.lowGlucoseColor = '#FF7B7B';
  settings.connectionLineColor = '#0891b2';
  settings.lowGlucoseThreshold = 70;
  settings.highGlucoseThreshold = 180;
};