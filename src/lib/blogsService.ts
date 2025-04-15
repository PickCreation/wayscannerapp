
import { 
  doc, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  getDoc,
  setDoc,
  serverTimestamp,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase';

export interface BlogPost {
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
  createdAt?: any; // Add this property to fix the type error
}

export interface BlogComment {
  id: string;
  text: string;
  author: {
    name: string;
  };
  date: string;
  likes: number;
}

// Get all blog posts from Firestore
export const getAllBlogs = async () => {
  try {
    console.log('Getting all blogs');
    
    // First check localStorage for cached blogs
    const savedBlogs = localStorage.getItem('blogPosts');
    const localBlogs = savedBlogs ? JSON.parse(savedBlogs) : [];
    
    // If we're offline, return local blogs
    if (!navigator.onLine) {
      console.log('Offline mode, returning local blogs:', localBlogs.length);
      return localBlogs;
    }
    
    // Try to get from Firestore
    try {
      const blogsRef = collection(db, 'blogs');
      const q = query(blogsRef, orderBy('createdAt', 'desc'));
      const blogsSnapshot = await getDocs(q);
      
      const blogs: BlogPost[] = [];
      blogsSnapshot.forEach((doc) => {
        const blogData = doc.data();
        blogs.push({
          id: doc.id,
          title: blogData.title || '',
          excerpt: blogData.excerpt || '',
          content: blogData.content || '',
          category: blogData.category || '',
          image: blogData.image || '',
          author: blogData.author || {
            name: 'Unknown',
            avatar: '/placeholder.svg'
          },
          date: formatDate(blogData.createdAt?.toDate() || new Date()),
          readTime: blogData.readTime || '5 min read',
          commentsCount: blogData.commentsCount || 0
        });
      });
      
      console.log('Firebase blogs found:', blogs.length);
      
      // If we got blogs from Firebase, update localStorage
      if (blogs.length > 0) {
        localStorage.setItem('blogPosts', JSON.stringify(blogs));
        return blogs;
      }
      
      // If no Firebase blogs, check if we need to seed initial data
      if (localBlogs.length === 0) {
        // Import default blogs from the local constant and save them to Firebase
        const BLOGS = await getSeedBlogs();
        for (const blog of BLOGS) {
          await saveBlog(blog);
        }
        return BLOGS;
      }
      
      // Return local blogs if we have them
      return localBlogs;
    } catch (firestoreError) {
      console.error('Firestore getAll blogs error:', firestoreError);
      return localBlogs;
    }
  } catch (error) {
    console.error('Error getting all blogs:', error);
    
    // Return local blogs on error
    const savedBlogs = localStorage.getItem('blogPosts');
    return savedBlogs ? JSON.parse(savedBlogs) : [];
  }
};

// Get a single blog post by ID
export const getBlog = async (blogId: string) => {
  try {
    if (!blogId) {
      console.error('Invalid blogId provided');
      return null;
    }
    
    console.log('Getting blog:', blogId);
    
    // First check localStorage
    const savedBlogs = localStorage.getItem('blogPosts');
    const blogs = savedBlogs ? JSON.parse(savedBlogs) : [];
    const localBlog = blogs.find((b: BlogPost) => b.id === blogId);
    
    // If we're offline, return the local blog
    if (!navigator.onLine) {
      console.log('Offline mode, returning local blog:', localBlog);
      return localBlog || null;
    }
    
    // Try to get from Firestore
    try {
      const blogRef = doc(db, 'blogs', blogId);
      const blogDoc = await getDoc(blogRef);
      
      if (blogDoc.exists()) {
        const blogData = blogDoc.data();
        console.log('Firebase blog found:', blogData);
        
        const blog = {
          id: blogDoc.id,
          title: blogData.title || '',
          excerpt: blogData.excerpt || '',
          content: blogData.content || '',
          category: blogData.category || '',
          image: blogData.image || '',
          author: blogData.author || {
            name: 'Unknown',
            avatar: '/placeholder.svg'
          },
          date: formatDate(blogData.createdAt?.toDate() || new Date()),
          readTime: blogData.readTime || '5 min read',
          commentsCount: blogData.commentsCount || 0
        };
        
        // Update local storage with the latest data
        const updatedBlogs = blogs.map((b: BlogPost) => 
          b.id === blogId ? blog : b
        );
        
        if (!updatedBlogs.some((b: BlogPost) => b.id === blogId)) {
          updatedBlogs.push(blog);
        }
        
        localStorage.setItem('blogPosts', JSON.stringify(updatedBlogs));
        
        return blog;
      } else {
        console.log('Blog not found in Firebase, checking local');
        
        // If not in Firestore but we have a local version, return that
        if (localBlog) {
          console.log('Returning local blog:', localBlog);
          
          // Try to save the local blog to Firebase
          try {
            await saveBlog(localBlog);
            console.log('Local blog saved to Firebase');
          } catch (saveError) {
            console.error('Error saving local blog to Firebase:', saveError);
          }
        }
        
        return localBlog || null;
      }
    } catch (firestoreError) {
      console.error('Firestore get error:', firestoreError);
      
      // If Firestore fails, return local blog if available
      if (localBlog) {
        console.log('Firestore error, returning local blog:', localBlog);
        return localBlog;
      }
      
      return null;
    }
  } catch (error) {
    console.error('Error getting blog:', error);
    
    // If we have a local version, return that on error
    const savedBlogs = localStorage.getItem('blogPosts');
    const blogs = savedBlogs ? JSON.parse(savedBlogs) : [];
    const localBlog = blogs.find((b: BlogPost) => b.id === blogId);
    
    return localBlog || null;
  }
};

// Save a blog post to Firestore
export const saveBlog = async (blogData: BlogPost) => {
  try {
    if (!blogData || !blogData.id) {
      console.error('Invalid blog data provided', blogData);
      return null;
    }
    
    const blogId = blogData.id;
    console.log('Saving blog:', blogId, blogData);
    
    // Store blog in localStorage for offline access
    const savedBlogs = localStorage.getItem('blogPosts');
    let blogs = savedBlogs ? JSON.parse(savedBlogs) : [];
    
    const existingBlogIndex = blogs.findIndex((b: BlogPost) => b.id === blogId);
    if (existingBlogIndex >= 0) {
      blogs[existingBlogIndex] = blogData;
    } else {
      blogs.push(blogData);
    }
    
    localStorage.setItem('blogPosts', JSON.stringify(blogs));
    console.log('Blog saved to localStorage');
    
    // If we're offline, just keep it in localStorage
    if (!navigator.onLine) {
      console.log('Offline mode, blog only saved to localStorage');
      return blogData;
    }
    
    // Try to save to Firestore
    try {
      const blogRef = doc(db, 'blogs', blogId);
      await setDoc(blogRef, {
        ...blogData,
        updatedAt: serverTimestamp(),
        createdAt: blogData.createdAt || serverTimestamp()
      }, { merge: true });
      
      console.log('Blog saved to Firebase');
      return blogData;
    } catch (firestoreError) {
      console.error('Firestore save error:', firestoreError);
      // Still return the blog data since we saved to localStorage
      return blogData;
    }
  } catch (error) {
    console.error('Error saving blog:', error);
    return null;
  }
};

// Get all comments for a blog post
export const getBlogComments = async (blogId: string) => {
  try {
    if (!blogId) {
      console.error('Invalid blogId provided');
      return [];
    }
    
    console.log('Getting blog comments:', blogId);
    
    // First check localStorage
    const savedComments = localStorage.getItem(`blogComments-${blogId}`);
    const localComments = savedComments ? JSON.parse(savedComments) : [];
    
    // If we're offline, return local comments
    if (!navigator.onLine) {
      console.log('Offline mode, returning local comments:', localComments.length);
      return localComments;
    }
    
    // Try to get from Firestore
    try {
      const commentsRef = collection(db, 'blogs', blogId, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'desc'));
      const commentsSnapshot = await getDocs(q);
      
      const comments: BlogComment[] = [];
      commentsSnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          text: data.text || '',
          author: {
            name: data.author?.name || 'Anonymous',
          },
          date: formatDate(data.createdAt?.toDate() || new Date()),
          likes: data.likes || 0
        });
      });
      
      console.log('Firebase comments found:', comments.length);
      
      // Update localStorage with the latest data
      localStorage.setItem(`blogComments-${blogId}`, JSON.stringify(comments));
      
      return comments;
    } catch (firestoreError) {
      console.error('Firestore comments get error:', firestoreError);
      return localComments;
    }
  } catch (error) {
    console.error('Error getting blog comments:', error);
    
    // Return local comments on error
    const savedComments = localStorage.getItem(`blogComments-${blogId}`);
    return savedComments ? JSON.parse(savedComments) : [];
  }
};

// Add a comment to a blog post
export const addBlogComment = async (blogId: string, commentData: { text: string, author: { name: string }}) => {
  try {
    if (!blogId || !commentData) {
      console.error('Invalid blogId or commentData');
      return null;
    }
    
    console.log('Saving blog comment:', blogId, commentData);
    
    const newComment = {
      ...commentData,
      id: `c${Date.now()}`,
      date: formatDate(new Date()),
      likes: 0
    };
    
    // Store comment in localStorage for offline access
    const savedComments = localStorage.getItem(`blogComments-${blogId}`);
    let comments = savedComments ? JSON.parse(savedComments) : [];
    comments.unshift(newComment);
    localStorage.setItem(`blogComments-${blogId}`, JSON.stringify(comments));
    
    // Update blog comment count in localStorage
    const savedBlogs = localStorage.getItem('blogPosts');
    if (savedBlogs) {
      const blogs = JSON.parse(savedBlogs);
      const blogIndex = blogs.findIndex((b: BlogPost) => b.id === blogId);
      if (blogIndex >= 0) {
        blogs[blogIndex].commentsCount = (blogs[blogIndex].commentsCount || 0) + 1;
        localStorage.setItem('blogPosts', JSON.stringify(blogs));
      }
    }
    
    // If we're offline, just keep it in localStorage
    if (!navigator.onLine) {
      console.log('Offline mode, comment only saved to localStorage');
      return newComment;
    }
    
    // Try to save to Firestore
    try {
      const commentsRef = collection(db, 'blogs', blogId, 'comments');
      
      const commentDoc = await addDoc(commentsRef, {
        text: commentData.text,
        author: commentData.author,
        createdAt: serverTimestamp(),
        likes: 0
      });
      
      // Update blog document to increment comments count
      const blogRef = doc(db, 'blogs', blogId);
      const blogDoc = await getDoc(blogRef);
      
      if (blogDoc.exists()) {
        await updateDoc(blogRef, {
          commentsCount: (blogDoc.data().commentsCount || 0) + 1,
          updatedAt: serverTimestamp()
        });
      }
      
      console.log('Comment saved to Firebase with ID:', commentDoc.id);
      
      return {
        ...newComment,
        id: commentDoc.id
      };
    } catch (firestoreError) {
      console.error('Firestore comment save error:', firestoreError);
      // Still return the comment data since we saved to localStorage
      return newComment;
    }
  } catch (error) {
    console.error('Error saving blog comment:', error);
    return null;
  }
};

// Helper function to format dates
const formatDate = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

// Get seed blogs for initial data
const getSeedBlogs = async (): Promise<BlogPost[]> => {
  // These are the default blogs to be used when the database is empty
  return [
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
      commentsCount: 0,
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
      commentsCount: 0,
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
      commentsCount: 0,
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
      commentsCount: 0,
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
      commentsCount: 0,
    },
  ];
};
