
import React from 'react';

interface ImageGalleryProps {
  images?: string | string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  // Handle different image formats
  const imageArray = React.useMemo(() => {
    if (!images) return [];
    if (typeof images === 'string') return [images];
    return images;
  }, [images]);

  if (imageArray.length === 0) {
    return (
      <div className="w-full h-64 bg-slate-100 rounded-lg flex items-center justify-center">
        <span className="text-slate-400">No images available</span>
      </div>
    );
  }

  return (
    <div className="w-full mb-6">
      <div className="relative rounded-lg overflow-hidden aspect-video mb-2">
        <img
          src={imageArray[0]}
          alt="Plant"
          className="w-full h-full object-cover"
        />
      </div>
      
      {imageArray.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {imageArray.slice(1).map((img, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden aspect-square">
              <img
                src={img}
                alt={`Plant view ${index + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
