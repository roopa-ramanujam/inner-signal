import React, { useState } from 'react';

const ItemImage = ({ item, className = "", size = "medium" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    console.log('Image failed to load:', item.image); // Debug logging
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', item.image); // Debug logging
    setImageLoading(false);
  };

  // Size configurations - removed conflicting classes
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12", 
    large: "w-16 h-16",
    slider: "w-6 h-6"
  };

  const fallbackSizes = {
    small: "text-lg",
    medium: "text-xl", 
    large: "text-2xl",
    slider: "text-sm"
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.medium;
  const fallbackSize = fallbackSizes[size] || fallbackSizes.medium;

  // Debug logging
  console.log('ItemImage rendering:', {
    item: item.item,
    image: item.image,
    fallbackIcon: item.fallbackIcon,
    imageError,
    imageLoading
  });

  // If no image is provided or image failed to load, show fallback icon
  if (!item.image || imageError) {
    return (
      <div className={`${currentSizeClass} flex items-center justify-center ${className}`}>
        <span className={fallbackSize}>{item.fallbackIcon || '🍽️'}</span>
      </div>
    );
  }

  return (
    <div className={`${currentSizeClass} relative overflow-hidden ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
        </div>
      )}
      
      <img
        src={item.image}
        alt={item.item || 'Food item'}
        className={`w-full h-full object-contain transition-opacity duration-200 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
      
      {/* Fallback overlay in case image doesn't load properly */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className={`text-gray-600 ${fallbackSize}`}>{item.fallbackIcon || '🍽️'}</span>
        </div>
      )}
    </div>
  );
};

export default ItemImage;