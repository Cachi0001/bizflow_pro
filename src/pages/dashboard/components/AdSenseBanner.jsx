import React from 'react';

const AdSenseBanner = ({ position = 'horizontal', className = '' }) => {
  const bannerStyles = {
    horizontal: 'w-full h-24 bg-gray-100 border-2 border-dashed border-gray-300',
    square: 'w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300',
    vertical: 'w-40 h-96 bg-gray-100 border-2 border-dashed border-gray-300'
  };

  const bannerSizes = {
    horizontal: '728x90',
    square: '300x250',
    vertical: '160x600'
  };

  return (
    <div className={`${bannerStyles[position]} ${className} flex items-center justify-center rounded-lg`}>
      <div className="text-center">
        <div className="text-gray-400 text-sm font-medium mb-1">
          AdSense Banner
        </div>
        <div className="text-gray-300 text-xs">
          {bannerSizes[position]}
        </div>
        <div className="text-gray-300 text-xs mt-2">
          Upgrade to Silver to remove ads
        </div>
      </div>
    </div>
  );
};

export default AdSenseBanner;