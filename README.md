# Inner Signal

An interactive web app for learning about what affects blood sugar and glucose, designed to help people with diabetes make informed dietary, lifestyle, and medication choices.

Visit the app at https://inner-signal.vercel.app/ (works best on mobile, and if you add this page to your home screen.)

# 📝 Adding New Pages: GitHub Web Editor Guide

## 🎯 Overview
This guide shows you how to add a new learning module page to the app using only GitHub's web interface - no coding experience required!

---

## 📋 **STEP 1: Create Your Module Data File**

### 1.1 Navigate to the modules folder
1. **Go to your GitHub repository** in your web browser
2. **Click on the `src` folder**
3. **Click on the `modules` folder**
4. **Click the "Add file" button** (top right)
5. **Select "Create new file"**

### 1.2 Create the new JSON file
1. **In the filename box**, type: `yourModuleName.json`
   - Replace `yourModuleName` with your actual module name
   - Examples: `exercises.json`, `medications.json`, `foods.json`
   - ⚠️ **Important**: Use lowercase letters and no spaces

2. **Copy the entire content** from the `exampleModules.json` template above
3. **Paste it into the file content area**

### 1.3 Customize your data
**Edit these parts to match your content:**

1. **Change the main module name** (line 2):
   ```json
   "exampleModules": [
   ```
   To something like:
   ```json
   "exerciseModules": [
   ```

2. **Update each module section**:
   - Change `"id"` (must be lowercase-with-hyphens)
   - Change `"name"` (display name users see)
   - Change `"icon"` (pick an emoji that fits)
   - Change `"instructions"` (brief description)

3. **Update each data item**:
   - Change all the `"id"` values
   - Change all the `"name"` values  
   - Update `"description"` text
   - Adjust numbers for your data type (see ranges in template)
   - Pick appropriate `"fallbackIcon"` emojis

4. **Validate the JSON you just createad**:
Copy the entire file, go to https://jsonlint.com/, paste the file, and click Validate.

### 1.4 Save the file
1. **Scroll to bottom of page**
2. **In "Commit new file" section**:
   - Title: `Add [your module name] data`
   - Description: `Added new learning module for [describe what it does]`
3. **Click "Commit new file"**

---

## 📋 **STEP 2: Add to Navigation Menu**

### 2.1 Open appSections.js
1. **Go back to the main repository page**
2. **Click on `src` folder**
3. **Click on `appSections.js`**
4. **Click the pencil icon (✏️)** to edit

### 2.2 Add your page to the menu
1. **Find this section** (around line 3):
   ```javascript
   export const appSections = [
   ```

2. **Scroll down to find the existing pages** (around line 15-25)

3. **Add your new page BEFORE the closing `];`**:
   ```javascript
   {
     id: 'your-module-name',
     name: 'Your Module Display Name',
     description: 'Brief description of what this page does'
   },
   ```

**Example:**
```javascript
{
  id: 'exercises',
  name: 'Exercise Tracker', 
  description: 'Learn how different exercises affect your health'
},
```

⚠️ **Important**: 
- The `id` must match your JSON filename (without .json)
- Don't forget the comma after the closing `}`

### 2.3 Save the changes
1. **Scroll to bottom**
2. **Commit changes**:
   - Title: `Add [module name] to navigation`
   - Description: `Added new page to navigation menu`
3. **Click "Commit changes"**

---

## 📋 **STEP 3: Configure the Page**

### 3.1 Open pageConfigs.js
1. **Go back to the main repository page**
2. **Click on `src` folder**  
3. **Click on `pageConfigs.js`**
4. **Click the pencil icon (✏️)** to edit

### 3.2 Add import for your module
1. **Find the import section** at the top (around lines 3-6):
   ```javascript
   import glycemicIndexModulesData from './modules/glycemicIndexModules.json';
   import ketoneModulesData from './modules/ketoneModules.json';
   ```

2. **Add your import** (replace with your actual filename):
   ```javascript
   import yourModuleData from './modules/yourModuleName.json';
   ```

**Example:**
```javascript
import exerciseModulesData from './modules/exercises.json';
```

### 3.3 Add your page configuration
1. **Scroll down to find `export const pageConfigs = {`** (around line 10)

2. **Find the end of the existing pages** (look for the insulin-dosing section)

3. **Add your new page BEFORE the closing `};`**:

```javascript
// Your New Page
'your-page-id': {
  component: 'LearningModule',
  enabled: true,
  props: {
    title: 'Your Page Title',
    modules: yourModuleData?.yourModulesArrayName || [],
    chartConfig: {
      baselineValue: 120,              // Starting value for your data type
      chartHeight: 300,
      chartWidth: settings.chartWidth,
      yMin: 70,                        // Minimum chart value
      yMax: 200,                       // Maximum chart value  
      timeRange: { start: settings.startHour, end: settings.endHour },
      dangerZones: [
        { value: 70, color: '#ef4444', label: 'Low' },
        { value: 120, color: '#22c55e', label: 'Normal' },
        { value: 180, color: '#f59e0b', label: 'High' }
      ]
    },
    displayConfig: {
      showComparison: true,
      backgroundColor: '#E7EEEB',          
      buttonStyle: 'blue',             // Color theme: 'blue', 'teal', 'green'
      unitLabel: 'mg/dL',              // Unit shown on chart
      defaultLineColor: '#22c55e',
      showLegend: false,               // Set to true if you want a legend
      legendTitle: 'Your Data Ranges',
      legendItems: [
        { color: '#ef4444', label: 'Low range description' },
        { color: '#22c55e', label: 'Normal range description' },
        { color: '#f59e0b', label: 'High range description' }
      ]
    }
  }
},
```

### 3.4 Customize your configuration

**REQUIRED Changes:**
- `'your-page-id'`: Must match the `id` in appSections.js
- `title`: Display name for the page
- `yourModuleData`: Must match your import name
- `yourModulesArrayName`: Must match the array name in your JSON

**OPTIONAL Changes:**
- `baselineValue`: Starting point for your data type
- `yMin/yMax`: Chart range for your data
- `buttonStyle`: 'blue', 'teal', 'green', 'purple'
- `unitLabel`: What units to show (mg/dL, mmol/L, BPM, etc.)
- `dangerZones`: Colored ranges on your chart

### 3.5 Save the changes
1. **Scroll to bottom**
2. **Commit changes**:
   - Title: `Add [module name] page configuration`
   - Description: `Configured new learning module page`
3. **Click "Commit changes"**

---

## ✅ **STEP 4: Test Your New Page**

After completing all steps:

1. **Wait a few minutes** for the site to rebuild
2. **Visit your live website**
3. **Click the navigation dropdown**
4. **Look for your new page** in the menu
5. **Click it to test** that it loads correctly

---

## 🛠️ **Common Issues & Fixes**

### ❌ **Page doesn't appear in menu**
- Check that the `id` in appSections.js matches exactly
- Make sure you didn't forget a comma

### ❌ **Page shows "No modules available"**
- Check that your import path is correct in pageConfigs.js
- Verify the array name matches between JSON and pageConfigs
- Use browser developer tools to check for import errors

### ❌ **Chart looks wrong**
- Adjust `yMin` and `yMax` to fit your data range
- Check that `baselineValue` is within your min/max range
- Verify your data values make sense for the chart type

### ❌ **JSON validation errors**
- Use the JSON validator tool to check your file
- Common issues: missing commas, extra commas, unmatched quotes
- Make sure all `id` fields use lowercase-with-hyphens format

---

## 💡 **Pro Tips**

1. **Start small**: Create just one module with 2-3 items first
2. **Copy existing patterns**: Look at ketoneModules.json for examples
3. **Use the validator**: Always check your JSON before committing
4. **Test frequently**: Make small changes and test each step
5. **Keep backups**: GitHub keeps version history, but be careful with changes

---

## 📞 **Getting Help**

If you run into issues:

1. **Check the browser console** for error messages
2. **Compare your code** to the working examples
3. **Use the JSON validator** to check for syntax errors
4. **Look at GitHub commit history** to see what changed
5. **Ask for help** with specific error messages

Remember: GitHub saves every change, so you can always go back if something breaks!