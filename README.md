# Inner Signal

An interactive web app for learning about what affects blood sugar and glucose, designed to help people with diabetes make informed dietary, lifestyle, and medication choices.

Visit the app at https://inner-signal.vercel.app/ (works best on mobile, and if you add this page to your home screen.)

## Adding New Foods To The Menu for Interactive Graph

Each food item requires 6 essential pieces of information. Use the template below and fill in your values in [library.js](./src/components/data/library.js/) .:

```javascript
{
  item: "Food Name Here",
  category: "food type",
  serving_size: "amount and unit",
  glucose_change: number,
  educational_text: "Educational message about this food.",
  image: "/images/foods/filename.jpg",
  fallbackIcon: "🥕"
},
```

**Important:** Don't forget the comma `,` at the end!

## Field Reference

### `item` - Food Name
- **Format:** String in quotes
- **Examples:** `"Apple"`, `"Whole Wheat Bread"`, `"Greek Yogurt"`

### `category` - Food Type  
- **Format:** Lowercase string in quotes
- **Options:** `"fruit"`, `"vegetable"`, `"grain"`, `"protein"`, `"dairy"`, `"snack"`, `"dessert"`, `"beverage"`

### `serving_size` - Portion Size
- **Format:** String with amount and unit
- **Examples:** `"1 medium"`, `"1 cup"`, `"1 slice"`, `"100g"`

### `glucose_change` - Blood Sugar Impact
- **Format:** Number (no quotes)
- **Range:** Represents mg/dL increase above baseline (120 mg/dL)
- **Guidelines:**
  - **Low impact:** 5-15 (vegetables, proteins)
  - **Medium impact:** 15-40 (fruits, whole grains)  
  - **High impact:** 40-80+ (refined carbs, sweets)

### `educational_text` - Learning Message
- **Format:** String with helpful information
- **Purpose:** Educational facts about blood sugar impact
- **Style:** Short, informative, diabetes-friendly

### `image` - Photo Path
- **Format:** `"/images/foods/filename.jpg"`
- **Naming:** Lowercase, underscores for spaces

### `fallbackIcon` - Emoji Backup
- **Format:** Single emoji in quotes
- **Purpose:** Displays when image fails to load

## Examples

### Low Impact (Vegetable)
```javascript
{
  item: "Broccoli",
  category: "vegetable",
  serving_size: "1 cup",
  glucose_change: 6,
  educational_text: "Broccoli is very low in carbs and high in fiber, causing minimal blood sugar rise.",
  image: "/images/foods/broccoli.jpg",
  fallbackIcon: "🥦"
},
```

### Medium Impact (Fruit)
```javascript
{
  item: "Banana",
  category: "fruit",
  serving_size: "1 medium",
  glucose_change: 30,
  educational_text: "Bananas contain natural sugars and some fiber, creating a moderate glucose response.",
  image: "/images/foods/banana.jpg",
  fallbackIcon: "🍌"
},
```

### High Impact (Refined Carb)
```javascript
{
  item: "White Rice",
  category: "grain",
  serving_size: "1 cup cooked",
  glucose_change: 55,
  educational_text: "White rice is quickly digested and absorbed, causing a significant blood sugar spike.",
  image: "/images/foods/white_rice.jpg",
  fallbackIcon: "🍚"
},
```

## Blood Sugar Impact Guidelines

| Food Type | Typical Range | Examples |
|-----------|---------------|----------|
| **Non-starchy vegetables** | 5-15 | Lettuce, broccoli, spinach |
| **Proteins** | 0-10 | Chicken, fish, eggs |
| **Nuts/Seeds** | 5-15 | Almonds, walnuts |
| **Berries** | 15-25 | Strawberries, blueberries |
| **Other fruits** | 20-35 | Apples, oranges, bananas |
| **Whole grains** | 25-45 | Brown rice, oatmeal |
| **Dairy** | 10-20 | Milk, yogurt |
| **Refined carbs** | 40-70 | White bread, pasta |
| **Sweets/Desserts** | 50-80+ | Cookies, candy, cake |

## Common Mistakes

❌ **Missing quotes around text:**
```javascript
item: Apple  // WRONG
item: "Apple"  // CORRECT
```

❌ **Missing comma:**
```javascript
fallbackIcon: "🍎"  // WRONG
fallbackIcon: "🍎",  // CORRECT
```

❌ **Quotes around numbers:**
```javascript
glucose_change: "25"  // WRONG
glucose_change: 25  // CORRECT
```

❌ **Incorrect category format:**
```javascript
category: "Fruit"  // WRONG
category: "fruit"  // CORRECT
```

## Adding Learning Modules 

Learning modules are organized into categories with multiple food items. Each category contains detailed glucose response data for educational purposes. Add learning modules or items to [learningModules.js](./src/components/data/learningModules.js/) .

### Category Structure

```javascript
{
  key: 'category-name',                       // Lowercase, no spaces, use dashes for multiple words
  name: 'Category Name',                      // Display name for the category
  image: '/images/categories/category.jpg',   // Optional, must be in public/images/categories/
  fallbackIcon: '🥬',                         // Emoji backup if image fails
  data: [
    // Array of food items (see Item Structure below)
  ]
}
```

### Item Structure

```javascript
{
  id: 'food-item',                            // Lowercase, no spaces, use dashes for multiple words
  item: 'Food Item',                          // Used for alt text
  name: 'Food Item',                          // Display name
  image: '/images/foods/food-item.jpg',       // Optional, must be in public/images/foods/
  fallbackIcon: '🥬',                         // Emoji backup if image fails
  peakTime: 1.0,                              // Hours to reach maximum glucose impact
  peakValue: 135,                             // Peak glucose level in mg/dL
  description: 'Educational text about this food item and its glucose impact.'
}
```

### Complete Learning Module Example

```javascript
{
  key: 'vegetables',
  name: 'Vegetables',
  image: '/images/categories/vegetables.jpg',
  fallbackIcon: '🥬',
  data: [
    {
      id: 'broccoli',
      item: 'Broccoli',
      name: 'Broccoli',
      image: '/images/foods/broccoli.jpg',
      fallbackIcon: '🥦',
      peakTime: 1.5,
      peakValue: 125,
      description: 'Broccoli is very low in carbs and high in fiber, causing minimal blood sugar rise.'
    },
    {
      id: 'carrots',
      item: 'Carrots',
      name: 'Carrots',
      image: '/images/foods/carrots.jpg',
      fallbackIcon: '🥕',
      peakTime: 1.0,
      peakValue: 130,
      description: 'Carrots contain natural sugars but also fiber, creating a mild glucose response.'
    }
  ]
}
```

### Peak Time Guidelines

| Food Type | Typical Peak Time | Examples |
|-----------|------------------|----------|
| **Refined carbs** | 0.5-0.75 hours | White bread, white rice, potatoes |
| **Fruits** | 0.75-1.25 hours | Apples, bananas, berries |
| **Whole grains** | 1.0-1.5 hours | Brown rice, quinoa, oats |
| **Proteins** | 1.5-2.0 hours | Chicken, fish, beans |
| **Vegetables** | 1.0-1.5 hours | Most non-starchy vegetables |

### Peak Value Guidelines

| Food Type | Typical Peak Range | Examples |
|-----------|-------------------|----------|
| **Proteins** | 120-130 mg/dL | Chicken, fish, eggs |
| **Non-starchy vegetables** | 125-135 mg/dL | Broccoli, spinach, peppers |
| **Berries** | 125-140 mg/dL | Strawberries, blueberries |
| **Other fruits** | 135-160 mg/dL | Apples, oranges, bananas |
| **Whole grains** | 140-170 mg/dL | Brown rice, quinoa, oats |
| **Refined carbs** | 170-200+ mg/dL | White bread, white rice, potatoes |

## Notes

- Glucose impact values are estimates and may vary based on individual metabolism, portion size, and food combinations
- All educational text should be accurate and helpful for diabetes management
- Images should be high-quality and representative of the food item
- Peak times and values should be researched or estimated based on glycemic index data
- Learning modules are designed for educational visualization of glucose response curves