
import { useState, useEffect, createContext, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  profileImage?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfileImage: (imageUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'Pickcreations@gmail.com';
const ADMIN_PASSWORD = 'Admin123!';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const { toast } = useToast();
  const firebaseAuth = useFirebaseAuth();

  // Initialize authentication on app start
  useEffect(() => {
    const initializeAuth = () => {
      console.log("Initializing authentication...");
      
      // First check if Firebase auth is available
      if (firebaseAuth.isAuthenticated && firebaseAuth.user) {
        console.log("Firebase auth found, using Firebase user");
        setIsAuthenticated(true);
        setUser(firebaseAuth.user);
        setAuthInitialized(true);
        return;
      }

      // Check localStorage for existing auth
      const storedAuth = localStorage.getItem('isLoggedIn');
      const storedUser = localStorage.getItem('user');
      
      if (storedAuth === 'true' && storedUser) {
        console.log("Local auth found, restoring user session");
        try {
          const parsedUser = JSON.parse(storedUser);
          setIsAuthenticated(true);
          setUser(parsedUser);
          setAuthInitialized(true);
          return;
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('user');
        }
      }
      
      // Auto-login admin if no other authentication is present
      console.log("No existing auth found, auto-logging in admin");
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
      setAuthInitialized(true);
      
      console.log("Admin auto-login completed");
    };
    
    // Initialize auth immediately
    initializeAuth();
  }, [firebaseAuth.isAuthenticated, firebaseAuth.user]);

  const updateProfileImage = (imageUrl: string) => {
    if (user) {
      const updatedUser = { ...user, profileImage: imageUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const login = async (email: string, password: string) => {
    console.log("Login attempt with:", email);
    
    try {
      await firebaseAuth.login(email, password);
      console.log("Firebase login successful");
      return;
    } catch (error) {
      console.log("Firebase login failed, trying local login:", error);
    }

    // Local login fallback
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      console.log("Admin login successful");
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
      
      toast({
        title: "Admin Login Successful",
        description: "Welcome back, Admin!",
      });
      return;
    }
    
    // Allow any other credentials for demo purposes
    const regularUser = {
      id: 'user-' + Date.now(),
      name: email.split('@')[0],
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
    try {
      await firebaseAuth.signup(name, email, password);
      return;
    } catch (error) {
      console.log("Firebase signup failed, using local signup", error);
    }

    console.log("Local signup with:", name, email);
    
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
    try {
      firebaseAuth.logout();
    } catch (error) {
      console.log("Firebase logout error, proceeding with local logout", error);
    }

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    
    setIsAuthenticated(false);
    setUser(null);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  // Don't render children until auth is initialized
  if (!authInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      signup, 
      logout,
      updateProfileImage 
    }}>
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
