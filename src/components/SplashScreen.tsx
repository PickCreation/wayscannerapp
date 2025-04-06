
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Scan, Brain, Lightbulb, BarChart } from "lucide-react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onClose: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onClose }) => {
  useEffect(() => {
    // Automatically close after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    // Clear timeout if component unmounts
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-wayscanner-blue flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: "#034AFF" }}
    >
      <Button 
        variant="ghost" 
        className="absolute top-4 right-4 text-white hover:bg-blue-600" 
        onClick={onClose}
      >
        <X size={24} />
      </Button>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <img 
          src="/lovable-uploads/8fdd5ac8-39b5-43e6-86de-c8b27715d7c8.png" 
          alt="WayScanner Logo" 
          className="h-24" 
        />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold text-white mb-4 text-center"
      >
        Scan smart, Learn more!
      </motion.h1>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center space-x-6 mb-8"
      >
        <div className="flex flex-col items-center">
          <div className="bg-white/20 p-4 rounded-full mb-2">
            <Scan size={28} color="white" />
          </div>
          <span className="text-white text-xs">Scan</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-white/20 p-4 rounded-full mb-2">
            <Brain size={28} color="white" />
          </div>
          <span className="text-white text-xs">Identify</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-white/20 p-4 rounded-full mb-2">
            <Lightbulb size={28} color="white" />
          </div>
          <span className="text-white text-xs">Learn</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-white/20 p-4 rounded-full mb-2">
            <BarChart size={28} color="white" />
          </div>
          <span className="text-white text-xs">Track</span>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-white/70 text-sm text-center"
      >
        Your Ultimate Exploration Companion
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 text-white/50 text-xs"
      >
        Tap anywhere to continue
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
