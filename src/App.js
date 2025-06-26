import React, { useState } from 'react';
import GlucoseTracker from './components/GlucoseTracker';
import LearningModule from './components/LearningModule';
import { appSections } from './components/data/appSections';
import { pageConfigs } from './components/data/pageConfigs';

const App = () => {
  const [currentPage, setCurrentPage] = useState('blood-sugar');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNavigate = (page) => {
    if (page === currentPage) {
      setShowDropdown(!showDropdown);
    } else {
      setCurrentPage(page);
      setShowDropdown(false);
    }
  };

  // Get the current page configuration
  const currentPageConfig = pageConfigs[currentPage];

  // Render the appropriate component based on configuration
  const renderCurrentPage = () => {
    if (!currentPageConfig) {
      return <div>Page not found</div>;
    }

    const { component, props = {} } = currentPageConfig;

    switch (component) {
      case 'GlucoseTracker':
        return <GlucoseTracker onNavigate={handleNavigate} {...props} />;
      
      case 'LearningModule':
        return <LearningModule onNavigate={handleNavigate} {...props} />;
      
      default:
        return <div>Component not found: {component}</div>;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-16 left-4 right-4 bg-white rounded-lg shadow-lg border z-50 max-w-xs">
          {appSections.map((item) => {
            const isEnabled = pageConfigs[item.id] && pageConfigs[item.id].enabled !== false;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isEnabled) {
                    setCurrentPage(item.id);
                  }
                  setShowDropdown(false);
                }}
                disabled={!isEnabled}
                className={`
                  w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors
                  ${currentPage === item.id ? 'bg-teal-50 text-teal-600 font-medium' : 'text-gray-700'}
                  ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}
                  first:rounded-t-lg last:rounded-b-lg
                `}
              >
                {item.name}
                {!isEnabled && (
                  <span className="text-xs text-gray-400 ml-2">(Coming Soon)</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Render Current Page */}
      {renderCurrentPage()}
    </div>
  );
};

export default App;