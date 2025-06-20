import React, { useState } from 'react';
import GlucoseTracker from './components/GlucoseTracker';
import GlycemicIndexLearning from './components/GlycemicIndexLearning';
import { menuItems } from './components/data/library';

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

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-16 left-4 right-4 bg-white rounded-lg shadow-lg border z-50 max-w-xs">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'blood-sugar' || item.id === 'glycemic-index') {
                  setCurrentPage(item.id);
                }
                setShowDropdown(false);
              }}
              disabled={item.id !== 'blood-sugar' && item.id !== 'glycemic-index'}
              className={`
                w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors
                ${currentPage === item.id ? 'bg-teal-50 text-teal-600 font-medium' : 'text-gray-700'}
                ${item.id !== 'blood-sugar' && item.id !== 'glycemic-index' && item.id !== 'insulin-dosing' ? 'opacity-50 cursor-not-allowed' : ''}
                first:rounded-t-lg last:rounded-b-lg
              `}
            >
              {item.name}
              {item.id !== 'blood-sugar' && item.id !== 'glycemic-index' && (
                <span className="text-xs text-gray-400 ml-2">(Coming Soon)</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Render Current Page */}
      {currentPage === 'blood-sugar' && <GlucoseTracker onNavigate={handleNavigate}/>}
      {currentPage === 'glycemic-index' && <GlycemicIndexLearning onNavigate={handleNavigate} />}
      {currentPage === 'insulin-dosing' && <InsulinDosing onNavigate={handleNavigate} />}
    </div>
  );
};

export default App;
