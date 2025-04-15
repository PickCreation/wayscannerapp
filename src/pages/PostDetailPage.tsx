
import React, { useState, useEffect } from "react";
import { ChevronLeft, Heart, Bookmark, Send, Bell, User, LogIn, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import CameraSheet from "@/components/CameraSheet";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { likePost, addBookmark, removeBookmark, addComment, getComments } from "@/lib/firebaseService";

const PostDetailPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { toast } = useToast();
  const { isAuthenticated } = useFirebaseAuth();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  useEffect(() => {
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
    
    const fetchPostData = async () => {
      const postId = params.postId;
      console.log("Loading post with ID:", postId);
      
      if (!postId) {
        setLoading(false);
        return;
      }
      
      try {
        // Try to get the post from Firestore
        const postRef = doc(db, 'posts', postId);
        const postSnapshot = await getDoc(postRef);
        
        if (postSnapshot.exists()) {
          const postData = postSnapshot.data();
          
          // Get author info
          let authorData = { name: 'Unknown User', avatar: '/placeholder.svg' };
          try {
            const authorRef = doc(db, 'users', postData.authorId);
            const authorDoc = await getDoc(authorRef);
            if (authorDoc.exists()) {
              const userData = authorDoc.data();
              authorData = {
                name: userData.name || 'User',
                avatar: userData.photoURL || '/placeholder.svg'
              };
            }
          } catch (error) {
            console.error('Error fetching author data:', error);
          }
          
          // Check post likes
          let likes = 0;
          let liked = false;
          
          const likesRef = collection(db, 'posts', postId, 'userLikes');
          const likesQuery = query(likesRef);
          const likesSnapshot = await getDocs(likesQuery);
          likes = likesSnapshot.size;
          
          // Check if current user has liked the post
          if (isAuthenticated) {
            const user = await import('@/lib/firebase').then(module => module.auth.currentUser);
            if (user) {
              const userLikesRef = doc(db, 'posts', postId, 'userLikes', user.uid);
              const userLikeDoc = await getDoc(userLikesRef);
              liked = userLikeDoc.exists();
            }
          }
          
          // Check if post is bookmarked
          let bookmarked = false;
          if (isAuthenticated) {
            const user = await import('@/lib/firebase').then(module => module.auth.currentUser);
            if (user) {
              const userBookmarksRef = doc(db, 'posts', postId, 'userBookmarks', user.uid);
              const userBookmarkDoc = await getDoc(userBookmarksRef);
              bookmarked = userBookmarkDoc.exists();
            }
          }
          
          // Count comments
          const commentsRef = collection(db, 'posts', postId, 'comments');
          const commentsQuery = query(commentsRef);
          const commentsSnapshot = await getDocs(commentsQuery);
          const commentsCount = commentsSnapshot.size;
          
          // Get comments
          const fetchedComments = await getComments(postId);
          setComments(fetchedComments);
          
          // Format date
          const timeAgo = postData.createdAt ? formatTimeAgo(postData.createdAt.toDate()) : '';
          
          // Set post data
          setPost({
            id: postId,
            author: authorData,
            timeAgo,
            category: postData.category || 'General',
            content: postData.content || '',
            imageUrl: postData.imageUrl || null,
            likes,
            comments: commentsCount,
            liked,
            bookmarked
          });
        } else {
          // If not found in Firestore, try localStorage
          const savedPosts = localStorage.getItem('forumPosts');
          if (savedPosts) {
            const allPosts = JSON.parse(savedPosts);
            const foundPost = allPosts.find((p: any) => p.id === postId);
            
            if (foundPost) {
              setPost(foundPost);
              if (!foundPost.comments || !Array.isArray(foundPost.comments)) {
                foundPost.comments = [];
              }
              setComments(foundPost.comments);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: "Failed to load post. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostData();
  }, [params.postId, toast, isAuthenticated]);
  
  const handleLikePost = async () => {
    if (!post) return;
    
    if (!isAuthenticated) {
      navigate("/profile");
      return;
    }
    
    try {
      const result = await likePost(post.id, post.liked);
      
      setPost(prev => ({
        ...prev,
        likes: result.likes,
        liked: result.liked
      }));
      
      if (!post.liked) {
        toast({
          title: "Post liked",
          description: "The author has been notified",
        });
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleBookmarkPost = async () => {
    if (!post) return;
    
    if (!isAuthenticated) {
      navigate("/profile");
      return;
    }
    
    try {
      if (post.bookmarked) {
        await removeBookmark(post.id, 'forum');
      } else {
        await addBookmark(post, 'forum');
      }
      
      setPost(prev => ({
        ...prev,
        bookmarked: !prev.bookmarked
      }));
      
      toast({
        title: post.bookmarked ? "Bookmark removed" : "Post bookmarked",
        description: post.bookmarked ? "Removed from your bookmarks" : "Saved to your bookmarks",
      });
    } catch (error) {
      console.error("Error bookmarking post:", error);
      toast({
        title: "Error",
        description: "Failed to bookmark post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !post) return;
    
    if (!isAuthenticated) {
      navigate("/profile");
      return;
    }

    setSubmittingComment(true);
    
    try {
      const newCommentObj = await addComment(post.id, newComment.trim());
      
      setComments([...comments, newCommentObj]);
      setPost({
        ...post,
        comments: post.comments + 1
      });
      
      setNewComment("");
      
      toast({
        title: "Comment posted",
        description: "The author has been notified",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };
  
  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-wayscanner-blue" />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h2 className="text-xl font-semibold mb-2">Post Not Found</h2>
        <p className="text-gray-500 mb-4">The post you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/forum')} type="button">
          Back to Forum
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 mr-2" type="button">
            <ChevronLeft size={24} color="white" />
          </button>
          <h1 className="text-xl font-bold">Forum</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2" type="button">
            <Bell size={24} fill="white" strokeWidth={1.5} />
          </button>
          <button className="p-2" onClick={handleProfileClick} type="button">
            <User size={24} fill="white" strokeWidth={1.5} />
          </button>
        </div>
      </header>
      
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-100">
          <div className="flex items-center mb-3">
            <Avatar className="h-12 w-12 mr-3">
              <AvatarImage src={post?.author?.avatar} alt={post?.author?.name} />
              <AvatarFallback>
                {post?.author?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg text-gray-800">{post?.author?.name}</h3>
              <div className="flex items-center">
                <span className="text-gray-500 text-sm">{post?.timeAgo}</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-xs ${
                  post?.category === "Plants" ? "bg-green-100 text-green-700" : 
                  post?.category?.includes("Food") || post?.category?.includes("Recipe") || post?.category?.includes("Cooking") || post?.category?.includes("Kitchen") || post?.category?.includes("Nutrition") ? "bg-red-100 text-red-700" : 
                  post?.category?.includes("Animals") || post?.category?.includes("Pets") ? "bg-yellow-100 text-yellow-700" :
                  post?.category === "Travel" ? "bg-purple-100 text-purple-700" :
                  post?.category?.includes("DIY") || post?.category?.includes("Home") || post?.category?.includes("Decor") ? "bg-orange-100 text-orange-700" :
                  post?.category?.includes("Question") ? "bg-blue-100 text-blue-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {post?.category}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{post?.content}</p>
          
          {post?.imageUrl && (
            <div className="mb-4 border rounded-lg overflow-hidden">
              <img src={post.imageUrl} alt="Post" className="w-full h-auto" />
            </div>
          )}
          
          <div className="flex items-center border-t border-gray-100 pt-3">
            <button 
              className="flex items-center mr-5"
              onClick={handleLikePost}
              type="button"
            >
              <Heart 
                size={22} 
                className={post?.liked ? "fill-red-500 text-red-500" : "text-black"}
              />
              <span className="ml-1 text-gray-600">{post?.likes}</span>
            </button>
            <button 
              className="flex items-center mr-5"
              type="button"
            >
              <div className="text-blue-600 font-medium">
                {post?.comments} Comments
              </div>
            </button>
            <button 
              className="flex items-center ml-auto"
              onClick={handleBookmarkPost}
              type="button"
            >
              <Bookmark 
                size={22} 
                className={post?.bookmarked ? "fill-wayscanner-blue text-wayscanner-blue" : "text-black"}
              />
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <h4 className="font-medium text-lg mb-4">Comments</h4>
          
          <div className="space-y-4 mb-4">
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className="flex">
                  <Avatar className="h-10 w-10 mr-3 mt-1">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>
                      {comment.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{comment.author.name}</span>
                        <span className="text-gray-500 text-xs">{comment.timeAgo}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
          
          {isAuthenticated ? (
            <div className="flex space-x-2">
              <Input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1"
              />
              <Button 
                onClick={handleSubmitComment} 
                size="icon" 
                type="button"
                disabled={submittingComment}
              >
                {submittingComment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-2">
              <Button onClick={handleProfileClick} className="gap-2" type="button">
                Login to comment
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />
      
      <BottomNavigation
        activeItem="forum"
        onItemClick={(item) => {
          if (item === "forum") {
            navigate("/forum");
            return;
          }
          if (item === "home") {
            navigate("/");
            return;
          }
          
          toast({
            title: "Coming Soon",
            description: `The ${item} feature is under development.`,
          });
        }}
        onCameraClick={handleCameraClick}
      />
    </div>
  );
};

// Helper function for formatting time
const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
};

export default PostDetailPage;
