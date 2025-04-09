import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, Camera, Upload, Check, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { identifyAnimal, getAnimalDetails } from "@/services/animalRecognitionService";
import { Progress } from "@/components/ui/progress";
import { fileToBase64 } from "@/utils/imageProcessing";

const ScanCameraPage = () => {
  const [captureMode, setCaptureMode] = useState<"camera" | "upload">("camera");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const scanType = location.state?.scanType || "general";

  // Progress simulation effect
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isProcessing) {
      setProgress(0);
      setProcessingStage("Analyzing image...");
      
      progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 40) {
            setProcessingStage("Identifying animal species...");
          }
          if (prevProgress >= 70) {
            setProcessingStage("Gathering detailed information...");
          }
          if (prevProgress >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prevProgress + 5;
        });
      }, 300);
    } else {
      setProgress(0);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isProcessing]);

  const handleCapture = () => {
    // In a real implementation, this would access the device camera
    // For now, we'll simulate capturing by showing a sample image
    if (scanType === "animal") {
      setImagePreview("/lovable-uploads/a3386c5c-af28-42ee-96df-91008ff21cb5.png");
    } else {
      setImagePreview("/lovable-uploads/69501614-b92c-43f9-89e5-85971b5b6ede.png");
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64Image = await fileToBase64(file);
        setImagePreview(base64Image);
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("Failed to process the image. Please try again.");
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!imagePreview) return;

    try {
      setIsProcessing(true);
      
      // Log the image preview URL to help with debugging
      console.log("Processing image:", imagePreview);

      // First identify the animal using Google Vision API
      const animalName = await identifyAnimal(imagePreview);
      console.log("Identified animal:", animalName);
      
      if (!animalName) {
        toast.error("Could not identify animal in image. Please try again.");
        setIsProcessing(false);
        return;
      }
      
      // Then get details from OpenAI
      const animalDetails = await getAnimalDetails(animalName);
      console.log("Animal details received:", animalDetails?.id, animalDetails?.name);
      
      if (!animalDetails) {
        toast.error("Could not retrieve animal details. Please try again.");
        setIsProcessing(false);
        return;
      }
      
      // Set progress to 100% to indicate completion
      setProgress(100);
      setProcessingStage("Analysis complete!");
      
      // Wait a moment for the user to see the 100% completion
      setTimeout(() => {
        // Navigate to the animal detail page
        navigate(`/animal/${animalDetails.id}`);
        toast.success(`Animal identified: ${animalName}`);
      }, 500);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("There was an error processing your image. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-black text-white py-4 px-4 flex justify-start items-center z-10">
        <button 
          className="p-2" 
          onClick={() => navigate(-1)}
          disabled={isProcessing}
        >
          <ChevronLeft className="h-6 w-6" color="white" />
        </button>
        <h1 className="text-[20px] font-medium ml-2">
          {scanType === "animal" ? "Scan Animal" : captureMode === "camera" ? "Scan Animal" : "Upload Image"}
        </h1>
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
            {isProcessing ? (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-6 flex flex-col items-center">
                <p className="text-white text-lg mb-3">{processingStage}</p>
                <Progress className="w-full h-2 mb-4" value={progress} indicatorColor="bg-blue-500" />
                <p className="text-white text-sm">{progress}% complete</p>
              </div>
            ) : (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button 
                  className="bg-wayscanner-blue hover:bg-blue-700 text-white rounded-full px-8 py-2 flex items-center"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  <Check className="mr-2" size={20} />
                  Use this image
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {captureMode === "camera" ? (
              <div className="text-center">
                {/* Camera Frame Guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-2 border-white rounded-lg opacity-70"></div>
                </div>
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
      {!imagePreview && !isProcessing && (
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
                className="w-16 h-16 rounded-full bg-white hover:bg-gray-200 mx-auto flex items-center justify-center border-4 border-gray-800"
                onClick={handleCapture}
              >
                <div className="w-12 h-12 rounded-full bg-red-500"></div>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanCameraPage;
