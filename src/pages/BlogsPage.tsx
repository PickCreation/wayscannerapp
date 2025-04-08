import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, FilterX, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  commentsCount: number;
}

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

const BLOGS: BlogPost[] = [
  {
    id: "1",
    title: "10 Ways to Reduce Your Carbon Footprint at Home",
    excerpt: "Simple daily habits that can make a huge difference for our planet.",
    content: "Climate change is accelerating at an unprecedented rate, and our daily choices have a significant impact on the environment. In this article, we'll explore ten practical ways to reduce your carbon footprint without drastically changing your lifestyle...",
    category: "Climate",
    image: "/lovable-uploads/photo-1649972904349-6e44c42644a7.png",
    author: {
      name: "Emma Wilson",
      avatar: "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
    },
    date: "Apr 2, 2025",
    readTime: "6 min read",
    commentsCount: 14,
  },
  {
    id: "2",
    title: "The Ultimate Guide to Composting in Small Spaces",
    excerpt: "Yes, you can compost even in your apartment. Here's how.",
    content: "Composting is one of the most effective ways to reduce waste and create nutrient-rich soil for plants. But what if you live in an apartment or have limited outdoor space? In this comprehensive guide, we'll show you various methods for composting in small spaces...",
    category: "Zero Waste",
    image: "/lovable-uploads/photo-1486312338219-ce68d2c6f44d.png",
    author: {
      name: "Marcus Chen",
      avatar: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
    },
    date: "Mar 28, 2025",
    readTime: "8 min read",
    commentsCount: 27,
  },
  {
    id: "3",
    title: "Understanding Sustainable Fashion Labels",
    excerpt: "Navigate the confusing world of eco-fashion certifications with our simple guide.",
    content: "The fashion industry is one of the world's largest polluters, but a growing movement of sustainable fashion brands is working to change that. However, with so many eco-friendly labels and certifications on the market, it can be challenging to understand what they actually mean...",
    category: "Sustainable",
    image: "/lovable-uploads/photo-1488590528505-98d2b5aba04b.png",
    author: {
      name: "Sofia Rodriguez",
      avatar: "/lovable-uploads/69501614-b92c-43f9-89e5-85971b5b6ede.png",
    },
    date: "Mar 15, 2025",
    readTime: "5 min read",
    commentsCount: 9,
  },
  {
    id: "4",
    title: "The Rise of Eco-Tourism: Travel Responsibly",
    excerpt: "How to explore the world while minimizing your environmental impact.",
    content: "As global awareness about climate change grows, many travelers are seeking ways to explore the world more responsibly. Eco-tourism offers the opportunity to experience incredible destinations while minimizing your environmental impact and supporting local communities...",
    category: "Eco-friendly",
    image: "/lovable-uploads/5cf63fd0-114b-490f-96f9-b6b8dcc0b573.png",
    author: {
      name: "James Thompson",
      avatar: "/lovable-uploads/3981fb88-0fa3-404e-8a77-3a58ae1e0347.png",
    },
    date: "Mar 10, 2025",
    readTime: "7 min read",
    commentsCount: 18,
  },
  {
    id: "5",
    title: "Seasonal Eating: A Guide to Local Produce",
    excerpt: "Reduce your food miles and enjoy fresher, tastier meals.",
    content: "Eating seasonally isn't just better for the environment—it's also more delicious and nutritious. When you consume fruits and vegetables during their natural growing season, they require fewer resources to produce and transport, resulting in a lower carbon footprint...",
    category: "Organic",
    image: "/lovable-uploads/f2fb63ae-cc4d-4d46-ba4f-c70225d6d564.png",
    author: {
      name: "Olivia Johnson",
      avatar: "/lovable-uploads/b7a77845-a980-42f1-8b7e-eea9a8b822f8.png",
    },
    date: "Feb 28, 2025",
    readTime: "6 min read",
    commentsCount: 21,
  },
];

const BlogsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeNavItem, setActiveNavItem] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>(BLOGS);

  useEffect(() => {
    let result = BLOGS;
    
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
  }, [searchQuery, selectedCategory]);

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
    // Implementation for camera click
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
              <Badge 
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer whitespace-nowrap ${
                  selectedCategory === category 
                    ? "bg-wayscanner-blue hover:bg-blue-700" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

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
                      <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                        {blog.category}
                      </Badge>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>
                      <div className="flex items-center text-gray-500 text-xs">
                        <MessageSquare size={14} className="mr-1" />
                        <span>{blog.commentsCount}</span>
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
                      <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                        {blog.category}
                      </Badge>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>
                      <div className="flex items-center text-gray-500 text-xs">
                        <MessageSquare size={14} className="mr-1" />
                        <span>{blog.commentsCount}</span>
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
                      <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                        {blog.category}
                      </Badge>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>
                      <div className="flex items-center text-gray-500 text-xs">
                        <MessageSquare size={14} className="mr-1" />
                        <span>{blog.commentsCount}</span>
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
      </div>

      <BottomNavigation
        activeItem={activeNavItem as "home" | "forum" | "recipes" | "shop" | "profile"}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

export default BlogsPage;
