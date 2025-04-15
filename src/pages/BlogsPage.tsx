
import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, FilterX, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CameraSheet from "@/components/CameraSheet";
import { getAllBlogs, BlogPost } from "@/lib/blogsService";

const CATEGORIES = [
  "All",
  "Eco-friendly",
  "Sustainable",
  "Green Living",
  "Organic",
  "Zero Waste",
  "Conservation",
  "Climate",
  "Environment",
];

const BlogsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeNavItem, setActiveNavItem] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [isCameraSheetOpen, setIsCameraSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const fetchedBlogs = await getAllBlogs();
        setBlogs(fetchedBlogs);
        setFilteredBlogs(fetchedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        toast({
          title: "Error",
          description: "Failed to load blogs. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [toast]);

  useEffect(() => {
    let result = blogs;
    
    if (searchQuery) {
      result = result.filter(
        blog => 
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== "All") {
      result = result.filter(blog => blog.category === selectedCategory);
    }
    
    setFilteredBlogs(result);
  }, [searchQuery, selectedCategory, blogs]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop" | "profile") => {
    setActiveNavItem(item);
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
    setIsCameraSheetOpen(true);
  };

  const handleBlogClick = (blogId: string) => {
    navigate(`/blogs/${blogId}`);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-wayscanner-blue text-white p-4">
        <div className="flex justify-between items-center mb-4">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold">Blog & Articles</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 py-2 w-full border rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <FilterX size={18} />
            </button>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-gray-700">Categories</h2>
            {(searchQuery || selectedCategory !== "All") && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-sm text-blue-600">
                Clear Filters
              </Button>
            )}
          </div>
          <div className="flex overflow-x-auto py-2 gap-2 no-scrollbar">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm flex items-center whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-blue-100 text-blue-600 border border-blue-300"
                    : "bg-white border border-gray-300"
                }`}
                type="button"
              >
                {selectedCategory === category && category === "All" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {category}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wayscanner-blue"></div>
          </div>
        ) : (
          <div className="mb-4">
            <Tabs defaultValue="featured" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>
              <TabsContent value="featured" className="space-y-4">
                {filteredBlogs.length > 0 ? (
                  filteredBlogs.map((blog) => (
                    <Card 
                      key={blog.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleBlogClick(blog.id)}
                    >
                      <div className="aspect-w-16 aspect-h-9 w-full">
                        <img 
                          src={blog.image} 
                          alt={blog.title} 
                          className="object-cover w-full h-48 rounded-t-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                            target.onerror = null;
                          }}
                        />
                      </div>
                      <CardContent className="pt-4">
                        <div className="inline-block mb-2 px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                          {blog.category}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-gray-500 text-xs">
                            <MessageSquare size={14} className="mr-1" />
                            <span>{blog.commentsCount}</span>
                          </div>
                          <div className="text-xs text-gray-500">{blog.readTime}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">No articles found</p>
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear filters
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="recent" className="space-y-4">
                {filteredBlogs.length > 0 ? (
                  [...filteredBlogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((blog) => (
                    <Card 
                      key={blog.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleBlogClick(blog.id)}
                    >
                      <div className="aspect-w-16 aspect-h-9 w-full">
                        <img 
                          src={blog.image} 
                          alt={blog.title} 
                          className="object-cover w-full h-48 rounded-t-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                            target.onerror = null;
                          }}
                        />
                      </div>
                      <CardContent className="pt-4">
                        <div className="inline-block mb-2 px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                          {blog.category}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-gray-500 text-xs">
                            <MessageSquare size={14} className="mr-1" />
                            <span>{blog.commentsCount}</span>
                          </div>
                          <div className="text-xs text-gray-500">{blog.readTime}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">No articles found</p>
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear filters
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="popular" className="space-y-4">
                {filteredBlogs.length > 0 ? (
                  [...filteredBlogs].sort((a, b) => b.commentsCount - a.commentsCount).map((blog) => (
                    <Card 
                      key={blog.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleBlogClick(blog.id)}
                    >
                      <div className="aspect-w-16 aspect-h-9 w-full">
                        <img 
                          src={blog.image} 
                          alt={blog.title} 
                          className="object-cover w-full h-48 rounded-t-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                            target.onerror = null;
                          }}
                        />
                      </div>
                      <CardContent className="pt-4">
                        <div className="inline-block mb-2 px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                          {blog.category}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-gray-500 text-xs">
                            <MessageSquare size={14} className="mr-1" />
                            <span>{blog.commentsCount}</span>
                          </div>
                          <div className="text-xs text-gray-500">{blog.readTime}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">No articles found</p>
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear filters
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      <CameraSheet 
        open={isCameraSheetOpen} 
        onOpenChange={setIsCameraSheetOpen}
      />

      <BottomNavigation
        activeItem={activeNavItem as "home" | "forum" | "recipes" | "shop" | "profile"}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default BlogsPage;
