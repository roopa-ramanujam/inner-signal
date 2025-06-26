// ketoneModules.js
// Educational content about ketone production and measurement
// Note: This is for educational purposes only, not medical advice

export const ketoneModules = [
    {
      id: 'dietary-ketosis',
      name: 'Dietary Ketosis',
      icon: '🥑',
      instructions: 'Learn how different dietary approaches affect ketone production.',
      data: [
        {
          id: 'keto-meal',
          name: 'Keto Meal',
          peakTime: 3.0,
          peakValue: 1.2,              // mmol/L ketones
          duration: 6.0,
          description: 'High-fat, low-carb meals can increase ketone production over several hours.',
          image: '/images/ketones/keto-meal.png',
          fallbackIcon: '🥑',
          impactStart: 1.0             // Ketones start rising after 1 hour
        },
        {
          id: 'intermittent-fasting',
          name: 'Intermittent Fasting',
          peakTime: 12.0,
          peakValue: 0.8,
          duration: 16.0,
          description: 'Extended fasting periods naturally increase ketone production.',
          image: '/images/ketones/fasting.png',
          fallbackIcon: '⏰',
          impactStart: 8.0
        },
        {
          id: 'carb-meal',
          name: 'High-Carb Meal',
          peakTime: 2.0,
          peakValue: 0.1,              // Very low ketones
          duration: 8.0,
          description: 'Carbohydrate intake suppresses ketone production significantly.',
          image: '/images/ketones/carb-meal.png',
          fallbackIcon: '🍞',
          impactStart: 0.5
        },
        {
          id: 'mct-oil',
          name: 'MCT Oil',
          peakTime: 1.0,
          peakValue: 0.6,
          duration: 3.0,
          description: 'Medium-chain triglycerides can rapidly increase ketone levels.',
          image: '/images/ketones/mct-oil.png',
          fallbackIcon: '🥥',
          impactStart: 0.25
        }
      ]
    },
    {
      id: 'exercise-ketosis',
      name: 'Exercise & Ketones',
      icon: '🏃‍♀️',
      instructions: 'Discover how different types of exercise affect ketone levels.',
      data: [
        {
          id: 'aerobic-exercise',
          name: 'Aerobic Exercise',
          peakTime: 1.5,
          peakValue: 0.4,
          duration: 4.0,
          description: 'Steady aerobic exercise can modestly increase ketone production.',
          image: '/images/ketones/running.png',
          fallbackIcon: '🏃‍♀️',
          impactStart: 0.5
        },
        {
          id: 'hiit-workout',
          name: 'HIIT Workout',
          peakTime: 2.0,
          peakValue: 0.3,
          duration: 3.0,
          description: 'High-intensity training may temporarily increase ketones.',
          image: '/images/ketones/hiit.png',
          fallbackIcon: '💪',
          impactStart: 1.0
        },
        {
          id: 'strength-training',
          name: 'Strength Training',
          peakTime: 1.0,
          peakValue: 0.2,
          duration: 2.0,
          description: 'Weight training has minimal impact on ketone production.',
          image: '/images/ketones/weights.png',
          fallbackIcon: '🏋️‍♀️',
          impactStart: 0.5
        },
        {
          id: 'yoga',
          name: 'Yoga/Meditation',
          peakTime: 0.5,
          peakValue: 0.25,
          duration: 2.0,
          description: 'Gentle movement and stress reduction may support ketosis.',
          image: '/images/ketones/yoga.png',
          fallbackIcon: '🧘‍♀️',
          impactStart: 0.25
        }
      ]
    },
    {
      id: 'metabolic-states',
      name: 'Metabolic States',
      icon: '⚡',
      instructions: 'Understand how different metabolic conditions affect ketones.',
      data: [
        {
          id: 'nutritional-ketosis',
          name: 'Nutritional Ketosis',
          peakTime: 24.0,
          peakValue: 1.5,
          duration: 48.0,
          description: 'Sustained ketogenic diet maintains steady ketone levels.',
          fallbackIcon: '📊',
          impactStart: 12.0
        },
        {
          id: 'dawn-phenomenon',
          name: 'Morning Rise',
          peakTime: 1.0,
          peakValue: 0.6,
          duration: 3.0,
          description: 'Natural morning hormone changes can affect ketone levels.',
          fallbackIcon: '🌅',
          impactStart: 0.0
        },
        {
          id: 'stress-response',
          name: 'Stress Response',
          peakTime: 0.5,
          peakValue: 0.3,
          duration: 2.0,
          description: 'Acute stress can temporarily alter ketone production.',
          fallbackIcon: '😰',
          impactStart: 0.0
        },
        {
          id: 'sleep-deprivation',
          name: 'Sleep Deprivation',
          peakTime: 6.0,
          peakValue: 0.15,
          duration: 12.0,
          description: 'Poor sleep can disrupt metabolic processes including ketosis.',
          fallbackIcon: '😴',
          impactStart: 2.0
        }
      ]
    }
  ];
  
  // Ketone measurement reference:
  // 0.0-0.3 mmol/L: No ketosis
  // 0.3-0.5 mmol/L: Light ketosis  
  // 0.5-1.5 mmol/L: Nutritional ketosis
  // 1.5-3.0 mmol/L: Deep ketosis
  // >3.0 mmol/L: Possible diabetic ketoacidosis (medical emergency)