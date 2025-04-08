import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share,
  MessageSquare,
  Heart,
  Copy,
  Facebook,
  Check,
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

interface Comment {
  id: string;
  text: string;
  author: {
    name: string;
  };
  date: string;
  likes: number;
}

const BLOGS: BlogPost[] = [
  {
    id: "1",
    title: "10 Ways to Reduce Your Carbon Footprint at Home",
    excerpt: "Simple daily habits that can make a huge difference for our planet.",
    content: `Climate change is accelerating at an unprecedented rate, and our daily choices have a significant impact on the environment. In this article, we'll explore ten practical ways to reduce your carbon footprint without drastically changing your lifestyle.

## 1. Switch to LED Light Bulbs

LED bulbs use up to 90% less energy than traditional incandescent bulbs and last much longer. This simple swap can significantly reduce your electricity consumption and save you money in the long run.

## 2. Conserve Water

Fix leaky faucets, take shorter showers, and install low-flow fixtures. Water treatment facilities use a lot of energy to purify and deliver water to your home, so reducing water usage also reduces your carbon footprint.

## 3. Reduce, Reuse, Recycle

Practice the three Rs in order of importance. First, reduce your consumption; second, reuse items when possible; and finally, recycle materials properly. Remember that recycling still requires energy, so it's best to minimize waste from the start.

## 4. Use Energy-Efficient Appliances

When it's time to replace appliances, look for Energy Star certified models, which use significantly less energy than standard appliances.

## 5. Eat Less Meat

The meat industry is a major contributor to greenhouse gas emissions. Consider implementing meatless Mondays or generally reducing your meat consumption, especially beef.

## 6. Compost Food Waste

Instead of sending food scraps to landfills where they produce methane, compost them to create nutrient-rich soil for your garden.

## 7. Unplug Electronics When Not in Use

Many electronics continue to draw power even when turned off. This "phantom energy" can account for up to 10% of your home's energy usage.

## 8. Use Cold Water for Laundry

About 90% of the energy used by washing machines goes to heating water. Washing clothes in cold water is just as effective for most loads and saves significant energy.

## 9. Drive Less

Walk, bike, or use public transportation when possible. If you need to drive, combine errands to reduce trips.

## 10. Support Renewable Energy

Consider installing solar panels or switching to a utility provider that offers renewable energy options.

By implementing these changes, you can significantly reduce your carbon footprint while often saving money and living a healthier lifestyle. Remember that small actions, when multiplied by millions of people, can make a substantial difference in the fight against climate change.`,
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

const SAMPLE_COMMENTS: Record<string, Comment[]> = {
  "1": [
    {
      id: "c1",
      text: "Great article! I've implemented several of these tips and have noticed a real difference in my energy bill.",
      author: {
        name: "Michael Brown",
      },
      date: "Apr 3, 2025",
      likes: 7,
    },
    {
      id: "c2",
      text: "I'd like to add that hanging your clothes to dry instead of using a dryer is another great way to reduce your carbon footprint!",
      author: {
        name: "Sarah Lee",
      },
      date: "Apr 3, 2025",
      likes: 4,
    },
    {
      id: "c3",
      text: "The tip about unplugging electronics was a game-changer for me. I had no idea they still used power when turned off!",
      author: {
        name: "David Wright",
      },
      date: "Apr 4, 2025",
      likes: 2,
    },
  ],
  "2": [
    {
      id: "c1",
      text: "I've been using a counter-top compost bin for 6 months now and it's fantastic! No smell if you manage it properly.",
      author: {
        name: "Taylor Kim",
      },
      date: "Mar 29, 2025",
      likes: 9,
    },
  ],
};

const BlogDetailPage = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { isAuthenticated, user } = useAuth();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isCameraSheetOpen, setIsCameraSheetOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("home");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const foundBlog = BLOGS.find((b) => b.id === blogId);
    if (foundBlog) {
      setBlog(foundBlog);
      
      const blogComments = SAMPLE_COMMENTS[blogId || ""] || [];
      setComments(blogComments);
      
      setNewComment("");
      setCopied(false);
      setIsLiked(false);
    } else {
      toast({
        title: "Blog not found",
        description: "The requested blog post could not be found.",
        variant: "destructive",
      });
      navigate("/blogs");
    }
  }, [blogId, navigate, toast]);

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

  const handleShareClick = () => {
    setIsShareDialogOpen(true);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    
    toast({
      title: "Link copied",
      description: "Blog post link copied to clipboard",
    });
  };

  const handleShareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    setIsShareDialogOpen(false);
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }
    
    if (!commenterName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    
    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      text: newComment,
      author: {
        name: commenterName,
      },
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      likes: 0,
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment("");
    setCommenterName("");
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully",
    });
    
    if (blog) {
      setBlog({
        ...blog,
        commentsCount: blog.commentsCount + 1,
      });
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    
    toast({
      title: isLiked ? "Article unliked" : "Article liked",
      description: isLiked 
        ? "You have removed your like from this article" 
        : "You have liked this article",
    });
  };

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-wayscanner-blue text-white p-4">
        <div className="flex justify-between items-center">
          <button className="p-2" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold line-clamp-1">Article</h1>
          <div className="w-8"></div>
        </div>
      </div>

      <div className="px-4 py-4">
        <Badge className="mb-2 bg-blue-500 text-white">
          {blog.category}
        </Badge>
        <h1 className="text-2xl font-bold mb-2">{blog.title}</h1>
        <div className="flex items-center mb-4">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={blog.author.avatar} />
            <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-medium">{blog.author.name}</p>
            <p className="text-xs opacity-90">{blog.date} • {blog.readTime}</p>
          </div>
        </div>
        
        <div className="relative mb-6">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
              onClick={toggleLike}
            >
              <Heart size={16} className={isLiked ? 'fill-red-500' : ''} />
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 text-gray-600"
              onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <MessageSquare size={16} />
              <span>{comments.length} Comments</span>
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-gray-600"
            onClick={handleShareClick}
          >
            <Share size={16} />
            <span>Share</span>
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        <div className="prose max-w-none">
          {blog.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{paragraph.substring(3)}</h2>;
            } else {
              return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>;
            }
          })}
        </div>
        
        <Separator className="my-6" />
        
        <div id="comments-section" className="mt-6">
          <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
          
          <div className="mb-6">
            <Input
              placeholder="Your name"
              value={commenterName}
              onChange={(e) => setCommenterName(e.target.value)}
              className="w-full p-3 border rounded-lg mb-2"
            />
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 border rounded-lg resize-none mb-2"
              rows={3}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || !commenterName.trim()}
                className="bg-wayscanner-blue hover:bg-blue-700"
              >
                Post Comment
              </Button>
            </div>
          </div>
          
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-medium">{comment.author.name}</p>
                        <p className="text-xs text-gray-500">{comment.date}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <MessageSquare className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p className="text-gray-500">No comments yet</p>
              <p className="text-sm text-gray-400">Be the first to share your thoughts</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this article</DialogTitle>
            <DialogDescription>
              Share this article with your friends and colleagues
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 justify-start"
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  <span>Copy link</span>
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 justify-start text-blue-600"
              onClick={handleShareOnFacebook}
            >
              <Facebook className="h-5 w-5" />
              <span>Share on Facebook</span>
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button 
              variant="secondary" 
              onClick={() => setIsShareDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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

export default BlogDetailPage;
