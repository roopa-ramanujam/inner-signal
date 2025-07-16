import React, { useState } from 'react';
import GlucoseTracker from './components/GlucoseTracker';
import LearningModule from './components/LearningModule';

// Import JSON files
import appSectionsData from './components/data/appSections.json';
import pageConfigsData from './components/data/pageConfigs.json';
import { settings } from './components/data/settings';

const App = () => {
  const [currentPage, setCurrentPage] = useState('blood-sugar');
  const [showDropdown, setShowDropdown] = useState(false);

  const appSections = appSectionsData;
  const pageConfigs = pageConfigsData;

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

  // Dynamic module loading function
  const loadModuleData = async (moduleFileName) => {
    try {
      const moduleData = await import(`./components/data/modules/${moduleFileName}.json`);
      return moduleData.default;
    } catch (error) {
      console.warn(`Could not load module: ${moduleFileName}`, error);
      return {};
    }
  };

  // Helper function to resolve settings references
  const resolveConfigValue = (value) => {
    if (typeof value === 'string' && value.startsWith('settings.')) {
      const settingKey = value.replace('settings.', '');
      return settings[settingKey] || value;
    }
    return value;
  };

  // Process configuration to resolve all references
  const processPageConfig = async (config) => {
    if (!config || !config.props) return config;

    const processedConfig = JSON.parse(JSON.stringify(config));

    // Load modules if specified
    if (processedConfig.props.moduleFile) {
      const moduleData = await loadModuleData(processedConfig.props.moduleFile);
      const moduleKey = processedConfig.props.moduleKey;
      processedConfig.props.modules = moduleData[moduleKey] || [];
    }

    // Resolve chart config values
    if (processedConfig.props.chartConfig) {
      Object.keys(processedConfig.props.chartConfig).forEach(key => {
        if (key === 'timeRange' && typeof processedConfig.props.chartConfig[key] === 'object') {
          processedConfig.props.chartConfig[key] = {
            start: resolveConfigValue(processedConfig.props.chartConfig[key].start),
            end: resolveConfigValue(processedConfig.props.chartConfig[key].end)
          };
        } else if (key === 'dangerZones' && Array.isArray(processedConfig.props.chartConfig[key])) {
          processedConfig.props.chartConfig[key] = processedConfig.props.chartConfig[key].map(zone => ({
            value: zone.value,
            color: resolveConfigValue(zone.color),
            label: zone.label
          }));
        } else {
          processedConfig.props.chartConfig[key] = resolveConfigValue(processedConfig.props.chartConfig[key]);
        }
      });
    }

    // Resolve display config values
    if (processedConfig.props.displayConfig) {
      Object.keys(processedConfig.props.displayConfig).forEach(key => {
        processedConfig.props.displayConfig[key] = resolveConfigValue(processedConfig.props.displayConfig[key]);
      });
    }

    return processedConfig;
  };

  // Render the appropriate component based on configuration
  const renderCurrentPage = () => {
    if (!currentPageConfig) {
      return <div>Page not found</div>;
    }

    // Use React.lazy for async loading
    const [processedConfig, setProcessedConfig] = useState(null);
    
    React.useEffect(() => {
      processPageConfig(currentPageConfig).then(setProcessedConfig);
    }, [currentPageConfig]);

    if (!processedConfig) {
      return <div>Loading...</div>;
    }

    const { component, props = {} } = processedConfig;

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