
import React, { useState, useRef } from "react";
import { ChevronLeft, Camera, Upload, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PlantScanCameraPage = () => {
  const [captureMode, setCaptureMode] = useState<"camera" | "upload">("camera");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleCapture = () => {
    setImagePreview("/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png");
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
    navigate("/scan?tab=plants");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="bg-black text-white py-4 px-4 flex justify-start items-center z-10">
        <button 
          className="p-2" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6" color="white" />
        </button>
        <h1 className="text-[20px] font-medium ml-2">{captureMode === "camera" ? "Scan Plant" : "Upload Image"}</h1>
      </header>

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
                className="bg-wayscanner-green hover:bg-green-700 text-white rounded-full px-8 py-2 flex items-center"
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
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-2 border-white rounded-lg opacity-70"></div>
                </div>
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4 mx-auto">
                  <Camera size={48} className="text-white" />
                </div>
                <p className="text-white text-lg mb-8">Position the plant in the frame</p>
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
            <div className="w-full flex justify-center">
              <Button 
                className="w-14 h-14 rounded-full bg-white hover:bg-gray-50 mx-auto flex items-center justify-center relative"
                onClick={handleCapture}
              >
                <div className="w-12 h-12 rounded-full bg-white absolute border border-black"></div>
                <div className="w-11 h-11 rounded-full bg-white absolute"></div>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantScanCameraPage;
