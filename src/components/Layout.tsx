
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showBackButton = true,
  title
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {(showBackButton || title) && (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center">
            {showBackButton && (
              <button 
                onClick={handleBack}
                className="p-2 -ml-2 mr-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            {title && <h1 className="text-lg font-medium">{title}</h1>}
          </div>
        </header>
      )}
      
      {/* Main content */}
      <main>
        {children}
      </main>
    </div>
  );
};
