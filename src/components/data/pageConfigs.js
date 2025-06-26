// pageConfigs.js
// This file controls what pages are available and how they behave
// Non-coders can easily add new pages by adding entries here

import { glycemicIndexModules } from './modules/glycemicIndexModules';
import { insulinDosing } from './modules/insulinDosing';
import { ketones } from './modules/ketones';
import { settings } from './settings'; // Import settings for consistency

export const pageConfigs = {
  // Blood Sugar Tracker (existing)
  'blood-sugar': {
    component: 'GlucoseTracker',
    enabled: true,
    props: {
      // Any props specific to GlucoseTracker can go here
    }
  },

  // Glycemic Index Learning (refactored)
  'glycemic-index': {
    component: 'LearningModule',
    enabled: true,
    props: {
      title: 'Glycemic Index',
      modules: glycemicIndexModules,
      chartConfig: {
        type: 'glucose',
        baselineValue: settings.baselineGlucose,
        chartHeight: settings.chartHeight,
        chartWidth: settings.chartWidth,
        yMin: settings.yMin,
        yMax: settings.yMax,
        timeRange: { start: settings.startHour, end: settings.endHour }, // 12 PM to 5 PM
        dangerZones: [
          { value: settings.lowGlucoseThreshold, color: settings.highGlucoseColor, label: 'Low' },
          { value: settings.highGlucoseThreshold, color: settings.highGlucoseColor, label: 'High' }
        ]
      },
      displayConfig: {
        showComparison: true,
        backgroundColor: '#E7EEEB',
        buttonStyle: 'teal'
      }
    }
  }
};

// TO ADD A NEW PAGE:
// 1. Add a new entry to this object
// 2. Create the content modules file (like exerciseModules.js)
// 3. Add the page to appSections.js
// 4. That's it! No component changes needed.