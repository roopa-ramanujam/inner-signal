import React, { useState } from 'react';

const ItemImage = ({ item, className = "", size = "medium" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Size configurations
  const sizeClasses = {
    small: "w-8 h-8 text-lg",
    medium: "w-12 h-12 text-xl", 
    large: "w-16 h-16 text-2xl",
    slider: "w-6 h-6 text-sm" // For the draggable sliders
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.medium;

  // If no image is provided or image failed to load, show fallback icon
  if (!item.image || imageError) {
    return (
      <div className={`${currentSizeClass} flex items-center justify-center ${className}`}>
        <span>{item.fallbackIcon}</span>
      </div>
    );
  }

  return (
    <div className={`${currentSizeClass} relative overflow-hidden rounded-lg ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
        </div>
      )}
      
      <img
        src={item.image}
        alt={item.item}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
      
      {/* Fallback overlay in case image doesn't load properly */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-600">{item.fallbackIcon}</span>
        </div>
      )}
    </div>
  );
};

export default ItemImage;