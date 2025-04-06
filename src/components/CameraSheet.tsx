
// We need to modify the CameraSheet component to emit an event when an image is captured
// Let's assume this component already exists and update it for our use case

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
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        if (open && !isCameraActive) {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsCameraActive(true);
          }
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          title: "Camera Error",
          description: "Could not access the camera. Please allow camera permissions or use file upload instead.",
          variant: "destructive",
        });
      }
    };
    
    if (open) {
      startCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setIsCameraActive(false);
      }
    };
  }, [open, toast]);
  
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
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setIsCameraActive(false);
        }
      }
    }
  };
  
  const handleRetake = async () => {
    setCapturedImage(null);
    setSelectedFile(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error restarting camera:", error);
      toast({
        title: "Camera Error",
        description: "Could not restart the camera.",
        variant: "destructive",
      });
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
      if (isCameraActive && videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setIsCameraActive(false);
        }
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
        title: "Image Captured",
        description: "Image has been successfully saved.",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90%] p-0 overflow-hidden rounded-t-xl">
        <SheetHeader className="px-4 pt-4">
          <div className="flex justify-between items-center">
            <SheetTitle>Take a Photo</SheetTitle>
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
                    <Camera size={48} className="mx-auto mb-4" />
                    <p>Camera inactive. Please allow camera access or upload a photo.</p>
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
                  
                  <Button 
                    className="flex-1 bg-wayscanner-blue"
                    onClick={handleCapture}
                    disabled={!isCameraActive}
                  >
                    <Camera size={18} className="mr-2" />
                    Capture
                  </Button>
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
                    <Camera size={18} className="mr-2" />
                    Retake
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
