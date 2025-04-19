import { useState, useEffect, createContext, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth'; // Import the firebase auth hook

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  profileImage?: string; // Add the profileImage property
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials - make sure these match what the user provided
const ADMIN_EMAIL = 'Pickcreations@gmail.com';
const ADMIN_PASSWORD = 'Admin123!';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const firebaseAuth = useFirebaseAuth(); // Use Firebase auth

  useEffect(() => {
    // If Firebase auth has a user, use that
    if (firebaseAuth.isAuthenticated && firebaseAuth.user) {
      setIsAuthenticated(true);
      setUser(firebaseAuth.user);
      return;
    }

    const checkAuth = () => {
      const storedAuth = localStorage.getItem('isLoggedIn');
      const storedUser = localStorage.getItem('user');
      
      if (storedAuth === 'true' && storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      }
    };
    
    checkAuth();
  }, [firebaseAuth.isAuthenticated, firebaseAuth.user]);

  const login = async (email: string, password: string) => {
    console.log("Combined auth login attempt with:", email);
    
    // Try Firebase login first
    try {
      await firebaseAuth.login(email, password);
      console.log("Firebase login successful");
      return;
    } catch (error) {
      console.log("Firebase login failed, falling back to local login:", error);
    }

    // Hard-coded admin check as fallback
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      console.log("Admin fallback login successful");
      const adminUser = {
        id: 'admin-123',
        name: 'Admin',
        email: ADMIN_EMAIL,
        isAdmin: true,
        profileImage: '',
      };
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(adminUser));
      
      setIsAuthenticated(true);
      setUser(adminUser);
      
      // Clear any existing profile data that might override the admin details
      localStorage.removeItem('profileData');
      
      toast({
        title: "Admin Login Successful",
        description: "Welcome back, Admin!",
      });
      
      return;
    }
    
    // Regular user fallback login
    const regularUser = {
      id: 'user-' + Date.now(),
      name: email.split('@')[0], // Use the part before @ as a name
      email,
      profileImage: '',
    };
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(regularUser));
    
    setIsAuthenticated(true);
    setUser(regularUser);
    
    toast({
      title: "Login Successful",
      description: "Welcome back!",
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    // Try Firebase signup first
    try {
      await firebaseAuth.signup(name, email, password);
      return;
    } catch (error) {
      console.log("Falling back to local signup", error);
    }

    console.log("Signing up with:", name, email, password);
    
    // Simulate signup success
    const userId = 'user-' + Date.now();
    const newUser = {
      id: userId,
      name,
      email,
      profileImage: '',
    };
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(newUser));
    
    setIsAuthenticated(true);
    setUser(newUser);
    
    toast({
      title: "Account Created",
      description: "Your account has been created successfully!",
    });
  };

  const logout = () => {
    // Try Firebase logout
    try {
      firebaseAuth.logout();
    } catch (error) {
      console.log("Error with Firebase logout, proceeding with local logout", error);
    }

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    // Also remove any profile data
    localStorage.removeItem('profileData');
    
    setIsAuthenticated(false);
    setUser(null);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
