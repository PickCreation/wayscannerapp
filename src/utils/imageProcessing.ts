
// This file provides utility functions for processing images

/**
 * Converts an image file to a base64 string
 * @param file The image file to convert
 * @returns A promise that resolves to the base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Converts a base64 string to a blob
 * @param base64 The base64 string to convert
 * @param mimeType The MIME type of the blob
 * @returns The blob
 */
export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
};

/**
 * Resizes an image to the specified dimensions
 * @param image The image element to resize
 * @param maxWidth The maximum width of the resized image
 * @param maxHeight The maximum height of the resized image
 * @returns A promise that resolves to the resized image as a base64 string
 */
export const resizeImage = (image: HTMLImageElement, maxWidth: number, maxHeight: number): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    let width = image.width;
    let height = image.height;
    
    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }
    
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(image, 0, 0, width, height);
    }
    resolve(canvas.toDataURL('image/jpeg', 0.85));
  });
};

/**
 * Compresses an image to reduce file size
 * @param base64 The base64 string to compress
 * @param quality The quality of the compressed image (0-1)
 * @returns A promise that resolves to the compressed image as a base64 string
 */
export const compressImage = (base64: string, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
  });
};

/**
 * Safely load an image and get its data
 * @param src The image source URL or base64 string
 * @returns A promise that resolves to the image element
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // This helps with CORS issues
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
};

/**
 * Creates a thumbnail from an image
 * @param base64 The base64 string to create thumbnail from
 * @param size The size of the thumbnail (width and height)
 * @returns A promise that resolves to the thumbnail as a base64 string
 */
export const createThumbnail = async (base64: string, size: number = 100): Promise<string> => {
  const img = await loadImage(base64);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Calculate dimensions to maintain aspect ratio while fitting in the square
  const scale = Math.max(img.width, img.height) / size;
  const width = img.width / scale;
  const height = img.height / scale;
  const x = (size - width) / 2;
  const y = (size - height) / 2;
  
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, x, y, width, height);
  }
  
  return canvas.toDataURL('image/jpeg', 0.85);
};

/**
 * Extracts dominant colors from an image
 * @param imageUrl The URL or base64 of the image
 * @returns A promise that resolves to an array of dominant RGB color values
 */
export const extractDominantColors = async (imageUrl: string): Promise<string[]> => {
  try {
    const img = await loadImage(imageUrl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Use a smaller canvas for processing efficiency
    const processingSize = 100;
    canvas.width = processingSize;
    canvas.height = processingSize;
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0, processingSize, processingSize);
    
    // Get the image data
    const imageData = ctx.getImageData(0, 0, processingSize, processingSize).data;
    
    // Simple color counting for dominant colors
    const colorCounts: Record<string, number> = {};
    
    for (let i = 0; i < imageData.length; i += 4) {
      // Round the RGB values to reduce the number of unique colors
      const r = Math.round(imageData[i] / 10) * 10;
      const g = Math.round(imageData[i + 1] / 10) * 10;
      const b = Math.round(imageData[i + 2] / 10) * 10;
      
      const colorKey = `rgb(${r},${g},${b})`;
      colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
    }
    
    // Sort colors by frequency
    const sortedColors = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => color)
      .slice(0, 5); // Get top 5 colors
    
    return sortedColors;
  } catch (error) {
    console.error('Error extracting dominant colors:', error);
    return [];
  }
};

/**
 * Compare two images and return a similarity score (0-1)
 * @param imageUrl1 The URL or base64 of the first image
 * @param imageUrl2 The URL or base64 of the second image
 * @returns A promise that resolves to a similarity score (0-1)
 */
export const compareImages = async (imageUrl1: string, imageUrl2: string): Promise<number> => {
  try {
    const colors1 = await extractDominantColors(imageUrl1);
    const colors2 = await extractDominantColors(imageUrl2);
    
    // Simple color matching score
    let matches = 0;
    for (const color1 of colors1) {
      if (colors2.some(color2 => colorDistance(color1, color2) < 50)) {
        matches++;
      }
    }
    
    return matches / Math.max(colors1.length, 1);
  } catch (error) {
    console.error('Error comparing images:', error);
    return 0;
  }
};

/**
 * Calculate the distance between two RGB colors
 * @param color1 The first color in rgb format
 * @param color2 The second color in rgb format
 * @returns The distance between the two colors
 */
const colorDistance = (color1: string, color2: string): number => {
  const rgb1 = color1.match(/\d+/g)?.map(Number) || [0, 0, 0];
  const rgb2 = color2.match(/\d+/g)?.map(Number) || [0, 0, 0];
  
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
};
