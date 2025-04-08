
import React, { useState } from "react";
import { ArrowLeft, Bookmark, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/hooks/use-auth";

const SavedArticlesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [savedArticles, setSavedArticles] = useState([
    {
      id: "1",
      title: "How to Create a Sustainable Indoor Garden",
      source: "Green Living",
      author: "Jane Smith",
      date: "April 5, 2025",
      readTime: "8 min read",
      thumbnail: "https://images.unsplash.com/photo-1531257240678-d5b1922e672d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    },
    {
      id: "2",
      title: "The Benefits of Plant-Based Diets for the Environment",
      source: "Eco Health Magazine",
      author: "Robert Johnson",
      date: "March 30, 2025",
      readTime: "12 min read",
      thumbnail: "https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2301&q=80"
    }
  ]);

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handleRemoveArticle = (articleId: string) => {
    setSavedArticles(savedArticles.filter(article => article.id !== articleId));
    toast({
      title: "Article Removed",
      description: "Article removed from your saved list",
    });
  };

  const handleViewArticle = (articleId: string) => {
    toast({
      title: "Opening Article",
      description: "Opening article in a new tab",
    });
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop" | "profile") => {
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
    } else if (item === "recipes") {
      navigate("/recipes");
    } else if (item === "shop") {
      navigate("/marketplace");
    } else if (item === "profile") {
      navigate("/profile");
    }
  };

  const handleCameraClick = () => {
    toast({
      title: "Camera",
      description: "The camera feature is under development.",
    });
  };

  if (!isAuthenticated) {
    navigate("/profile");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-wayscanner-blue text-white p-4 relative">
        <div className="flex justify-between items-center mb-2">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base font-bold">Saved Articles</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {savedArticles.length > 0 ? (
            savedArticles.map(article => (
              <div key={article.id} className="bg-white rounded-lg shadow overflow-hidden">
                {article.thumbnail && (
                  <div className="w-full h-40 overflow-hidden">
                    <img 
                      src={article.thumbnail} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 
                    className="font-bold text-lg mb-2 cursor-pointer hover:text-wayscanner-blue"
                    onClick={() => handleViewArticle(article.id)}
                  >
                    {article.title}
                  </h3>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span>{article.source} • {article.author}</span>
                    <span>{article.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-blue-500 border-blue-500"
                        onClick={() => handleViewArticle(article.id)}
                      >
                        <ExternalLink size={16} className="mr-1" />
                        Read
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 border-red-500"
                        onClick={() => handleRemoveArticle(article.id)}
                      >
                        <Bookmark size={16} className="mr-1" />
                        Unsave
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-center">You don't have any saved articles yet.</p>
              <p className="text-gray-500 text-sm text-center mt-2">
                When you find interesting articles, save them for later reading.
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation
        activeItem="profile"
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default SavedArticlesPage;
