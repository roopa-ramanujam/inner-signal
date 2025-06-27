// appSections.js
// This file controls what appears in the navigation dropdown
// To add a new page to the menu, just add it here!

export const appSections = [
  {
    id: 'blood-sugar',
    name: 'Blood Sugar Tracker',
    description: 'Track and monitor your glucose levels'
  },
  {
    id: 'glycemic-index', 
    name: 'Glycemic Index',
    description: 'Learn how foods affect your blood sugar'
  },
  {
    id: 'insulin-dosing',
    name: 'Insulin Dosing', 
    description: ''
  },
  {
    id: 'ketones',
    name: 'Ketones',
    description: ''
  },
  {
  id: 'test',
  name: 'Test Module',
  description: 'Brief description of what this page does'
  },
  // {
  //   id: 'example-page',
  //   name: 'Example Page',
  //   description: 'Example description of page'
  // }
];

// TO ADD A NEW PAGE TO THE NAVIGATION:
// 1. Add a new object to this array with id, name, and description
// 2. Make sure the id matches what you use in pageConfigs.js
// 3. That's it! The page will appear in the dropdown menu
