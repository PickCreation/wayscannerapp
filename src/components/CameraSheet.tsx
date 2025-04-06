
import React, { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Camera, Image, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CameraSheet = ({ open, onOpenChange }: CameraSheetProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Determine if we're on the profile page by checking the current URL
  const isProfilePage = () => {
    return window.location.pathname.includes('/profile') || 
           window.location.pathname.includes('/edit-profile');
  };
  
  useEffect(() => {
    // If on profile page, automatically trigger file selection when sheet opens
    if (open && isProfilePage()) {
      // Short delay to ensure the sheet is visible first
      setTimeout(() => {
        handleFileSelect();
      }, 300);
    } else if (open && !isCameraActive && !isProfilePage()) {
      // Only start camera for non-profile pages
      startCamera();
    }
    
    return () => {
      if (isCameraActive) {
        stopCamera();
      }
    };
  }, [open]);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please use file upload instead.",
        variant: "destructive",
      });
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setIsCameraActive(false);
      }
    }
  };
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageUrl);
        
        // Stop the camera after capturing
        stopCamera();
      }
    }
  };
  
  const handleRetake = async () => {
    setCapturedImage(null);
    setSelectedFile(null);
    
    // If on profile page, go back to file selection
    if (isProfilePage()) {
      handleFileSelect();
    } else {
      startCamera();
    }
  };
  
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    
    if (file) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Stop camera if it's active
      if (isCameraActive) {
        stopCamera();
      }
    }
  };
  
  const handleUseImage = () => {
    if (capturedImage) {
      // Dispatch a custom event with the image URL
      const event = new CustomEvent('imageCaptured', {
        detail: { imageUrl: capturedImage }
      });
      window.dispatchEvent(event);
      
      // Also dispatch an event to open create post if we're on the forum
      const pathname = window.location.pathname;
      if (pathname.includes('/forum')) {
        const createPostEvent = new Event('openCreatePost');
        window.dispatchEvent(createPostEvent);
      }
      
      // Close the sheet
      onOpenChange(false);
      
      toast({
        title: "Image Added",
        description: "Image has been successfully saved.",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90%] p-0 overflow-hidden rounded-t-xl">
        <SheetHeader className="px-4 pt-4">
          <div className="flex justify-between items-center">
            <SheetTitle>
              {isProfilePage() ? "Choose Profile Photo" : "Take a Photo"}
            </SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="rounded-full h-8 w-8"
            >
              <X size={18} />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {!capturedImage ? (
            <>
              <div className="relative flex-1 bg-black flex items-center justify-center">
                {isCameraActive ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-white text-center p-8">
                    <Image size={48} className="mx-auto mb-4" />
                    <p>{isProfilePage() 
                      ? "Select an image from your device" 
                      : "Camera inactive. Please allow camera access or upload a photo."}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-white">
                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={handleFileSelect}
                    className="flex-1"
                  >
                    <Image size={18} className="mr-2" />
                    Gallery
                  </Button>
                  
                  {!isProfilePage() && (
                    <Button 
                      className="flex-1 bg-wayscanner-blue"
                      onClick={handleCapture}
                      disabled={!isCameraActive}
                    >
                      <Camera size={18} className="mr-2" />
                      Capture
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 bg-black flex items-center justify-center">
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              
              <div className="p-4 bg-white">
                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={handleRetake}
                    className="flex-1"
                  >
                    {isProfilePage() ? (
                      <>
                        <Image size={18} className="mr-2" />
                        Choose Another
                      </>
                    ) : (
                      <>
                        <Camera size={18} className="mr-2" />
                        Retake
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    className="flex-1 bg-wayscanner-blue"
                    onClick={handleUseImage}
                  >
                    Use Photo
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden"
        />
      </SheetContent>
    </Sheet>
  );
};

export default CameraSheet;
