# Configuration Guide

This guide explains how to modify the JSON configuration files for the blood glucose tracking application.

## Table of Contents

- [Adding Items to Library](#adding-items-to-library)
- [Managing Page Sections](#managing-page-sections)
- [Managing Learning Module Content](#managing-learning-module-content)
- [Understanding Module Data Values](#understanding-module-data-values)

## Adding Items to Library

The `library.json` file contains all food, exercise, and medication items that users can select to track their blood glucose impact.

### Structure

Items are stored in the `itemLibrary` array. Each item has the following properties:

```json
{
  "item": "Apple",
  "category": "fruit",
  "serving_size": "1 medium",
  "glucose_change": 25,
  "peakTime": 1.5,
  "duration": 3.0,
  "educational_text": "Apples have fructose and fiber which helps offset the blood sugar increase.",
  "image": "/images/foods/apple.png",
  "fallbackIcon": "🍎"
}
```

### Adding a New Item

1. Open `library.json`
2. Add a new object to the `itemLibrary` array with these required fields:
   - **item**: Display name (string)
   - **category**: One of: fruit, vegetable, grain, meat, dairy, exercise, medication, etc.
   - **serving_size**: Typical portion (string)
   - **glucose_change**: Blood glucose impact in mg/dL (positive = increase, negative = decrease)
   - **peakTime**: Hours until maximum effect (decimal)
   - **duration**: Total hours of effect (decimal)
   - **educational_text**: Explanation of the glucose impact (string)
   - **image**: Path to image file (string)
   - **fallbackIcon**: Emoji as backup if image fails (string)

### Categories

Common categories include:

- **Foods**: fruit, vegetable, grain, meat, dairy, legume, healthy-fat, sweets, snack
- **Exercise**: exercise
- **Medications**: medication
- **Special**: processed-meat, fried-food, starchy-vegetable, refined-grain

## Managing Page Sections

The `pageConfigs.json` file controls which sections appear in the application and their settings.

### Enabling/Disabling Sections

To disable a section, set `enabled` to `false`:

```json
"ketones": {
  "component": "LearningModule",
  "enabled": false,
  "props": { ... }
}
```

To enable a section, set `enabled` to `true`:

```json
"ketones": {
  "component": "LearningModule",
  "enabled": true,
  "props": { ... }
}
```

### Available Sections

- **blood-sugar**: Main glucose tracking interface
- **glycemic-index**: Learning module about how foods affect blood sugar
- **ketones**: Learning module about ketone levels
- **insulin-dosing**: Learning module about insulin effects

## Managing Learning Module Content

Learning modules (glycemic-index, ketones, insulin-dosing) have their content stored in separate JSON files.

### File Structure

Each module file contains an array of module groups:

```json
{
  "moduleName": [
    {
      "id": "unique-group-id",
      "name": "Display Name",
      "icon": "🔬",
      "instructions": "Description of what users will learn",
      "data": [ ... ] // Array of scenarios
    }
  ]
}
```

### Adding/Removing Module Groups

**To add a new group:**

1. Open the appropriate module file (`ketoneModules.json`, `glycemicIndexModules.json`, etc.)
2. Add a new object to the main array with:
   - Unique id
   - Display name
   - Representative icon (emoji)
   - Clear instructions
   - Array of data scenarios

**To remove a group:**

- Delete the entire group object from the array

### Adding/Removing Scenarios

**To add a scenario to an existing group:**

- Add a new object to the group's `data` array (see values explanation below)

**To remove a scenario:**

- Delete the scenario object from the `data` array

## Understanding Module Data Values

Each scenario in a learning module has these properties:

### Core Properties

- **id**: Unique identifier for the scenario (string)
- **name**: Display name shown to users (string)
- **description**: Explanation of what happens (string)
- **image**: Path to illustration image (string)
- **fallbackIcon**: Emoji backup if image unavailable (string)

### Timing & Effect Properties

#### For Blood Glucose Modules (glycemic-index, insulin-dosing)

- **peakTime**: Hours from start until maximum glucose effect (decimal)
  - Example: 1.5 = effect peaks 1.5 hours after consumption

- **peakValue**: Maximum blood glucose level in mg/dL (number)
  - Example: 160 = glucose rises to 160 mg/dL at peak

- **duration**: Total hours the effect lasts (decimal)
  - Example: 3.0 = effect continues for 3 hours total

- **impactStart**: Hours until effect begins (decimal)
  - Example: 0.25 = effect starts 15 minutes after consumption

#### For Ketone Modules

- **peakTime**: Hours until maximum ketone level (decimal)
- **peakValue**: Maximum ketone level in mmol/L (decimal)
  - Range: 0.0-3.0+ (higher = deeper ketosis)
- **duration**: Hours ketones remain elevated (decimal)
- **impactStart**: Hours until ketones begin rising (decimal)

### Value Guidelines

#### Blood Glucose (mg/dL)

- Normal fasting: 80-100
- Target range: 70-180
- High: 180+
- Dangerous low: <70

#### Ketones (mmol/L)

- No ketosis: 0.0-0.3
- Light ketosis: 0.3-0.5
- Nutritional ketosis: 0.5-1.5
- Deep ketosis: 1.5-3.0
- DKA risk: >3.0

#### Timing Examples

- Rapid effect: peakTime 0.5-1.0 hours
- Moderate effect: peakTime 1.0-2.0 hours
- Slow effect: peakTime 2.0+ hours
- Short duration: 1-3 hours
- Long duration: 4+ hours

### Example: Adding a New Ketone Scenario

```json
{
  "id": "coconut-oil",
  "name": "Coconut Oil",
  "peakTime": 2.0,
  "peakValue": 0.7,
  "duration": 5.0,
  "description": "Coconut oil contains MCTs that can moderately increase ketone production.",
  "image": "/images/ketones/coconut-oil.png",
  "fallbackIcon": "🥥",
  "impactStart": 0.5
}
```

This scenario shows coconut oil:

- Starts affecting ketones after 30 minutes
- Peaks at 0.7 mmol/L after 2 hours
- Effects last 5 hours total
- Represents light to moderate ketosis