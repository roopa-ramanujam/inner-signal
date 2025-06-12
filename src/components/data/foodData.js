// Sample food data
export const foodLibrary = [
  { 
    item: "Burger", 
    category: "meat", 
    serving_size: "1 piece", 
    glucose_change: 45, 
    educational_text: "When you eat a burger, the carbs from the buns and sauces quickly break down into sugar.",
    image: "/images/foods/burger.png", // Custom image path
    fallbackIcon: "🍔" // Fallback emoji if image fails to load
  },
  { 
    item: "Tacos", 
    category: "meat", 
    serving_size: "2 pieces", 
    glucose_change: 40, 
    educational_text: "Tacos with tortillas and fillings can cause a moderate blood sugar spike from the carbohydrates.",
    image: "/images/foods/tacos.jpg",
    fallbackIcon: "🌮"
  },
  { 
    item: "Soda", 
    category: "drink", 
    serving_size: "12 oz", 
    glucose_change: 35, 
    educational_text: "Sugary drinks are absorbed quickly, causing a rapid spike in blood glucose levels.",
    image: "/images/foods/soda.jpg",
    fallbackIcon: "🥤"
  },
  { 
    item: "30 min run", 
    category: "exercise", 
    serving_size: "30 minutes", 
    glucose_change: -25, 
    educational_text: "Exercise helps muscles use glucose for energy, lowering blood sugar levels naturally.",
    image: "/images/foods/running.jpg",
    fallbackIcon: "🏃"
  },
  { 
    item: "Chicken", 
    category: "meat", 
    serving_size: "4 oz", 
    glucose_change: 5, 
    educational_text: "Lean proteins like chicken have minimal impact on blood sugar as they contain very few carbs.",
    image: "/images/foods/chicken.jpg",
    fallbackIcon: "🍗"
  },
  { 
    item: "White Rice", 
    category: "grain", 
    serving_size: "1 cup", 
    glucose_change: 40, 
    educational_text: "White rice is quickly digested and converted to glucose, causing a significant blood sugar rise.",
    image: "/images/foods/white-rice.jpg",
    fallbackIcon: "🍚"
  },
  { 
    item: "Broccoli", 
    category: "vegetable", 
    serving_size: "1 cup", 
    glucose_change: 5, 
    educational_text: "Non-starchy vegetables like broccoli are high in fiber and have very little impact on blood sugar.",
    image: "/images/foods/broccoli.jpg",
    fallbackIcon: "🥦"
  },
  { 
    item: "Apple", 
    category: "fruit", 
    serving_size: "1 medium", 
    glucose_change: 15, 
    educational_text: "Apples contain natural sugars and fiber, causing a gentle, sustained rise in blood glucose.",
    image: "/images/foods/apple.jpg",
    fallbackIcon: "🍎"
  },
  { 
    item: "Whole Wheat Bread", 
    category: "grain", 
    serving_size: "2 slices", 
    glucose_change: 30, 
    educational_text: "Whole grain breads digest more slowly than white bread but still raise blood sugar moderately.",
    image: "/images/foods/whole-wheat-bread.jpg",
    fallbackIcon: "🍞"
  },
];

// Grain data with glycemic index information
export const grainData = [
  {
    id: 'white-rice',
    name: 'White rice',
    icon: '🍚',
    glycemicIndex: 73,
    peakTime: 2.5,
    peakValue: 195,
    description: 'White rice quickly spikes your blood sugar to over 200 mg/dL.',
    curve: 'high'
  },
  {
    id: 'brown-rice',
    name: 'Brown rice',
    icon: '🟤',
    glycemicIndex: 68,
    peakTime: 3,
    peakValue: 175,
    description: 'Brown rice causes a moderate spike, peaking around 175 mg/dL.',
    curve: 'medium'
  },
  {
    id: 'quinoa',
    name: 'Quinoa',
    icon: '🌾',
    glycemicIndex: 53,
    peakTime: 3.5,
    peakValue: 155,
    description: 'Quinoa has a lower glycemic impact with a gentler rise to 155 mg/dL.',
    curve: 'low'
  }
];

// Navigation menu items
export const menuItems = [
  { id: 'blood-sugar', name: 'Blood Sugar' },
  { id: 'glycemic-index', name: 'Glycemic Index' },
  { id: 'ketones', name: 'Ketones' },
  { id: 'insulin-dosing', name: 'Insulin Dosing' }
];