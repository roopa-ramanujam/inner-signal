/*
Add additional categories for the learning modules in this format:
e.g.
{
  // Category level
  key: 'vegetables',                          // Lowercase, no spaces, if two words can use a dash like 'sweet-potatoes'
  name: 'Vegetables',                         // Name of category
  image: '/images/categories/vegetables.jpg', // Optional, image file must live in public/images/foods directory
  fallbackIcon: '🥬',                         // Used in case of no image
  data: [
    {
      // Item level  
      id: 'artichoke',                        // Lowercase, no spaces, if two words can use a dash like 'sweet-potatoes'
      item: 'Artichoke',                      // Used for alt text
      name: 'Artichoke',                      // Display name
      image: '/images/foods/artichoke.jpg',   // Optional, image file must live in public/images/foods directory
      fallbackIcon: '🥬',                     // Used in case of no image
      peakTime: 1.0,                          // How long (in hours) it takes for a food to reach its maximum blood glucose impact (ask AI)
      peakValue: 135,                         // Peak glucose level of item (ask AI)
      description: '...'                      // Educational text about the item
    }
  ]
}
*/


export const learningModules = [
    {
      key: 'grains',
      name: 'Grains',
      icon: '🌾',
      data: [
        {
          id: 'white-rice',
          name: 'White Rice',
          fallbackIcon: '🍚',
          peakTime: 0.75,
          peakValue: 180,
          description: 'White rice has a high glycemic index, causing rapid blood sugar spikes.'
        },
        {
          id: 'brown-rice',
          name: 'Brown Rice',
          fallbackIcon: '🍙',
          peakTime: 1.0,
          peakValue: 150,
          description: 'Brown rice has more fiber, leading to a slower, more moderate glucose response.'
        },
        {
          id: 'quinoa',
          name: 'Quinoa',
          fallbackIcon: '🌾',
          peakTime: 1.25,
          peakValue: 140,
          description: 'Quinoa is a complete protein with a lower glycemic index than most grains.'
        }
      ]
    },
    {
      key: 'fruits',
      name: 'Fruits',
      icon: '🍎',
      data: [
        {
          id: 'apple',
          name: 'Apple',
          fallbackIcon: '🍎',
          peakTime: 1.0,
          peakValue: 135,
          description: 'Apples contain fiber and natural sugars, providing a moderate glucose response.'
        },
        {
          id: 'banana',
          name: 'Banana',
          fallbackIcon: '🍌',
          peakTime: 0.75,
          peakValue: 160,
          description: 'Bananas are higher in natural sugars, causing a quicker glucose rise.'
        },
        {
          id: 'berries',
          name: 'Berries',
          fallbackIcon: '🫐',
          peakTime: 1.25,
          peakValue: 125,
          description: 'Berries are low in sugar and high in fiber, causing minimal glucose impact.'
        }
      ]
    },
    {
      key: 'starches',
      name: 'Starches',
      icon: '🥔',
      data: [
        {
          id: 'white-potato',
          name: 'White Potato',
          fallbackIcon: '🥔',
          peakTime: 0.5,
          peakValue: 190,
          description: 'White potatoes have a very high glycemic index, causing rapid spikes.'
        },
        {
          id: 'sweet-potato',
          name: 'Sweet Potato',
          fallbackIcon: '🍠',
          peakTime: 1.0,
          peakValue: 155,
          description: 'Sweet potatoes have more fiber and nutrients, moderating glucose response.'
        },
        {
          id: 'pasta',
          name: 'Pasta',
          fallbackIcon: '🍝',
          peakTime: 1.25,
          peakValue: 165,
          description: 'Pasta structure slows digestion, creating a more gradual glucose rise.'
        }
      ]
    },
    {
      key: 'proteins',
      name: 'Proteins',
      icon: '🥩',
      data: [
        {
          id: 'chicken',
          name: 'Chicken',
          fallbackIcon: '🍗',
          peakTime: 2.0,
          peakValue: 125,
          description: 'Lean proteins like chicken have minimal impact on blood glucose.'
        },
        {
          id: 'fish',
          name: 'Fish',
          fallbackIcon: '🐟',
          peakTime: 2.0,
          peakValue: 122,
          description: 'Fish provides protein and healthy fats with very little glucose impact.'
        },
        {
          id: 'beans',
          name: 'Beans',
          fallbackIcon: '🫘',
          peakTime: 1.5,
          peakValue: 140,
          description: 'Beans combine protein and fiber, creating a moderate, sustained glucose response.'
        }
      ]
    }
  ];