import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share,
  MessageSquare,
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
import { 
  getBlog, 
  getBlogComments, 
  addBlogComment, 
  BlogPost, 
  BlogComment 
} from "@/lib/blogsService";

const BlogDetailPage = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isCameraSheetOpen, setIsCameraSheetOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("home");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;
      
      setIsLoading(true);
      try {
        const fetchedBlog = await getBlog(blogId);
        if (fetchedBlog) {
          setBlog(fetchedBlog);
          
          // Fetch comments for this blog
          const fetchedComments = await getBlogComments(blogId);
          setComments(fetchedComments);
          
          setNewComment("");
          setCopied(false);
        } else {
          toast({
            title: "Blog not found",
            description: "The requested blog post could not be found.",
            variant: "destructive",
          });
          navigate("/blogs");
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast({
          title: "Error",
          description: "Failed to load blog. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
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

  const handleSubmitComment = async () => {
    if (!blogId) return;
    
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
    
    try {
      const commentData = {
        text: newComment,
        author: {
          name: commenterName,
        }
      };
      
      const savedComment = await addBlogComment(blogId, commentData);
      
      if (savedComment) {
        // Add the new comment to the comments array
        setComments([savedComment, ...comments]);
        
        // Update local blog object with increased comment count
        if (blog) {
          setBlog({
            ...blog,
            commentsCount: blog.commentsCount + 1,
          });
        }
      }
      
      setNewComment("");
      setCommenterName("");
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-wayscanner-blue"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Blog not found</p>
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
        <p className="text-xs opacity-90 mb-4">{blog.date} • {blog.readTime}</p>
        
        <div className="relative mb-6">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-64 object-cover rounded-lg shadow-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
              target.onerror = null;
            }}
          />
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
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
