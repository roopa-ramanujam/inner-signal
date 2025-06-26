// pageConfigs.js
// This file controls what pages are available and how they behave
// Non-coders can easily add new pages by adding entries here

import { glycemicIndexModules } from './modules/glycemicIndexModules';
import { insulinDosing } from './modules/insulinDosing';
import { ketones } from './modules/ketones';

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
        baselineValue: 120,
        chartHeight: 275,
        chartWidth: 400,
        yMin: 20,
        yMax: 220,
        timeRange: { start: 12, end: 16 }, // 12 PM to 4 PM
        dangerZones: [
          { value: 70, color: '#FF7B7B', label: 'Low' },
          { value: 180, color: '#B9BCF9', label: 'High' }
        ]
      },
      displayConfig: {
        showComparison: true,
        backgroundColor: '#E7EEEB',
        buttonStyle: 'teal'
      }
    }
  },

  'insulin-dosing': {
    component: 'LearningModule',
    enabled: false,
    props: {
      title: 'Insulin Dosing',
      modules: insulinDosing,
      chartConfig: {
        type: 'glucose',
        baselineValue: 120,
        chartHeight: 275,
        chartWidth: 400,
        yMin: 20,
        yMax: 220,
        timeRange: { start: 12, end: 16 }, // 12 PM to 4 PM
        dangerZones: [
          { value: 70, color: '#FF7B7B', label: 'Low' },
          { value: 180, color: '#B9BCF9', label: 'High' }
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