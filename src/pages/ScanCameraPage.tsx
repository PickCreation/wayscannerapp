
import React, { useState, useRef } from "react";
import { ChevronLeft, Camera, Upload, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ScanCameraPage = () => {
  const [captureMode, setCaptureMode] = useState<"camera" | "upload">("camera");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleCapture = () => {
    // In a real implementation, this would access the device camera
    // For now, we'll simulate capturing by showing a sample image
    setImagePreview("/lovable-uploads/69501614-b92c-43f9-89e5-85971b5b6ede.png");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    // In a real app, you would send the image to an API for processing
    // Navigate to animal scan results with simulated success
    navigate("/scan?tab=animals");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-black text-white py-4 px-4 flex justify-start items-center z-10">
        <button 
          className="p-2" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6" color="white" />
        </button>
        <h1 className="text-[20px] font-medium ml-2">{captureMode === "camera" ? "Scan Animal" : "Upload Image"}</h1>
      </header>

      {/* Camera/Preview Area */}
      <div className="flex-1 flex items-center justify-center bg-black relative">
        {imagePreview ? (
          <div className="relative w-full h-full">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <Button 
                className="bg-wayscanner-blue hover:bg-blue-700 text-white rounded-full px-8 py-2 flex items-center"
                onClick={handleSubmit}
              >
                <Check className="mr-2" size={20} />
                Use this image
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {captureMode === "camera" ? (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4 mx-auto">
                  <Camera size={48} className="text-white" />
                </div>
                <p className="text-white text-lg mb-8">Position the animal in the frame</p>
              </div>
            ) : (
              <div className="text-center">
                <div 
                  className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4 mx-auto cursor-pointer"
                  onClick={handleUploadClick}
                >
                  <Upload size={48} className="text-white" />
                </div>
                <p className="text-white text-lg mb-8">Tap to upload an image</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      {!imagePreview && (
        <div className="bg-black py-6 px-4">
          <div className="flex justify-around mb-4">
            <Button 
              className={`${captureMode === "camera" ? "bg-white text-black" : "bg-gray-800 text-white"} rounded-full px-6 py-2`}
              onClick={() => setCaptureMode("camera")}
            >
              Camera
            </Button>
            <Button 
              className={`${captureMode === "upload" ? "bg-white text-black" : "bg-gray-800 text-white"} rounded-full px-6 py-2`}
              onClick={() => setCaptureMode("upload")}
            >
              Upload
            </Button>
          </div>
          
          {captureMode === "camera" && (
            <Button 
              className="w-16 h-16 rounded-full bg-white hover:bg-gray-200 mx-auto flex items-center justify-center border-4 border-gray-800"
              onClick={handleCapture}
            >
              <div className="w-12 h-12 rounded-full bg-red-500"></div>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanCameraPage;
