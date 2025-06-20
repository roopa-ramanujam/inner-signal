// Utility functions for handling food images

/**
 * Checks if an image URL is valid and accessible
 * @param {string} imageUrl - The URL to check
 * @returns {Promise<boolean>} - True if image is accessible, false otherwise
 */
 export const checkImageExists = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  };
  
  /**
   * Preloads item images to improve performance
   * @param {Array} itemLibrary - Array of items with image URLs
   * @returns {Promise<Array>} - Promise that resolves when all images are checked
   */
  export const preloadItemImages = async (foodLibrary) => {
    const imageChecks = itemLibrary.map(async (food) => {
      if (food.image) {
        const exists = await checkImageExists(food.image);
        return { ...food, imageExists: exists };
      }
      return { ...food, imageExists: false };
    });
    
    return Promise.all(imageChecks);
  };
  
  /**
   * Generates optimized image URLs with size parameters (if using a service like Cloudinary)
   * @param {string} imageUrl - Original image URL
   * @param {string} size - Size preset ('small', 'medium', 'large')
   * @returns {string} - Optimized image URL
   */
  export const getOptimizedImageUrl = (imageUrl, size = 'medium') => {
    // If you're using a service like Cloudinary, you can add transformation parameters here
    // For now, return the original URL
    return imageUrl;
    
    // Example for Cloudinary:
    // const sizeParams = {
    //   small: 'w_64,h_64,c_fill',
    //   medium: 'w_128,h_128,c_fill',
    //   large: 'w_256,h_256,c_fill'
    // };
    // 
    // if (imageUrl.includes('cloudinary.com')) {
    //   return imageUrl.replace('/upload/', `/upload/${sizeParams[size]}/`);
    // }
    // 
    // return imageUrl;
  };
  
  /**
   * Default fallback icons for different food categories
   */
  export const categoryFallbacks = {
    meat: '🍗',
    drink: '🥤',
    fruit: '🍎',
    grain: '🍞',
    vegetable: '🥦',
    dairy: '🥛',
    exercise: '🏃',
    dessert: '🍰',
    snack: '🥨',
    default: '🍽️'
  };
  
  /**
   * Gets fallback icon for a food category
   * @param {string} category - Food category
   * @returns {string} - Emoji icon
   */
  export const getCategoryFallback = (category) => {
    return categoryFallbacks[category] || categoryFallbacks.default;
  };