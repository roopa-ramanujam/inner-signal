export const glycemicIndexModules = [
  {
    name: 'Fruits',
    icon: '🍓',
    data: [
      {
        id: 'apple',
        name: 'Apple',
        peakTime: 1.5,
        peakValue: 145,
        duration: 3.0,
        description: 'Apples have fructose and fiber which helps offset the blood sugar increase.',
        image: '/images/foods/apple.png',
        fallbackIcon: '🍎'
      },
      {
        id: 'banana',
        name: 'Banana',
        peakTime: 1.0,
        peakValue: 160,
        duration: 2.5,
        description: 'Bananas cause a moderate rise in blood sugar due to natural sugars.',
        image: '/images/foods/banana.png',
        fallbackIcon: '🍌'
      },
      {
        id: 'grapes',
        name: 'Grapes',
        peakTime: 0.8,
        peakValue: 170,
        duration: 2.0,
        description: 'Grapes can cause rapid blood sugar spikes due to high sugar content.',
        image: '/images/foods/grapes.png',
        fallbackIcon: '🍇'
      }
    ]
  },
  {
    name: 'Vegetables',
    icon: '🥕',
    data: [
      {
        id: 'carrot',
        name: 'Carrot',
        peakTime: 1.1,
        peakValue: 130,
        duration: 2.5,
        description: 'Carrots have natural sugars but fiber slows absorption.',
        image: '/images/foods/carrot.png',
        fallbackIcon: '🥕'
      },
      {
        id: 'broccoli',
        name: 'Broccoli',
        peakTime: 0.5,
        peakValue: 110,
        duration: 1.5,
        description: 'Broccoli has minimal impact on blood sugar.',
        image: '/images/foods/broccoli.png',
        fallbackIcon: '🥦'
      },
      {
        id: 'corn',
        name: 'Corn',
        peakTime: 1.3,
        peakValue: 155,
        duration: 2.8,
        description: 'Corn is higher in starch and can raise blood sugar significantly.',
        image: '/images/foods/corn.png',
        fallbackIcon: '🌽'
      }
    ]
  },
  {
    name: 'Grains',
    icon: '🍞',
    data: [
      {
        id: 'white-rice',
        name: 'White Rice',
        fallbackIcon: '🍚',
        peakTime: 0.75,
        peakValue: 190,
        duration: 2,
        description: 'White rice has a high glycemic index, causing rapid blood sugar spikes.'
      },
      {
        id: 'brown-rice',
        name: 'Brown Rice',
        peakTime: 1.5,
        peakValue: 155,
        duration: 3.5,
        description: 'Brown rice has more fiber than white rice, causing a slower glucose rise.',
        image: '/images/foods/brown-rice.png',
        fallbackIcon: '🍚'
      },
      {
        id: 'quinoa',
        name: 'Quinoa',
        peakTime: 1.2,
        peakValue: 140,
        duration: 3.0,
        description: 'Quinoa is a protein-rich grain with moderate glucose impact.',
        image: '/images/foods/quinoa.png',
        fallbackIcon: '🌾'
      }
    ]
  }
];