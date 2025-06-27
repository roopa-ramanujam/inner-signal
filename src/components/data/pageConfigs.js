// pageConfigs.js
// This file controls what pages are available and how they behave

import glycemicIndexModulesData from './modules/glycemicIndexModules.json'; // Direct JSON import
import ketoneModulesData from './modules/ketoneModules.json'; // Direct JSON import
import insulinDosingModulesData from './modules/insulinDosing.json'

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

  // Glycemic Index Learning
  'glycemic-index': {
    component: 'LearningModule',
    enabled: true, // true if you want it to be an option in the dropdown, false to say "Coming Soon"
    props: {
      title: 'Glycemic Index',
      modules: glycemicIndexModulesData?.glycemicIndexModules || [],
      chartConfig: {
        baselineValue: settings.baselineGlucose,
        chartHeight: settings.chartHeight,
        chartWidth: settings.chartWidth,
        yMin: settings.yMin,
        yMax: settings.yMax,
        timeRange: { start: settings.startHour, end: settings.endHour },
        dangerZones: [
          { value: 70, color: settings.highGlucoseColor, label: 'Low' },
          { value: 120, color: settings.normalGlucoseColor, label: 'Normal' },
          { value: 180, color: settings.highGlucoseColor, label: 'High' }
        ]
      },
      displayConfig: {
        showComparison: true,
        backgroundColor: '#E7EEEB',
        buttonStyle: 'teal',
        unitLabel: 'mg/dL',
        defaultLineColor: settings.normalGlucoseColor
      }
    }
  },

  // Ketones education
  'ketones': {
    component: 'LearningModule',
    enabled: false, // true if you want it to be an option in the dropdown, false to say "Coming Soon"
    props: {
      title: 'Ketones',
      modules: ketoneModulesData?.ketoneModules || [],
      chartConfig: {
        baselineValue: 0.1,                    // Proper ketone baseline (mmol/L)
        chartHeight: 300,
        chartWidth: settings.chartWidth,
        yMin: 0,                               // Ketones start at 0
        yMax: 3.0,                             // Safe ketone maximum
        timeRange: { start: settings.startHour, end: settings.endHour },
        dangerZones: [
          { value: 0.3, color: '#94a3b8', label: 'Light' },
          { value: 0.5, color: '#22c55e', label: 'Nutritional' },
          { value: 1.5, color: '#f59e0b', label: 'Deep' },
          { value: 3.0, color: '#ef4444', label: 'DKA Risk' }
        ]
      },
      displayConfig: {
        showComparison: true,
        backgroundColor: '#E7EEEB',          
        buttonStyle: 'teal',
        unitLabel: 'mmol/L',                   // Ketone units
        defaultLineColor: '#cbd5e1',           // Light gray for low ketones
        showLegend: true,
        legendTitle: 'Ketone Levels (mmol/L)',
        legendItems: [
          { color: '#cbd5e1', label: '0.0-0.3: No ketosis' },
          { color: '#94a3b8', label: '0.3-0.5: Light ketosis' },
          { color: '#22c55e', label: '0.5-1.5: Nutritional ketosis' },
          { color: '#f59e0b', label: '1.5-3.0: Deep ketosis' },
          { color: '#ef4444', label: '>3.0: DKA Risk', isWarning: true }
        ]
      }
    }
  },

  // Insulin Dosing Education
  'insulin-dosing': {
    component: 'LearningModule',
    enabled: true, // true if you want it to be an option in the dropdown, false to say "Coming Soon"
    props: {
      title: 'Insulin Dosing',
      modules: insulinDosingModulesData?.insulinDosingModules || [],
      chartConfig: {
        baselineValue: settings.baselineGlucose,  // 120 mg/dL
        chartHeight: 300,
        chartWidth: settings.chartWidth,
        yMin: 50,                              // Lower to show hypoglycemia
        yMax: 200,
        timeRange: { start: 9, end: 18 },      // 6 AM to 6 PM (12 hours)
        dangerZones: [
          { value: 70, color: '#ef4444', label: 'Hypo Risk' },
          { value: 120, color: '#22c55e', label: 'Target' },
          { value: 180, color: '#f59e0b', label: 'High' }
        ]
      },
      displayConfig: {
        showComparison: true,
        backgroundColor: '#E7EEEB',          
        buttonStyle: 'teal', // default is teal
        unitLabel: 'mg/dL',
        defaultLineColor: '#22c55e',
        showLegend: true,
        legendTitle: 'Glucose Response (mg/dL)',
        legendItems: [
          { color: '#ef4444', label: '<70: Hypoglycemia Risk', isWarning: true },
          { color: '#22c55e', label: '70-180: Target Range' },
          { color: '#f59e0b', label: '>180: High Glucose' }
        ],
        disclaimerText: 'IMPORTANT: Educational content only. Never adjust insulin without healthcare provider guidance.'
      }
    }
  },
}; // CLOSING TAG
