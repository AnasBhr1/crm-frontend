import React from 'react';

const sizes = {
  small: 'w-4 h-4',
  medium: 'w-8 h-8',
  large: 'w-12 h-12',
};

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = sizes[size] || sizes.medium;
  
  return (
    <div className={`${className} flex items-center justify-center`}>
      <div className={`${sizeClasses} border-4 border-gray-200 border-t-primary rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;